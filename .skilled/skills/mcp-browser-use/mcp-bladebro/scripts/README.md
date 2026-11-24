---
title: "mcp-bladebro scripts"
description: "Operator helper scripts for the Bladebro CLI and MCP surfaces: a pinned, digest-checked install wrapper and read-only diagnostics. Never invoked implicitly by a workflow."
trigger_phrases:
  - "bladebro install script"
  - "bladebro doctor script"
  - "bladebro scripts"
version: 1.0.1.0
---

# mcp-bladebro scripts

## 1. OVERVIEW

`scripts/` holds two operator-facing shell helpers for installing or diagnosing the Bladebro CLI and its MCP server.

Current state:

- Both scripts are safe to read, and no workflow calls either one on its own.
- Only `install.sh` changes the machine, and only when an operator runs it on purpose.
- `doctor.sh` is read-only. It runs every `bladebro` call with `BLADE_NO_UPDATE_CHECK=1`, so nothing reaches the release registry, and it closes the MCP process after its stdio probe.

---

## 2. ARCHITECTURE

The scripts are separate operator entrypoints with different side effects.

```text
operator
  |-- explicit install decision --> install.sh --> npm install -g --ignore-scripts bladebro@4.8.2 --> launcher and binary digest checks --> version check
  `-- health inspection ---------> doctor.sh  --> version, digests, bladebro doctor, MCP stdio probe, manual check
```

Both scripts carry the v4.8.2 digests that `../references/install-and-verify.md` records: the two macOS native binaries and the two JS launcher files, `bin.js` and `binary.cjs`. A new pin changes all three files together.

---

## 3. DIRECTORY TREE

```text
scripts/
+-- install.sh    # Pinned install, digest check, version check
+-- doctor.sh     # Read-only CLI and MCP diagnostics
`-- README.md     # Entrypoints and exit codes
```

---

## 4. KEY FILES

| File | Responsibility | Mutation posture |
|---|---|---|
| `install.sh` | Refuses platforms with no recorded digest, does nothing when `bladebro` is already on PATH, installs the pinned release, checks the native binary digest and removes the install on a mismatch. | Changes the machine when the install runs. |
| `doctor.sh` | Reports the package version against the pin, the launcher and native binary digests, the `bladebro doctor` summary, a JSON-RPC `initialize` plus `tools/list` handshake over stdio and the registered manual. | Read-only. |

The mutation-class guard, `.skilled/commands/doctor/scripts/check-mcp-mutation-class.sh`, holds `doctor.sh` to its read-only label through the row in `.skilled/commands/doctor/assets/mcp-mutation-class-manifest.yaml`.

---

## 5. ENTRYPOINTS

Run from the packet root.

### Install

```bash
bash scripts/install.sh
```

Non-interactive. It never runs `npm update` or `bladebro -u`, and it never replaces an existing install, whatever its version. Exit 0 means installed and verified, or an existing install was left alone. Exit 1 means an invalid option, an unsupported platform, a missing prerequisite, a failed install, a digest mismatch or a failed version check.

### Diagnose

```bash
bash scripts/doctor.sh
```

Changes nothing and installs nothing. A run on 2026-11-21 against an empty `BLADE_HOME` left that folder empty, both for the MCP probe and for `bladebro doctor`. The doctor confirms the server answers and lists its tools, but it does not freeze the tool inventory.

---

## 6. VALIDATION

A healthy doctor run reports a version and digest match, the `bladebro doctor` summary, an `initialize` response, the five tools `act`, `see`, `state`, `run` and `vision` and the registered manual. It exits 0 when the CLI is absent or a check only warns. It exits 1 when a digest on the pinned release does not match, and then runs no `bladebro` command at all, or when `.utcp_config.json` exists without the `bladebro` manual.

---

## 7. RELATED

- Install narrative: `../INSTALL-GUIDE.md`
- Pin, digests and probes: `../references/install-and-verify.md`
- The registered manual: `../assets/utcp-bladebro-manual.md`
