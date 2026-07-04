---
title: "Decision Record: Track Access Production Enablement"
description: "Decision record for whether this phase should enable memory search access tracking in production paths."
importance_tier: "normal"
contextType: "decision"
---
# Decision Record: Track Access Production Enablement

## Status
Deferred to operator.

## Context
The implementation repairs access tracking on cached search responses when callers explicitly set `trackAccess: true`. The default production search path still leaves `trackAccess` off. Enabling it globally would increase write activity on search cache hits and should be assessed with the search hot-path latency budget.

## Options Considered
- Enable `trackAccess` by default in production search.
- Keep `trackAccess` default-off and allow explicit callers/tests to opt in.
- Add a separate operator-controlled rollout flag after latency evaluation.

## Decision
Keep production `trackAccess` default-off in this phase. Defer production enablement to an operator-controlled rollout after latency and write-amplification review.

## Consequences
- The repaired cached-path mechanism is testable and available to explicit callers.
- No production latency or write-volume behavior changes are introduced by this phase.
- A later rollout can enable tracking with measured safeguards instead of coupling the decision to this repair.
