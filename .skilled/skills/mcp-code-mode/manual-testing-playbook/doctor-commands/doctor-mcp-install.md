---
title: "DOC-375 -- Doctor mcp install"
description: "Manual scenario validating that /doctor:mcp install builds Code Mode, updates .utcp_config.json and registers the selected runtime, with an explicit approval requested before each write."
version: 1.1.0.0
id: doctor-commands-doctor-mcp-install
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-375 -- Doctor mcp install

## 1. OVERVIEW

This scenario validates the install path of `/doctor:mcp` against a disposable copy with no Code Mode dependencies, a build output that is missing or stale, and no Code Mode entry in the selected runtime config files. It confirms that the setup dashboard resolves the sub-action and the runtime, that the assessment row and the choice menu appear, that the build runs the documented npm commands, that the manual is written in `.utcp_config.json` with its required fields, that an approved runtime entry carries the launcher and the config path, and that the closing health check reports the resulting state.

The workflow is interactive. Every dependency install, build, manual edit and runtime file edit is presented for its own approval, and the workflow makes no change for a proposal that is not approved. A declined write is never offered again in the same run. The whole run happens in a disposable copy that is discarded at the end.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the install workflow builds Code Mode when needed, writes the Code Mode manual and registers the selected runtime, with an explicit approval before each write.
- Playbook ID: DOC-375.
- Real user request: `Install Code Mode and register it in my runtime.`
- Prompt: `Install Code Mode and register it in my runtime.`
- Preconditions: A disposable copy of the repository in which npm is available, `.skilled/skills/mcp-code-mode/mcp-server/package.json` exists, `.skilled/skills/mcp-code-mode/mcp-server/node_modules` is absent so the dependencies are missing, the build output `.skilled/skills/mcp-code-mode/mcp-server/dist/index.js` is missing or older than a build input, and neither `.mcp.json` nor `.claude/mcp.json` carries the Code Mode entry. A runtime that can execute `/doctor:mcp` with Bash access.
- Expected execution process: Confirm the prerequisites in the copy, run `/doctor:mcp install --runtime claude`, capture the dashboard, the assessment row and the menu, answer each approval prompt on its own, approve the dependency install, the build and the `.utcp_config.json` edit, decline the `.mcp.json` proposal at the runtime step, approve the `.claude/mcp.json` proposal, capture the command results, then compare `.utcp_config.json`, both claude config files, the other five project config files and the closing health check with their baselines.
- Expected signals: The setup dashboard renders `DOCTOR MCP SETUP` with `Sub-action: install`, `Workflow: .skilled/commands/doctor/assets/doctor-mcp-install.yaml`, `Runtime: claude`, `Fix mode: n/a`, the presentation path and `Next: load workflow YAML`. The assessment block `CODE MODE INSTALL ASSESSMENT` carries one Code Mode row with its Build, UTCP config and Runtime wiring cells, followed by the menu `Assessment complete. Choose what to do:` with the options `A) Install missing dependencies and build when needed`, `B) Review each proposed change individually`, `C) Show the report and stop` and `D) Cancel`. Preflight confirms the repository root, reads the Code Mode install guide, requires npm, resolves a Node.js 24 interpreter from the Code Mode manifest and launcher, checks `mcp-server/package.json`, and validates `claude` against the allowed runtime list. Step 2 runs `bash .skilled/commands/doctor/scripts/mcp-doctor.sh --json`, parses `status`, `exitCode`, `summary` and `checks`, and treats exit 0 as healthy, 1 as warnings, 2 as failures and 3 as a wrongly invoked script that printed no report. Every dependency install, build, `.utcp_config.json` edit and runtime config edit asks for its own approval. The approved dependency install runs exactly `cd .skilled/skills/mcp-code-mode/mcp-server && npm install` because `node_modules` is absent, the approved build runs exactly `cd .skilled/skills/mcp-code-mode/mcp-server && npm run build` because `dist/index.js` is missing or stale, and the workflow never runs `scripts/install.sh`. The approved manual edit preserves existing manuals, requires every manual to have a non-empty name and `call_template_type`, maps each `${VAR}` reference to the key formed by doubling each underscore in the manual name and appending `_<VAR>`, reports a missing key by name and leaves its value to root `.env`, and validates the final file as JSON. Because `claude` covers both `.mcp.json` and `.claude/mcp.json`, the runtime step proposes those two files. The declined `.mcp.json` proposal runs no command and leaves that file at its baseline, and the declined file is not offered again in the same run. The approved runtime edit changes only `.claude/mcp.json`, sets the Code Mode command to `node`, includes `.skilled/bin/mcp-code-mode-launcher.cjs` in its arguments, sets `UTCP_CONFIG_FILE` to `.utcp_config.json` in its environment, preserves unrelated entries and parses the result with node. Because `--runtime claude` is set, the other five project config files are not edited. Step 6 reruns `bash .skilled/commands/doctor/scripts/mcp-doctor.sh --json` without `--fix` and reports build freshness, UTCP fields, credential key names with present or missing status, and runtime wiring. The final report renders its Build, UTCP config and Runtime wiring rows with before and after values, names credential keys without values, lists next steps, and ends with `STATUS=OK` because the run completed with every approved write applied.
- Desired user-visible outcome: A setup dashboard, an assessment row with a choice menu, one approval per write, a declined runtime file left untouched and not offered again, a verified manual, an approved runtime entry, and a final report whose build, UTCP config and runtime wiring rows show their after values.
- Pass/fail: PASS if each write follows its own approval, the two documented npm commands are the only build commands, `.utcp_config.json` validates as JSON with the manual shape, `.claude/mcp.json` carries the launcher argument and `UTCP_CONFIG_FILE`, the declined `.mcp.json` keeps its baseline content, and no other project config file changes.
- Classification: Manual scenario. Valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable. A scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
Install Code Mode and register it in my runtime.
```

### Commands

1. Create a disposable copy of the repository.
2. In the copy, confirm that npm is available, that `.skilled/skills/mcp-code-mode/mcp-server/package.json` exists, that `.skilled/skills/mcp-code-mode/mcp-server/node_modules` is absent, and that `.skilled/skills/mcp-code-mode/mcp-server/dist/index.js` is missing or older than a build input.
3. Remove the Code Mode entry from `.mcp.json` and `.claude/mcp.json` in the copy so the runtime wiring starts incomplete.
4. Record the baselines: `bash .skilled/commands/doctor/scripts/mcp-doctor.sh --json` and `shasum -a 256 .utcp_config.json .mcp.json .claude/mcp.json opencode.json .codex/config.toml .cursor/mcp.json .pi/mcp.json .devin/mcp_config.json`.
5. Run `/doctor:mcp install --runtime claude` through the real runtime.
6. Capture the setup dashboard, the assessment row and the choice menu.
7. Approve the dependency install, the build and the `.utcp_config.json` edit one at a time. At the runtime step, decline the `.mcp.json` proposal and confirm that no command runs and that the file keeps its baseline checksum, then approve the `.claude/mcp.json` proposal. Confirm that the declined proposal is not offered again.
8. Capture the command results, the verification JSON and the final report.
9. Confirm that `.utcp_config.json` parses as JSON, that `.claude/mcp.json` carries the Code Mode entry with the launcher argument and `UTCP_CONFIG_FILE`, that `.mcp.json` matches its baseline checksum, and that the other five project config files match their baseline checksums.
10. Discard the disposable copy and confirm that the live working copy still matches its pre-scenario state.

### Expected

The dashboard resolves the install sub-action, the `claude` runtime and the install workflow. The assessment names the current build, UTCP config and wiring states, and the menu offers the four documented choices. Each proposal is approved or declined on its own, and the declined `.mcp.json` proposal is not offered again. The approved dependency install and build leave a current build output. The manual edit leaves a valid JSON file whose manual carries a name and `call_template_type`, and the approved runtime edit leaves `.claude/mcp.json` with the launcher argument and the config path while `.mcp.json` keeps its baseline content. The closing health check reports the resulting states, and the final report ends with `STATUS=OK`.

### Evidence

- The setup dashboard with the resolved workflow path, runtime and fix mode.
- The assessment row and the choice menu.
- Each approval prompt, the declined `.mcp.json` proposal and its unchanged checksum.
- The confirmation that the declined proposal is not offered again.
- The output of the approved npm install and build commands.
- The `.utcp_config.json` JSON validation result and the manual fields.
- The `.claude/mcp.json` entry, the unchanged `.mcp.json` and the baseline comparison for the other five project config files.
- The closing health JSON, the final report and its status.

### Pass / Fail

- **Pass**: Every write follows its own approval, the documented npm commands are the only build commands, `.utcp_config.json` and `.claude/mcp.json` end valid, the declined `.mcp.json` is unchanged, and no other project config file changes.
- **Fail**: A write happens without an approval, a declined file is written or offered again, a runtime config file other than the approved `.claude/mcp.json` is touched, `scripts/install.sh` runs, or a target file is left invalid.

### Failure Triage

If the dependency install is not offered, confirm that `.skilled/skills/mcp-code-mode/mcp-server/node_modules` is absent, because the workflow installs dependencies only when they are missing or a fresh install is requested. If the build step does not appear, confirm that the build output is missing or older than a build input, because the workflow builds only when `dist/index.js` is missing or stale. If the runtime edit does not appear, confirm that `.claude/mcp.json` lacks the Code Mode entry, because registration writes only when the entry is absent or wrong. If the workflow proposes another runtime file, check the `--runtime` value against the allowed list and re-read step 5 of `doctor-mcp-install.yaml`. If a declined proposal is offered again, treat it as a contract violation because the workflow defines no re-offer path. If the final JSON validation fails, re-read the manual shape rules in step 4 of the same file and the presentation contract's credential naming example.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Command entrypoint: [.skilled/commands/doctor/mcp.md](../../../../commands/doctor/mcp.md)
- Matching YAML asset: [.skilled/commands/doctor/assets/doctor-mcp-install.yaml](../../../../commands/doctor/assets/doctor-mcp-install.yaml)
- Presentation contract: [.skilled/commands/doctor/assets/doctor-mcp-presentation.txt](../../../../commands/doctor/assets/doctor-mcp-presentation.txt)
- Health script: [.skilled/commands/doctor/scripts/mcp-doctor.sh](../../../../commands/doctor/scripts/mcp-doctor.sh)
- Install guide: [.skilled/skills/mcp-code-mode/INSTALL-GUIDE.md](../../INSTALL-GUIDE.md)
- Route manifest: [.skilled/commands/doctor/_routes.yaml](../../../../commands/doctor/_routes.yaml)

Provenance: manual only - /doctor:mcp install

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-375
- Feature name: Doctor mcp install
- Command mode: `/doctor:mcp install`
- YAML asset: `doctor-mcp-install.yaml`
- Mutation boundary: only Code Mode build outputs, `.utcp_config.json` and the approved `.claude/mcp.json` may change, only inside the disposable copy and only after an individual approval. The declined `.mcp.json` and the live working copy are never written.
- Feature file path: `doctor-commands/doctor-mcp-install.md`
