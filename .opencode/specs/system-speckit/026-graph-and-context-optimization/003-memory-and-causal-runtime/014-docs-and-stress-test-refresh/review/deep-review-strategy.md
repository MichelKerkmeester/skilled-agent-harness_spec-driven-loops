# Deep Review Strategy

<!-- ANCHOR:deep-review-014-session-work -->

## Review Charter

- **Target:** Session work — the `014-docs-and-stress-test-refresh` packet (parent + 4 children: 001 manual-testing-playbook, 002 feature-catalog, 003 README-cluster, 004 stress durability domain), the `013` continuity reconciliation + 3 changelogs, and the serverInfo `1.7.2`→`1.8.0` fix.
- **Target type:** files (73 files; see `deep-review-config.json` → `reviewScopeFiles`, full list at scope manifest).
- **Executor:** cli-opencode `openai/gpt-5.5-fast` `--variant xhigh` (direct-on-main, RM-8 L1 read-only/banned-ops prompt guards).
- **Max iterations:** 20 | **Convergence threshold:** 0.10 (severity-weighted new-findings ratio).

## Dimensions (risk-ordered)

1. **correctness** — do the documented behaviors match the real source anchors? Are the stress-test assertions/isolation sound? Do the continuity/status reconciliations reflect deployed reality?
2. **security** — does any new doc/test leak secrets, weaken a guard, or misstate a safety contract? Stress isolation must never touch the production DB/socket.
3. **traceability** — every behavioral claim traces to a cited source anchor (schema v28/v29/v30, serverInfo 1.8.0, `-32001` live / `-32002` fail-closed, checkpoint-v2 fns, `SPECKIT_BACKEND_ONLY`). Spec ↔ code, checklist ↔ evidence, feature-catalog ↔ code, playbook ↔ support.
4. **maintainability** — doc/test clarity, comment hygiene in the stress `.ts` (no spec-paths/packet-ids/phase-numbers), additive (no restructuring), durable WHY.

## Highest-value targets

- `mcp_server/stress_test/durability/*.vitest.ts` (4 files) — the only new executable CODE; verify isolation (throwaway DBs only), assertions match documented behaviors, no production-DB access, comment hygiene.
- README cluster + ENV_REFERENCE: `SPECKIT_BACKEND_ONLY`, schema v28–v30 narrative, error-code table, 36-tool count (verify not bumped), footer.
- feature_catalog + playbook: accuracy of checkpoint-v2 / front-proxy / enrichment / sk-git claims vs source.
- `context-server.ts` serverInfo `1.8.0`.

## Known accuracy guardrails (must hold in the reviewed work)

- `-32001` documented as the LIVE retryable-recycle error (NOT "removed"); only the index vector-drain outage class changed.
- 36-tool count VERIFIED (mk-spec-memory), not blindly bumped to 43.
- Every behavioral claim traces to a real source anchor.

## Known Context

Prior verification already passed: `validate.sh --strict` 0/0 on parent + 4 children; full stress suite 102/102; the build workflow's own 4-lens + Opus reviews; live `memory_health` healthy + schema v30. This review is an independent adversarial pass over that work.

<!-- /ANCHOR:deep-review-014-session-work -->

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->

<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 10
- P2 (Suggestions): 8
- Resolved: 0

<!-- /ANCHOR:running-findings -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `014_parent_children_completion_metadata`: No new finding. Parent and child status/completion fields consistently say complete/shipped. The parent graph `causal_summary` still repeats the historical problem statement (“do not yet describe these capabilities”), but because the same problem statement remains in `spec.md` and the status fields are complete, this pass treats it as low-signal historical context rather than a separate completion-metadata defect. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: `014_parent_children_completion_metadata`: No new finding. Parent and child status/completion fields consistently say complete/shipped. The parent graph `causal_summary` still repeats the historical problem statement (“do not yet describe these capabilities”), but because the same problem statement remains in `spec.md` and the status fields are complete, this pass treats it as low-signal historical context rather than a separate completion-metadata defect.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `014_parent_children_completion_metadata`: No new finding. Parent and child status/completion fields consistently say complete/shipped. The parent graph `causal_summary` still repeats the historical problem statement (“do not yet describe these capabilities”), but because the same problem statement remains in `spec.md` and the status fields are complete, this pass treats it as low-signal historical context rather than a separate completion-metadata defect.

### `additive_not_restructured`: PASS for sampled docs. The 004 spec says production runtime code is out of scope, and the implementation summary describes additive tests plus one script only. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: `additive_not_restructured`: PASS for sampled docs. The 004 spec says production runtime code is out of scope, and the implementation summary describes additive tests plus one script only.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `additive_not_restructured`: PASS for sampled docs. The 004 spec says production runtime code is out of scope, and the implementation summary describes additive tests plus one script only.

### `agent_cross_runtime`: N/A for this iteration. The reviewed 014 deltas sampled here did not add a cross-runtime agent capability beyond existing root playbook orchestration notes. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `agent_cross_runtime`: N/A for this iteration. The reviewed 014 deltas sampled here did not add a cross-runtime agent capability beyond existing root playbook orchestration notes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime`: N/A for this iteration. The reviewed 014 deltas sampled here did not add a cross-runtime agent capability beyond existing root playbook orchestration notes.

### `agent_cross_runtime`: Not applicable in this correctness pass. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `agent_cross_runtime`: Not applicable in this correctness pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime`: Not applicable in this correctness pass.

### `agent_cross_runtime`: Pass for backend-only documentation in the assigned slice. Source gates stdio transport on `SPECKIT_BACKEND_ONLY === '1'`, and the playbook describes the same backend-only mode. -- BLOCKED (iteration 20, 1 attempts)
- What was tried: `agent_cross_runtime`: Pass for backend-only documentation in the assigned slice. Source gates stdio transport on `SPECKIT_BACKEND_ONLY === '1'`, and the playbook describes the same backend-only mode.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime`: Pass for backend-only documentation in the assigned slice. Source gates stdio transport on `SPECKIT_BACKEND_ONLY === '1'`, and the playbook describes the same backend-only mode.

### `backend_only_transport_bypass`: PASS. `SPECKIT_BACKEND_ONLY=1` skips stdio connection and still starts the IPC socket path, matching the documented backend-mode boundary. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:2126`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:2141`] [SOURCE: `.opencode/skills/system-spec-kit/manual_testing_playbook/14--pipeline-architecture/front-proxy-reconnect-and-backend-only.md:68`] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `backend_only_transport_bypass`: PASS. `SPECKIT_BACKEND_ONLY=1` skips stdio connection and still starts the IPC socket path, matching the documented backend-mode boundary. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:2126`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:2141`] [SOURCE: `.opencode/skills/system-spec-kit/manual_testing_playbook/14--pipeline-architecture/front-proxy-reconnect-and-backend-only.md:68`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `backend_only_transport_bypass`: PASS. `SPECKIT_BACKEND_ONLY=1` skips stdio connection and still starts the IPC socket path, matching the documented backend-mode boundary. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:2126`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:2141`] [SOURCE: `.opencode/skills/system-spec-kit/manual_testing_playbook/14--pipeline-architecture/front-proxy-reconnect-and-backend-only.md:68`]

### `checklist_evidence`: Deferred to the traceability dimension. This correctness inventory used implementation-summary and decision-record anchors only where needed to assess stress-domain claims. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `checklist_evidence`: Deferred to the traceability dimension. This correctness inventory used implementation-summary and decision-record anchors only where needed to assess stress-domain claims.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: Deferred to the traceability dimension. This correctness inventory used implementation-summary and decision-record anchors only where needed to assess stress-domain claims.

### `checklist_evidence`: Existing serverInfo and tool-count traceability failures remain deduped under `R3-P1-001` and `R3-P1-002`; this iteration did not re-report them. -- BLOCKED (iteration 20, 1 attempts)
- What was tried: `checklist_evidence`: Existing serverInfo and tool-count traceability failures remain deduped under `R3-P1-001` and `R3-P1-002`; this iteration did not re-report them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: Existing serverInfo and tool-count traceability failures remain deduped under `R3-P1-001` and `R3-P1-002`; this iteration did not re-report them.

### `checklist_evidence`: FAIL. Tool-count and serverInfo verification rows claim current source-anchor checks that no longer match source. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `checklist_evidence`: FAIL. Tool-count and serverInfo verification rows claim current source-anchor checks that no longer match source.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: FAIL. Tool-count and serverInfo verification rows claim current source-anchor checks that no longer match source.

### `checklist_evidence`: N/A for this slice; no checklist rows were adjudicated in iteration 009. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: `checklist_evidence`: N/A for this slice; no checklist rows were adjudicated in iteration 009.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: N/A for this slice; no checklist rows were adjudicated in iteration 009.

### `checklist_evidence`: Not re-opened for prior serverInfo/tool-count findings; those remain recorded as `R3-P1-001` and `R3-P1-002` and were not duplicated. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: `checklist_evidence`: Not re-opened for prior serverInfo/tool-count findings; those remain recorded as `R3-P1-001` and `R3-P1-002` and were not duplicated.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: Not re-opened for prior serverInfo/tool-count findings; those remain recorded as `R3-P1-001` and `R3-P1-002` and were not duplicated.

### `checkpoint_catalog_vs_disk_invariant`: FAIL. README scope row says the catalog stays bounded, while the source-backed stress invariant is bounded on-disk snapshot directories. New finding `R5-P1-001` records this as a separate doc-vs-source correctness issue, distinct from prior `R1-P2-001` snapshotFormat masking. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/README.md:21`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/checkpoint-v2-contention-stress.vitest.ts:180`] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `checkpoint_catalog_vs_disk_invariant`: FAIL. README scope row says the catalog stays bounded, while the source-backed stress invariant is bounded on-disk snapshot directories. New finding `R5-P1-001` records this as a separate doc-vs-source correctness issue, distinct from prior `R1-P2-001` snapshotFormat masking. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/README.md:21`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/checkpoint-v2-contention-stress.vitest.ts:180`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checkpoint_catalog_vs_disk_invariant`: FAIL. README scope row says the catalog stays bounded, while the source-backed stress invariant is bounded on-disk snapshot directories. New finding `R5-P1-001` records this as a separate doc-vs-source correctness issue, distinct from prior `R1-P2-001` snapshotFormat masking. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/README.md:21`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/checkpoint-v2-contention-stress.vitest.ts:180`]

