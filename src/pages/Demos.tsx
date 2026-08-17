import PageHeader from '../components/layout/PageHeader'
import MessageForm, { type FieldDef } from '../components/forms/MessageForm'
import { DEMO_POLICY, EMAIL, TUNING } from '../data/site'

const FIELDS: FieldDef[] = [
  { name: 'name', label: 'Artist name', required: true, placeholder: 'What you release under' },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'location', label: 'Where are you based', placeholder: 'City, country' },
  {
    name: 'links',
    label: 'Links to the music',
    type: 'textarea',
    required: true,
    placeholder: 'Private SoundCloud, WeTransfer, Dropbox — two or three tracks',
    hint: 'Please do not attach files to the email; links only.',
  },
  {
    name: 'tuning',
    label: 'What is it tuned to',
    placeholder: '432, 440, not sure',
    hint: 'Honestly "not sure" is a fine answer.',
  },
  {
    name: 'about',
    label: 'Anything we should know',
    type: 'textarea',
    placeholder: 'Optional. Short is better than long.',
  },
]

export default function Demos() {
  return (
    <>
      <PageHeader
        eyebrow="Demos"
        title="We listen to everything."
        lede={`We are a small label with a specific rule, so the bar is less "is this incredible" and more "does this belong at ${TUNING.hz}". Send it and find out.`}
      />

      <section className="shell mt-20 grid gap-16 lg:grid-cols-12 lg:gap-20">
        <div className="panel panel-pad lg:col-span-5">
          <h2 className="eyebrow text-cobalt-600" data-reveal>
            Before you send
          </h2>

          <ol className="mt-8 space-y-8">
            {DEMO_POLICY.map((line, i) => (
              <li
                key={i}
                className="flex gap-5"
                data-reveal
                style={{ '--reveal-delay': `${i * 80}ms` } as React.CSSProperties}
              >
                <span className="font-mono text-xs text-cobalt-600">0{i + 1}</span>
                <p className="flex-1 text-base leading-relaxed text-ink-soft">{line}</p>
              </li>
            ))}
          </ol>

          {EMAIL.demos && (
            <div className="rule mt-12 pt-7" data-reveal>
              <p className="text-sm leading-relaxed text-ink-soft">
                Prefer plain email? Send it to{' '}
                <a
                  href={`mailto:${EMAIL.demos}`}
                  className="text-cobalt-600 underline-offset-4 hover:underline"
                >
                  {EMAIL.demos}
                </a>
                .
              </p>
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
              mailto={EMAIL.demos}
              subject="Demo submission"
              submitLabel="Send demo"
            />
          </div>
        </div>
      </section>
    </>
  )
}
