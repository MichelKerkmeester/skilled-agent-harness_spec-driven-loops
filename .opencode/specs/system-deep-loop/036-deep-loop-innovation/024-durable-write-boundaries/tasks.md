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
    last_updated_at: "2026-08-03T06:05:31Z"
    last_updated_by: "codex"
    recent_action: "Closed the P1 hardening leaf with a runtime fence capability and hard-private append"
    next_safe_action: "Run strict validation after metadata regeneration"
    blockers: []
    key_files:
      - "tasks.md"
    completion_pct: 100
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
### Milestone Reference

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

- [x] T001 **CONFIRM BEFORE BUILD.** Re-read and classify all 18 IDs at HEAD; `F-014-01`, `F-014-02`, and `F-014-03` are MOVED to the confirm anchors and the other 15 are CONFIRMED. `F-003-01` and `F-018-02` remain one work unit. Evidence: operator confirm inventory and `baselines/pre-edit.md`, candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`. [4h]
- [x] T002 Enumerate every exported mutation entry point in `runtime/lib/authorized-ledger` and every call site across the skill. Evidence: pre-edit inventory in `baselines/pre-edit.md`; post-edit `rg` leaves the internal bridge, white-box mode-contract literals, and the explicitly excluded pre-existing `legacy-projections.test.ts` direct call. [4h] {deps: T001}
- [x] T003 Answer the fencing-token placement question (frame envelope versus authorization proof) and record it. Evidence: ADR-004 in `decision-record.md`; fenced frames persist `authorization_ref.fence_token`. [2h] {deps: T002}
- [x] T004 Cite the `021` `runtime` baseline and re-run the named typecheck/test commands. Evidence: `baselines/pre-edit.md`; `npm run typecheck` is unavailable because `runtime/package.json` is absent, fallback `tsc --noEmit -p tsconfig.json` returned rc 0, and the full Vitest command returned rc 1 against the supplied 148-file RED anchor. [1h] {deps: T001}
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Gateway-only mutation [M2]

- [x] T005 Enforce fencing tokens and a high-water mark at the append boundary (`F-014-01`, CONFIRMED) (`.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts`) [8h] {deps: T003}
- [x] T006 Route every production mutation through the fenced gateway; the post-edit inventory has no direct production call. Evidence: `does not expose a direct append symbol from the package public entry`; suite `authorized-ledger.vitest.ts` digest `d2042a6722c16c1ac57a359486b57bec59f400ad9a7ad789efff9566192e4124`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`. [6h] {deps: T005}
- [x] T007 Demote direct `appendAuthorized` to internal-only. Evidence: private method plus internal bridge; package entry exposes no direct append symbol. [4h] {deps: T006}
- [x] T008 Superseded-writer negative test: `rejects a superseded writer in two processes with a fencing-specific error` is green in `authorized-ledger.vitest.ts`. [4h] {deps: T007}

### P1 hardening leaf

- [x] T025 Add a coordinator-issued opaque fence capability and validate it inside the ledger primitive before any append work. Evidence: `primitive rejects an unexpired proof paired with a superseded fence capability`; `authorized-ledger.vitest.ts` digest `d2042a6722c16c1ac57a359486b57bec59f400ad9a7ad789efff9566192e4124`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`. [4h] {deps: T007}
- [x] T026 Convert the mutator to ECMAScript hard-private and migrate all 89 in-scope direct white-box callers to `appendAuthorizedForTest`, which acquires a real fence. The excluded pre-existing `legacy-projections.test.ts` remains untouched. Evidence: `hard-private primitive rejects a constructed-ledger append without a current fence`; `authorized-ledger.vitest.ts` digest `d2042a6722c16c1ac57a359486b57bec59f400ad9a7ad789efff9566192e4124`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`. [4h] {deps: T025}
- [x] T027 Run the owned eight-suite regression gate and fallback compiler. Evidence: 8 files / 223 tests passed / rc 0; `../../system-spec-kit/node_modules/.bin/tsc --noEmit -p tsconfig.json` rc 0. The requested local `./node_modules/.bin/tsc` path is absent. [2h] {deps: T025, T026}

