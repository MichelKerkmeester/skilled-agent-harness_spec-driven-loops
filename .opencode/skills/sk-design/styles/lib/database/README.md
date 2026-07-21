# Style Database

The style database is a rebuildable SQLite projection of the flat style bundles in the parent
directory. The flat files remain authoritative. Normal persistent reads never walk the corpus.

## Generation Model

`styles.style_id` is the stable UUID identity; `style_rowid` is an internal join key for FTS,
vectors, and normalized children. A successful index run writes source rows, vector jobs, an
immutable `corpus_generations` record, and the singleton `current_corpus_generation` pointer in
one `BEGIN IMMEDIATE` transaction. The on-disk publish pointer (`.current.json`) is a versioned
generation manifest that content-addresses one or more immutable artifacts (`generation-manifest.mjs`);
legacy single-file pointers still resolve. Readers realpath-check the selected file against the
generation directory, bind the pointer's generation hash to the opened database, then validate that
the schema version, active count, and aggregate hash agree. Any mismatch fails closed.

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

## Measurement & Contract Foundation

The `_db/` tree carries a measurement and parity plane so later work can prove a claim, detect a
regression, and roll back safely. Every piece serializes identity through one shared canonicalizer
(`canonical.mjs`: stable-key JSON plus length-framed SHA-256), so a byte reference can never drift
from what production emits.

- **Generation manifest** (`generation-manifest.mjs`) — a versioned pointer that content-addresses
  a generation's artifacts (the SQLite projection today, plus optional screenshot features, model
  profiles, and index). Publishing is one atomic pointer flip with fsync durability, so a reader
  sees the whole prior manifest or the whole new one. `pruneManifestGenerations` drops a generation
  as a unit; an artifact shared with a retained manifest is never removed. Digest verification is
  opt-in (`verifyDigests`) so the query hot path is not re-hashed on every open. Currently the real
  build publishes only the `sqlite` artifact; the multi-artifact machinery is proven by the manifest
  test suite and activates as later phases produce the additional artifacts.

- **Stage telemetry** (`stage-telemetry.mjs`) — a residency-honest recorder threaded (off by
  default) through the indexer lifecycle and the query lanes. Every stage is tagged `native` (work
  inside the node:sqlite / FTS5 boundary) or `js-resident` (JS heap and event-loop work: fs
  orchestration, JSON decode, cosine, sort, RRF, card assembly). There is no blended bucket — an
  unattributed record cannot be created — so native and JS-resident latency sum to the total. The
  vector lane splits its native row fetch from JS-resident `JSON.parse` + cosine + sort. Telemetry
  is a pure side channel: with it on or off, the retrieval DTO is byte-identical.

- **Differential oracle** (`oracle/differential-oracle.mjs`, `oracle/query-set.mjs`,
  `oracle/golden/`) — freezes the current retrieval/index output for a fixed query matrix as
  canonical golden bytes, then replays byte-for-byte. A deliberate ordering, tie-break, or field
  perturbation fails replay; a missing golden is reported rather than silently passing. No
  TypeScript toolchain is introduced — the oracle ships as pinned JS/ESM golden bytes. Regenerate
  the golden only via `freezeOracle` when an intended output change lands.

- **Replay fixtures** (`oracle/replay-fixtures.mjs`) — deterministic 1x/10x/100x corpora
  (`REPLAY_SCALES`, base 13 → 13/130/1,300; the 100x scale approximates the real ~1,290-bundle
  corpus and is tunable). Every byte is a pure function of an index-derived seed, so regenerating a
  scale yields identical bytes and the oracle reproduces identical query output. Per-scale corpus
  and oracle hashes are frozen in `oracle/golden/scales.json`.

- **Relevance judgments** (`oracle/relevance-judgments.mjs`,
  `oracle/relevance-judgments.seed.json`) — a versioned, honestly-labeled seed. `authored-similar`
  rows trace to a style's own `designSystem.similar[]` authorship resolved against the corpus;
  `silver-heuristic` rows are retrieval-derived weak positives where a candidate agrees across at
  least two lanes. Every row carries its `label_source` and provenance. **No row is human gold**,
  and the seed header flags that human relevance labeling is still required for a true judged qrels
  set.

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
