---
title: "Repository Quality Config"
description: "A committed .sk-code/quality.json names the commands a repository runs as quality checks, and a configured check starts only from a config the repository or an operator vouched for."
trigger_phrases:
  - "repository quality config"
  - ".sk-code/quality.json"
  - "configured quality checks"
  - "skilled.trustRepoChecks"
version: 1.0.1.0
---

# Repository Quality Config (.sk-code/quality.json)

## 1. OVERVIEW

A committed .sk-code/quality.json names the commands a repository runs as quality checks, and a configured check starts only from a config the repository or an operator vouched for.

The quality runner reads the file on every run, and `/doctor:sk-code quality` shows, checks and creates it. Both read it through one module, so they never disagree about what the file says. The file tightens the author gate only, except that `commentHygiene.disableRules` also relaxes the core hygiene set, for the runner, the pre-commit hook and the CI job alike.

---

## 2. HOW IT WORKS

### Discovery

The runner picks exactly one source, the most explicit first: `--config PATH` relative to the working directory, then the git config value `skcode.qualityConfig` from a config file, then `.sk-code/quality.json` at the repository root, then none. A `git -c` or `GIT_CONFIG_*` value is ignored, because one invocation must not swap the commands a repository committed. A named path that does not exist exits 3 with `CONFIG_PATH_MISSING` and never falls back to the next source. With no config the runner uses the shipped base layer alone.

### Schema And Merge

`schemaVersion` must be `1`, and an unknown key at any level is a config error. The file can carry `checks`, `checklists`, `generated`, `exclude`, `commentHygiene` and `sensors`. `commentHygiene.disableRules` lists core hygiene rules to switch off, and an unknown id or one the shared contract fixes is `CONFIG_INVALID`. The shipped base layer loads first and names no command, so `checks` come only from the repository layer. Lists append, and an exact sensor whose findings block cannot be switched off.

### Trust Boundary

A configured check runs only from a trusted config: the operator named the file with `--config`, the value is stored in the repository's own `.git/config`, `git config --local skilled.trustRepoChecks` reads `true`, or the repository shares its git common dir with the checkout that holds the runner. Otherwise the check reads `SKIPPED_UNTRUSTED`, starts nothing and carries the repair line `git config --local skilled.trustRepoChecks true`. Every command runs as an argv array with no shell, under its own deadline, as the leader of a process group the runner kills. The workspace guard brackets each run, and a changed snapshot ends the run with `CHECK_MUTATED_WORKSPACE` and reverts nothing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/sk-code/sk-code-quality/scripts/lib/quality-config.cjs` | Shared | Discovery, validation and the merge over the base layer |
| `.skilled/skills/sk-code/sk-code-quality/assets/quality-defaults.json` | Shared | The shipped base layer |
| `.skilled/skills/sk-code/sk-code-quality/assets/quality-config.template.json` | Shared | The template the doctor fills on init |
| `.skilled/skills/sk-code/sk-code-quality/references/quality-config.md` | Shared | The schema, discovery order, error codes and trust boundary |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-config.test.cjs` | Node test | One discovery case per source and the config errors |
| `.skilled/skills/sk-code/sk-code-quality/scripts/tests/configured-checks.test.cjs` | Node test | Configured runs, trust states and the workspace guard |

---

## 4. SOURCE METADATA

- Group: Quality Gate
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `quality-gate/repository-quality-config.md`

Related references:
- [codebase-agnostic-quality-gate.md](codebase-agnostic-quality-gate.md) for the runner that reads the file.
- [sk-code-setup-and-quality-doctor.md](../doctor-commands/sk-code-setup-and-quality-doctor.md) for the doctor that creates it.
