---
title: Screenshot Coverage Checklist
description: Gate a view/component/state change in the Note Database plugin — a scenario lands in the same change, its sources list stays accurate, and the changed PNGs get opened, not just exit-coded.
trigger_phrases:
  - "screenshot coverage checklist"
  - "add a screenshot scenario"
  - "scenario sources list accuracy"
  - "screenshots verify freshness gate"
  - "open the changed png"
  - "unphotographed surface obsidian plugin"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Screenshot Coverage Checklist

Use this whenever a view, component, or interaction state in the Note Database plugin changes.
`tools/screenshots/` is the only rendered evidence of what `styles.css` produces — a change with
no matching scenario is invisible to it.

---

## 1. OVERVIEW

### Purpose

The capture harness only knows what a scenario tells it to render. A renderer or stylesheet
change with no scenario update leaves `npm run screenshots:verify` green while the actual visual
surface silently drifts — the freshness gate proves sources are unchanged since capture, not that
the capture still looks right.

### Usage

Work through the sections in order — new scenario in the same change, sources list accuracy,
capture and regenerate, the freshness and fixture-class gates, and opening the changed PNGs —
before claiming a view/component/state change is complete, then confirm against THE GATE.

---

## 2. NEW SCENARIO IN THE SAME CHANGE

- [ ] Every new or materially changed view, component, or interaction state got a scenario entry
  in the matching module under `tools/screenshots/scenarios/` (`core.mjs`, `temporal.mjs`,
  `panels.mjs`, `chrome.mjs`, `fields.mjs`) — not deferred to a follow-up
- [ ] The scenario `id` is unique across all five modules — `scenarios.mjs` throws
  `Duplicate scenario id` at import time if not, so a collision fails loudly, but check before
  relying on that
- [ ] `group` is one of `"views"`, `"components"`, or `"states"` and matches what the surface
  actually is — a full view goes in a device frame (`views`), a component renders at its own size
  on a transparent ground (`components`)

---

## 3. SOURCES LIST ACCURACY

- [ ] `sources: [...]` lists every file the scenario's markup depicts — every renderer, controller,
  or module whose class output appears in the fixture's `html()` (e.g. `table-view` lists
  `TableRenderer.ts`, `ColumnHeaderController.ts`, and `CellRenderer.ts`, not just the top-level
  renderer)
- [ ] Did not under-list: `verify.mjs` hashes exactly the paths in `sourceHashes`, built from
  `sources` — a source left out never invalidates the capture when it changes, so the gate goes
  quiet exactly when it should fire
- [ ] Did not over-list either — an unrelated file in `sources` invalidates captures on changes
  that never affected what the PNG shows, training reviewers to ignore staleness warnings

---

## 4. CAPTURE AND REGENERATE

- [ ] `npm run screenshots` run after the scenario change — this rewrites `screenshots/manifest.json`
  and the generated `screenshots/README.md` index
- [ ] Both themes captured (light/dark) and, for a `views`-group scenario, both devices — desktop
  1440x900 and phone 402x874 (`tools/screenshots/capture.mjs:54-55`)
- [ ] A phone-viewport capture that needs the mobile layout carries `bodyClass: "is-phone"` via the
  device table, not a bare narrow viewport — without it Obsidian's phone-keyed responsive CSS never
  activates and the capture is only a cramped desktop

---

## 5. THE TWO GATES

- [ ] `npm run screenshots:verify` exits 0 — every manifest entry's source hashes match the current
  files; a stale or missing source fails the gate, not just warns
- [ ] `src/views/screenshot-fixtures.test.ts` passes (via `npx vitest run`) — it walks every
  `db-*`/`note-database*`/`status-*` class the scenario markup uses and fails any absent from both
  `styles.css` and `src/`; a capture of an invented class looks like a pass while photographing
  unstyled markup

---

## 6. OPEN THE CHANGED PNGS

- [ ] Opened every PNG the change touched — an exit-0 `screenshots:verify` proves sources are
  unchanged since capture, nothing about what the image shows. A capture can succeed and still
  photograph an empty box
- [ ] Confirmed the rendered surface matches intent in **both** themes, and for a `views` scenario,
  **both** devices
- [ ] If a surface looks wrong despite a clean capture, checked `theme.css` and `runtime-vars.css`
  for a missing stand-in before assuming a plugin defect — `runtime-vars.css` loads after the
  stylesheet and targets `.note-database-container` as well as `:root`; a `:root`-only override
  never reaches nested elements

---

## 7. UNPHOTOGRAPHED-SURFACE AWARENESS

- [ ] Did not assume coverage exists because the surface "looks like" something else that has a
  scenario — all 17 files under `src/views/modals/` are unphotographed today (a non-recursing
  `ls src/views/*.ts` built the original inventory and never reached that subfolder); see
  `assets/modal-coverage-checklist.md` before touching one
- [ ] Roughly 145 additional surfaces are recorded as unphotographed in `specs/public/HANDOVER.md`
  in the plugin repository — treat that count as known state, not something this checklist closes

---

## 8. THE GATE

Coverage is "done" only when: every changed view/component/state has a scenario entry with an
accurate `sources` list; `npm run screenshots` was rerun and the manifest/index regenerated;
`npm run screenshots:verify` and `ScreenshotFixtures.test.ts` both pass; and every changed PNG was
opened and visually confirmed in both themes (and both devices for a view) — not inferred from a
green exit code.
