# Iteration 016 — Exact Cross-Adapter Trace Schema and Adversarial Parity Matrix

## Focus

P3 only: make cross-adapter parity executable at the smallest authority-relevant boundary. This pass specifies the canonical inputs, authorization and refusal observations, accepted event ranges, projection checkpoints, digests, schedule equivalence, plausible-wrong controls, and allowable nondeterminism needed to prevent terminal-equal or self-derived traces from certifying unsafe behavior.

## Findings

1. **REFINE repo 1 — `CrossAdapterTraceV1` is a manifest-bound sequence of authorized operation prefixes, not a bag of terminal observations.** The trace header binds `schemaVersion`, `caseId`, `scenarioId`, `manifestDigest`, sealed-input/reference-set digest, BASE/build identities, replay/comparator/canonicalizer versions, adapter ID/version/contract digest, schedule ID, and normalization-contract digest. Each ordered prefix binds `operationIndex`, stable semantic step/role IDs, canonical request digest, semantic clock and policy inputs, actor/capability, claim/gate/fence identities when applicable, expected domain head, optional audit cut, authorization decision, outcome, accepted domain range, effect/budget observations, and an external projection checkpoint. This is stricter than the current harness's coarse observation classes and necessary because its path execution interface returns partial class-valued observations plus terminal projections. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/shadow-parity/shadow-parity-types.ts:20-56] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/shadow-parity/shadow-parity-types.ts:112-151] [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:69-75] [INFERENCE: the authorized operation prefix is the smallest comparison unit that exposes a denial or unsafe intermediate mutation hidden by terminal equality]

   **When not to use:** do not record token chunks, heartbeats, internal call frames, or arbitrary reducer steps unless a case declares them semantically observable; use boundary prefixes, not an indiscriminate debug trace.

2. **EXTEND P3 — Accepted and refused outcomes require different but joinable evidence shapes.** An accepted prefix records the allow decision reference, exact contiguous domain range, each effective event's type/version/canonical digest/correlation/causation/authorization reference, and before/after domain heads. A refused prefix records `TransitionRefusalV1` code/version/boundary/detail digest, the authoritative deny or commit-guard reference, `domainRange=[]`, identical before/after domain head and projection digest, zero budget/effect mutation, and—only for a gateway denial—one linked authorization-audit append and advanced explicit audit cut. The two ledgers retain separate IDs and sequence domains; the causal decision reference joins them without inventing a total order. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts:20-76] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts:118-195] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts:570-618] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts:720-745] [INFERENCE: unchanged domain state and one deny audit append are complementary assertions, not a contradiction]

   **When not to use:** do not append a synthetic domain refusal event, require the audit and domain sequence numbers to align, or treat an infrastructure failure with no durable decision as a normal policy refusal.

3. **REFINE P3 — Every checkpoint is an independent closed-prefix oracle with both a full digest and readable load-bearing selectors.** `ProjectionCheckpointV1` binds the closed domain range/head/hash, optional audit cut, replay-fingerprint evidence, reducer/projection/registry/canonicalizer identities, canonical projection digest, and scenario-declared selectors such as node status, active claim/fence, belief truth/staleness, gate version/state, skip set, budget balance, and effect state. Expected bytes or digests are committed outside the reducer under test. Graphene's `fold`, incremental `apply`, and `fold_up_to` comparisons are valuable determinism checks but share production transition semantics, while its coverage test checks required stems rather than event patterns. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/tests/golden.rs:49-100] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/tests/golden.rs:104-127] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/003-replay-fingerprints/spec.md:52-81] [INFERENCE: an independently authored prefix oracle is required to detect a defect shared by full and incremental folds]

   **When not to use:** do not snapshot every timestamp-only step or compare run-specific final fingerprint descriptors across isolated roots; verify each descriptor independently and compare its registered semantic components at declared boundaries.

4. **EXTEND P3 — Adapter equivalence is exact semantic equality modulo one closed, path-specific normalization allowlist.** Exact fields include canonical input and semantic-clock digests, actor/capability/role mappings, policy and authority epoch, claim/gate/fence identity, authorization verdict/reason/reference, refusal shape, accepted event semantics and causality, domain/audit cuts, projection selectors/digest, budget debit, effect intent/receipt, terminal outcome, and earliest mismatch. A manifest may normalize adapter-local transport IDs, sandbox roots, raw record time, provider request IDs, token chunking, or presentation prose only by naming the JSON path, reason, canonical replacement, and reversible local-to-role map. An absent required field is `missing-observation`; it cannot be normalized to null. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/003-shadow-parity-harness/spec.md:89-102] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/003-shadow-parity-harness/spec.md:123-140] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/shadow-parity/shadow-parity-types.ts:169-205] [INFERENCE: normalization is a versioned comparison contract, not cleanup performed after seeing a diff]

   **When not to use:** do not normalize semantic deadlines, observed-world time, authoritative sequence, causal order, refusal code, matched policy, claim/fence, budget, effect, or checkpoint identity merely because adapters encode them differently.

