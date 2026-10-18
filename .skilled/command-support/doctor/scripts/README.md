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

> Documents `.skilled/commands/doctor/scripts/`. This README was moved out of `.skilled/commands/`
> to `.skilled/command-support/doctor/scripts/` so OpenCode does not register it as a command.
>
> Diagnostic and validation entrypoints used by the doctor command family.

---

## 1. OVERVIEW AND PURPOSE

`.skilled/commands/doctor/scripts/` contains shell, JavaScript and Python tools that support doctor routes.

The scripts validate route manifests, inspect MCP installations, audit parent skill hubs, report graph freshness, and plan and apply framework release updates. Most are read-only. The release updater's apply and rollback paths write local state. Every script has a test under `tests/`, except `skill-graph-freshness.cjs`, whose freshness panel test lives in the skill advisor runtime. One runner executes them all.

---

## 2. DIRECTORY TREE

```text
.skilled/commands/doctor/scripts/
+-- agent-roster-mirror-check.cjs
+-- audit_descriptions.py
+-- command-catalog-mirror-check.cjs
+-- check-mcp-mutation-class.sh
+-- doctor-phrase-reach.cjs
+-- git-hook-gates.cjs
+-- git-setup-check.cjs
+-- git-standards.cjs
+-- mcp-doctor-lib.sh
+-- mcp-doctor.sh
+-- opencode-version-battery.cjs
+-- parent-skill-check.cjs
+-- route-validate.py
+-- route-validate.sh
+-- release-update.cjs
+-- sk-code-setup-check.cjs
+-- skill-graph-freshness.cjs
+-- tests/            # one suite per script, plus run-all.sh
|   `-- opencode-version-battery.test.cjs
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
| `sk-code-setup-check.cjs` | Runs the sk-code setup battery from a repository root: one verdict per setup leg, one repair command per failing leg, and no writes. |
| `audit_descriptions.py` | Audits description lengths across skills, commands and agents. |
| `agent-roster-mirror-check.cjs` | Verifies every canonical agent reaches all five runtime surfaces, and that mirror surfaces stay symlinked rather than forked. |
| `git-hook-gates.cjs` | Lists the shipped hook gates from `scripts/git-hooks/lib/gates.tsv` with their saved `speckit.hooks.<key>` values, and sets or unsets one in local or global git config for `/doctor:git hooks`. Refuses the per-push approvals. |
| `git-standards.cjs` | Shows where a repository's commit, PR and branch rules come from, copies the shipped sk-git templates into `.sk-git/`, and changes a rules block setting or removes a kind's rules section in those copies for `/doctor:git standards`, re-validating each change with sk-git's own contract check. |
| `git-setup-check.cjs` | Runs the read-only sk-git setup battery for `/doctor:git setup`: eleven checks, each PASS, FAIL, SKIP, UNKNOWN or DEGRADED with the source it read and one repair per failure. It exits 0 when every check passes or skips, 3 when a check is UNKNOWN or a gate is saved off, 1 on any failure and 2 on a usage error. It loads every helper from its own install root and never runs code from the repository it inspects. |
| `command-catalog-mirror-check.cjs` | Compares every command catalog and hub metadata entry back to the command's own frontmatter, which is the one copy nothing else derives from. Structural drift fails. Prose divergence reports and fails only under `--strict`. |
| `doctor-phrase-reach.cjs` | Scores every activated doctor phrase and each runnable doctor command through the built advisor scorer, then keeps the three results the hooks show. It fails when a phrase reaches neither the top pick nor the second line. It also fails if a runnable command does not rank first or an activated phrase has fewer than three words. It exits 2 when the advisor build is missing or stale. |
| `opencode-version-battery.cjs` | Checks this repository's OpenCode plugins on OpenCode 1 and 2. On 1 it proves plugin discovery through `debug config` and plugin load through an import harness. On 2 it starts and stops a private server with the v2 binary it selected (`$OPENCODE_BIN`, `opencode` or `opencode2`, whichever reports a v2 version) and reads plugin and skill state from it. It exits 0 when every requested leg passes, 1 on a failed leg, 2 on a usage error, a crash or an `--out` file it cannot write and 3 when a leg is degraded or skipped. |

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
| `node .skilled/commands/doctor/scripts/git-hook-gates.cjs list` | Show every hook gate and its saved setting. |
| `node .skilled/commands/doctor/scripts/git-standards.cjs status` | Show which commit, PR and branch rules are enforced, and from where. |
| `node .skilled/commands/doctor/scripts/git-setup-check.cjs` | Check which sk-git hooks, rules and settings are live in this repository. |
| `node .skilled/commands/doctor/scripts/opencode-version-battery.cjs` | Check this repository's OpenCode plugins on OpenCode 1 and 2. |
| `node .skilled/commands/doctor/scripts/opencode-version-battery.cjs --family=v1\|v2\|both` | Choose the family to check. The default is `both`. |
| `node .skilled/commands/doctor/scripts/opencode-version-battery.cjs --json` | Print the JSON summary on stdout instead of the human lines. |
| `node .skilled/commands/doctor/scripts/opencode-version-battery.cjs --root <dir> --out <file>` | Inspect another repository root and write the JSON summary to the named file. |

