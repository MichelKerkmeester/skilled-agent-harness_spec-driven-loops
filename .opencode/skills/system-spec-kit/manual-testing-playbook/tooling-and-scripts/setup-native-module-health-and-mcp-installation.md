---
title: "243 -- Setup, Native Module Health, and MCP Installation"
description: "This scenario validates setup and native module health for `243`. It focuses on confirming prerequisite checks, native-module diagnostics, and marker recording."
version: 3.6.0.12
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
- Real user request: `` Please validate Setup and Native Module Health against bash .opencode/skills/system-spec-kit/scripts/setup/check-prerequisites.sh --json --validate and tell me whether the expected signals are present: prerequisite JSON emitted; native-module probe prints PASS/FAIL lines; record-node-version writes `.node-version-marker`. ``
- Prompt: `Validate Setup and Native Module Health against bash .opencode/skills/system-spec-kit/scripts/setup/check-prerequisites.sh --json --validate and report cited pass/fail evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: prerequisite JSON emitted; native-module probe prints PASS/FAIL lines; record-node-version writes `.node-version-marker`
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if readiness, native-module health, and marker recording match the documented setup contract

---

## 3. TEST EXECUTION

### Prompt

```
Validate Setup and Native Module Health against bash .opencode/skills/system-spec-kit/scripts/setup/check-prerequisites.sh --json --validate and report cited pass/fail evidence.
```

### Commands

1. `bash .opencode/skills/system-spec-kit/scripts/setup/check-prerequisites.sh --json --validate`
2. `cd .opencode/skills/system-spec-kit && bash scripts/setup/check-native-modules.sh`
3. `cd .opencode/skills/system-spec-kit && node scripts/setup/record-node-version.js`

### Expected

Prerequisite JSON is emitted; native probe prints diagnostic lines and a recovery hint when needed; `.node-version-marker` is written

### Evidence

Command 1: `bash .opencode/skills/system-spec-kit/scripts/setup/check-prerequisites.sh --json --validate`

```text
ERROR: Not on a feature branch. Current: system-speckit/028-memory-search-intelligence
Feature branches should be: 001-feature-name (or main/master/trunk for trunk-based operators)
```

Command 2: `cd .opencode/skills/system-spec-kit && bash scripts/setup/check-native-modules.sh`

```text
-- Native Module Health Check --

Current Node.js: v22.23.1
MODULE_VERSION:  127

Marker Node.js:  v22.23.1
Marker MODULE:   127
Version match:   [OK]

-- Module Probes --

sharp:             [SKIP] not installed

-- Summary --

If any modules FAILED, run: bash scripts/setup/rebuild-native-modules.sh
```

A `[SKIP]` module row is not a failure: it means that optional native module is missing from this environment and the probe skipped it.

Command 3 was not run because `node scripts/setup/record-node-version.js` writes `.node-version-marker`, but the execution request allowed writes only to this scenario file.

### Pass / Fail

- **Pass**: Readiness, native-module health, and marker recording match the documented setup contract.
- **Fail**: The Pass condition above is not met, or any command in the sequence errors unexpectedly.

### Failure Triage

Inspect `scripts/setup/check-prerequisites.sh`, `check-native-modules.sh`, `rebuild-native-modules.sh`, and `record-node-version.js` if setup state or native-module health is misreported

---

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [tooling-and-scripts/setup-native-module-health-and-mcp-installation.md](../../feature-catalog/tooling-and-scripts/setup-native-module-health-and-mcp-installation.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 243
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `tooling-and-scripts/setup-native-module-health-and-mcp-installation.md`
