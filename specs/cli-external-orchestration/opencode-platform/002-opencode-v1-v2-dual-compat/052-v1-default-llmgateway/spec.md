---
title: "Feature Specification: Phase 52: v1-default-llmgateway"
description: "cli-opencode split its default model by OpenCode version, and the OpenCode 1 half stopped working: the opencode-go Go-plan quota is spent, so an unpinned OpenCode 1 dispatch hung on 'Go usage limit exceeded' and a retry exited 142 after the alarm. The operator chose llmgateway on 2026-10-21, so both versions now default to llmgateway/deepseek-v4.1-flash, and phase 043's recorded-blocked OpenCode 1 live dispatch closes."
trigger_phrases:
  - "v1 default llmgateway"
  - "make llmgateway the opencode 1 cli opencode default"
  - "phase 52 v1 default llmgateway"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 52: v1-default-llmgateway

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-21 |
| **Branch** | `worktrees/196-v1-default-llmgateway` |
| **Parent Spec** | ../spec.md |
| **Phase** | 52 of 52 |
| **Predecessor** | 051-dispatch-lint-nested-quote-gap |
| **Successor** | None |
| **Handoff Criteria** | Both OpenCode versions default to `llmgateway/deepseek-v4.1-flash`, an unpinned live dispatch exits 0 and replies on each, 043's OpenCode 1 limitation is resolved, and strict validation of this folder passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 52** of the OpenCode v1 and v2 dual compatibility packet. It carries the operator's 2026-10-21 decision that put both OpenCode versions on one default model.

**Scope Boundary**: the cli-opencode default model, in the fan-out runtime, the tests that pin it, the docs that state it and the Hermes copy regenerated from the skill. The `opencode-go` provider itself stays: no provider section, route row or example that names it for its own sake is removed, and no other executor's default is in bounds.

**Dependencies**:
- `../043-v2-default-model-and-follow-ups/`, which introduced the per-version split and recorded the OpenCode 1 live dispatch as blocked on the `opencode-go` Go usage limit.
- `../006-cli-opencode-dual-dispatch/implementation-summary.md` Known Limitation 3 and `../036-cli-opencode-docs-and-vision-test-cleanup/implementation-summary.md` Known Limitation 5, which both still described OpenCode 1 as keeping `opencode-go`.
- `llmgateway` credentials on both installed OpenCode versions, confirmed live before the switch.

**Deliverables**:
- One `OPENCODE_DEFAULT_MODEL` in the fan-out runtime, with the per-version split and `OPENCODE_V2_DEFAULT_MODEL` gone.
- The tests that pin the default, the revert check and the docs roster.
- The default in every cli-opencode doc, the 22 playbook files, the regenerated Hermes copy, and the records this phase closes.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
cli-opencode's default model was chosen by version: OpenCode 1 took `opencode-go/deepseek-v4.1-flash --variant max` and OpenCode 2 took `llmgateway/deepseek-v4.1-flash#max`. The opencode-go Go-plan quota is spent, so the OpenCode 1 half no longer works. Phase 043 recorded the failure (`scratch/live/`: `Go usage limit exceeded`, 1.19.3 hung until the alarm) and left it blocked, and a retry on 2026-10-21 exited 142 after the alarm. OpenCode 2 lists no opencode-go provider at all, so that half had already moved to llmgateway.

### Purpose
Both OpenCode versions default to `llmgateway/deepseek-v4.1-flash`, so an unpinned cli-opencode lineage no longer depends on which binary PATH resolved, and opencode-go stays a documented, selectable provider.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- One default model for both versions in the fan-out runtime (operator decision 2026-10-21, "Use llmgateway").
- The tests that pin the default: the runner's unpinned tests, the drift table and the default-model script test.
- Every cli-opencode doc that states the default: `SKILL.md`, README, eight reference files, `assets/prompt-templates.md` and 22 playbook files.
- The regenerated `.hermes/skills/cli-opencode/SKILL.md`, and the 043, 006 and 036 records this phase resolves.

