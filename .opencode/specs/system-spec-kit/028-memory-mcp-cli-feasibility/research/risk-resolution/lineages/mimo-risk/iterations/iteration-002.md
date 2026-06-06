# Iteration 002 — RQ2: Schema-Drift Mechanics + RQ4: Retryable Taxonomy

- **Date:** 2026-06-06T12:40:00Z
- **Focus:** RQ2 (schema-drift mechanics) and RQ4 (retryable taxonomy)
- **Status:** complete

---

## RQ2: Schema-Drift Mechanics — RESOLVED

### Question
Do all 37 tool arg shapes (nested objects, arrays, unions) round-trip via argv + `--json`? Is codegen from TOOL_DEFINITIONS feasible? Which tools don't map cleanly to flags?

### Findings

**1. All 37 tools have canonical JSON Schema definitions.** `TOOL_DEFINITIONS` in `tool-schemas.ts` exports 37 tools with `inputSchema` (JSON Schema objects). These are the single source of truth for MCP tool registration. [SOURCE: mcp_server/tool-schemas.ts:709-756]

**2. Zod schemas provide runtime validation.** `validateToolArgs()` in `schemas/tool-input-schemas.ts:685` parses all input through Zod schemas registered in `TOOL_SCHEMAS`. Every tool has a corresponding Zod schema. [SOURCE: mcp_server/schemas/tool-input-schemas.ts:685-707]

**3. Existing parity tests cover all 37 tools.** `tool-contract-parity.vitest.ts` verifies that TOOL_DEFINITIONS and TOOL_SCHEMAS stay in sync. `tool-input-schema.vitest.ts` tests validation for all tools including edge cases. [SOURCE: mcp_server/tests/tool-contract-parity.vitest.ts:12-40] [SOURCE: mcp_server/tests/tool-input-schema.vitest.ts:61-83]

**4. Schema complexity analysis — tools that need `--json` escape hatch:**

| Complexity | Tools | CLI mapping |
|---|---|---|
| Simple (flat scalars) | `session_health`, `memory_stats`, `embedder_list`, `checkpoint_list` | Direct `--flag value` |
| Medium (arrays/enums) | `memory_search` (concepts[], enum filters), `memory_bulk_delete` (tier enum) | `--concepts a,b,c` or `--json` |
| Complex (nested objects, unions) | `memory_save` (routeAs, mergeModeHint, retentionPolicy, deleteAfter), `memory_context` (anchors[], profile enum), `memory_causal_link` (relation enum, strength float) | `--json '<full-args>'` |
| Union types | `memory_search` (`x-requiredAnyOf: query/concepts/cursor`) | `--json` or auto-detect from flags |

**5. Codegen is feasible.** TOOL_DEFINITIONS provides canonical names + JSON Schema. The Zod schemas already exist. Generating CLI subcommands with flag definitions from the JSON Schema properties is straightforward for scalar/enum/array-of-string params. Nested objects and unions require the `--json` escape hatch. The run-2 design already accounts for this: `cli-manifest.ts` would be generated from TOOL_DEFINITIONS + TOOL_SCHEMAS. [SOURCE: ../../cli-backend/lineages/gpt/research.md:74]

**6. Tools that don't map cleanly to flat flags (need `--json`):**
- `memory_save`: 20+ optional params including nested enums (routeAs, mergeModeHint, retentionPolicy)
- `memory_context`: 15+ params with arrays (anchors[]) and enums (mode, intent, profile)
- `memory_search`: 25+ params with union requirement (query OR concepts OR cursor), arrays, nested enums
- `memory_causal_link`: relation enum, strength float, evidence string
- `eval_run_ablation`: channels[] enum array, groundTruthQueryIds[] number array
- `memory_match_triggers`: limit with semantic meaning, session_id/turnNumber for cognitive features

**Mitigation:** The `--json` escape hatch handles ALL schemas without loss. Flag-based shortcuts for common params (query, limit, specFolder, mode) plus `--json` for complex calls is the standard pattern (cf. `gh`, `jq`, `aws`).

### Classification: **RESOLVED**
All 37 schemas round-trip via argv flags (simple params) + `--json` (complex params). Codegen from TOOL_DEFINITIONS is feasible. No tools are unmappable — the `--json` escape hatch covers everything.

