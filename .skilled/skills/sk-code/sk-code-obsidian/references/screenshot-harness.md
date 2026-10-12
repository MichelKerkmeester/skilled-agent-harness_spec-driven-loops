---
title: The Screenshot Fixture Harness
description: capture.mjs and verify.mjs, scenarios.mjs's registration contract, the hand-fixture-vs-real-renderer distinction, and how theme.css/runtime-vars.css stand in for what Obsidian supplies at runtime.
trigger_phrases:
  - "screenshot fixture harness"
  - "scenarios.mjs registration"
  - "verify.mjs freshness gate"
  - "hand fixture vs real renderer"
  - "theme.css runtime-vars.css stand in"
  - "is-phone body class capture"
importance_tier: normal
contextType: implementation
version: 0.1.0.0
---

# The Screenshot Fixture Harness

`tools/screenshots/` renders hand-written fixture markup against the shipped `styles.css` in
headless Chrome via `playwright-core` — it does not drive the real renderers. This reference is
the harness's contract: what each script does, what stands in for Obsidian, and what a capture
does and does not prove.

---

## 1. OVERVIEW

### Core Principle

A capture photographs fixture markup against `styles.css`, not the plugin running inside
Obsidian. The real renderers need a live `App`, `Vault`, and `MetadataCache` this harness never
constructs, so a renderer and its fixture can drift apart silently — markup drift shows up as a
stale-looking screenshot, not a capture error. Treat every capture as "does the shipped CSS style
this hand-written markup as intended," never as "does the plugin actually render this."

### When to Use

- Adding a scenario for a new or changed view/component/state
- Deciding whether a capture failure is a plugin bug or a harness stand-in gap
- Running the freshness gate before claiming UI work complete
- Capturing a phone-layout surface

### Key Sources

- `tools/screenshots/capture.mjs` — the runner (`npm run screenshots`)
- `tools/screenshots/verify.mjs` — the freshness gate (`npm run screenshots:verify`)
- `tools/screenshots/scenarios.mjs` — the aggregator; `tools/screenshots/scenarios/*.mjs` —
  one module per surface family (`core`, `temporal`, `panels`, `chrome`, `fields`)
- `tools/screenshots/theme.css`, `tools/screenshots/runtime-vars.css` — the stand-ins
- `screenshots/manifest.json` — the fingerprint record `verify.mjs` reads

---

## 2. THE TWO SCRIPTS

```bash
npm run screenshots          # node tools/screenshots/capture.mjs — capture everything
npm run screenshots:verify   # node tools/screenshots/verify.mjs — freshness check only
```

`capture.mjs` drives the **system** Chrome through `playwright-core` (no bundled ~150MB
download); it checks `SCREENSHOT_CHROME` first, then a fixed candidate list
(`/Applications/Google Chrome.app/...`, Chromium, Edge, `/usr/bin/google-chrome`,
`/usr/bin/chromium`). `verify.mjs` compares a SHA-256 fingerprint (first 12 hex chars) of every
file a scenario's `sources` array names against what `screenshots/manifest.json` recorded at
capture time — deliberately fingerprints, not image bytes, because a different Chrome build
shifts antialiasing by a pixel and would report false drift on every machine. 180 entries
measured at the baseline commit (`002-repo-convention-audit/audit.json`).

---

## 3. HAND-FIXTURE, NOT REAL RENDERER

Every scenario's `html()` function returns hand-written markup that mirrors what a renderer
emits — it does not call the renderer. This is a deliberate cost trade documented in
`scenarios.mjs`'s own header comment: the real renderers need a live Obsidian `App`, a vault, and
a metadata cache the harness does not construct, so markup is hand-authored instead. The
consequence: a renderer change that alters its emitted class structure does not fail a capture —
it produces a screenshot that quietly stops matching the code. `src/views/
ScreenshotFixtures.test.ts` catches the sharper failure (a class the plugin never emits and no
rule ever styles — see `db-class-naming.md`), not markup drift itself.

---

## 4. TWO CAPTURE MODES

- **Viewport** — a full view photographed inside a device frame: desktop `1440x900` or mobile
  `402x874`, both themes. Used when `scenario.group === "views"` (the default for that group) or
  an explicit `capture: "viewport"`.
- **Element** — a component photographed at its own size on a transparent ground, so it can sit
  on any background. The default for every other group, or an explicit `capture: "element"`.

A scenario may also declare `captureCss`, injected after the plugin stylesheet, to undo the parts
of a rule that only make sense against a live anchor (an overlay positioned absolutely against a
toolbar that does not exist in isolation would otherwise photograph as an empty box). `captureCss`
must never restyle what is being photographed, only make it visible.

**Card-field classes are parameters, not classes.** `CardFieldRenderer` takes `labelClass` /
`valueClass` / `fieldClass` props, and each view passes its own concrete class
(`db-board-card-field-label`, `db-gallery-field-value`, `db-list-field-value`). A fixture that
used the parameter names literally (`labelClass`, `valueClass`) rendered label and value with no
separator, because nothing styles the generic parameter name — this has already caught two real
mistakes.

---

## 5. THE STAND-INS

- **`theme.css`** — supplies the Obsidian host theme variables (`--background-primary`,
  `--text-normal`, `--interactive-accent`, and peers) and baseline styling for bare form
  controls that Obsidian itself provides at runtime and the plugin stylesheet only reads via
  `var()`. See `theme-variables.md` for the full list and per-theme values.
- **`runtime-vars.css`** — supplies values the plugin measures and sets from JavaScript at
  runtime (toolbar height, column widths, timeline geometry) that do not exist when the
  stylesheet loads on its own. Loaded **after** the plugin stylesheet so it wins the cascade, and
  targets both `:root` and `.note-database-container` because a custom property inherits from
  the nearest ancestor that sets it — a `:root`-only override never reaches an element the plugin
  sets the property on directly.
- **`is-phone` body class** — Obsidian marks phone layouts with this class on `<body>`, and a
  large part of the plugin's responsive CSS keys off it. `capture.mjs`'s `DEVICES` array sets
  `bodyClass: "is-phone"` for the `mobile` device; without it a narrow viewport only renders a
  cramped desktop, never the actual mobile design.

A surface that looks wrong in a capture may be a gap in `theme.css` or `runtime-vars.css` rather
than a plugin defect — check which before filing it as a bug (`REPO RULES.md`,
`SKILL.md` §3).

---

## 6. WHAT A CAPTURE DOES NOT PROVE

`npm run screenshots:verify` only checks that a capture's declared sources have not changed since
it was taken — it never inspects what the PNG shows. A capture can succeed and still photograph
an empty box (a `captureCss` override that hides the wrong element, a fixture missing its host
container). **Open the changed PNG.** Adding a view, component, or state without a matching
scenario in `tools/screenshots/scenarios.mjs` in the same change is a registered-but-never-
captured gap `verify.mjs` reports as a failure — see `view-renderer-architecture.md` §4 for the
17 modal files currently in that state.

---

## 7. RELATED REFERENCES

- `db-class-naming.md` — the class guard `ScreenshotFixtures.test.ts` runs over fixture markup.
- `theme-variables.md` — the full `theme.css` variable set and where Obsidian's real values differ.
- `verification.md` — where `screenshots:verify` sits in the full gate command set.
