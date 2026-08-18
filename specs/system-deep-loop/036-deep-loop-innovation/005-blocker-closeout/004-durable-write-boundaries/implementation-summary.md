---
title: "Implementation Summary: Durable Write Boundaries"
description: "Blocker 3 DISCHARGED: the fencing GO-set (B1-B4) is built, landed on origin/skilled/v4.0.0.0, and adversarially clean. One elective residual (token-replay, out of the stated threat model) and one operator-decision caveat (B2's identity-verified fields vs pre-existing dark-ledger frames) remain open. B5/B6 and three F-004 findings were T001-REFUTED — already remediated in the tree before this build started."
trigger_phrases:
  - "durable write boundaries implementation"
  - "blocker 3 discharged"
  - "gateway-only ledger mutation"
  - "fence capability append boundary"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/004-durable-write-boundaries"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/005-blocker-closeout/004-durable-write-boundaries"
    last_updated_at: "2026-08-18T23:59:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Reconciled 024 docs to Complete against the landed, adversarially-clean B1-B4 build"
    next_safe_action: "B2 event_version caveat and cross-packet handoff remain accepted deferrals"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "build-spec.md"
      - "t001-disposition.md"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Blocker 3 discharged? Yes — 39015ed14c, hard-private #appendAuthorized + FenceCapability."
      - "B5/B6 real gaps? No — T001-REFUTED, already fixed in the tree before this build."
      - "B2 event_version caveat blocking? No — the fix fails closed (rejects, never silently trusts); recorded as an accepted availability caveat, not an integrity risk."
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-durable-write-boundaries |
| **Level** | 3 |
| **Status** | Complete (Blocker 3 DISCHARGED). Code-complete + adversarially clean. Accepted deferrals: the aggregate-suite delta (broad runner hangs; load-bearing suites pass), the protected-surface registry gateway-only annotation (a runtime edit), and the cross-packet `014` discharge note. Non-blocking residuals: 1 elective token-replay residual (out of threat model), 1 operator-decision caveat (availability, not integrity), 1 test-coverage inference note. |
| **Landed on** | `origin/skilled/v4.0.0.0` |
| **Verified** | 2026-08-08 |
| **Prior claimed status (2026-08-03, superseded)** | "COMPLETION LEAF — GAPS CLOSED", 100% — later found fabricated: the fencing mechanism did not exist in code and several checklist evidence citations pointed at an unrelated commit. |
| **Re-verification finding (2026-08-08 03:30, superseded by this build)** | Confirmed the fabrication: `appendAuthorized` had zero fencing logic, the cited SHA `9229cb8f3e` touched only an unrelated packet's docs, and `branch-leases-waves.vitest.ts` failed live on a missing `fence_token` field. That finding is what triggered `build-spec.md` and `t001-disposition.md`, and is now resolved by the build described below. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This build followed a confirm-first gate: `build-spec.md` produced an initial finding-by-finding grading, and `t001-disposition.md` (authoritative over `build-spec.md`) re-graded every finding directly against live code at origin tip `596495262287`, correcting two of the build-spec's gradings before any code was touched. The GO-to-build set that resulted was B1, B2, B3, B4, `F-018-03` (folds into B1), and B7 (this metadata reconciliation). Everything below that is marked "built" was built against that confirmed set — nothing was built against an unconfirmed finding.

### B1 — append-boundary fence + F-018-03 fence_token persistence (landed `39015ed14c`)

Built as `f6f9f0e2cc` (hard-private append fence + fence_token persistence), then `cd894f1e81` (a harness-lease fix: the test harness had a never-released council lease), then `de98bdf299` (a forgery fix found by adversarial review, folded into the same landed commit `39015ed14c`).

`appendAuthorized` is now hard-private `#appendAuthorized` on `append-only-ledger.ts`, reachable only through a coordinator-minted `FenceCapability` passed as a closure argument. The capability is re-checked at call time against `coordinator.peekCurrentLease(fence.resource)` — the durable current lease, not a value captured once at mint time — so a superseded writer holding an unexpired authorization proof is rejected `STALE_FENCE` before any frame commits. All 32 production `.appendAuthorized(` call sites across the 33-file caller census, plus the 5 idempotent-replay sites that must short-circuit to a rebuilt receipt rather than being mechanically wrapped, were migrated. `tsc` clean compilation is the completeness proof for the migration: a missed caller would be a compile error, not a silent gap. The persisted `AuthorizationReference` now carries the numeric `fence_token` field (`authorized-ledger-types.ts`, the closed `AUTHORIZATION_REFERENCE_FIELDS` set, `authorizationReference()`), which is what F-018-03's previously-failing test (`branch-leases-waves.vitest.ts > persists the held ledger fence on a committed branch mutation`) asserts on. REQ-001 and REQ-002 are met by this mechanism.

