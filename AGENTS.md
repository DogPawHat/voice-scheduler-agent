# Repository Guidelines

## Project Structure & Module Organization
- `src/` — app code: `routes/` (file‑based routes, root in `__root.tsx`), `env/` (client/server env), `lib/` (utilities), `router.tsx`, `server.ts`, global `styles.css`.
- `convex/` — Convex backend functions and `schema.ts`; generated types live in `convex/_generated/`.
- `public/` — static assets and PWA files.
- Tooling: `vite.config.ts`, `tsconfig.json`, `eslint.config.js`, `prettier.config.js`.

## Build, Test, and Development Commands
- `pnpm dev` — start Vite dev server on port 3000.
- `pnpm build` — production build via Vite.
- `pnpm serve` — preview the production build.
- `pnpm test` — run Vitest once (headless, jsdom).
- `pnpm lint` — run ESLint; `pnpm check` — Prettier write + ESLint fix.
- Convex: `npx convex dev` to run the Convex dev server locally.

## Coding Style & Naming Conventions
- Language: TypeScript (ES modules). Formatting via Prettier, linting via ESLint (`@tanstack/eslint-config`). Use 2‑space indentation and single source of truth from formatters.
- Components: PascalCase in `.tsx` (e.g., `UserMenu.tsx`). Utilities: camelCase in `src/lib/` (e.g., `formatDate.ts`).
- Routes: file‑based under `src/routes/` (e.g., `index.tsx`, nested folders). Prefer named exports; avoid default exports unless route APIs require.

## Testing Guidelines
- Framework: Vitest + Testing Library (`@testing-library/react`, `jsdom`).
- Place tests near code using `*.test.ts` or `*.test.tsx` (e.g., `Button.test.tsx`).
- Aim for meaningful unit tests on utilities and components; include accessibility expectations where relevant.
- Run `pnpm test` locally and ensure passing before PRs.

## Commit & Pull Request Guidelines
- Use Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`.
- Keep commits focused and descriptive; reference issues (e.g., `Fixes #123`).
- PRs must include: summary, rationale, screenshots for UI changes, and how to test. Ensure `pnpm check` and `pnpm test` pass.

## Security & Configuration
- Store secrets in `.env.local`; never commit them. Required keys: `VITE_CLERK_PUBLISHABLE_KEY`, `VITE_CONVEX_URL`, `CONVEX_DEPLOYMENT`.
- Type‑safe env handled under `src/env/`. Restart dev servers after env changes.

## Convex & Agent Notes
- Update `convex/schema.ts` when adding tables; run `npx convex dev` to regenerate `_generated` types.
- Keep server/client boundaries clear: server‑only code in `src/env/server.ts` and Convex functions; avoid leaking secrets to the client.

