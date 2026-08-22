import { copyFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Custom domain. Set this and the build switches to serving from a root
 * domain: the base path drops to "/" and a CNAME file is emitted so
 * GitHub Pages points the domain at this site.
 *
 * Empty means "serve from the github.io project subpath" — the two are
 * mutually exclusive, because a project site needs /REPO/ prefixed onto
 * every asset URL and a custom domain must not have it.
 *
 * Override per build with SITE_DOMAIN=… if ever needed.
 */
const DOMAIN = process.env.SITE_DOMAIN ?? ''

/**
 * GitHub Pages serves a project site from a subpath, so built asset URLs
 * have to be prefixed. Ignored entirely once DOMAIN is set.
 */
const BASE = DOMAIN ? '/' : (process.env.BASE_PATH ?? '/LOVE-RECORDS-432/')

/**
 * Built output goes to /docs and is committed, because GitHub Pages can
 * serve a branch's /docs folder directly. That keeps the site working
 * without depending on the Pages "Source" setting being switched to
 * GitHub Actions — the folder dropdown is enough.
 */
const OUT_DIR = 'docs'

function githubPages(): Plugin {
  return {
    name: 'love432-github-pages',
    apply: 'build',
    closeBundle() {
      const out = resolve(import.meta.dirname, OUT_DIR)

      /**
       * GitHub Pages has no SPA rewrite rule, so a hard load of a deep
       * link like /release/youre-mine would 404. Pages does serve
       * 404.html for any unmatched path, so shipping a copy of
       * index.html under that name lets the router pick the route up
       * client-side.
       */
      copyFileSync(resolve(out, 'index.html'), resolve(out, '404.html'))

      /**
       * .nojekyll stops Pages running the build through Jekyll, which
       * would otherwise strip files and folders beginning with an
       * underscore.
       */
      writeFileSync(resolve(out, '.nojekyll'), '')

      /**
       * CNAME must be written by the build, not by GitHub.
       *
       * When you set a custom domain in the Pages UI, GitHub commits a
       * CNAME file into the publishing source — here, /docs. But this
       * build empties /docs on every run, so that file would be deleted
       * by the next deploy and the domain would silently detach. Writing
       * it here means it survives.
       */
      if (DOMAIN) writeFileSync(resolve(out, 'CNAME'), `${DOMAIN}\n`)
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ command, isPreview }) => ({
  // Dev always runs at the root — carrying a subpath through `vite dev`
  // only means typing it into every local URL. Preview has to match the
  // build, since it serves the built output.
  base: command === 'build' || isPreview ? BASE : '/',
  plugins: [react(), tailwindcss(), githubPages()],
  build: {
    outDir: OUT_DIR,
    emptyOutDir: true,
  },
  server: {
    port: 4320,
    open: false,
  },
}))
