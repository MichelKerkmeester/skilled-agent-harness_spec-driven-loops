---
title: "Implementation Plan: Rank-vs-Calibrated Route Contract (Idea 5, step 2)"
description: "Build approach for the rank-vs-calibrated route contract: extend the RouteDecision evidence shape with an always-present rankScore/scoreMargin and a certificate-gated calibration sub-object, define CalibrationCertificateV1, encode the legality rule (no validated cert => no probability => clarify/defer), and prove projection-invisibility against deterministic route-gold. Contract/design and fixtures only — no live routing config, registry, scorer, or skill is modified; threshold fitting and certificate issuance belong to 005/003."
trigger_phrases:
  - "rank vs calibrated contract plan"
  - "calibration certificate build approach"
  - "estimatedError projection invisibility plan"
importance_tier: "critical"
contextType: "implementation"
status: "shadow-partial"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Rank-vs-Calibrated Route Contract (Idea 5, step 2)

**Execution evidence**: The contract is implemented as packet-local schemas,
libraries, typed fixtures, and a zero-dependency harness. These artifacts remain
shadow-only and do not fit thresholds, mint operational certificates, or modify
runtime routing. `implementation-summary.md` records the real scorer result and
the intentionally deferred activation properties.

## 1. APPROACH

Build the contract in the same order the safety argument reads: **fix the evidence shape first, then the certificate it depends on, then the legality rule that binds them, then prove the whole thing is invisible to the shared scorer.** Every artifact is a schema, a rule, or a fixture — nothing in this phase fits a threshold, mints a live certificate, or edits a serving policy. The controller (`005/003`) and the corpus (`005/001`) are the two moving parts this phase deliberately holds still and only references.

The sequencing is deliberate:

1. **Evidence shape before certificate.** `rankScore`/`scoreMargin` are unconditional; they must be nailed down as authority-free ordering evidence (synthesis §2.3) before any optional confidence field is layered on. This prevents the certificate work from quietly promoting rank into probability.
2. **Certificate before legality rule.** `CalibrationCertificateV1` must enumerate `corpusId`/`corpusHash`/`method`/`policyHash`/`riskSlice`/`evaluationWindow` so the legality rule has concrete fields to test against. The corpus id is a *reference* to `005/001`'s deliverable — the schema pins its shape, not its bytes.
3. **Legality rule before fixtures.** The rule (§3.4 of spec.md) is the single load-bearing invariant; fixtures exist to make its dangerous states unrepresentable and its safe states replayable.
4. **Projection-invisibility last, as the gate.** The Stage-3 migration gate (deterministic replay + compatibility-projection parity) is proven only after the field exists, by showing the compatibility projector drops `calibration`/`estimatedError` on the floor.

## 2. KEY FILES & CONTRACTS TOUCHED (this packet only)

This phase authors **specification and fixture artifacts inside this packet folder**. It touches **no** runtime file. The contracts it *specifies against* (owned by sibling phases) are named so `005/003` and the schema phase can consume them.

| Artifact | Kind | Owned here? | Notes |
|----------|------|-------------|-------|
| `spec.md` | contract spec | yes | The route-evidence shape, certificate schema, legality rule, method envelope. |
| `plan.md` / `tasks.md` | build docs | yes | This plan + its ordered task list. |
| Fixture spec (families F1–F9, described in tasks) | test contract (described, not executed) | yes | Enumerated as a contract for `005/003` and the route-gold lane to implement. |
| `RouteDecisionV1` evidence block | schema (sibling) | no | Extended *by contract* in `../../000-contract-schemas/`; this phase specifies the delta. |
| `CalibrationCertificateV1` | schema (sibling) | no | Joins the contract family in `../../000-contract-schemas/`. |
| Compatibility projector | adapter (sibling) | no | `../../002-decision-evaluator/`; this phase specifies that it MUST drop `calibration`. |
| `router-replay.cjs` | shared scorer | **NEVER** | Read-only reference; editing it to pass is a migration failure (synthesis §8.2, §10). |

## 3. BUILD STEPS

### Step 1 — Pin the unconditional evidence shape
Specify `rankScore` and `scoreMargin` as always-present, authority-free, non-probability fields on a `route` decision (spec.md §3.1). State explicitly that they cannot cross an auto-route threshold alone (synthesis §2.3 invariant 4). Deliverable: REQ-001 satisfied in `spec.md`.

### Step 2 — Define the `calibration` discriminated sub-object
Write the two-branch shape: `{status:"unvalidated"}` vs `{status:"validated", ...estimatedError}`. Make `estimatedError` structurally absent in the `unvalidated` branch — no null, no sentinel (spec.md §3.2). Deliverable: REQ-002.

