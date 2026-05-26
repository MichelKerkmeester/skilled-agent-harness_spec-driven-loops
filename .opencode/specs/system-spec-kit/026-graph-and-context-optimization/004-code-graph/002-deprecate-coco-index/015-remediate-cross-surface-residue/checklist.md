---
title: "Verification Checklist: Remove remaining post-014-deprecation coco/ccc/rerank residue across non-code-graph surfaces [template:level_2/checklist.md]"
description: "Verification Date: 2026-05-25"
trigger_phrases:
  - "cross-surface residue checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/014-deprecate-coco-index/015-remediate-cross-surface-residue"
    last_updated_at: "2026-05-25T16:10:00Z"
    last_updated_by: "main-agent"
    recent_action: "All gates verified green"
    next_safe_action: "Commit the cross-surface residue packet"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "remediate-cross-surface-residue-001"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Remove remaining post-014-deprecation coco/ccc/rerank residue across non-code-graph surfaces

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001..004)
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified (014 deletions + operator approval)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks — `tsc -p scripts/tsconfig.json` 0 errors
- [x] CHK-011 [P0] No console errors or warnings — N/A (no runtime entrypoint changed)
- [x] CHK-012 [P1] Error handling implemented — RM-8 classification still returns valid roles for live daemons
- [x] CHK-013 [P1] Code follows project patterns — kept the live-daemon rules + RM-8 owner-proof discipline
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met — 7/7 per-target greps == 0
- [x] CHK-021 [P0] Manual testing complete — vitest run (`process-memory-harness` + `process-sweep`) 20/20 pass
- [x] CHK-022 [P1] Edge cases tested — re-pointed live pid-lock + expected-daemon test to kept daemons (code-graph, ollama)
- [x] CHK-023 [P1] Error scenarios validated — owner-token redaction preserved (generic `*TOKEN` still matches)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class: `class-of-bug` (deprecation residue) + `cross-consumer` (configs/commands/tests cite deleted artifacts).
- [x] CHK-FIX-002 [P0] Same-class producer inventory: repo-wide sweep for cocoindex/ccc/rerank/8765 (incl hidden dirs via per-target greps); classified keep-vs-remove.
- [x] CHK-FIX-003 [P0] Consumer inventory: removed harness type `'ccc-daemon'` → grep confirms 0 remaining consumers; both vitests updated.
- [x] CHK-FIX-004 [P0] Security/redaction: `RERANK_SIDECAR_OWNER_TOKEN` removal verified harmless (generic `*TOKEN` alternation still redacts).
- [x] CHK-FIX-005 [P1] Matrix: surface × residue-token; all 7 covered.
- [x] CHK-FIX-006 [P1] Global-state variant: process classification re-verified via synthetic fixture snapshot.
- [x] CHK-FIX-007 [P1] Evidence pinned to this packet's edits (uncommitted at verification time).
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — none added
- [x] CHK-031 [P0] Input validation — N/A
- [x] CHK-032 [P1] Auth/authz — owner-token redaction + RM-8 owner-proof discipline preserved for live daemons
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — all reflect the 8 tracked files + the gitignored runtime sync
- [x] CHK-041 [P1] Code comments adequate — removed dead-reference comments
- [x] CHK-042 [P2] README/command updated — `/memory:manage` contract scoped back to the memory DB
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — none created
- [x] CHK-051 [P1] scratch/ cleaned before completion — empty
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 12 | 12/12 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-05-25
<!-- /ANCHOR:summary -->
