# Copilot instructions

## Project architecture

- This is a React 19 single-page application built with Vite. `src/main.jsx` mounts `src/App.jsx`; most restaurant UI and client-side state currently live in `App.jsx`.
- `src/components/UIComponents.jsx` exports reusable, named UI primitives styled by `UIComponents.css`. `UIKitGallery.jsx` is their interactive showcase.
- The client loads initial menu data from TheMealDB and falls back to `INITIAL_DISHES`. Cart, reservations, reviews, and other restaurant interactions are currently client-side; do not assume they are persisted or backed by API endpoints.
- Authentication is the server-backed feature. The dependency-free Node HTTP server in `server/index.js` provides `/api/auth/me`, `/api/auth/register`, `/api/auth/login`, and `/api/auth/logout`; it stores user records in `server/data/users.json` (passwords are scrypt hashes) and keeps sessions in memory.
- In development, `scripts/dev.js` starts both the auth server and Vite, and `vite.config.js` proxies `/api` to `127.0.0.1:3001`. In production, build the client and run `server/index.js`, which serves `dist` and the API.

## Commands

- Install dependencies: `npm install`
- Start development (Vite and auth server): `npm run dev`
- Build production assets: `npm run build`
- Lint the project: `npm run lint`
- Lint one file: `npx eslint src/App.jsx`
- Start production server (after building): `npm start`
- There is currently no test script, test framework, or project test suite, so there is no single-test command.

## Project-specific conventions

- Use JavaScript ES modules and JSX; the project does not use TypeScript.
- Keep shared UI pieces as named exports from `src/components/UIComponents.jsx`, with their styles in `UIComponents.css`; use the existing `ui-` class naming pattern there.
- App translations are grouped in the `TRANSLATIONS` object in `src/App.jsx` for `RU`, `KG`, and `EN`. Add user-facing strings to each language and access them through the selected `t` dictionary.
- Keep authentication and authorization decisions on the server. Registration must create ordinary users; the administrator account is configured via `ADMIN_EMAIL` and `ADMIN_PASSWORD`, not through client input. Do not put credentials in source or documentation examples.
- `README.md` documents the current admin setup and password length requirements. Preserve those constraints when changing auth behavior.
