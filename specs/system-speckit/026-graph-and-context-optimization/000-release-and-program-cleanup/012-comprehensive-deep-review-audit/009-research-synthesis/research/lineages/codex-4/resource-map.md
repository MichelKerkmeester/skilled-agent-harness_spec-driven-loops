# Resource Map - codex-4

## Lineage Outputs

- `deep-research-config.json`: lineage config and self-invocation guard note.
- `deep-research-state.jsonl`: append-only event ledger for five completed iterations plus synthesis events.
- `deep-research-findings-registry.json`: resolved questions, key findings, ruled-out directions, and coverage metrics.
- `deep-research-dashboard.md`: human-readable progress and completion status.
- `iterations/iteration-001.md`: doc/schema-to-code drift.
- `iterations/iteration-002.md`: metadata drift systemicness.
- `iterations/iteration-003.md`: memory correctness impact.
- `iterations/iteration-004.md`: P0 severity calibration.
- `iterations/iteration-005.md`: fan-out blast radius.
- `deltas/iter-001.jsonl` through `deltas/iter-005.jsonl`: per-iteration deltas.
- `research.md`: final synthesis.
- `resource-map.md`: this map.

## Contract Drift Evidence

- `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:338-350`: public MCP schema for `memory_embedding_reconcile`.
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:294-303`: runtime reconcile args.
- `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:735-737`: stale operator usage for embedding reconcile.
- `.opencode/skills/system-spec-kit/mcp_server/tool-input-schemas.ts:233-243`, `:455-462`, `:472-476`: governed ingest input schemas.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:254-333`, `:708-725`: validation accepts governed ingest fields but does not forward them into the job payload.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts:38-49`, `:146-148`, `:262-267`: ingest argument validation and job creation boundary.
- `.opencode/skills/system-spec-kit/mcp_server/lib/jobs/job-queue.ts:45-55`, `:253-295`: ingest job payload omits governed fields.

## Graph Metadata Evidence

- `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:605-624`: frontmatter status extraction.
- `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:987-1037`: status derivation precedence and fallback.
- `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1066-1088`: `derived.status` output.
- `.opencode/skills/system-spec-kit/mcp_server/lib/graph/README.md:72-77`: documented fallback behavior.
- `.opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:159-180`: ambiguous status review flag is too narrow.
- `.opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:193-217`: backfill traversal/write path.
- `.opencode/skills/system-spec-kit/scripts/tests/graph-metadata-backfill.vitest.ts:77-116`: dry-run coverage exists; write-path regression is skipped.
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-incremental-index-foundation/spec.md:41-48`: Draft status example.
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-incremental-index-foundation/graph-metadata.json:35-43`: same packet marked complete.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-phase-parent-generator-pointer-polish/spec.md:31-39`: Draft status example.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-phase-parent-generator-pointer-polish/graph-metadata.json:35-43`: same packet marked complete.

## Memory Correctness Evidence

- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:90-94`: update fields that can affect entity-density routing.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:304-316`: post-mutation hook call.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:20-105`: cache invalidation list omits entity-density.
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts:4-10`, `:21-23`, `:78-89`, `:136-163`: cache, TTL, compute, and invalidation API.
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/query-router.ts:85-86`, `:247-252`: entity-density controls graph/degree channel preservation.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2703`: save path invalidates entity-density.
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:699-704`: delete path invalidates entity-density.
- `.opencode/skills/system-spec-kit/mcp_server/tests/integration/entity-density-commit-hooks.vitest.ts:64-67`: e2e memory_save coverage remains deferred.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:360-378`: pending file is indexed before final promotion.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2637-2640`: DB write transaction commits during prepared-memory processing.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:387-444`: cleanup lacks DB compensation for post-commit promotion failure.

## Scope Governance Evidence

- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:946-984`: main pipeline receives tenant/user/agent/spec scope.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:987-1031`: community fallback fetches `memory_index` by raw ID without scope predicates.
- `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:442-463`: causal graph tools use bare IDs without scope fields.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:76-90`, `:520-565`, `:689-757`, `:955-996`: causal graph operations traverse/create/delete by bare IDs.
- `.opencode/skills/system-spec-kit/mcp_server/lib/causal/causal-edges.ts:279-281`, `:298-340`: causal edge FK check and upsert are ID-based.
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:573-585`: local stdio trusted boundary and HTTP/WS session binding.
- `.opencode/skills/system-spec-kit/mcp_server/changelog/v3.2.0.0.md:179-181`, `:373`: access-scope enforcement is opt-in for multi-tenant deployments.
- `.opencode/skills/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:521-534`, `:710-711`: exact-match fail-closed scope filters.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts:223-245`, `:307-340`: trusted session gate and scope post-filtering.

## Fan-Out Orchestration Evidence

- `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:122-146`: child loop prompt omits `iterations` / `maxIterations`.
- `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:154-157`: `iterations` only affects timeout sizing.
- `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:344`: `spawnSync` inside async worker affects parallelism semantics.
- `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:362-378`: child exit code is returned but top-level exit can still be success if promises fulfilled.
- `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:85-99`, `:207-217`: fulfilled worker promises are counted as success independent of child `output.exitCode`.
- `.opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs:328-336`: attribution falls back to sparse executor events or aggregate summaries.
- `.opencode/skills/deep-loop-runtime/src/executor-config.ts:292-299`: intended `iterations` override contract.

## Review Artifact Evidence

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/001-scope-and-executive/review/deep-review-findings-registry.json`: 13 open findings, conditional.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/002-memory-mcp/review/deep-review-findings-registry.json`: 4 open findings, including 2 P0, fail.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/003-code-graph-mcp/review/deep-review-findings-registry.json`: 4 open findings, conditional.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/004-deep-loop-orchestration/review/deep-review-findings-registry.json`: 9 open findings, conditional.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/005-feature-catalog-playbook/review/deep-review-findings-registry.json`: 10 open findings, conditional.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/006-recipe-catalog/review/deep-review-findings-registry.json`: 10 open findings, conditional.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/007-interconnected-mcps/review/deep-review-findings-registry.json:82-101`: active P0 on non-zero CLI lineage exits counted as success.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/008-mcp-freshness-and-claim-verification/review/deep-review-findings-registry.json`: 11 open findings, conditional.

## Trust Notes

- Strongest trusted evidence: source code, per-lineage reports, per-slice registries, and direct read-only counts.
- Weak evidence: aggregate orchestration summaries, attribution tables, concurrency claims, and iteration-bound compliance.
- Required rerun boundary: after fan-out accounting/provenance/depth fixes, rerun release-gate fan-out before treating orchestration output as authoritative.
