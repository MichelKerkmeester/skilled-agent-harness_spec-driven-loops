---
title: "Implementation Plan: Phase 3: Atomic State Deferred Writer"
description: "Plan for the shipped per-path deferred atomic writer that coalesces rapid snapshot writes and drains on demand."
trigger_phrases:
  - "atomic-state-deferred-writer"
  - "debounced-per-path-write"
  - "coalesced-atomic-write"
  - "deferred-atomic-writer"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/024-deep-loop-improved/002-deep-loop-runtime/003-atomic-state-deferred-writer"
    last_updated_at: "2026-07-01T21:24:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold plan with shipped deferred-writer content from spec.md"
    next_safe_action: "Use this plan as documentation for the completed deferred atomic writer primitive"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts"
    session_dedup:
      fingerprint: "sha256:003a5e7c9d2b4f6081c3e5a7890b2d4f6a8c0e2d4f6b8a0c2e4d6f8a1b3c5d8a"
      session_id: "scaffold-content-remediation-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: Atomic State Deferred Writer

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
| **Framework** | Node.js atomic state persistence helper |
| **Storage** | Coalesced object-state writes through atomic fsync+rename; JSONL appends excluded |
| **Testing** | Spec acceptance requires rapid-write coalescing, dirty-again reflush, drain behavior, and TypeScript compilation; no dedicated test file is named in spec.md |

### Overview
This phase shipped `createDeferredAtomicWriter` and the `DeferredAtomicWriter` interface in `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts`. The primitive coalesces rapid successive writes to the same path, preserves one additional reflush when data changes during an in-flight write, and exposes explicit `flushNow()`/`close()` drains for process-exit safety.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented: high-frequency reducers were issuing redundant same-path writes.
- [x] Success criteria measurable: rapid writes coalesce, dirty-again reflushes once, and drains resolve after persistence.
- [x] Dependencies identified: phase 001's atomic-state baseline is available.

### Definition of Done
- [x] `createDeferredAtomicWriter(path, opts)` exported with default 50 ms debounce behavior.
- [x] Dirty-again reflush implemented for writes arriving during an in-flight flush.
- [x] `flushNow()` and `close()` drain pending data.
- [x] JSDoc documents crash-window risk, default debounce, process-exit handler requirement, and JSONL exclusion.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Per-path debounced write coalescing layered above the existing atomic state writer.

### Key Components
- **`createDeferredAtomicWriter`**: Factory that binds one writer to one path and accepts write requests for coalescing.
- **`DeferredAtomicWriter`**: Interface exposing write scheduling plus `flushNow()` and `close()` drains.
- **Dirty-again state**: Tracks whether a new write arrived during an active fsync+rename so exactly one follow-up flush persists the latest state.

### Data Flow
Callers enqueue state snapshots into the per-path writer. Within the debounce window, superseded snapshots collapse to the latest value; when the timer fires, the writer persists through the atomic write path. If another write arrives while that flush is in progress, the dirty flag causes one additional flush after the in-flight operation completes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts` | Owns atomic state write primitives | Add deferred writer factory/interface and debounce internals | Spec acceptance covers coalescing, dirty-again, and drain behavior |
| JSONL append paths | Append-only log writes where coalescing would lose records | Excluded from deferred writer | JSDoc and plan document exclusion |
| Future reducer integrations such as `reduce-state.cjs` | Target consumers for lower write volume | Not migrated in this phase | Spec marks integration as tracked separately |

Required inventories:
- Same-class producers: inspect atomic state write helpers before adding the deferred wrapper.
- Consumers of changed symbols: integration targets are noted, but existing callers are not migrated here.
- Matrix axes: rapid same-path writes, write during in-flight flush, `flushNow()`, `close()`, JSONL append exclusion, and crash between debounce and drain.
- Algorithm invariant: the writer may coalesce superseded object snapshots but must never drop the latest queued snapshot before `flushNow()` or `close()` resolves.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm the primitive belongs in `atomic-state.ts` beside the existing atomic writer.
- [x] Confirm JSONL append streams cannot be safely coalesced and must remain immediate.

### Phase 2: Core Implementation
- [x] Added `DeferredAtomicWriter` and `createDeferredAtomicWriter` exports.
- [x] Implemented per-path debounce coalescing with a 50 ms default window.
- [x] Implemented dirty-again reflush for writes received during an active flush.
- [x] Implemented `flushNow()` and `close()` drain semantics.

### Phase 3: Verification
- [x] Verified rapid same-path writes coalesce to one write per debounce window.
- [x] Verified dirty-again writes trigger exactly one additional flush.
- [x] Verified drain methods resolve after queued data is persisted.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit/behavior | Ten rapid writes coalesce; dirty-again write triggers one follow-up flush | Spec acceptance criteria; no dedicated test file named |
| Drain behavior | `flushNow()` and `close()` persist pending state before resolving | Spec acceptance criteria |
| Compile | Exported factory/interface type-check | TypeScript compilation |
| Manual review | Crash-window and JSONL exclusion documented | Read `atomic-state.ts` JSDoc |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 `writeStateIfChangedAtomic` baseline | Internal | Complete | Deferred writer relies on the atomic-state module and write-only-on-change primitive |
| Process-exit integration | Internal follow-up | Deferred | Callers must adopt `close()` in exit handlers when the primitive is integrated |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Deferred writes lose the latest snapshot, do not drain on close, or introduce unacceptable crash-window risk for current callers.
- **Procedure**: Revert `createDeferredAtomicWriter` and `DeferredAtomicWriter` from `atomic-state.ts`; callers continue using immediate atomic writes until a corrected coalescing design lands.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
