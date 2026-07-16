# Iteration 003 - RQ-A3 ccc_feedback graduation to active rerank-weight loop

## Focus

RQ-A3 asks whether `ccc_feedback` should graduate from write-only JSONL telemetry into a bounded feedback-driven rerank loop for `mcp-coco-index`. The answer is ADAPT: keep JSONL as the append-only audit/input stream, add a periodic local reducer that writes a small SQLite reweight table, and apply clamped score deltas during CocoIndex rerank. Do not re-embed, swap embedding models, or add SaaS dependencies.

## Actions Taken

- Read the CocoIndex search guidance. The skill docs present `ccc_feedback` as a "Quality Feedback Loop" and show two payloads: helpful feedback with `query`, `rating`, and `resultFile`; and not-helpful feedback with `query`, `rating`, and `comment` (`.opencode/skills/mcp-coco-index/references/search_patterns.md:344-352`).
- Read the current writer. `handleCccFeedback()` accepts `query`, optional `resultFile`, `rating`, and optional `comment`, writes `timestamp`, `query`, `resultFile`, `rating`, and `comment`, then appends one JSON object per line to `.opencode/skills/mcp-coco-index/feedback/search-feedback.jsonl` (`.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/ccc-feedback.ts:11-16`, `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/ccc-feedback.ts:44-60`).
- Read the schema/tool surface. `cccFeedbackSchema` requires non-empty `query`, requires `rating`, and leaves `resultFile` / `comment` optional (`.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:611-616`). The tool definition exposes the same enum ratings: `helpful`, `not_helpful`, and `partial` (`.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:781-798`).
- Verified current feedback is write-only. The feature catalog states direct MCP call only, with no hook/CI/session-bootstrap/memory command auto-fire, and explicitly says the JSONL write "does not alter ranking immediately" (`.opencode/skills/system-spec-kit/mcp_server/code_graph/feature_catalog/07--ccc-integration/02-ccc-feedback.md:22-32`). Repo search found writer/tests/docs references for `search-feedback.jsonl`, but no production reader that consumes it for ranking.
- Checked local event frequency. The workspace currently has no `.opencode/skills/mcp-coco-index/feedback/search-feedback.jsonl` file, so observed local event volume is 0 events. Under current code, frequency is therefore manual-only: one JSONL entry per successful direct `ccc_feedback` call, not one per search result or session.
- Read the current rerank insertion point. `_ranked_result()` is where raw vector distance becomes final score and `rankingSignals`; today it only adds implementation/docs/spec-research deltas and canonical-resource boost (`.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:177-223`). `query_codebase()` embeds the query once, fetches rows, and calls `_dedup_and_rank_rows()` with project canonical paths (`.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:293-323`).
- Read the prior adaptive CocoIndex precedent. The overfetch/dedup packet landed the vendored soft-fork, added `source_realpath`, `content_hash`, `path_class`, `raw_score`, and `rankingSignals`, and kept rerank bounded while preserving raw score (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/003-mcp-runtime-stress-remediation/004-cocoindex-overfetch-dedup/implementation-summary.md:53-64`). It verified the unit-level rerank behavior but live daemon probes were blocked by sandbox socket/log restrictions (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/003-mcp-runtime-stress-remediation/004-cocoindex-overfetch-dedup/implementation-summary.md:101-115`).
- Read adjacent memory-backend feedback precedent. System-spec-kit already uses SQLite for queryable feedback ledgers: `feedback_events` has indexed columns for type, memory id, query id, confidence, timestamp, and session id (`.opencode/skills/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:92-119`), and batch learning aggregates recent events with min-support plus a `MAX_BOOST_DELTA` of `0.10` (`.opencode/skills/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:1-15`, `.opencode/skills/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:34-48`).

## Findings

### F-iter003-001 - Current ccc_feedback schema is sufficient for weak path-class learning, but not result-rank learning

Verdict: ADAPT. LOC estimate: ~25-45 if adding derived fields; ~0 for read-only reducer derivation. Dependencies: none for path-class-only MVP; RQ-A1 classifier for intent-tag dimension.

Evidence: The public schema has `query`, optional `resultFile`, `rating`, and optional `comment` (`.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:611-616`), and the writer adds `timestamp` before appending JSONL (`.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/ccc-feedback.ts:50-60`). Ratings are only `helpful`, `not_helpful`, or `partial` (`.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:791-793`). There is no rank, score, path class, result range, result content hash, query id, session id, or full shown result set in the current payload.

