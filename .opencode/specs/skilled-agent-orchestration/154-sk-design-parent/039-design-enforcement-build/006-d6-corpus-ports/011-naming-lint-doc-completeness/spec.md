---
title: "D6-R11 — NAMING LINT + DOC COMPLETENESS contract"
description: "Add a conditional design-system artifact contract (naming regexes, token tiers, required doc headings) for token/component/library outputs only."
trigger_phrases:
  - "d6-r11 naming lint doc completeness"
  - "naming lint design build"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-scaffold | v1.0 -->
# D6-R11 — NAMING LINT + DOC COMPLETENESS contract

## 1. OBJECTIVE
Add a conditional `NAMING LINT` + `DOC COMPLETENESS` contract that applies only to design-system artifacts (tokens, components, libraries).

## 2. WHY
designer-skills-main's naming-convention skill prescribes documented naming rules on a single reference page. sk-design has no enforceable naming/doc contract for design-system outputs, so token and component artifacts ship without consistent names or required documentation.

## 3. TARGET & CLASS
- **Target file(s):** `.opencode/skills/sk-design/design-foundations/references/` (new design-system artifact contract: naming regexes, token tiers, required doc headings)
- **Severity:** P2
- **Enforcement class:** enforceable
- **Dimension:** D6 — Corpus Ports
- **Feeds:** D4

## 4. BUILD OUTLINE
- Define the conditional contract: naming regexes, token tiers, required doc headings.
- Scope it to token/component/library outputs only (no effect on screen/flow work).
- Provide a deterministic lint over names + required headings.

## 5. ACCEPTANCE
- A token/component artifact violating a naming regex or missing a required heading fails the lint; non-system outputs are exempt; a compliant artifact passes.

## 6. EVIDENCE
- `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/design-systems/skills/naming-convention/SKILL.md:23` — "Document rules in a single reference page" defining the naming + doc-completeness shape.
- Source: `research/research.md` §9 (D6-R11)

## 7. STATUS
planned — plan.md / tasks.md / checklist.md authored when executed.
