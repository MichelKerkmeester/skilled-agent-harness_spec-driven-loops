---
title: "Tasks: Phase 11: command-surface-normalization [template:level_1/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "command surface normalization"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/032-goal-opencode-plugin/011-command-surface-normalization"
    last_updated_at: "2026-07-01T10:04:52Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored tasks from deep-review + deep-research findings"
    next_safe_action: "Run /speckit:implement on this phase"
    blockers:
      - "Live command filename must be re-verified at execution time"
    key_files:
      - ".opencode/commands/goal_opencode.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-032-011"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 11: command-surface-normalization

<!-- SPECKIT_LEVEL: 1 -->

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

<!-- agent: direct | deps: [] | touched-files: [] -->
- [ ] T001 Re-verify the live command filename: `ls .opencode/commands/*goal*.md` — do NOT assume this spec's snapshot (`goal_opencode.md`) is still current (.opencode/commands/)
<!-- agent: direct | deps: [T001] | touched-files: [] -->
- [ ] T002 Build the complete stale-reference inventory: `rg -n 'opencode_goal|goal_opencode|commands/goal\.md' . --glob '!.git/**' --glob '!*/changelog/**' --glob '!*/research/**'` (repo root)
<!-- agent: direct | deps: [T001] | touched-files: [] -->
- [ ] T003 Check phase 009's own scope/handover for any naming convention it has already established, to avoid a fourth rename (032-goal-opencode-plugin/009-speckit-command-goal-prompt-offer/)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

<!-- agent: direct | deps: [T002, T003] | touched-files: [".opencode/commands/"] -->
- [ ] T004 Rename the command file to the final canonical name (plain `goal.md` unless T003 surfaces a reason to pick differently) (.opencode/commands/)
<!-- agent: direct | deps: [T004] | touched-files: ["032-goal-opencode-plugin/003-goal-command/spec.md", "032-goal-opencode-plugin/003-goal-command/plan.md", "032-goal-opencode-plugin/003-goal-command/tasks.md", "032-goal-opencode-plugin/003-goal-command/implementation-summary.md"] -->
- [ ] T005 [P] Update all filename references in phase 003's docs (032-goal-opencode-plugin/003-goal-command/*.md)
<!-- agent: direct | deps: [T004] | touched-files: ["032-goal-opencode-plugin/007-sk-prompt-goal-enhancement/tasks.md"] -->
- [ ] T006 [P] [research F-009] Fix the stale `goal.md` cross-reference in phase 007's tasks.md (032-goal-opencode-plugin/007-sk-prompt-goal-enhancement/tasks.md)
<!-- agent: direct | deps: [T004] | touched-files: ["032-goal-opencode-plugin/008-system-spec-kit-integration/spec.md", "032-goal-opencode-plugin/008-system-spec-kit-integration/tasks.md"] -->
- [ ] T007 [P] Update filename references in phase 008's docs (032-goal-opencode-plugin/008-system-spec-kit-integration/*.md)
<!-- agent: direct | deps: [T004] | touched-files: ["032-goal-opencode-plugin/004-lifecycle-tracking/graph-metadata.json"] -->
- [ ] T008 [P] [DR-007-P2] Update the filename reference in phase 004's graph-metadata.json `key_files`, and strip any non-deliverable files from that same array while touching it (032-goal-opencode-plugin/004-lifecycle-tracking/graph-metadata.json)
<!-- agent: direct | deps: [T004] | touched-files: [".opencode/skills/system-skill-advisor/feature_catalog/07--hooks-and-plugin/goal-opencode-plugin.md", ".opencode/skills/system-spec-kit/feature_catalog/18--ux-hooks/goal-opencode-plugin.md"] -->
- [ ] T009 [P] [DR-008] Fix stale command path in both feature catalogs (.opencode/skills/system-skill-advisor/feature_catalog/07--hooks-and-plugin/, .opencode/skills/system-spec-kit/feature_catalog/18--ux-hooks/)
<!-- agent: direct | deps: [T004] | touched-files: [".opencode/skills/system-skill-advisor/manual_testing_playbook/02--cli-hooks-and-plugin/goal-opencode-plugin.md", ".opencode/skills/system-spec-kit/manual_testing_playbook/18--ux-hooks/goal-opencode-plugin.md"] -->
- [ ] T010 [P] [DR-008] Fix stale command path in both manual-testing playbooks (.opencode/skills/system-skill-advisor/manual_testing_playbook/02--cli-hooks-and-plugin/, .opencode/skills/system-spec-kit/manual_testing_playbook/18--ux-hooks/)
<!-- agent: direct | deps: [] | touched-files: [".opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md", ".opencode/plugins/mk-goal.js"] -->
- [ ] T011 [DR-010-P1] Decide `MK_GOAL_PLUGIN_DISABLED`'s contract and make code (.opencode/plugins/mk-goal.js) and docs (.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md) agree
<!-- agent: direct | deps: [] | touched-files: [".opencode/plugins/mk-goal.js"] -->
- [ ] T012 [DR-004-P2] Reconcile the unknown-verb-fails claim with actual dispatch behavior (.opencode/plugins/mk-goal.js)
<!-- agent: direct | deps: [] | touched-files: [".opencode/plugins/mk-goal.js"] -->
- [ ] T013 [DR-010-P2] Add a `mutation=created|replaced|refreshed` field to `/goal set` output (.opencode/plugins/mk-goal.js)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

<!-- agent: direct | deps: [T005, T006, T007, T008, T009, T010] | touched-files: [] -->
- [ ] T014 Re-run the stale-reference grep from T002 across the whole repo — must return zero hits outside `changelog/`/`research/`/`.git/`
<!-- agent: direct | deps: [T011, T012, T013] | touched-files: [] -->
- [ ] T015 Run `node --check .opencode/plugins/mk-goal.js` and the full 6-file test suite, freshly executed, all exit 0
<!-- agent: direct | deps: [T015] | touched-files: [] -->
- [ ] T016 Manually invoke `/goal set` (via `executeGoalAction` helpers) and confirm the mutation-status field appears; manually confirm `MK_GOAL_PLUGIN_DISABLED` behaves per the T011 decision
<!-- agent: direct | deps: [T014, T016] | touched-files: ["032-goal-opencode-plugin/011-command-surface-normalization/implementation-summary.md"] -->
- [ ] T017 Fill `implementation-summary.md` with the fresh T014/T015/T016 evidence
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Repo-wide stale-reference grep returns zero hits (T014)
- [ ] Test suite passes on a fresh run (T015)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Finding source**: `../review/review-report.md` §3 (DR-002, DR-004-P2, DR-007-P1/P2, DR-008, DR-010); `../research/iterations/iteration-00{2,3,4}.md` (F-005 through F-009)
<!-- /ANCHOR:cross-refs -->
