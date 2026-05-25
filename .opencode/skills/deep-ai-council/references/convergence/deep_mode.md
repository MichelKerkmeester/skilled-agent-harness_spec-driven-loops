---
title: "Deep Mode Session Hierarchy"
description: "Session -> topic -> round structure for deep-ai-council with state files, cost guards and deep-loop-runtime integration."
trigger_phrases:
  - "deep mode session hierarchy"
  - "session topic round structure"
  - "deep-ai-council state files"
  - "council cost guards"
importance_tier: "normal"
contextType: "reference"
---

# Deep Mode Session Hierarchy

Deep mode organises council work as sessions containing topics which contain rounds. State files track progress and cost guards enforce limits.

---

## 1. OVERVIEW

### Core Principle

Session contains topics contain rounds. Each level has its own state file and guard checks.

### When to Use

Use deep mode when you need multi-topic council sessions with cost controls and state persistence. Use shallow mode for single-topic quick decisions.

### Key Sources

- Session orchestration: `scripts/orchestrate-session.cjs`
- Topic orchestration: `scripts/orchestrate-topic.cjs`
- Cost guards: `../../deep-loop-runtime/lib/council/cost-guards.cjs`

---

## 2. SESSION HIERARCHY

### Session Level

A session is the top-level container. It holds multiple topics and enforces session-wide limits.

**Session state path**: `ai-council/session-state.jsonl`

**Session guard**: `max_topics_per_session` limits how many topics run

**Session saturation**: After `min_topics_before_session_saturation` topics, stability scores determine if the session should stop early

### Topic Level

A topic is a single decision domain within a session. Topics run through rounds until stable or maxed out.

**Topic state path**: `ai-council/topics/{topic_id}/rounds/{round_id}/round-state.jsonl`

**Topic guard**: `max_rounds_per_topic` limits rounds per topic

**Cross-topic priors**: After the first topic, prior findings from other topics enrich the topic brief

### Round Level

A round is one pass through the council seats. Seats dispatch, return verdicts and an adjudicator synthesises.

**Round state path**: Same as topic state path, one file per round

**Round guard**: `saturation_threshold` stops the topic when verdicts stop changing

---

## 3. STATE FILES

### session-state.jsonl

Append-only JSONL at the session level. Records topic completion events.

**Event type**: `topic_completed`

**Payload includes**:
- `session_id`
- `topic_id`
- `topic_number`
- `rounds_completed`
- `final_verdict`
- `stability_score`
- `topic_stop_reason`

### round-state.jsonl

Append-only JSONL at the round level. Records round progress events.

**Event type**: `round_completed`

**Payload includes**:
- `topic_id`
- `round_id`
- `round_number`
- `seats`
- `dispatch_summary`
- `adjudicator_verdict`
- `verdict_delta_from_previous`
- `verdict_stable`
- `stop_reason`

---

## 4. COST GUARDS

### Guard Normalisation

Guards merge from session state and executor config. Executor config overrides session defaults

### Guard Evaluation

`evaluateCouncilCostGuards` checks if limits are exceeded and returns stop reasons

**Stop reasons**:
- `max_topics_per_session`
- `saturation_threshold`
- `max_rounds_per_topic`
- `all_seats_failed`

---

## 5. DEEP-LOOP-RUNTIME DEPENDENCY

### Required Modules

Deep mode imports council primitives from deep-loop-runtime:

- `round-state-jsonl.cjs` for state file writes
- `cost-guards.cjs` for guard evaluation
- `session-state-hierarchy.cjs` for validation
- `multi-seat-dispatch.cjs` for seat execution
- `adjudicator-verdict-scoring.cjs` for stability scoring

### Session State Validation

`validateSessionStateHierarchy` checks that session -> topic -> round structure is well-formed before orchestration starts

---

## 6. WORKED EXAMPLE

### Session Flow

```javascript
const result = await orchestrateSession({
  session_state: {
    session: {
      session_id: 'council-001',
      spec_folder: '/path/to/packet',
      max_topics_per_session: 5,
      max_rounds_per_topic: 3,
    },
    topics: [
      { topic_id: 'topic-001-runtime', title: 'Runtime Boundary' },
      { topic_id: 'topic-002-convergence', title: 'Convergence Semantics' },
    ],
    current: { round: { seats: ['seat-001', 'seat-002', 'seat-003'] } },
  },
  executor_config: {
    cost_guards: {
      max_topics_per_session: 5,
      saturation_threshold: 0.2,
      min_topics_before_session_saturation: 2,
    },
    orchestrateTopic: async ({ topic_id }) => {
      // Topic runner implementation
      return { topic_id, rounds_completed: 1, stability_score: 0.1 };
    },
  },
});
```

**Result structure**:
- `session_id`
- `topics_completed`
- `topic_results`
- `skipped_topic_ids`
- `stop_reason`
- `session_state_path`

---

## 7. CROSS-REFERENCES

- State format: `references/structure/state_format.md`
- Findings registry: `references/scoring/findings_registry.md`
- Cost guards: `../../deep-loop-runtime/lib/council/cost-guards.cjs`
- Session hierarchy: `../../deep-loop-runtime/lib/council/session-state-hierarchy.cjs`