The battery runs five legs:

- `family-present`: PASS when a candidate's `--version` succeeds and parses to that family.
- `plugin-discovered`: PASS when OpenCode 1's `debug config` exits 0 with parseable JSON, the plugin folder holds at least one top-level `.js` file, none is a broken symlink and every one is listed.
- `plugin-load`: PASS when the import harness exits 0 and reports every top-level `.js` file loaded.
- `plugin-active`: PASS when two consecutive reads give the same non-zero count and, on that read, every top-level `.js` file has an entry under the inspected root with status active.
- `skill-visible`: PASS when the skill listing parses and has an entry that mentions the inspected root.

A family that is not installed is SKIP, never FAIL.

On this repository all legs pass on OpenCode 1.19.3 and 2.0.32. OpenCode 1.19.3 cuts piped stdout at 65,536 bytes, which is why the collectors read stdout from files.

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

| `git-hook-gates.cjs` | `list` is read-only. `set` is a dry run until `--apply`, which writes only `speckit.hooks.<key>` in local or global git config. |
| `git-standards.cjs` | `status` and `check` are read-only. `init`, `set` and `disable` are dry runs until `--apply`, which writes only `.sk-git/` or the `skgit.contractDir` directory, never the shipped sk-git templates. |
| `git-setup-check.cjs` | Read-only. It writes no file and no git config value, and calls no allocator or `--apply` mode. |
| `opencode-version-battery.cjs` | The battery itself writes only the `--out` file and temporary folders it removes when each step ends. The private server's folder is also removed on `SIGINT` and `SIGTERM`, and the server is stopped. The import harness runs each plugin's v1 factory in a child process rooted at the repository, so anything a plugin does when it loads happens during the check. It never touches the shared v2 service and never prints the private server's password. OpenCode 1 writes into a temporary data folder, not the user's. |

Do not invoke a mutating path from a route classified as read-only.

---

## 7. VALIDATION AND INSTRUCTIONS

Run every doctor test from the repository root. CI runs the same command in the `doctor-scripts` job of `.github/workflows/spec-kit-check.yml`:

```bash
bash .skilled/commands/doctor/scripts/tests/run-all.sh
```

The runner needs `node`, `python3` with PyYAML, and the advisor runtime's dependencies (`npm --prefix .skilled/skills/system-skill-advisor/runtime ci`). It exits `0` when every suite passes, `1` when one fails and `2` when a required tool is missing. `tests/README.md` lists the suites.

Each script can be pointed at a fixture tree, which is how the tests run without touching the repository:

| Script | Override |
|---|---|
| `agent-roster-mirror-check.cjs`, `command-catalog-mirror-check.cjs`, `mcp-doctor.sh`, `release-update.cjs` | `--root <dir>` |
| `git-hook-gates.cjs`, `git-standards.cjs`, `git-setup-check.cjs` | `--repo <dir>`. `git-hook-gates.cjs` also reads `GATE_REGISTRY`, and `git-setup-check.cjs` also takes `--tool <name>` |
| `audit_descriptions.py`, `route-validate.sh` | `--repo-root <dir>`. `route-validate.sh` also reads `REPO_ROOT`, `ROUTES_FILE`, `DOCTOR_DIR` and `ASSETS_DIR` |
| `check-mcp-mutation-class.sh` | the repository root as its first argument |
| `parent-skill-check.cjs` | `PARENT_HUB_CHECK_COMMANDS_DIR` for the commands tree. `PARENT_HUB_CHECK_STRICT=0` reports advisory findings as warnings, and hard invariants still fail |
| `skill-graph-freshness.cjs` | `SKILL_GRAPH_FRESHNESS_ROOT`, `SYSTEM_SKILL_ADVISOR_DB_DIR` |

---

## 8. RELATED

- [Doctor route manifest](../../../commands/doctor/_routes.yaml)
- [Doctor command routers](../../../commands/doctor/)
- [Doctor assets](../../../commands/doctor/assets/)
- [Doctor script tests](./tests/README.md)
- [Commands directory](../../../commands/)
