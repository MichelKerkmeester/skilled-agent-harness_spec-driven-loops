---
title: "Feature Specification: Phase 12: regression-test-backfill"
description: "Close the test-coverage gaps both audits independently flagged as the plugin's largest blind spot: the passive-injection transform hook and the full opencode event-handler surface are entirely untested."
trigger_phrases:
  - "goal plugin test coverage"
  - "transform hook test"
  - "session idle autonomy test"
  - "regression test backfill"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/032-goal-opencode-plugin/012-regression-test-backfill"
    last_updated_at: "2026-07-01T10:04:52Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored spec from deep-review DR-009 cluster and deep-research F-013/018/019/020/021/022"
    next_safe_action: "Run /speckit:plan or /speckit:implement on this phase"
    blockers: []
    key_files:
      - ".opencode/plugins/tests/mk-goal-state.test.cjs"
      - ".opencode/plugins/tests/mk-goal-export-contract.test.cjs"
    session_dedup:
      fingerprint: "sha256:887d7b73ec93346c9d535012751e5b70baa6821195f504daad20638f87ef4c4d"
      session_id: "scaffold-032-012"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 12: regression-test-backfill

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-07-01 |
| **Branch** | `032-goal-opencode-plugin` |
| **Parent Spec** | ../spec.md |
| **Phase** | 12 |
| **Predecessor** | 011-command-surface-normalization (pins the corrected behavior, not pre-fix behavior) |
| **Successor** | 013-design-fidelity-and-polish |
| **Handoff Criteria** | Full test suite (existing 6 files + new tests) passes via a fresh `node --test`/direct execution run, pasted as evidence; each new test demonstrably fails against pre-010/011 code (or is annotated why not) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

Both audits independently converged on the same alarming conclusion from different angles: the plugin's headline feature — passive goal injection into every chat turn via `experimental.chat.system.transform` — has **zero** automated test coverage, and 7 of the 9 wired opencode events are untested end-to-end.

**Scope Boundary**: adding tests only. No new `mk-goal.js` runtime behavior changes beyond what's needed to make a test possible (e.g. exposing a seam via `__test` if genuinely missing) — behavior fixes belong to phases 010/011, which must land first so these tests pin the *corrected* contract.

**Dependencies**: phases 010 and 011 must land first.

**Deliverables**: new regression tests closing DR-009-P1-001/002/003, DR-009-P2-001, and research F-013/018/019/020/021/022.

**Changelog**: refresh `../changelog/changelog-032-012-regression-test-backfill.md` when this phase closes.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Research (F-018/019/021) found the `experimental.chat.system.transform` hook — the actual mechanism that injects `[active_goal]` into every turn — is never invoked by any test; the `event()` handler swallows all exceptions with no test asserting on the error path; and 7 of 9 wired events (`session.created`, `message.updated`, permission/question asked+replied, `session.deleted`, `*.disposed`) have zero coverage through the real entrypoint (tests bypass the state machine by writing state directly). Review (DR-009 cluster) independently confirmed no test pins the exact behaviors fixed in phase 010, no test asserts the RICCE metadata field, and no test validates the command/overlay-doc contract. Research (F-013/020/022) adds three more: the autonomy-enabled `session.idle` seam, the `__test` export-contract's key names, and the `mk_goal` tool's real registration path are all unpinned.

### Purpose
Land the missing tests so the plugin's actual opencode-integration surface — not just its internal helper functions — has real regression coverage, and so phase 010's fixes cannot silently regress.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- F-018: a test that invokes the real `experimental.chat.system.transform` hook (not just `renderGoalInjection`/`appendGoalBrief` directly) and asserts on `output.system`.
- F-019: a test asserting the `event()` handler's error path is not silently swallowed without any log/metric (add `MK_GOAL_DEBUG`-gated logging first if none exists, then test it).
- F-021: coverage for the 7 untested event branches via the real `plugin.event()` entrypoint, not direct state writes.
- F-013: an integration test firing `plugin.event({event:{type:'session.idle'}})` against a plugin constructed with `autonomy:'smoke'` and an active goal, asserting a `would_fire`/`smoke_mode` row in `.continuation.log`.
- DR-009-P1-001: regression tests for the whole-block injection cap (DR-001), a semantic sanitizer-bypass fixture (DR-005), a verifier-exception secret-redaction fixture (DR-006), and a stale-verifier/continuation integration test (DR-003) — pinning phase 010's fixes.
- DR-009-P1-002: a test asserting the RICCE metadata field (or the amended spec criterion) from phase 010's REQ-005.
- DR-009-P1-003 + DR-009-P2-001: a command/overlay-doc contract test, and a phase graph-metadata deliverable-drift check.
- F-020: pin the `__test` export contract with a `deepEqual` on all exported seam names, not just a truthy check.
- F-022: a test exercising `plugin.tool.mk_goal.execute` directly (the real tool-registration path), not just the internal `__test.executeGoalAction` helper.

