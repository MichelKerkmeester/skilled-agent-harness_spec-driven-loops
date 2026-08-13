# 024 T001 Disposition — confirm-first gate (AUTHORITATIVE over build-spec.md)

> Read-only confirm-first pass grounded against origin `skilled/v4.0.0.0` = `596495262287`
> (current tip), read via `git show`/`git grep <ref>`. **This disposition OVERRIDES
> `build-spec.md` wherever they conflict** — it re-graded every finding against the live
> code and corrected two over-scoped entries (B5, B6). No fix may be built against a finding
> not marked GO here. The two corrections were independently re-verified against origin by
> the orchestrator (`isAppendLockReclaimable` pid-liveness at `atomic-state.ts:177`; the
> `FencedLeaseCoordinator.acquire` at `leaf-artifact-writer.ts:439`).

## Bottom line

- **GO-to-build (CONFIRMED-REAL):** B1, B2, B3, B4, F-018-03 (fence_token — folds into B1), B7 (metadata reconciliation).
- **HELD / REFUTED — do NOT build (already remediated in the tree):** B5, B6 (+ its leaf group F-037-01/F-039-01/F-039-02/F-036-04), F-004-01, F-004-02, F-004-03, F-002-02.
- **NEEDS-DESIGN (not a durability breach; operator call):** F-002-01.

Two structural conclusions:
1. **The build-spec's CONFIRMED grade for B5 and B6 is WRONG** — both defects are fully
   remediated at the build-spec's own tip `5410` AND at HEAD.
2. **LUNA's rulings are NOT a trustworthy build basis** — LUNA's F003/F004 descriptions and
   its F-002-01 "clean" ruling all describe code not in the tree. Only direct code reads count.

## Disposition (one row per finding)

