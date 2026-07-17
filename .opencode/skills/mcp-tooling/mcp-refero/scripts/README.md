---
title: "mcp-refero scripts"
description: "Operator helper scripts for the Refero MCP transport: verify-only posture check and report-only diagnostics. Neither installs nor edits config."
trigger_phrases:
  - "refero install script"
  - "refero doctor"
  - "refero scripts"
  - "refero diagnostics"
version: 1.0.0.0
---

# mcp-refero scripts

## 1. OVERVIEW

`scripts/` contains two operator-facing verification and diagnostic helpers for the hosted Refero MCP transport.

Current state:

- Neither script mutates the machine or edits `.utcp_config.json`.
- The `refero` manual is already registered and its bridge is launched by Code Mode, so `install.sh` verifies prerequisites rather than installing software.
- Authentication and any configuration change remain operator-owned.

---

## 2. ARCHITECTURE

Both scripts are read-only entrypoints over the same runtime and registration boundary.

```text
operator
  |-- posture verification --> install.sh --> Node/npx + manual-presence checks
  `-- diagnostics ----------> doctor.sh  --> runtime/manual report + optional endpoint probe
```

The hosted provider and Code Mode bridge stay outside this folder. The scripts only inspect local prerequisites and, when explicitly enabled for the doctor, send one unauthenticated reachability request.

---

## 3. DIRECTORY TREE

```text
scripts/
+-- install.sh    # Verify-only runtime and registration posture
+-- doctor.sh     # Report-only diagnostics and optional reachability probe
`-- README.md     # Operator entrypoints and validation contract
```

---

## 4. KEY FILES

| File | Responsibility | Mutation posture |
|---|---|---|
| `install.sh` | Checks Node 18+, `npx`, manual presence, and the operator-only boundaries. There is nothing to install. | Read-only. |
| `doctor.sh` | Reports runtime and manual state, authentication expectations, callable naming, and optionally one unauthenticated endpoint probe. | Read-only. |

---

## 5. ENTRYPOINTS

Run from the packet root.

### Verify posture

```bash
bash scripts/install.sh
```

Non-interactive. Never edits the config, never touches auth state (`~/.mcp-auth`), and never handles credentials.

### Diagnose

```bash
bash scripts/doctor.sh                     # report-only, offline
REFERO_DOCTOR_LIVE=1 bash scripts/doctor.sh   # + one unauthenticated HTTPS probe
```

The optional live probe sends ONE unauthenticated request to the Refero MCP endpoint. On a healthy environment the expected result is HTTP 401 — the endpoint requires auth. The probe proves reachability only; it cannot complete OAuth and never attempts to.

---

## 6. VALIDATION

Healthy `install.sh` output confirms Node 18+ and `npx`, reports the registered manual, and reiterates the operator-only authentication boundary. It exits 1 only when Node or `npx` is unavailable or Node is below 18. A missing manual is reported as a warning and does not change the exit code.

Healthy `doctor.sh` output reports Node and `npx`, the registered manual and bridge shape, and the doubled-prefix callable reminder. With `REFERO_DOCTOR_LIVE=1`, HTTP 401 confirms unauthenticated reachability. The doctor is report-only and normally exits 0, so operators must read WARN and ERR lines rather than treating the exit code as a health verdict.

---

## 7. RELATED

- Install narrative: `../install-guide.md`
- MCP wiring and the registered manual: `../mcp-servers/refero-mcp/README.md`
- Tool surface: `../references/tool-surface.md`
