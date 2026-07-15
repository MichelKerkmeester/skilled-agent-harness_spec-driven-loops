---
title: "Feature Specification: Deep Research - Certificates & Receipts (010 phase 001 child 004)"
description: "Plan the Deep Research mode certificate and receipt binding over the typed event-ledger substrate: one per-run certificate, per-transition receipts across init, gather, analyze, convergence, synthesis, resume, and memory-save handoff, versioned replay-fingerprint inputs, and an independent offline verifier."
trigger_phrases:
  - "deep research certificates and receipts"
  - "deep-research run certificate"
  - "deep-research transition receipts"
  - "offline replay certificate verifier"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/010-mode-and-lane-migrations/001-deep-research"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/010-mode-and-lane-migrations/001-deep-research/004-certificates-and-receipts"
    last_updated_at: "2026-07-15T20:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined Deep Research run certificates and transition receipt attestations"
    next_safe_action: "Freeze replay inputs and offline verifier rules against shared contracts"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Deep Research - Certificates & Receipts

> Phase adjacency under the Deep Research parent (navigation order, not a hard runtime dependency): predecessor `003-sealed-artifacts`; successor `005-resume-adapter`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/010-mode-and-lane-migrations/001-deep-research/004-certificates-and-receipts |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop / deep-research |
| **Origin** | Fourth child of the phase-010 Deep Research mode migration fan-out |
| **Depends on** | `[]`; sibling planning contracts are independent and compose at the Deep Research mode gate |
| **Consumes** | Shared phase-003 receipt and certificate primitives, typed ledger/replay contracts, and predecessor `003-sealed-artifacts` references |
| **Inputs** | Parent program spec, phase tree, `findings-registry.json`, and `findings-registry-modes.json` |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Deep Research is a long-lived autonomous loop: it initializes a research objective and frontier, gathers and analyzes
evidence across iterations, evaluates convergence, synthesizes a report, and hands the result to memory save. The
existing externalized state can describe control flow without proving what a transition consumed, what it produced, or
whether a later resume is using the same evidence. A terminal report or a successful process exit is not proof that the
source captures, claim decisions, convergence inputs, synthesis view, and memory handoff were the exact objects used by
the run.

The mode findings require a versioned executable research plan, typed gap-to-query continuation, claim-level
cross-validation, explicit unresolved and abstention states, source-refresh watermarks, and a portable research object.
They also require digest-bound statements for captures and synthesis checkpoints, claim/evidence lineage, replay
equivalence, and change propagation through affected claims. These findings make certificates and receipts a proof
surface over the sealed references and typed ledger, not a replacement for either one. A receipt must distinguish a
logical transition from its attempts and must preserve `in_doubt`, `blocked`, `quarantined`, and `incomplete` outcomes;
otherwise retry or resume can turn missing evidence into an apparent success.

This phase plans one per-run Deep Research certificate and the per-transition receipts that support it. The run
certificate attests to the verified, replay-addressable run record and its declared result. Each receipt attests to one
authorized transition, its exact input and output reference set, its resulting ledger head, and its recovery status. The
plan consumes the shared phase-003 receipt and certificate primitives and the sealed artifact references from
`003-sealed-artifacts`; it does not create a mode-local digest, signing scheme, artifact store, reducer, or authority
decision. An independent verifier must be able to validate the bundle offline without rerunning search, models, or the
memory service.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A Deep Research run-certificate profile that binds run identity, lineage, lifecycle coverage, final ledger heads, the ordered sealed reference set, receipt-chain digest, replay fingerprint, projection and synthesis outputs, memory-save handoff result, and unresolved obligations.
- A mode transition-receipt profile for `init`, logical branch `gather`, logical branch `analyze`, convergence evaluation, synthesis commit, memory-save handoff, and resume or recovery reconciliation; attempt identity remains distinct from logical transition identity.
- Attestation rules for what a receipt and certificate prove, including authorized transition, canonical input/output digests, sealed-reference validity, result disposition, prior and resulting ledger heads, and shared certification metadata.
- A replay-fingerprint input contract covering shared envelope and payload versions, canonical codec, event chain, run lineage, ordered artifact references, source/result digests, executor and capability commitments, reducer/projection versions, policy fingerprints, and effect outcomes.
- Fingerprint exclusions and normalization rules for wall-clock values, process IDs, arrival order, random request identifiers, mutable paths, cache aliases, and attempt-only data that cannot change replay semantics.
- An offline verifier that validates the certificate and receipt bundle, resolves local sealed references, recomputes canonical digests and replay fingerprints, checks event authorization and chain continuity, and returns typed `valid`, `invalid`, `incomplete`, or `unverifiable` results.
- Idempotent retry, duplicate detection, stale-head detection, source-refresh drift, unknown external outcomes, and append-only supersession behavior while the new mode path remains additive-dark and non-authoritative.

