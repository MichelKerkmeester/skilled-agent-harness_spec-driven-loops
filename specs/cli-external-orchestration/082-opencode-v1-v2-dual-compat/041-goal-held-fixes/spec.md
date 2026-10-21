---
title: "Feature Specification: Phase 41: goal-held-fixes"
description: "The alignment audit in phase 039 held nine goal plugin and goal core findings for the operator because each fix changes behaviour. The operator approved them. This phase fixes all nine, each with a test that fails without its fix."
trigger_phrases:
  - "goal held fixes"
  - "phase 41 goal held fixes"
  - "goal archive on replace and clear"
  - "goal core parse error fallback"
  - "goal cli workspace required"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 41: goal-held-fixes

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
| **Branch** | `worktrees/183-goal-held-fixes` |
| **Parent Spec** | ../spec.md |
| **Phase** | 41 |
| **Predecessor** | 039-sk-code-opencode-alignment-audit |
| **Successor** | None |
| **Handoff Criteria** | Every finding below has a fix commit and a test that fails without it, and the plugin and hooks suites pass on CI at the pushed commit |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 41** of the OpenCode v1 and v2 dual compatibility specification. Phase 039 reviewed every plugin and hook file against sk-code and held each finding whose fix changes behaviour. On 2026-10-21 the operator chose to fix all of them. This phase takes the goal plugin and goal core rows. Other phases take the dispatch-lint rows and the remaining hook and plugin rows.

**Scope Boundary**: `.opencode/plugins/opencode-goal.js`, `.skilled/hooks/goal/lib/goal-core.cjs`, `.skilled/hooks/goal/bin/goal.cjs`, their tests, the callers and docs that run `goal.cjs` with a session action, and this packet.

**Dependencies**:
- `../039-sk-code-opencode-alignment-audit/review.md` §3, which holds the rows this phase fixes.
- `../034-live-plugin-playbook/`, whose opencode-goal scenario is rerun on both versions after the change.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The OpenCode goal plugin deletes a goal whenever a mutator returns `null`, although several event mutators return `null` only to mean that no goal exists, so a goal another process just wrote can be removed. It replaces and clears goals without archiving them, and it names every archive file after the session alone, so a second archive for a session overwrites the first. Its continuation prompt sends the objective stored at bind time while the system injection rereads the packet, so the two can disagree after a packet edit. `statusCodeFromError` reads `null` and `''` as status 0 and stops before a later 429. In the shared core, a malformed current record falls through to an older legacy record, and an archive file holding JSON `null` makes the whole history read as empty. The manage CLI runs current-session actions against `process.cwd()` when `--workspace` is omitted, which its README says is required.

### Purpose
Each of the nine findings is fixed with a test that fails without its fix, and the plugin and the core keep one archive behaviour: replace and clear both archive, and no archive overwrites another.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- b01-plugins-goal-003: only an explicit delete removes a goal; a `null` from a mutator leaves the record as it is.
- b01-plugins-goal-004: a bound goal's continuation prompt uses the packet's current objective, as the injection does.
- b01-plugins-goal-005: replacing a goal archives the record it replaces.
- b01-plugins-goal-N01: clearing a goal archives it with status `cleared`.
- b01-plugins-goal-001: each archive file has a name no other archive of the session shares.
- b01-plugins-goal-008: `statusCodeFromError` skips `null`, `undefined` and empty candidates.
- b08-hooks-goal-006: a current record that exists but cannot be read or parsed never falls through to the legacy record.
- b08-hooks-goal-007: an archive file whose JSON is not an object is skipped, and the rest of the history still lists.
- b08-hooks-goal-N01: current-session actions in `goal.cjs` fail with `MISSING_WORKSPACE` when `--workspace` is omitted, and every caller passes it.

### Out of Scope
- Splitting the 3,380-line plugin into modules. Phase 039 recorded that as a P2 that needs a separate change.
- The dispatch-lint, task-dispatch, relaunch and other hook rows of 039 §3. Other phases own them.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/plugins/opencode-goal.js` | Modify | Delete sentinel, archive on replace and clear, unique archive names, continuation objective, status code parsing |
| `.skilled/hooks/goal/lib/goal-core.cjs` | Modify | Current-record read and archive listing |
| `.skilled/hooks/goal/bin/goal.cjs` | Modify | Require `--workspace` for current-session actions |
| `.opencode/plugins/tests/opencode-goal-*.test.cjs` | Modify | A test per plugin finding |
| `.skilled/hooks/goal/lib/goal-core.test.cjs`, `.skilled/hooks/goal/bin/goal.test.cjs` | Modify | A test per core and CLI finding, and `--workspace` on existing CLI calls |
| Callers and docs that run a `goal.cjs` session action | Modify | Pass or document `--workspace` |
| `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/041-goal-held-fixes/` | Create | This packet |
| `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/spec.md` | Modify | Phase map row and handoff row for 041 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A goal is deleted only by an explicit delete. | A mutator returning `null` leaves an existing record on disk; `clearGoal` still removes it. The test fails with the old `null` rule. |
| REQ-002 | Replace and clear keep the prior record in history, and no archive overwrites another. | After a replace, a clear and two `session.deleted` cycles for one session, `history` lists every record. Each test fails on the old code. |
| REQ-003 | The core never serves a legacy record over an unreadable current one, and one bad archive file never hides the rest. | Tests with a malformed current record beside a valid legacy one, and with a JSON `null` archive beside a valid one, fail on the old core. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The continuation prompt of a bound goal carries the packet's current objective. | After a packet criteria edit, the continuation text holds the new criteria. The test fails on the old code. |
| REQ-005 | `statusCodeFromError` finds a later 429 behind a `null` or empty candidate. | `{ statusCode: null, status: 429 }` returns 429. The test fails on the old code. |
| REQ-006 | Current-session CLI actions require `--workspace`. | An omitted `--workspace` prints `code=MISSING_WORKSPACE` and exits 1; every repository caller passes it. |
| REQ-007 | The plugin and the core archive alike. | Both archive on replace and clear, with status `cleared` for a clear. 039's two path-escape tests still pass. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The plugin suite and the hooks node tests are at or above 481 and 836, all passing, and pass on CI at the pushed commit.
- **SC-002**: The live opencode-goal scenario passes on OpenCode 1.19.3 and 2.0.32 after the change.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A caller of a session action omits `--workspace` and starts failing | Med | Search every caller in the repository and update it before the CLI change lands |
| Risk | New archive names break the legacy-name migration in the archive listing | Med | Keep the listing's legacy branch and cover the old canonical name in a test |
| Dependency | The bound packet can be missing at continuation time | Low | Fall back to the stored copy, as the record already holds it, and record the choice |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