### Step 3 — Author `CalibrationCertificateV1`
Enumerate every field (spec.md §3.3), with `corpusId`/`corpusHash` referencing `005/001`, `policyHash` bound to the pinned generation, `riskSlice` per-slice, `evaluationWindow`, held-out `metrics` (ECE, selective risk, coverage), and lifecycle `status`. Deliverable: REQ-003.

### Step 4 — Encode the legality rule
State the four-condition admissibility test (spec.md §3.4): validated status, policyHash match, riskSlice match, non-expired/resolvable corpus. Specify the mandated fallback when any condition fails: no probability language anywhere; safe action = one-turn `clarify` else typed `defer` (synthesis §4 rung 2 → 3). Deliverable: REQ-005.

### Step 5 — Specify the calibration-method envelope
Fix the two admissible families and their per-slice validation metric — temperature scaling / ECE, and selective-classification threshold / selective-risk-at-coverage (spec.md §3.5) — as a contract for `005/003`. Do **not** fit values. Deliverable: REQ-009.

### Step 6 — Specify the certificate lifecycle + reversibility
State candidate → validated → expired/revoked, binding to a policy generation, activation/rotation by fenced CAS with a retained prior generation, and revocation reverting to rank-only → clarify/defer (spec.md §3.6, §7). Deliverable: REQ-008.

### Step 7 — Specify authority and no-over-emission guarantees
State that a certified route keeps `authority: WithheldUntilVerify`, commits only through destination VERIFY→COMMIT, and never widens the candidate set (spec.md §3.6). Deliverable: REQ-006.

### Step 8 — Specify projection-invisibility + the fixture families
State that the compatibility projector drops `calibration`/`estimatedError` so route-gold replay is byte-identical (synthesis §8.2). Enumerate fixture families F1–F9 (see tasks) covering licensed, withheld, mismatch, rollback, and parity paths. Deliverable: REQ-007.

## 4. VERIFICATION

Because this phase produces contract text and fixture specifications (not runtime), verification is a **design-consistency and gate-readiness** check, not a code test run:

1. **Requirement-to-section trace.** Every REQ-00x in `spec.md` maps to a concrete section (§3.1–§3.6, §7) — confirmed by cross-reference; no requirement is orphaned.
2. **Danger-state coverage.** For each way the legality rule can be violated (unvalidated+estimatedError, policyHash mismatch, riskSlice mismatch, expired cert, probability-in-projection), a fixture family asserts the withheld/clarify/defer outcome.
3. **Projection-invisibility argument.** The spec states, and a fixture family (F7) is enumerated to prove, that the compatibility projector yields byte-identical `observedIntents`/`observedResources` with and without a validated cert — the Stage-3 gate condition. The shared scorer is referenced read-only; no diff to `router-replay.cjs` is proposed.
4. **Constraint checklist.** The five non-negotiable constraints (spec.md §6) each have a holding mechanism named in-doc.
5. **Spec-kit validation.** When this child is run through `validate.sh --strict` as part of the parent packet, frontmatter + markers + required sections parse; DQI-equivalent structural check passes.

**Explicitly NOT in this phase's verification:** fitted ECE/selective-risk numbers, live certificate issuance, or any per-hub canary — those are `005/003` and `006/*` respectively.

## 5. RISKS & MITIGATIONS

| Risk | Impact | Mitigation |
|------|--------|------------|
| Contract lets `estimatedError` appear as `null` in the unvalidated branch, inviting downstream mis-reads | Med | Discriminated union with the field structurally absent (Step 2); fixture F2 rejects it. |
| A certificate is reused across policy generations or risk slices | High | policyHash + riskSlice binding in the legality rule (Step 4); fixtures F4/F5. |
| Someone edits the shared scorer to make the enriched field pass | High (hard-constraint breach) | Projection-invisibility (Step 8); scorer is read-only; a required edit is declared a migration failure (synthesis §10). |
| Contract drifts from `005/003`'s method needs | Med | Method envelope (Step 5) is authored as the controller's input contract, not a fitted result. |

## 6. CROSS-REFERENCES

- **Specification**: `spec.md`
- **Tasks**: `tasks.md`
- **Source design**: `../../../006-unified-refactor-research/unified-refactor-synthesis.md` (Idea 5 §3, §2.3, §4, §8.1, §11 Q2, §10)
- **Master plan + gate model**: `../../spec.md`
- **Upstream corpus**: `../001-*` · **Downstream controller**: `../003-*`
