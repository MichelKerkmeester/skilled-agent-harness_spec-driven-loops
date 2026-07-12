---
id: SP-003
category: hub_routing
stage: routing
title: "Ambiguous request without a named model defaults to prompt-improve"
expected_intent: prompt-improve
expected_resources:
  - prompt-improve/SKILL.md
created: 2026-07-09
version: 1.0.0.0
---

# SP-003: Ambiguous request without a named model defaults to prompt-improve

Prompt: Improve this prompt for a small model.

## Expected Behavior

No specific model named, so the router does not have a strong `prompt-models` signal; `routerPolicy.defaultMode` (`prompt-improve`) wins or the router defers with a disambiguation checklist — not a silent wrong-mode resolution.

## Success Criteria

The router does not silently resolve to `prompt-models` on model-adjacent vocabulary alone without a named model id.