5. **EXTEND P3 — Allowable nondeterminism is a manifest-declared partial order with an externally checked equivalence class, not whole-trace sorting.** Independent operations may commute only when the case declares disjoint read/write/effect/budget/gate sets and no causal, head, lease, or policy dependency. The harness enumerates representative topological schedules, requires identical terminal semantic projection, and checks each schedule's own legal prefix outcomes; adapter-local order may differ only within the declared commuting set. Nondeterministic reruns outside that set remain blocking, consistent with the current certificate contract. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/003-shadow-parity-harness/spec.md:130-140] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/shadow-parity/shadow-parity-types.ts:169-205] [INFERENCE: final-state commutativity does not license an unsafe intermediate prefix or erase which request lost a head/fence race]

   **When not to use:** do not declare commutativity when operations share a head CAS, claim, resource fence, budget pool, human gate, effect target, idempotency key, or load-bearing belief premise.

6. **REFINE P3 — The minimum concurrency suite is a schedule family, not one happy-path rerun.** Each adapter must execute: `(S0)` canonical serial control; `(S1)` both legal orders of two declared-independent accepts; `(S2)` same-head conflicting accepts where exactly one commits and the loser receives a linked stale-head refusal; `(S3)` claim C1 expiry/revocation, C2 successor claim, then stale C1 completion before and after C2 completion; `(S4)` timeout/lease at boundary-1, boundary, boundary+1 plus repeated sweep; `(S5)` denial concurrent with an unrelated allow, proving zero denied domain mutation while audit ordering may commute; `(S6)` effect intent, ambiguous/crash boundary, receipt reconciliation, and idempotent retry; `(S7)` gate decision racing belief/topology invalidation or reopen. Every schedule asserts operation outcomes, authorized/refused events, prefix checkpoints, budget/effect deltas, and earliest mismatch—not merely a final projection. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/tests/golden/claim-lease.jsonl:1-10] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/tests/golden/human-timeout.jsonl:33-34] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/tests/golden/out-of-order.jsonl:2-4] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts:720-776] [INFERENCE: these schedules cover the authority, claim/fence, clock, audit, effect, and gate races most likely to remain terminal-equal]

   **When not to use:** do not run schedule explosion over read-only, single-operation, or genuinely sequential cases; select schedules from declared conflict and semantic-clock surfaces.

7. **EXTEND P3 — Every positive scenario needs a single-defect plausible-wrong mutant whose expected mismatch is pinned.** The required mutant set includes: remove a required event while retaining the filename; derive expected prefixes with the reducer under test; omit a denial audit row; append a refused domain event; collapse domain/audit cuts; ignore `authorization_ref`; accept both same-head writers; accept stale C1 under C2; normalize semantic deadline/observed time; globally sort transitions; drop budget debit; drop effect intent/receipt; replace the independent legacy oracle with the dark projection; and compare terminal state only. Each mutant binds `mutantId`, changed contract/path, expected divergence class, exact earliest prefix/stage, and expected selectors/digests; a harness that passes a mutant is invalid, not tolerant. This operationalizes 036's first-mismatch and zero-waiver rules and directly catches Graphene's nominal `claim-lease`, `out-of-order`, and filename-only coverage weaknesses. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/tests/golden.rs:104-127] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/003-shadow-parity-harness/spec.md:70-73] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/003-shadow-parity-harness/spec.md:130-140] [INFERENCE: a green positive case proves little unless a nearby plausible semantic defect makes the same comparator fail for the intended reason]

   **When not to use:** do not use malformed-input mutants that fail before the contract under test, multiple simultaneous defects that make the first mismatch ambiguous, or auto-blessed outputs generated by the mutated implementation.

## Exact `CrossAdapterTraceV1` Shape

```text
header:
  schemaVersion, caseId, scenarioId, mode, manifestDigest
  base/build/sealedInput/referenceSet digests
  adapter { id, version, contractDigest }
  replay/comparator/canonicalizer/normalization digests
  schedule { scheduleId, partialOrderDigest, semanticClockDigest }
prefixes[]:
  operationIndex, semanticStepId, scenarioRoleMap
  request { kind, canonicalInputDigest, actor, capability, claim/gate/fence,
            expectedDomainHead, auditCut?, policy, authorityEpoch,
            correlation, causation, idempotencyDigest, semanticClockInputs }
  authorization { disposition, decisionRef?, verdict?, reason?, matchedRulesDigest?,
                  commitGuardRef?, auditCutBefore, auditCutAfter }
  outcome { accepted|refused|errored, refusal?, domainRange,
            domainHeadBefore, domainHeadAfter }
  acceptedEvents[] { sequence, type, version, canonicalDigest,
                     authorizationRef, correlation, causation }
  checkpoint { closedDomainRange, auditCut?, replayEvidenceDigest,
               reducer/projection/registry digests, projectionDigest, selectors }
  budgetObservation { before, debit, after, policyDigest }
  effectObservation { intentDigest?, receiptDigest?, state, targetRole? }
normalizations[]:
  jsonPath, reasonCode, adapterLocalValueDigest, canonicalRoleValue
comparison:
  equivalent, earliestMismatch { class, operationIndex, stage, component },
  expectedDigest, actualDigest
```

