---
title: "Feature Specification: Rank-vs-Calibrated Route Contract (Idea 5, step 2)"
description: "The route contract that separates always-present ranking evidence (rankScore + scoreMargin) from an optional, certificate-gated estimatedError. estimatedError is legal ONLY when calibration.status = validated names a held-out corpus id (from 005/001), a calibration method, a policyHash, and an evaluation window. Without a validated certificate bound to the pinned policy/risk slice, no probability language is permitted anywhere in the decision or its projections and the safe action is one-turn clarify or typed defer. Design/contract only — no live routing config, registry, scorer, or skill is modified."
trigger_phrases:
  - "rank vs calibrated route contract"
  - "calibration certificate estimatedError contract"
  - "calibrated auto-route certificate schema"
importance_tier: "critical"
contextType: "implementation"
status: "shadow-partial"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Rank-vs-Calibrated Route Contract (Idea 5, step 2)

**Implementation status**: Executable packet-local schemas, lifecycle logic,
typed fixtures, compatibility projection, and validation harness are delivered.
Stage-3 shadow evidence is recorded in `implementation-summary.md`; live fitting,
issuance, and activation remain downstream. Strict packet validation was run and
remains red on packet-template drift plus unavailable repository validator tooling.

## EXECUTIVE SUMMARY

This phase defines the **route contract that draws a hard line between ranking evidence and calibrated probability**. `rankScore` and `scoreMargin` are *always* present on a positive route — they are ordinal evidence about which destination ranked highest and by how much. An `estimatedError` (a probability-of-error / calibrated confidence value) is *optional* and structurally **inadmissible** unless a `CalibrationCertificateV1` is resolved live, `status = validated`, and bound to the request's pinned `policyHash` and risk slice. The certificate must name a held-out corpus id produced by `005/001`, a calibration method, the `policyHash` it was fit and validated against, and an evaluation window.

The governing rule is the one all four research lineages converged on: **rank is not probability** (synthesis §2.3, §8.1; Idea 5 row in §3). Advisor rank alone "exceeds available evidence" if treated as a calibrated probability (synthesis §6, eliminated alternatives). So without a validated certificate, the evaluator emits **no probability language at all** — not in the decision, not in any of the three projections — and the safe action degrades to **one-turn `clarify` or typed `defer`** (synthesis §4 recovery ladder, rung 2 → rung 3). Calibrated auto-route is the *only* thing a certificate unlocks, and it unlocks it only for the exact policy/risk slice the certificate was validated on.

This is **design and contract work only.** This phase specifies the field shapes, the certificate schema, the legality rule, the calibration method envelope, and the fixture families. It does **not** fit thresholds, mint live certificates, or touch any live routing config, registry, scorer, or skill — threshold fitting and certificate issuance are the next child, `005/003` (master plan Phase 5 map).

## 1. PROBLEM & PURPOSE

### Problem Statement

The compiled evaluator (`002`) already carries `rankScore`/`scoreMargin` as evidence inside a `route` decision (synthesis §2.3). But two failure modes are one careless field away: (1) a downstream consumer reads `rankScore` as if it were `P(correct)` and auto-routes on a number that was never calibrated against anything, and (2) the advisor's recommendation strength leaks into probability language in a projection or policy card. The synthesis explicitly parked calibration because the held-out corpus needed to license calibrated auto-route "does not yet exist" (synthesis §11, Q2). The master plan un-parks it and builds the corpus first (`005/001`) — but a corpus is inert without a **contract** that says precisely when a calibrated number may appear and what it is bound to. That contract is missing.

### Purpose

Define a typed, byte-stable route contract in which ranking evidence is unconditional and calibrated confidence is admissible **only** behind a validated, policy/risk-slice-bound certificate — so calibrated auto-route can ship as a real, gated, reversible capability while every un-certified path stays honest (rank-only evidence, and clarify/defer instead of invented probability).

## 2. SCOPE

### In Scope

- The **route-evidence contract**: `rankScore` (always present), `scoreMargin` (always present), and an optional `calibration` sub-object whose `estimatedError` field is admissible only under a validated certificate.
- The **`CalibrationCertificateV1` schema**: `corpusId` + `corpusHash` (from `005/001`), `method`, `methodParams`, `policyHash`, `riskSlice`, `evaluationWindow`, held-out `metrics`, `status`, generation, and content hash.
- The **legality rule**: exactly when `estimatedError` and probability language are permitted, and the mandated safe action (`clarify`/`defer`) when they are not.
- The **calibration-method envelope**: the two admissible method families (temperature scaling; selective-classification threshold fitting) and what "validated per policy/risk slice" means for each — as a *contract*, not a fitted result.
- The **certificate lifecycle contract**: candidate → validated → expired/revoked, bound to a policy generation, activated/rotated by fenced CAS with a retained prior generation.
- The **route-gold compatibility rule** for the new field: `estimatedError` is projection-invisible through the compatibility projector (synthesis §8.2) so deterministic replay and the shared scorer are untouched.
- Fixture families that assert both the licensed and the withheld paths.