### `checkpoint_create_v2`: PASS. Catalog claims about v2 full-DB selection, `VACUUM main INTO`, optional `active_vec` snapshot, manifest, `snapshot_format='v2'`, and dir-aware pruning match `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1023`, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2217`, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2220`, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2263`, and `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2279`. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: `checkpoint_create_v2`: PASS. Catalog claims about v2 full-DB selection, `VACUUM main INTO`, optional `active_vec` snapshot, manifest, `snapshot_format='v2'`, and dir-aware pruning match `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1023`, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2217`, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2220`, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2263`, and `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2279`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checkpoint_create_v2`: PASS. Catalog claims about v2 full-DB selection, `VACUUM main INTO`, optional `active_vec` snapshot, manifest, `snapshot_format='v2'`, and dir-aware pruning match `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1023`, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2217`, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2220`, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2263`, and `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2279`.

### `checkpoint_restore_v2`: PASS. Catalog claims about restore barrier, schema/embedder guards, journal phases, post-restore rebuild, and barrier release match `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2535`, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2539`, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2550`, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2585`, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2639`, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2666`, and `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2730`. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: `checkpoint_restore_v2`: PASS. Catalog claims about restore barrier, schema/embedder guards, journal phases, post-restore rebuild, and barrier release match `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2535`, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2539`, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2550`, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2585`, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2639`, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2666`, and `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2730`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checkpoint_restore_v2`: PASS. Catalog claims about restore barrier, schema/embedder guards, journal phases, post-restore rebuild, and barrier release match `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2535`, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2539`, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2550`, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2585`, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2639`, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2666`, and `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2730`.

### `checkpoint_v2_contention_contract`: Deduped/ruled out for new findings. `createCheckpointV2` now returns `snapshotFormat: 'v2'`, restore takes/releases the barrier around the swap, and the on-disk orphan/live-dir checks align with the current v2 disk invariant. Prior `R1-P2-001` and `R5-P1-001` cover the known snapshotFormat assertion weakness and catalog-vs-disk wording drift. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: `checkpoint_v2_contention_contract`: Deduped/ruled out for new findings. `createCheckpointV2` now returns `snapshotFormat: 'v2'`, restore takes/releases the barrier around the swap, and the on-disk orphan/live-dir checks align with the current v2 disk invariant. Prior `R1-P2-001` and `R5-P1-001` cover the known snapshotFormat assertion weakness and catalog-vs-disk wording drift.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checkpoint_v2_contention_contract`: Deduped/ruled out for new findings. `createCheckpointV2` now returns `snapshotFormat: 'v2'`, restore takes/releases the barrier around the swap, and the on-disk orphan/live-dir checks align with the current v2 disk invariant. Prior `R1-P2-001` and `R5-P1-001` cover the known snapshotFormat assertion weakness and catalog-vs-disk wording drift.

### `code_graph`: BLOCKED for structural traversal because `code_graph_status` reported stale readiness (`git HEAD changed`, stale files above threshold, deleted tracked files). This docs-focused pass used direct reads and exact search instead. -- BLOCKED (iteration 18, 1 attempts)
- What was tried: `code_graph`: BLOCKED for structural traversal because `code_graph_status` reported stale readiness (`git HEAD changed`, stale files above threshold, deleted tracked files). This docs-focused pass used direct reads and exact search instead.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `code_graph`: BLOCKED for structural traversal because `code_graph_status` reported stale readiness (`git HEAD changed`, stale files above threshold, deleted tracked files). This docs-focused pass used direct reads and exact search instead.

### `code_graph`: BLOCKED. `code_graph_status` reported stale readiness because git HEAD changed and stale/deleted thresholds were exceeded; this pass used graphless fallback with direct reads and exact searches. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: `code_graph`: BLOCKED. `code_graph_status` reported stale readiness because git HEAD changed and stale/deleted thresholds were exceeded; this pass used graphless fallback with direct reads and exact searches.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `code_graph`: BLOCKED. `code_graph_status` reported stale readiness because git HEAD changed and stale/deleted thresholds were exceeded; this pass used graphless fallback with direct reads and exact searches.

### `code_graph`: BLOCKED. `code_graph_status` reported stale readiness, so this iteration used graphless fallback through direct reads and exact searches. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: `code_graph`: BLOCKED. `code_graph_status` reported stale readiness, so this iteration used graphless fallback through direct reads and exact searches.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `code_graph`: BLOCKED. `code_graph_status` reported stale readiness, so this iteration used graphless fallback through direct reads and exact searches.

### `code_graph`: BLOCKED. `code_graph_status` reports stale readiness because git HEAD changed and stale-file/deleted-file thresholds were exceeded; this pass used graphless fallback through direct reads and exact searches. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: `code_graph`: BLOCKED. `code_graph_status` reports stale readiness because git HEAD changed and stale-file/deleted-file thresholds were exceeded; this pass used graphless fallback through direct reads and exact searches.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `code_graph`: BLOCKED. `code_graph_status` reports stale readiness because git HEAD changed and stale-file/deleted-file thresholds were exceeded; this pass used graphless fallback through direct reads and exact searches.

### `code_graph`: BLOCKED. Structural graph traversal was not used because the code graph was stale; direct reads and exact searches provided graphless fallback coverage. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: `code_graph`: BLOCKED. Structural graph traversal was not used because the code graph was stale; direct reads and exact searches provided graphless fallback coverage.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `code_graph`: BLOCKED. Structural graph traversal was not used because the code graph was stale; direct reads and exact searches provided graphless fallback coverage.

### `code_graph`: Not used. Prior strategy records stale readiness; this pass used direct reads and exact searches as graphless fallback. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: `code_graph`: Not used. Prior strategy records stale readiness; this pass used direct reads and exact searches as graphless fallback.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `code_graph`: Not used. Prior strategy records stale readiness; this pass used direct reads and exact searches as graphless fallback.

### `comment_hygiene`: PASS. Exact search over `stress_test/durability/*.ts` found no packet/spec IDs, ADR IDs, task/checklist/finding labels, or transient review breadcrumbs in code comments. The single match was the durable product path `~/.mk-spec-memory`, not an ephemeral artifact label. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/checkpoint-v2-contention-stress.vitest.ts:14`] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `comment_hygiene`: PASS. Exact search over `stress_test/durability/*.ts` found no packet/spec IDs, ADR IDs, task/checklist/finding labels, or transient review breadcrumbs in code comments. The single match was the durable product path `~/.mk-spec-memory`, not an ephemeral artifact label. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/checkpoint-v2-contention-stress.vitest.ts:14`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `comment_hygiene`: PASS. Exact search over `stress_test/durability/*.ts` found no packet/spec IDs, ADR IDs, task/checklist/finding labels, or transient review breadcrumbs in code comments. The single match was the durable product path `~/.mk-spec-memory`, not an ephemeral artifact label. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/checkpoint-v2-contention-stress.vitest.ts:14`]

### `comment_hygiene`: PASS. Exact search over durability stress `.ts` comments found no spec-folder paths, packet/phase labels, ADR/REQ/CHK labels, finding ids, TODO/FIXME, `.only`, `.skip`, randomness, or sleep markers. The sampled top-of-file comments explain durable purpose and isolation boundaries. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: `comment_hygiene`: PASS. Exact search over durability stress `.ts` comments found no spec-folder paths, packet/phase labels, ADR/REQ/CHK labels, finding ids, TODO/FIXME, `.only`, `.skip`, randomness, or sleep markers. The sampled top-of-file comments explain durable purpose and isolation boundaries.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `comment_hygiene`: PASS. Exact search over durability stress `.ts` comments found no spec-folder paths, packet/phase labels, ADR/REQ/CHK labels, finding ids, TODO/FIXME, `.only`, `.skip`, randomness, or sleep markers. The sampled top-of-file comments explain durable purpose and isolation boundaries.

### `daemon_recycle_replay_model`: DEDUPED. The model-vs-production replay concern is already active as `R1-P1-001`; this pass did not emit a duplicate. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/review/deep-review-findings-registry.json:11`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-recycle-transparency-stress.vitest.ts:76`] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `daemon_recycle_replay_model`: DEDUPED. The model-vs-production replay concern is already active as `R1-P1-001`; this pass did not emit a duplicate. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/review/deep-review-findings-registry.json:11`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-recycle-transparency-stress.vitest.ts:76`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `daemon_recycle_replay_model`: DEDUPED. The model-vs-production replay concern is already active as `R1-P1-001`; this pass did not emit a duplicate. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/review/deep-review-findings-registry.json:11`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-recycle-transparency-stress.vitest.ts:76`]

### `daemon_replay_snapshot_model`: Deduped/ruled out for new findings. The test still locally models `replaySnapshot`, but that is already active as `R1-P1-001`; this pass found no additional non-duplicate correctness issue in the sampled replay partition/classifier assertions. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: `daemon_replay_snapshot_model`: Deduped/ruled out for new findings. The test still locally models `replaySnapshot`, but that is already active as `R1-P1-001`; this pass found no additional non-duplicate correctness issue in the sampled replay partition/classifier assertions.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `daemon_replay_snapshot_model`: Deduped/ruled out for new findings. The test still locally models `replaySnapshot`, but that is already active as `R1-P1-001`; this pass found no additional non-duplicate correctness issue in the sampled replay partition/classifier assertions.

### `docs_count_duplication`: DEDUPED. Hard-coded tool-count drift is already an active traceability P1 (`R3-P1-002`) and was not re-emitted as a separate maintainability finding. The reviewed docs still show the same evidence surface: feature catalog `55` vs `54`, root README `36`, and implementation summaries claiming `36`/`1.7.2`. [SOURCE: `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:48`] [SOURCE: `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:60`] [SOURCE: `.opencode/skills/system-spec-kit/README.md:45`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/002-feature-catalog-update/implementation-summary.md:109`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/003-readme-cluster-update/implementation-summary.md:72`] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `docs_count_duplication`: DEDUPED. Hard-coded tool-count drift is already an active traceability P1 (`R3-P1-002`) and was not re-emitted as a separate maintainability finding. The reviewed docs still show the same evidence surface: feature catalog `55` vs `54`, root README `36`, and implementation summaries claiming `36`/`1.7.2`. [SOURCE: `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:48`] [SOURCE: `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:60`] [SOURCE: `.opencode/skills/system-spec-kit/README.md:45`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/002-feature-catalog-update/implementation-summary.md:109`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/003-readme-cluster-update/implementation-summary.md:72`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `docs_count_duplication`: DEDUPED. Hard-coded tool-count drift is already an active traceability P1 (`R3-P1-002`) and was not re-emitted as a separate maintainability finding. The reviewed docs still show the same evidence surface: feature catalog `55` vs `54`, root README `36`, and implementation summaries claiming `36`/`1.7.2`. [SOURCE: `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:48`] [SOURCE: `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:60`] [SOURCE: `.opencode/skills/system-spec-kit/README.md:45`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/002-feature-catalog-update/implementation-summary.md:109`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/003-readme-cluster-update/implementation-summary.md:72`]

