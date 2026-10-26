---
title: Repository Quality Config
description: The schema, discovery order, merge rule, error codes, trust boundary and known limits of the committed .sk-code/quality.json file that names a repository's own quality checks.
trigger_phrases:
  - "sk-code quality config"
  - ".sk-code/quality.json"
  - "configured quality checks"
  - "skcode.qualityConfig"
importance_tier: normal
contextType: implementation
version: 1.0.4.0
---

# Repository Quality Config

## 1. OVERVIEW

A repository names its own quality checks in one committed file, `.sk-code/quality.json`. The quality runner reads it on every run, and `/doctor:sk-code quality` shows, checks and creates it. Both read it through `scripts/lib/quality-config.cjs`, so they never disagree about what the file says. The file tightens the author gate only. The CI job and the pre-commit hook keep the core hygiene set at whole-file scope, so a ticket prefix the file adds can fail locally and pass on push.

---

## 2. DISCOVERY

The runner picks exactly one source, the most explicit first.

1. `--config <path>`, read relative to the working directory.
2. The git config value `skcode.qualityConfig`, read relative to the repository root. Only a value stored in a config file counts. A value set with `git -c` or a `GIT_CONFIG_*` variable reports scope `command` and is ignored, because one invocation must not swap the commands a repository committed. When several files set it, the last value git reads wins. Discovery follows an include, and trust reads only this repository's own `.git/config` with no include, so a value an include supplies can name the config a run reads and still never make that config trusted.
3. `.sk-code/quality.json` at the repository root.
4. None. The runner uses the shipped base layer alone and fills `suggested_checks`.

`config.source` names the choice: `cli`, `git-config`, `repo` or `none`. `config.path` prints the file relative to the root, or absolute outside it, and `config.bytes` gives its size.

- **A named path that does not exist** exits 3 with `CONFIG_PATH_MISSING` and names the path. The runner never falls back to the next source, because a named path that points nowhere is a broken install, not an opt-out.
- **The committed file must be the repository's own.** When `.sk-code/quality.json` resolves outside the repository, for example through a linked `.sk-code` folder, the run exits 3 with `CONFIG_INVALID`. A path named with `--config` or `skcode.qualityConfig` may point anywhere, because an operator chose it.
- **Cost.** Discovery and validation start one process, the `git config` read, and none outside git.

---

## 3. SCHEMA

`schemaVersion` must be `1`. An unknown key at any level is a config error.

```json
{
  "schemaVersion": 1,
  "exclude": ["vendor/**"],
  "checks": [
    {"id": "typecheck", "argv": ["npm", "run", "typecheck"], "languages": ["typescript"], "cwd": "package",
     "requires": "npm", "severity": "P0", "timeoutSec": 300},
    {"id": "ruff", "argv": ["ruff", "check", "{files}"], "languages": ["python"], "severity": "P1"},
    {"id": "actionlint", "argv": ["actionlint", "{files}"], "paths": [".github/workflows/**"], "severity": "P1"}
  ],
  "checklists": [{"file": ".sk-code/checklists/web.md", "paths": ["src/**"]}],
  "generated": [{"paths": ["dist/**"], "argv": ["npm", "run", "build:check"], "severity": "P1"}],
  "commentHygiene": {"ticketPrefixes": ["JIRA"], "extraPatterns": [], "extensions": {".zig": "c"}, "exclude": ["fixtures/**"]},
  "sensors": {"secrets": {"exclude": ["test/fixtures/**"]}, "debugLeftovers": {"enabled": false}}
}
```

