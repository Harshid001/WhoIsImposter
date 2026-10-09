# Who is Imposter?

A browser-only, pass-and-play social word-deduction game for 3–12 friends on one shared device. Everyone gets a secret role: crewmates see the word, imposters see only a related hint, and the group must discover who is bluffing before the imposters reach parity.

The setup screen also includes a **static demo room** flow for trying host/join links and importing a local participant list. It uses browser storage and same-browser tabs only; it is intentionally not a real-time cross-device multiplayer service.

## Run locally

```bash
npm install
npm run dev
```

For a production build:

```bash
npm run build
```

The Vite server listens on port `3000` and binds to `0.0.0.0` for managed preview compatibility.

## Rules

1. Add 3–12 names and choose the number of imposters, categories, difficulty, timer, tie-break and optional modes.
2. Pass the device around. Each player reveals only their own card and hides it before handing the device on.
3. Crewmates see the secret word. Imposters see one related hint (or no hint in Blind Imposter mode).
4. Everyone gives one clue, discusses, and votes. A tied vote follows the selected no-ejection or revote rule.
5. The crew wins when all imposters are ejected. The imposters win when living imposters are at least as numerous as living crewmates.
6. Spy Twist adds a Jester who wins by being ejected. Detective, Chaos and Last-Chance Guess can be enabled from setup.

## Add words and categories

The word bank lives in `src/data/wordBank.js`. Add a category property with entries shaped like this:

```js
New category: [
  { word: 'Example', hint: 'Related', hardHint: 'Vague' }
]
```

Hints should be single related words that are not synonyms or parts of the secret word. The setup screen also supports local custom entries; these are saved under `wi-custom-words` in browser storage.

## Themes, typography and persistence

The visual tokens are in `src/styles.css`, while `src/ui-enhancements.css` owns the humanized Space Grotesk + DM Sans + Fraunces font pairing and motion system. `src/simple-theme.css` applies the clean responsive surface treatment: crewmate cards use light blue, imposter cards use red, and the shared-device warning uses a warm alert card. Change the accent variables to create another simple theme. Motion automatically reduces under `prefers-reduced-motion`.

Names, settings, used-word history, custom words, scoreboard and selected sound/theme preferences are stored in `localStorage` with safe fallbacks. The active game state and hidden roles intentionally stay in memory, so a refresh returns to setup rather than leaking a role through browser history or storage.

## Architecture

- `src/App.jsx`: reducer-driven state machine and screen flow.
- `src/components/demo-room.jsx`: static host/join room links, local participant lobby and import action.
- `src/utils/gameLogic.js`: pure, testable role assignment, word selection, vote resolution, win checks, chaos and scoring.
- `src/components/ui.jsx`: accessible reusable UI primitives.
- `src/data/wordBank.js`: extendable categories and custom-word helpers.
- `src/demo-room.css`: responsive demo-room lobby styling.
- `src/styles.css`: cosmic glassmorphism design system, responsive layouts and reduced-motion rules.
