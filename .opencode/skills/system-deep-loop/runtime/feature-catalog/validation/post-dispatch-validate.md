---
title: "Post-dispatch validate"
description: "Validates iteration artifacts after dispatch: checks iteration file existence, state-log growth, required JSONL fields, optional code-verification pass (compile/execute/test/lint), and appends degraded verification events when optional checks fail."
trigger_phrases:
  - "post-dispatch validate"
  - "post-dispatch-validate.ts"
  - "validate after dispatch"
  - "verification confidence scoring"
  - "degraded verification events"
version: 1.4.0.5
---

# Post-dispatch validate

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Validates iteration artifacts after dispatch and appends degraded verification events when optional checks fail.

This feature belongs to the validation group and is catalogued as F005 in the `runtime/` inventory.

---

## 2. HOW IT WORKS

Iteration markdown, JSONL, delta validation, review-depth v2 enforcement, and verification confidence scoring.

The implementation is source-backed and covered by runtime-owned tests under `.opencode/skills/system-deep-loop/runtime/tests/`. Treat this as shipped behavior, not a roadmap claim.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `lib/deep-loop/post-dispatch-validate.ts` | Runtime | Iteration markdown, JSONL, delta validation, review-depth v2 enforcement, and verification confidence scoring. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `tests/unit/post-dispatch-validate.vitest.ts` | Test | Primary regression coverage for Post-dispatch validate. |
| `tests/integration/review-depth-validator.vitest.ts` | Integration | Review-depth validator enforcement coverage. |
| `tests/unit/dispatch-failure.vitest.ts` | Unit | Dispatch-failure validation coverage. |

---

## 4. SOURCE METADATA

- Group: Validation
- Canonical catalog source: `feature-catalog.md`
- Feature ID: F005
- Feature file path: `validation/post-dispatch-validate.md`
- Primary sources: `lib/deep-loop/post-dispatch-validate.ts`, `tests/unit/post-dispatch-validate.vitest.ts`