### `enrichment_marker_backfill_contract`: New P2. The stress conflates all partial-index rows with the repairable backlog and omits the intentionally non-repaired `deferred` status. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: `enrichment_marker_backfill_contract`: New P2. The stress conflates all partial-index rows with the repairable backlog and omits the intentionally non-repaired `deferred` status.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `enrichment_marker_backfill_contract`: New P2. The stress conflates all partial-index rows with the repairable backlog and omits the intentionally non-repaired `deferred` status.

### `enrichment_marker_backfill_convergence`: PASS for this pass. The stress floods `pending` markers, bounded repair scans only pending/partial/failed rows, and the test asserts the incomplete set reaches zero with per-pass work bounded by `BACKFILL_LIMIT`. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/enrichment-marker-backfill-stress.vitest.ts:139`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/save/enrichment-state.ts:230`] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `enrichment_marker_backfill_convergence`: PASS for this pass. The stress floods `pending` markers, bounded repair scans only pending/partial/failed rows, and the test asserts the incomplete set reaches zero with per-pass work bounded by `BACKFILL_LIMIT`. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/enrichment-marker-backfill-stress.vitest.ts:139`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/save/enrichment-state.ts:230`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `enrichment_marker_backfill_convergence`: PASS for this pass. The stress floods `pending` markers, bounded repair scans only pending/partial/failed rows, and the test asserts the incomplete set reaches zero with per-pass work bounded by `BACKFILL_LIMIT`. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/enrichment-marker-backfill-stress.vitest.ts:139`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/save/enrichment-state.ts:230`]

### `enrichment_marker`: PASS. Pending/result recording, status values, repair selection, and schema/index claims match `.opencode/skills/system-spec-kit/mcp_server/handlers/save/enrichment-state.ts:19`, `.opencode/skills/system-spec-kit/mcp_server/handlers/save/enrichment-state.ts:154`, `.opencode/skills/system-spec-kit/mcp_server/handlers/save/enrichment-state.ts:169`, `.opencode/skills/system-spec-kit/mcp_server/handlers/save/enrichment-state.ts:230`, and `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2623`. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: `enrichment_marker`: PASS. Pending/result recording, status values, repair selection, and schema/index claims match `.opencode/skills/system-spec-kit/mcp_server/handlers/save/enrichment-state.ts:19`, `.opencode/skills/system-spec-kit/mcp_server/handlers/save/enrichment-state.ts:154`, `.opencode/skills/system-spec-kit/mcp_server/handlers/save/enrichment-state.ts:169`, `.opencode/skills/system-spec-kit/mcp_server/handlers/save/enrichment-state.ts:230`, and `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2623`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `enrichment_marker`: PASS. Pending/result recording, status values, repair selection, and schema/index claims match `.opencode/skills/system-spec-kit/mcp_server/handlers/save/enrichment-state.ts:19`, `.opencode/skills/system-spec-kit/mcp_server/handlers/save/enrichment-state.ts:154`, `.opencode/skills/system-spec-kit/mcp_server/handlers/save/enrichment-state.ts:169`, `.opencode/skills/system-spec-kit/mcp_server/handlers/save/enrichment-state.ts:230`, and `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2623`.

### `error_code_reference`: PASS except the P2 replay wording above. `E429`, `-32001`, and `-32002` source anchors match `.opencode/skills/system-spec-kit/mcp_server/lib/errors/core.ts:101`, `.opencode/bin/lib/launcher-session-proxy.cjs:18`, `.opencode/bin/lib/launcher-session-proxy.cjs:23`, and `.opencode/bin/lib/launcher-session-proxy.cjs:607`. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: `error_code_reference`: PASS except the P2 replay wording above. `E429`, `-32001`, and `-32002` source anchors match `.opencode/skills/system-spec-kit/mcp_server/lib/errors/core.ts:101`, `.opencode/bin/lib/launcher-session-proxy.cjs:18`, `.opencode/bin/lib/launcher-session-proxy.cjs:23`, and `.opencode/bin/lib/launcher-session-proxy.cjs:607`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `error_code_reference`: PASS except the P2 replay wording above. `E429`, `-32001`, and `-32002` source anchors match `.opencode/skills/system-spec-kit/mcp_server/lib/errors/core.ts:101`, `.opencode/bin/lib/launcher-session-proxy.cjs:18`, `.opencode/bin/lib/launcher-session-proxy.cjs:23`, and `.opencode/bin/lib/launcher-session-proxy.cjs:607`.

### `error_codes_front_proxy`: PASS. `-32001` remains retryable/live and `-32002` remains non-retryable fail-closed in docs and source. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `error_codes_front_proxy`: PASS. `-32001` remains retryable/live and `-32002` remains non-retryable fail-closed in docs and source.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `error_codes_front_proxy`: PASS. `-32001` remains retryable/live and `-32002` remains non-retryable fail-closed in docs and source.

### `EX-037 checkpoint_create_surface`: Finding `R16-P1-001`. The documented `includeEmbeddings:true` precondition reaches an unsupported strict-schema parameter at the normal MCP boundary. -- BLOCKED (iteration 16, 1 attempts)
- What was tried: `EX-037 checkpoint_create_surface`: Finding `R16-P1-001`. The documented `includeEmbeddings:true` precondition reaches an unsupported strict-schema parameter at the normal MCP boundary.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `EX-037 checkpoint_create_surface`: Finding `R16-P1-001`. The documented `includeEmbeddings:true` precondition reaches an unsupported strict-schema parameter at the normal MCP boundary.

### `EX-037 scratch_restore_surface`: Finding `R16-P1-002`. The documented restore command does not bind the restore to a scratch DB through any supported per-call tool flag. -- BLOCKED (iteration 16, 1 attempts)
- What was tried: `EX-037 scratch_restore_surface`: Finding `R16-P1-002`. The documented restore command does not bind the restore to a scratch DB through any supported per-call tool flag.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `EX-037 scratch_restore_surface`: Finding `R16-P1-002`. The documented restore command does not bind the restore to a scratch DB through any supported per-call tool flag.

### `EX-038 enrichment_marker_lifecycle`: Deferred as an underspecified operator setup detail, not elevated to a new finding in this pass. `memory_save` and `memory_index_scan` are supported surfaces, and production repair/backfill code exists, but the playbook's row-status read and incomplete-marker setup rely on DB/operator access that is not spelled out as a tool command. -- BLOCKED (iteration 16, 1 attempts)
- What was tried: `EX-038 enrichment_marker_lifecycle`: Deferred as an underspecified operator setup detail, not elevated to a new finding in this pass. `memory_save` and `memory_index_scan` are supported surfaces, and production repair/backfill code exists, but the playbook's row-status read and incomplete-marker setup rely on DB/operator access that is not spelled out as a tool command.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `EX-038 enrichment_marker_lifecycle`: Deferred as an underspecified operator setup detail, not elevated to a new finding in this pass. `memory_save` and `memory_index_scan` are supported surfaces, and production repair/backfill code exists, but the playbook's row-status read and incomplete-marker setup rely on DB/operator access that is not spelled out as a tool command.

### `EX-039 index_scan_surface`: Ruled out for new findings in this slice. `memory_index_scan` supports `force`; the handler acquires a lease, reports `complete_with_pending_vectors` / `pendingVectors`, includes `moveReconciled`, and carries `checkpointRepair` in the response. The prior active finding `R9-P1-001` already covers EX-039 move-reconciliation overstatement. -- BLOCKED (iteration 16, 1 attempts)
- What was tried: `EX-039 index_scan_surface`: Ruled out for new findings in this slice. `memory_index_scan` supports `force`; the handler acquires a lease, reports `complete_with_pending_vectors` / `pendingVectors`, includes `moveReconciled`, and carries `checkpointRepair` in the response. The prior active finding `R9-P1-001` already covers EX-039 move-reconciliation overstatement.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `EX-039 index_scan_surface`: Ruled out for new findings in this slice. `memory_index_scan` supports `force`; the handler acquires a lease, reports `complete_with_pending_vectors` / `pendingVectors`, includes `moveReconciled`, and carries `checkpointRepair` in the response. The prior active finding `R9-P1-001` already covers EX-039 move-reconciliation overstatement.

### `EX-040 front_proxy_backend_only_surface`: Ruled out for new findings. `SPECKIT_BACKEND_ONLY=1` is documented and implemented as a server boot guard before stdio connection; prior iterations already covered README/ENV drift for this surface. -- BLOCKED (iteration 16, 1 attempts)
- What was tried: `EX-040 front_proxy_backend_only_surface`: Ruled out for new findings. `SPECKIT_BACKEND_ONLY=1` is documented and implemented as a server boot guard before stdio connection; prior iterations already covered README/ENV drift for this surface.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `EX-040 front_proxy_backend_only_surface`: Ruled out for new findings. `SPECKIT_BACKEND_ONLY=1` is documented and implemented as a server boot guard before stdio connection; prior iterations already covered README/ENV drift for this surface.

### `EX-041 sk_git_worktree_surface`: Ruled out for new findings. The worktree command and numbered branch/directory convention are supported by sk-git references. The scenario remains operator-mediated and must honor sk-git ask-first rules before executing git writes. -- BLOCKED (iteration 16, 1 attempts)
- What was tried: `EX-041 sk_git_worktree_surface`: Ruled out for new findings. The worktree command and numbered branch/directory convention are supported by sk-git references. The scenario remains operator-mediated and must honor sk-git ask-first rules before executing git writes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `EX-041 sk_git_worktree_surface`: Ruled out for new findings. The worktree command and numbered branch/directory convention are supported by sk-git references. The scenario remains operator-mediated and must honor sk-git ask-first rules before executing git writes.

### `EX-042 needs_rebuild_surface`: Ruled out for new findings. Boot repair and scan-lease repair entry points exist, and `memory_index_scan` surfaces the checkpoint repair counts in its response. -- BLOCKED (iteration 16, 1 attempts)
- What was tried: `EX-042 needs_rebuild_surface`: Ruled out for new findings. Boot repair and scan-lease repair entry points exist, and `memory_index_scan` surfaces the checkpoint repair counts in its response.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `EX-042 needs_rebuild_surface`: Ruled out for new findings. Boot repair and scan-lease repair entry points exist, and `memory_index_scan` surfaces the checkpoint repair counts in its response.

