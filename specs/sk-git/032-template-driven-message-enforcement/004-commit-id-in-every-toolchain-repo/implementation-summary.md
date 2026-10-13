---
title: "Implementation Summary"
description: "Every repository that uses sk-git now gets a Commit-Id on each commit, trusted or not, and a commit without one cannot be made or pushed there."
trigger_phrases:
  - "commit id in every toolchain repo implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/032-template-driven-message-enforcement/004-commit-id-in-every-toolchain-repo"
    last_updated_at: "2026-10-13T20:40:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Commit-Id policy and gates in place, suites green"
    next_safe_action: "Commit the phase on the operator's go-ahead"
    blockers: []
    key_files:
      - ".skilled/scripts/git-hooks/lib/commit-id-policy.sh"
      - ".skilled/scripts/git-hooks/prepare-commit-msg"
      - ".skilled/scripts/git-hooks/commit-msg"
      - ".skilled/scripts/git-hooks/pre-push"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "16736890-ae79-4ab6-8f04-75a04b69625f"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Should Moneybird Accountant carry ids?"
    answered_questions: []
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
| **Spec Folder** | 004-commit-id-in-every-toolchain-repo |
| **Completed** | 2026-10-13 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every repository that uses sk-git now gets a `Commit-Id` on each commit, whether the hooks trust it or not. The stamper used to mint only through the repository's own allocator, which the phase 1 trust gate hides in any clone that does not share the hooks' git dir. Barter lost ids on 52 commits that way, and the three public repositories never had any. A new helper decides coverage once for all three hooks. When the repository's allocator is hidden or missing, the stamper mints through the allocator beside the hooks, which only reads history. Because the stamper never blocks, commit-msg now refuses a covered message without an id, and pre-push Gate 7 refuses any added commit without one.

The probe of git's source argument found two more silent gaps. A revert continued after a conflict arrives as `merge` and a squash commit as `squash`, and the stamper left both alone. Now only a real merge, with `MERGE_HEAD` pending, stays unstamped.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/scripts/git-hooks/lib/commit-id-policy.sh` | Created | Coverage, own-allocator path and id test |
| `.skilled/scripts/git-hooks/prepare-commit-msg` | Modified | Fallback allocator, continued revert and squash stamped |
| `.skilled/scripts/git-hooks/commit-msg` | Modified | Refuse a covered message without an id |
| `.skilled/scripts/git-hooks/pre-push` | Modified | Gate 7 |
| `tests/prepare-commit-msg.test.sh`, `tests/commit-msg.test.sh`, `tests/pre-push.test.sh` | Modified | New cases, other-gate fixtures exempted |
| Hook, lib and tests READMEs | Modified | Policy, flag and Gate 7 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The gap was reproduced first on the hooks at HEAD: an untrusted clone that ships the allocator and a repository with ids in its history both came out unstamped. A probe repository then logged the source argument git passes for each commit kind. The edits went straight into this checkout, as the operator chose, so every file was syntax-checked before the next edit. Each new case was then run against copies of the hooks at HEAD to prove it fails there.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Presence is a hook rule, not a contract rule | The three public repositories have no rulebook, so a contract rule would never reach them |
| Coverage by allocator, sentinel or the last fifty commits | That reaches every repository that ever used sk-git with no setup, and the bounded probe keeps large foreign repositories cheap |
| Local `skilled.commitId` overrides both ways | The operator asked for an opt-in and an opt-out, and local scope is the one a clone cannot carry |
| Keep a trusted toolchain's own allocator | A linked worktree of this checkout may carry a newer allocator, as with the validator |
| Fixtures that test other gates set `skilled.commitId false` | They model toolchain repositories whose commits have no ids, and Gate 7 has its own section |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Hook suites before the change | 9 suites, 381 cases, all PASS |
| Hook and allocator suites after | 10 suites: autostash 9, commit-msg 44, gate-config 25, mass-deletion 12, pre-commit 111, pre-push contract 15, pre-push 50, prepare-commit-msg 78, source-root 58, commit-id-naming 39, all PASS |
| New cases against the hooks at HEAD | prepare-commit-msg 7 FAIL, commit-msg 2 FAIL, pre-push 1 FAIL, each a new case |
| `shellcheck -S warning` on the four scripts and three suites | exit 0 |
| Coverage of local repositories | Barter, the three public repositories, this checkout, Obsidian Plugin and anobel.com covered. Moneybird, Plex and two personal sites not covered |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`git push --no-verify` skips Gate 7.** No hook can prevent it. CI in each repository would close it.
2. **Existing history keeps its gaps.** Obsidian Plugin has 1,327 commits without ids and anobel.com 135. Only new commits are stamped and checked, and a backfill is a history rewrite the operator approves per repository.
3. **Moneybird Accountant is not covered.** Its rulebook says it carries no Commit-Id. Covering it needs a Commit-Id machine key in that rulebook and `skilled.commitId true`.
<!-- /ANCHOR:limitations -->

---
