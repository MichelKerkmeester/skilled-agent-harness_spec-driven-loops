---
title: "Lib: the quality runner's spawner, workspace guard and config reader"
description: "run-check.cjs, the quality runner's spawner and workspace guard, the config reader quality-config.cjs and parallel-node-check.cjs, the bounded parallel node --check helper."
version: 1.0.7.0
---

# Lib

---

## 1. OVERVIEW

`lib/` holds `run-check.cjs`, which starts every process `../quality-gate.cjs` starts directly, the `parallel-node-check.cjs` helper among them, which in turn starts one `node --check` per file. Every command is an argv array with no shell in between and its own deadline, and the workspace guard hashes what a check could change before and after it runs, so a check that edits the code it reports on ends the run with `CHECK_MUTATED_WORKSPACE`.

`quality-config.cjs` finds the one repository config the runner reads, validates it against the schema and merges it over the shipped defaults. The only process it starts is git, through `runGit()`, to read the `skcode.qualityConfig` value, and it runs no command the config names. A file whose `repository` field names another repository is ignored, and one left at the old root path `.sk-code/quality.json` is refused with `CONFIG_LEGACY_LOCATION`.

The shared post-edit dispatch module is `.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs`, where the Claude, Codex and Devin adapters call it, so those adapters cannot drift on which checker runs for a given edited file.

---

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `run-check.cjs` | Exports `spawnArgv()` (one argv array under a deadline, with `NODE_OPTIONS`, `NODE_COMPILE_CACHE`, `BASH_ENV` and `ENV` removed, mapped to `RAN_CLEAN`, `RAN_FAIL`, `TIMEOUT` or `ERROR`), `runGit()` (git with optional locks and the file-system monitor off and literal pathspecs on), `findTool()` (a PATH lookup that starts nothing) `spawnGroup()` (one repository command as the leader of its own process group, with no shell and no input, the whole group killed at the deadline and again when the leader exits) and `withGuard()` (the content-hash guard, which can chain snapshots. The runner passes its built-in checks as one piece of work and gives each configured check its own window chained from the last, so a run takes two snapshots plus one per configured check it runs, and a file over 2 MB is compared by size and change time) |
| `quality-config.cjs` | Exports `discoverConfig()` (`--config`, then the file-scoped `skcode.qualityConfig` git config value, then `.skilled/skills/sk-code/sk-code-quality/repository/quality.json`), `loadConfig()` and `validateConfig()` (every field error collected before any check starts, a `commentHygiene.disableRules` id that is unknown or fixed by the shared contract among them), `mergeConfig()` (the repository config over the shipped defaults), `hygieneCheckerFlags()` and `hygieneDisableFlags()` (the `--disable-rule` and other checker flags a merged `commentHygiene` block yields, the second for the pre-commit hook and the CI job), `readHygieneRules()` (the core rule names, read from the checker's own table), `readSuggestions()` (the checks the root manifests imply, never run) and `initialConfig()` (the template filled with those suggestions, used by `/doctor:sk-code quality`) |
| `parallel-node-check.cjs` | A helper `../quality-gate.cjs` starts for the `syntax-node` check: it reads a JSON list of paths on stdin, runs one `node --check` per file with at most a bounded number in flight, and prints one `{file, status, stderr, timedOut, error}` record per input path in input order. Each child carries the check's own deadline and is killed at it, so the parent rebuilds the same findings from the same evidence a sequential loop produced. Each child runs in its own process group, and the helper kills every live group when it is stopped or fails, so no `node --check` outlives it. A stored stderr keeps at most 4096 characters, its head and its tail, which holds the lines the parent reads. |

The post-edit dispatch table, `post-edit-router.cjs`, is at `.skilled/hooks/post-edit-quality/lib/`. It exports `resolveDispatch()`, `runChecks()` and `runDistStalenessCheck()`.

---

## 3. CONSUMERS

- `../quality-gate.cjs` requires `run-check.cjs` and `quality-config.cjs`.
- `../quality-gate.cjs` starts `parallel-node-check.cjs` for the `syntax-node` check.
- `../hygiene-config-flags.cjs` requires `quality-config.cjs` and prints the disable flags the pre-commit hook and the CI hygiene job pass to the checker.
- `.skilled/commands/doctor/scripts/sk-code-quality-config.cjs` requires `quality-config.cjs`, the `runGit()` and `findTool()` helpers and the runner's `CHECK_IDS` and `probeLayers()` exports, and starts the runner with `--explain` through `spawnArgv()` for the applied-rules block of `/doctor:sk-code quality`.
- `../tests/quality-gate.test.cjs` tests its spawn, timeout and guard behavior directly, `../tests/configured-checks.test.cjs` tests the process group kill and the chained guard windows, and `../tests/quality-config.test.cjs` tests the config reader.
- `../tests/parallel-node-check.test.cjs` tests the helper.
- `.skilled/hooks/post-edit-quality/claude/claude-posttooluse.cjs` and `.skilled/hooks/post-edit-quality/codex/post-edit-quality.cjs` call the dispatch table at `.skilled/hooks/post-edit-quality/lib/`.

---

## 4. RELATED

- [`Scripts README`](../README.md)
- [`Runner contract`](../../references/runner-contract.md)
- [`sk-code-quality SKILL.md`](../../SKILL.md)