### Out of Scope
- The `opencode-go` provider - it stays documented and selectable. Only its status as a default moves.
- Any other executor's default model - `CODEX_DEFAULT_MODEL`, `CLAUDE_DEFAULT_MODEL`, `CURSOR_DEFAULT_MODEL` and the Pi entry are untouched.
- Dated records in the cli-opencode docs, such as the 2026-04-26 coverage notes and the 2026-05-04 incident - they record what was true then.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | `OPENCODE_DEFAULT_MODEL` becomes `llmgateway/deepseek-v4.1-flash`; the per-version pick and `OPENCODE_V2_DEFAULT_MODEL` are removed |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/opencode-dual-dispatch.vitest.ts`, `fanout-run.vitest.ts` | Modify | The OpenCode 1 unpinned test expects llmgateway and rejects opencode-go; the drift-table row for the removed constant is gone |
| `.skilled/skills/cli-external-orchestration/cli-opencode/scripts/tests/default-model-id.test.cjs` | Modify | The opencode-go table marks no default, the llmgateway table marks one, and `SKILL.md` pins llmgateway in each version's syntax |
| `.skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md`, `README.md` | Modify | One default for both versions, in each version's syntax |
| `.skilled/skills/cli-external-orchestration/cli-opencode/references/` (`providers-and-models`, `cli-reference`, `install-and-versions`, `context-budget`, `agent-delegation`, `integration-patterns`, `opencode-tools`, `destructive-scope-violations`) | Modify | The default rows and examples name llmgateway on both versions |
| `.skilled/skills/cli-external-orchestration/cli-opencode/assets/prompt-templates.md` | Modify | The dispatch templates use the llmgateway default |
| `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/` (22 files) | Modify | Each scenario's expected argv matches the one default, and none calls llmgateway "the OpenCode 2 default" |
| `.hermes/skills/cli-opencode/SKILL.md` | Regenerate | From the edited `SKILL.md`; 1 of 68 copies rewritten |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Modify | This phase's packet, filled from the scaffold |
| `graph-metadata.json` | Regenerate | Derived metadata for this phase, re-derived from the written docs by `repair-derived` |
| `../graph-metadata.json` | Regenerate | The parent packet's derived metadata, re-derived so its child list carries this phase |
| `../043-v2-default-model-and-follow-ups/` (`spec.md`, `tasks.md`, `implementation-summary.md`) | Modify | Status Complete, REQ-001's note, T017 closed, the OpenCode 1 row passes and Known Limitation 1 resolved |
| `../006-cli-opencode-dual-dispatch/implementation-summary.md`, `../036-cli-opencode-docs-and-vision-test-cleanup/implementation-summary.md` | Modify | Their `opencode-go`-keeps-v1 limitations stop reading as the current state |
| `../spec.md` | Modify | The phase map row for 052, the 043 status and the 050 to 052 handoff row |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | An unpinned cli-opencode lineage uses `llmgateway/deepseek-v4.1-flash` on both OpenCode versions, in each version's own syntax. | The runner test and the dual-dispatch test pin both argvs, and a live unpinned dispatch on each version exits 0 and replies OK (`scratch/live/v1-unpinned.txt`, `v2-unpinned.txt`). |
| REQ-002 | A pinned `lineage.model` still wins, and no other route changes. | The provider map, every `opencode-go` route row and the other executors' defaults are unchanged; `OPENCODE_V2_DEFAULT_MODEL` has no remaining reference. |
| REQ-003 | `opencode-go` stays a documented, selectable provider. | Its provider section and its non-default route examples still read as before, and no default claim names it. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Every doc that states the cli-opencode default states llmgateway for both versions. | The default-model test passes, the playbook validator reports 72 scenarios with 0 violations and 0 warnings, and the Hermes copy set is in sync at 68. |
| REQ-005 | No suite regresses. | Plugin 516/516, hook node:test 872/872 over 29 files, deep-loop vitest 299/299, cli-opencode script tests 22/22, all at or above the phase 043 counts. |
| REQ-006 | Strict validation of this folder passes, and CI passes at the pushed commit. | `validate.sh 052-v1-default-llmgateway --strict` prints `RESULT: PASSED`; the CI run ids and commit hash are recorded after push. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: An unpinned dispatch on OpenCode 1 builds `"opencode" "run" "--model" "llmgateway/deepseek-v4.1-flash" ... "--variant" "max"` and returns OK, and the OpenCode 2 one builds `"opencode2" "run" ... "-m" "llmgateway/deepseek-v4.1-flash#max"` and returns OK.
- **SC-002**: Phase 043's OpenCode 1 live dispatch moves from BLOCKED to PASS, and no record still claims OpenCode 1 keeps `opencode-go` as the current default.
- **SC-003**: No suite drops below its phase 043 count, and CI is green at the pushed commit.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `llmgateway` credentials on both installed OpenCode versions | High | Each version ran a live unpinned dispatch before and after the switch, and both exited 0 |
| Risk | A doc rewrites an `opencode-go` route row into llmgateway | Med | Only default claims and default dispatch examples change; a grep over `opencode-go` judged each remaining hit |
| Risk | The playbook's dated records get rewritten as if they were wrong then | Med | Lines that record a past observation, such as the 2026-04-26 coverage notes and the 2026-05-04 incident, are left as written |
| Risk | A note still calls llmgateway "the OpenCode 2 default", which now implies a difference that does not exist | Low | The read-only review raised nine such notes as P2-1 and the wording brief fixed them |
| Risk | The removed `OPENCODE_V2_DEFAULT_MODEL` leaves a stale import | Low | A repo-wide grep outside `specs/` shows no reference, and the runner suite passes |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None for this phase. The operator chose llmgateway on 2026-10-21, and the CI run ids and the commit hash are tracked as a task, not a question.
<!-- /ANCHOR:questions -->

---
