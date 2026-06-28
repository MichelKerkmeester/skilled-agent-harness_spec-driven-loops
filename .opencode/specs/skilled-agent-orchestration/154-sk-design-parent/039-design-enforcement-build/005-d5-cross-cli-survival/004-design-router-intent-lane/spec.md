---
title: "D5-R4 — DESIGN router intent lane in all 3 CLI dictionaries"
description: "Add a DESIGN intent + keywords + RESOURCE_MAP target pointing at the skill-local design contract in each of the three cli-* provider dictionaries."
trigger_phrases:
  - "d5-r4 design router intent lane"
  - "design intent lane design build"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-scaffold | v1.0 -->
# D5-R4 — DESIGN router intent lane in all 3 CLI dictionaries

## 1. OBJECTIVE
Add a `DESIGN` intent (keywords + `RESOURCE_MAP` target) to the provider dictionary in each of the three cli-* SKILLs, so design prompts deterministically route to the skill-local design contract rather than falling through to a generic lane.

## 2. WHY
The deterministic router only loads `RESOURCE_MAP[intent]` for intents it knows. With no `DESIGN` lane, a design prompt either misroutes or loads nothing design-specific, leaving the child without the contract even when the phrasing is unambiguous.

## 3. TARGET & CLASS
- **Target file(s):** the provider dictionary / Resource Loading tables in `.opencode/skills/cli-opencode/SKILL.md`, `.opencode/skills/cli-codex/SKILL.md`, `.opencode/skills/cli-claude-code/SKILL.md`
- **Severity:** P1
- **Enforcement class:** enforceable
- **Dimension:** D5 — Cross-CLI Survival

## 4. BUILD OUTLINE
- Define `DESIGN` keywords and a `RESOURCE_MAP` target pointing at the skill-local copied design contract (not a cross-skill path).
- Add the lane to all three provider dictionaries with parallel keyword sets.
- Confirm the router same-skill path guard (`shared_smart_router.md:46` `_guard_in_skill`) accepts the skill-local target.

## 5. ACCEPTANCE
- A router-replay over a fixed local corpus routes design prompts to the `DESIGN` lane and loads the skill-local contract in all three cli-*; a parity check fails if only one sibling defines the lane.

## 6. EVIDENCE
- `.opencode/skills/cli-opencode/SKILL.md:100` — the Resource Loading / intent→`RESOURCE_MAP` table where the `DESIGN` lane attaches.
- Source: `research/research.md` §8 (D5-R4)

## 7. STATUS
planned — plan.md / tasks.md / checklist.md authored when executed.
