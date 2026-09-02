---
title: Deep Research Strategy - system-spec-memory surface inventory
description: Lineage-local strategy for the five-iteration inventory run.
importance_tier: normal
contextType: planning
version: 1.14.0.19
---

# Deep Research Strategy - Session Tracking

## 1. OVERVIEW

This detached lineage inventories every non-archived repository surface coupled to the retired system-spec-memory MCP subsystem. The canonical output is `research.md` in this lineage; no parent packet writeback is permitted.

## 2. TOPIC

Produce an exhaustive, classified inventory for the 002 consumer-rewire and 003 server-removal phases of the 049 memory decommission packet.

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)

- [ ] What every live and historical reference surface is, including exact path and line evidence.
- [ ] Which references are consumer rewires for phase 002 versus deletions for phase 003.
- [ ] Which old-contract surfaces would break if the MCP server, launcher, plugin, hook, tools, or flags were removed.
- [ ] How actual hit/tool/flag/file counts compare with the parent spec's estimates.
- [ ] Does a final independent scan cover every requested surface type while excluding z_archive and collapsing the mcp-server tree?
<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS

- Do not modify source, packet specs, generated context, memory databases, or git state.
- Do not design or implement the ripgrep replacement beyond naming the concrete replacement action per hit.
- Do not count z_archive as active scope; do not split the mcp-server tree into separate deletion rows.

## 5. STOP CONDITIONS

Run exactly five iterations because `stopPolicy` is `max-iterations`; convergence is telemetry only. Synthesize after iteration 5 even if the convergence score crosses the threshold.

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS

None yet.
<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED

Initial state; reducer refreshes this section after each iteration.
<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED

No failed approach recorded.
<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)

None yet.
<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS

None yet.
<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER

- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Remaining frontier: configuration, consumers, runtime, and final completeness audit
<!-- /ANCHOR:divergence-frontier -->

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS

None yet.
<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS

Iteration 1: enumerate registrations, launch/config/transport surfaces, and baseline counts.
<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT

- Parent decision: replace the MCP database with generated trigger indexing and ripgrep-first retrieval while preserving useful continuity behavior through file-local artifacts. [SOURCE: .opencode/specs/system-speckit/049-memory-decommission/goal.md:51-55]
- Parent scope names consumer rewiring and server removal as separate phases 002 and 003. [SOURCE: .opencode/specs/system-speckit/049-memory-decommission/spec.md:156-163]
- Parent resource-map.md is absent; this lineage records that absence and does not create a parent resource map.

## 13. RESEARCH BOUNDARIES

- Max iterations: 5
- Convergence threshold: 0.05
- Stop policy: max-iterations; convergence before the cap is telemetry only
- Per-iteration budget: 12 tool calls, 10 minutes
- Exclusions: z_archive; mcp-server is one classified tree entry
- Write authority: this lineage directory only
- Executor metadata: cli-codex, model gpt-5.6-luna, max reasoning, fast tier
