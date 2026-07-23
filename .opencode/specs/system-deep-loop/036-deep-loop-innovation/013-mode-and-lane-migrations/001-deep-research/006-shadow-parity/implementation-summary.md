---
title: "Implementation Summary: Deep Research shadow parity"
description: "Implemented and verified additive-dark Deep Research parity with independent oracles, receipt-bound verified certificates, and a fail-closed successor gate input."
trigger_phrases:
  - "Deep Research shadow parity implementation"
  - "DeepResearchParityReceipt"
  - "DeepResearchModeGateInput"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/006-shadow-parity"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/006-shadow-parity"
    last_updated_at: "2026-07-22T15:57:14Z"
    last_updated_by: "codex"
    recent_action: "Added adversarial quarantine-priority coverage and closed fixture/resume-evidence shapes"
    next_safe_action: "Have 007 re-evaluate the enriched evidence through the authenticated gateway"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-research-shadow-parity/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-research-shadow-parity.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The parity receipt and successor gate input are closed, versioned, BASE-bound records."
      - "The legacy path remains authoritative and neither handoff type can authorize cutover."
      - "Resume parity compares a modeled legacy oracle with the real ledger adapter."
      - "Observed event and resume golden fixtures remain a phase-014 obligation."
      - "Independent event IDs are excluded from pairing; corresponding transitions pair by event type, logical run, logical branch, step, and producer sequence."
      - "Issued receipts embed a manifest-fresh certificate cross-bound to the full receipt evidence closure."
      - "The certificate is not signed; 007 must re-evaluate evidence through TransitionAuthorizationGateway."
      - "The exported diff-disposition union is narrowed to the only produced value: unexplained."
      - "Resume evidence must match the frozen budget lease on leaseId, runId, lineageId, generation, and deadlineAt."
      - "Quarantine wins over an explicit converged event on both modeled-legacy and real-ledger paths."
      - "Fixture and resume-evidence objects reject undeclared top-level keys before case execution."
---

# Implementation Summary: Deep Research Shadow Parity

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|---|---|
| **Spec Folder** | 006-shadow-parity |
| **Completed** | 2026-07-22 |
| **Level** | 2 |
| **Status** | Complete |

Implemented `runtime/lib/deep-research-shadow-parity/` as an additive-dark adapter over the landed substrate. The module exposes independent legacy and ledger `ParityPathExecutor` implementations, a complete typed lifecycle map, strict event and projection comparison, the required ten-scenario manifest, a real resume-parity driver, reproducible parity receipts, and the fail-closed input consumed by sibling `007-rollback-and-mode-gate`.

Authority remains `legacy-authoritative`. Both executors write only to harness-owned isolated roots, effects are recorded through `ShadowEffectSink`, and every receipt and gate input carries `authorityMutation: false` and `cutoverAuthorized: false`.
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

- Module: `.opencode/skills/system-deep-loop/runtime/lib/deep-research-shadow-parity/`
- Receipt: `DeepResearchParityReceipt`
- Gate handoff: `DeepResearchModeGateInput`
- Resume evidence: `DeepResearchResumeParityEvidence`
- Suite result: `DeepResearchParitySuiteResult`

Sibling 007 may evaluate rollback readiness only when `DeepResearchModeGateInput.exitStatus` is `pass`, all expected receipt digests are present, deterministic replay is true, and there are zero differences. The handoff never authorizes rollback readiness or cutover itself. These records use closed allowed-key sets, bounded tokens and reasons, closed enums, ranged counts, and hexadecimal digests; consumers must not widen them to open objects.

The case-execution boundary applies that same discipline to the six-field `DeepResearchParityFixture` and six-field
`DeepResearchResumeParityEvidence` records. Unknown fixture or resume-evidence keys are rejected before either parity
path runs; the exported type names and shapes remain unchanged for sibling 007.

`DeepResearchParityReceipt` is additively enriched with `parityCertificate` and
`certificateEvidenceBindings`. Issued receipts carry the real certificate plus the complete sorted fixture-evidence
closure; refused receipts carry neither. Existing exported fields and type names remain unchanged. Sibling 007 must
consume this enriched closed shape rather than the earlier bare-digest shape.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

