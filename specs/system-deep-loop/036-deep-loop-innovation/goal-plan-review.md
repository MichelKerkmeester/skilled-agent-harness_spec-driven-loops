# Independent adversarial review — 036 remaining execution plan

**Verdict:** REQUEST_CHANGES. Do not execute the first authority flip, retire a legacy writer, or treat the current checkout as a merge candidate until the P0 gates below are satisfied.

**Review basis:** the requested 036 briefing/specs and the current worktree implementation. The implementation is explicitly dark/unit-test-only, so this review treats a test certificate as evidence about a component—not proof that a live authority transition or rollback occurred.

## Ranked findings

### 1. The advertised rollback does not restore authority — P0

**Concrete failure scenario:** A mode reaches `new_authoritative_reversible`; the first five live runs expose corruption; the operator invokes that mode's rollback switch. The switch can freeze/fence/reconcile and emit a record that says `restoredAuthorityState: legacy_authoritative`, but all eight switches return `authorityMutation: false` and `phase014RestorationRequired: true`. `AuthorityRegistry` implements only the forward `cutover_ready -> new_authoritative_reversible` CAS. The durable selector therefore remains dark-authoritative while the rollback artifact says legacy was restored. New writes continue down the failing path, and a stale dark writer is not denied by a new rollback epoch.

**Required gate/mitigation:** Before the first forward CAS, implement the reverse state machine (`new_authoritative_reversible -> rollback_pending -> legacy_authoritative`) against the same live registry used at the canonical persistence boundary. For each mode, run an operator-realistic drill from an actual reversible authority record: admit a canonical write, trigger rollback, kill/restart at every durable boundary, read back the new legacy epoch, prove a legacy write succeeds, and prove the pre-rollback dark lease is rejected. Accept only registry/ledger/write-path evidence; `authorityMutation: false` is an automatic failure.

**Evidence:** `.opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/authority-registry.ts:125-188`; `.opencode/skills/system-deep-loop/runtime/lib/deep-research-rollback-gate/rollback-switch.ts:299-338` (the same two flags occur in all eight `*-rollback-gate/rollback-switch.ts` files); `014-staged-state-migration-and-authority-cutover/002-per-mode-authority-flip/spec.md:122,128,140-142,195-197`.

### 2. The “atomic” cutover publishes two contradictory durable facts — P0

**Concrete failure scenario:** Preflight passes and the coordinator appends the authority-transition event. The process then crashes at `afterLedgerAppendBeforeCas`, or the registry CAS conflicts. Ledger consumers can observe a committed event claiming the new epoch while the selector still routes to legacy. A hard process death can also leave the global `wx` transaction-lock file behind, so recovery attempts fail permanently with `ACTIVE_TRANSACTION_CONFLICT`. Retry can repair one narrow crash path, but it does not make the interval atomic and cannot retract an event after a genuine CAS conflict.

**Required gate/mitigation:** Put selector mutation and the authoritative commit record in one transactional store, or use a durable prepare/commit protocol in which only a commit marker changes authority and startup reconciliation deterministically completes or aborts every prepared transition. Add stale-lock ownership/lease recovery. The crash matrix must cover death before/after prepare, registry publish, commit publication, and lock cleanup, and assert that every observer derives exactly one authority from the same committed epoch.

**Evidence:** `.opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/cutover-coordinator.ts:121-202`; `.opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/authority-registry.ts:95-121`; `014-staged-state-migration-and-authority-cutover/002-per-mode-authority-flip/spec.md:124,139,199-200`; its `plan.md:81-86,145-148`.

### 3. A dormant `identityResolver` leaves the irreversible authorization boundary caller-asserted — P0

**Concrete failure scenario:** A live coordinator is constructed as current tests are, without `identityResolver`. A caller supplies arbitrary `actorId`, `capabilityId`, and `evidenceDigest`; the gateway skips identity checks entirely. Worse, preflight validates the certificate against a caller-supplied expectation, but the coordinator does not require `request.policyId/version/digest` to equal the certificate's approving policy. A request can therefore present a certificate approved under policy A and ask the gateway to authorize under registered policy B. If B allows the supplied evaluation input, an untrusted identity can authorize an irreversible flip with a policy that did not approve the certificate.

**Required gate/mitigation:** Make a deployment identity resolver mandatory and fail closed for this event type. A null resolution or any missing actor/capability/evidence binding must deny. Derive those values from authenticated operator credentials and verified evidence, not request fields. Require the gateway policy tuple to exactly match the cutover certificate's approving-policy tuple and resolve both through a pinned trusted policy registry. Add negative integration tests for absent/partial resolvers, forged identities, and policy substitution.