### `feature_catalog_code`: Deferred to traceability. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `feature_catalog_code`: Deferred to traceability.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: Deferred to traceability.

### `feature_catalog_code`: Fail for `E429` in `error-code-reference.md`; pass for `-32001` live and `-32002` fail-closed semantics. -- BLOCKED (iteration 20, 1 attempts)
- What was tried: `feature_catalog_code`: Fail for `E429` in `error-code-reference.md`; pass for `-32001` live and `-32002` fail-closed semantics.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: Fail for `E429` in `error-code-reference.md`; pass for `-32001` live and `-32002` fail-closed semantics.

### `feature_catalog_code`: FAIL. Feature catalog root count claims conflict with the package-local `TOOL_DEFINITIONS` source. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `feature_catalog_code`: FAIL. Feature catalog root count claims conflict with the package-local `TOOL_DEFINITIONS` source.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: FAIL. Feature catalog root count claims conflict with the package-local `TOOL_DEFINITIONS` source.

### `feature_catalog_code`: Not re-reported; prior tool-count drift remains active and outside this slice. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: `feature_catalog_code`: Not re-reported; prior tool-count drift remains active and outside this slice.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: Not re-reported; prior tool-count drift remains active and outside this slice.

### `feature_catalog_code`: PARTIAL. EX-037, EX-038, EX-040, EX-041, and EX-042 sampled anchors matched source behavior; EX-039 needs a narrower capability statement. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: `feature_catalog_code`: PARTIAL. EX-037, EX-038, EX-040, EX-041, and EX-042 sampled anchors matched source behavior; EX-039 needs a narrower capability statement.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: PARTIAL. EX-037, EX-038, EX-040, EX-041, and EX-042 sampled anchors matched source behavior; EX-039 needs a narrower capability statement.

### `front_proxy_recovery_safety`: PASS. The proxy keeps unsafe mutations out of the replay set and fails protocol-version drift closed with `-32002`; docs match those source semantics. [SOURCE: `.opencode/bin/lib/launcher-session-proxy.cjs:18`] [SOURCE: `.opencode/bin/lib/launcher-session-proxy.cjs:43`] [SOURCE: `.opencode/bin/lib/launcher-session-proxy.cjs:595`] [SOURCE: `.opencode/bin/lib/launcher-session-proxy.cjs:607`] [SOURCE: `.opencode/skills/system-spec-kit/manual_testing_playbook/14--pipeline-architecture/front-proxy-reconnect-and-backend-only.md:102`] -- BLOCKED (iteration 6, 1 attempts)
- What was tried: `front_proxy_recovery_safety`: PASS. The proxy keeps unsafe mutations out of the replay set and fails protocol-version drift closed with `-32002`; docs match those source semantics. [SOURCE: `.opencode/bin/lib/launcher-session-proxy.cjs:18`] [SOURCE: `.opencode/bin/lib/launcher-session-proxy.cjs:43`] [SOURCE: `.opencode/bin/lib/launcher-session-proxy.cjs:595`] [SOURCE: `.opencode/bin/lib/launcher-session-proxy.cjs:607`] [SOURCE: `.opencode/skills/system-spec-kit/manual_testing_playbook/14--pipeline-architecture/front-proxy-reconnect-and-backend-only.md:102`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `front_proxy_recovery_safety`: PASS. The proxy keeps unsafe mutations out of the replay set and fails protocol-version drift closed with `-32002`; docs match those source semantics. [SOURCE: `.opencode/bin/lib/launcher-session-proxy.cjs:18`] [SOURCE: `.opencode/bin/lib/launcher-session-proxy.cjs:43`] [SOURCE: `.opencode/bin/lib/launcher-session-proxy.cjs:595`] [SOURCE: `.opencode/bin/lib/launcher-session-proxy.cjs:607`] [SOURCE: `.opencode/skills/system-spec-kit/manual_testing_playbook/14--pipeline-architecture/front-proxy-reconnect-and-backend-only.md:102`]

### `front_proxy`: PARTIAL/P2. Bridge, recycle, backend-only, retryable recycle, protocol mismatch, and terminal closed claims match source; only the root catalog's "read-mostly" set label is too narrow. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: `front_proxy`: PARTIAL/P2. Bridge, recycle, backend-only, retryable recycle, protocol mismatch, and terminal closed claims match source; only the root catalog's "read-mostly" set label is too narrow.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `front_proxy`: PARTIAL/P2. Bridge, recycle, backend-only, retryable recycle, protocol mismatch, and terminal closed claims match source; only the root catalog's "read-mostly" set label is too narrow.

### `graph_status`: BLOCKED. `code_graph_status` reports stale readiness because git HEAD changed and stale-file thresholds are exceeded, so this iteration used graphless fallback through direct reads and exact searches. -- BLOCKED (iteration 5, 2 attempts)
- What was tried: `graph_status`: BLOCKED. `code_graph_status` reports stale readiness because git HEAD changed and stale-file thresholds are exceeded, so this iteration used graphless fallback through direct reads and exact searches.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `graph_status`: BLOCKED. `code_graph_status` reports stale readiness because git HEAD changed and stale-file thresholds are exceeded, so this iteration used graphless fallback through direct reads and exact searches.

### `graph_status`: Graphless fallback. This pass used exact search and direct reads because the assigned slice was explicit scenario-to-schema traceability. -- BLOCKED (iteration 16, 1 attempts)
- What was tried: `graph_status`: Graphless fallback. This pass used exact search and direct reads because the assigned slice was explicit scenario-to-schema traceability.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `graph_status`: Graphless fallback. This pass used exact search and direct reads because the assigned slice was explicit scenario-to-schema traceability.

### `graph_status`: Structural graph traversal was unavailable for trusted use because code graph readiness is stale; this iteration used graphless fallback through direct reads and exact searches. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: `graph_status`: Structural graph traversal was unavailable for trusted use because code graph readiness is stale; this iteration used graphless fallback through direct reads and exact searches.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `graph_status`: Structural graph traversal was unavailable for trusted use because code graph readiness is stale; this iteration used graphless fallback through direct reads and exact searches.

### `index_scan_coalescing_contract`: Ruled out. The stress assertions match the config-table lease contract: active lease returns `lease_active`, completion stamps `last_index_scan`, cooldown returns `cooldown`, and stale leases are cleared before reservation. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: `index_scan_coalescing_contract`: Ruled out. The stress assertions match the config-table lease contract: active lease returns `lease_active`, completion stamps `last_index_scan`, cooldown returns `cooldown`, and stale leases are cleared before reservation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `index_scan_coalescing_contract`: Ruled out. The stress assertions match the config-table lease contract: active lease returns `lease_active`, completion stamps `last_index_scan`, cooldown returns `cooldown`, and stale leases are cleared before reservation.

### `index_scan_cooldown_and_stale_reclaim`: PASS. The test's completion, cooldown, and stale-reclaim assertions match `completeIndexScanLease`, cooldown refusal, and `clearStaleScanLease`. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/index-scan-coalescing-stress.vitest.ts:79`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:364`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:455`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:516`] -- BLOCKED (iteration 15, 1 attempts)
- What was tried: `index_scan_cooldown_and_stale_reclaim`: PASS. The test's completion, cooldown, and stale-reclaim assertions match `completeIndexScanLease`, cooldown refusal, and `clearStaleScanLease`. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/index-scan-coalescing-stress.vitest.ts:79`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:364`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:455`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:516`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `index_scan_cooldown_and_stale_reclaim`: PASS. The test's completion, cooldown, and stale-reclaim assertions match `completeIndexScanLease`, cooldown refusal, and `clearStaleScanLease`. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/index-scan-coalescing-stress.vitest.ts:79`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:364`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:455`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:516`]

### `index_scan_lease_coalescing`: PASS for this pass. The stress assertions match the config-table lease source: active leases return `lease_active`, completed scans stamp `last_index_scan`, cooldown returns `cooldown`, and stale leases are cleared before reservation. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/index-scan-coalescing-stress.vitest.ts:48`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:389`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:455`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:516`] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `index_scan_lease_coalescing`: PASS for this pass. The stress assertions match the config-table lease source: active leases return `lease_active`, completed scans stamp `last_index_scan`, cooldown returns `cooldown`, and stale leases are cleared before reservation. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/index-scan-coalescing-stress.vitest.ts:48`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:389`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:455`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:516`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `index_scan_lease_coalescing`: PASS for this pass. The stress assertions match the config-table lease source: active leases return `lease_active`, completed scans stamp `last_index_scan`, cooldown returns `cooldown`, and stale leases are cleared before reservation. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/index-scan-coalescing-stress.vitest.ts:48`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:389`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:455`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:516`]

### `index_scan_lease_coalescing`: PASS. The concurrent acquisition test matches the real SQLite transaction reservation: one call writes `scan_started_at`, and later calls at the same logical `now` return structured `lease_active` waits. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/index-scan-coalescing-stress.vitest.ts:54`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:422`] -- BLOCKED (iteration 15, 1 attempts)
- What was tried: `index_scan_lease_coalescing`: PASS. The concurrent acquisition test matches the real SQLite transaction reservation: one call writes `scan_started_at`, and later calls at the same logical `now` return structured `lease_active` waits. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/index-scan-coalescing-stress.vitest.ts:54`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:422`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `index_scan_lease_coalescing`: PASS. The concurrent acquisition test matches the real SQLite transaction reservation: one call writes `scan_started_at`, and later calls at the same logical `now` return structured `lease_active` waits. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/index-scan-coalescing-stress.vitest.ts:54`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:422`]

### `internal_completion_consistency`: PARTIAL. Parent, 003, and 004 sampled metadata are complete; 001/002 implementation summaries are complete; 001/002 non-summary frontmatter remains setup-era and is recorded as `R18-P2-001`. -- BLOCKED (iteration 18, 1 attempts)
- What was tried: `internal_completion_consistency`: PARTIAL. Parent, 003, and 004 sampled metadata are complete; 001/002 implementation summaries are complete; 001/002 non-summary frontmatter remains setup-era and is recorded as `R18-P2-001`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `internal_completion_consistency`: PARTIAL. Parent, 003, and 004 sampled metadata are complete; 001/002 implementation summaries are complete; 001/002 non-summary frontmatter remains setup-era and is recorded as `R18-P2-001`.

