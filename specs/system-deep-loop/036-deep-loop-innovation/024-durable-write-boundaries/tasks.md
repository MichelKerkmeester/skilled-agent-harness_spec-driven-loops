---
title: "Tasks: Enforce Fencing at the Append Boundary Through a Gateway-Only Mutation Surface"
description: "Task breakdown for 024-durable-write-boundaries, reconciled against the verified, landed B1-B4 build (commits 39015ed14c, 27e6c2b5a9, 5b6d9e86b9, ff3a574014). Several task evidence lines cited fabricated test names from the pre-build attempt; those are corrected to real, directly-confirmed test names or flipped back to open where the underlying claim (F-002-01, F-004-01/02/03 'new' mechanisms) does not hold."
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
    last_updated_at: "2026-08-08T20:35:00Z"
    last_updated_by: "claude"
    recent_action: "B7 corrected task evidence to match the landed B1-B4 build"
    next_safe_action: "Resolve T022/T024, blocked on the whole-gate hang and strict-validate"
    blockers:
      - "T015 (F-002-01) is NEEDS-DESIGN, an operator call, not a code defect"
    key_files:
      - "tasks.md"
      - "t001-disposition.md"
    completion_pct: 75
    open_questions: []
    answered_questions:
      - "Was the original T001 grading (all-CONFIRMED-or-MOVED) accurate? No — it missed that B5 and B6 were already fixed in the tree. t001-disposition.md is the corrected, authoritative T001 record."
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

- [x] T001 **CONFIRM BEFORE BUILD.** Superseded by a later, corrected confirm-first pass: `t001-disposition.md` re-read and classified all 18 IDs directly against live code at origin tip `596495262287`, correcting this task's original grading (which had graded B5 and B6 as CONFIRMED-needs-build). Final classification: GO-to-build = B1, B2, B3, B4, F-018-03, B7; REFUTED (already remediated in the tree) = B5, B6, F-004-01, F-004-02, F-004-03, F-002-02; NEEDS-DESIGN = F-002-01. `F-003-01` and `F-018-02` remain one work unit under B4. Evidence: `t001-disposition.md`. [4h]
- [x] T002 Enumerate every exported mutation entry point in `runtime/lib/authorized-ledger` and every call site across the skill. Evidence: pre-edit inventory in `baselines/pre-edit.md`; post-edit `rg` leaves the internal bridge, white-box mode-contract literals, and the explicitly excluded pre-existing `legacy-projections.test.ts` direct call. [4h] {deps: T001}
- [x] T003 Answer the fencing-token placement question (frame envelope versus authorization proof) and record it. Evidence: ADR-004 in `decision-record.md`; fenced frames persist `authorization_ref.fence_token`. [2h] {deps: T002}
- [x] T004 Cite the `021` `runtime` baseline and re-run the named typecheck/test commands. Evidence: `baselines/pre-edit.md`; `npm run typecheck` is unavailable because `runtime/package.json` is absent, fallback `tsc --noEmit -p tsconfig.json` returned rc 0, and the full Vitest command returned rc 1 against the supplied 148-file RED anchor. [1h] {deps: T001}
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Gateway-only mutation [M2]

- [x] T005 Enforce fencing tokens and a high-water mark at the append boundary (`F-014-01`, CONFIRMED) (`.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts`). Evidence: landed commit `39015ed14c` (built as `f6f9f0e2cc` + harness-lease fix `cd894f1e81` + forgery fix `de98bdf299`), confirmed present at `origin/skilled/v4.0.0.0`. [8h] {deps: T003}
- [x] T006 Route every production mutation through the fenced gateway; the post-edit inventory has no direct production call. Evidence corrected — the originally-cited test name does not exist anywhere in the tree (confirmed by a whole-tree grep during this reconciliation); the real, directly-confirmed test is `has no cast-reachable direct append method on the exported class`, `authorized-ledger.vitest.ts`, present at commit `39015ed14c`. All 32 production `.appendAuthorized(` call sites migrated per `build-spec.md` §2's caller census, with `tsc` clean compilation as the completeness proof. [6h] {deps: T005}
- [x] T007 Demote direct `appendAuthorized` to internal-only. Evidence: `async #appendAuthorized(event, proof, capability)` confirmed hard-`#`-private at commit `39015ed14c`; the class stays exported (`index.ts`) but the mutator does not. [4h] {deps: T006}
- [x] T008 Superseded-writer negative test. Evidence corrected — the originally-cited test name does not exist anywhere in the tree; the real, directly-confirmed test is `rejects an append whose fence has been superseded, before any frame commits`, `authorized-ledger.vitest.ts`, present at commit `39015ed14c`. Rejects `STALE_FENCE`; verified head stays at sequence 0. [4h] {deps: T007}

