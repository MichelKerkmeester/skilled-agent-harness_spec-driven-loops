---
title: "Tasks: system-spec-kit integration [template:level_1/tasks.md]"
description: "Task list for integrating mk-goal into system-spec-kit references, assets, and routing docs."
trigger_phrases:
  - "goal plugin integration tasks"
  - "mk-goal docs tasks"
  - "system-spec-kit goal reference"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/032-goal-opencode-plugin/008-system-spec-kit-integration"
    last_updated_at: "2026-06-30T18:05:00Z"
    last_updated_by: "opencode-gpt"
    recent_action: "Completed and verified system-spec-kit goal plugin docs integration"
    next_safe_action: "Phase complete; restart OpenCode before relying on changed plugin docs in a fresh session"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/SKILL.md"
      - ".opencode/skills/system-spec-kit/references/hooks/goal_plugin.md"
      - ".opencode/skills/system-spec-kit/manual_testing_playbook/18--ux-hooks/goal-opencode-plugin.md"
    session_dedup:
      fingerprint: "sha256:f81ea6b5135398414319c9e07f124145b03d0178cbc439bc3e0a5cdc6fbdf38e"
      session_id: "goal-system-spec-kit-integration-20260630"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: system-spec-kit integration

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

- [x] T001 Create phase 008 scaffold (`008-system-spec-kit-integration/`)
- [x] T002 Read current `mk-goal` plugin and `/goal` command (`.opencode/plugins/mk-goal.js`, `.opencode/commands/goal.md`)
- [x] T003 [P] Read existing system-spec-kit plugin integration references (`SKILL.md`, `hook_system.md`, plugin bridge README, feature catalog examples)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add goal-plugin operator reference (`.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md`)
- [x] T005 Update system-spec-kit routing and runtime docs (`SKILL.md`, `references/config/hook_system.md`, `ARCHITECTURE.md`)
- [x] T006 Update bridge/env boundary docs (`mcp_server/plugin_bridges/README.md`, `mcp_server/ENV_REFERENCE.md`)
- [x] T007 Add feature catalog and manual playbook assets (`feature_catalog/18--ux-hooks/goal-opencode-plugin.md`, `manual_testing_playbook/18--ux-hooks/goal-opencode-plugin.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run targeted goal plugin tests (`.opencode/plugins/__tests__/mk-goal-*.test.cjs`) - evidence: six goal plugin tests PASS
- [x] T009 Run docs structure/alignment checks (`sk-doc extract_structure`, `verify_alignment_drift.py`) - evidence: new docs extract clean; alignment PASS with one unrelated existing warning
- [x] T010 Restamp generated metadata and run strict parent validation (`validate.sh --strict`) - evidence: parent packet and all nine phases PASS
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` with evidence in `implementation-summary.md`
- [x] No `[B]` blocked tasks remaining
- [x] Targeted docs/plugin verification and strict parent validation passed
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
