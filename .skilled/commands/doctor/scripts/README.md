---
title: "Doctor Command Scripts"
description: "Developer reference for doctor routing, MCP diagnostics, release updates and structural integrity checks."
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

`.skilled/commands/doctor/scripts/` contains shell, JavaScript and Python tools that support doctor routes.

The scripts validate route manifests, inspect MCP installations, audit parent skill hubs, report graph freshness, and plan and apply framework release updates. Most are read-only. The release updater's apply and rollback paths write local state. Every script has a test under `tests/`, and one runner executes them all.

---

## 2. DIRECTORY TREE

```text
.skilled/commands/doctor/scripts/
+-- agent-roster-mirror-check.cjs
+-- audit_descriptions.py
+-- command-catalog-mirror-check.cjs
+-- check-mcp-mutation-class.sh
+-- mcp-doctor-lib.sh
+-- mcp-doctor.sh
+-- parent-skill-check.cjs
+-- route-validate.py
+-- route-validate.sh
+-- release-update.cjs
+-- skill-graph-freshness.cjs
+-- tests/            # one suite per script, plus run-all.sh
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
| `parent-skill-check.cjs` | Audits parent skill hubs against structural and routing invariants. |
| `release-update.cjs` | Plans, aligns, applies, rolls back and records framework release bases for the five `/doctor:update` workflows. |
| `skill-graph-freshness.cjs` | Compares compiled, SQLite and on-disk skill graph representations without writing. |
| `audit_descriptions.py` | Audits description lengths across skills, commands and agents. |
| `agent-roster-mirror-check.cjs` | Verifies every canonical agent reaches all five runtime surfaces, and that mirror surfaces stay symlinked rather than forked. |
| `command-catalog-mirror-check.cjs` | Compares every command catalog and hub metadata entry back to the command's own frontmatter, which is the one copy nothing else derives from. Structural drift fails; prose divergence reports and fails only under `--strict`. |

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
- Each route names an existing doctor router
- Target parity between each command's router and presentation
- Read-only route mutation policy
- Workflow activity coverage for every route script invocation

Run it from the repository root:

```bash
bash .skilled/commands/doctor/scripts/route-validate.sh
```

Run its negative fixture suite:

```bash
bash .skilled/commands/doctor/scripts/route-validate.sh --self-test
```

---

## 5. DIAGNOSTIC ENTRYPOINTS

| Command | Purpose |
|---|---|
| `bash .skilled/commands/doctor/scripts/mcp-doctor.sh` | Diagnose all supported MCP servers. |
| `bash .skilled/commands/doctor/scripts/mcp-doctor.sh --json` | Emit machine-readable MCP diagnostics. |
| `node .skilled/commands/doctor/scripts/parent-skill-check.cjs <skill-dir>` | Audit one parent skill hub. |
| `node .skilled/commands/doctor/scripts/skill-graph-freshness.cjs` | Report skill graph drift. |
| `python3 .skilled/commands/doctor/scripts/audit_descriptions.py --repo-root .` | Audit description budgets. |
| `node .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs` | Report agent-roster coverage drift across runtimes. |
| `node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs` | Report command-catalog and hub-metadata drift. |
| `bash .skilled/commands/doctor/scripts/check-mcp-mutation-class.sh` | Check the read-only and mutating classes of MCP doctor and installer scripts. |
| `node .skilled/commands/doctor/scripts/release-update.cjs check --offline` | Report what a release update would change, without fetching. |

---

## 6. MUTATION BOUNDARIES

| Script | Boundary |
|---|---|
| `route-validate.sh` | Read-only during normal validation. Its self-test creates temporary fixture files and removes them on exit. |
| `mcp-doctor.sh` | Read-only diagnostic. Repairs belong to the `/doctor:mcp` workflows, one approval at a time. Exit 3 means bad arguments. |
| `check-mcp-mutation-class.sh` | Read-only contract scan. |
| `parent-skill-check.cjs` | Read-only audit. |
| `skill-graph-freshness.cjs` | Read-only report. |
| `audit_descriptions.py` | Read-only audit. |
| `agent-roster-mirror-check.cjs`, `command-catalog-mirror-check.cjs` | Read-only reports. |
| `release-update.cjs` | `check` and `align --dry-run` are read-only. `align` writes a run directory. `apply`, `rollback` and `record-base` write framework files and release records under a lock. The `unlock` subcommand removes a lock only when its owner process is gone. |

Do not invoke a mutating path from a route classified as read-only.

---

## 7. VALIDATION

Run every doctor test from the repository root. CI runs the same command in the `doctor-scripts` job of `.github/workflows/spec-kit-check.yml`:

```bash
bash .skilled/commands/doctor/scripts/tests/run-all.sh
```

The runner needs `node`, `python3` with PyYAML, and the advisor runtime's dependencies (`npm --prefix .skilled/skills/system-skill-advisor/runtime ci`). It exits `0` when every suite passes, `1` when one fails and `2` when a required tool is missing. `tests/README.md` lists the suites.

Each script can be pointed at a fixture tree, which is how the tests run without touching the repository:

| Script | Override |
|---|---|
| `agent-roster-mirror-check.cjs`, `command-catalog-mirror-check.cjs`, `mcp-doctor.sh`, `release-update.cjs` | `--root <dir>` |
| `audit_descriptions.py`, `route-validate.sh` | `--repo-root <dir>`. `route-validate.sh` also reads `REPO_ROOT`, `ROUTES_FILE`, `DOCTOR_DIR` and `ASSETS_DIR` |
| `check-mcp-mutation-class.sh` | the repository root as its first argument |
| `parent-skill-check.cjs` | `PARENT_HUB_CHECK_COMMANDS_DIR` for the commands tree. `PARENT_HUB_CHECK_STRICT=0` reports advisory findings as warnings, and hard invariants still fail |
| `skill-graph-freshness.cjs` | `SKILL_GRAPH_FRESHNESS_ROOT`, `SYSTEM_SKILL_ADVISOR_DB_DIR` |

---

## 8. RELATED

- [Doctor route manifest](../_routes.yaml)
- [Doctor command routers](../)
- [Doctor assets](../assets/)
- [Doctor script tests](./tests/README.md)
- [Commands directory](../../)
