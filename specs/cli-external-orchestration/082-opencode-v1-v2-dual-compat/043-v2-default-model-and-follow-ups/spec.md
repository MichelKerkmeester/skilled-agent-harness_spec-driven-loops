---
title: "Feature Specification: Phase 43: v2-default-model-and-follow-ups"
description: "OpenCode 2 on this machine lists no opencode-go provider, so every v2 example and every unpinned v2 fan-out lineage that names the opencode-go default fails. The operator chose llmgateway as the v2 default. This phase also puts the hook node:test suites in CI and closes the doc and comment follow-ups 035, 037 and 042 recorded."
trigger_phrases:
  - "v2 default model and follow ups"
  - "phase 43 v2 default model"
  - "llmgateway v2 default"
  - "hooks node test ci"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 43: v2-default-model-and-follow-ups

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-10-21 |
| **Branch** | `worktrees/185-v2-default-model-and-follow-ups` |
| **Parent Spec** | ../spec.md |
| **Phase** | 43 of 43 |
| **Predecessor** | 042-hooks-and-plugins-held-fixes |
| **Successor** | None |
| **Handoff Criteria** | The v2 default resolves to llmgateway in the runtime and every doc, the hook node:test job passes on CI, and each follow-up below is fixed or recorded |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 43** of the OpenCode v1 and v2 dual compatibility specification. It carries the operator's 2026-10-21 decision on the OpenCode 2 default model and the small follow-ups earlier phases recorded.

**Scope Boundary**: the files named in Files to Change. The dispatch-lint files (`.skilled/hooks/dispatch/**`) belong to phase 040 and the skill advisor stress suite to its own phase, so both are out of bounds.

**Dependencies**:
- `../035-v2-bridge-plugin-effects/implementation-summary.md`, `../037-ci-pi-and-provisioning-follow-ups/implementation-summary.md` and `../042-hooks-and-plugins-held-fixes/implementation-summary.md`, which record the follow-ups.
- `../036-cli-opencode-docs-and-vision-test-cleanup/implementation-summary.md` Known Limitations 5 and 7.

**Deliverables**:
- The v2 default model in the fan-out runtime, the cli-opencode docs, the Hermes copy and the tests.
- A blocking CI workflow for the hook node:test files and the hook installer test.
- The doc and comment follow-ups.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
cli-opencode names `opencode-go/deepseek-v4.1-flash` as its default on both versions, but OpenCode 2 on this machine lists no `opencode-go` provider, so a v2 example or an unpinned v2 fan-out lineage fails as written. The 29 hook node:test files and the hook installer test run in no CI job, and 035, 037 and 042 left doc and comment claims that overstate or lack evidence.

### Purpose
OpenCode 2 defaults to `llmgateway/deepseek-v4.1-flash#max` while OpenCode 1 keeps `opencode-go/deepseek-v4.1-flash --variant max`, the hook suites gate merges, and each recorded follow-up is fixed or recorded with a reason.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The OpenCode 2 default model, in the runtime and the docs (operator decision 2026-10-21).
- 035 follow-ups: a timeout on the v2-bridge session-announcement tests, the README probe claim, and the two playbook validator warnings.
- The spec gate's shell-write gap, documented as a known limit (operator decision 2026-10-21).
- 037 follow-up: the trigger-index concurrency comment.
- 042 follow-ups: three comments that overstate their guarantee, and a CI job for the hook node:test files and the installer test.
- 036 Known Limitation 7, recorded again unless a fix is cheap.

### Out of Scope
- The OpenCode 1 default, which stays `opencode-go`.
- The dispatch-lint files and the skill advisor stress suite, which other phases own.
- Blocking shell writes in the spec gate, which the operator chose not to do.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | Pick the OpenCode 2 default model by version |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts`, `opencode-dual-dispatch.vitest.ts` | Modify | Cover both defaults and their packet line |
| `.skilled/skills/cli-external-orchestration/cli-opencode/**` | Modify | The v2 default in SKILL.md, README, references and playbook; the default-model test |
| `.hermes/skills/cli-opencode/SKILL.md` | Regenerate | From the edited SKILL.md |
| `.opencode/plugins/tests/v2-bridge.test.cjs`, `.opencode/plugins/README.md` | Modify | Test timeout; probe claim |
| `.skilled/hooks/spec-gate/README.md` and the spec-gate playbook scenario | Modify | Shell-write known limit |
| `.github/workflows/trigger-index-rebuild.yml` | Modify | Concurrency comment |
| `.skilled/hooks/task-dispatch/lib/dispatch-guard.cjs`, `.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs` | Modify | The three comments |
| `.github/workflows/hooks-node-tests.yml`, `.github/workflows/README.md` | Create, Modify | The hook node:test job and its README rows |
| `../006-cli-opencode-dual-dispatch/implementation-summary.md`, `../036-cli-opencode-docs-and-vision-test-cleanup/implementation-summary.md`, `../goal.md` | Modify | Mark the v2 default-model notes resolved (036 Known Limitation 5, the 006 note and the two goal rows) |
| `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/043-v2-default-model-and-follow-ups/` | Create | This packet |
| `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/spec.md`, `graph-metadata.json` | Modify | Phase map, handoff row and child list for 043 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | An unpinned OpenCode 2 dispatch uses `llmgateway/deepseek-v4.1-flash#max`, and OpenCode 1 keeps `opencode-go/deepseek-v4.1-flash --variant max`. | Unit tests cover both argvs; a live unpinned dispatch on each version exits 0. |
| REQ-002 | The docs state the per-version default. | The default-model test pins `--model` selectors to the v1 id and `-m` selectors to the v2 id, and the roster marks each. |
| REQ-003 | The hook node:test files and the installer test gate merges. | A new workflow runs them; its CI run id and test count are recorded. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The 035, 037 and 042 follow-ups are closed. | Each has a commit; the timeout is proven by the stream-announcement mutation failing cleanly. |
| REQ-005 | No suite regresses. | The plugin suite (516), hook node:test (856), installer (4), default-model and models-form tests pass at or above those counts. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every item in scope has a commit or a recorded reason in `implementation-summary.md`.
- **SC-002**: CI passes at the pushed main commit.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A doc row about the opencode-go route itself gets rewritten to llmgateway | Med | Only default-dispatch examples change; rows describing the opencode-go route keep its own v2 form |
| Risk | A hook test needs a tree only provisioning builds | Med | The workflow provisions the worktree the way the plugin-test workflow does |
| Dependency | `llmgateway` credentials on the operator's v2 install | High | Confirmed by a live v2 dispatch before the switch |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The operator chose the v2 default and the spec-gate handling on 2026-10-21.
<!-- /ANCHOR:questions -->

---
