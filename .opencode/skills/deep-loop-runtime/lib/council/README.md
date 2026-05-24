---
title: "Council Primitives"
description: "Multi-seat dispatch, adjudicator-verdict stability, and cost guards for deep-ai-council deep mode."
---

# Council Primitives

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CONTENTS](#2--contents)
- [3. CONSUMERS](#3--consumers)
- [4. TESTS](#4--tests)

---

## 1. OVERVIEW

Runtime primitives consumed by deep-ai-council orchestrators for iterative multi-topic deliberation. Implements 3-level state hierarchy (session to topic to round) with verdict-delta convergence scoring.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `multi-seat-dispatch.cjs` | Parallel seat dispatch helper |
| `round-state-jsonl.cjs` | Atomic-append round state with flock parity |
| `adjudicator-verdict-scoring.cjs` | Round-N to Round-N+1 verdict-delta scoring |
| `cost-guards.cjs` | `max_rounds_per_topic`, `max_topics_per_session`, and `saturation_threshold` enforcement |
| `session-state-hierarchy.cjs` | 3-level state shape: session, topic, round |
| `council-graph-db.ts` | Runtime-owned SQLite projection for derived council graph state |
| `council-graph-query.ts` | Prompt-safe council graph query helpers |
| `convergence.cjs` | Council-specific convergence signals, blockers, trace, and JSON bridge payload helpers |

## 3. CONSUMERS

- `.opencode/skills/deep-ai-council/scripts/orchestrate-topic.cjs`
- `.opencode/skills/deep-ai-council/scripts/orchestrate-session.cjs`
- `.opencode/skills/deep-loop-runtime/scripts/{upsert,query,status,convergence}.cjs` for `loopType=council` graph operations

## 4. TESTS

- `.opencode/skills/deep-loop-runtime/tests/council/`
- `.opencode/skills/deep-loop-runtime/tests/unit/council-graph-query.vitest.ts`
- `.opencode/skills/deep-loop-runtime/tests/integration/council-graph-script.vitest.ts`