### `mock_fidelity`: PASS. The stress mocks `runPostInsertEnrichmentIfEnabled` to return a complete result, but still drives the real repair path: `repairIncompleteMarkers` scans rows, calls `repairEnrichmentOnReplay`, and counts repaired rows from the real result status mapping. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/enrichment-marker-backfill-stress.vitest.ts:20`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/save/enrichment-state.ts:245`] -- BLOCKED (iteration 15, 1 attempts)
- What was tried: `mock_fidelity`: PASS. The stress mocks `runPostInsertEnrichmentIfEnabled` to return a complete result, but still drives the real repair path: `repairIncompleteMarkers` scans rows, calls `repairEnrichmentOnReplay`, and counts repaired rows from the real result status mapping. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/enrichment-marker-backfill-stress.vitest.ts:20`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/save/enrichment-state.ts:245`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `mock_fidelity`: PASS. The stress mocks `runPostInsertEnrichmentIfEnabled` to return a complete result, but still drives the real repair path: `repairIncompleteMarkers` scans rows, calls `repairEnrichmentOnReplay`, and counts repaired rows from the real result status mapping. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/enrichment-marker-backfill-stress.vitest.ts:20`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/save/enrichment-state.ts:245`]

### `operator_recovery_safety_claims`: PASS. The checkpoint playbook explicitly requires a disposable scratch DB for restore validation, and the restore implementation acquires the maintenance barrier and releases it in `finally`. The front-proxy playbook scopes recycle/protocol-drift validation to sandboxed sessions. -- BLOCKED (iteration 17, 1 attempts)
- What was tried: `operator_recovery_safety_claims`: PASS. The checkpoint playbook explicitly requires a disposable scratch DB for restore validation, and the restore implementation acquires the maintenance barrier and releases it in `finally`. The front-proxy playbook scopes recycle/protocol-drift validation to sandboxed sessions.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `operator_recovery_safety_claims`: PASS. The checkpoint playbook explicitly requires a disposable scratch DB for restore validation, and the restore implementation acquires the maintenance barrier and releases it in `finally`. The front-proxy playbook scopes recycle/protocol-drift validation to sandboxed sessions.

### `operator_restore_safety_claims`: PASS. The operator playbook says restore validation is sandbox-only and scratch-copy based, while source restore takes a maintenance barrier, validates schema/embedder compatibility, journals `swap-pending` to `swap-done`, and releases the barrier in `finally`. [SOURCE: `.opencode/skills/system-spec-kit/manual_testing_playbook/05--lifecycle/checkpoint-v2-file-snapshot-roundtrip.md:14`] [SOURCE: `.opencode/skills/system-spec-kit/manual_testing_playbook/05--lifecycle/checkpoint-v2-file-snapshot-roundtrip.md:71`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2535`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2639`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2730`] -- BLOCKED (iteration 6, 1 attempts)
- What was tried: `operator_restore_safety_claims`: PASS. The operator playbook says restore validation is sandbox-only and scratch-copy based, while source restore takes a maintenance barrier, validates schema/embedder compatibility, journals `swap-pending` to `swap-done`, and releases the barrier in `finally`. [SOURCE: `.opencode/skills/system-spec-kit/manual_testing_playbook/05--lifecycle/checkpoint-v2-file-snapshot-roundtrip.md:14`] [SOURCE: `.opencode/skills/system-spec-kit/manual_testing_playbook/05--lifecycle/checkpoint-v2-file-snapshot-roundtrip.md:71`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2535`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2639`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2730`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `operator_restore_safety_claims`: PASS. The operator playbook says restore validation is sandbox-only and scratch-copy based, while source restore takes a maintenance barrier, validates schema/embedder compatibility, journals `swap-pending` to `swap-done`, and releases the barrier in `finally`. [SOURCE: `.opencode/skills/system-spec-kit/manual_testing_playbook/05--lifecycle/checkpoint-v2-file-snapshot-roundtrip.md:14`] [SOURCE: `.opencode/skills/system-spec-kit/manual_testing_playbook/05--lifecycle/checkpoint-v2-file-snapshot-roundtrip.md:71`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2535`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2639`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2730`]

### `out_of_scope_version_tool_hits`: DEFERRED. Exact search also surfaced `1.7.2` and `54-tool` mentions outside `deep-review-config.json` `reviewScopeFiles`; those were not adjudicated in this parallel slice. -- BLOCKED (iteration 19, 1 attempts)
- What was tried: `out_of_scope_version_tool_hits`: DEFERRED. Exact search also surfaced `1.7.2` and `54-tool` mentions outside `deep-review-config.json` `reviewScopeFiles`; those were not adjudicated in this parallel slice.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `out_of_scope_version_tool_hits`: DEFERRED. Exact search also surfaced `1.7.2` and `54-tool` mentions outside `deep-review-config.json` `reviewScopeFiles`; those were not adjudicated in this parallel slice.

### `packet_doc_internal_consistency`: FAIL advisory-only. New P2 findings record the 004 checklist P2-summary contradiction and the stale parent graph metadata entity. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: `packet_doc_internal_consistency`: FAIL advisory-only. New P2 findings record the 004 checklist P2-summary contradiction and the stale parent graph metadata entity.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `packet_doc_internal_consistency`: FAIL advisory-only. New P2 findings record the 004 checklist P2-summary contradiction and the stale parent graph metadata entity.

### `playbook_capability_EX_040`: PASS for source-traceability. EX-040 source metadata maps to the live proxy constants and backend-only guard. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `playbook_capability_EX_040`: PASS for source-traceability. EX-040 source metadata maps to the live proxy constants and backend-only guard.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability_EX_040`: PASS for source-traceability. EX-040 source metadata maps to the live proxy constants and backend-only guard.

### `playbook_capability`: Deferred to traceability. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `playbook_capability`: Deferred to traceability.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: Deferred to traceability.

### `playbook_capability`: FAIL for EX-039. The documented move scenario is broader than the implementation's same-grandparent/same-basename reconcile path. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: `playbook_capability`: FAIL for EX-039. The documented move scenario is broader than the implementation's same-grandparent/same-basename reconcile path.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: FAIL for EX-039. The documented move scenario is broader than the implementation's same-grandparent/same-basename reconcile path.

### `playbook_capability`: Pass for EX-040 front-proxy framing. The playbook distinguishes transparent retryable recycle from protocol mismatch fail-closed behavior and cites the matching source anchors. -- BLOCKED (iteration 20, 1 attempts)
- What was tried: `playbook_capability`: Pass for EX-040 front-proxy framing. The playbook distinguishes transparent retryable recycle from protocol mismatch fail-closed behavior and cites the matching source anchors.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: Pass for EX-040 front-proxy framing. The playbook distinguishes transparent retryable recycle from protocol mismatch fail-closed behavior and cites the matching source anchors.

### `playbook_capability`: PASS for sampled high-risk overlays. EX-040 and EX-041 scenario claims match the front-proxy and sk-git source anchors sampled. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `playbook_capability`: PASS for sampled high-risk overlays. EX-040 and EX-041 scenario claims match the front-proxy and sk-git source anchors sampled.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: PASS for sampled high-risk overlays. EX-040 and EX-041 scenario claims match the front-proxy and sk-git source anchors sampled.

### `prior_finding_dedupe`: PASS. Existing checklist-specific stale setup finding `R3-P2-001` was not duplicated. -- BLOCKED (iteration 18, 1 attempts)
- What was tried: `prior_finding_dedupe`: PASS. Existing checklist-specific stale setup finding `R3-P2-001` was not duplicated.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `prior_finding_dedupe`: PASS. Existing checklist-specific stale setup finding `R3-P2-001` was not duplicated.

### `prior_findings_dedup`: PASS. Existing active findings in the registry cover earlier correctness/traceability/doc-drift issues; none were re-reported in this security slice. -- BLOCKED (iteration 17, 1 attempts)
- What was tried: `prior_findings_dedup`: PASS. Existing active findings in the registry cover earlier correctness/traceability/doc-drift issues; none were re-reported in this security slice.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `prior_findings_dedup`: PASS. Existing active findings in the registry cover earlier correctness/traceability/doc-drift issues; none were re-reported in this security slice.

### `prod_db_socket_access`: PASS. Checkpoint v2 resolves snapshot directories from the active DB file path, so the stress DB keeps snapshots under the temp DB directory. The recycle test imports `__testing` helpers; socket creation is inside `createSessionProxy` runtime paths, not module load. -- BLOCKED (iteration 17, 1 attempts)
- What was tried: `prod_db_socket_access`: PASS. Checkpoint v2 resolves snapshot directories from the active DB file path, so the stress DB keeps snapshots under the temp DB directory. The recycle test imports `__testing` helpers; socket creation is inside `createSessionProxy` runtime paths, not module load.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `prod_db_socket_access`: PASS. Checkpoint v2 resolves snapshot directories from the active DB file path, so the stress DB keeps snapshots under the temp DB directory. The recycle test imports `__testing` helpers; socket creation is inside `createSessionProxy` runtime paths, not module load.

### `production_db_or_socket_access_in_stress`: PASS. The stress tests use `mkdtemp` or `:memory:` databases and pure proxy helpers; the durability README explicitly states the domain never touches the production DB or live daemon socket. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/checkpoint-v2-contention-stress.vitest.ts:12`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/enrichment-marker-backfill-stress.vitest.ts:13`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/index-scan-coalescing-stress.vitest.ts:14`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-recycle-transparency-stress.vitest.ts:18`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/README.md:43`] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `production_db_or_socket_access_in_stress`: PASS. The stress tests use `mkdtemp` or `:memory:` databases and pure proxy helpers; the durability README explicitly states the domain never touches the production DB or live daemon socket. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/checkpoint-v2-contention-stress.vitest.ts:12`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/enrichment-marker-backfill-stress.vitest.ts:13`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/index-scan-coalescing-stress.vitest.ts:14`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-recycle-transparency-stress.vitest.ts:18`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/README.md:43`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `production_db_or_socket_access_in_stress`: PASS. The stress tests use `mkdtemp` or `:memory:` databases and pure proxy helpers; the durability README explicitly states the domain never touches the production DB or live daemon socket. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/checkpoint-v2-contention-stress.vitest.ts:12`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/enrichment-marker-backfill-stress.vitest.ts:13`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/index-scan-coalescing-stress.vitest.ts:14`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-recycle-transparency-stress.vitest.ts:18`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/README.md:43`]

