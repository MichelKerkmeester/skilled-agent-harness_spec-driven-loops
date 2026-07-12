---
title: "243 -- Setup, Native Module Health, and MCP Installation"
description: "This scenario validates setup, native module health, and MCP installation for `243`. It focuses on confirming prerequisite checks, native-module diagnostics, marker recording, and installer execution."
version: 3.6.0.12
---

# 243 -- Setup, Native Module Health, and MCP Installation

## 1. OVERVIEW

This scenario validates setup, native module health, and MCP installation for `243`. It focuses on confirming prerequisite checks, native-module diagnostics, marker recording, and installer execution.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm prerequisite validation, native-module diagnostics, marker recording, and installer execution.
- Real user request: `` Please validate Setup, Native Module Health, and MCP Installation against bash .opencode/skills/system-spec-kit/scripts/setup/check-prerequisites.sh --json --validate and tell me whether the expected signals are present: prerequisite JSON emitted; native-module probe prints PASS/FAIL lines; record-node-version writes `.node-version-marker`; installer completes or reports existing configuration. ``
- Prompt: `Validate Setup, Native Module Health, and MCP Installation against bash .opencode/skills/system-spec-kit/scripts/setup/check-prerequisites.sh --json --validate and report cited pass/fail evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: prerequisite JSON emitted; native-module probe prints PASS/FAIL lines; record-node-version writes `.node-version-marker`; installer completes or reports existing configuration
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if readiness, native-module health, marker recording, and installer behavior match the documented setup contract

---

## 3. TEST EXECUTION

### Prompt

```
Validate Setup, Native Module Health, and MCP Installation against bash .opencode/skills/system-spec-kit/scripts/setup/check-prerequisites.sh --json --validate and report cited pass/fail evidence.
```

### Commands

1. `bash .opencode/skills/system-spec-kit/scripts/setup/check-prerequisites.sh --json --validate`
2. `cd .opencode/skills/system-spec-kit && bash scripts/setup/check-native-modules.sh`
3. `cd .opencode/skills/system-spec-kit && node scripts/setup/record-node-version.js`
4. `cd .opencode/skills/system-spec-kit && bash scripts/setup/install.sh --skip-verify`

### Expected

Prerequisite JSON is emitted; native probe prints diagnostic lines and recovery hint when needed; `.node-version-marker` is written; installer either completes or reports existing MCP configuration without silent failure

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

better-sqlite3:    [OK] loads
sharp:             [SKIP] not installed

-- Summary --

If any modules FAILED, run: bash scripts/setup/rebuild-native-modules.sh
```

Command 3 was not run because `node scripts/setup/record-node-version.js` writes `.node-version-marker`, but the execution request allowed writes only to this scenario file.

Command 4 was not run because `bash scripts/setup/install.sh --skip-verify` is an installer command that may modify MCP/setup configuration outside the only allowed write path.

### Pass / Fail

- **BLOCKED**: the prerequisite command did not emit JSON and stopped with `ERROR: Not on a feature branch. Current: system-speckit/028-memory-search-intelligence`; the remaining write-capable setup commands could not be run under the request's allowed-write-path restriction.

### Failure Triage

Inspect `scripts/setup/check-prerequisites.sh`, `check-native-modules.sh`, `rebuild-native-modules.sh`, `record-node-version.js`, and `install.sh` if setup state or native-module health is misreported

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [tooling_and_scripts/setup_native_module_health_and_mcp_installation.md](../../feature_catalog/tooling_and_scripts/setup_native_module_health_and_mcp_installation.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 243
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `tooling_and_scripts/setup_native_module_health_and_mcp_installation.md`
