---
title: "Tasks: 001 State Directory Containment"
description: "Task breakdown for 001 State Directory Containment."
trigger_phrases:
  - "advisor-018-001"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/017-advisor-audit-and-state-containment/001-state-directory-containment"
    last_updated_at: "2026-08-15T13:30:28Z"
    last_updated_by: "claude-code"
    recent_action: "Advisor consumer routing fixed and verified"
    next_safe_action: "Close 001; 002 surface-audit remains"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 001 State Directory Containment

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] T001 Re-verify each named writer at its cited file:line against the advisor tree — resolver already anchored; `mk-cli-dispatch-audit.js` / `mk-spec-gate.js`→`resolveGuardPaths` / launcher already anchor via `findRepoRoot`; three named writers no longer exist
- [x] T002 Confirm the anchor is settled: sentinel walk-up via `findAdvisorWorkspaceRoot` (no new resolver needed)
- [x] T003 Write the boundary test first, asserting no leak into any subtree (`tests/state-containment.vitest.ts`) — watched it fail on the two chokepoints
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Anchor the hook entry `workspaceRootFor` via `findAdvisorWorkspaceRoot` (`hooks/claude/user-prompt-submit.ts`)
- [x] T005 Anchor the generation-counter path (`lib/freshness/generation.ts`) and skill-graph DB dir (`lib/skill-graph/skill-graph-db.ts`)
- [x] T006 Anchor the scan cwd (`handlers/skill-graph/scan.ts`) and daemon fallback (`advisor-server.ts`)
- [x] T007 Realign the schema allowlist twin to `hoistAboveOpencodeTree` (`schemas/advisor-tool-schemas.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Prove a writer run from a specs/ cwd no longer leaks: `state-containment.vitest.ts` `4/4`; generation stress `7/7`; typecheck `exit 0`
- [x] T009 Remove the advisor strays under `specs/`: `find specs -type d -name .advisor-state` returns zero
- [x] T010 Baseline the full suite via `git stash`: 36 failed / 839 passed confirmed pre-existing (unrelated scorer/parity), zero new failures from this change
- [x] T011 `validate.sh --strict` exits clean on this packet and the 017 parent
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] The `.gitignore` backstop and repo-wide 40-dir cleanup are retired as obsolete (see spec REQ-007); non-advisor writers verified already-anchored
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
