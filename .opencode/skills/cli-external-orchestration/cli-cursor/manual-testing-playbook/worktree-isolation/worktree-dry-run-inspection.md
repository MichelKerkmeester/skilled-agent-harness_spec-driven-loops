---
title: "CU-009 -- Worktree dry-run / inspection"
description: "This scenario validates Cursor's native git worktree isolation flag surface for `CU-009`. It focuses on confirming -w/--worktree, --worktree-base, and --skip-worktree-setup are documented in --help, and inspecting .cursor/worktrees.json schema, without creating a real worktree."
version: 1.0.0.0
---

# CU-009 -- Worktree dry-run / inspection

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CU-009`.

---

## 1. OVERVIEW

This scenario validates the native git worktree isolation flag surface for `CU-009`. It focuses on confirming `-w`/`--worktree [name]`, `--worktree-base <branch>`, and `--skip-worktree-setup` are documented in `cursor-agent --help`, and inspecting `.cursor/worktrees.json` schema if present - all without creating a real worktree.

### Why This Matters

Native worktree isolation is a genuinely Cursor-unique surface with no analog in `cli-codex`/`cli-claude-code`/`cli-opencode`/`cli-devin`. It also interacts with this repo's own `sk-git` numbered-worktree discipline (owner-scoped branches, `.worktrees/{NNNN}-{owner}-{slug}` directories) - a dispatched `cursor-agent` inside a deep-loop fan-out lineage already runs inside that lineage's own isolated directory, so passing `-w` on top would create a second, nested Cursor-native worktree the runtime does not expect. This scenario keeps the default validation path non-destructive per the packet's resolved Open Question; `CU-010` is the explicitly-marked, opt-in, destructive extension.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CU-009` and confirm the expected signals without contradictory evidence.

- Objective: Verify the worktree flag surface is documented and inspect `.cursor/worktrees.json` schema, without mutating `~/.cursor/worktrees/`.
- Real user request: `Before I try Cursor's worktree feature, can you confirm the flags actually exist and check if this repo has any worktree setup config?`
- Prompt: `Confirm the -w/--worktree, --worktree-base, and --skip-worktree-setup flags are documented in cursor-agent --help, and check whether this repo has a .cursor/worktrees.json.`
- Expected execution process: Operator runs `cursor-agent --help` and greps for the worktree flags -> checks for `.cursor/worktrees.json` in this repo -> snapshots `~/.cursor/worktrees/` before and after to confirm no new directory appears -> documents the interaction with this repo's own `sk-git` numbered-worktree discipline as an explicit caveat.
- Expected signals: `cursor-agent --help` output lists `-w`/`--worktree [name]`, `--worktree-base <branch>`, and `--skip-worktree-setup`. `.cursor/worktrees.json` presence/absence is documented honestly (this repo does not ship one as of this phase). `~/.cursor/worktrees/` snapshot is identical before and after.
- Desired user-visible outcome: Confirmation the flag surface exists and is safe to reason about, without mutating the operator's `~/.cursor/worktrees/` state or double-nesting inside this repo's own `sk-git` worktree discipline.
- Pass/fail: PASS if all three flags are documented in `--help` AND the `.cursor/worktrees.json` check is honestly reported AND `~/.cursor/worktrees/` is unchanged. FAIL if any documented flag is missing from `--help`, or if `~/.cursor/worktrees/` unexpectedly changed as a side effect of this inspection-only scenario.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Snapshot `ls ~/.cursor/worktrees/ 2>/dev/null` before any dispatch.
2. Run `cursor-agent --help` and grep for the three worktree flags.
3. Check for `.cursor/worktrees.json` at the repo root.
4. Re-snapshot `~/.cursor/worktrees/` and diff against the pre-snapshot.
5. Document the `sk-git` numbered-worktree interaction caveat explicitly in the verdict.
6. Return a PASS/FAIL verdict naming which flags were confirmed and the `.cursor/worktrees.json` presence/absence.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CU-009 | Worktree dry-run / inspection | Verify the worktree flag surface is documented without creating a real worktree | `Confirm the -w/--worktree, --worktree-base, and --skip-worktree-setup flags are documented in cursor-agent --help, and check whether this repo has a .cursor/worktrees.json.` | 1. `bash: ls ~/.cursor/worktrees/ 2>/dev/null > /tmp/cli-cursor-cu009-pre.txt` -> 2. `bash: cursor-agent --help > /tmp/cli-cursor-cu009-help.txt 2>&1` -> 3. `bash: grep -E -- "--worktree\|--worktree-base\|--skip-worktree-setup\|-w," /tmp/cli-cursor-cu009-help.txt` -> 4. `bash: test -f .cursor/worktrees.json && echo "present" \|\| echo "absent"` -> 5. `bash: ls ~/.cursor/worktrees/ 2>/dev/null > /tmp/cli-cursor-cu009-post.txt && diff /tmp/cli-cursor-cu009-pre.txt /tmp/cli-cursor-cu009-post.txt` | Step 1: pre-snapshot captured; Step 2: help text captured; Step 3: all three flags matched; Step 4: presence/absence reported honestly; Step 5: no diff between pre/post snapshots | `--help` output excerpt, `.cursor/worktrees.json` presence check, pre/post `~/.cursor/worktrees/` snapshots | PASS if all three flags are confirmed in `--help` AND the `.cursor/worktrees.json` check is reported honestly AND the pre/post snapshots are identical; FAIL if any flag is missing from `--help` or the snapshots differ | (1) Re-run `cursor-agent --version` to confirm the installed build still matches the documented contract; (2) re-check `.cursor/worktrees.json` path spelling; (3) if the snapshot differs, investigate what created the new directory before assuming this scenario caused it |

### Optional Supplemental Checks

- Cross-check the flags against `references/cursor-tools.md` §2 and `references/cli-reference.md` §4 "Native Worktree Flags" for internal documentation consistency.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../references/cursor-tools.md` (§2 Native Git Worktree Isolation) | Documents the flag surface and the sk-git interaction caveat |
| `../../references/cli-reference.md` (§4 Native Worktree Flags) | Authoritative flag reference |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/cursor-tools.md` | §2 "Why It's Out of Scope for Orchestrated Dispatch" - the sk-git double-isolation caveat |
| `../../SKILL.md` | §4 NEVER rule 1 - forbids passing `-w` from orchestrated fan-out without explicit approval |

---

## 5. SOURCE METADATA

- Group: Worktree Isolation
- Playbook ID: CU-009
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `worktree-isolation/worktree-dry-run-inspection.md`
