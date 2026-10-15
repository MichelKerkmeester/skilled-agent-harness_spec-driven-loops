---
title: "DOC-384 -- Doctor git setup check"
description: "Manual scenario validating that /doctor:git setup reports all eleven setup checks with a result and source each, names a repair for every failing check, and writes nothing."
version: 1.0.2.0
id: doctor-commands-doctor-git-setup-check
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-384 -- Doctor git setup check

## 1. OVERVIEW

This scenario validates `/doctor:git setup` against the eleven-surface setup battery in `git-setup-check.cjs`. It confirms that the route reports install, hooks, trust, gates, standards, allowlist, worktrees, commit-id, advisory-rules, suppression and ai-tool-hooks, that every check carries a result and the source it read, that a failing check names its repair, and that the run writes nothing.

The route runs each check in its check-only form and prints repair commands instead of applying them, so no git config value and no repository file changes. The scenario is read-only and safe to run in the live working copy.

---

## 2. SCENARIO CONTRACT

- Objective: Prove `/doctor:git setup` reports all eleven checks (install, hooks, trust, gates, standards, allowlist, worktrees, commit-id, advisory-rules, suppression, ai-tool-hooks) with a result and source each, names one repair per failing check, and writes nothing.
- Playbook ID: DOC-384.
- Real user request: `Check my sk-git setup and tell me which hooks, rules and settings are live.`
- Prompt: `Check my sk-git setup and tell me which hooks, rules and settings are live.`
- Preconditions: A working copy of this repository with the hooks installed (`bash .skilled/scripts/install-git-hooks.sh`) and the Claude adapter registered in `.claude/settings.json`, run from Claude Code. From another runtime, run the battery with that runtime's `--tool` and read its adapter row instead of Claude's. The run is read-only and safe in the live working copy.
- Expected execution process: Record the starting state, run `/doctor:git setup` through the real runtime, capture the result table and the `DOCTOR DIAGNOSTIC RESULT` block, run the battery directly in human and JSON form, confirm the usage exit for an unknown tool, and compare the starting state.
- Expected signals: The rendered table has one row per check in the order install, hooks, trust, gates, standards, allowlist, worktrees, commit-id, advisory-rules, suppression and ai-tool-hooks, and each row carries a result of PASS, FAIL, SKIP, UNKNOWN or DEGRADED plus the source it read. On this repository's own checkout, with the preconditions met, every row reads PASS. `node .skilled/commands/doctor/scripts/git-setup-check.cjs --tool claude` exits 0 and ends `STATUS=OK checks=11`. A failing check exits 1, ends `STATUS=FAIL failed=<n> degraded=<n> skipped=<n> unknown=<n>` and prints a `repair:` line for the failing row. A run with no failure but an UNKNOWN row or a gate saved off exits 3 and ends `STATUS=DEGRADED degraded=<n> skipped=<n> unknown=<n>`. The `--json` run prints one JSON object with a `checks` array of eleven rows, each with id, result, source, details and repair. `node .skilled/commands/doctor/scripts/git-setup-check.cjs --tool nope` exits 2 with a usage line. The run's result block reads `Target: setup` and `Changed: none`. The step 1 and step 7 outputs match.
- Desired user-visible outcome: One row per check with its result and source, the repair line for anything failing, and a result that shows the run changed nothing.
- Pass/fail: PASS if all eleven checks appear with a result and source, every FAIL carries a repair, the exit codes match (0 OK, 3 DEGRADED, 1 FAIL, 2 usage), and no git config value and no repository file changes.
- Classification: Manual scenario. Valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable. A scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
Check my sk-git setup and tell me which hooks, rules and settings are live.
```

### Commands

Run every command from the repository root.

1. Record the starting state, clean or not, since step 7 compares against it: `git status --porcelain` and `git config --list --local`.
2. Run `/doctor:git setup` through the real runtime. An agent without slash commands records steps 2 and 3 as not run and continues with step 4.
3. Capture the result table and the `DOCTOR DIAGNOSTIC RESULT` block.
4. Run `node .skilled/commands/doctor/scripts/git-setup-check.cjs --tool <runtime>` and keep its exit code and final `STATUS=` line, where <runtime> is the AI tool running the scenario: claude, codex, devin, cursor, opencode or pi.
5. Run the step 4 command again with `--json` and confirm the output parses as one JSON object with a `checks` array of eleven rows, each with id, result, source, details and repair.
6. Run `node .skilled/commands/doctor/scripts/git-setup-check.cjs --tool nope` and confirm exit 2 with a usage line.
7. Record `git status --porcelain` and `git config --list --local` again and compare them with step 1.

### Expected

Every check in the battery appears with a result and the source it read, in the order install, hooks, trust, gates, standards, allowlist, worktrees, commit-id, advisory-rules, suppression and ai-tool-hooks. A failing check names its repair in the printed `repair:` line, and an unknown tool is a usage error rather than a partial run.

The run writes no git config value and no repository file, so the config listing and the working tree are identical afterwards and the result block reads `Target: setup` with `Changed: none`.

### Evidence

- The rendered result table with its eleven rows and the source line per row.
- The `DOCTOR DIAGNOSTIC RESULT` block with `Target: setup` and `Changed: none`.
- The step 4 exit code and final `STATUS=` line.
- The parsed `--json` payload with its `checks` array of eleven rows, each showing id, result, source, details and repair.
- The `--tool nope` exit code and usage line.
- The step 1 and step 7 status and config outputs.

### Pass / Fail

- **Pass**: All eleven checks appear with a result and source, every FAIL carries a repair, the exit codes match, and no git config value and no repository file changes. Steps 2 and 3 recorded as not run, for an agent without slash commands, do not change the verdict.
- **Fail**: A check is missing, a FAIL carries no repair, an exit code is wrong, or a file or git config value changes.

### Failure Triage

A missing row points at the `CHECKS` list in `git-setup-check.cjs`, which is the source of the battery order. An unexpected FAIL is real setup drift, so run the printed repair and rerun the battery. A changed file or git config value is a defect in the battery and blocks release, because the route is declared read-only in `_routes.yaml`.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Command entrypoint: [.skilled/commands/doctor/git.md](../../../../commands/doctor/git.md)
- Matching YAML asset: [.skilled/commands/doctor/assets/doctor-git-setup.yaml](../../../../commands/doctor/assets/doctor-git-setup.yaml)
- Presentation contract: [.skilled/commands/doctor/assets/doctor-git-presentation.txt](../../../../commands/doctor/assets/doctor-git-presentation.txt)
- Route manifest: [.skilled/commands/doctor/_routes.yaml](../../../../commands/doctor/_routes.yaml)
- Setup battery: [.skilled/commands/doctor/scripts/git-setup-check.cjs](../../../../commands/doctor/scripts/git-setup-check.cjs)

Provenance: manual only - /doctor:git

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-384
- Feature name: Doctor git setup check
- Command mode: `/doctor:git setup`
- YAML asset: `doctor-git-setup.yaml`
- Mutation boundary: none. The run inspects every setup surface in its check-only form and prints repair commands, and it writes no git config value and no repository file.
- Feature file path: `doctor-commands/doctor-git-setup-check.md`
