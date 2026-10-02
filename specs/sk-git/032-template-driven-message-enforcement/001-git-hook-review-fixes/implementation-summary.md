---
title: "Implementation Summary"
description: "The machine-wide git hooks no longer run code from a repository they do not trust, check only what a push adds, keep Commit-Ids right through rebases and cherry-picks, and stay silent in repositories without the toolchain."
trigger_phrases:
  - "git hook review fixes summary"
  - "hook trust block shipped"
  - "pre-push range fix"
  - "commit-id rebase copy"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/032-template-driven-message-enforcement/001-git-hook-review-fixes"
    last_updated_at: "2026-10-02T09:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "All nineteen review findings fixed and verified in worktree 075"
    next_safe_action: "Commit in worktree 075, then merge to main on the operator's go-ahead"
    blockers: []
    key_files:
      - ".skilled/scripts/git-hooks/pre-push"
      - ".skilled/scripts/git-hooks/prepare-commit-msg"
      - ".skilled/skills/sk-git/scripts/lib/message-contract.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fd6197bf-4447-484a-82b8-d9015d93169d"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Finding 12: the skill-metadata gate stays warn-only"
      - "Finding 14: skilled/v* stays exempt from the permission gate"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-git-hook-review-fixes |
| **Completed** | 2026-10-02 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A repository you clone can no longer make your git hooks run its code. Before this change, any clone that shipped the toolchain's sentinel file and a guard library got that library sourced on `pull`, `commit` or `push`. The hooks now use a repository's own tree only when it shares a git common dir with the checkout they are installed from, or when its local config sets `skilled.trustRepoHooks=true`, which no clone carries.

### Phase 1: git-hook-review-fixes

The other eighteen findings were gate bugs and drift. Pushes now check only what they add. Before, a push re-checked commits already on any remote, which blocked every branch that merged a web-UI edit, crashed on a force-push over an unfetched tip, and walked the whole history for a push by URL. A crash is now reported apart from a rule failure. A Commit-Id owner with your own author and author date counts as a rebased copy, not a collision. Every cherry-pick, clean or continued after a conflict, gets a fresh id. `git -c skgit.contractDir=...` and `GIT_CONFIG_*` no longer switch the message contract off. prepare-commit-msg removes only `Co-Authored-By:` and `Claude-Session:` lines, never the subject, and says what it removed. Comment hygiene checks the staged content, handles any file name, and runs once per commit. A `#` body line under `-m` is treated the same way by commit-msg and pre-push. Mirror parity, routing parity and two warnings no longer fire in repositories without the toolchain. The docs and headers now say what the code does.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/scripts/git-hooks/{pre-commit,prepare-commit-msg,post-commit,post-merge,post-rewrite,pre-push}` | Modified | Trust block in all six; gate fixes |
| `.skilled/scripts/git-hooks/lib/message-contract-gate.sh` | Modified | Ignores command-scope contract dir |
| `.skilled/skills/sk-git/scripts/lib/message-contract.mjs` | Modified | Contract-dir scope, Commit-Id copies, comment rule, pre-stamp attribution |
| `.skilled/skills/sk-git/scripts/validate-message.mjs` | Modified | Passes `commit.cleanup` |
| `.skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh` | Modified | Accepts several files per run |
| `.skilled/hooks/git/pre-commit` | Modified | Staged-blob hygiene |
| `.skilled/scripts/install-git-hooks.sh`, `.skilled/hooks/git/install-hooks.sh` | Modified | Friendly error, stale references |
| `.skilled/skills/sk-git/scripts/worktree-naming.sh` | Modified | Exemption comment |
| Hook, validator and checker tests (8 files) | Modified | Trust opt-in in fixtures; regression tests |
| `README.md`, `lib/README.md`, `hooks/git/README.md`, `ENV-REFERENCE.md` | Modified | Doc drift |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Claude wrote each change as literal text in a single-change brief. DeepSeek V4.1 Flash at max effort applied it through cli-opencode in worktree 075, in 22 serial dispatches. After each one, Claude read the diff, compared hook blocks byte for byte with the brief where the text was fixed, ran the affected suites, and ran the new tests against the base commit `f8519088b9` to confirm they fail there. One dispatch (the `#` rule) stopped with three old fixtures failing. They modelled an editor session without git's hint marker, so a follow-up dispatch made them editor-shaped. Nothing is committed yet.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Trust by shared git common dir, opt-in by local config only | Worktrees of the hooks' checkout keep their gates; a clone cannot opt itself in, and `-c` or `GIT_CONFIG_*` reach command scope, not local |
| Trust block outside the shared source-root block | The source-root block is also in the installer and checker, which the user runs on purpose, and its test evaluates it standalone |
| A Commit-Id copy is the same author email and author date | Rebase and amend keep both; patch-id would break on any amend that changes content |
| Strip `#` lines only when git will | git keeps them under `-m` and `-F`; its editor hint block always carries a bare comment-char line |
| Skill-metadata gate stays warn-only; `skilled/v*` stays exempt | Operator rulings of 2026-10-02 |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Hook suites (base → now) | autostash 9→9, commit-msg 29→30, mass-deletion 12→12, pre-commit 55→64, pre-push-message-contract 10→15, pre-push 43→46, prepare-commit-msg 56→66, source-root-selection 38→58; all 0 failed |
| Node tests (base → now) | git-preflight-advisory 7→7, message-contract 18→21, git-rule-checks 26→26; all 0 failed |
| Comment hygiene checker test | All cases pass, including the multi-file case |
| New tests on the base commit | Every new behaviour test fails at `f8519088b9` |
| P0 reproduction | A cloned repo's planted guard library does not run on `pull`, `commit` or a `-c` opt-in |
| `bash -n` (bash 3.2.57) | All changed shell files parse |
| Comment hygiene on changed code | 0 findings |
| sk-code drift guards | Same 56 errors as the base commit, none in a changed file |
| `install-git-hooks-worktree-harness.sh` | Fails as it did before this work (pre-existing) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Other repositories that carry the toolchain lose their tree-sourced gates** until each one runs `git config --local skilled.trustRepoHooks true`. The message contract still runs there, because its validator comes from beside the hook.
2. **`GIT_DIR` pointed at the trusted repository from a foreign working directory counts as trusted.** A repository cannot set that itself; only the user's own command can.
3. **With `commit.status=false`, git writes no hint block**, so `#` lines typed in an editor are kept by the validator while git drops them. Setting `commit.cleanup=strip` restores agreement.
4. **A cherry-pick made with `--no-verify` keeps its copied id**, and the copy rule then reads it as the same commit, because author and author date match.
<!-- /ANCHOR:limitations -->

---
