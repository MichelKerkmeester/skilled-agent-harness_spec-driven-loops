---
title: Audit Evidence Worksheet
description: Fill-in worksheet carrying confirmed, inferred and not-assessed labels into findings, score caveats and owner handoff.
trigger_phrases:
  - "audit evidence worksheet"
  - "confirmed inferred not assessed"
  - "evidence label carry-through"
importance_tier: normal
contextType: reference
version: 1.0.0.0
---

# Audit Evidence Worksheet

A fill-in worksheet for carrying evidence labels through audit scoring, findings and owner handoff.

## 1. OVERVIEW

### Purpose

Carries evidence labels into the report so confirmed, inferred and not-assessed never blur together.

### Usage

Use this worksheet before scoring and before writing findings. Fill each table from the available source, rendered UI, design artifact and deterministic scan evidence.

---

## 2. TARGET

| Field | Value |
| --- | --- |
| Target | File, URL, screenshot or design artifact |
| Register | Brand or Product |
| Why this target | User request, release gate or sampled surface |
| Evidence status | confirmed, inferred or not-assessed |

## 3. EVIDENCE INVENTORY

| Evidence Type | Available | Source | Label |
| --- | --- | --- | --- |
| Source code | yes/no | path and line range | confirmed / not-assessed |
| Rendered UI | yes/no | browser, screenshot or capture | confirmed / inferred / not-assessed |
| Design artifact | yes/no | file, frame or image | confirmed / inferred / not-assessed |
| Deterministic scan | yes/no | command and exit code | confirmed / not-assessed |

## 4. DIMENSION COVERAGE

| Dimension | Evidence | Label | What Would Confirm |
| --- | --- | --- | --- |
| Accessibility |  | confirmed / inferred / not-assessed |  |
| Performance |  | confirmed / inferred / not-assessed |  |
| Responsive |  | confirmed / inferred / not-assessed |  |
| Theming |  | confirmed / inferred / not-assessed |  |
| Anti-Patterns |  | confirmed / inferred / not-assessed |  |

## 5. PROBE LEDGER

| Probe | Target | Result | Label | Impact If Failed |
| --- | --- | --- | --- | --- |
| Keyboard path |  | pass/fail/skip | confirmed / not-assessed |  |
| Focus visibility |  | pass/fail/skip | confirmed / inferred / not-assessed |  |
| Contrast check |  | pass/fail/skip | confirmed / inferred / not-assessed |  |
| Motion sensitivity |  | pass/fail/skip | confirmed / inferred / not-assessed |  |
| Responsive stress |  | pass/fail/skip | confirmed / inferred / not-assessed |  |
| Anti-pattern scan |  | pass/fail/skip | confirmed / inferred / not-assessed |  |

## 6. FINDING HANDOFF ROWS

| Finding | Severity | Label | Evidence | What Would Confirm | Owner |
| --- | --- | --- | --- | --- | --- |
|  | P0/P1/P2/P3 | confirmed / inferred |  |  | interface/foundations/motion/sk-code |

## 7. USE RULES

- Confirmed means the audit read real source, real render, real artifact or real command output.
- Inferred means the audit has partial visual or contextual evidence and names what would confirm it.
- Not-assessed means no evidence was available. It is not a pass.
- A finding keeps its label into severity, score and owner handoff.
- A score of 4 requires confirmed evidence or a clearly scoped not-assessed caveat for that dimension.
