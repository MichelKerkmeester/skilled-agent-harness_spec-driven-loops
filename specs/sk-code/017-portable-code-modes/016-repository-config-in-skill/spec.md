---
title: "Feature Specification: Repository config inside the owning skill folder"
description: "The CI profile and the quality config sat at the repository root under .sk-code/, so every repository carried a folder the sk-code skills did not own, and a copy of one repository's settings applied silently in the next. Both files now live inside the skill folder that reads them, and a repository field decides whether a copy applies."
trigger_phrases:
  - "repository config in skill"
  - "ci profile inside the skill folder"
  - "quality config inside the skill folder"
  - "repository field on the config"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Repository config inside the owning skill folder

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-28 |
| **Branch** | `worktrees/252-hub-config-in-skill-folder` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The CI profile and the quality config were committed at the repository root under `.sk-code/`, so every repository that installed the sk-code skills carried a folder the skills themselves did not own, and nothing stopped a copy of one repository's settings from applying in another. `/doctor:ci` and the quality gate read a fixed path, so a file that travelled with the skills had no way to say which repository it was written for.

### Purpose
Both settings files live inside the skill folder that reads them, a `repository` field limits a copy to the repository it names, and a file left at the old root path is refused with its move target.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ ls .sk-code
ls: .sk-code: No such file or directory

$ node .skilled/commands/doctor/scripts/ci-report.cjs --no-gh --json
  "profile": {
    "source": "repo",
    "path": ".skilled/skills/sk-code/sk-code-ci/repository/ci.json"
  },
  "workflowCount": 32,
  "errors": [],

# A temp root holding each file at the old path, read through its own loader:
CI: PROFILE_LEGACY_LOCATION | .sk-code/ci.json is no longer read: move it to .skilled/skills/sk-code/sk-code-ci/repository/ci.json
QUALITY: CONFIG_LEGACY_LOCATION | .sk-code/quality.json is no longer read: move it to .skilled/skills/sk-code/sk-code-quality/repository/quality.json

$ node --test ci-profile ci-report ci-scaffold ci-toggle doctor-ci-contract
ℹ tests 73
ℹ pass 73
ℹ fail 0
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add the shared identity module `shared/scripts/lib/repository-identity.cjs`: `normalizeRemote`, `currentRepository`, `repositoryMatches` and `REPOSITORY_PATTERN`, reading `GITHUB_REPOSITORY` first and the origin remote otherwise.
- Move the CI profile default to `.skilled/skills/sk-code/sk-code-ci/repository/ci.json` (or the `.opencode/` twin), validate an optional `repository` field, report a committed file written for another repository as `ignored`, and refuse the old root path with `PROFILE_LEGACY_LOCATION`.
- Move the quality config default to `.skilled/skills/sk-code/sk-code-quality/repository/quality.json` (or the `.opencode/` twin), validate the same field, return source `none` with `ignored` on a mismatch, refuse the old root path with `CONFIG_LEGACY_LOCATION`, and point `init` at the skill-folder path.
- Carry the refusal into the quality gate's own error code and repair line, and carry the `ignored` field into the report, toggle and scaffold output.
- Move this repository's profile to the skill folder with its `repository` field, delete the root `.sk-code/` folder, and sweep every current doc and the README checker onto the new location.

