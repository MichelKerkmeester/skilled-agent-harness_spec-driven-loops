---
title: "Scripts: quality runner, comment-hygiene, dist-staleness and ceiling-report checkers"
description: "The sk-code-quality skill's quality runner and standalone checkers, including the ceiling-marker report, the modules under lib/ that hold their work, and pointers to the hook adapters and shared dispatch table that wire them into editor tool calls."
version: 1.0.8.0
---

# Scripts

---

## 1. OVERVIEW

`scripts/` owns the `sk-code-quality` skill's quality runner and its three standalone checkers (comment hygiene, dist staleness and the ceiling-marker report). The runner prints one verdict for a change in any repository and calls the checkers it needs. Each entry point stays thin: `quality-gate.cjs` parses its flags and prints, `check-comment-hygiene.sh` keeps the rule table its callers read out of its text, and the work sits in the modules under `lib/`. The per-edit PostToolUse adapters and their shared dispatch table live in `.skilled/hooks/post-edit-quality/`, and the `hooks/` subfolder here keeps only the legacy `claude-posttooluse.sh`.

---

## 2. CONTENTS

```text
scripts/
+-- quality-gate.cjs
+-- check-comment-hygiene.sh
+-- hygiene-config-flags.cjs
+-- check-dist-staleness.sh
+-- ceiling-report.sh
+-- typo-flags.test.sh
+-- lib/
|   +-- gate-arguments.cjs
|   +-- gate-check-plan.cjs
|   +-- gate-checklists.cjs
|   +-- gate-configured-checks.cjs
|   +-- gate-context.cjs
|   +-- gate-core.cjs
|   +-- gate-explain.cjs
|   +-- gate-files.cjs
|   +-- gate-layers.cjs
|   +-- gate-overrides.cjs
|   +-- gate-render.cjs
|   +-- gate-runner.cjs
|   +-- gate-spawned-checks.cjs
|   +-- gate-verdict.cjs
|   +-- parallel-node-check.cjs
|   +-- quality-config.cjs
|   +-- quality-config-discovery.cjs
|   +-- quality-config-hygiene.cjs
|   +-- quality-config-schema.cjs
|   +-- quality-config-trust.cjs
|   +-- run-check.cjs
|   `-- comment_hygiene/
|       +-- __init__.py
|       +-- checker.py
|       +-- cli.py
|       +-- constructs.py
|       +-- families.py
|       +-- rules.py
|       `-- scanner.py
+-- tests/
|   +-- fixtures.cjs
|   +-- quality-gate-helpers.cjs
|   +-- quality-suite-helpers.cjs
|   +-- configured-checks-execution.test.cjs
|   +-- configured-checks-outcomes.test.cjs
|   +-- configured-checks-trust.test.cjs
|   +-- parallel-node-check.test.cjs
|   +-- quality-config-discovery.test.cjs
|   +-- quality-config-help.test.cjs
|   +-- quality-config-hygiene.test.cjs
|   +-- quality-config-validation.test.cjs
|   +-- quality-gate-dist.test.cjs
|   +-- quality-gate-explain-and-overrides.test.cjs
|   +-- quality-gate-hygiene.test.cjs
|   +-- quality-gate-layers-and-generated.test.cjs
|   +-- quality-gate-node-pool.test.cjs
|   +-- quality-gate-outside-skills.test.cjs
|   +-- quality-gate-runner-units.test.cjs
|   +-- quality-gate-surfaces.test.cjs
|   +-- check-comment-hygiene.test.sh
|   +-- ceiling-report.test.sh
|   +-- check-dist-staleness.test.sh
|   `-- claude-posttooluse.test.sh
`-- hooks/
    +-- claude-posttooluse.sh
    `-- claude-posttooluse.test.sh
