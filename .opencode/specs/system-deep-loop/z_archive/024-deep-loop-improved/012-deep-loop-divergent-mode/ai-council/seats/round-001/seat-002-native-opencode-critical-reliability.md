---
round: 1
seat: seat-002
executor: native-opencode
lens: critical-reliability
status: ok
timestamp: "2026-07-10T09:43:07.977Z"
simulated: false
---
# Seat 002 — Critical Reliability

## Proposed Plan
Treat every pivot as a fail-closed append-only transaction. Derive `pivotId` from immutable lineage/trigger inputs before writes. Require exactly three distinct configured seats and three parse-valid returns, then normal two-of-three agreement and no high-severity blocker.

Never mutate next focus before `pivot_completed` references durable seat, deliberation, and report artifacts. Resume the same pivot from its next missing durable stage. Reject conflicting duplicates.

Persist under `<artifactRoot>/divergent/pivots/<pivotId>/council/**`, never generic packet Council report/seat paths. Persist recursion guard; reject external/subprocess routes.

## Failure Attack
Terminal: max iterations, pause/cancel, manual stop, unrecoverable error, mandatory security escalation, exhausted duration/Council budget. Not eligible: STOP_BLOCKED, failed gates, unresolved review P0/P1 or adjudication, graph CONTINUE, stuck recovery, blocked/exhausted/ruled-out concepts. One failed seat means `pivot_failed`, no fabricated focus. Review candidates stay read-only and cannot alter verdict, target, permission, or security behavior.

## Quorum And Cost
Return quorum 3/3; decision agreement two-of-three. Auto fails closed on non-convergence. Confirm may make an explicit audited choice. Preflight maxPivots, max seat outputs, remaining iteration, duration, timeout.

## Alternative Challenged
Existing partial-success dispatch behavior: it reports failure but does not enforce strict quorum or transaction durability.

## Confidence
94/100.
