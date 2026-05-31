---
title: "Prompt pack"
description: "Renders prompt-pack templates with checked placeholder variables."
trigger_phrases:
  - "prompt pack"
  - "prompt-pack.ts"
  - "render prompt"
  - "template token extraction"
  - "prompt placeholder variables"
---

# Prompt pack

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Renders prompt-pack templates with checked placeholder variables.

This feature belongs to the prompt rendering group and is catalogued as F004 in the `deep-loop-runtime` inventory.

---

## 2. HOW IT WORKS

Template token extraction, strict variable names, missing-token failures, and render output.

The implementation is source-backed and covered by runtime-owned tests under `.opencode/skills/deep-loop-runtime/tests/`. Treat this as shipped behavior, not a roadmap claim.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `lib/deep-loop/prompt-pack.ts` | Runtime | Template token extraction, strict variable names, missing-token failures, and render output. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `tests/unit/prompt-pack.vitest.ts` | Test | Primary regression coverage for Prompt pack. |

---

## 4. SOURCE METADATA

- Group: Prompt rendering
- Canonical catalog source: `feature_catalog.md`
- Feature ID: F004
- Feature file path: `02--prompt-rendering/004-prompt-pack.md`
- Primary sources: `lib/deep-loop/prompt-pack.ts`, `tests/unit/prompt-pack.vitest.ts`
