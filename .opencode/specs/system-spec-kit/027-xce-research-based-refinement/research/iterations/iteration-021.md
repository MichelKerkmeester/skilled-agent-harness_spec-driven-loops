# Iteration 002 - RQ-A2 Coco-index rerank fusion with code-graph HLD/LLD

## Focus

RQ-A2 asks whether Phase 001's deterministic HLD/LLD narrative can feed `mcp-coco-index` reranking, so semantic-search hits get small, explainable boosts when their enclosing file or nearby symbol matches a query's architectural intent. The concrete proposal is not to replace embeddings or add graph schema edges, but to extend the existing bounded rerank stage beyond `path_class`.

## Actions Taken

- Read Phase 001 spec. The planned generator derives file role, layer, summary, primary symbols, symbol signatures, docstrings, direct dependencies, and complexity hints from existing `code_files`, `code_nodes`, and `code_edges` data (`.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-code-graph-hld-lld/spec.md:82-86`). Its public functions are planned as `generateHLD(filePath, db)`, `generateLLD(symbolId, db)`, and `generateFileNarrative(filePath, db)` (`.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-code-graph-hld-lld/spec.md:100-104`).
- Read Phase 001 plan. The plan calls out an open-string `file_role` contract and exported `classifyFileRole(filePath, db)` function (`.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-code-graph-hld-lld/plan.md:50-51`), with the generator owning HLD/LLD schema, role/layer helpers, stable sorting, and dependency row rendering (`.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-code-graph-hld-lld/plan.md:78-84`).
- Confirmed Phase 001 is not shipped yet. The implementation summary says the phase state is "Not implemented; spec-alignment pass only" and that no product code has been implemented (`.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-code-graph-hld-lld/implementation-summary.md:27-40`). A file search also found no shipped `code-graph-hld-lld.ts` implementation under the active `mcp_server/code_graph` tree.
- Read current CocoIndex rerank path. Query intent detection is a small keyword list for implementation intent (`.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:40-59`). `_ranked_result()` then adds only path-class and canonical-resource nudges: `implementation` +0.05, `spec_research` -0.05, `docs` -0.05, and canonical resource +0.10 (`.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:177-223`).
- Read the current retrieval boundary. `query_codebase()` embeds exactly one query, fetches rows, then passes them through `_dedup_and_rank_rows()` (`.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:293-323`). The `QueryResult` schema already has `raw_score`, `path_class`, and `rankingSignals`, so extra architectural signals can be additive and explainable (`.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/schema.py:24-36`).
- Read the CocoIndex to graph bridge. `seed-resolver.ts` consumes CocoIndex fields `file`, `range`, `score`, optional `snippet`, `rawScore`, `pathClass`, and `rankingSignals` (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/seed-resolver.ts:19-35`), resolves file/line to exact, near-exact, enclosing, or file-anchor refs (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/seed-resolver.ts:1-5`), and preserves fork telemetry without changing score/order/confidence (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/seed-resolver.ts:110-133`).
- Read the current calibration wrapper. `cocoindex-calibration.ts` only knows candidate id/path/rawScore/pathClass (`.opencode/skills/system-spec-kit/mcp_server/lib/search/cocoindex-calibration.ts:5-12`) and emits overfetch/dedup/path-class-count telemetry, not role-aware scores (`.opencode/skills/system-spec-kit/mcp_server/lib/search/cocoindex-calibration.ts:61-88`).

## Findings

### F-iter002-001 - HLD/LLD has enough signal for role-aware rerank, but the consumable field is `file_role`, not a closed `architectural_role` enum

Verdict: ADAPT. LOC estimate: ~0 for Phase 001, ~20-35 in the fusion shim for query-intent-to-role matching. Dependencies: Phase-001.

Evidence: Phase 001's HLD contract already returns `{file_role, layer, summary, primary_symbols[]}` and LLD returns `{signature, docstring, direct_dependencies[], complexity_hints}` (`.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-code-graph-hld-lld/spec.md:100-104`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-code-graph-hld-lld/spec.md:150-151`). It also explicitly requires `classifyFileRole(filePath, db)` to equal `generateHLD(file, db).file_role` and be exported for downstream consumers (`.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-code-graph-hld-lld/spec.md:156-160`). The role domain is open string with baseline labels `module`, `api-handler`, `library`, `test`, `config`, and reserved `empty`; consumers must not treat it as a closed enum (`.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-code-graph-hld-lld/spec.md:164-167`).

