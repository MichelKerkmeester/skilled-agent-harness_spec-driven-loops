---
title: "LLM-judge hardening"
description: "Hardens LLM judge validation with retries, dual timeouts, format-strip parsing, neutral fallback cards, and quarantine gating."
trigger_phrases:
  - "llm-judge hardening"
  - "llm-judge-hardening"
  - "llm-judge hardening deep-loop-runtime"
  - "validation llm-judge hardening"
version: 1.4.0.15
---

# LLM-judge hardening

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Hardens LLM judge validation with retries, dual timeouts, format-strip parsing, neutral fallback cards, and quarantine gating.

This feature belongs to the validation group and is catalogued as F043 in the `deep-loop-runtime` inventory.

---

## 2. HOW IT WORKS

`post-dispatch-validate.ts` retries transient judge failures, strips markdown fences before fallback, emits a neutral `quarantined:true` card after exhausted parsing, and blocks quarantined cards from persistence, convergence, and coverage writes.

The implementation is source-backed and covered by runtime-owned tests under `.opencode/skills/deep-loop-runtime/tests/`. Treat this as shipped behavior, not a roadmap claim.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `lib/deep-loop/post-dispatch-validate.ts` | Runtime | LLM-judge hardening. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `tests/unit/post-dispatch-validate.vitest.ts` | Test | Primary regression coverage for LLM-judge hardening. |

---

## 4. SOURCE METADATA

- Group: Validation
- Canonical catalog source: `feature_catalog.md`
- Feature ID: F043
- Feature file path: `03--validation/llm-judge-hardening.md`
- Source phase: `.opencode/specs/system-deep-loop/030-deep-loop-improved/002-deep-loop-runtime/016-llm-judge-hardening`
- Primary sources: `lib/deep-loop/post-dispatch-validate.ts`, `tests/unit/post-dispatch-validate.vitest.ts`
Related references:
- [validation](../03--validation/) — Validation category
