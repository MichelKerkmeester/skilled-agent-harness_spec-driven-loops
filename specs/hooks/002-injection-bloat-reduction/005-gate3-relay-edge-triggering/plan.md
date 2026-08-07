---
title: "Implementation Plan: Gate-3 Relay Edge-Triggering"
description: "Plan to add a delivery-state suppression predicate for the Gate-3 relay, shadow-first and flag-gated, so an unchanged repeated relay is suppressed while gate state is open without touching classification or enforcement."
trigger_phrases:
  - "gate 3 relay plan"
  - "edge-triggered gate delivery plan"
  - "gate matrix negative controls"
importance_tier: "important"
contextType: "implementation"
parent: "hooks"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/005-gate3-relay-edge-triggering"
    last_updated_at: "2026-08-06T00:00:00Z"
    last_updated_by: "opus"
    recent_action: "Authored the implementation plan for Gate-3 relay edge-triggered delivery suppression"
    next_safe_action: "Begin Phase 1 (shadow instrumentation) once Phase 001 receipts land"
    blockers:
      - "001-measurement-and-receipts-foundation has not yet been built"
    key_files:
      - ".opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-06-hooks-002-005"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Gate-3 Relay Edge-Triggering

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (ESM, `.mjs`) |
| **Framework** | system-spec-kit MCP hook adapters (`spec-gate` module) |
| **Storage** | In-memory/session-scoped gate state; no database |
| **Testing** | Existing spec-gate unit/adapter test suite; new gate-matrix negative-control rows |

### Overview
Add a delivery-state suppression predicate beside `GATE_3_QUESTION` in `spec-gate-core.mjs` that keys on session, lifecycle epoch, and a gate-state hash. When the predicate finds a proven, unchanged prior delivery within the same open epoch, it suppresses re-delivery of the identical relay text while leaving `classifyIntent` and enforcement completely untouched. The candidate ships shadow-first (measurement only, no output change) and stays off by default behind its own independent flag until an 11-row gate-matrix negative-control suite passes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (unchanged-repeat Gate-3 relay suppression, delivery-only)
- [x] Success criteria measurable (shadow-diff, 11-row matrix pass rate, byte-suppression proof, grep-proof of enforcement isolation)
- [x] Dependencies identified (Phase 001 receipts, 004's shadow pattern)

### Definition of Done
- [ ] All acceptance criteria met (REQ-001 through REQ-006)
- [ ] Tests passing (11-row gate-matrix negative-control suite)
- [ ] Docs updated (spec/plan/tasks/checklist/implementation-summary, this packet)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Predicate-gated suppression: a pure function computes a delivery key (session, epoch, gate-state hash) and consults shadow-tracked delivery state; only a proven prior delivery of the same key suppresses re-emission. Classification and enforcement remain a separate, unmodified code path.

### Key Components
- **Suppression predicate (new, `spec-gate-core.mjs`)**: Computes the session+epoch+gate-state-hash key and checks delivery state; returns suppress/emit, never touches `classifyIntent`.
- **`GATE_3_QUESTION` delivery site**: Consults the predicate immediately before emission; unaffected paths (first-ask, invalid-answer, task/scope-change, recovery) always resolve to emit.
- **Shadow receipt logger**: Records planned suppress/emit decisions and their outcome without altering the actual output, for parity comparison before activation.

### Data Flow
1. A mutation-positive turn reaches the Gate hook; `classifyIntent` runs unchanged and produces its verdict.
2. If the verdict requires a Gate-3 relay, the new suppression predicate computes the delivery key and checks shadow-tracked state.
3. In shadow mode, the predicate's decision is logged only; the existing full-emission behavior is unchanged.
4. After the predicate is proven safe (11-row matrix green, shadow diff empty), the flag activates and real suppression begins for the repeated-unchanged-positive case only.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm Phase 001 canonical block IDs, hashes, and delivery-receipt fields are available to reuse
- [ ] Locate the exact `GATE_3_QUESTION` emission site and the `classifyIntent` boundary in `spec-gate-core.mjs`
- [ ] Draft the session+epoch+gate-state-hash key shape

### Phase 2: Core Implementation
- [ ] Implement the suppression predicate as a pure function, independent of `classifyIntent`
- [ ] Wire the predicate into the `GATE_3_QUESTION` delivery site behind an independent flag, shadow-only
- [ ] Add shadow-receipt logging for every suppress/emit decision

### Phase 3: Verification
- [ ] Author and run the 11-row gate-matrix negative-control suite
- [ ] Confirm shadow-mode output diff against baseline is empty
- [ ] `rg` the suppression predicate to confirm it has no call sites inside `classifyIntent` or the enforcement branch
- [ ] Document the per-block rollback (disable flag, clear delivery state, full baseline emission)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Negative control | 11-row gate-matrix suite (read-only, first positive, repeated-unchanged positive, invalid answer, valid A-E, new task/scope, recovery, enforcement denial, child bypass, disabled, error) | Existing spec-gate test runner |
| Shadow parity | Suppress/emit decisions vs. actual baseline output | Shadow receipt diff |
| Static proof | No suppression-predicate call sites inside `classifyIntent`/enforcement | `rg` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 001-measurement-and-receipts-foundation | Internal (sibling phase) | Not yet built | This candidate cannot activate without shared receipt fields; shadow planning can still proceed against the current interface |
| 004-full-first-route-only-repeats shadow pattern | Internal (sibling phase) | Not yet built | Reuse deferred; this candidate builds equivalent shadow receipts directly if 004 has not landed |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any gate-matrix row regresses, a false-negative suppression is observed, or shadow-mode output diff is non-empty.
- **Procedure**: Disable the candidate's independent flag, clear its delivery state, and confirm the relay returns to full baseline emission on every mutation-positive turn.
<!-- /ANCHOR:rollback -->
