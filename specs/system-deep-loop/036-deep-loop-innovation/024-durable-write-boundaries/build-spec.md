# 024 Durable-Write-Boundaries — Grounded Build Specification

> Produced by a read-only prep pass grounded against origin `skilled/v4.0.0.0` tip
> `5410a4bfcb` (the code state), not the stale worktree HEAD. **Every finding here is a
> hypothesis until T001 re-confirms it at the build-time HEAD** — the last build of this
> packet was fabricated when rushed, so confirm-before-build is mandatory (spec.md §"no
> fix may be built against an unconfirmed finding").

## 0. Environment (read first — it changes WHERE you build)

- Build from a **fresh worktree/clone cut at the current origin tip** (or the clean anchor
  `5c98e4654e`), NOT a stale tree. The `0129` worktree's committed HEAD is ~191 commits
  behind origin, its `specs/` copies are partial-checkout near-empty stubs, and it carries
  a large uncommitted divergence — all hazards for a globally-serializing atomic migration.
- Verify changes with `git diff` against the real ancestor `5c98e4654e`, **never**
  `git diff FETCH_HEAD` (the leak-guard leaves the local index stale → false deletions).
- 036 is a **shared branch** — other sessions edit `047/048/049`. Confirm ownership before
  touching anything outside 024's own surface.

## 1. P0-set reconciliation — VERDICT: complementary, not contradictory

The spec's `F-014-*` IDs are the 016 findings-register vocabulary (review-time line
numbers, pre-partial-fix). LUNA's `F001/F002/…` set is an independent 20-iteration review
against the partial-fix (`5410`) state. Different ID spaces, mostly the **same defects**.
There is **no unresolvable conflict**. Build this deduplicated set:

| Build ID | Spec | LUNA | Defect | State @ HEAD | Authority |
|---|---|---|---|---|---|
| **B1 (P0)** | F-014-01 / REQ-001+002 | — | Append boundary unfenced; `appendAuthorized` public + bypassable | CONFIRMED unbuilt (public @ `append-only-ledger.ts:349`; only expiry `:624` + epoch/state `:644` guards; zero `#appendAuthorized`/`FenceCapability`/`STALE_FENCE`) | **Operator ruling (ADR-001)** |
| **B2 (P0)** | F-014-02 | F001 | Gateway trusts caller `actorId`/`capabilityId`/`evidenceDigest` | CONFIRMED — identity check fail-open unless `identityResolver` configured (`gateway.ts:726`, `:774-781`, caller values flow at `:177-181`,`:807-817`) | Both agree |
| **B3 (P0)** | F-014-03 | F002 | Policy identity omits closure-captured state | CONFIRMED — `implementationDigest` digests only `evaluate.toString()` (`transition-policy-registry.ts:97-99`); captured-state digest (`:100-103`) is opt-in | Both agree |
| **B4 (P0)** | F-018-01/02, F-003-01 | F005 | Loop-lock two-winner | CONFIRMED — `openSync(lockPath,'wx')` then *separate* `writeFileSync` (`loop-lock.ts:243-245`); concurrent acquirer reads empty/partial → `holder=null` → stale-reclaim while creator holds. LUNA's fresh-acquisition partial-file window is the sharper root cause | Both; LUNA sharper |
| **B5 (P1)** | F-018-04 | F004 | Append-lock reclaim owner-blind | CONFIRMED — `AppendLockOwnerToken{pid,nonce,acquiredAtIso}` (`atomic-state.ts:138`) but age-based deadline reclaim (`:143`), not owner-checked CAS | Both agree |
| **B6 (P1)** | F-003-02, F-039-02 | F003 | Staged leaf publication lacks cross-process single-winner | CONFIRMED residual — in-process crash-recovery landed, no process-shared claim (`leaf-artifact-writer.ts:282-325`) | Both agree |
| **B7 (P1, meta)** | — | F007 | Completion metadata contradicts unchecked gates | CONFIRMED (this is the fabrication surface, §7) | LUNA only |

**The one tension + resolution:** LUNA's clean rulings (review-report:204) list the public
`appendAuthorized` bridge as *not a breach* — consistent with the spec's severity
calibration (spec.md:90-93: risk is "operator or stale local file, not remote attacker",
cutover-readiness not breach). The operator **still rules** (ADR-001,
`decision-record.md:36-68`) for gateway-only mutation, so that "no unfenced append exists"
is a **test-assertable property of the export surface**, not a convention. **B1 is
authoritative by operator governance, overriding LUNA's convenience ruling.** Record this in
the build's STEP-0 note. Do not treat LUNA's clean ruling as license to skip B1.

