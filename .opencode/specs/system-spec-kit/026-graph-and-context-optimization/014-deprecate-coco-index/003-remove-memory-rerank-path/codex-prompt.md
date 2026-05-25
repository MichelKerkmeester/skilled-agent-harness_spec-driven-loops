ROLE
Senior TypeScript engineer executing a SCOPED, surgical removal. Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-deprecate-coco-index/003-remove-memory-rerank-path` (pre-approved, skip Gate 3). Load `sk-code`, run its verification commands.

CONTEXT
Deprecating CocoIndex + the shared rerank sidecar. THIS phase removes `mk-spec-memory`'s coupling to `system-rerank-sidecar` (the only non-coco consumer). The cross-encoder rerank was OPT-IN (default OFF); the sidecar is being deleted in a later phase. Authoritative edit-set (READ FIRST):
- `.../014-deprecate-coco-index/resource-map.md` §3 (D1 decision) + §4 (Phase 003 row)
- `.../001-touchpoint-research/research/iterations/iteration-002.md` (the rerank-sidecar consumer trace with file:line, incl. the positional fallback at cross-encoder.ts:319-330)

CRITICAL INVARIANT (D1 — must hold)
`mk-spec-memory`'s DEFAULT search MUST keep working after this phase. Today, when no rerank provider is available, `cross-encoder.ts` returns positional fallback scores (`scoringMethod:'fallback'`). After removing the sidecar/local provider, memory search MUST continue to return results via that fallback (or the existing RRF/vector path) — it must NOT throw, hang, or return empty. Removing the cross-encoder rerank is acceptable (it was opt-in); breaking default search is NOT.

ACTION (apply the edit-set from those docs). Key items:
1. `.opencode/skills/system-spec-kit/mcp_server/lib/search/cross-encoder.ts`: remove the `local` provider (the `localhost:8765` PROVIDER_CONFIG entry, the `rerankLocal()` HTTP call, and the `RERANKER_LOCAL`-based provider resolution). Since `local` is the only remaining provider (cloud rerankers were removed in 022/013), the module should cleanly degrade to the positional fallback path. PRESERVE the fallback (the function must still return valid scored results for callers).
2. `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts`: remove the `SPECKIT_CROSS_ENCODER` / `RERANKER_LOCAL` opt-in signal helpers (`hasAnyCrossEncoderOptInSignal`, `hasAnyRerankerOptInSignal` local-rerank branch, `isLocalRerankerEnabled`) and any now-dead references. Update callers so the rerank step is simply skipped (no provider).
3. `.opencode/bin/mk-spec-memory-launcher.cjs`: remove the `ensureRerankSidecar` import (line ~12) and its call (~449-451) + the `RERANK_SIDECAR_PORT` handling.
4. DELETE `.opencode/bin/lib/ensure-rerank-sidecar.cjs` (mk-spec-memory's helper; dead once the call is removed).
5. `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md`: remove the `SPECKIT_CROSS_ENCODER` / `RERANKER_LOCAL` / rerank-sidecar env documentation.
6. `.opencode/bin/mk-skill-advisor-launcher.cjs`: remove `RERANK_SIDECAR_PORT` from its env allow-list (~line 93).
7. Update/trim the cross-encoder + search-flags unit tests so they reflect the no-sidecar reality and the suite stays green (do NOT delete tests that protect the default-search fallback — keep/adjust those).

SCOPE LOCK (RM-8 — STRICT)
- ALLOWED WRITE PATHS (only): `.opencode/skills/system-spec-kit/mcp_server/lib/search/**`, `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md`, `.opencode/bin/mk-spec-memory-launcher.cjs`, `.opencode/bin/lib/ensure-rerank-sidecar.cjs`, `.opencode/bin/mk-skill-advisor-launcher.cjs`, and the directly-affected test files under `.opencode/skills/system-spec-kit/mcp_server/tests/**` that reference cross-encoder/rerank.
- BANNED (never touch): `.opencode/specs/**`, `.opencode/skills/mcp-coco-index/**`, `.opencode/skills/system-rerank-sidecar/**`, `.opencode/skills/system-code-graph/**`, `opencode.json` / `.vscode` / `.gemini` / `.codex` (those are phase 006), and anything outside ALLOWED.
- Do NOT git add/commit. Do NOT rebuild dist (the orchestrator rebuilds + commits).

VERIFY (run; report)
- `cd .opencode/skills/system-spec-kit/mcp_server && npx tsc --noEmit` (no new type errors).
- Run the search/cross-encoder unit tests (e.g. `npx vitest run lib/search` or the cross-encoder + search-flags test files) — they must pass, INCLUDING a test that confirms search returns scored results when no rerank provider is configured (the D1 fallback). If such a test does not exist, ADD a minimal one.
- `rg -n "RERANKER_LOCAL|SPECKIT_CROSS_ENCODER|localhost:8765|ensureRerankSidecar|rerank.?sidecar|RERANK_SIDECAR_PORT" .opencode/skills/system-spec-kit/mcp_server/lib/search .opencode/bin/mk-spec-memory-launcher.cjs .opencode/bin/mk-skill-advisor-launcher.cjs` returns ZERO live references.

FORMAT (end with)
- `CHANGED PATHS:` newline list of every file edited/created/deleted (exact repo-relative paths).
- `VERIFY:` results of each command (pass/fail + key output), explicitly confirming the D1 default-search-fallback invariant holds.
- `NOTES:` anything incomplete or needing follow-up.
