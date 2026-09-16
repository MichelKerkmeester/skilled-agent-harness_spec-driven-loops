---
title: "Dangling hook behavior"
description: "Question 3: whether git skips or fails when a hook under core.hooksPath is a dangling link, observed in a sandbox with a local bare remote."
---

# Dangling hook behavior (Q3)

**Result: git skips a dangling hook silently.** A commit and a push both succeed with exit 0 and print nothing about the missing hook. At cutover, the seven global hooks that link into the main checkout would stop running for every repository on this machine without a single warning if their targets disappeared.


All results here ran against worktree 055 at base `d26f0c60ca88dab922752ab3d9ce8a07463934ae`.

## Method

Run by the orchestrator on 2026-09-16 in `/tmp/skilled-probes-003/dangling-hook/`, using the command block in `../plan.md` §Probe P3. The sandbox repository pushes only to its own bare repository. Full output: `/tmp/skilled-probes-003/logs/dangling-hook.log`, quoted below.

## Observations

| Case | Command | Exit | Output about the hook | State after |
|------|---------|------|------------------------|-------------|
| `pre-commit` links to a missing file | `git -c core.hooksPath=<hooks> commit --allow-empty -m dangling` | 0 | none | commit `71ac2f4` landed, `rev-list --count HEAD` = 1 |
| `pre-push` links to a missing file | `git -c core.hooksPath=<hooks> push origin HEAD:refs/heads/probe` | 0 | none, only `* [new branch] HEAD -> probe` | `refs/heads/probe` exists in the bare remote (`rev-parse` exit 0) |
| Control: `pre-commit` present, mode 644, `exit 1` | commit with `core.hooksPath=<nonexec>` | 0 | `hint: The '.../nonexec/pre-commit' hook was ignored because it's not set as executable.` | commit landed |
| Control: `pre-commit` present, mode 755, `exit 1` | commit with `core.hooksPath=<failing>` | 1 | the hook's non-zero exit | no commit; final count 2 |

`advice.ignoredHook` is unset (`git config --show-origin --get advice.ignoredHook` exit 1). `git --version` is 2.50.1 (Apple Git-155).

The failing control proves a blocking hook is observable in this sandbox, so the silent dangling result is not a blind method. The non-executable control shows git warns about a hook it can see but not run, and prints nothing at all for a hook whose link target is missing.

## Implications

- Shape A: the seven global links name `<main checkout>/.opencode/scripts/git-hooks/<hook>`, and that path keeps resolving through `.opencode -> .skilled`, so hooks keep running across the move. Reinstalling them onto `.skilled/` is still required by the parent criterion, and a later removal of the link would disengage them silently.
- Shape B: `.opencode/scripts` as a per-entry link resolves the same paths, so the result matches shape A.
- Shape C: `scripts` is not an opencode-mandated entry, so dropping it leaves all seven global hooks dangling. Every repository on the machine would lose its commit and push gates silently, so the reinstall must land in the same step as the move, followed by a proof commit whose hook prints a marker.
