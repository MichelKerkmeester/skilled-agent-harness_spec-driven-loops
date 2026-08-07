# Research Synthesis: Root-Cause Review of the 026 Deep-Review Audit

## 1. Executive Summary
The audit findings cluster around one main root cause: several critical contracts are hand-maintained across multiple surfaces without a generated source of truth or parity gate. That explains the recurring doc/schema-to-code drift, catalog/playbook drift, and parts of the metadata drift.

The highest-risk runtime issues are real. Community search fallback can leave a scoped retrieval pipeline and append globally selected rows [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1000]. Fan-out orchestration can count failed child CLI exits as successful lineage work because `exitCode` is returned as data rather than turned into a rejected pool item [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:362].

## 2. Scope
This lineage answered the five charter questions from the research-synthesis spec: doc/schema root cause, metadata systemic-ness, memory-correctness impact, local MCP security severity calibration, and deep-loop blast radius [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/009-research-synthesis/spec.md:57].

## 3. Method
The loop ran five focused iterations. Each iteration used the slice review registries as the starting index, then checked the underlying implementation, metadata, catalog, or playbook files for direct evidence. The synthesis deduped duplicated fan-out findings by signature rather than trusting raw registry counts.

## 4. Evidence Corpus
Evidence came from all eight slice registries, selected lineage reports, MCP runtime files, metadata scripts, deep-loop runtime scripts, feature catalog, and manual testing playbook. The current audit packet contains 40 lineage report files across the eight review slices, but the slice orchestration summaries each report only one CLI lineage, so individual lineage reports and direct source reads carry more weight than summary counts.

## 5. Root-Cause Map
| Cluster | Root Cause | Blast Radius |
|---|---|---|
| Doc/schema-to-code drift | Separate public schemas, Zod schemas, parameter allowlists, handlers, docs, catalog, and playbook. | Reconcile, governed ingest, causal stats, session bootstrap, tool count, scenario count, stale links. |
| Metadata drift | Metadata refresh is mechanical and pointer-scoped; semantic freshness is not fully enforced. | 714 graph-metadata files under 026 and 18 under 027 are in the potential audit surface. |
| Memory correctness | Mutation hooks and save/index ordering miss specific cache/order invariants. | Entity-rich graph-channel routing and canonical save durability. |
| Security calibration | Governed scope is inconsistently applied across retrieval fallback and causal mutation. | Scoped memory retrieval and causal graph mutation/read integrity. |
| Deep-loop reliability | Child CLI process status is not reflected in pool result success, and sync spawning blocks fan-out concurrency. | Prior fan-out review/research summaries can overstate success and concurrency. |

## 6. Question 1: Doc/Schema-to-Code Drift
The drift is systemic. `memory_embedding_reconcile` is defined in `tool-schemas.ts` with `mode` and `activeOnly` [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:338], repeated in the Zod allowed-parameter list [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:583], and implemented in a handler that selects apply mode from `args.mode` [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/memory-embedding-reconcile.ts:19]. The catalog still documents a `dryRun` behavior [SOURCE: file:.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:654].

Governed ingest repeats the pattern: runtime schemas accept governance fields for scan and ingest [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:455], while public tool definitions omit those fields for the same tools [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:522].

Answer: there is no effective single source of truth. The remediation lever is a generated contract or a parity gate that compares public schema, runtime schema, handler-read fields, docs, catalog, and playbook examples.

## 7. Question 2: Metadata Drift
Metadata drift is systemic enough to treat as a tooling problem. The 026 root metadata points to `004-code-graph` as the latest active child [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/graph-metadata.json:156], while the timeline shows three other tracks active on `2026-06-03` [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/timeline.md:76].

The mechanism is visible: canonical save updates a phase-parent pointer only for the direct phase parent [SOURCE: file:.opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:493]. Backfill refreshes all discovered spec folders [SOURCE: file:.opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:193], but its review flags focus on ambiguous status, missing summaries, prose relationship hints, and thin source docs [SOURCE: file:.opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:159]. Those checks do not fully validate renumbering, placeholder phase reality, or completion truth.

