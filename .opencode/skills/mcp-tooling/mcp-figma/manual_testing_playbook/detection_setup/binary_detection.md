---
title: "DETECT-001 -- Binary Detection And The Naming-Trap Refusal"
description: "This scenario validates binary detection for `DETECT-001`. It focuses on confirming the canonical silships figma-ds-cli is detected and the unrelated figma-cli npm package is rejected by name."
version: 1.0.0.1
---

# DETECT-001 -- Binary Detection And The Naming-Trap Refusal

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DETECT-001`.

---

## 1. OVERVIEW

This scenario validates binary detection for `DETECT-001`. It focuses on confirming the canonical `figma-ds-cli` is detected as the silships binary, that any resolved `figma-cli` is verified to be the silships tool (not unic/figma-cli), and that the agent refuses to suggest or run `npm i -g figma-cli`.

### Why This Matters

The naming trap is the locked decision at the top of this skill: the canonical binary is `figma-ds-cli` (silships, npm, MIT), while the npm package literally named `figma-cli` is an UNRELATED tool (unic/figma-cli, bin `figma`). A blind `npm i -g figma-cli` installs the wrong tool. Nothing else in the skill is trustworthy until the canonical binary is verified and the unrelated package is rejected, which is why this is a critical-path scenario.

---

## 2. SCENARIO CONTRACT

Operators run the exact command sequence for `DETECT-001` and confirm the expected signals without contradictory evidence.

- Objective: confirm the canonical binary is present and the unrelated `figma-cli` npm package is rejected by name
- Real user request: `Check whether the Figma CLI is installed and which tool it is.`
- Prompt: `Check whether the Figma CLI is installed and which tool it is.`
- Expected execution process: probe `figma-ds-cli` first, then `figma-cli`; verify any `figma-cli` resolution with `--version`/`--help`; fail closed with install guidance if neither is the silships tool
- Expected signals: `figma-ds-cli` resolves and reports a version, OR detection reports "not installed" with guidance that explicitly warns against `npm i -g figma-cli`; a bare `figma-cli` is never trusted without verification
- Desired user-visible outcome: the agent states whether the canonical Figma CLI is installed and never recommends installing the unrelated `figma-cli` package
- Pass/fail: PASS if the canonical binary is correctly identified (present or absent) AND the agent never recommends `npm i -g figma-cli`; FAIL if a bare `figma-cli` is trusted without verification OR the unrelated package is recommended

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Decide whether the scenario should stay local or delegate. Detection stays local.
3. Execute the deterministic steps exactly as written.
4. Compare the observed output against the desired user-visible outcome.
5. Return a concise final answer that a real user would understand.

PRE: This is a read-only detection scenario. If neither binary resolves to the silships tool, treat detection as the scenario result, not a blocker (record it and skip the dependents).

1. `bash: command -v figma-ds-cli`  # -> path printed or empty
2. `figma-ds-cli --version` (if present)  # -> silships version string
3. `bash: command -v figma-cli` then verify silships via `figma-cli --help`  # -> confirm silships, else treat as unrelated/absent
4. agent states the result and the naming warning  # -> never `npm i -g figma-cli`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DETECT-001 | Binary detection | Verify the canonical `figma-ds-cli` is detected and the unrelated `figma-cli` package is rejected | `Check whether the Figma CLI is installed and which tool it is.` | 1. `bash: command -v figma-ds-cli` -> 2. `figma-ds-cli --version` (if present) -> 3. `bash: command -v figma-cli` (only verify silships via `figma-cli --help`) -> 4. agent states result and the naming warning | Step 1: path printed or empty. Step 2: silships version string. Step 3: if present, `--help` confirms silships, else treated as unrelated/absent. Step 4: agent warns NEVER `npm i -g figma-cli` | Token-redacted transcript of `command -v` and `--version`/`--help`, plus the agent's statement | PASS if the canonical binary is correctly identified (present or absent) AND the agent never recommends `npm i -g figma-cli`. FAIL if a bare `figma-cli` is trusted without verification OR the unrelated package is recommended | 1. Confirm `command -v figma-ds-cli` was run first. 2. Confirm any `figma-cli` hit was verified via `--help`. 3. Confirm install guidance points to `figma-ds-cli` (npm) or the silships repo. |

### Optional Supplemental Checks

If `figma-ds-cli@1.0.0` resolves from npm, note the version trap: the published npm package is minimal (no `--safe`/daemon/extract); the full ~130-command surface is repo `main` 1.2.0 (unpublished). Verify the available verb surface against `figma-ds-cli --help` rather than assuming the published version covers it.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/connect_and_daemon/connect_and_daemon.md` | Feature-catalog source for the connect/daemon foundation this unblocks |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/figma_cli_reference.md` | Binary identity, version trap, and the naming-trap warning |
| `../../INSTALL-GUIDE.md` | Install guidance that points to the canonical `figma-ds-cli` |

---

## 5. SOURCE METADATA

- Group: Detection and Setup
- Playbook ID: DETECT-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `detection-setup/binary-detection.md`
