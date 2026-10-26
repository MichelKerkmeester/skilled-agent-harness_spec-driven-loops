---
title: Quality Runner Contract
description: The CLI, gate values, check states, verdict and envelope grammar, rule ids, reader rules, checker input fields and dist adapter of the sk-code quality runner.
trigger_phrases:
  - "quality runner contract"
  - "quality-gate.cjs verdict"
  - "code-quality-run/v1"
  - "quality gate exit codes"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Quality Runner Contract

`scripts/quality-gate.cjs` prints one verdict for one change in any repository. It runs built-in checks only, writes no file, never runs a command a repository names and never prints a secret value. No field and no exit code means pass. Exit 0 says only that no blocker was found and that every required check produced evidence. The acting agent still owns every item in `judgment_required`.

---

## 1. OVERVIEW AND CLI

```text
node .skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs [scope] [options]
```

Scope takes one of four flags. Two scope flags in one call are a usage error.

| Flag | Scope |
| --- | --- |
| `--worktree` | The default. Tracked changes against `HEAD`, or against the empty tree before the first commit, plus every untracked file that is not ignored |
| `--base <ref>` | Changes from the merge base of `<ref>` and `HEAD` to the working tree, plus untracked files. No merge base exits 3 with `BASE_NOT_FOUND` |
| `--files <path>...` | The named files only. A path after `--` may start with two dashes. Outside git this is the only scope that runs |
| `--explain <path>` | Prints `code-quality-explain/v1` for one file and exits 2. It runs nothing |

| Option | Effect |
| --- | --- |
| `--lines changed` | The default. Changed lines come from the new side of `git diff -U0` |
| `--lines file` | Every line of every in-scope file counts as changed |
| `--only <ids>` | Comma-separated check ids. Every other check reads `SKIPPED_BY_FLAG` |
| `--skip <ids>` | Comma-separated check ids that read `SKIPPED_BY_FLAG` |
| `--no-run` | Every spawning check reads `LISTED` with its argv. In-process checks still run |
| `--timeout <seconds>` | A deadline for each spawned process. The default is 120. A value under one millisecond rounds up to one millisecond, never down to no deadline |
| `--format json\|text\|envelope` | The default is `json`. `--explain` takes `json` only |
| `--config <path>` | Rejected with `USAGE` and exit 3, because this runner reads no repository config |

An unknown flag, an unknown check id, a missing value or a timeout of zero or less is a `USAGE` error with exit 3.

Every line of an untracked file counts as changed. So does every line of a file outside git, a file below a symlinked folder and an ignored file named with `--files`. A named file must be an existing regular file inside the repository root, or inside the working directory outside git. Otherwise the run exits 3 with `FILE_NOT_FOUND` or `FILE_OUTSIDE_ROOT`.

Git runs with `GIT_OPTIONAL_LOCKS=0`, `core.fsmonitor=false` and `GIT_LITERAL_PATHSPECS=1`, so it refreshes no index, starts no monitor and never reads a file name as a glob. Every spawned tool is an argv array with no shell, and it runs without `NODE_OPTIONS`, `NODE_COMPILE_CACHE`, `BASH_ENV` and `ENV`.

`SK_CODE_QUALITY_HUB_ROOT` is for tests. It points the declarations at another hub folder that holds a `mode-registry.json`. The checkers always come from the hub that holds the runner.

---

## 2. EXIT CODES AND STATES

| Gate | Exit | Meaning |
| --- | --- | --- |
| `NO_BLOCKER_FOUND` | 0 | No blocking finding, and every required check produced evidence |
| `BLOCKED` | 1 | At least one blocking finding |
| `NOTHING_CHECKED` | 2 | No check read any file as code. A file that only the sensors scanned, such as a Markdown file, stays unchecked. Never read it as clean |
| `ERROR` | 3 | The run could not finish honestly. `errors[]` names why |
| `UNVERIFIED` | 4 | A required check produced no evidence. `summary.unverified` names it |

Precedence runs `ERROR`, then `BLOCKED`, then `UNVERIFIED`, then `NOTHING_CHECKED`, then `NO_BLOCKER_FOUND`. A blocker and an unverified check in one run exit 1.

| Check state | Meaning | Unverified when required |
| --- | --- | --- |
| `NOT_APPLICABLE` | No in-scope file is the check's kind | No |
| `RAN_CLEAN` | It ran and found nothing | No |
| `RAN_FAIL` | It ran and reported findings | No |
| `SKIPPED_ABSENT` | Its tool is missing. `repair` names what to install | Yes |
| `SKIPPED_BY_FLAG` | `--only`, `--skip` or a hook switch turned it off | Yes |
| `TIMEOUT` | It passed its deadline and was killed | Yes |
| `ERROR` | It failed or printed output the runner cannot read | Yes |
| `LISTED` | `--no-run` listed it without running it | Yes |

