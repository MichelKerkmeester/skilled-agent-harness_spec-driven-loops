## Focus

Build the final packet matrix and convergence-ready synthesis for iteration 010. This pass preserves iteration 008 ordering, resolves the F-004 packet question, maps every F-001 through F-027 finding plus M-006/M-007 measurements to exactly one final packet, and avoids new broad discovery.

## Actions Taken

- Read the deep-research config, strategy, state log, iteration 007, iteration 008, and deltas iter-001 through iter-008 before writing.
- Reused existing packet drafts and severity refinements instead of reopening source discovery.
- Mapped every finding ID and key measurement to one packet, one final severity, and one verification gate.
- Decided that F-004 folds into `mcp-host-session-process-sweep` rather than becoming a separate daemon reset packet.
- Wrote this convergence synthesis plus the iter-009 JSONL delta and appended the iteration state record.

## Sources Consulted

- `research/deep-research-config.json`
- `research/deep-research-strategy.md`
- `research/deep-research-state.jsonl`
- `research/iterations/iteration-007.md`
- `research/iterations/iteration-008.md`
- `research/deltas/iter-001.jsonl` through `research/deltas/iter-008.jsonl`
- `.opencode/skills/deep-research/SKILL.md`
- `.opencode/skills/deep-research/references/quick_reference.md`

## Findings

The final ordering should remain the iteration 008 ordering, with one adjustment: F-004 folds into `mcp-host-session-process-sweep`. No evidence proves successful-search leak growth, so correctness and lifecycle cleanup stay ahead of resident-memory optimization.

| ID | Final packet | Final severity | Verification gate |
| --- | --- | --- | --- |
| F-001 | `adapter-lifecycle-management` | P2 | mcp-coco-index adapter/rerank/sidecar pytest gate |
| F-002 | `adapter-lifecycle-management` | P2 | mcp-coco-index adapter/rerank/sidecar pytest gate |
| F-003 | `rerank-sidecar-lifecycle` | P1 lifecycle / P2 memory | system-rerank-sidecar start/health/stop pytest gate |
| F-004 | `mcp-host-session-process-sweep` | P1 lifecycle/orchestration | dry-run process inventory and current-PID safety gate |
| F-005 | `daemon-and-mcp-bg-index-task-lifecycle` | P1 | mcp-coco-index bg_index/background/shutdown pytest gate |
| F-006 | `code-graph-launcher-single-owner-and-orphan-reap` | P1 lifecycle / P2 memory | system-code-graph launcher/DB-close test plus build gate |
| F-007 | `code-graph-read-path-friction` | P2 | system-code-graph read-path test plus build gate |
| F-008 | `code-graph-read-path-friction` | P2 | system-code-graph read-path test plus build gate |
| F-009 | `no-action-cosmetic-logging` | no-action/nit | MCP stdio smoke/static gate for inactive TTY-only handler |
| F-010 | `daemon-and-mcp-bg-index-task-lifecycle` | P1 | mcp-coco-index bg_index/background/shutdown pytest gate |
| F-011 | `project-close-full-release` | P2 | mcp-coco-index Project.close/remove_project pytest gate |
| F-012 | `registry-embedder-cache-lifecycle` | P1 | mcp-coco-index embedder/config_hash/refresh pytest gate |
| F-013 | `code-graph-launcher-single-owner-and-orphan-reap` | P1 lifecycle | system-code-graph launcher/DB-close test plus build gate |
| F-014 | `registry-embedder-cache-lifecycle` | P1, narrowed | mcp-coco-index embedder/config_hash/refresh pytest gate |
| F-015 | `adapter-lifecycle-management` | P2 | mcp-coco-index adapter/rerank/sidecar pytest gate |
| F-016 | `registry-embedder-cache-lifecycle` | P1 | mcp-coco-index embedder/config_hash/refresh pytest gate |
| F-017 | `daemon-and-mcp-bg-index-task-lifecycle` | P1 | mcp-coco-index bg_index/background/shutdown pytest gate |
| F-018 | `daemon-and-mcp-bg-index-task-lifecycle` | P1 | mcp-coco-index bg_index/background/shutdown pytest gate |
| F-019 | `daemon-protocol-cancel-index-surface` | P1 | mcp-coco-index cancel_index/protocol/timeout pytest gate |
| F-020 | `daemon-protocol-cancel-index-surface` | P1 | mcp-coco-index cancel_index/protocol/timeout pytest gate |
| F-021 | `daemon-protocol-cancel-index-surface` | P1 as protocol-cancel symptom | mcp-coco-index cancel_index/protocol/timeout pytest gate |
| F-022 | `remove-project-cancel-safety` | P1 | mcp-coco-index remove_project/cancel/index pytest gate |
| F-023 | `adapter-lifecycle-management` | P2 | mcp-coco-index adapter/rerank/sidecar pytest gate |
| F-024 | `adapter-lifecycle-management` | P2 | mcp-coco-index adapter/rerank/sidecar pytest gate |
| F-025 | `project-close-full-release` | P2 | mcp-coco-index Project.close/remove_project pytest gate |
| F-026 | `remove-project-cancel-safety` | P1 when paired with F-022 | mcp-coco-index remove_project/cancel/index pytest gate |
| F-027 | `code-graph-launcher-single-owner-and-orphan-reap` | P1 lifecycle / P2 memory | system-code-graph launcher/DB-close test plus build gate |
| M-006-001 | `adapter-lifecycle-management` | P2-bound evidence | successful-search/fallback RSS benchmark before escalation |
| M-007-001 | `mcp-host-session-process-sweep` | P1 inventory evidence | dry-run process inventory and current-PID safety gate |
| M-007-002 | `adapter-lifecycle-management` | P2-bound evidence | successful-search/fallback RSS benchmark before escalation |

