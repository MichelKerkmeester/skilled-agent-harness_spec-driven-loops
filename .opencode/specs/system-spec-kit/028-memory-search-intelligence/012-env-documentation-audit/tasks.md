---
title: "Tasks: ENV Documentation Deep Review and Remediation"
description: "The audit lenses and the remediation tasks for the ENV-documentation deep review, marked complete with evidence from the review record."
trigger_phrases:
  - "env documentation audit tasks"
  - "ENV_REFERENCE remediation tasks"
  - "flag coverage fix tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/012-env-documentation-audit"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Marked all audit and remediation tasks complete with evidence"
    next_safe_action: "A separate house-style pass over pre-existing ENV_REFERENCE prose"
    blockers: []
    key_files:
      - ".opencode/specs/system-spec-kit/028-memory-search-intelligence/012-env-documentation-audit/review/review-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-028-012"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: ENV Documentation Deep Review and Remediation

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

- [x] T001 Identify the flag source as ground truth and the docs as claims to test against it
- [x] T002 Define the ten audit lenses and the loop-until-dry stop condition
- [x] T003 [P] Treat ENV_REFERENCE.md, the sibling, the four changelogs, the README, and the source as one surface
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Run ten opus passes, enter POOR, record zero P0, thirteen P1, sixteen P2 (`review/review-report.md`)
- [x] T005 Rebuild the stale dist so the twelve documented disable knobs work at runtime by their documented name
- [x] T006 Add the fifteen genuinely user-facing flag rows including the bitemporal reads, the force-parse and its degree cap, and the RRF spine (`ENV_REFERENCE.md`)
- [x] T007 Correct the five wrong defaults and disclose the config-pin gaps (`ENV_REFERENCE.md`, `environment_variables.md`)
- [x] T008 Fix the two stale entries, removing the VRULE row that fails closed rather than rewriting it wrong (`ENV_REFERENCE.md`)
- [x] T009 Reconcile the three cross-doc contradictions: recency decay, graph weight cap, and the disputed defaults
- [x] T010 Fix the two structural issues, renumber the section sequence gapless 1 through 17 and move the interleaved section to the appendix
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Re-verify each finding against source before editing
- [x] T012 Catch and correct review error 1, the flag is `SPECKIT_METRICS_ENABLED` with no advisor infix
- [x] T013 Catch and correct review error 2, no README line-144 claim exists, leave the README untouched
- [x] T014 Catch and correct review error 3, the VRULE reader fails closed not open, remove the stale row
- [x] T015 Confirm zero `_V1` names remain, the defaults match source, and the section run is contiguous
- [x] T016 Confirm the remediation's added lines are HVR-clean and no production default was flipped
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Every defect remediated and every review error caught against source
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Review Record**: See `review/review-report.md`
<!-- /ANCHOR:cross-refs -->
