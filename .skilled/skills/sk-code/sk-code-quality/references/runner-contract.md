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
version: 1.0.9.0
---

# Quality Runner Contract

`scripts/quality-gate.cjs` prints one verdict for one change in any repository. It runs its built-in checks and the commands the repository's committed config names, writes no file and never prints a secret value. A command a manifest implies is suggested and never run, as `quality-config.md` describes. No field and no exit code means pass. Exit 0 says only that no blocker was found and that every required check produced evidence. The acting agent still owns every item in `judgment_required`.

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
| `--explain <path>...` | Prints `code-quality-explain/v1` for each named file and exits 2, or 3 on a usage error or a missing path. It runs nothing. List several paths after the flag, or repeat the flag once per path |

| Option | Effect |
| --- | --- |
| `--lines changed` | The default. Changed lines come from the new side of `git diff -U0` |
| `--lines file` | Every line of every in-scope file counts as changed |
| `--only <ids>` | Comma-separated check ids, built-in or configured. Every other check reads `SKIPPED_BY_FLAG` |
| `--skip <ids>` | Comma-separated check ids, built-in or configured, that read `SKIPPED_BY_FLAG` |
| `--no-run` | Every spawning check reads `LISTED` with its argv, and a configured check also lists each planned run. In-process checks still run |
| `--timeout <seconds>` | A deadline for each spawned process. The default is 120. A configured check's `timeoutSec` wins for that check. A value under one millisecond rounds up to one millisecond, never down to no deadline |
| `--format json\|text\|envelope` | The default is `json`. `--explain` takes `json` only |
| `--config <path>` | Reads this repository config, relative to the working directory, and records `config.source` as `cli`. A path that does not exist exits 3 with `CONFIG_PATH_MISSING`. `quality-config.md` gives the discovery order and the schema |
| `-h`, `--help` | Prints a plain-text usage to stdout and exits 0: one line per flag, the config discovery order and the exit codes. It reads no config, starts no process and writes nothing. Only an argument before `--` counts, so a file named `-h` can follow the separator |

An unknown flag, a check id that is neither built in nor configured, a missing value or a timeout of zero or less is a `USAGE` error with exit 3.

Every line of an untracked file counts as changed. So does every line of a file outside git, a file below a symlinked folder and an ignored file named with `--files`. A named file must be an existing regular file inside the repository root, or inside the working directory outside git. Otherwise the run exits 3 with `FILE_NOT_FOUND` or `FILE_OUTSIDE_ROOT`.

Git runs with `GIT_OPTIONAL_LOCKS=0`, `core.fsmonitor=false` and `GIT_LITERAL_PATHSPECS=1`, so it refreshes no index, starts no monitor and never reads a file name as a glob. Every spawned tool is an argv array with no shell, and it runs without `NODE_OPTIONS`, `NODE_COMPILE_CACHE`, `BASH_ENV` and `ENV`. A configured command also runs with no input as the leader of its own process group, which is killed at its deadline and again when it exits.

The scope lists the untracked files once per run and hands that list to the workspace guard, so a run walks the tree once for the scope rather than once per snapshot. A named-file scope takes no listing for the scope itself, because it hashes the named files by name. Every guard window lists once more, bounded to the folders the scope reaches, so a path a check creates where the scope already reads a file is still seen. A named-file scope bounds that listing to the folders its named files sit in, at both snapshots, so a check that writes beside one is still caught. The bound reaches each of those folders and every folder below it. It does not reach a sibling folder, the repository root or an ignored path, so a write there stays invisible, and a named file at the repository root folds the bound to `.`, which widens the listing to the whole tree. That bound is what the coverage costs: on `arm64` with an `Apple M5 Max` at HEAD `f1732e4d95`, where the tree held five untracked entries, `/usr/bin/time -p` around `git ls-files --others --exclude-standard -z -- <folders>` printed `real 0.04`, `0.03`, `0.03`, `0.03` and `0.03` over the five folders the fifty-file measurement below reaches, and the same listing over the whole tree printed `real 1.74`, `0.62`, `0.97`, `0.68` and `0.60`.