### `protocol_mismatch_fail_open`: PASS. The proxy records the negotiated protocol version and transitions to terminal `CLOSED` with `-32002` on version drift rather than retrying a mismatched backend. [SOURCE: `.opencode/bin/lib/launcher-session-proxy.cjs:23`] [SOURCE: `.opencode/bin/lib/launcher-session-proxy.cjs:607`] [SOURCE: `.opencode/skills/system-spec-kit/manual_testing_playbook/14--pipeline-architecture/front-proxy-reconnect-and-backend-only.md:99`] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `protocol_mismatch_fail_open`: PASS. The proxy records the negotiated protocol version and transitions to terminal `CLOSED` with `-32002` on version drift rather than retrying a mismatched backend. [SOURCE: `.opencode/bin/lib/launcher-session-proxy.cjs:23`] [SOURCE: `.opencode/bin/lib/launcher-session-proxy.cjs:607`] [SOURCE: `.opencode/skills/system-spec-kit/manual_testing_playbook/14--pipeline-architecture/front-proxy-reconnect-and-backend-only.md:99`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `protocol_mismatch_fail_open`: PASS. The proxy records the negotiated protocol version and transitions to terminal `CLOSED` with `-32002` on version drift rather than retrying a mismatched backend. [SOURCE: `.opencode/bin/lib/launcher-session-proxy.cjs:23`] [SOURCE: `.opencode/bin/lib/launcher-session-proxy.cjs:607`] [SOURCE: `.opencode/skills/system-spec-kit/manual_testing_playbook/14--pipeline-architecture/front-proxy-reconnect-and-backend-only.md:99`]

### `restore_barrier_consumers`: PASS. The three named mutating handlers check `checkpoints.getRestoreBarrierStatus()` before mutation at `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2802`, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:302`, and `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:62`. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: `restore_barrier_consumers`: PASS. The three named mutating handlers check `checkpoints.getRestoreBarrierStatus()` before mutation at `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2802`, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:302`, and `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:62`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `restore_barrier_consumers`: PASS. The three named mutating handlers check `checkpoints.getRestoreBarrierStatus()` before mutation at `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2802`, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:302`, and `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:62`.

### `schema_history_v28_v30`: PASS. `SCHEMA_VERSION = 30`, migrations v28/v29/v30, and fresh-DB DDL match `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1336`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1367`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1385`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2347`, and `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2551`. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: `schema_history_v28_v30`: PASS. `SCHEMA_VERSION = 30`, migrations v28/v29/v30, and fresh-DB DDL match `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1336`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1367`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1385`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2347`, and `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2551`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `schema_history_v28_v30`: PASS. `SCHEMA_VERSION = 30`, migrations v28/v29/v30, and fresh-DB DDL match `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1336`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1367`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1385`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2347`, and `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2551`.

### `schema_v28_v30`: PASS. The schema doc matches `SCHEMA_VERSION = 30`, v28 active logical-key index, v29 checkpoint snapshot columns, and v30 enrichment marker columns/index source anchors. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `schema_v28_v30`: PASS. The schema doc matches `SCHEMA_VERSION = 30`, v28 active logical-key index, v29 checkpoint snapshot columns, and v30 enrichment marker columns/index source anchors.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `schema_v28_v30`: PASS. The schema doc matches `SCHEMA_VERSION = 30`, v28 active logical-key index, v29 checkpoint snapshot columns, and v30 enrichment marker columns/index source anchors.

### `secret_leakage`: PASS. Exact searches over the durability stress domain did not find secret/token/password/API-key material; the reviewed docs only warn that heap snapshots can contain sensitive memory contents. -- BLOCKED (iteration 17, 1 attempts)
- What was tried: `secret_leakage`: PASS. Exact searches over the durability stress domain did not find secret/token/password/API-key material; the reviewed docs only warn that heap snapshots can contain sensitive memory contents.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `secret_leakage`: PASS. Exact searches over the durability stress domain did not find secret/token/password/API-key material; the reviewed docs only warn that heap snapshots can contain sensitive memory contents.

### `secret_or_credential_disclosure`: PASS. Exact credential-pattern searches over the 014 packet docs, feature-catalog docs, and playbook docs returned no files; sampled API-key mentions are environment variable names and local-first fallback prose, not values. Heap snapshots are explicitly documented as sensitive and mode-restricted. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/README.md:42`] [SOURCE: `.opencode/skills/system-spec-kit/README.md:55`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:148`] -- BLOCKED (iteration 6, 1 attempts)
- What was tried: `secret_or_credential_disclosure`: PASS. Exact credential-pattern searches over the 014 packet docs, feature-catalog docs, and playbook docs returned no files; sampled API-key mentions are environment variable names and local-first fallback prose, not values. Heap snapshots are explicitly documented as sensitive and mode-restricted. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/README.md:42`] [SOURCE: `.opencode/skills/system-spec-kit/README.md:55`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:148`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `secret_or_credential_disclosure`: PASS. Exact credential-pattern searches over the 014 packet docs, feature-catalog docs, and playbook docs returned no files; sampled API-key mentions are environment variable names and local-first fallback prose, not values. Heap snapshots are explicitly documented as sensitive and mode-restricted. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/README.md:42`] [SOURCE: `.opencode/skills/system-spec-kit/README.md:55`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:148`]

### `secret_or_credential_disclosure`: PASS. The reviewed docs describe API keys as opt-in operator-provided environment inputs and local-first defaults, not literal credentials. Heap snapshot docs warn that snapshots can contain sensitive memory and document restrictive modes. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/README.md:42`] [SOURCE: `.opencode/skills/system-spec-kit/README.md:55`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:148`] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `secret_or_credential_disclosure`: PASS. The reviewed docs describe API keys as opt-in operator-provided environment inputs and local-first defaults, not literal credentials. Heap snapshot docs warn that snapshots can contain sensitive memory and document restrictive modes. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/README.md:42`] [SOURCE: `.opencode/skills/system-spec-kit/README.md:55`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:148`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `secret_or_credential_disclosure`: PASS. The reviewed docs describe API keys as opt-in operator-provided environment inputs and local-first defaults, not literal credentials. Heap snapshot docs warn that snapshots can contain sensitive memory and document restrictive modes. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/README.md:42`] [SOURCE: `.opencode/skills/system-spec-kit/README.md:55`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:148`]

### `selected_013_changelogs`: Advisory drift found in `013/001` as `R13-P2-001`. The `013/002` checkpoint-v2 gate-fix claim was spot-checked against `hasMainVectorPayloadTables()` and still matches the source’s `vec_memories`-only gate. The `013/003` front-proxy changelog matches the live proxy’s retryable `-32001` and fail-closed `-32002` anchors. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: `selected_013_changelogs`: Advisory drift found in `013/001` as `R13-P2-001`. The `013/002` checkpoint-v2 gate-fix claim was spot-checked against `hasMainVectorPayloadTables()` and still matches the source’s `vec_memories`-only gate. The `013/003` front-proxy changelog matches the live proxy’s retryable `-32001` and fail-closed `-32002` anchors.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `selected_013_changelogs`: Advisory drift found in `013/001` as `R13-P2-001`. The `013/002` checkpoint-v2 gate-fix claim was spot-checked against `hasMainVectorPayloadTables()` and still matches the source’s `vec_memories`-only gate. The `013/003` front-proxy changelog matches the live proxy’s retryable `-32001` and fail-closed `-32002` anchors.

### `server_metadata_version_drift`: PASS. `context-server.ts` advertises `{ name: 'mk-spec-memory', version: '1.8.0' }`, and `mcp_server/package.json` is also `1.8.0`. -- BLOCKED (iteration 19, 1 attempts)
- What was tried: `server_metadata_version_drift`: PASS. `context-server.ts` advertises `{ name: 'mk-spec-memory', version: '1.8.0' }`, and `mcp_server/package.json` is also `1.8.0`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `server_metadata_version_drift`: PASS. `context-server.ts` advertises `{ name: 'mk-spec-memory', version: '1.8.0' }`, and `mcp_server/package.json` is also `1.8.0`.

### `server_metadata_version_source`: PASS at the source level. `context-server.ts` and `package.json` both advertise `1.8.0`; prior documentation drift remains covered by `R3-P1-001` and was not duplicated. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1014`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/package.json:3`] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `server_metadata_version_source`: PASS at the source level. `context-server.ts` and `package.json` both advertise `1.8.0`; prior documentation drift remains covered by `R3-P1-001` and was not duplicated. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1014`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/package.json:3`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `server_metadata_version_source`: PASS at the source level. `context-server.ts` and `package.json` both advertise `1.8.0`; prior documentation drift remains covered by `R3-P1-001` and was not duplicated. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1014`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/package.json:3`]

### `serverInfo_1_8_0`: DEDUPED EXISTING P1. Covered by `R3-P1-001`. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `serverInfo_1_8_0`: DEDUPED EXISTING P1. Covered by `R3-P1-001`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `serverInfo_1_8_0`: DEDUPED EXISTING P1. Covered by `R3-P1-001`.

### `serverinfo_stale_packet_docs`: DEDUPED EXISTING P1. The stale `1.7.2` packet-doc citations are the same evidence class already recorded as `R3-P1-001`. -- BLOCKED (iteration 19, 1 attempts)
- What was tried: `serverinfo_stale_packet_docs`: DEDUPED EXISTING P1. The stale `1.7.2` packet-doc citations are the same evidence class already recorded as `R3-P1-001`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `serverinfo_stale_packet_docs`: DEDUPED EXISTING P1. The stale `1.7.2` packet-doc citations are the same evidence class already recorded as `R3-P1-001`.

### `serverInfo` version: Source is `1.8.0` at `context-server.ts:1014`. The assigned README cluster did not introduce a new `1.7.2` citation. Prior stale spec-doc citation remains covered by `R3-P1-001` and was not re-reported. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: `serverInfo` version: Source is `1.8.0` at `context-server.ts:1014`. The assigned README cluster did not introduce a new `1.7.2` citation. Prior stale spec-doc citation remains covered by `R3-P1-001` and was not re-reported.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `serverInfo` version: Source is `1.8.0` at `context-server.ts:1014`. The assigned README cluster did not introduce a new `1.7.2` citation. Prior stale spec-doc citation remains covered by `R3-P1-001` and was not re-reported.

### `sk_git_worktree`: PASS. Catalog claims match `.opencode/skills/sk-git/SKILL.md:3` and `.opencode/skills/sk-git/references/shared_patterns.md:22`. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: `sk_git_worktree`: PASS. Catalog claims match `.opencode/skills/sk-git/SKILL.md:3` and `.opencode/skills/sk-git/references/shared_patterns.md:22`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `sk_git_worktree`: PASS. Catalog claims match `.opencode/skills/sk-git/SKILL.md:3` and `.opencode/skills/sk-git/references/shared_patterns.md:22`.

