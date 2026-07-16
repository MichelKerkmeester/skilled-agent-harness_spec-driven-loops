---
title: "Tasks: Marker-Gated Review Packet Type in the Validator"
description: "The implementation and verification tasks for the marker-gated review packet type, marked complete with evidence from the changed validator files, the tests, and the 009 demonstration."
trigger_phrases:
  - "review packet type tasks"
  - "review path validator tasks"
  - "review-record fixture tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/004-review-remediation/006-review-record-packet-type"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Marked all review-path build and verification tasks complete with evidence"
    next_safe_action: "Mark the remaining lean deep-review packets as review records"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/spec/validate.sh"
      - ".opencode/skills/system-spec-kit/scripts/utils/template-structure.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-028-013"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Marker-Gated Review Packet Type in the Validator

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Define the lean review-record shape as spec.md plus `review/review-report.md` only
- [x] T002 Choose `<!-- SPECKIT_LEVEL: review -->` as the sole entry into the review path
- [x] T003 [P] State the additive requirement that no existing Level 1, Level 2, Level 3, or phase folder changes
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Teach `detect_level` the review marker and list it in the help text (`scripts/spec/validate.sh`)
- [x] T005 Add the review level, template path, and allowed anchors (`scripts/utils/template-structure.js`)
- [x] T006 Add the review level row, the review-record taxonomy, and the freeform review-report entry (`templates/manifest/spec-kit-docs.json`)
- [x] T007 Create the lean review spec template, a subset of the L1 spec anchors (`templates/manifest/review.spec.md.tmpl`)
- [x] T008 Add review handling to the production resolver, orchestrator, and structure gate (`mcp_server/lib/templates/level-contract-resolver.ts`, `mcp_server/lib/validation/orchestrator.ts`, `mcp_server/lib/validation/spec-doc-structure.ts`)
- [x] T009 Exclude the freeform review-report from the template-source, frontmatter-continuity, and sufficiency gates (`mcp_server/lib/validation/spec-doc-structure.ts`)
- [x] T010 Guard the numeric-level comparison so a string level does not crash (`scripts/rules/check-files.sh`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Add the four review-record tests (`scripts/tests/review-record-validation.vitest.ts`)
- [x] T012 Add the valid and missing-report fixtures (`068-review-record-valid`, `069-review-record-missing-report`)
- [x] T013 Confirm the existing fixture suites return identical pass and fail before and after on a clean baseline
- [x] T014 Stash the change, rebuild the dist to HEAD, and confirm an unrelated phase-parent failure is identical with and without it
- [x] T015 Mark the 009 packet as a review record and confirm it validates at exit 0
- [x] T016 Confirm the 011 and 012 packets were intentionally left as Level 1
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] The review path proven additive two ways and the 009 demonstration validates at exit 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Demonstration Packet**: See `009-dark-flag-validation`
<!-- /ANCHOR:cross-refs -->
