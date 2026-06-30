---
title: "Tasks: Phase 1: minimax-provider-integration [template:level_1/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "name"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/098-cli-opencode-minimax-optimization/001-minimax-provider-integration"
    last_updated_at: "2026-05-28T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored phase-001 task list"
    next_safe_action: "Execute T001-T010"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/001-minimax-provider-integration"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: minimax-provider-integration

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

- [x] T001 Re-read `deepseek` provider rows in cli_reference.md §4/§5 (`.opencode/skills/cli-opencode/references/cli_reference.md`)
- [x] T002 Re-read `deepseek-v4-pro` registry entry shape (`.opencode/skills/sk-prompt/assets/model-profiles.json`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add `minimax` auth pre-flight row + login shape to cli_reference.md §4 (`.opencode/skills/cli-opencode/references/cli_reference.md`)
- [x] T005 Add `minimax \| minimax/minimax-2.7` row to cli_reference.md §5 model-selection + `--variant` matrix
- [x] T006 Add `minimax` to cli-opencode SKILL.md §3/§4 (`.opencode/skills/cli-opencode/SKILL.md`)
- [x] T007 Append `minimax-2.7` entry + bump `version` to 1.2 (`.opencode/skills/sk-prompt/assets/model-profiles.json`)
- [x] T008 [P] Update sentinel description + trigger phrases (`.opencode/skills/sk-prompt-models/SKILL.md` + `graph-metadata.json`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Validate registry: `jq . sk-prompt/assets/model-profiles.json` + confirm required keys
- [x] T010 Grep checks: `rg -n minimax` across cli-opencode docs + sentinel; run `validate.sh --strict` on this folder
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (jq + rg + strict validate)
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

