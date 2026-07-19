# Iteration 3: Normalized style schema and canonical hashes

## Focus
Define and pressure-test a normalized SQLite schema, constraints, indexes, deterministic retrieval document, and canonical aggregate content hash. This follows strategy `NEXT FOCUS` exactly. Canonical route proof: session `fanout-sol-1784444104016-7oed3t`, iteration/run `3`, `Resolved route: mode=research target_agent=deep-research`; convergence remains telemetry because config fixes `stopPolicy=max-iterations` and this is pass 3 of 10. [SOURCE: deep-research-config.json:3-18] [SOURCE: deep-research-config.json:27-41] [SOURCE: deep-research-strategy.md:62-79]

## Findings
1. **Use a style-owned normalized source model, with projections explicitly disposable.** The minimum authoritative indexed-state tables should be `styles(style_pk INTEGER PRIMARY KEY, style_id TEXT UNIQUE, slug TEXT UNIQUE, capture_status, title, thesis, theme, aggregate_hash, retrieval_hash, tombstoned_at, created_at, updated_at)`, one-to-one `style_provenance`, `style_crawl_state`, one-to-many `style_artifacts`, `style_terms`, `style_token_axes`, and `style_sections`, plus versioned `schema_meta`/`ingestion_runs`. `retrieval_documents`, external-content `styles_fts`, and profile-addressed vector rows are derived projections, all joined through stable `style_pk`; flat artifacts remain rebuild inputs. This follows system-spec-kit's separation of metadata, FTS, and vectors without inheriting memory-specific fields. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/vector-index-schema.ts:3839-3958] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/vector-index-schema.ts:800-817] [INFERENCE: normalized adaptation of the exact manifest shape at .opencode/skills/sk-design/styles/_engine/manifest.mjs:36-73]

2. **Every current manifest field has a non-ambiguous destination.** Top-level `schemaVersion` maps to `schema_meta`; `crawlManifestHash` to `ingestion_runs.crawl_manifest_hash`; `generationHash` to a derived `corpus_snapshots.generation_hash`; `recordCount` to `COUNT(*)` over active `styles`; and `styles` is the relational join. Per style: `id/slug/status/title/thesis/theme/contentHash` map to scalar `styles` columns; `tokenAxes` to `(style_pk,axis,count)`; `capabilities` and `facets` to `(style_pk,kind,value)` terms; `sectionPointers` to `(style_pk,ordinal,name,line)` while `availableSections` becomes a view over the same rows; all provenance scalars map one-to-one and `evidenceScope` maps to terms; `artifacts` maps to `(relative_path,role,bytes,sha256)`; `estimatedHydrationBytes` becomes a sum over roles `design|source|tokens`, not stored state. [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:36-73] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:245-266] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:483-513]

3. **The crawl manifest must be retained as source evidence rather than folded lossy into `styles`.** `_manifest.json` fields `uuid,url,lastmod,slug,status,capturedAt,error` map to `style_crawl_state(style_pk,source_uuid,source_url,source_lastmod,capture_status,captured_at,error_json,ingestion_run_id)`. Canonical JSON then supplies `source`, `uuid`, `name`, `northStar`, `capturedAt`, original-site `meta.url`, screenshot URL, and structured `designSystem`; precedence remains canonical UUID/source/capturedAt with crawl fallback, matching current construction. [SOURCE: .opencode/skills/sk-design/styles/_manifest.json:1-27] [SOURCE: .opencode/skills/sk-design/styles/shade/shade-canonical.json:1-24] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:434-501]

4. **All six observed artifact roles belong in `style_artifacts`, but only selected semantics belong in the retrieval document.** A pressure-test style contains `DESIGN.md`, `design-tokens.json`, `<slug>-canonical.json`, `source.md`, `css-variables.css`, and `tailwind-v4.css`. Store every file's path/role/size/digest so any change is detected and hydration remains hash-verifiable. Parse canonical JSON into metadata, token JSON into token-axis counts, and `DESIGN.md` into sections/body. Keep `source.md` available for hydration/a future raw-evidence lane; exclude it and generated CSS from v1 semantic text to avoid duplicated/noisy embeddings. [SOURCE: command: in-memory schema/hash pressure test over .opencode/skills/sk-design/styles/shade, 2026-07-19] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:434-481] [SOURCE: .opencode/skills/sk-design/styles/_engine/hydrate.mjs:50-56] [SOURCE: .opencode/skills/sk-design/styles/_engine/hydrate.mjs:325-370]

5. **Specify two hashes because source freshness and retrieval freshness are different contracts.** `aggregate_hash_v1` must cover every regular style artifact using `SHA-256("style-aggregate-v1\\0" || repeated(u32be(path_utf8_len), NFC(relative_path), u64be(byte_len), raw_bytes))`, sorted by the existing raw-string ordering. Relative-to-style paths deliberately remove slug from the hash, unlike the current `path\0buffer\0` formula, so locator-only renames do not masquerade as content changes; retain the old manifest hash during migration for parity checks. `retrieval_hash_v1` hashes only the canonical retrieval-document bytes, so CSS-only changes invalidate hydration/source state without forcing re-embedding. The actual six-artifact Shade aggregate under this framing was `sha256:518a60160408f3e497502e3b733e702e078cae004d984e8b7a3705477e167109`. [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:141-176] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:552-637] [SOURCE: command: in-memory schema/hash pressure test over Shade, 2026-07-19] [INFERENCE: separate aggregate and retrieval hashes prevent generated CSS churn from invalidating semantic vectors]

