---
iteration: 035
rq: RQ-N6
phase_target: 004-semantic-trigger-fallback
newInfoRatio: 0.62
verdict: ADAPT
---

# Iteration 035 — RQ-N6: Optimal Hybrid Lexical+Semantic Shape for memory_match_triggers

## Focus

RQ-N6 asks: what is the concrete design for a hybrid lexical+semantic `memory_match_triggers` that (A) keeps lexical as the primary precision path, (B) adds semantic similarity only as a shadow/fallback, (C) avoids a full embedding re-index of existing memory docs, and (D) can be promoted safely via A/B shadow evaluation? It further asks whether XCE's PRAT (architecture-aware context trees) has an analogue — specifically whether the existing `spec-folder-hierarchy.ts` tree can serve as a structural prior to improve trigger recall.

Prior context: RQ-B1 (iteration-025.md / pt-03) established the ADAPT verdict for hybrid matching and identified the key code paths. This iteration deepens that into a concrete design with file:line anchors and addresses the PRAT analogy question which was left open.

---

## Actions Taken

1. Read `trigger-matcher.ts` fully to anchor line numbers for insertion points.
2. Read `memory-triggers.ts:340-450` to confirm attention-score contract for semantic-only hits.
3. Read `spec-folder-hierarchy.ts:1-160` to evaluate the PRAT analogy.
4. Read `memory-summaries.ts:25-60` to confirm `cosineSimilarity` utility is available.
5. Read `vector-index-queries.ts:638-695` to confirm `generate_query_embedding` call signature and embedding cache behavior.
6. Read `embedding-cache.ts:1-60` to confirm content-hash cache keying.

---

## Finding F-035-001: The Lexical-First Short-Circuit Point

**Claim:** The correct insertion point for semantic fallback is immediately after `getTriggerCandidates` returns an empty or weak result set in `matchTriggerPhrases`, before results are sorted and returned.

**Evidence:** `trigger-matcher.ts:820-855`:
```
const candidateEntries = getTriggerCandidates(promptNormalized, cache);   // :820
const matchesByMemory = new Map<number, TriggerMatch>();
for (const entry of candidateEntries) {
  if (matchPhraseWithBoundary(...)) {                                      // :826
    ...
    matchesByMemory.set(key, match);
  }
}
const results = Array.from(matchesByMemory.values())
  .sort(...)
  .slice(0, limit);                                                        // :847-855
```

After `.slice(0, limit)` at `:855`, if `results.length === 0` (lexical miss) and the feature flag `SPECKIT_SEMANTIC_TRIGGERS` is `true` and mode is `union` or `shadow`, we call `semanticTriggerFallback(promptNormalized, cache, limit)`. This preserves the entire existing synchronous lexical path as-is and only invokes the async semantic path on a miss.

**Verdict:** ADOPT this insertion point. It is zero-cost on lexical hits (the common case) and creates no regression risk.

---

## Finding F-035-002: No Re-Index Required — Use Existing Embedding Cache

**Claim:** The semantic fallback can reuse embeddings already stored by the memory-save pipeline, keyed by `(content_hash, model_id, dimensions)` in the `embedding_cache` SQLite table. No new embedding job or backfill of all memory docs is needed for trigger phrases if we embed trigger phrases themselves (short strings, cheap, cacheable).

**Evidence:**
- `embedding-cache.ts:13-24`: Cache entries store `contentHash`, `modelId`, `dimensions`, `inputKind ('document'|'query')`, and raw `embedding` BLOB.
- `vector-index-queries.ts:655-666`: `generate_query_embedding` checks `lookupEmbedding(database, contentHash, modelId, embeddingDim, { profileKey, inputKind: 'query' })` and returns cached Float32Array on hit.
- `vector-index-queries.ts:678-690`: On cache miss, calls `activeAdapter.embed([trimmedQuery], { inputType: 'query' })` and stores via `storeEmbedding(...)`.

**Design implication:** We embed trigger phrases using `inputType: 'document'` (they are the document side) during backfill at save-time. The prompt embedding uses `inputType: 'query'` at match-time. Both routes hit the same cache table. For trigger phrases (typically 3-8 words), embedding is fast and the cache key is stable (phrase content never changes after doc is saved). This eliminates the "full re-index" concern entirely.

**Proposed `memory_trigger_embeddings` table** (derived, not authoritative):
```sql
CREATE TABLE IF NOT EXISTS memory_trigger_embeddings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  memory_id INTEGER NOT NULL REFERENCES memory_index(id) ON DELETE CASCADE,
  phrase TEXT NOT NULL,
  model_id TEXT NOT NULL,
  dimensions INTEGER NOT NULL,
  embedding BLOB NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now')),
  UNIQUE(memory_id, phrase, model_id, dimensions)
);
CREATE INDEX IF NOT EXISTS idx_trigger_embeddings_memory ON memory_trigger_embeddings(memory_id);
```

