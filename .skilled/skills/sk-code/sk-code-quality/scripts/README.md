---
title: "Scripts: quality runner, comment-hygiene, dist-staleness and ceiling-report checkers"
description: "The sk-code-quality skill's quality runner and standalone checkers, including the ceiling-marker report, and pointers to the hook adapters and shared dispatch table that wire them into editor tool calls."
version: 1.0.3.0
---

# Scripts

---

## 1. OVERVIEW

`scripts/` owns the `sk-code-quality` skill's quality runner and its three standalone checkers (comment hygiene, dist staleness and the ceiling-marker report). The runner prints one verdict for a change in any repository and calls the checkers it needs. The per-edit PostToolUse adapters and their shared dispatch table moved to `.skilled/hooks/post-edit-quality/`, and the `hooks/` subfolder here keeps only the legacy `claude-posttooluse.sh`.

---

## 2. CONTENTS

| File / Folder | Purpose |
|------|---------|
| `quality-gate.cjs` | Node entry point for the quality gate. It reads the change (`--worktree`, `--base <ref>` or `--files`), runs the built-in sensors, one comment-hygiene call and a parse floor chosen by shebang before extension, probes the pre-commit, CI and post-edit layers, lists the checklists the declarations name and prints one verdict as `json`, `text` or `envelope`. It reads one repository config (`--config`, the `skcode.qualityConfig` git config value or `.sk-code/quality.json`) and runs each check that config names as an argv array in its own process group under the workspace guard, which is the only time it runs a repository command. It writes no file, and `--no-run` lists the configured checks without running them. Its exit codes are 0 `NO_BLOCKER_FOUND`, 1 `BLOCKED`, 2 `NOTHING_CHECKED`, 3 `ERROR` and 4 `UNVERIFIED`, and `../references/runner-contract.md` holds the full contract |
| `lib/` | `run-check.cjs`, the runner's only process spawner and workspace guard, and `quality-config.cjs`, which finds, validates and merges the repository config. See `lib/README.md` |
| `tests/` | `node:test` suites for the runner. `fixtures.cjs` builds throwaway git repositories from quoted strings, `quality-gate.test.cjs` holds the named fixtures and the unit cases, `quality-config.test.cjs` covers config discovery, validation, merging and the help text and `configured-checks.test.cjs` runs configured checks for real, covering the guard, the timeout and the process group kill |
| `check-comment-hygiene.sh` | Python script (kept as a `.sh` entrypoint) that scans the comments of one or more files for ephemeral-artifact references such as packet/phase IDs, ADR/REQ/CHK IDs, spec paths and issue numbers. It reads its languages and comment families from `../assets/comment-syntax.json`, prints each finding with its reason, and prints a `comment-hygiene/v1` document with `--json`. It exits 1 when any file has a finding, 0 when at least one file was checked clean, 2 when every file was skipped and 3 on a usage error, an unreadable table or an unreadable file |
| `check-comment-hygiene.test.sh` | Bash test harness that runs the comment-hygiene checker against seeded fixture files covering both violation and allowed-pattern cases |
| `check-dist-staleness.sh` | Python script (kept as a `.sh` entrypoint) that checks whether a watched TypeScript package's compiled dist is stale, scoped to one edited file by default or every watched package with `--all` |
| `ceiling-report.sh` | Python report behind a `.sh` entrypoint that lists the `ceiling:` and `intentional-limit:` comment markers, tags the ones with no trigger or no measurable trigger, and exits 0 when it runs. It reads a file's language, family and comment text through `check-comment-hygiene.sh`, so a marker inside a string, a template literal, a heredoc body or a YAML block scalar is never counted and a marker in a docstring is |
| `ceiling-report.test.sh` | Bash test harness with fixture cases for the ceiling report |
| `hooks/` | Legacy `claude-posttooluse.sh` and its test, registered in no runtime. The live adapters are in `.skilled/hooks/post-edit-quality/`, see `hooks/README.md` |

---

## 3. VALIDATION

Run the four bash suites and the `node --test` suite from the repository root. The `sk-code-script-tests.yml` workflow runs all five.

```bash
bash .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.test.sh
bash .skilled/skills/sk-code/sk-code-quality/scripts/ceiling-report.test.sh
bash .skilled/skills/sk-code/sk-code-quality/scripts/typo-flags.test.sh
bash .skilled/skills/sk-code/sk-code-quality/scripts/hooks/claude-posttooluse.test.sh
node --test .skilled/skills/sk-code/sk-code-quality/scripts/tests/*.test.cjs
```

Expected: `All comment hygiene test cases passed`, `All ceiling report test cases passed`, `All typo-flag test cases passed` and `Post-edit adapter parse regression fixture passed`, each with exit 0, and a `node --test` summary with `fail 0`.

---

## 4. RELATED

- [`sk-code-quality SKILL.md`](../SKILL.md)
- [`sk-code-quality README.md`](../README.md)
- [`Runner contract`](../references/runner-contract.md)
