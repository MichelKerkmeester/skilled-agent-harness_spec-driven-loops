---
title: "EX-041 -- sk-git worktree convention (wt/{NNNN}-{name} under .worktrees/)"
description: "This scenario validates the sk-git numbered-worktree convention for `EX-041`. It focuses on creating a wt/{NNNN}-{name} branch in a .worktrees/{NNNN}-{name} directory and confirming the 4-digit global max+1 numbering rule."
version: 3.6.0.2
---

# EX-041 -- sk-git worktree convention (wt/{NNNN}-{name} under .worktrees/)

## 1. OVERVIEW

This scenario validates the sk-git numbered-worktree convention for `EX-041`. The `sk-git` skill owns worktree creation and names worktree branches with a unified numbered namespace: `wt/{NNNN}-{name}`, where `{NNNN}` is a 4-digit zero-padded global counter computed as `max(existing NNNN under .worktrees/) + 1` (the first worktree is `0001`), and `{name}` is a short kebab description. The matching directory is `.worktrees/{NNNN}-{name}`. The `wt/` prefix groups every feature-worktree branch under one folder in Git UIs.

This convention is distinct from the launch wrapper's ephemeral per-session worktrees (`work/{runtime}/{slug}` plus `.worktrees/{runtime}-{slug}`), which are auto-managed, auto-reaped, and intentionally not numbered. The user-observable value is consistent, collision-free workspace isolation: every operator's feature worktrees follow one predictable numbering and directory layout.

> **No git writes by the agent.** This scenario only creates and inspects a worktree to validate the convention. It performs no commit, push, or merge; those are the operator's to run.

---

## 2. SCENARIO CONTRACT

- Objective: Verify the `wt/{NNNN}-{name}` branch / `.worktrees/{NNNN}-{name}` directory convention and the 4-digit max+1 numbering.
- Real user request: `Set me up an isolated workspace for a new fix using the standard worktree convention.`
- Prompt: `Validate the sk-git worktree convention: create a wt/{NNNN}-{name} worktree using the 4-digit global max+1 counter, confirm the matching .worktrees/{NNNN}-{name} directory exists, and confirm the number is one greater than the existing maximum (or 0001 if none). Return a concise pass/fail verdict with cited paths.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: the new branch is named `wt/{NNNN}-{name}`; the worktree directory is `.worktrees/{NNNN}-{name}`; `{NNNN}` equals `max(existing NNNN under .worktrees/) + 1` (or `0001` when none exist) and is 4-digit zero-padded.
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the branch name, directory layout, and numbering all follow the sk-git convention.

---

## 3. TEST EXECUTION

### Prompt

```
As a tooling validation operator, validate the sk-git worktree numbering against the existing .worktrees/ directory. Compute the next 4-digit counter as max(existing NNNN under .worktrees/) + 1 (or 0001 if none exist) and confirm it is zero-padded to four digits. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. List existing numbered worktrees to find the current maximum:
   - `ls .worktrees/ 2>/dev/null | grep -E '^[0-9]{4}-' | sort`
2. Compute the next counter: `max(existing NNNN) + 1`, zero-padded to four digits; `0001` if none exist.

### Expected

The computed counter is the 4-digit zero-padded successor of the highest existing `NNNN` under `.worktrees/`, or `0001` when no numbered worktrees exist.

### Evidence

Command run:

```sh
ls .worktrees/ 2>/dev/null | grep -E '^[0-9]{4}-' | sort
```

Output:

```text
0001-mcp-front-proxy
0002-followups
0003-followup-sentinel
0004-followup-memorysave
0005-memory-followups
0006-028-cli-impl
0008-findings-remediation
0009-edge-confidence-remedi
```

Initial computed-counter command run:

```sh
next=$(ls .worktrees/ 2>/dev/null | grep -E '^[0-9]{4}-' | sort | perl -ne 'print $1 if /^([0-9]{4})-/' | sort -n | tail -1); if [ -z "$next" ]; then printf '0001\n'; else printf '%04d\n' $((10#$next + 1)); fi
```

Output:

```text
zsh:1: number truncated after 23 digits: 00010002000300040005000600080009 + 1
-8444743773669546615
```

