---
title: "DOC-380 -- Doctor mcp unknown flag"
description: "Manual scenario validating that /doctor:mcp refuses a flag neither sub-action accepts with the unknown-flag error before any workflow loads, while a flag owned by the other sub-action keeps the cross-sub-action error."
version: 1.0.0.0
id: doctor-commands-doctor-mcp-unknown-flag
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-380 -- Doctor mcp unknown flag

## 1. OVERVIEW

This scenario validates the flag check of `/doctor:mcp` for a flag that neither sub-action accepts. The install schema accepts only `--runtime <name>` and the debug schema accepts only `--fix`. A flag in neither schema, such as `--server`, is refused before the workflow YAML loads with the presentation contract's unknown-flag error, which names the selected sub-action's valid flag. A flag that belongs to the other sub-action keeps its own cross-sub-action error, so the two refusals stay distinct.

Every tested path stops before a workflow runs, so nothing is written. The scenario still records the working tree status and the config checksums and compares them at the end.

---

## 2. SCENARIO CONTRACT

- Objective: Prove an unknown flag is refused with `unknown_flag` and the valid-flag hint before any workflow loads, and that a flag owned by the other sub-action still gets `cross_sub_action_flag_injection`.
- Playbook ID: DOC-380.
- Real user request: `Install Code Mode for the server runtime.`
- Prompt: `Install Code Mode for the server runtime.`
- Preconditions: A working copy of the repository and a runtime that can execute `/doctor:mcp`. No disposable copy is needed because every tested path stops before a workflow loads.
- Expected execution process: Record the baselines, run `/doctor:mcp install --server`, run `/doctor:mcp debug --verbose`, run `/doctor:mcp install --fix`, capture each refusal, then compare the baselines.
- Expected signals: `/doctor:mcp install --server` renders ``Flag '--server' is not valid for `install`. Valid: --runtime <name>.`` followed by `STATUS=FAIL ERROR="unknown_flag"`. `/doctor:mcp debug --verbose` renders ``Flag '--verbose' is not valid for `debug`. Valid: --fix.`` followed by `STATUS=FAIL ERROR="unknown_flag"`. `/doctor:mcp install --fix` renders ``Flag '--fix' is only valid for `debug`. Did you mean `/doctor:mcp debug --fix`?`` followed by `STATUS=FAIL ERROR="cross_sub_action_flag_injection"`. None of the three runs shows the setup dashboard, loads a workflow YAML or starts an assessment. The working tree status and every recorded checksum are identical before and after.
- Desired user-visible outcome: Each refusal names the offending flag and tells the operator which flag the sub-action does accept, and nothing changes on disk.
- Pass/fail: PASS if both unknown flags end with `STATUS=FAIL ERROR="unknown_flag"` and the valid-flag hint, the cross-sub-action flag ends with `cross_sub_action_flag_injection`, no run loads a workflow, and no file changes.
- Classification: Manual scenario. Valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable. A scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
Install Code Mode for the server runtime.
```

### Commands

1. Record the baselines: `git status --porcelain` and `shasum -a 256 .utcp_config.json opencode.json .mcp.json .claude/mcp.json .codex/config.toml .cursor/mcp.json .pi/mcp.json .devin/mcp_config.json`.
2. Run `/doctor:mcp install --server` through the real runtime and capture the output.
3. Run `/doctor:mcp debug --verbose` and capture the output.
4. Run `/doctor:mcp install --fix` and capture the output.
5. Confirm that no run showed the `DOCTOR MCP SETUP` dashboard, named a workflow path or started an assessment.
6. Compare `git status --porcelain` and every checksum with step 1.

### Expected

Both unknown flags are refused before the workflow YAML loads. Each refusal names the flag and the selected sub-action, lists that sub-action's valid flag, and ends with `STATUS=FAIL ERROR="unknown_flag"`. The flag owned by the other sub-action is refused with the cross-sub-action wording and `STATUS=FAIL ERROR="cross_sub_action_flag_injection"`, so the two error codes never swap. Nothing changes on disk.

### Evidence

- The three invocations and their refusal output.
- The confirmation that each refusal matches the presentation contract's wording for its error code.
- The confirmation that no dashboard, workflow path or assessment appeared.
- The `git status --porcelain` outputs and the checksums from steps 1 and 6.

### Pass / Fail

- **Pass**: Both unknown flags end with `unknown_flag` and the valid-flag hint, `install --fix` ends with `cross_sub_action_flag_injection`, no run loads a workflow, and no file changes.
- **Fail**: An unknown flag is ignored or accepted, an unknown flag gets the cross-sub-action error or the reverse, a refusal omits the valid flag, a run loads a workflow, or a file changes.

### Failure Triage

If an unknown flag is accepted, re-read step 6 of section 4 in `mcp.md`, which refuses a flag neither sub-action accepts before YAML load. If the wrong error code appears, compare the flag with both schemas: the install schema lists only `--runtime <name>` and the debug schema lists only `--fix`, so `--fix` on install is a cross-sub-action flag, while `--server` and `--verbose` are unknown to both. If a file changes, treat it as a contract violation and inspect the checksum that moved.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Command entrypoint: [.skilled/commands/doctor/mcp.md](../../../../commands/doctor/mcp.md)
- Presentation contract: [.skilled/commands/doctor/assets/doctor-mcp-presentation.txt](../../../../commands/doctor/assets/doctor-mcp-presentation.txt)
- Route manifest: [.skilled/commands/doctor/_routes.yaml](../../../../commands/doctor/_routes.yaml)

Provenance: manual only - /doctor:mcp

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-380
- Feature name: Doctor mcp unknown flag
- Command mode: `/doctor:mcp`
- YAML asset: `doctor-mcp-install.yaml` and `doctor-mcp-debug.yaml` (neither loads on the tested paths)
- Mutation boundary: read-only. Every tested path stops before workflow load, so no file is written.
- Feature file path: `doctor-commands/doctor-mcp-unknown-flag.md`
