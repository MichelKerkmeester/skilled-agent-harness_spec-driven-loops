---
title: "Implementation Plan: Phase 10: trigger-index-ci-rebuild"
description: "Add a GitHub Actions workflow that rebuilds the committed trigger index on pushes to the integration branches, commits it only when it changed, and guards against loops and races, then point the advisory drift message at the new job."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 10: trigger-index-ci-rebuild

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | GitHub Actions YAML, Node 20 (the generator is a Node ESM script) |
| **Framework** | GitHub Actions |
| **Storage** | The committed JSON artifact at `runtime/data/trigger-index.json` |
| **Testing** | YAML parse. `actionlint` is not installed, and the live run is pending a push |

### Overview

The committed trigger index drifts because the pull request check only reports it. This phase adds a workflow that rebuilds the index after a push to the integration branches and commits it only when it changed. A concurrency group and an actor guard keep the job from racing itself, and the advisory drift message now points at the repair job.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The operator chose rebuilding in CI over blocking merges, recorded in `spec.md` phase context.
- [x] The generator and its `--check` mode are available as the dependency.
- [x] Success criteria are observable, `--check` exits 0 after the first push and an unchanged corpus produces no commit.

### Definition of Done
- [x] The rebuild workflow exists with the guards and the single-path commit.
- [x] The advisory drift message points at the rebuild workflow.
- [x] The new workflow parses as YAML.
- [ ] The first live push exercises the job and leaves the index current, which verifies REQ-001 and SC-001.
- [ ] The commit step's shell block passes `bash -n`.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

One repair job in its own workflow file. The job delegates generation to the existing script and can commit only one generated path.

### Key Components

- `.github/workflows/trigger-index-rebuild.yml`: the rebuild job, its trigger surface, guards and commit step.
- `generate-trigger-index.mjs`: the generator the job runs, unchanged.
- `runtime/data/trigger-index.json`: the committed index the job stages only when it changed.
- `.github/workflows/advisory-checks.yml`: the pull request check whose drift message points at the repair job.

### Data Flow

A push to `main` or `skilled/**`, or a manual dispatch, starts the job when the actor is not the bot. The job runs the generator, compares the committed index with `git diff`, and commits and pushes the index with the bot identity only when there is a change. A push that branch protection rejects fails the job with an error line that names branch protection.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

The work follows `tasks.md`. Setup recorded the scope, implementation created the workflow and the advisory pointer, and verification covers the YAML parse, the unavailability of `actionlint` and the pending live run.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

There is no unit test for a workflow file. The local check is a YAML parse of the new file, which passed. `actionlint` is not installed, so no schema check ran. A live run needs a push, which has not happened, and no `bash -n` run over the commit step's shell block is recorded.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `generate-trigger-index.mjs` and its `--check` mode | Internal | Green | The job cannot rebuild the index or prove it current |
| Branch protection that allows the Actions bot to push | External | Unknown | The job fails and prints an error line that names branch protection |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase commit with `git revert`. The generator and the index format are unchanged, and the job only touches the committed index path, so the revert restores the report-only behavior with no data fix-up.
<!-- /ANCHOR:rollback -->

---
