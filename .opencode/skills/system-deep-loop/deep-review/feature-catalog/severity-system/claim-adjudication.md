---
title: "Claim adjudication"
description: "Turns new P0 and P1 findings into typed, review-visible claims with evidence and downgrade rules."
trigger_phrases:
  - "claim adjudication"
  - "adjudicate finding claim"
  - "typed claim packet"
  - "claimAdjudicationGate"
  - "severity downgrade rules"
version: 1.11.0.7
---

# Claim adjudication

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Turns new P0 and P1 findings into typed, review-visible claims with evidence and downgrade rules.

Claim adjudication is the typed review packet that stops severe findings from floating through the loop as unstructured prose. It records what the finding claims, what evidence supports it, what counterevidence was sought, and whether the severity should stand.

## 2. HOW IT WORKS

Every new P0 or P1 must carry a typed packet embedded in the iteration file. Required fields include the finding ID, the single claim, evidence refs, counterevidence search, alternative explanation, final severity, confidence, downgrade trigger, and transition history when severity changes. The orchestrator parses this packet after evaluation and writes a `claim_adjudication` event into `deep-review-state.jsonl`.

Missing packets or missing required fields fail the adjudication step and trip `claimAdjudicationGate` on the next stop check. That means STOP can be vetoed even when the rest of the convergence math passes. Downgraded findings update the accepted final severity while preserving the original finding trail for the audit appendix.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/protocol/loop-protocol.md` | Protocol | Defines the claim-adjudication step, required packet fields, and stop-veto behavior. |
| `references/state/state-format.md` | Schema | Defines the typed packet schema, required fields, validation rules, and severity transitions. |
| `references/convergence/convergence.md` | Protocol | Includes `claimAdjudicationGate` in blocked-stop event payloads and legal-stop evaluation. |
| `assets/review-mode-contract.yaml` | Contract | Declares the claim-adjudication gate as part of the persisted gate-result bundle. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual-testing-playbook/iteration-execution-and-state-discipline/adversarial-self-check-runs-on-p0-findings.md` | Manual scenario | Covers the severe-finding validation path that precedes adjudication. |
| `manual-testing-playbook/convergence-and-recovery/blocked-stop-reducer-surfacing.md` | Manual scenario | Verifies failed stop attempts surface through blocked-stop state. |
| `manual-testing-playbook/synthesis-save-and-guardrails/finding-deduplication-and-registry.md` | Manual scenario | Verifies adjudicated severities survive into synthesis and registry output. |

---

## 4. SOURCE METADATA

- Group: Severity system
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `severity-system/claim-adjudication.md`
- Primary sources: `references/protocol/loop-protocol.md`, `references/state/state-format.md`, `references/convergence/convergence.md`, `assets/review-mode-contract.yaml`
Related references:
- [adversarial-self-check.md](../../feature-catalog/severity-system/adversarial-self-check.md) — Adversarial self-check
- [verdicts.md](verdicts.md) — Verdicts
