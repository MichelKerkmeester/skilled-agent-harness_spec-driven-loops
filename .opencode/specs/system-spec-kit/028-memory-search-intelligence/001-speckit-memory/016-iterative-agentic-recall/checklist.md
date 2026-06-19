---
title: "Verification Checklist: Agentic Tool-Loop Recall Strategy (CG-agentic-tool-loop)"
description: "Level-3 verification checklist for the governed ReAct agentic memory_context strategy. Prove-first: governor bounds, flag-off isolation, deterministic-core-untouched, and benchmark evidence are all blockers."
trigger_phrases:
  - "028 agentic tool loop checklist"
  - "CG-agentic-tool-loop checklist"
  - "agentic recall verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/016-iterative-agentic-recall"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored Level-3 verification checklist; all items pending (candidate not implemented)"
    next_safe_action: "Verify governor-bound items first as the governor module is built"
    blockers:
      - "needs-design-prototype + needs-benchmark before completion can be claimed"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-016-agentic-tool-loop"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Benchmark thresholds for promotion pending the prototype run"
    answered_questions: []
---
# Verification Checklist: Agentic Tool-Loop Recall Strategy (CG-agentic-tool-loop)

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

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001..006)
- [x] CHK-002 [P0] Technical approach defined in plan.md (governor-first, default-off, benchmark-before-promote)
- [x] CHK-003 [P1] Static-router seam confirmed unchanged from research — `executeStrategy` is four cases only (`memory-context.ts:1362-1375`; research cited `:1292-1311`), handler `git diff` = 0
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] node --check + tsc pass; no build errors — `npm run typecheck` 0 errors
- [x] CHK-011 [P0] No console errors or warnings introduced — governor is pure (no console/IO)
- [x] CHK-012 [P1] Governor returns typed results (final | forced-final | aborted | degraded | disabled); error handling implemented
- [x] CHK-013 [P1] Code follows Memory MCP patterns (opt-in flag gating, ACL-gated tool dispatch). NOTE: strategy-`case` shape lands with the router wiring (T007, PENDING)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Acceptance criteria — SC-001 (flag-off byte-identical) holds by construction (agentic path unwired, handler diff = 0); SC-002 governor termination proven; the benchmark half of SC-002 is PENDING (T012)
- [x] CHK-021 [P0] Governor bound tests pass (step-cap, cost-ceiling, forced-final-at-terminal) — `agentic-loop-governor.vitest.ts` 18/18
- [x] CHK-022 [P1] Edge cases tested — tool failure mid-loop, cost-ceiling before first result (`degraded`), provider throw. NOTE: empty-input short-circuit is handler-side (T007, PENDING)
- [ ] CHK-023 [P1] Benchmark executed; latency/cost/determinism numbers recorded for the promotion decision — PENDING (needs live LLM + numbers)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Change classified: new-feature with hard isolation requirement (a routing leak is `cross-consumer`); isolation preserved by NOT wiring the hot path here
- [ ] CHK-FIX-002 [P0] Same-class producer inventory: `rg -n "executeStrategy|case '" handlers/memory-context.ts` — zero new cases added yet (wiring is T007, PENDING)
- [x] CHK-FIX-003 [P0] Consumer inventory for the new flag: `rg "SPECKIT_AGENTIC_RECALL"` — consumed only by the governor's fail-closed gate; no router/ranking leak
- [x] CHK-FIX-004 [P0] Loop invariant + adversarial cases tested: termination guaranteed (step-cap ∨ cost-ceiling ∨ terminal); unbounded-reasoning (hard clamp), tool-failure, provider-failure, cost-ceiling-first covered
- [ ] CHK-FIX-005 [P1] Determinism/isolation axes listed: flag {on,off} × strategy {quick,deep,focused,resume,agentic} — full matrix needs the agentic strategy wired (T007, PENDING); governor-level flag {on,off} proven
- [x] CHK-FIX-006 [P1] Flag-off variant executed (process-wide flag state) proving zero agentic code path — flag off → `disabled`, 0 steps, provider never invoked
- [ ] CHK-FIX-007 [P1] Evidence pinned to a fix SHA / explicit diff range — PENDING: not committed (no SHA); evidence is the working-tree diff
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets; no new external capability exposed
- [x] CHK-031 [P0] Loop tool dispatch ACL-gated (NFR-S01) — `allowedTools` allowlist; an out-of-set tool aborts; an absent/empty set denies everything
- [x] CHK-032 [P1] Flag gating prevents the agentic path from running unless explicitly requested — governor fails closed when the flag is off
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec/plan/tasks/checklist synchronized
- [x] CHK-041 [P1] Governor module documents the WHY of each bound (step-cap, cost-ceiling, stop-condition) — module header + per-bound comments
- [ ] CHK-042 [P2] Flag documented in ENV_REFERENCE (default-off) — DEFERRED (P2): flag JSDoc in `search-flags.ts` is the durable doc; ENV_REFERENCE row is optional follow-up
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — none created
- [x] CHK-051 [P1] scratch/ cleaned before completion — no scratch artifacts
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 9/12 (CHK-020, CHK-FIX-002 PENDING wiring; CHK-130 not P0) |
| P1 Items | 13 | 9/13 (CHK-023, CHK-FIX-005/007, CHK-111, CHK-130 PENDING) |
| P2 Items | 6 | 3/6 (CHK-042, CHK-112/113, CHK-123 deferred/PENDING) |

**Verification Date**: 2026-06-19 — Phase 1 (governor + flag) verified; Phase 2/3 (wiring + benchmark) PENDING
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decision documented (plan.md ADR-001: governor-first, default-off, prove-first)
- [x] CHK-101 [P1] ADR has a status (Accepted)
- [x] CHK-102 [P1] Alternatives documented with rejection rationale (slot-in; iterative-context-extension)
- [x] CHK-103 [P2] Governor maps to Letta tool-rule DAG shape (`Init→Child→Continue→Terminal`) — `AgenticPhase` + phase progression in the governor
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-110 [P1] Flag-off path adds zero measurable latency vs baseline (NFR-P01) — zero by construction: the agentic path is unwired and the deterministic path diff = 0
- [ ] CHK-111 [P1] Flag-on p95 latency delta reported by the benchmark (NFR-P02) — PENDING (T012)
- [ ] CHK-112 [P2] Determinism variance over N seeded runs documented — PENDING (T012)
- [ ] CHK-113 [P2] Per-call cost benchmark documented — PENDING (T012)
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback documented and trivial (flag default-off = no-op; revert governor module + flag)
- [x] CHK-121 [P0] Feature flag `SPECKIT_AGENTIC_RECALL` configured default-off (opt-in via `isOptInEnabled`)
- [x] CHK-122 [P1] Deterministic core (`hybrid-search.ts`, `stage2-fusion.ts`) confirmed untouched — `git diff --stat` empty
- [ ] CHK-123 [P2] Promotion runbook (when/how to flip the flag on) drafted — DEFERRED (P2): depends on the benchmark thresholds (T012)
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] Review pass (independent seat) attempts to refute the termination guarantee and isolation claim — PENDING (no independent review run yet)
- [x] CHK-131 [P2] No new dependency licenses introduced — zero new dependencies
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] All spec documents synchronized (spec/plan/tasks/checklist/implementation-summary)
- [x] CHK-141 [P2] Research citations resolve (iter-11/17/20/22, roadmap top-7 #7, synthesis/06 #14)
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Technical Lead | [ ] Approved | |
| Independent review seat | QA / Adversarial | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
