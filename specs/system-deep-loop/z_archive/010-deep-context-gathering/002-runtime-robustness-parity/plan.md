---
title: "Implementation Plan: deep-context runtime-robustness parity"
description: "Wire five deep-loop-runtime durability and validation features into the host-driven deep-context loop, all gated to loop_type='context': atomic-state, jsonl-repair, post-dispatch-validate, loop-lock, and the executor-audit recursion guard, reusing the runtime helpers in-process via the tsx CJS register with inline fallbacks."
trigger_phrases:
  - "runtime parity plan"
  - "atomic state plan"
  - "loop lock plan"
  - "post-dispatch validate plan"
  - "executor audit guard"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/010-deep-context-gathering/002-runtime-robustness-parity"
    last_updated_at: "2026-06-06T23:55:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored Level-3 plan for the shipped runtime-robustness-parity phase"
    next_safe_action: "Operator: exercise the 5 robustness features in a live context loop run"
    blockers: []
    key_files:
      - ".opencode/skills/deep-context/scripts/reduce-state.cjs"
      - ".opencode/skills/deep-context/scripts/loop-lock.cjs"
      - ".opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts"
    session_dedup:
      fingerprint: "sha256:2b71f0c4a9d35ee2c6184f93a17d4cb5e820a6713fd9c2ee4407b51a9c6d3e72"
      session_id: "dc-134-002-20260606"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Reuse runtime helpers in-process via tsx CJS register with inline fallback"
      - "All five features gated to loop_type='context'; no runtime files modified"
---
# Implementation Plan: deep-context runtime-robustness parity

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node CJS (deep-context scripts), TypeScript (runtime helpers, imported), YAML (workflows) |
| **Framework** | deep-loop-runtime (atomic-state, jsonl-repair, post-dispatch-validate, loop-lock, executor-audit) |
| **Storage** | JSONL state log + JSON findings registry + Markdown dashboard (per-run artifact dir) |
| **Testing** | `node --check` on both scripts; fixture smoke run of `reduce-state.cjs`; loop-lock acquire/refresh/release cycle |

### Overview
This phase wires five `deep-loop-runtime` robustness features into the phase-001 host-driven deep-context loop, every one gated to `loop_type='context'` so research and review are unaffected. The `reduce-state.cjs` reducer gains crash-safe atomic writes, corrupt-tail JSONL recovery, and seat-output validation; a new `loop-lock.cjs` wraps the runtime loop-lock helper; and both workflow YAMLs gain a CLI-dispatch recursion guard. Both `.cjs` scripts import the runtime TypeScript helpers in-process via the tsx CJS register with contract-equivalent inline fallbacks, so no runtime files are modified.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md, phase-parent spec.md)
- [x] Success criteria measurable (SC-001..SC-003 in spec.md)
- [x] Dependencies identified (runtime helper modules, tsx CJS register)

### Definition of Done
- [x] All acceptance criteria met (REQ-001..REQ-005 implemented; REQ-006 parity preserved)
- [x] Verification passing (`node --check` both scripts; fixture smoke run; loop-lock cycle)
- [x] Docs authored (spec/plan/tasks/checklist/decision-record/implementation-summary)
- [x] Non-gaps documented (bayesian-scorer + fanout-run excluded with rationale in decision-record)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Host-driven reducer plus thin runtime-helper wrappers: the host owns all merged-state writes, the runtime helpers provide the durability and validation primitives, and dual-use `.cjs` scripts import them in-process.

### Key Components
- **Atomic state**: `reduce-state.cjs` loads `writeStateAtomic` from `atomic-state.ts` for the registry; an inline `writeStateAtomicInline` (temp+fsync+rename) writes the dashboard text.
- **JSONL repair**: `reduce-state.cjs` loads `repairJsonlTail` from `jsonl-repair.ts`, runs it on the state log before reading, and surfaces `registry.stateLogRepair`.
- **Seat validation**: `reduce-state.cjs` `validateSeatFinding` enforces known kind, path-or-symbol presence, and numeric relevance; failures land in `registry.seatValidationWarnings`.
- **Loop lock**: `loop-lock.cjs` wraps `acquireLoopLock`/`refreshLoopLock`/`releaseLoopLock` from `loop-lock.ts`; the workflow YAMLs invoke it.
- **Executor-audit guard**: the workflow `cli_contract` sets `SPECKIT_CLI_DISPATCH_STACK` via `buildExecutorDispatchEnv` from `executor-audit.ts`.

