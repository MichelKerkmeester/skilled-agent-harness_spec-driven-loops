---
title: The .db-* Class Grammar
description: The 1,196 distinct .db-* classes measured in styles.css, the 769 orphaned versus 427 fixture-referenced split, and the hard rule that no .db-* class may be invented — enforced by ScreenshotFixtures.test.ts.
trigger_phrases:
  - "db class grammar"
  - "never invent a db class"
  - "orphaned db classes"
  - "screenshotfixtures test class guard"
  - "note-database class prefix"
  - "status class prefix"
importance_tier: normal
contextType: implementation
version: 0.1.0.0
---

# The `.db-*` Class Grammar

Every plugin-authored class in this tree carries one of three prefixes: `db-`, `note-database`,
or `status-`. This reference is that grammar, the measured split between fixture-referenced and
orphaned classes, and the one hard rule a build enforces mechanically.

---

## 1. OVERVIEW

### Core Principle

A class is only real if a matching rule exists in `styles.css` or a matching literal appears in
`src/`. `src/views/screenshot-fixtures.test.ts` proves this for every class a screenshot fixture
puts in the DOM: it collects every `db-*` / `note-database*` / `status-*` class token out of
`tools/screenshots/scenarios/**/*.mjs`, then fails any that appears in neither `styles.css` nor
the concatenated text of `src/`. There is no scoped-style safety net to catch a typo the way a
CSS-Modules build would — a wrong class name is silently unstyled, and the whole point of this
test is to make that failure loud instead.

### When to Use

- Naming a new class for a renderer's output
- Writing a screenshot fixture and reusing (never inventing) a class name
- Renaming or removing a class and checking what still references it
- Explaining why a capture photographed unstyled markup

### Key Sources

- `styles.css` — 1,196 distinct `.db-*` classes, 11 distinct `.note-database-*` classes measured
- `src/views/screenshot-fixtures.test.ts` — the enforcement mechanism
- `tools/screenshots/scenarios/*.mjs` — the fixture markup the test scans

---

## 2. THE THREE PREFIXES

- **`db-*`** — the dominant grammar, 1,196 distinct classes measured. Covers every renderer
  surface: `db-table-cell`, `db-board-card`, `db-gallery-card-cover`, `db-chart-drilldown-modal`,
  `db-color-picker-popup`, and so on. No further delimiter convention (no `--` BEM split) is
  enforced today — names are hyphenated freeform (`db-icon-picker-search`,
  `db-accent-focus-ring`), unlike `sk-code-mobile-cli`'s `block--element` grammar.
- **`note-database*`** — 11 distinct classes, the outer container/chrome layer:
  `note-database-container`, `note-database-modal`, `note-database-settings`. These are the
  surface roots `src/views/accessibility-defects.test.ts` asserts a focus ring on (see
  `accessibility.md` §2).
- **`status-*`** — status-option presentation classes, driven by `StatusPresetDef` /
  `StatusOptionDef` data (`src/data/column-types.ts`) rather than a fixed enum, so the exact class
  names vary with configured status presets.

---

## 3. THE MEASURED SPLIT

Of the 1,196 distinct `.db-*` classes: 427 are referenced by at least one screenshot fixture, and
769 are referenced by none. "Orphaned" here means only "no fixture photographs it" — most of the
769 are still emitted by the real renderers in normal use; the fixture harness in
`tools/screenshots/scenarios/` was authored by hand and does not claim full coverage (see
`screenshot-harness.md` §3, roughly 145 surfaces still unphotographed). Do not read "orphaned" as
"dead code" without checking `src/` for a live emitter first.

---

## 4. THE HARD RULE

Never propose or write a `.db-*` (or `note-database*` / `status-*`) class name without checking
it already exists in `styles.css` or is emitted somewhere in `src/`. This applies to fixture
authoring, renderer edits, and any documentation that names a class. `grep` before citing:

```bash
grep -q '\.db-your-candidate-name' styles.css || grep -rq 'db-your-candidate-name' src/
```

If neither matches, the name is invented. `src/views/screenshot-fixtures.test.ts` fails a fixture
that puts an invented class in the DOM — but only for fixture markup; a renderer edit that emits
an invented class and is never added to a fixture will not be caught by this test, so the check
above is the real gate, not the test's presence alone.

---

## 5. WHAT A RENAME MUST NOT BREAK

Renaming a `.db-*` class touches three places that must move together: the `styles.css` rule
itself, every `src/` emitter (`.addClass(...)`, `cls: "..."`, template-literal class strings),
and every fixture in `tools/screenshots/scenarios/` that names it in a `class="..."` attribute.
`tools/screenshots/verify.mjs` hashes each scenario's declared `sources` — a class rename inside
`styles.css` invalidates every capture whose scenario lists `styles.css` as a source (all of
them), so a rename is always followed by `npm run screenshots` to regenerate the manifest before
`npm run screenshots:verify` can pass again.

---

## 6. RELATED REFERENCES

- `stylesheet-ownership.md` — which file every `.db-*` rule lives in.
- `screenshot-harness.md` — how the fixture harness reads and captures against these classes.
- `comment-grammar.md` — the purpose comments that should accompany a non-obvious class's rule.
