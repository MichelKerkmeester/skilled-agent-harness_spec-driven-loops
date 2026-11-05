---
title: "sk-design-chart scripts tests"
description: "Test suite for the chart scripts: DESIGN.md derivation, corpus check families and flag refusal."
trigger_phrases:
  - "chart scripts tests"
  - "corpus mutation suite"
  - "apply design md test"
  - "typo flag test"
version: 1.0.0.0
---

# sk-design-chart scripts tests

The standing suite for the chart scripts one level up. It proves the applicator derives and refuses correctly, each corpus check family can fail, and every CLI entry point refuses a misspelled flag.

---

## 1. OVERVIEW

`tests/` holds the tests for `apply-design-md.cjs`, `check-corpus.cjs` and `color-gates.cjs`. The suite uses `node:test` and needs no package install.

- The corpus mutation suite never edits the shipped corpus. It writes one mutated copy and runs the real checker against that copy.
- The suite checks its own coverage. A corpus family with no case fails the run unless it is named as browser-only.
- Only one case needs a browser. It skips when Chrome is absent, so the rest of the suite runs anywhere Node runs.

---

## 2. DIRECTORY TREE

```text
tests/
+-- apply-design-md.test.cjs   # DESIGN.md parsing, gated derivation and surgical rewriting
+-- corpus-mutations.test.cjs  # one case per corpus check family, plus the coverage guards
+-- typo-flags.test.cjs        # CLI entry points refuse a misspelled flag
+-- fixtures/                  # Inputs for the applicator suite
`-- README.md
```

`fixtures/` holds vendored v3 `DESIGN.md` references (`stripe`, `vercel`, `linear`, `supabase`) and `refusal-design.md`. They are test inputs, not stock references.

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| [`apply-design-md.test.cjs`](apply-design-md.test.cjs) | Exercises `derive()` and `run()` in process. It covers parsing the vendored and carried references, the two gated themes, refusal before an output directory exists, a themed copy that changes only palette and font regions, byte-identical repeat runs, refusal of an ordered form, and a declared reference line drawn on a form that ships an empty list. The last case needs Chrome and skips when `CHROME_PATH` and the default macOS path are both absent. |
| [`corpus-mutations.test.cjs`](corpus-mutations.test.cjs) | Breaks one rule per case and requires the named family to print the expected failure. Cases run against a temporary copy of a file or the whole package, so the shipped corpus is never touched. Three guard tests assert that every registered family has a case or a browser exemption, that no case names a retired family, and that no exemption outlives its family. |
| [`typo-flags.test.cjs`](typo-flags.test.cjs) | Spawns each CLI entry point with a misspelled flag and requires exit code 2, a message naming the flag, and no side effect. It covers `render-screenshots.cjs` in the shared folder, the chart `check-corpus.cjs`, and the diagram `check-diagram-corpus.cjs`. |
| [`fixtures/`](fixtures/) | Vendored v3 `DESIGN.md` references and one refusal input for the applicator suite. The references live beside the tests, so the suite does not depend on the style generator's examples. |

---

## 4. HOW TO RUN

Run from the repository root.

```bash
# the whole folder
node --test .skilled/skills/sk-design/sk-design-chart/scripts/tests/

# one file at a time
node --test .skilled/skills/sk-design/sk-design-chart/scripts/tests/apply-design-md.test.cjs
node --test .skilled/skills/sk-design/sk-design-chart/scripts/tests/corpus-mutations.test.cjs
node --test .skilled/skills/sk-design/sk-design-chart/scripts/tests/typo-flags.test.cjs
```

Expected result: the run ends with `fail 0` and a `pass` count above zero. The mutation suite takes most of the run time because it spawns the checker once per case. Set `CHROME_PATH` to a Chrome or Chromium binary when the browser is not at the default macOS path.

---

## 5. RELATED

- [`../README.md`](../README.md) covers the scripts this suite tests.
- [`../apply-design-md.cjs`](../apply-design-md.cjs) derives themed copies from a local `DESIGN.md`.
- [`../check-corpus.cjs`](../check-corpus.cjs) owns the check families the mutation suite exercises.
- [`../color-gates.cjs`](../color-gates.cjs) owns the shared contrast arithmetic.
- [`../../references/template-contract.md`](../../references/template-contract.md) holds the per-form rule table behind the corpus checks.
- [`fixtures/references/README.md`](fixtures/references/README.md) records where the vendored references came from.
