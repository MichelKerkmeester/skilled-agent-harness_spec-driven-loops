---
title: "scorer: 5-dimension model-variant scorer"
description: "Decoupled 5-dimension scorer that combines deterministic checks and a pluggable grader into a single weighted score."
trigger_phrases:
  - "5-dimension scorer"
  - "score-model-variant"
  - "5dim scoring"
---

# scorer: 5-dimension model-variant scorer

---

## 1. OVERVIEW

`scorer/` owns the 5-dimension scoring engine for Lane B. `score-model-variant.cjs` takes primitive criteria plus an absolute `cwd`, runs the deterministic check subprocesses and the grader, and returns a weighted score with the per-dimension breakdown.

Current state:

- The public `score()` API takes criteria and an absolute `cwd`, never a fixture file path. The caller passes the criteria as data.
- It synthesizes an in-memory virtual fixture, writes it to a temp JSON, and runs the deterministic check scripts plus the grader against it, then removes the temp dir.
- Dimensions: D1 acceptance, D2 bundle gate (hard gate), D3 cwd/path, D4 grader, D5 pre-planning. Weights live in `DEFAULT_RUBRIC`.
- D2 is the hard gate: when it fails, D1 is capped to 0 and `hard_gate_failed` is set.

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                             scorer/                               │
╰──────────────────────────────────────────────────────────────────╯

┌──────────────────────┐
│ score-model-variant  │  builds virtual fixture (absolute cwd)
│ orchestrating scorer │
└──────────┬───────────┘
           │
   ┌───────┴───────────────────────────────┐
   ▼                                        ▼
┌──────────────────────┐          ┌──────────────────────┐
│ deterministic/       │          │ grader/              │
│ bundle-gate (D2)     │          │ harness gradeD4 (D4) │
│ cwd-check    (D3)    │          │ dispute (escalation) │
│ preplanning  (D5)    │          │ prompts/             │
│ hallucination-flag   │          └──────────┬───────────┘
└──────────┬───────────┘                     │
           │                                  ▼
           │                          ┌──────────────────────┐
           │                          │ lib/cache.cjs        │
           │                          │ grader result cache  │
           │                          └──────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────┐
│ apply hard gate -> weighted score over D1..D5         │
└──────────────────────────────────────────────────────┘

Dependency direction:
score-model-variant ───▶ deterministic/ (spawned subprocess)
score-model-variant ───▶ grader/harness ───▶ lib/cache
grader/ ───▶ prompts/ (system prompts)
deterministic/ and lib/ do not import score-model-variant
```

---

## 3. DIRECTORY TREE

```text
scorer/
+-- score-model-variant.cjs   # Orchestrating scorer with the public score() API
+-- deterministic/            # D1-style + D2/D3/D5 deterministic check scripts
+-- grader/                   # D4 LLM grader harness, dispute, system prompts
`-- lib/                      # Scorer-internal cache (runtime cache/ git-ignored)
```

---

## 4. KEY FILES

| File | Responsibility |
|---|---|
| `score-model-variant.cjs` | Public `score()` orchestration. Synthesizes the virtual fixture, runs each deterministic check via `runDetCheck`, builds the grader via `buildGraderFn`, applies the hard gate, and computes the weighted score. |
| `deterministic/` | Standalone check scripts spawned per dimension: bundle gate, cwd check, pre-planning, hallucination flag. |
| `grader/` | The D4 grader. `harness.cjs` builds the prompt, dispatches, parses, and caches. `dispute.cjs` adds adversarial escalation. |
| `lib/` | Scorer-internal cache module backing the grader. |

---

## 5. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | `score-model-variant.cjs` requires `grader/harness.cjs` and spawns the `deterministic/*.cjs` scripts as subprocesses. `grader/harness.cjs` requires `lib/cache.cjs`. |
| Exports | `score-model-variant.cjs` exports `score`, `buildGraderFn`, `scoreAcceptanceDeterministic`, and `DEFAULT_RUBRIC`. |
| Ownership | This subtree owns the 5-dimension scoring contract. `cwd` passed into `score()` must be absolute. |
| Grader default | `graderKind` defaults to `mock`. `noop` makes D4 a constant 1.0 and `llm` runs the real grader. The benchmark adapter defaults to `noop` for hermetic runs. |

---

## 6. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `score({ candidateId, outputText, criteria, cwd, graderKind })` | Function | Returns `{ fixtureId, weightedScore, dimensions, hard_gate_failed, deterministic, grader, interaction_terms }`. |
| `node score-model-variant.cjs <output.md> <absolute-cwd> [--grader=mock\|llm\|noop]` | CLI | Smoke-runs the scorer against a single output file. |

---

## 7. VALIDATION

Run from the repository root.

```bash
npx vitest run .opencode/skills/deep-improvement/scripts/tests/scorer.vitest.ts
```

Expected result: the scorer suite passes.

---

## 8. RELATED

- [`model-benchmark README`](../README.md)
- [`deterministic README`](./deterministic/README.md)
- [`grader README`](./grader/README.md)
- [`lib README`](./lib/README.md)