The guard hashes the tracked diff against `HEAD`, the untracked files inside the folders the scope reaches, the commit `HEAD` names and the named files. No ignored path is hashed, so a write to one is invisible to the guard, and a write outside the folders the scope reaches is invisible for the same reason, as is a write in another repository or to the hub that holds the runner. The ignored half was measured and refused: with the hash of every listed path included, a bounded watch cost 33 to 98 ms over the 447 ignored paths beside the dist entries, 327 to 1232 ms over the 10570 under the system-spec-kit skill folder, which holds the dist output and a package tree, and 10782 to 12786 ms over the whole tree, so it does not stay under 50 ms at a folder a scope can land on.

That count is what the two-second budget rests on. On `arm64` with an `Apple M5 Max`, `/usr/bin/time -p` around five runs of `--files` over the first fifty paths `git ls-files '*.cjs'` prints at HEAD `f1732e4d95` read `real 2.32`, `1.99`, `1.98`, `1.97` and `2.04` before this listing change and `real 1.06`, `0.80`, `0.77`, `0.76` and `0.83` after it. A timing figure is recorded rather than asserted, so no case fails on a slower machine.

`SK_CODE_QUALITY_HUB_ROOT` is for tests. It points the declarations at another hub folder that holds a `mode-registry.json`. The checkers always come from the hub that holds the runner.

---

## 2. EXIT CODES AND STATES

| Gate | Exit | Meaning |
| --- | --- | --- |
| `NO_BLOCKER_FOUND` | 0 | No blocking finding, and every required check produced evidence |
| `BLOCKED` | 1 | At least one blocking finding, or a required P0 configured check in `RAN_FAIL` |
| `NOTHING_CHECKED` | 2 | No check read any file as code. A file that only the sensors scanned, such as a Markdown file, stays unchecked. Never read it as clean |
| `ERROR` | 3 | The run could not finish honestly. `errors[]` names why |
| `UNVERIFIED` | 4 | A required check produced no evidence, or two override sources at one level disagree on a rule. `summary.unverified` names the check id or the rule id |

Precedence runs `ERROR`, then `BLOCKED`, then `UNVERIFIED`, then `NOTHING_CHECKED`, then `NO_BLOCKER_FOUND`. A blocker and an unverified check in one run exit 1.

| Check state | Meaning | Unverified when required |
| --- | --- | --- |
| `NOT_APPLICABLE` | No in-scope file is the check's kind, or matches a configured check's selectors | No |
| `RAN_CLEAN` | It ran and found nothing | No |
| `RAN_FAIL` | It ran and reported findings | No |
| `SKIPPED_ABSENT` | Its tool is missing. `repair` names what to install | Yes |
| `SKIPPED_BY_FLAG` | `--only`, `--skip` or a hook switch turned it off | Yes |
| `SKIPPED_UNTRUSTED` | A configured check whose config no trust rule vouched for. `repair` holds `git config --local skilled.trustRepoChecks true` | Yes |
| `TIMEOUT` | It passed its deadline and was killed | Yes |
| `ERROR` | It failed, printed output the runner cannot read or was not run after an earlier mutation. A configured check outside git reads `ERROR` with code `GUARD_UNAVAILABLE` | Yes |
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
| A configured id | Declared | Declared, and true by default for P0 only | The commands `.sk-code/quality.json` names in `checks` and `generated`, after the built-in rows, as `quality-config.md` describes. A command starts only from a trusted config |

A configured check runs only from a trusted config. One of four rules makes it trusted. The operator names the file with `--config`, `skcode.qualityConfig` is stored in the repository's own `.git/config`, not through an include, `git config --local --bool skilled.trustRepoChecks` prints `true` in the repository under test, or the repository under test shares its git common dir with the checkout that holds the runner. Otherwise a configured check that would start a command reads `SKIPPED_UNTRUSTED`, starts nothing and carries the repair line `git config --local skilled.trustRepoChecks true`. A required one is unverified. A built-in check is never gated this way, and `--no-run` lists a configured check without starting it, so trust does not change that listing. The trust rule compares git common dirs, so every worktree of the hub's repository counts as the hub's own checkout, while a checklist row scoped to `hubRepo` reads the hub checkout's own path instead.

| Layer state | Meaning |
| --- | --- |
| `present` | The layer exists and would run the hygiene checker |
| `absent` | Nothing names the checker for this layer |
| `untrusted` | A pre-commit hook names it, but its trust gate would skip this repository |
| `broken` | Installed but not runnable: the layer names the checker or adapter, and the path it names is missing, is not a regular file, or lacks the execute bit |
| `unknown` | The probe could not read what it needed |

