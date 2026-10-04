---
title: "DOC-377 -- Doctor mcp debug fix"
description: "Manual scenario validating that /doctor:mcp debug --fix repairs a failing check only after explicit approval, changes nothing on a decline, validates the edited file and rechecks the result."
version: 1.0.0.0
id: doctor-commands-doctor-mcp-debug-fix
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-377 -- Doctor mcp debug fix

## 1. OVERVIEW

This scenario validates the repair path of `/doctor:mcp debug --fix` against a disposable copy that carries one failing runtime config. It confirms that the setup dashboard enables fix mode, that the diagnostic script still runs with `--json` only, that the failing check is presented with a proposed repair, that a declined repair changes nothing, that an approved repair is a minimal edit to only the affected runtime file, that the edited file is validated with node, and that the recheck shows the repaired check resolved.

The debug workflow applies only individually approved repairs, never passes `--fix` to the diagnostic script, and never changes `.utcp_config.json` or `.env`. Credential keys are reported by name with present or missing status only. The whole run happens in a disposable copy that is discarded at the end.

---

## 2. SCENARIO CONTRACT

- Objective: Prove a failing check is repaired only after explicit approval, that a declined repair changes nothing, and that the approved repair is validated and rechecked.
- Playbook ID: DOC-377.
- Real user request: `Code Mode is broken. Fix it, but ask me before changing anything.`
- Prompt: `Code Mode is broken. Fix it, but ask me before changing anything.`
- Preconditions: A disposable copy of the repository in which `.pi/mcp.json` is not valid JSON, so `config:.pi/mcp.json:code_mode` reports FAIL and the checkpoint offers a repair. A runtime that can execute `/doctor:mcp` with Bash access.
- Expected execution process: Break the selected config in the copy, record the failing checksum, run `/doctor:mcp debug --fix`, capture the finding and the approval prompt, decline once and compare the checksum, run again and approve the same repair, capture the edit and its validation, then capture the recheck and the final report before discarding the copy.
- Expected signals: The setup dashboard renders `DOCTOR MCP SETUP` with `Sub-action: debug`, `Workflow: .skilled/commands/doctor/assets/doctor-mcp-debug.yaml`, `Runtime: n/a` and `Fix mode: true`. Step 1 runs exactly `bash .skilled/commands/doctor/scripts/mcp-doctor.sh --json` and never passes `--fix` or any other argument to the script. The induced failure leaves `config:.pi/mcp.json:code_mode` at status `FAIL` with the detail `Invalid JSON syntax`, and the run exits 2. Step 2 lists the finding and, because `--fix` is present and an actionable failure exists, shows the checkpoint `Review the findings. Choose a proposed repair individually, skip it, or stop.` Each offered repair is presented before it runs as `Finding:`, `Detail:`, `Proposed repair:` and `Command or file change:`, followed by the question `Apply this repair? [Y/n]`. Only an explicit approval applies a repair. A declined repair leaves `.pi/mcp.json` at its failing checksum and runs no command. The approved runtime wiring repair is a minimal edit to only `.pi/mcp.json` that gives it valid JSON and the Code Mode entry with command `node`, the `.skilled/bin/mcp-code-mode-launcher.cjs` argument and `UTCP_CONFIG_FILE` set to `.utcp_config.json`, and the edited file is validated with node. Step 4 reruns `bash .skilled/commands/doctor/scripts/mcp-doctor.sh --json`, reports the repaired `config:.pi/mcp.json:code_mode` check as `PASS` with the detail `Code Mode launcher and UTCP path verified`, and names any remaining or new finding. The debug path never changes `.utcp_config.json` or `.env`, and credential keys are reported by name with present or missing status only. Step 5 shows the before and after status of the repaired check, the remaining failures, warnings and unvalidated runtime config, the credential key names and the next steps. The final report ends with one of `STATUS=OK`, `STATUS=CANCELLED` or `STATUS=FAIL`.
- Desired user-visible outcome: A finding with a proposed repair, a decline that changes nothing, an approval that applies only the minimal edit, a recheck that shows the check resolved, and a final report with before and after values.
- Pass/fail: PASS if a declined repair changes nothing, the approved repair edits only the affected runtime file, the edited JSON validates with node, the recheck shows the repaired check as PASS, and `.utcp_config.json` and `.env` keep their baseline checksums.
- Classification: Manual scenario. Valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable. A scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
Code Mode is broken. Fix it, but ask me before changing anything.
```

### Commands

1. Create a disposable copy of the repository.
2. In the copy, replace `.pi/mcp.json` with content that is not valid JSON so the matching check fails.
3. Record the baselines: `git status --porcelain` and `shasum -a 256 .pi/mcp.json .utcp_config.json .env`.
4. Run `/doctor:mcp debug --fix` through the real runtime.
5. Capture the setup dashboard, the diagnostic JSON, the finding, the checkpoint and the approval prompt.
6. Decline the first offer with `n` and confirm that no repair command runs and that `.pi/mcp.json` keeps its failing checksum.
7. Run `/doctor:mcp debug --fix` again, choose the same repair and answer `y`.
8. Capture the edit, its validation with node, the recheck JSON and the final report.
9. Confirm that `.pi/mcp.json` now carries the Code Mode entry and parses as JSON, that the recheck reports the repaired check as PASS, and that `.utcp_config.json` and `.env` match their baseline checksums.
10. Discard the disposable copy and confirm that the live working copy still matches its pre-scenario state.

### Expected

The dashboard enables fix mode and resolves the debug workflow. The diagnostic run still uses `--json` only and reports the induced failure. The workflow presents the finding and one proposed repair, and it waits for an answer before doing anything. The declined repair performs no command and leaves the failing file untouched. The approved repair edits only `.pi/mcp.json`, the result validates with node, and the recheck flips the repaired check from FAIL to PASS and reports what remains.

### Evidence

- The setup dashboard with `Fix mode: true`.
- The diagnostic JSON with the failing check and its detail.
- The checkpoint and the full approval prompt.
- The declined-repair result and the unchanged `.pi/mcp.json` checksum.
- The approved edit and its node validation.
- The recheck JSON with the repaired check at PASS.
- The final report with before and after values and the status.
- The `.utcp_config.json` and `.env` baseline comparison.

### Pass / Fail

- **Pass**: The decline changes nothing, the approved repair edits only the affected runtime file, the edited JSON validates with node, the recheck shows the check resolved, and no credential or unrelated file changes.
- **Fail**: A repair runs without an approval, a non-runtime file changes, the edited file is invalid, or the recheck still reports the check as FAIL.

### Failure Triage

If the checkpoint does not appear, confirm that `--fix` was passed to the command and that at least one check is an actionable failure, because the checkpoint requires both. If a repair runs without a `y`, treat it as a contract violation, capture the transcript and compare the target checksum. If the edited file is not valid JSON, re-read the validation guidance in step 3 of `doctor-mcp-debug.yaml` and re-apply the minimal entry after a new approval. If the recheck does not change, read the troubleshooting section of the Code Mode install guide and offer its documented resolution, and do not retry without a new approval. If a credential key is missing, report the key name only, because debug never writes credentials and the operator manages the value in root `.env` outside the workflow.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Command entrypoint: [.skilled/commands/doctor/mcp.md](../../../../commands/doctor/mcp.md)
- Matching YAML asset: [.skilled/commands/doctor/assets/doctor-mcp-debug.yaml](../../../../commands/doctor/assets/doctor-mcp-debug.yaml)
- Presentation contract: [.skilled/commands/doctor/assets/doctor-mcp-presentation.txt](../../../../commands/doctor/assets/doctor-mcp-presentation.txt)
- Health script: [.skilled/commands/doctor/scripts/mcp-doctor.sh](../../../../commands/doctor/scripts/mcp-doctor.sh)
- Install guide: [.skilled/skills/mcp-code-mode/INSTALL-GUIDE.md](../../INSTALL-GUIDE.md)
- Route manifest: [.skilled/commands/doctor/_routes.yaml](../../../../commands/doctor/_routes.yaml)

Provenance: manual only - /doctor:mcp debug --fix

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-377
- Feature name: Doctor mcp debug fix
- Command mode: `/doctor:mcp debug --fix`
- YAML asset: `doctor-mcp-debug.yaml`
- Mutation boundary: only the affected supported runtime file may change, only inside the disposable copy and only after explicit approval. `.utcp_config.json`, `.env` and credential values are never touched.
- Feature file path: `doctor-commands/doctor-mcp-debug-fix.md`
