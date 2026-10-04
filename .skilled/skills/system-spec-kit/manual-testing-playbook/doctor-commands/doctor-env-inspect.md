---
title: "DOC-354 -- Doctor env inspect"
description: "Manual scenario validating that /doctor:env list prints the parsed switch inventory and the read-only source state by name only, and that one variable selector shows the documented default and every source where the switch is set."
version: 1.0.0.0
id: doctor-commands-doctor-env-inspect
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-354 -- Doctor env inspect

## 1. OVERVIEW

This scenario validates the two read paths of `/doctor:env` against the committed environment reference. It confirms that `list` prints the unique variable count, the complete inventory table and the complete read-only source-state table without a value in any cell, then stops with a terminal status. It then confirms that one variable selector shows the documented default, type, description and source, plus the set or unset state of that switch in every inspected source.

The selected variable ends at its value prompt, where the operator cancels, so the run reaches a terminal status without choosing a destination and without writing. The whole run happens in a disposable copy, so even a mistaken answer cannot touch the live tree.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the inventory and source-state tables report switches by name only and that one selected variable shows its documented default and where it is set.
- Playbook ID: DOC-354.
- Real user request: `Show me the documented environment switches and where each one is set.`
- Prompt: `Show me the documented environment switches and where each one is set.`
- Preconditions: A disposable copy of the repository holding the committed `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md`, and a runtime that can execute `/doctor:env` with Bash access.
- Expected execution process: Run `/doctor:env list`, then `/doctor:env SPECKIT_AC_COVERAGE_FLOOR`, then a selector that matches nothing, capturing the tables and the terminal status of each run, and compare the working tree state and the destination checksums before and after.
- Expected signals: The list run prints `Environment Switch Inventory`, the reference path, the parsed unique variable count ahead of the tables, one inventory row per parsed variable carrying Section, Variable, Default, Type, Description, Documented source and Class, and a read-only source-state table holding exactly one of `set`, `unset` or `unreadable` for every parsed variable in the process environment, hook-flags.env, .env and Claude Code settings columns. No cell in either table carries a value. The run stops after the tables with `STATUS=OK`, and neither the selection menu nor the next-step prompt appears. The variable run prints `Selected preference: SPECKIT_AC_COVERAGE_FLOOR`, a `Section:` line naming the reference heading path that owns the row, `Default: 0.9`, `Type: number (0..1)`, a `Does:` line carrying the documented description, `Documented source: cli/rules/check-ac-coverage.sh`, and the current-value-by-source table naming all four sources. Cancelling at the value prompt returns `STATUS=CANCELLED ACTION=cancelled` and changes nothing. The no-match selector returns `STATUS=FAIL ERROR="no matching section or variable"` and asks for no value. The working tree state and every recorded checksum are unchanged at the end.
- Desired user-visible outcome: A count, an inventory table and a source-state table that name switches without showing values, followed by one variable block that names its default and where it is set, ending in a status that leaves every file alone.
- Pass/fail: PASS if `list` prints the count before a complete and value-free pair of tables, the selected variable shows its documented default, type and source, the no-match selector fails with the documented error, and no file changes.
- Classification: Manual scenario. Valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable. A scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
Show me the documented environment switches and where each one is set.
```

### Commands

1. Create a disposable copy of the repository.
2. In the copy, record `git status --porcelain` and the sha256 of `.skilled/hooks/hook-flags.env`, `.env` and `.claude/settings.local.json` where each exists, and record each missing one as absent.
3. Run `/doctor:env list` through the real runtime.
4. Capture the count line and both tables. Confirm the count matches the number of distinct variable rows, that every parsed variable has a source-state row, and that no cell carries a value. Note whether any row is classified secret, because the committed reference classifies none today.
5. Run `/doctor:env SPECKIT_AC_COVERAGE_FLOOR`.
6. Capture the selected block and the four source rows of the current-value table.
7. At the value prompt, reply `cancel`. Capture the terminal status.
8. Run `/doctor:env not-a-documented-switch` and capture its terminal status and error.
9. Record `git status --porcelain` and the checksums from step 2 again and compare.
10. Discard the disposable copy and confirm the live working copy is unchanged.

### Expected

The list run prints the count before a complete inventory table and a complete source-state table. Every cell of the source-state table holds one of `set`, `unset` or `unreadable`, and no value appears anywhere. The run ends with `STATUS=OK` and shows no selection menu and no next-step prompt, because list is a stop point.

The variable run shows the documented default, type, description and source for the selected switch before it asks for a value. Cancelling leaves the terminal status at `STATUS=CANCELLED ACTION=cancelled` and writes nothing. The no-match selector ends at `STATUS=FAIL ERROR="no matching section or variable"` and asks for no value.

The committed reference classifies no row as secret today, so the redacted-default rule for a secret row is exercised by the secret scenario rather than here.

### Evidence

- The count line and the complete inventory table.
- The complete read-only source-state table.
- The selected block for `SPECKIT_AC_COVERAGE_FLOOR` with its default, type, description, source and four source rows.
- The terminal status of the list run, the variable run, and the no-match run.
- The baseline and final `git status --porcelain` outputs and destination checksums.

### Pass / Fail

- **Pass**: Both tables are complete and free of values, the selected variable shows its documented default, type and source, the no-match selector fails with the documented error, and no file changes.
- **Fail**: A value appears in either table, a parsed variable is missing from the source-state table, the selected block omits the default, type, description or source, the run prompts for a destination after a cancel, or any file changes.

### Failure Triage

If the count disagrees with the number of distinct variable rows, inspect the two supported table headers and the heading walk in `doctor-env.yaml`. If the source-state table shows a value, inspect the presence-only probe rule in the same asset. If list asks for a selection, inspect the list branch in the selection rules. If the selected block omits the default or the source, inspect the preference display in `doctor-env-presentation.txt`.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Command entrypoint: [.skilled/commands/doctor/env.md](../../../../commands/doctor/env.md)
- Matching YAML asset: [.skilled/commands/doctor/assets/doctor-env.yaml](../../../../commands/doctor/assets/doctor-env.yaml)
- Presentation contract: [.skilled/commands/doctor/assets/doctor-env-presentation.txt](../../../../commands/doctor/assets/doctor-env-presentation.txt)
- Inventory source of truth: [.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md](../../runtime/ENV-REFERENCE.md)

The `/doctor:env` route is a standalone companion with no entry in the doctor route manifest.

Provenance: manual only - /doctor:env

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-354
- Feature name: Doctor env inspect
- Command mode: `/doctor:env`
- YAML asset: `doctor-env.yaml`
- Mutation boundary: no write target is used. The list path writes nothing, and the selected variable is cancelled at its value prompt before any destination is chosen, so every inspected file stays byte-identical.
- Feature file path: `doctor-commands/doctor-env-inspect.md`
