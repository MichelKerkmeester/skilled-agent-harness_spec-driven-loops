---
title: "mcp-aside-devtools scripts"
description: "Operator helper scripts for the Aside CLI and MCP surfaces: an explicit install wrapper and read-only diagnostics. Never invoked implicitly by a workflow."
trigger_phrases:
  - "aside install script"
  - "aside doctor"
  - "aside scripts"
  - "aside diagnostics"
version: 1.2.0.0
---

# mcp-aside-devtools scripts

Two operator-facing shell helpers. Both are safe to read; only `install.sh` mutates the machine, and only when an operator runs it deliberately.

| Script | Mutates? | What it does | When to run |
|--------|----------|--------------|-------------|
| `install.sh` | Yes (machine) | Wraps the official Aside curl installer. Gates on the supported platform, no-ops when an `aside` binary already exists, verifies the result. | Only as an explicit operator decision — never from a workflow. |
| `doctor.sh` | No | Read-only diagnostics for the CLI and MCP surfaces: binary/version, account state, and a minimal JSON-RPC `initialize` + `tools/list` handshake over stdio (then closes the process). | Anytime you need to confirm the Aside surfaces are healthy. |

## install.sh

```bash
bash scripts/install.sh          # install if absent, verify
FORCE_INSTALL=true bash scripts/install.sh   # reinstall over an existing binary
```

Non-interactive. Never runs `aside --update`, never prints secrets. Exit 0 = installed and verified; non-zero = unsupported platform or a failed verification.

## doctor.sh

```bash
bash scripts/doctor.sh
```

Changes nothing, installs nothing. Reports the binary path/version, signed-in account state, and the live MCP handshake result (the discovered tool inventory is version-pinned — the doctor confirms reachability, it does not freeze the inventory). Manual absence in `.utcp_config.json` is reported as an ERROR because the `aside` manual is registered. The stdio handshake is the only supported MCP lifecycle control; the probe opens and immediately closes the process.

## Related

- Install narrative and platform detail: `../install-guide.md`
- MCP wiring and the registered manual: `../mcp-servers/aside-mcp/README.md`
- CLI reference: `../references/aside-cli-reference.md`
