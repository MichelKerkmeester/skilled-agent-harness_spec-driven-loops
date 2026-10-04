---
title: "DOC-378 -- Doctor mcp target menu"
description: "Manual scenario validating that /doctor:mcp shows its sub-action menu and waits when the action is missing, and that a cross-sub-action flag is refused before any workflow loads."
version: 1.1.0.0
id: doctor-commands-doctor-mcp-target-menu
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-378 -- Doctor mcp target menu

## 1. OVERVIEW

This scenario validates the input gate and the flag schema of `/doctor:mcp`. It confirms that a bare invocation binds no sub-action, that the command does not guess one from history or repository state, that the presentation contract's sub-action menu appears and the run waits for an explicit reply, that a cancel reply ends the run with the documented status, and that a flag belonging to the other sub-action is refused for the selected sub-action before any workflow YAML loads.

Every tested path stops before a workflow runs, so nothing is written. The scenario still records the working tree status and the config checksums and compares them at the end.

---

## 2. SCENARIO CONTRACT

- Objective: Prove a missing sub-action shows the menu and waits for an explicit reply, and that a cross-sub-action flag is refused before any workflow loads.
- Playbook ID: DOC-378.
- Real user request: `Set up or check Code Mode for me.`
- Prompt: `Set up or check Code Mode for me.`
- Preconditions: A runtime that can execute `/doctor:mcp` with Bash access, a bare invocation with no positional sub-action, and a working copy whose config checksums can be recorded.
- Expected execution process: Record the baselines, run the bare command, hold after the menu to confirm it waits, answer `X`, then run `/doctor:mcp install --fix` and `/doctor:mcp debug --runtime pi`, capture each refusal, and compare the baselines.
- Expected signals: The bare `/doctor:mcp` invocation binds no sub-action, and the command does not infer one from conversation history, open files, earlier runs, runtime config state or repository state. The presentation contract's startup menu renders as `What do you want to do with Code Mode?` with the entries `1) Install or configure`, `2) Debug and repair` and `X) Cancel`, and the run stops and waits. Nothing else renders until a reply arrives, and no workflow YAML is loaded. The contract maps `1`, `I` and `install` to the install sub-action, `2`, `D` and `debug` to the debug sub-action, and `X`, an empty reply or `cancel` to `STATUS=CANCEL`. Answering `X` ends the run with `STATUS=CANCEL`, loads no workflow and writes nothing. The install schema accepts only `--runtime <name>` and the debug schema accepts only `--fix`, so `/doctor:mcp install --fix` and `/doctor:mcp debug --runtime pi` both fall outside the schema of the selected sub-action. The command rejects each one before loading a workflow YAML, rendering the presentation contract's flag error. For the install invocation the error reads ``Flag '--fix' is only valid for `debug`. Did you mean `/doctor:mcp debug --fix`?`` and for the debug invocation it reads ``Flag '--runtime' is only valid for `install`. Did you mean `/doctor:mcp install --runtime <name>`?``. Each refusal is followed by `STATUS=FAIL` with `ERROR="cross_sub_action_flag_injection"`, so no assessment and no workflow step follows. The working tree status and every recorded checksum are identical before and after the three invocations.
- Desired user-visible outcome: A menu that waits for an explicit answer, a cancel that ends the run without loading a workflow, and a flag refusal that stops both cross-sub-action invocations before any workflow step.
- Pass/fail: PASS if the bare run shows the menu and waits, `X` ends with `STATUS=CANCEL`, both cross-sub-action invocations are refused with `STATUS=FAIL` before a workflow loads, and no file changes.
- Classification: Manual scenario. Valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable. A scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
Set up or check Code Mode for me.
```

### Commands

1. Record the baselines: `git status --porcelain` and `shasum -a 256 .utcp_config.json opencode.json .mcp.json .claude/mcp.json .codex/config.toml .cursor/mcp.json .pi/mcp.json .devin/mcp_config.json`.
2. Run `/doctor:mcp` with no positional sub-action through the real runtime.
3. Hold after the menu and confirm that nothing else renders, that no workflow path or setup dashboard appears, and that the run is waiting for an answer.
4. Answer `X` and capture the terminal status.
5. Run `/doctor:mcp install --fix`.
6. Run `/doctor:mcp debug --runtime pi`.
7. Capture each refusal and confirm that neither run loads a workflow YAML and that neither run starts an assessment.
8. Compare `git status --porcelain` and every checksum with step 1.

### Expected

The bare invocation shows the three-entry menu and waits. No sub-action is inferred from history, open files or repository state, and no workflow asset is loaded before the reply. A cancel reply ends the run with `STATUS=CANCEL`. Each cross-sub-action invocation is refused before the workflow YAML loads, the refusal names the offending flag and matches the presentation contract's flag error wording, and the run ends with `STATUS=FAIL` without an assessment or a workflow step. Nothing changes on disk.

### Evidence

- The menu text and the confirmation that the run waited with no further output.
- The cancel reply and the `STATUS=CANCEL` line.
- Both cross-sub-action invocations and their refusal output.
- The confirmation that each refusal matches the presentation contract's flag error wording and that no workflow path or assessment appeared in either flag run.
- The `git status --porcelain` outputs and the checksums from steps 1 and 8.

### Pass / Fail

- **Pass**: The bare run shows the menu and waits, `X` ends with `STATUS=CANCEL`, both cross-sub-action invocations are refused with `STATUS=FAIL` before a workflow loads, and no file changes.
- **Fail**: A sub-action is inferred without a reply, the run proceeds past the menu unattended, a cross-sub-action invocation loads a workflow, or a file changes.

### Failure Triage

If the menu does not appear, re-read the mandatory input gate in `mcp.md` and confirm that the invocation carries no positional token. If the run proceeds without an answer, the gate was skipped, so stop, report it and bind the sub-action from an explicit reply. If a cross-sub-action flag is accepted, compare the router's flag schema in `mcp.md` section 4 with the presentation contract's flag error block, because the install schema lists only `--runtime <name>` and the debug schema lists only `--fix`. If a file changes, treat it as a contract violation and inspect the checksum that moved.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Command entrypoint: [.skilled/commands/doctor/mcp.md](../../../../commands/doctor/mcp.md)
- Install workflow asset: [.skilled/commands/doctor/assets/doctor-mcp-install.yaml](../../../../commands/doctor/assets/doctor-mcp-install.yaml)
- Debug workflow asset: [.skilled/commands/doctor/assets/doctor-mcp-debug.yaml](../../../../commands/doctor/assets/doctor-mcp-debug.yaml)
- Presentation contract: [.skilled/commands/doctor/assets/doctor-mcp-presentation.txt](../../../../commands/doctor/assets/doctor-mcp-presentation.txt)
- Route manifest: [.skilled/commands/doctor/_routes.yaml](../../../../commands/doctor/_routes.yaml)

Provenance: manual only - /doctor:mcp

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-378
- Feature name: Doctor mcp target menu
- Command mode: `/doctor:mcp`
- YAML asset: `doctor-mcp-install.yaml` and `doctor-mcp-debug.yaml` (neither loads on the tested paths)
- Mutation boundary: read-only. Both tested paths stop before workflow load, so no file is written.
- Feature file path: `doctor-commands/doctor-mcp-target-menu.md`