### Data Flow
On reduce, the host repairs the state log tail, reads lineage and per-seat findings, validates each finding, merges the surviving ones into the registry, then writes the registry and dashboard atomically. On loop start the workflow acquires the loop lock; CLI seats are spawned with the recursion-guard env; on halt/cancel/complete the workflow releases the lock with the same host-provided owner id.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase hardens persistence, schema-shaped seat output, env precedence on CLI dispatch, and shared-runtime helper boundaries, so the affected-surface inventory applies.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `reduce-state.cjs` | Host reducer: merge seat findings, write registry + dashboard | update (atomic writes, repair-before-read, pre-merge validate) | `node --check`; fixture smoke run shows `stateSafety: "runtime"`, `stateLogRepaired: true`, `seatValidationWarnings: 1` |
| `loop-lock.cjs` | (new) Host-facing lock wrapper | create (acquire/refresh/release over runtime helper) | `node --check`; acquire/refresh/release cycle |
| `deep_start-context-loop_auto.yaml` | Auto workflow | update (`step_acquire_lock`/`step_release_lock`, `cli_contract` audit env) | `rg -n "loop-lock.cjs|SPECKIT_CLI_DISPATCH_STACK"` present |
| `deep_start-context-loop_confirm.yaml` | Confirm workflow | update (same lock + `cli_contract` wiring) | same grep present |
| `atomic-state.ts`, `jsonl-repair.ts`, `loop-lock.ts`, `executor-audit.ts` | Shared runtime helpers | unchanged (imported in-process) | research/review paths unaffected; no runtime file edited |

Required inventories:
- Same-class producers: `rg -n "writeStateAtomic|repairJsonlTail|validateSeatFinding" .opencode/skills/deep-context/scripts/reduce-state.cjs`.
- Consumers of changed symbols: `rg -n "stateLogRepair|seatValidationWarnings|stateSafety" .opencode/skills/deep-context/scripts/reduce-state.cjs`.
- Matrix axes: feature (atomic | repair | validate | lock | audit) x surface (reducer | lock wrapper | auto YAML | confirm YAML) — context rows added, runtime helper rows unchanged.
- Algorithm invariant: every wired feature dispatches on `loop_type='context'`; the runtime helpers are reused unmodified, so research/review behavior is preserved by construction.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm the runtime helper contracts (`writeStateAtomic`, `repairJsonlTail`, loop-lock trio, `buildExecutorDispatchEnv`)
- [x] Confirm the tsx CJS register path resolves from the deep-context scripts dir
- [x] Confirm bayesian-scorer + fanout-run are non-gaps (decision-record ADR-002)

### Phase 2: Core Implementation
- [x] Atomic registry write via `writeStateAtomic`; atomic dashboard text write (temp+fsync+rename)
- [x] `repairJsonlTail` on the state log before read; surface `registry.stateLogRepair`
- [x] `validateSeatFinding` pre-merge; surface `registry.seatValidationWarnings`
- [x] `loop-lock.cjs` wrapping the runtime acquire/refresh/release helpers
- [x] Workflow YAML `step_acquire_lock`/`step_release_lock` + `cli_contract` recursion-guard env

### Phase 3: Verification
- [x] `node --check` passes both `reduce-state.cjs` and `loop-lock.cjs`
- [x] Fixture smoke run: `stateSafety: "runtime"`, `stateLogRepaired: true`, `seatValidationWarnings: 1`, no `.tmp` leftover
- [x] loop-lock acquire/refresh/release cycle works
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static | Syntax of both `.cjs` scripts | `node --check` |
| Integration | Reducer end-to-end on a fixture: atomic writes, repair-before-read, seat validation | fixture smoke run |
| Manual | Loop-lock acquire/refresh/release cycle against a lock file | CLI invocation |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `atomic-state.ts` (`writeStateAtomic`) | Internal | Green | No runtime atomic write; inline fallback runs |
| `jsonl-repair.ts` (`repairJsonlTail`) | Internal | Green | No runtime repair; inline fallback runs |
| `loop-lock.ts` (acquire/refresh/release) | Internal | Green | No single-writer lock; wrapper exits non-zero |
| `executor-audit.ts` (`buildExecutorDispatchEnv`) | Internal | Green | No recursion guard on CLI seats |
| `system-spec-kit` tsx CJS register | Internal | Green | In-process import fails; inline fallback runs |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A wired feature regresses the host-driven loop, or an import boundary breaks the reducer.
- **Procedure**: Revert `reduce-state.cjs` to its phase-001 writes (drop the atomic/repair/validate wiring and the runtime import), delete `loop-lock.cjs`, and revert the `step_acquire_lock`/`step_release_lock` and `cli_contract` env lines in both workflow YAMLs. No runtime file changed, so research and review are unaffected by the rollback.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup: confirm helper contracts + non-gaps) ──► Phase 2 (Core: reducer + lock + YAML) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup (confirm contracts + non-gaps) | Low | 1-2 hours |
| Core Implementation (reducer + lock wrapper + YAML) | Med | 4-6 hours |
| Verification (node --check + smoke + lock cycle) | Low | 1-2 hours |
| **Total** | | **6-10 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Runtime helpers confirmed reused unmodified (no runtime file edited)
- [x] Every feature gated behind `loop_type='context'`
- [x] Inline fallbacks confirmed contract-equivalent

