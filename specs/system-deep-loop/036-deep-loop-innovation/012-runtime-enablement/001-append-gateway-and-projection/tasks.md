---
title: "Tasks: Append Gateway and Legacy Projection"
description: "Task breakdown for building the append gateway, its refusal paths, the legacy projection refresh, and the six-consumer reader contract."
trigger_phrases:
  - "append gateway tasks"
  - "reader contract tasks"
importance_tier: "important"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/001-append-gateway-and-projection"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/001-append-gateway-and-projection"
    last_updated_at: "2026-08-19T07:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Decomposed the gateway build into five task groups"
    next_safe_action: "Run T-001 and capture the suite baseline"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/cutover-binding.vitest.ts"
    completion_pct: 0
    open_questions:
      - "Projection-refresh failure mode after a durable append"
    answered_questions: []
---
# Tasks: Append Gateway and Legacy Projection

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] **T-001** Run the runtime unit suite unchanged and write the file/test counts and any pre-existing failures to
  `scratch/suite-baseline.txt`. No source file is edited before this completes.
- [ ] **T-002** Record the exact vitest invocation used, so the delta run is the same command and not a narrower one.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] **T-003** Create `runtime/lib/mode-append-gateway/` with an `appendModeEvent` entry point taking mode, run
  directory, and event record.
- [ ] **T-004** Compose bind → envelope → authorize → fenced append, returning the receipt the fenced writer produces.
- [ ] **T-005** [P] Add the happy-path test: append against a temp ledger, then read the event back through the
  authorized ledger's own read path rather than by parsing the file.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] **T-006** Refuse an event whose envelope fails the mode schema; the error names the failing field.
- [ ] **T-007** Refuse an append the authorization gateway denies; the error names the failing check.
- [ ] **T-008** For T-006 and T-007, remove the guard, observe the test fail, restore the guard, and record both
  outcomes in `scratch/negative-controls.md`. A refusal test that has never been seen red is not evidence.
- [ ] **T-009** Concurrency: two appends race on one mode's ledger; assert two receipts and a totally ordered ledger.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] **T-010** Refresh the legacy projection after a successful append, at the manifest's declared refresh boundary.
- [ ] **T-011** Decide and record the projection-refresh failure mode; implement whichever is chosen and test it.
- [ ] **T-012** Reader contract: run `fanout-run.cjs`, `fanout-merge.cjs`, `fanout-salvage.cjs`, `verify-iteration.cjs`,
  `reduce-state.cjs`, and `divergent-research-pivot.ts` against a projected file; record each exit status.
- [ ] **T-013** CLI entry point plus a smoke test that appends and projects without a TypeScript caller.
- [ ] **T-014** Re-run the full suite, diff against the T-001 baseline, and report the delta rather than a bare pass.
- [ ] **T-015** `validate.sh` on this folder with `--strict`; Errors: 0.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

| Reference | Location |
|-----------|----------|
| Requirements | `spec.md` §4 |
| Success criteria | `spec.md` §5 |
| Quality gates | `plan.md` §2 |
| Verification contract | `checklist.md` |
| Successor phase | `../002-deep-research-enablement/` |
<!-- /ANCHOR:cross-refs -->