| Field | Rule |
| --- | --- |
| `exclude` | Repository-relative globs added to the built-in excludes, `**/node_modules/**`, `**/dist/**` and `**/.git/**` |
| `checks[].id` | Required. Lowercase letters, digits and hyphens. It must not repeat another check id or name a built-in check |
| `checks[].argv` | Required. A list of strings, one per argument, because no shell reads it. `{files}` must be a whole argument, and it cannot be the program. A relative `argv[0]` that holds a slash resolves from the repository root, whatever `cwd` says |
| `checks[].languages` | Language ids from `assets/comment-syntax.json`. A file matches when its language is one of them |
| `checks[].paths` | Repository-relative globs. With `languages`, a file must match both. With neither, the check matches every file the runner reads |
| `checks[].cwd` | `"."`, the default, or `"package"`, the nearest folder above each file that holds `package.json`, `pyproject.toml`, `Cargo.toml` or `go.mod`. A file with none above it runs at the root |
| `checks[].requires` | The program the check needs on PATH. It defaults to `argv[0]`. A value with a slash names a file read from the repository root |
| `checks[].severity` | Required. `P0`, `P1` or `P2` |
| `checks[].required` | Defaults to true for P0 and false for P1 and P2. An absent P1 tool is a visible warning, and an absent required tool makes the run UNVERIFIED |
| `checks[].timeoutSec` | The deadline for each run of the check, above zero. It defaults to `--timeout`, which defaults to 120 |
| `generated[]` | A command for generated output. `paths` and `argv` are required, `languages` is not accepted, `severity` defaults to P1 and `id` defaults to `generated-<n>`. Its paths match files the built-in excludes skip, such as `dist/` |
| `checklists[]` | `file` is repository-relative, or `hub:<hub>/<path>` to opt into a hub checklist, with no `..` segment. A row needs `paths`, `extensions` or `contentMarkers`, which combine with AND. `why` is optional |
| `commentHygiene.ticketPrefixes` | Each prefix starts with a letter and continues with up to 15 letters or digits. It becomes `\bPREFIX-[0-9][0-9A-Za-z]*\b` |
| `commentHygiene.extraPatterns` | Each pattern compiles and holds at most 200 characters. The checker compiles a pattern with Python's `re`, so a `\p` or `\P` property escape, a `\k<name>` backreference or a `(?<name>` group is a config error, and Python spells its named group `(?P<name>)` |
| `commentHygiene.extensions` | Maps an extension that starts with a dot to a family in `comment-syntax.json`. A mapped extension wins over the table, and a shebang wins over both, the checker's own order. A repository can only add an extension, so remapping one the shipped table already owns is a config error |
| `commentHygiene.exclude` | Globs whose files the hygiene call skips. Every other check still reads them |
| `sensors` | `conflictMarkers` and `secrets` accept `exclude` only. `debugLeftovers` also accepts `enabled` |

`assets/quality-config.template.json` holds every key with an empty value, and it passes the schema.

---

## 4. MERGE RULE

The shipped base layer, `assets/quality-defaults.json`, always loads first, and the repository layer merges over it field by field.

| Field | Rule |
| --- | --- |
| `checks` | Only the repository layer declares them. The base layer names no command |
| `checklists`, `generated` | Rows append. A base-layer `generated` row names paths for the dist checker, and a repository row carries its own command |
| `exclude` | Globs append |
| `commentHygiene` | Lists append to the checker's core patterns, which stay. A single line still opts out with `hygiene-ok` |
| `sensors` | Settings merge per sensor and `exclude` lists append. An exact sensor can be narrowed but never switched off, because its findings block, so `enabled` on `conflictMarkers` or `secrets` is a config error. A heuristic sensor may set `enabled: false` |

---

## 5. HOW A CONFIGURED CHECK RUNS

- **Matching.** A check reads the in-scope files the runner reads, binary files, large files and files with no comment family included, and never an excluded file, a folder or a dead link. A `generated` row also reads excluded files. A check that matches no file is `NOT_APPLICABLE` and never starts.
- **Order of states.** No match is `NOT_APPLICABLE`. Then `--only` and `--skip` give `SKIPPED_BY_FLAG`, an absent `requires` tool gives `SKIPPED_ABSENT` with a repair line, `--no-run` gives `LISTED` with each planned run, an untrusted config gives `SKIPPED_UNTRUSTED` with the trust repair line and a run outside git gives `ERROR` with code `GUARD_UNAVAILABLE`.
- **Runs.** `{files}` expands to the matching files relative to the run's `cwd`, and a name that starts with a dash is passed as `./name`. A check runs once per `cwd` group, with or without `{files}`. `runs[]` lists each run with its `cwd`, `argv`, `files`, `state`, `exit` and `duration_ms`. A run that times out or cannot start ends the check.
- **Process.** Each run is an argv array with no shell, no input and no `NODE_OPTIONS`, `NODE_COMPILE_CACHE`, `BASH_ENV` or `ENV`. It starts as the leader of its own process group, and the whole group is killed at the deadline and again when the leader exits, so a helper it forked cannot outlive it.
- **Workspace guard.** The built-in checks run in one guard window, then each configured check runs in its own window, chained from the one before. A changed snapshot ends the run with exit 3 and `CHECK_MUTATED_WORKSPACE`, names the check and the paths and reverts nothing. Every configured check after it reads `ERROR`, not run.
- **Gate.** A required P0 check in `RAN_FAIL` blocks the run. A check reports through its exit code alone, so the verdict carries no finding for it, and its repair line says to rerun the command to read what it printed. Any other state follows the runner contract.
- **Coverage.** A file a configured check ran on counts in `files_checked` and leaves `coverage.unchecked`.

---

## 6. SUGGESTIONS, NEVER RUN

With or without a config, the runner reads the manifests at the repository root and reports what they imply under `suggested_checks`. Each suggestion carries the exact `checks` entry that would enable it. A suggestion whose id or argv a configured check already holds is left out.

