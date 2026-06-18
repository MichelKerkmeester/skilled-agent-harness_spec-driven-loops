---
title: "Tasks: Stop skill-advisor state from leaking into spec folders [template:level_2/tasks.md]"
description: "Task breakdown for hardening the advisor workspace-root fallback, mirroring the schema twin, adding a regression test, rebuilding dist, and removing the 23 stray advisor-state directories."
trigger_phrases:
  - "advisor state leak tasks"
  - "workspace root hoist tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/003-advisor-and-codegraph/005-advisor-state-spec-folder-leak"
    last_updated_at: "2026-06-18T00:00:00Z"
    last_updated_by: "opus-agent"
    recent_action: "All tasks complete; fix + test + cleanup verified"
    next_safe_action: "None — complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/utils/workspace-root.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/utils/workspace-root.vitest.ts"
    session_dedup:
      fingerprint: "sha256:6aacd1b7a017af6097ca191821083c06ebfdc61d25a6f23a4af6d40121909764"
      session_id: "027-003-005-advisor-state-spec-folder-leak"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->
# Tasks: Stop skill-advisor state from leaking into spec folders

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

**Task Format**: `T### [P?] Description (file path) [effort]`


<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Enumerate stray `.advisor-state` dirs and snapshot the list (`scratch/stray-advisor-state-before.txt`) [10m]
- [x] T002 Confirm Level-2 contract against sibling `004-skill-advisor-suite-repair` [5m]


<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Resolver Fix
- [x] T003 Add `hoistAboveSpecsTree` helper + `sep` import (`lib/utils/workspace-root.ts`) [15m]
- [x] T004 Change the fallback to `hoistAboveSpecsTree(start) ?? resolve(start)` (`lib/utils/workspace-root.ts`) [5m]
- [x] T005 Apply the lockstep twin guard in `detectRepoRoot` (`schemas/advisor-tool-schemas.ts`) [10m]

### Test + Cleanup
- [x] T006 [P] Add the regression unit test (`tests/utils/workspace-root.vitest.ts`) [10m]
- [x] T007 [P] Delete the 23 stray `.advisor-state` dirs (snapshot-driven; `rmdir` wrappers only when empty) [5m]


<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 `npm run typecheck` exits 0 [5m]
- [x] T009 Run the new resolver test — 5/5 pass [5m]
- [x] T010 Stash my two source edits; re-run parity to attribute the failures (pre-existing) [15m]
- [x] T011 Rebuild dist; confirm `hoistAboveSpecsTree` compiled in [10m]
- [x] T012 Re-sweep `.opencode/specs/`: 0 strays; vendored `external/` clones intact [5m]
- [x] T013 Mark `checklist.md` items with evidence [5m]


<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] New unit test passing
- [x] Parity failures attributed to pre-existing drift (baseline captured)
- [x] Checklist fully verified


<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->
