---
title: "243 -- Setup, Native Module Health, and MCP Installation"
description: "This scenario validates setup and native module health for `243`. It focuses on confirming prerequisite checks, native-module diagnostics, and marker recording."
version: 1.6.4.0
id: tooling-and-scripts-setup-native-module-health-and-mcp-installation
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 243 -- Setup, Native Module Health, and MCP Installation

## 1. OVERVIEW

This scenario validates setup and native module health for `243`. It focuses on confirming prerequisite checks, native-module diagnostics, and marker recording.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm prerequisite validation, native-module diagnostics, and marker recording.
- Real user request: `` Please validate Setup and Native Module Health against SPECIFY_FEATURE=<track>/<packet> bash .skilled/skills/system-spec-kit/runtime/cli/setup/check-prerequisites.sh --json --validate and tell me whether the expected signals are present: prerequisite JSON emitted; native-module probe prints the marker's OK or FAIL line; record-node-version writes `.node-version-marker`. ``
- Prompt: `Validate Setup and Native Module Health against SPECIFY_FEATURE=<track>/<packet> bash .skilled/skills/system-spec-kit/runtime/cli/setup/check-prerequisites.sh --json --validate and report cited pass/fail evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: prerequisite JSON emitted; native-module probe prints the marker's OK or FAIL line; record-node-version writes `.node-version-marker`
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if readiness, native-module health, and marker recording match the documented setup contract

---

## 3. TEST EXECUTION

### Prompt

```
Validate Setup and Native Module Health against SPECIFY_FEATURE=<track>/<packet> bash .skilled/skills/system-spec-kit/runtime/cli/setup/check-prerequisites.sh --json --validate and report cited pass/fail evidence.
```

### Commands

1. `SPECIFY_FEATURE=<track>/<packet> bash .skilled/skills/system-spec-kit/runtime/cli/setup/check-prerequisites.sh --json --validate`
2. `cd .skilled/skills/system-spec-kit && bash runtime/cli/setup/check-native-modules.sh`
3. `cd .skilled/skills/system-spec-kit && node runtime/cli/setup/record-node-version.js`

### Expected

Prerequisite JSON is emitted; native probe prints diagnostic lines and a recovery hint when needed; `.node-version-marker` is written

### Evidence

Command 1: `SPECIFY_FEATURE=<track>/<packet> bash .skilled/skills/system-spec-kit/runtime/cli/setup/check-prerequisites.sh --json --validate`

```text
exit=0
With SPECIFY_FEATURE naming a phase parent: one JSON validation record per folder (the parent and each child), each "passed":true
```

Without `SPECIFY_FEATURE` the script reads the packet from the branch name and exits 1 with "Not on a feature branch" on any worktree or release branch.

Command 2: `cd .skilled/skills/system-spec-kit && bash runtime/cli/setup/check-native-modules.sh`

```text
-- Native Module Health Check --

Current Node.js: v26.13.0
MODULE_VERSION:  147

Marker Node.js:  v26.13.0
Marker MODULE:   147
Version match:   [OK]

-- Summary --

If the check FAILED, run: bash runtime/cli/setup/rebuild-native-modules.sh
```

The probe exits 0. With `.node-version-marker` moved aside it prints the `[FAIL] not found` line and exits 1.

Command 3: `cd .skilled/skills/system-spec-kit && node runtime/cli/setup/record-node-version.js`

```text
[record-node-version] Wrote <spec-kit root>/.node-version-marker
[record-node-version] Node v26.13.0, MODULE_VERSION 147, darwin/arm64
```

The marker is gitignored, so writing it leaves the tree clean.

### Pass / Fail

- **Pass**: Readiness, native-module health, and marker recording match the documented setup contract.
- **Fail**: The Pass condition above is not met, or any command in the sequence errors unexpectedly.

### Failure Triage

Inspect `runtime/cli/setup/check-prerequisites.sh`, `check-native-modules.sh`, `rebuild-native-modules.sh`, and `record-node-version.js` if setup state or native-module health is misreported

---

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [tooling-and-scripts/setup-native-module-health-and-mcp-installation.md](../../feature-catalog/tooling-and-scripts/setup-native-module-health-and-mcp-installation.md)

Provenance: manual only - SPECIFY_FEATURE=<track>/<packet> bash .skilled/skills/system-spec-kit/runtime/cli/setup/check-prerequisites.sh --json --validate

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 243
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `tooling-and-scripts/setup-native-module-health-and-mcp-installation.md`
