---
title: "DOC-391 -- Doctor setup umbrella run"
description: "Manual scenario validating that /doctor:setup lists every doctor target with what it checks, runs the five read-only legs once, names the repair command for each failing leg and leaves the working tree unchanged."
version: 1.0.1.0
id: doctor-commands-doctor-setup-run
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-391 -- Doctor setup umbrella run

## 1. OVERVIEW

This scenario validates `/doctor:setup`, the umbrella diagnostic that lists every doctor target with what it checks, runs five read-only legs once and names the doctor command that repairs each failing leg.

The run writes nothing. The scenario records the working tree before and after, and it checks that an unexpected argument fails with the documented wording.

---

## 2. SCENARIO CONTRACT

- Objective: Prove `/doctor:setup` prints the 17-command target table, runs all five read-only legs, names the mapped repair command for each failing leg, ends with a status that agrees with the leg results, leaves the working tree unchanged and rejects an unexpected argument.
- Playbook ID: DOC-391.
- Real user request: `/doctor:setup`
- Prompt: `/doctor:setup`
- Preconditions: The advisor runtime is built (`npm --prefix .skilled/skills/system-skill-advisor/runtime run build` exits 0) and the bridge projection is fresh (`node .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs --check` prints `"status": "fresh"`). Every command runs from the repository root.
- Expected execution process: Record `git status --porcelain` into `/tmp/doc-391-before.txt`. Run `/doctor:setup` in an AI session, or run the five legs directly and record each exit code and last line. Record `git status --porcelain` into `/tmp/doc-391-after.txt` and diff the two files. Run `/doctor:setup extra` and read the argument error.
- Expected signals: The command prints the target table first. The table holds 17 rows, starts with `/doctor:setup` and includes `/doctor:env list` and `/doctor:git setup`. Then it prints one row per leg with PASS, FAIL or SKIP. The run ends with a `DOCTOR DIAGNOSTIC RESULT` block whose last line is `STATUS=OK` or `STATUS=FAIL`. Every failing leg names its mapped repair command: sk-code -> `/doctor:sk-code setup`, sk-git -> `/doctor:git setup`, trigger-index -> `/doctor:speckit`, runtime-mirrors -> `/doctor:runtime-mirrors` and advisor -> `/doctor:skill-advisor rebuild`. An advisor exit 75 is SKIP, never FAIL. The step 3 diff is empty. Step 4 prints `Unknown argument: extra`, then `/doctor:setup takes no target and no flag. Run /doctor:setup on its own.` and ends with `STATUS=FAIL ERROR="unknown_argument"`.
- Desired user-visible outcome: A first-run overview of every doctor target plus a per-leg verdict and repair line, so the operator knows which doctor command to run next without the diagnostic writing anything.
- Pass/fail: Through `/doctor:setup`, PASS needs the target table, all five leg rows, a mapped repair command on every FAIL row, a final status that agrees with the legs and an empty diff. Through the direct legs, PASS needs all five legs run with their exit code and last line recorded, each leg read as PASS, FAIL or SKIP by the rules in Expected, a mapped repair named for every FAIL, an empty diff and step 4 recorded as not run.
- Classification: Manual scenario. Valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable. A scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
/doctor:setup
```

### Commands

Run every command from the repository root.

1. Run `git status --porcelain > /tmp/doc-391-before.txt`.

2. In an AI session in this repository, run `/doctor:setup`. An agent without slash commands runs the five legs directly instead, each from the repository root, recording exit code and last line:

```bash
node .skilled/commands/doctor/scripts/sk-code-setup-check.cjs
node .skilled/commands/doctor/scripts/git-setup-check.cjs
node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --check --json
node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check
node .skilled/bin/skill-advisor.cjs advisor_status --workspace-root "$PWD" --format json --timeout-ms 500 --warm-only
```

3. Run `git status --porcelain > /tmp/doc-391-after.txt` and `diff /tmp/doc-391-before.txt /tmp/doc-391-after.txt`.

4. Run `/doctor:setup extra` in the AI session. When no AI session is available, record step 4 as not run. It does not change the verdict.

### Expected

When step 2 runs `/doctor:setup` in an AI session, it prints the doctor target table first. When the five legs run directly, there is no table, and the check is each leg's exit code against the rules below. Read each leg by its exit code alone, the way `.skilled/commands/doctor/assets/doctor-setup.yaml` does: exit 0 is PASS, an advisor exit 75 is SKIP and any other exit is FAIL, including a sk-git exit 3. The table holds 17 rows with what each command checks. It starts with `/doctor:setup` and includes `/doctor:env list` and `/doctor:git setup`.

Then the command prints one row per leg with PASS, FAIL or SKIP. A failing leg names its repair command: sk-code -> `/doctor:sk-code setup`, sk-git -> `/doctor:git setup`, trigger-index -> `/doctor:speckit`, runtime-mirrors -> `/doctor:runtime-mirrors` and advisor -> `/doctor:skill-advisor rebuild`. An advisor exit 75 is SKIP, never FAIL.

The run ends with a `DOCTOR DIAGNOSTIC RESULT` block whose last line is `STATUS=OK` or `STATUS=FAIL`. The status agrees with the leg results.

The step 3 diff is empty, because the run writes nothing.

The step 4 command prints `Unknown argument: extra`, then `/doctor:setup takes no target and no flag. Run /doctor:setup on its own.` and ends with `STATUS=FAIL ERROR="unknown_argument"`.

### Evidence

- The target table from step 2, with its row count.
- The five leg rows and their results.
- The `DOCTOR DIAGNOSTIC RESULT` block and its last line.
- The step 3 diff output.
- The step 4 argument error block.

### Pass / Fail

- **Pass**: Through `/doctor:setup`, PASS needs the target table, all five leg rows, a mapped repair command on every FAIL row, a final status that agrees with the legs and an empty diff. Through the direct legs, PASS needs all five legs run with their exit code and last line recorded, each leg read as PASS, FAIL or SKIP by the rules in Expected, a mapped repair named for every FAIL, an empty diff and step 4 recorded as not run.
- **Fail**: Any leg is missing, a repair command is wrong, the status disagrees, or any file changed.

### Failure Triage

If a file changed, find which leg wrote it and compare with the read-only invariant in `.skilled/commands/doctor/assets/doctor-setup.yaml`. If the target table is short, compare it with section 2 of `doctor-setup-presentation.txt`.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Command entrypoint: [.skilled/commands/doctor/setup.md](../../../../commands/doctor/setup.md)
- Matching YAML asset: [.skilled/commands/doctor/assets/doctor-setup.yaml](../../../../commands/doctor/assets/doctor-setup.yaml)
- Presentation contract: [.skilled/commands/doctor/assets/doctor-setup-presentation.txt](../../../../commands/doctor/assets/doctor-setup-presentation.txt)
- Route manifest: [.skilled/commands/doctor/_routes.yaml](../../../../commands/doctor/_routes.yaml)

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-391
- Feature name: Doctor setup umbrella run
- Command mode: `/doctor:setup`
- Mutation boundary: read-only.
- Feature file path: `doctor-commands/doctor-setup-run.md`