### `skill_agent`: Partial. The stress-domain implementation summary claims the daemon recycle case proves replayable reads survive and unsafe mutations get `-32001`; R1-P1-001 records the executable-path gap. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `skill_agent`: Partial. The stress-domain implementation summary claims the daemon recycle case proves replayable reads survive and unsafe mutations get `-32001`; R1-P1-001 records the executable-path gap.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: Partial. The stress-domain implementation summary claims the daemon recycle case proves replayable reads survive and unsafe mutations get `-32001`; R1-P1-001 records the executable-path gap.

### `skill_agent`: Pass for `-32001` / `-32002` framing. Source defines `RETRYABLE_RECYCLE_ERROR` as `-32001` with `retryable: true`; source defines `PROTOCOL_MISMATCH_ERROR` as `-32002` with `retryable: false`; source transitions protocol drift to terminal `CLOSED`; refreshed README, MCP README, feature catalog, and playbook wording match. -- BLOCKED (iteration 20, 1 attempts)
- What was tried: `skill_agent`: Pass for `-32001` / `-32002` framing. Source defines `RETRYABLE_RECYCLE_ERROR` as `-32001` with `retryable: true`; source defines `PROTOCOL_MISMATCH_ERROR` as `-32002` with `retryable: false`; source transitions protocol drift to terminal `CLOSED`; refreshed README, MCP README, feature catalog, and playbook wording match.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: Pass for `-32001` / `-32002` framing. Source defines `RETRYABLE_RECYCLE_ERROR` as `-32001` with `retryable: true`; source defines `PROTOCOL_MISMATCH_ERROR` as `-32002` with `retryable: false`; source transitions protocol drift to terminal `CLOSED`; refreshed README, MCP README, feature catalog, and playbook wording match.

### `skill_agent`: PASS for sk-git worktree convention; the catalog/playbook wording matches `sk-git` source. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `skill_agent`: PASS for sk-git worktree convention; the catalog/playbook wording matches `sk-git` source.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: PASS for sk-git worktree convention; the catalog/playbook wording matches `sk-git` source.

### `spec_code`: FAIL for 013 continuity reconciliation due `R13-P1-001`; parent, child summary, and graph metadata disagree on completion and deploy state. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: `spec_code`: FAIL for 013 continuity reconciliation due `R13-P1-001`; parent, child summary, and graph metadata disagree on completion and deploy state.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: FAIL for 013 continuity reconciliation due `R13-P1-001`; parent, child summary, and graph metadata disagree on completion and deploy state.

### `spec_code`: FAIL for EX-039. The code/source anchor proves an implementation constraint not represented in the scenario command. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: `spec_code`: FAIL for EX-039. The code/source anchor proves an implementation constraint not represented in the scenario command.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: FAIL for EX-039. The code/source anchor proves an implementation constraint not represented in the scenario command.

### `spec_code`: Fail for the new `E429` doc/source mismatch above. `memory_index_scan` source returns coalesced success for lease/cooldown, while the refreshed error-code reference describes an active `E429` rejection. -- BLOCKED (iteration 20, 1 attempts)
- What was tried: `spec_code`: Fail for the new `E429` doc/source mismatch above. `memory_index_scan` source returns coalesced success for lease/cooldown, while the refreshed error-code reference describes an active `E429` rejection.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: Fail for the new `E429` doc/source mismatch above. `memory_index_scan` source returns coalesced success for lease/cooldown, while the refreshed error-code reference describes an active `E429` rejection.

### `spec_code`: FAIL. ServerInfo source is 1.8.0, but current child specs/summaries still cite 1.7.2. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `spec_code`: FAIL. ServerInfo source is 1.8.0, but current child specs/summaries still cite 1.7.2.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: FAIL. ServerInfo source is 1.8.0, but current child specs/summaries still cite 1.7.2.

### `spec_code`: Partial. Server metadata is internally consistent: `context-server.ts` advertises `mk-spec-memory` version `1.8.0` and `mcp_server/package.json` is also `1.8.0`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `spec_code`: Partial. Server metadata is internally consistent: `context-server.ts` advertises `mk-spec-memory` version `1.8.0` and `mcp_server/package.json` is also `1.8.0`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: Partial. Server metadata is internally consistent: `context-server.ts` advertises `mk-spec-memory` version `1.8.0` and `mcp_server/package.json` is also `1.8.0`.

### `SPECKIT_BACKEND_ONLY`: README and ENV rows point to the server boot guard, and source uses `process.env.SPECKIT_BACKEND_ONLY === '1'` before connecting stdio at `context-server.ts:2126-2131`. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: `SPECKIT_BACKEND_ONLY`: README and ENV rows point to the server boot guard, and source uses `process.env.SPECKIT_BACKEND_ONLY === '1'` before connecting stdio at `context-server.ts:2126-2131`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `SPECKIT_BACKEND_ONLY`: README and ENV rows point to the server boot guard, and source uses `process.env.SPECKIT_BACKEND_ONLY === '1'` before connecting stdio at `context-server.ts:2126-2131`.

