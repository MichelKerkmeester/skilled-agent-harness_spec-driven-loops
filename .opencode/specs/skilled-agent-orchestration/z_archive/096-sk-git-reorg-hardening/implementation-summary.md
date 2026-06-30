---
title: "Implementation Summary [skilled-agent-orchestration/z_archive/096-sk-git-reorg-hardening/implementation-summary]"
description: "The sk-git skill now carries concrete guidance and a runbook for large rename/reorg + worktree workflows, closing the five failure modes hit during the 026 wave-4 reorg."
trigger_phrases:
  - "sk-git reorg hardening summary"
  - "git worktree gitignored deps"
  - "rename-heavy merge guidance"
  - "scoped staging discipline"
  - "large reorg playbook"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/096-sk-git-reorg-hardening"
    last_updated_at: "2026-05-26T19:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored implementation-summary.md for completed sk-git hardening"
    next_safe_action: "Run validate.sh --strict and report"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - ".opencode/skills/sk-git/SKILL.md"
      - ".opencode/skills/sk-git/references/worktree_workflows.md"
      - ".opencode/skills/sk-git/references/commit_workflows.md"
      - ".opencode/skills/sk-git/references/shared_patterns.md"
      - ".opencode/skills/sk-git/references/large_reorg_playbook.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | skilled-agent-orchestration/z_archive/096-sk-git-reorg-hardening |
| **Completed** | 2026-05-26 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The 026 wave-4 reorg renamed ~9000 files across 17 phases inside a worktree, then merged to main. That run hit five avoidable failure modes the sk-git skill said nothing about. The skill now walks an operator through each one with concrete commands, so the next large reorg stays smooth and safe.

### Worktree caveats and leftover-cruft cleanup

`worktree_workflows.md` gained §8b. It covers three traps a fresh worktree springs on you: `git mv` leaves gitignored files behind so old source dirs linger on disk as "double" folders even though the repo is clean; a fresh worktree lacks gitignored build deps (`node_modules`, `dist`), which makes the spec-kit toolchain crash or silently no-op on zero files; and the memory/vector DBs are a single global instance, not per-worktree. The fix in all three cases is to run the toolchain and DB ops on main post-merge. The section ships a detection one-liner: a dir is safe to remove when `git ls-files <dir>` is empty AND `git status --porcelain --untracked-files=all -- <dir>` is empty.

### Scoped-staging discipline

`commit_workflows.md` gained §3 Step 7. It forbids `git add -A`, `git add .`, and broad `git add <folder>` on a dirty tree, and reminds you that unrelated WIP may already sit staged in the index. It ships a copy-paste pre-commit deny-pattern assertion (grep `git diff --cached --name-only` against a deny regex, abort if non-empty), a `git stash pop` caveat (a pop can restore entries as staged), and a recovery path via `git reset --mixed HEAD~1` to un-commit while keeping changes, then re-stage precise pathspecs.

### Rename-heavy merge verification

`shared_patterns.md` gained §10 (the old §10 Related Resources moved to §11). It proves disjointness with `comm -12` of each side's changed-file list (must be empty), raises `merge.renameLimit`/`diff.renameLimit` for large rename sets, verifies the tree with `git ls-files` rather than `ls` so gitignored leftovers do not read as real folders, and confirms renames recorded as `R` status instead of delete+add churn.

### Large-reorg runbook

`large_reorg_playbook.md` is new. It is a step-ordered runbook (steps 0-5) plus a failure-mode quick map. Step 0 snapshots the global DB dir with `cp -a`, since the DBs are gitignored and `git revert` cannot restore them, making the snapshot the only rollback path.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-git/references/worktree_workflows.md` | Modified | §8b worktree caveats + leftover-cruft detection |
| `.opencode/skills/sk-git/references/commit_workflows.md` | Modified | §3 Step 7 scoped-staging discipline + recovery |
| `.opencode/skills/sk-git/references/shared_patterns.md` | Modified | §10 rename-heavy merge verification |
| `.opencode/skills/sk-git/references/large_reorg_playbook.md` | Created | Step-ordered large-reorg runbook |
| `.opencode/skills/sk-git/SKILL.md` | Modified | Discoverability pointers to §3 Step 7 and §10 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Two sibling agents split the work. Agent 1 owned the worktree side: `worktree_workflows.md` §8b, the new `large_reorg_playbook.md`, and the SKILL.md routing rows. Agent 2 owned the commit/merge side: `commit_workflows.md` §3 Step 7 and `shared_patterns.md` §10, cross-linked so each half points at the other. This documentation pass then added the two remaining SKILL.md discoverability pointers Agent 2 requested and authored the packet governance docs. Verification ran `validate.sh --strict` on the packet until it returned RESULT: PASSED.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Run toolchain and DB ops on main post-merge, never in the worktree | A fresh worktree lacks gitignored deps and the DBs are a single global instance, so worktree runs are meaningless or actively harmful |
| Snapshot the DB dir with `cp -a` as playbook step 0 | The DBs are gitignored, so `git revert` cannot restore them; the copy is the only rollback path |
| Verify the merged tree with `git ls-files`, not `ls` | `git mv` leaves gitignored leftovers on disk that `ls` shows as duplicate folders even when the commit is correct |
| Keep new guidance in references, SKILL.md carries only pointers | Keeps the skill index concise while staying discoverable |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate.sh --strict` on the packet | PASS (RESULT: PASSED, exit 0) |
| worktree_workflows.md §8b present | PASS |
| commit_workflows.md §3 Step 7 present | PASS |
| shared_patterns.md §10 present | PASS |
| large_reorg_playbook.md exists | PASS |
| SKILL.md pointers to §3 Step 7 and §10 | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Documentation-only.** This packet adds guidance, not automation. There is no script that runs the detection one-liner or the deny-pattern assertion for you; the operator copies them by hand.
2. **Incident-specific.** Guidance is drawn from the 026 wave-4 reorg. Other reorg shapes may surface modes not covered here; extend the playbook if so.
<!-- /ANCHOR:limitations -->
