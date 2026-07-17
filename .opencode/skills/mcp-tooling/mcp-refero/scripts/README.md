---
title: "mcp-refero scripts"
description: "Operator helper scripts for the Refero MCP transport: verify-only posture check and report-only diagnostics. Neither installs nor edits config."
trigger_phrases:
  - "refero install script"
  - "refero doctor"
  - "refero scripts"
  - "refero diagnostics"
version: 1.2.0.0
---

# mcp-refero scripts

Two operator-facing shell helpers. Neither mutates the machine — mcp-refero is a read-only transport whose `refero` manual is already registered in `.utcp_config.json` and whose bridge is launched by Code Mode.

| Script | Mutates? | What it does | When to run |
|--------|----------|--------------|-------------|
| `install.sh` | No | Verify-only posture: runtime prerequisites (Node 18+, npx), manual presence (read-only grep), and the operator-only boundaries. Nothing to install. | To confirm the transport is wired correctly. |
| `doctor.sh` | No | Report-only diagnostics; optionally one unauthenticated reachability probe. | To confirm the endpoint is reachable and the manual is present. |

## install.sh

```bash
bash scripts/install.sh
```

Non-interactive. Never edits the config, never touches auth state (`~/.mcp-auth`), never handles credentials. Exit 0 = posture verified; exit 1 = a required element is missing (broken runtime or a reverted registration).

## doctor.sh

```bash
bash scripts/doctor.sh                     # report-only, offline
REFERO_DOCTOR_LIVE=1 bash scripts/doctor.sh   # + one unauthenticated HTTPS probe
```

The optional live probe sends ONE unauthenticated request to the Refero MCP endpoint. On a healthy environment the expected result is HTTP 401 — the endpoint requires auth. The probe proves reachability only; it cannot complete OAuth and never attempts to.

## Related

- Install narrative: `../install-guide.md`
- MCP wiring and the registered manual: `../mcp-servers/refero-mcp/README.md`
- Tool surface: `../references/tool-surface.md`
