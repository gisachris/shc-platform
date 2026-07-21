import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'EventOne API',
      version: '1.0.0',
      description: 'API documentation for the Smart Hybrid Conference Management Platform, aligned to the current backend implementation and the research proposal scope.',
    },
    servers: [
      {
        url: 'http://localhost:5050',
        description: 'Local backend',
      },
      {
        url: 'https://shc-platform.onrender.com',
        description: 'Production backend',
      },
    ],
    tags: [
      { name: 'Authentication', description: 'User sign-up, sign-in, profile and token-based session management.' },
      { name: 'Events', description: 'Event discovery, creation, updates, reminders and co-organizer management.' },
      { name: 'Registrations', description: 'Event registration, participant lists, attendance check-in and cancellation.' },
      { name: 'Reviews', description: 'User feedback and event review management.' },
      { name: 'Notifications', description: 'Real-time and in-app notification management.' },
      { name: 'Stats', description: 'Dashboard metrics, recommendations and trending data.' },
      { name: 'Admin', description: 'Administrative moderation and platform management tools.' },
      { name: 'Users', description: 'Customer-specific actions such as saved events.' },
      { name: 'Planned', description: 'Features described in the proposal that are not yet fully implemented in the backend.' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

const implementedPaths = {
  '/api/health': {
    get: {
      tags: ['Authentication'],
      summary: 'Server health check',
      description: 'Confirms the backend is running.',
      responses: { 200: { description: 'Server is healthy.' } },
      'x-implementation-status': 'implemented',
    },
  },
  '/api/auth/signup': {
    post: {
      tags: ['Authentication'],
      summary: 'Register a new user',
      description: 'Creates a new user account and returns a JWT.',
      requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string' }, email: { type: 'string' }, password: { type: 'string' }, role: { type: 'string', enum: ['attendee', 'organizer', 'admin'] } } } } } },
      responses: { 201: { description: 'User created.' }, 400: { description: 'Invalid request.' } },
      'x-implementation-status': 'implemented',
    },
  },
  '/api/auth/login': {
    post: {
      tags: ['Authentication'],
      summary: 'Login as an existing user',
      description: 'Authenticates a user and returns a JWT token.',
      requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { email: { type: 'string' }, password: { type: 'string' } } } } } },
      responses: { 200: { description: 'Login successful.' }, 400: { description: 'Invalid credentials.' } },
      'x-implementation-status': 'implemented',
    },
  },
  '/api/auth/me': {
    get: {
      tags: ['Authentication'],
      summary: 'Get the current user profile',
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: 'Current user returned.' }, 401: { description: 'Authentication required.' } },
      'x-implementation-status': 'implemented',
    },
  },
  '/api/auth/profile': {
    put: {
      tags: ['Authentication'],
      summary: 'Update the current user profile',
      security: [{ bearerAuth: [] }],
      requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string' }, email: { type: 'string' }, phoneNumber: { type: 'string' }, avatarUrl: { type: 'string' } } } } } },
      responses: { 200: { description: 'Profile updated.' }, 401: { description: 'Authentication required.' } },
      'x-implementation-status': 'implemented',
    },
  },
  '/api/events': {
    get: {
      tags: ['Events'],
      summary: 'List events',
      description: 'Returns the public event list, commonly filtered by approval state in the frontend.',
      responses: { 200: { description: 'Events returned.' } },
      'x-implementation-status': 'implemented',
    },
    post: {
      tags: ['Events'],
      summary: 'Create an event',
      security: [{ bearerAuth: [] }],
      description: 'Creates an event with an optional poster upload.',
      responses: { 201: { description: 'Event created.' }, 401: { description: 'Authentication required.' } },
      'x-implementation-status': 'implemented',
    },
  },
  '/api/events/tags/popular': {
    get: {
      tags: ['Events'],
      summary: 'Get popular event tags',
      responses: { 200: { description: 'Popular tags returned.' } },
      'x-implementation-status': 'implemented',
    },
  },
  '/api/events/{id}': {
    get: {
      tags: ['Events'],
      summary: 'Get event details',
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'Event details returned.' }, 404: { description: 'Event not found.' } },
      'x-implementation-status': 'implemented',
    },
    put: {
      tags: ['Events'],
      summary: 'Update an event',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'Event updated.' }, 401: { description: 'Authentication required.' } },
      'x-implementation-status': 'implemented',
    },
    delete: {
      tags: ['Events'],
      summary: 'Delete an event',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'Event deleted.' }, 401: { description: 'Authentication required.' } },
      'x-implementation-status': 'implemented',
    },
  },
  '/api/events/{id}/remind': {
    post: {
      tags: ['Events'],
      summary: 'Send reminders for an event',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'Reminder sent.' }, 401: { description: 'Authentication required.' } },
      'x-implementation-status': 'implemented',
    },
  },
  '/api/events/{id}/co-organizers': {
    post: {
      tags: ['Events'],
      summary: 'Add a co-organizer to an event',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'Co-organizer added.' }, 401: { description: 'Authentication required.' } },
      'x-implementation-status': 'implemented',
    },
  },
  '/api/events/{id}/co-organizers/{userId}': {
    delete: {
      tags: ['Events'],
      summary: 'Remove a co-organizer from an event',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        { name: 'userId', in: 'path', required: true, schema: { type: 'string' } },
      ],
      responses: { 200: { description: 'Co-organizer removed.' }, 401: { description: 'Authentication required.' } },
      'x-implementation-status': 'implemented',
    },
  },
  '/api/registrations/{id}/register': {
    post: {
      tags: ['Registrations'],
      summary: 'Register for an event',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'Registration created.' }, 401: { description: 'Authentication required.' } },
      'x-implementation-status': 'implemented',
    },
  },
  '/api/registrations/me': {
    get: {
      tags: ['Registrations'],
      summary: 'Get the current user registrations',
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: 'Registrations returned.' }, 401: { description: 'Authentication required.' } },
      'x-implementation-status': 'implemented',
    },
  },
  '/api/registrations/{id}/status': {
    get: {
      tags: ['Registrations'],
      summary: 'Check current registration status',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'Registration status returned.' }, 401: { description: 'Authentication required.' } },
      'x-implementation-status': 'implemented',
    },
  },
  '/api/registrations/{id}/participants': {
    get: {
      tags: ['Registrations'],
      summary: 'List participants for an event',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'Participants returned.' }, 401: { description: 'Authentication required.' } },
      'x-implementation-status': 'implemented',
    },
  },
  '/api/registrations/{id}/checkin': {
    post: {
      tags: ['Registrations'],
      summary: 'Check in a participant',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'Check-in completed.' }, 401: { description: 'Authentication required.' } },
      'x-implementation-status': 'implemented',
    },
  },
  '/api/registrations/{id}/participants.csv': {
    get: {
      tags: ['Registrations'],
      summary: 'Export event participants as CSV',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'CSV download returned.' }, 401: { description: 'Authentication required.' } },
      'x-implementation-status': 'implemented',
    },
  },
  '/api/registrations/{id}/cancel': {
    delete: {
      tags: ['Registrations'],
      summary: 'Cancel a registration',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'Registration cancelled.' }, 401: { description: 'Authentication required.' } },
      'x-implementation-status': 'implemented',
    },
  },
  '/api/reviews/{id}': {
    get: {
      tags: ['Reviews'],
      summary: 'Get reviews for an event',
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'Reviews returned.' } },
      'x-implementation-status': 'implemented',
    },
    post: {
      tags: ['Reviews'],
      summary: 'Add a review for an event',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'Review created.' }, 401: { description: 'Authentication required.' } },
      'x-implementation-status': 'implemented',
    },
  },
  '/api/notifications': {
    get: {
      tags: ['Notifications'],
      summary: 'Get user notifications',
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: 'Notifications returned.' }, 401: { description: 'Authentication required.' } },
      'x-implementation-status': 'implemented',
    },
  },
  '/api/notifications/unread-count': {
    get: {
      tags: ['Notifications'],
      summary: 'Get unread notification count',
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: 'Unread count returned.' }, 401: { description: 'Authentication required.' } },
      'x-implementation-status': 'implemented',
    },
  },
  '/api/notifications/read-all': {
    patch: {
      tags: ['Notifications'],
      summary: 'Mark all notifications as read',
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: 'Notifications marked as read.' }, 401: { description: 'Authentication required.' } },
      'x-implementation-status': 'implemented',
    },
  },
  '/api/notifications/{id}/read': {
    patch: {
      tags: ['Notifications'],
      summary: 'Mark a notification as read',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'Notification marked as read.' }, 401: { description: 'Authentication required.' } },
      'x-implementation-status': 'implemented',
    },
  },
  '/api/notifications/{id}': {
    delete: {
      tags: ['Notifications'],
      summary: 'Delete a notification',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'Notification deleted.' }, 401: { description: 'Authentication required.' } },
      'x-implementation-status': 'implemented',
    },
  },
  '/api/stats/leaderboard': {
    get: {
      tags: ['Stats'],
      summary: 'Get event leaderboard data',
      responses: { 200: { description: 'Leaderboard returned.' } },
      'x-implementation-status': 'implemented',
    },
  },
  '/api/stats/recommendations': {
    get: {
      tags: ['Stats'],
      summary: 'Get personalized recommendations',
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: 'Recommendations returned.' }, 401: { description: 'Authentication required.' } },
      'x-implementation-status': 'implemented',
    },
  },
  '/api/stats/summary': {
    get: {
      tags: ['Stats'],
      summary: 'Get system summary statistics',
      responses: { 200: { description: 'Summary returned.' } },
      'x-implementation-status': 'implemented',
    },
  },
  '/api/stats/trending': {
    get: {
      tags: ['Stats'],
      summary: 'Get trending events',
      responses: { 200: { description: 'Trending events returned.' } },
      'x-implementation-status': 'implemented',
    },
  },
  '/api/stats/dashboard': {
    get: {
      tags: ['Stats'],
      summary: 'Get dashboard statistics',
      responses: { 200: { description: 'Dashboard stats returned.' } },
      'x-implementation-status': 'implemented',
    },
  },
  '/api/admin/events/pending': {
    get: {
      tags: ['Admin'],
      summary: 'List pending events',
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: 'Pending events returned.' }, 403: { description: 'Admin role required.' } },
      'x-implementation-status': 'implemented',
    },
  },
  '/api/admin/events/bulk-approve': {
    post: {
      tags: ['Admin'],
      summary: 'Bulk approve events',
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: 'Events approved.' }, 403: { description: 'Admin role required.' } },
      'x-implementation-status': 'implemented',
    },
  },
  '/api/admin/events/bulk-reject': {
    post: {
      tags: ['Admin'],
      summary: 'Bulk reject events',
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: 'Events rejected.' }, 403: { description: 'Admin role required.' } },
      'x-implementation-status': 'implemented',
    },
  },
  '/api/admin/events/bulk-delete': {
    post: {
      tags: ['Admin'],
      summary: 'Bulk delete events',
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: 'Events deleted.' }, 403: { description: 'Admin role required.' } },
      'x-implementation-status': 'implemented',
    },
  },
  '/api/admin/events/{id}/approve': {
    post: {
      tags: ['Admin'],
      summary: 'Approve a single event',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'Event approved.' }, 403: { description: 'Admin role required.' } },
      'x-implementation-status': 'implemented',
    },
  },
  '/api/admin/events/{id}/reject': {
    post: {
      tags: ['Admin'],
      summary: 'Reject a single event',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'Event rejected.' }, 403: { description: 'Admin role required.' } },
      'x-implementation-status': 'implemented',
    },
  },
  '/api/admin/users/{id}/block': {
    post: {
      tags: ['Admin'],
      summary: 'Block a user account',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'User blocked.' }, 403: { description: 'Admin role required.' } },
      'x-implementation-status': 'implemented',
    },
  },
  '/api/admin/users/{id}/unblock': {
    post: {
      tags: ['Admin'],
      summary: 'Unblock a user account',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'User unblocked.' }, 403: { description: 'Admin role required.' } },
      'x-implementation-status': 'implemented',
    },
  },
  '/api/admin/users': {
    get: {
      tags: ['Admin'],
      summary: 'List all users',
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: 'Users returned.' }, 403: { description: 'Admin role required.' } },
      'x-implementation-status': 'implemented',
    },
  },
  '/api/admin/users/{id}/role': {
    put: {
      tags: ['Admin'],
      summary: 'Update a user role',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'User role updated.' }, 403: { description: 'Admin role required.' } },
      'x-implementation-status': 'implemented',
    },
  },
  '/api/users/save-event/{eventId}': {
    post: {
      tags: ['Users'],
      summary: 'Save an event for the current customer',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'eventId', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { 200: { description: 'Event saved.' }, 401: { description: 'Authentication required.' } },
      'x-implementation-status': 'implemented',
    },
  },
  '/api/users/saved-events': {
    get: {
      tags: ['Users'],
      summary: 'Get saved events for the current customer',
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: 'Saved events returned.' }, 401: { description: 'Authentication required.' } },
      'x-implementation-status': 'implemented',
    },
  },
};