| Build/Spec | LUNA | Location @ `596495262287` | Verdict | Evidence / probe |
|---|---|---|---|---|
| **B1** F-014-01 (REQ-001/002) | — | `append-only-ledger.ts:349` | **GO** | `public async appendAuthorized(event, proof)` — no capability param; guards are proof-shape/expiry(:623)/epoch(:643), zero fence/lease/token/high-water. `FenceCapability`/`#appendAuthorized`/`STALE_FENCE` grep = 0. Class exported + public → direct call callable today. Repro: unexpired proof + superseded lease → append succeeds. |
| **F-018-03** fence_token | "clean" | `append-only-ledger.ts:64-73`; `authorized-ledger-types.ts:28-37` | **GO** (part of B1) | `AUTHORIZATION_REFERENCE_FIELDS` closed 8-field set, no `fence_token`; type has none. Red-before test EXISTS: `branch-leases-waves.vitest.ts:615` asserts `authorization_ref.fence_token > 0`, currently `undefined` → fails. |
| **B2** F-014-02 | F001 | `transition-authorization-gateway.ts:726` | **GO** | Identity check gated behind `if (this.#options.identityResolver)`; default (no resolver) trusts caller `actorId`/`capabilityId`/`evidenceDigest` (shape-only :150-159 → flow :177-181 → persist :807-817). Even with a resolver, undefined fields "carry no opinion" (:774-781). |
| **B3** F-014-03 | F002 | `transition-policy-registry.ts:97-103` | **GO** | `implementationDigest = sha256(Function.toString(evaluate))` — source text only; captured state folds only via opt-in `capturedAuthorizationState` (:100-102). Repro: identical evaluate source, different closure allowlists, no capturedAuthorizationState → identical digest. |
| **B4** F-018-01/02, F-003-01 | F005 | `loop-lock.ts:242-243` | **GO** | `openSync(lockPath,'wx')` then SEPARATE `writeFileSync` → observably-empty window. Concurrent acquirer: `readLoopLock` `JSON.parse('')`→null; `!holder`+`lockExists` → `tryReclaimStaleLoopLock` renames creator aside → both `acquired:true`. Default path `acquireLoopLockFileOnly` (:577). Timing-dependent two-winner. **Red control:** the real single-winner test is `loop-lock.vitest.ts:185` (two child procs), NOT `:270-287` as build-spec said (that one passes). |
| **B7** meta | F007 | tasks.md/checklist.md vs `runtime/tests/**` | **GO** | Completion docs cite passing tests that DO NOT EXIST (`F-004-01 lets exactly one recovery process…`, `turns cyclic request data into a durable typed denial`, `converges exact attestations…`, `hard-private primitive rejects…` → 0 hits). Candidate SHA `9229cb8f3e` = a docs commit touching no runtime. The fabrication surface — reconcile honestly at close. |
| **B5** F-018-04 | F004 | `deep-loop/atomic-state.ts:176-266` | **REFUTED** | `isAppendLockReclaimable = owner === null || !processAlive(owner.pid)` (:176-177) — pid-liveness; a live owner is NEVER reclaimable. `APPEND_LOCK_DEADLINE_MS` (:144,:225) is only the acquire timeout. Release = CAS on pid+nonce (:255) + successor-restore. Reclaim = rename single-winner. Identical at `5410`. Build-spec's "age-based reclaim" is false. |
| **B6** F-003-02 (+F-037-01/F-039-01/02/F-036-04) | F003 | `deep-loop/leaf-artifact-writer.ts:436-497` | **REFUTED** | `writeLeafArtifacts` takes a cross-process `FencedLeaseCoordinator.acquire({resource: leafArtifactWriterResource(ctx.deltaPath)})` (:436-448), released in `finally` (:494); plus write-once target guard + dedup + crash recovery. Build-spec cited `:282-325` = `validateReported` (wrong). Identical at `5410`. |
| **F-004-01** effect single-winner | "clean" | `effect-gateway.ts:615` | **REFUTED** | Single-winner from the ledger append boundary: deterministic recovery event IDs + idempotency key, `writer.append` returns `idempotent` on match, stale `prior_head_hash` → AUTHORIZATION_INVALID under the frame-store O_EXCL lock. Two racing recoveries → exactly one commits. |
| **F-004-02** operator-decision single-winner | "clean" | `effect-gateway.ts:760` | **REFUTED** | `priorResolutions>1 → RECOVERY_STATE_INVALID`; different canonical facts → EFFECT_CONFLICT; else `resolutionWon = append(...).status==='appended'`. Deterministic resolution_id + head-CAS → one winner. |
| **F-004-03** attestation convergence | "clean" | `replay-fingerprint-attestation.ts:373` | **REFUTED** | Matching prior → `{status:'idempotent', receipt: durableReceipt(verified)}`; digest mismatch → ATTESTATION_CONFLICT; else append. Concurrent exact attestations converge. |
| **F-002-02** cyclic denial | "clean" | `transition-authorization-gateway.ts:130` | **REFUTED (caveat)** | Realistic case handled: shape-failing request → durable INVALID_INPUT denial; `canonicalJson` detects cycles (canonical-json.ts:117-123). Caveat: a cycle inside `value.event.envelope` passing shape checks would throw at `canonicalBytes` (:130), `#prepareContext` (:554) not try-wrapped → rejected promise. Not reachable from a stale file; theoretical under the packet threat model. Optional tiny hardening, NOT a confirmed defect. |
| **F-002-01** torn-tail ordering | "clean" | `immutable-frame-store.ts:502` vs `:522` | **NEEDS-DESIGN** | Quarantines FIRST (`renameSync` :502) THEN writes recovery marker (`O_EXCL` :522) — quarantine-before-marker, contradicting LUNA's "record before moving bytes." BUT byte-preserving atomic rename + `existsSync` idempotency (:493) → a crash leaves bytes recoverable and head at the prior verified frame → NO data-loss. Whether marker-first audit ordering is a hard invariant is an operator call. |

## Caller census (frozen at HEAD `596495262287`)

- **33 lib files · 32 `.appendAuthorized(` call-expressions · 46 test files** — matches build-spec exactly, no drift.
- **Definition:** `authorized-ledger/append-only-ledger.ts:349`.
- **Sanctioned wrapper:** `locks-and-fencing/fenced-ledger-writer.ts:76` (exists; method still public so not yet the ONLY path).
- **5 idempotent-replay sites (must NOT be auto-wrapped) at current lines:** `deep-ai-council-resume-adapter:1530`, `deep-alignment-resume-adapter:1497`, `deep-research-resume-adapter:1204`, `deep-review-resume-adapter:1413`, `contradiction-supersession/service.ts:286`.
- **`durableReceipt` is currently module-private** in `append-only-ledger.ts:197` (used :398/:445) — the build-spec's "must export it" requirement is confirmed still-open.
- ~30 simple-wrap sites (incl. 8 shadow-parity adapters) confirmed at build-spec lines — no drift.

## Net effect on the build

The atomic core (B1 + the 32-caller codemod + fence_token persistence) plus B2/B3 (identity+policy
digest) plus B4 (loop-lock atomic publish) plus B7 (honest metadata) is the WHOLE build. **B5, B6,
and the F-004 concurrency trio drop out entirely** — no code, no tests. This roughly halves the
concurrency-defect surface the build-spec projected and removes the highest-fabrication-risk
"prove a two-process single-winner" tests for already-correct code. F-002-01/F-002-02 are optional
hardening, operator-elected, not durability blockers.