Estimate: the potential audit surface is 714 graph-metadata files under 026 and 18 under 027. The exact corrupt subset is unknown without a dedicated semantic freshness audit.

## 8. Question 3: Memory-Correctness Impact
The memory correctness issues are real under normal local operation.

Entity-density cache terms are built from high-degree memory titles and trigger phrases [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts:80]. `memory_update` can change those fields [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:91] and calls generic post-mutation hooks [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:306]. Those hooks clear several caches but do not invalidate entity density [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:20]. The impact is bounded by the 60-second TTL or another invalidating mutation [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts:8], but during that window graph-channel activation can be stale.

Atomic save writes the pending file, indexes prepared memory, then promotes the pending file [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:360]. `processPreparedMemory` creates the DB row inside the write transaction before promotion [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2534]. A post-index promotion failure can therefore leave an indexed record whose final file was not promoted.

## 9. Question 4: Security Severity Calibration
Community fallback is a genuine scoped retrieval bypass. The main pipeline receives `specFolder`, tenant, user, and agent scope [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:946]. The fallback then calls `searchCommunities` without scope [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1000], scans all community summaries [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/search/community-search.ts:124], and fetches member rows by ID only [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1006]. Because the feature is default-on [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts:704], this deserves P0 when governed scope is a confidentiality boundary.

Causal tools are similar but slightly different. `memory_causal_link` accepts bare source/target IDs [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:406], inserts an edge from those IDs [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:756], and `memory_causal_unlink` deletes by edge ID [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:743]. In a strictly local single-user MCP, this is best calibrated as P1 authorization/partition drift. If tenant/user/agent scope is promised as a security boundary, it escalates to P0.

## 10. Question 5: Deep-Loop Blast Radius
Prior fan-out artifacts are suspect when they rely on orchestration summaries as proof. The pool counts fulfilled workers as succeeded [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:207]. The CLI worker uses synchronous spawn [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:344], saves the child `exitCode`, and returns it as data [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:362]. Non-zero child exits therefore do not automatically become failed pool items.

Concurrency is also overstated because `spawnSync` blocks the event loop inside the async worker. The capped pool may be written for concurrency [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:174], but a blocking worker prevents the expected overlap.

Blast radius: the eight review slices in this packet each have five lineage reports, but their orchestration summaries report `total_cli_lineages=1`, `succeeded=1`, and `failed=0` [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/001-mcp-core/review/orchestration-summary.json]. Treat summary files as weak evidence; use lineage reports and direct source evidence instead.

## 11. Recommendations
1. Generate or test MCP tool contracts from one source: public `tool-schemas.ts`, Zod runtime schema, allowed-parameter map, handler-read fields, docs, catalog examples, and playbook calls should have a parity gate.
2. Patch scoped retrieval fallback before release: either pass normalized scope into community search and member fetch, or disable fallback for scoped queries until scoped membership can be proven.
3. Add governed scope to causal graph read/write tools and enforce source/target/edge ownership before mutation.
4. Add entity-density invalidation to update/delete mutation hooks and add a regression where title/trigger changes affect graph-channel routing immediately.
5. Move atomic save promotion before DB commit, or stage index writes so a promotion failure cannot leave durable DB rows pointing at non-promoted files.
6. Fix fan-out runtime so non-zero child exit codes reject the worker item, replace `spawnSync` with non-blocking child processes, and pass lineage `iterations` into the loop config rather than only timeout sizing.
7. Add metadata semantic-audit tooling for last-active pointers, renumbered descriptions, placeholder children, completion claims, and resource-map OK rows.

