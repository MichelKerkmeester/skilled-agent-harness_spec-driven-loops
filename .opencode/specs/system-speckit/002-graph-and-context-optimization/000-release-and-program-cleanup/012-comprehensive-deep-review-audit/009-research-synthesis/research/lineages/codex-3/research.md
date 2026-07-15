# Research Synthesis: System Spec Kit Deep Review Audit

## Executive Summary

The audit findings are not one isolated stale-doc failure. They cluster into five root causes: hand-maintained MCP contracts, metadata ownership split across save/backfill/catalog paths, incomplete write-path invalidation, scoped retrieval gaps in late fallback and causal graph tools, and fan-out runtime accounting that treats subprocess failures as successful pool items.

The most actionable root cause is contract governance drift. Public MCP schemas, Zod validation, handlers, install docs, feature catalog entries, and manual playbooks carry separate versions of the same tool behavior. `memory_embedding_reconcile` is the clearest example: the public schema exposes `dryRun`, `force`, and `activeOnly`, the Zod allow-list permits only `mode` and `limit`, the runtime uses `mode:"apply"` for mutation, and docs/catalog still advertise `dryRun:false` or `activeOnly`. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:342] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:583] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:299] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:737] [SOURCE: file:.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:654]

Memory correctness impact is real but uneven. Entity-density cache staleness can corrupt graph-channel routing signals after updates until invalidation, TTL, or restart. Atomic save ordering is narrower: successful saves promote the pending file after indexing, but a crash or promotion failure between DB commit and final file promotion can leave DB/file state inconsistent. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/search/query-router.ts:247] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tests/integration/entity-density-commit-hooks.vitest.ts:112] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:362] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:378]

Security severity should be calibrated to the actual local MCP threat model. Community fallback and causal graph tools are genuine governed-scope defects, not acceptable by design. Under a local single-user trusted-client model, they are P1 high correctness/privacy-boundary risks. They become P0 when tenant, user, or agent scope fields represent mutually untrusted principals on a shared server or when untrusted callers can invoke the MCP tools. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/009-research-synthesis/spec.md:60]

Fan-out runtime defects make orchestration summaries suspect, but this campaign is not proven to have missing lineages. The runner can mask nonzero CLI exits because it returns `exitCode` as normal output and the pool counts fulfilled worker returns as success. [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:362] [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:207] The current eight review slices each show five started and five completed ledger entries plus per-lineage completion sentinels, while each summary reports only one lineage. That means summaries are not certification artifacts; check each lineage state and captured stdout directly. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/001-mcp-core/review/orchestration-summary.json:6] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/001-mcp-core/review/orchestration-status.log:1] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/001-mcp-core/review/lineages/codex-1/logs/fanout-lineage.out:1]

## Research Questions Answered

### Q1: Common root cause for doc/schema-to-code drift

Answer: the dominant cause is divergent hand-maintained contracts, not one broken generator. There is no evidence of one source-of-truth manifest that generates public tool schemas, Zod schemas, handlers, install docs, catalog entries, and playbook scenarios together. The `memory_embedding_reconcile` drift spans every layer: public schema accepts fields that runtime validation drops, runtime mutation uses `mode:"apply"`, docs still describe `dryRun:false`, and catalog/playbook wording diverges from code. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:342] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:583] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:301] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:955]

Remediation target: define a typed contract manifest for MCP tools and generate or validate public JSON schemas, Zod schemas, handler argument surfaces, catalog rows, and playbook scenarios from it. Short of generation, add a contract parity test that fails when public schemas, Zod allow-lists, and docs disagree.

### Q2: Metadata drift systemicness

Answer: systemic, but split across multiple owners. It is not just `generate-context.js`, and it is not just manual edits.

Observed mechanisms:

- Active-child chronology is owned by canonical save and preserved by graph refresh. The 026 parent still points to `004-code-graph` as last active, while graph derivation explicitly preserves `last_active_child_id` and `last_active_at`. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/graph-metadata.json:156] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1096]
- Status derivation can mark draft placeholder packets complete. 027 phases 003 through 006 are draft in the phase map, but graph metadata marks them `complete` because placeholder implementation summaries exist without checklist/frontmatter status. [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:133] [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-incremental-index-foundation/graph-metadata.json:42] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1030]
- Resource maps and changelog rollups are stale snapshot/catalog surfaces. The 026 resource map warns that it is a pre-wave-4 snapshot and should not be used for navigation. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/resource-map.md:24]
- Description metadata can retain stale renumbering when not regenerated. 027 `005-learning-feedback-reducers` still titles itself as phase 009 and carries `specId` 007. [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-learning-feedback-reducers/description.json:2] [SOURCE: file:.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-learning-feedback-reducers/description.json:53]

