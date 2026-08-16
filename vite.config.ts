import { copyFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * GitHub Pages serves a project site from a subpath, so built asset URLs
 * have to be prefixed. Override with BASE_PATH=/ when deploying to a
 * root domain (a custom domain, Netlify, Vercel…).
 */
const BASE = process.env.BASE_PATH ?? '/love432records/'

/**
 * GitHub Pages has no SPA rewrite rule, so a hard load of a deep link
 * like /release/youre-mine would 404. Pages does serve 404.html for any
 * unmatched path, so shipping a copy of index.html under that name makes
 * the router pick the route up client-side.
 *
 * .nojekyll stops Pages running the build through Jekyll, which would
 * otherwise strip files and folders beginning with an underscore.
 */
function githubPages(): Plugin {
  return {
    name: 'love432-github-pages',
    apply: 'build',
    closeBundle() {
      const dist = resolve(import.meta.dirname, 'dist')
      copyFileSync(resolve(dist, 'index.html'), resolve(dist, '404.html'))
      writeFileSync(resolve(dist, '.nojekyll'), '')
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ command, isPreview }) => ({
  // Dev runs at the root — carrying the Pages subpath through `vite dev`
  // only means typing /love432records/ into every local URL. Preview has
  // to match the build, since it serves the built output.
  base: command === 'build' || isPreview ? BASE : '/',
  plugins: [react(), tailwindcss(), githubPages()],
  server: {
    port: 4320,
    open: false,
  },
}))
