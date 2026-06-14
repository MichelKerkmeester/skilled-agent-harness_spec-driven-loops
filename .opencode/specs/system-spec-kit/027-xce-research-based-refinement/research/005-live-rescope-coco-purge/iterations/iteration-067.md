# Iteration 067 — 007 rescope: cache/schema IDENTITY to profile_key+input_kind Nomic-768; +coco refs in 007 docs

**Executor:** cli-opencode `openai/gpt-5.5-fast` --variant xhigh (read-only). **Status:** complete. **newInfoRatio:** 0.86. **Findings:** 6.
**Raw analysis:** `research/prompts/iteration-067.out`

### FINDINGS
[F-067-01] 007 is partially rescope-aware but still mixed-state: `spec.md` and `plan.md` now name active Nomic 768/profile-scoped cache, while cache/schema text still describes reuse as `phrase_hash + model_id + dimensions` or `(content_hash, model_id, dimensions)`, omitting live `profile_key` + `input_kind`.

[F-067-02] All remaining Voyage/1024 assumptions are threshold/golden assumptions: `0.84`/`0.04`, paraphrase recall at threshold `0.84`, and Voyage-4 1024d clustering rationale must not transfer to Nomic 768d.

[F-067-03] Voyage cache reuse is ruled out: live cache PK is `(content_hash, profile_key, input_kind, model_id, dimensions)`, and query/document embeddings are scoped separately. A Voyage 1024 row cannot satisfy an Ollama Nomic 768 lookup.

[F-067-04] Live profile is Nomic/Ollama 768d: manifest is `nomic-embed-text-v1.5`, `dim: 768`, `backend: ollama`; provider resolution prefers active Ollama/local and only reaches cloud by explicit provider or last-resort cascade.

[F-067-05] The `028/004-code-graph-adoption-eval` soft dependency is already documented as nonexistent; replacement dependency is evidence, not folder coupling: equivalent shadow/promotion telemetry for recall lift, FP rate, latency, cost, rollback.

[F-067-06] Live trigger matcher is lexical today: it loads trigger phrases from `memory_index`, builds regex/candidate caches, and `matchTriggerPhrases` uses exact boundary matching; no semantic matcher/table/flag exists in live mcp_server code.

### RESCOPE_007
- Voyage-4 1024d threshold assumption → Nomic/Ollama 768d threshold must be re-derived from shadow data; keep `SPECKIT_SEMANTIC_TRIGGER_THRESHOLD` configurable, but remove `0.84` as a validated default.

- Voyage-derived `0.04` margin assumption → make margin profile-calibrated; use initial shadow buckets/goldens to derive Nomic-specific separation, not Voyage cluster behavior.

- Golden metrics “paraphrase recall at threshold 0.84 ≥ 0.7” → rewrite as profile-parameterized golden matrix: record `{profile_key, model_id, dimensions, input_kind, threshold, margin}` with Nomic 768d baseline results.

- “Reusable Voyage cache” assumption → replace with profile-scoped cache only: `content_hash + profile_key + input_kind + model_id + dimensions`; no cross-profile reuse from Voyage 1024 to Nomic 768.

- Trigger phrase BLOB key `embedding_cache(phrase_hash, model_id, dimensions)` → replace with `embedding_cache(content_hash=phrase_hash, profile_key=<active>, input_kind='document', model_id, dimensions)`.

- Prompt lookup `embedding_cache.lookup(prompt_hash, ...)` → replace with `input_kind='query'` and active profile key; prompt/query embeddings must not share document rows.

- `memory_trigger_embeddings(memory_id, phrase_hash)` primary key → rescope to carry active profile identity, at minimum `profile_key` + `input_kind` with model/dim, so profile changes can coexist or be rebuilt safely.

- Remote-fallback 1024 size note → rewrite as dynamic “embedding size depends on active profile dimensions”; Nomic 768d is current default, cloud 1024 is only explicit/last-resort fallback.

- Missing `028/004-code-graph-adoption-eval` dependency → replace with “equivalent shadow/promotion evidence”: paired lexical-vs-semantic shadow logs proving FP rate, paraphrase recall lift, p95 latency, zero hot-path provider calls, rollback readiness.

### COCO_IN_007
- `plan.md:248` `028/008-coco-memory-context-extras` soft dep: REMOVE or rewrite as generic future downstream consumer; not part of 007 rescope.

- `decision-record.md:220` `028/005-cocoindex-complete-fork` historical numbering note: REMOVE/REWRITE as non-durable scaffold history.

- `implementation-summary.md:108` `mcp-coco-index/` touch point: REMOVE/REWRITE to `mcp_server/` only unless implementation later proves a real coco path.

### VERDICT
007 = NEEDS-RESCOPE. Headline: keep hybrid lexical-first semantic fallback, but scope it to active Ollama Nomic 768d and live profile-scoped cache keys; thresholds/goldens require fresh Nomic shadow evidence before union promotion.

### RULED_OUT
- Reusing any Voyage/1024 cache rows for Nomic/768.

- Treating `0.84`/`0.04` as validated defaults.

- Blocking 007 on nonexistent `028/004-code-graph-adoption-eval` or coco folders.

### METRICS
newInfoRatio: 0.86

novelty: The key new delta is that 007 must rescope schema/cache identity, not only threshold text, because live cache reuse is keyed by `profile_key` and `input_kind`.

status: complete

sources: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/spec.md:3`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/spec.md:41`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/spec.md:52`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/spec.md:57`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/spec.md:76`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/spec.md:107`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/plan.md:30`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/plan.md:57`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/plan.md:212`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/plan.md:241`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/plan.md:248`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/decision-record.md:85`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/decision-record.md:101`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/decision-record.md:147`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/decision-record.md:150`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/decision-record.md:220`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/implementation-summary.md:76`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/implementation-summary.md:108`, `.opencode/skills/system-spec-kit/shared/embeddings/registry.ts:20`, `.opencode/skills/system-spec-kit/shared/embeddings/registry.ts:24`, `.opencode/skills/system-spec-kit/shared/embeddings/registry.ts:25`, `.opencode/skills/system-spec-kit/shared/embeddings/registry.ts:26`, `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts:743`, `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts:762`, `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts:766`, `.opencode/skills/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:146`, `.opencode/skills/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:157`, `.opencode/skills/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:176`, `.opencode/skills/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:184`, `.opencode/skills/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:404`, `.opencode/skills/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:416`, `.opencode/skills/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:475`, `.opencode/skills/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:486`, `.opencode/skills/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:134`, `.opencode/skills/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:138`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:654`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:659`, `.opencode/skills/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:209`, `.opencode/skills/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:218`, `.opencode/skills/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:797`, `.opencode/skills/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:825`