- `runtime/lib/shadow-parity/`: `compileParityCaseManifest`, both `ParityPathExecutor` paths, sealed input verification, `createShadowEffectSink`, `runShadowParityCase`, `issueParityCertificate`, and `verifyParityCertificate`.
- `runtime/lib/legacy-projections/`: `LegacyProjectionEngine`, `foldLegacyProjection`, and the byte-faithful legacy serializer under isolated output.
- `runtime/lib/deep-research-reducers/`: `foldDeepResearchEvents`, projection schema/version bindings, and projection integrity fingerprints.
- `runtime/lib/deep-research-resume-adapter/`: the real ledger-side `DeepResearchResumeAdapter`, closed resume requests and decisions, authenticated tails, fresh projection state, and persisted lease continuity.
- `runtime/lib/deep-research-shadow-parity/`: a distinct legacy resume oracle derived from the modeled full-state event view, legacy projection/convergence semantics, and effect-journal states; it does not delegate branch or effect decisions to the ledger adapter.
- `runtime/lib/deep-research-ledger-schema/`: the complete typed event namespace and schema registry.

The legacy projection is a direct independent fold and legacy-engine oracle. The ledger projection independently calls `foldDeepResearchEvents`; neither stream is derived from the other.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

The clean fixture issues a verified parity certificate and green receipt. Every injected fault now reaches the event comparator through ledger append, replay-fingerprint derivation and attestation, generic parity comparison, receipt issuance, and rejection. Projection injection waits until its target observation exists instead of failing an intermediate reducer fold. Extra-event injection appends a distinct source version that the real reducer accepts, while duplicate-event injection repeats a convergence observation that also folds cleanly. Both parameterized fault blocks assert the exact path-correct typed disposition for all ten kinds, so a generic execution failure cannot satisfy the test.

Event pairing now uses the stable logical position `{eventType, logicalRunId, logicalBranchId, stepKey, producerSequence}`. Raw `eventId` is path-local and is not part of pairing; payload, causal links, receipts, artifacts, projection fingerprints, and terminal decisions are comparison fields and are also excluded from the key. Independent legacy and ledger event IDs therefore produce zero differences when those fields match, while any changed field emits its exact typed difference. Logical positions found only on the legacy side are `missing`, positions found only on the ledger side are `extra`, excess repetitions are `duplicated`, and equal logical-key multisets in a different order are `reordered`.

Receipt parsing now applies an internal semantic guard after the outer receipt-digest check. The guard recomputes the reproducibility binding and diff proof identities, checks certificate/refusal and generic-divergence pairs, and requires declared status to agree with its evidence. Projection fingerprints are digests of the normalized `DeepResearchParityProjection` and are the semantic equality basis. Stream digests cover canonical per-event observations, including prefix projection fingerprints, rather than raw transport bytes. A green receipt requires equal stream and projection fingerprints plus zero diff records. A digest-recomputed forged receipt with unequal stream and projection evidence, no dispositions, and `exitStatus: green` throws at parse and becomes `CERTIFICATE_UNVERIFIABLE` at the gate, while the valid clean control still parses and passes. The symmetric clean-evidence-plus-`blocked` lie is also rejected.

The diff schema now represents only comparable-class differences, and every such record is blocking. The exported
`DeepResearchParityDiffDisposition` union is narrowed to its only legitimate producer value, `unexplained`; the parser
rejects `tolerated-non-semantic` and every other value. Volatile transport fields are removed during canonicalization and
do not map to a diff class. Receipt production and parse-time evidence consistency both require zero diff records for a
green result, while a green serialized receipt carrying any comparable diff is rejected. No exported type name or record
shape consumed by sibling 007 changed; only the never-produced disposition union member was removed.

Issued receipts now pass the trusted manifest into `verifyParityCertificate` during both direct receipt parsing and
mode-gate creation. Binding record `i` aligns its fixture ID and case-evidence digest with certificate index `i`; sorted
reference-set and attestation-final digests reconstruct the certificate arrays. Each record also carries that fixture's
legacy and ledger stream digests plus both projection fingerprints, and the certificate's `adapter_digest` commits the
full sorted binding closure. A receipt must exactly match its own record. The fabricated bare-digest reproduction is
rejected and blocked, a genuine certificate under a different trusted manifest or BASE becomes `RECEIPT_STALE`, and a
real-run positive control parses green and produces a passing gate input.

