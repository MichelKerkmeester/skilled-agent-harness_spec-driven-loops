---
title: "Deep-review scripts"
description: "Code-facing entrypoints for review pivots, contract snapshots, runtime capability checks and review tests."
trigger_phrases:
  - "deep-review scripts"
  - "review script entrypoints"
version: 1.0.1.0
---

# Deep-review scripts

---

## 1. OVERVIEW

This folder contains the code entrypoints used by the deep-review workflow. The folder has review pivot logic, contract snapshot rendering, runtime capability reporting and a nested test area.

---

## 2. CONTENTS

```text
scripts/
+-- divergent-review-pivot.ts      # Review pivot input builder (library)
+-- render-contract-snapshot.cjs   # Contract snapshot renderer and drift check
+-- runtime-capabilities.cjs       # Runtime capability resolver
+-- tests/                         # Reducer regression tests
|   `-- fixtures/                  # Pre-built review session fixture
`-- README.md
```

| Entry | Responsibility |
|---|---|
| `divergent-review-pivot.ts` | Library module with no CLI. `buildReviewPivotPreparationInput` derives bounded pivot candidates, prior directions, usage, identity and mandates from review state. `renderReviewPivotSeatPrompt` renders the parseable result contract and read-only boundary for one review seat. |
| `render-contract-snapshot.cjs` | Renders `../assets/review-mode-contract.yaml` into the Markdown contract snapshot. With `--check` it compares instead of writing. Exits `0` when the snapshot is current or written, `1` on drift or a render error and `2` on an unknown option. |
| `runtime-capabilities.cjs` | Reports runtime capabilities used by the review workflow. |
| `tests/` | Holds review-specific test sources. |

---

## 3. BOUNDARIES

The folder owns review-specific script entrypoints and delegates workflow policy to the owning deep-review skill. The nested `tests/` directory is the test boundary for this script surface.

---

## 4. VALIDATION

Run from the repository root. The bare snapshot command rewrites the snapshot, so validation uses `--check`.

```bash
node .skilled/skills/system-deep-loop/deep-review/scripts/render-contract-snapshot.cjs --check
node .skilled/skills/system-deep-loop/deep-review/scripts/tests/reduce-state-summary-fallback.test.cjs
node .skilled/skills/system-deep-loop/deep-review/scripts/tests/reduce-state-traceability-and-refines.test.cjs
```

Expected: the check prints `[render-contract-snapshot] OK: ... is up to date.`, the summary test prints `[deep-review] reduce-state summary fallback regression passed` and the traceability test reports `fail 0`. See [`tests/README.md`](tests/README.md).

---

## 5. RELATED

- [`Deep-review skill`](../SKILL.md)