### Out of Scope

- **Fitting thresholds or issuing live certificates** — that is the selective-classification controller, `005/003`. This phase writes the contract it must satisfy.
- **Building the held-out corpus** — that is `005/001`; this phase only *references* its `corpusId`/`corpusHash` deliverable.
- **Editing the shared scorer `router-replay.cjs`** — hard constraint (synthesis §8.2, §10); a scorer edit to pass is a migration failure, not a license.
- **Modifying any live routing config, mode registry, activation manifest, or skill** — planning/design only.
- **Per-hub activation of calibrated auto-route** — that is gated separately at Stage 4 per-hub canary, owned by `006/*` (master plan gate model).

## 3. CONTRACT DESIGN

### 3.1 Route evidence: ranking is unconditional, probability is not

Inside a `route` decision (synthesis §2.3), the evidence block carries:

| Field | Presence | Meaning | Authority |
|-------|----------|---------|-----------|
| `rankScore` | **always** | Ordinal score of the selected target under the compiled policy's scorer. Pure ordering evidence. | none |
| `scoreMargin` | **always** | Gap between the selected target and the next candidate. Evidence of separation, not of correctness. | none |
| `calibration` | **always present as an object** | Carries `status`; carries `estimatedError` **only** when `status = validated`. | none |

`rankScore`/`scoreMargin` are evidence, never authority, and never a calibrated probability without a validation certificate (synthesis §2.3, invariant 4). They cannot, on their own, cross an auto-route threshold — they can only *order* candidates and feed the recovery ladder.

### 3.2 The `calibration` sub-object

```text
calibration =
  | { status: "unvalidated" }                       // rank-only; no estimatedError; no probability language
  | { status: "validated",
      certificateId,                                  // resolves to a live CalibrationCertificateV1
      corpusId,                                        // held-out corpus from 005/001
      method,                                          // "temperature-scaling" | "selective-classification-threshold"
      policyHash,                                      // MUST equal the request's pinned effectivePolicyHash
      riskSlice,                                        // the (policy, risk) slice this cert was validated on
      evaluationWindow,                                // { corpusVersion, sampleCount } or { from, to }
      estimatedError: number in [0,1] }                // LEGAL ONLY in this branch
```

`status` is the discriminant. `estimatedError` exists in the `validated` branch and **is structurally absent** (not `null`, not a sentinel number) in the `unvalidated` branch — the same discipline the algebra uses to make negative decisions target-free (synthesis §2.3, "the nested form makes the dangerous states unrepresentable").

### 3.3 `CalibrationCertificateV1` schema

```text
CalibrationCertificateV1 = {
  certificateId: string,          // content hash of the fields below (domain-separated)
  corpusId: string,               // id of the held-out corpus produced by 005/001
  corpusHash: string,             // pins the exact held-out evaluation bytes; immutable
  method: "temperature-scaling" | "selective-classification-threshold",
  methodParams: object,           // temperature T; OR abstention threshold tau + coverage target
  policyHash: string,             // the effectivePolicyHash this cert is bound to (base+overlay+schema+generation)
  riskSlice: string,              // the (policy, risk) slice the cert licenses — NOT global
  evaluationWindow: { corpusVersion, sampleCount } | { from, to },
  metrics: {                      // measured on the held-out corpus, never on training data
    expectedCalibrationError,     // ECE — the temperature-scaling acceptance metric
    selectiveRisk,                // risk at the fitted coverage — the selective-classification metric
    coverage,                     // fraction of requests the cert would auto-route
    sampleCount
  },
  status: "candidate" | "validated" | "expired" | "revoked",
  generation: string,             // policy generation this cert was issued against
  validatedAt, validatedBy,
  certHash: string                // byte-stable hash for pinning + fenced CAS
}
```

The certificate is a **separately hashed artifact bound to one policy generation** — structurally analogous to the `CorrectionOverlayV1` pointer discipline (synthesis §2.1): serving policy is never edited to "turn on" calibration; a certificate pointer is swapped by fenced CAS.

### 3.4 The legality rule (the load-bearing invariant)