The pre-commit probe reads the hook folder git resolves, then the checker the hook text names. Shell comments are stripped first, so a hook that only mentions the checker in a comment reads `absent`, while a `#` inside quotes stays text. Every path in the remaining text ending in `check-comment-hygiene.sh` is a candidate, with or without a prefix: a plain `tools/...`, a `./tools/...` and a path after `sh`, `bash` or `cd ... &&` all count, and a leading `$NAME/`, `${NAME}/`, `${NAME:-default}/` or `$(...)/`, nested substitutions included, is dropped, any quotes around it included, because the probe reads the hook as text and never runs it. A checker path inside an `echo` string, a heredoc or a branch that never runs still counts as a mention for the same reason. An absolute path with no prefix is tried as it stands, and the rest is joined to the repository root, its `.skilled` and `.opencode` source roots and the root of the repository that owns the hook, read through `git rev-parse --git-common-dir`. One candidate that is a regular file with the execute bit makes the layer `present`. When no candidate is, the layer is installed but not runnable and reads `broken`, and the repair names the path to install the checker at or to give the execute bit. When the hook carries the `skilled.trustRepoHooks` gate, a hook from another repository is untrusted unless this repository sets that key to true. The CI probe reads `.github/workflows/*.yml` and `*.yaml`. The post-edit probe reads `.claude/settings.json`, `.codex/hooks.json`, `.cursor/hooks.json` and `.devin/hooks.v1.json`, and a named adapter path missing from the repository is broken.

| Error code | Cause |
| --- | --- |
| `USAGE` | A flag the CLI section does not accept |
| `CONFIG_PATH_MISSING`, `CONFIG_INVALID` | A named config path that does not exist, or a repository config that fails to parse or validate. `config.errors` lists one row per field, and a validation fault stops the run before a check starts. A `commentHygiene` value the checker refuses is a `CONFIG_INVALID` cause found once the run starts, and its row names the field that supplied the value. So is a checklist the run loads whose `## Rule overrides` section the shared linter refuses, or one with a row whose id no rule carries: its `config.errors` row names the checklist and every reason, and none of that file's rows apply |
| `NO_GIT_REPOSITORY` | No git repository and no `--files` |
| `FILE_NOT_FOUND`, `FILE_OUTSIDE_ROOT` | A named file that is missing, not regular or outside the root |
| `BASE_NOT_FOUND`, `GIT_FAILED` | A ref with no merge base, or a git call that failed |
| `HUB_ROOT_INVALID`, `TABLE_UNREADABLE`, `DEFAULTS_INVALID` | The override, `comment-syntax.json` or `quality-defaults.json` cannot be read |
| `CHECKLIST_MISSING`, `CHECKLIST_OUTSIDE_SKILL`, `CHECKLIST_ROW_INVALID` | A matched declaration names a checklist file that is missing or not a regular file, one an outside skill declares resolves outside that skill's folder, or a row or a block is malformed. A missing file is reported in `config.errors`. The other two gate only for a declaration that applies to the change, so a fault on one that applies to no scoped file is reported in `config.warnings` and leaves the gate unchanged |
| `CHECK_MUTATED_WORKSPACE`, `GUARD_FAILED` | The workspace changed while a spawned check ran, or the guard could not take its snapshot. The built-in spawned checks share one window, so `check` names every built-in check that ran in it. Each configured check runs in its own window after that, chained from the last, so `check` names the one configured check. The first mutation stops every configured check after it. Nothing is reverted |
| `GUARD_UNAVAILABLE` | Not an `errors[]` row: the `code` of a configured check row outside git, which reads `ERROR` and never starts |
| `INTERNAL_ERROR` | A fault in the runner. The message prints, and no stack trace does |

---

## 3. VERDICT SCHEMA

`--format json` prints one `code-quality-run/v1` document.

