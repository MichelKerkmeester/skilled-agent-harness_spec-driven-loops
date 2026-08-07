---
title: "Feature Specification: Calibration Held-Out Routing Corpus (Idea 5, step 1)"
description: "Build the sealed, privacy-reviewed, independently-authored held-out routing corpus per hub and per risk slice — the artifact whose absence made the council synthesis defer calibrated auto-routing (synthesis §11 open-q 2). Defines the intent-derived labeling protocol (gold never sourced from router output), per-hub sample/coverage minimums across the closed decision algebra, the offline and live gates that a calibration certificate must clear, retention/privacy governance, and the hash-pinned corpus identity tied to a specific EffectivePolicy generation. Every later calibration claim binds to a corpus id minted here. Planning/design only — no live routing config, registry, scorer, or skill is modified."
trigger_phrases:
  - "calibration held-out corpus"
  - "routing gold corpus per hub"
  - "calibrated auto-route certificate corpus"
importance_tier: "critical"
contextType: "implementation"
status: "shadow-partial"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Calibration Held-Out Routing Corpus (Idea 5, step 1)

## EXECUTIVE SUMMARY

This phase builds the one artifact the council synthesis explicitly could not build: a **sealed, privacy-reviewed, independently-authored held-out routing corpus**, partitioned **per hub and per risk slice**. The synthesis parks calibrated auto-routing precisely because "exact evidence tiers and thresholds that permit calibrated auto-route per hub/risk slice ... requires a held-out corpus that does not yet exist" (synthesis §11 open-q 2). Until that corpus exists, `rankScore`/`scoreMargin` remain *evidence only* and "never a calibrated probability without a validation certificate" (synthesis §2.3, §8.1). This phase produces the substrate that makes such a certificate provable rather than asserted.

The corpus is a first-class, immutable, content-addressed artifact — `CalibrationCorpusV1` — carrying its own hash and pinned to the `effectivePolicyHash` (schema + generation) it was authored against, exactly mirroring the `EffectivePolicy identity = hash(base, overlay|null, schema, generation)` discipline (synthesis §2.1). Every downstream calibration claim in the sibling children `005/002` (rank-vs-calibrated contract) and `005/003` (selective-classification controller) **binds to a corpus id minted here**; a calibration claim with no corpus id is structurally inadmissible.

This is planning/design only. It defines the labeling protocol, coverage requirements, gates, governance, and identity model for the corpus. It **does not** modify any live routing config, registry, scorer, or skill, and it **never** touches the shared benchmark scorer `router-replay.cjs` (synthesis §8.2, §10).

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Shadow-partial — the sealed `CalibrationCorpusV1` contract (intent-derived labeling protocol, risk slices, per-hub coverage minimums, offline/live gates, retention/privacy governance, hash-pinned corpus identity) is authored; no live routing/registry/scorer/skill change; repository-level strict validation reserved for the orchestrator |
| **Created** | 2026-07-18 |
| **Branch** | `001-holdout-corpus` |
| **Parent** | `../spec.md` (Calibration phase parent) |
| **Design source** | `../../../006-unified-refactor-research/unified-refactor-synthesis.md` (§8.1, §11 open-q 2/7, §2.3, §5.1) |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## PROBLEM & PURPOSE

### Problem Statement

The unified router treats advisor rank and score margin as evidence, never as authority, and explicitly forbids promoting them to a calibrated probability without a validation certificate tied to the policy/risk slice (synthesis §2.3 invariant, §3 Idea 5 row, §8.1). No such certificate can be issued today because there is no held-out corpus to validate calibration against (synthesis §11 open-q 2). Consequently, `basis: bounded-default` guarded routes and one-turn `clarify` rungs cannot be safely upgraded to confident `basis: signal` auto-routes — calibration remains a "future note" rather than a real capability (master plan EXECUTIVE SUMMARY). The degeneracy proof further shows the corpus is meaningless at N=1: with one candidate "there is nothing to calibrate against one candidate" (synthesis §5.1), so the corpus must be scoped to multi-candidate hubs and to risk slices, not applied uniformly.

### Purpose

Deliver a sealed, hash-pinned held-out routing corpus per multi-candidate hub and per risk slice, with an intent-derived labeling protocol, defined coverage minimums, offline and live validation gates, and retention/privacy governance — so that calibrated auto-routing can become a certifiable capability whose every claim binds to a stable corpus id.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## SCOPE

### In Scope

