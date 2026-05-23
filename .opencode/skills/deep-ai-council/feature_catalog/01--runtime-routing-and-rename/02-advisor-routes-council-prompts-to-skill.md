---
title: "Advisor routes council prompts to skill"
description: "Verify scorer coverage for deep-ai-council."
---

# Advisor routes council prompts to skill

## 1. OVERVIEW

Verify scorer coverage for deep-ai-council.

The advisor must route explicit council requests to the skill instead of treating them as generic planning questions.

Operators use this feature when the real request is: Run an AI council deliberation to compare implementation plans and persist council artifacts.

---

## 2. CURRENT REALITY

The shipped surface is anchored by `deep-ai-council`, `native-scorer.vitest.ts`. The playbook scenario `01--runtime-routing-and-rename/002-advisor-routes-council-prompts-to-skill.md` defines the operator prompt, command sequence, expected signals, evidence, and pass/fail criteria for DAC-002.

Current behavior is grounded in `.opencode/skills/deep-ai-council/SKILL.md`, which the scenario identifies as skill routing metadata. Validation is anchored by `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/native-scorer.vitest.ts`, covering advisor regression.

The user-visible contract is concrete: Verify scorer coverage for deep-ai-council. The catalog entry mirrors that contract so reviewers can move from feature inventory to the exact playbook scenario and source files without guessing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/deep-ai-council/SKILL.md` | Skill | Skill routing metadata |

### Validation And Tests

| File | Focus |
|------|-------|
| `manual_testing_playbook/01--runtime-routing-and-rename/002-advisor-routes-council-prompts-to-skill.md` | Manual scenario contract |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/native-scorer.vitest.ts` | Advisor regression |

---

## 4. SOURCE METADATA
- Group: Runtime Routing And Rename
- Feature ID: DAC-002
- Canonical catalog source: `manual_testing_playbook.md`
- Feature file path: `feature_catalog/01--runtime-routing-and-rename/02-advisor-routes-council-prompts-to-skill.md`
- Playbook scenario: `manual_testing_playbook/01--runtime-routing-and-rename/002-advisor-routes-council-prompts-to-skill.md`
