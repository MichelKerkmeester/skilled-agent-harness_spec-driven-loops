---
title: "Permissions gate"
description: "Evaluates pre-dispatch tool calls against packet-local, repo-wide, and external permission rules."
trigger_phrases:
  - "permissions gate"
  - "permissions-gate.ts"
  - "evaluate tool permissions"
  - "default-deny tool access"
  - "glob specificity permission rules"
---

# Permissions gate

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Evaluates pre-dispatch tool calls against packet-local, repo-wide, and external permission rules.

This feature belongs to the state safety group and is catalogued as F009 in the `deep-loop-runtime` inventory.

---

## 2. HOW IT WORKS

Tool operation mapping, path resolution, glob specificity, default-deny, and allow/deny reasons.

The implementation is source-backed and covered by runtime-owned tests under `.opencode/skills/deep-loop-runtime/tests/`. Treat this as shipped behavior, not a roadmap claim.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `lib/deep-loop/permissions-gate.ts` | Runtime | Tool operation mapping, path resolution, glob specificity, default-deny, and allow/deny reasons. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `tests/unit/permissions-gate.vitest.ts` | Test | Primary regression coverage for Permissions gate. |

---

## 4. SOURCE METADATA

- Group: State safety
- Canonical catalog source: `feature_catalog.md`
- Feature ID: F009
- Feature file path: `04--state-safety/009-permissions-gate.md`
- Primary sources: `lib/deep-loop/permissions-gate.ts`, `tests/unit/permissions-gate.vitest.ts`
Related references:
- [008-loop-lock.md](008-loop-lock.md) — Loop lock
