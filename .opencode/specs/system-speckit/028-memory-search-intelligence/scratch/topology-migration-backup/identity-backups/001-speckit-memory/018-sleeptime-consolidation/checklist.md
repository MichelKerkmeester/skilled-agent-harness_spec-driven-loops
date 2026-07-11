---
title: "Verification Checklist: Async Sleep-Time Consolidation (governed off-turn reorganization)"
description: "Level-3 verification checklist for the governed, default-off, shadow-gated off-turn memory-reorganization pass. Prove-first: governor bounds, off-turn isolation (sync byte-identical + zero off-turn archival mutation), idempotency against 010's cursor and shadow-telemetry evidence are all blockers."
trigger_phrases:
  - "async sleep-time consolidation checklist"
  - "sleeptime agent verification"
  - "off-turn reorganization checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/001-speckit-memory/018-sleeptime-consolidation"
    last_updated_at: "2026-07-04T17:51:07.543Z"
    last_updated_by: "codex"
    recent_action: "Verified default-off governor and shadow scaffold with deterministic tests"
    next_safe_action: "Keep dispatch/live writes pending"
    blockers:
      - "needs-design-prototype + depends-on-010 + needs-benchmark before completion can be claimed"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-018-sleeptime-consolidation"
      parent_session_id: null
    completion_pct: 35
    open_questions:
      - "Shadow-telemetry promotion thresholds pending the prototype run"
    answered_questions: []
---
# Verification Checklist: Async Sleep-Time Consolidation (governed off-turn reorganization)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001..008)
- [x] CHK-002 [P0] Technical approach defined in plan.md (governor-first, default-off, shadow-gated, prove-first)
- [x] CHK-003 [P1] Synchronous-only seam confirmed from research (`reconsolidation-bridge.ts` on-save, no background agent, 028/007 iter-20)
- [ ] CHK-004 [P1] Sibling 010 dependency confirmed (C-G1 clock host + C4-C cursor + `LT-turn-cadence-trigger` gate land in 010)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] node --check + tsc pass, no build errors
- [ ] CHK-011 [P0] No console errors or warnings introduced
- [x] CHK-012 [P1] Governor returns typed results (terminal | forced-terminal | aborted-partial), abort handling implemented
- [ ] CHK-013 [P1] Code follows Memory MCP patterns (flag gating, cognitive-module shape, ACL-gated tool dispatch), LLM-chunking path is additive to the markdown chunker
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met (SC-001 flag-off sync byte-identical + zero off-turn archival mutation, SC-002 governor bounds + cursor idempotency)
- [x] CHK-021 [P0] Governor bound tests pass (step-cap, cost-ceiling, forced-terminal, no early bail)
- [ ] CHK-022 [P1] Edge cases tested (empty cadence tick no-op, tool failure mid-cycle, overlapping cadence ticks skipped, clock replay re-derives) - PENDING: governor/no-op/tool-failure cases are covered, overlapping cadence and clock replay require sibling 010 dispatch/cursor
- [ ] CHK-023 [P1] Shadow telemetry executed, off-turn reorganization candidates / would-archive ranges recorded for the promotion decision
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Change classified: new-capability that mutates archival off-turn with a hard isolation requirement (an off-turn leak is `cross-consumer` - degrades recall for every reader)
- [x] CHK-FIX-002 [P0] Same-class producer inventory: `rg -n "reconsolidat|consolidat" mcp_server/handlers mcp_server/lib --glob '*.ts'` - the off-turn agent is the only off-turn producer
- [x] CHK-FIX-003 [P0] Consumer inventory for the new flag + agent: `rg -n "SPECKIT_SLEEPTIME_CONSOLIDATION|sleeptime|turns_counter" mcp_server --glob '*.ts'`
- [ ] CHK-FIX-004 [P0] Loop invariant + adversarial cases tested: termination guaranteed (step-cap ∨ cost-ceiling ∨ terminal), unbounded-reasoning and tool-failure cases covered, overlapping-cadence and clock-replay cases remain PENDING until sibling 010 dispatch/cursor exists
- [ ] CHK-FIX-005 [P1] Isolation/mutation axes listed: flag {on,off} × mode {shadow,live} × sync-on-save path before completion claimed
- [ ] CHK-FIX-006 [P1] Flag-off + shadow-default variants executed (process-wide flag state) proving zero off-turn archival mutation by default
- [ ] CHK-FIX-007 [P1] Evidence pinned to a fix SHA / explicit diff range, not a moving branch range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets, no new external capability exposed
- [x] CHK-031 [P0] Off-turn tool dispatch ACL-gated to the existing memory tool surface (NFR-S01)
- [x] CHK-032 [P1] Flag gating + shadow default prevent any live archival write unless explicitly opted in
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec/plan/tasks/checklist synchronized
- [x] CHK-041 [P1] Governor module documents the WHY of each bound (step-cap, cost-ceiling, terminal stop), the shadow default's tail-risk rationale recorded
- [ ] CHK-042 [P2] Flags documented in ENV_REFERENCE (default-off + shadow sub-flag)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | [8]/13 |
| P1 Items | 14 | [6]/14 |
| P2 Items | 3 | [0]/3 |

**Verification Date**: 2026-06-19 (safe core partial, benchmark/cadence/cursor-dependent items pending)
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decision documented (plan.md ADR-001: governor-first, default-off, shadow-gated, prove-first)
- [x] CHK-101 [P1] ADR has a status (Accepted)
- [x] CHK-102 [P1] Alternatives documented with rejection rationale (slot-in live-write, second clock/counter, up-front episode substrate)
- [x] CHK-103 [P2] Governor maps to Letta tool-rule DAG shape (`Init→Child→Continue→Terminal`), reuse for sibling 016 documented
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Flag-off path adds zero measurable cost to the synchronous on-save path (NFR-P01)
- [ ] CHK-111 [P1] Governed off-turn cost bound (`step-cap × per-step cost`) reported by the shadow harness (NFR-P02)
- [ ] CHK-112 [P2] Cadence amortization documented (default frequency 5, off-turn cost spread across ticks)
- [ ] CHK-113 [P2] Per-pass would-archive volume recorded for the promotion decision
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback documented and trivial (flag default-off + shadow default = no archival writes, revert agent/governor/chunking-path)
- [x] CHK-121 [P0] Feature flag `SPECKIT_SLEEPTIME_CONSOLIDATION` configured default-off, live archival write is a separate opt-in
- [ ] CHK-122 [P1] Synchronous on-save reconsolidation (`reconsolidation-bridge.ts`) confirmed unaltered in the flag-off state
- [ ] CHK-123 [P2] Promotion runbook (when/how to flip from shadow to live archival write) drafted
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] Review pass (independent seat) attempts to refute the termination guarantee, the off-turn isolation and the cursor-idempotency claim
- [x] CHK-131 [P2] No new dependency licenses introduced
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All spec documents synchronized (spec/plan/tasks/checklist)
- [ ] CHK-141 [P2] Research citations resolve (028/007 iter-20, roadmap MEMORY-SYSTEMS ADDENDUM Initiative B, synthesis/06 Initiative B + #14)
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Technical Lead | [ ] Approved | |
| Independent review seat | QA / Adversarial | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
