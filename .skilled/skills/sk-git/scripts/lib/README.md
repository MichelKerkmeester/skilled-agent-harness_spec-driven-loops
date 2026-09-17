---
title: "lib: Git Preflight Advisory Cores"
description: "Repository-aware git command checks, lazy context collection, real-repository tests, and advisory noise auditing shared across runtime adapters."
trigger_phrases:
  - "git preflight advisory checks"
  - "git rule checks"
  - "git advisory context"
  - "git advisory noise audit"
---

# lib: Git Preflight Advisory Cores

---

## 1. OVERVIEW

`scripts/lib/` holds the repository-aware parts of the sk-git preflight advisory. The rule registry parses only directly visible git commands, the context collector answers repository-state questions lazily, and the shared dispatch evaluator maps sk-git's `hard_rules` frontmatter onto the 17 checks. Runtime adapters import these modules rather than copying their logic.

The governing principle is **discriminator, not verb**. A command name alone is too noisy: `reset` is ordinary when it only unstages, while `reset --hard` becomes advisory-worthy only when the working tree contains changes. Every check therefore looks for positive command or repository state that distinguishes the surprising outcome. Uncertainty fails open and stays silent.

---

## 2. ARCHITECTURE

```text
╭────────────────────────────────────────────────────────────────────╮
│                   runtime adapter + git command                    │
╰────────────────────────────────────────────────────────────────────╯
                              │
                              ▼
┌────────────────────────────────────────────────────────────────────┐
│ GIT_SHAPE fast gate                                                │
│ Non-git commands stop before repository inspection                 │
└────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────┐     ┌──────────────────────────────┐
│ dispatch-rule-checks.mjs      │────▶│ git-rule-checks.mjs          │
│ readHardRules · evaluate      │     │ parser · 17 GIT_CHECKS       │
└───────────────────────────────┘     └──────────────┬───────────────┘
                                                    │ accessor demand
                                                    ▼
                                     ┌──────────────────────────────┐
                                     │ git-context.mjs              │
                                     │ lazy, per-event memoization  │
                                     └──────────────────────────────┘

  Tests execute checks in temporary repositories. The noise audit
  probes ordinary commands and a should-fire control group.
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `git-rule-checks.mjs` | Exports `GIT_SHAPE`, `parseGitCommand`, `GIT_CHECKS`, and `GIT_CHECK_IDS`. Parses direct git invocations and provides all 17 repository-aware checks. |
| `git-context.mjs` | Exports `createGitContext`. Runs bounded git subprocesses only when a check asks for an accessor and memoizes each answer for one advisory event. |
| `git-rule-checks.test.mjs` | Exercises the parser, fail-open evaluator contract, and all checks against real temporary repositories. |
| `advisory-noise-audit.mjs` | Replays an ordinary-command sample, reports per-rule and aggregate fire rates, then probes a control group to distinguish quiet rules from dead rules. |

---

## 4. CHECK REGISTRY

| Check ID | Positive discriminator |
|---|---|
| `commit-scope-drops-untracked` | A directory or all-tracked commit scope contains untracked files that commit will omit. |
| `commit-pathspec-empty-change` | A `commit --only` path contributes no staged or unstaged change. |
| `add-pathspec-matches-nothing` | Git's own add dry run reports an unmatched pathspec. |
| `add-pathspec-only-ignored` | Git's own add dry run reports that every matched path is ignored. |
| `add-update-skips-untracked` | `add --update` runs while untracked files exist. |
| `restore-discards-over-staged` | A working-tree restore targets a path whose staged copy will survive. |
| `checkout-from-ref-stages-silently` | A restore or checkout from another ref writes the index without an add. |
| `merge-strategy-resolves-one-sided` | A merge-family command explicitly selects a one-sided strategy option. |
| `case-only-pathspec-folds` | A path differs from a tracked path only by case on a folding filesystem. |
| `staged-path-rewritten-by-filter` | A candidate path has a clean filter that changes the committed bytes. |
| `reset-hard-discards-changes` | `reset --hard` runs while the working tree is dirty. |
| `clean-force-deletes-files` | The matching clean dry run reports files that a forced clean would delete. |
| `branch-force-delete-unmerged` | A forced branch deletion targets a branch with commits not merged into `HEAD`. |
| `stash-clear-drops-entries` | `stash clear` runs while stash entries exist. |
| `history-expiry-defeats-recovery` | Immediate reflog expiry or immediate/aggressive garbage collection is explicit. |
| `push-deletes-remote-ref` | A push explicitly deletes a remote ref. |
| `force-push-without-lease` | A push uses plain force without a lease. |

---

## 5. LAZY CONTEXT AND NOISE CONTROL

`createGitContext` exposes cached accessors rather than collecting a status snapshot up front. Non-git commands stop at `GIT_SHAPE`; git commands run only the subprocesses needed by the rules that apply to their subcommand. Every subprocess has a timeout and returns a safe empty or null result on failure.

`advisory-noise-audit.mjs` measures two populations:

- Ordinary shapes weighted toward status, diff, stage, commit, reset, restore, and branch work.
- A should-fire control group containing state-dependent and shape-dependent commands.

An ordinary fire rate of zero is valid only when at least one control shape fires. This prevents an unloaded or dead rule registry from being reported as well calibrated.

---

## VALIDATION

Run from the repository root.

```bash
node --test .opencode/skills/sk-git/scripts/lib/git-rule-checks.test.mjs
node --check .opencode/skills/sk-git/scripts/lib/git-rule-checks.mjs
node --check .opencode/skills/sk-git/scripts/lib/git-context.mjs
node --check .opencode/skills/sk-git/scripts/lib/git-rule-checks.test.mjs
node --check .opencode/skills/sk-git/scripts/lib/advisory-noise-audit.mjs
node .opencode/skills/sk-git/scripts/lib/advisory-noise-audit.mjs
```

Expected test result: 23 pass, 0 fail. The noise audit's exit status depends on the current repository state and reports its measured verdict explicitly.

---

## RELATED

- [`../hooks/README.md`](../hooks/README.md)
- [`../../SKILL.md`](../../SKILL.md)
