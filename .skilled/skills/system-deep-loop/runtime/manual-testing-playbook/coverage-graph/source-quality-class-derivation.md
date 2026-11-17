---
title: "DLR-061 -- Source quality class derivation"
description: "This scenario validates the derived quality_class on research SOURCE nodes for `DLR-061`. It focuses on the path-first classification at upsert and on the source-diversity signal that reads it."
version: 1.0.0.0
---

# DLR-061 -- Source quality class derivation

This document captures the realistic user-testing contract, execution flow, and metadata for `DLR-061`.

---

## 1. OVERVIEW

This scenario validates the derived `quality_class` for `DLR-061`. It focuses on two points: `upsert.cjs` sets `quality_class` on every research SOURCE node it stores, derived from the node's path first, then its label, then its id, and the `sourceDiversity` signal now reads those derived classes on normal runs instead of only on fixtures that typed one in.

### Why This Matters

Before this change no producer set `quality_class`, so the source-diversity guard had nothing real to read. If the derivation runs on the wrong field, a free-text label can hide a repo path, and a leaf-supplied value can override the classification the runtime owns. Either failure lets a code-only research question pass the diversity guard it should block.

---

## 2. SCENARIO CONTRACT

Operators run this as a single check against the upsert path and the signal that reads it, with the shipped tests as the executable anchor.

- Objective: Confirm that a stored research SOURCE node carries the class derived from its path, that a leaf-supplied class is overwritten, and that a question answered only from code files still blocks at `source_diversity_guard`.
- Layer partition: coverage graph runtime.
- Real user request: A research question answered from source code should not pass the diversity guard on code alone, and the stored source should say what kind of source it is.
- Prompt: `Upsert a research source with a repo test path and a leaf-supplied quality_class that disagrees, then confirm the stored class follows the path and that a question answered only from code files still blocks at the source diversity guard.`
- Expected signals: The stored `quality_class` is `repo-test` for the test path, the leaf-supplied value is gone, a question answered only from code files scores 1.0 and blocks, and code plus its tests scores 2.0 and passes.
- Pass/fail: PASS if the stored class follows the path, the leaf value is overwritten, and both diversity scores match; FAIL if the label or the leaf value decides the class, or the code-only question passes.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is the repository root.
- The runtime dependencies are installed under `.skilled/skills/system-deep-loop/runtime`.

### Commands

1. `rg -n 'SOURCE_QUALITY_CLASS|deriveSourceQualityClass|classifySourceLocation' .skilled/skills/system-deep-loop/runtime/lib .skilled/skills/system-deep-loop/runtime/scripts`
2. `rg -n "'repo-code'" .skilled/skills/system-deep-loop/runtime/scripts .skilled/skills/system-deep-loop/runtime/lib`
3. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/integration/upsert-script.vitest.ts tests/integration/convergence-script.vitest.ts tests/unit/coverage-graph-signals.vitest.ts tests/unit/deep-research-graph-upsert.vitest.ts`
4. `cd .skilled/skills/system-deep-loop/runtime && npm run -s typecheck`

### Expected

Command 1 prints the frozen vocabulary constant, the classifier and the derivation helper. Command 2 prints one vocabulary literal, `coverage-graph-query.ts:142`, so no second copy of the class names exists. Command 3 exits 0 with all cases passing, including the path-over-label case, the eight-class derivation case and the three source-diversity cases. Command 4 exits 0 with no output.

### Evidence

Capture the command 1 and 2 matches, the command 3 pass count and exit status, and the command 4 exit status.

### Pass / Fail

- **Pass**: The path-over-label and leaf-overwrite cases pass, the code-only question scores 1.0 and blocks, code plus tests scores 2.0 and passes, and the typecheck exits 0.
- **Fail**: A label or leaf value decides the class, the code-only question passes the guard, a second copy of the class names exists, or the typecheck fails.

### Failure Triage

If the classification is wrong, check the order in `classifySourceLocation` first: the path decides, then the label, then the id. If the diversity score is wrong, check that the seeded fixtures carry paths and not labels, since a label-only fixture cannot produce a derived class.

### Optional Supplemental Checks

- Pass-through: a FINDING node keeps its metadata exactly as sent, so the derivation runs on SOURCE nodes only.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/coverage-graph/coverage-graph-signals.md` | Feature-catalog source for the signals that read the class |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs` | Derives `quality_class` on each SOURCE node in the node loop |
| `.skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-query.ts` | Frozen `SOURCE_QUALITY_CLASS` vocabulary |
| `.skilled/skills/system-deep-loop/runtime/tests/integration/upsert-script.vitest.ts` | Path-over-label, eight-class and pass-through cases |
| `.skilled/skills/system-deep-loop/runtime/tests/integration/convergence-script.vitest.ts` | Source-diversity cases: 2.0, 1.0 with guard, code plus tests 2.0 |

---

## 5. SOURCE METADATA

- Group: COVERAGE GRAPH
- Playbook ID: DLR-061
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `coverage-graph/source-quality-class-derivation.md`
