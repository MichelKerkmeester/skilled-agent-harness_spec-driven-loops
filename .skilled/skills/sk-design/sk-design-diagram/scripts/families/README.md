---
title: "sk-design-diagram Check Families"
description: "How the diagram corpus checker loads one rule family per module, what each family holds, and how to run or extend the set."
trigger_phrases:
  - "diagram check families"
  - "add a diagram check family"
  - "diagram corpus checker"
  - "diagram family contract"
  - "grid baseline"
version: 1.2.0.0
---

# sk-design-diagram Check Families

Each module in this folder is one rule the diagram corpus checker enforces. The folder is also the registry, so the set of checks is whatever is on disk.

---

## 1. OVERVIEW

`families/` owns the check modules that `check-diagram-corpus.cjs` loads. Each `.cjs` file is one family and one rule. `grid-baseline.json` is data for `grid-4px.cjs` and holds no logic.

The registry is the directory. On every run the checker reads each `.cjs` file here, sorts the list by name, requires every module to export `name`, `scope` and `run`, then runs it. Adding a file registers a family. Deleting one removes it. The family count the checker prints comes from that listing, so a hand-kept list cannot drift from the code.

Current state:

- 12 families. 10 run once per HTML file, and 2 run once over the whole corpus.
- The file families visit the 38 HTML files under [`assets/diagrams/`](../../assets/diagrams/) on every run.
- The summary prints one line per family with its assertion count, run count and failure count. A family whose rules never reach a file shows zero assertions with a full run count, so an exemption stays visible.
- The run prints `RESULT: PASSED` or `RESULT: FAILED`. Read that line, not the exit code. A run that dies before its first check exits without printing a failure.

---

## 2. FOLDER CONTRACT

A family is a CommonJS module with three exports.

| Export | Value | Rule |
| --- | --- | --- |
| `name` | string | The name used in the summary and in every `record` call. |
| `scope` | `file` or `corpus` | A file family runs once for each HTML file. A corpus family runs once for the run. |
| `run` | function | Receives one context object and reports through `tally` and `record`. |

The loader passes shared helpers to every family: `tally`, `record`, `rel`, `gates`, `palette`, `fs`, `path`, `root`, `formDir`, `stripHtmlComments`, `stripCssComments`, `regionsOf`, `flattenTags` and `htmlFilesUnder`. A file family also receives `file`, `label`, `src`, `clean`, `regions`, `kind`, `isExtra` and `originLabel`. A corpus family receives `files`.

Two calls carry the reporting contract:

- `tally(name, n)` adds assertions. Assertions count values compared, not files visited.
- `record(name, 'error', label, message)` fails the run. Identical findings are reported once.

A delivery passed with `--extra DIR` is judged as the form it was copied from. The checker matches the basename against [`assets/diagrams/`](../../assets/diagrams/), so a themed copy does not answer for rules its source is excused from.

To add a family:

1. Add a module beside these files, named for the rule it holds.
2. Export `name`, `scope` and `run`.
3. Call `tally` before each comparison and `record` with level `error` on a failure.
4. Add a case to `../tests/mutation-cases.cjs`. The suite fails when a registered family has no case and no stated reason it cannot have one.
5. Run the checker and the mutation suite.

---

## 3. KEY FILES