## 12. Eliminated Alternatives
| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Treat doc/schema drift as isolated docs typos | Runtime schemas, public schemas, handlers, docs, catalog, and tests all diverge in different combinations. | [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:575] | 1 |
| Trust graph metadata backfill as sufficient | Backfill refreshes folders and flags thin metadata but does not prove semantic launch/completion truth. | [SOURCE: file:.opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:227] | 2 |
| Dismiss entity-density as harmless cache trivia | It activates graph routing for entity-rich queries and has a 60-second TTL. | [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts:4] | 3 |
| Downgrade scoped fallback because MCP is local | Local threat lowers likelihood, but default-on fallback can still append out-of-scope rows to scoped retrieval. | [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1031] | 4 |
| Trust orchestration summaries as success proof | Worker fulfillment is based on returning, not child exit success. | [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:85] | 5 |

## 13. Open Questions
- Exact count of stale 026/027 metadata packets remains UNKNOWN. A dedicated semantic audit should enumerate invalid last-active, completion, placeholder, and renumbering states.
- Exact count of prior failed CLI lineages masked by fan-out remains UNKNOWN without replaying stdout logs and status ledgers from historical packets.
- The product-level security contract for tenant/user/agent scopes should be written explicitly. That contract determines whether causal bare-ID mutation is P1 or P0.

## 14. Blast Radius Estimates
| Area | Estimate | Basis |
|---|---:|---|
| 026 metadata files needing semantic audit | 714 | Count of `graph-metadata.json` under 026 [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/009-research-synthesis/research/lineages/codex-5/logs/evidence-counts.md:5]. |
| 027 metadata files needing launch audit | 18 | Count of `graph-metadata.json` under 027 [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/009-research-synthesis/research/lineages/codex-5/logs/evidence-counts.md:8]. |
| Current audit lineage reports | 40 | Five lineage reports across eight slices. |
| Current audit orchestration summaries suspect | 8 | Each slice summary reports one CLI lineage despite five reports. |
| Playbook scenario count drift | 4 files | Release gate says 380; category-folder count is 384 [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/009-research-synthesis/research/lineages/codex-5/logs/evidence-counts.md:26]. |

## 15. Severity Calibration
| Finding Class | Calibrated Severity | Reason |
|---|---|---|
| Community fallback governed-scope bypass | P0 if scope is security boundary; otherwise high P1 | Default-on path can append globally selected rows after scoped retrieval. |
| Causal graph bare-ID mutation | P1 local single-user; P0 scoped multi-principal | Mutates/deletes graph edges without ownership checks. |
| Fan-out non-zero exits counted success | P0/P1 | Can invalidate audit/research confidence by hiding failed lineages. |
| Entity-density stale cache | P1 | Real routing correctness issue, bounded by TTL. |
| Catalog/playbook count and link drift | P1/P2 | Blocks release confidence and operator reproducibility, lower direct runtime impact. |

## 16. Verification Plan
- Add schema parity tests that diff public tool schemas, runtime Zod schemas, allowed parameters, and handler-read fields.
- Add scoped community fallback regression with weak primary results and out-of-scope community members.
- Add causal graph authorization tests for link, unlink, stats, and drift reads.
- Add entity-density update/delete invalidation regression.
- Add atomic save promotion-failure regression that asserts no durable DB row remains when final promotion fails.
- Add fan-out tests where a child exits non-zero and the pool summary reports failure.
- Add metadata semantic-audit fixtures for stale last-active, renumbered child descriptions, placeholder children, and draft-complete states.

## 17. References
- [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/009-research-synthesis/spec.md]
- [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/001-mcp-core/review/deep-review-findings-registry.json]
- [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/002-mcp-retrieval-causal/review/deep-review-findings-registry.json]
- [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/003-mcp-session-index-schema/review/deep-review-findings-registry.json]
- [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/004-026-integrity/review/deep-review-findings-registry.json]
- [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/005-feature-catalog-playbook/review/deep-review-findings-registry.json]
- [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/006-governance-skdoc-skcode/review/deep-review-findings-registry.json]
- [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/007-interconnected-mcps/review/deep-review-findings-registry.json]
- [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/008-027-launch-state/review/deep-review-findings-registry.json]
