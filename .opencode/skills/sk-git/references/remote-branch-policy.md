---
title: Remote Branch Push Permission Policy
description: Local branch/worktree creation stays unrestricted; every push to origin outside a small allowlist needs an explicit, in-the-moment go-ahead, enforced by both sk-git's own behavior and a pre-push hook backstop.
trigger_phrases:
  - "remote branch policy"
  - "ask before pushing to origin"
  - "remote push permission"
  - "remote branch allowlist"
  - "SPECKIT_ALLOW_REMOTE_PUSH"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Remote Branch Push Permission Policy

Keep `origin` curated while local branch/worktree creation stays free: only a small allowlist of branches reach remote without asking; everything else needs a fresh, explicit yes for every push.

---

## 1. OVERVIEW

Numbered worktrees and owner-first branches (ALWAYS #4) make local branch creation cheap and frequent by design — but nothing about that design implies every one of those branches belongs on `origin`. This policy adds a second question, independent of branch naming: **should this branch reach remote at all, right now?**

Two layers answer it:

- **Agent behavior** (sk-git's own MANDATORY rule, [SKILL.md](../SKILL.md) §3 "Remote Push Permission Enforcement"): Claude asks the operator before pushing a non-allowlisted branch, unless the operator already gave an in-turn instruction to push it.
- **Technical backstop** (the [pre-push hook](../../../scripts/git-hooks/pre-push)): blocks any push — new branch or update — to a non-allowlisted branch unless `SPECKIT_ALLOW_REMOTE_PUSH=1` is set for that invocation. This applies uniformly whether the push came from an agent or a human at a real terminal, since a git hook cannot tell the two apart.

---

## 2. THE ALLOWLIST

A branch is exempt from the permission gate when it matches:

1. `main` (hardcoded)
2. `skilled/v*` — release branches, e.g. `skilled/v4.0.0.0` (hardcoded)
3. Any glob pattern listed in [`remote-branch-allowlist.txt`](../scripts/remote-branch-allowlist.txt) — one pattern per line, `#` comments and blank lines ignored, matched with bash `case` (no `eval`, no regex-injection surface)

The two hardcoded patterns are checked **before** the config file is even read. Deleting or emptying the file only narrows exemptions back to those two — it can never widen what's allowed. This is deliberate: an operator-editable file must fail toward MORE asking, never toward silent bypass. See `decision-record.md` ADR-002 in `sk-git/015-remote-branch-policy` for the full rationale.

To add a branch to the allowlist, add one line to `remote-branch-allowlist.txt` — no code or hook change needed.

---

## 3. HOW THE GATE APPLIES

Every push to `origin` outside the allowlist needs a fresh go-ahead — **every push**, not just the one that creates the branch. Once a branch is on origin, its next push (a new commit, a force-update) asks again. This was an explicit operator choice over the lighter "ask only at creation" option (research.md §6 in `sk-git/015-remote-branch-policy`): more friction, but nothing reaches origin without a yes in the moment, even for a branch approved before.

What counts as "asking" at the agent layer:
- An **explicit user instruction that already names the push** — e.g. selecting the finish-flow's "2. Push and create a Pull Request" option ([finish-workflows.md](finish-workflows.md) Step 3), or directly saying "push this branch." Claude does not ask again in the same breath; the instruction itself is the permission, and Claude sets `SPECKIT_ALLOW_REMOTE_PUSH=1` for that one `git push`.
- A **direct question Claude asks and the operator answers yes to**, when the AI would otherwise push on its own initiative without a specific instruction.

`SPECKIT_ALLOW_REMOTE_PUSH=1` is set **only for the single push command it accompanies** — never exported for the session, never persisted.

---

## 4. THE CONTINUOUS-INTEGRATION EXCEPTION

The launch-wrapper's autosync (see [continuous-integration.md](continuous-integration.md)) publishes every commit of a launch-wrapper session to one **live branch** — whatever branch the primary checkout was already on when the session started. That publish is exempt from this gate, scoped narrowly:

```
SPECKIT_AUTOSYNC=1  AND  branch being pushed == $SPECKIT_LIVE_BRANCH
```

Both conditions must hold. `SPECKIT_AUTOSYNC=1` alone does **not** exempt an arbitrary branch — only the exact live branch the wrapper resolved at session start.

**Why this branch is different**: it was already an explicit operator choice — the primary checkout's own branch — made before any session existed to autosync into it. `git-sync.sh`'s own documented contract is "never asks the caller mid-hook" and "non-fatal by default" (continuous-integration.md §2); blocking its publish would silently strand every wrapper session's commits and regress a currently-working, separately-documented feature rather than implement a new policy. Full rationale: `decision-record.md` ADR-003 in `sk-git/015-remote-branch-policy`.

---

## 5. THE TWO BYPASS VARIABLES ARE INDEPENDENT

| Variable | Scope | Skips |
|---|---|---|
| `SPECKIT_SKIP_PREPUSH_NAMING=1` | Naming gate only | The owner-first grammar check on a brand-new branch |
| `SPECKIT_ALLOW_REMOTE_PUSH=1` | Permission gate only | The remote-allowlist/ask-first check, new or update |

Setting one does **not** imply the other. A malformed, non-allowlisted new branch pushed with only `SPECKIT_SKIP_PREPUSH_NAMING=1` still blocks on the permission gate; both are needed together to push it unconditionally.

---

## 6. OPERATOR-FACING BEHAVIOR

A blocked push prints the exact retry command:

```
BLOCKED: push to '<branch>' on origin needs explicit permission for this push.
This repo asks before every push to a branch outside the remote allowlist
(built in: main, skilled/v*; extend via
  .opencode/skills/sk-git/scripts/remote-branch-allowlist.txt).
If the operator has approved THIS push, retry with:
  SPECKIT_ALLOW_REMOTE_PUSH=1 git push ...
```

This applies identically whether the push was issued by Claude or typed at a real terminal — the hook cannot tell the two apart, so both get the same safety net and the same one-line fix.

---

## 7. RELATED

- [SKILL.md](../SKILL.md) — §3 "Remote Push Permission Enforcement"; §4 ALWAYS #18
- [continuous-integration.md](continuous-integration.md) — the autosync model this policy carves a scoped exception for
- [finish-workflows.md](finish-workflows.md) — Step 3 Option 2, whose menu selection already satisfies the ask
- `.opencode/specs/sk-git/015-remote-branch-policy/` — spec, research, and decision record behind this policy
