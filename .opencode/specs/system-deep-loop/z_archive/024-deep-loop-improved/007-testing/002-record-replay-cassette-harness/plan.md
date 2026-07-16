---
title: "Implementation Plan: Record-Replay Cassette Harness for Convergence Regression"
description: "Documents the completed record/replay cassette helper and convergence regression fixture work."
trigger_phrases:
  - "record replay cassette"
  - "cassette harness"
  - "convergence regression"
  - "recordScriptRun replayScriptRun"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/024-deep-loop-improved/007-testing/002-record-replay-cassette-harness"
    last_updated_at: "2026-07-01T22:50:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold content with spec-grounded complete info"
    next_safe_action: "Regenerate metadata and run recursive strict validation"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/tests/helpers/spawn-cjs.ts"
      - ".opencode/skills/deep-loop-runtime/tests/integration/convergence-script.vitest.ts"
      - ".opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts"
    session_dedup:
      fingerprint: "sha256:1111111111111111111111111111111111111111111111111111111111111111"
      session_id: "scaffold-content-remediation-005"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Record-Replay Cassette Harness for Convergence Regression

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript vitest helpers and CommonJS convergence script integration tests |
| **Framework** | Deep-loop-runtime spawn helper with hermetic env and cassette fixtures |
| **Storage** | Normalized cassette files under test fixtures |
| **Testing** | Cassette replay determinism test, convergence regression fixture, strict spec validation |

### Overview
This completed work added record/replay helpers for deterministic convergence-script regression testing. The cassette harness records normalized argv, stdin, stdout, and exit envelopes from a real script run, redacts sensitive values, and replays the same envelope in a hermetic environment without live MCP calls.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear: convergence changes could not be regression-tested without a live loop run.
- [x] Success criteria measurable: replaying the same cassette produces identical normalized output and exit code.
- [x] Dependencies identified: hermetic test isolation must be complete before recording fixtures.

### Definition of Done
- [x] `spawn-cjs.ts` exports `recordScriptRun()` and `replayScriptRun()`.
- [x] Cassette recording normalizes argv, stdin, stdout, exit, paths, timestamps, and tokens.
- [x] `convergence-script.vitest.ts` pins at least one known convergence baseline.
- [x] Replaying the cassette repeatedly is deterministic.
- [x] A deliberate convergence output change causes the regression test to fail with a diff.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Hermetic record/replay fixture: record mode captures normalized script envelopes once, replay mode drives the script with those envelopes and compares normalized outputs without external services.

### Key Components
- **`recordScriptRun(scriptPath, argv, opts)`**: Runs a real script invocation and writes a normalized cassette.
- **`replayScriptRun(cassetteId, scriptPath, argv, opts)`**: Replays the recorded envelope and compares normalized output and exit code.
- **Redaction layer**: Replaces paths, tokens, and timestamps with deterministic placeholders.
- **`convergence-script.vitest.ts`**: Uses a pinned cassette for a known convergence baseline.

### Data Flow
Record mode runs `convergence.cjs` under a hermetic environment, captures argv/stdin/stdout/exit, normalizes sensitive values, and stores a cassette. Replay mode loads the cassette, drives the same script path and argv, normalizes the new result, and compares it to the baseline so convergence regressions fail deterministically.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `spawn-cjs.ts` | Shared script-spawn helper | Add record and replay helpers | Same cassette replays identically 3 times |
| Cassette fixtures | Store normalized baselines | Redact paths, tokens, and timestamps | Fixture scan finds no real paths or tokens |
| `convergence-script.vitest.ts` | Integration regression test | Add cassette-based convergence baseline | Deliberate output change fails with diff |
| Hermetic env helper | Isolates paths during record/replay | Reuse from phase 001 | Cassettes contain placeholder paths only |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the completed spec and confirm cassette harness scope.
- [x] Confirm hermetic test isolation is complete before recording cassettes.
- [x] Keep full MCP session replay and cassette UI out of scope.

### Phase 2: Core Implementation
- [x] Add `recordScriptRun()` to capture normalized dispatch envelopes.
- [x] Add `replayScriptRun()` to compare replay output with a cassette.
- [x] Redact real paths, tokens, and timestamps by default.
- [x] Store a convergence baseline cassette under test fixtures.
- [x] Add `convergence-script.vitest.ts` regression coverage using the cassette.
- [x] Wire optional fan-out cassette coverage when scope permits.

### Phase 3: Verification
- [x] Verify the same cassette replays deterministically multiple times.
- [x] Verify convergence-script regression test passes against the baseline.
- [x] Verify a deliberate convergence output change fails with a diff.
- [x] Verify cassettes do not contain real paths, tokens, or timestamps.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Record/replay helper normalization and redaction | Vitest helper fixtures |
| Integration | `convergence.cjs` replay against pinned cassette | `convergence-script.vitest.ts` |
| Mutation check | Deliberate convergence output change fails | Local one-line change and restore |
| Spec validation | Leaf packet structure | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Hermetic test isolation | Internal predecessor | Complete | Cassette fixtures may leak real paths without isolation |
| `convergence.cjs` script runnable through spawn helper | Internal | Complete | No baseline can be recorded if script cannot run through helper |
| Full MCP session replay | Out of scope | Not required | This leaf captures script-level dispatch envelopes only |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Cassette replay is nondeterministic, fixtures leak sensitive paths or tokens, or convergence tests become stale false failures.
- **Procedure**: Remove `recordScriptRun()`, `replayScriptRun()`, pinned cassettes, and convergence replay tests, then fall back to live convergence checks until the cassette contract is repaired.
<!-- /ANCHOR:rollback -->