const plannedPaths = {
  '/api/events/{id}/live-stream': {
    get: {
      tags: ['Planned'],
      summary: 'Live stream session details',
      description: 'Planned endpoint for hybrid and live-stream support mentioned in the research proposal.',
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Event identifier' }],
      responses: { 501: { description: 'This capability is planned but not yet implemented.' } },
      'x-implementation-status': 'planned',
    },
  },
  '/api/events/{id}/analytics': {
    get: {
      tags: ['Planned'],
      summary: 'Analytics for a specific event',
      description: 'Planned endpoint for audience analytics and engagement reporting from the proposal.',
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Event identifier' }],
      responses: { 501: { description: 'This capability is planned but not yet implemented.' } },
      'x-implementation-status': 'planned',
    },
  },
  '/api/events/{id}/certificates': {
    post: {
      tags: ['Planned'],
      summary: 'Issue attendance certificates',
      description: 'Planned endpoint for certificate generation for completed events.',
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Event identifier' }],
      responses: { 501: { description: 'This capability is planned but not yet implemented.' } },
      'x-implementation-status': 'planned',
    },
  },
};

swaggerSpec.paths = {
  ...(swaggerSpec.paths || {}),
  ...implementedPaths,
  ...plannedPaths,
};

export default swaggerSpec;
