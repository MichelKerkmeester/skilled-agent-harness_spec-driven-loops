# Iteration 2: RQ2 (Schema-Drift Mechanics) + RQ4 (Retryable Taxonomy)

**Focus:** RQ2 (all 37 arg shapes) + RQ4 (complete error→exit map)
**Status:** complete
**newInfoRatio:** 0.95 (partial novelty — run-2 CLI design already described the output shape; this iteration adds schema-by-schema feasibility analysis and the complete retryable taxonomy from source code)
**Novelty justification:** Schema classification per tool (which need `--json`), codegen analysis, and the complete error-to-exit mapping from the session proxy and launcher source code.

---

## RQ2: Schema-Drift Mechanics — RESOLVED (file:line evidence)

### Finding: All 37 tools confirmed, codegen from TOOL_DEFINITIONS is feasible

The 37 tools are in the canonical `TOOL_DEFINITIONS` array at [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:709-756]:

```
01 checkpoint_create  02 checkpoint_delete  03 checkpoint_list   04 checkpoint_restore
05 embedder_list      06 embedder_set       07 embedder_status   08 eval_reporting_dashboard
09 eval_run_ablation  10 memory_bulk_delete 11 memory_causal_link 12 memory_causal_stats
13 memory_causal_unlink 14 memory_context   15 memory_delete     16 memory_drift_why
17 memory_embedding_reconcile 18 memory_get_learning_history    19 memory_health
20 memory_index_scan  21 memory_ingest_cancel 22 memory_ingest_start 23 memory_ingest_status
24 memory_list        25 memory_match_triggers  26 memory_quick_search 27 memory_retention_sweep
28 memory_save        29 memory_search          30 memory_stats   31 memory_update
32 memory_validate    33 session_bootstrap      34 session_health 35 session_resume
36 task_postflight    37 task_preflight
```

Each tool definition has `name`, `description`, and `inputSchema` (JSON Schema object). The Zod validation schemas in `tool-input-schemas.ts` [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:1-80] use `ZodType<ToolInput>` with strict mode by default. The `validateToolArgs` function re-exported at [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:14-20] performs the actual validation.

Codegen from TOOL_DEFINITIONS is straightforward: the run-2 design explicitly states "its 37 subcommands from the canonical TOOL_DEFINITIONS (schema drift impossible by construction)" [SOURCE: file:../cli-backend/lineages/gpt/research.md:150]. The `inputSchema.properties` map directly to `--flag` declarations. Each property's `type`, `enum`, `description`, and `default` fields provide everything needed for a flag parser.

### Finding: Tool classification by schema complexity

| Class | Count | Tools | CLI mapping |
|-------|-------|-------|-------------|
| **Flat scalars only** (string, number, boolean, simple enums) | ~20 | memory_list, memory_stats, memory_health, session_health, memory_delete, memory_update, memory_validate, memory_bulk_delete, memory_retention_sweep, embedder_list, embedder_status, checkpoint_list, checkpoint_delete, session_bootstrap, session_resume, memory_ingest_status, memory_ingest_cancel, memory_causal_stats, memory_causal_unlink, memory_get_learning_history | Direct `--flag value` |
| **Arrays** (string[] or typed arrays) | ~10 | memory_match_triggers, memory_quick_search (concepts), memory_search (concepts, anchors), memory_save (triggerPhrases), checkpoint_create (metadata object), eval_run_ablation (channels, queries, groundTruthQueryIds, sprintFilter, channelFilter, metricFilter), eval_reporting_dashboard (arrays), task_preflight/task_postflight (knowledgeGaps, gapsClosed, newGapsDiscovered), memory_index_scan (excludePatterns) | `--arr val1 --arr val2` or `--json '[...]'` |
| **Complex/nested** | ~7 | memory_context (sessionId, tokenUsage, anchors, profile enum), memory_search (x-requiredAnyOf union), memory_save (routeAs/mergeModeHint enums, provenance fields), checkpoint_create (metadata object, tenantId/userId/agentId boundaries), eval_run_ablation (channels enum array), memory_drift_why (optional array relations), memory_causal_link (required relation string) | `--json '{...}'` for nested, `--flag value` for scalars |
| **Governed ingest** (tenantId/userId/agentId/provenance) | ~6 | memory_save, memory_index_scan, memory_search, memory_context, checkpoint_create, memory_match_triggers | `--tenant-id`, `--user-id`, `--agent-id` flags |

