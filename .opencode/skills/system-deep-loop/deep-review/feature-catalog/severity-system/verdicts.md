---
title: "Verdicts"
description: "Maps active findings and gate status into FAIL or CONDITIONAL or PASS."
trigger_phrases:
  - "verdicts"
  - "FAIL CONDITIONAL PASS"
  - "review verdict"
  - "release blocker verdict"
  - "post-verdict routing"
version: 1.11.0.7
---

# Verdicts

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Maps active findings and gate status into FAIL or CONDITIONAL or PASS.

Verdicts are the final decision surface for the review loop. They tell downstream workflows whether the review found release blockers, required fixes, or only advisory items.

## 2. HOW IT WORKS

The verdict contract is stable across the skill. FAIL applies when active P0 remains or any required gate fails. CONDITIONAL applies when no P0 remains but at least one active P1 is still open. PASS applies only when active P0 and P1 are both zero, with `hasAdvisories=true` when P2 remains.

Verdicts also carry workflow routing. FAIL and CONDITIONAL both point to `/speckit:plan`, while PASS points to `/create:changelog`. The same contract appears in the convergence reference, state-format summary, review-mode contract, quick reference, and final report structure.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `SKILL.md` | Skill contract | Summarizes PASS, CONDITIONAL, and FAIL conditions for review mode. |
| `references/convergence/convergence.md` | Protocol | Defines verdict determination and post-verdict routing. |
| `references/state/state-format.md` | Schema | Defines verdict rules in JSONL and review-report semantics. |
| `assets/review-mode-contract.yaml` | Contract | Declares the canonical verdict list, conditions, and next commands. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual-testing-playbook/synthesis-save-and-guardrails/review-verdict-determines-post-review-workflow.md` | Manual scenario | Verifies verdict routing after synthesis. |
| `manual-testing-playbook/synthesis-save-and-guardrails/review-report-synthesis-has-all-9-sections.md` | Manual scenario | Confirms verdict data appears in the report contract. |

---

## 4. SOURCE METADATA

- Group: Severity system
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `severity-system/verdicts.md`
- Primary sources: `SKILL.md`, `references/convergence/convergence.md`, `references/state/state-format.md`, `assets/review-mode-contract.yaml`
Related references:
- [claim-adjudication.md](../../feature-catalog/severity-system/claim-adjudication.md) — Claim adjudication
- [quality-gates.md](../../feature-catalog/severity-system/quality-gates.md) — Quality gates
