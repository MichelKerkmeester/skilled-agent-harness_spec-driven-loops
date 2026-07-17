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

## 1. OVERVIEW

`scripts/` contains two operator-facing shell helpers for installing or diagnosing the Aside CLI and MCP surfaces.

Current state:

- Both scripts are safe to inspect and are never invoked implicitly by a workflow.
- Only `install.sh` mutates the machine, and only when an operator runs it deliberately.
- `doctor.sh` is read-only and closes the temporary MCP process after its stdio probe.

---

## 2. ARCHITECTURE

The scripts are independent operator entrypoints with different side-effect boundaries.

```text
operator
  |-- explicit install decision --> install.sh --> official Aside installer --> CLI verification
  `-- health inspection ---------> doctor.sh  --> CLI/account checks + MCP stdio probe
```

`install.sh` may install or reinstall the Aside CLI. `doctor.sh` changes nothing, installs nothing, and reports runtime, account, MCP handshake, tool-list, and registered-manual state.

---

## 3. DIRECTORY TREE

```text
scripts/
+-- install.sh    # Explicit install wrapper and post-install verification
+-- doctor.sh     # Read-only CLI and MCP diagnostics
`-- README.md     # Operator entrypoints and validation contract
```

---

## 4. KEY FILES

| File | Responsibility | Mutation posture |
|---|---|---|
| `install.sh` | Wraps the official Aside curl installer, gates on the supported platform, no-ops when an `aside` binary already exists, and verifies the result. Run only as an explicit operator decision. | Mutates the machine when installation runs. |
| `doctor.sh` | Reports the binary and version, account state, a minimal JSON-RPC `initialize` plus `tools/list` handshake over stdio, and registered-manual presence. | Read-only. |

---

## 5. ENTRYPOINTS

Run from the packet root.

### Install

```bash
bash scripts/install.sh          # install if absent, verify
FORCE_INSTALL=true bash scripts/install.sh   # reinstall over an existing binary
```

Non-interactive. Never runs `aside --update`, never prints secrets. Exit 0 = installed and verified; non-zero = unsupported platform or a failed verification.

### Diagnose

```bash
bash scripts/doctor.sh
```

Changes nothing, installs nothing. Reports the binary path/version, signed-in account state, and the live MCP handshake result (the discovered tool inventory is version-pinned — the doctor confirms reachability, it does not freeze the inventory). Manual absence in `.utcp_config.json` is reported as an ERROR because the `aside` manual is registered. The stdio handshake is the only supported MCP lifecycle control; the probe opens and immediately closes the process.

---

## 6. VALIDATION

Healthy install output confirms a supported macOS architecture, an `aside` binary on PATH, and a successful `aside --version` check. `install.sh` exits 0 when an existing binary is accepted or installation completes, and exits 1 for invalid options, unsupported platforms, installer failures, or a missing binary after installation.

Healthy doctor output reports the available CLI and account state, receives MCP `initialize` and `tools/list` responses when the local service is available, and finds the registered `aside` manual. The doctor intentionally exits 0 when the CLI is absent or transport checks only warn. It exits 1 only when `.utcp_config.json` is present but the expected registered manual is missing.

---

## 7. RELATED

- Install narrative and platform detail: `../install-guide.md`
- MCP wiring and the registered manual: `../mcp-servers/aside-mcp/README.md`
- CLI reference: `../references/aside-cli-reference.md`
