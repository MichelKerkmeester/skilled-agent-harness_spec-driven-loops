---
title: "DV-018 -- Devin MCP surface"
description: "Inspect the real devin mcp command surface and verify list/help behavior without changing live MCP registrations."
version: 1.0.0.0
---

# DV-018 -- Devin MCP surface

This document captures the realistic user-testing contract, execution flow, source anchors, and validation criteria for `DV-018`.

## 1. OVERVIEW

Exercise the non-mutating portions of Devin's native MCP host surface: help and list. Add/remove/login/logout/enable/disable are documented as opt-in extensions because they change live configuration or credentials.

### Why This Matters

MCP management is a real Devin capability and must be distinguished from the repository's external MCP transport. The safe baseline is surface discovery without altering registrations.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm `devin mcp` exposes the documented management verbs and returns the current server list.
- Real user request: `Show me Devin's MCP management surface without adding or removing any server.`
- Prompt: `Do not edit files or MCP configuration. Explain which MCP servers are currently visible to this Devin session and which management actions are available.`
- Expected execution process: Run `devin mcp --help`, `devin mcp list`, and a read-only print request; do not run add/remove/login/logout/enable/disable.
- Expected signals: Help names `add`, `list`, `get`, `remove`, `login`, `logout`, `enable`, and `disable`; list returns a valid empty or populated result; no config mutation.
- Desired user-visible outcome: A safe, current MCP surface report.
- Pass/fail: PASS when help/list work and the working tree/config are unchanged; FAIL on missing verbs or unexpected mutation; SKIP if no authenticated MCP context exists, with that blocker named.

---

## 3. TEST EXECUTION

### Prompt

Prompt: `Do not edit files or MCP configuration. Explain which MCP servers are currently visible to this Devin session and which management actions are available.`

### Commands

1. `devin mcp --help > /tmp/cli-devin-dv018-help.txt 2>&1; echo "exit=$?" >> /tmp/cli-devin-dv018-help.txt`
2. `devin mcp list > /tmp/cli-devin-dv018-list.txt 2>&1; echo "exit=$?" >> /tmp/cli-devin-dv018-list.txt`
3. `devin -p "Do not edit files or MCP configuration. Explain which MCP servers are currently visible to this Devin session and which management actions are available." --model adaptive --permission-mode normal </dev/null > /tmp/cli-devin-dv018-prompt.txt 2>&1; echo "exit=$?" >> /tmp/cli-devin-dv018-prompt.txt`
4. Confirm no live config diff.

### Expected

Eight verbs documented; list returns; no mutation

### Evidence

Captured output files from every command in §3, the table's Expected Signal cell (`Eight verbs documented; list returns; no mutation`), and the exit code recorded alongside each command.

### Pass / Fail

- **Pass**: when help/list work and the working tree/config are unchanged.
- **Fail**: on missing verbs or unexpected mutation
- **Skip**: if no authenticated MCP context exists, with that blocker named..

### Failure Triage

1. **Signal mismatch**: the captured output does not match the Expected Signal cell; re-run the exact command sequence above and diff the new output against it.
2. **Preflight/blocker**: if the required binary, auth, or workspace precondition is unavailable, record the SKIP with that exact blocker rather than guessing a result.
3. **Unexpected mutation**: if the repository or a temporary workspace shows an unexpected diff, treat the scenario as FAIL regardless of the command's own exit code.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Safe read-only MCP policy |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/devin-tools.md` | Native MCP capability reference |
| `../../references/cli-reference.md` | `devin mcp` subcommand roster |
| `../../SKILL.md` | Cross-AI dispatch boundary |

---

## 5. SOURCE METADATA

- Group: MCP Integration
- Playbook ID: DV-018
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `mcp-integration/mcp-surface.md`
