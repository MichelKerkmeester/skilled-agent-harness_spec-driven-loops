---
title: "Tasks: Worktree/Branch Naming Overhaul [template:level-3/tasks.md]"
description: "Level 3 task list for the naming overhaul: allocator + validators, pre-push gate, migration helper, self-test, docs rewrite, and packet verification."
trigger_phrases:
  - "tasks"
  - "worktree"
  - "branch"
  - "naming"
  - "grammar"
  - "allocator"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-git/022-worktree-branch-naming-overhaul"
    last_updated_at: "2026-08-16T00:00:00Z"
    last_updated_by: "sk-git"
    recent_action: "Author the Level 3 task list for the naming overhaul"
    next_safe_action: "Execute phases in order"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "022-tasks"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Worktree/Branch Naming Overhaul

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort] {deps: T###}`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:milestones -->
## Milestone Reference

| Milestone | Tasks | Target |
|-----------|-------|--------|
| M1 | T001-T003 | Allocator + validators |
| M2 | T004-T005 | Pre-push + migration helper |
| M3 | T006-T007 | Self-test + docs |
| M4 | T008-T010 | Packet + verification |

<!-- /ANCHOR:milestones -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the frozen spec and the existing allocator/hook/harness (`.opencode/skills/sk-git/scripts/worktree-naming.sh`, `.opencode/scripts/git-hooks/pre-push`, `.opencode/skills/sk-git/scripts/tests/worktree-naming.test.sh`) [15m]
- [x] T002 Inventory every doc that mentions the old grammar (sk-git tree + root agent files) [15m]
  - **Evidence**: grep over `AGENTS.md` + `.opencode/skills/sk-git/` returns the full reference list (100+ matches across docs).
- [x] T003 Confirm allowed file scope and revert any `.opencode/package.json` / `package-lock.json` bump [5m]

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Allocator + Validators
- [x] T004 Rewrite `worktree-naming.sh` grammar header + per-namespace numbering model [20m] {deps: T001}
- [x] T005 Replace validators (`is_valid_nnn`, `is_backup_branch`, extended `is_valid_branch`, reworked `is_valid_pair`; drop `is_valid_owner`/`load_skill_ids`) [40m] {deps: T004}
- [x] T006 Rework scan/allocate for two per-namespace counters with separate high-water files + shared lock; update `create`/`create-branch`/`allocate` CLI and usage [40m] {deps: T005}

### Pre-Push Hook
- [x] T007 Update `pre-push` `_expected_grammar`; check `is_wrapper_branch` first; ensure `backup/*` reaches the permission gate; reword "owner-first" messages [25m] {deps: T006}

### Migration Helper
- [x] T008 Write `migrate-legacy-branch-names.sh` with `--dry-run`, legacy scan, ascending renumbering, idempotence + collision safety [35m] {deps: T006}

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Self-Test Harness
- [x] T009 Rewrite `worktree-naming.test.sh` for the new grammar, per-namespace scan + no-skip, concurrent + stale-lock allocation, named/dedicated/detached creators [40m] {deps: T006}

### Docs Rewrite
- [x] T010 Rewrite `SKILL.md`, `AGENTS.md` rows, references, support docs, feature catalog, and manual-testing-playbook scenarios [150m] {deps: T006}

### Packet Docs
- [x] T011 Author `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`; keep spec.md Status [40m] {deps: T009, T010}

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] All milestones achieved.
- [x] `bash -n` clean on all three scripts.
- [x] Self-test harness `FAIL=0`.
- [x] Packet `validate.sh --strict` 0/0.
- [x] No owner-first references remain in the changed docs.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decisions**: See `decision-record.md`

<!-- /ANCHOR:cross-refs -->