| Check id | Severity | Required | What runs |
| --- | --- | --- | --- |
| `comment-hygiene` | P0 | yes | One `python3 -B -I check-comment-hygiene.sh --json` call over every file with a comment family |
| `conflict-markers` | P0 | yes | In process, on every readable text file, a file with no comment family included |
| `secrets` | P0 | yes | In process, on every readable text file, a file with no comment family included |
| `debug-leftovers` | P1 | no | In process, on the changed lines of checked files only, because a debugger line in a Markdown or text file is an example |
| `syntax-json` | P0 | yes | `JSON.parse` in process. `tsconfig*.json`, `jsconfig*.json`, `devcontainer.json`, `.devcontainer.json`, `.eslintrc.json`, `.vscode/*.json` and `.jsonc` lose comments and trailing commas first. Any other `.json` file that parses only once they leave gets a heuristic finding |
| `syntax-cjs` | P0 | yes | `vm.compileFunction` in process, which compiles and never runs |
| `syntax-node` | P0 | yes | `node --check` per file. Exact for `.mjs`, heuristic for `.js` |
| `syntax-python` | P0 | yes | One `python3 -B -I` process running `ast.parse` |
| `syntax-shell` | P0 | yes | `bash -n` per file with a bash or sh shebang, or a `.sh` or `.bash` name and no shebang |
| `syntax-yaml` | P0 | no | The same python3 process, through PyYAML `compose_all`, when it imports |
| `syntax-toml` | P0 | no | The same python3 process, through `tomllib`, when it imports |
| `dist-staleness` | P1 | no | The dist adapter in section 8 |

| Layer state | Meaning |
| --- | --- |
| `present` | The layer exists and would run the hygiene checker |
| `absent` | Nothing names the checker for this layer |
| `untrusted` | A pre-commit hook names it, but its trust gate would skip this repository |
| `broken` | The layer names the checker or adapter but cannot run it |
| `unknown` | The probe could not read what it needed |

The pre-commit probe reads the hook folder git resolves. A hook that names `check-comment-hygiene.sh` and is executable is present. When the hook carries the `skilled.trustRepoHooks` gate, a hook from another repository is untrusted unless this repository sets that key to true. The CI probe reads `.github/workflows/*.yml` and `*.yaml`. The post-edit probe reads `.claude/settings.json`, `.codex/hooks.json`, `.cursor/hooks.json` and `.devin/hooks.v1.json`, and a named adapter path missing from the repository is broken.

| Error code | Cause |
| --- | --- |
| `USAGE` | A flag the CLI section does not accept |
| `NO_GIT_REPOSITORY` | No git repository and no `--files` |
| `FILE_NOT_FOUND`, `FILE_OUTSIDE_ROOT` | A named file that is missing, not regular or outside the root |
| `BASE_NOT_FOUND`, `GIT_FAILED` | A ref with no merge base, or a git call that failed |
| `HUB_ROOT_INVALID`, `TABLE_UNREADABLE`, `DEFAULTS_INVALID` | The override, `comment-syntax.json` or `quality-defaults.json` cannot be read |
| `CHECKLIST_MISSING` | A matched declaration names a checklist file that does not exist. It is reported in `config.errors` |
| `CHECK_MUTATED_WORKSPACE`, `GUARD_FAILED` | The workspace changed while the spawned checks ran, or the guard could not take its snapshot. The guard takes one snapshot before the first spawned check and one after the last, so `check` names every check that ran between them. Nothing is reverted |
| `INTERNAL_ERROR` | A fault in the runner. The message prints, and no stack trace does |

---

## 3. VERDICT SCHEMA

`--format json` prints one `code-quality-run/v1` document.

