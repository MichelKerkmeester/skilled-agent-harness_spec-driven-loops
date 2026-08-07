## Focus

Finalize the deep-research synthesis and convergence statement for iteration 010. This pass uses iteration 009 as the source of truth for final severities, downgrade decisions, packet ordering, and verification gates.

## Actions Taken

- Read the configured research packet state, strategy, state log, iterations 007 through 009, iter-009 delta, earlier delta summaries as needed, and the iteration 007 runtime measurement log.
- Wrote the final `research/research.md` synthesis with title, scope, executive summary, convergence statement, final finding clusters, final F-ID matrix, remediation order, measurement notes, downgrade notes, non-goals, and references.
- Prepared the iteration 010 state record and delta records without new broad discovery.
- Kept the remaining RSS, fallback, parent-PID, and DB-dir questions as implementation-packet verification gates rather than synthesis blockers.

## Sources Consulted

- `research/deep-research-config.json`
- `research/deep-research-strategy.md`
- `research/deep-research-state.jsonl`
- `research/iterations/iteration-007.md`
- `research/iterations/iteration-008.md`
- `research/iterations/iteration-009.md`
- `research/deltas/iter-001.jsonl` through `research/deltas/iter-009.jsonl`
- `research/logs/iteration-007-runtime-measurement.json`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/client.py`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/protocol.py`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/project.py`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py`
- `.opencode/bin/mk-code-index-launcher.cjs`
- `.opencode/skills/system-code-graph/mcp_server/index.ts`
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts`
- `.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts`
- `.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts`
- `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py`

## Findings

Final synthesis is unblocked. Iteration 009 already produced the decisive matrix: correctness and lifecycle cleanup outrank resident-memory optimization because the strongest evidence is unsafe cancel/remove/close behavior, detached/orphan-prone process lifecycle, and code-graph ownership hazards. Current measurements show resident process costs and failed-command VM stability, not successful-search memory growth.

P1 clusters:

- `remove-project-cancel-safety`: F-022 and F-026 close-under-write risk.
- `daemon-protocol-cancel-index-surface`: F-019 through F-021 cancel/protocol timeout gap.
- `daemon-and-mcp-bg-index-task-lifecycle`: F-005, F-010, F-017, F-018 task ownership and shutdown.
- `code-graph-launcher-single-owner-and-orphan-reap`: F-006, F-013, F-027 launcher/server ownership and DB-close safety.
- `mcp-host-session-process-sweep`: F-004 and M-007 inventory evidence, as orchestration hygiene.
- `rerank-sidecar-lifecycle`: F-003 as lifecycle first, memory second.
- `registry-embedder-cache-lifecycle`: F-012, F-014, F-016 deterministic retained embedder state.

P2 clusters:

- `project-close-full-release`: F-011 and F-025 shallow close behavior, with F-026 only P1 when paired with F-022.
- `adapter-lifecycle-management`: F-001, F-002, F-015, F-023, F-024 plus M-006/M-007 measurement bounds.
- `code-graph-read-path-friction`: F-007 and F-008 read-path child process and socket/transport retention friction.

No-action cluster:

- `no-action-cosmetic-logging`: F-009 remains a nit/no-action bucket, not a remediation packet.

## Questions Answered

- Are there synthesis blockers? No. Ten iterations are complete, and the remaining questions are verification gates for implementation packets.
- Does resident-memory optimization outrank lifecycle/correctness cleanup? No. Current evidence supports resident-memory follow-up, but not memory-first P0 ordering.
- Does F-004 need a standalone packet? No. It folds into `mcp-host-session-process-sweep` because the dry-run inventory, age/lineage classification, and termination-safety control plane are the same.
- What should iteration 010 produce? The final synthesis report plus iteration/delta/state records only; no target source changes and no follow-up packet directories.

## Questions Remaining

- What is the RSS slope for repeated successful Python `.venv/bin/ccc search` calls outside the Homebrew `ccc` collision?
- Does a sidecar 5xx/fallback event load the bundled CrossEncoder in this operator environment, and what RSS delta does it produce?
- Which measured parent PIDs for `ccc mcp` children are active hosts versus stale sessions?
- Do the measured code-graph servers share one effective `SPECKIT_CODE_GRAPH_DB_DIR`?

These are packet-level verification gates, not blockers for final synthesis.

## Ruled Out

- Blocking final synthesis on new runtime measurement. Iteration 009 already separated verification gaps from synthesis blockers.
- Escalating adapter or sidecar memory work back to P0 without successful-search or fallback growth evidence.
- Treating multiple `ccc mcp` children as proof of one CocoIndex daemon leak.
- Creating a separate F-004 daemon reset packet instead of folding it into process sweep.

## Dead Ends

- New broad source discovery was not useful for the final pass; it would have diluted the iteration 009 matrix.
- New runtime measurement was not attempted because prior iterations already identified the sandbox limits and Homebrew `ccc` collision.
- Creating remediation packet folders stayed out of scope for this research-only iteration.

## Reflection

- What worked and why: Using iteration 009 as the authority made the final synthesis deterministic and kept severity/order decisions stable.
- What did not work and why: The remaining measurement gaps cannot be resolved inside this synthesis pass because they require successful non-Homebrew code-index searches and controlled sidecar fallback measurement.
- What I would do differently: Add the final matrix to the progressive `research.md` earlier in future loops so the last iteration only polishes convergence language.

## Next Focus

No next research iteration. The loop reached iteration 010 of 010 and is synthesis-complete.

## Recommended Next Focus

Open implementation packets in the final remediation order, starting with `remove-project-cancel-safety`, and run each packet's verification gate before claiming completion.
