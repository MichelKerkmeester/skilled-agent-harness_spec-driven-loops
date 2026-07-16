---
title: "Verification Checklist: z_future Always Ignored In Backfill [template:level_2/checklist.md]"
description: "Verification Date: 2026-06-22"
trigger_phrases:
  - "z future always ignored"
  - "backfill graph metadata exclusion"
  - "backfill verification"
  - "z archive parity check"
  - "collectSpecFolders staging skip"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/002-spec-data-quality/005-shared-engine-and-research/032-z-future-always-ignored"
    last_updated_at: "2026-07-04T17:12:03.578Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Verified z_future skip, z_archive parity, clean dry-run"
    next_safe_action: "Add a z_future-exclusion test as follow-up"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts"
      - ".opencode/skills/system-spec-kit/scripts/dist/graph/backfill-graph-metadata.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: z_future Always Ignored In Backfill

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
- [x] CHK-003 [P1] Root cause confirmed, the conditional skip lets a default walk enter z_future and throw
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] z_future added to EXCLUDED_DIRS so the walk unconditionally prunes it
- [x] CHK-011 [P1] The header comment states z_future is always skipped while z_archive stays included by default and skippable via --active-only
- [x] CHK-012 [P1] The dist was rebuilt via tsc and carries the same exclusion as the source
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met (REQ-001 through REQ-004)
- [x] CHK-021 [P0] collectSpecFolders on the specs root returns zero z_future folders and no longer throws
- [x] CHK-022 [P1] A default backfill dry-run exits 0 with no z_future or supported-specs-root mention
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

This phase ships a one-line-plus-comment fix, so the completeness bar is that the walk skips z_future, z_archive is preserved, and the dist matches.

- [x] CHK-FIX-001 [P0] The default walk no longer enters z_future, so the parser is never handed a non-specs-root staging folder
- [x] CHK-FIX-002 [P0] The pre-fix crash, the not-a-supported-specs-root throw, no longer reproduces on a default run
- [x] CHK-FIX-003 [P0] z_archive is included by default, 858 folders, and excluded under --active-only, unchanged by this fix
- [x] CHK-FIX-004 [P1] The dist was rebuilt via tsc so source and compiled output carry the same exclusion
- [x] CHK-FIX-005 [P1] The header comment matches the walk behavior after the change
- [x] CHK-FIX-006 [P1] A dedicated z_future-exclusion test is recorded as a follow-up, the existing test covers z_archive inclusion only
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] The change only narrows which directories the walk enters, introducing no new file access or execution surface
- [x] CHK-031 [P1] The exclusion set is a fixed literal, no untrusted input reaches the changed code
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks synchronized, and every verification claim traces to a run on the live specs root
- [x] CHK-041 [P2] The header comment documents the z_future and z_archive contract for future readers
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] The change is confined to the backfill generator and its dist, nothing else touched
- [x] CHK-051 [P1] No temp files left behind, only the source edit and the rebuilt dist
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-22
<!-- /ANCHOR:summary -->

---
