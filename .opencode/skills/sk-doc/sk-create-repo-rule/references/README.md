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
| [`creation-standards.md`](creation-standards.md) | Before finishing a draft. Five reader tests deciding whether a well-formed rule is worth loading |
| [`agents-md-integration.md`](agents-md-integration.md) | At the wiring step, and on every revise or retire. The three wiring points, the interruption-safe orderings, and the `AGENTS.md` boundary |

The order matters, and it is the order of the questions: may this exist, what must it
contain, is it worth loading. `decision-tests.md` refuses most requests before the other
two become relevant.
