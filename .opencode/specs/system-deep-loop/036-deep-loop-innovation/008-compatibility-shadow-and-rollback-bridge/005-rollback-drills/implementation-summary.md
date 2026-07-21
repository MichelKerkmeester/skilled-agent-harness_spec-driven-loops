---
title: "Implementation Summary: Rollback Drills"
description: "Implemented and verified hermetic rollback drills, fail-closed integrity evidence, and freshness-bound cutover refusal."
trigger_phrases:
  - "rollback drills implementation"
  - "rollback drill verification evidence"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/005-rollback-drills"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/005-rollback-drills"
    last_updated_at: "2026-07-21T04:31:14Z"
    last_updated_by: "codex"
    recent_action: "Replaced theatrical rollback evidence with durable readback and full-tail replay proof"
    next_safe_action: "Hold for later cutover verification"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/rollback-drills/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/rollback-drills.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Rollback Drills

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec folder** | `system-deep-loop/036-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/005-rollback-drills` |
| **Completed** | 2026-07-21 |
| **Level** | 2 |
| **Status** | Complete |
| **Authority posture** | Additive and dark; legacy remains canonical |
| **Runtime surface** | Shipped OpenCode/Node TypeScript runtime |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

The leaf now has an executable rollback-drill API that compares a separately constructed control reconstruction with
the state durably written and read back from an isolated sandbox authority store. One invocation performs a legal
sandbox-only forward authority CAS, bounded spine work, internally observed regression, admission freeze, spine fence,
per-row disposition application, receipt reconciliation, new-epoch legacy restoration, durable state replacement and
readback, stale-writer denial, resumed legacy continuation, full-tail replay comparison, disposable-state cleanup,
and immutable certificate issuance.

| Module | Purpose |
|--------|---------|
| `runtime/lib/rollback-drills/rollback-drill-types.ts` | Versioned manifest/certificate contracts, fault-detector registry, window constants, and evidence types |
| `runtime/lib/rollback-drills/rollback-drill-contract.ts` | Exact-key preflight, current-input bindings, classification closure, per-row disposition transforms, canonical digests, and control reconstruction |
| `runtime/lib/rollback-drills/sandbox-authority-store.ts` | Temporary-root guard, protected-path digests, disk-backed exact-state/epoch CAS, atomic state restoration, validation, and raw durable readback |
| `runtime/lib/rollback-drills/rollback-drill-ledger.ts` | Production-shaped authorization gateway, append-only ledger, post-divergence range coverage, replay attestation, and receipt/effect recovery integration |
| `runtime/lib/rollback-drills/rollback-drill-runner.ts` | Full forward-detect-freeze-fence-reconcile-restore-resume-verify-cleanup execution |
| `runtime/lib/rollback-drills/rollback-certificate.ts` | Durable-provider signing, write-once certificate storage, tamper verification, and current-input cutover refusal |
| `runtime/lib/rollback-drills/index.ts` | Public API exports |
| `runtime/tests/unit/rollback-drills.vitest.ts` | Mode matrix, fault matrix, isolation, window, integrity, freshness, tamper, and fail-closed verification |

No pre-existing runtime writer, authority record, database, or consumed service module was changed.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The feature ships as a new programmatic module with no registration in a legacy writer or live authority path. The
focused suite creates real temporary files, ledgers, effects, CAS records, and signed certificates, then removes each
disposable lane. TypeScript, alignment, comment hygiene, mutation sensitivity, and strict packet validation form the
delivery gate.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Require current mode and input bindings separately from the manifest | A self-consistent stale manifest cannot prove freshness; the caller must provide independently resolved current identities |
| Execute authority transitions only in a disk-backed temporary store | The drill must prove exact-state/epoch CAS behavior without acquiring a route to real authority |
| Issue signed failed certificates | Failed and ambiguous runs remain durable evidence, while the cutover verifier refuses them |
| Preserve the cutover ledger but delete mutable lane state | Reviewers retain the causal record without leaving resumable synthetic state or effects behind |
| Compare replay components and legacy bytes separately | Matching final state alone could hide divergent event history or serializer behavior |
| Read the restored reconstruction and bytes from storage | Recomputing both expected and resumed values with one pure function makes restoration equality tautological |
| Fork the proof control after the real recovery tail | Authorization decisions contain random identities; sharing the immutable prefix isolates restoration state without discarding real cutover, effect, or rollback events |
| Materialize every declared disposition in restored state | Validation and counts alone do not prove that UPCAST, PIN, FORK, or MIGRATE handling influenced reconstruction |
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:adversarial-proofs -->
## Adversarial Property Proofs