**Evidence:** `.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts:726-783`; `.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts:312-342`; `.opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/cutover-coordinator.ts:87-101,147-165`; `.opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/preflight.ts:44-60`. Repository search found no runtime `identityResolver` wiring outside its declaration and conditional check.

### 4. Rollback-window closure can be manufactured from unrelated executions and no health data — P0

**Concrete failure scenario:** Fourteen days after opening a mode's window, a caller submits five syntactically valid `trusted-completion` rows taken from another mode, epoch, or certificate. `evaluateRollbackWindow` checks only positive epoch and 64-hex digest; execution rows are not bound to the window's mode, opening epoch, certificate, or time interval. The caller then supplies an empty monitored-signal batch, which evaluates to `continue`, and passes that result plus an eligible-looking evaluation to `closeRollbackWindow`, which does not recompute or bind either object to the window. Phase 015 consumes the signed closure and deletes the only real rollback path without five valid executions or any degeneration-health observation.

**Required gate/mitigation:** Add mode, window digest, exact authority epoch, cutover certificate, candidate SHA, and observed-at bounds to every execution receipt and verify its certification chain. Require fresh readings for every declared signal family; empty, missing, duplicate, stale, or cross-mode readings must block. `closeRollbackWindow` must recompute evaluation and signals from verified receipts inside the closure operation and sign the complete input set. Add adversarial cross-mode/cross-window substitution tests and an explicit empty-batch denial test.

**Evidence:** `.opencode/skills/system-deep-loop/runtime/lib/cutover-certificate/rollback-window.ts:125-198,215-294,367-403`; its current test suite explicitly expects an empty signal batch to continue (`.opencode/skills/system-deep-loop/runtime/test/cutover-certificate.vitest.ts:900`); `015-legacy-writer-retirement/spec.md:65-72,87-88,117-123`.

### 5. The current candidate cannot build and is not an immutable reviewable tree — P0

**Concrete failure scenario:** An operator finishes phase 014/002 from the current checkout and starts cutover based on locally green component tests. The runtime does not type-check: three new modules import `appendAuthorizedThroughFence`, but `fenced-ledger-writer.ts` does not export it. The checkout also contains 421 changed/untracked paths, and its HEAD, local origin-tracking ref, main, and briefing anchor are different commits. Test or certificate evidence can therefore refer to a tree that cannot be reconstructed or merged, while a later worktree contributes a different helper implementation.

**Required gate/mitigation:** Block all authority operations until a clean, isolated worktree at one recorded candidate SHA has zero unexpected paths; all imports resolve; no-emit TypeScript, unit, integration, crash, and package gates pass on that exact SHA; and every certificate records that SHA and tree digest. Land the additive build first, then create a new clean execution candidate—do not cut over from this 421-path working set.

**Evidence:** observed `git status --short | wc -l` = `421`; `HEAD=9229cb8f3e281c9291e6d631237528bc755e6f4b`, `origin/skilled/v4.0.0.0=d76f84439ae94c3cc5f5dd70ee38c0462131c5e1`, `main=9c5c7c5bde4dbb468fdb11df3c5afdbaa87443e3`; no-emit TypeScript failed with TS2305 in `cutover-certificate/certificate.ts:5`, `inflight-state-migration/migration-dispositions.ts:7`, and `per-mode-authority-flip/ledger-event.ts:5`; `.opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/fenced-ledger-writer.ts:1-79`; `/tmp/ks/036-epic-briefing.md:5,49-57`.

### 6. `BLOCKED` in-flight rows are accepted despite the frozen spec saying they deny cutover — P0

**Concrete failure scenario:** A mode's migration contains a blocked state row whose legacy owner cannot be reconciled. The handoff marks it terminal `BLOCKED`, with zero `ABORTED` rows. Preflight explicitly treats `BLOCKED` as legitimate and returns ready. The mode flips, the legacy route is demoted, and the blocked row is stranded or later interpreted by the new writer under an incompatible contract. This directly violates REQ-007's “unresolved or blocked state denies the flip.”

**Required gate/mitigation:** Require `blockedRows === 0` and `abortedRows === 0` for the selected mode. If permanent legacy ownership is valid, model it as a separately verified `PIN` disposition with a live owner, read/write routing rule, expiry/review policy, and proof that the flipped mode can never admit it; do not overload `BLOCKED`. Add a preflight test that the current blocked-but-no-aborted handoff is denied.