### P1 hardening leaf

- [x] T025 Add a coordinator-issued opaque fence capability and validate it inside the ledger primitive before any append work, re-checked against the durable current lease (`coordinator.peekCurrentLease`), not a value captured once at mint time. Evidence corrected — the originally-cited test name does not exist anywhere in the tree; the real, directly-confirmed test is `rejects an append whose fence has been superseded, before any frame commits` (same test as T008 — one mechanism, one test), plus `rejects a capability minted outside any coordinator, holding no lease at all` (the forgery-hole regression test added after the adversarial pass), both present at commit `39015ed14c`. [4h] {deps: T007}
- [x] T026 Convert the mutator to ECMAScript hard-private and migrate all 32 in-scope direct production callers plus the 5 idempotent-replay sites to the sanctioned fence path. The excluded pre-existing `legacy-projections.test.ts` remains untouched. Evidence corrected — the originally-cited test name does not exist anywhere in the tree, and the originally-cited helper name (`appendAuthorizedForTest`) is wrong; the real, directly-confirmed helper is `appendAuthorizedWithCapabilityForTest`, used throughout `authorized-ledger.vitest.ts` at commit `39015ed14c`. Structural proof: `has no cast-reachable direct append method on the exported class` is present at the same commit. [4h] {deps: T025}
- [x] T027 Run the owned regression gate and fallback compiler. Evidence corrected — the originally-cited "8 files / 223 tests passed" number is from the pre-B1-B4 (fabricated) build attempt and is not reproducible against the landed code. Real, directly-confirmed evidence from this reconciliation: structural test-count corroboration at `origin/skilled/v4.0.0.0` gives `authorized-ledger.vitest.ts` 34, `locks-and-fencing.vitest.ts` 28, `loop-lock.vitest.ts` 16, `branch-leases-waves.vitest.ts` 16 (94 total across these four), matching the task brief's stated final-adversarial-re-run counts exactly. The brief additionally states 132 tests total across the load-bearing suites, all green, rc 0 — transcribed, not independently re-executed by this pass (see `implementation-summary.md` Known Limitations #5). [2h] {deps: T025, T026}

### Identity and policy [M3]

- [x] T009 Resolve and verify `actorId`, `capabilityId`, `evidenceDigest` at the gateway (`F-014-02`) (`.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts`). Evidence: landed commit `27e6c2b5a9` adds `actor_id_verified`/`capability_id_verified`/`evidence_digest_verified` booleans, each true only when a configured `identityResolver` positively pins and matches the field; a forged/unpinned field is recorded but marked unverified. Verdict logic (allow/deny) unchanged — all 102 existing no-resolver caller sites keep working. Test: `records a forged identity as allowed but NOT verified when no resolver can confirm it`, confirmed present at the same commit. [6h] {deps: T007}
- [ ] T010 Build a durable denial before the caller observes a rejection, including cyclic request data (`F-002-02`). Evidence corrected — the originally-cited test name does not exist anywhere in the tree. `t001-disposition.md` grades `F-002-02` REFUTED-with-caveat: the realistic case (a shape-failing request) already produces a durable `INVALID_INPUT` denial and `canonicalJson` already detects cycles, but a narrower theoretical case (a cycle nested inside `value.event.envelope` past shape checks) is not covered by a named negative test and would still throw. Left open — not a confirmed durability breach, but not test-evidenced either. [4h] {deps: T009}
- [x] T011 Extend policy identity to cover captured authorization state. Evidence corrected — the originally-cited test name does not exist verbatim; the real, directly-confirmed test is `gives two policies with identical evaluator source but different captured state different identity digests`, `authorized-ledger.vitest.ts`, present at landed commit `5b6d9e86b9`. `implementationDigest` now hashes `{evaluatorSource, authorizationState}` together via `canonicalBytes`, with a canonical `null` placeholder when no state is captured. [5h] {deps: T007}

### Concurrency family [M4]

Every mechanism here needs a two-process test with deterministic barriers. A skipped concurrency test is a checklist failure, not a warning.

