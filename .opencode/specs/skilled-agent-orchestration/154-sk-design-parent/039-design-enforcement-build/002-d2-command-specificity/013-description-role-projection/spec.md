---
title: "D2-R13 — Descriptions treated as auto-trigger, but NL collapses to the hub"
description: "Add descriptionRole + autoTriggerEligible:false + hubKeywordProjection to command-metadata.json and prove a 4-lane replay (advisor→hub, hub→mode, direct-command→packet, generated-pin→parent)."
trigger_phrases:
  - "d2-r13 description role"
  - "description role design build"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-scaffold | v1.0 -->
# D2-R13 — Descriptions treated as auto-trigger, but NL collapses to the hub

## 1. OBJECTIVE
Define what command descriptions are for and prove how natural language actually routes through the surface.

## 2. WHY
Descriptions are treated as auto-trigger text, yet natural-language prompts collapse to the hub rather than selecting a specific command.

## 3. TARGET & CLASS
- **Target file(s):** `command-metadata.json` → `.opencode/commands/design/*.md`
- **Severity:** P2
- **Enforcement class:** hybrid
- **Dimension:** D2 — Command Specificity

## 4. BUILD OUTLINE
- Add `descriptionRole` + `autoTriggerEligible:false` + `hubKeywordProjection` per command.
- Project description keywords onto the hub rather than direct command triggers.
- Author a 4-lane replay: advisor→hub, hub→mode, direct-command→packet, generated-pin→parent.

## 5. ACCEPTANCE
- 4-lane replay resolves each lane to its expected target; `autoTriggerEligible:false` is checker-enforced.

## 6. EVIDENCE
- `mode-registry.json:4` — descriptions treated as auto-trigger source that NL collapses to the hub.
- Source: `research/research.md` §5 (D2-R13)

## 7. STATUS
planned — plan.md / tasks.md / checklist.md authored when executed.
