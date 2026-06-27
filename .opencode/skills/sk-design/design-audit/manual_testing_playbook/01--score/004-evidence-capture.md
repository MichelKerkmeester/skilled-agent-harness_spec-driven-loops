---
title: Evidence Capture Scenario
description: Manual scenario verifying target resolution, the three evidence types and honest confirmed-or-inferred labeling when evidence is out of reach.
trigger_phrases:
  - "test evidence capture"
  - "test inferred evidence label"
  - "evidence capture scenario"
importance_tier: normal
contextType: reference
version: 1.0.0.0
expected_intent: EVIDENCE_CAPTURE
expected_resources:
  - references/corpus_map.md
  - ../shared/register.md
  - references/evidence_capture.md
---

**Exact prompt**

```
I only have a screenshot of this screen and no source target. Walk the evidence and tell me what you can confirm versus infer.
```

# AUDIT-SCORE-003 | Evidence Capture

## Target

Supply one concrete artifact in the `<TARGET>` slot where some evidence is reachable and some is not, for example a screenshot of a surface whose source you cannot open. If no target is available, record SKIP with the blocker "no target artifact supplied". Do not invent source, rendered or scan evidence to fill the gap.

## Prompt

`Audit <TARGET>. I can give you a screenshot but not the source. Tell me what you can confirm and what you can only infer.`

## Expected Process

1. Load `references/evidence_capture.md` and `references/audit_contract.md`.
2. Resolve the request to one concrete target, preferring a source path over a dev-server URL when both name the same surface.
3. State the resolved target and the evidence available versus the evidence missing at the top of the report.
4. Label every finding confirmed when read from real evidence, or inferred when it names what would confirm it.

## Pass Criteria

- The resolved target is stated before any finding, and an unresolvable target is escalated rather than guessed.
- Each finding cites at least one of the three evidence types: source, rendered or design-artifact.
- A screenshot-only finding is labeled inferred and names the source that would confirm it.
- No browser scan, overlay or detector is claimed unless it actually ran, and a missing scan is reported as a fallback signal rather than a clean pass.
- An inferred finding keeps its inferred label all the way into the score, never quietly upgraded to a fact.
