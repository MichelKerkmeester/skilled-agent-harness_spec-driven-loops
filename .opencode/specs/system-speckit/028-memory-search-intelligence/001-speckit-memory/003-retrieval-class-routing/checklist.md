---
title: "Verification Checklist: Retrieval-Class Routing & Recall-Shape Intelligence (028/001 impl)"
description: "Verification gates for the retrieval-shape cluster. C2-A/C2-C/C2-B implementation gates are verified. Recall-shape and C-G2 gates remain pending."
trigger_phrases:
  - "retrieval class routing checklist"
  - "c2-a c2-b c2-c verification"
  - "recall shape budget verification"
  - "iterative context extension checklist"
  - "memory mcp router checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/001-speckit-memory/003-retrieval-class-routing"
    last_updated_at: "2026-07-04T17:50:58.974Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Verified C2-A/C2-C/C2-B focused typecheck and unit suites"
    next_safe_action: "Run final broad related Vitest slice and strict phase validation"
    blockers: []
    key_files:
      - "checklist.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:3c0e0998148e8397f22100775a58904048dd9b17123871071df532b9ea48da26"
      session_id: "2026-06-19-028-001-003-retrieval-class-routing-replan"
      parent_session_id: null
    completion_pct: 45
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Retrieval-Class Routing & Recall-Shape Intelligence

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

> Partial implementation stage: C2-A, C2-C and the default-off C2-B mechanism are verified. Recall-shape candidates and C-G2 remain pending.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001..007)
- [x] CHK-002 [P0] Technical approach + sequencing defined in plan.md (C2-A → C2-C/C2-B, recall-shape parallel)
- [x] CHK-003 [P0] C-X1 dependency confirmed satisfied (`bonusOverChannels` live in `rrf-fusion.ts`, 030 `65cfcea513`)
- [ ] CHK-004 [P1] C-G2 keep-or-cut overlap check vs `contextType` + C2-A completed before any C-G2 code (REQ-007)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format + `tsc` typecheck (`npm run typecheck` in MCP server = 0 errors, shared typecheck = 0 errors)
- [ ] CHK-011 [P0] No console errors or warnings in the Memory MCP build
- [x] CHK-012 [P1] C2-A classifier is a total pure function (every query → exactly one class incl. neutral default)
- [x] CHK-013 [P1] Changes extend existing seams (no new gating mechanism for C2-C, existing `RouteResult` axes untouched)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All P0 acceptance criteria met (REQ-001 axis-additivity, REQ-002 single-hop graph-off, REQ-003 per-class weight honoring `weight:0`)
- [x] CHK-021 [P0] Neutral-profile / flags-off regression: fused recall byte-identical to captured baseline
- [x] CHK-022 [P1] Per-class adversarial fixtures pass (SingleHop vs MultiHop routing diverges correctly)
- [ ] CHK-023 [P1] CG-iterative-context-extension termination property test (always stops by convergence OR cap)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each candidate is classed: C2-A = algorithmic (classifier), C2-C/C2-B = cross-consumer (router + fusion), recall-shape = algorithmic, C-G2 = instance-only (gated).
- [x] CHK-FIX-002 [P0] Same-class producer inventory done: `rg -n 'RouteResult|retrievalClass'` and `rg -n 'RankedList|fuseResultsMulti|bonusOverChannels'` across `mcp_server`/`shared`.
- [ ] CHK-FIX-003 [P0] Consumer inventory done for changed surfaces: `RouteResult` readers, fusion-weight consumers, `enforceTokenBudget` callers, `memory_context` strategy router.
- [x] CHK-FIX-004 [P0] C2-A classifier has adversarial table tests (empty query, multi-shape, temporal+entity precedence, neutral default).
- [ ] CHK-FIX-005 [P1] Matrix axes listed before completion: retrieval-class (5) × intent (existing) × complexity tier (3).
- [ ] CHK-FIX-006 [P1] Flag-state variants exercised (each intelligence-class item tested both default-off and enabled).
- [ ] CHK-FIX-007 [P1] Evidence pinned to per-candidate commit SHAs, not a moving branch range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] No new untrusted-content render path introduced (recall-body escaping unchanged, C8 out of scope)
- [x] CHK-032 [P1] Per-class profile that zeroes all channels cannot return an empty channel set (profile application fails closed to original lists)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec/plan/tasks/checklist synchronized for C2-A/C2-C/C2-B and pending gates
- [x] CHK-041 [P1] Per-candidate WHY comments adequate (comment hygiene check = 0 violations on modified files)
- [x] CHK-042 [P2] Per-class weight-calibration follow-up recorded as an explicit deferral (out of scope here)
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
| P0 Items | 14 | 12/14 |
| P1 Items | 25 | 9/25 |
| P2 Items | 7 | 4/7 |

**Verification Date**: 2026-06-19 (partial implementation, final broad suite and strict validation still pending)
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] Architecture decisions documented (plan.md ADR-001 C2-A-first, ADR-002 mechanism-with-neutral-default)
- [ ] CHK-101 [P1] Both ADRs have status (Accepted)
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale (overload-intent-classifier, ship-guessed-weights)
- [x] CHK-103 [P2] Migration path documented, N/A (no schema migration in this cluster)
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-110 [P1] C2-A classification adds negligible per-query latency (pure sync classifier, no I/O, embedding or DB call)
- [ ] CHK-111 [P1] CG-iterative-context-extension worst-case latency bounded by the iteration cap (NFR-P02)
- [ ] CHK-112 [P2] Load testing, N/A at this stage
- [x] CHK-113 [P2] Performance benchmarks documented, deferred to the weight-calibration follow-up
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback documented (flag-off for intelligence-class items, neutral profile / revert for C2-A/B/C) (plan.md §7)
- [ ] CHK-121 [P0] Feature flag configured for each intelligence-class item (iterative extension, tiered budget, C-G2)
- [ ] CHK-122 [P1] Shadow telemetry wired for default-off intelligence-class items (028 doctrine overlay)
- [ ] CHK-123 [P1] Runbook, N/A (branch-only, nothing deployed without explicit go)
- [ ] CHK-124 [P2] Deployment runbook reviewed, N/A
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] Independent adversarial review per candidate (refute the change)
- [x] CHK-131 [P1] No new dependencies introduced
- [x] CHK-132 [P2] OWASP, N/A (no new external surface)
- [x] CHK-133 [P2] Data handling unchanged (no schema migration)
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All spec documents synchronized (spec/plan/tasks/checklist)
- [ ] CHK-141 [P1] Public recall-shape / strategy changes documented
- [ ] CHK-142 [P2] User-facing docs updated (if applicable)
- [ ] CHK-143 [P2] Knowledge transfer / continuity frontmatter updated
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Technical Lead | [ ] Approved | |
| Operator | Product Owner | [ ] Approved | |
| Independent review seat | QA Lead | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
