---
id: CR-R01
category: intra_routing_recall
stage: routing
title: 'Security routing'
expected_intent: SECURITY
expected_resources:
  - references/review_core.md
  - references/review_ux_single_pass.md
  - assets/security_checklist.md
  - assets/code_quality_checklist.md
  - assets/fix_completeness_checklist.md
version: 1.0.0.0
---

# CR-R01: Security routing

## 2. SCENARIO CONTRACT

- Prompt: `Review this auth handler for injection, vulnerability, race, and secret-handling security issues.`
- Expected intent: `SECURITY`

**Exact prompt**:
```text
Review this auth handler for injection, vulnerability, race, and secret-handling security issues.
```
