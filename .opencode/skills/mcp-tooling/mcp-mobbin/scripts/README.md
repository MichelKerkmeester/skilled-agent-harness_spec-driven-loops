---
title: "mcp-mobbin scripts"
description: "Operator helper scripts for the Mobbin MCP transport: verify-only posture check and report-only diagnostics. Neither installs nor edits config."
trigger_phrases:
  - "mobbin install script"
  - "mobbin doctor"
  - "mobbin scripts"
  - "mobbin diagnostics"
version: 1.2.0.0
---

# mcp-mobbin scripts

Two operator-facing shell helpers. Neither mutates the machine — the Mobbin provider is a hosted remote service and the `mobbin` manual is already registered in `.utcp_config.json` (stdio `npx mcp-remote` bridge, empty env).

| Script | Mutates? | What it does | When to run |
|--------|----------|--------------|-------------|
| `install.sh` | No | Verify-only posture: runtime (Node 18+, npx), registered-manual presence (read-only grep), and a pointer to the operator-only first-use OAuth step. Nothing to install. | To confirm the transport is wired correctly. |
| `doctor.sh` | No | Report-only diagnostics; optionally one unauthenticated reachability probe. | To confirm reachability and that the manual is present. |

## install.sh

```bash
bash scripts/install.sh
```

Non-interactive. Never edits the config, never touches auth state (`~/.mcp-auth`), never handles or invents credentials (no API key exists; auth is a browser OAuth round-trip owned by the operator). Exit 0 = posture verified; exit 1 = a required element is missing (broken runtime or a reverted registration).

## doctor.sh

```bash
bash scripts/doctor.sh                     # report-only, offline
MOBBIN_DOCTOR_LIVE=1 bash scripts/doctor.sh   # + one unauthenticated reachability probe
```

Registered-state expectation: the `mobbin` manual IS present in `.utcp_config.json`. Presence is the healthy result; ABSENCE indicates a broken or reverted registration and is reported as an ERROR. The optional probe proves reachability only; it cannot complete OAuth.

## Related

- Install narrative: `../install-guide.md`
- MCP wiring and the registered manual: `../mcp-servers/mobbin-mcp/README.md`
- Tool surface: `../references/tool-surface.md`
