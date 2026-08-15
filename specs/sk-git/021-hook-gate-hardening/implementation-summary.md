---
title: "Implementation Summary: git hook gate hardening"
description: "Hardened live-sync gates and records the in-progress SessionStart primary-checkout reconciliation work item."
trigger_phrases:
  - "git hook gate hardening"
  - "autosync gate rejection"
  - "skill root metadata self heal"
  - "durable pre-push failure log"
  - "session start primary reconcile"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/021-hook-gate-hardening"
    last_updated_at: "2026-08-15T14:57:27Z"
    last_updated_by: "opencode"
    recent_action: "Delivered and verified SessionStart primary reconciliation"
    next_safe_action: "Review the scoped diff; no real repository push was performed"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 021-hook-gate-hardening |
| **Completed** | Work Item 1 and Work Item 2: 2026-08-15 |
| **Level** | 2 |
| **Status** | Complete |
| **Completion** | 100% |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

The hook chain now preserves gate independence and makes every known autosync push rejection observable. `git-sync.sh` captures pre-push stderr instead of discarding it, classifies stable `[gate:<name>]` markers, replays the original hook output, emits a loud `AUTOSYNC BLOCKED` line, and appends the gate name plus repair command to the common-dir log. Known gate blocks stop immediately and are not retried as push races.

The skill-root metadata gate remains blocking for manual and autosync pushes. Hook-side `--fix` was rejected because the commit already exists when `pre-push` runs. Regenerating only working-tree files would let stale committed bytes reach the remote. Exact autosync blocks therefore print and log the deterministic `ci-skill-root-metadata.cjs --fix` command.

The naming gate now exempts only an exact autosync destination equal to `$SPECKIT_LIVE_BRANCH`, including first publication. Remote permission uses the same narrow predicate. Mass deletion and enforced tests keep their blocking verdicts. Broken helper loads warn and fail open only for their own concern, so they cannot suppress unrelated gates or the post-commit publisher.

Two pre-existing gate-independence defects were also corrected. A missing advisory doc-model validator no longer exits before later commit gates, and `SPECKIT_SKIP_DOC_MODEL_VALIDATE=1` no longer bypasses every commit gate. A missing or malformed naming helper no longer exits before skill metadata and test checks.

### Files Changed