**Independent adversarial pass found and this build closed a real hole**: a no-op-reassert bypass, where a capability could be re-asserted without the token being re-checked for currency. The fix adds token-currency validation to `#appendAuthorized`'s capability check, with a permanent regression test, `rejects a capability minted outside any coordinator, holding no lease at all`, added to `authorized-ledger.vitest.ts`. This is a real, closed gap found by verification — not a re-fabrication risk, because the test and the fix are both present in the landed commit and were independently re-confirmed against the diff.

### B2 — gateway identity fail-closed (landed `27e6c2b5a9`)

`transition-authorization-gateway.ts` now records `actor_id_verified` / `capability_id_verified` / `evidence_digest_verified` booleans on every persisted `AuthorizationDecisionRecord`. Each is `true` only when a configured `identityResolver` positively pins that field and the request's value matches; a forged or unpinned field is still recorded (the record is not dropped) but marked unverified. The verdict logic itself — allow/deny — is unchanged, so all 102 existing no-resolver caller sites keep working exactly as before. The new fields are purely additive evidence. Regression test: `records a forged identity as allowed but NOT verified when no resolver can confirm it`.

### B3 — policy-identity digest covers captured state (landed `5b6d9e86b9`)

`transition-policy-registry.ts`'s `implementationDigest` previously hashed only `Function.prototype.toString.call(definition.evaluate)` — source text alone, so a closure-captured allowlist could change under an unchanged policy identity. It now hashes `{evaluatorSource, authorizationState}` together via `canonicalBytes`, with a canonical `null` placeholder when no captured state is declared, so identical evaluator source with different captured authorization state now produces different digests. REQ-004 is met.

### B4 — loop-lock atomic publish (landed `ff3a574014`)

`writeLoopLockExclusive` in `loop-lock.ts` previously created the lock file with `openSync(path,'wx')` and then wrote its content in a *separate* `writeFileSync` call, leaving an observable empty-file window. A concurrent acquirer landing in that window read an existing-but-empty file, `JSON.parse('')` threw, the null holder skipped the staleness check, and `tryReclaimStaleLoopLock` renamed the creator's in-flight file aside — letting both acquirers return `acquired:true`. The fix writes the complete serialized record to a private temp file, `fsync`s it, then publishes with a single `linkSync` into the target path, preserving `openSync('wx')`'s `EEXIST` exclusivity while eliminating the empty-file window entirely: the target path is now only ever observably absent or complete. A deterministic regression test mocks `node:fs` to interleave a concurrent acquirer at the exact instant the path first becomes observable; it was verified RED against the pre-fix code (via a `git stash` of the change alone) and GREEN after restoring the fix. The pre-existing real two-process single-winner test and the dead-owner-reclaim test stayed green and unmodified.

### T001-REFUTED — already remediated in the tree, not built by this pass

`t001-disposition.md` is the authoritative confirm-first record for these. Each was graded CONFIRMED by the earlier `build-spec.md` prep pass, then re-graded REFUTED by `t001-disposition.md` after a direct code read at HEAD found the defect already fixed:

- **B5 (`F-018-04`, append-lock reclaim)**: `atomic-state.ts`'s `isAppendLockReclaimable` already checks `owner === null || !processAlive(owner.pid)` — pid-liveness, not the age-based reclaim the build-spec assumed. A live owner is never reclaimable.
- **B6 (`F-003-02`/`F-037-01`/`F-039-01`/`F-039-02`/`F-036-04`, leaf publication)**: `leaf-artifact-writer.ts`'s `writeLeafArtifacts` already takes a cross-process `FencedLeaseCoordinator.acquire(...)` claim, released in `finally`, plus a write-once target guard, dedup, and crash recovery. The build-spec had cited the wrong function (`validateReported` instead of the actual claim site).
- **`F-004-01`/`F-004-02`/`F-004-03`** (effect recovery, operator-decision commit, attestation convergence): all three already have single-winner semantics from the ledger append boundary itself — deterministic event IDs, idempotency-key matching, and head-CAS under the frame store's exclusive lock.
- **`F-002-02`** (cyclic request data): the realistic case is already handled with a durable `INVALID_INPUT` denial; `canonicalJson` already detects cycles. A theoretical residual (a cycle nested inside `value.event.envelope` past shape checks) is not reachable from the packet's stated threat model and was left as optional hardening, not a confirmed defect.

