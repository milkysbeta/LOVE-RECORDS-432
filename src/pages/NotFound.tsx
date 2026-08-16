import Button from '../components/ui/Button'
import Logo from '../components/ui/Logo'

export default function NotFound() {
  return (
    <section className="shell grid min-h-[70vh] place-items-center pt-32 text-center">
      <div>
        <Logo variant="mark" className="mx-auto h-40 text-cobalt-200" />
        <p className="eyebrow mt-10 text-cobalt-600">404</p>
        <h1 className="display-lg mt-5 text-balance">Nothing resonating here.</h1>
        <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-ink-soft">
          That record is not in the catalogue — or the link has drifted out of tune.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button to="/">Back to the start</Button>
          <Button to="/catalogue" variant="secondary">
            Browse the catalogue
          </Button>
        </div>
      </div>
    </section>
  )
}