**LUNA-REFUTED findings — DO NOT build unless T001 re-confirms at HEAD:** `F-002-01`
(torn-tail ordering), `F-002-02` (cyclic denial), `F-004-01/02` (effect single-winner),
`F-004-03` (attestation convergence), `F-018-03` (branch-lease fencing). The
implementation-summary reads their zero-diff files as "unaddressed"; LUNA (independent)
reads them as "already clean". The last fabrication invented passing tests for exactly
these (`F-004-01 lets exactly one recovery process…`, `turns cyclic request data into a
durable typed denial`) — tests that **do not exist** in the tree. This is the single
biggest re-fabrication guard: confirm-or-refute each with a cited probe first.

## 2. Caller census (migration checklist)

Confirmed at `5410a4bfcb` via `git grep`: **33 lib files**, **46 test files**, **32 actual
`.appendAuthorized(` call-expressions** in lib (matches ADR-005 "32 production callers").
The "~109 caller files" figure elsewhere is stale noise — use 33/32.

- **Definition (1):** `authorized-ledger/append-only-ledger.ts:349` → becomes `#appendAuthorized`.
- **Real call-sites that MUST route through the fence (~30 across ~28 files)** — simple-wrap
  (obtain fence capability → gateway append). Includes: `dark-ledger-adapter.ts:156`,
  `blinded-adjudication/service.ts:711`, `branch-leases-waves/durable-orchestrator.ts:925`,
  `claim-continuity/claim-service.ts:743`, `conditional-fanin/decision-event.ts:231`,
  `contradiction-supersession/service.ts:222`+`:286`, `cycle-detection/cycle-health-events.ts:526`,
  `deep-loop/continuity-identity/continuity-identity-service.ts:614`,
  `hierarchical-budgets/budget-authority.ts:1248`, `lock-lifecycle-evidence.ts:251`,
  `next-focus/next-focus-events.ts:385`, `replay-fingerprint/replay-fingerprint-attestation.ts:423`,
  `rollback-drills/rollback-drill-ledger.ts:296`+`:570`, `sealed-reference-artifacts/artifact-events.ts:440`,
  `stopping-clocks/stopping-clock-events.ts:236`, `stream-fold-gauges/gauge-evidence.ts:319`,
  `voc-allocation/events.ts:338`, and 8 shadow-parity harness adapters (agent-improvement `:1805`,
  deep-ai-council `:2357`, deep-alignment `:2732`, deep-improvement-common `:2473`,
  deep-research `:2323`, deep-review `:2419`, model-benchmark `:1719`, skill-benchmark `:1873`).
- **⚠ Idempotent-replay sites (ADR-009, `decision-record.md:418-439`) — MUST NOT be
  mechanically wrapped.** They compute a committed-match and must short-circuit to a receipt
  rebuilt from the committed frame (`durableReceipt`, which must be exported), entering the
  fence **only for a genuinely new append**. A naive codemod that wraps these regresses
  idempotent replay to `HEAD_CONFLICT`: `deep-ai-council-resume-adapter:1530`,
  `deep-alignment-resume-adapter:1497`, `deep-research-resume-adapter:1204`,
  `deep-review-resume-adapter:1413`, `contradiction-supersession/service.ts:286` (exact-retry).
- **Sanctioned wrapper (becomes the ONLY internal bridge caller):**
  `locks-and-fencing/fenced-ledger-writer.ts:76` — `append()` → `coordinator.withFence(...)`
  → `appendAuthorized` (`:59-76`). The fix makes this mandatory.
- **Type-only / mention (2), no migration:** `mode-contracts/conformance.ts`, `mode-contracts/mode-contract-types.ts`.
- **Cast-bypass audit:** no `as any`/`as unknown` reach-around invokes `appendAuthorized`
  today; once `#private`, a standing grep gate (`rg "as any|as unknown" runtime/lib | rg appendAuthorized` = 0)
  plus the tsc compile-error IS the completeness proof.

## 3. Fence-capability API design (REUSE existing machinery — do not reinvent)

Mature fence machinery already exists in `locks-and-fencing/` + `branch-leases-waves/`:
- `FencedLeaseCoordinator.withFence<T>(lease, prepare)` (`fenced-lease-coordinator.ts:431`) /
  `withFences` (`:439`) — the capability minter.