Final packet order:

1. `remove-project-cancel-safety`
2. `daemon-protocol-cancel-index-surface`
3. `daemon-and-mcp-bg-index-task-lifecycle`
4. `code-graph-launcher-single-owner-and-orphan-reap`
5. `mcp-host-session-process-sweep`
6. `rerank-sidecar-lifecycle`
7. `project-close-full-release`
8. `registry-embedder-cache-lifecycle`
9. `adapter-lifecycle-management`
10. `code-graph-read-path-friction`
11. `no-action-cosmetic-logging`

`no-action-cosmetic-logging` is a final-report bucket, not a remediation packet to open. It exists only to keep F-009 mapped exactly once.

Ordering rationale for `research/research.md`: start with daemon correctness because unsafe remove/close races can corrupt active work and are prerequisites for any useful cancellation surface. Next handle caller task lifecycle and code-graph launcher ownership, because they turn cancellation and shutdown into enforceable process boundaries. Then add host/session process sweep and sidecar lifecycle cleanup for detached-process hygiene. Finally address project/registry/adapters/read-path resident-memory work, because current measurements show fixed resident process costs and flat failed-command VM counters, not successful-search leak growth.

## Questions Answered

- Every F-001 through F-027 ID and key M-006/M-007 measurement now maps to exactly one final packet, severity, and verification gate in the matrix above.
- F-004 should fold into `mcp-host-session-process-sweep`. The evidence is operator-owned detached daemon lifecycle; a separate daemon reset packet would duplicate the process-inventory/reset/reap control plane without a distinct source-local fix.
- No unresolved blocker should prevent iteration 010 final synthesis. Remaining items are follow-up verification gates, not synthesis blockers.
- Explicit downgrades for the final report: F-001 P0 to P2, F-002 P0 to P2, F-003 P0 to P1 lifecycle/P2 memory, F-011 P0 to P2, F-012 P0 to P1, F-023/F-024 remain P2, and F-025 remains P2. F-009 is no-action/nit.
- The final report should say that M-006 and M-007 weaken leak-growth claims: they support lifecycle/process-inventory work, but not memory-first P0 ordering.

## Questions Remaining

- What is the RSS slope for repeated successful Python `.venv/bin/ccc search` calls outside the Homebrew `ccc` collision?
- Does a sidecar 5xx/fallback event load the bundled CrossEncoder in this operator environment, and what RSS delta does that produce?
- Which measured parent PIDs for `ccc mcp` children are active hosts versus stale sessions?
- Do the measured code-graph servers share one effective `SPECKIT_CODE_GRAPH_DB_DIR`?

These are implementation-packet verification questions, not blockers for iteration 010 synthesis.

## Ruled Out

- A separate F-004 daemon-reset packet. Fold it into `mcp-host-session-process-sweep`.
- Escalating adapter lifecycle back to P0 from current measurements. M-006 lacks daemon RSS, and M-007 has process inventory plus flat failed-command VM counters, not successful-search growth.
- Treating multiple `ccc mcp` processes as one CocoIndex daemon leak. Iteration 007 already supports host/session multiplicity as the safer interpretation.
- Reordering resident-memory optimization ahead of correctness and lifecycle cleanup without new successful-search evidence.

## Dead Ends

- New broad source discovery was unnecessary for this pass and would have diluted the matrix work.
- New runtime measurement was not attempted; prior deltas already identify the measurement collision and sandbox limits.
- Creating remediation packet folders remains out of scope for this research-only iteration.

## Reflection

- What worked and why: Reusing the existing delta records made the final matrix deterministic; each ID could be assigned without reopening source discovery.
- What did not work and why: The no-action F-009 case does not fit cleanly into a remediation-packet matrix, so it needed an explicit final-report bucket.
- What I would do differently: Add the exact F-ID to packet matrix earlier in the loop, before drafting ticket scopes, so downgrades and folds are visible sooner.

## Next Focus

Iteration 010 should write the final `research/research.md` synthesis from this matrix, preserve the ordering rationale, list non-blocking verification gaps separately, and avoid creating remediation packet folders.

## Recommended Next Focus

Finalize the research synthesis and convergence statement. Use this iteration's matrix as the source of truth for packet order, final severities, downgrades, and verification gates.
