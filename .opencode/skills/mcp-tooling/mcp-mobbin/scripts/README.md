---
title: "mcp-mobbin scripts"
description: "Operator helper scripts for the Mobbin MCP transport: verify-only posture check and report-only diagnostics. Neither installs nor edits config."
trigger_phrases:
  - "mobbin install script"
  - "mobbin doctor"
  - "mobbin scripts"
  - "mobbin diagnostics"
version: 1.0.0.0
---

# mcp-mobbin scripts

## 1. OVERVIEW

`scripts/` contains two operator-facing verification and diagnostic helpers for the hosted Mobbin MCP transport.

Current state:

- Neither script mutates the machine or edits `.utcp_config.json`.
- The `mobbin` manual is already registered through a stdio `npx mcp-remote` bridge with an empty environment.
- Authentication and any configuration change remain operator-owned.

---

## 2. ARCHITECTURE

Both scripts are read-only entrypoints over the same runtime and registration boundary.

```text
operator
  |-- posture verification --> install.sh --> Node/npx + manual/bridge checks
  `-- diagnostics ----------> doctor.sh  --> runtime/manual report + optional endpoint probe
```

The hosted provider and Code Mode bridge stay outside this folder. The scripts inspect prerequisites and registration state, while the doctor can send one explicitly enabled unauthenticated reachability request.

---

## 3. DIRECTORY TREE

```text
scripts/
+-- install.sh    # Verify-only runtime, manual, and bridge posture
+-- doctor.sh     # Report-only diagnostics and optional reachability probe
`-- README.md     # Operator entrypoints and validation contract
```

---

## 4. KEY FILES

| File | Responsibility | Mutation posture |
|---|---|---|
| `install.sh` | Checks Node 18+, `npx`, registered-manual and bridge presence, and the operator-only first-use OAuth boundary. There is nothing to install. | Read-only. |
| `doctor.sh` | Reports runtime, manual, bridge, authentication, rate-limit, and callable state, and optionally sends one unauthenticated endpoint probe. | Read-only. |

---

## 5. ENTRYPOINTS

Run from the packet root.

### Verify posture

```bash
bash scripts/install.sh
```

Non-interactive. Never edits the config, never touches auth state (`~/.mcp-auth`), never handles or invents credentials (no API key exists; auth is a browser OAuth round-trip owned by the operator). Exit 0 = posture verified; exit 1 = a required element is missing (broken runtime or a reverted registration).

### Diagnose

```bash
bash scripts/doctor.sh                     # report-only, offline
MOBBIN_DOCTOR_LIVE=1 bash scripts/doctor.sh   # + one unauthenticated reachability probe
```

Registered-state expectation: the `mobbin` manual IS present in `.utcp_config.json`. Presence is the healthy result; ABSENCE indicates a broken or reverted registration and is reported as an ERROR. The optional probe proves reachability only; it cannot complete OAuth.

---

## 6. VALIDATION

Healthy `install.sh` output confirms Node 18+, `npx`, the registered manual, and the expected `npx mcp-remote` bridge shape. It exits 0 only when all required checks pass and exits 1 when the runtime, registration, or bridge shape is missing.

Healthy `doctor.sh` output reports Node and `npx`, the registered manual and bridge shape, the OAuth and rate-limit expectations, and the live-discovered callable baseline. With `MOBBIN_DOCTOR_LIVE=1`, HTTP 401 confirms unauthenticated reachability. The doctor is report-only and normally exits 0, so operators must read WARN and ERR lines rather than treating the exit code as a health verdict.

---

## 7. RELATED

- Install narrative: `../install-guide.md`
- MCP wiring and the registered manual: `../mcp-servers/mobbin-mcp/README.md`
- Tool surface: `../references/tool-surface.md`
