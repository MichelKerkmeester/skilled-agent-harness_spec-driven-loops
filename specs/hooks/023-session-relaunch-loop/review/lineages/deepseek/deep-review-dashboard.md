# Deep Review Dashboard

> Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

## Status

- Status: COMPLETE
- Verdict: CONDITIONAL
- hasAdvisories: true
- Active findings: P0 0, P1 1, P2 10
- Release readiness: in-progress
- Session: fanout-deepseek-1792421295628-xsy88n
- Parent session: none
- Lifecycle mode: new
- Generation: 1
- continuedFromRun: none
- Stop reason: maxIterationsReached
- Executor: cli-opencode, llmgateway/deepseek-v4.1-flash, reasoning max

## Findings Summary

| Severity | Active | New in latest | Resolved |
|----------|--------|---------------|----------|
| P0 | 0 | 0 | 0 |
| P1 | 1 | 0 | 0 |
| P2 | 10 | 2 | 0 |

## Progress

| Iteration | Focus | Findings (cumulative) | newFindingsRatio | Status |
|-----------|-------|-----------------------|------------------|--------|
| 1 | correctness | P0 0, P1 0, P2 2 | 1.000 | complete |
| 2 | security | P0 0, P1 0, P2 3 | 0.333 | complete |
| 3 | traceability | P0 0, P1 1, P2 6 | 0.727 | complete |
| 4 | maintainability | P0 0, P1 1, P2 8 | 0.154 | complete |
| 5 | adapter parity and documentation inputs | P0 0, P1 1, P2 10 | 0.133 | complete |

## Coverage

- Dimensions: 4 of 4 (correctness, security, traceability, maintainability)
- Files reviewed: 5 iterations across the shared core, nudge, CLI, wrapper, killer, five automatic adapters, the OpenCode plugin, the Hermes bridge, the handoff command, the spec-gate exemption, and the packet and benchmark documentation.
- Core protocols: `spec_code` partial; `checklist_evidence` partial.
- Overlay protocols: `feature_catalog_code` pass; `playbook_capability` partial; `skill_agent` and `agent_cross_runtime` not applicable.
- Resource Map Coverage Gate: skipped; `resource-map.md` is not present in the packet.
- AC_COVERAGE: exempt; the root packet has no `checklist.md` or `implementation-summary.md`.

## Trend

- Ratios: 1.000 -> 0.333 -> 0.727 -> 0.154 -> 0.133
- Direction: descending after the traceability pass; no convergence stop was used.
- Stop policy: max-iterations; the five-iteration cap was reached with the active P1 still open.

## Active Risks

- **DS-004 (P1):** phase 007 cites `relaunch-run10.log`, which is absent from the tree and excluded by `.gitignore:263` (`*.log`). The phase 007 closure cannot be verified from a fresh checkout.
- **DS-001 (P2):** the automatic nudge names a note path in a handoffs directory it never creates.
- **DS-002 (P2):** a second handoff can orphan the first open note, and a later nudge can reuse the stale path.
- **DS-003 (P2):** handoff notes inherit permissive directory and file modes.
- **DS-005, DS-006, DS-007 (P2):** parent spec child count and handoff row, phase 006 review-report citations, and the handoff exit-3 contract.
- **DS-008, DS-009 (P2):** an unswept stale-lock backup and a future-timestamp freshness bypass.
- **DS-010, DS-011 (P2):** undocumented spec-folder inputs and missing Claude/Codex nudge-field coverage.
- Blocked stops: none recorded.
- Guard violations: none; the review stayed read-only and inside the lineage.

## Search Coverage

- Graph coverage mode: `graphless_fallback` on every iteration.
- Search debt: none.
- Candidate coverage: required classes covered or ruled out per iteration; no blocked or deferred classes in the final record.
- Clean search proof: the 11 active findings and the ruled-out directions are recorded in the iteration search ledgers; no candidate class was left unexamined.

## Lifecycle

- Session ID: fanout-deepseek-1792421295628-xsy88n
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none
- terminalStop: maxIterationsReached

## Blocked Stops

None. The stop policy was the iteration cap, not a legal-stop decision.

## Graph Convergence

- graphConvergenceScore: 0
- graphDecision: none
- graphBlockers: none
- Graph events were emitted per iteration as review coverage nodes and edges.