- **The corpus artifact contract** `CalibrationCorpusV1`: record schema, per-record fields, seal/immutability rules, and content-hash identity pinned to an `effectivePolicyHash` (synthesis §2.1).
- **Labeling protocol**: gold derived from user *intent*, authored independently, and provably blind to router output (no label leakage from the system being measured).
- **Risk-slice definition**: slices derived from destination `role ∈ {actor, evidence, transport, judgment}` and mutation scope (`mutatesWorkspace`), plus `selectionKind` family, grounded in the destination identity tuple (synthesis §2.2, §2.3).
- **Per-hub sample/coverage requirements**: minimum record counts per hub per slice, and branch coverage across the closed four-action algebra `{route, clarify, defer, reject}` (synthesis §2.3).
- **Offline gate**: deterministic replay measuring calibration per slice, with route-gold kept green and the scorer untouched (synthesis §8.2, §10).
- **Live gate**: privacy-filtered, non-authority shadow measurement confirming the offline calibration holds on held-out live traffic before a certificate is issued (synthesis §11 open-q 7).
- **Retention/privacy governance**: sanitization, independent privacy review sign-off, retention windows, and deletion handling for corpus records (synthesis §11 open-q 7).
- **Corpus identity/versioning**: hash-pinned, sealed, reversible via a fenced CAS pointer with the prior generation retained (synthesis §9).
- **N=1 handling**: an explicit "no calibration slice — nothing to calibrate" record for `mcp-code-mode`, not a silent gap (synthesis §5.1).

### Out of Scope

- The rank-vs-calibrated decision contract — owned by `005/002` (consumes this corpus).
- The selective-classification / threshold controller — owned by `005/003` (consumes this corpus).
- Any change to `router-replay.cjs`, the route-gold fixtures' scoring behaviour, or the shared scorer contract — a required scorer edit is a *migration failure*, not a licence (synthesis §8.2, §10).
- Editing live routing config, the mode registries, hub routers, leaf manifests, or any skill — this phase is design/authoring only.
- The offline learning overlay (Idea 2) and its training-traffic pipeline — owned by phase `007`; the corpus here is a *validation* held-out set, not overlay training data.
- Building the compiler, evaluator, or projections — owned by phases `000`–`002`; this phase consumes their identity hashes, it does not produce them.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Define `CalibrationCorpusV1` as an immutable, content-addressed artifact with a `corpusHash` and a pinned `effectivePolicyHash` (schema + generation) it was authored against (synthesis §2.1). | Contract doc specifies every field; corpus id = `hash(records, effectivePolicyHash, schema, generation)`; sealing rules forbid in-place mutation; a new sample mints a new generation. |
| REQ-002 | Specify the intent-derived labeling protocol: each gold label is authored from user intent, independently, and is provably blind to router output. | Each record carries a `labelProvenance` = `intent-derived` and an independent-author attestation; a validator rejects any record whose gold was sourced from, or reconciled against, live router output (no self-confirmation). |
| REQ-003 | Define risk slices over destination `role` and mutation scope, plus `selectionKind` family, from the destination identity tuple (synthesis §2.2, §2.3). | Slice taxonomy enumerated; every corpus record maps to exactly one `(hub, riskSlice)` cell; higher-risk (actor / `mutatesWorkspace=true`) slices carry a stricter certificate tolerance than evidence/transport slices. |
| REQ-004 | Specify per-hub, per-slice sample/coverage minimums across the closed four-action algebra `{route, clarify, defer, reject}` and its positive selection kinds (synthesis §2.3). | Minimum record counts per `(hub, slice)` documented with the statistical rationale; every reachable decision branch for a hub has ≥1 slice cell; zero-signal cases are labeled `defer(no-match)` with **no default union** (synthesis §10 no over-emission). |
| REQ-005 | Define the **offline gate**: deterministic replay of the corpus against the compiled policy, measuring per-slice calibration, with route-gold green and the scorer untouched. | Gate spec names the calibration metric (reliability/ECE per slice) and tolerance; replay is byte-deterministic on identical inputs; running it leaves `router-replay.cjs` byte-identical and route-gold green (synthesis §8.2, §10). |
| REQ-006 | Define corpus identity binding: no calibration certificate may issue, and no per-hub canary may admit calibrated auto-route, without a sealed corpus id from this phase (synthesis §11 open-q 2, §9 Stage 4). | Downstream contract states every calibration claim references a `corpusId`; a claim with a missing/stale/mismatched `corpusId` (against the pinned `effectivePolicyHash`) is inadmissible and fails closed. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Define the **live gate**: a privacy-filtered, non-authority shadow measurement confirming the offline calibration holds on held-out live traffic before a certificate authorizes calibrated auto-route (synthesis §11 open-q 7). | Live gate is evidence-only, never authority-bearing; records are sampled under the privacy filter; a live/offline calibration divergence beyond tolerance blocks the certificate. |
| REQ-008 | Define retention/privacy governance: sanitization, independent privacy review sign-off, retention windows, partitioned storage, and deletion handling (synthesis §11 open-q 7). | Governance section names the PII-scrub step, the independent reviewer role, the retention window, and the right-to-be-forgotten procedure; a corpus generation cannot be sealed without a recorded privacy sign-off. |
| REQ-009 | Specify N=1 handling: `mcp-code-mode` gets an explicit "no calibration slice — nothing to calibrate (one candidate)" record, not a silent omission (synthesis §5.1). | The corpus manifest lists `mcp-code-mode` with an explicit no-slice rationale citing candidateCount=1; a coverage validator does not flag it as a missing hub. |
| REQ-010 | Encode the non-negotiable constraints as corpus invariants: authority destination-local, no over-emission, reversible + gated CAS, scorer untouched, deterministic offline replay preserved (synthesis §10). | Each invariant is stated with its violation-is-a-hard-block wording; the corpus/certificate is defined as *evidence*, never a capability — it can raise a route's evidential `basis` but never grant a destination the right to COMMIT (synthesis §2.3, §8.1). |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## SUCCESS CRITERIA