### Out of Scope
- Defining or replacing the shared phase-003 receipt, certificate, ledger, transition-authorization, certification-provider, or generic replay-fingerprint primitives.
- Creating or sealing Deep Research artifacts, changing canonicalization, or defining verified-read behavior; predecessor `003-sealed-artifacts` owns those mode bindings.
- Defining event names, reducers, projections, convergence policy, budgets, fan-out/fan-in scheduling, or the memory database persistence service owned by sibling or shared phases.
- Implementing the resume adapter owned by successor `005-resume-adapter`; this phase only defines the receipt and certificate inputs that resume consumes and the recovery evidence it must emit.
- Moving authority, rewriting legacy JSONL, deleting old evidence, declaring exactly-once external effects where the shared adapter cannot reconcile them, or changing the phase-011 cutover contract.
- Treating a valid signature or certificate as proof that the research claims are true, that omitted evidence does not exist, or that an unverified source should enter trusted state.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The mode consumes one shared receipt and certificate contract | A contract matrix maps every mode receipt and the run certificate to phase-003 primitives, with no mode-local digest, signature, key, verifier, or trust root |
| REQ-002 | One run certificate attests the complete Deep Research run | The certificate binds run/lineage/generation identity, lifecycle result, start and final ledger heads, ordered reference-set digest, receipt-chain digest, replay fingerprint, output references, open obligations, and shared certification metadata |
| REQ-003 | Each logical transition emits a complete receipt | `init`, `gather`, `analyze`, convergence, synthesis, handoff, and resume/recovery rows identify the authorized transition, logical operation, attempt history, input references, output references, result disposition, and resulting head |
| REQ-004 | Replay inputs are explicit and versioned | Recomputing the fingerprint uses only registered replay-affecting fields and produces the same value for identical canonical inputs; contract, event, artifact, executor, policy, reducer, projection, and effect versions are included |
| REQ-005 | Replay exclusions cannot alter semantics | Process IDs, wall-clock timestamps, completion order, random request IDs, filesystem paths, cache aliases, and attempt-only identifiers are excluded or normalized; any field that changes a decision is not excluded |
| REQ-006 | Receipt and certificate chains are append-only and conflict detecting | Duplicate logical transitions with identical canonical facts are idempotent; reused identity with different facts, prior head, result, digest, or authority epoch returns a typed conflict and appends no false success |
| REQ-007 | Failure and uncertainty remain attestable without becoming success | `blocked`, `invalid`, `quarantined`, `incomplete`, `failed`, and `in_doubt` are explicit dispositions; the run certificate cannot report trusted completion when a required receipt or reference is unresolved |
| REQ-008 | Source and claim drift is visible across resume | Changed result IDs, source content digests, retraction/update signals, claim dependencies, and superseding evidence produce new receipts and references while preserving the prior certificate inputs and historical artifacts |
| REQ-009 | The offline verifier is independent of live execution | A verifier with the contract registry, certificate/receipt bundle, and sealed artifact bundle can validate canonical bytes, shared certification, chain continuity, authorization, replay fingerprint, and outputs without network, model, search, or memory-service calls |
| REQ-010 | Memory-save handoff is receipt-bound | The handoff receipt binds target packet, continuity payload digest, final reference set, offered content digest, persistence result, and retry/recovery disposition; a failed or unverifiable handoff cannot be presented as trusted completion |
| REQ-011 | The migration remains additive-dark | Certificate or receipt failure blocks dark evidence, parity, and trusted handoff promotion but leaves legacy state, output, writer behavior, and authority unchanged until staged cutover |

