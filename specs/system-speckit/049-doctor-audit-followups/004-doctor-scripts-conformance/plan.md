---
title: "Implementation Plan: Doctor scripts conformance"
description: "Fix every verified finding from four independent reviews of the doctor scripts, test first, then bring each file to the OpenCode header and section standard, remove dead code, and run every doctor test from one runner that CI calls."
trigger_phrases:
  - "doctor scripts conformance plan"
  - "doctor test runner"
  - "doctor scripts refactor plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Doctor scripts conformance

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | CommonJS JavaScript (Node 22), bash (macOS 3.2 and Linux), Python 3 |
| **Framework** | Doctor command workflows under `.skilled/commands/doctor/` |
| **Storage** | None; scripts read the repository and write only run state the workflows already define |
| **Testing** | `node:test`, Python `unittest`, bash test scripts, one vitest suite in the advisor runtime |

### Overview
Four read-only reviews, one per file group, produced findings that each reviewer reproduced in scratch fixtures; the parent session re-read the load-bearing ones before dispatch. Four implementation workers own disjoint file sets and fix their findings test first: the regression test is observed failing against the old code, then passing. The parent session owns the shared surfaces (`_routes.yaml`, the scripts README, the test runner and CI) and verifies every worker claim by rerunning the gates itself.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (`spec.md`)
- [x] Success criteria measurable (`acceptance-criteria.md`)
- [x] Dependencies identified (section 6)

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (the doctor runner, the pre-commit hook suite, the vitest suites that read doctor sources)
- [ ] Docs updated (spec/plan/tasks, the scripts README, affected workflow assets)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Standalone diagnostic scripts invoked by doctor workflow YAML, CI and git hooks. Each script reads repository state and reports through a status line and an exit code that its caller maps to a verdict.

### Key Components
- **Mirror and catalog checks** (`command-catalog-mirror-check.cjs`, `agent-roster-mirror-check.cjs`): CI and `/doctor:speckit runtime-mirrors`.
- **Hub contract check** (`parent-skill-check.cjs`): CI routing-drift job, `/create:skill-parent`, the sk-doc package validator.
- **Release updater** (`release-update.cjs`): the three `/doctor:update` workflows.
- **Diagnostics** (`fable-mode-check.cjs`, `skill-graph-freshness.cjs`, `audit_descriptions.py`, `mcp-doctor.sh`): their doctor routes.
- **Guards** (`check-mcp-mutation-class.sh`, `route-validate.sh` with `route-validate.py`): pre-commit hook, install workflow, `/doctor:update apply`.
- **Bootstrap** (`doctor-runtime-bootstrap.sh`): `/doctor:rebuild`.

### Data Flow
A workflow or CI step runs a script, reads its status line and exit code, and maps the code to a verdict. The fixes keep that contract: drift is one code, a checker crash or malformed input is the checker-error code, and the mapping each workflow documents matches the script.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| The twelve scripts | Producers of every verdict | Update | Their tests, plus a before-and-after run on the real tree |
| Doctor workflow YAML and `_routes.yaml` | Map exit codes and flags to verdicts | Update where a flag or code changes | `route-validate.sh` and its self-test |
| `.github/workflows/spec-kit-check.yml`, `routing-registry-drift.yml` | Run the mirror checks and the hub check | Add a runner job; existing steps unchanged | Workflow YAML parses; the runner passes locally |
| `.skilled/scripts/git-hooks/pre-commit` | Sends staged MCP scripts to the mutation guard | Unchanged | `pre-commit.test.sh` passes |
| `vocabulary-agreement.vitest.ts`, `parent-skill-check-fixtures.vitest.ts`, `skill-graph-freshness-panel.vitest.ts` | Read or run doctor sources | Unchanged, or new cases | Each suite passes |

Required inventories: every caller of each script was listed with `git grep` before dispatch; workers rerun their scripts on the real tree before and after and report any verdict change.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit and fixture | Each script against fixture trees in temp dirs: happy path, the drift it must catch, its error path, one regression test per fixed bug | `node --test`, `python3 -m unittest`, bash test scripts |
| Integration | Each script on the real repository, before and after | Direct runs, exit codes compared |
| Static | Headers, sections, strict mode, unused code | `verify_alignment_drift.py` with every opt-in check, shellcheck, tsc unused-locals |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| sk-code OpenCode standards and checklists | Internal | Green | No conformance target |
| shellcheck, the repo's tsc, python3 with PyYAML | Internal tooling | Green locally; CI installs PyYAML | Static gates and the mutation guard cannot run |
| Advisor runtime vitest | Internal | Green | The freshness panel suite cannot run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a doctor gate or CI job that passed before turns red on healthy input, or a workflow misreads a changed exit code.
- **Procedure**: revert the commit; each script and its tests change together, so a single-file revert restores the old behaviour and its old tests.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Review (4 groups) ──► Verify findings ──► Implement (4 workers, disjoint files) ──► Runner + CI ──► Verify
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Review | None | Implement |
| Implement | Verified findings | Runner + CI |
| Runner + CI | Test file names from the workers | Verify |
| Verify | All of the above | Closure |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Review | Med | Four parallel reviews |
| Core Implementation | High | Four parallel workers; `parent-skill-check.cjs` and `release-update.cjs` are the largest |
| Verification | Med | Full gate rerun by the parent session |
| **Total** | | **One working session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Every doctor gate run on the real tree before and after, with exit codes recorded
- [ ] The pre-commit hook suite passes
- [ ] The new CI job passes on the pushed branch

### Rollback Procedure
1. Revert the commit.
2. Rerun the doctor runner and the gates to confirm the old state.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
