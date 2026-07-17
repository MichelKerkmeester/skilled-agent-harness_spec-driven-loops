---
title: "Pre-push naming + remote-push-permission gates"
description: "Git pre-push hook with two independent gates: naming grammar on newly created remote branches, and a remote-allowlist permission check on every push (new or update)."
trigger_phrases:
  - "pre-push naming enforcement hook"
  - "branch naming pre-push gate"
  - "migration-tolerant naming hook"
  - "remote push permission gate"
  - "remote branch allowlist"
  - "pre-push"
version: 1.1.0.0
---

# Pre-push naming + remote-push-permission gates (pre-push)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

A `pre-push` git hook runs two independent gates on every ref about to reach origin. The naming gate enforces the owner-first branch grammar at the one point where a non-conformant name would otherwise become visible on the remote: the creation of a brand-new remote branch. The remote-push-permission gate answers a different question — should this branch reach origin **at all, right now** — and applies to every push, new or update, unless the branch is on a small allowlist.

Both gates are fail-open in failure mode (a broken/missing validator never turns into a blocked push) and independently bypassable — skipping one gate's env var never skips the other.

---

## 2. HOW IT WORKS

### Naming Gate: Scope

Git feeds the hook one line per pushed ref on stdin: local ref, local sha, remote ref, remote sha. The hook only inspects `refs/heads/*` lines — tags and other ref kinds pass through untouched — and the naming gate only checks a ref whose remote sha is all-zeros, meaning the push would create a new remote branch. A push that only updates a branch already present on the remote is always naming-exempt (migration tolerance): a legacy branch pushed before this grammar existed is never retroactively rejected on name alone. `skilled/v*` release branches are exempt from BOTH gates entirely, new or existing.

### Naming Gate: Validation and Rejection

For a genuinely new branch, the hook sources `worktree-naming.sh` and calls its `is_valid_branch` predicate — the same grammar check the allocator itself uses to create branches, so the gate and the allocator can never disagree. A name that fails validation is rejected (the hook exits non-zero) with the expected grammar printed to stderr. A name that additionally matches the launch-wrapper lane (`work/<runtime>/<slug>`) gets a more specific message: wrapper branches are local-only and machine-reaped, and must never be pushed as a feature branch.

### Remote-Push-Permission Gate

Every push — new branch or update — to a branch that is not `main`, not `skilled/v*`, and not listed in [`remote-branch-allowlist.txt`](../../scripts/remote-branch-allowlist.txt) is blocked unless `SPECKIT_ALLOW_REMOTE_PUSH=1` is set for that invocation. A scoped exception exempts the continuous-integration autosync's publish to `$SPECKIT_LIVE_BRANCH` when `SPECKIT_AUTOSYNC=1` is set — and only that exact branch, never a blanket bypass. Full contract and rationale: [remote-branch-policy.md](../../references/remote-branch-policy.md).

### Fail-Open Safety and Bypass

Both gates are fail-open by design: if `worktree-naming.sh` is missing, fails to source, or loads without exposing its validator functions, the hook prints a warning and allows the push rather than blocking it — a broken validator must never turn into an outage for every push in the repository. An operator can skip the naming gate alone with `SPECKIT_SKIP_PREPUSH_NAMING=1 git push ...`, or the permission gate alone with `SPECKIT_ALLOW_REMOTE_PUSH=1 git push ...` — the two are independent.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/scripts/git-hooks/pre-push` | Script | Reads git's pushed-ref protocol on stdin; runs the naming gate and the remote-push-permission gate |
| `.opencode/skills/sk-git/scripts/worktree-naming.sh` | Script | Supplies `is_valid_branch` / `is_wrapper_branch` / `is_remote_push_allowlisted`, sourced by this hook |
| `.opencode/skills/sk-git/scripts/remote-branch-allowlist.txt` | Config | Operator-editable allowlist patterns beyond the hardcoded `main`/`skilled/v*` |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/scripts/git-hooks/tests/pre-push.test.sh` | Automated test | Exercises both gates: new-branch naming, migration tolerance, fail-open behavior, allowlist/bypass/autosync-exception coverage |

---

## 4. SOURCE METADATA

- Group: Worktree Naming
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `worktree-naming/pre-push-naming-enforcement.md`

Related references:
- [owner-first-worktree-naming.md](owner-first-worktree-naming.md) — Owner-first worktree naming grammar and allocator
- [remote-branch-policy.md](../../references/remote-branch-policy.md) — Full remote-push-permission contract
