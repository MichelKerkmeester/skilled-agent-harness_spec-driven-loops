# Iteration 008 — MCP Contract & API Parity (dimension: traceability, angle: A7)

## Dispatcher
- **Run:** 8 of 20 (dispatch-assigned; parallel execution — this agent writes ONLY `iterations/iteration-008.md` + `deltas/iter-008.jsonl`)
- **Mode:** review (read-only — findings only, no code modification)
- **Dimension:** traceability | **Angle:** A7 (MCP tool registry / schema / error-contract parity)
- **Budget profile:** verify (11-13 tool calls; used 12)
- **Review target:** git range `a9e9bdb0a5^..HEAD` (HEAD `12de3d3a7e`)
- **Session:** `2026-06-05T11:16:17Z` (generation 1, lineageMode new)

## Files Reviewed
- `mcp_server/tool-schemas.ts` — `TOOL_DEFINITIONS` (public registry, 37 tools); `checkpoint_create`, `memory_causal_stats`, `memory_causal_unlink`, `embedder_*` definitions.
- `mcp_server/schemas/tool-input-schemas.ts` — `TOOL_SCHEMAS` (Zod dispatch registry) + per-tool allowlists; `memoryCausalStatsSchema` nested `backfill` shape.
- `mcp_server/lib/architecture/layer-definitions.ts` — `TOOL_LAYER_MAP`, `getLayerForTool`, `getLayerPrefix`, `enhanceDescription`.
- `mcp_server/context-server.ts` — `ListTools` handler (`TOOL_DEFINITIONS` serving path).
- `mcp_server/handlers/causal-graph.ts` — `backfill` wiring, `balanceStatus` enum, `RELATION_INSUFFICIENT_TOTAL`.
- `mcp_server/lib/causal/relation-coverage.ts` — `backfillJob` contract object (`implemented`/`command`/`lastBackfillAt`), `BACKFILL_COMMAND`.
- `mcp_server/tests/tool-contract-parity.vitest.ts`, `mcp_server/tests/layer-definitions.vitest.ts` — contract-guard coverage.
- git: `15d2e4988d`, `e887474b4a`, `c7eb1f6454`, `d32d90c3f1`, `b834150fe5`, `23ba7ea08e`, `deee30b319`, `e93acb8e24`.

## Findings — New

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings

