---
title: "Rename rehearsal"
description: "Question 5: whether one rename-only commit of the 17,767-file tree keeps rename detection and history, whether the pre-push deletion ceiling fires, and what a checkout does to ignored files."
---

# Rename rehearsal (Q5)

**Result:**
- **Renames:** one rename-only commit keeps full rename detection. `git mv .opencode .skilled` records 17,767 renames and 0 deletions at rename limits 1, default and 60,000, with or without the `.opencode -> .skilled` link.
- **Deletion ceiling:** it does not fire. The whole push range, placeholder removal plus move, counts 1 deletion against a ceiling of 100.
- **History:** `git log --follow` carries it across the move.

Two findings change the cutover:
- **Without the link:** the installed pre-push finds none of its gate scripts under `.opencode/`, so the mass-deletion guard, the push-permission gate and the skill-metadata gate all disengage, and the hook exits 0.
- **Ignored files:** checking out the rename-plus-link commit over a tree with ignored files under `.opencode/` deletes those files without a word.

## Method

Run by the orchestrator on 2026-09-16 in `/tmp/skilled-probes-003/rehearsal`, a full clone at base `d26f0c60ca` with its remote removed and hooks pointed at an empty directory. The commands are the `../plan.md` §Probe P5 block; logs are `/tmp/skilled-probes-003/logs/rename-rehearsal-part1.log` and `logs/*-pre-push.*`.

`diff.renames` and `diff.renameLimit` are unset (`git config --show-origin --get-all` exit 1 for both).

| Commit | Content | Time |
|--------|---------|------|
| `00a606e130` | `git rm -r .skilled`, the placeholder's one tracked `.gitkeep` | before 18:52:45Z |
| `probe-r1` | `git mv .opencode .skilled` | 18:52:45Z to 18:52:46Z |
| `probe-r2` (`00753e03f4`) | the same move plus `ln -s .skilled .opencode` and `git add .opencode` | 18:52:46Z to 18:52:54Z |

The placeholder commit left no `.skilled` directory (`ls: .skilled: No such file or directory`), so the move renamed rather than nested.

## Rename counts

| Commit | `diff.renameLimit` | Renames (`^R`) | Deletions (`--diff-filter=D`) | Other statuses |
|--------|--------------------|----------------|-------------------------------|----------------|
| `probe-r1` | 1 | 17,767 | 0 | none |
| `probe-r1` | default | 17,767 | 0 | none |
| `probe-r1` | 60,000 | 17,767 | 0 | none |
| `probe-r2` | 1 | 17,767 | 0 | `A .opencode` (the link) |
| `probe-r2` | default | 17,767 | 0 | `A .opencode` |
| `probe-r2` | 60,000 | 17,767 | 0 | `A .opencode` |

The default-limit rows come from a rerun. The first script's `set -u` rejected the empty option array on those two rows and printed `renames=0`, which was a script error, not a git result. Exact renames are found even at limit 1 because identical content needs no similarity scoring.

## Deletion ceiling

| Range | Guard function result, base commit's `lib/mass-deletion-guard.sh` |
|-------|-------------------------------------------------------------------|
| `probe-r1~1..probe-r1` | `count=0 verdict=0` |
| `probe-r2~1..probe-r2` | `count=0 verdict=0` |
| base `d26f0c60ca..probe-r2`, the full push range | `count=1 verdict=0` |

## History

| File under the moved root | `git log` at base, old path | `git log --follow` at `probe-r1`, new path |
|---------------------------|-----------------------------|--------------------------------------------|
| `skills/system-spec-kit/SKILL.md` | 80 | 241 |
| `scripts/git-hooks/pre-commit` | 34 | 36 |
| `agents/markdown.md` | 22 | 32 |
| `commands/create/agent.md` | 25 | 58 |
| `plugins/opencode-goal.js` | 6 | 28 |

Every `--follow` count is at least one higher than the plain path log. It is often much higher, because `--follow` also crosses renames older than this move. History survives.

## Pre-push hook from the base commit

Each run piped a `skilled/v0.0.0.0-probe` ref line into `bash <base pre-push> origin /nonexistent` with `SYSTEM_HOOKS_DISABLED` unset and `SPECKIT_SKIP_PREPUSH_ROUTE_GATE=1`.

| Run | Exit | Stderr |
|-----|------|--------|
| Control: placeholder commit only, no move | 0 | empty |
| `probe-r1`, rename without the link | 0 | `pre-push: worktree-naming.sh not found at .../.opencode/skills/sk-git/scripts/worktree-naming.sh — skipping the remote-push-permission gate.` and `WARNING [gate:skill-root-metadata]: checker missing; push gate failed open.` Nothing about the deletion ceiling |
| `probe-r2`, rename plus link | 0 | the skill-root metadata checker ran through the link and crashed on `Cannot find module '@spec-kit/shared/frontmatter/parse-frontmatter.js'`, which the clone lacks because it has no installed dependencies. Then `Not blocking: CI enforces this on every push to main and skilled/v*.` |

Without the link, the mass-deletion guard is silent. Its library path is `$REPO_ROOT/.opencode/scripts/git-hooks/lib/mass-deletion-guard.sh`, sourced only `if [[ -f ... ]]`, and a missing file prints nothing (`pre-push`, lines 34-47 at base). The r2 crash is the clone's missing `node_modules`, not the link. The same checker crashes on any checkout without installed dependencies.

## Checkout over ignored build output

From a detached `probe-r2~1`, with two ignored files created at `.opencode/node_modules/probe-pkg/index.js` and `.opencode/skills/system-spec-kit/runtime/dist/probe.js`, which `.gitignore:44` and `.gitignore:51` confirm are ignored:

| Step | Observation |
|------|-------------|
| `git checkout probe-r2` | exit 0, `Switched to branch 'probe-r2'` |
| `ls -ld .opencode` | `.opencode -> .skilled`, a link |
| `git status --porcelain --ignored -- .opencode .skilled` | nothing |
| the two probe files under `.skilled/` | `No such file or directory` |
| `find` for `probe-pkg` and `probe.js` anywhere in the clone | nothing |

Git replaced the directory with the link and deleted the ignored files inside it. It did not refuse, and it did not print a warning.

## Implications

- Shape A: a plain rename commit plus the link is safe for rename detection, history and the deletion ceiling, and needs no bypass. Landing it on a checkout that holds ignored state (`node_modules`, `dist`, runtime databases, `hook-flags.env`) deletes that state silently. Phase 010 must archive and relocate ignored entries before the fast-forward (004 step 18), and the archive is the only copy.
- Shape B: per-entry links replace directories inside `.opencode/`, so ignored files inside a moved entry are deleted the same way, and those in entries that stay real (`node_modules`, `logs` at `.opencode/`) survive. The same archive step applies to the moved entries.
- Shape C: equivalent to shape B for the entries it drops. Every gate script path it removes disengages its gate silently, as `probe-r1` shows for three gates, so phase 005's loud-failure rule is a precondition.
