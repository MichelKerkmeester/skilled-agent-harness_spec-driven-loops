# Iteration 4: Security Severity and Fan-Out Runtime Blast Radius

## Focus

This iteration answered the last two open questions: how to calibrate the scoped-retrieval and causal-tool findings under the local single-user MCP threat model, and whether fan-out runtime defects make prior deep-loop artifacts suspect.

## Findings

### F1: Community fallback is a real scope bypass, but P0 requires a shared untrusted-principal deployment

`memory_search` accepts and normalizes `tenantId`, `userId`, and `agentId`, then passes those fields into the main retrieval pipeline. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:687] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:953] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:955] The normal stage-1 path applies governance scope filtering when any of those fields are present, and even re-applies scope after constitutional, HyDE, and summary fallback injections. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1072] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1084] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1133] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1347]

The post-pipeline community fallback does not follow that pattern. On weak results it calls `searchCommunities(effectiveQuery, requireDb(), 5)` with no `specFolder`, tenant, user, or agent scope, then fetches `memory_index` members by ID only and appends them to the response. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:987] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1000] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1006] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1031] `searchCommunities()` itself has no scope arguments and reads all `community_summaries`. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/search/community-search.ts:101] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/search/community-search.ts:124]

Calibration: this is not acceptable by design because the same tool surface advertises governed retrieval boundaries. Under the research charter's local single-user MCP model with no untrusted network input, it is best labeled P1 high correctness/privacy-boundary risk. It becomes P0 only if tenant, user, or agent fields represent mutually untrusted principals sharing one MCP server. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/009-research-synthesis/spec.md:60]

### F2: Causal graph tools are ID-only read/write APIs without governed scope

The public causal schemas expose `memoryId`, `sourceId`, `targetId`, and `edgeId`, but no `specFolder`, tenant, user, or agent scope. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:445] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:451] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:463] The Zod input schema allow-list confirms the same ID-only shape for `memory_drift_why`, `memory_causal_link`, and `memory_causal_unlink`. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:406] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:433] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:590]

The handlers then operate directly on those IDs. `memory_drift_why` reads the source and related memories by bare ID; `memory_causal_link` inserts an edge from stringified source and target IDs; `memory_causal_unlink` deletes by edge ID. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:560] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:580] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:757] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:996] Storage intentionally defers foreign-key validation and deletes with `DELETE FROM causal_edges WHERE id = ?`. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:279] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:747]

Calibration: genuine integrity and privacy-boundary defect for governed memory stores. Under a local single-user trusted-client model, this is P1 rather than P0 because the caller is already trusted to invoke the tool. It is P0 when causal graph reads/writes are exposed to untrusted principals or when governed stores rely on tenant/user/agent IDs as hard isolation.

### F3: Fan-out exit accounting can mask failed CLI lineages in the multi-lineage code path

The fan-out worker captures a subprocess `exitCode`, but returns it as normal output instead of throwing on nonzero status. [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:362] `runCappedPool` marks any worker return as `status: fulfilled`, and the pool summary counts success solely by fulfilled status. [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:85] [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:92] [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:207] The top-level process then exits 0 when `summary.failed` is zero. [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:376]

Blast radius: any past fan-out run that relied on `orchestration-summary.json` for success/failure status without checking each lineage's captured stdout, sentinel, and state files is suspect. The specific failure mode is "subprocess failed but pool reported fulfilled."

### F4: Single-process fan-out can serialize, and iteration overrides do not reach the loop prompt

`fanout-run.cjs` uses `spawnSync` inside the async pool worker. [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:344] Because the synchronous spawn blocks before the worker returns a promise, a single fanout-run process with multiple CLI lineages can serialize despite the pool concurrency cap. The merged review registry for interconnected MCPs also records this as an active finding. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/007-interconnected-mcps/review/deep-review-findings-registry.json:16]

The `iterations` lineage field is documented as a max-iterations override, but `fanout-run` uses it only to compute timeout sizing. [SOURCE: file:.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts:292] [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:154] The prompt builder includes no max-iteration override in the lineage prompt. [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:131] [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:142]

Related contract drift: Codex dispatch emits `service_tier=default` when no tier is configured, while the executor schema allows only `priority`, `standard`, and `fast`. [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:177] [SOURCE: file:.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts:13]

### F5: Current eight review slices have completion sentinels, but their summaries are not trustworthy certification artifacts

The review slices' orchestration summaries report one CLI lineage, one success, and zero failures. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/001-mcp-core/review/orchestration-summary.json:6] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/001-mcp-core/review/orchestration-summary.json:8] The same slice ledger contains five started entries and five completed entries. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/001-mcp-core/review/orchestration-status.log:1] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/001-mcp-core/review/orchestration-status.log:10] The governance slice shows the same five-start and five-complete pattern despite a one-lineage summary. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/006-governance-skdoc-skcode/review/orchestration-summary.json:6] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/006-governance-skdoc-skcode/review/orchestration-status.log:1] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/006-governance-skdoc-skcode/review/orchestration-status.log:10]

The likely interpretation is that the campaign launched separate one-lineage processes concurrently into the same review folder, not one five-lineage `fanout-run` process. That means the code-path serialization bug is real, but the current ledgers do not prove this campaign under-delivered concurrency. Individual captured outputs do contain sentinels, for example `FANOUT_LINEAGE_COMPLETE:codex-1` and `FANOUT_LINEAGE_COMPLETE:codex-3`. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/001-mcp-core/review/lineages/codex-1/logs/fanout-lineage.out:1] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/007-interconnected-mcps/review/lineages/codex-3/logs/fanout-lineage.out:1]

One artifact remains fidelity-suspect: governance `codex-3` records `dispatch_status=self_invocation_refused`, meaning the requested `cli-codex` executor was not actually used for that lineage, although the review completed in the current Codex runtime. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/006-governance-skdoc-skcode/review/lineages/codex-3/logs/executor-audit.log:4] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/006-governance-skdoc-skcode/review/lineages/codex-3/logs/executor-audit.log:5]

## Sources Consulted

- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/community-search.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts`
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts`
- `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs`
- `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts`
- Review slice orchestration summaries, ledgers, lineage stdout, and executor-audit logs under `001-*` through `008-*`.

## Assessment

- `newInfoRatio`: 0.58
- Novelty justification: The iteration answered the final two questions and separated code-path blast radius from what the current campaign artifacts prove.
- Confidence: High that the scope bypasses and fan-out accounting bugs exist. Medium-high for artifact blast radius because the current slices show sentinel completion but their summaries are not sufficient as certification artifacts.

## Reflection

What worked: severity calibration became clear after comparing the normal scoped retrieval path against the fallback and causal APIs.

What failed: orchestration summaries alone were misleading. They need to be cross-checked against ledgers and per-lineage sentinel files.

Ruled out: "P0 no matter what." Local single-user MCP lacks the untrusted shared-principal condition. Also ruled out: "the current eight review slices definitely under-delivered concurrency." Their ledgers show concurrent one-lineage starts, so the serialization bug is a future or differently-invoked fan-out risk, not proven campaign damage.

## Recommended Next Focus

Proceed to phase_synthesis. All five key questions now have evidence-backed answers.
