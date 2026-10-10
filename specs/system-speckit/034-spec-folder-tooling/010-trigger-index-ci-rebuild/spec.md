---
title: "Feature Specification: Rebuild the trigger index in CI"
description: "CI notices when the committed trigger index is stale but only reports it, so drift piles up until someone rebuilds by hand. This phase makes CI rebuild the index and commit it when it changed."
trigger_phrases:
  - "trigger index ci rebuild"
  - "phase 10 trigger index ci rebuild"
  - "auto rebuild trigger index"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Rebuild the trigger index in CI

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-07 |
| **Branch** | `worktrees/091-consolidate-small-packets` |
| **Parent Spec** | ../spec.md |
| **Phase** | 10 of 12 |
| **Predecessor** | 009-gate-3-menu-series-parent |
| **Successor** | 011-template-phrase-census-and-cleanup |
| **Handoff Criteria** | A push that leaves the index stale is followed by a CI commit that makes `--check` pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 10** of the spec folder tooling parent. The operator chose rebuilding in CI over blocking merges or keeping the report-only step.

**Scope Boundary**: GitHub workflow files only. The generator itself does not change.

**Dependencies**:
- `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs` and its `--check` mode.

**Deliverables**:
- A workflow that rebuilds and commits the index on pushes to the integration branches.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`.github/workflows/advisory-checks.yml` runs `generate-trigger-index.mjs --check` with `continue-on-error`, so a stale index is reported and merged anyway. Agents then search an index that misses the newest packets.

### Purpose
The committed index catches up with the corpus without anyone running the generator by hand.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A workflow job that, on push to `main` and `skilled/**`, runs the generator, and commits and pushes `runtime/data/trigger-index.json` only when it changed.
- A concurrency group so two pushes never race, and a guard so the bot's own commit does not loop.
- Keeping the existing report-only step on pull requests.

> **Superseded by** [016/004 trigger-index-rebuild-hardening](../016-research-recommendations/004-trigger-index-rebuild-hardening/spec.md). That phase changed both points this phase set. The job now stages all four generator outputs, not only the index, and its loop guard matches the `Trigger-Index-Rebuild: ci` trailer, not the commit subject. The commit-only bullet above and the subject match in the Risks table describe the original build, and are kept as written.

### Out of Scope
- Blocking pull requests on drift - not chosen.
- Changes to the generator or the index format.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.github/workflows/trigger-index-rebuild.yml` | Create | Rebuild and commit job |
| `.github/workflows/advisory-checks.yml` | Modify | Point its drift message at the rebuild job |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A push that leaves the index stale triggers a rebuild commit | The workflow runs the generator, then commits only when `git diff --quiet` on the index fails. **Met** in behavior (`scratch/evidence/ci-bot-commit-proof.txt` sections 4 and 5). The commit now covers four generated files, not the index alone, see the Implementation Summary's Known Limitations |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | The job cannot loop or race | It has a concurrency group and skips when the head commit is its own. **Met**: the concurrency group is in the workflow, 17 of 17 bot commits had their own rebuild run skipped, and a non-fast-forward race recovered (`scratch/evidence/ci-bot-commit-proof.txt` sections 2 and 6). The skip matches a commit trailer, not the subject |
| REQ-003 | The workflow file is valid | `actionlint` or a YAML parse passes, and the job's shell block passes `bash -n`. **Met**: actionlint exits 0 on the working tree and on HEAD, and the three run blocks pass `bash -n` (`scratch/evidence/actionlint-trigger-index-rebuild.txt`) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: After the first push with this workflow, `--check` on the branch head exits 0. **Met** at the current head 4669db6522 (`scratch/evidence/ci-bot-commit-proof.txt` section 4). The first committing run had no in-job `--check`, see T011.
- **SC-002**: A push with no corpus change produces no bot commit. **Met**: three successful runs found the index current and produced no bot commit (`scratch/evidence/ci-bot-commit-proof.txt` section 7).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The `main` ruleset rejects a push made with the default token, because the required commit-message check never runs for it and the Actions app cannot be a bypass actor on a personal-account repository | High | The job pushes with the `TRIGGER_INDEX_PUSH_TOKEN` secret, a fine-grained token owned by the admin, whose role bypasses the ruleset. Without the secret it falls back to the default token and fails with an error that names the secret |
| Risk | A push made with that token starts the workflow again under the token owner's name | Low | The job skips when the head commit's subject is the rebuild subject |
| Risk | A rebuild commit lands between a developer's pull and push | Low | The commit touches one generated file, so a rebase resolves it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The operator chose a fine-grained token over a GitHub App or a local hook. Creating the token and setting the `TRIGGER_INDEX_PUSH_TOKEN` secret is the operator's step.
<!-- /ANCHOR:questions -->

---
