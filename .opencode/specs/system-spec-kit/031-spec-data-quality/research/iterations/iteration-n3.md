# Iteration N3 — Retrieval Measurement: the re-index mechanics and the proof

The header-path / global-id prefix is the brief's highest-ROI retrieval win, but it is the one candidate that cannot ship on an eval-mode number. Both production truncation gates — the 3-result confidence floor and the token budget — run only when `evaluationMode` is off, so a prefix that lifts recall@K in the labelled lens can deliver nothing to the reader the floor protects. This iteration designs the injection seam, the cache-key versioning that forces a real re-embed, the coverage-guard gating that 028 named as a precondition, and the dual-mode proof that separates a true prod gain from an eval-lens flatter. The crux: do not measure recall@K (the floor hides it); measure the eval-vs-prod completeRecall@3 delta on eval-v2.

---

## FINDINGS

1. **The embed path strips structure before embedding, so there is nothing for a header-path prefix to survive in today.** `normalizeContentForEmbedding` (content-normalizer.ts:216-232) runs eight strips in sequence; `normalizeHeadings` (content-normalizer.ts:168-173) flattens `## 3. SCOPE` to bare `SCOPE` and drops the numeric prefix, and `stripYamlFrontmatter` (content-normalizer.ts:36-41) removes the title/trigger block. The single-record embed input is then re-decomposed by section weight in `buildParsedMemoryWeightedSections` (embedding-pipeline.ts:106-119) and `buildWeightedDocumentText` (shared/embeddings.ts:283-296). No header path, parent title, or global id is prepended to any block. The chunk path is the same: each chunk embeds `normalizeContentForEmbedding(chunk.content)` (chunking-orchestrator.ts:297) with no parent/section/id context — a chunk loses every signal about which document and which section it came from.

2. **The chunk cache key is content-only, so a prefix change is invisible to the cache and unchanged chunks would reuse pre-prefix vectors.** The chunk cache key is `cacheContentHash(normalizeContentForEmbedding(content))` (chunking-orchestrator.ts:97-99, 289) — a SHA-256 over the normalized body alone. The single-record key is the same shape: `computeContentHash(normalizeContentForEmbedding(parsed.content))` (embedding-pipeline.ts:121-123, 138). If the prefix is added but the body is unchanged, the key is identical and `lookupEmbedding` (embedding-cache.ts:397-446) returns the stale pre-prefix vector. The persistent cache is scoped by `(content_hash, profile_key, input_kind, model_id, dimensions)` (embedding-cache.ts:157) — none of those fields encodes the chunk-strategy/prefix version. There is also a **second** cache: an in-process LRU inside `embeddings.ts` keyed `sha256("${provider}:${text}")` (shared/embeddings.ts:309-311), which would also serve stale vectors unless the prefixed `text` is what reaches it.

3. **The 028 coverage guard is a real, fail-closed precondition, but it guards the *ablation* runner — not the prod retrieval path and not eval-v2.** `assertEmbeddingCoverage` (ablation-framework.ts:708-747) throws below `DEFAULT_MIN_EMBEDDING_COVERAGE = 1.0` (ablation-framework.ts:372), requiring every unique golden parent id to be `parent_id IS NULL` + `embedding_status='success'` + a live vector row (ablation-framework.ts:624). 028's `before-vs-after.md:49` and `timeline.md:197` describe it as the gate-zero precondition that makes recall numbers trustworthy. Two known holes the prefix re-index must respect: the guard probes a bare `vec_memories` while the live ranker reads `active_vec.vec_<dim>` (review-report.md:478, P1), and it ignores `active_memory_projection` membership so a superseded-but-vectored id false-passes (review-report.md:294, P2).

4. **The truncation law that hides the prefix's value is two gates, both prod-only, and eval-v2's prod lens already exercises both.** Confidence truncation never cuts below `DEFAULT_MIN_RESULTS = 3` and does not even run at ≤3 results (confidence-truncation.ts:35, 106, 130); it is wrapped in `if (!evaluationMode)` at hybrid-search.ts:2049. The token-budget gate `truncateToBudget` is likewise `evaluationMode`-gated at hybrid-search.ts:2122-2143. eval-v2's `prodLens` omits both `forceAllChannels` and `evaluationMode` (run-eval-v2.mjs:182-195), so it runs the full prod route through both gates; `evalLens` forces them off (run-eval-v2.mjs:167-180). This is precisely the fidelity delta the driver reports as first-class (run-eval-v2.mjs:300, 318, 340).

