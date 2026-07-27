---
title: "PI-013 -- Project/global MCP precedence"
description: "This documentation-grounded scenario records project-over-global MCP precedence and skips a live collision test that would write the operator's real global MCP config for `PI-013`."
version: 1.0.0.0
---

# PI-013 -- Project/global MCP precedence

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `PI-013`.

---

## 1. OVERVIEW

This scenario checks the documented relationship between `~/.pi/agent/mcp.json` and `.pi/mcp.json` without making a real global collision.

### Why This Matters

Project MCP configuration must be able to override a same-named global server without allowing this repository's test to change the operator's real MCP environment.

---

## 2. SCENARIO CONTRACT

- Objective: Verify the documented project-over-global precedence statement and preserve the real-global safety boundary.
- Real user request: `Tell me whether this project's MCP server definition overrides a same-named global definition, but do not touch my real global Pi config.`
- Prompt: `Read the Pi MCP precedence guidance and report which definition wins on a colliding server name. Do not create or modify ~/.pi/agent/mcp.json.`
- Expected execution process: Read the MCP reference -> inspect the project file -> document the precedence rule -> skip the real global collision fixture.
- Expected signals: The reference says project configuration overrides global configuration; `.pi/mcp.json` is readable; no global file is written.
- Desired user-visible outcome: A safe, source-grounded precedence result.
- Pass/fail: PASS for the documentation statement and untouched global state. SKIP the live collision test with blocker `real-environment safety boundary against writing ~/.pi/agent/mcp.json`. FAIL if a command mutates the real global file or the reference contradicts the report.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Read the package reference and current project config.
2. Do not create a same-named server in the operator's home directory.
3. Record the project-over-global rule and the exact SKIP reason.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| PI-013 | Project/global MCP precedence | Confirm project override without global mutation | `Read the Pi MCP precedence guidance and report which definition wins on a colliding server name. Do not create or modify ~/.pi/agent/mcp.json.` | `sed -n '1,220p' ../../references/mcp-and-third-party-packages.md` -> `sed -n '1,220p' .pi/mcp.json` -> do not write `~/.pi/agent/mcp.json` | Reference states project settings can override global settings; current project config is captured; real global collision is not run | The source states project-level settings can override global settings. The current `.pi/mcp.json` is readable. No global write is attempted. | PASS for the docs-grounded precedence rule. SKIP the live collision with blocker `writing the operator's real ~/.pi/agent/mcp.json is out of scope`. FAIL on any global mutation. | Use a disposable `PI_CODING_AGENT_DIR` and isolated home fixture if an operator later approves a live collision test. |

### Optional Supplemental Checks

- Compare two disposable projects with colliding server names and retain the effective configuration from each run.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Global MCP safety boundary |
| `../../references/mcp-and-third-party-packages.md` | Project/global precedence guidance |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.pi/mcp.json` | Project MCP configuration |
| `.pi/settings.json` | Project package configuration |

---

## 5. SOURCE METADATA

- Group: MCP Host Integration
- Playbook ID: PI-013
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `mcp-host-integration/project-global-mcp-precedence.md`
