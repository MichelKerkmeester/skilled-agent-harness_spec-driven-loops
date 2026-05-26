# Iteration 003 — Q3 Capability-Gap Assessment

## Focus

Q3: Does code-graph + Grep cover "find code by concept/intent" (semantic code search), or is there a genuine user-facing gap? Does MMR + ADR-011 rescue layer adequately replace the cross-encoder reranker? Surface any FLAG/FEATURE/DOC that still promises removed capability (beyond already-found tool-schemas.ts + gemini search.toml).

## Actions Taken

1. **Read routing docs** — AGENTS.md code-search decision tree, `.claude/CLAUDE.md`, `.gemini/GEMINI.md`, `system-code-graph/SKILL.md` (line 52 "When NOT to use" section), `system-spec-kit/SKILL.md` (line 420-422 "Reranking removed" section), `embedder_architecture.md` (line 172 deprecation note).
2. **Swept for live `mcp__cocoindex_code__search` call sites** (non-spec, non-changelog, non-z_archive files) → **ZERO hits**. The deprecation cleanup is complete — no live code/agent/command expects cocoindex.
3. **Read stage3-rerank.ts MMR implementation** — confirmed MMR is diversity reranking (SPECKIT_MMR flag, default-on), NOT relevance reranking.
4. **Read ADR-011 benchmark evidence** — rescue layer provides +1 quality at 2.16x latency, cross-encoder was opt-in (not default path).
5. **Grep'd live surfaces for cross-encoder/rerankerScore refs** (28 live files outside specs/changelog). Read new hits in detail.
6. **Read `.opencode/commands/memory/search.md`** lines 120-121, 872, 986-987 — the OpenCode runtime's `/memory:search` command prompt (analogous to the Gemini search.toml already found in iter-2).
7. **Read `shared/types.ts:216-225`**, `shared/embeddings.ts:43`, `shared/embeddings/registry.ts:223-236`, `sk-code/references/opencode/shared/code_organization.md:492`, `sk-doc/scripts/validate-doc-model-refs.js:144,160`, `sk-doc/references/benchmark_creation.md:364`.

## Findings

### Finding 13: P1 — OpenCode `/memory:search` command prompt describes cross-encoder as active (4 locations)

- **Severity:** P1
- **File:** `.opencode/commands/memory/search.md:120-121,872,986-987`
- **Evidence:**
  1. Line 120: "Cross-encoder reranking only runs when at least 4 candidates reach Stage 3; `applyLengthPenalty` remains on the API surface for compatibility but currently resolves to a neutral `1.0` multiplier for every document"
  2. Line 121: "`getRerankerStatus()` exposes reranker latency plus cache `hits`, `misses`, `staleHits`, and `evictions`"
  3. Line 872: "when `SPECKIT_EXTENDED_TELEMETRY` is enabled, extended telemetry is captured ... while `getRerankerStatus()` reports reranker latency and cache `hits` / `misses` / `staleHits` / `evictions`"
  4. Line 986: "`rerank` | boolean | true | Enable cross-encoder reranking"
