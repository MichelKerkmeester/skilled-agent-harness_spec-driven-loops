---
title: "Tasks: Phase 19: vibe-agent-sync-check"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "vibe agent sync check tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 19: vibe-agent-sync-check

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

**Variables**: `V` is `.skilled/skills/system-spec-kit/runtime/cli/vibe`. `W` is `.github/workflows`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Baseline the three Vibe checks and the workflow (`scratch/baseline.txt`). Verify: the agent check names two stale profiles and the workflow names no Vibe check.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Regenerate the Vibe agent profiles (`.vibe/agents/`). Verify: `node V/sync-agents-vibe.cjs` writes 2 of 11 profiles, and `git diff --stat .vibe` shows only `markdown.toml` and `orchestrate.toml`.
- [x] T003 Add `.vibe/**` to both path filters and a `vibe-mirror` job that runs the three Vibe checks (`W/command-tree-parity.yml`). Verify: `actionlint` exits 0 and the job list ends with `vibe-mirror`.
- [x] T004 Say CI runs the checks (`.vibe/SYNC.md`, `W/README.md`). Verify: `rg -n 'vibe-mirror' .vibe/SYNC.md` prints one line.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Rerun the three checks and a drift mutation (`scratch/after.txt`). Verify: each check exits 0, and an appended line in a profile makes the agent check exit 1.
- [x] T006 Run strict validation on the parent and its children (`spec.md`). Verify: `RESULT: PASSED` for every folder.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `scratch/after.txt` shows the three checks passing and the mutation failing
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Origin**: the operator's question of 2026-11-15 on whether agents sync to `.vibe/`, and the answer "Regen + add CI check"
<!-- /ANCHOR:cross-refs -->
