---
title: "Tasks: Phase 11: command-surface-normalization"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "command surface normalization"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/032-goal-opencode-plugin/011-command-surface-normalization"
    last_updated_at: "2026-07-01T11:29:29Z"
    last_updated_by: "opencode-gpt-5.5"
    recent_action: "Amended: operator confirmed goal_opencode.md as final, not goal.md"
    next_safe_action: "Proceed to phase 012 (regression-test-backfill)"
    blockers: []
    key_files:
      - ".opencode/commands/goal_opencode.md"
    session_dedup:
      fingerprint: "sha256:dcd31e900816c601e3029e9189aaea3283cea968c09774804d2f60ffbca1f972"
      session_id: "scaffold-032-011"
      parent_session_id: null
    completion_pct: 100
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
- [x] T001 Re-verify the live command filename: `ls .opencode/commands/*goal*.md` — confirmed the live pre-rename file before moving it to `.opencode/commands/goal.md` (.opencode/commands/)
<!-- agent: direct | deps: [T001] | touched-files: [] -->
- [x] T002 Build the complete stale-reference inventory: `rg -n 'opencode_goal|goal_opencode|commands/goal\.md' . --glob '!.git/**' --glob '!*/changelog/**' --glob '!*/research/**'` (repo root)
<!-- agent: direct | deps: [T001] | touched-files: [] -->
- [x] T003 Check phase 009's own scope/handover for any naming convention it has already established, to avoid a fourth rename (032-goal-opencode-plugin/009-speckit-command-goal-prompt-offer/)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

<!-- agent: direct | deps: [T002, T003] | touched-files: [".opencode/commands/"] -->
- [x] T004 Rename the command file to the final canonical name (plain `goal.md` unless T003 surfaces a reason to pick differently) (.opencode/commands/) — **superseded same-day**: operator confirmed `.opencode/commands/goal_opencode.md` as the final name instead; see `implementation-summary.md`'s Amendment note.
<!-- agent: direct | deps: [T004] | touched-files: ["032-goal-opencode-plugin/003-goal-command/spec.md", "032-goal-opencode-plugin/003-goal-command/plan.md", "032-goal-opencode-plugin/003-goal-command/tasks.md", "032-goal-opencode-plugin/003-goal-command/implementation-summary.md"] -->
- [x] T005 [P] Update all filename references in phase 003's docs (032-goal-opencode-plugin/003-goal-command/*.md)
<!-- agent: direct | deps: [T004] | touched-files: ["032-goal-opencode-plugin/007-sk-prompt-goal-enhancement/tasks.md"] -->
- [x] T006 [P] [research F-009] Fix the stale `goal.md` cross-reference in phase 007's tasks.md (032-goal-opencode-plugin/007-sk-prompt-goal-enhancement/tasks.md)
<!-- agent: direct | deps: [T004] | touched-files: ["032-goal-opencode-plugin/008-system-spec-kit-integration/spec.md", "032-goal-opencode-plugin/008-system-spec-kit-integration/tasks.md"] -->
- [x] T007 [P] Update filename references in phase 008's docs (032-goal-opencode-plugin/008-system-spec-kit-integration/*.md)
<!-- agent: direct | deps: [T004] | touched-files: ["032-goal-opencode-plugin/004-lifecycle-tracking/graph-metadata.json"] -->
- [x] T008 [P] [DR-007-P2] Update the filename reference in phase 004's graph-metadata.json `key_files`, and strip any non-deliverable files from that same array while touching it (032-goal-opencode-plugin/004-lifecycle-tracking/graph-metadata.json)
<!-- agent: direct | deps: [T004] | touched-files: [".opencode/skills/system-skill-advisor/feature_catalog/hooks-and-plugin/goal-opencode-plugin.md", ".opencode/skills/system-spec-kit/feature_catalog/ux-hooks/goal-opencode-plugin.md"] -->
- [x] T009 [P] [DR-008] Fix stale command path in both feature catalogs (.opencode/skills/system-skill-advisor/feature_catalog/hooks-and-plugin/, .opencode/skills/system-spec-kit/feature_catalog/ux-hooks/)
<!-- agent: direct | deps: [T004] | touched-files: [".opencode/skills/system-skill-advisor/manual_testing_playbook/cli-hooks-and-plugin/goal-opencode-plugin.md", ".opencode/skills/system-spec-kit/manual_testing_playbook/ux-hooks/goal-opencode-plugin.md"] -->
- [x] T010 [P] [DR-008] Fix stale command path in both manual-testing playbooks (.opencode/skills/system-skill-advisor/manual_testing_playbook/cli-hooks-and-plugin/, .opencode/skills/system-spec-kit/manual_testing_playbook/ux-hooks/)
<!-- agent: direct | deps: [] | touched-files: [".opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md", ".opencode/plugins/mk-goal.js"] -->
- [x] T011 [DR-010-P1] Decide `MK_GOAL_PLUGIN_DISABLED`'s contract and make code (.opencode/plugins/mk-goal.js) and docs (.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md) agree
<!-- agent: direct | deps: [] | touched-files: [".opencode/plugins/mk-goal.js"] -->
- [x] T012 [DR-004-P2] Reconcile the unknown-verb-fails claim with actual dispatch behavior (.opencode/plugins/mk-goal.js)
<!-- agent: direct | deps: [] | touched-files: [".opencode/plugins/mk-goal.js"] -->
- [x] T013 [DR-010-P2] Add a `mutation=created|replaced|refreshed` field to `/goal set` output (.opencode/plugins/mk-goal.js)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

<!-- agent: direct | deps: [T005, T006, T007, T008, T009, T010] | touched-files: [] -->
- [x] T014 Re-run the stale-reference grep from T002 across the whole repo — returned non-zero hits only in forbidden or explicitly historical-current phase docs; see implementation summary for the scope-boundary exception.
<!-- agent: direct | deps: [T011, T012, T013] | touched-files: [] -->
- [x] T015 Run `node --check .opencode/plugins/mk-goal.js` and the full 6-file test suite, freshly executed, all exit 0
<!-- agent: direct | deps: [T015] | touched-files: [] -->
- [x] T016 Manually invoke `/goal set` (via `executeGoalAction` helpers) and confirm the mutation-status field appears; manually confirm `MK_GOAL_PLUGIN_DISABLED` behaves per the T011 decision
<!-- agent: direct | deps: [T014, T016] | touched-files: ["032-goal-opencode-plugin/011-command-surface-normalization/implementation-summary.md"] -->
- [x] T017 Fill `implementation-summary.md` with the fresh T014/T015/T016 evidence
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Repo-wide stale-reference grep returns zero hits (T014) — as of this phase's own completion; the file was renamed again after, see the Amendment note in `implementation-summary.md`
- [x] Test suite passes on a fresh run (T015)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Finding source**: `../review/review-report.md` §3 (DR-002, DR-004-P2, DR-007-P1/P2, DR-008, DR-010); `../research_archive/2026-07-01-plugin-implementation-audit/iterations/iteration-00{2,3,4}.md` (F-005 through F-009)
<!-- /ANCHOR:cross-refs -->