Blast radius observed in this lineage: at least four false-complete 027 draft child graph-metadata files plus multiple 026 surfaces: parent chronology, resource-map, changelog rollup, and one reference-remediation packet with conflicting progress metadata. This is a lower-bound sample, not an exhaustive corpus count.

### Q3: Memory correctness real impact

Answer: yes for graph-channel routing, narrower for atomic-save ordering.

Entity-density staleness is a real retrieval quality bug because graph channel routing reads stale title/trigger-derived density terms. The integration test demonstrates stale terms after update, and the router consumes entity density to select the graph channel. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tests/integration/entity-density-commit-hooks.vitest.ts:112] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/search/query-router.ts:247]

Atomic save ordering is not continuous corruption during successful saves. The code writes a pending file, indexes, then promotes the pending file. The risk is the crash or file-promotion failure window between DB write and final file state. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:362] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:378]

Remediation target: invalidate entity-density cache after memory save/update/delete/bulk-delete commits; add a failure-injection test for atomic save between index and promotion.

### Q4: P0 security severity calibration

Answer: the defects are genuine vulnerabilities only under a shared or untrusted-principal threat model. Under local single-user MCP, classify as P1 high correctness/privacy-boundary bugs.

Community fallback bypasses governed scope. The main pipeline receives `tenantId`, `userId`, and `agentId`, and normal stage-1 paths filter scoped rows. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:955] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1084] The community fallback runs after the pipeline, calls community search without scope, fetches member rows by `id IN (...)`, and appends them. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1000] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1006] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1031]

Causal graph tools use bare IDs. Their schemas expose source, target, memory, and edge IDs with no governed scope fields, and handlers insert/delete directly through storage. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:451] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:406] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:757] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:747]

Severity recommendation: P1 by default for current local single-user MCP. Promote to P0 when the deployment has multiple mutually untrusted tenants/users/agents, shared memory stores, or remote/untrusted tool callers.

### Q5: Deep-loop blast radius

Answer: code-path blast radius is broad, but current campaign damage is not proven.

Runner defects:

- Nonzero lineage exits can be counted successful because `exitCode` is returned as normal worker output and the pool counts fulfilled returns. [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:362] [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:92]
- A single `fanout-run` process can serialize CLI lineages because it uses `spawnSync` inside the async worker. [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:344]
- The documented `iterations` override only sizes timeout and is not included in the loop prompt. [SOURCE: file:.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts:292] [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:154]
- Codex service-tier fallback emits `service_tier=default`, outside the schema values `priority`, `standard`, and `fast`. [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:177] [SOURCE: file:.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts:13]

Suspect artifacts:

- Every `orchestration-summary.json` under the eight sibling review slices. The summaries report one lineage and one success, while ledgers record five starts and five completions.
- Any historical multi-lineage fan-out run that did not independently check per-lineage stdout, state JSONL, and completion sentinels.
- Governance slice `codex-3` executor fidelity, because its audit log says `dispatch_status=self_invocation_refused`. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/006-governance-skdoc-skcode/review/lineages/codex-3/logs/executor-audit.log:4]

Not proven: current eight review slices did not necessarily under-deliver concurrency. Their ledgers show concurrent one-lineage starts, and captured stdout sentinel files exist. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/001-mcp-core/review/orchestration-status.log:1] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/001-mcp-core/review/lineages/codex-1/logs/fanout-lineage.out:1]

## Root-Cause Hypotheses

| Root cause | Confidence | Evidence | Remediation target |
|------------|------------|----------|--------------------|
| Tool contracts are hand-maintained across schema, validation, handler, docs, catalog, and playbook surfaces | High | `memory_embedding_reconcile` drift across public schema, Zod, runtime, install guide, and catalog | Contract manifest plus parity tests |
| Metadata freshness is split across canonical save, graph refresh, description generation, and snapshot docs | Medium-high | Preserved active-child pointer, placeholder-complete status heuristic, stale resource map, stale description renumbering | Single metadata reconciliation command and stale-surface detector |
| Memory write paths do not consistently invalidate derived retrieval caches | High | Entity-density stale after update, query router consumes density | Invalidate entity-density on save/update/delete/bulk-delete commit |
| Governed-scope model is applied in the main retrieval path but not late fallback and causal graph paths | High | Community fallback and causal APIs bypass scope fields | Add scope fields and fail-closed post-filtering |
| Fan-out orchestration treats subprocess completion and lineage success as different things | High | Nonzero exit returned as output, pool success based on fulfilled status | Throw on nonzero, require sentinel/state validation, use async spawn |

