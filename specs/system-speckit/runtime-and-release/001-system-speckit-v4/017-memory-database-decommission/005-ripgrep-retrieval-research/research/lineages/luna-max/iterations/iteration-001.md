---
title: "Iteration 1: Trigger-index contract and exact-lane parity"
trigger_phrases: []
---
# Iteration 1: Trigger-index contract and exact-lane parity

## Focus

Trace the live `exactTriggerSearch` behavior and turn it into a deterministic, non-embedding index contract for phase 001.

## Findings

1. The current trigger lane is not a simple exact-string lookup. It normalizes query text by lowercasing, replacing every non-ASCII-alphanumeric run with a space, collapsing whitespace, and trimming; it deduplicates tokens, then requires query tokens of length at least three and considers at most eight tokens. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/hybrid-search.ts:734-747,795-802]`

2. SQL candidate recall is an OR over `LOWER(m.trigger_phrases) LIKE '%token%'`, gated by non-empty trigger storage, active/archived policy, expiry, and optional spec-folder scope. This means partial-token substrings are intentionally admitted, and the index cannot drop filtering metadata or replace the caller-side scope/lifecycle predicates. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/hybrid-search.ts:804-837]`

3. The post-query score has four observable cases: normalized phrase equals normalized query (`1.0`); phrase contains query (`0.94`); query contains phrase (`0.88`); or at least 80% of query tokens overlap exact normalized phrase tokens, scored as `coverage * 0.75`. A phrase with fewer than two tokens cannot receive the overlap score. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/hybrid-search.ts:750-765]` The phase 001 index must either implement these cases over indexed phrase records or return a superset that is rescored by the same function; token-only lookup is not parity.

4. Candidate ordering is part of the observable contract: SQL first prefers rows whose serialized trigger field contains the complete normalized query, then newer `updated_at`/`created_at`, then ascending id; JavaScript then sorts by final score and recency. The trigger result is fused at weight `1.4`, and the final row exposes `triggerScore` and `exactTriggerMatch` for scores at least `0.94`. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/hybrid-search.ts:826-867,1670-1677,1938-1967]` A generated index should return stable path/phrase candidates but leave lifecycle recency and cross-channel fusion to the replacement layer.

5. Stored trigger phrases are JSON arrays or strings that parse to arrays; invalid JSON, non-array JSON, null, or empty values currently collapse silently to `[]`. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/vector-index-types.ts:212-226]` That is unsafe for generation: phase 001 REQ-006 asks for malformed-frontmatter reporting, so the generator must distinguish absent key, valid empty list, wrong type, malformed YAML, and non-string array members, report path plus line/reason, and refuse to publish a partial index by default. `[SOURCE: specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/spec.md:130-151]`

6. The existing test proves only full-phrase promotion and recency/id ordering between two matching rows; it does not cover partial tokens, punctuation normalization, case variants, token limits, phrase containment, malformed source, or an index-vs-SQL set comparison. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/tests/hybrid-search.vitest.ts:209-251,952-980]` The current phase plan already reserves parser, walker, deterministic emitter, conventions, parity, determinism, cold lookup, and daemon-off tasks, but it needs explicit fixtures for each untested semantic. `[SOURCE: specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/plan.md:66-104; specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/tasks.md:34-63]`

7. Recommended JSON shape: one versioned object with deterministic keys and no generation timestamp, for example `{schemaVersion:1, normalization:{case:"lower", separators:"non-ascii-alnum", minQueryTokenLength:3, maxQueryTokens:8, stopWords:[], stemming:"none"}, phrases:{<normalizedPhrase>:{raw:[...],tokens:[...],paths:[...]}}, tokenTrigrams:{<threeCharGram>:[<normalizedPhrase>...]}}`. Sort phrase keys, raw variants, tokens, paths, and trigram postings. Keep raw phrase text for diagnostics, normalized phrase text for the four score cases, full token lists for overlap, and trigram postings to reproduce any three-or-more-character substring admitted by SQL `LIKE` without embeddings. `[INFERENCE: derived from .opencode/skills/system-spec-kit/mcp-server/lib/search/hybrid-search.ts:734-765,804-837 and .opencode/skills/system-spec-kit/mcp-server/lib/search/vector-index-types.ts:217-225]`

