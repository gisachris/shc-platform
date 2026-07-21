import { motion } from 'framer-motion';
import { BarChart3, Globe2, MapPinned, Users } from 'lucide-react';

const highlights = [
  {
    title: 'Hybrid participation',
    body: 'Support in-person and remote guests through one coordinated experience for registration, access, and engagement.',
    icon: Globe2,
  },
  {
    title: 'Networking built in',
    body: 'Create an environment where attendees can discover events, connect with organizers, and build meaningful professional relationships.',
    icon: Users,
  },
  {
    title: 'Tourism support',
    body: 'Bring destination value into the experience by helping visitors discover venues, travel tips, and local experiences around the event.',
    icon: MapPinned,
  },
  {
    title: 'Clear impact metrics',
    body: 'Give organizers real insight into registrations, attendance, and participation so decisions can be made confidently.',
    icon: BarChart3,
  },
];

export default function ProposalHighlights() {
  return (
    <section className="bg-muted/20 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-primary mb-3 text-sm font-semibold uppercase tracking-[0.24em]">
            Proposal-aligned experience
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Built for smart hybrid conferences and community events
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            The platform combines event operations, hybrid participation, networking, and destination support into a single workflow that fits the research proposal goals.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {highlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
                className="rounded-2xl border border-border/70 bg-background/80 p-6 shadow-sm"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
