# Who is Imposter? — Implementation & Design Plan

## Product approach

Build a browser-only, pass-and-play social deduction game in React 18 with a Vite dev server. The app uses a reducer-driven state machine rather than route navigation so the shared-device privacy flow is explicit and resilient:

`SETUP → DEALING → DISCUSSION → VOTING → EJECTION → (DISCUSSION | RESULT) → SCOREBOARD`

All role assignment, word selection, tie handling, win checks, scoring, and display-safe role payloads live in pure functions under `src/utils/`. UI components consume state through the root reducer and never infer hidden roles from DOM state. Local storage is wrapped in safe helpers so a blocked or malformed storage value falls back to defaults.

The first shipped version covers the required setup-to-result game loop, the most visible advanced toggles (Blind Imposter, Spy Twist/Jester, Detective, Chaos, last-chance guess, imposter awareness), local scoreboard, custom words, theme/sound/timer controls, and responsive accessible UI. The static-only multiplayer fallback adds a clearly labeled demo room with host links, join codes, same-browser local-storage participants, and an import action; it does not imply live cross-device synchronization.

## Project structure

- `src/main.jsx` — React entry point and global stylesheet import.
- `src/App.jsx` — reducer, screen orchestration, persistence, and the complete gameplay loop.
- `src/components/ui.jsx` — reusable buttons, cards, badges, modal/toast primitives.
- `src/components/demo-room.jsx` — static demo host/join lobby, invite links, local participants, and game import.
- `src/data/wordBank.js` — 10 everyday categories with 20+ entries each and custom-word helpers.
- `src/utils/gameLogic.js` — pure game rules: names, word picking, role assignment, vote tallying, win conditions, scoring, and chaos events.
- `src/styles.css` — design tokens, glassmorphism, space atmosphere, responsive layouts, reduced-motion rules, and role-specific themes.
- `src/ui-enhancements.css` — humanized font pairing, layered entrances, hover feedback, cinematic reveals, and motion accessibility overrides.
- `public/manus-routes.json` — static route manifest for the single-page app.
- `README.md` — install/run instructions, rules, extension notes, and privacy behavior.
- `plan.md` / `TODO.md` — implementation decisions and acceptance clauses.

## Design direction

- **Design movement:** calm editorial game UI — a simple, friendly product interface with tactile controls and clear role-state color.
- **Core principles:** readable at a glance; theatrical reveal moments; privacy-first shared-device choreography; every action feels like a game move.
- **Color philosophy:** warm white and cool gray surfaces keep the shared device readable in daylight; blue signals a safe crewmate card, red signals the imposter alert, and one restrained blue accent ties controls together.
- **Layout paradigm:** a narrow command bridge with a wide content stage; setup uses a two-column cockpit on desktop, while play screens collapse into a thumb-friendly deck on mobile. A persistent “mission rail” provides state context instead of generic breadcrumbs.
- **Signature elements:** a compact question-mark wordmark, a visible shared-device alert card, light-blue crewmate and red imposter cards, and thin progress/status details.
- **Interaction philosophy:** actions are deliberate and reversible until a reveal/vote commitment; pass-screen and flip-back moments protect secrets; primary actions are big, pill-shaped, and labeled with verbs.
- **Animation:** a restrained `cubic-bezier` motion language moves pages, panels, cards, inputs, chips, modals, toasts, votes and result headlines. Entrances are staggered, hover states stay tactile without visual noise, and role reveals use a simple emphasis pulse. `prefers-reduced-motion` removes transforms and long loops.
- **Typography:** Space Grotesk gives headings a friendly, contemporary game feel; DM Sans keeps controls and instructions warm and readable; Fraunces provides a human editorial accent for the emotional hero line. Uppercase micro-labels use letter spacing, while player names remain sentence case.
- **Brand essence:** “A suspiciously good party game for friends who can’t keep a straight face.” Personality: theatrical, friendly, mischievous.
- **Brand voice:** short, playful, direct. Example lines: “Pass the screen. Protect the secret.” and “Someone is bluffing. Make them sweat.”
- **Wordmark & logo:** the title lockup is paired with a compact question-mark mark, not just a default text heading.
- **Signature brand color:** ultraviolet `#8b7cff` with a pink flare `#ff5d9e`.

## Frontend and serving

The app is a static Vite build served on the managed project’s configured port 3000 and needs no server or database. The preview server listens on `0.0.0.0:3000`. `npm run build` emits `dist/`, and the project configuration will declare the self-contained build command and static output directory before checkpointing. The app keeps browser-facing links relative and uses `/manus-routes.json` for the page manifest.

## Material constraints and choices

- No external backend, accounts, payments, or network data.
- No stock or generated hero image is required; the atmosphere is deliberately CSS-driven so the game remains fast and offline-friendly.
- Sound uses lightweight Web Audio cues only when enabled: tap, reveal, vote, win, and danger tones; no audio asset download is necessary.
- Local storage data is non-sensitive game configuration and score history; hidden roles are held in memory during the active game and are never written to storage.
