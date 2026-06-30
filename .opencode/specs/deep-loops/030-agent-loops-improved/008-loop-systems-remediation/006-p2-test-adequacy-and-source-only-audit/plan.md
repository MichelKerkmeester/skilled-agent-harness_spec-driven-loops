---
title: "Implementation Plan: P2 Test Adequacy and Source-Only Audit"
description: "Plan for replacing the sequential JSONL append test with a genuinely concurrent child-process harness through the real append fn."
trigger_phrases:
  - "p2 test adequacy plan"
  - "genuinely concurrent jsonl append test plan"
  - "child process append harness plan"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-agent-loops-improved/008-loop-systems-remediation/006-p2-test-adequacy-and-source-only-audit"
    last_updated_at: "2026-06-29T14:45:00Z"
    last_updated_by: "claude"
    recent_action: "Planned and implemented the concurrent append harness"
    next_safe_action: "Finalize the 009 parent and 156 parent metadata"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/tests/unit/jsonl-repair.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "p2-test-adequacy-2026-06-29"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "A control-dir file barrier releases both child writers together so they race, which an in-process barrier could not achieve without timing out."
---
# Implementation Plan: P2 Test Adequacy and Source-Only Audit

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Vitest TypeScript tests over Node CommonJS runtime |
| **Framework** | deep-loop-runtime test suite |
| **Storage** | Hermetic temp JSONL files |
| **Testing** | Child-process spawn via `tsx`, control-dir file barrier |

### Overview
A child writer script imports the real `appendJsonlRecord`, signals readiness through a control directory, waits for a `start` file, then appends its records. The test spawns two such writers, waits until both signal ready, writes `start` to release them together, awaits both, and asserts every row survives and the file needs no repair.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Sequential test and its weakness identified
- [x] Real append fn and barrier pattern chosen
- [x] Stability strategy defined

### Definition of Done
- [x] Child-process append writer and runner helpers added
- [x] Sequential test replaced with the concurrent harness
- [x] Full deep-loop-runtime suite green
- [x] Rewritten test verified stable across repeated runs
- [x] Docs updated with current verification state
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Cross-process control-dir barrier mirroring the atomic-state concurrent append test.

### Key Components
- **`writeAppendWriter`**: Emits a child script that appends through `appendJsonlRecord` after the barrier releases.
- **`runAppendWriter`**: Spawns the child writer with `tsx` and resolves its exit/stdout/stderr.
- **Control-dir barrier**: `<writer>.ready` files plus a `start` file release both writers together.

### Data Flow
Both writers spawn, each writes its `ready` marker and blocks on `start`; the test writes `start` once both are ready, the writers race their appends, and the test reads back the JSONL to assert row preservation.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## Fix Addendum: Affected Surfaces

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `jsonl-repair.vitest.ts` append test | Ran two writers sequentially via blocking spawnSync. | Replace with a barrier-synchronized concurrent harness. | Test file passes repeatedly; full suite green. |
| `appendJsonlRecord` | Production append fn. | Now exercised under genuine concurrency. | Records survive parseable; `repairJsonlTail` clean. |
| atomic-state concurrent append test | Already genuine. | Unchanged. | Remains green in the suite. |

Required inventories:
- Confirmed `appendJsonlRecord` is an `O_APPEND` write whose per-record atomicity is the property under test.
- Confirmed the suite runs files non-parallel with a 30s test timeout, so the barrier deadlines are safe.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the sequential append test and the atomic-state genuine pattern
- [x] Read `appendJsonlRecord` and the `spawn-cjs` helper
- [x] Confirm the suite timeout and parallelism config

### Phase 2: Core Implementation
- [x] Add the `writeAppendWriter` and `runAppendWriter` helpers
- [x] Replace the sequential test with the concurrent barrier harness
- [x] Add the missing `existsSync` / `mkdirSync` / `sleep` imports

### Phase 3: Verification
- [x] Run the rewritten test in isolation
- [x] Run the full deep-loop-runtime suite
- [x] Re-run the test five times to confirm stability
- [x] Update Level-1 phase docs
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The rewritten concurrent append test | `npx vitest run tests/unit/jsonl-repair.vitest.ts` |
| Suite | All deep-loop-runtime tests | `PATH=/opt/homebrew/bin:$PATH npm test` |
| Stability | Repeated isolated runs of the rewritten test | Five consecutive `npx vitest run` invocations |
| Spec validation | Level-1 phase docs | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <folder> --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Node at `/opt/homebrew/bin` | External runtime | Green | Cannot run the suite |
| `tsx` loader | External dev dependency | Green | Child writer cannot import the TS append fn |
| `appendJsonlRecord` | Internal contract | Green | No real append fn to exercise |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The rewritten test proves flaky under the suite or the barrier cannot release reliably.
- **Procedure**: Revert the `jsonl-repair.vitest.ts` changes to the prior test and restore the prior docs state for this phase.
<!-- /ANCHOR:rollback -->