- **SC-001**: A sealed `CalibrationCorpusV1` is specified for every multi-candidate hub (`sk-code`, `system-deep-loop`, `mcp-tooling`), each hash-pinned to a specific `effectivePolicyHash` (synthesis §2.1, §5.3).
- **SC-002**: The labeling protocol guarantees every gold label is intent-derived and provably blind to router output, with an attestation field and a leakage-rejecting validator (REQ-002).
- **SC-003**: Per-hub, per-slice coverage minimums are documented and cover every reachable branch of the closed four-action algebra, with zero-signal cases labeled `defer(no-match)` and no default union (REQ-004, synthesis §2.3, §10).
- **SC-004**: The offline gate is deterministic, keeps route-gold green, and leaves `router-replay.cjs` byte-identical (REQ-005, synthesis §8.2, §10).
- **SC-005**: Retention/privacy governance is defined with an independent privacy sign-off that is a precondition for sealing a corpus generation (REQ-008).
- **SC-006**: The corpus id is stable and referenceable, and the downstream binding contract makes any calibration claim without a matching `corpusId` inadmissible (REQ-006).
- **SC-007**: `mcp-code-mode` carries an explicit "nothing to calibrate at N=1" record rather than an implied gap (REQ-009, synthesis §5.1).
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 0–2 `effectivePolicyHash` identity (schema + generation) | The corpus cannot pin its identity without it | The corpus is content-addressed and pinned to a specific `effectivePolicyHash`; a claim with a stale/mismatched pin fails closed |
| Dependency | Sibling children `005/002` (rank-vs-calibrated) and `005/003` (selective controller) | They cannot certify calibration without a sealed corpus id | Every downstream calibration claim binds to a `corpusId` minted here; a claim with no corpus id is structurally inadmissible |
| Dependency | Shared benchmark scorer `router-replay.cjs` + route-gold | A required scorer edit would be a migration failure | The offline gate replays deterministically and leaves the scorer byte-identical [synthesis §8.2] |
| Risk | Gold-label leakage from router output (self-confirmation) | Would invalidate the whole calibration substrate | Labels are intent-derived, independently authored; a validator rejects any record reconciled against live router output (REQ-002) |
| Risk | Applying calibration at N=1 where there is nothing to calibrate | A false coverage gap or a meaningless slice | `mcp-code-mode` carries an explicit "no calibration slice — one candidate" record, not a silent omission (REQ-009) [synthesis §5.1] |
| Risk | Privacy exposure in retained corpus records | Governance failure | Sanitization + an independent privacy sign-off is a precondition for sealing a generation; retention windows + deletion handling are defined (REQ-008) |
<!-- /ANCHOR:risks -->

## MIGRATION GATE

This phase is governed by the shared migration-gate model in the master plan (`../../spec.md` → "SHARED MIGRATION-GATE MODEL"). The corpus is not itself a hub activation; it is a calibration substrate. Two bindings apply:

1. **Gate this phase must satisfy — Stage 3 (Shadow evaluate) discipline.** Building and running the corpus must not perturb the deterministic baseline: the corpus's offline replay is deterministic, route-gold stays green, the compatibility projection is unchanged, gold is **never auto-updated** by corpus runs, and the shared scorer `router-replay.cjs` is never touched (master plan Stage 3 gate; synthesis §8.2, §9, §10). This phase advances to its sibling `005/002` only when the sealed corpus id exists and these Stage-3 invariants hold.

2. **Gate this phase unblocks — Stage 4 (Per-hub canary).** Because calibrated auto-route was deferred for lack of this corpus (synthesis §11 open-q 2), no calibration certificate from `005/002`/`005/003`, and therefore no per-hub canary (Stage 4, owned by phases `006/*`) that admits calibrated auto-route, may activate until a sealed, hash-pinned corpus id from this phase is available. The corpus is the precondition that lets Stage 4's "zero hard mismatch" gate include calibrated routes at all.

Activation is reversible and fenced: a corpus generation is promoted by a fenced CAS on a corpus pointer with the prior generation retained (synthesis §9), mirroring the activation-manifest discipline. A rollback swaps to the byte-identical prior corpus generation; it can invalidate future certificates but cannot retroactively undo a COMMITted effect, because authority stays destination-local (synthesis §9, §10).

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- The exact per-slice calibration metric and tolerance (reliability / ECE per risk slice) is specified as a gate here, but its numeric thresholds are validated downstream against a real corpus in `005/002`; open-question 2 is resolved structurally, not numerically [synthesis §11 open-q 2].
- The production privacy program (independent reviewer role, retention owner, right-to-be-forgotten operations) is open-question 7; this phase defines the governance contract, not the operational program [synthesis §11 open-q 7].
- Whether any hub beyond the three multi-candidate hubs (`sk-code`, `system-deep-loop`, `mcp-tooling`) ever needs a calibration slice is deferred until a real routing-gain signal appears.
<!-- /ANCHOR:questions -->
