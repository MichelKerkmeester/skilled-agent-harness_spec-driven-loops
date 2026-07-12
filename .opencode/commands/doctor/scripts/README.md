---
title: "Doctor Command Scripts"
description: "Developer reference for doctor routing, MCP diagnostics, runtime bootstrap and structural integrity checks."
trigger_phrases:
  - "doctor command scripts"
  - "doctor route validation"
  - "mcp diagnostics"
importance_tier: "important"
---

# Doctor Command Scripts

> Diagnostic and validation entrypoints used by the doctor command family.

---

## 1. OVERVIEW

`.opencode/commands/doctor/scripts/` contains shell, JavaScript and Python tools that support doctor routes.

The scripts validate route manifests, inspect MCP installations, audit parent skill hubs, report graph freshness and prepare runtime dependencies for update workflows. Some scripts are read-only while bootstrap and repair paths can mutate local state.

---

## 2. DIRECTORY TREE

```text
.opencode/commands/doctor/scripts/
+-- audit_descriptions.py
+-- check-mcp-mutation-class.sh
+-- doctor-runtime-bootstrap.sh
+-- fable-mode-check.cjs
+-- mcp-doctor-lib.sh
+-- mcp-doctor.sh
+-- parent-skill-check.cjs
+-- route-validate.py
+-- route-validate.sh
+-- skill-graph-freshness.cjs
`-- README.md
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `route-validate.sh` | Runs route-manifest validation and fixture-based self-tests. |
| `route-validate.py` | Implements route schema, asset, tool, mutation and display-parity checks. |
| `mcp-doctor.sh` | Diagnoses supported MCP servers and runtime configuration wiring. |
| `mcp-doctor-lib.sh` | Supplies logging, result tracking, JSON output and configuration helpers to `mcp-doctor.sh`. |
| `check-mcp-mutation-class.sh` | Enforces read-only and mutating classifications for MCP doctor and installer scripts. |
| `doctor-runtime-bootstrap.sh` | Installs or builds required runtime dependencies for the update route when needed. |
| `parent-skill-check.cjs` | Audits parent skill hubs against structural and routing invariants. |
| `skill-graph-freshness.cjs` | Compares compiled, SQLite and on-disk skill graph representations without writing. |
| `fable-mode-check.cjs` | Reports deep-loop behavioral metrics against an optional baseline. |
| `audit_descriptions.py` | Audits description lengths across skills, commands and agents. |

---

## 4. ROUTE VALIDATION

`route-validate.sh` delegates the live manifest checks to `route-validate.py`.

The validator checks:

- Manifest parsing and schema version
- Required route fields
- Unique targets
- Referenced YAML assets
- Mutation classes
- MCP tool grants
- Trigger phrases
- Script path resolution
- Target parity across router and presentation surfaces
- Read-only route mutation policy

Run it from the repository root:

```bash
bash .opencode/commands/doctor/scripts/route-validate.sh
```

Run its negative fixture suite:

```bash
bash .opencode/commands/doctor/scripts/route-validate.sh --self-test
```

---

## 5. DIAGNOSTIC ENTRYPOINTS

| Command | Purpose |
|---|---|
| `bash .opencode/commands/doctor/scripts/mcp-doctor.sh` | Diagnose all supported MCP servers. |
| `bash .opencode/commands/doctor/scripts/mcp-doctor.sh --json` | Emit machine-readable MCP diagnostics. |
| `node .opencode/commands/doctor/scripts/parent-skill-check.cjs <skill-dir>` | Audit one parent skill hub. |
| `node .opencode/commands/doctor/scripts/skill-graph-freshness.cjs` | Report skill graph drift. |
| `node .opencode/commands/doctor/scripts/fable-mode-check.cjs [artifact-dir]` | Report behavioral metrics. |
| `python3 .opencode/commands/doctor/scripts/audit_descriptions.py --repo-root .` | Audit description budgets. |

---

## 6. MUTATION BOUNDARIES

| Script | Boundary |
|---|---|
| `route-validate.sh` | Read-only during normal validation. Its self-test creates temporary fixture files and removes them on exit. |
| `mcp-doctor.sh` | Diagnostic by default. `--fix` can install dependencies, rebuild output and create database directories. |
| `check-mcp-mutation-class.sh` | Read-only contract scan. |
| `doctor-runtime-bootstrap.sh` | Mutating. It can migrate directories, install dependencies, build output and write bootstrap state. |
| `parent-skill-check.cjs` | Read-only audit. |
| `skill-graph-freshness.cjs` | Read-only report. |
| `fable-mode-check.cjs` | Read-only report. |
| `audit_descriptions.py` | Read-only audit. |

Do not invoke a mutating path from a route classified as read-only.

---

## 7. VALIDATION

Run syntax checks from the repository root:

```bash
bash -n .opencode/commands/doctor/scripts/check-mcp-mutation-class.sh
bash -n .opencode/commands/doctor/scripts/doctor-runtime-bootstrap.sh
bash -n .opencode/commands/doctor/scripts/mcp-doctor-lib.sh
bash -n .opencode/commands/doctor/scripts/mcp-doctor.sh
bash -n .opencode/commands/doctor/scripts/route-validate.sh
node --check .opencode/commands/doctor/scripts/fable-mode-check.cjs
node --check .opencode/commands/doctor/scripts/parent-skill-check.cjs
node --check .opencode/commands/doctor/scripts/skill-graph-freshness.cjs
python3 -m py_compile .opencode/commands/doctor/scripts/audit_descriptions.py
python3 -m py_compile .opencode/commands/doctor/scripts/route-validate.py
```

Expected result: every command exits with status `0` and produces no syntax error.

---

## 8. RELATED

- [Doctor route manifest](../_routes.yaml)
- [Doctor command router](../speckit.md)
- [Doctor assets](../assets/)
- [Commands directory](../../)