This table stores per-phrase embeddings separately from the main `embedding_cache` so that trigger lookups don't compete with the query-side cache LRU. Source-of-truth remains `trigger_phrases` JSON in `memory_index`.

---

## Finding F-035-003: The Semantic Fallback Algorithm

**Claim:** The optimal semantic fallback shape is: embed prompt once → for each unique memory in cache, compute max cosine similarity across that memory's trigger phrase embeddings → filter by threshold (0.84) with margin guard (0.04) → cap at `_MAX=3` results → return as reduced-attention matches.

**Evidence:**
- `memory-summaries.ts:29-56`: `cosineSimilarity(a, b)` is already implemented and exported, handles dimension mismatch gracefully.
- `memory-triggers.ts:368-372`: Lexical matches receive `workingMemory.setAttentionScore(sessionId, match.memoryId, 1.0)` — full attention.
- `004-semantic-trigger-fallback/spec.md:43` (executive summary): "semantic-only hits activate at reduced attention (`min(0.85, semanticScore)`) so they cannot masquerade as exact triggers."

**Pseudocode for `semanticTriggerFallback`:**
```typescript
async function semanticTriggerFallback(
  promptNormalized: string,
  cache: TriggerCacheEntry[],
  limit: number,
): Promise<TriggerMatch[]> {
  // Gate: feature flag already checked by caller
  const threshold = parseFloat(process.env.SPECKIT_SEMANTIC_TRIGGER_THRESHOLD ?? '0.84');
  const margin = 0.04;
  const maxResults = parseInt(process.env.SPECKIT_SEMANTIC_TRIGGER_MAX ?? '3', 10);

  // Embed prompt once (cached via generate_query_embedding)
  const promptEmbedding = await generate_query_embedding(promptNormalized);
  if (!promptEmbedding) return [];

  // Group cache entries by memoryId
  const byMemory = new Map<number, TriggerCacheEntry[]>();
  for (const entry of cache) {
    const entries = byMemory.get(entry.memoryId) ?? [];
    entries.push(entry);
    byMemory.set(entry.memoryId, entries);
  }

  const candidates: Array<{ match: TriggerMatch; score: number }> = [];
  for (const [memoryId, entries] of byMemory) {
    let maxScore = 0;
    let bestPhrase = '';
    for (const entry of entries) {
      // Lookup phrase embedding from memory_trigger_embeddings table
      const phraseEmb = lookupTriggerPhraseEmbedding(entry.phrase, entry.memoryId);
      if (!phraseEmb) continue;
      const sim = cosineSimilarity(promptEmbedding, phraseEmb);
      if (sim > maxScore) { maxScore = sim; bestPhrase = entry.phrase; }
    }
    if (maxScore >= threshold && maxScore > (threshold - margin)) {
      candidates.push({
        match: {
          memoryId,
          specFolder: entries[0].specFolder,
          filePath: entries[0].filePath,
          title: entries[0].title,
          importanceWeight: Math.min(0.85, maxScore),  // reduced attention cap
          matchedPhrases: [bestPhrase],
          semanticScore: maxScore,   // shadow telemetry field
          source: 'semantic',
        },
        score: maxScore,
      });
    }
  }

  return candidates
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.min(maxResults, limit))
    .map(c => c.match);
}
```

The `importanceWeight: Math.min(0.85, maxScore)` is the cognitive activation guard: semantic matches cannot reach full 1.0 attention that lexical matches get at `memory-triggers.ts:370`.

---

## Finding F-035-004: Shadow Mode A/B Evaluation Shape

**Claim:** Shadow mode (`SPECKIT_SEMANTIC_TRIGGERS_MODE=shadow`) runs the semantic fallback but does NOT include results in the returned match list — it only logs them as telemetry. Promotion to `union` mode happens when shadow logs show ≥N true-positive paraphrase hits per evaluation window with zero false-control-surface activations.

**Evidence:**
- `trigger-matcher.ts:876-883`: `matchTriggerPhrasesWithStats` already emits a `stats` object with `signals`, `matchCount`, `totalMatchedPhrases`, and `degraded` fields. Adding a `semanticShadow` field here is consistent with the existing stats contract.
- `004-semantic-trigger-fallback/spec.md:42`: "Default-off behind `SPECKIT_SEMANTIC_TRIGGERS=false` + sub-flag `SPECKIT_SEMANTIC_TRIGGERS_MODE=shadow|union` (shadow first)."

**Shadow telemetry record shape** (appended to `TriggerMatchStats`):
```typescript
semanticShadow?: {
  candidateCount: number;
  topScore: number;
  wouldHaveMatched: Array<{ memoryId: number; specFolder: string; score: number; phrase: string }>;
}
```

This allows offline analysis of shadow logs to compute paraphrase recall without any production risk.

---

## Finding F-035-005: XCE PRAT Analogy — spec-folder-hierarchy.ts IS the Structural Prior