`DeepResearchFrozenParityInput` and its budget lease now use closed allowed-key sets. An undeclared field reaches the real
executor boundary and produces a typed blocked execution outcome rather than being silently accepted.

The adversarial quarantine fixture contains run initialization, iteration start, a flagged source, quarantined
contaminated evidence, and an explicit converged evaluation whose three quality gates pass. Both the modeled legacy fold
and real ledger reducer accept it only when the expected terminal decision is `quarantined`; expectations of `converged`
or `incomplete` are blocked. The assertions read `outcome.result` and `outcome.receipt`, not the scenario-table constant.
Temporarily moving the converged branch ahead of quarantine made the `quarantined` variant fail, proving the test reaches
the production priority decision.

The case runner also validates the top-level fixture and resume-evidence key sets before execution. Temporarily removing
that validation made both unknown-key tests resolve green instead of rejecting, proving each negative depends on its new
guard rather than an unrelated downstream parser.

The main case executor now validates both `resumeEvidence.legacyDecision.lease` and
`resumeEvidence.ledgerDecision.lease` against `frozenInput.budgetLease` before either path runs. Continuity covers every
overlapping identity field: `leaseId`, `runId`, `lineageId`, `generation`, and `deadlineAt`. Any mismatch raises the typed
`DEEP_RESEARCH_RESUME_LEASE_CONTINUITY` execution failure, so symmetric agreement on an untracked lease cannot produce a
green receipt. The standalone resume driver retains its stricter full-lease comparison against the persisted resume
request. The required crash-resume fixture derives both evidence leases from its frozen budget lease; negative controls
cover symmetric and per-decision drift, while the matching control remains green and gate-passing.

The `substrateImportsReal` test no longer trusts the literal alone. It requires the true flag together with observed `AppendOnlyLedger.appendAuthorized` calls for the typed fixture events, an appended replay-fingerprint attestation event, and four deterministic evidence records from the two real paths across two runs. Missing or malformed receipts, unknown receipt/gate keys, semantic data in the transport-only correlation field, malformed timestamps, nondeterministic replay, fixture failures, and stale evidence all fail closed.

Resume parity now compares `DeepResearchLegacyResumeOracle` with one real ledger adapter. The oracle folds the modeled legacy
event view through `legacyProjection` and `directConvergence`, then independently derives compatibility, branch and effect
dispositions, invalidation, a semantic event tail, a fresh continuation projection, and complete lease continuity. The
ledger harness is independently seeded; no legacy ledger directory is copied. A matching control passes even though the
two decisions have distinct model-specific identities. A planned-versus-selected legacy-model mismatch raises the typed
resume-parity divergence across decision, tail, and projection dimensions. Temporarily disabling that comparison makes the
negative test fail at its expected typed-error assertion. Decision comparison now includes canonically sorted branch
`evidenceEventIds`, effect `attemptRefs`, and each effect's `nextAttemptId`. A wrong branch-evidence attribution with otherwise
identical dispositions raises a decision-only resume-parity divergence.

The real-pipeline fault matrix now covers all ten fault kinds on both paths. Drop, reorder, extra, duplicate, causal-link,
payload, receipt, artifact, terminal-decision, and projection faults are rejected whether the legacy or ledger side is the
one that diverges.

### Fixture closure

The manifest contains exactly one fixture for each required scenario: fresh run, multi-branch, quarantined evidence, contradiction and supersession, max-iteration incomplete, converged, crash and resume, source-mutation refresh, synthesis, and memory-save handoff. The max-iteration fixture remains incomplete and poisoned evidence remains quarantined; neither is upgraded to converged.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

