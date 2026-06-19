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

- [ ] CHK-001 [P0] Requirements documented in spec.md (REQ-001..006)
- [ ] CHK-002 [P0] Technical approach defined in plan.md (governor-first, default-off, benchmark-before-promote)
- [ ] CHK-003 [P1] Static-router seam confirmed unchanged from research (`memory-context.ts:1292-1311`)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] node --check + tsc pass; no build errors
- [ ] CHK-011 [P0] No console errors or warnings introduced
- [ ] CHK-012 [P1] Governor returns typed results (final | forced-final | aborted-partial); error handling implemented
- [ ] CHK-013 [P1] Code follows Memory MCP patterns (flag gating, strategy-case shape, ACL-gated tool dispatch)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met (SC-001 flag-off byte-identical; SC-002 bounded loop terminates)
- [ ] CHK-021 [P0] Governor bound tests pass (step-cap, cost-ceiling, forced-final-at-terminal)
- [ ] CHK-022 [P1] Edge cases tested (empty input short-circuit, tool failure mid-loop, cost-ceiling before first result)
- [ ] CHK-023 [P1] Benchmark executed; latency/cost/determinism numbers recorded for the promotion decision
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Change classified: new-feature with hard isolation requirement (a routing leak is `cross-consumer` — regresses every deterministic caller)
- [ ] CHK-FIX-002 [P0] Same-class producer inventory: `rg -n "executeStrategy|case '" handlers/memory-context.ts` — only one new case added
- [ ] CHK-FIX-003 [P0] Consumer inventory for the new flag + strategy: `rg -n "SPECKIT_AGENTIC_RECALL|effectiveMode" mcp_server --glob '*.ts'`
- [ ] CHK-FIX-004 [P0] Loop invariant + adversarial cases tested: termination guaranteed (step-cap ∨ cost-ceiling ∨ terminal); unbounded-reasoning, tool-failure, cost-ceiling-first cases covered
- [ ] CHK-FIX-005 [P1] Determinism/isolation axes listed: flag {on,off} × strategy {quick,deep,focused,resume,agentic} before completion claimed
- [ ] CHK-FIX-006 [P1] Flag-off variant executed (process-wide flag state) proving zero agentic code path
- [ ] CHK-FIX-007 [P1] Evidence pinned to a fix SHA / explicit diff range, not a moving branch range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets; no new external capability exposed
- [ ] CHK-031 [P0] Loop tool dispatch ACL-gated to the existing memory tool surface (NFR-S01)
- [ ] CHK-032 [P1] Flag gating prevents the agentic path from running unless explicitly requested
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec/plan/tasks/checklist synchronized
- [ ] CHK-041 [P1] Governor module documents the WHY of each bound (step-cap, cost-ceiling, stop-condition)
- [ ] CHK-042 [P2] Flag documented in ENV_REFERENCE (default-off)
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
| P0 Items | 12 | [ ]/12 |
| P1 Items | 13 | [ ]/13 |
| P2 Items | 2 | [ ]/2 |

**Verification Date**: PENDING (candidate not yet implemented)
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] Architecture decision documented (plan.md ADR-001: governor-first, default-off, prove-first)
- [ ] CHK-101 [P1] ADR has a status (Accepted)
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale (slot-in; iterative-context-extension)
- [ ] CHK-103 [P2] Governor maps to Letta tool-rule DAG shape (`Init→Child→Continue→Terminal`)
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Flag-off path adds zero measurable latency vs baseline (NFR-P01)
- [ ] CHK-111 [P1] Flag-on p95 latency delta reported by the benchmark (NFR-P02)
- [ ] CHK-112 [P2] Determinism variance over N seeded runs documented
- [ ] CHK-113 [P2] Per-call cost benchmark documented
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback documented and trivial (flag default-off = no-op; revert case + governor module)
- [ ] CHK-121 [P0] Feature flag `SPECKIT_AGENTIC_RECALL` configured default-off
- [ ] CHK-122 [P1] Deterministic core (`hybrid-search.ts`, stage2-fusion) confirmed untouched
- [ ] CHK-123 [P2] Promotion runbook (when/how to flip the flag on) drafted
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] Review pass (independent seat) attempts to refute the termination guarantee and isolation claim
- [ ] CHK-131 [P2] No new dependency licenses introduced
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All spec documents synchronized (spec/plan/tasks/checklist)
- [ ] CHK-141 [P2] Research citations resolve (iter-11/17/20/22, roadmap top-7 #7, synthesis/06 #14)
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Technical Lead | [ ] Approved | |
| Independent review seat | QA / Adversarial | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
