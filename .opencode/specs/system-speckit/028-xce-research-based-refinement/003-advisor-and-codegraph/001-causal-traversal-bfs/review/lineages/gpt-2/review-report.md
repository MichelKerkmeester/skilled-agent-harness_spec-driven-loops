# Deep Review Report: Causal Traversal BFS Read Path

## Executive Summary
- Verdict: PASS
- hasAdvisories: true
- Stop reason: converged
- Release readiness: converged
- Iterations: 5 of 6
- Active findings: P0=0, P1=0, P2=3
- Scope: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/012-causal-traversal-bfs` and its shipped BFS traversal code/test evidence.

The review covered correctness, security, traceability, maintainability, and one stabilization replay. No blocker or required-fix findings were confirmed. Three advisory P2 findings remain.

## Planning Trigger
No remediation plan is required for release readiness because there are no active P0 or P1 findings. A follow-up cleanup can address the P2 advisories when convenient.

## Active Finding Registry
| ID | Severity | Dimension | Title | Evidence | Status |
|----|----------|-----------|-------|----------|--------|
| F001 | P2 | traceability | Shipped spec still carries an unresolved open question | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/012-causal-traversal-bfs/spec.md:135-139`; `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/012-causal-traversal-bfs/implementation-summary.md:26-28` | active |
| F002 | P2 | maintainability | Causal boost comments still describe the removed CTE implementation | `.opencode/skills/system-spec-kit/mcp_server/lib/search/causal-boost.ts:6-8`; `.opencode/skills/system-spec-kit/mcp_server/lib/search/causal-boost.ts:81-87`; `.opencode/skills/system-spec-kit/mcp_server/lib/search/causal-boost.ts:420-428` | active |
| F003 | P2 | maintainability | Latency acceptance test uses a hard wall-clock comparison that may be noisy | `.opencode/skills/system-spec-kit/mcp_server/tests/causal-traversal-bfs-equivalence.vitest.ts:226-233` | active |

## Remediation Workstreams
| Workstream | Findings | Suggested Action |
|------------|----------|------------------|
| Documentation state cleanup | F001 | Close or move the shipped spec open question so the spec state matches implementation-summary continuity. |
| Comment hygiene cleanup | F002 | Replace CTE-specific causal boost comments with traversal-port/BFS wording. |
| Test hardening | F003 | Consider reporting benchmark evidence without a strict wall-clock gate, or use a wider stability threshold. |

## Spec Seed
If a cleanup packet is opened, seed it with: "Reconcile post-ship advisory drift for 012-causal-traversal-bfs: close the remaining spec open question, refresh stale causal boost comments, and harden latency benchmark expectations."

## Plan Seed
- Update `spec.md` open questions to reflect the shipped decision or move the adjacency-cache alert question to a future profiling packet.
- Update `causal-boost.ts` comments that still refer to weighted CTE traversal.
- Rework the latency assertion in `causal-traversal-bfs-equivalence.vitest.ts` to reduce scheduler-noise flake risk while preserving benchmark visibility.
- Re-run `npx vitest run tests/causal-traversal-bfs-equivalence.vitest.ts --reporter verbose`.

## Traceability Status
| Protocol | Gate | Status | Evidence | Summary |
|----------|------|--------|----------|---------|
| spec_code | hard | pass | `.opencode/skills/system-spec-kit/mcp_server/lib/graph/bfs-traversal.ts:283-293`; `.opencode/skills/system-spec-kit/mcp_server/lib/storage/ports/graph-traversal.ts:69-79`; `.opencode/skills/system-spec-kit/mcp_server/lib/storage/memo.ts:215-238` | Shipped traversal claims resolve to code. |
| checklist_evidence | hard | pass | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/012-causal-traversal-bfs/tasks.md:50-72`; `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/012-causal-traversal-bfs/implementation-summary.md:102-108` | Checked tasks carry evidence. |
| feature_catalog_code | advisory | pass | `.opencode/skills/system-spec-kit/mcp_server/lib/storage/ports/graph-traversal.ts:69-79` | Traversal port exposes the shipped BFS modes. |
| playbook_capability | advisory | pass | Focused vitest run passed 4/4. | Equivalence and benchmark suite remains executable. |

## Deferred Items
- F001, F002, and F003 are advisory P2 items and do not block PASS.
- Resource-map coverage was skipped because no packet `resource-map.md` existed at init.
- No acceptance-coverage blocker applies because this is a Level 1 packet with no checklist document.

## Audit Appendix
| Iteration | Focus | Verdict | New Findings Ratio | New P0 | New P1 | New P2 |
|-----------|-------|---------|--------------------|--------|--------|--------|
| 001 | correctness | PASS | 0.00 | 0 | 0 | 0 |
| 002 | security | PASS | 0.00 | 0 | 0 | 0 |
| 003 | traceability | PASS | 1.00 | 0 | 0 | 1 |
| 004 | maintainability | PASS | 1.00 | 0 | 0 | 2 |
| 005 | stabilization | PASS | 0.00 | 0 | 0 | 0 |

Replay validation:
- Dimension coverage: 4/4.
- Required core protocols: pass.
- Active P0/P1: 0.
- Evidence density: every active finding has at least one file:line citation.
- Scope gate: reviewed target files were read-only; writes were confined to the lineage artifact directory.

Verification run:
- Command: `npx vitest run tests/causal-traversal-bfs-equivalence.vitest.ts --reporter verbose`
- Result: PASS, 1 file, 4 tests.
- Benchmark output: `fixture_edges=10240 max_degree=20 seeds=5 hops=2 cte_ms=1.369 bfs_ms=1.157`.
