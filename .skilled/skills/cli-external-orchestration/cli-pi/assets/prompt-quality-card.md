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
version: 1.5.1.0
---

# Pi CLI - Prompt Quality Card

**Two-tier precedence rule: sk-prompt framework first, this card's Pi dispatch addenda second.**

This is a thin delegator. The canonical prompt-models packet owns the framework table, task mapping, density guidance, anti-hallucination checks, and CLEAR questions. This card adds only mechanics that are specific to constructing a safe Pi dispatch.

## 1. OVERVIEW

### Purpose

This card is the Pi fast-path prompt-quality reference. It delegates the framework table and the CLEAR check to the
canonical card and records only the Pi-specific dispatch mechanics plus the precedence rule.

### Usage

Compose a Pi dispatch prompt by starting from the canonical card, applying its Pre-Dispatch Checklist, and then
adding the Pi mechanics in this file.

---

## 2. CANONICAL SOURCE

Load:

- [Canonical CLI prompt-quality card](../../../sk-prompt/assets/cli-prompt-quality-card.md)

Do not copy the canonical taxonomy into this card. Do not create a second STAR, BUILD, ATLAS, or CONTEXT table here.

---

## 3. TWO TIERS

### Tier 1 - Fast Path

Use the canonical card for ordinary Pi dispatches. Select the framework there, apply its task mapping, run its CLEAR check, then add the Pi mechanics in this file.

### Tier 2 - Deep Path

Use the canonical card's deep-path trigger list. When it calls for prompt improvement, dispatch the approved prompt-improver workflow rather than loading the full prompt system inline.

---

## 4. PI DISPATCH ADDENDA

After the canonical prompt is selected, add:

1. **Runtime**: identify Pi as the target executor.
2. **Mode**: choose print, JSON, or RPC.
3. **Scope**: name the allowed workspace and files.
4. **Guard**: state that the child must not dispatch Pi recursively.
5. **Tools**: specify the least-permissive tool set.
6. **Evidence**: require files, tests, and output evidence.
7. **Handback**: request summary, failures, and unknowns.

For a read-only review, ask for findings and evidence, then use the installed tool allowlist pattern from [cli-reference.md](../references/cli-reference.md).

---

## 5. COMPOSITION CHECK

- [ ] Canonical framework selected.
- [ ] Model profile checked when applicable.
- [ ] Pi mode is explicit.
- [ ] Task is bounded.
- [ ] Files and verification are named.
- [ ] No secret is in the prompt.
- [ ] The handback format is explicit.
- [ ] The child is told to return evidence rather than a completion assertion.

---

## 6. RELATED

- [SKILL.md](../SKILL.md) owns the hard rules; [ROUTER.md](../ROUTER.md) owns routing.
- [prompt-templates.md](./prompt-templates.md) provides reusable dispatch shapes.
- [cli-reference.md](../references/cli-reference.md) owns confirmed flags.