Implication: the existing events can teach coarse preferences such as "for implementation-intent queries, `tests` results are often not helpful" if `resultFile` is present and the reducer derives `path_class`. They cannot support precise click/rank learning, NDCG-style evaluation, or exact-result demotion without adding rank/score/range metadata. Keep the MVP coarse and bounded.

### F-iter003-002 - Graduate via periodic reducer, not query-time JSONL scanning

Verdict: ADAPT. LOC estimate: ~120-180 for reducer; ~60-90 for SQLite table/schema helpers. Dependencies: none.

Evidence: The feedback sink writes newline-delimited JSON to a path under the skill folder (`.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/ccc-feedback.ts:44-60`), while the active query path is Python and currently performs tight query-time scoring in `_ranked_result()` and `_dedup_and_rank_rows()` (`.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:177-264`). The adjacent memory backend uses a SQLite `feedback_events` table with indices for queryable feedback (`.opencode/skills/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:92-119`), and its batch learner is explicitly periodic/aggregate rather than mutating live rankings per event (`.opencode/skills/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:1-15`).

Implication: keep `search-feedback.jsonl` as raw append-only audit input, then add a Python-side reducer such as `cocoindex_code/feedback.py` or `feedback_reducer.py` that reads only recent/unprocessed JSONL events and writes a compact local SQLite table. Query-time code should read the precomputed table or cached map, not parse JSONL on every search.

### F-iter003-003 - Reweight table should key on intent_tag + path_class, with score deltas clamped to +/-0.10

Verdict: ADAPT. LOC estimate: ~70-110 for rerank shim and cached loader. Dependencies: RQ-A1 for full intent tags; path-class-only fallback can use current `_has_implementation_intent()`.

Evidence: Iteration 001 already found path classes can become bounded intent priors and should preserve semantic distance as the dominant signal (`.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-pt-03/iterations/iteration-001.md:35-41`). Current rerank already applies small deterministic nudges: `implementation` +0.05, docs/spec research -0.05, canonical resources +0.10 (`.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:198-211`). The memory batch-learning precedent also caps a per-cycle feedback boost at `0.10` (`.opencode/skills/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:34-48`).

Implication: the active table should be small and explainable:

```sql
CREATE TABLE IF NOT EXISTS feedback_rerank_weights (
  intent_tag TEXT NOT NULL,
  path_class TEXT NOT NULL,
  window_start_ms INTEGER NOT NULL,
  window_end_ms INTEGER NOT NULL,
  helpful_count INTEGER NOT NULL DEFAULT 0,
  partial_count INTEGER NOT NULL DEFAULT 0,
  not_helpful_count INTEGER NOT NULL DEFAULT 0,
  sample_count INTEGER NOT NULL DEFAULT 0,
  delta REAL NOT NULL,
  updated_at_ms INTEGER NOT NULL,
  PRIMARY KEY (intent_tag, path_class)
);
```

Reducer formula can start simple: weighted signal = helpful `+1.0`, partial `+0.25`, not_helpful `-1.0`; require minimum support such as 5 rated events or 3 distinct queries before non-zero delta; compute `delta = clamp(weighted_signal / sample_count * 0.10, -0.10, +0.10)`. `_ranked_result()` then adds that delta after existing static rerank and appends a signal such as `feedback_rerank_delta:+0.04:path_class=implementation:intent=implementation`.

### F-iter003-004 - Cold start and privacy both argue for local-only fail-closed defaults

Verdict: ADAPT. LOC estimate: ~35-60 for feature flags, missing-table handling, and telemetry. Dependencies: none.

Evidence: The current workspace has no feedback JSONL file, so 0 feedback events must be a normal state. The current catalog says `ccc_feedback` is direct MCP-call only and has no auto-fire path (`.opencode/skills/system-spec-kit/mcp_server/code_graph/feature_catalog/07--ccc-integration/02-ccc-feedback.md:22-24`). The broader feedback stack already treats feedback logging as local shadow infrastructure by default, with environment flags for feedback logging, shadow feedback, and batch learned feedback (`.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:337-342`).

Implication: cold start is simply no-op: missing JSONL, missing SQLite table, empty table, or below-min-support buckets all produce `delta=0` and no ranking signal. Privacy does not require SaaS policy because all data stays local, but it does require avoiding comment text in learned tables. Store raw comments only in the existing local JSONL audit file; reducer output should contain counts, deltas, hashes/tags, and timestamps, not free-form comments.

### F-iter003-005 - Active implementation should be feature-flagged and evaluated before default-on