None of these five items required a code change, a new test, or a fix commit in this build. Building them would have been unnecessary work against a hypothesis that direct code inspection already refuted.

### NEEDS-DESIGN — not built, operator call

- **`F-002-01`** (torn-tail quarantine ordering): `immutable-frame-store.ts` quarantines a torn frame with `renameSync` before writing its durable recovery marker — the reverse of "marker before move." But the rename is byte-preserving and idempotent (`existsSync` guard), so a crash mid-sequence still leaves the bytes recoverable and the head at the last verified frame: no data loss. Whether marker-first ordering is a hard invariant regardless of the byte-preservation argument is an operator design call, not a confirmed durability breach, so it was left unbuilt.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Sequence: (1) `build-spec.md` — a read-only prep pass grounding an initial per-finding grading against origin tip, explicitly flagged as hypotheses pending confirm-before-build. (2) `t001-disposition.md` — a confirm-first re-grading of every finding directly against live code at HEAD, which corrected the build-spec's B5/B6 gradings from CONFIRMED to REFUTED and produced the final GO-to-build set (B1, B2, B3, B4, F-018-03, B7). (3) The four B1-B4 commits landed on `origin/skilled/v4.0.0.0` in the order shown above, each with its own regression test. (4) An independent adversarial verification pass (REQ-U04, a different actor than the builder) targeted the landed B1-B4 code, found one real forgery hole in B1 (the no-op-reassert bypass), which was closed with a fix and a permanent regression test in the same landed commit. (5) A final independent adversarial pass over the closed state could not refute B1-B4. (6) This B7 pass reconciles the packet's completion documentation (`implementation-summary.md`, `checklist.md`, `tasks.md`) against that verified, landed state; `spec.md`'s Status field was already updated by a prior pass and is not re-touched here.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Treat `t001-disposition.md` as authoritative over `build-spec.md` wherever they conflict | It re-graded every finding against live code at HEAD (not a prep-pass hypothesis) and independently re-verified its two corrections (B5, B6) before the build started |
| Build only the GO-to-build set (B1-B4, F-018-03, B7); do not build B5, B6, or the three F-004 findings | Direct code reads confirmed these five were already remediated; building against a refuted finding would be unnecessary work and a re-fabrication risk in disguise |
| Fold the adversarial pass's forgery-hole fix into the same landed B1 commit rather than a separate follow-up | The hole was found while B1 was still being verified, before landing; folding it in keeps the landed history free of a "known-broken then fixed" gap |
| Record the B2 event_version caveat as an open operator-decision item rather than resolving it unilaterally | Whether pre-existing dark-ledger audit-decision frames exist, and whether they must remain readable, is a fact only the operator can confirm; the fix already fails closed (rejects) rather than silently trusting, so there is no integrity risk in leaving the question open |
| Leave `F-002-01` unbuilt as NEEDS-DESIGN rather than building a fix for an ordering argument the byte-preservation property already covers | The finding is not a confirmed durability breach — building an unrequested fix would be scope creep against `t001-disposition.md`'s own grading |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `git show --stat` on all four landed commits (`39015ed14c`, `27e6c2b5a9`, `5b6d9e86b9`, `ff3a574014`) | All four exist, touch the claimed files, and carry the claimed commit messages. Confirmed directly during this reconciliation pass. |
| `git branch -r --contains <sha>` for all four landed commits | All four report `origin/skilled/v4.0.0.0`. Confirmed directly during this reconciliation pass. |
| `#appendAuthorized` hard-private + `FenceCapability` param, at `39015ed14c` | Confirmed by reading `append-only-ledger.ts` at that commit: `async #appendAuthorized(event, proof, capability)`, invoked only via a closure from the public bridge. |
| `fence_token` persisted field, at `39015ed14c` | Confirmed: `fence_token` is in the closed `AUTHORIZATION_REFERENCE_FIELDS` set, the type, and the `authorizationReference()` builder; validated as a positive integer. |
| `records a forged identity as allowed but NOT verified when no resolver can confirm it`, at `27e6c2b5a9` | Confirmed present in the commit's diff to `authorized-ledger.vitest.ts`. |
| `implementationDigest` hashes `{evaluatorSource, authorizationState}`, at `5b6d9e86b9` | Confirmed by reading the diff: replaces a source-only digest with a `canonicalBytes({evaluatorSource, authorizationState})` digest. |
| `writeLoopLockExclusive` temp-file + `fsync` + `linkSync` atomic publish, at `ff3a574014` | Confirmed by reading the diff to `loop-lock.ts`: adds `linkSync` import, replaces the `openSync('wx')` + separate `writeFileSync` sequence. |
| `rejects a capability minted outside any coordinator, holding no lease at all`, at `39015ed14c` | Confirmed present in the commit's diff to `authorized-ledger.vitest.ts`. |
| `peekCurrentLease` public method backing the re-check | Confirmed present and public on `FencedLeaseCoordinator` (`fenced-lease-coordinator.ts`) — this is also the basis of the documented token-replay residual below. |
| Load-bearing suite re-runs in the final adversarial re-run (per the task brief supplying this reconciliation; suite identities cross-checked against the commits above) | `authorized-ledger.vitest.ts` 34/34, `locks-and-fencing.vitest.ts` 28/28, `loop-lock.vitest.ts` 16/16, `branch-leases-waves.vitest.ts` 16/16, plus others — 132 tests total in the final adversarial re-run. This reconciliation pass did not re-execute these suites itself; it verified the underlying commits, diffs, and test names directly instead (see the rows above). |
| Remaining ~6 slower shadow-parity / mode-family suites | Rest on `tsc`-completeness (a missed caller is a compile error) plus the per-commit diff evidence above, not on an individual re-run in the final adversarial pass. Recorded as an inference, not a confirmed run — see Known Limitations. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Token-replay residual (elective, documented, genuinely untested).** `peekCurrentLease` is public and the `FenceCapability` carries only `{resource, fenceToken}`. An active in-process actor that reads the current token can mint a matching capability and pass the fence check. This is bounded — the exclusive lock, prior-head CAS, and single-use dedup together prevent a double-commit or content forgery — and it sits outside 024's stated threat model (stale writers and stale files, not an active in-process attacker). It was correctly left unclosed rather than claimed closed. Full closure would require a lease-possession proof, a deeper design change out of this packet's scope.
2. **B2 operator-decision caveat (availability, not integrity).** B2's new required `actor_id_verified` / `capability_id_verified` / `evidence_digest_verified` fields, combined with `event_version` staying at 1, mean any audit-decision frame persisted *before* this change would be rejected on read — not silently trusted, but rejected. If no such pre-existing durable data exists this is moot; if it does, either the operator confirms that, or `event_version` needs a bump with a v1 compatibility fallback. Recorded as an open item, not resolved by this build.
3. **Test-coverage honesty.** The four load-bearing suites this build's tests live in (`authorized-ledger`, `locks-and-fencing`, `loop-lock`, `branch-leases-waves`) plus others were re-run green in the final independent adversarial pass (132 tests total, per the verified evidence this reconciliation was given). The roughly six slower shadow-parity and mode-family suites rest on `tsc` completeness and the per-commit diff evidence, not an individual re-run — this reconciliation pass explicitly does not claim those six were re-executed, and neither should any doc derived from it.
4. **`F-002-01` (torn-tail quarantine ordering) is unbuilt, NEEDS-DESIGN.** The byte-preservation argument in `t001-disposition.md` means no data is lost today, but the marker-before-move ordering LUNA's review flagged is still reversed from what a strict audit-trail invariant would want. This is an operator design call, not a blocker, and is out of scope for this build.
5. **This reconciliation pass (B7) did not re-execute the runtime test suites itself.** It independently re-verified the four landed commits' existence, branch membership, and diff content directly (see Verification above), and transcribed the test-count and suite-pass evidence from the task brief that supplied this reconciliation rather than re-running the suites a third time. Anyone needing a from-scratch re-run should treat the commits above as the starting point, not this document's prose.
<!-- /ANCHOR:limitations -->
