---
title: "DOC-395 -- Doctor sk-code quality"
description: "Manual scenario validating that /doctor:sk-code quality reports the config source, its trust state and the rules the gate would apply read-only, refuses an existing config with CONFIG_EXISTS, and creates the config only after an approved plan."
version: 1.0.0.0
id: doctor-commands-doctor-sk-code-quality
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-395 -- Doctor sk-code quality

## 1. OVERVIEW

This scenario validates `/doctor:sk-code quality`, the target that shows which quality config the gate reads, whether each tool the config names is on the PATH, and which checklists, override rows and hygiene rules the gate would apply. It then validates the config and, when none exists, offers to create one from the shipped template behind a single approval.

The scenario checks three things the route promises. The read-only modes report without changing anything: `status` and `check` never run a configured command and never write. An existing config is never edited or overwritten, so `init` against a repository that already commits one ends in `CONFIG_EXISTS`. And the one write, `init --apply`, happens only after the plan is shown, so a repository with no config sees the plan first and gets the file only from the approved apply. The absent-config path needs its own scratch repository, because this repository commits a config.

---

## 2. SCENARIO CONTRACT

- Objective: Prove `status` and `check` report the config source, trust state and applied rules without writing, that `init` refuses an existing config with `CONFIG_EXISTS` and exit 1, and that in a repository with no config `init` prints its plan at exit 0 and writes only when `--apply` runs.
- Playbook ID: DOC-395.
- Real user request: `Run the doctor sk-code quality check and tell me which quality config this repo reads and whether it is valid.`
- Prompt: `Run the doctor sk-code quality check and tell me which quality config this repo reads and whether it is valid.`
- Preconditions: The shared current-code doctor environment at `.worktrees/.doctor-test-environment`, fast-forwarded to `origin/main` with an empty `git status --porcelain`. `node` on the PATH. A second, throwaway git repository under a `mktemp -d` directory with one workflow file under `.github/workflows/`, used for the absent-config path and the one-time write. `actionlint` may be absent; an absent tool reads `SKIPPED` or `DEGRADED` with its repair line and does not fail the scenario.
- Expected execution process: Run `status --json` and `check --json` in the current-code environment and confirm both are read-only, run `init --json` and `init --apply --json` there and confirm both refuse, then repeat `status`, `init`, `init --apply` and `check` in the throwaway repository to see the plan, the write and the second refusal, and delete the throwaway repository.
- Expected signals: In the current-code environment `status` exits 0 and its last line reads `STATUS=OK SOURCE="repo" TRUST=trusted`, with an `applies` block naming each checklist, its seats and its override rows. `check` exits 0 with the last line `STATUS=OK SOURCE="repo" TRUST=trusted ERRORS=0`. `init --json` exits 1 with the last line `STATUS=FAIL MODE=DRY_RUN ERROR=CONFIG_EXISTS`, and `init --apply --json` exits 1 with `STATUS=FAIL MODE=REFUSED ERROR=CONFIG_EXISTS`; neither writes. In the throwaway repository `status` exits 0 with `STATUS=OK SOURCE="none" TRUST=none` and `init --json` exits 0 with `STATUS=OK MODE=DRY_RUN`, a `checks` list naming the workflow-derived check and, because that repository has no `specs/` folder, a `suggested_hygiene` list of rule names it does not write. `init --apply --json` there exits 0 with `STATUS=OK MODE=APPLIED` and creates exactly one file, a second apply exits 1 with `STATUS=FAIL MODE=REFUSED ERROR=CONFIG_EXISTS`, and `check` then exits 0 with `STATUS=OK SOURCE="repo"`.
- Desired user-visible outcome: An operator who asks which config the gate reads gets the source, the trust state and the rules in force, and an operator who already has a config keeps it untouched.
- Pass/fail: PASS if `status` and `check` report the source and an empty `errors` list without writing, `init` and `init --apply` refuse an existing config with `CONFIG_EXISTS` at exit 1, and in a repository with no config `init` prints its plan at exit 0, `--apply` writes once, and a second apply refuses.
- Classification: Manual scenario. Valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable. A scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
Run the doctor sk-code quality check and tell me which quality config this repo reads and whether it is valid.
```

### Commands

1. `cd .worktrees/.doctor-test-environment`, run `git fetch origin` and `git merge --ff-only origin/main`, and confirm `git status --porcelain` prints nothing. Run steps 2 to 5 inside that environment.
2. Run `node .skilled/commands/doctor/scripts/sk-code-quality-config.cjs status --json` and capture the JSON, its last line and its exit code.
3. Run `node .skilled/commands/doctor/scripts/sk-code-quality-config.cjs check --json` and capture its last line and exit code.
4. Run `node .skilled/commands/doctor/scripts/sk-code-quality-config.cjs init --json` and capture its last line and exit code.
5. Run `node .skilled/commands/doctor/scripts/sk-code-quality-config.cjs init --apply --json` and capture its last line and exit code. Confirm `git status --porcelain` prints nothing afterwards.
6. Build the throwaway repository: `SCRATCH="$(mktemp -d)"`, then `cd "$SCRATCH" && git init -q .`, create one workflow file under `.github/workflows/`, and commit it with a throwaway identity so the directory is a git repository with no quality config.
7. In the throwaway repository run `status --json`, then `init --json`, then `init --apply --json`, then `check --json`, capturing the last line and exit code of each, and confirm exactly one file was created at `.skilled/skills/sk-code/sk-code-quality/repository/quality.json`.
8. Run `init --apply --json` a second time in the throwaway repository and capture its last line and exit code.
9. Delete the throwaway repository: `cd .. && rm -rf "$SCRATCH"`. Confirm `git status --porcelain` in the current-code environment still prints nothing.

### Expected

Steps 2 and 3 are read-only. `status` exits 0, reports `SOURCE="repo"` and a `trust` object reading `trusted`, and carries an `applies` block with a `sample` object, one entry per checklist with its `seats` and `overrides`, and `conflicts` and `errors` lists. `check` exits 0 with `ERRORS=0`.

Steps 4 and 5 both refuse, because the current-code environment commits a config. `init` exits 1 with `STATUS=FAIL MODE=DRY_RUN ERROR=CONFIG_EXISTS`; `init --apply` exits 1 with `STATUS=FAIL MODE=REFUSED ERROR=CONFIG_EXISTS`. Neither changes a byte.

In the throwaway repository step 7 shows the absent-config path. `status` exits 0 with `STATUS=OK SOURCE="none" TRUST=none`. `init` exits 0 with `STATUS=OK MODE=DRY_RUN` and prints the plan rather than a refusal, and its `suggested_hygiene` block names the spec-kit vocabulary rules that a repository with no `specs/` folder has nothing to point at. `init --apply` exits 0 with `STATUS=OK MODE=APPLIED` and creates the one config file. `check` exits 0 with `SOURCE="repo"`. Step 8 prints `STATUS=FAIL MODE=REFUSED ERROR=CONFIG_EXISTS` at exit 1 and keeps the file byte-identical.

Step 9 removes the throwaway repository, and the current-code environment is unchanged.

### Evidence

- The step 2 JSON, its last `STATUS=` line and its exit code.
- The step 3, 4 and 5 last lines and exit codes.
- The step 7 last lines and exit codes for all four modes, plus the `suggested_hygiene` block from the `init` plan.
- The step 8 last line and exit code.
- The `git status --porcelain` output after step 5 and after step 9.

### Pass / Fail

- **Pass**: `status` and `check` report the config source and an empty `errors` list without writing, `init` and `init --apply` both refuse an existing config with `CONFIG_EXISTS` at exit 1, and in a repository with no config `init` prints its plan at exit 0, the approved apply writes exactly one file, and a second apply refuses.
- **Fail**: A read-only mode writes a file or runs a configured command, an existing config is edited or overwritten, `init` against an existing config ends in any status other than `CONFIG_EXISTS` at exit 1, the apply writes without a plan, or the apply writes a second time.

### Failure Triage

If `status` reports `TRUST=untrusted`, compare the config's `repository` field with the checkout's own identity, because a config scoped to another repository is ignored rather than read. If a tool reads `DEGRADED`, run the repair line the tool entry names; an absent `actionlint` is expected on a machine that never installed it and does not fail the scenario. If `init` prints a plan where it should refuse, confirm the file exists at `.skilled/skills/sk-code/sk-code-quality/repository/quality.json` and that its `schemaVersion` is readable. If `init --apply` writes when a config already exists, read `phase_4_apply_and_check` in `doctor-sk-code-quality.yaml`. If `status` fails with `CONFIG_INVALID` or `CHECKLIST_MISSING`, the config or a checklist it declares is broken, and every gate run that loads it would stop at exit 3, so fix the named field before rerunning. Delete any `.skilled/skills/sk-code/sk-code-quality/repository/quality.json` a failed run created.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Command entrypoint: [.skilled/commands/doctor/sk-code.md](../../../../commands/doctor/sk-code.md)
- Matching YAML asset: [.skilled/commands/doctor/assets/doctor-sk-code-quality.yaml](../../../../commands/doctor/assets/doctor-sk-code-quality.yaml)
- Presentation contract: [.skilled/commands/doctor/assets/doctor-sk-code-presentation.txt](../../../../commands/doctor/assets/doctor-sk-code-presentation.txt)
- Route manifest: [.skilled/commands/doctor/_routes.yaml](../../../../commands/doctor/_routes.yaml)
- Quality config script: [.skilled/commands/doctor/scripts/sk-code-quality-config.cjs](../../../../commands/doctor/scripts/sk-code-quality-config.cjs)
- Quality runner: [.skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs](../../sk-code-quality/scripts/quality-gate.cjs)
- Config template: [.skilled/skills/sk-code/sk-code-quality/assets/quality-config.template.json](../../sk-code-quality/assets/quality-config.template.json)
- Config reference: [.skilled/skills/sk-code/sk-code-quality/references/quality-config.md](../../sk-code-quality/references/quality-config.md)
- Script tests: [.skilled/commands/doctor/scripts/tests/sk-code-quality-config.test.cjs](../../../../commands/doctor/scripts/tests/sk-code-quality-config.test.cjs)
- Category notes: [doctor-commands README](README.md)

Provenance: manual only - /doctor:sk-code quality

Catalog: `feature-catalog/doctor-commands/sk-code-setup-and-quality-doctor.md`, which inventories the quality target, its three modes and the one-time write.

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-395
- Feature name: Doctor sk-code quality
- Command mode: `/doctor:sk-code quality`
- YAML asset: `doctor-sk-code-quality.yaml`
- Mutation boundary: the route writes at most one file, `.skilled/skills/sk-code/sk-code-quality/repository/quality.json`, only through `init --apply` after an approved plan and never over an existing file. In the current-code environment every step refuses, so nothing is written; the one write happens in the throwaway repository step 9 deletes. No configured command is ever run.
- Feature file path: `doctor-commands/doctor-sk-code-quality.md`
