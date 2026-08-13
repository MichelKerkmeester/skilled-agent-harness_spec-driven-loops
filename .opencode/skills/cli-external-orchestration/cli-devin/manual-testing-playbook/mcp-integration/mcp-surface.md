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

1. `devin mcp --help > /tmp/cli-devin-dv018-help.txt 2>&1; echo "exit=$?" >> /tmp/cli-devin-dv018-help.txt`
2. `devin mcp list > /tmp/cli-devin-dv018-list.txt 2>&1; echo "exit=$?" >> /tmp/cli-devin-dv018-list.txt`
3. `devin -p "Do not edit files or MCP configuration. Explain which MCP servers are currently visible to this Devin session and which management actions are available." --model adaptive --permission-mode normal </dev/null > /tmp/cli-devin-dv018-prompt.txt 2>&1; echo "exit=$?" >> /tmp/cli-devin-dv018-prompt.txt`
4. Confirm no live config diff.

| Feature ID | Exact commands | Expected signal | Verdict |
|---|---|---|---|
| DV-018 | `devin mcp --help` and `devin mcp list` | Eight verbs documented; list returns; no mutation | PASS/FAIL/SKIP |

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
