---
title: Guided Run Smoke Lane Scenario
description: Manual scenario verifying the guided wrapper checks runtime readiness, runs extraction, saves the write prompt and preserves explicit DESIGN.md authorship.
version: 1.0.0.0
expected_intent: RUN_WRAPPER
expected_resources:
  - references/design_md_format.md
  - references/writing_style_guide.md
  - references/color_role_taxonomy.md
  - references/component_taxonomy.md
  - references/anti_patterns.md
  - references/authoring_boundary.md
  - references/extraction_workflow.md
  - references/troubleshooting.md
  - assets/design_md_prompt_template.md
  - references/guided_run.md
  - assets/cardinal_rules_card.md
  - assets/source_of_truth_router_card.md
---

**Exact prompt**

```
Run the guided md-generator wrapper for a smoke extraction and stop before validation if DESIGN.md has not been authored.
```

# GUIDED-014 -- Guided Run Smoke Lane

## Three-Step Smoke Lane

1. Preflight: run the wrapper with `--dry-run` and confirm Node, dependencies, Chromium and output path checks are reported.
2. Extract plus prompt: run the wrapper against a crawlable URL and confirm `tokens.json` plus `write-prompt.md` are produced.
3. Validation boundary: rerun with `--design-md <missing path>` and confirm the wrapper stops with a clear message rather than auto-authoring `DESIGN.md`.

## Pass Criteria

- The wrapper does not write DESIGN.md prose.
- The wrapper does not weaken or skip the cardinal fidelity rule.
- Validation runs only when `DESIGN.md` exists.
- The user-visible result names the next manual authoring step.
