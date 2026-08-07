---
title: "Verification Checklist: Causal Edge Tombstones"
description: "Verification evidence for tombstone-backed causal edge deletion and orphan cleanup."
trigger_phrases:
  - "causal edge tombstone checklist"
  - "tombstone verification"
  - "causal graph lifecycle verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/002-memory-store-and-search/002-memory-index-causal-lifecycle/002-causal-edge-tombstones"
    last_updated_at: "2026-06-10T07:10:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Verified tombstone-backed causal edge deletion"
    next_safe_action: "Proceed to metadata-edge promoter phase"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "implementation-summary.md", "checklist.md"]
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Active edges remain hard-deleted while tombstones preserve audit data."
---
# Verification Checklist: Causal Edge Tombstones

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
  - **Evidence**: spec.md defines tombstone table, delete paths, lifecycle generation, and health behavior.
- [x] CHK-002 [P0] Technical approach defined in plan.md
  - **Evidence**: plan.md defines read-before-delete sweep helper, schema, adapters, and test strategy.
- [x] CHK-003 [P1] Delete-path inventory completed
  - **Evidence**: production grep found all active delete paths and final grep shows only `lib/causal/sweep.ts` hard-deletes `causal_edges`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code builds successfully
  - **Evidence**: `npm run build` exited 0.
- [x] CHK-011 [P0] Comment hygiene passes on modified code files
  - **Evidence**: `python3 .opencode/skills/sk-code/scripts/check-comment-hygiene.sh <modified code files>` exited 0 for all modified code files.
- [x] CHK-012 [P1] Active graph reads remain simple
  - **Evidence**: existing causal suites passed; read paths still query `causal_edges` without tombstone filters.
- [x] CHK-013 [P1] Out-of-scope drift reported
  - **Evidence**: alignment drift now only reports pre-existing module-header defects in `canonical-fingerprint.ts` and `memo.ts`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Tombstone acceptance criteria verified
  - **Evidence**: `tests/causal-edge-tombstones.vitest.ts` covers single delete, bulk delete, manual unlink, and health orphan repair.
- [x] CHK-021 [P0] Adjacent causal suites pass
  - **Evidence**: `npm exec vitest run tests/*causal*.vitest.ts ...` passed.
- [x] CHK-022 [P1] Secret scrubber regression passes
  - **Evidence**: `tests/secret-scrubber.vitest.ts` included in the 16-file targeted pass.
- [x] CHK-023 [P1] Schema compatibility regressions pass
  - **Evidence**: schema compatibility, migration refinements, and incremental foundation suites included in the 16-file targeted pass.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-030 [P0] Tasks reconciled with evidence
  - **Evidence**: tasks.md marks all implementation and verification tasks complete with evidence.
- [x] CHK-031 [P0] Implementation summary completed
  - **Evidence**: implementation-summary.md documents what changed, how it shipped, verification, and limitations.
- [x] CHK-032 [P1] Strict spec validation passes
  - **Evidence**: strict validation passed with 0 errors and 0 warnings.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 7/7 |
| P1 Items | 6 | 6/6 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-06-10
**Verified By**: gpt-5.5-fast
<!-- /ANCHOR:summary -->