The canonical comparison order is inputs → request → authorization/commit guard → outcome/refusal → accepted event range → projection checkpoint → budget/effect observation → terminal summary. The first determinable difference wins classification; later terminal equality never clears it. [INFERENCE: synthesis of findings 1-7]

## Adversarial Parity Matrix

| Family | Required schedules | Positive oracle | Plausible-wrong mutant | Expected first failure |
|---|---|---|---|---|
| Independent accepts | `A→B`, `B→A` | Per-prefix legal outcomes; terminal semantic digest equal | Global sort hides undeclared dependency | `harness-invalid` at schedule contract |
| Same-head conflict | `A∥B`, both winner orders | One append; loser stale-head denial; exact audit/domain cuts | Both accepted or loser silently dropped | `effective-event` or `missing-observation` at losing operation |
| Claim successor | C1 expires, C2 claims, stale C1 completes at two cut points | C1 refusal, C2-only mutation, fence selectors | Node-only active-claim check accepts C1 | `execution-outcome` at stale completion |
| Deadline/lease | `d-1`, `d`, `d+1`, repeated sweep | Boundary-specific outcome; one timeout/expiry | Normalize semantic time or double-fire | `execution-outcome` at boundary operation |
| Denial + unrelated allow | Both legal interleavings | Denied domain no-op; one deny audit; unrelated append | Require no append anywhere or erase audit cut | `projection-semantic`/`missing-observation` at denial |
| Gate invalidation race | decide-before-change; change-before-decide; reopen | Only current context/version/fence selects edge | Old click accepted after invalidation | `execution-outcome` at gate decision |
| Effect ambiguity | intent, crash/unknown, reconcile, retry | One durable intent and terminal receipt/recovery state | Re-execute without reconciliation or drop receipt | `effective-event` at effect boundary |
| External prefix oracle | every declared semantic boundary | Committed independent digest + selectors | Bless from reducer under test | `harness-invalid` before comparison |

## Ruled-Out Directions

- **Terminal-state-only parity:** cannot expose denial, authorization, budget, effect, or unsafe-prefix differences. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/003-shadow-parity-harness/spec.md:70-73]
- **Whole-trace sorting:** erases causal and race outcomes rather than modeling declared commutativity. [INFERENCE: finding 5]
- **Generic field scrubbers or tolerance bands:** turn missing semantic observations into false equivalence. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/003-shadow-parity-harness/spec.md:107-115]
- **Self-derived expected checkpoints:** reproduce shared reducer defects. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/tests/golden.rs:75-100]
- **One synthetic domain/audit order:** conflicts with independent ledger identities and explicit authorization joins. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts:20-76]
- **Filename coverage and repeat-green as mechanism proof:** neither checks required semantic patterns or mutant sensitivity. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/tests/golden.rs:104-127]

## Sources Consulted

- `specs/system-deep-loop/037-graph-engineering/002-graphene-main/orientation.md`
- `specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md`
- `specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-004.md`
- `specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-005.md`
- `specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-014.md`
- `specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-015.md`
- `specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/tests/golden.rs` and targeted golden JSONL fixtures cited above
- `.opencode/skills/system-deep-loop/runtime/lib/shadow-parity/{shadow-parity-types.ts,parity-case-manifest.ts,shadow-parity-harness.ts}`
- `.opencode/skills/system-deep-loop/runtime/lib/{deep-research-shadow-parity,deep-alignment-shadow-parity}/harness-adapter.ts`
- `.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/{authorized-ledger-types.ts,transition-authorization-gateway.ts}`
- `specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/003-replay-fingerprints/spec.md`
- `specs/system-deep-loop/036-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/003-shadow-parity-harness/spec.md`

## Assessment

- New information ratio: 0.54
- Novelty justification: iterations 004-005 established prefix oracles, timing distinctions, and normalization boundaries; this pass resolves the remaining P3 ambiguity with an exact trace field schema, accepted-versus-refused dual-ledger rules, a schedule-equivalence contract, eight concrete concurrency families, and pinned single-defect mutant expectations.
- Question addressed: P3
- Question answered: P3 at research/design-contract level
- Confidence: high for the schema, authority/refusal boundary, comparator ordering, and negative controls; medium for the minimal schedule corpus until implementation measures mode-specific conflict surfaces.

## Reflection

- What worked: tracing the current coarse observation API through 036 authorization records and Graphene's golden oracle exposed exactly where terminal equality and shared fold logic can hide unsafe behavior.
- What failed: whole-descriptor equality, filename coverage, generic normalization, and deterministic reruns without defect injection do not prove semantic sensitivity.
- Ruled out: terminal-only comparison; whole-trace sorting; synthetic cross-ledger ordering; reducer-authored expected prefixes; generic trace scrubbing; mutant-free certification.

## Recommended Next Focus

Adversarial safety audit of all P1-P7 contracts and negative controls