### Rollback Procedure
1. Revert the atomic/repair/validate wiring and the runtime import block in `reduce-state.cjs`.
2. Delete `loop-lock.cjs`.
3. Revert the `step_acquire_lock`/`step_release_lock` and `cli_contract` env lines in both workflow YAMLs.
4. `node --check` the reverted reducer to confirm the host-driven loop still parses.

### Data Reversal
- **Has data migrations?** No. This phase changes how files are written, not their schema.
- **Reversal procedure**: None. The findings registry and dashboard are per-run artifacts regenerated on the next run.
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Phase 1   │────►│   Phase 2   │────►│   Phase 3   │
│ confirm     │     │ reducer +   │     │   Verify    │
│ contracts   │     │ lock + YAML │     │             │
└─────────────┘     └──────┬──────┘     └─────────────┘
                          │
                    ┌─────▼─────┐
                    │  Phase 2b │
                    │ workflow  │
                    │ YAML wire │
                    └───────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Runtime helper contracts | None | Reuse surface | Reducer + lock wrapper |
| `reduce-state.cjs` wiring | Helper contracts | Atomic/repair/validate reducer | Smoke verification |
| `loop-lock.cjs` | loop-lock helper | Single-writer lock | Workflow lock steps |
| Workflow YAML wiring | Lock wrapper, audit env | Lock steps + recursion guard | Live loop run |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Confirm runtime helper contracts + tsx register path** - 1-2 hours - CRITICAL
2. **Wire `reduce-state.cjs` (atomic + repair + validate)** - 3-4 hours - CRITICAL
3. **`loop-lock.cjs` + workflow YAML lock/audit wiring** - 2-3 hours - CRITICAL

**Total Critical Path**: 6-9 hours

**Parallel Opportunities**:
- The `loop-lock.cjs` wrapper and the workflow YAML edits can proceed alongside the `reduce-state.cjs` reducer wiring once the helper contracts are confirmed.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Reducer hardened | `reduce-state.cjs` writes atomically, repairs the log, validates seats; `node --check` green | Phase 2 |
| M2 | Lock + guard wired | `loop-lock.cjs` cycle works; both YAMLs invoke the lock and set the audit env | Phase 2 |
| M3 | Parity verified | Fixture smoke run reports runtime safety + repair + validation warnings; no `.tmp` leftover | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Host-driven in-process tsx import with inline fallback (not re-exec)

**Status**: Accepted

**Context**: The deep-context `.cjs` scripts needed the runtime's TypeScript durability helpers, which are not pre-compiled CJS. The options were to re-exec a TS toolchain per call, or to import the helpers in-process via the tsx CJS register.

**Decision**: Import the runtime helpers in-process via the tsx CJS register, memoized once per invocation, with contract-equivalent inline fallbacks when the register or helper is unavailable. Full detail and the other two decisions live in `decision-record.md`.

**Consequences**:
- The scripts stay dual-use (importable and CLI-runnable) and avoid per-call process spawns.
- A toolchain gap degrades gracefully to the inline path rather than failing the reduce; `stateSafety.source` reports which path ran.

**Alternatives Rejected**:
- Re-exec a TS runner per call: adds process-spawn latency and a hard toolchain dependency on every write.

---
<!--
LEVEL 3 PLAN
- Core + L2 + L3 addendums
- Dependency graphs, milestones
- Architecture decision records (full set in decision-record.md)
-->
