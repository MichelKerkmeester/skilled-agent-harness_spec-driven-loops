---
title: Guided Run Smoke Lane Scenario
description: Manual scenario verifying the guided wrapper checks runtime readiness, runs extraction, saves the write prompt and preserves explicit DESIGN.md authorship.
version: 1.0.0.0
expected_intent: RUN_WRAPPER
expected_resources:
  - references/design-md-format.md
  - references/writing-style-guide.md
  - references/color-role-taxonomy.md
  - references/component-taxonomy.md
  - references/anti-patterns.md
  - references/authoring-boundary.md
  - references/extraction-workflow.md
  - references/troubleshooting.md
  - assets/design-md-prompt-template.md
  - references/guided-run.md
  - assets/cardinal-rules-card.md
  - assets/source-of-truth-router-card.md
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
