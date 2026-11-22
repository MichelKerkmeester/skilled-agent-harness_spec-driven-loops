---
title: "Agent-browser isolation"
description: "The Bladebro-owned agent-browser profile is the default lane, and `BLADE_HOME` or `BLADE_FRESH=1` isolates a task from ordinary Bladebro data."
trigger_phrases:
  - "agent-browser isolation"
  - "bladebro agent browser"
  - "blade_home"
  - "blade_fresh"
version: 1.0.0.0
---

# Agent-browser isolation (BLADE_HOME, BLADE_FRESH)

## 1. OVERVIEW

The Bladebro-owned agent-browser profile is the default lane, and `BLADE_HOME` or `BLADE_FRESH=1` isolates a task from ordinary Bladebro data.

The agent browser needs no request and touches no personal profile, so it is the lane wherever stealth or a signed-in session is not required. Isolation keeps one task's cookies, sessions and artifacts apart from another's.

---

## 2. HOW IT WORKS

### Core Behavior

Bladebro owns the agent browser and its dedicated profile, and state can persist across orderly shutdowns. The default data root on macOS and Linux is `~/.local/state/blade`, or a previously used `~/.blade`. `bladebro doctor` prints the root that resolved. That folder can hold cookies, session snapshots and page artifacts, so it stays private.

### Configuration

`BLADE_HOME` moves the whole data root, including the daemon state, artifacts, sessions and profiles, into another folder. `BLADE_FRESH=1` requests an ephemeral profile. `BLADE_LANE=agent` forces the agent lane for one process. The installed 4.8.2 help lists `BLADE_HOME` and `BLADE_LANE`. `BLADE_FRESH` comes from the upstream configuration documentation.

### Edge Cases

These settings are read when the process starts. For the CLI they are set before the daemon starts, and a running daemon keeps its launch settings until `bladebro stop`. For MCP they go in the server entry's `env`. A diagnostics run against an empty `BLADE_HOME` left that folder empty.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/mcp-browser-use/mcp-bladebro/references/browser-lanes.md` | Shared | The agent-browser default and its isolation settings |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/references/cli-reference.md` | Shared | The environment settings table and the data root |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/examples/agent-browser-read.sh` | Script | Runs reads under a scratch `BLADE_HOME` and stops that daemon |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/mcp-browser-use/mcp-bladebro/manual-testing-playbook/agent-browser/see-content.md` | Manual playbook | First read on the isolated agent browser |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/scripts/README.md` | Reference | Records the empty-`BLADE_HOME` diagnostics run |

---

## 4. SOURCE METADATA

- Group: Agent Browser
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `agent-browser/agent-browser-isolation.md`

Related references:
- [page-reads.md](page-reads.md) - Reads on the agent browser
- [tabs-cookies-and-sessions.md](tabs-cookies-and-sessions.md) - The state that isolation keeps apart
