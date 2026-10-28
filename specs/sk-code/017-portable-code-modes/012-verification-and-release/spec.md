---
title: "Feature Specification: Phase 12: verification-and-release"
description: "Six shipped playbook scenarios ran end to end against this worktree and all six passed, this repository's quality config landed at the skill-folder path, and the framework and skill changelogs record the settings move. The phase records where each run deviated from its playbook and what it did not do."
trigger_phrases:
  - "verification and release"
  - "phase 12 verification and release"
  - "end-to-end playbook proof"
  - "repository quality config"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 12: verification-and-release

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
| **Branch** | `worktrees/255-portable-modes-verification-release` |
| **Parent Spec** | ../spec.md |
| **Phase** | 12 of 16 |
| **Predecessor** | 016-repository-config-in-skill |
| **Successor** | None |
| **Handoff Criteria** | The six playbook scenarios and the in-repository checks pass from one worktree, and every changelog and version carrier agrees |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 12** of the Portable code modes specification, where the program's claims meet the six shipped playbook scenarios and the release records.

**Scope Boundary**: Run the six shipped playbook scenarios and the in-repository doctor and guard checks, write this repository's quality config at the skill-folder path, and record the framework and skill releases. No mode's behavior changes here apart from the CI fixture's missing helper.

**Dependencies**:
- The six playbook scenario files under `.skilled/skills/sk-code/*/manual-testing-playbook/`.
- The `devin` CLI for the three review scenarios, which need a live reviewer.
- The doctor scripts, the compiled-route guard and sync, and the skill-graph freshness check.

**Deliverables**:
- Six recorded runs under `scratch/e2e/`, each with its commands, output, exit codes and deviations.
- `.skilled/skills/sk-code/sk-code-quality/repository/quality.json` for this repository.
- The framework `v4.0.0.17` changelog, three skill changelogs, stepped carriers and a re-minted sk-code compiled route.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The earlier phases changed how the three modes read a repository's rules, and every mode ships playbook scenarios a reader is expected to run by hand, but nothing ran them end to end. A scenario can rot behind a change the docs describe and still read correctly: the foreign-repository CI scenario copied `ci-profile.cjs` into its fixture without the identity helper that profile now requires, so its first step could not load at all.

### Purpose
Six shipped scenarios and this repository's own checks pass from one worktree, and the release notes and version carriers say what shipped.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Run from this worktree on 2026-10-28. The quality read is the one this phase created; the CI report was already on the skill-folder profile after the previous phase.