| Field | Content |
| --- | --- |
| `schema`, `status` | `code-quality-run/v1` and `advisory`. `status` never holds another value |
| `gate`, `exit_code` | One gate from section 2 and its exit code |
| `scope` | `mode`, `base`, `merge_base`, `lines` and `files`, the repository-relative paths in scope |
| `config` | `source` is `cli`, `git-config`, `repo` or `none`, or null when the run stopped before reading it. `path` and `bytes` describe the repository file, `defaults` names `quality-defaults.json`, `trust` holds `checks` (`trusted`, `untrusted` or `none`) and `reason`, the rule that decided it or why no configured check was read, `errors` holds config and checklist faults, `warnings` holds each checklist fault on a declaration that applies to no file in scope, which never changes the gate or the exit code, and `hygiene.disabled` lists the core hygiene rules the repository config switched off, as `hygiene.<rule>` |
| `resolved_surface` | Every surface label any file resolved to, in detection order, or `["unknown"]` |
| `surfaces` | One `{file, labels}` row per file that is not excluded. A file with no surface reads `["UNKNOWN"]` |
| `layers` | `pre_commit_hygiene`, `ci_hygiene` and `post_edit`, each one layer state |
| `checklists` | One `{file, path, why, files}` row per checklist to load, the floor first |
| `rule_overrides` | One `{file, line, id, action, text, reason, files}` row per accepted `## Rule overrides` row in a checklist the run loads, in checklist order. `action` is `none` or `replace`, and `text` is null for `none`. `files` lists the scoped files the row applies to, after precedence: empty when a higher level outranks it or a conflict sets it aside. Empty when no loaded checklist carries a section |
| `rule_conflicts` | One `{id, files, scope}` row per rule that two checklists at the same precedence level give a different action or text for one file. `files` names the checklists, `scope` the files the conflict covers. The rule keeps its default there, and its id joins `summary.unverified` |
| `checks` | One row per built-in check id, in section 2 order, then one row per configured check in config order |
| `findings` | Every finding, sorted by file and line |
| `suggested_checks` | One `{id, source, reason, entry}` row per check a root manifest implies and no configured check holds. `entry` is the exact `checks` entry that would enable it. None ever runs |
| `judgment_required` | The items no check can decide, which the agent judges |
| `coverage` | `files_total`, `files_checked` and `unchecked`, a `{file, reason}` row per file no language check read. The sensors still scan such a file when its text is readable, and that alone never counts it in `files_checked`. A file a configured check ran on counts and leaves `unchecked` |
| `summary` | `p0_blocking`, `p0_heuristic`, `p1_open`, `p2_open`, `touched_file_debt` and `unverified` |
| `errors` | `{code, message, repair}` rows. A mutation row adds `check` and `paths` |

A check row holds `id`, `origin` (`builtin`, `configured` or `generated`), `severity`, `required`, `state`, `argv`, `cwd`, `exit`, `duration_ms`, `requires`, `repair`, `code` and `files`, the count of files it applies to. `argv` is a template, with `{files}` or `{file}` where the paths go. `code` is null unless a state needs one. A configured row adds `runs`, one `{cwd, argv, files, state, exit, duration_ms}` row per run, with the paths filled in. For a check that runs its files concurrently, `duration_ms` is the wall time of the whole check rather than the sum of the per-file times.

A finding holds `rule`, `severity`, `confidence` (`exact` or `heuristic`), `file`, `line`, `origin` (`changed-line` or `touched-file`), `blocking`, `reason`, `excerpt` and `check`. An excerpt is at most 200 characters. It is null for every secret finding, for any finding on a line that holds a secret signature, and for any excerpt that shares eight characters in a row with a key in its file. The same test runs on each `reason`. A parse fault in a file that holds a key keeps only the prefix of its reason, such as `node --check`, and withholds the parser message, because a parser quotes a window of text that can sit anywhere. The redaction reads the file's text, so it holds when the `secrets` check is skipped too.

An unchecked reason is `excluded`, `size` (over 2 MB), `binary` (a NUL byte in the first 8 KB), `no comment family`, `not a regular file` or `unreadable`.

`--explain` prints `code-quality-explain/v1`. It exits 2 when every path resolves, because nothing ran, and 3 (ERROR) on a usage error or a missing path. It starts no check and no configured command, and it writes no file. It reads each named file, the declarations and each listed checklist file. It is the one resolver for which surfaces and rule files apply to a file, so a caller such as review reads it instead of detecting surfaces itself.