Implication: CocoIndex should consume `hld.file_role` under an internal alias like `architectural_role`, plus `hld.layer` and selected `primary_symbols`. It must not depend on a closed enum such as only `module_init` or `middleware_setup`. Those richer labels can appear later because the field is open-string, but the first shim should map broad query intents to whatever roles Phase 001 actually emits.

### F-iter002-002 - Prefer a static HLD/LLD export over a live DB query from CocoIndex

Verdict: ADAPT. LOC estimate: ~45-70 for sidecar loading and lookup, excluding Phase 001 export generation. Dependencies: Phase-001.

Evidence: CocoIndex rerank runs in Python inside `query.py`, while Phase 001 is planned as TypeScript system-spec-kit code (`.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-code-graph-hld-lld/plan.md:45-48`). The current CocoIndex result rows already carry file path and start/end line information (`.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:183-193`) and final results expose `rankingSignals` (`.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/schema.py:24-36`). The existing graph bridge resolves CocoIndex file/range to graph refs after search rather than making CocoIndex call graph DB APIs during rerank (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/seed-resolver.ts:110-133`).

Implication: the lowest-coupling design is a static sidecar export produced by Phase 001, keyed by normalized `file_path`, for example:

```json
{
  "generated_at": "2026-05-09T00:00:00Z",
  "graph_fingerprint": "schema-version-or-scan-id",
  "files": {
    "src/auth/middleware.ts": {
      "content_hash": "...",
      "file_mtime_ms": 0,
      "hld": {
        "file_role": "middleware_setup",
        "layer": "presentation",
        "primary_symbols": [
          {"symbol_id": "...", "kind": "function", "name": "initAuth", "start_line": 12, "end_line": 48}
        ]
      }
    }
  }
}
```

Live DB query is possible, but it crosses Python/TypeScript/runtime boundaries and would make the fast local rerank path depend on graph DB availability. Static export lets CocoIndex degrade to today's behavior when absent.

### F-iter002-003 - The rerank insertion point is small and should stay bounded like the existing +/-0.05 path-class nudge

Verdict: ADAPT-with-feature-flag. LOC estimate: ~90-140 production LOC plus ~60-100 tests. Dependencies: Phase-001; Phase-005 for default-on evaluation.

Evidence: `_ranked_result()` is already the central place where raw embedding score becomes final score and `rankingSignals` are attached (`.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:177-223`). `_dedup_and_rank_rows()` sorts by final score and then dedups (`.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:226-264`), so a role boost before that sort affects ordering without changing retrieval itself. Iteration 001 already concluded path-class intent priors should remain bounded because semantic distance should dominate (`.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-pt-03/iterations/iteration-001.md:35-41`).

Implication: add a disabled-by-default flag such as `SPECKIT_COCOINDEX_HLD_RERANK=1`. When enabled, load the sidecar once, infer query intent family, and pass an optional `architectural_context` map into `_ranked_result()`. Boosts should be capped, likely +0.03 for file-role match and +0.02 for chunk range near a primary symbol, with signals like `hld_file_role_boost:middleware_setup` and `hld_primary_symbol_proximity_boost`. Do not exceed the existing path-class magnitude unless Phase 005 proves better precision.

### F-iter002-004 - Stale HLD/LLD is the main correctness risk and must fail closed

Verdict: ADAPT. LOC estimate: ~35-55 for freshness checks and telemetry. Dependencies: Phase-001.

Evidence: Code graph stores `content_hash`, `file_mtime_ms`, and `indexed_at` in `code_files` (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:107-117`), and stores each node's `content_hash` as well (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:120-135`). The Phase 001 plan also keeps determinism and stable sorting as core requirements (`.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-code-graph-hld-lld/plan.md:50-67`). The current calibration wrapper already has a pattern for additive telemetry that changes limits only when flags and thresholds say it should (`.opencode/skills/system-spec-kit/mcp_server/lib/search/cocoindex-calibration.ts:46-88`).

