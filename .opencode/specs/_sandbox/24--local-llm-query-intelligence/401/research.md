---
title: "FSRS for spaced repetition (scenario 401 baseline)"
description: "Test memory for paraphrase recall validation."
trigger_phrases:
  - "fsrs algorithm"
  - "spaced repetition scheduler"
  - "memory review intervals"
  - "forgetting curve scheduling"
importance_tier: "normal"
contextType: "research"
---

# FSRS for spaced repetition

## SESSION SUMMARY

| **Meta Data** | **Value** |
|:--------------|:----------|
| Scenario | 401 paraphrase recall |
| Fixture Type | local-LLM memory substrate validation |

<!-- ANCHOR:continue-session -->

## CONTINUE SESSION

Continue validating scenario 401 by confirming that a stored FSRS memory is retrievable when queried with different wording about forgetting-curve scheduling and optimal review intervals.

<!-- /ANCHOR:continue-session -->

<!-- ANCHOR:canonical-docs -->

## CANONICAL SOURCES

- `.opencode/skills/system-spec-kit/manual_testing_playbook/24--local-llm-query-intelligence/401-paraphrase-recall.md` - Scenario contract and pass/fail threshold.
- `.opencode/specs/_sandbox/24--local-llm-query-intelligence/401/research.md` - Disposable test fixture saved through `memory_save`.

<!-- /ANCHOR:canonical-docs -->

## KEY FILES

| File | Description |
|:-----|:------------|
| `.opencode/skills/system-spec-kit/manual_testing_playbook/24--local-llm-query-intelligence/401-paraphrase-recall.md` | Defines the scenario objective, exact paraphrase query, expected top-3 rank, and score threshold for validating semantic recall. |
| `.opencode/specs/_sandbox/24--local-llm-query-intelligence/401/research.md` | Contains the disposable FSRS fact that is saved to the memory index and then searched through the paraphrased forgetting-curve query. |

<!-- ANCHOR:overview -->

## OVERVIEW

Use FSRS (Free Spaced Repetition Scheduler) algorithm for spaced repetition. FSRS predicts memory stability and difficulty per item, schedules reviews at optimal intervals to minimize forgetting, and adapts future due dates from recall outcomes rather than using fixed review gaps.

The scenario intentionally stores the concept with the FSRS and spaced-repetition phrasing, then searches with a paraphrase about applying forgetting-curve scheduling to memory items. Passing retrieval should show that semantic embeddings bridge the wording boundary instead of relying only on exact trigger phrase overlap.

<!-- /ANCHOR:overview -->

<!-- ANCHOR:evidence -->

## DISTINGUISHING EVIDENCE

- Stored phrasing: "Use FSRS (Free Spaced Repetition Scheduler) algorithm for spaced repetition."
- Stored behavior: FSRS predicts stability and difficulty per item before choosing review intervals.
- Paraphrase target: "apply forgetting-curve scheduling to memory items at optimal intervals."
- Expected validation signal: the stored FSRS memory appears in the top 3 search results with score greater than 0.5.

<!-- /ANCHOR:evidence -->

## DECISIONS

- Decided to keep the stored concept centered on FSRS and spaced repetition while using the scenario paraphrase for retrieval, because the test is meant to separate semantic recall from lexical trigger matching.
- Decided that a `memory_save` rejection should be classified as infrastructure failure for this scenario, because no substrate ranking can be judged unless the fixture reaches the memory index.

## KEY OUTCOMES

- The fixture preserves the canonical stored fact: FSRS predicts memory stability and difficulty per item, then schedules reviews at optimal intervals to reduce forgetting.
- The validation path records the exact `memory_search` query and checks whether the stored memory ID appears within the top 3 with score greater than 0.5.

## NEXT ACTIONS

- Run `memory_save` against this fixture, wait for indexing, then query `memory_search` with the paraphrase from scenario 401.
- Clean up using `memory_delete` for the stored ID and `memory_bulk_delete` scoped to this sandbox folder.

<!-- ANCHOR:recovery-hints -->

## RECOVERY HINTS

- If the stored memory does not surface, inspect `memory_health` for the active embedding provider and vector-search readiness.
- If `memory_save` rejects the fixture, treat the run as an infrastructure failure before judging the paraphrase substrate.

<!-- /ANCHOR:recovery-hints -->

<!-- ANCHOR:metadata -->

## MEMORY METADATA

```yaml
scenario_id: "401"
validation_track: "24--local-llm-query-intelligence"
fixture: true
```

<!-- /ANCHOR:metadata -->