**Claim:** The spec-folder hierarchy tree (`spec-folder-hierarchy.ts`) is the direct analogue of XCE's PRAT (Persistent Recursive Abstract Tree). XCE's PRAT organizes code context by architectural scope (file → module → subsystem). Our hierarchy organizes memory by spec-folder scope (phase → packet → track). It should be used as a structural prior to widen trigger recall in both lexical and semantic stages.

**Evidence:**
- `spec-folder-hierarchy.ts:63-66`: `HierarchyTree` has `roots: HierarchyNode[]` and `nodeMap: Map<string, HierarchyNode>`.
- `spec-folder-hierarchy.ts:78-124`: `buildHierarchyTree(db)` produces the full ancestor/sibling tree from live `spec_folder` values with 60s TTL cache.
- `spec-folder-hierarchy.ts:96-116`: Each `HierarchyNode` knows `parent`, `children`, and `memoryCount`.

**Structural prior application:**

When a memory M is matched (lexically or semantically), its `specFolder` path can be looked up in the hierarchy tree to identify:
1. **Parent scope memories** — memories in ancestor folders (e.g., if `M` is in `system-spec-kit/027-xce-research-based-refinement/004-semantic-trigger-fallback`, then `system-spec-kit/027-xce-research-based-refinement` is a relevant parent scope).
2. **Sibling scope memories** — memories in sibling phase folders (e.g., `006-write-path-reconciliation`) that the model should be aware of when working in this packet.

This is co-activation via hierarchy rather than via embedding graph — it is cheap (tree traversal, no embedding call) and orthogonal to the semantic fallback. The co-activation module (`co-activation.ts`) already handles memory-to-memory activation spreading, but it operates on the embedding graph. The hierarchy prior provides a structural fallback when the embedding graph has sparse edges for new packets.

**Concrete insertion point:** After lexical matches are assembled at `trigger-matcher.ts:847-855` (before returning), if `SPECKIT_HIERARCHY_BOOST=true`, expand results by adding ancestor-folder memories (up to 1 level) that are in the `cache` but not yet matched. These receive a discounted `importanceWeight` of `0.6` (below lexical 1.0 and semantic 0.85 cap).

---

## Finding F-035-006: Latency Budget Compliance

**Claim:** The semantic fallback is async and must NOT block the synchronous lexical path. The 30ms PASS / 100ms WARN budget (`trigger-matcher.ts:145-147`) applies only to the synchronous lexical path. The semantic fallback runs as a separate async call that callers opt into.

**Evidence:**
- `trigger-matcher.ts:140-148`: `CONFIG.WARN_THRESHOLD_MS: 30` and `CONFIG.MAX_PROMPT_LENGTH: 5000`.
- `trigger-matcher.ts:798`: `matchTriggerPhrases` is synchronous and returns `TriggerMatch[]`.
- `matchTriggerPhrasesWithStats` at `:871` is also synchronous.

**Implication:** We need a new async entry point: `matchTriggerPhrasesHybrid(prompt, limit, sessionId?)` that calls the synchronous lexical path first, then conditionally invokes the async semantic fallback. The existing synchronous exports remain unchanged to avoid breaking callers.

---

## Summary and Design Constraints

| Requirement | Design Solution | Evidence |
|---|---|---|
| (A) Lexical primary precision | Short-circuit: semantic only called on lexical miss | `trigger-matcher.ts:820-855` |
| (B) Semantic as shadow/fallback | `SPECKIT_SEMANTIC_TRIGGERS_MODE=shadow\|union` flag; `importanceWeight: min(0.85, score)` | `spec.md:42`, `memory-triggers.ts:370` |
| (C) No full re-index | Per-phrase `memory_trigger_embeddings` table backfilled at save-time via existing `embedding-pipeline.ts:143-169` | `embedding-cache.ts:13-24`, `vector-index-queries.ts:655-690` |
| (D) Safe A/B shadow promotion | Shadow mode logs `semanticShadow` field in `TriggerMatchStats` without affecting results | `trigger-matcher.ts:876-883` |
| PRAT analogy | `spec-folder-hierarchy.ts` hierarchy tree as structural prior for ancestor/sibling scope expansion | `spec-folder-hierarchy.ts:63-124` |

**New findings vs prior iterations:** RQ-B1 (iteration-025) established the ADAPT verdict and identified the embedding cache reuse strategy. This iteration adds: (1) the concrete `memory_trigger_embeddings` derived table schema, (2) the `semanticTriggerFallback` pseudocode with exact threshold/margin/cap values, (3) the shadow telemetry shape, (4) the PRAT analogy mapped to `spec-folder-hierarchy.ts` with a concrete hierarchy-boost insertion point, and (5) the async entry point boundary constraint. newInfoRatio 0.62 reflects substantial new design depth on top of RQ-B1's foundation.
