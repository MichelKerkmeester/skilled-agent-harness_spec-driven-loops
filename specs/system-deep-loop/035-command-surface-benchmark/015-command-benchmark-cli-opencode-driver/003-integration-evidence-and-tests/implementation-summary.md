---
title: "Implementation Summary: cli-opencode Leg Integration, Evidence & Regression"
description: "Planning stub for the integration/evidence/regression child phase — not yet implemented. Records the intended end-to-end run, evidence capture, tests, and byte-stability regression proof."
trigger_phrases:
  - "implementation summary cli-opencode leg integration"
  - "benchmark regression planning stub"
  - "end-to-end opencode leg impl summary"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/035-command-surface-benchmark/015-command-benchmark-cli-opencode-driver/003-integration-evidence-and-tests"
    last_updated_at: "2026-07-22T11:30:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored L2 implementation stub"
    next_safe_action: "Capture live run on isolated worktree"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/command-benchmark/run-command-behavior-matrix.cjs"
      - ".opencode/skills/system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-loop-035-015-003-integration-evidence-and-tests-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary: cli-opencode Leg Integration, Evidence & Regression

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-integration-evidence-and-tests |
| **Status** | Planned — not yet implemented |
| **Completed** | Pending |
| **Level** | 2 |
| **Actual Effort** | Not yet started (estimated: 7-11 hours) |


<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

Not yet implemented. This is a planning stub. The intended work flips ≥1 new cli-opencode driver
cell from `skip` to live, runs the scheduler → runner → `opencode run` path end-to-end, captures the
result JSON + transcript + reconciliation evidence, adds integration tests (deterministic via the
`BEHAVIOR_BENCH_SPAWN_JSON` spawn stub), and proves the frozen `claude-cli` / `gpt-fast-high` /
`gpt-fast-med` legs and all fixture hashes are byte-stable.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-deep-loop/deep-alignment/assets/command-benchmark/command-benchmark-matrix.json` | Planned (Modify) | Flip chosen cell(s) `skip` → `resultPointer`. Not yet edited. |
| (new) benchmark integration test | Planned (Create) | Runner + scheduler assertions; exact path TBD (locate the existing test tree). |


<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered — planning stub. Planned as a bounded end-to-end capture on an isolated worktree, verified by emitted result/reconciliation evidence and a byte-stable frozen-leg regression diff once implemented.
<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Prove evidence shape, not a fixed verdict | Live model dispatch is nondeterministic; a scored failure is still a runner SUCCESS |
| Use `BEHAVIOR_BENCH_SPAWN_JSON` for CI tests | Deterministic, offline; the runner already supports this spawn-override seam |
| Flip the minimum cells (start with `DAB-012`) | Smallest blast radius; leaf sentinel is the natural first target |
| Byte-diff the frozen legs + fixtures | The explicit regression proof the parent requires |
| Auth failure → `retryable` (exit 75) | The runner/scheduler already model quota rejection as non-fatal |
| **UNKNOWN**: first scenario; test path; samples; live-vs-stubbed CI | Deferred to implementation (OPEN QUESTIONS) |


<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Coverage | Notes |
|-----------|--------|----------|-------|
| Integration (stubbed) | Pending | - | Runner emits well-formed `cli-opencode` result |
| Integration (scheduler) | Pending | - | Reconciliation accounts for the live cell |
| Live (bounded) | Pending | - | One real `opencode run` capture |
| Regression (byte-diff) | Pending | - | Frozen legs + fixtures unchanged |

### Test Coverage Summary

Pending — no implementation yet.


<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR ID | Target | Actual | Status |
|--------|--------|--------|--------|
| NFR-R01 | Retryable cell does not corrupt reconciliation | Pending | Pending |
| NFR-R02 | Watchdog (120s) / budget (900s) bound each cell | Pending | Pending |
| NFR-I01 | `isolation.violations` empty | Pending | Pending |
| NFR-I02 | Post-run fixture `git status` clean | Pending | Pending |
| NFR-X01 | Evidence artifacts captured under out-dir | Pending | Pending |


<!-- /ANCHOR:nfr-verify -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Depends on 001 + 002** — no live capture can start until the schema and dispatch wiring land.
2. **Live nondeterminism** — the first live result's classification is not a stable assertion; only
   evidence shape and reconciliation accounting are.
3. **Binary/auth required for the live leg** — CI can run the stubbed path offline, but the real
   capture needs `opencode` installed and the default provider authed.
4. **Test path unknown** — the benchmark test tree must be located before adding tests; no path is
   assumed here.


<!-- /ANCHOR:limitations -->
---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| (none yet) | (none yet) | Not yet implemented |

<!-- /ANCHOR:deviations -->
