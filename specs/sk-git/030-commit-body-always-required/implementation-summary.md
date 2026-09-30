---
title: "Implementation Summary"
description: "Every authored commit now needs a prose body, and the commit-msg hook refuses a commit without one. The skill, its guides, the callers and the tests all say the same thing."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-git/030-commit-body-always-required"
    last_updated_at: "2026-09-28T21:30:00Z"
    last_updated_by: "claude"
    recent_action: "Shipped the every-commit body rule and its docs"
    next_safe_action: "Commit the packet on Code_Environment main and push it"
    blockers: []
    key_files:
      - ".skilled/scripts/git-hooks/commit-msg"
      - ".skilled/skills/sk-git/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "12f293fe-5421-46a0-b1ea-9fdc15ce0f8e"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
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
| **Spec Folder** | 030-commit-body-always-required |
| **Completed** | 2026-09-28 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every authored commit now carries a prose body that says why, however few paths it stages. The `commit-msg` hook at `.skilled/scripts/git-hooks/commit-msg` refuses a commit without one, so a search through history finds the reason as well as the change.

### Require a commit body on every authored commit

The hook used to count staged files and ask for a body only at four or more. That block is gone, and the hook checks the body flag it already computed on every authored message. A message with only `Spec:` or `Commit-Id:` below the subject still counts as having no body. `Merge`, `Revert "`, `fixup!`, `squash!` and `amend!` subjects stay exempt, and `SPECKIT_SKIP_COMMIT_MSG_VALIDATE=1` still bypasses the check.

The hook runs for every commit on the machine, so the change also went through everything that commits under it. The deep research and deep review checkpoint commits, the hook installer's test commit, two runbooks and the Sync Loop expiry proof now pass a body.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/scripts/git-hooks/commit-msg` | Modified | Require a body on every authored commit |
| `.skilled/scripts/git-hooks/tests/commit-msg.test.sh` | Modified | Cases 18 to 20 for the one-path, trailer-only and Git-generated messages |
| `.skilled/scripts/git-hooks/tests/prepare-commit-msg.test.sh` | Modified | The both-hooks fixture commit passes a body |
| `.skilled/scripts/git-hooks/tests/README.md` | Modified | Describe the every-commit gate |
| `.skilled/skills/sk-git/SKILL.md`, `README.md` | Modified | Body contract and version `1.7.0.0` |
| `.skilled/skills/sk-git/changelog/v1.7.0.0.md` | Created | Release entry |
| `.skilled/skills/sk-git/references/`, `assets/` | Modified | State the rule and show a body in every example |
| `.skilled/skills/sk-git/feature-catalog/`, `manual-testing-playbook/` | Modified | Catalog page, GIT-004 and GIT-044 |
| `.skilled/commands/deep/assets/*.yaml`, `loop-protocol.md`, `install-git-hooks.sh`, two runbooks | Modified | Callers pass a body |
| `AI Systems/z — Claude Project Sync Loop/prove_review_expiry.py` | Modified | Fixture commit passes a body (AI Systems repo) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Baselines for each suite were recorded first, along with a negative control that runs a fixed set of messages through real commits under the global hooks. The hook and docs were then edited on `main`, staging only this packet's paths. The control was rerun on the new hook and the suites were compared with their baselines. The change is live for every commit on the machine as soon as the hook is saved, which is why the caller sweep came before anything was relied on.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Enforce in the hook and the docs together | A doc-only change would leave the four-path threshold running. A hook-only change would leave the skill contradicting it. |
| Trailers do not count as a body | A `Spec:` line is machine data and says nothing about why the change exists. |
| Keep Git-generated subjects exempt | Git wrote those messages, so an author has no body to add. |
| Leave per-document `version:` values alone | They were stale before this change, and the versioning reference says not to reconcile them to quiet `verify`. |
| Leave GIT-008 and GIT-009 as they are | Their subject-only commands are documented, never executed, and exist to be refused. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Negative control on real commits | PASS. One-path subject-only and trailer-only accepted before, refused after. With-body and revert pass both times. |
| `commit-msg.test.sh` | PASS, 19 before and 22 after, 0 fail |
| `prepare-commit-msg.test.sh` | PASS, 56 of 56 after the fixture fix. It read 54 of 56 before that fix. |
| pre-commit, pre-push, source-root, autostash, mass-deletion, commit-id, stamp-branch, worktree-naming | PASS, each equal to its baseline |
| `check-gate-inputs.test.sh` | PASS, 48 of 48 |
| sk-git `node --test` checks | PASS, 33 pass and 0 fail |
| Changelog `validate_document.py` and `hvr_scan.py` | VALID with 0 issues, 0 hard blockers |
| `check-frontmatter-versions.sh --skill sk-git` | PASS, 65 of 65 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The `verify` mode of the version tool still reports mismatches across sk-git.** They predate this change and the reference calls them expected. The enforced `gate` passes.
2. **A caller not found by the sweep can still commit subject-only.** It gets a clear refusal and the documented bypass. Callers that already run with `core.hooksPath=/dev/null` or their own hooks path are unaffected.
<!-- /ANCHOR:limitations -->

---