### Finding: Tools that do NOT map cleanly to flags alone — `--json` escape hatch required

1. **memory_context**: Has `anchors` (string array) + `profile` (enum) + `sessionId` + `tokenUsage` (number with min/max) + `mode`/`intent` (enums). ~26 properties total. Most are optional. The `--json` escape is an acceptable fallback for the full set.

2. **memory_save**: Has `routeAs` and `mergeModeHint` as mutually exclusive enum options, plus `triggerPhrases` array, `provenanceSource`/`provenanceActor` string pairs, `retentionPolicy` enum. Complex but manageable with `--save-route`/`--merge-mode`/`--trigger-phrases` flags + `--json` for bulk.

3. **eval_run_ablation**: Has `channels` (enum array, values: 'vector'|'bm25'|'fts5'|'graph'|'trigger'), `queries` (string array), `groundTruthQueryIds` (number array). These are inherently list-typed. `--channels vector --channels bm25` works; `--json` handles complex combinations.

4. **memory_causal_link**: Requries `relation` (string, not enum — any relation type) + `sourceId`/`targetId` (string|number coerce). Straightforward as `--source-id X --target-id Y --relation causes`.

5. **memory_ingest_start**: Has `paths` (required string array, min 1, max 50). `spec-memory ingest-start --paths file1.md --paths file2.md`.

6. **memory_save**: The `routeAs`/`mergeModeHint`/`provenanceSource` etc. are fine-grained governance fields. The CLI can surface them as optional flags with the `--json` escape for bulk/programmatic use.

### Finding: `--json` escape hatch is a legitimate pattern

The `--json` flag is the recommended pattern for tools with complex input shapes. It accepts a JSON string that matches the tool's inputSchema exactly. This is consistent with many CLI tools (kubectl, aws CLI, GitHub CLI) and ensures zero schema loss. The Zod validation at the argv boundary validates `--json` payloads identically to MCP args.

### Classification: RESOLVED

All 37 tools have CLI-mappable schemas. Codegen from TOOL_DEFINITIONS is feasible by construction — each tool's `inputSchema.properties` provides the flag set. ~20 tools map directly to flat flags. ~10 tools need simple array flags. ~7 tools need either array flags or `--json` fallback. Zero tools are unrepresentable as CLI input. The `--json` escape hatch at the Zod boundary ensures exact parity.

---

## RQ4: Retryable Taxonomy — RESOLVED (file:line evidence)

### Finding: Complete error-to-exit-code map

The session proxy and launcher define the retryable/non-retryable taxonomy:

| Error Condition | Exit Code | Retryable | Source |
|-----------------|-----------|-----------|--------|
| `-32001` lease held / daemon unavailable | **75** | Yes | [SOURCE: file:.opencode/bin/lib/launcher-session-proxy.cjs:23-27] |
| `-32001` backend recycled mid-session | **75** | Yes | [SOURCE: file:.opencode/bin/lib/launcher-session-proxy.cjs:23-27] |
| `-32001` cold-start exhaustion (30 attempts) | **75** | Yes | [SOURCE: file:.opencode/bin/lib/launcher-session-proxy.cjs:776-790] |
| `-32001` lease held, bridge unavailable | **75** | Yes | [SOURCE: file:.opencode/bin/mk-spec-memory-launcher.cjs:515-525] |
| `-32002` protocol version mismatch | **69** | **No** | [SOURCE: file:.opencode/bin/lib/launcher-session-proxy.cjs:28-32] |
| Daemon startup timeout (dead socket, no respawn) | **69** | No | [SOURCE: file:.opencode/bin/mk-spec-memory-launcher.cjs:672-691] |
| Owner/permission denied (EPERM on PID check) | **69** | No | [SOURCE: file:.opencode/bin/mk-spec-memory-launcher.cjs:491-491, 613-617] |
| Missing artifacts (build failure) | **1** | No | [SOURCE: file:.opencode/bin/mk-spec-memory-launcher.cjs:971-984] |
| Bootstrap lock timeout (120s) | **1** | No | [SOURCE: file:.opencode/bin/mk-spec-memory-launcher.cjs:1188-1190] |
| Reattach attempts exhausted (40) → CLOSED | **75** (via retryableErrorFrame) | Yes (client-side) | [SOURCE: file:.opencode/bin/lib/launcher-session-proxy.cjs:693-721] |
| Daemon recycled (reattach success) | Transparent | N/A | [SOURCE: file:.opencode/bin/lib/launcher-session-proxy.cjs:693-720] |
| CLI usage error | **64** | No | [run-2 design] |