8. Do not add stop-word removal or stemming in v1. The baseline removes only tokens shorter than three at the SQL entry point, still allows ordinary three-letter words, and has no stem expansion; adding either would change recall/precision and make a “superset” claim untestable. Preserve case-insensitive behavior through the same lower-and-strip normalization, rather than relying on a platform-specific Unicode or SQLite fold. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/hybrid-search.ts:734-747,801-819]`

9. Ranked amendment recommendation for phase 001: (P0) expand `spec.md` REQ-001/REQ-006/REQ-007 and success criteria to freeze the score cases, three-character substring recall, active/expiry/scope handoff, strict diagnostics, atomic no-partial-write behavior, and cold-process p95/max measurements; (P0) expand `plan.md` architecture to require phrase + full-token + trigram postings and a deterministic schema without timestamps; (P0) expand `tasks.md` T004/T006/T008/T011/T012 with negative and parity fixtures and a 20-run cold-start benchmark; (P1) expand the acceptance criteria with exact set equality for all frozen prompts and an explicit Unicode/punctuation policy. `[SOURCE: specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/spec.md:130-151,157-162,181-203; specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/plan.md:66-104,119-130; specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/tasks.md:44-63]`

## Ruled Out

- A phrase-only map with no substring postings is ruled out for parity because SQL uses `%token%` and admits partial tokens. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/hybrid-search.ts:817-819]`
- Stop-word removal and stemming are ruled out for v1 because neither exists in the baseline trigger lane and both alter the required superset relation. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/hybrid-search.ts:742-764]`

## Dead Ends

- The planned root-level `retrieval/generate-trigger-index.mjs`, `retrieval/parity-check.mjs`, and `retrieval/fixtures/prompt-set.json` are not present in this checkout; their intended work is described by phase 001 instead. I did not create them because this run is research-only and lineage-scoped. `[SOURCE: specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/plan.md:66-104; specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/tasks.md:44-63]`

## Edge Cases

- Queries with no normalized token of length three or more return no trigger candidates; queries with more than eight tokens ignore tokens after the first eight in the deduplicated normalized order. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/hybrid-search.ts:742-747,795-802]`
- A phrase containing a query substring can receive `0.94` even when token overlap is not exact; this must be tested separately from exact phrase equality. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/hybrid-search.ts:750-764]`
- Invalid trigger JSON is currently silent at read time, so generator diagnostics must be a stronger contract than runtime parsing. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/vector-index-types.ts:217-225]`

## Sources Consulted

- `[SOURCE: specs/system-speckit/049-memory-decommission/spec.md:77-105,115-180]`
- `[SOURCE: specs/system-speckit/049-memory-decommission/goal.md:43-55,83-95]`
- `[SOURCE: specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/spec.md:57-69,98-115,130-203]`
- `[SOURCE: specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/plan.md:66-104,119-130,273-302]`
- `[SOURCE: specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/tasks.md:34-63]`
- `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/hybrid-search.ts:734-867,1499-1677,1900-1967]`
- `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/vector-index-types.ts:212-226]`
- `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/tests/hybrid-search.vitest.ts:209-251,952-980]`
- `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/GUIDE.md]` — official guide used to confirm later literal-search and recursive-filter semantics; command-specific evidence is scheduled for iteration 2.

## Assessment

`newInfoRatio=0.92`. Confidence is high for the baseline trigger semantics because the SQL, scorer, parser, and test are directly present. The JSON shape, trigram index, and p95 threshold are recommendations derived from that baseline and must be proven by the future parity and benchmark tasks.

## Reflection

The code-first trace exposed a wider contract than the phase’s current “generated JSON + exact lookup” wording: SQL recall, JavaScript scoring, lifecycle filters, and output metadata are separate responsibilities. The productive approach was to preserve the existing scorer and enumerate negative probes before designing storage. The missing planned retrieval artifacts are a scope fact, not an implementation gap to repair here.

## Recommended Next Focus

Iteration 2: map each replacement of `memory_search`, `memory_context`, and `memory_quick_search` to reproducible ripgrep invocations, including JSON/file/count output, literal and case/word matching, multiline behavior, globs/types, sorting, max-count, preprocessors, and ignore-file precedence.
