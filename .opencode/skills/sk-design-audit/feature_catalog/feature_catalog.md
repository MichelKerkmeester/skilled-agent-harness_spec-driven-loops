---
title: "sk-design-audit: Feature Catalog"
description: "Lean capability inventory for design QA, accessibility, performance, critique, hardening, anti-pattern detection, and scoring."
trigger_phrases:
  - "sk-design-audit feature catalog"
  - "design audit capabilities"
  - "design QA inventory"
last_updated: "2026-06-25"
version: 1.0.0.0
---

# sk-design-audit: Feature Catalog

## 1. OVERVIEW

| Capability | What it does | Detail file |
| --- | --- | --- |
| Audit contract | Provides P0-P3 severity, `/20` score, findings schema, and evidence rules | [`01--audit-contract/audit-contract.md`](01--audit-contract/audit-contract.md) |
| Accessibility and performance | Reviews WCAG, keyboard, focus, forms, motion jank, loading, and rendering performance | [`02--accessibility-performance/accessibility-performance.md`](02--accessibility-performance/accessibility-performance.md) |
| Critique and hardening | Reviews cognitive load, heuristics, personas, edge cases, copy, anti-slop, and production resilience | [`03--critique-hardening/critique-hardening.md`](03--critique-hardening/critique-hardening.md) |

## 2. CURRENT REALITY

The skill is a mode child for review and hardening. It reports findings, scores quality, and maps fixes to owners. It does not silently implement remediation during review-only work.

## 3. SOURCE ANCHORS

- `SKILL.md` for routing and boundaries.
- `references/audit_contract.md` for severity and scoring.
- `references/accessibility_performance.md` for measurable gates.
- `references/critique_hardening.md` and `references/anti_patterns_production.md` for holistic QA.
