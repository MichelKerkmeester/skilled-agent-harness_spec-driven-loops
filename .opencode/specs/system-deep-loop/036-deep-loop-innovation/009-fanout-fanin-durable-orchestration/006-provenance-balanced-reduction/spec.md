---
title: "Feature Specification: Provenance-Balanced Reduction"
description: "Plan a deterministic fan-in reducer that deduplicates surviving leaf results, balances contribution across source/model provenance, preserves every item's lineage, and escalates contested merges without allowing one prolific source to dominate."
trigger_phrases:
  - "provenance-balanced reduction"
  - "source-balanced fan-in"
  - "deterministic provenance merge"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/009-fanout-fanin-durable-orchestration"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/009-fanout-fanin-durable-orchestration/006-provenance-balanced-reduction"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the planned provenance-balanced reduction contract and verifier gates"
    next_safe_action: "Implement deterministic source-balanced merge and contested-dedup fixtures"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Provenance-Balanced Reduction

> Phase adjacency under the durable-orchestration parent (navigation order, not a runtime dependency): predecessor `005-partial-failure-policy`; successor: none (last sibling).

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/009-fanout-fanin-durable-orchestration/006-provenance-balanced-reduction |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop |
| **Origin** | Sixth child of the phase-009 fan-out / fan-in durable-orchestration parent |
| **Depends on** | None (`[]`) |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

A durable fan-out can return valid results from heterogeneous SOL, LUNA, GLM, or later executor/model combinations,
but arrival order, response length, and duplicate volume are not evidence quality. Concatenation lets a prolific leaf
dominate the output; global first-wins dedup lets the fastest source dominate; vote counting lets repeated branches
from one correlated model family masquerade as independent support. Any of those reducers can erase minority evidence
and make an identical persisted run replay differently after resume or salvage.

The run-2 prototype at
`.opencode/specs/system-deep-loop/036-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/scratch/fanout-prototype.cjs`
proved the minimum useful behavior: normalize URL/name identity, round-robin across SOL + LUNA + GLM leaves, and retain
the first contributing leaf on each merged repository. This phase generalizes that demonstration into a versioned
ledger reducer. It balances at configured provenance strata, merges exact duplicates while retaining every contributor,
keeps uncertain equivalence contested, and derives output only from canonical input identities and policy versions.
The result is one replayable fan-in artifact in which every claim remains traceable to its executor, model, invocation,
branch lineage, source rank, and evidence locator.

Contested semantic or identity merges use the blinded/counterfactual contract in
`.opencode/specs/system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/003-blinded-adjudication-service/spec.md`:
the adjudicator sees content-equivalent candidates without producer identity, and unstable or inconclusive decisions
remain separate rather than being forced into one claim. The parent outcome and `depends_on: []` planning status are
defined by
`.opencode/specs/system-deep-loop/036-deep-loop-innovation/manifest/phase-tree.json`.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A typed reduction input for every admitted surviving leaf item: result-envelope digest, logical branch ID, parent lineage, executor kind, provider/model/model-family identity, invocation fingerprint, leaf-local rank, evidence locators, and partial-failure disposition.
- A versioned, type-specific canonicalization contract that forms exact dedup keys without using arrival time, filesystem order, mutable display text, or hidden producer identity.
- Exact-key merge semantics that retain one canonical item plus the complete ordered contributor/support set; contradictory payloads under one key become a conflict set, not an overwritten value.
- A hierarchical provenance-balance policy: fair scheduling across configured source/model-family buckets, then branches within each bucket, with a per-source contribution cap and at most one support increment per source bucket per merged claim.
- Deterministic tie-breaks based on canonical source identity, logical branch ID, item digest, and original leaf rank after policy-defined weighting; byte-identical accepted inputs and policy yield byte-identical output.
- Per-item retained provenance for selected, duplicate, conflicted, deferred, and excluded inputs, including why an item occupied or did not occupy an output position.
- A contested-merge bridge to the phase-007 blinded adjudication service; producer identity is unavailable to judges and deblinded only for the final audit trail.
- Typed ledger events and a reduction receipt binding ordered input-event digests, reducer/policy version, normalization version, source-bucket manifest, partial-failure denominator, output digest, and replay fingerprint.
- Permutation, resume, salvage, duplicate-flood, cloned-source, malformed-provenance, conflict, and partial-survivor fixtures.