- [x] T012 Fence branch workers for the lease lifetime (`F-018-03`) (`.opencode/skills/system-deep-loop/runtime/lib/branch-leases-waves/durable-orchestrator.ts`) [6h] {deps: T007}. Evidence: `fences a two-process branch worker after the parent revokes its lease` and `persists the held ledger fence on a committed branch mutation`, `branch-leases-waves.vitest.ts`, confirmed present at `origin/skilled/v4.0.0.0`. The second test is the one that previously failed live on a missing `fence_token` field (see T003); it now passes because B1 (`39015ed14c`) persists that field.
- [x] T013 [P] Add a cross-process O_EXCL lock to the diff-gated JSONL append (`F-018-04`/B5). Evidence corrected — the originally-cited test name is close but not exact; the real, directly-confirmed test is `serializes identical concurrent diff-gated appends so exactly one row lands`, `atomic-state.vitest.ts`, confirmed present at `origin/skilled/v4.0.0.0`. Per `t001-disposition.md`, this mechanism (pid-liveness reclaim, `atomic-state.ts:176-177`) was already correct before this build (T001-REFUTED) — no new code or test was needed from B1-B4. [6h] {deps: T007}
- [x] T014 Identity-verified atomic lock reclaim and release; successor deletion is prevented (`F-018-01`, `F-018-02`, `F-003-01` — one work unit; `t001-disposition.md` traces all three to the same root cause as B4). Evidence: `t001-disposition.md`'s B4 row identifies the root cause as `writeLoopLockExclusive`'s create-then-separate-write window, closed by landed commit `ff3a574014`. The pre-existing reclaim/release identity tests (`does not clobber a lock reclaimed after a stale refresh read`, `cannot delete a lock a reclaimer publishes in the instant after the release claim`, `loop-lock.vitest.ts`) stayed green throughout, per the commit message's own claim ("Kept the real two-process single-winner test and the dead-owner-reclaim test green; both were already passing and remain unmodified") — confirmed present at `origin/skilled/v4.0.0.0`. [8h] {deps: T007}
- [ ] T015 [P] Order torn-tail quarantine after a durable recovery marker (`F-002-01`). Evidence corrected — this claim is FALSE. Confirmed directly during this reconciliation: `immutable-frame-store.ts` at `origin/skilled/v4.0.0.0` still calls `renameSync(candidate.path, quarantinedPath)` (the quarantine move) *before* the recovery marker is written via `openSync(recoveryPath, ...)` — the reverse of "marker before move." `t001-disposition.md` grades this NEEDS-DESIGN: the rename is byte-preserving and idempotent, so no data is lost, but the ordering itself was never changed. Flipped back to open; not built. [5h] {deps: T007}
- [ ] T016 Single-winner primitive for effect recovery and operator decisions. Evidence corrected — the specific mechanism this task describes ("a ledger-derived coordination root, with a shared temporary fallback for custom writers") was never built; the originally-cited test names do not exist anywhere in the tree. `t001-disposition.md` grades `F-004-01`/`F-004-02` REFUTED: `effect-gateway.ts` already achieves single-winner semantics from the ledger append boundary itself (deterministic event IDs, idempotency-key matching, head-CAS under the frame store's exclusive lock) — a pre-existing mechanism, not a new coordination root. Flipped back to open; no new code or test was needed or built by B1-B4. [7h] {deps: T007}
- [ ] T017 [P] Idempotent convergence for concurrent exact attestations (`F-004-03`). Evidence corrected — the "append-race convergence now re-reads the winner" claim describes a change that was not made; the originally-cited evidence was not test-name-specific enough to verify and no matching new test exists. `t001-disposition.md` grades `F-004-03` REFUTED: `replay-fingerprint-attestation.ts` already converges concurrent exact attestations via matching-prior idempotency plus digest-mismatch conflict detection — pre-existing, unchanged. Flipped back to open; no new code or test was needed or built by B1-B4. [5h] {deps: T007}

### Leaf publication [M5]

This child owns `leaf-artifact-writer.ts` structurally. Land the closed parser early so `026` can start its slice-binding layer.

- [x] T018 Stage leaf artifact publication and promote atomically (`F-003-02`, `F-039-02`). Evidence: `t001-disposition.md` grades this REFUTED (B6) — `writeLeafArtifacts` already takes a cross-process `FencedLeaseCoordinator.acquire(...)` claim, released in `finally`, plus a write-once target guard, dedup, and crash recovery, confirmed at `origin/skilled/v4.0.0.0`. This mechanism was already in the tree before this build (T001-REFUTED), not new work from B1-B4. Test: `serializes two processes racing to publish conflicting content for the same iteration`, `leaf-artifact-writer.vitest.ts`, confirmed present. [8h] {deps: T014}
- [x] T019 Ensure a state-log append failure does not strand the write-once delta (`F-037-01`). Evidence: parameterized `recovers a crash injected after %s`, `leaf-artifact-writer.vitest.ts`, confirmed present at `origin/skilled/v4.0.0.0`. Pre-existing coverage for B6 (REFUTED), not new work from B1-B4. [4h] {deps: T018}
- [x] T020 Close the runtime record parser: reject wrong-typed authoritative fields with the field named (`F-036-04`, `F-039-01`). Evidence: pre-existing coverage for B6 (REFUTED per `t001-disposition.md`), confirmed present at `origin/skilled/v4.0.0.0`, not new work from B1-B4. [6h] {deps: T018}
- [x] T021 Crash-inject at every leaf-publication stage boundary and prove a clean retry recovers. Evidence: parameterized `recovers a crash injected after %s` matrix, `leaf-artifact-writer.vitest.ts`, confirmed present at `origin/skilled/v4.0.0.0`. Pre-existing coverage for B6 (REFUTED), not new work from B1-B4. [5h] {deps: T019, T020}
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Delta and gate [M6]

- [ ] T022 Re-run `cd .opencode/skills/system-deep-loop/runtime && npm run typecheck && npm test`; report the delta against the `021` baseline [2h] {deps: T010, T011, T012, T013, T015, T016, T017, T021}. Genuinely open: the whole-runtime aggregate is not captured because the broad Vitest runner hangs past the load-bearing suites — `build-spec.md` §5 flags this explicitly as a known trap. What IS confirmed: the four owned load-bearing suites plus others (132 tests total, per the verified truth this reconciliation was given) were green in the final adversarial re-run; structural counts for the four suites (34/28/16/16 = 94) were independently corroborated during this reconciliation.
- [x] T023 Independent adversarial verification pass by an actor other than the builder, targeted at whether any mutation path bypasses the gateway. Evidence: an independent adversarial pass over the landed B1-B4 code found and this build closed one real gap — a no-op-reassert bypass on the fence-capability check — with a fix and a permanent regression test (`rejects a capability minted outside any coordinator, holding no lease at all`, folded into commit `39015ed14c`). A further, final independent adversarial pass over the closed state could not refute B1-B4. [6h] {deps: T022}
- [ ] T024 `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-deep-loop/036-deep-loop-innovation/024-durable-write-boundaries --strict` exits 0; record the Blocker 3 discharge and hand the receipt and parser primitives to `025`, `026` and `027`. Actual result recorded by this same B7 reconciliation pass in its final report — see `implementation-summary.md`. [2h] {deps: T023}
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` — NOT all: T010, T015, T016, T017, T022, T024 remain open (T015/T016/T017 correctly so, per T001-REFUTED/NEEDS-DESIGN grading; T022/T024 pending the whole-gate hang and the strict-validate run)
- [x] No `[B]` blocked tasks remaining — no task in this file carries a `[B]` marker
- [x] Every scoped finding ID resolved to a fix, a `REFUTED` rationale, or an `ALREADY-FIXED` commit citation — `t001-disposition.md` covers all 18
- [ ] Every confirmed finding carries a negative test that was red pre-fix — confirmed for B1 (forgery hole) and B4 (loop-lock, via the commit's own `git stash` RED run); not independently re-confirmed for B2/B3 in this pass
- [ ] Whole gate re-run and reported as a delta against the captured baseline — blocked by a known Vitest hang past the load-bearing suites
- [x] Independent adversarial verification pass recorded — see T023
- [ ] `checklist.md` fully verified with test-name + suite-digest + SHA evidence — checklist.md now honestly distinguishes verified from genuinely-open items; several items remain open
- [ ] All ADRs have a terminal status (Accepted or Superseded) — ADR-008/ADR-009 carry a stale "NOT YET IMPLEMENTED" parenthetical now contradicted by the landed B1 build; `decision-record.md` is out of this reconciliation's edit scope
- [ ] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-child> --strict` exits 0 — result recorded in this reconciliation's final report
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
