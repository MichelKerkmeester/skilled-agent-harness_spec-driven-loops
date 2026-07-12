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
| AUDIT-SCORE-001 | Findings-first `/20` audit report | AUDIT_CONTRACT | [`score/findings-first-score.md`](score/findings_first_score.md) |
| AUDIT-SCORE-002 | Transform remediation routing | TRANSFORM_REMEDIATION | [`score/transform-remediation-routing.md`](score/transform_remediation_routing.md) |
| AUDIT-SCORE-003 | Evidence capture and labeling | EVIDENCE_CAPTURE | [`score/evidence-capture.md`](score/evidence_capture.md) |
| AUDIT-SCORE-004 | Audit report template fill-in | AUDIT_CONTRACT | [`score/audit-report-template.md`](score/audit_report_template.md) |
| AUDIT-A11Y-001 | Accessibility and performance gate | ACCESSIBILITY_PERFORMANCE | [`a11y-performance/accessibility-performance-gate.md`](a11y_performance/accessibility_performance_gate.md) |
| AUDIT-A11Y-002 | Accessibility quick-fix references | ACCESSIBILITY_PERFORMANCE | [`a11y-performance/a11y-quick-fixes.md`](a11y_performance/a11y_quick_fixes.md) |
| AUDIT-SLOP-001 | Anti-slop and production hardening | ANTI_PATTERNS_PRODUCTION | [`slop-hardening/anti-slop-production-hardening.md`](slop_hardening/anti_slop_production_hardening.md) |
| AUDIT-SLOP-002 | AI fingerprint tell detection | ANTI_PATTERNS_PRODUCTION | [`slop-hardening/ai-fingerprint-tells.md`](slop_hardening/ai_fingerprint_tells.md) |
| AUDIT-SLOP-003 | Hardening edge-case matrix | CRITIQUE_HARDENING | [`slop-hardening/hardening-edge-cases.md`](slop_hardening/hardening_edge_cases.md) |
| AUDIT-EVIDENCE-010 | Evidence worksheet label carry-through | EVIDENCE_CAPTURE | [`evidence-worksheet/evidence-worksheet-labels.md`](evidence_worksheet/evidence_worksheet_labels.md) |
| AUDIT-EVIDENCE-011 | Evidence-backed release-readiness gate | AUDIT_CONTRACT | [`evidence-worksheet/evidence-backed-release-readiness.md`](evidence_worksheet/evidence_backed_release_readiness.md) |
| AUDIT-PROCCARD-001 | Procedure-card selection proof | PROCEDURE_CARD_SELECTION | [`procedure-card-contract/card-selection-proof.md`](procedure_card_contract/card_selection_proof.md) |
| AUDIT-PROCCARD-002 | No-card fallback | PROCEDURE_CARD_FALLBACK | [`procedure-card-contract/no-card-fallback.md`](procedure_card_contract/no_card_fallback.md) |
| AUDIT-PROCCARD-003 | Direct fallback without subagents | DIRECT_FALLBACK | [`procedure-card-contract/direct-fallback-without-subagents.md`](procedure_card_contract/direct_fallback_without_subagents.md) |

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
- Procedure card or no-card fallback proof when procedure support is in scope.

## 4. RELEASE READINESS

Release is ready when all 14 scenarios PASS or are SKIP only under the SKIP RULE (no target artifact supplied), and no scenario omits severity, score, evidence, owner mapping, procedure-card proof, or the read-only direct-fallback boundary.
