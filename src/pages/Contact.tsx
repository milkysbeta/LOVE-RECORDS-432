import PageHeader from '../components/layout/PageHeader'
import MessageForm, { type FieldDef } from '../components/forms/MessageForm'
import { ExternalIcon } from '../components/ui/Icon'
import { EMAIL, HAS_EMAIL, LOCATION, SOCIALS } from '../data/site'

const FIELDS: FieldDef[] = [
  { name: 'name', label: 'Name', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'subject', label: 'What is this about', placeholder: 'Press, licensing, bookings…' },
  { name: 'message', label: 'Message', type: 'textarea', required: true },
]

const DESKS: [string, string | null, string][] = [
  ['General', EMAIL.general, 'Anything that does not fit the other two.'],
  ['Demos', EMAIL.demos, 'Music submissions — see the demo policy first.'],
  ['Press & licensing', EMAIL.press, 'Promos, interviews, sync and clearance.'],
]

export default function Contact() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Say something."
        lede={`We are in ${LOCATION}, which means we are probably asleep when you send this. We do reply.`}
      />

      <section className="shell mt-20 grid gap-16 lg:grid-cols-12 lg:gap-20">
        <div className="panel panel-pad lg:col-span-5">
          <h2 className="eyebrow text-cobalt-600" data-reveal>
            {HAS_EMAIL ? 'Desks' : 'What you can reach us about'}
          </h2>

          <dl className="mt-8 space-y-8">
            {DESKS.map(([label, address, note], i) => (
              <div
                key={label}
                data-reveal
                style={{ '--reveal-delay': `${i * 80}ms` } as React.CSSProperties}
              >
                <dt className="eyebrow text-ink-faint">{label}</dt>
                <dd className="mt-2">
                  {address ? (
                    <a
                      href={`mailto:${address}`}
                      className="display-sm text-cobalt-600 underline-offset-4 hover:underline"
                    >
                      {address}
                    </a>
                  ) : (
                    <span className="display-sm text-ink-faint">Use the form</span>
                  )}
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{note}</p>
                </dd>
              </div>
            ))}
          </dl>

          {SOCIALS.length > 0 && (
            <div className="rule mt-12 pt-7" data-reveal>
              <p className="eyebrow text-ink-faint">Elsewhere</p>
              <ul className="mt-5 space-y-2.5">
                {SOCIALS.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="group inline-flex items-center gap-1.5 text-sm text-ink-soft transition hover:text-cobalt-600"
                    >
                      {s.label}
                      <ExternalIcon className="size-3 opacity-0 transition group-hover:opacity-100" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="lg:col-span-7">
          <div
            className="panel panel-pad"
            data-reveal
          >
            <MessageForm
              fields={FIELDS}
              mailto={EMAIL.general}
              subject="Website enquiry"
              submitLabel="Send message"
            />
          </div>
        </div>
      </section>
    </>
  )
}