| Field | Content |
| --- | --- |
| `schema`, `status` | `code-quality-run/v1` and `advisory`. `status` never holds another value |
| `gate`, `exit_code` | One gate from section 2 and its exit code |
| `scope` | `mode`, `base`, `merge_base`, `lines` and `files`, the repository-relative paths in scope |
| `config` | `source` is `defaults`, `path` names `quality-defaults.json`, and `errors` holds checklist faults |
| `resolved_surface` | Every surface label any file resolved to, in detection order, or `["unknown"]` |
| `surfaces` | One `{file, labels}` row per file that is not excluded. A file with no surface reads `["UNKNOWN"]` |
| `layers` | `pre_commit_hygiene`, `ci_hygiene` and `post_edit`, each one layer state |
| `checklists` | One `{file, path, why, files}` row per checklist to load, the floor first |
| `checks` | One row per check id, in section 2 order |
| `findings` | Every finding, sorted by file and line |
| `suggested_checks` | Always empty in this release |
| `judgment_required` | The items no check can decide, which the agent judges |
| `coverage` | `files_total`, `files_checked` and `unchecked`, a `{file, reason}` row per file no language check read. The sensors still scan such a file when its text is readable, and it never counts in `files_checked` |
| `summary` | `p0_blocking`, `p0_heuristic`, `p1_open`, `p2_open`, `touched_file_debt` and `unverified` |
| `errors` | `{code, message, repair}` rows. A mutation row adds `check` and `paths` |

A check row holds `id`, `origin` (`builtin`), `severity`, `required`, `state`, `argv`, `cwd`, `exit`, `duration_ms`, `requires`, `repair` and `files`, the count of files it applies to. `argv` is a template, with `{files}` or `{file}` where the paths go.

A finding holds `rule`, `severity`, `confidence` (`exact` or `heuristic`), `file`, `line`, `origin` (`changed-line` or `touched-file`), `blocking`, `reason`, `excerpt` and `check`. An excerpt is at most 200 characters. It is null for every secret finding, for any finding on a line that holds a secret signature, and for any excerpt that shares eight characters in a row with a key in its file. The same test runs on each `reason`. A parse fault in a file that holds a key keeps only the prefix of its reason, such as `node --check`, and withholds the parser message, because a parser quotes a window of text that can sit anywhere. The redaction reads the file's text, so it holds when the `secrets` check is skipped too.

An unchecked reason is `excluded`, `size` (over 2 MB), `binary` (a NUL byte in the first 8 KB), `no comment family`, `not a regular file` or `unreadable`.

`--explain` prints `code-quality-explain/v1` with `file`, `language`, `language_source` (`shebang` or `extension`), `unchecked`, `surfaces`, `checklists` with their `why`, and `checks`, one `{id, applies, why}` row per check id. It always exits 2, because nothing ran.

`--format text` prints the same facts as lines for a reader. It carries no field the JSON lacks.

---

## 4. ENVELOPE GRAMMAR

`--format envelope` prints the `code-quality/v1` envelope with its keys unchanged.

```text
CODE_QUALITY_RESULT v1
schema_version: code-quality/v1
status: advisory
modified_files: <scope.files joined by ", ", or none>
resolved_surface: <resolved_surface joined by ", ">
checklists_loaded: <checklists[].file joined by ", ", or none>
checker_outputs: code-quality-run/v1 gate=<GATE> exit=<n> p0_blocking=<n> unverified=<ids|none> unchecked=<n> layers=pc:<state>,ci:<state>,pe:<state>
p0_p1_p2_decisions: PENDING_AGENT_JUDGMENT
accepted_deferrals: PENDING_AGENT_JUDGMENT
verification_handoff: workflow-verify.md
remaining_accepted_risk: PENDING_AGENT_JUDGMENT
```

- `unverified` lists the required check ids from `summary.unverified`, joined by commas.
- `unchecked` counts `coverage.unchecked`.
- The three judgment fields read `PENDING_AGENT_JUDGMENT` until the agent replaces them. A field that still reads it is open work.
- A path segment or word that starts with `local-` prints as `<LABEL>`, the label its private surface declares, or `<PRIVATE>` when no surface claims it. A public name that only holds the text, such as `nonlocal-config.js` or `.local-env.sh`, prints as it is. The envelope gets pasted into tracked handoffs, and no tracked file names a private skill. The JSON and text forms are not redacted.

---

## 5. RULE IDS

A rule id is `<class>.<name>`.

| Rule | Severity and confidence | Source |
| --- | --- | --- |
| `hygiene.<name>` | P0 exact | The checker's rule name, such as `hygiene.adr`, `hygiene.spec-path` or `hygiene.issue` |
| `conflict.marker` | P0 exact | A line that opens a merge conflict, or a closing line with no opening |
| `secret.private-key`, `secret.aws-access-key`, `secret.github-token`, `secret.github-pat`, `secret.slack-token` | P0 exact | A credential signature |
| `syntax.json`, `syntax.cjs`, `syntax.mjs`, `syntax.python`, `syntax.yaml`, `syntax.toml`, `syntax.shell` | P0 exact | A parse fault |
| `syntax.js` | P0 heuristic | `node --check` on plain `.js`, which may hold JSX or Flow |
| `syntax.json` | P0 heuristic | A `.json` file outside the JSONC names that parses only once its comments and trailing commas leave, which the tool that reads it may accept |
| `debug.debugger`, `debug.breakpoint`, `debug.pdb`, `debug.pry` | P1 heuristic | A debug statement on a changed line |
| `dist.stale` | P1 exact | The dist adapter's stale banner |

