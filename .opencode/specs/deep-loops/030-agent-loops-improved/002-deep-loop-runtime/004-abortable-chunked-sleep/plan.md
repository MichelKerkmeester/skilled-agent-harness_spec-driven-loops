---
title: "Implementation Plan: Phase 4: Abortable Chunked Sleep"
description: "Plan for the shipped AbortSignal-aware chunked sleep primitive and executor-boundary signal composition."
trigger_phrases:
  - "abortable-chunked-sleep"
  - "cancellable-sleep-primitive"
  - "abortsignal-sleep"
  - "chunked-sleep-abort"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-agent-loops-improved/002-deep-loop-runtime/004-abortable-chunked-sleep"
    last_updated_at: "2026-07-01T21:26:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold plan with shipped abortable-sleep content from spec.md"
    next_safe_action: "Use this plan as documentation for the completed cancellable sleep primitive"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/lib/deep-loop/sleep.ts"
      - ".opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts"
    session_dedup:
      fingerprint: "sha256:004a5e7c9d2b4f6081c3e5a7890b2d4f6a8c0e2d4f6b8a0c2e4d6f8a1b3c5d9b"
      session_id: "scaffold-content-remediation-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: Abortable Chunked Sleep

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript deep-loop runtime library |
| **Framework** | Node.js timers with `AbortSignal` cancellation |
| **Storage** | None |
| **Testing** | Spec acceptance requires abort within 200 ms, timeout cleanup, listener cleanup, and TypeScript compilation; no dedicated test file is named in spec.md |

### Overview
This phase shipped `.opencode/skills/deep-loop-runtime/lib/deep-loop/sleep.ts` with `abortableSleep(ms, signal?)`. The primitive waits in 200 ms chunks, rejects with `signal.reason` when aborted, clears pending timers, removes listeners, and is wired at the executor boundary through `AbortSignal.any` composition in `executor-audit.ts`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented: bare `setTimeout` waits could not be cancelled.
- [x] Success criteria measurable: abort rejects within one 200 ms chunk and natural completion removes the listener.
- [x] Dependencies identified: this is a new primitive with no dependency on phases 1-3.

### Definition of Done
- [x] `sleep.ts` created and exports `abortableSleep(ms, signal?)`.
- [x] Sleep waits in `SLEEP_CHUNK_MS` chunks and checks cancellation between chunks.
- [x] Abort clears pending timeout, removes listener, and rejects with `signal.reason`.
- [x] Natural completion removes abort listener.
- [x] `executor-audit.ts` composes run and shutdown signals with `AbortSignal.any`.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shared cancellable timing primitive plus executor-boundary signal composition.

### Key Components
- **`abortableSleep`**: Shared sleep helper that chunks long waits and observes an optional `AbortSignal`.
- **`SLEEP_CHUNK_MS`**: 200 ms maximum chunk interval, matching the spec's cancellation latency target.
- **Executor signal composition**: `executor-audit.ts` combines per-run abort and global shutdown signals so downstream waits can be cancelled consistently.

### Data Flow
Executor code creates or receives abort signals at the run boundary and composes them with `AbortSignal.any`. Call sites can pass the composed signal to `abortableSleep`; the helper schedules chunked timers, resolves on elapsed time, or cancels immediately on abort by clearing the current timeout and rejecting with the signal's reason.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/sleep.ts` | New shared cancellable wait helper | Create and export `abortableSleep` | Spec acceptance checks abort and cleanup behavior |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts` | Executor run boundary | Compose per-run and shutdown signals with `AbortSignal.any` | TypeScript compilation and spec acceptance |
| Existing bare `setTimeout` waits | Transitional unmigrated callers | Listed for follow-up, not fully migrated here | Spec marks broad migration out of scope |

Required inventories:
- Same-class producers: identify existing bare `setTimeout` waits before migration work.
- Consumers of changed symbols: future wait call sites should adopt `abortableSleep`; this phase adds the primitive and one wiring point.
- Matrix axes: no signal, pre-aborted signal, mid-sleep abort, natural completion, listener cleanup, and executor signal composition.
- Algorithm invariant: an aborted sleep must not leave a pending timeout or abort listener behind.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm a new `sleep.ts` module is the shared location for cancellable waits.
- [x] Confirm `executor-audit.ts` is the run-boundary wiring point for signal composition.

### Phase 2: Core Implementation
- [x] Created `abortableSleep(ms, signal?)` with 200 ms chunked waiting.
- [x] Implemented abort handling that clears timeout state, removes the listener, and rejects with `signal.reason`.
- [x] Implemented natural-completion cleanup to remove the abort listener.
- [x] Wired `AbortSignal.any` at the executor run boundary.

### Phase 3: Verification
- [x] Verified abort during sleep rejects within one `SLEEP_CHUNK_MS` interval.
- [x] Verified timeout and listener cleanup for abort and natural completion paths.
- [x] Verified TypeScript compilation expectations for the new module and executor signal wiring.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit/behavior | Abort during `abortableSleep`; natural completion; listener/timeout cleanup | Spec acceptance criteria; no dedicated test file named |
| Integration | `executor-audit.ts` signal composition compiles and supplies a cancellable signal boundary | TypeScript compilation |
| Manual review | Unmigrated bare `setTimeout` paths listed for follow-up | Tasks/spec review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `AbortSignal` support | Runtime | Available | Required for cancellation propagation and `AbortSignal.any` composition |
| Full wait-call migration | Internal follow-up | Deferred | Unmigrated call sites remain uncancellable until later adoption |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `abortableSleep` leaks timers/listeners or executor signal composition breaks run startup.
- **Procedure**: Revert the new `sleep.ts` module and the `AbortSignal.any` wiring in `executor-audit.ts`; callers continue using existing bare `setTimeout` waits until a corrected primitive lands.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
