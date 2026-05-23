---
title: "Feature Specification: FTS5 Default Lexical With Guardrails"
description: "Implement Option B from packet 013: make SQLite FTS5 the default lexical BM25 provider while preserving legacy fallback and adding golden-query guardrails."
trigger_phrases:
  - "fts5 default lexical guardrails"
  - "speckit bm25 engine"
  - "sqlite fts5 lexical default"
  - "golden query overlap gate"
importance_tier: "high"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/014-fts5-default-lexical-with-guardrails"
    last_updated_at: "2026-05-19T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented FTS5 lexical default guardrails"
    next_safe_action: "Run verification gates and stage source-only files"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/lexical-normalizer.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/bm25-index.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/lexical-overlap-quality-gate.vitest.ts"
---
# Feature Specification: FTS5 Default Lexical With Guardrails

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Implemented, verification pending |
| **Created** | 2026-05-19 |
| **Branch** | `main` |
| **Spec Folder** | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/014-fts5-default-lexical-with-guardrails` |
<!-- /ANCHOR:metadata -->

---
<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Packet 013 recommended Option B: stop warming the resident JavaScript BM25 index by default and use SQLite FTS5 as the lexical BM25 rank provider, but only with guardrails. The risk is not RRF itself; the risk is losing shared synonym expansion, stemming visibility, identifier fixtures, and tests that distinguish implementation detail from retrieval quality.

This packet implements those guardrails atomically so the default switch lands with rollback flags, quality fixtures, and docs.
<!-- /ANCHOR:problem -->

---
<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Extract shared lexical normalization into `lib/search/lexical-normalizer.ts`.
- Preserve legacy `bm25-index.ts` exports for backward compatibility.
- Add `SPECKIT_BM25_ENGINE` with `auto`, `sqlite`, `packed-inmemory`, and `legacy-inmemory`.
- Gate startup BM25 warmup according to the selected engine.
- Populate the BM25 channel from FTS5 in `auto`/`sqlite` when `memory_fts` exists.
- Add 30-query golden fixture and overlap@5 quality gate.
- Update BM25/hybrid tests to pin legacy singleton assertions to `legacy-inmemory`.
- Document operator behavior in environment and architecture docs.

### Out of Scope

- Deleting `bm25-index.ts`.
- Implementing packed in-memory term-id storage.
- Changing RRF channel weights.
- Changing the FTS5 schema/tokenizer.
- Adding `dist/` artifacts.
<!-- /ANCHOR:scope -->

---
<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Shared normalizer | BM25 and FTS5 import lexical query normalization from `lexical-normalizer.ts`; `bm25-index.ts` re-exports the legacy API. |
| REQ-002 | Golden fixture | `golden-queries.json` contains 30 packet-013 queries and at least 20 fixture docs including stemmer and identifier edge rows. |
| REQ-003 | Quality gate | `lexical-overlap-quality-gate.vitest.ts` asserts overlap@5 >= 0.8 for prose, synonym, RRF, and title/trigger/file-path gate groups. |
| REQ-004 | Legacy tests preserved | Existing warm JS singleton assertions run under `SPECKIT_BM25_ENGINE=legacy-inmemory`. |
| REQ-005 | Engine flag | `auto` skips JS warmup when `memory_fts` exists; `sqlite` never warms JS BM25; `legacy-inmemory` restores old behavior; `packed-inmemory` warns and falls back. |
| REQ-006 | Health/docs | Full memory health reports lexical engine and warm status; docs explain the flag and rollout behavior. |
<!-- /ANCHOR:requirements -->

---
<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- `validate.sh <014> --strict` passes.
- Typecheck and build pass for the MCP server.
- `lexical-overlap-quality-gate`, `bm25-index`, `hybrid-search`, and `sqlite-fts` targeted Vitest runs pass or any failure is documented with evidence.
- Integration probe shows `auto` with FTS5 does not call `rebuildFromDatabase()`, and `legacy-inmemory` does.
- Commit handoff lists source-only paths and excludes `dist/`.
<!-- /ANCHOR:success-criteria -->

---
<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Impact | Mitigation |
|------|--------|------------|
| FTS5 tokenization diverges on stems or identifiers | Known edge queries may rank differently | The gate keeps those classes observable but does not block them until Option C evidence exists. |
| Tests assume BM25 means JS singleton | Default switch could break implementation-detail assertions | Tests pin legacy mode explicitly where singleton behavior is the subject. |
| FTS5 unavailable in `sqlite` mode | Forced mode would silently lose lexical search | `sqlite` throws a clear error instead of warming JS BM25. |
| Duplicate FTS/BM25 channel rows under compatibility tagging | Keyword list may contain overlapping lexical evidence | Existing keyword fusion already handles overlapping lexical lanes; RRF weights are unchanged. |
<!-- /ANCHOR:risks -->

---
<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should a future packet enable FTS5 `tokenchars` or Porter stemming if golden queries cluster failures in identifiers or suffix-heavy words?
- Should `packed-inmemory` remain in the same env enum after its future implementation, or move behind a separate experimental flag?
<!-- /ANCHOR:questions -->

---
<!-- ANCHOR:nfr -->
## 8. NON-FUNCTIONAL REQUIREMENTS

- **Performance**: Default `auto` must avoid resident JS BM25 warmup when `memory_fts` exists.
- **Compatibility**: Existing imports from `bm25-index.ts` must keep working.
- **Operability**: Operators must be able to restore legacy behavior with one env var.
- **Testability**: Golden fixtures must be deterministic and runnable without a production daemon.
<!-- /ANCHOR:nfr -->

---
<!-- ANCHOR:edge-cases -->
## 9. EDGE CASES

- Empty or operator-only queries should still produce empty lexical results after sanitization.
- Stemmer-heavy and identifier-heavy queries may diverge between JS BM25 and FTS5; the golden suite observes those classes without blocking the default switch.
- `SPECKIT_BM25_ENGINE=sqlite` with no `memory_fts` table should fail clearly instead of warming the JS singleton.
<!-- /ANCHOR:edge-cases -->

---
<!-- ANCHOR:complexity -->
## 10. COMPLEXITY ASSESSMENT

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Scope | 16/25 | Shared normalizer, runtime routing, test fixture, and docs. |
| Risk | 16/25 | Search-quality default change with legacy fallback. |
| Research | 12/20 | Directly implements predecessor packet findings. |
| Coordination | 8/15 | Multiple files under MCP server and spec docs. |
| **Total** | **52/100** | **Level 2** |
<!-- /ANCHOR:complexity -->
