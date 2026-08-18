---
title: 'Staged rollout'
description: 'A staged rollout policy that marks stages ready only on complete evidence.'
trigger_phrases:
  - 'Staged rollout'
  - 'rollout gate'
  - 'rollout.json'
  - 'evaluateRollout'
  - 'validateOperatorEvidence'
version: 1.0.0.0
---

# Staged rollout (evaluateRollout)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

A staged rollout policy that marks stages ready only on complete evidence.

Three stages each name a kill switch and a required evidence subset, and a stage is ready only when every required claim passes. Operator evidence must be schema-valid with app-relative artifact paths.

Current status: shipped.

---

## 2. HOW IT WORKS

### Stage Policy

The rollout file declares the read-only, protected-mutation, and optional-push stages. Each stage requires a unique id, a kill switch, and a non-empty evidence subset, and the evaluator marks the stage ready only when every required item reports PASS. FAIL, PENDING, and UNRUN all produce not ready.

### Operator Evidence

Operator evidence is validated against the schema, requiring PASS status, a parseable verification time, a reviewer, and an artifact path that is not absolute. The evaluator output feeds the evidence document, and the machine status reflects configuration validity rather than stage readiness.

---

## 3. SOURCE FILES

### Implementation

| File                        | Layer  | Role                                                               |
| --------------------------- | ------ | ------------------------------------------------------------------ |
| `release/rollout.json`      | Schema | Declares the three stages with kill switches and required evidence |
| `release/rollout-gate.mjs`  | Script | Implements `evaluateRollout` and `validateOperatorEvidence`        |
| `scripts/check-rollout.mjs` | Script | Evaluates stage readiness from evidence on the CLI                 |

### Validation And Tests

| File                          | Type   | Role                                           |
| ----------------------------- | ------ | ---------------------------------------------- |
| `tests/rollout-gate.test.mjs` | Vitest | Covers stage not-ready when evidence is absent |

---

## 4. SOURCE METADATA

- Group: release
- Canonical catalog source: `README.md`
- Feature file path: `release/staged-rollout.md`
- Current status: shipped

Related references:

- [numeric-thresholds.md](numeric-thresholds.md) - the threshold claims a stage depends on
- [whole-gate-runner.md](whole-gate-runner.md) - writes the evidence that feeds readiness
