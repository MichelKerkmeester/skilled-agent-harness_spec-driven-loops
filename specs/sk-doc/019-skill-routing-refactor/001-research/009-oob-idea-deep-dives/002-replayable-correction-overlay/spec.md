---
title: "Feature Specification: Deep-Dive — Replayable Correction Overlay"
description: "Five-iteration SOL xhigh-fast deep-research lineage on a two-plane learning system for routing: an immutable content-addressed base policy served in production, plus a hash-addressed candidate overlay learned from correction telemetry in a separate plane, gated by shadow evaluation and held-out validation, promoted only by explicit governance, and rolled back by selecting a prior overlay hash — so routing can adapt without ever making offline replay irreproducible."
trigger_phrases:
  - "replayable correction overlay deep dive"
  - "two-plane routing learning"
  - "hash-addressed routing overlay"
importance_tier: "important"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: templates/spec.md -->
<!-- SPECKIT_LEVEL: 2 -->

# Deep-Dive: Replayable Correction Overlay

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | Important |
| **Status** | Research complete; overlay implementation and empirical efficacy remain unproven |
| **Created** | 2026-07-18 |
| **Packet** | `002-replayable-correction-overlay` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Routing cannot safely learn by mutating serving rules online because mutable policy destroys deterministic replay. Existing correction telemetry is deliberately prompt-free, so it can support aggregate calibration but cannot become per-prompt route gold or reconstruct the original request.

### Purpose

Define an end-to-end two-plane design in which immutable base and overlay artifacts are selected by a separately governed pointer, every decision binds its effective policy identity, and candidate learning remains shadow-only until explicit promotion gates pass.

### Research Outcome

The five-iteration run selected immutable policy semantics plus mutable selection. Content-addressed base, candidate, and promoted artifacts bind policy and evidence identities; a compare-and-swap pointer selects one `(basePolicyDigest, overlayHash | null, generation)` tuple. Decision replay starts from a packet-safe normalized pre-fusion feature artifact, while end-to-end extraction replay requires a separate consented, privacy-reviewed fixture corpus. The retained `presentation.md` records the full synthesis and explicitly states that no overlay store, verifier, fixtures, privacy ledger, monitor, or empirical gain has been built or proven.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Five-iteration research on overlay schemas, replay boundaries, promotion and rollback governance, curated fixtures, and guardrails.
- Explicit evaluation of advisor integration, deterministic benchmark replay, and document-only effectiveness.
- A retained operator-facing synthesis in `presentation.md`.

### Out of Scope

- Implementing the overlay store, schemas, verifier, fixtures, privacy ledger, monitor, or promotion system.
- Editing the shared scorer or telemetry implementation.
- Claiming any measured routing improvement or live promotion.

### Packet Artifacts

| File | Role |
|------|------|
| `spec.md` | Research charter, boundaries, and conclusions |
| `presentation.md` | Retained five-iteration synthesis |
| `plan.md`, `tasks.md`, `checklist.md` | Canonical planning and evidence surfaces |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Research Contract

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Define immutable base, candidate, promoted-overlay, and activation identities. | `presentation.md` describes three hashed artifacts and one generation-bearing compare-and-swap pointer. |
| REQ-002 | Separate decision replay from feature-extraction replay. | The synthesis names the normalized decision-feature core and the separate consented prompt fixture lane. |
| REQ-003 | Define fail-closed promotion and rollback governance. | The synthesis records conjunctive replay, held-out, privacy, approval, activation, monitoring, and retained-tuple rollback gates. |
| REQ-004 | Preserve prompt-free correction privacy. | Operational corrections join through opaque decision identity and are not repurposed as prompt fixtures or gold. |

### P1 - Cross-Cutting Evaluation

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Evaluate system-skill-advisor integration. | `presentation.md` defines tuple pinning, shadow isolation, cache identity, and revocation checks. |
| REQ-006 | Evaluate benchmark integration. | `presentation.md` defines deterministic immutable replay without a live advisor. |
| REQ-007 | Evaluate standalone document-only routing. | `presentation.md` defines a resolved policy card and the `DOCUMENT_ONLY_UNATTESTED` boundary. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- The synthesis defines immutable artifact and activation-pointer boundaries without online policy mutation.
- Decision replay, extraction replay, correction telemetry, and document-only replay remain distinct evidence surfaces.
- Promotion and rollback are explicit, role-separated, and fail closed on missing or invalid evidence.
- The packet makes no implementation, production-data, live-promotion, or efficacy claim.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Curated consented fixture corpus | Prompt-free telemetry cannot validate extraction or become route gold | Keep extraction replay separate and block promotion without private held-out evidence |
| Risk | Mutable or mixed policy generations | Replay ceases to reproduce the served decision | Pin one verified tuple per request and fail on mixed identities |
| Risk | Sparse or concentrated corrections | Candidate overlays can overfit or amplify a small sample | Apply versioned sample, concentration, delta, and protected-slice gates |
| Risk | Documents imply activation or gain | Operators could mistake inspectability for attestation | Stamp document-only results unattested and state that empirical gain is unproven |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

- **Determinism**: repeated replay of one immutable policy tuple and fixture must produce byte-identical decision bodies.
- **Privacy**: prompt-free correction records must not become reconstructable prompts, fixtures, or public gold.
- **Governance**: proposer, approver, and activator roles remain separated; aggregate gain cannot override a blocking safety or parity gate.
- **Reversibility**: rollback selects a retained compatible tuple through the same compare-and-swap protocol.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Base-hash, overlay-hash, schema, generation, or privacy mismatch must fail closed or visibly defer.
- Revocation is the only allowed interruption after a request pins its tuple; the overlay result is discarded and verified base-only behavior resumes.
- Sparse, concentrated, nondeterministic, or protected-slice-regressing candidates cannot promote.
- Documents can reproduce a declared procedure but cannot attest activation, signatures, private gold, or real-world gain.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

The packet retains its declared Level 2 classification because it separates multiple replay and governance surfaces and requires explicit verification boundaries. No numeric score is reconstructed from the retained artifacts.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Who owns production promotion, rollback, retention, and privacy revocation?
- What curated fixture corpus and protected slices are sufficient for promotion evidence?
- Which versioned sample, concentration, gain, and delta thresholds should govern a real deployment?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Five-iteration synthesis**: `presentation.md`
- **Parent phase map**: `../spec.md`
- **Source lineage**: `../../002-default-mode-policy-research/research/lineages/sol-oob/`