## Blast Radius

The broadest blast radius is contract drift. Any MCP tool represented in public schema, Zod schema, handler, docs, catalog, and manual playbook can drift until there is a shared contract or parity test. The concrete verified instance is `memory_embedding_reconcile`.

Metadata drift affects at least two active program tracks: 026 and 027. Verified lower bound: four 027 draft child packets falsely marked complete, one stale 027 description renumbering surface, and at least four 026 catalog/progress surfaces. Corpus-wide count remains unknown because this lineage did not exhaustively scan every packet.

Memory correctness blast radius is bounded to retrieval/routing quality and crash-window durability. It is not evidence of continuous row corruption in successful saves.

Security blast radius depends on deployment. Single-user local use is P1. Shared governed stores or untrusted tool callers make the same bugs P0.

Fan-out blast radius includes any historical orchestration summary used as proof without per-lineage verification. The current review artifacts should be certified from lineage logs and state, not from the summary files alone.

## Eliminated Alternatives

| Alternative | Disposition | Reason |
|-------------|-------------|--------|
| Count every registry row as a unique root cause | Eliminated | Merged lineages duplicate near-identical findings, which inflates counts. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/001-mcp-core/review/deep-review-findings-registry.json:17] |
| Treat entity-density staleness as full memory corruption | Eliminated | The stale value affects graph routing signal quality, not the stored memory row itself. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/search/query-router.ts:247] |
| Treat atomic save ordering as continuous successful-save corruption | Eliminated | The normal path promotes the pending file after indexing; risk is the crash/failure window. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:378] |
| Treat metadata drift as only manual edits | Eliminated | Graph status heuristics and pointer preservation are code-level systemic mechanisms. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1030] |
| Treat graph backfill as sufficient for all metadata drift | Eliminated | Backfill preserves chronology pointers and does not regenerate resource maps, changelog rollups, or stale description renumbering. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1096] |
| Treat P0 as unconditional for local MCP | Eliminated | The charter explicitly asks for local single-user calibration with no untrusted network input. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/009-research-synthesis/spec.md:60] |
| Treat current eight review slices as proven missing-lineage failures | Eliminated | Ledgers record five completions and captured stdout sentinels exist, though summaries remain suspect. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/001-mcp-core/review/lineages/codex-1/logs/fanout-lineage.out:1] |

## Recommended Remediation Order

1. Patch fan-out result accounting first. Make nonzero subprocess exit, timeout, missing sentinel, or missing state a failed pool item. Regenerate summaries from per-lineage state.
2. Patch community fallback scope. Pass `specFolder`, tenant, user, and agent into community search or post-filter `memberRows` before append.
3. Patch causal graph scope. Add governed scope fields and verify source, target, edge, and related memory ownership before read/mutation.
4. Add entity-density invalidation on memory save/update/delete/bulk-delete commit.
5. Fix metadata status derivation so placeholder implementation summaries do not imply completion.
6. Add a contract parity suite for MCP public schemas, Zod schemas, handlers, install guide snippets, feature catalog rows, and playbook examples.
7. Regenerate or explicitly archive stale resource maps, changelog rollups, and description metadata after path reorganizations.

## Convergence Report

- Stop reason: converged by hard stop, all key questions answered.
- Iterations completed: 4.
- Questions answered: 5/5.
- New info ratio trend: 1.00 -> 0.72 -> 0.64 -> 0.58.
- Rolling average over last three evidence iterations: 0.65.
- MAD noise floor: 0.10, latest ratio 0.58.
- Entropy coverage: 1.00.
- Composite stop score: 0.35. The composite score alone does not stop the loop, but the hard all-questions-answered stop applies.
- Legal stop gates: pass.
- Graph gates: not applicable. Code Graph was unavailable, so this lineage used direct file reads and sibling review artifacts.

## Confidence and Gaps

High confidence: contract drift, entity-density routing impact, community fallback scope bypass, causal ID-only tools, fan-out nonzero exit masking.

Medium-high confidence: metadata drift mechanisms and current review-artifact blast radius.

Known gap: no exhaustive corpus-wide packet count for metadata drift. The count in this synthesis is a verified lower bound from the highest-signal 026/027 surfaces.

## References

- Iteration 1: `iterations/iteration-001.md`
- Iteration 2: `iterations/iteration-002.md`
- Iteration 3: `iterations/iteration-003.md`
- Iteration 4: `iterations/iteration-004.md`
- Delta files: `deltas/iter-001.jsonl` through `deltas/iter-004.jsonl`
- Packet-local resource map: `resource-map.md`