### Deep Research receipt and certificate boundary matrix

| Lifecycle boundary | Receipt attests | Replay-bound inputs | Required result handling |
|--------------------|------------------|----------------------|--------------------------|
| `init` | Authorized run creation, frozen charter/frontier, initial configuration, executor/tool commitments, and initial ledger head | Run/lineage/generation, objective/plan/recipe/capability/config digests, shared contract versions, initial reference-set digest | Missing or mutable-only inputs block branch dispatch and do not create a trusted run certificate |
| `gather` | One logical branch's admitted source-capture transition, retrieval outcome, source identity, and normalized evidence references | Logical branch ID, question/gap ID, frozen query recipe, executor/capability fingerprint, source result IDs/content digests, admission policy | Source mutation, poisoning, absent capture, or unknown effect is `quarantined`, `blocked`, or `in_doubt`, never successful evidence |
| `analyze` | Claim/evidence observation and validation transition, including contradiction, abstention, and unresolved obligations | Source/evidence digest set, extraction and claim schema versions, claim dependencies, cross-validation policy, raw observation digests | Unresolved or abstained claims remain explicit and cannot be counted as trusted support |
| `convergence` | One verified frontier snapshot and the decision produced by the shared convergence policy | Finalized frontier, trusted evidence yield, coverage, divergence pressure, contradiction/falsification obligations, budget/lease state, policy/evaluator fingerprints | `CONTINUE`, `STOP_ELIGIBLE`, `INDETERMINATE`, `BLOCKED`, and terminal incomplete outcomes remain distinct |
| `synthesize` | Materialized report and claim/evidence view over a declared ledger revision | Ordered selected claim versions, evidence spans, unresolved claims, reducer/projection/synthesis versions, input reference-set digest | Changed or incomplete inputs produce mismatch or incomplete output; synthesis never silently rebaselines |
| `memory-save` | Handoff package offered to memory persistence and its observed persistence outcome | Target packet, route/merge mode, continuity payload, final source/output digests, content digest, memory contract version | Persistence failure, unknown outcome, or invalid input yields failed or `in_doubt` handoff evidence |
| `resume/recovery` | Reconciliation of prior transition attempts and the decision to reuse, re-execute, compensate, or block | Prior receipt ID, logical operation ID, idempotency key, prior head, target evidence, compatibility decision, current contract fingerprint | Only conclusive `not_applied` may retry; `applied` synthesizes confirmation; `in_doubt` stops automatic replay |

### Run certificate attestation

The run certificate is a signed or otherwise shared-certified statement over a canonical certificate body. It attests that
the verifier found a coherent run bundle with the declared identity, authorized receipt chain, verified reference set,
recomputed replay fingerprint, declared reducer/projection and synthesis outputs, and explicit terminal disposition. It
does not attest to external truth, source quality beyond the recorded admission verdicts, completeness beyond the declared
coverage inputs, or authority to replace the legacy path. A certificate with an unresolved required receipt, unverifiable
artifact, unknown effect, mixed ledger head, or missing memory handoff is `incomplete` or `unverifiable`, never `valid`
completion.

### Replay-fingerprint input contract

The canonical fingerprint input is an ordered object containing: shared envelope and payload schema versions; canonical
codec and ordering policy; run, lineage, and generation identity; authorized event IDs, payload digests, predecessor
tail hashes, and selected event range; the ordered `003-sealed-artifacts` references and descriptor versions; source
result IDs, content digests, extraction and claim representations; executor, model, prompt, tool, permission, and
capability commitments; reducer, projection, convergence, admission, synthesis, and memory-route policy fingerprints;
logical branch and transition IDs; and verified effect outcome digests or explicit recovery dispositions. Certificate
signatures, issuance timestamps, process IDs, arrival order, random request IDs, local paths, mutable URLs, cache aliases,
and attempt IDs are not fingerprint inputs unless a registered contract proves that the value changes a replay decision.
The verifier rejects an unregistered field rather than silently folding it into or omitting it from the fingerprint.