6. **Make the retrieval document a byte-level contract, not an ad hoc concatenation.** Construct a fixed-key JSON object `{schemaVersion:1,id,title,thesis,theme,industry,capabilities,facets,tokenAxes,sections,body}`; normalize textual line endings to LF and strings to NFC; represent absence as `null`; sort sets with `compareRawStrings`, token axes by `axis`, and sections by `ordinal`; serialize compact UTF-8 with the fixed key insertion order; hash `"style-retrieval-document-v1\\0" + bytes`. `body` is full normalized `DESIGN.md`; canonical metadata and derived terms remain separate weighted FTS columns (`title`, `thesis`, `facets_text`, `body`). Provenance URLs, timestamps, artifact paths, CSS, and vector/model metadata are intentionally excluded because they should filter, hydrate, or govern freshness rather than alter semantic meaning. [SOURCE: .opencode/skills/sk-design/styles/shade/DESIGN.md:1-20] [SOURCE: .opencode/skills/sk-design/styles/shade/design-tokens.json:1-69] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:322-405] [INFERENCE: fixed keys plus explicit normalization/sorting make document bytes deterministic]

7. **The proposed constraints, indexes, and FTS synchronization survived an executable SQLite pressure test.** Required constraints are `UNIQUE(style_id)`, `UNIQUE(slug)`, foreign keys with `ON DELETE CASCADE`, closed status/role/term/embedding-state checks, nonnegative bytes/counts, positive section lines, hash-format checks, safe relative artifact paths, and the tombstone equivalence `(status='tombstoned')=(tombstoned_at IS NOT NULL)`. Required indexes are active `(theme,style_id)` partial index, `(capture_status,style_id)`, artifact `(style_pk,role)`, term `(kind,value,style_pk)`, token `(axis,style_pk)`, section `(style_pk,ordinal)`, retrieval-document hash, and embedding `(profile_id,status,style_pk)`. The test rejected duplicate slugs and invalid tombstones, trigger-synchronized an external-content FTS5 row, and `EXPLAIN QUERY PLAN` selected `idx_styles_active_theme`. This directly mirrors system-spec-kit's insert/update/delete FTS trigger pattern. [SOURCE: command: Node `DatabaseSync(':memory:')` schema pressure test, 2026-07-19] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/vector-index-schema.ts:399-432] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/vector-index-schema.ts:3940-3948]

## Ruled Out
- One JSON blob per style: it cannot enforce unique multi-values, support facet/token indexes, or isolate vector-invalidating changes. [INFERENCE: contrasted with normalized destinations in Findings 1-2]
- Hashing only `DESIGN.md`: it misses canonical, token, source, and generated-output drift already covered by current all-artifact hashing. [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:552-605]
- Embedding the complete six-file aggregate: CSS and raw source duplicate generated semantics and would cause avoidable vector churn. [INFERENCE: based on artifact roles and separate aggregate/retrieval freshness contracts]
- Storing `availableSections`, `recordCount`, and `estimatedHydrationBytes` as independent authoritative values: each is exactly derivable and would create consistency hazards. [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:493-511]

## Dead Ends
None. The first pressure-test DDL used double-quoted SQLite string literals and failed because SQLite resolved them as identifiers; the corrected test used proper string literals and completed. This was a test-harness correction, not a schema dead end. [SOURCE: command: first and corrected in-memory SQLite pressure tests, 2026-07-19]

## Edge Cases
- Ambiguous input: “authoritative source tables” is interpreted as durable relational indexed state derived from flat-file rebuild inputs, not permission for FTS/vector tables to become source of truth.
- Contradictory evidence: none.
- Missing dependencies: none; Node's built-in experimental `node:sqlite` was available.
- Partial success: none; the initial DDL quoting error was corrected and all intended pressure checks ran.

## Sources Consulted
- `.opencode/skills/sk-design/styles/_engine/manifest.mjs:29-79,141-176,245-266,322-405,434-513,552-712`
- `.opencode/skills/sk-design/styles/_engine/style-library.mjs:69-155`
- `.opencode/skills/sk-design/styles/_engine/rank-fts.mjs:102-237`
- `.opencode/skills/sk-design/styles/_engine/hydrate.mjs:25-56,144-155,225-370`
- `.opencode/skills/sk-design/styles/_manifest.json:1-27`
- `.opencode/skills/sk-design/styles/shade/shade-canonical.json:1-220`
- `.opencode/skills/sk-design/styles/shade/design-tokens.json:1-180`
- `.opencode/skills/sk-design/styles/shade/DESIGN.md:1-180`
- `.opencode/skills/system-spec-kit/mcp-server/lib/search/vector-index-schema.ts:399-432,800-817,3839-3958`
- `command: two bounded Node in-memory SQLite/hash pressure tests, 2026-07-19`

## Assessment
- New information ratio: 1.0
- Novelty justification: 7 of 7 findings are fully new concrete schema, mapping, hashing, document, or pressure-test results relative to iterations 1-2.
- Questions addressed: Q2, Q3, Q4, Q5
- Questions answered: Q2
- Convergence telemetry: 1.0, non-stopping under the forced 10-iteration/max-iterations policy.

## Reflection
- What worked and why: tracing the exact closed manifest keys into normalized destinations, then executing the DDL and query plan, exposed both consistency constraints and the necessary distinction between aggregate and retrieval hashes.
- What did not work and why: the first executable DDL used double quotes for SQL values; SQLite treated them as identifiers. Switching to SQL string literals fixed the harness without changing the model.
- What I would do differently: add a corpus-wide deterministic-document fixture in the next schema pass to measure retrieval-document size and hash churn by artifact role.

## Recommended Next Focus
Design the incremental transaction/state machine against this schema: mtime hint, aggregate-hash verification, parse/validate, atomic relational/retrieval upsert, vector enqueue keyed by retrieval hash, tombstone, rebuild, and rollback; explicitly model crash boundaries and corpus-wide generation publication.