### Out of Scope
- This repository's `quality.json` - child 012 creates it, so `/doctor:sk-code quality` reads source `none` here.
- Historical changelog entries that name the old root path - they record what shipped at the time and are not rewritten.
- The `.opencode/` copies of the skill docs - `.opencode/skills` is a symlink to `.skilled/skills`, so one edit reaches both paths.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/shared/scripts/lib/repository-identity.cjs` | Create | Remote normalization, current identity and the match rule |
| `.skilled/skills/sk-code/shared/scripts/tests/repository-identity.test.cjs` | Create | Nine cases over the URL shapes, the environment, the remote and the match |
| `.skilled/commands/doctor/scripts/lib/ci-profile.cjs` | Modify | Skill-folder path, `repository` field, `ignored` result, legacy refusal |
| `.skilled/commands/doctor/scripts/ci-report.cjs`, `ci-toggle.cjs`, `ci-scaffold.cjs` | Modify | Carry `ignored` into JSON, the profile line and the stderr note |
| `.skilled/skills/sk-code/sk-code-quality/scripts/lib/quality-config.cjs` | Modify | Skill-folder path and init target, `repository` field, `ignored` result, legacy refusal |
| `.skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs`, `hygiene-config-flags.cjs` | Modify | Own code and repair line for the legacy refusal, follow the loader |
| `.skilled/skills/sk-code/sk-code-ci/repository/ci.json` | Move | This repository's profile, now with its `repository` field |
| `.skilled/commands/doctor/**`, `README.md`, `.skilled/skills/sk-code/**`, `.skilled/skills/sk-doc/sk-create-readme/**` | Modify | Docs, presentations, workflow assets, playbooks and the README checker |
| The five changelogs and their `SKILL.md` carriers | Create, Modify | Hub, ci, quality, review and create-readme releases |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Both loaders read `repository/ci.json` and `repository/quality.json` inside the owning skill folder, or the same path under `.opencode/`, and keep the existing order: the named flag, the file-scoped git config value, the committed file, then the default. |
| REQ-002 | A file at `.sk-code/ci.json` or `.sk-code/quality.json` is refused with `PROFILE_LEGACY_LOCATION` or `CONFIG_LEGACY_LOCATION` and a message naming the move; the three CI routes and the quality gate exit 3 with that code, and `/doctor:sk-code quality` prints the same message with `ERROR=CONFIG_LEGACY_LOCATION`, exit 1. |
| REQ-003 | A committed file that declares `repository` applies only where the name matches; a mismatch is never applied and is reported as `{path, repository, current}` on the report and toggle JSON, as a suffix on the report's profile line, as a stderr note in the scaffold, and as source `none` in the quality loader. A path named with `--profile`, `--config` or the file-scoped git config value stays trusted, because the operator chose it. |
| REQ-004 | A file with no `repository` field applies in every repository, and a match ignores case in either spelling. |
| REQ-005 | The identity comes from `GITHUB_REPOSITORY` when it names a repository and from the origin remote otherwise, through one parser that accepts https, ssh and scp-like URLs and never throws on a missing or malformed remote. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | This repository's profile lives at `repository/ci.json` with `"repository": "MichelKerkmeester/skilled-agent-harness_spec-driven-loops"`, and the root `.sk-code/` folder is gone. |
| REQ-007 | `/doctor:ci report --no-gh --json` here is identical to the baseline apart from the profile path: 32 workflows, 0 errors, source `repo`. |
| REQ-008 | `/doctor:sk-code quality init` writes `.skilled/skills/sk-code/sk-code-quality/repository/quality.json` and creates the `repository/` folder. |
| REQ-009 | `quality-gate.cjs` reports `CONFIG_LEGACY_LOCATION` with its own repair line instead of `GIT_FAILED`. |
| REQ-010 | Every current doc names the new location, and the only remaining mentions of the old path describe the refusal. |
| REQ-011 | The five CI suites pass 73 of 73; the quality, doctor-quality and shared sk-code suites pass 270 of 270 with the CI suites included; the pre-commit hook suite passes 152 of 152; the rule canary suite and the README checker self-test pass. |
| REQ-012 | The sk-code hub, sk-code-ci, sk-code-quality, sk-code-review and sk-create-readme each get a changelog entry and a stepped `SKILL.md` version. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The five CI suites print `tests 73 pass 73 fail 0`, and the combined quality, doctor-quality, shared and CI run prints `tests 270 pass 270 fail 0`.
- **SC-002**: A temp root holding `.sk-code/ci.json` prints `PROFILE_LEGACY_LOCATION` with its move target, and one holding `.sk-code/quality.json` prints `CONFIG_LEGACY_LOCATION` with its move target.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The origin remote, or `GITHUB_REPOSITORY` in CI | A checkout with neither reads an unknown repository, so a file that names one is ignored rather than applied | The message prints `unknown`, and `--profile` still names a file outright |
| Risk | A repository that installs the skills under `.opencode/` reads the `.skilled/` path only | Medium | Both loaders try the `.opencode/` twin, and `ci-profile.test.cjs` and `quality-config.test.cjs` each have a case |
| Risk | A stale `.sk-code/` file would otherwise keep applying after the move | High | Both loaders refuse it with the move target, the CI routes and the quality gate exit 3, and a test pins each refusal |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The identity read adds at most one `git remote get-url origin` call per loader run, with a 5 s timeout, and no network call.

### Security
- **NFR-S01**: The identity is only compared, never used in a path or a command, and git runs through `spawnSync` with an argument array.
- **NFR-S02**: `GITHUB_REPOSITORY` is read as data and must match `owner/name` before it is trusted.

### Reliability
- **NFR-R01**: A missing or malformed remote is an unknown repository, never a throw, and a mismatch falls back to the default rather than to another repository's settings.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a file with no `repository` field applies anywhere; a checkout with no origin and no `GITHUB_REPOSITORY` reports `current: null` and prints `unknown`.
- Maximum input: a trailing slash, an ssh URL, an scp-like `git@host:owner/name.git` and a nested path all reduce to the last two path segments, and `owner/name` matches in any case.
- Failure path: a file at the old root path is refused with its own code and the move, and the CI routes and the gate exit 3; a `repository` value that is not `owner/name` is a config error naming the field.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 13/25 | One shared module, two loaders, the CI readers and the gate, five suites and a docs sweep |
| Risk | 11/25 | The settings decide which CI guards and quality checks run |
| Research | 5/20 | Remote shapes, the `.opencode/` install and the init target |
| **Total** | **29/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
