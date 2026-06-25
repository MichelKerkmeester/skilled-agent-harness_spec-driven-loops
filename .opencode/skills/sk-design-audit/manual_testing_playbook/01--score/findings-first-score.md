---
title: Findings-First Score Scenario
description: Manual scenario verifying severity-ordered findings and the five-dimension /20 design audit score.
trigger_phrases:
  - "test design audit score"
  - "test findings first audit"
  - "audit score scenario"
importance_tier: normal
contextType: reference
version: 1.0.0.0
---

# AUDIT-SCORE-001 | Findings-First Score

## Prompt

`Audit this dashboard UI for release readiness and give me a design quality score.`

## Expected Process

1. Route to `sk-design-audit`.
2. Load `references/audit_contract.md`.
3. Produce P0-P3 findings before summary.
4. Score accessibility, performance, responsive design, theming, and anti-patterns out of 4 each.

## Pass Criteria

- Findings are severity ordered.
- Every finding has evidence, impact, recommendation, and owner.
- Score totals to `/20` with a rating band.
- Evidence gaps are named instead of hidden.
