---
title: "audit: Manual Testing Playbook"
description: "Lean manual scenarios for verifying design audit scoring, accessibility/performance review, and anti-slop hardening behavior."
version: 1.0.0.3
---

# audit: Manual Testing Playbook

> **EXECUTION POLICY**: Run scenarios against the live skill and on-disk references. Acceptable verdicts are PASS, PARTIAL, FAIL, or SKIP with a concrete blocker.

## 1. OVERVIEW

| ID | Scenario | Intent | File |
| --- | --- | --- | --- |
| AUDIT-SCORE-001 | Findings-first `/20` audit report | AUDIT_CONTRACT | [`01--score/002-findings-first-score.md`](01--score/002-findings-first-score.md) |
| AUDIT-SCORE-002 | Transform remediation routing | TRANSFORM_REMEDIATION | [`01--score/003-transform-remediation-routing.md`](01--score/003-transform-remediation-routing.md) |
| AUDIT-SCORE-003 | Evidence capture and labeling | EVIDENCE_CAPTURE | [`01--score/004-evidence-capture.md`](01--score/004-evidence-capture.md) |
| AUDIT-SCORE-004 | Audit report template fill-in | AUDIT_CONTRACT | [`01--score/005-audit-report-template.md`](01--score/005-audit-report-template.md) |
| AUDIT-A11Y-001 | Accessibility and performance gate | ACCESSIBILITY_PERFORMANCE | [`02--a11y-performance/006-accessibility-performance-gate.md`](02--a11y-performance/006-accessibility-performance-gate.md) |
| AUDIT-A11Y-002 | Accessibility quick-fix references | ACCESSIBILITY_PERFORMANCE | [`02--a11y-performance/007-a11y-quick-fixes.md`](02--a11y-performance/007-a11y-quick-fixes.md) |
| AUDIT-SLOP-001 | Anti-slop and production hardening | ANTI_PATTERNS_PRODUCTION | [`03--slop-hardening/008-anti-slop-production-hardening.md`](03--slop-hardening/008-anti-slop-production-hardening.md) |
| AUDIT-SLOP-002 | AI fingerprint tell detection | ANTI_PATTERNS_PRODUCTION | [`03--slop-hardening/001-ai-fingerprint-tells.md`](03--slop-hardening/001-ai-fingerprint-tells.md) |
| AUDIT-SLOP-003 | Hardening edge-case matrix | CRITIQUE_HARDENING | [`03--slop-hardening/009-hardening-edge-cases.md`](03--slop-hardening/009-hardening-edge-cases.md) |

## 2. GLOBAL PRECONDITIONS

1. The repository root is the working directory.
2. `SKILL.md` and all `references/` files under `audit` resolve.
3. Each scenario names its own `<TARGET>` slot. Supply one concrete artifact per scenario: a source file path, a rendered URL, a screenshot, or a design plan.

## 2a. SKIP RULE

A scenario is SKIP only when no concrete `<TARGET>` artifact can be supplied for it. Record SKIP with the blocker "no target artifact supplied" rather than inventing UI, rendered, or measured evidence. A scenario with a supplied target may not be skipped.

## 3. EVIDENCE REQUIREMENTS

- Exact prompt used.
- Target artifact and evidence available.
- Resources loaded.
- Findings, score, owner mapping, caveats, and final verdict.

## 4. RELEASE READINESS

Release is ready when all scenarios PASS or are SKIP only under the SKIP RULE (no target artifact supplied), and no scenario omits severity, score, evidence, or owner mapping.
