---
title: "Record-Replay Cassette Harness for Convergence Regression"
description: "There is no way to regression-test convergence-script behavior after a code change without re-running the full live loop: convergence math changes cannot be verified against historical dispatch patterns without a deterministic replay mechanism."
trigger_phrases:
  - "record replay cassette"
  - "cassette harness"
  - "002 record replay"
  - "convergence regression"
  - "recordScriptRun replayScriptRun"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/024-deep-loop-improved/007-testing/002-record-replay-cassette-harness"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-sonnet"
    recent_action: "Authored leaf spec for 002-record-replay-cassette-harness"
    next_safe_action: "Author plan.md and tasks.md after 001-hermetic-test-isolation completes"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/tests/helpers/spawn-cjs.ts"
      - ".opencode/skills/deep-loop-runtime/tests/integration/convergence-script.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Record-Replay Cassette Harness for Convergence Regression

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 2 |
| **Predecessor** | 001-hermetic-test-isolation |
| **Successor** | None |
| **Handoff Criteria** | `validate.sh --strict` passes; `recordScriptRun` / `replayScriptRun` exported from spawn-cjs.ts; convergence-script regression baseline pinned in vitest |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is Phase 2 of 2 within `007-testing`.

**Scope Boundary**: `spawn-cjs.ts` helper additions (`recordScriptRun`, `replayScriptRun`) and `convergence-script.vitest.ts` regression test. No production runtime changes.

**Hard dependency**: 001-hermetic-test-isolation must be complete before this phase is planned. The cassette harness records into isolated temp dirs — without hermetic isolation, recorded fixtures may contain real paths or cross-contaminate other test state.

**Dependencies**:
- 001-hermetic-test-isolation: complete (hard dependency)
- `convergence.cjs` script: must be runnable via `spawn-cjs.ts`; no production code changes needed

**Deliverables**:
- `recordScriptRun(scriptPath, argv, opts)` and `replayScriptRun(cassetteId, scriptPath, argv, opts)` in `spawn-cjs.ts`
- At least one cassette pinned for `convergence.cjs` with a known dispatch envelope baseline
- `convergence-script.vitest.ts` integration test using the cassette for regression

**Changelog**:
- When this phase closes, refresh `../changelog/` using `156-testing-002`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Convergence math in `convergence.cjs` is modified frequently (score-delta, observation-threshold, time-decay, fuzzy-merge) but there is no way to verify that a change does not regress existing convergence behavior without re-running a full live deep-loop session. There are no fixture-based integration tests that can replay a known dispatch pattern and assert convergence outcomes deterministically.

### Purpose
Add `recordScriptRun()` and `replayScriptRun()` to `spawn-cjs.ts` that capture normalized dispatch envelopes (argv/stdin/stdout/exit) from a real run and replay them deterministically in a hermetic environment, so `convergence-script.vitest.ts` can pin a convergence baseline and catch regressions without live MCP calls.

> **Reference**: `external/kasper/tests/e2e/harness.ts:101-386`; `src/evaluate.ts:621-727`; `external/loop-cli-main/src/types.ts:50-58` — `recordHarnessRun()` captures normalized dispatch envelopes (redacting real paths/tokens by default); `replayHarnessRun()` drives the script under test with recorded envelopes and compares normalized stdout/exit against the cassette. (Research: research.md §5.6, iter 50)
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `recordScriptRun(scriptPath, argv, opts): CassetteId` in `spawn-cjs.ts`: runs a real script invocation, captures normalized dispatch envelopes (argv/stdin/stdout/exit), stores as cassette
- `replayScriptRun(cassetteId, scriptPath, argv, opts)` in `spawn-cjs.ts`: drives the script with recorded envelopes in a hermetic environment, compares normalized stdout/exit against cassette
- Redaction: real paths, tokens, and timestamps replaced with deterministic placeholders in cassette by default
- One pinned cassette for `convergence.cjs` capturing a known 3-iteration dispatch pattern
- `convergence-script.vitest.ts` regression test using the cassette: assert convergence outcome matches baseline after code changes

### Out of Scope
- Full MCP session replay (live MCP calls are not captured; only `spawn-cjs.ts`-level dispatch envelopes)
- Cassette management UI or CLI — file-based cassettes only (stored in `tests/fixtures/cassettes/`)
- Record mode for other scripts beyond `convergence.cjs` — future consumers; infrastructure is general-purpose

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-runtime/tests/helpers/spawn-cjs.ts` | Modify | Add `recordScriptRun()` and `replayScriptRun()` with redaction and hermetic env integration |
| `.opencode/skills/deep-loop-runtime/tests/integration/convergence-script.vitest.ts` | Modify | Add cassette-based regression test using `replayScriptRun`; pin baseline |
| `.opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts` | Modify | Optional: wire cassette for fan-out dispatch regression (if scope permits) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `replayScriptRun` drives `convergence.cjs` with a recorded cassette and exits deterministically (same exit code and normalized stdout on every replay) | Run `replayScriptRun` 3× with the same cassette → assert identical normalized output each time |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | `convergence-script.vitest.ts` detects a convergence regression: if `convergence.cjs` output changes, the test fails | Introduce a deliberate one-line change to `convergence.cjs` → assert `convergence-script.vitest.ts` fails with a diff showing the changed output |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `vitest run tests/integration/convergence-script.vitest.ts` passes against the pinned cassette; a deliberate output change causes it to fail
- **SC-002**: `validate.sh --strict` on this folder exits 0
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Cassette fixtures contain real paths or tokens despite redaction | Medium — security/privacy concern if committed to repo | Redaction is on by default; CI lint check scans cassettes for known-sensitive patterns before commit |
| Risk | Cassette becomes stale as `convergence.cjs` evolves, causing false failures | Medium — maintainability burden | Version cassettes alongside the script; include a `cassette:update` test mode to re-record |
| Dependency | 001-hermetic-test-isolation must be complete | Hard — unclean HOME corrupts recorded cassette fixtures | Enforce in plan: 001 Status must be Complete before this plan is authored |

> **Note**: Tagged `easy-med/quick-win` in research §5.6. The cassette mechanism is general-purpose; only the convergence baseline is pinned in this leaf. (Research: research.md §5.6, iter 50)
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should cassette fixtures be committed to the repo under `tests/fixtures/cassettes/` or generated on first test run and gitignored?
- What is the redaction strategy for timestamps — replace with a fixed epoch or normalize to relative offsets?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->

<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
