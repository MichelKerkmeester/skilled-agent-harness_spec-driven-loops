---
title: "Feature Specification: Phase 27: opencode2-models-provider-check"
description: "The cli-opencode docs tell a reader to check an OpenCode 2 provider with `opencode2 models <provider>`, which 2.0.32 rejects, or with a bare `opencode2 models`, which asks the shared background service. This phase moves every site to a standalone listing filtered by provider prefix and adds a test that fails on either old form."
trigger_phrases:
  - "opencode2 models provider check"
  - "phase 27 opencode2 models provider check"
  - "opencode2 models standalone"
  - "unexpected positional argument opencode2 models"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 27: opencode2-models-provider-check

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-10-20 |
| **Branch** | `worktrees/167-opencode2-models-provider-check` |
| **Parent Spec** | ../spec.md |
| **Phase** | 27 of 27 |
| **Predecessor** | 026-ci-and-test-runners |
| **Successor** | None |
| **Handoff Criteria** | No current doc quotes a rejected or service-bound `opencode2 models` form, the new test fails on main's docs and passes here, and it runs in the blocking battery job on CI at the pushed commit |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 27** of the OpenCode v1 and v2 dual-compatibility specification. It closes the first follow-up the operator listed after the post-merge fix list: the OpenCode 2 provider check.

**Scope Boundary**: The `opencode2 models` form in current docs under `.skilled/skills/cli-external-orchestration/` and the generated Hermes copy, the provider pre-flight script in `cli-opencode/references/cli-reference.md`, and one test. Changelog and benchmark folders and `specs/` stay as dated records.

**Dependencies**:
- The finding recorded by `../025-cli-opencode-docs-and-listings/implementation-summary.md`: 2.0.32 rejects `opencode2 models <provider>`.
- OpenCode 1.19.3 (`opencode`) and 2.0.32 (`opencode2`) installed locally, probed with a private v2 database and `--standalone` only.

**Deliverables**:
- Every current doc site moved to `opencode2 models --standalone`, with provider checks filtering the listing for the `<provider>/` prefix.
- `cli-opencode/scripts/tests/opencode2-models-form.test.cjs`, run by the battery workflow's unit-test step.
- This folder's docs, the probe captures under `scratch/`, the mutation runs under `scratch/mutation/` and the parent phase map row.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
On OpenCode 2.0.32, `models` takes no positional argument: `opencode2 models opencode-go` exits 1 with `Unexpected positional argument: "opencode-go"` (`scratch/v2-positional.txt`). The pre-flight script in `cli-reference.md` uses that form, so its v2 line always reports the provider missing, and `SKILL.md`, `README.md` and the Hermes copy tell readers to run it. About forty more sites say to confirm a provider in a bare `opencode2 models`, which without `--standalone` or `--server` asks the shared background service (`scratch/v2-models-help.txt`).

### Purpose
Every documented OpenCode 2 provider check runs against a private server and actually detects the provider, and a test keeps either old form from coming back.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The inline `opencode2 models` spans across cli-opencode and cli-devin docs, moved to `opencode2 models --standalone`.
- The `<provider>` forms in `SKILL.md`, `README.md` and `cli-reference.md`, and the pre-flight script's v2 line, rewritten to filter a standalone listing.
- The `install-and-versions.md` table row, citation and v2 layout sentence.
- The Hermes copy, regenerated with `sync-skills-hermes.cjs`.
- A test that fails on either old form, run in the battery workflow's unit-test step.

### Out of Scope
- `changelog/`, `benchmark/` and `specs/` - dated records of what was run then.
- The v1 form `opencode models <provider>` - 1.19.3 accepts it and exits 1 for a missing provider (`scratch/v1-missing.txt`).
- Adding cli-devin to the battery workflow's path filter - the test scans cli-devin's one site, but a cli-devin-only edit does not start the job; recorded as a follow-up.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/cli-external-orchestration/cli-opencode/**/*.md` current docs | Modify | `--standalone` on every v2 `models` command; provider checks filter the listing |
| `.skilled/skills/cli-external-orchestration/cli-devin/references/providers-and-models.md` | Modify | The same inline span |
| `.hermes/skills/cli-opencode/SKILL.md` | Regenerate | From the edited `SKILL.md` |
| `.skilled/skills/cli-external-orchestration/cli-opencode/scripts/tests/opencode2-models-form.test.cjs` | Create | The form classifier, the doc scan and the pre-flight block check |
| `.github/workflows/opencode-dual-version.yml` | Modify | Run the new test in the unit-test step |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No current doc quotes a v2 `models` form 2.0.32 rejects or that reaches the shared service. | `opencode2-models-form.test.cjs` passes here and fails on main's docs (`scratch/mutation/`). |
| REQ-002 | The pre-flight script detects a v2 provider. | Its v2 line run live returns 0 for a listed provider and 1 for an unlisted one (`scratch/preflight-live.txt`). |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The test blocks on CI. | The battery workflow's unit-test step runs it, `check-gate-inputs.sh` and `actionlint` pass, and the step passes on CI at the pushed commit. |
| REQ-004 | The Hermes copy matches its source. | `sync-skills-hermes.cjs --check` passes. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A reader following any current cli-opencode doc on OpenCode 2 gets a correct provider answer without touching the shared service.
- **SC-002**: Reintroducing either old form fails the battery job.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A probe reaches the shared v2 service | High | Every v2 probe ran with `--standalone` and a private `OPENCODE_DB`; the positional form fails argument parsing before any server |
| Risk | `grep -q` closes the pipe early and a `pipefail` caller sees SIGPIPE | Low | The documented filter uses `grep ... >/dev/null`, which reads the whole listing |
| Dependency | Phases 028 to 031 may land on main while this phase works | Low | The merge keeps every parent phase map row from both sides |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