**Evidence:** `.opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/preflight.ts:62-85`; `.opencode/skills/system-deep-loop/runtime/lib/inflight-state-migration/handoff.ts:118-170`; `014-staged-state-migration-and-authority-cutover/002-per-mode-authority-flip/spec.md:123`.

### 7. Frozen order and one-mode blast radius are not enforced against durable state or shared backends — P0

**Concrete failure scenario:** The caller claims an arbitrary `alreadyFlippedModes` set and requests `008-deep-alignment` first. The order guard accepts it because it enforces only “common before benchmark variants,” not the eight-mode prefix. Alignment and review alias to the same `backend:review-loop` and lock; common plus all three improvement variants write `backend:deep-improvement-score`. During a partial cutover, legacy and dark contracts can therefore append to one unpartitioned journal. `improvement-journal.cjs` accepts a caller-provided path, has no required mode/authority-epoch identity, and uses an unlocked append. A mixed-epoch crash or a rollback of common while a variant remains new can corrupt ordering, replay, or ownership outside the selected mode.

**Required gate/mitigation:** Derive completed predecessors from verified registry/ledger state—never from the request—and require the exact frozen prefix. Encode dependency closure for rollback: a shared common authority cannot revert while new-authoritative dependents remain active unless all are fenced and rolled back as one governed operation. For every shared backend, either use one authority domain or partition records, idempotency keys, cursors, locks, and replay by mode plus epoch. Prove the full mixed-state matrix with concurrent legacy/dark writers before each next flip.

**Evidence:** `.opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/manifest-order.ts:19-41`; `.opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/cutover-coordinator.ts:69-80`; `014-staged-state-migration-and-authority-cutover/002-per-mode-authority-flip/spec.md:126-128,149-168`; `.opencode/skills/system-deep-loop/runtime/lib/write-set-conflict-graph/shipped-census.ts:36-40,240-262,379-390,443-455,508-519,573-584,647-669`; `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/improvement-journal.cjs:79-118,125-152`.

### 8. Cutover certificates validate self-reported shapes, not the evidence authorities — P1

**Concrete failure scenario:** A caller constructs a rollback-drill object with `passed: true`, a matching classification digest, and arbitrary other facts, plus migration receipt objects containing unique 64-hex `evidence_digest` strings. `buildCutoverCertificate` accepts them without verifying the rollback certificate's signature/digest or each migration receipt's issuer, mode, candidate, epoch, or payload. `verifyCutoverCertificate` later recomputes only the aggregate certificate digest and caller expectation. The resulting internally consistent certificate can authorize cutover without the underlying drill or migrations ever occurring.

**Required gate/mitigation:** Each evidence type needs a trusted verifier and issuer registry. The certificate builder must verify signatures/digests and bind mode, candidate SHA, source/target epoch, manifest, and policy before aggregation; receipt digests alone are not evidence. Persist the verified source envelopes or content-addressed references and add tamper/substitution tests for each evidence family.

**Evidence:** `.opencode/skills/system-deep-loop/runtime/lib/cutover-certificate/certificate.ts:90-150,202-233`; `014-staged-state-migration-and-authority-cutover/002-per-mode-authority-flip/spec.md:121-125,129-130`.

### 9. Phase 015's zero-use proof is not a closed-world proof for deployed or delayed consumers — P1

**Concrete failure scenario:** Telemetry shows zero legacy calls during the observation window and positive controls prove the probes work. An offline N-1 worker, cached client bundle, delayed queue item, repair job, or replay of an old log was absent during that window. After irreversible deletion it resumes and invokes the removed writer/serializer contract. The request either fails with no recovery path, or an old client reconstructs state differently from the retained archival reader and silently diverges.

**Required gate/mitigation:** Freeze a closed-world inventory of deployed binary/config hashes, API versions, queue age, cache/service-worker TTLs, scheduled jobs, repair tooling, and replay producers. Drain/restart or expire every member beyond its proven maximum dormancy horizon. Keep a server-side deny/tombstone for old write protocol versions with mode/epoch telemetry, while preserving tested read-only upcasters and archival readers. Require a delayed/offline N-1 canary and oldest-supported-log replay to hit the expected deny/read paths before deletion.

**Evidence:** `015-legacy-writer-retirement/spec.md:57-63,79-96,116-125,145-163`; its `plan.md:93-122,128-139,156-163`.

### 10. Integrating latest only after irreversible retirement is sequenced too late — P1

**Concrete failure scenario:** All eight modes flip and phase 015 deletes legacy writers. Phase 017 then integrates a moving origin change to a schema, shared backend, selector, or client contract. Its recensus correctly reopens phase 014 or 015, but the relevant rollback window is already closed and the legacy implementation has already been removed. Re-verification now requires reconstructing a deleted safety path, and the already-issued per-mode certificates no longer describe the merged code.

