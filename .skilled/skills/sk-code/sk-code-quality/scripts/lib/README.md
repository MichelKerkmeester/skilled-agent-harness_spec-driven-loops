---
title: "Lib: the quality runner's modules"
description: "The modules the quality entry points require: the spawner and workspace guard run-check.cjs, the bounded parallel node --check helper, the gate modules quality-gate.cjs runs, the config reader quality-config.cjs with the four modules behind it, and the comment_hygiene Python package."
version: 1.0.8.0
---

# Lib

---

## 1. OVERVIEW

`lib/` holds every module the quality entry points require. `run-check.cjs` starts every process `../quality-gate.cjs` starts directly, the `parallel-node-check.cjs` helper among them, which in turn starts one `node --check` per file. Every command is an argv array with no shell in between and its own deadline, and the workspace guard hashes what a check could change before and after it runs, so a check that edits the code it reports on ends the run with `CHECK_MUTATED_WORKSPACE`.

The gate's own work sits in the gate modules beside it, one concern each, from the shared vocabulary through the file facts, the checklist seats, the rule overrides, the layer probe, the check plan, the configured checks, the spawned checks, the verdict, the explanation and the three printed forms. `../quality-gate.cjs` parses the arguments, calls `gate-runner.cjs` and prints the result, so the entry holds the flags and no step of its own, and the order a run takes lives in the runner module.

`quality-config.cjs` is the one module every caller requires, and it exports exactly the names it always has: it finds the one repository config the runner reads, validates it against the schema and merges it over the shipped defaults. The work sits in four quality-config modules beside it, one concern each. The only process it starts is git, through `runGit()`, to read the `skcode.qualityConfig` value, and it runs no command the config names. A file whose `repository` field names another repository is ignored, and one left at the old root path `.sk-code/quality.json` is refused with `CONFIG_LEGACY_LOCATION`.

`../check-comment-hygiene.sh` stays the entry, and it keeps the violation table its callers read out of its text. The scanner it drives sits in the `comment_hygiene/` package beside this file, one module per concern, imported from the entry's own real path so no install step is needed and a checker copied without the package fails closed.

The shared post-edit dispatch module is `.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs`, where the Claude, Codex and Devin adapters call it, so those adapters cannot drift on which checker runs for a given edited file.

---

## 2. CONTENTS

```text
lib/
+-- gate-arguments.cjs
+-- gate-check-plan.cjs
+-- gate-checklists.cjs
+-- gate-configured-checks.cjs
+-- gate-context.cjs
+-- gate-core.cjs
+-- gate-explain.cjs
+-- gate-files.cjs
+-- gate-layers.cjs
+-- gate-overrides.cjs
+-- gate-render.cjs
+-- gate-runner.cjs
+-- gate-spawned-checks.cjs
+-- gate-verdict.cjs
+-- parallel-node-check.cjs
+-- quality-config.cjs
+-- quality-config-discovery.cjs
+-- quality-config-hygiene.cjs
+-- quality-config-schema.cjs
+-- quality-config-trust.cjs
+-- run-check.cjs
`-- comment_hygiene/
    +-- __init__.py
    +-- checker.py
    +-- cli.py
    +-- constructs.py
    +-- families.py
    +-- rules.py
    `-- scanner.py
```

