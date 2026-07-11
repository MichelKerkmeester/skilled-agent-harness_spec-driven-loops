---
title: "Verification Checklist: Substrate Code-Graph scenario tool-contract fix"
description: "Verification Date: 2026-05-30"
trigger_phrases:
  - "substrate code-graph tool-contract checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/008-code-graph-scatter/003-substrate-codegraph-scenarios"
    last_updated_at: "2026-05-30T23:10:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored checklist to manifest scaffold"
    next_safe_action: "Gate then commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/manual_testing_playbook/local-llm-query-intelligence/403-code-intent-matching.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003613"
      session_id: "036-002-checklist"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Substrate Code-Graph scenario tool-contract fix

<!-- SPECKIT_LEVEL: 2 -->
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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P0] Authoritative schema read in system-code-graph (two earlier wrong-file claims corrected)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Corrected payload matches the verified code_graph_context schema (input + queryMode; required:[])
- [x] CHK-011 [P0] No residual code_graph_query / query: / num_results: in 403/404/407
- [x] CHK-012 [P1] 410 playbook untouched (still memory_search)
- [x] CHK-013 [P1] Query text content preserved verbatim (only tool + keys changed)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] 10 code_graph_context calls total across the 3 files (403:4, 404:3, 407:3)
- [x] CHK-021 [P0] No regression: 403/404/407 SKIP before AND after the edit
- [x] CHK-022 [P1] Pre-existing runner:mk-spec-memory FAIL + 410 SKIP confirmed unrelated (memory daemon, not code-graph; doc edits cannot affect it)
- [x] CHK-023 [P1] Live-daemon execution stays deferred and documented
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class: `cross-consumer` (playbook → tool-schema contract)
- [x] CHK-FIX-002 [P0] Same-class producer inventory: all 3 affected playbooks fixed; 410 verified not affected
- [x] CHK-FIX-003 [P0] Consumer inventory: substrate runner is the only payload parser of 403/404/407 (benchmarks use 409); confirmed
- [x] CHK-FIX-004 [P0] Schema-validity verified against the AUTHORITATIVE tool schema (system-code-graph), not assumed
- [x] CHK-FIX-005 [P1] Axes listed: (tool name, param keys) across 3 files
- [x] CHK-FIX-006 [P1] N/A — no env/global-state code path
- [x] CHK-FIX-007 [P1] Evidence pinned to the commit
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] No new external input
- [x] CHK-032 [P1] No auth surface touched
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks/checklist/implementation-summary synchronized
- [x] CHK-041 [P1] Comment-hygiene N/A (markdown playbooks, no code comments)
- [x] CHK-042 [P2] No README change required
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Only the 3 playbooks + this packet touched
- [x] CHK-051 [P1] Commit scoped with explicit pathspecs (no `git add -A`); test-regenerated TSV restored
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 10 | 10/10 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-05-30
<!-- /ANCHOR:summary -->
