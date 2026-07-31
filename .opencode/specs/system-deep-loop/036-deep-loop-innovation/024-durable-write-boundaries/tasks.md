---
title: "Tasks: Enforce Fencing at the Append Boundary Through a Gateway-Only Mutation Surface"
description: "Task breakdown for 024-durable-write-boundaries: confirm-before-build pass over 18 scoped review findings, then the fix work units, then the delta-reported verification gate."
trigger_phrases:
  - "durable write boundaries fencing"
  - "blocker 3 append fencing token"
  - "gateway only mutation ledger"
  - "appendAuthorized internal only"
  - "deep loop 024 fencing"
importance_tier: "critical"
contextType: "general"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/024-durable-write-boundaries"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the phased task breakdown from the WS1 phase-tree proposal"
    next_safe_action: "Execute T001 before any other task"
    blockers: []
    key_files:
      - "tasks.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify + level3-arch | v2.2 -->

# Tasks: Enforce Fencing at the Append Boundary Through a Gateway-Only Mutation Surface

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort] {deps: T###}`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:milestones -->
## Milestone Reference

| Milestone | Tasks | Gate |
|-----------|-------|------|
| M1 | T001-T004 | Exported mutation surface enumerated |
| M2 | T005-T008 | Direct append unreachable; superseded-writer test green |
| M3 | T009-T011 | Identity verified; policy digest covers captured state |
| M4 | T012-T017 | Two-process single-winner per race |
| M5 | T018-T021 | Crash injection recoverable at every stage |
| M6 | T022-T024 | Suite delta clean; Blocker 3 recorded as discharged |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Confirm and enumerate the surface [M1]

The operator ruling changes the exported mutation surface. Enumerating that surface and its call sites before touching it is what keeps the change reversible.

- [ ] T001 **CONFIRM BEFORE BUILD.** For each of the 18 finding IDs in scope, re-read the cited `file:line` at current HEAD and record `CONFIRMED` / `REFUTED` / `MOVED` / `ALREADY-FIXED` with a cited probe. Treat `F-003-01` and `F-018-02` as one work unit (same file and line, different iterations). (`spec.md` §3 scope table) [4h]
- [ ] T002 Enumerate every exported mutation entry point in `runtime/lib/authorized-ledger` and every call site across the skill [4h] {deps: T001}
- [ ] T003 Answer the fencing-token placement question (frame envelope versus authorization proof) and record it [2h] {deps: T002}
- [ ] T004 Cite the `021` `runtime` baseline and re-run `cd .opencode/skills/system-deep-loop/runtime && npm run typecheck && npm test` to confirm it reproduces [1h] {deps: T001}
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Gateway-only mutation [M2]

- [ ] T005 Enforce fencing tokens and a high-water mark at the append boundary (`F-014-01`, CONFIRMED) (`.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts`) [8h] {deps: T003}
- [ ] T006 Route every mutation through the fenced gateway; add the gateway path before removing anything [6h] {deps: T005}
- [ ] T007 Demote direct `appendAuthorized` to internal-only, in a separate commit from T006 [4h] {deps: T006}
- [ ] T008 Superseded-writer negative test: an unexpired proof from a superseded writer is rejected with a fencing-specific error [4h] {deps: T007}

### Identity and policy [M3]

- [ ] T009 Resolve and verify `actorId`, `capabilityId`, `evidenceDigest` at the gateway (`F-014-02`) (`.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts`) [6h] {deps: T007}
- [ ] T010 Build a durable denial before the caller observes a rejection, including for cyclic or throwing request data (`F-002-02`) (`.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts`) [4h] {deps: T009}
- [ ] T011 Extend policy identity to cover captured authorization state, not only `evaluate.toString()` (`F-014-03`) (`.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-policy-registry.ts`) [5h] {deps: T007}

### Concurrency family [M4]

Every mechanism here needs a two-process test with deterministic barriers. A skipped concurrency test is a checklist failure, not a warning.

- [ ] T012 Fence branch workers for the lease lifetime (`F-018-03`) (`.opencode/skills/system-deep-loop/runtime/lib/branch-leases-waves/durable-orchestrator.ts`) [6h] {deps: T007}
- [ ] T013 [P] Add a cross-process lock to the diff-gated JSONL append (`F-018-04`) (`.opencode/skills/system-deep-loop/runtime/lib/deep-loop/atomic-state.ts`) [6h] {deps: T007}
- [ ] T014 Identity-verified atomic lock reclaim and release; a successor's lock must survive (`F-018-01`, `F-018-02`, `F-003-01` — one work unit) (`.opencode/skills/system-deep-loop/runtime/lib/deep-loop/loop-lock.ts`) [8h] {deps: T007}
- [ ] T015 [P] Order torn-tail quarantine after a durable recovery marker (`F-002-01`) (`.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/immutable-frame-store.ts`) [5h] {deps: T007}
- [ ] T016 Single-winner semantics for concurrent effect recovery and conflicting operator decisions (`F-004-01`, `F-004-02`) (`.opencode/skills/system-deep-loop/runtime/lib/receipts-and-effect-recovery/effect-gateway.ts`) [7h] {deps: T007}
- [ ] T017 [P] Idempotent convergence for concurrent exact attestations (`F-004-03`) (`.opencode/skills/system-deep-loop/runtime/lib/replay-fingerprint/replay-fingerprint-attestation.ts`) [5h] {deps: T007}

### Leaf publication [M5]

This child owns `leaf-artifact-writer.ts` structurally. Land the closed parser early so `026` can start its slice-binding layer.

- [ ] T018 Stage leaf artifact publication and promote atomically (`F-003-02`, `F-039-02`) (`.opencode/skills/system-deep-loop/runtime/lib/deep-loop/leaf-artifact-writer.ts`) [8h] {deps: T014}
- [ ] T019 Ensure a state-log append failure does not strand the write-once delta (`F-037-01`) (`.opencode/skills/system-deep-loop/runtime/lib/deep-loop/leaf-artifact-writer.ts`) [4h] {deps: T018}
- [ ] T020 Close the runtime record parser: reject wrong-typed authoritative fields with the field named (`F-036-04`, `F-039-01`) (`.opencode/skills/system-deep-loop/runtime/lib/deep-loop/leaf-artifact-writer.ts`) [6h] {deps: T018}
- [ ] T021 Crash-inject at every leaf-publication stage boundary and prove a clean retry recovers [5h] {deps: T019, T020}
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Delta and gate [M6]

- [ ] T022 Re-run `cd .opencode/skills/system-deep-loop/runtime && npm run typecheck && npm test`; report the delta against the `021` baseline [2h] {deps: T010, T011, T012, T013, T015, T016, T017, T021}
- [ ] T023 Independent adversarial verification pass by an actor other than the builder, targeted at whether any mutation path bypasses the gateway [6h] {deps: T022}
- [ ] T024 `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-deep-loop/036-deep-loop-innovation/024-durable-write-boundaries --strict` exits 0; record the Blocker 3 discharge and hand the receipt and parser primitives to `025`, `026` and `027` [2h] {deps: T023}
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Every scoped finding ID resolved to a fix, a `REFUTED` rationale, or an `ALREADY-FIXED` commit citation
- [ ] Every confirmed finding carries a negative test that was red pre-fix
- [ ] Whole gate re-run and reported as a delta against the captured baseline
- [ ] Independent adversarial verification pass recorded
- [ ] `checklist.md` fully verified with test-name + suite-digest + SHA evidence
- [ ] All ADRs have a terminal status (Accepted or Superseded)
- [ ] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-child> --strict` exits 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decisions**: See `decision-record.md`
- **Source register**: `../016-whole-system-gate/review/findings-register.md` and `review/deep-review-findings-registry.json`
<!-- /ANCHOR:cross-refs -->