- **Classification:** **LIVE-STRANDED** — This is the OpenCode runtime's `/memory:search` command prompt (~1037 lines), sent as system instructions to OpenCode AIs. It falsely claims cross-encoder reranking is active, that `getRerankerStatus()` exposes reranker cache stats, and that the `rerank` parameter enables "cross-encoder reranking." The actual behavior: `rerank=true` controls MMR diversity reranking (stage3-rerank.ts:124), not cross-encoder reranking.
- **Impact:** OpenCode AIs using `/memory:search` receive false information about the retrieval pipeline. This is the OpenCode-runtime equivalent of iter-2 Finding 9 (Gemini's `memory/search.toml`). Both were missed by the prior remediation sweeps.
- **Cross-reference:** Sister finding to iter-1 Finding 1 (tool-schemas.ts:132-136) and iter-2 Finding 9 (.gemini/commands/memory/search.toml). All three contain the same class of stale cross-encoder claims, but in different runtime surfaces (MCP schema, Gemini command, OpenCode command).

### Finding 14: P2 — system-code-graph SKILL.md routing advice is self-contradictory

- **Severity:** P2
- **File:** `.opencode/skills/system-code-graph/SKILL.md:52`
- **Evidence:** Under "### When NOT to use" (items describing what NOT to use system-code-graph for): "Semantic concept search without known structure: use `system-code-graph`." This is a self-contradiction — the section says "don't use system-code-graph for this" but then says "use system-code-graph." The preceding items follow the correct pattern ("Text-only exact searches: use Grep" = don't use this skill, use Grep), but line 52 incorrectly routes back to itself.
- **Classification:** **STRANDED-PROMISE** — system-code-graph is structural only (tree-sitter: callers, imports, symbols, outlines). It cannot do semantic/embedding concept search. Line 52 implies it can, or at minimum provides contradictory routing advice. The correct replacement for the old cocoindex semantic code search is "Grep for domain terms + code-graph structural queries for iterative discovery," not "use system-code-graph for semantic concept search."
- **Impact:** A developer or agent reading this doc could believe system-code-graph handles semantic concept search, which it does not. This is the only routing doc that misrepresents what system-code-graph can do.

### Finding 15: P2 — `scoringMethod` type union still includes `'cross-encoder'` variant

- **Severity:** P2
- **File:** `.opencode/skills/system-spec-kit/shared/types.ts:216-225`
- **Evidence:** The `MemoryResultScores.scoringMethod` type union includes `'cross-encoder'` and the JSDoc at line 216 says "`'cross-encoder'` — reranker model relevance." The cross-encoder scoring method is never assigned in the current pipeline.
- **Classification:** **STRANDED-PROMISE** — The type system still accepts `'cross-encoder'` as a valid scoring method. Consumers reading this type definition could build logic expecting cross-encoder scores to appear. Related to iter-1 Finding 3 (RerankProvider type in stage3-rerank.ts:89) but in a different type definition file.
- **Impact:** Low. No runtime misbehavior, but the type definition misleads developers. Should be pruned or marked `@deprecated`.

### Finding 16: P2 — `shared/embeddings.ts` comment references deleted `cross-encoder.ts` file

- **Severity:** P2
- **File:** `.opencode/skills/system-spec-kit/shared/embeddings.ts:43`
- **Evidence:** Comment: "Mirrors the cross-encoder circuit breaker pattern (cross-encoder.ts)." The file `cross-encoder.ts` was deleted in phase 003. The circuit breaker pattern still exists but its origin reference is stale.
- **Classification:** **STRANDED-PROMISE** — A comment referencing a deleted file as the origin of a pattern. The pattern itself is live (embedding circuit breaker) but the provenance reference is wrong. Cosmetic but misleading for code archeology.
- **Impact:** Low. Harmless comment pointing to a dead file.

### Finding 17: P2 — `sk-doc/scripts/validate-doc-model-refs.js` still validates cross-encoder model paths

- **Severity:** P2
- **File:** `.opencode/skills/sk-doc/scripts/validate-doc-model-refs.js:144,160`
- **Evidence:** Line 144: `'cross-encoder/ms-marco-MiniLM-L-6-v2'` in model path list. Line 160: `'cross-encoder/'` as a path prefix. The validation script still considers cross-encoder model references as valid model paths, even though no cross-encoder models exist in the system.
- **Classification:** **STRANDED-PROMISE** — The doc validation infrastructure still knows about a removed model family. If a doc references a cross-encoder model, the validator would accept it as valid instead of flagging it as stale/dead. This is the mirror of the filesystem-side cleanup — the validation side was not cleaned.
- **Impact:** Low-medium. The validator would silently accept cross-encoder model references in docs, allowing stale documentation to persist without detection.

### Finding 18: P2 — `sk-code` code organization reference shows deleted `cross-encoder.ts`

- **Severity:** P2
- **File:** `.opencode/skills/sk-code/references/opencode/shared/code_organization.md:492`
- **Evidence:** Line 492 shows `cross-encoder.ts    # Re-ranking` in a directory tree. The file was deleted in phase 003.
- **Classification:** **STRANDED-PROMISE** — A documentation reference that still shows a deleted file as part of the codebase structure. This could mislead developers about the current code organization.
- **Impact:** Low. Outdated documentation reference. A developer reading this would expect to find `cross-encoder.ts` in the tree.

### Finding 19: INFO — `shared/embeddings/registry.ts` maps local cross-encoder model with removal context comment

- **Severity:** INFO
- **File:** `.opencode/skills/system-spec-kit/shared/embeddings/registry.ts:223-236`
- **Evidence:** Lines 223-228 contain a detailed comment documenting the cross-encoder removal ("cross-encoder path was removed in 003 and the local rerank sidecar skill was deleted"), but line 236 still maps `local: 'cross-encoder/ms-marco-MiniLM-L-6-v2'` in the LOCAL_EMBEDDING_MODELS object.
- **Classification:** **Partially STRANDED** — The removal is documented in the comment, but the model mapping itself is dead. The comment is accurate and helpful, but the mapping entry should be removed or wrapped in a conditional. Low priority because the comment provides full context.
- **Impact:** Negligible. The mapping is dead but the comment explains why.

### Finding 20: Q3(a) REAL-GAP — Semantic code search via embeddings is genuinely lost

- **Severity:** INFO (intentional design decision)
- **Evidence:**
  - AGENTS.md code-search decision tree: "concept/intent" → "Code Graph structural query + Grep pattern search + Iterate Grep terms from likely symbols, filenames, domain words, and errors"
  - system-code-graph SKILL.md §3: "This skill ships the structural half. ... Semantic search answers 'what does this code mean.' Structural indexing answers 'what does this code touch.'"
  - The HYBRID replacement (code-graph structural + Grep lexical) requires the user to guess domain terms and iteratively refine, vs. the old CocoIndex which accepted natural-language queries and returned semantically relevant code via embeddings.
- **Classification:** **REAL-GAP (intentional)** — Embedding-based code search is no longer available. The iterative lexical/structural replacement covers the use case but is qualitatively different (requires domain knowledge, misses conceptually-related code using different terminology). This gap was accepted as part of the HYBRID deprecation decision (D2). It is NOT a regression — it's a deliberate trade-off.
- **Impact:** Users/agents conducting "find code that handles X" without knowing the exact domain terms must iterate through Grep guesses rather than getting semantic matches in one query. This was the explicit cost of removing CocoIndex.

### Finding 21: Q3(b) COVERED — MMR + rescue-layer adequately replaces cross-encoder for default path

- **Severity:** COVERED
- **Evidence:**
  - Cross-encoder was opt-in only (not the default path). MMR is default-on diversity reranking (stage3-rerank.ts:124, `isMMREnabled()` returns true by default).
  - ADR-011 retrieval-rescue layer: measured +1 quality improvement (27/30 → 28/30 PASS) on 30-scenario stratified sample. Default-on with `SPECKIT_RERANK_LAYER` kill switch.
  - benchmark-2026-05-17: jina-v3 + rescue layer achieves 9/10 cat-24/409 top-3.
  - system-spec-kit SKILL.md:420-422 correctly documents the deprecation: "Cross-encoder reranking was removed in the 014 deprecation..."
  - embedder_architecture.md:172 correctly documents the removal with historical context.
  - The `rerank` parameter in `memory_search` now controls MMR diversity, not cross-encoder relevance. Schema description is stale (Finding 1) but behavior is correct.
- **Classification:** **COVERED** — MMR provides diversity improvement over the old default (which had no reranker). The rescue layer provides the quality safety net that cross-encoder (opt-in) would have provided. Opt-in cross-encoder relevance reranking is genuinely lost, but it was optional and the documented quality metrics are maintained. No documented quality regression exists.
- **Impact:** Minimal. Default path quality is preserved. Opt-in cross-encoder users lose the feature but had to explicitly enable it.

### Ruled Out — Surfaces verified correct

| Surface | Status | Evidence |
|---------|--------|----------|
| Live `mcp__cocoindex_code__search` call sites (non-spec/non-changelog) | CLEAN | Zero hits — deprecation removal complete |
| `.claude/CLAUDE.md` routing | CLEAN | Correct HYBRID policy: code-graph + Grep for concept discovery |
| `.gemini/GEMINI.md` routing | CLEAN | Correct HYBRID policy (remediated in 015) |
| AGENTS.md code-search decision tree | CORRECT | Accurately routes concept/intent → code-graph + Grep, not falsely claiming semantic search |
| `system-spec-kit/SKILL.md:420-422` | CORRECT | Accurately documents cross-encoder removal |
| `embedder_architecture.md:172` | CORRECT | Accurately documents removal with historical context |
| `evidence-gap-detector.ts:19` | CORRECT | Comment accurately says "no cross-encoder" |
| `search-weights.json:28` | CORRECT | Note says "crossEncoder sections removed (P2-05)" |
| `stage3-rerank.ts` MMR implementation | CORRECT | MMR diversity via `isMMREnabled()` + `applyMMR()`, no cross-encoder path |
| `sk-doc/references/benchmark_creation.md:364` | HISTORICAL | References historical cross-encoder behavior in context of a bake-off example. Not a live promise. |

## Questions Answered

- **Q3(a) — ANSWERED:** Semantic code search via embeddings (CocoIndex) is genuinely lost. The HYBRID replacement (code-graph structural + Grep lexical) covers the use case partially but requires iterative domain-term guessing — a REAL-GAP accepted by the deprecation decision. The routing docs do NOT falsely promise semantic code search (except line 52 in system-code-graph/SKILL.md which is self-contradictory). No live code still calls `mcp__cocoindex_code__search`.
- **Q3(b) — ANSWERED:** MMR + rescue-layer adequately covers the default path. Cross-encoder was opt-in, MMR is default-on diversity improvement, and the rescue layer provides the quality safety net (measured +1 quality). The opt-in cross-encoder capability is lost but no documented quality regression exists. COVERED.
- **Q3(c) — ANSWERED:** 7 new stranded promises found beyond iters 1-2: P1 OpenCode `/memory:search` cross-encoder docs (analogous to gemini search.toml), P2 system-code-graph routing self-contradiction, P2 types.ts cross-encoder union, P2 embeddings.ts stale comment, P2 validate-doc-model-refs.js stale model paths, P2 sk-code code_organization.md stale tree, INFO registry.ts stale mapping with context comment.

## Questions Remaining

- Q4: Behavioral regressions (memory-search, confidence, council workflows) — not yet addressed.
- Q5: Full doc sweep for stale/contradictory docs (beyond the targeted hits found so far) — not yet addressed.
- The OpenCode `/memory:search` command prompt has 4 cross-encoder locations that need the same remediation as the Gemini search.toml.

## Next Focus

Iteration 4: Q4 behavioral regressions — test verification pass. Run vitest for the sidecar hardening suite (confirm iter-1 Finding 2 failure), the stage3-rerank regression suite, and the retrieval-rescue suite. Also check for any `/doctor`, `/speckit`, or council workflow behavior that assumed cross-encoder or cocoindex availability at runtime.
