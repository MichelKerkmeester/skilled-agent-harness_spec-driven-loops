---
title: "Implementation Summary: git hook gate hardening"
description: "Hardened commit and push gate independence, made autosync gate rejections loud and durable, and preserved all real safety blocks."
trigger_phrases:
  - "git hook gate hardening"
  - "autosync gate rejection"
  - "skill root metadata self heal"
  - "durable pre-push failure log"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/021-hook-gate-hardening"
    last_updated_at: "2026-08-15T13:52:00Z"
    last_updated_by: "opencode"
    recent_action: "Delivered and verified hook gate hardening"
    next_safe_action: "Review the scoped changes without running Git operations"
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
| **Completed** | 2026-08-15 |
| **Level** | 2 |
| **Status** | Complete |

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