Corrected computed-counter command run:

```sh
max=''; for entry in $(ls .worktrees/ 2>/dev/null | grep -E '^[0-9]{4}-' | sort); do max=${entry%%-*}; done; if [ -z "$max" ]; then printf '0001\n'; else printf '%04d\n' $((10#$max + 1)); fi
```

Output:

```text
0010
```

### Pass / Fail

- **PASS**: the highest existing numbered worktree directory is `0009-edge-confidence-remedi`, and the corrected computed next counter is `0010`, which is `max(existing NNNN) + 1` and zero-padded to four digits.

### Failure Triage

Re-read the numbered-worktree rule in `.opencode/skills/sk-git/SKILL.md` (the `wt/{NNNN}-{name}` namespace rule) if the counter is not 4-digit zero-padded or not derived from the existing maximum.

---

### Prompt

```
As a tooling validation operator, validate creating a sk-git worktree against the wt/{NNNN}-{name} convention. Create the worktree with the computed counter and a kebab name, then confirm the branch is wt/{NNNN}-{name} and the directory is .worktrees/{NNNN}-{name}. Perform no commit, push, or merge. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Create the worktree (operator runs the git command; the agent does not commit/push/merge):
   - `git worktree add -b wt/<NNNN>-<name> .worktrees/<NNNN>-<name> main`
2. Confirm the worktree is registered with the expected branch and path:
   - `git worktree list`
3. Confirm the directory exists at `.worktrees/<NNNN>-<name>`.

### Expected

`git worktree list` shows the new worktree on branch `wt/{NNNN}-{name}` at directory `.worktrees/{NNNN}-{name}`, matching the sk-git convention. No commit, push, or merge is performed by the scenario.

### Evidence

Blocked before running the creation command. The scenario command would be:

```sh
git worktree add -b wt/0010-manual-playbook-validation .worktrees/0010-manual-playbook-validation main
```

That command was not run because it would create files under `.worktrees/0010-manual-playbook-validation`, which conflicts with the user-level write constraint:

```text
Do NOT modify, create, or delete any file OTHER than the single scenario file named below.
```

Allowed write path from the user instruction:

```text
.opencode/skills/system-spec-kit/manual_testing_playbook/tooling_and_scripts/sk_git_worktree_convention.md (this file only)
```

### Pass / Fail

- **BLOCKED**: the required `git worktree add` command would create a worktree directory outside the only allowed write path, so the branch/path registration and directory-existence checks could not be executed without violating the scenario runner constraints.

### Failure Triage

If the branch or directory naming diverges, re-read the numbered-worktree rule in `.opencode/skills/sk-git/SKILL.md` and the worktree creation examples in `.opencode/skills/sk-git/references/worktree_workflows.md`. Note the distinct ephemeral per-session form (`work/{runtime}/{slug}` + `.worktrees/{runtime}-{slug}`) is auto-managed and intentionally not numbered.

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- sk-git convention: `.opencode/skills/sk-git/SKILL.md` (numbered-worktree rule: `wt/{NNNN}-{name}`, `.worktrees/{NNNN}-{name}`, 4-digit global max+1)
- Worktree workflows: `.opencode/skills/sk-git/references/worktree_workflows.md` (`git worktree add -b wt/NNNN-name .worktrees/NNNN-name main`)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: EX-041
- Canonical root source: `manual_testing_playbook.md`
- Source anchors read: `.opencode/skills/sk-git/SKILL.md` (numbered-worktree rule: `wt/{NNNN}-{name}` where `{NNNN}` is 4-digit zero-padded `max(existing NNNN under .worktrees/) + 1`, first `0001`; matching dir `.worktrees/{NNNN}-{name}`); `.opencode/skills/sk-git/references/worktree_workflows.md` (creation command examples, e.g. `git worktree add -b wt/0001-fix-modal .worktrees/0001-fix-modal main`)
- Feature file path: `tooling_and_scripts/sk_git_worktree_convention.md`
- Destructive: No — creates and inspects a worktree only; no commit/push/merge.
- Runtime policy: Real execution only; no mocked git.
