---
title: Pi CLI - Prompt Quality Card
description: Thin Pi dispatch delegator. The canonical prompt-models packet owns framework selection and quality checks.
trigger_phrases:
  - "pi prompt quality card"
  - "pi dispatch prompt discipline"
  - "pi prompt framework selection"
  - "pi clear check"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Pi CLI - Prompt Quality Card

**Three-tier precedence rule: sk-prompt framework first, model-hub profile second, this card's Pi dispatch addenda third.**

This is a thin delegator. The canonical prompt-models packet owns the framework table, task mapping, density guidance, anti-hallucination checks, and CLEAR questions. This card adds only mechanics that are specific to constructing a safe Pi dispatch.

## 1. CANONICAL SOURCE

Load:

- [Canonical CLI prompt-quality card](../../../sk-prompt/sk-prompt-models/assets/cli-prompt-quality-card.md)
- [Canonical model profiles](../../../sk-prompt/sk-prompt-models/references/models/)

Do not copy the canonical taxonomy into this card. Do not create a second STAR, BUILD, ATLAS, or CONTEXT table here.

## 2. THREE TIERS

### Tier 1 - Fast Path

Use the canonical card for ordinary Pi dispatches. Select the framework there, apply its task mapping, run its CLEAR check, then add the Pi mechanics in this file.

### Tier 2 - Model Override

If the selected Pi provider/model has a profile in sk-prompt/prompt-models, that profile overrides the cross-model default. Read the profile before composing the prompt.

### Tier 3 - Deep Path

Use the canonical card's Tier 3 trigger list. When it calls for prompt improvement, dispatch the approved prompt-improver workflow rather than loading the full prompt system inline.

## 3. PI DISPATCH ADDENDA

After the canonical prompt is selected, add:

1. **Runtime**: identify Pi as the target executor.
2. **Mode**: choose print, JSON, or RPC.
3. **Scope**: name the allowed workspace and files.
4. **Guard**: state that the child must not dispatch Pi recursively.
5. **Tools**: specify the least-permissive tool set.
6. **Evidence**: require files, tests, and output evidence.
7. **Handback**: request summary, failures, and unknowns.

For a read-only review, ask for findings and evidence, then use the installed tool allowlist pattern from [cli-reference.md](../references/cli-reference.md).

## 4. COMPOSITION CHECK

- [ ] Canonical framework selected.
- [ ] Model profile checked when applicable.
- [ ] Pi mode is explicit.
- [ ] Task is bounded.
- [ ] Files and verification are named.
- [ ] No secret is in the prompt.
- [ ] The handback format is explicit.
- [ ] The child is told to return evidence rather than a completion assertion.

## 5. RELATED

- [SKILL.md](../SKILL.md) owns routing and hard rules.
- [prompt-templates.md](./prompt-templates.md) provides reusable dispatch shapes.
- [cli-reference.md](../references/cli-reference.md) owns confirmed flags.