1. **`embedder_*` (3 tools) absent from runtime `TOOL_LAYER_MAP`; layer-resolution API returns `null`/empty prefix** — `mcp_server/lib/architecture/layer-definitions.ts:40-117` (no `embedder_` entry in any layer's `tools:` array) vs `mcp_server/tool-schemas.ts:609,621,633` (descriptions hard-code `[L7:Maintenance]`).
   - **Contract mismatch:** The public tool descriptions for `embedder_list`/`embedder_set`/`embedder_status` advertise layer `[L7:Maintenance]`, but `getLayerForTool('embedder_list')` returns `null` (`layer-definitions.ts:145-146`, `TOOL_LAYER_MAP[toolName] ?? null`), so `getLayerPrefix()` returns `''` and `enhanceDescription()` returns the description unchanged (`layer-definitions.ts:153-170`). The advertised layer and the programmatic layer classification disagree for 3 of the 37 registered tools.
   - **Why P2 (not higher):** `ListTools` serves the static `TOOL_DEFINITIONS` descriptions directly (`context-server.ts:1034` → `tools: TOOL_DEFINITIONS`) and does NOT call `enhanceDescription`, so the served prefix is correct. The gap is contained to programmatic consumers of `getLayerForTool` (re-exported via `api/index.ts:157`). The reconciliation is sanctioned by a `VIRTUAL_LAYER_TOOLS` table, but that table lives ONLY in the test (`tests/layer-definitions.vitest.ts:17-26`), not in source — so the test passes (it excludes virtual tools at lines 159 & 179) while source `TOOL_LAYER_MAP` remains the canonical-but-incomplete map.
   - **Finding class:** docs/contract parity (traceability).
   - **Scope proof:** Confirmed embedders absent from `TOOL_LAYER_MAP` (grep `embedder` in `layer-definitions.ts` = 0 hits); confirmed `getLayerForTool` is the only resolution path and returns `null` for unmapped tools; confirmed `ListTools` uses static descriptions, bounding blast radius.
   - **Affected surface hints:** `lib/architecture/layer-definitions.ts` (`TOOL_LAYER_MAP` or an in-source `VIRTUAL_LAYER_TOOLS` equivalent); `api/index.ts` `getLayerForTool` consumers; `tests/layer-definitions.vitest.ts` (test-only virtual table should be promoted to source to make the contract self-describing).

   ```json
   {
     "type": "P2",
     "claim": "embedder_list/set/status advertise [L7:Maintenance] in their public descriptions but are not present in the runtime TOOL_LAYER_MAP, so getLayerForTool() returns null for them — advertised layer vs programmatic classification disagree.",
     "evidenceRefs": ["lib/architecture/layer-definitions.ts:40-117 (no embedder_ in tools[])", "lib/architecture/layer-definitions.ts:145-146 (getLayerForTool ?? null)", "tool-schemas.ts:609/621/633 (hard-coded [L7:Maintenance])", "tests/layer-definitions.vitest.ts:17-26,159,179 (VIRTUAL_LAYER_TOOLS test-only exclusion)", "context-server.ts:1034 (ListTools serves static TOOL_DEFINITIONS, not enhanceDescription)"],
     "counterevidenceSought": "Checked whether ListTools re-derives prefixes via enhanceDescription (it does not — static serve); checked whether a source-level virtual map exists (none — only in test).",
     "alternativeExplanation": "Intentional virtual-layer design: embedders are virtual L7 reconciled in the test guard. Valid as design, but the source TOOL_LAYER_MAP is the single source of truth for getLayerForTool and is incomplete, leaving the API contract self-inconsistent.",
     "finalSeverity": "P2",
     "confidence": "high",
     "downgradeTrigger": "Served descriptions are correct (static); no caller observed to break on null layer — keeps this advisory, not gate-relevant."
   }
   ```

## Traceability Checks
- **37-tool contract parity (3-way):** PASS.
  - `tool-schemas.ts` `TOOL_DEFINITIONS` array = **37** distinct tool entries (`tool-schemas.ts:709`, member count verified = 37).
  - `schemas/tool-input-schemas.ts` `TOOL_SCHEMAS` = same 37 + 3 inline session tools (`session_bootstrap/health/resume`, lines 564-575). Note: `TOOL_SCHEMAS` also includes `skill_graph_*`/`minimal` keys in the broader allowlist block — these belong to the skill-advisor server surface, not the 37-tool memory registry; not a defect (separate server contract).
  - `TOOL_LAYER_MAP` (`lib/architecture/layer-definitions.ts:40-117`) maps 37 memory tools + session tools (and cross-server `code_graph_*`/`skill_graph_*`/`detect_changes` for navigation) — EXCEPT the 3 `embedder_*` tools (see P2 above).
- **`memory_causal_unlink` exposure (deee30b319, 23ba7ea08e):** PASS. Present in `TOOL_DEFINITIONS` (`tool-schemas.ts:34,480`), `TOOL_SCHEMAS` (`tool-input-schemas.ts:549`), allowlist (`tool-input-schemas.ts:599`), and `TOOL_LAYER_MAP` (`lib/architecture/layer-definitions.ts:97`, L6 Analysis). The 23ba7ea08e fix that added it to the layer map is verified live. **Note:** the playbook scenario 049 (e93acb8e24) called unlink "UNAUTOMATABLE-via-MCP / registry gap" — that is now STALE; deee30b319 closed the registry gap. Doc-vs-code drift candidate for A9.
- **`checkpoint_create.includeEmbeddings` (15d2e4988d):** PASS — full 3-way parity. PUBLIC (`tool-schemas.ts:366`), ZOD (`tool-input-schemas.ts:345`), allowlist (`tool-input-schemas.ts:590`). Default `true`; `false` excludes vec tables.
- **`memory_health` schema reconcile (e887474b4a):** PASS. Allowlist (`tool-input-schemas.ts:583`) = `[reportMode, includeFullReport, limit, specFolder, autoRepair, confirmed, cleanFiles]`; PUBLIC properties match.
- **`memory_causal_stats.backfill` nested parity (d32d90c3f1, b834150fe5):** PASS — nested-object parity (NOT covered by the parity test, manually verified). PUBLIC nested keys `{dryRun, limit, actor, similarity, contradicts, similarityThreshold}` (`tool-schemas.ts:462-475`) == ZOD nested `getSchema({...})` (`tool-input-schemas.ts:426-436`, strict — rejects typo'd keys) == handler `ParsedBackfill` interface (`handlers/causal-graph.ts:115-122`). Wired to `backfillRelationInference` (`handlers/causal-graph.ts:14`).
- **`backfillJob` error/contract honesty (c7eb1f6454 → d32d90c3f1):** PASS at HEAD. The dispatch premise (`implemented=false`, `command=null`, `lastBackfillAt` always null) is the *intermediate* state from c7eb1f6454; it was correct THEN (no backfill wired). d32d90c3f1 + b834150fe5 subsequently wired a real bounded backfill and updated the contract to `implemented:true`, `command: BACKFILL_COMMAND` (`= 'memory_causal_stats({ backfill: { dryRun: false } })'`, `relation-coverage.ts:53`), `lastBackfillAt: readLastBackfillAt(db)` (real `MAX(extracted_at)` query, `relation-coverage.ts:69-73`). The advertised `command` is the real callable entry point. Contract is honest at HEAD. **The brief's stale premise is REFUTED.**
- **causal-stats `balanceStatus` enum doc-vs-code (e93acb8e24):** PASS. Playbook doc enum `balanced | relation_skewed | insufficient_data` + `RELATION_INSUFFICIENT_TOTAL = 5` + `dominantRelation` matches code exactly: `handlers/causal-graph.ts:134` (enum type), `:142` (threshold = 5), `:132` (dominantRelation), `:197-201` (computation). Zero stale tokens (`skewed_inbound`/`skewed_outbound`/`capped`/`windowCap`) remain in the handler. Doc drift fully remediated.
- **Iteration number / JSONL lag:** Shared `deep-review-state.jsonl` shows 2 `type:"iteration"` lines, but `deltas/` holds iters 1,2,3,5,7 (parallel agents write isolated deltas; reducer merges later). Honoring dispatch-assigned iteration 8 because per-iteration delta slots are the parallel-safe contract and `deltas/iter-008.jsonl` was free. Recorded as ambiguity edge case below.

## Integration Evidence
- **`context-server.ts:1034` `ListTools` handler** — serves `TOOL_DEFINITIONS` (static array) as the advertised tool list; confirms the 37-tool public contract is served from the same registry checked here, and that served descriptions do NOT pass through `enhanceDescription` (bounds the P2 blast radius).
- **`api/index.ts:156-157`** — re-exports `TOOL_LAYER_MAP` and `getLayerForTool` as the public programmatic layer API; this is the surface that observes the embedder gap (P2).
- **Test guards:** `tests/tool-contract-parity.vitest.ts` (covers only 4 hand-picked tools' top-level public-vs-Zod key parity — `memory_embedding_reconcile`, `memory_index_scan`, `memory_ingest_start`, `memory_causal_stats`) and `tests/layer-definitions.vitest.ts` (full layer-map coverage with a test-only `VIRTUAL_LAYER_TOOLS` escape hatch). Coverage observation: nested-object parity and the other 33 tools' key parity are NOT guarded — recorded for A6 (maintainability/test-integrity).

## Edge Cases
1. **Brief premise stale (contradictory evidence, adjudicated):** The dispatch asserted `backfillJob.implemented=false + command=null (lastBackfillAt always null)`. Verified at c7eb1f6454 (true then) but REFUTED at HEAD — d32d90c3f1/b834150fe5 re-wired it to `implemented:true` with a real command. Cited both sides via `git show`; adjudicated to "honest contract at HEAD, no finding." Safest in-scope interpretation: review HEAD truth, not the intermediate commit.
2. **`embedder_*` virtual-layer reconciliation lives only in test, not source:** The "is this a bug?" question hinges on whether `VIRTUAL_LAYER_TOOLS` is a source contract (then embedders are intentionally virtual, no defect) or test-only (then source `TOOL_LAYER_MAP` is the SoT and is incomplete). Grep confirmed it is test-only → P2 advisory (source contract self-inconsistent), not a clean pass.
3. **JSONL/delta count divergence:** state.jsonl (2 iterations) lags deltas/ (5 deltas). Attributed to parallel-agent delta isolation + deferred reducer merge, not corruption. Honored dispatch iteration number; no shared-file write performed.
4. **`TOOL_SCHEMAS` superset (skill_graph_*/minimal):** `TOOL_SCHEMAS`/allowlist contains keys beyond the 37 memory tools (`skill_graph_*`, `minimal`). These are cross-server / sentinel entries, NOT a memory-registry parity defect; flagged as context, not a finding.

## Confirmed-Clean Surfaces
- **37-tool 3-way registry parity** (TOOL_DEFINITIONS == TOOL_SCHEMAS == TOOL_LAYER_MAP) — clean except the bounded `embedder_*` layer-map gap (P2).
- **`memory_causal_unlink`** end-to-end exposure (registry + Zod + allowlist + layer-map) — clean; registry gap closed.
- **`checkpoint_create.includeEmbeddings`**, **`memory_health`**, **`memory_causal_stats.backfill` (incl. nested)** schema parity — clean.
- **`backfillJob` contract honesty at HEAD** and **causal-stats `balanceStatus` enum doc-vs-code** — clean.

## Ruled Out
- **backfillJob dishonest contract (P0/P1 candidate from brief):** RULED OUT. Refuted at HEAD; the contract was re-made honest by d32d90c3f1/b834150fe5 with a real `command` and DB-backed `lastBackfillAt`. Do not retry as a finding without re-reading HEAD `relation-coverage.ts:110-115`.
- **causal-stats enum doc drift:** RULED OUT. e93acb8e24 fully reconciled the playbook to the code enum; zero residual stale tokens.
- **37-tool count mismatch:** RULED OUT. All three registries agree on the 37 memory tools; `memory_causal_unlink` correctly present in all four surfaces incl. layer map.

## Next Focus
- **Dimension:** traceability | **Angle:** A8 (config & gemini-removal completeness) — next planned iteration (iter 9/10 per charter).
- **Focus area:** `_NOTE_` parity across `opencode.json` / `.claude/mcp.json` / `.codex/config.toml` / `.devin/config.json`; dangling gemini refs in surviving configs/agent-mirrors/docs/scripts after the 63 `.gemini/**` deletions (8683890935).
- **Reason:** A7 traceability substantially clean (1 P2); A8 is the next-highest traceability risk given the gemini-removal blast radius across runtime configs.
- **Rotation status:** A7 complete (traceability score ~0.85 — clean except 1 P2 + 2 stale-doc carry-forwards for A9). Remaining traceability: A8, A9.
- **Blocked/productive carry-forward:** Productive. (a) A9 doc-drift: playbook scenario 049 calling unlink "UNAUTOMATABLE-via-MCP/registry gap" is STALE (deee30b319 closed it) — flag in A9. (b) A6 test-integrity: `tool-contract-parity.vitest.ts` covers only 4/37 tools and no nested parity; the `embedder_*` `VIRTUAL_LAYER_TOOLS` reconciliation is test-only — both feed A6.
- **Required evidence (A8):** grep surviving runtime configs for `gemini`; diff `_NOTE_` ordering/content across the 4 runtime config files; confirm agent-mirror and doc references to gemini are removed or intentionally retained.