### Identity and policy [M3]

- [x] T009 Resolve and verify `actorId`, `capabilityId`, `evidenceDigest` at the gateway (`F-014-02`) (`.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts`) [6h] {deps: T007}
- [x] T010 Build a durable denial before the caller observes a rejection, including cyclic request data (`F-002-02`). Evidence: `turns cyclic request data into a durable typed denial` is green. [4h] {deps: T009}
- [x] T011 Extend policy identity to cover captured authorization state. Evidence: `changes the policy digest when captured authorization state changes` is green. [5h] {deps: T007}

### Concurrency family [M4]

Every mechanism here needs a two-process test with deterministic barriers. A skipped concurrency test is a checklist failure, not a warning.

- [x] T012 Fence branch workers for the lease lifetime (`F-018-03`) (`.opencode/skills/system-deep-loop/runtime/lib/branch-leases-waves/durable-orchestrator.ts`) [6h] {deps: T007}. Evidence: `fences a two-process branch worker after the parent revokes its lease`; suite digest `a513d0b496530f4096cb2afb09f5a7c92256e71586c48bcc0ea271e775093b21`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.
- [x] T013 [P] Add a cross-process O_EXCL lock to the diff-gated JSONL append (`F-018-04`). Evidence: `preserves both rows from concurrent diff-gated appends` is green. [6h] {deps: T007}
- [x] T014 Identity-verified atomic lock reclaim and release; successor deletion is prevented (`F-018-01`, `F-018-02`, `F-003-01` — one work unit). Evidence: loop-lock suite is green after the atomic release-claim change. [8h] {deps: T007}
- [x] T015 [P] Order torn-tail quarantine after a durable recovery marker (`F-002-01`). Evidence: authorized-ledger suite is green after marker-first recovery ordering. [5h] {deps: T007}
- [x] T016 Single-winner primitive is enforced by default for effect recovery and operator decisions through a ledger-derived coordination root, with a shared temporary fallback for custom writers. Evidence: `F-004-01 lets exactly one recovery process execute an unresolved effect` and `F-004-02 commits exactly one of two conflicting operator decisions`; suite digest `29a605707ab27fd4819cb3c0b87047dfd1580cd719aaf56189d06f1f74adec10`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`. [7h] {deps: T007}
- [x] T017 [P] Idempotent convergence for concurrent exact attestations (`F-004-03`). Evidence: exact duplicate idempotency suite is green and append-race convergence now re-reads the winner. [5h] {deps: T007}

### Leaf publication [M5]

This child owns `leaf-artifact-writer.ts` structurally. Land the closed parser early so `026` can start its slice-binding layer.

- [x] T018 Stage leaf artifact publication and promote atomically (`F-003-02`, `F-039-02`). Evidence: leaf crash-retry matrix is green. [8h] {deps: T014}
- [x] T019 Ensure a state-log append failure does not strand the write-once delta (`F-037-01`). Evidence: `recovers a crash injected after delta-published` is green. [4h] {deps: T018}
- [x] T020 Close the runtime record parser: reject wrong-typed authoritative fields with the field named (`F-036-04`, `F-039-01`). Evidence: five wrong-type cases are green. [6h] {deps: T018}
- [x] T021 Crash-inject at every leaf-publication stage boundary and prove a clean retry recovers. Evidence: five-stage `recovers a crash injected after ...` matrix is green. [5h] {deps: T019, T020}
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Delta and gate [M6]

- [ ] T022 Re-run `cd .opencode/skills/system-deep-loop/runtime && npm run typecheck && npm test`; report the delta against the `021` baseline [2h] {deps: T010, T011, T012, T013, T015, T016, T017, T021}. The exact Vitest command reached only the four pre-existing owned failure files but remained live before emitting its aggregate; collection reported 168 files / 4,178 tests and the emitted failures reconstruct to 4,171 pass / 7 fail. The runtime package has no `package.json`; the direct compiler fallback returned rc 0.
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