---

## RQ4: Retryable Taxonomy — RESOLVED

### Question
Complete error→exit map: -32001, cold-start, lease contention, SQLITE_BUSY; which are genuinely retryable (exit 75) vs terminal (exit 69)?

### Findings

**1. -32001 is the canonical retryable error.** The launcher session proxy defines `RETRYABLE_RECYCLE_ERROR` as `{code: -32001, message: 'backend recycled; retry', data: {retryable: true}}`. This fires during daemon recycle, cold start, and lease contention. [SOURCE: bin/lib/launcher-session-proxy.cjs:23-27]

**2. -32002 is terminal (protocol mismatch).** `{code: -32002, message: 'backend protocol version changed; client reconnect required', data: {retryable: false}}`. [SOURCE: bin/lib/launcher-session-proxy.cjs:28-32]

**3. SQLITE_BUSY/LOCKED are transient.** Multiple subsystems implement retry-with-backoff:
- `job-queue.ts:104-146`: async SQLITE_BUSY retry with exponential backoff
- `file-watcher.ts:242`: SQLITE_BUSY detection + backoff
- `checkpoints.ts:478-510`: typed SQLITE_BUSY/LOCKED errors with recovery hints
- `shared/utils/retry.ts:74-75`: SQLITE_BUSY/LOCKED in retry pattern list
- `lib/errors/core.ts:183-184`: user-friendly "Database is temporarily busy" message
- `core/db-state.ts:396`: SQLITE_BUSY/LOCKED detection for error classification [SOURCE: multiple files]

**4. Complete error→exit map for CLI:**

| Error condition | JSON-RPC code | CLI exit code | Retryable? |
|---|---|---|---|
| Success | n/a | 0 | n/a |
| CLI usage error (bad args, unknown subcommand) | n/a | 64 | No |
| Schema validation failure (ZodError) | -32602 | 64 | No |
| Unknown tool name | custom | 64 | No |
| Protocol mismatch (-32002) | -32002 | 69 | No |
| Non-retryable service error | various | 69 | No |
| Daemon/socket connection refused | ECONNREFUSED | 75 | Yes |
| -32001 (backend recycled) | -32001 | 75 | Yes |
| SQLITE_BUSY | n/a (handler-level) | 75 | Yes |
| SQLITE_LOCKED | n/a (handler-level) | 75 | Yes |
| Cold-start exhaustion (probe timeout) | n/a | 75 | Yes |
| Lease contention (live owner, no bridge) | -32001 | 75 | Yes |
| Local validation error | n/a | 1 | No |
| Unexpected runtime error | n/a | 1 | No |

**5. Replayable vs unsafe tools affect retry semantics.** The session proxy partitions tools into `REPLAYABLE_TOOL_NAMES` (12 tools: memory_search, memory_context, etc.) and `UNSAFE_TOOL_NAMES` (9 tools: memory_delete, checkpoint_restore, etc.). Replayable tools get auto-retried on daemon recycle; unsafe tools surface -32001 to the client. [SOURCE: bin/lib/launcher-session-proxy.cjs:33-58]

**6. Cold-start path:** When the daemon is down, the launcher's session proxy probes with backoff (100, 250, 500, 1000, 1500ms × 30 attempts ≈ 41s). If the daemon never comes up, -32001 is returned. The CLI should map this to exit 75 with a retry hint. [SOURCE: bin/lib/launcher-session-proxy.cjs:11-17]

### Classification: **RESOLVED**
The error taxonomy is well-defined: -32001/SQLITE_BUSY/connection failures → exit 75 (retryable); -32002/unknown tool/validation → exit 69/64 (terminal). The session proxy's replayable/unsafe partition informs which CLI calls can auto-retry vs must surface to the caller.

---

## New Risks Discovered

None. The schema and error handling are well-structured.

## Ruled-Out Approaches

- Flag-only CLI (no --json): impossible for complex schemas without massive flag explosion
- Single exit code for all errors: loses retry/terminal distinction critical for automation

## Next Focus

Iteration 3: RQ5 (Hook latency budget) + RQ6 (Per-call spawn overhead measurement)
