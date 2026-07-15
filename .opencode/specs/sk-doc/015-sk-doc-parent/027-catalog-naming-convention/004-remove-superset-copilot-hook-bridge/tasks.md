---
title: "Tasks: Remove the Superset/Copilot hook bridge"
description: "Task breakdown for the Superset/Copilot bridge removal: setup, implementation (deletes + edits + purge), and verification, with per-task file paths."
trigger_phrases:
  - "superset removal tasks"
  - "copilot hook bridge tasks"
  - "remove superset-notify tasks"
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/015-sk-doc-parent/027-catalog-naming-convention/004-remove-superset-copilot-hook-bridge"
_memory:
  continuity:
    packet_pointer: "sk-doc/015-sk-doc-parent/027-catalog-naming-convention/004-remove-superset-copilot-hook-bridge"
    last_updated_at: "2026-07-12T11:02:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "All removal tasks executed and verified"
    next_safe_action: "Commit path-scoped after strict validate"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Remove the Superset/Copilot Hook Bridge

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

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

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the removal manifest against the live tree via `git ls-files` + `git grep` (11 tracked + 1 untracked local)
- [x] T002 Back up the untracked root config to scratchpad (`.github/hooks/superset-notify.json` → `superset-notify.root.json.bak`)
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Deletes (pure-superset artifacts)
- [x] T003 [P] Delete notify wrapper (`.github/hooks/scripts/superset-notify.sh`)
- [x] T004 [P] Delete propagated config (`system-spec-kit/feature_catalog/.github/hooks/superset-notify.json`)
- [x] T005 [P] Delete propagated config (`system-spec-kit/mcp_server/.github/hooks/superset-notify.json`)
- [x] T006 [P] Delete propagated config (`system-spec-kit/scripts/.github/hooks/superset-notify.json`)
- [x] T007 [P] Delete webhook README (`system-spec-kit/mcp_server/.github/hooks/README.md`)
- [x] T008 [P] Delete wiring test (`system-spec-kit/mcp_server/tests/copilot-hook-wiring.vitest.ts`)

### Surgical edits (keep the file, remove the superset slice)
- [x] T009 Strip `~/.superset` block (`.github/hooks/scripts/session-start.sh`)
- [x] T010 Strip `~/.superset` block (`.github/hooks/scripts/user-prompt-submitted.sh`)
- [x] T011 [P] Remove superset sentence (`system-spec-kit/references/config/hook_system.md`)
- [x] T012 [P] Rewrite 3 superset sites (`sk-code/code-opencode/references/shared/hooks.md`)
- [x] T013 Drop Copilot/superset arm, keep Claude + OpenCode (`system-skill-advisor/.../hooks-parity-stress.vitest.ts`)
- [x] T014 Remove dangling link to deleted test (`system-spec-kit/mcp_server/tests/advisor-fixtures/README.md`)

### Local purge
- [x] T015 `rm` untracked root config; drop `.git/info/exclude` line
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 Confirm spec-kit priming survived (both lifecycle scripts still call their `*-prime.js`/`*-submit.js`, 0 superset refs)
- [x] T017 Run parity vitest (`hooks-parity-stress` → 2/2 pass under `vitest.stress.config.ts`)
- [x] T018 Live-tree grep gate = 0 (`superset-notify` / `.superset/hooks/copilot-hook` outside specs/z_archive)
- [x] T019 Orphan check = 0 (`copilot-hook-wiring` live refs)
- [x] T020 Update 027 parent `graph-metadata.json` (children_ids += 004, last_active_child_id, folded-in note)
- [x] T021 `validate.sh --recursive --strict` on parent + child = Errors 0
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks `[x]`
- [x] No `[B]` blocked tasks
- [x] Parity test passing; wiring test removed
- [x] Live-tree grep clean
- [x] Strict validate Errors 0
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