`estimatedError` — and any probability language anywhere in the decision or its `AdvisorProjectionV1` / `TypedRouteGoldV1` / `PolicyCardV1.md` projections — is permitted **iff ALL** hold at evaluation time:

1. A `CalibrationCertificateV1` resolves and `status = validated`.
2. `certificate.policyHash === request.pinnedActivationGeneration`'s `effectivePolicyHash` (no cross-generation reuse; synthesis §2.1 request-pinned identity).
3. `certificate.riskSlice` matches the request's policy/risk slice (a cert is per slice, never global; synthesis §8.1, Idea 5 row §3).
4. The certificate is not `expired`/`revoked` and its `corpusHash` still resolves.

If **any** condition fails: `calibration.status = "unvalidated"`, `estimatedError` is absent, **no probability language is emitted**, and calibrated auto-route is **not** available. Rank + margin remain pure ordering evidence. When a decision would otherwise have needed calibrated confidence to auto-route, the mandated safe action is the recovery ladder's honest rungs — **one-turn `clarify`** if a single answer can discriminate to a legal local route, else **typed `defer`** (synthesis §4 recovery ladder, rung 2 → rung 3). This is the direct contract encoding of "auto-route needs a certificate tied to the policy/risk slice" (synthesis Idea 5, §3) and "advisor rank alone is never probability" (synthesis §8.1).

### 3.5 Calibration method envelope (contract, not fitted values)

Two method families are admissible; `005/003` picks and fits per slice. This phase fixes only what each *means* and how it is validated:

- **Temperature scaling.** A single scalar `T` recalibrates the compiled scorer's scores so `estimatedError` tracks true error. Validated on the held-out corpus by **Expected Calibration Error (ECE)** below a per-slice budget. This is the "estimatedError is trustworthy" guarantee.
- **Selective-classification threshold fitting.** An abstention threshold `tau` (with a coverage target) partitions requests into auto-route vs abstain. Validated by **selective risk at the fitted coverage** on the held-out corpus. This is the "when to abstain into clarify/defer" guarantee.

"Validated per policy/risk slice" means the method's acceptance metric was measured **on the `005/001` held-out corpus, for that exact `(policyHash, riskSlice)`** — never pooled across slices, never on training data. A cert validated on a low-risk `sk-code` slice cannot license a high-risk `mcp-tooling` external-effect route.

### 3.6 What calibration does NOT change

A certified, high-confidence calibrated route is still just **evidence**. It does not grant commit authority: the route's `authority` stays `WithheldUntilVerify` and the effect still flows through destination-local PREPARE → VERIFY → COMMIT (synthesis §2.3, §7). A proof/recommendation is never a capability. Calibration also never widens the candidate set — `estimatedError` is per-decision evidence, never a fallback union — preserving the no-over-emission constraint (synthesis §10).

## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `rankScore` and `scoreMargin` are always present on a `route` decision and typed as authority-free ordering evidence. | Schema + a fixture where a positive route carries both fields and neither can be read as authority or probability. |
| REQ-002 | `calibration.estimatedError` is admissible ONLY in the `status = validated` branch; structurally absent (not null/sentinel) otherwise. | Schema makes the `unvalidated` branch have no `estimatedError` field; a fixture attempting `unvalidated + estimatedError` fails contract validation. |
| REQ-003 | The `validated` branch requires a resolvable certificate naming `corpusId` (from `005/001`), `method`, `policyHash`, and `evaluationWindow`. | `CalibrationCertificateV1` schema enumerates all four; a fixture missing any one is rejected. |
| REQ-004 | Certificate validity is bound to the request's pinned `policyHash` AND `riskSlice`; cross-generation or cross-slice reuse is rejected. | Fixtures: (a) policyHash mismatch → unvalidated; (b) riskSlice mismatch → unvalidated. |
| REQ-005 | With no validated certificate, no probability language appears in the decision or any of the 3 projections, and the safe action is one-turn `clarify` or typed `defer`. | Fixture: zero/expired cert → decision has `status:unvalidated`, no `estimatedError`, and routes needing confidence emit `clarify` or `defer`. |
| REQ-006 | Calibrated auto-route is the ONLY capability a certificate unlocks; it never grants commit authority and never widens the candidate set. | Fixture: certified route still carries `authority: WithheldUntilVerify` and identical `targets` cardinality as the un-certified path. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | `estimatedError` and the `calibration` object are projection-invisible through the compatibility projector; deterministic route-gold replay is byte-identical with/without a cert. | Fixture: same input replayed with and without a validated cert projects to identical `observedIntents`/`observedResources`; scorer untouched. |
| REQ-008 | Certificate lifecycle (candidate → validated → expired/revoked) is bound to a policy generation and rotated by fenced CAS with a retained prior generation. | Contract text + a rollback fixture: revoking the active cert reverts to `unvalidated` (rank-only → clarify/defer) with no byte change to the serving policy. |
| REQ-009 | The two admissible method families (temperature scaling; selective-classification threshold) and their per-slice validation metrics (ECE; selective risk at coverage) are specified as a contract for `005/003` to satisfy. | §3.5 present; `005/003` can consume it without re-deriving method semantics. |