### Out of Scope
- Leaf dispatch, result-envelope persistence, resume/salvage, leases/waves, fan-in readiness, or failure-tolerance decisions owned by siblings `001` through `005`.
- Generating new leaf content, choosing models/executors, changing per-leaf prompts, or treating model reputation as a hidden quality score.
- Semantic novelty, contradiction/supersession, claim continuity, projections, or convergence policy owned by phases 007 and 008 of the parent program.
- Replacing blinded adjudication with an identity-aware tie-break, majority vote, response-length heuristic, or competence weight presented as independence correction.
- Authority cutover or legacy-writer retirement; the reducer lands additive and dark until later migration gates authorize consumption.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Admit only typed, provenance-complete leaf items | Every admitted item binds its result envelope, executor/model provenance, invocation fingerprint, logical branch lineage, leaf rank, evidence locators, and failure disposition; missing required provenance fails closed |
| REQ-002 | Canonicalize identity under a versioned type-specific rule | Equal semantic identifiers produce one exact key across path, case, URL, and serialization variants covered by the policy; unsupported item types or ambiguous empty keys are rejected |
| REQ-003 | Merge exact duplicates without losing support history | One canonical item retains all distinct contributor records, source-local payload digests, ranks, and evidence locators; no duplicate overwrites another contributor |
| REQ-004 | Keep contradictory or uncertain equivalence explicit | Payload conflicts under an exact key form a typed conflict set; uncertain semantic equivalence remains separate unless blinded adjudication returns a stable merge verdict |
| REQ-005 | Balance output across independent provenance strata | Weighted fair scheduling gives each eligible configured source/model-family bucket its policy share before any bucket receives an additional slot, subject only to explicit item eligibility and output limits |
| REQ-006 | Prevent prolific or cloned sources from manufacturing weight | Per-source caps apply to output occupancy and each source bucket contributes at most one support increment per merged claim; cloned branches do not increase effective-source count |
| REQ-007 | Retain provenance and reduction disposition per item | Selected, merged, conflicted, deferred, invalid, and capacity-excluded items each retain their origin and a machine-readable disposition linked from the reduction receipt |
| REQ-008 | Make reduction independent of timing and input enumeration | Permuting leaf completion order, event enumeration, worker assignment, resume boundaries, or salvage order produces the same canonical output bytes and receipt digest |
| REQ-009 | Preserve minority and unique-source evidence | A valid unique item is not removed solely because its source has fewer leaves or lower raw volume; quota exhaustion defers it with provenance rather than erasing it |
| REQ-010 | Bind partial-survivor context to the result | The receipt records expected, admitted, failed, timed-out, cancelled, invalid, and excluded source buckets so a degraded merge cannot be mistaken for full-fleet consensus |
| REQ-011 | Emit replayable typed reduction evidence | Accepted inputs, bucket assignments, dedup groups, conflicts, adjudication verdicts, scheduling decisions, output order, policy versions, and output digest are reconstructible from ledger events |
| REQ-012 | Keep identity out of contested-content adjudication | Judges receive blinded candidates and cannot access producer/model/position metadata; unstable, inconclusive, missing, or identity-leaking adjudication fails closed |
| REQ-013 | Keep the reducer additive and non-authoritative | Shadow execution may emit receipts and parity evidence, but no legacy fan-in authority changes in this phase |
| REQ-014 | Maintain source traceability | The implementation contract and tests cite the run-2 prototype, blinded-adjudication phase, and phase manifest for their load-bearing invariants |
<!-- /ANCHOR:requirements -->

