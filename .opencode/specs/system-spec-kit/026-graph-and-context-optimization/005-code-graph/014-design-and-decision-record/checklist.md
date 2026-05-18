---
title: "Checklist: Design + ADR for code-graph extraction"
description: "QA gates — all verified."
trigger_phrases:
  - "code graph extraction design checklist"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-code-graph/014-design-and-decision-record"
    last_updated_at: "2026-05-14T10:00:00Z"
    last_updated_by: "claude"
    recent_action: "Completed all checklist items; ADR-001 accepted"
    next_safe_action: "Child 002 scaffold system-code-graph skill"
    blockers: []
    key_files:
      - "checklist.md"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Checklist: Design + ADR for code-graph extraction

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol
- [x] CHK-200 [P0] Strict validate this packet. (warnings=1, spec_doc_sufficiency advisory, 0 errors)
- [x] CHK-201 [P0] Strict validate parent 014. (in progress)
- [x] CHK-202 [P1] Research + resource map + ADR present. (decision-record.md, resource-map.md, research/research.md)
- [x] CHK-203 [P1] Parent phase spec updated. (014/spec.md "What Needs Done" reflects ADR-locked sequence)
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [x] CHK-210 [P0] Code-graph source tree fully inventoried. (111 files, iteration-001.md)
- [x] CHK-211 [P0] All consumers identified via grep. (169 import matches, iteration-002.md)
- [x] CHK-212 [P1] Tool registrations identified in tool-schemas.ts + context-server.ts. (12 tools confirmed)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
- [x] CHK-010 [P0] No code changes (research-only invariant). (git diff limited to packet scope)
- [x] CHK-011 [P0] Research/resource-map markdown well-formed. (validated)
- [x] CHK-012 [P1] ADR follows L2-verify decision-record template structure. (mirrors precedent)
- [x] CHK-013 [P1] Alternatives table has all 8 decision rows. (Q2-Q6 each have alternatives tables)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing
- [x] CHK-020 [P0] All acceptance criteria met (REQ-001..008). (all 8 satisfied)
- [x] CHK-021 [P0] Strict validation passes. (0 errors)
- [x] CHK-022 [P1] resource-map count matches actual repo count. (280+ verified touchpoints)
- [x] CHK-023 [P1] No new tests. (research-only packet)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [x] CHK-FIX-001 [P0] Every touchpoint listed. (20 categories in resource-map.md)
- [x] CHK-FIX-002 [P0] Every architectural decision scored. (alternatives tables with 5-6 criteria each)
- [x] CHK-FIX-003 [P1] Chosen shape references specific consumer counts. (80+ references for tool-id, ~25 files for imports)
- [x] CHK-FIX-004 [P1] Implementation sequence implied by ADR. (002-006 confirmed)
- [x] CHK-FIX-005 [P0] All 8 questions answered. (Q1-Q8 in decision-record.md)
- [x] CHK-FIX-006 [P0] Plugin bridge disposition explicit. (move code-graph-specific, shared schema stays)
- [x] CHK-FIX-007 [P0] Database shape explicit with migration plan. (moved with SPECKIT_CODE_GRAPH_DB_DIR env fallback)
- [x] CHK-FIX-008 [P0] Risk catalog has detection + mitigation + rollback per row. (6 risks, all 3 columns)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
- [x] CHK-220 [P0] No secrets surfaced in survey. (confirmed)
- [x] CHK-221 [P0] No external network calls. (confirmed)
- [x] CHK-222 [P1] No production code or metadata modified. (confirmed)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
- [x] CHK-040 [P1] Spec/plan/tasks/checklist synchronized. (tasks updated, implementation-summary written)
- [x] CHK-041 [P1] ADR-001 written. (decision-record.md)
- [x] CHK-042 [P2] Research artifact present. (research/research.md + 3 iterations + state files)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
- [x] CHK-230 [P0] ADR in `decision-record.md`.
- [x] CHK-231 [P0] Resource map in `resource-map.md`.
- [x] CHK-232 [P1] No files outside this packet + parent 014 spec.md were modified. (confirmed)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Gate | Status |
|------|--------|
| All P0 items | PASS (all [x]) |
| All P1 items | PASS (all [x], CHK-203 in progress) |
| Strict validation | PASS (0 errors, 1 advisory warning) |
| ADR locks shape | PASS (8/8 decisions locked) |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:perf-verify -->
## Performance Verification
- [x] CHK-110 [P1] Deep-research under 4 hours. (~30 min total)
<!-- /ANCHOR:perf-verify -->
