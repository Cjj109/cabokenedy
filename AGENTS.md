# AGENTS.md

## Cursor Cloud specific instructions

### Project overview
Cabo Kenedy is a restaurant website (pollo a la brasa) built with **Astro 5** + **Tailwind CSS v4**, deployed to **Cloudflare Workers** with a **D1** (SQLite) database. It has a public-facing menu/promos site and an admin panel at `/admin`.

### Running the dev server
- `npm run dev` starts the Astro dev server on `localhost:4321`.
- Cloudflare D1 is emulated locally via Wrangler's `platformProxy` — no separate database process needed.

### Database initialization
Before the dev server can serve data, the local D1 database must be seeded:
```sh
npx wrangler d1 execute cabokenedy-db --local --file=db/schema.sql
npx wrangler d1 execute cabokenedy-db --local --file=db/seed.sql
```
The local SQLite file lives in `.wrangler/state/v3/d1/`. If data looks empty, re-run the above commands.

### Build
`npm run build` produces a Cloudflare Workers bundle in `dist/`.

### Admin panel
The `/admin` routes require an `ADMIN_PASSWORD_HASH` secret. For local dev, create a `.dev.vars` file with `ADMIN_PASSWORD_HASH=<bcrypt hash>`. Without it, admin login will not work but the public site is unaffected.

### Key caveats
- There is no linter or test framework configured in this project. `package.json` has no `lint` or `test` scripts.
- The Cloudflare adapter warns about `sharp` not being available at runtime — this is expected and does not affect local dev.
- The build emits a warning about the `SESSION` KV binding for Astro sessions — this can be ignored for local dev.