- `FencedLease { resource, fenceToken, leaseId }` (`locks-and-fencing-types.ts:64-67`);
  monotonic issuance `fenceToken = baseToken+1` (`:557`); `STALE_FENCE` at `:1110` / error
  code `locks-and-fencing-errors.ts:19`.
- **High-water-mark already implemented:** `branch-leases-waves/ledger-fold.ts:431`
  (`if (body.fence_token <= prior.fenceToken) reject`); `agent-improvement-rollback-gate/rollback-switch.ts:405-407`.

Design (grounded in ADR-004/006/008, flagged there as designed-but-unbuilt — verify at build):
1. **`#appendAuthorized` hard-private** — rename `public async appendAuthorized` (`:349`) →
   `async #appendAuthorized(event, proof, capability: FenceCapability)`. Matches the file's
   existing `#`-private style (`#options`, `#store`, `#verifyProof`).
2. **`FenceCapability` token** — opaque branded object minted by the coordinator, backed by a
   module-scoped `WeakMap` (ADR-008) so a constructed literal cannot forge it. Its `validate()`
   runs **before** prepare/proof-verify/idempotency/commit, checking (a) resource-key equals the
   ledger's computed key and (b) the current-lease assertion; expired/released/superseded →
   `AuthorizedLedgerError(STALE_FENCE, 'authorization', …)`.
3. **Public gateway** — keep `FencedLedgerWriter.append(request)` (`fenced-ledger-writer.ts:34-79`)
   as the public bridge; rewire `withFence` to hand the minted capability into the closure →
   `#appendAuthorized`. The class export stays (`index.ts:5`) but the append method is private;
   the only reachers are `FencedLedgerWriter` + one white-box test helper (ADR-008).
4. **High-water-mark / STALE_FENCE (REQ-002)** — `validate()` compares the capability's
   `fenceToken` to the durable current lease's `lastFenceToken`; a superseded (lower-token)
   writer fails `STALE_FENCE` **before any frame commits**. Reuse `ledger-fold.ts:431` +
   `rollback-switch.ts:405-407`.
5. **Persisted fence token (ADR-004)** — the numeric token binds into the persisted
   `AuthorizationReference`, NOT the closed event envelope. This means coordinated edits to the
   closed record shape: type (`authorized-ledger-types.ts:28-37`), closed-set constant
   `AUTHORIZATION_REFERENCE_FIELDS` (`append-only-ledger.ts:64-73`, guarded by `hasExactFields`),
   `authorizationReference()` builder (`:236-247`), `validateFrameScalars` (`:180-185`). **This
   is exactly the field whose absence fails the live test** (`branch-leases-waves.vitest.ts >
   persists the held ledger fence…` asserts `frame.authorization_ref.fence_token`, currently
   `undefined`) — a red-before control you get for free.
6. **Coordinator issues/rotates** — `acquire()` (`:267`) grants `fenceToken=baseToken+1`;
   `withFence`/`withFences` mint the capability for the guarded closure.

## 4. Concurrent-write defects — per-finding disposition

- **F-018-03** → fence_token persistence (part of B1). Mechanism present
  (`durable-orchestrator.ts:944`); the failing `persists the held ledger fence…` test is a B1
  dependency (§3.5), red-before → green when fence_token persists.
- **F-018-04** → **B5**. Owner-blind age-reclaim (`atomic-state.ts:135-169`). Red: two-process
  test where a successor's lock is age-reclaimed/unlinked by a stale owner. Green: owner/token
  CAS reclaim + compare-and-delete release.
- **F-003-02** → **B6**. No cross-process claim (`leaf-artifact-writer.ts:282-325`). Red:
  two-process same-iteration publication contention. Green: process-shared claim + barrier.
- **F-002-01, F-002-02, F-004-01, F-004-02, F-004-03** → **LIKELY REFUTED (HOLD for T001).**
  Their files are zero-diff and LUNA ruled them clean. Build ONLY if a cited probe reproduces
  the defect at HEAD. Do not write a fix — or a test — against an unconfirmed one.

Net: ~3 genuine build targets (B5, B6, F-018-03-via-B1); 5 refuted-pending-T001.

## 5. Proof plan (objective checks before touching code)

1. **B1+B2 core control:** RED — acquire a fence, supersede it (higher-token lease on same
   resource), append with the still-unexpired original proof → **succeeds today** (no fence
   check). GREEN — rejects `STALE_FENCE` **before any frame commits** (assert frame store
   unchanged). Also: direct `new AppendOnlyLedger(...).appendAuthorized(...)` — callable today
   (`index.ts:5` + public `:349`), a compile error after.