## 5. SUCCESS CRITERIA

- **SC-001**: A route decision can carry calibrated `estimatedError` **only** when a validated certificate is bound to the request's exact `(policyHash, riskSlice)`; every other path is rank-only. (REQ-002, REQ-003, REQ-004)
- **SC-002**: No probability language is emittable without a validated certificate; the mandated fallback is one-turn `clarify` or typed `defer`, never invented confidence. (REQ-005)
- **SC-003**: The new field is invisible to the shared scorer and to deterministic route-gold replay — parity holds byte-for-byte and `router-replay.cjs` is never edited. (REQ-007)
- **SC-004**: A certificate is evidence only: it never grants commit authority, never widens candidates, and is reversible by fenced CAS to a retained prior generation. (REQ-006, REQ-008)
- **SC-005**: `005/003` (the selective-classification controller) can fit thresholds and issue certificates against this contract with zero contract ambiguity. (REQ-009)

## 6. NON-NEGOTIABLE CONSTRAINTS (every phase)

| Constraint | How this phase holds it |
|-----------|-------------------------|
| Deterministic offline route-gold replay preserved | `estimatedError`/`calibration` are projection-invisible (§3.4, REQ-007); replay never calls a live calibrator or advisor. |
| NEVER touch the shared scorer (`router-replay.cjs`) | The compatibility projector maps enriched decisions back to the existing intent/resource shape; a required scorer edit is a migration failure (synthesis §8.2, §10). |
| Authority stays destination-local | A certificate/`estimatedError` is evidence; the route stays `authority: WithheldUntilVerify` and commits only through destination VERIFY→COMMIT (§3.6). A proof/recommendation is never a capability. |
| Reversible + gated | Certificates are bound to a policy generation and rotated by **fenced CAS** with a **retained prior generation**; revocation reverts to rank-only → clarify/defer (REQ-008). |
| No over-emission | `estimatedError` is per-decision evidence; it never unions the registry or widens the candidate set (§3.6, REQ-006). |

## 7. MIGRATION GATE

**Stage this phase satisfies: Stage 3 — Shadow evaluate** (master plan, shared migration-gate model).

The gate is: *full typed replay deterministic; compatibility projection matches route-gold; gold never auto-updates.* Introducing `calibration`/`estimatedError` into the route contract must **not** perturb that gate — the enriched decision must project back to byte-identical `observedIntents`/`observedResources` (REQ-007), and the gold is never auto-updated to accommodate the new field. This contract phase must pass Stage 3 **before `005/003`** (the selective-classification controller that fits thresholds and issues live certificates) activates; `005/003` cannot mint a certificate against a contract whose shadow-evaluate parity is unproven.

Downstream note: the *actual per-hub flip* of calibrated auto-route (turning a validated certificate into live auto-routing behaviour) is gated further at **Stage 4 — Per-hub canary** (owned by `006/*`): zero hard mismatch, advisor identity matches or is ignored, document parity, rollback drill proven. This phase only defines the contract those later gates enforce.

## 8. DEPENDENCIES & RELATED DOCUMENTS

- **Upstream (hard dependency)**: `../001-*` (held-out corpus) — produces the `corpusId`/`corpusHash` this contract's certificates must name. The corpus artifact is referenced abstractly here; its bytes are owned by `005/001`.
- **Downstream (consumer)**: `../003-*` (selective-classification controller) — fits `T`/`tau` per slice and issues `CalibrationCertificateV1` against this contract.
- **Parent design (source of truth)**: `../../../006-unified-refactor-research/unified-refactor-synthesis.md` — Idea 5 (§3 table), §2.3 (closed decision algebra), §4 (recovery ladder), §8.1 (advisor read), §11 Q2 (parked corpus), §10 (constraint compliance).
- **Master plan**: `../../spec.md` — Phase 5 map + shared migration-gate model.
- **Sibling contracts**: `../../002-decision-evaluator/` (the algebra `calibration` attaches to); `../../000-contract-schemas/` (the schema family this certificate joins).
