---
id: PR-003
category: code_quality
title: 'Guardrail audit routing'
expected_surface: PI_REMOTE
expected_intent: CODE_QUALITY
expected_resources:
  - references/editability-guardrails.md
  - assets/guardrail-audit-checklist.md
version: 1.0.0.0
---

# PR-003: Guardrail audit routing

## 2. SCENARIO CONTRACT

- Prompt: `Run a quality gate confirming no @ds guardrail: do-not-edit fence was touched by this design-system change.`
- Expected surface: `PI_REMOTE`
- Expected intent: `CODE_QUALITY`

**Exact prompt**:
```text
Run a quality gate confirming no @ds guardrail: do-not-edit fence was touched by this design-system change.
```
