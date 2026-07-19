# Style Database

The style database is a rebuildable SQLite projection of the flat style bundles in the parent
directory. The flat files remain authoritative. Normal persistent reads never walk the corpus.

## Generation Model

`styles.style_id` is the stable UUID identity; `style_rowid` is an internal join key for FTS,
vectors, and normalized children. A successful index run writes source rows, vector jobs, an
immutable `corpus_generations` record, and the singleton `current_corpus_generation` pointer in
one `BEGIN IMMEDIATE` transaction. Readers realpath-check the selected file against the generation
directory, bind the pointer's generation hash to the opened database, then validate that the schema
version, active count, and aggregate hash agree. Any mismatch fails closed.

Artifact freshness uses `style-all-artifacts-v2`: the stable style UUID, sorted artifact roles, and
raw bytes are encoded as unsigned 64-bit length frames before SHA-256. The mutable slug locator is
excluded. Mtime, ctime, and size are retained as hints,
not correctness authorities. Normal incremental runs hash only metadata candidates; maintenance
can set `verifyAll: true` to force canonical re-verification of every bundle. Crawl-record hashes
independently invalidate provenance fallback data. The semantic retrieval hash is separate: it covers stable JSON for
identity, title, thesis, theme, industry, sorted capabilities/facets/token axes/sections, and a
normalized `DESIGN.md`. CSS or source-only changes therefore publish corpus freshness without
invalidating an unchanged semantic embedding.

## Indexer Lifecycle

`indexStyleCorpus()` requires `corpusWalkMode: 'migration'` or `'rollback'` and runs:

`DISCOVER -> VERIFY -> PARSE_VALIDATE -> COMMIT -> VECTOR_DRAIN -> PUBLISH`

Discovery is side-effect free. Every changed bundle is fully read, hash-verified, parsed, and
validated before the write lock. The transaction replaces all normalized children, lets FTS5
external-content triggers synchronize, supersedes stale vector jobs, and advances success markers
only with the generation pointer. A thrown error rolls the transaction back. A disappeared style
is quarantined on one scan and tombstoned only after a separate confirming scan (or an explicit
`confirmMissing` maintenance run).

`buildStyleDatabase()` is the callable full-build entry point. It is never invoked by query or
hydrate. A full build validates and checkpoints a uniquely named immutable generation file, syncs
the file and directory, then atomically replaces a synced `.current.json` pointer. Existing readers
remain bound to the prior generation file; `rollbackStyleDatabase()` durably reverses the pointer.
Vector jobs are keyed by style row, retrieval hash, and profile. `drainVectorQueue()`
uses a content-addressed cache, checks current identity again before publication, and records
bounded failures without blocking FTS or structured retrieval. Each drain also reclaims at most
its batch limit of stale `running` claims after a five-minute lease timeout. A reclaimed claim is
returned to `pending` without consuming a retry. `rebuildVectorProjection()`
invalidates one profile, advances its projection revision, and requeues every active style.

The current schema version is 2. Opening a version-1 database transactionally adds the crawl-record
freshness marker and creates vector projection revisions before advancing `PRAGMA user_version`.

## Retrieval

`queryPersistentStyles()` applies required facets, exclusions, known provenance, and exact-reuse
rights before any ranking lane receives candidates. Structured, persistent FTS5, and vector lanes
produce independent top-k ranks. `style-rrf-v1` combines only ranks using weighted reciprocal rank
fusion and reports each channel's rank and contribution. It never adds raw BM25, cosine, and
structured scores.

The degradation ladder is channel-local: `hybrid`, `structured+fts`, `structured+vector`, then
`structured-only`. Cursors bind the corpus generation, request fingerprint, fusion profile,
candidate K, vector projection revision, and final `(fusedScore, id)` key.
Caller-supplied `generationHash` pins are enforced against the opened generation rather than
silently served from current. Query vectors must be arrays of 1-16,384 finite numbers and serialize
to at most 256 KiB; validation occurs before request fingerprinting or database access.

## Operator Commands

`operator.mjs` is the supported persistent maintenance entry point. It emits JSON and exits nonzero
on invalid input or a failed operation:

```bash
node .opencode/skills/sk-design/styles/_db/operator.mjs status --database /path/style.sqlite
node .opencode/skills/sk-design/styles/_db/operator.mjs build --corpus /path/styles --database /path/style.sqlite
node .opencode/skills/sk-design/styles/_db/operator.mjs cutover --database /path/style.sqlite --generation /path/retained.sqlite
node .opencode/skills/sk-design/styles/_db/operator.mjs rollback --database /path/style.sqlite
node .opencode/skills/sk-design/styles/_db/operator.mjs repair --database /path/style.sqlite --profile style-default-v1
```

`status` reports the published generation, rollback candidate, retained files, and vector-job
counts. `build` stages, validates, and publishes a complete generation. `cutover` points readers at
an explicitly retained generation; `rollback` selects the newest retained non-current generation
unless `--generation` is supplied. `repair` invalidates and requeues one vector profile. After each
build, cutover, or rollback, pruning keeps the current generation and, when available, one rollback
generation; older generation files and SQLite sidecars are removed.

## Adapter Modes

`styles/_engine/style-library.mjs` preserves `runQuery`, `runHydrate`, CLI output, card fields, and
refusal codes behind these modes:

| Mode | Behavior |
|---|---|
| `legacy` | Default. Runs the unchanged manifest and flat-file engine. |
| `shadow` | Returns the legacy result and attaches bounded persistent parity evidence. Corpus walking is explicit because this is a migration mode. |
| `persistent` | Reads only the published database for selection; hydration reads only selected, DB-hash-verified authoritative artifacts. |

Select a mode with `options.styleDatabaseMode`, CLI `--backend`, or
`SK_DESIGN_STYLE_DB_MODE`. The default is always `legacy`. Supply `options.databasePath`, CLI
`--database`, or use `_db/style-library.sqlite`.
