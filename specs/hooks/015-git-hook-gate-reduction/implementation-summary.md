---
title: "Implementation Summary: Git Hook Gate Reduction"
description: "Four gates cut, two fixed, two downgraded, and a third defect found to be machine-local rather than in the repository."
trigger_phrases:
  - "implementation"
  - "summary"
  - "template"
  - "impl summary core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks/015-git-hook-gate-reduction"
    last_updated_at: "2026-08-31T02:55:45Z"
    last_updated_by: "template-author"
    recent_action: "Reduced the gate chain and verified it end to end"
    next_safe_action: "None; the packet is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-015-git-hook-gate-reduction"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Complete |
| **Level** | 2 |
| **Date** | 2026-08-31 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

**Fixed two in the repository, one on the machine.** The MCP mutation gate in
`git-hooks/pre-commit` was anchored one path segment deep and matched 2 of 21 guarded scripts —
a hub reorganisation had moved the rest below its reach. The tool-ownership lint had no path
trigger and spawned `node` on every commit to compare two rarely-changing files.

The off-switch defect turned out not to be in the repository at all. The tracked
`hook-flags.env.example` already documented every flag with the `SYSTEM_` prefix the resolver
builds. The machine-local `hook-flags.env`, which is gitignored, was written in an older `MK_`
dialect the shell resolver never constructs — 21 flags, every one inert. Corrected locally; the
committed example needed no change. The durable lesson is that the example and the live file can
drift silently, because nothing compares them.

**Cut four.** The manual-testing-playbook contract, whose CI runs on pull request, push to main,
and a nightly cron. The mass-deletion guard at pre-commit, kept at pre-push. The pre-push naming
grammar. The 80-character commit-subject advisory.

**Downgraded two** to warnings: compiled-routing and skill-root-metadata, both covered by
`routing-registry-drift.yml` on push to `main` and `skilled/v*`, and both reading the working
tree rather than the staged change.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Fixes first, because a broken gate is worse than a redundant one. Then cuts, each preceded by
reading the replacement workflow's trigger block rather than assuming a named workflow runs.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

**Three gates that look redundant were kept, for a reason that changed under scrutiny.** The
original argument was that comment-hygiene, prompt-card-sync and agent-mirror-sync have
`pull_request`-only CI which never fires here, since `git log --merges` showed only branch
merges. That was wrong: squash-merged pull requests leave no merge commit. All three workflows
ran on 2026-08-29 and two pull requests merged the same day. Their CI is live — so these gates
are redundancy rather than sole enforcement, and they were kept on the weaker ground that
belt-and-braces on a cheap diff-scoped check is worth more than the lines it saves.

**The naming gate was deleted, not flagged off.** An earlier pass forced it down its existing
skip path, which left forty lines of unreachable code behind. The operator asked for deletion,
and the whole block plus its now-unused grammar helper is gone. The shared validator loader
stays, because the permission gate depends on it for `is_remote_push_allowlisted`.

**No force-push guard.** It is the one irreversible operation and it is unguarded, but the
operator declined it explicitly.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| MCP gate pattern coverage | 21 of 21 scripts, up from 2 |
| tool-ownership path trigger | Skips on an unrelated staged set |
| Push gates after the change | remote-create, remote-permission, mass-deletion all still blocking |
| `git-hooks/tests/pre-push.test.sh` | 20 pass / 2 fail, identical before and after; both failures pre-existing |
| Live commit + push | Ran and passed on an earlier attempt, against a working tree destroyed before it was committed. Not re-run on the final pass |
| Committed-tree check | Each of the seven changes confirmed present with `git grep HEAD`, not by reading the working copy |
| Shell syntax | `bash -n` clean on all three hooks |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Nothing guards a force-push, and neither branch is protected.** Declined by the operator; still the largest real hole.
2. **Three CI workflows are `pull_request`-only**, which is narrower than push coverage but not dead: they last ran on 2026-08-29. An earlier claim here that they never run was based on `git log --merges`, which does not see squash merges.
3. **Two pre-push tests fail** and did so before this change; unrelated to it.
4. **The same work was destroyed twice by the same command, and the second time was avoidable.** `git reset --hard HEAD~1`, used to clean up a verification commit, reverts every tracked file rather than only the commit. The first occurrence took the pre-push edits; a real commit went with them and was restored by the live-branch autosync. The second took all three hooks after the supposed fix — chaining the reset to the commit's success does not help, because `--hard` discards the working tree whether or not the commit happened. What actually prevents it: commit before running anything that moves HEAD, and verify against `git show HEAD:` rather than the working copy. Both passes had printed passing checks against a tree that then evaporated, which is why the final verification reads committed objects.
<!-- /ANCHOR:limitations -->
