---
title: "DOC-391 -- Doctor setup umbrella run"
description: "Manual scenario validating that /doctor:setup lists every doctor target with what it checks, runs the five read-only legs once, names the repair command for each failing leg and leaves the working tree unchanged."
version: 1.0.5.0
id: doctor-commands-doctor-setup-run
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-391 -- Doctor setup umbrella run

## 1. OVERVIEW

This scenario validates `/doctor:setup`, the umbrella diagnostic that lists every doctor target with what it checks, runs five read-only legs once and names the doctor command that repairs each failing leg.

The run writes nothing in the repository. The advisor leg's CLI creates its socket directory, `/tmp/system-skill-advisor` by default, when that directory is absent, and the working-tree comparison cannot see that write. The scenario records the working tree before and after, and it checks that an unexpected argument fails with the documented wording.

---

## 2. SCENARIO CONTRACT

- Objective: Prove `/doctor:setup` prints the 17-command target table, runs all five read-only legs, names the mapped repair command for each failing leg, ends with a status that agrees with the leg results, leaves the working tree unchanged and rejects an unexpected argument.
- Playbook ID: DOC-391.
- Real user request: `/doctor:setup`
- Prompt: `/doctor:setup`
- Preconditions: The advisor runtime is built (`npm --prefix .skilled/skills/system-skill-advisor/runtime run build` exits 0) and the bridge projection is fresh (`node .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs --check` prints `"status": "fresh"`). Every command runs from the repository root.
- Expected execution process: Record `git status --porcelain` into `/tmp/doc-391-before.txt`. Run `/doctor:setup` in an AI session, or run the five legs directly and record each exit code and last line. Record `git status --porcelain` into `/tmp/doc-391-after.txt` and diff the two files. Run `/doctor:setup extra` and read the argument error.
- Expected signals:
  - The command prints the target table first. It has 17 rows and starts with `/doctor:setup`. It includes `/doctor:env list` and `/doctor:git setup`.
  - The command prints one row per leg with PASS, FAIL, SKIP, DEGRADED or ERROR. Every failing leg names its mapped repair command: sk-code -> `/doctor:sk-code setup`, sk-git -> `/doctor:git setup`, trigger-index -> `/doctor:speckit`, runtime-mirrors -> `/doctor:runtime-mirrors` and advisor -> `npm --prefix .skilled/skills/system-skill-advisor/runtime run build` for stale builds or `/doctor:skill-advisor rebuild` for other failures.
  - The advisor reports PASS for exit 0 when `data.freshness` is `live`. Any other freshness on exit 0 is DEGRADED and names `/doctor:skill-advisor rebuild`.
  - The advisor reports FAIL for exit 75 when stderr JSON includes `staleDistWarning`. Its repair command is `npm --prefix .skilled/skills/system-skill-advisor/runtime run build`. Exit 75 without that field is SKIP because the daemon is stopped. Any other advisor exit is FAIL and names `/doctor:skill-advisor rebuild`.
  - A sk-git exit 2 is ERROR because it indicates a usage error or crash. Exit 3 is DEGRADED, never FAIL.
  - The step 3 diff is empty. Step 4 prints `Unknown argument: extra`, then `/doctor:setup takes no target and no flag. Run /doctor:setup on its own.` and ends with `STATUS=FAIL ERROR="unknown_argument"`. The result ends with `STATUS=OK`, `STATUS=FAIL` or `STATUS=ERROR`, according to the leg results.
- Desired user-visible outcome: A first-run overview of every doctor target plus a per-leg verdict and repair line, so the operator knows which doctor command to run next without the diagnostic writing anything.
- Pass/fail: Through `/doctor:setup`, PASS needs the target table, all five leg rows, the correct repair command on every FAIL row, a final status that agrees with all leg results including ERROR, and an empty diff. Through the direct legs, PASS needs all five legs run with their exit code and last line recorded, each leg classified by the rules in Expected including advisor JSON freshness and stderr plus sk-git exit 2 as ERROR, a mapped repair named for every FAIL, an empty diff and step 4 recorded as not run.
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

2. In an AI session in this repository, run `/doctor:setup`. An agent without slash commands runs the five legs directly instead, each from the repository root, recording exit code and last line. Replace `<name>` with the runtime running the scenario: claude, codex, devin, cursor, opencode or pi. On any other runtime, drop `--tool=<name>`:

```bash
node .skilled/commands/doctor/scripts/sk-code-setup-check.cjs
node .skilled/commands/doctor/scripts/git-setup-check.cjs --tool=<name>
node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --check --json
node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check
node .skilled/bin/skill-advisor.cjs advisor_status --workspace-root "$PWD" --format json --timeout-ms 500 --warm-only
```

3. Run `git status --porcelain > /tmp/doc-391-after.txt` and `diff /tmp/doc-391-before.txt /tmp/doc-391-after.txt`.

4. Run `/doctor:setup extra` in the AI session. When no AI session is available, record step 4 as not run. It does not change the verdict.

### Expected

When step 2 runs `/doctor:setup` in an AI session, it prints the doctor target table first. When the five legs run directly, there is no table. Check each exit code and the advisor JSON. Exit 0 passes for sk-code, sk-git, trigger-index and runtime-mirrors. Advisor exit 0 with `data.freshness` set to `live` is PASS. Any other freshness is DEGRADED and names `/doctor:skill-advisor rebuild`. Exit 75 with `staleDistWarning` in stderr JSON is FAIL and names `npm --prefix .skilled/skills/system-skill-advisor/runtime run build`. Exit 75 without that field is SKIP because the daemon is stopped. Any other advisor exit is FAIL and names `/doctor:skill-advisor rebuild`. A sk-git exit 2 is ERROR for a usage error or crash. Exit 3 is DEGRADED. Any other sk-git exit is FAIL. Any other nonzero exit is FAIL. The table has 17 rows. It starts with `/doctor:setup` and includes `/doctor:env list` and `/doctor:git setup`.

Then the command prints one row per leg with PASS, FAIL, SKIP, DEGRADED or ERROR. The mapped repair commands are sk-code -> `/doctor:sk-code setup`, sk-git -> `/doctor:git setup`, trigger-index -> `/doctor:speckit` and runtime-mirrors -> `/doctor:runtime-mirrors`. The advisor shows the build command for a stale build and `/doctor:skill-advisor rebuild` for other FAIL or DEGRADED results. Exit 75 without `staleDistWarning` is SKIP because the daemon is stopped. A sk-git exit 2 shows ERROR. Exit 3 shows DEGRADED, never FAIL. After the leg rows, a `Last session hop:` line shows the newest hop history entry, or says no hop is recorded yet. It is information only and never changes the status.

Through `/doctor:setup`, the run ends with a `DOCTOR DIAGNOSTIC RESULT` block whose last line is `STATUS=OK`, `STATUS=FAIL` or `STATUS=ERROR`. The status agrees with the leg results. `STATUS=ERROR` means a leg reports ERROR or its output cannot be read. The direct legs print no combined block.

The step 3 diff is empty, because the run writes nothing in the repository.

The step 4 command prints `Unknown argument: extra`, then `/doctor:setup takes no target and no flag. Run /doctor:setup on its own.` and ends with `STATUS=FAIL ERROR="unknown_argument"`.

### Evidence

- The target table from step 2, with its row count.
- The five leg rows and their results.
- The `DOCTOR DIAGNOSTIC RESULT` block and its last line, on the slash-command path.
- The step 3 diff output.
- The step 4 argument error block.

### Pass / Fail

- **Pass**: Through `/doctor:setup`, PASS needs the target table, all five leg rows, a mapped repair command on every FAIL row, a final status that agrees with the leg results including ERROR cases and an empty diff. Through the direct legs, PASS needs all five legs run with their exit code and last line recorded, each leg classified as PASS, FAIL, SKIP, DEGRADED or ERROR by the rules in Expected, a mapped repair named for every FAIL, an empty diff and step 4 recorded as not run.
- **Fail**: Any leg is missing, a repair command is wrong, the status disagrees, or any file changed.

### Failure Triage

If a file changed, find which leg wrote it and compare with the read-only invariant in `.skilled/commands/doctor/assets/doctor-setup.yaml`. If the target table is short, compare it with section 2 of `doctor-setup-presentation.txt`.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature catalog: [scorer-fusion/doctor-command-routing.md](../../feature-catalog/scorer-fusion/doctor-command-routing.md)
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
