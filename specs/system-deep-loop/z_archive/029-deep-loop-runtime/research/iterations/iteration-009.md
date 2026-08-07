# Iteration 9: External Mining — galadriel harness → Deep Loop (recovery/resume primitives)

## Focus
Round B mining: galadriel harness (scheduler, agent loop) for NET-NEW Deep Loop candidates. Read-only.

## Findings — NET-NEW candidates (3; newInfoRatio 0.35)
| Candidate | Seam | Lev/Eff | Class | Conf |
|---|---|---|---|---|
| idempotent-one-shot-self-resume (restart-surviving self-prompt persisted immediately, cleared ONLY after confirmed delivery; re-fires on crash — "a wake is never silently lost") | state_format.md:115-120 (lock-level recovery only; no task-level resume-once token) — GAP | M/M | BUILD | CONFIRMED |
| preserve-before-trim-on-overflow (snapshot full conversation to durable memory BEFORE destructive trim + post-recovery advisory tag, then trim 50→20→reset) | atomic state (iteration-content recovery is lock/liveness-level only) — GAP | M/M | BUILD | CONFIRMED |
| graceful-self-stop-preserves-in-flight + empty-tick=valid (disabling mid-tick doesn't cancel the in-flight turn; treat no-new-findings as valid convergence, not failure) | convergence STOP (mid-iteration cancel vs await) — partial-GAP | L/S | FIX | CONFIRMED |

**Already covered:** galadriel's time-of-day scheduled/ambient reflection IS C-G1 (the scheduler headline, NOT net-new); carried-forward open-questions already threaded via findings-registry openQuestions (reduce-state.cjs:629-650); heartbeat primitive exists internally (loop-lock lastHeartbeatIso, different purpose — lock liveness).

## Honest bottom line
galadriel for deep-loop = modest (0.35). The scheduler headline (cadence reflection) is the already-known C-G1; the net-new residue is 3 RESILIENCE primitives (resume-once token, preserve-before-trim, graceful-self-stop) that complement the B4 observability/recovery cluster (orphan-reset, recover-vs-fresh gate).

## Next Focus
galadriel now SATURATED across all subsystems (002=0.25, 003=0.25, 004=0.35) — Round B external mining converged. The deep-loop resilience primitives feed Round C (recovery feasibility). Open: does STOP currently cancel an in-flight iteration agent or await it? → Round C/D.