| Field | Content |
| --- | --- |
| `schema`, `status`, `exit_code` | `code-quality-explain/v1`, `advisory` and `2` |
| `config` | The same block a run prints. Its `warnings` also hold each declaration fault that reaches no named file |
| `files` | One per-file entry for each named file, in the order named, with duplicates dropped |
| `errors` | `{code, message, repair}` rows for a declaration fault or a missing checklist that a named file reaches |
| `note` | `nothing was run` |
| `file`, `language`, `language_source`, `unchecked`, `surfaces`, `surface_skills`, `checklists`, `checks`, `rule_conflicts` | Present only when the named paths resolve to one file, duplicates dropped. They copy that file's entry from `files`, at the place a single-file caller has always read them |

One resolution covers every named file, as one run does, so a fault is an error exactly when some named file reaches it. A path that is missing or outside the root stops the whole call with exit 3, as a single path does.

| Per-file field | Content |
| --- | --- |
| `file`, `language`, `language_source`, `unchecked` | The repository-relative path, its language, how it was chosen (`shebang`, `config` or `extension`) and the unchecked reason or null |
| `surfaces` | The labels the file resolves to, by the reader rules in section 6, or `["UNKNOWN"]` |
| `surface_skills` | One `{label, owner, folder}` row per declared surface that detected the file. `owner` is `hub` for a surface the hub registry declares and `outside-skill` for one a skill's `graph-metadata.json` declares. `folder` is the absolute folder to load the surface from: the hub packet, or the outside skill's folder as the declared-surfaces reader listed it, a trusted `local-*` link included. A private surface with no `quality` block still names its folder. `folder` is null for a hub surface with no packet. An `UNKNOWN` file has none |
| `checklists` | One `{file, path, why, source, sources, overrides}` row per checklist that applies to this file. `source` is the first seat that listed it for this file and `sources` every seat, in declaration order. A seat is `default` (the base layer in `quality-defaults.json`), `repo-config` (the repository config's `checklists`), `hub-surface` (a `quality` block in `mode-registry.json`) or `outside-skill` (a skill's `quality` block) |
| `checks` | One `{id, applies, why}` row per built-in check and one `{id, origin, applies, why}` row per configured check |
| `rule_conflicts` | One `{id, files}` row per rule that two checklists at the same precedence level give a different action or text for this file, found by the run's own override pass over the named files. `files` names the checklists. A run over this file lists the same conflict in its `rule_conflicts` and reads `UNVERIFIED`. Empty when no rule conflicts here |

`overrides` is the checklist's `## Rule overrides` section, read through `lintOverrides` in `shared/scripts/check-rule-overrides.cjs`, the same reader both modes use. It holds `found`, `refused`, `rows` and `errors`. A row is `{line, id, action, text, reason}`, with `action` `none` or `replace`. An error is `{line, message}`, such as a floor rule that cannot be overridden. `refused` is true when `errors` holds anything: the contract applies a file's rows only when its error list is empty, so a caller then applies none of them. A file with no section reads `found: false` and `refused: false`. `overrides` is null when the checklist file is not a regular file, which `errors` already reports as `CHECKLIST_MISSING`. A run reads the same section of every checklist it loads: a refused one ends the run `ERROR` with `CONFIG_INVALID`, exit 3, and each accepted row is listed in `rule_overrides`. The run also refuses a section with a row whose id no rule carries, which the linter does not check. The known ids come from `shared/scripts/lib/rule-registry.cjs`, which reads them from the documents that declare them: section 5 of this file, with the hygiene names from the checker's own table, sections 3 to 5 of `code-quality-standards.md` and section 8 of `review-core.md`. An explanation does not apply this check, so its `overrides` block is the linter's alone. Its `rule_conflicts` does come from the run's pass, so a row that check refuses takes part in no conflict.

Precedence follows the shared contract. Each checklist takes the highest level of the seats that list it for a file: `repo-config` is the repository checklist, a `hub-surface` other than the SKILLED fallback or an `outside-skill` is a specific surface, the SKILLED fallback comes next and `default` is the rule as the mode ships it. For each file and rule the highest level wins. Rows at that level that give the same action and text agree and all apply. Rows that differ are listed in `rule_conflicts`, none of them applies, and the rule id joins `summary.unverified`, so the gate reads `UNVERIFIED`, exit 4, unless an error or a blocker outranks it. No new exit code is added.

