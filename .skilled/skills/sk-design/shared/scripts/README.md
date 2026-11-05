---
title: "sk-design shared scripts: Screenshot Renderer"
description: "Renders every HTML form under a design mode's assets root to a mirrored PNG set and checks that no source is missing a picture."
trigger_phrases:
  - "render screenshots"
  - "sk-design screenshot renderer"
  - "regenerate chart screenshots"
  - "diagram screenshot capture"
  - "render-screenshots.cjs"
version: 1.0.0.0
---

# sk-design shared scripts

The renderer behind the screenshot sets in `sk-design-chart` and `sk-design-diagram`. Both modes keep a `screenshots/` folder beside `assets/`, and this script fills it.

---

## 1. OVERVIEW

This folder owns one job for the whole `sk-design` packet: turn each HTML form under an assets root into a PNG at the same relative path under a screenshot root. A reader can then judge a chart or a diagram without opening a browser.

The two modes call it with different flags. `sk-design-chart` renders at the fixed window, and its committed images depend on that window staying fixed. `sk-design-diagram` renders with `--full-page` because several forms are taller than the window.

Current state:

- `--check` reports coverage and captures nothing, so it is safe in a review or a test run.
- An unknown option exits 2 before any capture starts, so a mistyped `--check` cannot quietly become a render.
- The colour scheme follows the host machine. Chrome ignores the headless scheme flags, so regenerate on the machine whose theme you want committed.
- Output stays outside `assets/` on purpose. A picture for a human is not a leaf a mode loads into context, and images under `assets/` would join the leaf manifest.

---

## 2. KEY FILES

| File | Role |
|---|---|
| [`render-screenshots.cjs`](render-screenshots.cjs) | Walks the assets root, captures one PNG per HTML file, mirrors the tree, and answers the coverage check. |

What the file owns:

- Discovery. Every `.html` file under the assets root, at any depth, sorted by path.
- Capture. Headless Chrome at 1280x900 with a 2500ms virtual time budget, so entry animations settle before the frame is taken. Each file gets two spawn attempts and a 60s timeout.
- Measurement for `--full-page`. A probe goes into a throwaway copy in the temp directory, the document height comes back through the DOM, and the untouched original is captured at that height. A failed measurement prints `UNMEASURED` and keeps the 900px window.
- Option parsing. Only `--check` and `--full-page` are accepted. Any other dash-prefixed token exits 2 with a usage line.

---

## 3. HOW TO RUN

Run from the repository root. The assets root comes first, the screenshot root second.

```bash
# check that every HTML source has a committed PNG
node .skilled/skills/sk-design/shared/scripts/render-screenshots.cjs \
  .skilled/skills/sk-design/sk-design-chart/assets \
  .skilled/skills/sk-design/sk-design-chart/screenshots --check

node .skilled/skills/sk-design/shared/scripts/render-screenshots.cjs \
  .skilled/skills/sk-design/sk-design-diagram/assets \
  .skilled/skills/sk-design/sk-design-diagram/screenshots --check
```

Both checks print a source count and `RESULT: PASSED` when every source is covered.

Drop `--check` to capture. Add `--full-page` when a form is taller than the window.

```bash
# capture the chart corpus at the fixed 1280x900 window
node .skilled/skills/sk-design/shared/scripts/render-screenshots.cjs \
  .skilled/skills/sk-design/sk-design-chart/assets \
  .skilled/skills/sk-design/sk-design-chart/screenshots

# capture each diagram at its own height
node .skilled/skills/sk-design/shared/scripts/render-screenshots.cjs \
  .skilled/skills/sk-design/sk-design-diagram/assets \
  .skilled/skills/sk-design/sk-design-diagram/screenshots --full-page
```

The browser is Google Chrome at its macOS path unless `CHROME_PATH` names another binary. There is no package dependency and no install step.

| Option | Effect |
|---|---|
| `--check` | Report a `MISSING` line per source with no PNG and exit 1 if any exist. Captures nothing. |
| `--full-page` | Capture each page at its measured height instead of 900px. |
| `CHROME_PATH` (environment) | Use this browser binary instead of the default path. |

| Exit code | Meaning |
|---|---|
| 0 | `RESULT: PASSED`. Every source was covered. |
| 1 | `RESULT: FAILED`. At least one capture failed, or a PNG was missing under `--check`. |
| 2 | Usage error. A missing path argument or an unknown option. |

---

## 4. RELATED

- [`sk-design` hub](../../SKILL.md), which routes to the three modes.
- [`sk-design-chart` README](../../sk-design-chart/README.md), whose screenshots section calls this script at the fixed window.
- [`sk-design-diagram` README](../../sk-design-diagram/README.md), whose screenshots section calls this script with `--full-page`.
- [`sk-design-chart` scripts README](../../sk-design-chart/scripts/README.md)
- [`sk-design-diagram` scripts README](../../sk-design-diagram/scripts/README.md)

The refusal case for a misspelled option lives in `sk-design-chart/scripts/tests/typo-flags.test.cjs`.