2. **No cast-reachable append (REQ-001/SC-002):** `#private` → tsc is the proof; standing grep
   gate (§2) = 0; export-surface unit test asserts only `FencedLedgerWriter` + the white-box
   helper reach it.
3. **B3 (policy identity):** two policies with identical `evaluate` source but different
   captured allowlists → **different digests** (`transition-policy-registry.ts:97-111`).
4. **B4 (loop-lock):** the existing failing two-process test (`loop-lock.vitest.ts:270-287`) is
   the red control; green after the fresh-acquisition partial-file window closes (atomic
   write-temp+rename, not `openSync('wx')`+separate write).
5. **B5/B6:** one two-process single-winner test each, deterministic barriers not sleeps (a
   skipped concurrency test = checklist failure, Risk R-003).
6. **Whole gate:** baseline BEFORE any edit, delta at close. **Trap:** the 168-file aggregate +
   shadow-parity/certificate suites HANG on append-lock — run the per-mode matrix per-file, tsc
   from `runtime/`, `git checkout -- database/` before isolation runs, never `--fileParallelism`.
7. **Evidence (REQ-U05):** every completion claim cites test name + suite-content digest +
   candidate SHA. The last fabrication cited SHA `9229cb8f3e` (an unrelated `037-spec-gate`
   docs commit) ~20×; a bare SHA or "N/N passing" string is a hard fail.

## 6. Codemod plan

tsc is the completeness oracle: demoting to `#private` breaks every un-migrated caller.
1. **Inventory (read-only):** ts-morph — every `CallExpression` whose callee is
   `PropertyAccess` `appendAuthorized` on an `AppendOnlyLedger`-typed value (type-checker-driven,
   not text). Cross-check against §2; a mismatch means wrong type resolution.
2. **Classify:** (a) simple-wrap vs (b) the 5 idempotent-replay sites (must be hand-authored to
   return `durableReceipt(committedFrame)` on the committed branch; enter the fence only for new
   appends). **The codemod must NOT auto-wrap class (b)** — flag as typed TODOs.
3. **Apply** the simple-wrap rewrite; leave (b) for hand-authoring.
4. **Demote** `appendAuthorized`→`#appendAuthorized` as a **separate ordered edit within the
   same landing** (ADR-005 zero-length window — gateway path first, callers migrated, export
   demoted immediately after, all one landing).
5. **Prove:** tsc rc0 from `runtime/`; any missed caller is a compile error. Then the grep gate
   + export-surface test.
6. **Tests (46 files):** the white-box helper (ADR-008) acquires a real fence and replaces the
   ~89 in-scope direct calls.

## 7. Risk / sequencing

**Highest fabrication risk (guard hardest):**
1. The 5 ADR-009 idempotent-replay sites — a mechanical wrap silently regresses replay; a
   builder under pressure will weaken the test to make it pass. Hand-author red→green per adapter.
2. The 5 LUNA-refuted findings — the last fabrication invented passing tests for exactly these.
   T001-confirm-or-refute with a cited probe before any fix; a green suite alone is not acceptance.
3. `fence_token` persistence — touches the closed 8-field `AUTHORIZATION_REFERENCE_FIELDS`; a
   partial edit breaks frame validation for every reader.

**Must be TRUE before B1 lands:** STEP-0 P0 reconciliation recorded (this doc) + T001
classification of all 18 findings at HEAD; baseline suite numbers captured (028's residual was
an unrecoverable missing baseline — do not repeat); the §2 call-site inventory frozen; clean
anchor recovered from `5c98e4654e`.

**Sequence (= plan.md Phases 1-6):** 1 T001 + inventory (read-only, fan-out-able). 2 B1 atomic
core (gateway-only + `#appendAuthorized` + `FenceCapability` + STALE_FENCE + high-water + codemod
migration, **one tsc-atomic landing**; globally-serializing — freeze 047/048/049 overlap). 3 B2/B3
identity+policy alongside 4 B4/B5/B6 concurrency once the gateway exists. 5 B6 leaf publication
(land the closed parser early; 026 depends). 6 B7 reconcile completion metadata + green-after +
delta gate + **independent adversarial pass (different actor than the builder, REQ-U04)**.

**Blast radius:** largest in the tree (Risk 24/25, spec.md:293) — rewrites the exact mutation
boundary 014 makes authoritative. Rollback (ADR-001): revert the export-demotion commit alone;
fencing stays inside the gateway, the direct export returns. Severity stays
**cutover-readiness, not breach** — carry that calibration verbatim, do not re-escalate.