The explanation is runtime output. Its JSON prints a private skill folder in `folder`, `path` and `file`, as the run's JSON does, so a caller copies labels, never those paths, into a tracked file.

`--format text` prints the same facts as lines for a reader, each `config.warnings` row included and labelled `warning`. It carries no field the JSON lacks.

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

- `unverified` lists the check ids and conflicting rule ids from `summary.unverified`, joined by commas.
- `unchecked` counts `coverage.unchecked`.
- The three judgment fields read `PENDING_AGENT_JUDGMENT` until the agent replaces them. A field that still reads it is open work.
- `p0_p1_p2_decisions` starts with one `override <rule id> <none|replace> from <checklist file>` entry per `rule_overrides` row that applies to a file, then one `override-conflict <rule id> <checklist file> <checklist file>` entry per `rule_conflicts` row, joined by `, `. It still ends in `PENDING_AGENT_JUDGMENT`, because the per-severity dispositions stay the agent's. With no row it reads `PENDING_AGENT_JUDGMENT` alone.
- A path segment or word that starts with `local-`, in any case, prints as `<LABEL>`, the label its private surface declares, or `<PRIVATE>` when no surface claims it. A public name that only holds the text, such as `nonlocal-config.js` or `.local-env.sh`, prints as it is. The envelope gets pasted into tracked handoffs, and no tracked file names a private skill. The JSON and text forms are not redacted.

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

- **Language.** A shebang decides first, then an extension the repository config maps to a family, then the extension in `comment-syntax.json`, the checker's own order. A mapped extension names a family and no language. A file with neither a comment family nor a parser is unchecked.
- **Surfaces.** Surfaces come from `declaredSurfaces` in `sk-code-skilled/assets/scripts/router-replay-lib.cjs`, in its detection order. A specific surface matches on any marker kind: a path marker on a path segment, a file marker on the extension or the exact name, a content marker on the text with word boundaries. The fallback, SKILLED, holds only when the file's real path lies inside the hub's own `.skilled/` folder and a path marker matches. No match reads `UNKNOWN` for the file and `unknown` for the run.
- **Real path.** Path selectors and markers read the resolved path. A hub file reached through a link reads as `.skilled/<path>`. A file whose literal path holds `.skilled/` but whose real path lies elsewhere never reads as SKILLED.
- **Checklist rows.** Rows come from the universal floor and the quality-owned rows in `assets/quality-defaults.json`, then from the repository config's `checklists`, then from each `quality.checklists` declaration in `mode-registry.json` and in the `graph-metadata.json` of a skill outside the hub that declares the hub's family. A row selects by `paths` globs, `extensions` or `contentMarkers`. Kinds combine with AND and values within a kind with OR. A glob is anchored, `**` crosses folders, `*` and `?` stay inside one and `**/` also matches no folder. A base-layer row may also carry `hubRepo`, which selects it only for a file in the repository that owns the hub, so a framework-specific standard never reaches a repository whose surface the runner cannot check.
- **Owners.** A row from a mode with a detection block applies only to files that resolve to that surface. A row from a mode without one, such as `sk-code-ci`, applies by its selectors alone. An outside skill's rows apply only to files that skill itself detected, never to a file another skill detected under the same label, and they resolve against that skill's own folder.
- **Hub paths.** A checklist path is written `hub:<hub>/<path>` and resolves against the skills folder that holds the hub. An outside skill's row is labelled with the folder its path resolves through, so `hub:<folder>/<path>` finds the file beside the declaring skill even when its `skill_id` differs from its folder name. One checklist lists once, with every file it serves.
- **Outside rows.** A row an outside skill declares is checked before it is used, by the rules `ci-skill-root-metadata.cjs` applies: a quality block that names `checklists` and no other key, a non-empty `checklists` array, a JSON object per row, one selector at least, a non-blank string list per selector, a dotted extension, no other key, and a `file` that is a relative `.md` path holding no `..` segment. A row that names an absolute path, or whose path or real path resolves outside that skill's folder, is refused with `CHECKLIST_OUTSIDE_SKILL` and its path is never read. A row that fails any other rule, and a block that names no readable row, is refused with `CHECKLIST_ROW_INVALID`. Both name the skill's public label and, for a row, its index, and the rest of the run continues. A row that applies and whose path is not a regular file reads `CHECKLIST_MISSING`.