### Out of Scope
- The actual behavior fixes these tests pin — phases 010/011 (must land first).
- The `usage_limited` enum decision and metadata polish — phase 013.
- A live `opencode serve`/TUI end-to-end smoke test — both audits already disclosed this as out of scope for automated testing; this phase closes the *unit/integration* gap, not the live-runtime gap (research F-013's disposition already recommends a metadata note over forcing an unreproducible live test).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/plugins/tests/mk-goal-state.test.cjs` | Modify | Add transform-hook invocation test (F-018), RICCE assertion (DR-009-P1-002) |
| `.opencode/plugins/tests/mk-goal-lifecycle.test.cjs` | Modify | Add the 5 untested event-branch cases (F-021) |
| `.opencode/plugins/tests/mk-goal-continuation.test.cjs` | Modify | Add the autonomy-enabled `session.idle` integration test (F-013), stale-verifier/continuation test (DR-003) |
| `.opencode/plugins/tests/mk-goal-export-contract.test.cjs` | Modify | Pin all `__test` seam key names (F-020) |
| `.opencode/plugins/tests/mk-goal-tool-path.test.cjs` | Modify | Add real `plugin.tool.mk_goal.execute` invocation (F-022), command/overlay-doc contract test (DR-009-P1-003) |
| `.opencode/plugins/mk-goal.js` | Modify (minimal) | Only if a genuinely missing test seam must be exposed (e.g. error-path logging for F-019); no behavior changes beyond what makes testing possible |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | [F-018] Test the real `experimental.chat.system.transform` hook. | A test constructs the plugin via its factory, calls the returned transform hook directly, and asserts `output.system` contains the expected `[active_goal]` block content. |
| REQ-002 | [F-021] Cover the 7 untested event branches through `plugin.event()`, not direct state writes. | `session.created`, `message.updated`, permission/question asked+replied, `session.deleted`, `*.disposed` each have at least one assertion driven by a real `plugin.event({event:{...}})` call. |
| REQ-003 | [DR-009-P1-001] Pin phase 010's 4 fixes (DR-001/003/005/006) with dedicated regression tests. | Each of the 4 fixes has a test that would fail against the pre-fix behavior (verify by temporarily reverting the fix locally and confirming the new test catches it, then restore). |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | [F-013] Autonomy-enabled `session.idle` integration test. | A test constructs the plugin with `autonomy:'smoke'` and an active goal, fires `session.idle`, and asserts a `would_fire`/`smoke_mode` row lands in `.continuation.log`. |
| REQ-005 | [F-019] Error-path assertion for `event()`. | A test triggers an exception inside a handler and asserts the failure is observable (logged under `MK_GOAL_DEBUG`, or another chosen non-silent signal) rather than purely swallowed. |
| REQ-006 | [DR-009-P1-002] RICCE metadata assertion. | A test asserts the field/behavior phase 010's REQ-005 landed (metadata field or spec-amendment-compliant structural check). |
| REQ-007 | [DR-009-P1-003 / DR-009-P2-001] Command/overlay-doc contract test + graph-metadata drift check. | A test greps or reads the live command filename and confirms referencing docs/catalogs agree; a lightweight check flags non-deliverable files in phase `graph-metadata.json` `key_files`. |
| REQ-008 | [F-020] Pin `__test` export-contract key names. | `assert.deepEqual(Object.keys(__test).sort(), [...expected 14+ names])` replaces the current truthy-only check. |
| REQ-009 | [F-022] Real `mk_goal` tool-registration path test. | A test calls `plugin.tool.mk_goal.execute(...)` (via the factory-returned hooks), not just `__test.executeGoalAction`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Full test suite (existing 6 files, expanded) passes via a fresh run, pasted as evidence — not cited from a prior run.
- **SC-002**: Each new test in REQ-001 through REQ-004 demonstrably exercises the real integration seam (transform hook, event handler, tool registration) rather than only the internal helper — spot-check by temporarily reverting one underlying fix and confirming the corresponding new test fails.
- **SC-003**: `__test` export contract (REQ-008) is key-pinned, not truthy-only.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 010 and 011 must land first — these tests pin the *corrected* behavior. | High | Do not start this phase until 010/011's `implementation-summary.md` both show fresh passing evidence. |
| Risk | Writing a test that merely re-asserts the current (possibly still-buggy) behavior rather than the intended-correct behavior, if 010/011 haven't actually landed. | Medium | REQ-003/SC-002's "would fail against pre-fix behavior" check guards against this — a test that passes against both old and new code isn't testing the fix. |
| Risk | F-013's live-runtime gap could tempt a test author to fake `session.idle` observability rather than genuinely exercising the code path. | Low | Use the plugin's own `event()` entrypoint with a real `session.idle` event shape (per the SDK types already confirmed during the original design research), not a mocked shortcut. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- REQ-005: does closing F-019 require adding new logging to `mk-goal.js` (a small behavior change), or can the error path be tested by asserting on some other existing observable (e.g. a state field left unmodified)? Decide during planning — if logging must be added, note it as a minimal, test-enabling change, not scope creep into phase 010/011 territory.
<!-- /ANCHOR:questions -->
