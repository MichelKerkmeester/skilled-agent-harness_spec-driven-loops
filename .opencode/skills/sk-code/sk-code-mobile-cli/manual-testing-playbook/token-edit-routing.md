---
id: PR-001
category: implementation
title: 'Token edit routing'
expected_surface: PI_REMOTE
expected_intent: IMPLEMENTATION
expected_resources:
  - references/token-library.md
  - references/ds-grammar.md
  - references/component-tokens.md
  - references/retint-recipes.md
  - references/theme-remap.md
  - references/workflow-implement.md
  - assets/token-retint-checklist.md
version: 1.0.0.0
---

# PR-001: Token edit routing

## 2. SCENARIO CONTRACT

- Prompt: `Retint the model-effort-sheet accent so it reads a warmer accent role without touching the frozen --pi-* primitives.`
- Expected surface: `PI_REMOTE`
- Expected intent: `IMPLEMENTATION`

**Exact prompt**:
```text
Retint the model-effort-sheet accent so it reads a warmer accent role without touching the frozen --pi-* primitives.
```
