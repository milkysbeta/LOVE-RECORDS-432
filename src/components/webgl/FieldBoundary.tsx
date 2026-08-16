import { Component, type ReactNode } from 'react'

/* ------------------------------------------------------------------ *
 *  Error boundary for the WebGL layer.
 *
 *  The Chladni field is decoration. A machine with no WebGL, a blocked
 *  context, a driver crash or an exhausted GPU must degrade to a plain
 *  white page — never take the catalogue down with it.
 * ------------------------------------------------------------------ */
export default class FieldBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: unknown) {
    // Not fatal — log it and carry on without the background.
    console.warn('[love432] background field disabled:', error)
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}