### Independent offline verification

The verifier parses strict schemas, validates the shared certification provider and trust policy, recomputes canonical body
digests, checks run scope and unique logical transition identities, walks prior-head and receipt links, validates each
authorization reference, resolves every sealed reference from the supplied local bundle, and recomputes the replay
fingerprint from the registered input projection. It then folds the declared event range with the registered reducer and
projection versions, checks synthesis and handoff output digests, and confirms that every required result disposition is
compatible with the run certificate. It never fetches a URL, reruns a model, calls a search provider, repairs a missing
receipt, or treats a process exit as an observed external outcome. The output is a typed verdict with failure location and
evidence digest; it does not mutate history or create a new baseline.
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every Deep Research logical lifecycle transition has a reviewed receipt profile, and one run certificate binds the complete verified receipt chain without a mode-local trust scheme.
- **SC-002**: Identical run identity, event chain, sealed references, executor commitments, policies, reducers, projections, and effect outcomes produce an identical replay fingerprint and certificate body.
- **SC-003**: A certificate or receipt verifier detects mutation, missing links, stale heads, wrong artifact kinds, unsupported versions, mixed watermarks, duplicate identities, and same-key/different-facts reuse without repairing or rebaselining.
- **SC-004**: Independent offline verification reproduces the declared Deep Research projections, synthesis view, and memory-save handoff result from local sealed inputs without network or live execution.
- **SC-005**: Resume and source refresh preserve prior receipts and certificates, append affected revisions, distinguish `not_applied`, `applied`, `in_doubt`, and `conflict`, and never double-apply an uncertain transition.
- **SC-006**: The mode gate proves certificate and receipt parity over the same verified reference set while legacy authority remains unchanged and successor `005-resume-adapter` can consume the frozen contract.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The largest risk is a certificate that proves only that a process wrote JSONL. The verifier must bind the authorized event
chain, sealed evidence, result heads, policy versions, and output digests, while retaining explicit unknown and incomplete
states. A valid certification envelope cannot repair an absent source capture, make a mutable URL replayable, or elevate a
claim that the admission and cross-validation receipts marked untrusted.

Fingerprint drift is another risk: including timestamps, process IDs, completion order, or random request IDs makes
equivalent runs look different, while excluding executor, tool, policy, reducer, or source versions permits unsafe reuse.
The input projection and exclusion list therefore belong to the shared versioned contract, and unknown fields fail closed.
Logical transition identity must remain separate from attempt identity so retries and resume preserve forensic history
without changing the replay meaning of the transition.

Offline verification can also be overstated. It is possible only when the supplied bundle contains the sealed bytes,
descriptor and contract registries, receipt/certificate material, and any provider evidence required by the declared
verification profile. A missing or unavailable external proof is `unverifiable`, not an implicit pass. Source refreshes,
retractions, poisoned content, and claim supersession must append new evidence and invalidate only affected downstream
conclusions rather than rewriting the prior run.

Dependencies are the phase-003 receipt/certificate, event, ledger, authorization, and replay contracts; predecessor
`003-sealed-artifacts`; the Deep Research `001-typed-ledger-schema` and `002-reducers-and-projections` contracts; the
phase-009 shared mode interfaces and write-set conflict graph; and the source findings in `005-deep-loop-effectiveness-and-fanout`.
Successor `005-resume-adapter` consumes the receipt and certificate contract. Phase 011 alone changes authority.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking for planning. Implementation must freeze the shared certification scheme and trust-provider registry, exact
certificate and receipt field names, boundary-registration rules, local offline-bundle format, certificate expiry and
revocation handling, and whether memory-save persistence evidence is a shared effect receipt or a mode-specific handoff
receipt. It must also decide the minimum receipt granularity for gather and analyze branches without weakening logical
operation identity, branch-local provenance, or the distinction between a transition receipt and an external-effect
receipt. These choices may refine the mode profile but may not add a second digest, verifier, or authority path.
<!-- /ANCHOR:questions -->
