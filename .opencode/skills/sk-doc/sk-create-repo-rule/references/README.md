---
title: "sk-create-repo-rule References"
description: "Router for this mode's reference set: what a rule must contain, and whether it may exist at all."
trigger_phrases:
  - "repo rule references"
  - "which reference to load"
  - "rule authoring references"
importance_tier: normal
contextType: reference
version: 1.0.0.0
---

# sk-create-repo-rule References

| Load | When |
|------|------|
| [`decision-tests.md`](decision-tests.md) | **First, always.** Four gates deciding whether a request may become a rule at all. Most requests stop here |
| [`rule-anatomy.md`](rule-anatomy.md) | After the tests pass. What a rule must contain, what may vary, and the length bands |
| `creation-standards.md` | Authored by a later phase — do's and don'ts above the structural floor |
| `agents-md-integration.md` | Authored by a later phase — the wiring a generated rule needs to be reachable |

The order matters. `rule-anatomy.md` answers *how a rule should read*, which only becomes
a question once `decision-tests.md` has said the rule may exist.
