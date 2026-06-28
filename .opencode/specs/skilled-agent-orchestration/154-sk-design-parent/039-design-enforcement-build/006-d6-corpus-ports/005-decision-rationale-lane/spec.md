---
title: "D6-R5 — DECISION RATIONALE proof lane"
description: "Add a conditional decision/optionsConsidered/evidenceSources/tradeoffs/validationPlan/sourceProofs field to the contract + proof card + proof_check.py."
trigger_phrases:
  - "d6-r5 decision rationale lane"
  - "decision rationale design build"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-scaffold | v1.0 -->
# D6-R5 — DECISION RATIONALE proof lane

## 1. OBJECTIVE
Add a conditional `DECISION RATIONALE` proof lane that forces direction/pattern-break/handoff work to record options, trade-offs, and a validation plan with cited sources.

## 2. WHY
designer-skills-main's design-rationale skill defines a structured rationale shape (decision + options + trade-offs + validation). sk-design has no machine-checkable lane for "why this direction," so significant design choices ship unjustified.

## 3. TARGET & CLASS
- **Target file(s):** `.opencode/skills/sk-design/shared/context_loading_contract.md`; `.opencode/skills/sk-design/shared/assets/proof_of_application_card.md`; `.opencode/skills/sk-design/shared/scripts/proof_check.py`
- **Severity:** P1
- **Enforcement class:** hybrid
- **Dimension:** D6 — Corpus Ports
- **Feeds:** D3

## 4. BUILD OUTLINE
- Add the conditional field (`decision`, `optionsConsidered[]`, `evidenceSources[]`, `tradeoffs[]`, `validationPlan`, `sourceProofs[]`) to the contract.
- Mirror it in the proof card and extend `proof_check.py` to verify presence on trigger.
- Trigger on direction / pattern-break / handoff intents.

## 5. ACCEPTANCE
- A direction-setting prompt triggers the lane; `proof_check.py` enforces field presence; rationale quality stays advisory (hybrid).

## 6. EVIDENCE
- `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/designer-toolkit/skills/design-rationale/SKILL.md:9` — "Rationale Structure" defining the options/trade-offs/validation shape.
- Source: `research/research.md` §9 (D6-R5)

## 7. STATUS
planned — plan.md / tasks.md / checklist.md authored when executed.
