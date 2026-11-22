---
title: "CLI lane and output envelope"
description: "The `bladebro` CLI is the default transport, with a persistent daemon, a `--json` envelope carrying `ok`, `is_error` and `text`, and exit codes 0, 1 and 2."
trigger_phrases:
  - "cli lane and output envelope"
  - "bladebro cli"
  - "bladebro json output"
  - "bladebro exit codes"
version: 1.0.0.0
---

# CLI lane and output envelope (bladebro)

## 1. OVERVIEW

The `bladebro` CLI is the default transport, with a persistent daemon, a `--json` envelope carrying `ok`, `is_error` and `text`, and exit codes 0, 1 and 2.

The CLI and the MCP server call the same five handlers, so picking the CLI never adds or removes a browser capability. The choice is about transport only: the CLI fits standalone work, and Code Mode fits composition with other tools.

---

## 2. HOW IT WORKS

### Lane Rule

The agent runs `command -v bladebro`, then `bladebro doctor`, then `bladebro --version` before the first action in a session. When the binary is present and the doctor passes, the CLI is the transport. When the binary is missing, or the task needs composition, parallel isolated sessions or an MCP-only capability, the MCP lane takes over. When neither works, the agent reports the install command and stops.

### Daemon Lifetime

The first command starts a background daemon that keeps one browser for every later command. `--no-daemon` runs one command with its own browser. `bladebro stop` shuts down the owned daemon and browser. A running daemon keeps its launch settings, so it is stopped after a configuration change.

### Output Envelope

With `--json`, stdout holds one object with `ok`, `is_error` and `text`, plus `image_path` for a saved screenshot. Logs go to stderr. Exit code 0 is success, 1 is a command that ran and failed, and 2 is a usage error such as an unknown flag. A failed command's text carries the page state for recovery.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/mcp-browser-use/mcp-bladebro/SKILL.md` | Shared | Lane rule, detection order and the exit-code rule |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/references/cli-reference.md` | Shared | CLI results, daemon lifetime and configuration |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/mcp-browser-use/mcp-bladebro/manual-testing-playbook/agent-browser/see-content.md` | Manual playbook | Checks the JSON envelope and exit code on a live read |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/benchmark/reports/2026-11-21--manual-testing-playbook--macos-live/README.md` | Benchmark | Recorded envelopes and exit codes from the macOS run |

---

## 4. SOURCE METADATA

- Group: Transport
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `transport/cli-lane-and-output-envelope.md`

Related references:
- [mcp-code-mode-lane.md](mcp-code-mode-lane.md) - The fallback transport through Code Mode
