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

> Documents `.skilled/commands/doctor/scripts/`. This README uses the `.markdown` extension because
> OpenCode registers every `.md` file under `.skilled/commands/` as a command.
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
+-- ci-report.cjs
+-- ci-scaffold.cjs
+-- ci-toggle.cjs
+-- doctor-phrase-reach.cjs
+-- git-hook-gates.cjs
+-- git-setup-check.cjs
+-- git-standards.cjs
+-- mcp-doctor-lib.sh
+-- mcp-doctor.sh
+-- opencode-version-battery.cjs
+-- orphan-process-check.cjs
+-- parent-skill-check.cjs
+-- route-validate.py
+-- route-validate.sh
+-- release-update.cjs
+-- sk-code-quality-config.cjs
+-- sk-code-setup-check.cjs
+-- skill-graph-freshness.cjs
+-- lib/
|   +-- ci-profile.cjs             # the repository CI profile loader the report, scaffold and toggle scripts share
|   +-- ci-report-render.cjs       # the report document, its JSON form and its fixed-width table
|   +-- ci-report-sources.cjs      # repository variables, the branch runs come from and the newest non-rebuild commit
|   +-- ci-report-text.cjs         # the one-line rule a gh failure and a YAML parse error both need
|   +-- ci-report-workflows.cjs    # workflow discovery, the YAML parse, switch states and drift flags
|   +-- quality-applied-rules.cjs  # the checklists and override rows the gate would apply, asked through --explain
|   +-- quality-config-init.cjs    # the one mode that writes, from the shipped template with --apply
|   +-- quality-config-source.cjs  # the config source, its trust state and the hygiene rules it switches off
|   +-- quality-report-view.cjs    # the read-only status and check modes
|   +-- quality-script-io.cjs      # the request error and the one place a report reaches stdout
|   `-- quality-skill-paths.cjs    # the one sk-code quality folder and the handles every mode reads
+-- tests/            # one suite per script, plus run-all.sh
|   `-- opencode-version-battery.test.cjs
`-- README.markdown
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
| `sk-code-setup-check.cjs` | Runs the sk-code setup battery from a repository root: one verdict per setup leg, one repair command per failing leg and no writes. Its quality leg runs the quality runner's own tests, which build throwaway repositories under the OS temp folder and remove them. |
| `sk-code-quality-config.cjs` | The quality config doctor's entry, kept thin: the arguments, the run context, the one call that starts the runner, the mode table and the exit status are here, and each mode sits in the quality modules under `lib/`. It reports which quality config the sk-code quality gate reads, whether each tool it names is on PATH, and the trust state the runner applies to that config: `trusted`, `untrusted` or `none`. `status` and `check` both print it, and when the config is untrusted they print `git config --local skilled.trustRepoChecks true` as the repair. It prints the hygiene layers, a `Hygiene:` line naming the core rules `commentHygiene.disableRules` switches off and an applied-rules block built by calling `quality-gate.cjs --explain` over a sample of one file per first three folders and extension: each checklist with its seat, its override rows or the reasons its section was refused, each same-level conflict and a `Hygiene rules:` line for the rules in force. A refused section, an unknown rule id or a missing checklist fails the status with `CONFIG_INVALID` or `CHECKLIST_MISSING`, and a conflict is listed without failing it. It validates that config and creates `.skilled/skills/sk-code/sk-code-quality/repository/quality.json` once from the shipped template for `/doctor:sk-code quality`, and in a repository with no `specs/` folder its plan suggests the spec-kit hygiene rules without writing them. It never runs a command the config names. It exits 0 on success, 1 on an invalid or missing config, a refused checklist section or a refused init and 2 on a usage error or outside a git repository. |
| `audit_descriptions.py` | Audits description lengths across skills, commands and agents. |
| `agent-roster-mirror-check.cjs` | Verifies every canonical agent reaches all five runtime surfaces, and that mirror surfaces stay symlinked rather than forked. |
| `git-hook-gates.cjs` | Lists the shipped hook gates from `scripts/git-hooks/lib/gates.tsv` with their saved `speckit.hooks.<key>` values, and sets or unsets one in local or global git config for `/doctor:git hooks`. Refuses the per-push approvals. |
| `git-standards.cjs` | Shows where a repository's commit, PR and branch rules come from, copies the shipped sk-git templates into `.sk-git/`, and changes a rules block setting or removes a kind's rules section in those copies for `/doctor:git standards`, re-validating each change with sk-git's own contract check. |
| `git-setup-check.cjs` | Runs the read-only sk-git setup battery for `/doctor:git setup`: eleven checks, each PASS, FAIL, SKIP, UNKNOWN or DEGRADED with the source it read and one repair per failure. It exits 0 when every check passes or skips, 3 when none failed but a check is UNKNOWN or DEGRADED, 1 on any failure and 2 on a usage error. It loads every helper from its own install root and never runs code from the repository it inspects. |
| `command-catalog-mirror-check.cjs` | Compares every command catalog and hub metadata entry back to the command's own frontmatter, which is the one copy nothing else derives from. Structural drift fails. Prose divergence reports and fails only under `--strict`. |
| `doctor-phrase-reach.cjs` | Scores every activated doctor phrase and each runnable doctor command through the built advisor scorer, then keeps the three results the hooks show. It fails when a phrase reaches neither the top pick nor the second line. It also fails if a runnable command does not rank first or an activated phrase has fewer than three words. It exits 2 when the advisor build is missing or stale. |
| `opencode-version-battery.cjs` | Checks this repository's OpenCode plugins on OpenCode 1 and 2. On 1 it proves plugin discovery through `debug config` and plugin load through an import check. On 2 it starts and stops a private server with the v2 binary it selected (`$OPENCODE_BIN`, `opencode` or `opencode2`, whichever reports a v2 version) and reads plugin and skill state from it. It exits 0 when every requested leg passes, 1 on a failed leg, 2 on a usage error, a crash or an `--out` file it cannot write and 3 when a leg is degraded or skipped. |
| `ci-report.cjs` | The `/doctor:ci report` entry, kept thin: the flags, the exit codes and every name `/doctor:ci toggle` reads live here, and the readings live in the `ci-report` modules under `lib/`. It reads every workflow under `.github/workflows/` and reports its switch state, triggers, path filters and drift flags for `/doctor:ci report`. A switch is any variable a job's `if:` compares against `off`, so the workflow file is its only copy, and a repository variable value is reduced to a state and never printed. The branch, the required switch, the exempt files, the README and the rebuild trailer come from the CI profile, and the JSON names the profile it read. It exits 0 on a printed report, 1 when a workflow fails to parse, 2 on a bad argument and 3 when the CI profile is missing or invalid. |
| `ci-scaffold.cjs` | Renders the sk-code-ci workflow or job template from the CI profile for `/doctor:ci scaffold`, and with `--protected` prints the profile's protected workflow names. It writes nothing. |
| `ci-toggle.cjs` | Plans one switch change for `/doctor:ci toggle`: the allowlist, the refusals from the live ruleset, `neverOff` and the README, the no-op check, the exact `gh variable` command and the second named confirmation for a protected workflow. It never changes a variable. |
| `lib/ci-profile.cjs` | Finds, validates and normalizes the repository CI profile (`--profile`, then `git config skcode.ciProfile`, then `.skilled/skills/sk-code/sk-code-ci/repository/ci.json`, then a generic default that forces nothing), rejecting an unknown key. A profile whose `repository` field names another repository is ignored, and one left at `.sk-code/ci.json` is refused. |
| `lib/ci-report-sources.cjs` | Reads what the report takes from outside the workflow files: the repository variables through `gh variable list`, the branch the repository integrates on and the newest commit on that branch that is not a trigger-index rebuild. Arguments go in as an array and never through a shell, a variable value is reduced to a state and never printed, and a read that fails is reported as unknown with its reason. |
| `lib/ci-report-workflows.cjs` | Reads the workflow files themselves: discovery under `.github/workflows/`, the YAML parse, the switch state per job, the drift flags, the purpose column read from the workflows README and the switch names the report lists. A switch is recognized by its shape, so any repository's switch names are read and none is assumed. |
| `lib/ci-report-render.cjs` | Builds the report document and its two renderings, the JSON a machine reads and the fixed-width table a person reads, both from the same readings. The not-checked list travels with the document, so a clean row is never read as a pass for a rule no parser checks. |
| `lib/ci-report-text.cjs` | `firstLine()`, the one-line rule a `gh` failure and a YAML parse error both need, because a whole message would break the table row, the JSON field and the stderr line that carry it. |
| `lib/quality-skill-paths.cjs` | The one sk-code quality folder this doctor reads, and the handles inside it that answer every mode's question. Each path resolves from the file's own location, so the doctor works from a checkout anywhere, and the runner, the config reader and the helpers load here so every mode reads one skill folder, one config schema and the one runner the gate itself starts. |
| `lib/quality-script-io.cjs` | The two ways the quality doctor answers whoever started it: the typed request failure that carries the exit code and the `STATUS=` error code a route reads, and `emit()`, the single place a report reaches stdout. One function writes the last line, so a route reads one whatever the mode. |
| `lib/quality-config-source.cjs` | Which repository config a mode read, whether the runner trusts it and which core hygiene rules it switches off, every answer read through the module the gate itself reads so a doctor verdict and a gate verdict cannot drift. It also builds the suggestion an init prints for a repository with no `specs/` folder. |
| `lib/quality-config-init.cjs` | The one mode that can write: it shows the config it would create from the shipped template and writes it only with `--apply`, through a hard link from a temporary file, so it never replaces a config that already exists. An existing config is refused rather than merged. |
| `lib/quality-report-view.cjs` | The two read-only modes. `status` reports the config, its trust, the tools it names, the hygiene layers and what the gate would apply here, and `check` stops at the config itself. Both render the lines a route prints and the document `--json` carries from one set of readings, and neither starts a configured check. |
| `lib/quality-applied-rules.cjs` | Which checklists and hygiene rules the gate would apply to a repository and which override rows inside them it would honour, asked of the runner itself through `--explain` over a sampled file per folder group and extension, so the doctor keeps no second copy of checklist discovery or of the override grammar. |
| `orphan-process-check.cjs` | Lists the helper processes and model servers this user started that were reparented to init and are older than a minimum age (60 minutes by default), classifying each as a node test, vitest, tail monitor, grep search, executor worker, session-relaunch test helper, model server or git-live-follow, and reports each one's age and memory with a total. `--reap` sends `SIGTERM` after re-checking each process's identity, `--yes` confirms it, and `--json` and `--summary` print machine-readable and one-line forms. It exits 0 on a printed report, 1 on an unexpected error and 2 on a bad argument. |

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
| `node .skilled/commands/doctor/scripts/sk-code-quality-config.cjs status` | Show which quality config the gate reads, whether each tool it names is on PATH, the trust state the runner applies to that config, the hygiene rules it switches off and the checklists and override rows the gate would apply. |
| `node .skilled/commands/doctor/scripts/opencode-version-battery.cjs` | Check this repository's OpenCode plugins on OpenCode 1 and 2. |
| `node .skilled/commands/doctor/scripts/opencode-version-battery.cjs --family=v1\|v2\|both` | Choose the family to check. The default is `both`. |
| `node .skilled/commands/doctor/scripts/opencode-version-battery.cjs --json` | Print the JSON summary on stdout instead of the human lines. |
| `node .skilled/commands/doctor/scripts/opencode-version-battery.cjs --root <dir> --out <file>` | Inspect another repository root and write the JSON summary to the named file. |

The battery runs five legs:

- `family-present`: PASS when a candidate's `--version` succeeds and parses to that family.
- `plugin-discovered`: PASS when OpenCode 1's `debug config` exits 0 with parseable JSON, the plugin folder holds at least one top-level `.js` file, none is a broken symlink and every one is listed.
- `plugin-load`: PASS when the import check exits 0 and reports every top-level `.js` file loaded.
- `plugin-active`: PASS when two consecutive reads give the same non-zero count and, on that read, every top-level `.js` file has an entry under the inspected root with status active.
- `skill-visible`: PASS when the skill listing parses and has an entry that mentions the inspected root.
- `command-listed`: PASS when every `.md` file under the project's `.opencode/commands/` folder (or its singular `command/` form) is listed and every listed name comes from a folder the runtime reads (the global config folders, and on OpenCode 2 every ancestor `.opencode` folder plus the built-ins `init` and `review`). On OpenCode 2 a `<server>:<prompt>` name also passes when `<server>` is an MCP server in the config sources the private server reports, and a PASS notes `mcp prompts: <n>`. When the config sources did not parse, a `<server>:<prompt>` name in no command folder degrades the leg instead of reading as a stray, because the server list cannot be judged. A listed name that a non-command file in the project's command folder could produce also fails, even when a global or inherited folder holds a command of that name: any file not ending in `.md`, such as `README.markdown`, `.txt` or `.yaml`, counts under its relative path both with and without its extension. The two OpenCode 2 built-ins `init` and `review` and a `<server>:<prompt>` name from a configured MCP server are exempt, because the rule catches an OpenCode version that starts scanning more than `*.md`. A name that a `.md` command in the same folder already owns is left out, because the command answers to that name.

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
| `sk-code-quality-config.cjs` | `status` and `check` are read-only; `status` starts the runner's `--explain` once per batch of up to 500 sampled paths and no configured check. `init` is a dry run until `--apply`, which creates only `.skilled/skills/sk-code/sk-code-quality/repository/quality.json` and refuses with `CONFIG_EXISTS` when that file exists. |
| `opencode-version-battery.cjs` | The battery itself writes only the `--out` file and temporary folders it removes when each step ends. The private server's folder is also removed on `SIGINT` and `SIGTERM`, and the server is stopped. The import check runs each plugin's v1 factory in a child process rooted at the repository, so anything a plugin does when it loads happens during the check. It never touches the shared v2 service and never prints the private server's password. OpenCode 1 writes into a temporary data folder, not the user's. |

Do not invoke a mutating path from a route classified as read-only.

---

## 7. VALIDATION AND INSTRUCTIONS

Run every doctor test from the repository root. CI runs the same command in the `doctor-scripts` job of `.github/workflows/spec-kit-check.yml`:

```bash
bash .skilled/commands/doctor/scripts/tests/run-all.sh
```

The runner needs `node`, `python3` with PyYAML, and the advisor runtime's dependencies (`npm --prefix .skilled/skills/system-skill-advisor/runtime ci`). It exits `0` when every suite passes, `1` when one fails and `2` when a required tool is missing. `tests/README.markdown` lists the suites.

Each script can be pointed at a fixture tree, which is how the tests run without touching the repository:

| Script | Override |
|---|---|
| `agent-roster-mirror-check.cjs`, `command-catalog-mirror-check.cjs`, `mcp-doctor.sh`, `release-update.cjs` | `--root <dir>` |
| `git-hook-gates.cjs`, `git-standards.cjs`, `git-setup-check.cjs`, `sk-code-quality-config.cjs` | `--repo <dir>`. `git-hook-gates.cjs` also reads `GATE_REGISTRY`, and `git-setup-check.cjs` also takes `--tool <name>` |
| `audit_descriptions.py`, `route-validate.sh` | `--repo-root <dir>`. `route-validate.sh` also reads `REPO_ROOT`, `ROUTES_FILE`, `DOCTOR_DIR` and `ASSETS_DIR` |
| `check-mcp-mutation-class.sh` | the repository root as its first argument |
| `parent-skill-check.cjs` | `PARENT_HUB_CHECK_COMMANDS_DIR` for the commands tree. `PARENT_HUB_CHECK_STRICT=0` reports advisory findings as warnings, and hard invariants still fail |
| `skill-graph-freshness.cjs` | `SKILL_GRAPH_FRESHNESS_ROOT`, `SYSTEM_SKILL_ADVISOR_DB_DIR` |

---

## 8. RELATED

- [Doctor route manifest](../../../commands/doctor/_routes.yaml)
- [Doctor command routers](../../../commands/doctor/)
- [Doctor assets](../../../commands/doctor/assets/)
- [Doctor script tests](./tests/README.markdown)
- [Commands directory](../../../commands/)
