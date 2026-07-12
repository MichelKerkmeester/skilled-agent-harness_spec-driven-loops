---
id: CQ-001
category: quality_gate
title: 'Quality gate routes to the code-quality checklist'
expected_intent: QUALITY
expected_resources:
  - assets/code_quality_checklist/overview_header_and_comments.md
  - assets/code_quality_checklist/naming_init_formatting_and_css.md
  - assets/code_quality_checklist/verification_quick_reference_and_related.md
version: 1.0.0.0
---

# CQ-001: Quality Gate Routes to the Checklist

## 2. SCENARIO CONTRACT

- Prompt: `run the comment hygiene quality gate and check p0 p1 p2 standards before marking this done`
- Expected intent: `QUALITY`

The `QUALITY` intent must resolve to code-quality's single routable checklist. This is a thin, deliberately narrow Type-1 route; the skill's real routing precision is target-path-keyed and covered by a unit test, and its parent discoverability is the hub `quality` signal.