Verdict: ADAPT-with-feature-flag. LOC estimate: ~250-370 production LOC plus ~90-150 tests. Dependencies: Phase-005 for default-on evaluation; RQ-A1 for per-intent tags.

Evidence: Prior CocoIndex adaptive work shipped bounded path-class rerank and exposed `rankingSignals` for transparency (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/003-mcp-runtime-stress-remediation/004-cocoindex-overfetch-dedup/implementation-summary.md:57-64`). Iteration 002 chose the same pattern for HLD rerank: a disabled-by-default flag, small capped score nudges, and ranking signals rather than unobservable scoring changes (`.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-pt-03/iterations/iteration-002.md:57-63`). The current feedback corpus is empty locally, so no evidence supports default-on behavior yet.

Implication: add a flag such as `SPECKIT_COCOINDEX_FEEDBACK_RERANK=0` for live rerank and a separate reducer command/scheduler. Shadow mode can compute and emit would-have-applied deltas without changing order. Default-on should wait for Phase-005 evaluation or a CocoIndex-specific fixture suite proving that the deltas improve precision without suppressing rare but correct path classes.

## Questions Answered

- Should `ccc_feedback` graduate from write-only telemetry? Yes, ADAPT. It should graduate to a feedback-driven rerank-weight loop, but only through a periodic reducer and clamped, explainable rerank deltas.
- What is the current schema? Public input: `query`, `rating`, optional `resultFile`, optional `comment`. Persisted JSONL entry: `timestamp`, `query`, `resultFile` or null, `rating`, `comment` or null. Ratings are `helpful`, `not_helpful`, `partial`.
- What events get logged and how frequently? Only successful direct `ccc_feedback` MCP calls log events. There is no automatic per-search, per-result, hook, CI, bootstrap, or memory-command logging path. In this workspace the current feedback file is absent, so observed local persisted frequency is 0 events.
- Is there a reader today? No production reader found. The feature catalog explicitly says feedback does not alter ranking immediately, and repo references are writer, schema, tests, docs, and manual playbook coverage.
- What bounded online-learning design fits? A reducer reads recent/unprocessed JSONL entries, derives `path_class` from `resultFile`, derives `intent_tag` from the RQ-A1 classifier when available, aggregates helpful/partial/not-helpful counts, writes `feedback_rerank_weights`, and `_ranked_result()` applies a clamped +/-0.10 max delta.
- Full re-embed? No. Feedback changes only the post-retrieval rerank score. Embeddings and vector index contents are untouched.
- Extend JSONL or new SQLite table? Both, with different roles. Keep JSONL as raw append-only audit input for compatibility. Add a local SQLite reweight table for query-time consumption and indexed reducer state. Query-time JSONL scanning is the wrong layer.
- Cold start behavior? No-op. Missing file/table or insufficient support returns zero deltas and today's ranking.
- Privacy / multi-user? Since feedback is local-only, no SaaS dependency or central tenant boundary is needed. Still avoid copying free-form comments into learned tables; aggregate counts/deltas only.
- LOC estimate? Roughly ~250-370 production LOC: ~120-180 reducer, ~60-90 reweight table/schema, ~70-110 rerank shim/cached loader, plus ~90-150 focused tests. A path-class-only MVP can land at the low end; intent-tagged learning needs the RQ-A1 classifier.
- Does this require RQ-A1 ADOPT first? No. It requires the RQ-A1 ADAPT implementation only for the `intent_tag` dimension. Without RQ-A1, the MVP can key on coarse current intent (`implementation` vs `general`) plus `path_class`, using `_has_implementation_intent()`.

## Questions Remaining

- Should `ccc_feedback` collect `rank`, `score`, `path_class`, `resultRange`, and `queryId` at write time, or should v1 keep the writer unchanged and let the reducer derive only what it can?
- Should the reducer live as a `ccc feedback-reduce` CLI subcommand, a system-spec-kit MCP maintenance tool, or a daemon startup task?
- What minimum support threshold should Phase-005 evaluate: 5 rated events, 3 distinct queries, or a session-aware threshold once `ccc_feedback` captures session ids?
- Should exact-file feedback ever demote a specific `resultFile`, or is path-class-only safer for the first live loop?

## Next Focus

RQ-A4 - Few-shot example-bank retrieval for CocoIndex. Investigate whether validated helpful hits can become positive exemplars for future query expansion/rerank without leaking comments into prompts, adding SaaS dependencies, or changing embeddings.
