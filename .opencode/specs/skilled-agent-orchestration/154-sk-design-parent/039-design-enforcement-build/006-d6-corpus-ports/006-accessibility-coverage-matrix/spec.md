---
title: "D6-R6 — ACCESSIBILITY COVERAGE matrix"
description: "Split the single a11y dimension into a layered keyboard/screenReader/zoom/contrast/reducedMotion/AT/userTesting matrix in the contract + audit_contract.md, gating WCAG/ready claims."
trigger_phrases:
  - "d6-r6 accessibility coverage matrix"
  - "accessibility coverage design build"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-scaffold | v1.0 -->
# D6-R6 — ACCESSIBILITY COVERAGE matrix

## 1. OBJECTIVE
Replace the single a11y dimension under AUDIT EVIDENCE with a layered coverage matrix, each layer marked confirmed/inferred/blocked/not-assessed, gating WCAG and ready claims.

## 2. WHY
designer-skills-main's accessibility-test-plan defines a test matrix (keyboard, screen reader, zoom, contrast, reduced motion, AT, user testing). sk-design's audit collapses a11y into one field, so a ready-claim can pass without per-layer evidence.

## 3. TARGET & CLASS
- **Target file(s):** `.opencode/skills/sk-design/shared/context_loading_contract.md`; `.opencode/skills/sk-design/design-audit/references/audit_contract.md`
- **Severity:** P1
- **Enforcement class:** hybrid
- **Dimension:** D6 — Corpus Ports
- **Feeds:** D4

## 4. BUILD OUTLINE
- Add the a11y sub-object (keyboard/screenReader/zoom/contrast/reducedMotion/AT/userTesting) with a per-layer status enum.
- Wire it into the audit contract so a WCAG/ready claim requires resolved layers.
- Mark unresolved layers as blocking for a ready-claim, advisory for quality.

## 5. ACCEPTANCE
- An audit asserting WCAG/ready without a populated matrix fails the gate; per-layer status is enforceable, judgment of adequacy stays advisory (hybrid).

## 6. EVIDENCE
- `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/prototyping-testing/skills/accessibility-test-plan/SKILL.md:31` — "Test Matrix" defining the layered a11y coverage shape.
- Source: `research/research.md` §9 (D6-R6)

## 7. STATUS
planned — plan.md / tasks.md / checklist.md authored when executed.