```text
$ node .skilled/commands/doctor/scripts/sk-code-quality-config.cjs status
Repository: /Users/michelkerkmeester/worktrees/public/255-portable-modes-verification-release
Config: .skilled/skills/sk-code/sk-code-quality/repository/quality.json (repo, 748 bytes)
Trust: trusted (the repository shares its git common dir with the runner checkout)
Errors: none
[the command then lists the applied surface checklists and the 21 applied hygiene rule ids]
STATUS=OK SOURCE="repo" TRUST=trusted

$ node .skilled/commands/doctor/scripts/ci-report.cjs --no-gh --json
  "profile": {
    "source": "repo",
    "path": ".skilled/skills/sk-code/sk-code-ci/repository/ci.json"
  },
  "workflowCount": 32,
  "errors": [],

$ rg -c 'VERDICT: PASS' scratch/e2e/*.md
scratch/e2e/CR-029.md:1
scratch/e2e/CQ-013.md:1
scratch/e2e/CQ-012.md:1
scratch/e2e/ci-foreign-repository-profile.md:1
scratch/e2e/CR-031.md:1
scratch/e2e/CR-030.md:1
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Run the six playbook scenarios end to end from this worktree: the two quality-gate scenarios, the three review scenarios and the CI foreign-repository scenario.
- Record each run in `scratch/e2e/` with its command block, verbatim output, exit codes, pass criteria and every deviation from the playbook.
- Copy `shared/scripts/lib/repository-identity.cjs` into the CI foreign-repository fixture, so the copied `ci-profile.cjs` resolves its helper and step 1 reaches the scenario.
- Write `.skilled/skills/sk-code/sk-code-quality/repository/quality.json` for this repository: its `repository` field, one optional `actionlint` check for workflow files, and no hygiene rule disabled.
- Write the framework `v4.0.0.17` changelog, the sk-code, sk-code-ci and sk-code-quality changelogs, step every version carrier and re-mint the sk-code compiled route.

### Out of Scope
- A published GitHub release for `v4.0.0.17` - the operator decides when a tag is announced, and this phase stops at the changelog.
- The operator-local web surface's checklist rows - that surface lives outside this repository, so its rows are not this packet's evidence.
- Rewriting the `v4.0.0.16` notes - that release was tagged and published before the settings move, so its wording stays as it shipped.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scratch/e2e/CQ-012.md`, `CQ-013.md`, `CR-029.md`, `CR-030.md`, `CR-031.md`, `ci-foreign-repository-profile.md` | Create | The six recorded runs |
| `scratch/in-repo.txt` | Create | The in-repository checks and their exit codes |
| `.skilled/skills/sk-code/sk-code-ci/manual-testing-playbook/foreign-repository/foreign-repository-profile.md` | Modify | Copy the identity helper into the fixture |
| `.skilled/skills/sk-code/sk-code-quality/repository/quality.json` | Create | This repository's quality config |
| `.skilled/changelog/skilled/v4.0.0.17.md` | Create | Framework release notes for the settings move |
| `.skilled/changelog/skilled/v4.0.0.16.md` | Modify | Restore the wording the tagged release published |
| `.skilled/skills/sk-code/changelog/v3.9.18.0.md`, `sk-code-ci/changelog/v1.1.9.0.md`, `sk-code-quality/changelog/v1.13.11.0.md` | Create | The three skill releases |
| `SKILL.md`, `description.json`, `hub-router.json`, `mode-registry.json` and the `.hermes` copies | Modify | Step the version to 3.9.18.0, 1.1.9.0 and 1.13.11.0 |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json` and its `specs/sk-doc/z_archive/` twin | Modify | Re-mint the compiled route from the new carrier |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` | Modify | Refresh the skill graph for the stepped carriers |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Each of the six playbook scenarios runs end to end from this worktree and ends `VERDICT: PASS`, with its command block, verbatim output and exit codes recorded under `scratch/e2e/`. |
| REQ-002 | Each recorded run names every deviation from its playbook: the fixed fixture path in place of `mktemp -d`, the `devin` executor in place of the `@review` agent step, and the fixture skill symlink where one was needed. |
| REQ-003 | This repository's quality config lives at `.skilled/skills/sk-code/sk-code-quality/repository/quality.json`, names this repository, adds one optional `actionlint` check for workflow files and disables no hygiene rule; `/doctor:sk-code quality status` reads it as source `repo`, trusted, with no error. |
| REQ-004 | The CI foreign-repository fixture copies `shared/scripts/lib/repository-identity.cjs` into the fixture before it runs the copied `ci-profile.cjs`, so step 1 reaches the scenario. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | The in-repository checks run clean: the CI report reads 32 workflows with no drift flag, the toggle asks for a second confirmation before it switches a protected workflow off, the setup battery reads `STATUS=OK legs=9`, the compiled-route guard and sync pass, the skill graph is fresh, the Hermes copies are in sync and the routing capture equals the committed baseline. |
| REQ-006 | The framework changelog `v4.0.0.17.md` describes the settings move, and `v4.0.0.16.md` keeps the wording of the tagged release instead of describing a move that shipped after it. |
| REQ-007 | sk-code `v3.9.18.0`, sk-code-ci `v1.1.9.0` and sk-code-quality `v1.13.11.0` each get a changelog entry, and each `SKILL.md` carries the same version. |
| REQ-008 | The version carriers step together: `description.json`, `hub-router.json`, `mode-registry.json` and the `.hermes` copies carry the new version, the skill graph is regenerated and fresh, and the sk-code compiled route is re-minted from the new carrier. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `rg -c 'VERDICT: PASS' scratch/e2e/*.md` prints one hit in each of the six recorded files.
- **SC-002**: `/doctor:sk-code quality status` prints `STATUS=OK SOURCE="repo" TRUST=trusted` with `Errors: none`, exit 0.
- **SC-003**: Each of the four changelogs exists and each of the three `SKILL.md` carriers prints the same version as its changelog.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `devin 3000.11.228` with `deepseek-v4-1-flash-max` for the three review scenarios | Without it the live review step cannot be rerun, and the recorded run stands as the evidence | Each file names the executor and model it ran, so a later reader knows what produced the report |
| Risk | A review run passes only because of executor scaffolding the playbook does not describe | Medium | The symlink is written into each file as a deviation, and the files under test are unchanged from the fixture build |
| Risk | The fixed fixture path replaces `mktemp -d`, so a stale tree can leak between runs | Medium | CR-031 deletes its fixture first and records the `rm -rf` exit 0; every other run rebuilds its fixture from the playbook heredocs |
| Risk | Release notes describe behavior the phase did not ship | High | `v4.0.0.16` is restored to its tagged wording, and the move is described in `v4.0.0.17` where it actually shipped |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: A scripted scenario finishes in seconds; the three live review runs took 87 s, 129 s and 146 s wall clock.

### Security
- **NFR-S01**: Every fixture lives outside the worktree under `.scratch-dc90/fixtures/`, and no scenario writes a tracked file.
- **NFR-S02**: The three review runs used `--permission-mode dangerous` only inside a throwaway fixture, and the recorded files name that flag.

### Reliability
- **NFR-R01**: A rerun rebuilds its fixture from the playbook heredocs; the fixture path is the only fixed input.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a fixture path that already holds a stale tree is rebuilt from the heredocs; CR-031 records the `rm -rf` before its build.
- Maximum input: CR-031 exercises the linter, the resolver and a live review over one checklist, and at 146 s it is the longest of the six.
- Failure path: an unscaffolded `devin` run produces prose with no `Rule sources:` line and fails both report checkers; CR-031 records that first attempt and the rerun that passed.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Six recorded runs, one config, four changelogs and the version carriers |
| Risk | 9/25 | A live model in three runs, and release notes that cannot be unpublished |
| Research | 4/20 | Each playbook already names its fixture and pass criteria |
| **Total** | **23/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
