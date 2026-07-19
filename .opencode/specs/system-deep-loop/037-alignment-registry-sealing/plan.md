---
title: "Implementation Plan: deep-alignment registry seal-state"
description: "Phased plan to add overall.sealed, wire the seed/refresh/synthesis reduces in both alignment workflows, document, and regression-test."
_memory:
  continuity:
    packet_pointer: "system-deep-loop/037-alignment-registry-sealing"
    last_updated_at: "2026-07-19T15:25:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author the phased plan for the sealed-registry fix"
    next_safe_action: "Implement Phase 1 (reducer)"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: deep-alignment registry seal-state

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

The reducer `runtime/scripts/reduce-alignment-state.cjs` is the source of truth for per-lane and overall verdicts. The seed and terminal synthesis both call it today; the `if_continue` path does not, so a mid-loop death strands the fail-closed seed.

### Overview

Add a `sealed` boolean to the reducer's `overall` rollup, drive it from a `--seal` / `options.seal` input, and wire both alignment workflows so only the terminal synthesis reduce seals — while a new per-iteration refresh keeps the registry current. Ship with a 5-case regression test and consistent runtime docs.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- Root cause confirmed against the real packet-012 log (done).
- Fail-closed seed behavior understood and preserved.

### Definition of Done

- `node -c` parses the reducer; both YAML files `yaml.safe_load` clean.
- `reducer-seal-state.test.cjs` passes all 5 cases.
- `reducer-fail-closed.test.cjs` + `state-machine-wiring.test.cjs` still pass.
- `validate.sh <folder> --strict` → Errors 0.

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

`overall.sealed` is a single orthogonal flag layered on the existing verdict. Verdict-derivation and fail-closed logic are untouched; `sealed` answers only "is this the authoritative terminal reduce?"

### Key Components

- **Reducer:** `buildOverallRollup` emits `sealed` from `integrity.sealed`; `reduceAlignmentState` threads `options.seal`; CLI parses `--seal`.
- **Workflows:** seed + per-iteration refresh call the reducer without `--seal` (preliminary); `phase_synthesis`'s `step_run_reducer` calls it with `--seal` (authoritative). The refresh runs right after the convergence read every iteration, so any mid-loop death leaves the registry reflecting completed iterations rather than the stranded seed.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Reducer

Add `sealed` to `buildOverallRollup` (from `integrity.sealed`), thread `options.seal` through `reduceAlignmentState`, surface it in `renderAlignmentReport` (PRELIMINARY/SEALED banner), parse `--seal` in the CLI + emit `sealed` in the stdout JSON, update the JSDoc.

### Phase 2: Workflow wiring + docs

In both `deep-alignment-auto.yaml` and `deep-alignment-confirm.yaml`: annotate the seed as unsealed, insert `step_refresh_registry` (unsealed) after `step_check_convergence`, add `--seal` to the synthesis `step_run_reducer`. Update `alignment-report-reducer.md` to document the field + lifecycle.

### Phase 3: Verify

Author `reducer-seal-state.test.cjs`, run the reducer suite for a no-regression delta, validate the packet strict.

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Plain-script `node` tests using `os.tmpdir()` fixtures (matching the existing reducer tests). Cover the seed, a completed-iteration stranded run, fail-closed-under-seal, the unit rollup flag, and the CLI `--seal` end-to-end (child process writes + reads the registry). Baseline the full suite with changes stashed to prove the 4 `command-*` failures are pre-existing.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None new — Node built-ins (`node:assert`, `node:child_process`, `node:fs`, `node:os`, `node:path`).

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

A single-commit revert restores the prior reducer + workflows; `sealed` is additive so no consumer breaks on rollback. The new test file is removed with the revert.

<!-- /ANCHOR:rollback -->
