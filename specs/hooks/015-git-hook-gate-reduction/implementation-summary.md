---
title: "Implementation Summary: Git Hook Gate Reduction"
description: "Four gates cut, three fixed, two downgraded; the three whose CI never runs were deliberately left blocking."
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

**Fixed three.** `.opencode/hooks/hook-flags.env` advertised the emergency off-switch as
`MK_GIT_COMMIT_HOOKS_DISABLED`; the resolver at `hooks/shared/hook-flags.sh:45` builds
`SYSTEM_<CONCERN>_DISABLED` and has no alias table, so the documented escape hatch did nothing.
The MCP mutation gate in `git-hooks/pre-commit` was anchored one segment deep and matched 2 of 21
guarded scripts — a hub reorganisation had moved the rest below its reach. The tool-ownership
lint had no path trigger and spawned `node` on every commit to compare two rarely-changing files.

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

**Three gates that look redundant were kept.** comment-hygiene, prompt-card-sync and
agent-mirror-sync each have a CI workflow, and all three are `pull_request`-only while the recent
merges here are branch merges. Their CI has effectively never run, so cutting them would delete
enforcement rather than relocate it.

**Retired logic was flagged off, not deleted.** The naming gate is forced down its existing
tested skip path, so it stays covered by its own tests and returns with a one-value change.

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
| Live commit + push | Empty commit passed the reduced chain; dry-run push reached origin |
| Shell syntax | `bash -n` clean on all three hooks |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Nothing guards a force-push, and neither branch is protected.** Declined by the operator; still the largest real hole.
2. **Three CI workflows remain `pull_request`-only** and so never run on this workflow. Their local gates are the only enforcement.
3. **Two pre-push tests fail** and did so before this change; unrelated to it.
4. **A destructive reset during verification removed a real commit.** `git reset --hard HEAD~1` ran unconditionally after a commit the hook had correctly blocked. The autosync restored it from the remote. The verification step now chains the reset to the commit's success.
<!-- /ANCHOR:limitations -->
