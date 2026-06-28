---
title: "D2-R6 — No sibling discriminator / deferToHubWhen at command layer"
description: "Add a discriminator{whenToUse,preferSiblingWhen,pairWithHubWhen,sequence} block to command-metadata.json, derived from child Use-when/When-NOT, and generate per-pair replay fixtures."
trigger_phrases:
  - "d2-r6 sibling discriminator"
  - "sibling discriminator design build"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-scaffold | v1.0 -->
# D2-R6 — No sibling discriminator / deferToHubWhen at command layer

## 1. OBJECTIVE
Let each `/design:*` command say when to pick it over a sibling and when to defer to the hub.

## 2. WHY
The command layer carries no discriminator, so a caller cannot tell when a sibling command or the hub is the better entry.

## 3. TARGET & CLASS
- **Target file(s):** `command-metadata.json` → `.opencode/commands/design/*.md`
- **Severity:** P1
- **Enforcement class:** hybrid
- **Dimension:** D2 — Command Specificity

## 4. BUILD OUTLINE
- Add `discriminator{whenToUse,preferSiblingWhen,pairWithHubWhen,sequence}` derived from each child's `Use when` / `When NOT`.
- Generate the discriminator sections into the wrappers.
- Author per-pair replay fixtures asserting the right sibling/hub choice.

## 5. ACCEPTANCE
- Per-pair replay fixtures resolve to the expected command/hub; presence of the discriminator block is checker-enforced (wording stays advisory).

## 6. EVIDENCE
- `commands/design/interface.md:13` — wrapper offers no sibling discriminator or deferToHubWhen.
- Source: `research/research.md` §5 (D2-R6)

## 7. STATUS
planned — plan.md / tasks.md / checklist.md authored when executed.