| Gate | Result |
|---|---|
| Focused Vitest | PASS — 1 file, 49 tests (baseline 44; delta +5) |
| Pinned TypeScript compiler | PASS — exit 0, zero diagnostics |
| Strict packet validator | PASS — exit 0, Errors 0, Warnings 0 |
| Quarantine-priority output | PASS — `quarantined` is green; `converged` and `incomplete` are blocked for the same adversarial event stream |
| Closed fixture/resume shapes | PASS — undeclared `stopPolicy` and `cutoverAuthorized` keys reject before case execution |
| Regression falsifiers | PASS — inverted quarantine priority failed 1/3 variants; removed shape validation failed both unknown-key tests; restored tests pass 5/5 |
| Certificate trust boundary | PASS — fabricated bare-digest receipt rejected and blocked; real-run receipt parses green and passes; wrong trusted manifest/BASE becomes `RECEIPT_STALE` |
| Frozen-input closed shape | PASS — an undeclared top-level key produces a typed blocked execution outcome at the real executor boundary |
| Resume-evidence lease continuity | PASS — symmetric and per-decision identity drift fail with `DEEP_RESEARCH_RESUME_LEASE_CONTINUITY`; the budget-matched crash-resume control is green and gate-passing |
| Independent-ID pairing | PASS — different event IDs at every corresponding logical position produce zero diffs when fields match; changing payload, causal, receipt, artifact, projection, and terminal fields emits all six typed diffs |
| Fault non-vacuity | PASS — both real-path fault matrices assert the exact typed comparator class; projection, extra, and duplicate injections fold cleanly and produce typed receipt differences instead of upstream execution failures |
| Real substrate | PASS — `substrateImportsReal` remains true and the real-ledger evidence assertions remain green |
| Export compatibility | PASS — no exported type name or shape consumed by sibling 007 changed |
| Scoped git audit | PASS — this pass touches only the adapter, focused test, and this leaf's documents; unrelated pre-existing worktree changes remain outside the locked paths |

Focused command:

`node_modules/.bin/vitest run --no-coverage ../../system-deep-loop/runtime/tests/unit/deep-research-shadow-parity.vitest.ts`

TypeScript command:

`.opencode/skills/system-spec-kit/node_modules/.bin/tsc --noEmit -p .opencode/skills/system-deep-loop/runtime/tsconfig.json`
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

Runtime changes are confined to `runtime/lib/deep-research-shadow-parity/` and its focused unit test. Documentation changes are confined to this leaf. The generic shadow-parity substrate, legacy projection implementation, typed reducer, resume adapter, and all authoritative paths remain unchanged. Rollback is removal of this additive module, focused test, and leaf evidence; no data migration or authority repair is required.

Both legacy dimensions remain modeled behavior for this planning harness: event parity uses `legacyProjection` and
`directConvergence`, while resume parity uses the new legacy snapshot oracle over those projection semantics and the
modeled effect journal. A shared fidelity mistake between either oracle and the real legacy Deep Research system is still
possible. Capturing genuine observed golden fixtures for both event and resume behavior is an explicit implementation and
phase-014 obligation before any authority decision. Those fixtures must cover branch/effect dispositions, invalidation,
tails, continuation projections, and lease continuity.

`verifyParityCertificate` is a self-consistency, manifest-freshness, case-closure, and shadow-only-completeness check. It
has no signing authority: the certificate is not HMAC-signed, so a fully self-consistent forgery matching the real
manifest, BASE, complete case closure, receipt streams, projections, and substrate evidence remains possible in principle.
A serialized receipt is therefore internally consistent and manifest-bound evidence, not a standalone authenticated
authority record or proof that a real run occurred. Optional pre-cutover hardening for the shared substrate owner is to
add issuer signing to `issueParityCertificate`/`verifyParityCertificate` and bind issuance to real executor and ledger
attestation, making standalone receipt authentication available to every mode at once.

Sibling 007 consumes the enriched receipt and mode-gate evidence contract but must not trust this leaf's verdict blindly.
At the phase-014-bound mode gate it MUST re-derive the verdict from immutable authorized evidence through the real
`TransitionAuthorizationGateway` plus deterministic replay against the authorized ledger; 006's computed `exitStatus`
is evidence, not authority. This is the operator-confirmed trust model as of 2026-07-22. No runtime consumer imports the
internal `driveDeepResearchResumeParity` function today.
<!-- /ANCHOR:limitations -->