| File | Rule it holds |
| --- | --- |
| [`accessible-svg.cjs`](accessible-svg.cjs) | Requires `<svg role="img">` with a non-empty `<title>` as its first child, an `aria-labelledby` target that exists, and a non-empty `<desc>`. Rejects bare `title` and `desc` ids, because two diagrams inlined on one page would collide. |
| [`catalog-bidirectional.cjs`](catalog-bidirectional.cjs) | Corpus. Reads the sentinel block in [`references/catalog.md`](../../references/catalog.md) and holds the index both ways. Every row names a file that exists, and every worked form in [`assets/diagrams/`](../../assets/diagrams/) has a row. Starters are exempt. |
| [`derivation-gates.cjs`](derivation-gates.cjs) | Requires one palette sentinel pair in a starter, roles defined by the palette source, byte equality for stock blocks, a provenance comment for themed blocks, and every colour re-measured through `../color-gates.cjs`. |
| [`grid-4px.cjs`](grid-4px.cjs) | Measures layout attributes and `g` translate values against a 4px grid. Text, tspan and pattern subtrees are exempt. A new file must be fully on grid, and a known file may not exceed its count in `grid-baseline.json`. |
| [`grid-baseline.json`](grid-baseline.json) | Data only. Maps a corpus file path to the number of off-grid values it may keep. Read by `grid-4px.cjs` and regenerated downward only. |
| [`label-mask-clearance.cjs`](label-mask-clearance.cjs) | Requires 4 user units of clearance between a label mask and every connector, measured on the stroke segments rather than a bounding box. Radar and decoration groups are skipped. |
| [`legend-fidelity.cjs`](legend-fidelity.cjs) | A legend swatch may key only a dash pattern the drawing already paints, including a pattern carried by a stylesheet class. A file with no legend asserts nothing. |
| [`marker-vocabulary.cjs`](marker-vocabulary.cjs) | Holds both halves of the marker pair. A defined `<marker>` must be referenced, and a `url(#id)` reference must have a definition. Starters may define the trio without drawing it. |
| [`metadata.cjs`](metadata.cjs) | Corpus. Holds `SKILL.md` to a four-part version, the `sk-design hub` ownership sentence and one canonical `aria-labelledby` statement. Every packet markdown version must share its major.minor. |
| [`no-external.cjs`](no-external.cjs) | A delivery may fetch only from `fonts.googleapis.com` and `fonts.gstatic.com`. Checks `src`, `href`, `url()` and `@import` across markup, styles and script tags. |
| [`node-budget.cjs`](node-budget.cjs) | Caps tagged elements at 9 `data-diagram-node` and 12 `data-diagram-arrow`. A file that carries neither tag makes no assertion instead of a silent pass. |
| [`orthogonal-connectors.cjs`](orthogonal-connectors.cjs) | A connector must read as an elbow. A diagonal line fails, and a path may use only M, L, H, V, A, Q and Z with no diagonal L segment. Hops, arches and decorations are exempt. |
| [`unique-ids.cjs`](unique-ids.cjs) | Rejects a repeated `id` in one file, because every `url(#...)`, label target and marker reference then has two possible answers. |

---

## 4. HOW TO RUN

Run from the repository root. No install step is needed.

```bash
# the whole corpus through every family
node .skilled/skills/sk-design/sk-design-diagram/scripts/check-diagram-corpus.cjs

# the standing mutation suite, one case per family
node --test .skilled/skills/sk-design/sk-design-diagram/scripts/tests/

# a syntax check after editing a family
for f in .skilled/skills/sk-design/sk-design-diagram/scripts/families/*.cjs; do node --check "$f" || exit 1; done
```

The corpus check prints one line per family and ends with `RESULT: PASSED`. The test suite reports 21 passing cases. The parse loop prints nothing and exits 0.

The checker also accepts `--extra DIR` to run the file families over HTML deliveries outside the package. The parent README lists the full flag surface.

---

## 5. RELATED

| Document | Purpose |
| --- | --- |
| [Parent scripts README](../README.md) | Entrypoints, exit codes and validation for the script folder. |
| [Packet README](../../README.md) | The drawing contract and the workflow around the corpus. |
| [`check-diagram-corpus.cjs`](../check-diagram-corpus.cjs) | The loader. Reads this directory, validates each export and runs every family. |
| [`color-gates.cjs`](../color-gates.cjs) | Shared contrast arithmetic used by `derivation-gates.cjs`. |
| [`tests/`](../tests/) | Mutation suite. One case per family, plus the completeness assertion. |