| File | Purpose |
|------|---------|
| `.opencode/scripts/git-hooks/pre-push` | Concern-local helper failures, exact autosync naming behavior, per-ref skill-change detection, stable gate ids |
| `.opencode/scripts/git-hooks/pre-commit` | Concern-local source failures, independent advisory bypass, stable blocking gate ids |
| `.opencode/scripts/git-hooks/post-commit` | Broken helper warnings that continue to autosync |
| `.opencode/scripts/git-hooks/lib/mass-deletion-guard.sh` | Stable mass-deletion gate id |
| `.opencode/bin/git-sync.sh` | Captured stderr, gate classification, loud output, durable repair records |
| `.opencode/skills/sk-git/references/continuous-integration.md` | Complete lifecycle gate map and publisher behavior |
| `.opencode/skills/sk-git/references/remote-branch-policy.md` | Exact autosync naming and permission scope plus safety-block behavior |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation used the smallest concern-local changes. No safety verdict was weakened. Simulations replaced the Git executable with exported Bash functions, then ran the real hook and publisher scripts against temporary fixture files outside the workspace. This exercised the exact stderr boundary and durable logging path without creating refs, commits, or pushes.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep skill metadata blocking instead of auto-fixing | `pre-push` cannot add regenerated working-tree bytes to the commit already being published |
| Use stable gate markers | Classification no longer depends on mutable prose or mistakes a policy rejection for a race |
| Log normalized repair guidance, not complete stderr | Durable records stay useful without persisting arbitrary command output |
| Exempt exact live destinations from naming | The wrapper branch is only the local source; the operator selected the remote live branch before the session |
| Fail helper problems open per concern | One optional helper cannot suppress independent gates or autosync |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash -n` on five modified shell files | PASS, exit 0 for each |
| ShellCheck on five modified shell files | PASS, no findings |
| Comment hygiene on five modified shell files | PASS, zero violations |
| Skill-root blocked autosync simulation | PASS, original diagnostics plus loud classification and durable `gate=skill-root-metadata` record |
| Mass-deletion blocked autosync simulation | PASS, 101 deletions remain blocked and durable `gate=mass-deletion` record includes exact retry command |
| Clean autosync simulation | PASS, quiet terminal and durable `published` fast-forward record |
| First-publication naming simulation | PASS, exact autosync live destination exits 0 with no output |
| Strict packet validation | PASS, Errors 0 and Warnings 0 |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. A skill metadata failure requires a follow-up commit containing regenerated projections. This is intentional because changing only the post-commit working tree cannot repair bytes already committed.
2. Missing naming or permission infrastructure remains fail-open by established policy, but now warns and does not suppress independent safety gates.
3. Behavioral simulations use shell command stubs because the task forbids Git operations. They exercise the real scripts and output boundary but do not contact a remote.

<!-- /ANCHOR:limitations -->
---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Prefer skill metadata self-heal if safe | Kept the gate blocking with loud and durable repair guidance | Hook-side regeneration cannot alter the commit being pushed and would produce a false-green re-check |

<!-- /ANCHOR:deviations -->
---

<!-- ANCHOR:work-item-2 -->
## Work Item 2: SessionStart Primary Reconcile

### Status

Complete. The implementation and all Git mutations were verified against temporary local repositories and a bare local remote. No command pushed to or rewrote history in the real repository.

### Deliverable

The second work item replaces reliance on a long-running primary-checkout follower with a bounded SessionStart reconcile step. `.opencode/bin/git-primary-reconcile.sh` is the sole owner of checkout, branch, dirty-tree, disable, lock, fetch, rebase, push, conflict-abort, classification, and durable-log behavior. Runtime wiring only backgrounds that script.

The main-checkout gate compares canonical `git-dir` and `git-common-dir` paths before flags, logs, locks, or fetches. The script then resolves the shared live-sync and primary-reconcile flags, acquires an atomic common-dir lock, requires the current branch to match the live branch, and checks tracked unstaged plus staged changes before network access. Clean behind-only state fast-forwards. Clean local commits rebase and publish non-force. Conflicts abort and assert original HEAD plus clean tracked state. Push rejection reuses the stable gate markers from `git-sync.sh` and preserves the local commit.

Claude and Codex use background shell commands with closed stdio. OpenCode uses a detached, unref'd child with an asynchronous error listener. Pi uses its existing SessionStart advisory surface to launch the same script in the background. The optional follower remains available for low-latency updates, but correctness now has a reliable SessionStart boundary.

### Files Changed

| File | Purpose |
|------|---------|
| `.opencode/bin/git-primary-reconcile.sh` | Always-zero primary reconcile source of truth and durable log owner |
| `.claude/settings.json` | Background reconcile at Claude SessionStart |
| `.codex/hooks.json` | Background reconcile at Codex SessionStart |
| `.opencode/plugins/session-cleanup.js` | Detached reconcile on OpenCode `session.created` |
| `.opencode/skills/system-spec-kit/mcp-server/hooks/pi/session-start-advisories.ts` | Background reconcile at Pi SessionStart |
| `.opencode/skills/sk-git/references/continuous-integration.md` | Four-script model, tracked-only safety, publication, conflict, and opt-out behavior |
| `.opencode/skills/system-spec-kit/mcp-server/ENV-REFERENCE.md` | Master-loop update and `MK_PRIMARY_RECONCILE_DISABLED` row |
| `AGENTS.md` | One-line live-sync summary updated for startup reconcile |

### Verification

| Check | Result |
|-------|--------|
| Shell syntax and JSON validity | PASS: `bash -n`; both `JSON.parse` commands exited 0 |
| Shell quality | PASS: ShellCheck and comment hygiene reported no findings |
| Tracked-dirty skip | PASS: HEAD `01281b5`, file hash, remote `b1a9764`, and stale tracking ref unchanged |
| Clean behind fast-forward | PASS: local reached `4ed6b47`, remote unchanged, untracked artifact preserved |
| Clean local commit rebase and publish | PASS: local `2bb7686` rebased to `4adc7fa`; bare remote advanced from `4f6b8b5` to `4adc7fa` |
| Rebase conflict abort and preservation | PASS: local `ae2a51b` and remote `0c43bd9` unchanged; tracked clean; no rebase state |
| Linked-worktree no-op | PASS: primary, linked, and remote remained `6237ea3`; silent output |
| Master and concern disable no-op | PASS: HEAD/tracking `3e6e4ac` unchanged while remote remained `d1d396e`; both outputs silent |
| Classified pre-push rejection | PASS: `[gate:test-suites]` became `BLOCK [test-suites]`; local `c8bdfd1` preserved; remote `3e6e4ac` unchanged |
| OpenCode plugin lifecycle | PASS: 13 tests passed, 0 failed |
| MCP server TypeScript typecheck | PASS: `tsc --noEmit --composite false -p tsconfig.json` |
| sk-code drift wrapper | PARTIAL: stack-folders passed and router-sync passed 10/10; alignment-drift remained red on unrelated repository-wide malformed benchmark JSON, archived scratch strict-mode debt, and dead routes outside the scoped files |
| Metadata refresh and strict packet validation | PASS: generated metadata refreshed; Errors 0 / Warnings 0 |

<!-- /ANCHOR:work-item-2 -->
