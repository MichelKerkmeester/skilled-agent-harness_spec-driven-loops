---
title: "Implementation Plan: Phase 12: regression-test-backfill"
description: "Add tests for the transform hook, the 7 untested event branches, autonomy-enabled session.idle, and pin phase 010/011's fixes."
trigger_phrases:
  - "implementation"
  - "plan"
  - "regression test backfill"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/032-goal-opencode-plugin/012-regression-test-backfill"
    last_updated_at: "2026-07-01T10:04:52Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored plan from deep-review + deep-research findings"
    next_safe_action: "Run /speckit:implement on this phase (after 010/011 land)"
    blockers:
      - "Depends on phases 010 and 011 landing first"
    key_files:
      - ".opencode/plugins/tests/mk-goal-state.test.cjs"
    session_dedup:
      fingerprint: "sha256:ab2df1dae0689f29ad11298444a257008b13930347b4f460bacb4dc85d886937"
      session_id: "scaffold-032-012"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 12: regression-test-backfill

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js `node:test`/`node:assert` (plain scripts run via `node <file>`, matching this packet's existing convention) |
| **Framework** | Direct plugin-factory instantiation (`MkGoalPlugin(ctx, opts)`) + `__test` seam, per the existing 6-file suite's pattern |
| **Storage** | Temp state dirs via `mkdtemp`, same convention as existing tests |
| **Testing** | This phase IS the testing work — no separate test framework introduced |

### Overview
Extend the existing 6 test files (no new files, to keep the suite's current structure) with tests that exercise the real integration seams — the transform hook via the plugin factory, the event handler via `plugin.event()`, and the tool-registration path via `plugin.tool.mk_goal.execute` — following the exact calling convention already established in `mk-goal-tool-path.test.cjs` (`ctx = {sessionID, messageID, agent}`, `opts = {stateDir}`, factory call `MkGoalPlugin({client, directory, worktree}, opts)`).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phases 010 and 011 have landed with fresh passing evidence in their `implementation-summary.md`
- [x] Problem statement clear and scope documented (spec.md)
- [x] Success criteria measurable (suite passes + each new test fails against pre-fix behavior)

### Definition of Done
- [ ] All 9 requirements (REQ-001–009) met
- [ ] Full suite passes on a fresh run
- [ ] Each new test verified to fail against the corresponding pre-fix code (SC-002 spot-check)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Extend existing `node:assert`-based test files; no new test framework.

### Key Components
- **`MkGoalPlugin` factory** (`mk-goal.js:1513`): call directly to get real hooks (`event`, `experimental.chat.system.transform`, `tool`) for REQ-001/002/009.
- **`__test` export seam** (`mk-goal.js:1658-1674`): internal helpers for setup/assertions; REQ-008 pins its exact key set.
- **`.continuation.log`**: file-based evidence for REQ-004's autonomy-enabled `session.idle` test.

### Data Flow
Tests call the factory to get real hooks, invoke them with realistic event/tool-call shapes (matching the `@opencode-ai/plugin`/`@opencode-ai/sdk` types already confirmed during the original design research), then assert on `output.system`, `.continuation.log` contents, or returned tool-execute strings.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase closes test-coverage gaps flagged by a deep-review CONDITIONAL verdict and deep-research's independent test-suite coverage-mapping iteration (research iteration 8's Coverage Map).

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `experimental.chat.system.transform` hook | Untested (F-018) | Add direct invocation test | New test fails if `appendGoalBrief` is stubbed out; passes against real code |
| `event()` handler, 7 branches | Untested via real entrypoint (F-021) | Add `plugin.event()`-driven tests per branch | Each branch's test fails if that branch is commented out |
| `session.idle` autonomy-enabled path | Untested (F-013) | Add `autonomy:'smoke'` integration test | Test fails if `maybeContinueGoal`'s smoke branch is stubbed |
| `redactEvidence`/sanitizer/injection-clamp/stale-verifier (phase 010 fixes) | Newly fixed, unpinned (DR-009-P1-001) | Add dedicated regression tests | Test fails against a local revert of each phase-010 fix |
| RICCE metadata (phase 010 REQ-005) | Newly added/amended, unpinned (DR-009-P1-002) | Add assertion | Test fails against a local revert |
| Command/overlay-doc contract (DR-009-P1-003) | Unvalidated by any test | Add a lightweight contract test | Test fails if command doc and catalog/playbook paths disagree |
| Phase graph-metadata `key_files` (DR-009-P2-001) | No drift check | Add a lightweight check | Test fails if a non-deliverable file reappears in `key_files` |
| `__test` export contract | Truthy-only (F-020) | `deepEqual` on sorted key names | Test fails if a seam is renamed/removed |
| `plugin.tool.mk_goal.execute` | Only exercised indirectly (F-022) | Add direct invocation test | Test fails if tool registration is broken while the internal helper still works |

Required inventories:
- Same-class producers: `rg -n 'node --test|node "\$f"\|assert\.' .opencode/plugins/tests/*.test.cjs` to confirm the existing test-running convention (plain `node <file>` execution, not `node --test` runner) before adding new assertions in the same style.
- Consumers of changed symbols: N/A — this phase adds tests, it does not change consumed symbols (beyond the minimal REQ-005 exception noted in spec.md's Open Question).
- Matrix axes: (a) transform hook happy-path vs error/fail-open path, (b) each of 7 event branches independently, (c) autonomy off vs `smoke` vs `active` for `session.idle`, (d) each of the 4 phase-010 fixes' before/after behavior, (e) tool-registration path vs internal-helper path.
- Algorithm invariant: every new test must be demonstrably capable of failing (i.e., not vacuously true) — confirmed via the SC-002 revert-and-check spot-check during Verification.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm phases 010 and 011 have landed (check their `implementation-summary.md` for fresh passing evidence).
- [ ] Re-read the current live `mk-goal.js` factory/event/tool-registration code (lines ~1513-1676) to confirm the calling conventions this plan assumes still hold.

### Phase 2: Core Implementation
- [ ] REQ-001: transform-hook invocation test.
- [ ] REQ-002: 7 event-branch tests via `plugin.event()`.
- [ ] REQ-003: 4 regression tests pinning phase 010's fixes.
- [ ] REQ-004: autonomy-enabled `session.idle` test.
- [ ] REQ-005: error-path assertion for `event()`.
- [ ] REQ-006: RICCE metadata assertion.
- [ ] REQ-007: command/overlay-doc contract test + graph-metadata drift check.
- [ ] REQ-008: `__test` export-contract key-pinning.
- [ ] REQ-009: real `mk_goal` tool-registration test.

### Phase 3: Verification
- [ ] Full suite passes on a fresh run.
- [ ] SC-002 spot-check: temporarily revert one phase-010 fix, confirm the corresponding new test fails, then restore.
- [ ] `implementation-summary.md` filled with fresh evidence.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit (new) | Transform hook, event branches, tool registration, export contract | `node:assert` in the existing `.test.cjs` style |
| Integration (new) | Autonomy-enabled `session.idle`, stale-verifier/continuation | Same, via the real `plugin.event()`/factory entrypoints |
| Regression (all) | Full suite, existing + new | `node --test` / direct `node <file>` execution across all files |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| Phase 010 (security-and-correctness-fixes) | Internal | Must land first | Cannot pin fixes that don't exist yet |
| Phase 011 (command-surface-normalization) | Internal | Must land first | Command/overlay-doc contract test needs the final filename |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a new test is flaky, vacuously true, or breaks the existing suite's execution convention.
- **Procedure**: new tests are additive to existing files; revert via `git diff`/`git checkout -- <test-file>` per file, no state-file or schema migration involved.
<!-- /ANCHOR:rollback -->
