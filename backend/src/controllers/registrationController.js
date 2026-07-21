import path from 'path';
import { createObjectCsvWriter } from 'csv-writer';
import Event from '../models/Event.js';
import Registration from '../models/Registration.js';
import { generateQRCodeDataUrl } from '../utils/qrcode.js';
import { sendEmail } from '../utils/email.js';
import { emitRegistrationCount } from '../services/socket.js';
import { createNotification } from './notificationController.js';

export const registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event || event.status !== 'approved') {
      return res.status(400).json({ message: 'Event not available' });
    }

    const existingRegistration = await Registration.findOne({
      user: req.user.id,
      event: event._id,
    });

    if (
      existingRegistration &&
      ['registered', 'waitlisted', 'attended'].includes(existingRegistration.status)
    ) {
      return res.status(400).json({
        message: 'Already registered or waitlisted',
      });
    }

    const capacity = Number(event.capacity || 0);
    const registeredCount = Number(event.registeredCount || 0);
    const isFull = capacity > 0 && registeredCount >= capacity;
    const status = isFull ? 'waitlisted' : 'registered';

    const payload = JSON.stringify({
      userId: req.user.id,
      eventId: event._id,
      at: Date.now(),
    });
    const qrCodeDataUrl = await generateQRCodeDataUrl(payload);

    let registration;

    if (existingRegistration && existingRegistration.status === 'cancelled') {
      existingRegistration.status = status;
      existingRegistration.qrCodeDataUrl = qrCodeDataUrl;
      registration = await existingRegistration.save();
    } else {
      registration = await Registration.create({
        user: req.user.id,
        event: event._id,
        qrCodeDataUrl,
        status,
      });
    }

    if (status === 'registered' && (!existingRegistration || existingRegistration.status !== 'cancelled')) {
      const updatedEvent = await Event.findByIdAndUpdate(
        event._id,
        { $inc: { registeredCount: 1 } },
        { new: true }
      );
      emitRegistrationCount(updatedEvent._id, updatedEvent.registeredCount);
    }

    try {
      await sendEmail({
        to: req.user.email,
        subject: `Registered: ${event.title}`,
        html: `<p>You are registered for ${event.title}.</p>`,
      });
    } catch (_) {}

    try {
      await createNotification(
        req.user.id,
        'registration_confirmed',
        status === 'registered'
          ? `Your registration for ${event.title} is confirmed`
          : `You have been added to the waitlist for ${event.title}`,
        `/events/${event._id}`
      );
    } catch (notifErr) {
      console.error('Failed to create notification:', notifErr);
    }

    res.status(201).json({
      registration,
      message:
        status === 'registered'
          ? 'Successfully registered'
          : 'You have been added to the waitlist',
    });
  } catch (err) {
    console.error('ERROR:', err);
    res.status(500).json({ message: err.message });
  }
};

export const myRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('event');

    res.json({ registrations });
  } catch (err) {
    console.error('ERROR:', err);
    res.status(500).json({ message: err.message });
  }
};

export const participantsForEvent = async (req, res) => {
  try {
    const registrations = await Registration.find({ event: req.params.id }).populate('user', 'name email');

    res.json({ participants: registrations });
  } catch (err) {
    console.error('ERROR:', err);
    res.status(500).json({ message: err.message });
  }
};

export const checkInParticipant = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: user not authenticated' });
    }

    if (!req.body || !req.body.userId) {
      return res.status(400).json({ message: 'Bad Request: userId is required' });
    }

    const validStatuses = ['attended', 'cancelled', 'no-show'];
    const status = (req.body.status || 'attended').toString().trim().toLowerCase();

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const registration = await Registration.findOneAndUpdate(
      { event: req.params.id, user: req.body.userId },
      { status },
      { new: true }
    );

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found for this user and event' });
    }

    return res.json({ message: 'Check-in updated', registration });
  } catch (err) {
    console.error('[checkInParticipant] Error:', err);
    return res.status(500).json({ message: err.message });
  }
};

export const exportParticipantsCsv = async (req, res) => {
  try {
    const registrations = await Registration.find({ event: req.params.id }).populate('user', 'name email');
    const rows = registrations.map((registration) => ({
      name: registration.user?.name || '',
      email: registration.user?.email || '',
      status: registration.status,
      registeredAt: registration.createdAt,
    }));

    const filePath = path.join(process.cwd(), `participants-${req.params.id}.csv`);
    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: [
        { id: 'name', title: 'Name' },
        { id: 'email', title: 'Email' },
        { id: 'status', title: 'Status' },
        { id: 'registeredAt', title: 'Registered At' },
      ],
    });

    await csvWriter.writeRecords(rows);
    res.download(filePath);
  } catch (err) {
    console.error('ERROR:', err);
    res.status(500).json({ message: err.message });
  }
};

export const checkRegistrationStatus = async (req, res) => {
  try {
    const registration = await Registration.findOne({
      user: req.user.id,
      event: req.params.id,
    });

    res.json({
      isRegistered: registration?.status === 'registered',
      isWaitlisted: registration?.status === 'waitlisted',
      registration,
      event: req.params.id,
    });
  } catch (err) {
    console.error('ERROR:', err);
    res.status(500).json({ message: err.message });
  }
};

export const promoteFromWaitlist = async (eventId) => {
  const nextRegistration = await Registration.findOne({
    event: eventId,
    status: 'waitlisted',
  })
    .sort({ createdAt: 1 })
    .populate('user')
    .populate('event');

  if (!nextRegistration) {
    return;
  }

  const payload = JSON.stringify({
    userId: nextRegistration.user._id,
    eventId: nextRegistration.event._id,
    at: Date.now(),
  });

  const qrCodeDataUrl = await generateQRCodeDataUrl(payload);

  nextRegistration.status = 'registered';
  nextRegistration.qrCodeDataUrl = qrCodeDataUrl;
  await nextRegistration.save();

  const updatedEvent = await Event.findByIdAndUpdate(
    eventId,
    { $inc: { registeredCount: 1 } },
    { new: true }
  );

  emitRegistrationCount(updatedEvent._id, updatedEvent.registeredCount);

  try {
    await sendEmail({
      to: nextRegistration.user.email,
      subject: `Spot Confirmed: ${nextRegistration.event.title}`,
      html: `
        <p>You have been promoted from the waitlist.</p>
        <p>Your registration for ${nextRegistration.event.title} is now confirmed.</p>
      `,
    });
  } catch (_) {}

  try {
    await createNotification(
      nextRegistration.user._id,
      'waitlist_promoted',
      `Good news! A spot opened up for ${nextRegistration.event.title}`,
      `/events/${nextRegistration.event._id}`
    );
  } catch (notifErr) {
    console.error('Failed to create waitlist notification:', notifErr);
  }
};

export const cancelRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const registration = await Registration.findById(id).populate('event');

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    if (registration.user.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (registration.status === 'cancelled') {
      return res.status(400).json({ message: 'Already cancelled' });
    }

    const eventDate = new Date(registration.event.date);
    if (eventDate < new Date()) {
      return res.status(400).json({ message: 'Cannot cancel past events' });
    }

    registration.status = 'cancelled';
    await registration.save();

    if (registration.status === 'registered') {
      await Event.findByIdAndUpdate(registration.event._id, { $inc: { registeredCount: -1 } });
    }

    res.status(200).json({ message: 'Registration cancelled successfully', registration });
  } catch (error) {
    console.error('ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};
