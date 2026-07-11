---
title: "Tasks: Plugin Manual-Testing Playbooks (11 scenarios)"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "manual testing playbook tasks"
  - "plugin scenario task list"
  - "plugins-and-hooks authoring tasks"
  - "scenario review tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/132-plugin-hook-implementation/009-plugin-manual-testing-playbooks"
    last_updated_at: "2026-07-11T13:12:24Z"
    last_updated_by: "spec-author"
    recent_action: "Authored and reviewer-verified 11 manual-testing-playbook scenarios, all PASS"
    next_safe_action: "None; phase 9 of 9 is complete, no successor phase"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/manual_testing_playbook/plugins-and-hooks/"
      - ".opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/009-plugin-manual-testing-playbooks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Skipped plugins already covered: mk-skill-advisor, mk-goal, mk-deep-loop-guard"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Plugin Manual-Testing Playbooks

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

- [x] T001 Confirm the scenario contract and EXECUTION POLICY from `manual_testing_playbook.md` before authoring any of the 11/11 scenarios (.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md)
- [x] T002 Enumerate 11/11 plugin/hook pairs and confirm the 3 already-covered exclusions: mk-skill-advisor, mk-goal, mk-deep-loop-guard
- [x] T003 [P] Create the `plugins-and-hooks/` scenario directory that later holds all 11/11 scenario files (.opencode/skills/system-spec-kit/manual_testing_playbook/plugins-and-hooks/)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Author cli-dispatch-audit-trail.md against mk-cli-dispatch-audit real source; core suite 38/38 passed live (.opencode/skills/system-spec-kit/manual_testing_playbook/plugins-and-hooks/cli-dispatch-audit-trail.md)
- [x] T005 Author code-graph-freshness-guard.md against mk-code-graph-freshness real source; unit 12/12 + freshness-core vitest 19/19 passed live (.opencode/skills/system-spec-kit/manual_testing_playbook/plugins-and-hooks/code-graph-freshness-guard.md)
- [x] T006 Author post-edit-quality-router.md against mk-post-edit-quality real source; suite 38/38 passed live (.opencode/skills/system-spec-kit/manual_testing_playbook/plugins-and-hooks/post-edit-quality-router.md)
- [x] T007 Author completion-evidence-sentinel.md against mk-completion-sentinel real source; plugin 4/4 + core vitest 28/28 passed live (.opencode/skills/system-spec-kit/manual_testing_playbook/plugins-and-hooks/completion-evidence-sentinel.md)
- [x] T008 Author mcp-route-guard.md against mk-mcp-route-guard real source; suite 16/16 passed live (.opencode/skills/system-spec-kit/manual_testing_playbook/plugins-and-hooks/mcp-route-guard.md)
- [x] T009 Author spec-mutation-gate-enforce.md against mk-spec-gate real source; core 66 passed/0 failed + plugin 11/11 passed, enforce-OFF/ON/child/exempt/kill-switch all live-verified (.opencode/skills/system-spec-kit/manual_testing_playbook/plugins-and-hooks/spec-mutation-gate-enforce.md)
- [x] T010 Author speckit-completion-exposer.md against mk-speckit-completion real source; live completion-state resolution incl. the `.opencode/specs` fallback path verified PASS (.opencode/skills/system-spec-kit/manual_testing_playbook/plugins-and-hooks/speckit-completion-exposer.md)
- [x] T011 Backfill 4/11 scenarios for the pre-existing plugins (code-graph, spec-memory, dist-freshness-guard, session-cleanup), each confirmed PASS (.opencode/skills/system-spec-kit/manual_testing_playbook/plugins-and-hooks/code-graph-plugin.md, spec-memory-plugin.md, dist-freshness-guard.md, session-cleanup-plugin.md)
- [x] T012 Register the plugins-and-hooks/ category (11/11 scenarios) in the root playbook index (.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Independent Sonnet-5 xhigh review of 11/11 scenarios against real code; fixed 6 real defects across 5/11 scenarios (.opencode/skills/system-spec-kit/manual_testing_playbook/plugins-and-hooks/)
- [x] T014 Confirm 11/11 scenarios classify PASS with real command evidence, none mocked or stubbed (.opencode/skills/system-spec-kit/manual_testing_playbook/plugins-and-hooks/)
- [x] T015 Synchronize spec/plan/tasks/checklist and run validate.sh --strict on this phase (.opencode/specs/skilled-agent-orchestration/132-plugin-hook-implementation/009-plugin-manual-testing-playbooks/)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
