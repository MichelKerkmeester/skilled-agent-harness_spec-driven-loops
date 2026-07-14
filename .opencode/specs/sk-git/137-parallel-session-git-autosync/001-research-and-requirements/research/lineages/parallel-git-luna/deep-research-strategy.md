---
title: Deep Research Strategy - Parallel Git Autosync Luna Lineage
description: Detached five-iteration research strategy for concurrent AI session integration on one long-lived Git branch.
trigger_phrases:
  - parallel Git autosync
  - concurrent coding session integration
  - zero divergence Git workflow
importance_tier: important
contextType: planning
version: 1.14.0.19
---

# Deep Research Strategy - Parallel Git Autosync Luna Lineage

## 1. OVERVIEW

This is a detached `cli-codex` research lineage. It must run all five iterations because `stopPolicy` is `max-iterations`; convergence is telemetry only. The canonical output for this lineage is `research.md` in this directory.

## 2. TOPIC

Many concurrent AI coding sessions must publish continuously to one shared long-lived branch while preserving uncommitted work, keeping the IDE checkout current, and eliminating operator-visible divergence blockers.

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Which integration strategy handles concurrent publication and push races with the strongest correctness and liveness properties?
- [x] Which workspace model prevents sessions from overwriting each other's files while keeping the shared branch current?
- [x] How can a local IDE checkout stay current without disturbing uncommitted changes?
- [x] Which invariants prevent orphaned autostashes, overwritten work, force-push loss, and make rollback reliable?
- [x] Which automation surface provides the right lifecycle, observability, and failure recovery characteristics?
- [x] Which conflict-avoidance and conflict-handling rules make concurrent additive work tractable?
- [x] What do the named existing tools and workflows demonstrate or fail to guarantee?

<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS

- Do not implement a daemon or modify the repository under research.
- Do not claim arbitrary overlapping edits can be made conflict-free without a merge or serialization decision.
- Do not treat force-push or destructive working-tree replacement as an acceptable default.
- Do not broaden the result into a general Git tutorial.

## 5. STOP CONDITIONS

- Complete exactly five evidence iterations; convergence before five is telemetry only.
- Every RQ has at least one primary or authoritative source and a stated confidence.
- Compare the requested strategies and workspace models explicitly.
- Record negative knowledge and testable acceptance conditions in synthesis.

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Which integration strategy handles concurrent publication and push races with the strongest correctness and liveness properties?
- Which workspace model prevents sessions from overwriting each other's files while keeping the shared branch current?
- How can a local IDE checkout stay current without disturbing uncommitted changes?
- Which invariants prevent orphaned autostashes, overwritten work, force-push loss, and make rollback reliable?
- Which automation surface provides the right lifecycle, observability, and failure recovery characteristics?
- Which conflict-avoidance and conflict-handling rules make concurrent additive work tractable?
- What do the named existing tools and workflows demonstrate or fail to guarantee?

<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[None yet]

<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- What exact autostash, fetch, fast-forward-only, and rollback invariants are enforceable? (iteration 1)
- Which queue/daemon/remote-side systems already implement these boundaries? (iteration 1)
- How should an IDE-facing checkout consume new commits without overwriting dirty files? (iteration 1)
- What existing tools demonstrate, and what guarantees do they explicitly not provide? (iteration 2)
- Which queue/daemon/remote-side systems already serialize publication and provide these recovery boundaries? (iteration 2)
- Which automation surface gives the best observability and lifecycle behavior for session launch, retry, conflict, and rollback? (iteration 2)
- Which conflict-avoidance policies make additive concurrent work tractable? (iteration 2)
- Which safety and rollback invariants must be made acceptance tests rather than documentation claims? (iteration 3)
- Which conflict-avoidance policies make concurrent additive work tractable? (iteration 3)
- What exact architecture best combines ref-level publishing with the IDE current-view worktree? (iteration 3)
- Which integration strategy should be the default when low latency matters more than CI-gated queueing? (iteration 3)
- What trade-offs remain between a local daemon, remote merge queue, and hybrid deployment? (iteration 4)
- Which rollback, observability, and latency conditions must be stated in the final recommendation? (iteration 4)
- Which complete default architecture best combines these primitives and surfaces? (iteration 4)
- None for the stated research scope; implementation-specific queue storage, daemon protocol, and IDE integration remain design work outside this research loop. (iteration 5)

<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT

- The detached artifact root is the only allowed write boundary.
- The supplied packet asks for two independent model lineages, but this run covers only the named Luna lineage.
- The parent research directory already contains unrelated fan-out telemetry; it is not modified by this lineage.
- Code graph context is unavailable; this is primarily a standards/documentation and tool-art research task.

## 13. RESEARCH BOUNDARIES

- Max iterations: 5
- Convergence threshold: 0.05
- Stop policy: max-iterations; convergence is telemetry only
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- Current generation: 1
- Session: fanout-parallel-git-luna-1784004109977-h2q92q
- Scope: write only inside this artifact directory
