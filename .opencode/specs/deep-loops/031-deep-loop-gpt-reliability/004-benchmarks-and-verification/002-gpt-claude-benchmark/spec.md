---
title: "Feature Specification: External Smoke + GPT-vs-Claude Behavioral Benchmark"
description: "8-run (4 modes x 2 models) external, non-OpenCode-shell benchmark measuring route-proof correctness, latency, and a Mode-D-specific failure bucket, run only after phases 008-011 land. Hard precondition: a confirmed genuine external, OPENCODE_PID-free shell must exist before this phase starts."
trigger_phrases:
  - "gpt vs claude benchmark"
  - "external smoke test"
  - "mode d failure bucket"
  - "deep mode benchmark"
importance_tier: "critical"
contextType: "implementation"
predecessor_research: "../007-gpt-behavioral-hardening-research/research/research.md"
_memory:
  continuity:
    packet_pointer: "deep-loops/031-deep-loop-gpt-reliability/004-benchmarks-and-verification/002-gpt-claude-benchmark"
    last_updated_at: "2026-07-01T12:25:00Z"
    last_updated_by: "claude-code"
    recent_action: "Phase drafted from research.md §3, §4 item 4, §5"
    next_safe_action: "Confirm a genuine external OPENCODE_PID-free shell exists before any other work on this phase"
    blockers:
      - "HARD gate: must confirm a genuine external, non-OpenCode shell exists before starting — phase 005 already discovered this gap once and could not complete because of it"
      - "Depends on phases 008-011 landing first (research.md: 'benchmark measures the improved system, and the ai-council leg is meaningful only after 008 lands')"
    key_files:
      - "../007-gpt-behavioral-hardening-research/research/research.md"
      - "../005-gpt-verification-smoke/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-012-init"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "External-shell precondition CONFIRMED SATISFIED: this Claude Code shell has OPENCODE_PID unset and opencode CLI directly reachable -- the exact gap phase 005 hit is closed here."
      - "The Claude/native leg does not need the external shell (only the GPT leg does, per cli-opencode's self-invocation guard) — it can and should be run now as a partial check while the full harness is built, per research.md §3."
      - "Full results, classification, and residual gaps documented in benchmark-results.md -- see that file for the complete cell-by-cell table."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: External Smoke + GPT-vs-Claude Behavioral Benchmark

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-01 |
| **Parent Packet** | `031-deep-loop-issues-with-gpt-opencode` |
| **Predecessor** | `../011-deep-route-guard-plugin/` (and 008-010; benchmark measures the post-fix system) |
| **Successor** | `../013-fix5-checkpoint/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Every prior attempt to get decisive GPT-backed dispatch evidence has been blocked upstream: phase 005 (the packet's original acceptance-gate smoke) never reached a clean pass or disproof because every command-owned smoke was blocked by `cli-opencode`'s self-invocation guard before real leaf-dispatch behavior could be observed. Research (both rounds, all 6 lineages) confirms the fixes in phases 008-011 need a real, decisive measurement to know whether they worked — and identifies two hard preconditions this benchmark must satisfy that phase 005 didn't know it needed: (1) the ai-council leg is uninterpretable until the phase 008 route-proof identity fix has landed; (2) a failure-classification schema must separate `phase0_self_check`/Mode-D failures from generic `route_mismatch`/`missing_artifact`/`timeout_latency` — otherwise a cheap, already-diagnosed Mode-D failure gets miscounted as unresolved GPT unreliability, repeating the exact conflation `gpt-fast-high`'s `stuck_latency` bucket made in round 1 of this packet's own research.

### Purpose

Design and run an 8-run (4 modes × 2 models) benchmark measuring route-proof correctness, latency, and a Mode-D-specific failure bucket — but only after confirming the precondition phase 005 tripped on (a genuine external, `OPENCODE_PID`-free shell) actually exists, and only after phases 008-011 land so the benchmark measures the improved system rather than re-discovering already-diagnosed, already-fixed failure modes.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **Precondition check (do this first, before any other work on this phase):** confirm whether a genuine external, `OPENCODE_PID`-free shell exists in this environment. If not, stop and report — this phase and phase 013 are unreachable until that changes.
- Design the 8-run matrix: 4 deep modes (`context`, `research`, `review`, `ai-council`) × 2 models (Claude, GPT-5.5).
- Design a failure-classification schema with at least: `phase0_self_check`/Mode-D, `route_mismatch`, `missing_artifact`, `timeout_latency` as distinct, non-overlapping buckets.
- Run the Claude/native leg now, as a partial check, even before the full external-shell harness for the GPT leg is confirmed buildable (research.md §3: "it can and should be run now").
- Run the full 8-run benchmark once the precondition is confirmed and phases 008-011 have landed.
- Produce a results artifact (`benchmark-results.md` or equivalent) with route-proof correctness, latency, and Mode-D bucket counts per mode/model cell.

### Out of Scope

- Any implementation work on phases 008-011 themselves — this phase only measures their effect.
- FIX-5/host-identity decision — `../013-fix5-checkpoint/` applies this phase's results against that decision's negative-gate criterion.
- Codex parity (pre-existing, out of scope for the whole packet).

### Files Likely to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `benchmark-results.md` | Create | 8-run results with route-proof/latency/Mode-D breakdown |
| Benchmark harness script(s) (location TBD Phase 1) | Create | Automated or semi-automated runner for the 8-cell matrix |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | External-shell precondition confirmed before proceeding | A genuine, `OPENCODE_PID`-free external shell is identified and verified to actually work for a GPT-leg `cli-opencode` dispatch, before any full-benchmark work begins. |
| REQ-002 | Failure classification separates Mode-D from generic unreliability | Every failure in the benchmark's results is tagged into a specific bucket (`phase0_self_check`, `route_mismatch`, `missing_artifact`, `timeout_latency`), not lumped into one generic "failed" count. |
| REQ-003 | ai-council leg only counted after phase 008 lands | Benchmark results for the ai-council cell are not treated as meaningful if run before phase 008's route-identity fix is in place. |
| REQ-004 | Claude/native leg run early as a partial check | This leg does not wait on the external-shell precondition (it doesn't need it) and should be run as soon as phases 008-011 land, independent of GPT-leg readiness. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: External-shell precondition is either confirmed present (with evidence) or confirmed absent (with the phase explicitly halted and reported, not silently skipped).
- **SC-002**: All 8 cells (or as many as the precondition allows) produce classified results, not raw pass/fail.
- **SC-003**: Mode-D failures are never miscounted as generic `route_mismatch`/`timeout_latency`.
- **SC-004**: `validate.sh --strict` passes for this phase folder once implementation lands.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | No genuine external shell exists in this environment | Entire phase (and 013) is unreachable — this exact gap already blocked phase 005 once | Check this FIRST, before any other phase work; report honestly if blocked rather than attempting a workaround that reintroduces the `cli-opencode` self-invocation guard problem |
| Risk | Running the benchmark before phases 008-011 land | Re-measures already-diagnosed, already-fixed failure modes, wasting the benchmark's value | Explicit sequencing dependency; do not start full benchmark early |
| Dependency | Phases 008-011 | Benchmark measures their combined effect | Must land first (Claude/native leg is the one exception — can run early per REQ-004) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- See frontmatter `open_questions` — the external-shell precondition is the single highest-priority open item in the entire remaining phase chain (research.md §5: "Gate runnability is still the single highest-priority residual").
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Benchmark results must be reproducible — re-running the same 8-cell matrix against unchanged code should produce consistent classification, modulo genuine model-response variance.

### Maintainability
- **NFR-M01**: The failure-classification schema should be reusable by future benchmark or smoke work in this packet, not bespoke to this one run.

### Compatibility
- **NFR-C01**: Benchmark harness must not depend on OpenCode-internal state that the external shell can't access — that's the exact failure mode phase 005 hit.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A run that partially completes (e.g., times out mid-mode) must be recorded as `timeout_latency`, not silently dropped from the results table.

### Error Scenarios
- External shell exists but `cli-opencode`'s guard still blocks the GPT leg for an unrelated reason: treat as a new, distinct finding — do not assume it's the same precondition gap phase 005 hit without confirming.
- Precondition absent: halt and report per REQ-001; do not attempt the Claude-only partial leg as a substitute for the full benchmark's stated purpose (comparing GPT vs Claude) — the partial leg is a baseline, not a replacement.

### State Transitions
- This phase can begin its precondition check immediately, independent of phases 008-011. Its full-benchmark work cannot begin until they land (except the Claude/native partial leg, per REQ-004).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | 8-cell matrix, new classification schema, harness scripting |
| Risk | 20/25 | Entire phase gated on an unconfirmed environmental precondition that already blocked a predecessor phase once |
| Research | 18/20 | Directly and specifically grounded in research.md §3-§5 with named preconditions |
| **Total** | **56/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## RELATED DOCUMENTS

- **Research**: `../007-gpt-behavioral-hardening-research/research/research.md` §3 (KQ table), §4 item 4, §5 (residual risks — gate runnability)
- **Precedent (same precondition gap)**: `../005-gpt-verification-smoke/`
- **Predecessor**: `../011-deep-route-guard-plugin/`
- **Parent Spec**: `../spec.md`
