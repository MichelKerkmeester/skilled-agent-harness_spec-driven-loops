---
title: "Implementation Plan: Calibration Held-Out Routing Corpus (Idea 5, step 1)"
description: "Build approach for the sealed, privacy-reviewed, per-hub/per-risk-slice held-out routing corpus: the CalibrationCorpusV1 contract, the intent-derived labeling protocol, risk-slice taxonomy, coverage sampling, the offline and live gates, retention/privacy governance, and the hash-pinned corpus identity bound to an EffectivePolicy generation. Design/authoring only — the shared scorer router-replay.cjs and all live routing artifacts are read-only."
trigger_phrases:
  - "calibration corpus build plan"
  - "held-out routing corpus approach"
  - "corpus identity offline gate plan"
importance_tier: "critical"
contextType: "implementation"
status: "shadow-partial"
---
# Implementation Plan: Calibration Held-Out Routing Corpus (Idea 5, step 1)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Deliverable kind** | Design/authoring artifact (contract + protocol + governance spec), not runtime code |
| **Consumes (read-only)** | `effectivePolicyHash` from phases `000`/`001`; destination identity tuple + roles (synthesis §2.2); the closed algebra `RouteDecisionV1` (synthesis §2.3) |
| **Never touches** | The shared scorer `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs` and its route-gold fixtures (synthesis §8.2, §10) |
| **Produces** | `CalibrationCorpusV1` contract, labeling protocol, risk-slice taxonomy, coverage table, offline/live gate specs, retention/privacy governance, corpus-identity/versioning model |
| **Downstream binders** | `005/002` (rank-vs-calibrated contract), `005/003` (selective-classification controller), `006/*` (per-hub canary, Stage 4) |

### Overview

The corpus is the validation substrate for calibrated auto-routing. The synthesis is explicit that advisor rank is evidence, never a probability, and that a certificate tied to the policy/risk slice is required before any auto-route may treat rank as calibrated (synthesis §2.3, §3 Idea 5 row, §8.1) — and equally explicit that this certificate is impossible today because the held-out corpus does not exist (synthesis §11 open-q 2). The build therefore proceeds contract-first: define the sealed artifact and its identity, then the labeling protocol that keeps gold independent of the system under measurement, then the coverage that makes per-slice calibration estimable, then the two gates (offline deterministic replay + privacy-filtered live shadow) that a certificate must clear, then the governance and reversibility that let the corpus be sealed, pinned, and rolled back safely.

The degeneracy proof shapes the scope: at N=1 "there is nothing to calibrate against one candidate" (synthesis §5.1), so `mcp-code-mode` receives an explicit no-slice record, and the corpus is populated only where `candidateCount > 1` (synthesis §5.3 table).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] `effectivePolicyHash` identity model from `000`/`001` is available to pin against (synthesis §2.1).
- [x] Destination identity tuple, roles, and the closed algebra are fixed inputs (synthesis §2.2, §2.3).
- [x] Non-negotiable constraints restated as corpus invariants (synthesis §10).