```

| File / Folder | Purpose |
|------|---------|
| `quality-gate.cjs` | The gate's entry point, kept thin: `parseArgs()` and the printed form are here, `lib/gate-runner.cjs` fixes the order the run takes and the gate modules beside it hold the work. It reads the change (`--worktree`, `--base <ref>` or `--files`), runs the built-in sensors, one comment-hygiene call and a parse floor chosen by shebang before extension, probes the pre-commit, CI and post-edit layers, lists the checklists the declarations name and prints one verdict as `json`, `text` or `envelope`. It reads one repository config (`--config`, the `skcode.qualityConfig` git config value or the `quality.json` file in the repository's `.sk-code` folder) and runs each check that config names as an argv array in its own process group under the workspace guard, only when the repository is trusted. Without a grant each configured check reads `SKIPPED_UNTRUSTED`. That is the only time it runs a repository command. It writes no file, and `--no-run` lists the configured checks without running them. `--explain <path>...` answers for any number of paths in one call and runs nothing: each file's surfaces, the folder each surface loads from, every checklist with its seat, the checklist's parsed `## Rule overrides` rows and the rule conflicts for that file. A run reads the section of every checklist it loads through the shared linter. A refused section, or a row whose rule id no declaring document carries (the shared registry reads the ids from those documents), ends the run `ERROR` with `CONFIG_INVALID`. Each accepted row is recorded in `rule_overrides` and in the envelope's `p0_p1_p2_decisions`, and two checklists at one level that disagree on a rule keep its default, appear in `rule_conflicts` and join `summary.unverified`, so the gate reads `UNVERIFIED`. Its exit codes are 0 `NO_BLOCKER_FOUND`, 1 `BLOCKED`, 2 `NOTHING_CHECKED`, 3 `ERROR` and 4 `UNVERIFIED`, and `../references/runner-contract.md` holds the full contract |
| `lib/` | The modules behind the runner and the config reader. The gate modules hold one concern each, from the shared vocabulary through the check plan to the verdict, the explanation and the printed forms, and `gate-runner.cjs` holds the order a run takes. `run-check.cjs` is the spawner and workspace guard for every process the runner starts, `quality-config.cjs` is the entry that finds, validates and merges the repository config over the four modules behind it, `parallel-node-check.cjs` runs the `syntax-node` check as bounded parallel `node --check` children, and `comment_hygiene/` holds the comment-hygiene scanner the checker entry imports. See `lib/README.md` |
| `tests/` | `node:test` suites for the runner. `fixtures.cjs` builds throwaway git repositories from quoted strings, `quality-gate-helpers.cjs` and `quality-suite-helpers.cjs` share the harness the gate and config suites start from, `parallel-node-check.test.cjs` covers the helper's ordering, deadline and group kill, the `quality-gate-` suites cover the gate modules from the surfaces and layers to the check plan, the explanation, the node pool and the dist adapter, the `quality-config-` suites cover config discovery, validation, the hygiene policy and the help text, and the `configured-checks-` suites run configured checks for real, covering their execution, their outcomes and the trust decision. It also holds the bash suites listed below |
| `check-comment-hygiene.sh` | Python script (kept as a `.sh` entrypoint), kept thin: it holds the violation table its callers read out of its text and hands the scan to `lib/comment_hygiene/`. It scans the comments of one or more files for ephemeral-artifact references such as packet/phase IDs, ADR/REQ/CHK IDs, spec paths and issue numbers. It reads its languages and comment families from `../assets/comment-syntax.json`, prints each finding with its reason, and prints a `comment-hygiene/v1` document with `--json`. `--disable-rule ID` switches one core rule off, and an id that names no core rule or that the shared `rule-overrides.json` fixes is a usage error. It exits 1 when any file has a finding, 0 when at least one file was checked clean, 2 when every file was skipped and 3 on a usage error, an unreadable table or an unreadable file |
| `hygiene-config-flags.cjs` | Node helper that reads the repository quality config through `lib/quality-config.cjs` and prints one `--disable-rule` flag per rule `commentHygiene.disableRules` switches off, NUL-separated or as JSON with `--json`. The pre-commit hook and the CI hygiene job call it, so a disabled rule stays off at commit and on a pull request, while the config's additions stay with the runner. It exits 0 with the flags, 3 when the config is missing or invalid and 2 on a usage error or outside git |
| `tests/check-comment-hygiene.test.sh` | Bash test harness that runs the comment-hygiene checker against seeded fixture files covering both violation and allowed-pattern cases |
| `check-dist-staleness.sh` | Python script (kept as a `.sh` entrypoint) that checks whether a watched TypeScript package's compiled dist is stale, scoped to one edited file by default or every watched package with `--all` |
| `ceiling-report.sh` | Python report behind a `.sh` entrypoint that lists the `ceiling:` and `intentional-limit:` comment markers, tags the ones with no trigger or no measurable trigger, and exits 0 when it runs. It reads a file's language, family and comment text through `check-comment-hygiene.sh`, so a marker inside a string, a template literal, a heredoc body or a YAML block scalar is never counted and a marker in a docstring is |
| `tests/ceiling-report.test.sh` | Bash test harness with fixture cases for the ceiling report |
| `typo-flags.test.sh` | Bash test harness that proves the sk-code helper scripts reject a misspelled long flag with a usage-error exit and report an unreadable input as an error, not as clean |
| `hooks/` | Legacy `claude-posttooluse.sh` and its test, registered in no runtime. The live adapters are in `.skilled/hooks/post-edit-quality/`, see `hooks/README.md` |

---

## 3. VALIDATION

Run the four bash suites and the `node --test` suite from the repository root. The `sk-code-script-tests.yml` workflow runs all five.

```bash
bash .skilled/skills/sk-code/sk-code-quality/scripts/tests/check-comment-hygiene.test.sh
bash .skilled/skills/sk-code/sk-code-quality/scripts/tests/ceiling-report.test.sh
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