### Canonical reduction contract

The reducer first validates and canonicalizes every admitted item, then groups exact keys. Within a group, byte-equal or
policy-compatible payloads become one item with an ordered support set; contradictory payloads form a conflict set.
Only a stable blinded verdict may merge an uncertain equivalence class. Missing adjudication leaves candidates separate.
Nothing is silently discarded: malformed, duplicated, conflicted, quota-deferred, and capacity-excluded inputs receive
typed dispositions linked from the receipt.

Output ordering is hierarchical weighted fair reduction, generalizing the prototype's one-item-per-leaf round robin:

| Stage | Balance unit | Deterministic rule |
|-------|--------------|--------------------|
| Source strata | Policy-defined executor/model-family bucket | Visit eligible buckets by normalized bucket ID and allocate their declared rational weight without consulting completion time or raw item count |
| Branches within a stratum | Logical branch ID + invocation fingerprint | Visit branches by canonical branch identity; repeated retries with the same fingerprint remain one logical contributor |
| Items within a branch | Leaf-local rank + canonical item digest | Preserve declared leaf rank, then break exact ties by digest; arrival order is never a tie-break |
| Duplicate support | Distinct source bucket | Count a bucket once per claim while retaining every contributing branch record; expose raw contributors separately from effective-source count |
| Contested merge | Blinded adjudication verdict digest | Merge only on a stable verdict under the pinned policy; otherwise retain the full conflict/equivalence set |

The policy may declare unequal rational weights only through a versioned, reviewable configuration. Model prestige,
provider name, response length, confidence prose, and historical seat reputation cannot silently alter those weights.

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Exact duplicates reduce to one canonical item while every contributor, payload digest, rank, lineage, and evidence locator remains addressable.
- **SC-002**: A source producing arbitrarily more valid items cannot consume another eligible source bucket's policy share or manufacture additional effective support for a claim.
- **SC-003**: Permutations of completion, enumeration, resume, salvage, and worker assignment produce byte-identical canonical output and receipt digests.
- **SC-004**: Contradictory exact-key payloads and uncertain semantic equivalence remain explicit unless a stable blinded adjudication verdict authorizes their merge.
- **SC-005**: Every output and every excluded/deferred input carries a typed provenance and disposition chain back to canonical result-envelope and dispatch evidence.
- **SC-006**: Partial-fleet output cannot claim full-fleet consensus; the receipt exposes expected and surviving provenance strata plus every exclusion reason.
- **SC-007**: The reducer runs additive and dark, preserves legacy authority, and produces the provenance-bearing surface required by phase 010.
- **SC-008**: Strict validation reports no errors other than the intentionally deferred generated metadata files.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

This child has `depends_on: []` as an independently authored sibling planning contract. Runtime integration still
consumes the parent program's typed ledger, result envelopes, stable branch identities, partial-failure disposition,
and the phase-007 blinded adjudication interface when those contracts are available. Adjacency to
`005-partial-failure-policy` is navigational only and does not create a hidden authoring dependency.

The highest risk is false independence: multiple branches from one model family or executor configuration may be
counted as separate sources and overwhelm a genuinely distinct source. Other risks are unstable canonicalization,
order leakage through asynchronous completion, accidental loss of duplicate provenance, malicious item floods,
identity leakage into adjudication, and policy-version drift during replay. Verification therefore pins balance and
normalization policies, uses cloned-source and duplicate-flood fixtures, shuffles all non-semantic orderings, injects
payload conflicts and missing provenance, and compares canonical bytes plus receipt digests.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking for the planning contract. Implementation may choose the canonical serialization, rational weighted-fair
scheduler, type-specific normalizers, and exact source-bucket dimensions after the ledger and result-envelope schemas
are fixed. Those choices may not use arrival order, collapse uncertain claims without stable blinded adjudication,
discard contributor provenance, infer independence from branch count, or change weights outside a versioned policy.
<!-- /ANCHOR:questions -->