### Definition of Done
- [x] `CalibrationCorpusV1` contract, labeling protocol, risk-slice taxonomy, coverage table, offline/live gates, governance, and identity model are authored.
- [x] Every claim tracing to the design cites a synthesis section.
- [x] `spec.md` requirements REQ-001..REQ-010 each map to a plan step and a task.
- [ ] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` is green.
  - Evidence: orchestrator-owned by explicit instruction; not run in this phase.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Contract-first specification. The corpus is an **immutable, content-addressed artifact** in the same identity family as `EffectivePolicy` (synthesis §2.1): `corpusId = hash(records, effectivePolicyHash, schema, generation)`. It is a *held-out validation set*, deliberately separate from the overlay's training traffic (Idea 2, phase `007`) so that calibration is measured on data the router never learned from.

### Key Components (all specified, none executed this phase)

- **`CalibrationCorpusV1`** — sealed record set: per-record `{ requestFacts, intentGold, hub, riskSlice, expectedDecisionBranch, labelProvenance, authorAttestation }`, plus header `{ corpusHash, effectivePolicyHash, schema, generation, privacySignoff }`.
- **Labeling protocol** — gold is intent-derived and authored blind to router output; a leakage-rejecting validator forbids any label reconciled against live routing (REQ-002).
- **Risk-slice taxonomy** — slices over destination `role ∈ {actor, evidence, transport, judgment}` and mutation scope (`mutatesWorkspace`), plus `selectionKind` family (synthesis §2.2, §2.3). Higher-risk slices carry stricter certificate tolerance.
- **Coverage sampler spec** — minimum record counts per `(hub, slice)`, branch coverage over `{route, clarify, defer, reject}`; zero-signal → `defer(no-match)` with no default union (synthesis §2.3, §10).
- **Offline gate** — deterministic replay computing per-slice calibration (reliability/ECE) with route-gold green and the scorer byte-identical (synthesis §8.2, §10).
- **Live gate** — privacy-filtered, evidence-only shadow measurement confirming offline calibration holds on held-out live traffic (synthesis §11 open-q 7).
- **Governance + identity** — sanitization, independent privacy sign-off, retention windows, and a fenced-CAS corpus pointer with prior-generation retention (synthesis §9).

### Data Flow (design intent, not runtime activation)

1. Independent authors write intent-derived gold records, blind to router output → `labelProvenance = intent-derived` (REQ-002).
2. Each record is assigned exactly one `(hub, riskSlice)` cell from the taxonomy (REQ-003).
3. Coverage is checked against per-slice minimums and algebra-branch coverage (REQ-004).
4. Records are sanitized and pass independent privacy review → `privacySignoff` recorded (REQ-008).
5. The record set is sealed and hashed, pinned to the current `effectivePolicyHash` → `corpusId` minted (REQ-001).
6. Downstream (`005/002`, `005/003`) runs the offline gate against the compiled policy, then the live gate, and binds any certificate to this `corpusId` (REQ-005, REQ-006, REQ-007).
7. A new sample mints a new generation via fenced CAS on the corpus pointer; the prior generation is retained for rollback (synthesis §9).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Contract + identity
- [x] Specify `CalibrationCorpusV1` record + header schema and sealing rules (REQ-001).
- [x] Define `corpusId = hash(records, effectivePolicyHash, schema, generation)` and the pinning rule to a specific `EffectivePolicy` generation (synthesis §2.1).
  - Evidence: the executable content address retains those fields and now binds every remaining admission-relevant corpus field except the two self-referential id fields.
- [x] State the fenced-CAS corpus pointer + prior-generation retention for reversibility (synthesis §9).

### Phase 2: Labeling protocol + risk slices
- [x] Author the intent-derived labeling protocol and the `labelProvenance`/attestation fields (REQ-002).
- [x] Specify the leakage-rejecting validator (gold never sourced from or reconciled against router output).
- [x] Define the risk-slice taxonomy over role + mutation scope + `selectionKind`, with per-slice tolerance ordering (REQ-003, synthesis §2.2, §2.3).
  - Evidence: the validator derives the strictest target and requires the taxonomy's fixed tolerance; misclassification and loose-tolerance fixtures reject separately.

### Phase 3: Coverage requirements
- [x] Author per-hub, per-slice minimum record counts with statistical rationale (REQ-004).
- [x] Enumerate algebra-branch coverage over `{route, clarify, defer, reject}`; encode zero-signal → `defer(no-match)` with no default union (synthesis §2.3, §10).
  - Evidence: a frozen external topology requires all four actions and each hub's reachable positive selection kinds independently of corpus declarations.
- [x] Author the explicit `mcp-code-mode` no-slice record (nothing to calibrate at N=1) (REQ-009, synthesis §5.1).

### Phase 4: Gates
- [x] Specify the offline gate: deterministic replay, per-slice calibration metric + tolerance, route-gold green, scorer byte-identical (REQ-005, synthesis §8.2, §10).
  - Evidence: the harness runs the real typed/compatibility projectors, rejects a corrupted observation through `evaluateRouteGold`, compares canonical bytes across three runs, and re-hashes all three protected scorer inputs.
- [x] Specify the live gate: privacy-filtered, evidence-only shadow, offline/live divergence tolerance (REQ-007, synthesis §11 open-q 7).
- [x] Specify the downstream binding rule: no certificate/canary without a matching `corpusId` (REQ-006, synthesis §9, §11 open-q 2).

### Phase 5: Governance + verification
- [x] Author retention/privacy governance: sanitization, independent sign-off, retention windows, deletion handling (REQ-008, synthesis §11 open-q 7).
- [x] Restate the non-negotiable invariants as hard-block corpus rules (REQ-010, synthesis §10).
- [ ] Run strict spec validation and reconcile spec/plan/tasks cross-references.
  - Evidence: cross-references reconciled; strict validation intentionally deferred to the orchestrator.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Check | Scope | How |
|-------|-------|-----|
| Requirement coverage | REQ-001..REQ-010 each map to a plan step + task | Cross-reference `spec.md` ↔ `plan.md` ↔ `tasks.md` |
| Design fidelity | Every design claim cites a synthesis section | Grep for `synthesis §` anchors against the cited sections |
| Constraint integrity | Scorer untouched; authority destination-local; no over-emission; reversible/gated | Confirm no step edits `router-replay.cjs`, config, registry, or a skill |
| Strict validation | Level-2 spec-core doc set parses and is complete | `validate.sh <this-folder> --strict` (exit 0) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `effectivePolicyHash` identity (phases `000`/`001`) | Internal | Pending upstream | Corpus cannot be pinned to a policy generation (REQ-001) |
| Closed algebra `RouteDecisionV1` (synthesis §2.3) | Design | Fixed | Coverage branches undefined |
| Destination identity tuple + roles (synthesis §2.2) | Design | Fixed | Risk slices undefinable |
| Shared scorer `router-replay.cjs` | External (read-only) | Frozen | N/A — must remain untouched (synthesis §8.2, §10) |
| Independent privacy reviewer | Process | Required to seal | A generation cannot be sealed without sign-off (REQ-008) |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a sealed corpus generation is found to leak router output into gold, fails privacy review post-seal, or is pinned to a superseded `effectivePolicyHash`.
- **Procedure**: fenced CAS the corpus pointer back to the byte-identical prior generation; invalidate any certificate bound to the retracted `corpusId` (synthesis §9). Rollback invalidates future calibrated-auto-route eligibility but **cannot** undo an already-COMMITted destination effect — authority is destination-local (synthesis §9, §10).
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Contract+Identity) ──> Phase 2 (Labeling+Slices) ──> Phase 3 (Coverage) ──> Phase 4 (Gates) ──> Phase 5 (Governance+Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 1 Contract+Identity | `000`/`001` policy hash | 2, 3, 4 |
| 2 Labeling+Slices | 1 | 3, 4 |
| 3 Coverage | 2 | 4 |
| 4 Gates | 1, 2, 3 | `005/002`, `005/003`, `006/*` |
| 5 Governance+Verify | 1–4 | Seal (corpus id mint) |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-seal Checklist
- [ ] Prior corpus generation retained and byte-verified before the pointer swap (synthesis §9).
  - Evidence: no activation pointer swap occurs in this shadow phase.
- [x] Privacy sign-off recorded in the header (REQ-008).
- [ ] `effectivePolicyHash` pin matches the active policy generation (REQ-001).
  - Evidence: representative corpora bind to hash-verified source snapshots; compiler-produced activation identity remains Stage 4.

### Reversal Procedure
1. Fenced CAS the corpus pointer to the retained prior generation (token-locked, preimage-checked) (synthesis §9).
2. Mark the retracted `corpusId` invalid in the downstream binding registry (REQ-006).
3. Confirm no certificate references the retracted id; block calibrated auto-route until a valid corpus id is re-pinned.
4. Note: post-COMMIT destination effects are not reversible here — recovery is destination-owned (synthesis §9, §10).
<!-- /ANCHOR:enhanced-rollback -->
