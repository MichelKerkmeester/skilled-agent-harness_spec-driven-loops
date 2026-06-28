---
title: "D2-R11 — Interface mode hides 11 intent lanes behind one bridge"
description: "Bind interface command tasks to the interface router INTENT_SIGNALS, promoting directions/preflight/redesign/handoff as task projections and classifying each of the 11 lanes."
trigger_phrases:
  - "d2-r11 interface intent lanes"
  - "interface intent lanes design build"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-scaffold | v1.0 -->
# D2-R11 — Interface mode hides 11 intent lanes behind one bridge

## 1. OBJECTIVE
Surface the interface mode's 11 intent lanes as visible task projections instead of one opaque bridge.

## 2. WHY
The interface command collapses 11 router intent lanes into a single thin bridge, hiding distinct jobs like directions, preflight, redesign, and handoff.

## 3. TARGET & CLASS
- **Target file(s):** `command-metadata.json` (interface `tasks`) → `.opencode/commands/design/interface.md`
- **Severity:** P2
- **Enforcement class:** hybrid
- **Dimension:** D2 — Command Specificity

## 4. BUILD OUTLINE
- Bind `tasks` to the interface router `INTENT_SIGNALS`.
- Promote directions/preflight/redesign/handoff as task projections.
- Classify each lane: sibling-command / argument / internal / hidden; add negative fixtures.
- **Candidate nested sub-phases (materialize at execution):** one sub-phase per lane class once the 11 lanes are triaged.

## 5. ACCEPTANCE
- Each of the 11 lanes carries a class; negative fixtures reject lanes that should not become commands.

## 6. EVIDENCE
- `design-interface/SKILL.md:100` — router INTENT_SIGNALS the command surface should project.
- Source: `research/research.md` §5 (D2-R11)

## 7. STATUS
planned — plan.md / tasks.md / checklist.md authored when executed.
