/**
 * Resolve a file in /public against the deployed base path.
 *
 * Vite rewrites absolute asset URLs inside index.html but not inside JS,
 * so a bare "/artists/phully.jpg" 404s on a GitHub Pages project site.
 * Store paths without a leading slash and run them through here.
 */
export const asset = (path: string) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`
