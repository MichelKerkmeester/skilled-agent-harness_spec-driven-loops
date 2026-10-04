---
title: "DOC-376 -- Doctor mcp debug"
description: "Manual scenario validating that /doctor:mcp debug reports PASS, WARN or FAIL for each check, names every finding and the Hermes note, and writes nothing."
version: 1.0.0.0
id: doctor-commands-doctor-mcp-debug
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-376 -- Doctor mcp debug

## 1. OVERVIEW

This scenario validates the read-only debug path of `/doctor:mcp` against a disposable copy that carries one induced failure. It confirms that the setup dashboard resolves the debug sub-action, that the diagnostic script runs once with `--json` and returns the documented report shape, that every check is displayed with a PASS, WARN or FAIL status and its detail, that the Hermes note appears as an INFO result, that the missing `--fix` flag limits the workflow to offering explanations, and that the closing summary names the status, the findings, the credential key names and the next steps.

The diagnostic script is read-only by contract and the workflow without `--fix` makes no change. The scenario still compares the working tree status and the config checksums before and after the run, so any write is caught. The whole run happens in a disposable copy that is discarded at the end.

---

## 2. SCENARIO CONTRACT

- Objective: Prove every check is reported with a PASS, WARN or FAIL status and a detail, that the findings and the Hermes note are shown, and that the run writes nothing.
- Playbook ID: DOC-376.
- Real user request: `Diagnose Code Mode and tell me what is wrong, without changing anything.`
- Prompt: `Diagnose Code Mode and tell me what is wrong, without changing anything.`
- Preconditions: A disposable copy of the repository in which `.pi/mcp.json` is not valid JSON, so at least one check reports FAIL while the healthy checks report PASS. A runtime that can execute `/doctor:mcp` with Bash access.
- Expected execution process: Break the selected config in the copy, record the working tree status and the config checksums, run `/doctor:mcp debug`, capture the dashboard, the diagnostic JSON, the per-check rows and the summary, then compare the tree status and the checksums before discarding the copy.
- Expected signals: The setup dashboard renders `DOCTOR MCP SETUP` with `Sub-action: debug`, `Workflow: .skilled/commands/doctor/assets/doctor-mcp-debug.yaml`, `Runtime: n/a`, `Fix mode: false`, the presentation path and `Next: load workflow YAML`. Step 1 runs exactly `bash .skilled/commands/doctor/scripts/mcp-doctor.sh --json`, and the `--fix` flag is never passed to the script. The output parses as `status`, `exitCode`, `summary` with its `pass`, `warn` and `fail` counts, and `checks` entries carrying `status`, `server`, `check` and `detail`. Each check status is `PASS`, `WARN` or `FAIL`, and the induced failure leaves `config:.pi/mcp.json:code_mode` at status `FAIL` with the detail `Invalid JSON syntax`. The exit code is 2 for that failure, and the documented mapping is exit 0 for healthy, 1 for warnings, 2 for failures and 3 for a wrongly invoked script that printed no report. Step 2 displays one Code Mode row with its status and a concise summary, and lists each failed or warning check with its detail. The `config:hermes_registration` INFO result states that Hermes registration is user-level in `~/.hermes/config.yaml` and is not checked. Because `--fix` is absent, the workflow offers to explain repair steps without making changes, and the repair checkpoint does not fire. Step 5 reports the status, the checks, credential key names with present or missing status only, any unvalidated runtime config and next steps that point to the Code Mode install guide or the affected config path. The working tree status and every recorded checksum are identical before and after the run.
- Desired user-visible outcome: A dashboard, one diagnostic report with a status per check and its detail, the Hermes note, a summary of the findings, and no change to any file.
- Pass/fail: PASS if the diagnostic JSON carries a PASS, WARN or FAIL status for each check, the failing check and its detail are listed, the script is invoked with `--json` only, the repair checkpoint stays idle without `--fix`, and no file changes.
- Classification: Manual scenario. Valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable. A scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
Diagnose Code Mode and tell me what is wrong, without changing anything.
```

### Commands

1. Create a disposable copy of the repository.
2. In the copy, replace `.pi/mcp.json` with content that is not valid JSON so the matching check fails.
3. Record the baselines immediately before the run: `git status --porcelain` and `shasum -a 256 .utcp_config.json .pi/mcp.json opencode.json .mcp.json .claude/mcp.json .codex/config.toml .cursor/mcp.json .devin/mcp_config.json`.
4. Run `/doctor:mcp debug` through the real runtime.
5. Capture the setup dashboard, the diagnostic JSON, the Code Mode row, each check with its status and detail, the Hermes INFO line and the final summary.
6. Re-record `git status --porcelain` and the checksums and compare them with step 3.
7. Discard the disposable copy and confirm that the live working copy still matches its pre-scenario state.

### Expected

The dashboard resolves the debug sub-action, the absent runtime filter and the debug workflow, and shows that fix mode is false. The single diagnostic run returns the documented report shape with a status for every check. The failing check is displayed with its detail, the healthy checks are displayed as PASS, and the Hermes note is displayed as INFO. The summary names the status, the findings, the credential key names and the next steps. Neither the tree status nor any checksum moves.

### Evidence

- The setup dashboard with the workflow path and `Fix mode: false`.
- The diagnostic JSON with `status`, `exitCode`, `summary` and the `checks` array.
- The Code Mode row and each failed or warning check with its detail.
- The Hermes INFO line.
- The final summary and its status.
- The `git status --porcelain` outputs and the checksums from steps 3 and 6.

### Pass / Fail

- **Pass**: Every check carries a PASS, WARN or FAIL status with a detail, the induced failure is listed, the repair checkpoint stays idle, and no file changes.
- **Fail**: A check has no status, the finding is hidden, a repair runs without `--fix`, or a checksum moves.

### Failure Triage

If the run exits 3, the script was invoked wrongly, so capture its stderr and re-check the invocation in step 1 of `doctor-mcp-debug.yaml`, which accepts no argument beyond `--json`. If the induced check does not report FAIL, inspect the broken file and run `bash .skilled/commands/doctor/scripts/mcp-doctor.sh --json` directly. If a Codex TOML cannot be validated, confirm whether Python 3.11 or later with `tomllib` is available, because the config stays unvalidated without it and must never be read as a pass. If a checksum moves, treat it as a contract violation and inspect the config path that changed.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Command entrypoint: [.skilled/commands/doctor/mcp.md](../../../../commands/doctor/mcp.md)
- Matching YAML asset: [.skilled/commands/doctor/assets/doctor-mcp-debug.yaml](../../../../commands/doctor/assets/doctor-mcp-debug.yaml)
- Presentation contract: [.skilled/commands/doctor/assets/doctor-mcp-presentation.txt](../../../../commands/doctor/assets/doctor-mcp-presentation.txt)
- Health script: [.skilled/commands/doctor/scripts/mcp-doctor.sh](../../../../commands/doctor/scripts/mcp-doctor.sh)
- Install guide: [.skilled/skills/mcp-code-mode/INSTALL-GUIDE.md](../../INSTALL-GUIDE.md)
- Route manifest: [.skilled/commands/doctor/_routes.yaml](../../../../commands/doctor/_routes.yaml)

Provenance: manual only - /doctor:mcp debug

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-376
- Feature name: Doctor mcp debug
- Command mode: `/doctor:mcp debug`
- YAML asset: `doctor-mcp-debug.yaml`
- Mutation boundary: read-only. No file is written by the diagnostic run, and any changed checksum is a contract violation.
- Feature file path: `doctor-commands/doctor-mcp-debug.md`