5. **eval-v2 measures completeRecall@{3,5,8} over multi-target gold sets — the exact lens that can show a prefix moving the truncated top-3.** completeRecall@3 requires a whole multi-target gold set inside the floor-protected window (run-eval-v2.mjs:43, eval-v2-measurability.vitest.ts:50 "the partial-coverage case saturation hides"). Brief external numbers (Anthropic top-20 failure, HitRate@10) are recall@K at wide K, which the 3-floor never touches — they cannot tell whether the prefix helped production. completeRecall@3's prod-mode column can, because composing the top-3 better is the only way the prefix earns a prod keep (028 before-vs-after.md:169: "a feature earns a prod-path keep only by changing the composition of the truncated top-3, never by adding rows the floor cuts").

---

## CONCRETE CHANGE

**(a) The injection seam.** Inject the deterministic prefix in `content-normalizer.ts` as a NEW composite — do not edit the existing strips. Add `buildEmbeddingPrefix({ headerPath, parentTitle, globalId })` returning a deterministic single line (e.g. `parentTitle › H2 › H3 [id: spec/031#chunk-004]`) and a `normalizeContentForEmbeddingWithContext(content, ctx)` that returns `prefix + "\n\n" + normalizeContentForEmbedding(content)`. Wire two call sites:
- Chunk path: chunking-orchestrator.ts:297 — pass parent title + `chunk.label` (already the anchor/header) + a `specFolder#chunk-i` global id. The header path is recoverable because `anchor-chunker` labels carry the heading; the parent title is `parsed.title`.
- Single-record path: embedding-pipeline.ts:170 (`buildWeightedDocumentText(...)`) — prepend the prefix to the `general` block (or as a new highest-weight title block), so the prefix is not weighted away by `truncateWeightedBlocksToBudget`.

**(b) Cache-key versioning (the must-have, or the re-index is a silent no-op).** Add a `CHUNK_STRATEGY_VERSION` / `EMBED_PREFIX_VERSION` constant and fold it into BOTH cache keys:
- Persistent cache: include the version in `content_hash` input (hash `version + "\x1f" + prefixedText`) OR add it to `profile_key` (e.g. `${provider}:${name}:${dim}:pfx${v}`) via `getActiveEmbeddingProfileKey` (embedding-cache.ts:703-717). Either bumps the key for every chunk so unchanged bodies miss the cache and re-embed. The persistent PK already includes `profile_key`, so the profile-key route needs zero schema change.
- In-process LRU: it already keys on `text` (shared/embeddings.ts:311); once the prefixed text reaches `generateDocumentEmbedding`, its key changes automatically — no extra work, provided the prefix is in `text` not stripped after.

**(c) Coverage-guard gating.** Treat the prefix re-index as a corpus-wide migration gated behind 028's coverage guard. Sequence: (1) bump version, (2) run the corpus reindex + `memory_embedding_reconcile` until `inspectEmbeddingCoverage().coverageRatio === 1.0` on the active `active_vec.vec_<dim>` surface — not bare `vec_memories` (close review-report.md:478 first or the guard passes against a stale shadow), (3) only then run eval-v2. The guard fails closed below 1.0, so a partial re-embed cannot produce a flattering number.

---

## EVIDENCE

The proof is a paired eval-v2 run, baseline vs prefixed corpus, read as a 2×2:

| | eval-mode completeRecall@3 | prod-mode completeRecall@3 |
|---|---|---|
| **Baseline (no prefix)** | E0 | P0 |
| **Prefixed (re-indexed)** | E1 | P1 |