Implication: the sidecar must carry at least `content_hash`, `file_mtime_ms`, and a graph-level generation/fingerprint. CocoIndex should suppress HLD boosts for any file whose sidecar freshness cannot be established, whose role export is missing, or whose file hash/mtime conflicts with available chunk/source metadata. Suppression should add telemetry/ranking signal only when useful, for example `hld_rerank_skipped_stale`, but it should not penalize the result.

### F-iter002-005 - Pt-03 should defer implementation until Phase 001 ships, but can keep the design as a feature-flagged follow-on

Verdict: DEFER for active implementation; ADAPT as a post-Phase-001 feature-flag design. LOC estimate: ~150-240 total including tests. Dependencies: hard Phase-001, optional Phase-005 evaluation.

Evidence: Phase 001 is explicitly not implemented yet (`.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-code-graph-hld-lld/implementation-summary.md:27-40`). Its plan still lists generator, handler, registration, and omni work as future tasks (`.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-code-graph-hld-lld/plan.md:105-118`). Phase 001 is also the phase that downstream work depends on for `classifyFileRole` (`.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-code-graph-hld-lld/plan.md:136-142`).

Implication: RQ-A2 should not ask CocoIndex to implement a role boost today. The correct packet decision is: define the sidecar contract now, defer code until Phase 001 emits deterministic role data, and ship behind an env flag. If Phase 001 slips, pt-03 can still complete RQ-A3/A4/A5 because CocoIndex's existing path-class rerank and feedback-loop topics are independent.

## Questions Answered

- Can Phase 001's deterministic HLD/LLD narrative be folded into CocoIndex rerank? Yes, but only as a bounded ADAPT after Phase 001 ships. The right field is `hld.file_role`/`classifyFileRole()` plus `hld.layer` and `primary_symbols`, not a new closed `architectural_role` enum.
- What fields does CocoIndex need? Minimum: `file_path`, `content_hash`, `file_mtime_ms`, `hld.file_role`, `hld.layer`, and `hld.primary_symbols[]` with `symbol_id`, `kind`, `name`, `start_line`, and `end_line`. Optional: `lld.direct_dependencies` and `complexity_hints` for future intent families, but not MVP rerank.
- Static export or live DB query? Static export. It avoids making Python CocoIndex depend on live TypeScript graph APIs during ranking and preserves the current failure mode: absent role context means today's rerank behavior.
- LOC estimate? Approximately ~150-240 total: ~45-70 sidecar loader/normalizer, ~35-55 query-intent-to-role mapping, ~35-55 score/signal integration, and ~35-60 freshness checks plus focused tests. Production-only shim could be ~90-140 LOC.
- What if Phase 001 has not shipped? DEFER active implementation. Keep the design as ADAPT-with-feature-flag so it can be implemented immediately after Phase 001 emits a stable HLD export.
- How to mitigate stale HLD/LLD? Fail closed: require sidecar freshness metadata, compare available hashes/mtimes/fingerprints, skip boosts on mismatch, and surface `hld_rerank_skipped_stale` telemetry without penalizing the result.

## Questions Remaining

- Should Phase 001 itself own the sidecar export, or should a small Phase 001 follow-up command generate it for CocoIndex only?
- What query intent taxonomy should map to open-string `file_role` labels without accidentally freezing the role domain?
- Should Phase 005 evaluate HLD rerank in a CocoIndex-specific fixture suite first, or only in the broader code-graph adoption harness?
- Can primary-symbol proximity be computed reliably from chunk start/end lines alone, or does it need graph-side seed resolution before rerank?

## Next Focus

RQ-A3 - `ccc_feedback` JSONL graduation to active rerank-weight loop. Investigate whether existing write-only telemetry can become a bounded, auditable feedback signal for future query scoring without full re-embed or online model changes.
