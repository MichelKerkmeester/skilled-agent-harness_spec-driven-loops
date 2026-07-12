---
title: "WIRE-001 -- Install And Verify The Live Tools"
description: "This scenario validates od mcp install for `WIRE-001`. It focuses on writing the open-design MCP entry after a reviewed dry-run and confirming the live tools/list."
version: 1.4.0.1
---

# WIRE-001 -- Install And Verify The Live Tools

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `WIRE-001`.

---

## 1. OVERVIEW

This scenario validates od mcp install for `WIRE-001`. It focuses on writing the `open-design` MCP entry into the target agent after a reviewed dry-run, then confirming the live `tools/list` reflects the wired tools.

### Why This Matters

Wiring is the first step of the skill, and the install mutates an agent config file. A blind install or an unverified tool set is the failure this scenario guards against. Confirming the live `tools/list` proves the help text undercount does not hide the real surface.

---

## 2. SCENARIO CONTRACT

Operators run the exact command sequence for `WIRE-001` and confirm the expected signals without contradictory evidence.

- Objective: write the `open-design` MCP entry after a reviewed dry-run and verify the live tools
- Real user request: `Connect Open Design to this agent and confirm its tools are available.`
- Prompt: `Wire Open Design into opencode, but show me the exact config first.`
- Expected execution process: locate the CLI by bundle path, run the dry-run, review the entry, run the install, then verify the live tools/list while the app is open
- Expected signals: the dry-run prints the entry and writes nothing, the install deep-merges opencode.json under mcp.open-design, the live tools/list lists Open Design tools
- Desired user-visible outcome: the agent reports Open Design is wired and its tools are confirmed available
- Pass/fail: PASS if the dry-run wrote nothing AND the install added the entry AND the live tools/list shows the tools. FAIL if the install wrote without a reviewed dry-run OR the tools/list does not reflect the wiring

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Decide whether the scenario should stay local or delegate. Wiring stays local.
3. Execute the deterministic steps exactly as written.
4. Compare the observed output against the desired user-visible outcome.
5. Return a concise final answer that a real user would understand.

PRE: Back up the target agent config first. Confirm the desktop app is open before the tools/list step. **In this repo, do not actually run step 3 (`node "$OD_BIN" mcp install opencode`) against the real global config** -- this repo's canonical wiring is already Code Mode (`.utcp_config.json`'s `open_design` manual, see `references/mcp_wiring.md` Section 5b); executing step 3 for real here writes a redundant, unwanted native entry. Grade this scenario from the dry-run output (step 1) plus the already-present Code Mode entry, or execute against a disposable/sandboxed agent config, not the operator's real one.

1. `node "$OD_BIN" mcp install opencode --print --json`  # -> prints the entry, writes nothing
2. review the printed command array and environment  # -> confirm OD_SIDECAR_IPC_PATH and ELECTRON_RUN_AS_NODE
3. `node "$OD_BIN" mcp install opencode`  # -> deep-merges opencode.json under mcp.open-design
4. verify the agent's live `tools/list`  # -> Open Design tools present while the app is open

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| WIRE-001 | od mcp install | Verify the MCP entry is written after a reviewed dry-run and the live tools/list reflects it | `Wire Open Design into opencode, but show me the exact config first.` | 1. `node "$OD_BIN" mcp install opencode --print --json` -> 2. review -> 3. `node "$OD_BIN" mcp install opencode` -> 4. verify live tools/list | Step 1: entry printed, nothing written. Step 3: opencode.json gains mcp.open-design. Step 4: Open Design tools listed | Dry-run output, config diff, and tools/list transcript | PASS if dry-run wrote nothing AND install added the entry AND tools/list shows the tools. FAIL if install wrote without a reviewed dry-run OR tools/list is empty | 1. Confirm `$OD_BIN` resolves to the bundle daemon-cli.mjs. 2. Confirm the desktop app is open. 3. Re-run the dry-run and compare to the written entry. |

### Optional Supplemental Checks

Repeat step 1 for `claude` to confirm the Claude Code path delegates to `claude mcp add --scope user open-design`.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/wiring/od-mcp-install.md` | Feature-catalog source describing the install contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/mcp_wiring.md` | Wiring commands and written config shape |
| `../../references/od_cli_reference.md` | Locating the CLI and the daemon model |

---

## 5. SOURCE METADATA

- Group: Wiring
- Playbook ID: WIRE-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `wiring/install-and-verify.md`
