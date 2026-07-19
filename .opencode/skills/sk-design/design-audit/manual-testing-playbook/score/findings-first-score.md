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
expected_intent: AUDIT_CONTRACT
expected_resources:
  - references/corpus-map.md
  - ../shared/register.md
  - references/audit-contract.md
  - assets/audit-report-template.md
  - ../shared/sk-code-handoff.md
---

**Exact prompt**

```
Audit this dashboard for release readiness and give me a design quality score with severity-ranked P0-P1 findings.
```

# AUDIT-SCORE-001 | Findings-First Score

## Target

Supply one concrete dashboard or app UI artifact in the `<TARGET>` slot: a source file path, a rendered URL, a screenshot, or a design plan. If no UI target is available, record SKIP with the blocker "no target artifact supplied"; do not invent UI evidence.

## Prompt

`Audit <TARGET> for release readiness and give me a design quality score.`

## Expected Process

1. Route to `audit`.
2. Load `references/audit-contract.md`.
3. Produce P0-P3 findings before summary.
4. Score accessibility, performance, responsive design, theming, and anti-patterns out of 4 each.

## Pass Criteria

- Findings are severity ordered.
- Every finding has evidence, impact, recommendation, and owner.
- Score totals to `/20` with a rating band.
- Evidence gaps are named instead of hidden.
