import { useState } from 'react'
import Button from '../ui/Button'

/* ------------------------------------------------------------------ *
 *  Message / demo form
 *
 *  There is no backend in this project, so by default the form composes
 *  a pre-filled email and hands it to the visitor's mail client. That
 *  works on a purely static host with nothing to maintain.
 *
 *  To collect submissions properly instead, set FORM_ENDPOINT to a form
 *  service URL (Formspree, Basin, Netlify Forms, your own handler) and
 *  the same form POSTs JSON to it with no other change.
 * ------------------------------------------------------------------ */
const FORM_ENDPOINT = '' // TODO: e.g. 'https://formspree.io/f/xxxxxxx'

export interface FieldDef {
  name: string
  label: string
  type?: 'text' | 'email' | 'url' | 'textarea'
  placeholder?: string
  required?: boolean
  hint?: string
}

interface Props {
  fields: FieldDef[]
  /** Mailbox for the mailto fallback. Null while the label has no inbox. */
  mailto: string | null
  subject: string
  submitLabel?: string
}

type Status = 'idle' | 'sending' | 'sent' | 'error' | 'unconfigured'

export default function MessageForm({ fields, mailto, subject, submitLabel = 'Send' }: Props) {
  const [values, setValues] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<Status>('idle')

  const set = (name: string, value: string) => setValues((v) => ({ ...v, [name]: value }))

  const buildBody = () =>
    fields
      .map((f) => `${f.label}:\n${values[f.name]?.trim() || '—'}`)
      .join('\n\n')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')

    if (!FORM_ENDPOINT && !mailto) {
      // No inbox and no form service — say so plainly rather than
      // pretending the message went somewhere.
      setStatus('unconfigured')
      return
    }

    if (!FORM_ENDPOINT && mailto) {
      // Fallback: hand off to the visitor's mail client.
      const href = `mailto:${mailto}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(buildBody())}`
      window.location.href = href
      setStatus('sent')
      return
    }

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ _subject: subject, ...values }),
      })
      setStatus(res.ok ? 'sent' : 'error')
      if (res.ok) setValues({})
    } catch {
      setStatus('error')
    }
  }

  if (status === 'unconfigured') {
    return (
      <div
        className="rounded-lg border border-cobalt-600/20 bg-cobalt-50/60 px-8 py-14 text-center"
        role="status"
      >
        <h3 className="display-sm text-cobalt-700">Not quite open yet.</h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-soft">
          The label inbox is still being set up, so this form has nowhere to send to. Check back
          shortly — nothing you typed has been lost, it is still on the previous screen.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="eyebrow mt-8 text-cobalt-600 hover:underline"
        >
          Back to the form
        </button>
      </div>
    )
  }

  if (status === 'sent') {
    return (
      <div
        className="rounded-lg border border-cobalt-600/20 bg-cobalt-50/60 px-8 py-14 text-center"
        role="status"
      >
        <h3 className="display-sm text-cobalt-700">
          {FORM_ENDPOINT ? 'Got it.' : 'Your mail client should be open.'}
        </h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-soft">
          {FORM_ENDPOINT
            ? 'We listen to everything. If it is right for the label you will hear back, usually within a month.'
            : `If nothing happened, email ${mailto} directly — everything you typed is in the draft.`}
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="eyebrow mt-8 text-cobalt-600 hover:underline"
        >
          Send another
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-7">
      {fields.map((field) => {
        const id = `field-${field.name}`
        const shared =
          'w-full rounded-lg border border-cobalt-600/20 bg-white/80 px-4 py-3.5 text-base text-ink placeholder:text-ink-faint/70 transition focus:border-cobalt-600 focus:outline-none focus:ring-4 focus:ring-cobalt-600/12'

        return (
          <div key={field.name}>
            <label htmlFor={id} className="eyebrow mb-3 block text-ink-soft">
              {field.label}
              {field.required && <span className="ml-1 text-cobalt-600">*</span>}
            </label>

            {field.type === 'textarea' ? (
              <textarea
                id={id}
                name={field.name}
                rows={6}
                required={field.required}
                placeholder={field.placeholder}
                value={values[field.name] ?? ''}
                onChange={(e) => set(field.name, e.target.value)}
                className={`${shared} resize-y`}
              />
            ) : (
              <input
                id={id}
                name={field.name}
                type={field.type ?? 'text'}
                required={field.required}
                placeholder={field.placeholder}
                value={values[field.name] ?? ''}
                onChange={(e) => set(field.name, e.target.value)}
                className={shared}
              />
            )}

            {field.hint && <p className="mt-2 text-xs text-ink-faint">{field.hint}</p>}
          </div>
        )
      })}

      {status === 'error' && (
        <p className="text-sm text-cobalt-700" role="alert">
          That did not send.{' '}
          {mailto ? (
            <>
              Email <span className="font-medium">{mailto}</span> instead.
            </>
          ) : (
            'Please try again shortly.'
          )}
        </p>
      )}

      <Button type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : submitLabel}
      </Button>

      {!FORM_ENDPOINT && mailto && (
        <p className="text-xs leading-relaxed text-ink-faint">
          This opens your email client with the message pre-filled — nothing is sent from this page.
        </p>
      )}
    </form>
  )
}
