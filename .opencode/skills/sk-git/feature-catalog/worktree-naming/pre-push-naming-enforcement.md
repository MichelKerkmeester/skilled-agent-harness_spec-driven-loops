---
title: "Pre-push naming enforcement hook"
description: "Git pre-push hook that blocks newly created remote branches whose name breaks the owner-first grammar, while never gating existing or release branches."
trigger_phrases:
  - "pre-push naming enforcement hook"
  - "branch naming pre-push gate"
  - "migration-tolerant naming hook"
  - "pre-push"
version: 1.0.0.0
---

# Pre-push naming enforcement hook (pre-push)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

A `pre-push` git hook enforces the owner-first branch grammar at the one point where a non-conformant name would otherwise become visible on the remote: the creation of a brand-new remote branch.

The hook is deliberately narrow in scope and fail-open in failure mode — it gates only new-branch creation, never an update to a branch that already exists remotely, and it never blocks a push outright when its own validator is missing or broken.

---

## 2. HOW IT WORKS

### Scope of the Gate

Git feeds the hook one line per pushed ref on stdin: local ref, local sha, remote ref, remote sha. The hook only inspects `refs/heads/*` lines — tags and other ref kinds pass through untouched — and only gates a ref whose remote sha is all-zeros, meaning the push would create a new remote branch. A push that only updates a branch already present on the remote is always allowed regardless of its name, which is what makes the hook migration-tolerant: a legacy branch pushed before this grammar existed is never retroactively rejected. `skilled/v*` release branches are exempt from the gate entirely, new or existing.

### Validation and Rejection

For a genuinely new branch, the hook sources `worktree-naming.sh` and calls its `is_valid_branch` predicate — the same grammar check the allocator itself uses to create branches, so the gate and the allocator can never disagree. A name that fails validation is rejected (the hook exits non-zero) with the expected grammar printed to stderr. A name that additionally matches the launch-wrapper lane (`work/<runtime>/<slug>`) gets a more specific message: wrapper branches are local-only and machine-reaped, and must never be pushed as a feature branch.

### Fail-Open Safety and Bypass

The hook is fail-open by design: if `worktree-naming.sh` is missing, fails to source, or loads without exposing its validator functions, the hook prints a warning and allows the push rather than blocking it — a broken validator must never turn into an outage for every push in the repository. An operator can also explicitly skip the gate for a single push with `SPECKIT_SKIP_PREPUSH_NAMING=1 git push ...`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/scripts/git-hooks/pre-push` | Script | Reads git's pushed-ref protocol on stdin; gates new remote branch names against the naming grammar |
| `.opencode/skills/sk-git/scripts/worktree-naming.sh` | Script | Supplies `is_valid_branch` / `is_wrapper_branch`, sourced by this hook |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/scripts/git-hooks/tests/pre-push.test.sh` | Automated test | Exercises new-branch gating, migration tolerance, and fail-open behavior |

---

## 4. SOURCE METADATA

- Group: Worktree Naming
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `worktree-naming/pre-push-naming-enforcement.md`

Related references:
- [owner-first-worktree-naming.md](owner-first-worktree-naming.md) — Owner-first worktree naming grammar and allocator
