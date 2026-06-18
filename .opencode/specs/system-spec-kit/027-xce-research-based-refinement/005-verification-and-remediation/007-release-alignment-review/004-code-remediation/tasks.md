---
title: "Tasks: Code vs sk-code Remediation (Track B)"
description: "Workstream ledger for the Track B code remediation: baseline, dispatch general+sk-code fixer seats, verify tsc/hygiene/syntax/tests, commit."
trigger_phrases:
  - "code remediation tasks"
  - "track B code remediation tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/007-release-alignment-review/004-code-remediation"
    last_updated_at: "2026-06-18T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "All code remediation tasks completed"
    next_safe_action: "None — track complete"
    blockers: []
    completion_pct: 100
---
# Tasks: Code vs sk-code Remediation (Track B)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (evidence)`


<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Build confirmed-finding briefs (C1–C4; drop FP clusters) — `004/fixers` (shared with 003 fleet)
- [x] T002 [P1] Capture pre-merge baseline (tsc + hygiene gate + affected tests)
- [x] T003 [P1] Create worktree-B; verify clean baseline


<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P1] Dispatch general+sk-code fixer seats (pool 10, file-disjoint) — 19 seats, 0 empty
- [x] T005 [P0] Comment-hygiene ephemeral-id cleanup (label dropped, WHY kept) — gate 0 violations / 87 files
- [x] T006 [P1] Shell `set -euo pipefail` added where missing — `bash -n` clean
- [x] T007 [P1] `any[]`→typed public DB row — `write-provenance.ts`; tsc clean


<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 [P1] Verify tsc (spec-kit/advisor/code-graph) + node/py syntax + spot-test — all clean; retrieval-rescue 6 passed
- [x] T009 [P1] Commit scoped + dist rebuild + push — `83f36b8050`; 3 dists rebuilt


<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] tsc clean across edited packages
- [x] comment-hygiene gate 0 violations
- [x] Checklist.md fully verified


<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->
