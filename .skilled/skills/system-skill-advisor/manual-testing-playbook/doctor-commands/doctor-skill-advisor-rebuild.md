---
title: "DOC-348 -- Doctor skill-advisor rebuild"
description: "Manual scenario validating that /doctor:skill-advisor rebuild backs up the skill graph, rebuilds it through the advisor CLI, and restores the backup when the rebuild fails."
version: 1.7.0.0
id: doctor-commands-doctor-skill-advisor-rebuild
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-348 -- Doctor skill-advisor rebuild

## 1. OVERVIEW

This scenario validates `/doctor:skill-advisor rebuild`, which rebuilds the advisor's `skill-graph.sqlite` from the checked-in `graph-metadata.json` files. The workflow asks once, backs up the database, runs `advisor_rebuild` and `skill_graph_scan` through the advisor CLI, validates the result, and copies the backup back if any step fails.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the dry run writes nothing, a real run rebuilds behind a backup, and a failed run restores the previous database.
- Playbook ID: DOC-348.
- Real user request: `The advisor doesn't see my new skill. Rebuild its graph.`
- Prompt: `The advisor doesn't see my new skill. Rebuild its graph.`
- Preconditions: The current-code doctor environment at `.worktrees/.doctor-test-environment`, fast-forwarded to `origin/main` with an empty `git status --porcelain`, with a built advisor runtime and an existing `skill-graph.sqlite`.
- Expected execution process: Run the dry run, then an approved rebuild, then a rebuild with one `graph-metadata.json` made unreadable.
- Expected signals: the dry run prints the plan and `STATUS=OK` with no file change; the approved run leaves a `skill-graph.sqlite.pre-doctor-skill-advisor-rebuild.<timestamp>.bak` beside the database and ends `STATUS=OK`; the broken run ends `STATUS=ROLLED_BACK` with the database byte-identical to its pre-run copy.
- Desired user-visible outcome: The plan names the database, the backup and both CLI commands before anything is written.
- Pass/fail: PASS if all three runs show the expected signals.
- Classification: Manual scenario; valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable; a scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
The advisor doesn't see my new skill. Rebuild its graph.
```

### Commands

1. `cd .worktrees/.doctor-test-environment`, run `git fetch origin` and `git merge --ff-only origin/main`, and confirm `git status --porcelain` prints nothing.
2. If the environment has no dependencies yet, run `bash .skilled/skills/sk-git/scripts/worktree-naming.sh provision .worktrees/.doctor-test-environment`. Then record `shasum -a 256 .skilled/skills/system-skill-advisor/runtime/database/skill-graph.sqlite`.
3. Run `/doctor:skill-advisor rebuild --dry-run`. Confirm the plan shows and the checksum is unchanged.
4. Run `/doctor:skill-advisor rebuild` and approve. Confirm a `.bak` file exists and `node .skilled/bin/skill-advisor.cjs skill_graph_validate --format json` reports no error.
5. Record the checksum again, then make one skill's `graph-metadata.json` invalid JSON.
6. Run `/doctor:skill-advisor rebuild` and approve. Confirm the result is `ROLLED_BACK` and the checksum matches step 5.
7. Restore the edited `graph-metadata.json`.
8. Restore every file the scenario changed with `git checkout -- <path>`, remove any file it added, and confirm `git status --porcelain` prints nothing.

### Expected

The dry run writes nothing. The approved run rebuilds and validates. The broken run restores the backup and names the failing command.

### Evidence

- Checksums from steps 2, 3, 5 and 6.
- The plan and the three result summaries.
- The `.bak` file listing after step 4.
- The final `git status --porcelain` output.

### Pass / Fail

- **Pass**: All three runs show the expected signals.
- **Fail**: The dry run writes anything, a real run leaves no backup, or a failed run leaves a changed database.

### Failure Triage

If the dry run writes, inspect `phase_2_plan_and_approval` in `doctor-skill-advisor-rebuild.yaml`. If the broken run leaves a changed database, inspect `phase_6_restore` and confirm the backup was taken in `phase_3_backup`.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Command entrypoint: [.skilled/commands/doctor/skill-advisor.md](../../../../commands/doctor/skill-advisor.md)
- Matching YAML asset: [.skilled/commands/doctor/assets/doctor-skill-advisor-rebuild.yaml](../../../../commands/doctor/assets/doctor-skill-advisor-rebuild.yaml)
- Environment guide: [doctor-commands README](../../../system-spec-kit/manual-testing-playbook/doctor-commands/README.md)

Provenance: manual only - /doctor:skill-advisor rebuild

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-348
- Feature name: Doctor skill-advisor rebuild
- Command mode: `/doctor:skill-advisor rebuild`
- YAML asset: `doctor-skill-advisor-rebuild.yaml`
- Mutation boundary: writes only `skill-graph.sqlite` and its backup inside the environment, through the advisor CLI. The environment is restored after the run.
- Feature file path: `doctor-commands/doctor-skill-advisor-rebuild.md`
