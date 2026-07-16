---
title: "Checklist: Code Graph - Generation Watermark (Q6-C2 → Q6-C1)"
description: "Level-2 QA checklist for the staged code-graph generation watermark. Q6-C2 is implemented and verified, Q6-C1 remains gated."
trigger_phrases:
  - "code graph generation watermark checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/025-code-graph-core/003-generation-watermark"
    last_updated_at: "2026-06-19T08:16:05Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Verified Q6-C2 soft watermark implementation"
    next_safe_action: "Keep Q6-C1 hard gate pending until Q1-C1 schema work has a named consumer"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-002-003-generation-watermark"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---

# Checklist: Code Graph - Generation Watermark (Q6-C2 → Q6-C1)

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

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001..005, Q6-C2 + Q6-C1)
- [x] CHK-002 [P0] Technical approach defined in plan.md (staged Q6-C2 → Q6-C1, correct bump site)
- [x] CHK-003 [P1] Dependencies identified and available (`code_graph_metadata` present, Q1-C1 cluster gates Q6-C1)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes checks (`tsc --noEmit`, alignment drift scanned 155 files)
- [x] CHK-011 [P0] No console errors or warnings in targeted Vitest output
- [x] CHK-012 [P1] Error handling implemented (`parseInt || 0` for malformed/unset generation, covered by `code-graph-db.vitest.ts`)
- [x] CHK-013 [P1] Code follows project patterns (KV helper beside existing metadata helpers)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met (REQ-001..004 for Q6-C2, REQ-005 design-only)
- [x] CHK-021 [P0] Automated two-scan verification complete (`full_scan` + `selective_reindex` advance `generation`)
- [x] CHK-022 [P1] Edge cases tested (unset→0, malformed→0, non-promoting scan no-op)
- [x] CHK-023 [P1] Error scenarios validated (parse-error/persistence-error scan does not bump)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class recorded: `cross-consumer` (corrects the refuted bump-site claim, the freshness envelope is a public field)
- [x] CHK-FIX-002 [P0] Same-class producer inventory confirmed: the finalize block in `handlers/scan.ts` is the bump site
- [x] CHK-FIX-003 [P0] Consumer inventory for the changed freshness envelope reviewed, no consumer branches on `generation`
- [x] CHK-FIX-004 [P0] N/A - no security/path/parser/redaction surface, additive internal int only
- [x] CHK-FIX-005 [P1] Matrix axes covered: {full_scan, selective_reindex, non-promoting} × {unset, set}
- [x] CHK-FIX-006 [P1] No process-wide state read by the counter, DB KV only
- [x] CHK-FIX-007 [P1] N/A - no commit SHA because user explicitly requested no git commit, evidence pinned to files and commands
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation: `generation` is an internal monotonic int, not external input, N/A but stated
- [x] CHK-032 [P1] Auth/authz unchanged (no auth surface touched)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized (Q6-C1 DEFER-speculative gate recorded in all three)
- [x] CHK-041 [P1] Code comments adequate (comment hygiene checker passed touched files)
- [x] CHK-042 [P2] README update N/A (no user-facing setup or readiness behavior changed)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only (none created)
- [x] CHK-051 [P1] scratch/ cleaned before completion (none created)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-19 (Q6-C2 implemented, Q6-C1 gated)
<!-- /ANCHOR:summary -->

---
