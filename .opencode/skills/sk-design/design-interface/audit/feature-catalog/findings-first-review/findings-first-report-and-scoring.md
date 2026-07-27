---
title: "Findings-First Report And Scoring"
description: "Current-state reference for design-audit's severity model, five-dimension /20 score, accessibility coverage matrix, and findings schema."
trigger_phrases:
  - "findings-first report and scoring"
  - "design audit severity model"
  - "five-dimension design score"
  - "accessibility coverage matrix"
version: 1.0.0.0
---

# Findings-First Report And Scoring

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

`design-audit` produces findings before scores: concrete, evidence-backed findings ordered by severity come first, and the five-dimension `/20` score is a summary of those findings, never a replacement for them.

The output contract is aligned in spirit with `sk-code`'s code-review mode: evidence-backed, severity-ordered, and actionable.

---

## 2. HOW IT WORKS

Findings are ranked P0 (Critical, prevents task completion or blocks access), P1 (High, WCAG AA violation or systemic drift), P2 (Medium, annoyance with a workaround), or P3 (Polish). The test for an ambiguous case is: would a real user fail, contact support, or abandon? If yes, it is at least P1. Each finding follows a fixed schema: Observation (neutral, factual), Evidence, Category, Accessibility coverage, Problem, Fix, and Owner.

### Five-Dimension Score And Coverage Matrix

Five dimensions score 0-4 each: Accessibility, Performance, Responsive Design, Theming, and Anti-Patterns, summing to a `/20` total with rating bands from `18-20` Excellent down to `0-5` Critical. Any accessibility, WCAG, accessible, release-ready, or production-ready claim carries a coverage matrix across seven layers (keyboard, screen-reader, zoom-reflow, contrast, reduced-motion, assistive-tech, user-testing), each stated as `confirmed`, `inferred`, `blocked`, or `not-assessed`; any `not-assessed` layer blocks those claims.

### Output Order

The output always runs: findings by severity, the Audit Health Score table, the anti-pattern verdict, what is working, recommended next actions by owner, then evidence limits and residual risks.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/sk-design/design-audit/references/audit-contract.md` | Shared | Defines the severity model, five-dimension score, accessibility coverage matrix, findings schema, and output order. |
| `.opencode/skills/sk-design/design-audit/assets/audit-report-template.md` | Shared | Fill-in findings-first skeleton implementing this contract. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/sk-design/design-audit/manual-testing-playbook/manual-testing-playbook.md` | Manual playbook | Exercises findings-first scoring scenarios against the live mode. |

---

## 4. SOURCE METADATA

- Group: Findings-First Review
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `findings-first-review/findings-first-report-and-scoring.md`

Related references:
- [register-gated-severity.md](../findings-first-review/register-gated-severity.md) - Register call resolved before dimensions are scored.
- [../ai-tell-catalog/ai-fingerprint-tell-catalog.md](../ai-tell-catalog/ai-fingerprint-tell-catalog.md) - Tell catalog that feeds Anti-Patterns findings.