The candidate earns a prod keep **iff `P1 − P0 > 0` and survives the floor** — i.e. the gain appears in the prod column, not only the eval column. The diagnostic the brief warns about: if `E1 − E0 > 0` but `P1 − P0 ≈ 0`, the prefix only helped rows the 3-floor cuts (eval-lens flatter, the `evalVsProdDelta` widens) — refute the candidate, exactly as 028 refuted `temporal_edges`' eval-only +0.083 (keep-off-flag-roadmap.md:15). Mechanics, all already present:
- Driver: `mcp_server/scripts/evals/run-eval-v2.mjs`, output `/tmp/speckit-eval-v2.json` with `overall.evalMode`, `overall.prodMode`, `overall.evalVsProdDelta` and per-class rows for `thematic_multi_target` / `causal_chain` / `hard_negative` (run-eval-v2.mjs:51-55, 336-342).
- Copy-DB discipline: the driver backs up to a tempdir read-only (run-eval-v2.mjs:70-122) — never mutates live. Run it on a copy that has the prefixed shard re-indexed.
- Per-class read matters: the prefix should help `causal_chain` and `thematic_multi_target` (multi-target sets needing the whole chain high) more than `hard_negative`. A flat `causal_chain` prod delta is a refutation signal even if `overall` ticks up.
- Stat hygiene: the golden set is small (per-class `queryCount` is in the JSON); report the per-class `evaluatedQueries` denominator and treat a sub-query-count delta as within-noise, the same discipline 028 round-2 used.

**Confirmed vs inferred.** Confirmed by file:line: the embed strips (finding 1), content-only cache keys + dual cache (finding 2), the coverage guard + its two holes (finding 3), the two prod-only truncation gates and eval-v2's lens split (findings 4-5). **Inferred (needs the run to confirm):** the *direction and size* of `P1 − P0`. The brief's external numbers predict a large recall@K lift, but those are wide-K recall the floor hides; whether the prefix changes top-3 composition is unmeasured until the paired eval-v2 run executes. That run is the prove-first gate and is not yet done.

---

## READER

The retrieval reader is the MCP `memory_search` / `memory_context` consumer (agents and the resume ladder), who receives the prod-route top-N after both truncation gates. The prefix helps this reader only if it reorders or completes the floor-protected top-3 — never by adding a fourth row. The secondary reader is the eval-v2 maintainer, whose `prodMode` column and `evalVsProdDelta` are the sign-off surface; a release reviewer must read the prod column, not the eval column, or they repeat the 028 saturation mistake.

---

## ON-WRITE OR RETROACTIVE

**Retroactive, gated, one-shot-per-version.** The prefix changes the embedded text of every existing chunk, so its value requires a full corpus re-embed — there is no on-write-only path that helps the existing corpus. This is the cost the brief flags. Mechanics:
- On-write: new saves pick up the prefix automatically once the two call sites are wired; the version bump makes their cache keys fresh, so no stale reuse.
- Retroactive: a corpus reindex (`memory_index_scan({force:true})` per the standing "don't run unprompted" rule — operator-gated) re-embeds every chunk under the new version key. Because the persistent cache key now carries the version, the reindex cannot short-circuit on the old vectors.
- Idempotent and reversible: keeping the prior version's rows under the old `profile_key` means a rollback is "set active profile_key back"; nothing is destroyed by the re-embed itself.
- Order: code change → version bump → reindex to full coverage → eval-v2 paired run → keep/refute on the prod-mode delta. The coverage guard sits between reindex and eval so a half-embedded corpus cannot mint a number.

---

## RISK

- **Silent no-op (highest).** If the version is not folded into BOTH cache keys (persistent PK *and* the in-process LRU), unchanged bodies reuse pre-prefix vectors and the re-index measures nothing — the most likely way this candidate fails quietly. The dual-cache detail (finding 2, shared/embeddings.ts:309-311) is easy to miss.
- **Eval-lens flatter.** The prefix may lift wide-K recall (eval column) while the 3-floor cuts the gain in prod — a real risk given the brief's recall@K-framed external evidence. Mitigation is structural: decide on `prodMode`, not `evalMode`, and watch `evalVsProdDelta` widen as the refutation tell.
- **Coverage guard false-pass.** Running eval-v2 before fixing the `vec_memories` vs `active_vec.vec_<dim>` hole (review-report.md:478) validates coverage against a stale shadow shard — a green guard over an unre-indexed surface. Close that hole or assert against the active shard before trusting any number.
- **Budget displacement.** The prefix consumes characters inside `MAX_TEXT_LENGTH` / `truncateWeightedBlocksToBudget` (shared/embeddings.ts:285-293); a long header path could push real body content out of the embedded block, a net-negative the eval-v2 prod column would catch but only if the prefix is length-capped. Cap the prefix (e.g. ≤120 chars) and give it its own weight block so it neither dominates nor is truncated away.
- **Re-embed cost / drift.** A full corpus re-embed is the expensive part; it must be operator-gated and run once per version, not per save. Read-only on production code holds — no live mutation in this iteration.