A finding blocks when it is P0, exact and on a changed line. A parse fault counts as on a changed line when the change edited the file at all. A hygiene finding on an unchanged line of a touched file blocks only when the pre-commit or CI layer is `present`, because that layer scans whole files and would fail anyway. Its reason then names the layer. Otherwise it reads P1 and counts as touched-file debt.

---

## 6. READER RULES

- **Language.** A shebang decides before the extension. A file with no known shebang takes the language its extension maps to in `comment-syntax.json`. A file with neither a comment family nor a parser is unchecked.
- **Surfaces.** Surfaces come from `declaredSurfaces` in `sk-code-skilled/assets/scripts/router-replay-lib.cjs`, in its detection order. A specific surface matches on any marker kind: a path marker on a path segment, a file marker on the extension or the exact name, a content marker on the text with word boundaries. The fallback, SKILLED, holds only when the file's real path lies inside the hub's own `.skilled/` folder and a path marker matches. No match reads `UNKNOWN` for the file and `unknown` for the run.
- **Real path.** Path selectors and markers read the resolved path. A hub file reached through a link reads as `.skilled/<path>`. A file whose literal path holds `.skilled/` but whose real path lies elsewhere never reads as SKILLED.
- **Checklist rows.** Rows come from the universal floor and the quality-owned rows in `assets/quality-defaults.json`, then from each `quality.checklists` declaration in `mode-registry.json`. A row selects by `paths` globs, `extensions` or `contentMarkers`. Kinds combine with AND and values within a kind with OR. A glob is anchored, `**` crosses folders, `*` and `?` stay inside one, and `**/` also matches no folder.
- **Owners.** A row from a mode with a detection block applies only to files that resolve to that surface. A row from a mode without one, such as `sk-code-ci`, applies by its selectors alone.
- **Hub paths.** A checklist path is written `hub:<hub>/<path>` and resolves against the skills folder that holds the hub. One checklist lists once, with every file it serves.

---

## 7. CHECKER INPUT FIELDS

The runner reads these fields of `check-comment-hygiene.sh --json`, schema `comment-hygiene/v1`.

| Field | Use |
| --- | --- |
| `exit_code` | 0, 1 and 2 are results. Any other value makes the check `ERROR` |
| `files[].file` | Matched to the path the runner passed, relative to the repository root |
| `files[].status` | `unreadable` on any file makes the check `ERROR` |
| `files[].findings[].line` | Decides the finding's origin |
| `files[].findings[].rule` | Becomes `hygiene.<rule>` |
| `files[].findings[].reason`, `excerpt` | Copied to the finding |

Output that does not parse as this document makes the check `ERROR`, so a broken checker never reads as clean. The runner reads `languages.<name>.extensions`, `shebangs` and `family` from `assets/comment-syntax.json`, the same table the checker reads.

---

## 8. DIST ADAPTER

The adapter checks the files that `quality-defaults.json` declares as generated, through its `generated` rows of `paths` globs. The list is empty in this release, so the check reads `NOT_APPLICABLE` on every run.

- It runs `python3 -B check-dist-staleness.sh <file>` once per file, the per-file mode, which never rebuilds. The working directory is the root of the hub's repository, where the checker finds its freshness library, and `SPECKIT_DIST_AUTO_REBUILD=0` is set.
- The checker exits 0 on every path, so the adapter reads the banner. A `STALE DIST WARNING:` line is a P1 `dist.stale` finding. Empty output with empty stderr is `RAN_CLEAN`. A `DIST FRESHNESS CHECK ERROR:` line, any other text, any stderr or a non-zero exit is `ERROR`.
- The adapter reads the checker's own switch the way the checker does: `SYSTEM_HOOKS_DISABLED` or `SYSTEM_DIST_FRESHNESS_DISABLED`, from the environment first and then from `HOOK_FLAGS_CONFIG` or the hub's `hooks/hook-flags.env`. A switch that is off reads `SKIPPED_BY_FLAG`, because the checker would print nothing and silence is not evidence.
- Two limits stay open. The checker also stays silent when its library prints output it cannot parse. The freshness library can write a cache record beside a dist entry in the hub's repository, which the workspace guard does not watch. A generated path is declared only once that write is closed.