### `stress_isolation_boundary`: PASS. The stress files use `mkdtemp` or `:memory:` databases, mocked/pure helpers, and temp cleanup; the domain README's no-production-DB/no-live-socket statement matches those anchors. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/checkpoint-v2-contention-stress.vitest.ts:12`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/enrichment-marker-backfill-stress.vitest.ts:13`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/index-scan-coalescing-stress.vitest.ts:14`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-recycle-transparency-stress.vitest.ts:18`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/README.md:43`] -- BLOCKED (iteration 6, 1 attempts)
- What was tried: `stress_isolation_boundary`: PASS. The stress files use `mkdtemp` or `:memory:` databases, mocked/pure helpers, and temp cleanup; the domain README's no-production-DB/no-live-socket statement matches those anchors. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/checkpoint-v2-contention-stress.vitest.ts:12`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/enrichment-marker-backfill-stress.vitest.ts:13`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/index-scan-coalescing-stress.vitest.ts:14`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-recycle-transparency-stress.vitest.ts:18`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/README.md:43`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `stress_isolation_boundary`: PASS. The stress files use `mkdtemp` or `:memory:` databases, mocked/pure helpers, and temp cleanup; the domain README's no-production-DB/no-live-socket statement matches those anchors. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/checkpoint-v2-contention-stress.vitest.ts:12`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/enrichment-marker-backfill-stress.vitest.ts:13`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/index-scan-coalescing-stress.vitest.ts:14`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-recycle-transparency-stress.vitest.ts:18`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/README.md:43`]

### `stress_test_clarity`: PASS for this slice. The four stress files keep purpose/isolation comments near the top and avoid transient review breadcrumbs. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: `stress_test_clarity`: PASS for this slice. The four stress files keep purpose/isolation comments near the top and avoid transient review breadcrumbs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `stress_test_clarity`: PASS for this slice. The four stress files keep purpose/isolation comments near the top and avoid transient review breadcrumbs.

### `stress_test_clarity`: PASS. The four stress tests have durable top-of-file purpose and isolation comments, helper-level explanations, no `.only`/`.skip`, no TODO/FIXME markers, and no hidden random/env/sleep dependency from the exact search. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/checkpoint-v2-contention-stress.vitest.ts:5`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-recycle-transparency-stress.vitest.ts:5`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/enrichment-marker-backfill-stress.vitest.ts:5`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/index-scan-coalescing-stress.vitest.ts:5`] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `stress_test_clarity`: PASS. The four stress tests have durable top-of-file purpose and isolation comments, helper-level explanations, no `.only`/`.skip`, no TODO/FIXME markers, and no hidden random/env/sleep dependency from the exact search. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/checkpoint-v2-contention-stress.vitest.ts:5`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-recycle-transparency-stress.vitest.ts:5`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/enrichment-marker-backfill-stress.vitest.ts:5`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/index-scan-coalescing-stress.vitest.ts:5`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `stress_test_clarity`: PASS. The four stress tests have durable top-of-file purpose and isolation comments, helper-level explanations, no `.only`/`.skip`, no TODO/FIXME markers, and no hidden random/env/sleep dependency from the exact search. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/checkpoint-v2-contention-stress.vitest.ts:5`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-recycle-transparency-stress.vitest.ts:5`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/enrichment-marker-backfill-stress.vitest.ts:5`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/index-scan-coalescing-stress.vitest.ts:5`]

### `stress_throwaway_storage_cleanup`: PASS. The checkpoint test uses a per-test `mkdtemp` DB/checkpoints tree and closes/removes it in `afterEach`; enrichment and index-scan use `:memory:` handles and close them; recycle stress is pure helper logic with no socket or daemon spawn. -- BLOCKED (iteration 17, 1 attempts)
- What was tried: `stress_throwaway_storage_cleanup`: PASS. The checkpoint test uses a per-test `mkdtemp` DB/checkpoints tree and closes/removes it in `afterEach`; enrichment and index-scan use `:memory:` handles and close them; recycle stress is pure helper logic with no socket or daemon spawn.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `stress_throwaway_storage_cleanup`: PASS. The checkpoint test uses a per-test `mkdtemp` DB/checkpoints tree and closes/removes it in `afterEach`; enrichment and index-scan use `:memory:` handles and close them; recycle stress is pure helper logic with no socket or daemon spawn.

### `stress_to_repair_contract`: PASS for the pending-marker scenario. The stress creates only `pending` markers with `markEnrichmentPending`, calls the real `repairIncompleteMarkers`, and the real repair query selects `pending`, `partial`, and `failed`, so the tested scenario matches production repair behavior. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/enrichment-marker-backfill-stress.vitest.ts:143`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/save/enrichment-state.ts:230`] -- BLOCKED (iteration 15, 1 attempts)
- What was tried: `stress_to_repair_contract`: PASS for the pending-marker scenario. The stress creates only `pending` markers with `markEnrichmentPending`, calls the real `repairIncompleteMarkers`, and the real repair query selects `pending`, `partial`, and `failed`, so the tested scenario matches production repair behavior. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/enrichment-marker-backfill-stress.vitest.ts:143`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/save/enrichment-state.ts:230`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `stress_to_repair_contract`: PASS for the pending-marker scenario. The stress creates only `pending` markers with `markEnrichmentPending`, calls the real `repairIncompleteMarkers`, and the real repair query selects `pending`, `partial`, and `failed`, so the tested scenario matches production repair behavior. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/enrichment-marker-backfill-stress.vitest.ts:143`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/save/enrichment-state.ts:230`]

### `template_anchor_integrity`: PASS. Anchor opener/closer pairing was checked across the 25 scoped parent/child markdown docs; no unclosed, unopened, or mismatched anchors were found. -- BLOCKED (iteration 18, 1 attempts)
- What was tried: `template_anchor_integrity`: PASS. Anchor opener/closer pairing was checked across the 25 scoped parent/child markdown docs; no unclosed, unopened, or mismatched anchors were found.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `template_anchor_integrity`: PASS. Anchor opener/closer pairing was checked across the 25 scoped parent/child markdown docs; no unclosed, unopened, or mismatched anchors were found.

### `tool_count_canonical_source`: PASS for source counting. `TOOL_DEFINITIONS` spans 36 registrations from `tool-schemas.ts:670-716`. -- BLOCKED (iteration 19, 1 attempts)
- What was tried: `tool_count_canonical_source`: PASS for source counting. `TOOL_DEFINITIONS` spans 36 registrations from `tool-schemas.ts:670-716`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `tool_count_canonical_source`: PASS for source counting. `TOOL_DEFINITIONS` spans 36 registrations from `tool-schemas.ts:670-716`.

### `tool_count_surface_drift`: DEDUPED EXISTING P1. `mcp_server/package.json:4`, `feature_catalog.md:48`, and `feature_catalog.md:60` still conflict with the canonical 36-tool count, but this is the same evidence class already recorded as `R3-P1-002`. -- BLOCKED (iteration 19, 1 attempts)
- What was tried: `tool_count_surface_drift`: DEDUPED EXISTING P1. `mcp_server/package.json:4`, `feature_catalog.md:48`, and `feature_catalog.md:60` still conflict with the canonical 36-tool count, but this is the same evidence class already recorded as `R3-P1-002`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `tool_count_surface_drift`: DEDUPED EXISTING P1. `mcp_server/package.json:4`, `feature_catalog.md:48`, and `feature_catalog.md:60` still conflict with the canonical 36-tool count, but this is the same evidence class already recorded as `R3-P1-002`.

### `tool_count_vs_TOOL_DEFINITIONS`: DEDUPED EXISTING P1. Covered by `R3-P1-002`. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `tool_count_vs_TOOL_DEFINITIONS`: DEDUPED EXISTING P1. Covered by `R3-P1-002`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `tool_count_vs_TOOL_DEFINITIONS`: DEDUPED EXISTING P1. Covered by `R3-P1-002`.

### `unsafe_destructive_restore_guidance`: PASS. The checkpoint-v2 playbook marks restore testing sandbox-only and requires a disposable scratch copy; the implementation path uses restore barriers, manifest/schema/embedder guards, and a two-phase journal before file swap. [SOURCE: `.opencode/skills/system-spec-kit/manual_testing_playbook/05--lifecycle/checkpoint-v2-file-snapshot-roundtrip.md:14`] [SOURCE: `.opencode/skills/system-spec-kit/manual_testing_playbook/05--lifecycle/checkpoint-v2-file-snapshot-roundtrip.md:71`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2535`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2600`] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `unsafe_destructive_restore_guidance`: PASS. The checkpoint-v2 playbook marks restore testing sandbox-only and requires a disposable scratch copy; the implementation path uses restore barriers, manifest/schema/embedder guards, and a two-phase journal before file swap. [SOURCE: `.opencode/skills/system-spec-kit/manual_testing_playbook/05--lifecycle/checkpoint-v2-file-snapshot-roundtrip.md:14`] [SOURCE: `.opencode/skills/system-spec-kit/manual_testing_playbook/05--lifecycle/checkpoint-v2-file-snapshot-roundtrip.md:71`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2535`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2600`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `unsafe_destructive_restore_guidance`: PASS. The checkpoint-v2 playbook marks restore testing sandbox-only and requires a disposable scratch copy; the implementation path uses restore barriers, manifest/schema/embedder guards, and a two-phase journal before file swap. [SOURCE: `.opencode/skills/system-spec-kit/manual_testing_playbook/05--lifecycle/checkpoint-v2-file-snapshot-roundtrip.md:14`] [SOURCE: `.opencode/skills/system-spec-kit/manual_testing_playbook/05--lifecycle/checkpoint-v2-file-snapshot-roundtrip.md:71`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2535`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2600`]

### `unsafe_mutation_replay`: PASS for security scope. The proxy keeps destructive tool names in the unsafe set and emits the retryable recycle error for non-replayable pending requests instead of replaying them. The existing correctness finding `R1-P1-001` still covers the stress test model-vs-production gap, but no additional security-severity finding was supported in this pass. [SOURCE: `.opencode/bin/lib/launcher-session-proxy.cjs:43`] [SOURCE: `.opencode/bin/lib/launcher-session-proxy.cjs:113`] [SOURCE: `.opencode/bin/lib/launcher-session-proxy.cjs:595`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-recycle-transparency-stress.vitest.ts:162`] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `unsafe_mutation_replay`: PASS for security scope. The proxy keeps destructive tool names in the unsafe set and emits the retryable recycle error for non-replayable pending requests instead of replaying them. The existing correctness finding `R1-P1-001` still covers the stress test model-vs-production gap, but no additional security-severity finding was supported in this pass. [SOURCE: `.opencode/bin/lib/launcher-session-proxy.cjs:43`] [SOURCE: `.opencode/bin/lib/launcher-session-proxy.cjs:113`] [SOURCE: `.opencode/bin/lib/launcher-session-proxy.cjs:595`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-recycle-transparency-stress.vitest.ts:162`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `unsafe_mutation_replay`: PASS for security scope. The proxy keeps destructive tool names in the unsafe set and emits the retryable recycle error for non-replayable pending requests instead of replaying them. The existing correctness finding `R1-P1-001` still covers the stress test model-vs-production gap, but no additional security-severity finding was supported in this pass. [SOURCE: `.opencode/bin/lib/launcher-session-proxy.cjs:43`] [SOURCE: `.opencode/bin/lib/launcher-session-proxy.cjs:113`] [SOURCE: `.opencode/bin/lib/launcher-session-proxy.cjs:595`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-recycle-transparency-stress.vitest.ts:162`]

### Code graph: BLOCKED for structural graph traversal because `code_graph_status` reported stale readiness. This iteration used graphless fallback with direct reads and exact searches. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Code graph: BLOCKED for structural graph traversal because `code_graph_status` reported stale readiness. This iteration used graphless fallback with direct reads and exact searches.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Code graph: BLOCKED for structural graph traversal because `code_graph_status` reported stale readiness. This iteration used graphless fallback with direct reads and exact searches.

### Error codes: README cluster describes `E429`, live `-32001`, and non-retryable `-32002`. Source has `RETRYABLE_RECYCLE_ERROR` code `-32001` at `launcher-session-proxy.cjs:18-22` and `PROTOCOL_MISMATCH_ERROR` code `-32002` at `launcher-session-proxy.cjs:23-27`, with terminal `CLOSED` handling at `launcher-session-proxy.cjs:607-621`. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Error codes: README cluster describes `E429`, live `-32001`, and non-retryable `-32002`. Source has `RETRYABLE_RECYCLE_ERROR` code `-32001` at `launcher-session-proxy.cjs:18-22` and `PROTOCOL_MISMATCH_ERROR` code `-32002` at `launcher-session-proxy.cjs:23-27`, with terminal `CLOSED` handling at `launcher-session-proxy.cjs:607-621`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Error codes: README cluster describes `E429`, live `-32001`, and non-retryable `-32002`. Source has `RETRYABLE_RECYCLE_ERROR` code `-32001` at `launcher-session-proxy.cjs:18-22` and `PROTOCOL_MISMATCH_ERROR` code `-32002` at `launcher-session-proxy.cjs:23-27`, with terminal `CLOSED` handling at `launcher-session-proxy.cjs:607-621`.

### Graph status: stale. Structural graph was not trusted for relationship expansion; this pass used graphless fallback with exact search plus direct reads. -- BLOCKED (iteration 20, 1 attempts)
- What was tried: Graph status: stale. Structural graph was not trusted for relationship expansion; this pass used graphless fallback with exact search plus direct reads.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Graph status: stale. Structural graph was not trusted for relationship expansion; this pass used graphless fallback with exact search plus direct reads.

### New replay-boundary drift: The source replay allow-list includes a mutation (`memory_save`) while both README surfaces call replay read-only. Recorded as `R10-P1-001`. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: New replay-boundary drift: The source replay allow-list includes a mutation (`memory_save`) while both README surfaces call replay read-only. Recorded as `R10-P1-001`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: New replay-boundary drift: The source replay allow-list includes a mutation (`memory_save`) while both README surfaces call replay read-only. Recorded as `R10-P1-001`.

### Schema v28-v30: README cluster names v28, v29, and v30. Source confirms `SCHEMA_VERSION = 30` at `vector-index-schema.ts:438`, migration v28 at `:1336`, migration v29 at `:1367`, and migration v30 at `:1385`. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Schema v28-v30: README cluster names v28, v29, and v30. Source confirms `SCHEMA_VERSION = 30` at `vector-index-schema.ts:438`, migration v28 at `:1336`, migration v29 at `:1367`, and migration v30 at `:1385`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Schema v28-v30: README cluster names v28, v29, and v30. Source confirms `SCHEMA_VERSION = 30` at `vector-index-schema.ts:438`, migration v28 at `:1336`, migration v29 at `:1367`, and migration v30 at `:1385`.

### Tool count: The assigned README cluster uses `36` for the mk-spec-memory server at `README.md:45`, `README.md:256`, `README.md:581`, `README.md:1001`, and `README.md:1036`. `TOOL_DEFINITIONS` lists 36 registrations from `tool-schemas.ts:670-716`. Prior non-README count drift remains covered by `R3-P1-002` and was not re-reported. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Tool count: The assigned README cluster uses `36` for the mk-spec-memory server at `README.md:45`, `README.md:256`, `README.md:581`, `README.md:1001`, and `README.md:1036`. `TOOL_DEFINITIONS` lists 36 registrations from `tool-schemas.ts:670-716`. Prior non-README count drift remains covered by `R3-P1-002` and was not re-reported.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Tool count: The assigned README cluster uses `36` for the mk-spec-memory server at `README.md:45`, `README.md:256`, `README.md:581`, `README.md:1001`, and `README.md:1036`. `TOOL_DEFINITIONS` lists 36 registrations from `tool-schemas.ts:670-716`. Prior non-README count drift remains covered by `R3-P1-002` and was not re-reported.

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