| File | Purpose |
|------|---------|
| `gate-arguments.cjs` | The flags a caller is offered: the usage text, the output forms it accepts, the help flags and the check ids a run may name. An id stays raw until the repository config is read, because the configured ids are known only once it has been, and an id nobody defines is refused rather than guessed |
| `gate-check-plan.cjs` | Which check applies to which file, and why, before anything starts, so a run and an explanation read one plan and cannot disagree. The in-process sensors and parsers live here too, because they answer the same question without starting a process and report the finding shape a spawned check reports |
| `gate-checklists.cjs` | Which checklist a file has to load and the seat that listed it, kept beside the list because rule-override precedence reads the seat later. A declaration a reader could not follow is reported rather than skipped, because a silent skip makes a broken declaration look like no declaration at all |
| `gate-configured-checks.cjs` | The commands a repository config names: each matched to the files it should read, grouped by folder, given an argv array and never a shell, and decided in the runner's fixed order, from no matching file through the flags, an absent tool, `--no-run`, an untrusted config and a run outside git |
| `gate-context.cjs` | Everything a run resolves once before a check starts: the hub that declares the checklists, the repository config that was found and whether an operator or the repository vouched for the commands it names, and the files the scope reaches. A config fault ends the run here, and the trust verdict is read once so every later decision agrees with it |
| `gate-core.cjs` | The runner's shared floor: the hub paths every module resolves against, the check table it reports in a fixed order, the exit codes and repair hints, and the readers, glob matchers, row builders and JSONC parsers more than one concern needs |
| `gate-explain.cjs` | Why each surface, checklist and check applies to a named file, with nothing started, every answer read through the same readers a run uses. One resolution covers every named file, and a single path keeps its per-file fields at the top level |
| `gate-files.cjs` | One record per scoped file and the labels read off it: its comment family, how it should be parsed, whether the repository excluded it, whether a build declared it output rather than source, and the hub's own surface detection, so an explanation and a run name a file the same way |
| `gate-layers.cjs` | Which hook and workflow layers enforce comment hygiene here, a layer counted only when it would really run. A present whole-file layer is what lets a finding on an unchanged line block, so the probe is deliberately strict |
| `gate-overrides.cjs` | A checklist's rule-overrides section turned into the run's applied overrides and its conflicts, read only through the shared linter so an explanation refuses exactly what a run refuses. A row that names no known rule refuses its file |
| `gate-render.cjs` | The three forms a caller can print: the JSON run document, the line report an operator reads and the envelope a tracked handoff carries. It decides nothing, and its one rule is that a private surface prints by its label |
| `gate-runner.cjs` | One run from the scope to the verdict, in the order the contract fixes: read the scope, classify it, resolve the checklists and the overrides, probe the layers, plan the checks, then run the in-process checks and every spawned one inside one workspace-guard window, with each configured command in a window of its own |
| `gate-spawned-checks.cjs` | The checks the runner starts as processes: comment hygiene under the repository's policy, one `node --check` pool per JavaScript change, `bash -n` per shell file, one parse floor for Python, YAML and TOML, and the dist adapter. An absent tool, a passed deadline and a refused argument are states it reports, not errors it raises |
| `gate-verdict.cjs` | The gate a run ends in and the shape every outcome takes, with one fixed precedence: an error, then a blocker, then a required check with no evidence, then a run that checked nothing, then no blocker found. Secret values are removed here rather than at each reporter |
| `parallel-node-check.cjs` | A helper `../quality-gate.cjs` starts for the `syntax-node` check: it reads a JSON list of paths on stdin, runs one `node --check` per file with at most a bounded number in flight, and prints one `{file, status, stderr, timedOut, error}` record per input path in input order. Each child carries the check's own deadline and is killed at it, so the parent rebuilds the same findings from the same evidence a sequential loop produced. Each child runs in its own process group, and the helper kills every live group when it is stopped or fails, so no `node --check` outlives it. A stored stderr keeps at most 4096 characters, its head and its tail, which holds the lines the parent reads. |
| `quality-config.cjs` | The entry every caller requires, and the only reader of the repository config, so the quality runner and the doctor see the same thing. It exports exactly the names it always has, and the work sits in the four quality-config modules beside it, one concern each |
| `quality-config-discovery.cjs` | The config file's lifecycle below trust: which source discovery picked, what the file says, the repository layer merged over the shipped defaults, and the draft init writes from the manifests a repository carries. A command read from a manifest comes back as a suggestion with the entry that would enable it |
| `quality-config-hygiene.cjs` | The comment-hygiene checker's own rule names and the regex dialect it can compile, read from the checker itself so a rule added there can be disabled here with no edit, plus the flags a merged `commentHygiene` block yields for the runner, the pre-commit hook and the CI job |
| `quality-config-schema.cjs` | The shape a repository config must have and every rule that decides whether it may run: the keys each block accepts, the patterns an id, an extension and a ticket prefix must match, and the syntax table a language and a comment family come from. Every fault is collected rather than thrown, so one run names every field to fix |
| `quality-config-trust.cjs` | Which config a run may trust, decided from the source rather than the file's content: the path init writes and the paths a run accepts, the repository a file declares, and the git config value, where only a value stored in a config file counts |
| `run-check.cjs` | Exports `spawnArgv()` (one argv array under a deadline, with `NODE_OPTIONS`, `NODE_COMPILE_CACHE`, `BASH_ENV` and `ENV` removed, mapped to `RAN_CLEAN`, `RAN_FAIL`, `TIMEOUT` or `ERROR`), `runGit()` (git with optional locks and the file-system monitor off and literal pathspecs on), `findTool()` (a PATH lookup that starts nothing) `spawnGroup()` (one repository command as the leader of its own process group, with no shell and no input, the whole group killed at the deadline and again when the leader exits) and `withGuard()` (the content-hash guard, which can chain snapshots. The runner passes its built-in checks as one piece of work and gives each configured check its own window chained from the last, so a run takes two snapshots plus one per configured check it runs, and a file over 2 MB is compared by size and change time) |
| `comment_hygiene/` | The Python package `../check-comment-hygiene.sh` imports from its own real path: `comment_hygiene/cli.py` reads the arguments and prints the document, `comment_hygiene/checker.py` checks one file, `comment_hygiene/scanner.py` splits a line into comment text, `comment_hygiene/constructs.py` finds where a string, a regex literal, an arithmetic construct, a heredoc body or a block scalar ends, `comment_hygiene/families.py` reads the comment-family table and names a file's language, `comment_hygiene/rules.py` names the rule a finding carries, and `comment_hygiene/__init__.py` lists the modules |

