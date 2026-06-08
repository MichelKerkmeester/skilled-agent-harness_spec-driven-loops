
# YOUR NARROW FOCUS — iteration 014 of 15: Indexing & freshness for an authored-doc corpus
Our real architecture is "an index + vector store OVER a living set of authored markdown docs that get EDITED." OpenLTM indexes ROWS that get INSERTED. Read how OpenLTM keeps its derived surfaces fresh and ask which techniques apply to indexing EDITED documents (not inserted rows):
- FTS5 triggers that keep the lexical index in sync: `packages/openltm-core/src/schema.sql` (FTS virtual tables + triggers), `migrations/020_fts_coverage.sql`
- re-embedding on content change / fingerprints: `packages/openltm-core/src/janitor/embeddings.ts`, `packages/openltm-core/src/dao/embeddings.ts`, `migrations/010_memory_embeddings_split.sql`
- change detection / what triggers a re-index
Compare to our self-maintaining incremental index over spec docs + `memory_index_scan` / `memory_embedding_reconcile`. Which freshness/indexing techniques TRANSFER or are DOC-ANALOG for a corpus of edited documents (e.g. per-doc fingerprint to skip re-embeds, trigger-kept lexical sync, model/dim keying)? This is where genuine index-layer signal lives for our model.
