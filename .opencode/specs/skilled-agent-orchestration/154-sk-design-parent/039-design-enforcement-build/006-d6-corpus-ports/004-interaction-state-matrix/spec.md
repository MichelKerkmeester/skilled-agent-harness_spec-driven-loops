---
title: "D6-R4 — INTERACTION STATE MATRIX proof lane"
description: "Add a conditional states/events/transitions/forbidden/guards/uiByState/recovery/a11y/reducedMotion field to the context loading contract + proof card + interface preflight card."
trigger_phrases:
  - "d6-r4 interaction state matrix"
  - "interaction state design build"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-scaffold | v1.0 -->
# D6-R4 — INTERACTION STATE MATRIX proof lane

## 1. OBJECTIVE
Add a conditional `INTERACTION STATE MATRIX` proof lane that makes stateful UI work prove its states, transitions, guards, recovery, and reduced-motion handling.

## 2. WHY
designer-skills-main's state-machine skill supplies an explicit modeling shape (states/events/transitions/forbidden/guards) that sk-design covers only as prose. Porting the *shape* turns interaction-state coverage into a checkable conditional field rather than implicit craft.

## 3. TARGET & CLASS
- **Target file(s):** `.opencode/skills/sk-design/shared/context_loading_contract.md`; `.opencode/skills/sk-design/shared/assets/proof_of_application_card.md`; `.opencode/skills/sk-design/design-interface/assets/interface_preflight_card.md`
- **Severity:** P1
- **Enforcement class:** hybrid
- **Dimension:** D6 — Corpus Ports
- **Feeds:** D1

## 4. BUILD OUTLINE
- Add the conditional matrix field (states/events/transitions/forbidden/guards/uiByState/recovery/a11y/reducedMotion) to the contract.
- Mirror the field in the proof card and the interface preflight card.
- Add state/async routing aliases that trigger the lane.

## 5. ACCEPTANCE
- A stateful-UI prompt triggers the lane; presence of the matrix is enforceable; field quality remains advisory (hybrid).

## 6. EVIDENCE
- `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/interaction-design/skills/state-machine/SKILL.md:24` — "Modeling Approach" defining the state-matrix shape.
- Source: `research/research.md` §9 (D6-R4)

## 7. STATUS
planned — plan.md / tasks.md / checklist.md authored when executed.
