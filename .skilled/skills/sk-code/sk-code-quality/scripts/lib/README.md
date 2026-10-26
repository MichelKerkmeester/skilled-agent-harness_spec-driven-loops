---
title: "Lib: the quality runner's spawner and workspace guard"
description: "run-check.cjs, the one module that starts a process for the sk-code quality runner, and where the shared post-edit dispatch table now lives."
version: 1.0.1.0
---

# Lib

---

## 1. OVERVIEW

`lib/` holds `run-check.cjs`, the only place the quality runner `../quality-gate.cjs` starts a process. Every command is an argv array with no shell in between and its own deadline, and the workspace guard hashes what a check could change before and after it runs, so a check that edits the code it reports on ends the run with `CHECK_MUTATED_WORKSPACE`.

The shared post-edit dispatch module no longer lives here. It is `.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs`, where the Claude, Codex and Devin adapters call it, so those adapters cannot drift on which checker runs for a given edited file.

---

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `run-check.cjs` | Exports `spawnArgv()` (one argv array under a deadline, with `NODE_OPTIONS`, `NODE_COMPILE_CACHE`, `BASH_ENV` and `ENV` removed, mapped to `RAN_CLEAN`, `RAN_FAIL`, `TIMEOUT` or `ERROR`), `runGit()` (git with optional locks and the file-system monitor off and literal pathspecs on), `findTool()` (a PATH lookup that starts nothing) and `withGuard()` (the content-hash guard, which can chain snapshots. The runner passes all its spawned checks as one piece of work, so a run takes two snapshots however many checks it spawns, and a file over 2 MB is compared by size and change time) |

The post-edit dispatch table, `post-edit-router.cjs`, is at `.skilled/hooks/post-edit-quality/lib/` and absent from this folder. It exports `resolveDispatch()`, `runChecks()` and `runDistStalenessCheck()`.

---

## 3. CONSUMERS

- `../quality-gate.cjs` requires `run-check.cjs`.
- `../tests/quality-gate.test.cjs` tests its spawn, timeout and guard behavior directly.
- `.skilled/hooks/post-edit-quality/claude/claude-posttooluse.cjs` and `.skilled/hooks/post-edit-quality/codex/post-edit-quality.cjs` call the dispatch table in its new home.

---

## 4. RELATED

- [`Scripts README`](../README.md)
- [`Runner contract`](../../references/runner-contract.md)
- [`sk-code-quality SKILL.md`](../../SKILL.md)