**Required gate/mitigation:** Establish an integration freeze/merge train before the first irreversible CAS. Reconcile latest origin before each flip, invalidate affected certificates on any contract/tree drift, and freeze shared authority/persistence surfaces through phase 015. Perform another clean integration immediately before deletion; relevant drift must reopen the owning phase while rollback assets still exist. Keep phase 017 as the final recensus, not the first time current main is tested against irreversible decisions.

**Evidence:** `/tmp/ks/036-epic-briefing.md:5,67-68`; `015-legacy-writer-retirement/plan.md:156-163`; `017-integrate-latest-and-closeout/spec.md:50-52,59-63,79-83,106-113`.

### 11. Stage B can pass without exercising the authority failures introduced by phases 014/015 — P1

**Concrete failure scenario:** Stage B runs the listed phase-007 effect crash points and phase-012 fixture replay, all on isolated single-version invocations. It never runs N-1 and N processes concurrently through the live authority registry, never crashes between cutover event append and selector CAS, never performs the reverse authority CAS, and never exercises shared-backend mixed epochs. All declared acceptance rows pass while production loses an authority commit, double-writes a shared journal, or cannot roll back after restart. Degeneration can also appear green because the current signal evaluator accepts no readings as `continue`.

**Required gate/mitigation:** Extend the gate manifest with a mandatory authority lifecycle matrix for all eight modes: rolling N-1/N processes, every partial-order state allowed by the plan, shared-backend concurrency, crash at each forward and reverse durable boundary, restart/reconciliation, stale-writer rejection, window closure, and post-retirement old-client/log replay. Require positive controls and complete family coverage for health signals. Bind each result to the final candidate SHA and actual registry/backend implementation.

**Evidence:** `016-whole-system-gate/spec.md:60-69,87-107,125-136,142-160,173-176`; `.opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/cutover-coordinator.ts:38-48,121-202`; `.opencode/skills/system-deep-loop/runtime/lib/cutover-certificate/rollback-window.ts:215-294`.

### 12. Sparse-canonical validation can certify files that are absent from the commit — P1

**Concrete failure scenario:** Recursive validation runs in this dirty checkout and follows the real `.opencode/specs` tree plus untracked/twin content. The report is green, but the final commit or sparse checkout omits one canonical file, records a different twin, or resolves a different path topology. Review and validation have then inspected a tree that cannot be reproduced from the candidate SHA.

**Required gate/mitigation:** Run the final recursive validator and evidence checks from a fresh detached worktree (or extracted archive) created solely from the exact candidate commit. Assert every canonical/twin file is tracked, compare required digests and symlink/real-directory topology, reject untracked evidence, and record `git status`, `git ls-files`, and tree hash in the SOL receipt. Repeat after the final integration commit.

**Evidence:** `/tmp/ks/036-epic-briefing.md:51-56`; `016-whole-system-gate/spec.md:103-106,125,133-136,155-161`; `017-integrate-latest-and-closeout/spec.md:59-63,79-83,97-100`. The current checkout has 421 changed/untracked paths, so it cannot supply this proof.

### 13. Phase 017 names the wrong protected baseline — P1

**Concrete failure scenario:** The final gate runner follows phase 017 literally and resolves “parity against 000” / “000 baseline artifacts,” while phase 016 declares phase 003 the only accepted comparison authority. Depending on tooling, the run either targets a nonexistent baseline, silently chooses a default, or compares against the wrong artifact family. A green final receipt then does not prove the protected phase-003 behavior.

**Required gate/mitigation:** Correct phase 017 before execution and encode the baseline as a machine-validated `{phase_id, exact_sha, manifest_digest}` tuple. Reject aliases such as `000`, missing IDs, and any result whose tuple differs from the phase-016 gate manifest.

**Evidence:** `017-integrate-latest-and-closeout/spec.md:62,82,110`; compare `016-whole-system-gate/spec.md:60-65,100-106,125-133`.

## Verification notes

- Read all files named in the review request, plus the live authority selector/coordinator/order/preflight, rollback switches, write-set census, certificate implementation, and representative shared journal.
- Ran the runtime no-emit TypeScript check. It failed with three missing-export errors described in finding 5.
- Did not run mutation-capable runtime tests because the review contract permits writing only this findings file. No authority state, runtime code, spec document, database, or repository metadata was modified.

Review status: REQUESTED_CHANGES
