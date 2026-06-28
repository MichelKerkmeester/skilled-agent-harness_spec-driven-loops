---
title: "D6-R10 — READABILITY/DENSITY + LOCALE STRESS proof"
description: "Add measured readability/density rows and a locale-stress field to the context loading contract for content-heavy/global UI, plus a static margin-left/padding-left RTL lint."
trigger_phrases:
  - "d6-r10 readability density locale proof"
  - "locale stress design build"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-scaffold | v1.0 -->
# D6-R10 — READABILITY/DENSITY + LOCALE STRESS proof

## 1. OBJECTIVE
Add measured `READABILITY AND DENSITY PROOF` and `LOCALE STRESS PROOF` conditional fields for content-heavy and global UI, backed by a static RTL lint.

## 2. WHY
designer-skills-main's readable-measure and localization-design skills give measured rows (chars-per-line, max-width, line-height) and RTL/logical-property rules. sk-design covers readability and i18n as prose; porting the measured *shape* makes density and locale claims checkable, with the RTL lint fully enforceable.

## 3. TARGET & CLASS
- **Target file(s):** `.opencode/skills/sk-design/shared/context_loading_contract.md` (measured fields + static `margin-left`/`padding-left` RTL lint rule)
- **Severity:** P2
- **Enforcement class:** hybrid
- **Dimension:** D6 — Corpus Ports
- **Feeds:** D1

## 4. BUILD OUTLINE
- Add measured readability/density rows (chars-per-line, max-width, line-height, decision count) for content-heavy UI.
- Add locale-stress rows (expansion/RTL locale, logical properties, mirrored icons) for global UI.
- Add a static lint flagging physical `margin-left`/`padding-left` in favor of logical properties (enforceable half).

## 5. ACCEPTANCE
- Content-heavy/global prompts trigger the fields; the RTL lint deterministically flags physical-property usage; measured-value quality stays advisory (hybrid).

## 6. EVIDENCE
- `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/ui-design/skills/readable-measure/SKILL.md:14` — "Measuring in Practice" defining measured readability rows.
- `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/design-systems/skills/localization-design/SKILL.md:24` — "RTL (Right-to-Left) Support" defining the locale-stress shape.
- Source: `research/research.md` §9 (D6-R10)

## 7. STATUS
planned — plan.md / tasks.md / checklist.md authored when executed.