One refused row on a declaration that applies to the change makes the gate `ERROR` and exit 3, ahead of a `BLOCKED` another check found. A checklist the runner cannot read honestly leaves the verdict untrustworthy, so nothing below `ERROR` is reported. A refused row or a malformed block declared by a skill that reaches no file in scope is reported in `config.warnings` instead and changes no gate, because nothing in the change depends on it.

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
| `disabled_rules` | Present only when a rule is off: the core rule names `--disable-rule` switched off |

The runner passes the repository config's `commentHygiene` values as the checker's own flags: `--ticket-prefix` per prefix, `--extension EXT=FAMILY` per mapped extension, `--extra-pattern` per pattern and `--disable-rule` per rule `commentHygiene.disableRules` names, before `--`. `quality-config.cjs` builds that list in `hygieneCheckerFlags`. The pre-commit hook and the CI hygiene job take only the `--disable-rule` part, `hygieneDisableFlags`, from `scripts/hygiene-config-flags.cjs`, because the config's additions tighten the author gate alone. The checker refuses a `--disable-rule` id that names no core rule or that `rule-overrides.json` fixes. The verdict's `config.hygiene.disabled` lists each disabled rule as `hygiene.<rule>`, and it is empty when the key is absent. A file `commentHygiene.exclude` matches is left out of the call. Output that does not parse as this document makes the check `ERROR`, so a broken checker never reads as clean. When the checker refuses its arguments, a value the repository config supplied ends the run with `CONFIG_INVALID`, exit 3 and one `config.errors` row naming the field, where a refused flag the runner supplies itself leaves the row's `repair` carrying the checker's message. The runner reads `languages.<name>.extensions`, `shebangs` and `family` from `assets/comment-syntax.json`, the same table the checker reads.

---

## 8. DIST ADAPTER

The base layer declares the build outputs this repository ships, one `paths` entry per generated path, so the check reads `NOT_APPLICABLE` only when none of them is in scope. A path that matches a declared row is read as a generated file even though the base exclude list holds `**/dist/**`. Only this adapter reads such a path: a configured check skips it, because a built file is output rather than source, and a path the repository's own `exclude` list matches stays excluded, so a repository can keep a build output out of the run. A `generated` row in a repository config carries its own command and runs as a configured check, never through this adapter.

- An edited dist file maps back to the package that built it, so the session hook can warn about a stale build after a dist edit.
- It runs `python3 -B check-dist-staleness.sh <file>` once per file, the per-file mode, which never rebuilds. The working directory is the root of the hub's repository, where the checker finds its freshness library, and `SPECKIT_DIST_AUTO_REBUILD=0` with `SPECKIT_DIST_READ_ONLY=1` are set. The second switch is the read-only dist path, so the checker returns the same verdict and writes no cache record beside the dist entry it read. The default stays writable, because the session-start self-heal and `--all` rely on that record. The switch also keeps the adapter's promise checkable, because the guard hashes no ignored path and a cache record written beside a dist entry would pass unobserved, as section 1 states.
- The checker exits 0 on every path, so the adapter reads the banner. A `STALE DIST WARNING:` line is a P1 `dist.stale` finding. Empty output with empty stderr is `RAN_CLEAN`. A `DIST FRESHNESS CHECK ERROR:` line, any other text, any stderr or a non-zero exit is `ERROR`. In the read-only mode a dist check that cannot assess the package is an `ERROR` too, which covers a checker that throws, exits non-zero, prints nothing, prints a payload with no status, or reports the package as unprovisioned.
- The adapter reads the checker's own switch the way the checker does: `SYSTEM_HOOKS_DISABLED` or `SYSTEM_DIST_FRESHNESS_DISABLED`, from the environment first and then from `HOOK_FLAGS_CONFIG` or the hub's `hooks/hook-flags.env`. A switch that is off reads `SKIPPED_BY_FLAG`, because the checker would print nothing and silence is not evidence.
- The fixture snapshot covers the folders that hold the declared paths, so a run that creates or rewrites a file beside a dist entry fails a case.
- One limit stays open. Outside the read-only mode the checker still stays silent when its library prints output it cannot parse, because a session hook has no gate waiting on the verdict.
