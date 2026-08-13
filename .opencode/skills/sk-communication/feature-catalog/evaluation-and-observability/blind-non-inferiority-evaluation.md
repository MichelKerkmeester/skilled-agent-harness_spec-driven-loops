---
title: "Blind non-inferiority evaluation"
description: "Builds masked paired-review evidence and gates each presentation tier on fidelity vetoes plus pre-registered human non-inferiority results."
trigger_phrases:
  - "Blind non-inferiority evaluation"
  - "masked paired review"
  - "evaluateReleaseGate"
  - "human projection quality gate"
version: 1.0.0.0
---

# Blind non-inferiority evaluation (evaluateReleaseGate)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Builds masked paired-review evidence and gates each presentation tier on fidelity vetoes plus pre-registered human non-inferiority results.

The evaluation package keeps experimental design frozen before scoring, separates reviewer-safe packets from trusted identity mappings, and prevents diagnostic proxy evidence from authorizing a release.

---

## 2. HOW IT WORKS

Operators pre-register evaluation strata, presentation tiers, margins, powered sample plans, reviewer assignments, and stop rules. The blinding surface uses a seed to randomize candidate/reference order, exposes only opaque A/B artifact tokens to reviewers, and keeps the unblinding record separate. Integrity checks reject packets that contain provider, model, prompt, runtime, tier, or artifact identities.

After trusted unblinding, the gate applies absolute fidelity vetoes and computes paired two-sided 95 percent confidence intervals for every registered quality dimension within each stratum. A dimension passes only when its lower bound clears the frozen negative margin at the required sample size; inferior, underpowered, missing, or cap-inconclusive evidence fails or remains inconclusive. Tiers and strata are never pooled, diagnostic metrics never affect approval, and LLM-proxy evidence is marked provisional.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/sk-communication/cli-communication-projection/src/evaluation/preregistration.ts` | Shared | Freezes strata, margins, sample plans, reviewers, and stop rules. |
| `.opencode/skills/sk-communication/cli-communication-projection/src/evaluation/blinding.ts` | Handler | Builds identity-free review packets and trusted order records. |
| `.opencode/skills/sk-communication/cli-communication-projection/src/evaluation/noninferiority.ts` | Shared | Computes paired confidence intervals and dimension decisions. |
| `.opencode/skills/sk-communication/cli-communication-projection/src/evaluation/gate.ts` | Handler | Combines fidelity vetoes and per-stratum quality decisions. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/sk-communication/cli-communication-projection/test/evaluation/blinding.test.ts` | Unit | Verifies masking, deterministic randomization, and identity exclusion. |
| `.opencode/skills/sk-communication/cli-communication-projection/test/evaluation/noninferiority.test.ts` | Unit | Covers paired statistics, margins, and sample boundaries. |
| `.opencode/skills/sk-communication/cli-communication-projection/test/evaluation/gate.test.ts` | Unit | Covers fidelity vetoes, tier isolation, provenance, and approval. |
| `.opencode/skills/sk-communication/cli-communication-projection/test/evaluation/integration.test.ts` | Integration | Exercises the evaluation pipeline across registered strata. |

---

## 4. SOURCE METADATA

- Group: Evaluation And Observability
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `evaluation-and-observability/blind-non-inferiority-evaluation.md`

Related references:
- [content-free-observability.md](content-free-observability.md) — Operational metrics kept outside release-authorizing reviewer evidence