### Finding: Replayable vs non-replayable tools on daemon recycle

The session proxy at [SOURCE: file:.opencode/bin/lib/launcher-session-proxy.cjs:33-58] classifies tools:

**REPLAYABLE** (safe to re-send on reconnect, committed by backend despite transport loss):
- memory_search, memory_context, memory_match_triggers, memory_quick_search
- memory_save (content-hash dedup + logical-key unique index protection)
- session_bootstrap, session_health, session_resume, session_status
- memory_stats, memory_status
- checkpoint_list, embedder_health
- `initialize`, `ping`, `notifications/*`

**UNSAFE** (MUST NOT replay — could double-execute mutations):
- memory_delete, memory_bulk_delete, memory_update
- checkpoint_restore, checkpoint_delete
- embedder_set
- memory_retention_sweep
- memory_ingest_start, memory_ingest_cancel

On daemon recycle, the proxy replays only `replayable: true` pending requests. Unsafe pending requests get `-32001: backend recycled; retry` error frames, and the client must re-initiate them.

### Finding: Cold-start exhaustion handled gracefully

The proxy's `start()` at [SOURCE: file:.opencode/bin/lib/launcher-session-proxy.cjs:776-791] probes the daemon with `maxColdStartAttempts` (default 30, tunable via `SPECKIT_PROXY_COLD_START_ATTEMPTS`). If all attempts fail, the CLI sends one `-32001: backend unavailable` error to stdout and exits with code 75. No hang, no crash, no file mutation.

### Finding: Keepalive detects hung daemons

The session proxy at [SOURCE: file:.opencode/bin/lib/launcher-session-proxy.cjs:536-548] pings the daemon every 10 seconds (configurable). If no response within 5 seconds, the proxy treats the backend as dead and triggers reattach. This prevents a CLI from hanging forever on a wedged daemon.

### Finding: The existing error classification for the launcher

At [SOURCE: file:.opencode/bin/mk-spec-memory-launcher.cjs:515-525], secondary launchers emit a `-32001` JSON-RPC error with `retryable: true` when the owner lease is held but the bridge is unavailable. This is the exact pattern the CLI should follow.

### Classification: RESOLVED

The complete exit code map is:
- **0**: success
- **1**: local validation / runtime error (build failure, lock timeout, args invalid)
- **64**: CLI usage error (bad subcommand, missing required arg)
- **69**: terminal/non-retryable (protocol mismatch -32002, dead-socket-no-owner-pid, EPERM)
- **75**: retryable (lease held -32001, cold-start exhaustion, backend recycled, reattach give-up)

The session proxy already classifies replayable vs unsafe tools. The CLI's exit-75 path maps cleanly to all retryable conditions. Exit-69 maps to conditions that cannot self-heal (protocol version mismatch requires client reconnect; no owner PID means no daemon to probe; EPERM means sandbox barrier).

---

## Ruled Out

- "Custom arg parser needed per tool" — codegen from TOOL_DEFINITIONS covers all 37; Zod validation reused at argv boundary.
- "Some tools are MCP-proprietary in their input shape" — every inputSchema is a standard JSON Schema object; `--json` escape covers the most complex.
- "SQLITE_BUSY requires special handling" — the single-writer lease prevents concurrent DB writers; SQLITE_BUSY is a symptom of a lease breach, not an expected operational error.

## Discovered Risks

- **RQ4a**: Protocol-version-drift at 2am (new build hot-swaps daemon) — if the CLI's internal handshake detects a version mismatch, it exits 69. The client (agent/hook) must handle exit 69 by re-invoking the CLI (new process, fresh handshake). This is covered by the existing session-proxy design at [SOURCE: line 644-656] but should be explicitly called out in the implementation's error-handling docs.