The post-edit dispatch table, `post-edit-router.cjs`, is at `.skilled/hooks/post-edit-quality/lib/`. It exports `resolveDispatch()`, `runChecks()` and `runDistStalenessCheck()`.

---

## 3. CONSUMERS

- `../quality-gate.cjs` requires `gate-core.cjs`, `gate-arguments.cjs`, `gate-context.cjs`, `gate-layers.cjs`, `gate-spawned-checks.cjs`, `gate-explain.cjs`, `gate-runner.cjs`, `gate-render.cjs` and `gate-verdict.cjs`, and requires no other module from this folder, which is what keeps the entry to the flags, one runner call and the printed form.
- `gate-runner.cjs` composes the rest: `gate-files.cjs`, `gate-checklists.cjs`, `gate-overrides.cjs`, `gate-check-plan.cjs`, `gate-configured-checks.cjs` and `gate-verdict.cjs`.
- `gate-configured-checks.cjs` and `gate-context.cjs` require `run-check.cjs`, and `gate-configured-checks.cjs` also requires `gate-check-plan.cjs` and `gate-files.cjs`.
- `../quality-gate.cjs` starts `parallel-node-check.cjs` for the `syntax-node` check.
- `../check-comment-hygiene.sh` imports the `comment_hygiene/` package and hands its CLI the violation table the entry exports, and `../tests/check-comment-hygiene.test.sh` covers the checker end to end.
- `../hygiene-config-flags.cjs` requires `quality-config.cjs` and prints the disable flags the pre-commit hook and the CI hygiene job pass to the checker.
- `.skilled/commands/doctor/scripts/sk-code-quality-config.cjs` requires `quality-config.cjs`, the `runGit()` and `findTool()` helpers and the runner's `CHECK_IDS` and `probeLayers()` exports, and starts the runner with `--explain` through `spawnArgv()` for the applied-rules block of `/doctor:sk-code quality`.
- `../tests/quality-gate-runner-units.test.cjs`, `../tests/quality-gate-hygiene.test.cjs`, `../tests/quality-gate-surfaces.test.cjs`, `../tests/quality-gate-layers-and-generated.test.cjs`, `../tests/quality-gate-explain-and-overrides.test.cjs`, `../tests/quality-gate-outside-skills.test.cjs`, `../tests/quality-gate-node-pool.test.cjs` and `../tests/quality-gate-dist.test.cjs` cover the gate modules, `../tests/configured-checks-execution.test.cjs`, `../tests/configured-checks-outcomes.test.cjs` and `../tests/configured-checks-trust.test.cjs` cover the configured checks, and `../tests/quality-config-discovery.test.cjs`, `../tests/quality-config-help.test.cjs`, `../tests/quality-config-hygiene.test.cjs` and `../tests/quality-config-validation.test.cjs` cover the config reader.
- `../tests/parallel-node-check.test.cjs` tests the helper.
- `.skilled/hooks/post-edit-quality/claude/claude-posttooluse.cjs` and `.skilled/hooks/post-edit-quality/codex/post-edit-quality.cjs` call the dispatch table at `.skilled/hooks/post-edit-quality/lib/`.

---

## 4. RELATED

- [`Scripts README`](../README.md)
- [`Runner contract`](../../references/runner-contract.md)
- [`sk-code-quality SKILL.md`](../../SKILL.md)