| Property | Executed proof |
|----------|----------------|
| Reverse is real | Each of the seven registered modes executes `cutover_ready@7 -> new_authoritative_reversible@8 -> rollback_pending@9 -> legacy_authoritative@10` through a disk-backed CAS store |
| Restore is complete | Passing drills atomically replace cutover state after legacy authority returns, resume admissions, and derive resumed evidence only from the actual persisted reconstruction and raw bytes |
| State integrity | Control and persisted resumed reconstructions have equal canonical digests, applied-disposition rows/counts, state/fact/artifact counts, zero duplicate facts, raw bytes, and unchanged-reader results |
| Replay integrity | Both lanes verify through the post-divergence tail containing bounded spine work, effect events, forward cutover, rollback transitions, and restored-state reconstruction digests |
| Storage corruption sensitivity | A test rewrites the real persisted restoration record after the restore boundary; replay, projection, and state integrity all diverge and the signed certificate fails |
| Restore mutation sensitivity | A prototype-level mutation replaces the durable restore write with a no-op; a formerly passing drill fails reconstruction, projection, and replay closure |
| Dispositions are executed | Changing one census row from UPCAST to FORK changes the reconstructed-state digest and actual counts; `BLOCK` and undeclared values reject before sandbox mutation |
| Evidence retention | Cutover events remain in a copied verified ledger range; certificate counts require the preserved range to equal the complete cutover event count |
| Effect integrity | The phase-007 gateway records one durable intent and one confirmed or reconciled terminal result; missing-receipt, crash, and timeout cases recover exactly once |
| Ambiguity fails closed | Conflicting receipts and unresolved `in_doubt` intent produce signed failed certificates that the cutover verifier rejects |
| Detection is observed | Fingerprint, projection, epoch, receipt completeness, receipt conflict, effect uncertainty, crash, and timeout detectors derive evidence from runtime state; unknown caller success fields and wrong detector mappings fail preflight |
| Window is conjunctive | Synthetic clocks prove rollback remains open until both 14 calendar days and five successful runs complete; exact closure and stricter deadlines reject before mutation |
| Isolation | The runner accepts only non-symlink `deep-loop-rollback-drill-*` roots below the real system temporary directory, rejects overlap with protected paths, and verifies protected bytes before/after passing and failing drills |
| Cleanup | Capsule, control, cutover, authority, and effect state are removed; immutable transcript, certificate, and preserved ledger evidence remain |
| Certificate freshness | Every binding key is independently drifted; missing, failed, partial, wrong-mode, stale, tampered, wrong-provider, or incomplete closure evidence is refused |
| Pass cannot be asserted | Passing derives only from the allow-listed reason set; an injected manual-success field rejects before mutation |
<!-- /ANCHOR:adversarial-proofs -->

<!-- ANCHOR:input-bindings -->
## Bound Inputs and Operation

The manifest and certificate bind `adapterRegistry`, `base`, `candidate`, `classificationManifest`,
`contractDefectLedger`, `eventSchemaCensus`, `fingerprintContract`, `modeRegistry`, `parityCertificate`, `phaseTree`,
`policy`, `projectionContract`, `receiptContract`, and `rollbackAsset`. Runtime options must also supply the current mode
and current binding set; either mismatch fails before lane creation. The classification digest covers all 46 census
rows exactly once. Reconstruction executes the declared UPCAST, PIN, FORK, or MIGRATE action for each row and persists
the application evidence; any `BLOCK`, unknown disposition, live lease, pending effect, missing identity/order
coverage, nonterminal `PIN`, or nonquiescent `MIGRATE` vetoes execution.

The focused runner command is:

```bash
cd .opencode/skills/system-spec-kit/mcp-server
node_modules/.bin/vitest run --no-coverage ../../system-deep-loop/runtime/tests/unit/rollback-drills.vitest.ts
```

The later cutover preflight calls `verifyPhase014RollbackEvidence()` with the immutable certificate path, expected
mode, current binding set, and the registered durable certification provider. This verifier grants no authority; it
only returns verified evidence or a typed refusal.
<!-- /ANCHOR:input-bindings -->

<!-- ANCHOR:failure-guidance -->
## Failure Guidance

