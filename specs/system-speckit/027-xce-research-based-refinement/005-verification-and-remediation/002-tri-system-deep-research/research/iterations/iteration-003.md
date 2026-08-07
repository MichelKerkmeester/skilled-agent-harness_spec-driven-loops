# Iteration 003 — Angle 3

**Angle:** FTS5 LIKE-metachar scope hardening: where unescaped LIKE/MATCH metacharacters in user input reach query surfaces.

**Summary:** FTS5 MATCH query text is mostly normalized/quoted before reaching MATCH, but LIKE scope predicates are not consistently escaped. system-skill-advisor did not expose LIKE/MATCH query surfaces in the searched source.

**Findings kept:** 3

## [P1][BUG] Raw specFolder LIKE widens scoped memory retrieval

- Evidence: .opencode/skills/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:179-187,196-197; .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:82-90,540-570,860-863; .opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:696-699,2147-2149; .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1873-1885
- Detail: User-provided specFolder values are passed into subtree predicates as raw LIKE patterns such as `${specFolder}/%` or `? || '/%'` without escaping `%` or `_`. An exact equality arm exists, but the LIKE arm can still overmatch sibling folders when the requested scope contains LIKE metacharacters.
- Fix sketch: Build spec-folder subtree parameters with escapeLikePattern(specFolder) plus `LIKE ? ESCAPE '\'` everywhere, preferably through one shared scope-clause helper.

## [P1][BUG] Code graph subject fallback escapes LIKE metachars without ESCAPE

- Evidence: .opencode/skills/system-code-graph/mcp_server/handlers/query.ts:769-778; .opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1333-1334; contrast hardened usage in .opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:295-310
- Detail: User-facing code graph relationship queries route file-like subjects through resolveSubjectFilePath(). That fallback replaces `%` and `_` with backslash-prefixed forms, but the SQL is `LIKE ?` without `ESCAPE '\'`, so the escaping contract is incomplete and paths containing LIKE metacharacters can fail or match unexpectedly.
- Fix sketch: Change the fallback SQL to `file_path LIKE ? ESCAPE '\'` and add coverage for partial subjects containing `_` and `%`.

## [P2][DOC-DRIFT] Known limitation documents only the FTS5 scope leak

- Evidence: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/012-hybrid-search-scope-then-limit/implementation-summary.md:116-118; broader code surfaces at .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:82-90 and .opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2147-2149
- Detail: The research packet says the raw LIKE scope issue is a pre-existing FTS5-only follow-up. The code shows the same raw specFolder subtree pattern exists in vector, keyword, constitutional, structural, and FTS5 lanes, so the documentation understates the affected surface.
- Fix sketch: Update the limitation/remediation notes to describe the shared scope-clause issue and track one cross-lane hardening task.
