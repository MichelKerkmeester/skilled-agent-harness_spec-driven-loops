---
title: "tests: Lane B + sweep framework vitest suite"
description: "The vitest suite that guards the deep-improvement Lane B benchmark and the config-driven sweep framework — scorers, the correctness gate, the matrix sweep runtime, the dispatch envelope, paired-bootstrap stats, and dispatch cwd-isolation."
trigger_phrases:
  - "model-benchmark tests"
  - "sweep vitest suite"
  - "sweep-isolation test"
  - "dispatch envelope test"
---

# tests: Lane B + sweep framework vitest suite

---

## 1. OVERVIEW

`tests/` holds the vitest suite for the whole `model-benchmark/` surface — both the original deep-improvement Lane B grader and the config-driven *sweep* framework built on top of it. The suite is additive: the Lane B baseline stays green while every sweep feature lands behind its own spec file. Run the whole suite from the skill's `scripts/` root:

```bash
cd .opencode/skills/deep-loop-workflows/deep-improvement/scripts && npx vitest run model-benchmark/tests/
```

Current state:

- The suite is green at **158 tests across 12 files**.
- Lane B tests (scorer, opt-in 5-dim scorer, grader/runner hardening, remediation) cover the legacy agent-improvement benchmark path.
- Sweep tests (foundation, runtime, acceptance, stats-CI, isolation, dispatch-envelope) cover the matrix expander, correctness gate, trust verdict, normalized dispatch envelope, and per-cell cwd-isolation.
- `sweep-isolation` is the safety net for the real-dispatch path: it asserts each cell runs in an `os.tmpdir()` working directory (never the repo root) and is cleaned up, so an agentic model's stray writes cannot pollute the repo.

---

## 2. KEY FILES

| File | Tests | Covers |
|---|---|---|
| `scorer.vitest.ts` | 10 | Legacy Lane B pattern/graded scorer behavior. |
| `optin-scorer.vitest.ts` | 3 | The opt-in 5-dimension scorer wiring. |
| `grader-harness-hardening.vitest.ts` | 7 | Grader harness edge cases and failure handling. |
| `run-benchmark-hardening.vitest.ts` | 6 | `run-benchmark.cjs` argument/profile hardening. |
| `bundle-gate-exec-gate.vitest.ts` | 4 | Bundle/exec gating logic. |
| `remediation.vitest.ts` | 22 | Remediation-path behavior for Lane B findings. |
| `sweep-foundation.vitest.ts` | 26 | Matrix expansion (cartesian cells, no mode branches), framework rendering, profile validation. |
| `sweep-runtime.vitest.ts` | 13 | Sweep run orchestration, scoring per cell, reporting wiring. |
| `sweep-acceptance.vitest.ts` | 11 | End-to-end sweep acceptance over fixtures (mock-mode). |
| `sweep-stats-ci.vitest.ts` | 19 | Dependency-free stats: MAD noise floor, quantiles, seeded paired-delta bootstrap CI, verdict gates. |
| `dispatch-envelope.vitest.ts` | 18 | Normalized dispatch envelope (latency, nullable tokens/cost, OpenCode JSON-stream usage parsing). |
| `sweep-isolation.vitest.ts` | 15 | Per-cell cwd is under `os.tmpdir()` (not repo root), holds the prompt file, is cleaned up after single + multi-cell sweeps, and a simulated model write does not leak; plus fixture-shape + profile-load coverage for the hard / validation fixture packs. |