| Manifest | Suggested check |
| --- | --- |
| `package.json` scripts `typecheck`, `lint` or `format:check` | `npm run <script>` |
| `pyproject.toml` with `[tool.ruff]` or `[tool.mypy]` | `ruff check {files}` or `mypy {files}` |
| `Cargo.toml` | `cargo check`, then `cargo clippy`, with `cwd` set to `package` |
| `go.mod` | `go vet ./...`, with `cwd` set to `package` |
| `.github/workflows/*.yml` or `*.yaml` | `actionlint {files}` on the workflow paths |
| `Makefile`, `makefile` or `GNUmakefile` with a `lint:` target | `make lint` |

A script named `test`, `fix` or `format` is never suggested, and neither is a script whose text holds `--write` or `--fix`. Tests belong to verification, and fixers change files.

---

## 7. ERROR CODES

| Code | Where | Cause |
| --- | --- | --- |
| `CONFIG_PATH_MISSING` | `errors[]`, exit 3 | `--config` or `skcode.qualityConfig` names a path that does not exist |
| `CONFIG_INVALID` | `errors[]` and one `config.errors` row per field, exit 3 | A parse fault, an empty file, a wrong `schemaVersion`, an unknown key, a malformed field, a reused check id or a committed file that resolves outside the repository. These stop the run before a check starts. A `commentHygiene` value the checker refuses is a cause too, found once the run starts, and its row names the field that supplied the value |
| `CHECK_MUTATED_WORKSPACE` | `errors[]`, exit 3 | The workspace changed while a check ran. `check` and `paths` name what changed |
| `GUARD_UNAVAILABLE` | the check row's `code`, state `ERROR` | A configured check outside git, where no snapshot can show a change. A required one makes the run UNVERIFIED |
| `CONFIG_EXISTS` | the doctor's `init`, exit 1 | `.sk-code/quality.json` already exists, and init never overwrites it |

Each `config.errors` row holds `code`, `field`, `message` and `repair`.

---

## 8. TRUST BOUNDARY

1. Commands come only from the repository layer. The base layer, surface declarations and suggestions never supply one.
2. Every command is an argv array run without a shell, under its own deadline, as the leader of a process group the runner kills.
3. The workspace guard brackets every command and reverts nothing.
4. Nothing is installed. A missing tool gets a repair line and nothing else.
5. The doctor reads and probes the config. It never runs a configured command, and its only write is `init --apply`.
6. A configured check runs only from a trusted config. One of four rules makes it trusted. The operator names the file with `--config`. `skcode.qualityConfig` is stored in the repository's own `.git/config`, not through an include. `git config --local --bool skilled.trustRepoChecks` prints `true` in the repository under test. The repository under test shares its git common dir with the checkout that holds the runner. Otherwise a configured check that would start a command reads `SKIPPED_UNTRUSTED`, starts nothing and carries the repair line `git config --local skilled.trustRepoChecks true`. A required one leaves the run UNVERIFIED. `config.trust` names the state and the rule that decided it. Built-in checks are not affected, and `--no-run` still lists a configured check without starting it.

---

## 9. THE DOCTOR

`.skilled/commands/doctor/scripts/sk-code-quality-config.cjs` serves `/doctor:sk-code quality`. Each mode takes `--json` and ends with a `STATUS=` line.

| Mode | What it does |
| --- | --- |
| `status` | Reports the source and its errors, the config trust state (with the repair line when untrusted), probes each tool a check names as `PASS` (found) or `DEGRADED` (absent, with one repair line), lists a tool only a suggestion names as `SKIP` and reports the hygiene layers |
| `check` | Validates the discovered config, or the file `--config` names, and reports `config.errors` and the trust state with no tool probe |
| `init` | Prints the template filled with the suggestions, each written as `required: false`, and writes nothing. `--apply` writes a temporary file and hard-links it to `.sk-code/quality.json`, so it creates the file once and refuses with `CONFIG_EXISTS` when one exists. A `.sk-code` folder that resolves outside the repository is refused |

---

## 10. KNOWN LIMITS

- **Regular expression cost.** A pattern is capped at 200 characters and must compile, which bounds what a reviewer must read. It does not bound run time: a pattern with nested repetition can still slow the checker on a long comment line.
- **Two regex engines.** The config validator compiles each pattern as JavaScript, and the checker compiles it with Python's `re`. A pattern only Python accepts, such as `(?P<name>...)`, is a config error. The validator also refuses what Python rejects, a `\p` or `\P` property escape, a `\k<name>` backreference and a `(?<name>` group that is not a lookbehind, so the fault reads before a check starts. That list is not every JavaScript-only construct, so a value the checker still refuses once the run starts, when the repository config supplied it, ends the run with `CONFIG_INVALID`, exit 3 and one `config.errors` row naming the field, in place of an `ERROR` row and an `UNVERIFIED` run.
- **Windows.** The process-group kill is POSIX behavior. Configured checks on Windows are not specified, and their behavior there is UNKNOWN.
- **Argument length.** `{files}` passes every matching file of a group in one argv, so a very large change can pass the system's argument limit, and that run reads `ERROR`.
