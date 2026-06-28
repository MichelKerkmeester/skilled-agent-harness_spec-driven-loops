---
title: "D1-R11 — Missing Codex 'theater / meta-criticism copy' tell"
description: "Add the Codex theater/meta-criticism tell to ai_fingerprint_tells.md with a narrow static regex (advisory) plus a positive/negative fixture."
trigger_phrases:
  - "d1-r11 codex theater tell"
  - "codex theater tell design build"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-scaffold | v1.0 -->
# D1-R11 — Missing Codex "theater / meta-criticism copy" tell

## 1. OBJECTIVE
Add the Codex "theater / meta-criticism copy" tell to the audit fingerprint catalog with a narrow advisory static pattern and paired fixtures, closing a known per-model gap.

## 2. WHY
The Codex theater/meta-criticism copy tell is missing from the catalog, so this common Codex slop pattern is not flagged.

## 3. TARGET & CLASS
- **Target file(s):** `design-audit/references/ai_fingerprint_tells.md`
- **Severity:** P2
- **Enforcement class:** hybrid
- **Dimension:** D1 — Residual Craft

## 4. BUILD OUTLINE
- Add the Codex tell to `design-audit/references/ai_fingerprint_tells.md`.
- Use a narrow static pattern `\b(\w+)\s+theater\b`, marked advisory.
- Add a positive and a negative fixture.

## 5. ACCEPTANCE
- Fixture check: the tell fires on the positive fixture and not on the negative (deterministic); flagging it as real slop stays advisory.

## 6. EVIDENCE
- `skill/SKILL.src.md:108` — impeccable's record of the Codex theater/meta-criticism tell.
- Source: `research/research.md` §4 (D1-R11)

## 7. STATUS
planned — plan.md / tasks.md / checklist.md authored when executed.
