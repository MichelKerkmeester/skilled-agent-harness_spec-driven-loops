---
title: "Implementation Summary: Remote Branch Push Permission Policy"
description: "Origin now stays curated by default: every push outside a small allowlist needs a fresh, explicit go-ahead, while local branch creation keeps its existing freedom."
trigger_phrases:
  - "implementation"
  - "summary"
  - "remote branch policy"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-git/015-remote-branch-policy"
    last_updated_at: "2026-07-17T16:01:41Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Completed Phases 1-5, tests 21/21 pass"
    next_safe_action: "Run validate strict, reconcile checklist"
    blockers: []
    key_files:
      - ".opencode/scripts/git-hooks/pre-push"
      - ".opencode/skills/sk-git/scripts/worktree-naming.sh"
      - ".opencode/skills/sk-git/scripts/remote-branch-allowlist.txt"
      - ".opencode/scripts/git-hooks/tests/pre-push.test.sh"
      - ".opencode/skills/sk-git/SKILL.md"
      - ".opencode/skills/sk-git/references/remote-branch-policy.md"
      - "AGENTS.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-git-015"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Ask scope: every push, not just creation (operator's explicit choice)."
      - "CLAUDE.md sync: yes, add a summary row (operator-approved)."
---
# Implementation Summary: Remote Branch Push Permission Policy

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 015-remote-branch-policy |
| **Completed** | 2026-07-17 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`origin` now stays curated by default: only `main`, `skilled/v*` release branches (e.g. `skilled/v4.0.0.0`), and anything the operator lists in a plain text file reach remote without asking. Every other push — a brand-new branch or a new commit on one already there — needs a fresh, explicit go-ahead in the moment it happens, both from Claude (a MANDATORY behavioral rule) and from a git hook that backstops it technically, whether the push comes from an agent or a human typing at a real terminal. Local branch and worktree creation is completely unaffected — it stays exactly as free as it was before.

### Remote-push allowlist

`is_remote_push_allowlisted()` in `worktree-naming.sh` hardcodes `main` and `skilled/v*` (so they can never be silently un-exempted), then optionally extends the exemption list from `remote-branch-allowlist.txt` — one glob pattern per line, matched with bash `case`. Deleting or emptying that file only narrows exemptions back to the two built-ins; it can never widen what's allowed. A new `validate-remote-allowlist <branch>` CLI subcommand lets anyone check the allowlist directly.

### Pre-push permission gate

The `pre-push` hook now runs two independent gates per pushed ref: the existing naming gate (new branches only, migration-tolerant for updates) and a new permission gate (every push, new or update). The permission gate checks the allowlist, then `SPECKIT_ALLOW_REMOTE_PUSH=1`, then a narrowly scoped exception for the continuous-integration autosync's live-branch publish (`SPECKIT_AUTOSYNC=1` AND the exact `$SPECKIT_LIVE_BRANCH`, never a blanket bypass) — and blocks with the exact retry command otherwise. `SPECKIT_SKIP_PREPUSH_NAMING=1` no longer implies a bypass of this gate; the two are fully independent now.

### sk-git behavioral rule

SKILL.md's new "Remote Push Permission Enforcement" subsection (mirroring the existing "Workspace Choice Enforcement" pattern) makes the ask MANDATORY: an explicit in-turn user push instruction counts as the go-ahead (no redundant re-ask), otherwise Claude asks directly before pushing. `finish-workflows.md`'s Option 2 push snippet and the Step 5b reconciliation snippet both now show `SPECKIT_ALLOW_REMOTE_PUSH=1` where it applies.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Built bottom-up and verified at each layer before moving on: the allowlist function was smoke-tested directly via its CLI subcommand (confirmed `main`, `skilled/v4.0.0.0`, a custom `develop` pattern, and an arbitrary non-listed branch all resolve correctly) before the hook was touched. The hook rewrite was checked with `bash -n` for syntax, then verified against a manual dry-run invocation in the real repo tree (both the BLOCKED message and the bypass-var path render correctly). The test suite was rewritten scenario-by-scenario against a documented before/after table (research.md §5), run to green (`PASS=21 FAIL=0`), and the three other existing git-hook test harnesses in the same directory were re-run to confirm no collateral regression. No scratch artifacts were left behind.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Two-layer enforcement (agent ask + hook backstop), not a GitHub ruleset | A git hook can't "ask," and GitHub rulesets can't either — they're binary allow/deny, and this repo's own `main-protection` ruleset already grants the repo-owner role an unconditional bypass, confirmed via `gh api`. Only local enforcement gives the operator's own manual pushes the same safety net as agent-issued ones. |
| Hardcoded `main`/`skilled/v*` plus an optional allowlist file, not a config-file-only source | A deleted or emptied file must only narrow exemptions, never widen them — putting the two defaults solely in an editable file would break that guarantee. |
| Autosync exemption scoped to the exact live branch, not a blanket `SPECKIT_AUTOSYNC=1` bypass | Blocking autosync outright would silently regress the working continuous-integration feature; a blanket bypass would turn one env var into a side-channel for pushing any branch unasked. Exact-match scoping gets both right. |
| Ask every push, not just the branch's first creation | Operator's explicit choice over the recommended lighter option — a prior approval doesn't carry forward, so even a branch already on origin asks again on its next push. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `pre-push.test.sh` (rewritten, 21 scenarios) | PASS — `PASS=21 FAIL=0` |
| `install-git-hooks-worktree-harness.sh` | PASS — no regression from the pre-push header/behavior change |
| `memory-drift-marker-lock-harness.sh` | PASS — unaffected (different hook) |
| `post-commit-code-graph-invalidation.sh` | PASS — unaffected (different hook) |
| `bash -n` syntax check on `pre-push` and `worktree-naming.sh` | PASS |
| CLI smoke test: `validate-remote-allowlist main` / `skilled/v4.0.0.0` / `sk-git/0044-foo` | PASS — ok/ok/not-allowlisted as expected |
| Manual hook invocation against the real repo tree (non-allowlisted branch, bypass var, `skilled/v4.0.0.0`) | PASS — BLOCKED message renders correctly; bypass and allowlisted branches pass with rc=0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Existing remote branches not on the allowlist need the bypass var on their next push.** `origin/skilled/0064-spec-root-resolution-impl` and similar in-flight branches will hit the new gate the next time anyone pushes to them. This is the operator's explicit "ask every push" choice, not an oversight, but worth knowing before the next push to one of those surprises anyone.
2. **A version bump / changelog entry for `sk-git`'s `SKILL.md` was not authored.** This repo's convention pairs every SKILL.md content change with a version bump and a matching `changelog/vX.md` file via the `sk-doc/create-diff` skill; that skill was not invoked here since it wasn't the focus of this task. `SKILL.md`'s `version:` field is unchanged at `1.3.2.0` despite the new subsection and ALWAYS #18. Flagging so it isn't mistaken for stale metadata.
3. **`.github` was investigated and deliberately left untouched.** See `decision-record.md` ADR-001. No ruleset change is recommended; ruled out with evidence (`gh api` output on the existing `main-protection` ruleset), not left unexamined.
<!-- /ANCHOR:limitations -->
