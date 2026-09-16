---
title: "Goal: move the authored tree under .skilled in rename-only commits"
description: "The durable directive for the phase that moves every tracked .opencode entry into .skilled through one verified rename commit and leaves .opencode resolvable in the shape phase 004 chose, and the criteria that decide when it is done."
trigger_phrases:
  - "skilled source root move goal"
  - "rename-only move completion criteria"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/007-source-root-move"
    last_updated_at: "2026-09-16T18:40:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Authored the directive and the move plan"
    next_safe_action: "Wait for phase 004 to freeze the layout and phase 006 to validate, then run T001"
    blockers:
      - "Phase 004 has not frozen the .opencode compatibility shape"
    key_files:
      - "plan.md"
      - "tasks.md"
      - "acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "041-007-goal"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: move the authored tree under .skilled in rename-only commits

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Every tracked file under `.opencode/` sits at the same relative path under `.skilled/` after one rename-only commit with followable history, and `.opencode/` still resolves in the shape phase 004 chose.

### Decisions

Frozen. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Commits land in this order: placeholder removal, one rename commit built from one verified `git mv` per top-level entry, then the compatibility entries. A `.gitignore` twin commit comes first only when no earlier phase added the twins. |
| D2 | The orchestrator runs every `git mv`, `git add`, `git commit`, relocation and rebuild. DeepSeek V4.1 Flash max on cli-pi runs read-only census units with kebab-case outputs, and each is re-checked before its number is used. |
| D3 | Staging is by explicit path, never `git add -A`. This phase pushes nothing, keeps the move out of the main checkout, reinstalls no hook and sets no gate bypass variable. |

### Operator copy

A change here that alters a parent decision or criterion is applied to the parent first.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `git show -M --name-status --format=` on the rename commit prints only `R100` lines, 17,767 of them unless phase 004 keeps entries in place
- [ ] Comparing the pre-move `.opencode` tree with the committed `.skilled` tree by mode, blob id and path prints no difference
- [ ] `git ls-files .opencode` lists exactly the compatibility entries phase 004 chose
- [ ] `git log --follow` reaches pre-move history for one sample per moved top-level entry
- [ ] No commit containing the move is on origin or in the main checkout, and the seven global hook links are unchanged
- [ ] The phase validates PASSED on the main checkout's toolchain
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Planning documents | Done | `spec.md`, `plan.md`, `tasks.md` and `acceptance-criteria.md` authored 2026-09-16 against the worktree at `728c4f3efc`. The main checkout's `validate.sh --strict` passes every content rule and prints `Errors: 2  Warnings: 1`, `RESULT: FAILED`: both errors are generated metadata left for `repair-derived.cjs` (T048), and the warning sits in `implementation-summary.md` |
| Move execution | Pending | Waits on phase 004's frozen layout and phases 003 to 006 validating |

### Deviations and findings

| Item | Note |
|------|------|
| Runbook stages with `git add -A` after `git mv` | Replaced by explicit staging and a name-status gate before each commit. Untracked fan-out containment snapshots sit under `specs/` in this worktree and must never be committed |
| Runbook requires an empty `git status --porcelain` | Narrowed to no tracked change and nothing untracked under `.opencode/` or `.skilled/`, for the same snapshots |
| The brief says ignored trees do not move with `git mv` | The repository documents that (`.opencode/skills/sk-git/references/worktree-workflows.md:561-567`), but git renames a moved directory on disk as one unit, so ignored content inside an entry may travel. T030 records what actually happened |
| Four grandfathered snake_case names | The CI naming guard will report them as new at their `.skilled/` paths. Routed to phase 005 before phase 011 pushes |
| Pre-push deletion ceiling | Exact renames count 0 deletions under the guard's command, measured on `11471df9b1` and `01874dbf92`. The phase's own range is expected to count 1, the placeholder |
<!-- /ANCHOR:log -->