| Reason | Owning contract and safe response |
|--------|-----------------------------------|
| `input_invalid`, `binding_drift` | Manifest/current-input contract; regenerate the pinned manifest from current evidence and rerun the complete mode drill |
| `isolation_invalid`, `protected_state_changed`, `cleanup_failed` | Hermetic runner boundary; quarantine evidence and repair the sandbox/protected-path declaration before rerunning |
| `regression_not_detected`, `regression_class_mismatch` | Fault injector/detector mapping; repair the detector or fixture without manual success assertion or rebaseline |
| `authority_transition_failed` | Frozen authority state machine; repair CAS/fence/epoch handling and rerun from a new capsule |
| `reconciliation_blocked` | In-flight classification; resolve the veto in the owning classification contract rather than inventing a disposition |
| `effect_conflict`, `effect_in_doubt` | Receipt/effect recovery; obtain one unambiguous terminal outcome before any passing certificate can exist |
| `replay_integrity_failed` | Replay-fingerprint contract; repair and rerun the complete affected closure |
| `projection_integrity_failed` | Legacy-projection contract; repair serializer/reader compatibility and rerun |
| `state_integrity_failed` | Rollback state/accounting contract; repair loss, duplication, or evidence retention before rerunning |
| `window_closed` | Governing transition policy; the evidence is late and cannot be waived |
| `certificate_invalid` | Durable certification or closure evidence; replace only by a newly executed, current, passing drill |

No reason code authorizes manual replay, evidence suppression, detector weakening, or an authority transition.
<!-- /ANCHOR:failure-guidance -->

<!-- ANCHOR:verification -->
## Verification

| Gate | Result | Evidence |
|------|--------|----------|
| Focused Vitest | PASS | 1 file, 30 tests passed; all seven modes, all eight fault classes, durable corruption, no-op restore, disposition variation, `BLOCK`, and undeclared-disposition cases exercised |
| TypeScript | PASS | Required runtime `tsc --noEmit` exit 0 |
| Alignment drift | PASS | 7 files scanned, 0 findings |
| Comment hygiene | PASS | All new TypeScript and focused test files, 0 violations |
| Mutation check | PASS | Replacing `restoreLegacyState()` with a no-op made a formerly passing drill fail reconstruction, byte projection, and replay closure |
| Storage corruption check | PASS | Rewriting the actual durable restored record made replay, projection, and state integrity fail closed |
| Disposition sensitivity | PASS | UPCAST-to-FORK changed reconstruction; `BLOCK` and undeclared dispositions rejected before mutation |
| Strict packet validation | PASS | Exit 0 with 0 errors and 0 warnings after metadata refresh |

The repository-wide runtime suite was not used as this leaf's gate. Its documented baseline contains roughly 100
unrelated failures from unavailable `better-sqlite3` and legacy kebab-named fixtures; the focused leaf suite above is
the requested executable verification boundary.
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No live registration.** The runner is a dark programmatic API. A later phase must resolve current manifests and invoke it without weakening isolation.
2. **Certificates are freshness-bound.** The focused suite creates and verifies mode certificates in temporary roots; later cutover evaluation must execute fresh drills against its exact candidate and retained evidence destination.
3. **Full-suite baseline remains outside this leaf.** Only the requested focused suite gates this implementation; unrelated runtime surfaces were not modified or reclassified.
<!-- /ANCHOR:limitations -->

<!-- ANCHOR:additive-dark -->
## Additive-Dark Proof

The scoped implementation consists only of the new `runtime/lib/rollback-drills/` directory, the new focused test,
and this leaf's documentation. The consumed event-envelope, authorized-ledger, replay-fingerprint, receipt/effect,
legacy-projection, classification, shadow, and existing writer sources remain untouched by this leaf. Protected-path
digests and byte comparisons remained identical in passing and failing executions; live effect delta is certified as
zero. All authority transitions occurred in disposable temporary records and no real authority edge was introduced.

The worktree also contained unrelated sibling-leaf changes before and during this implementation. They were preserved
and excluded from this leaf's additive-dark claim.
<!-- /ANCHOR:additive-dark -->

<!-- ANCHOR:deviations -->
## Deviations from Plan

The control proof ledger now forks from the real verified cutover/recovery tail immediately before restoration facts,
rather than independently regenerating authorization records. This retains every real post-divergence event while
removing random decision identities from the variable under comparison. The runtime remains programmatic because this
phase must stay dark and cannot register a live authority entry point; the focused Vitest invocation is the executable
drill command for this leaf.
<!-- /ANCHOR:deviations -->
