# Iteration 2: Manifest Schemas, Ownership, and Lifecycle

## Focus

Map every field, invariant, writer, reader, hash input, ordering rule, and lifecycle role of the crawl manifest and retrieval manifest. This pass distinguishes current ownership without yet choosing the consolidated canonical representation.

## Actions Taken

1. Read the detached-lineage config, state, strategy, registry, and prior narrative; confirmed iteration 2, lineage-only writes, `progressiveSynthesis=false`, and the schema/lifecycle focus. [SOURCE: .opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/002-naming-manifests/research/lineages/sol-high-fast/deep-research-config.json:16-20] [SOURCE: .opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/002-naming-manifests/research/lineages/sol-high-fast/deep-research-strategy.md:120-123]
2. Inspected both committed JSON documents and the engine's closed-schema validators to enumerate every field and structural invariant. [SOURCE: .opencode/skills/sk-design/styles/_manifest.json:1-10] [SOURCE: .opencode/skills/sk-design/styles/_retrieval-manifest.json:1-184] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:36-73] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:209-315]
3. Traced the crawl writer from sitemap enumeration through resumable status mutation and per-style persistence. [SOURCE: .opencode/skills/sk-design/styles/_harness/extract-refero.mjs:103-115] [SOURCE: .opencode/skills/sk-design/styles/_harness/extract-refero.mjs:310-315] [SOURCE: .opencode/skills/sk-design/styles/_harness/extract-refero.mjs:388-435]
4. Traced retrieval generation, hashing, ordering, atomic publication, committed readers, and live-generation guards end to end. [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:141-176] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:434-637] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:685-743] [SOURCE: .opencode/skills/sk-design/styles/_engine/style-library.mjs:73-109] [SOURCE: .opencode/skills/sk-design/styles/_engine/style-library.mjs:123-177]
5. Ran a bounded corpus-wide invariant check over both committed JSON files and traced the database indexer's independent crawl consumption and generation identity. [INFERENCE: a Node invariant check over the two committed manifests confirmed counts, uniqueness, ordering, membership, and both published hashes] [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:187-206] [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:645-662] [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:740-753]

## Findings

1. **The crawl schema is a mutable capture-state array, not a versioned closed document.** Each row currently has exactly seven observed fields: `uuid`, `url`, `lastmod`, `slug`, `status`, `capturedAt`, and `error`. The harness creates rows with nullable `slug`/`capturedAt`, drives `pending -> captured` or `error`, and changes a captured row to `stale` when sitemap `lastmod` changes. There is no schema-version field, exact-key validator, record-count field, or document-level hash in the crawl file. [SOURCE: .opencode/skills/sk-design/styles/_manifest.json:1-10] [SOURCE: .opencode/skills/sk-design/styles/_harness/extract-refero.mjs:392-399] [SOURCE: .opencode/skills/sk-design/styles/_harness/extract-refero.mjs:417-435]

2. **Crawl ownership, ordering, and durability are intentionally operational but weakly canonicalized.** `extract-refero.mjs` is the sole live writer found: sitemap enumeration preserves source order after first-seen UUID de-duplication, existing rows retain their positions, and new rows append. `saveManifest()` performs a direct pretty-printed `writeFile`, not temporary-file publication, while `loadManifest()` turns any read or parse failure into an empty array. The committed 1,290 rows are unique by UUID and slug but are sorted by neither, so current bytes depend on accumulated crawl history rather than a declared order. [SOURCE: .opencode/skills/sk-design/styles/_harness/extract-refero.mjs:103-115] [SOURCE: .opencode/skills/sk-design/styles/_harness/extract-refero.mjs:314-315] [SOURCE: .opencode/skills/sk-design/styles/_harness/extract-refero.mjs:392-399] [INFERENCE: bounded invariant check reported `orderedByUuid=false`, `orderedBySlug=false`, and 1,290 unique UUIDs/slugs]

3. **The retrieval schema is closed, versioned, and recursively validated.** Its top level must contain exactly `schemaVersion`, `generationHash`, `crawlManifestHash`, `recordCount`, and `styles`; version must be `1`; both hashes must match `sha256:<64 hex>`; `recordCount` must equal `styles.length`; and IDs and slugs must each be unique. Every style must contain exactly 16 fields: `id`, `slug`, `status`, `title`, `thesis`, `theme`, `tokenAxes`, `capabilities`, `facets`, `availableSections`, `sectionPointers`, `provenance`, `artifacts`, `estimatedHydrationBytes`, and `contentHash`. Nested token-axis, section-pointer, provenance, and artifact objects also reject extra or missing keys and enforce scalar types, non-negative counts/bytes, positive section lines, and hash syntax. [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:29-73] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:185-266] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:288-315]

4. **Retrieval fields have mixed ownership, so they cannot all be copied from either current manifest.** Crawl state supplies fallback identity, status, source URL, and capture time. Corpus artifacts supply title, thesis, theme, token axes, capabilities, facets, sections, detailed provenance, artifact metadata, hydration size, and content identity. Unchanged artifact content may reuse the previous retrieval record, but crawl-owned `id` and `status` are refreshed during reuse. This makes retrieval a deterministic projection of two inputs: crawl state plus the style artifact tree. [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:434-513] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:584-621]

5. **Retrieval ordering is explicit and byte-stable.** Artifact filenames and artifact records use raw-string path order; style directories are scanned in raw-string slug order; final style records are sorted by `id`; token axes, capabilities, and facets are sorted; and serialization fixes object insertion order, two-space indentation, and a terminal newline. Section pointers preserve `DESIGN.md` heading order, and `availableSections` is the corresponding name projection rather than an independently sorted set. The committed corpus satisfies all these ordering/alignment invariants. [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:332-405] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:552-580] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:597-628] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:718-725] [INFERENCE: bounded invariant check confirmed ID, token-axis, capability, facet, and artifact ordering plus section-name alignment across all 1,290 records]

6. **The three retrieval hash layers have distinct contracts.** `crawlManifestHash` is SHA-256 over the crawl file's exact bytes, so whitespace or row-order changes invalidate the generation even when row meaning is unchanged. Each style `contentHash` hashes ordered artifact path plus raw artifact bytes, excluding file metadata. `generationHash` hashes schema version, the crawl byte hash, and each ID/content-hash pair in final ID order; it therefore binds schema, operational crawl bytes, membership/identity, and artifact content, but not derived field serialization independently. The committed `crawlManifestHash` and `generationHash` both reproduce exactly under these algorithms. [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:141-176] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:552-591] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:623-635] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:694-712] [INFERENCE: bounded invariant check returned `crawlHashMatches=true` and `generationHashMatches=true`]

7. **Retrieval publication and use form a guarded derived-cache lifecycle.** The build command loads the committed file, regenerates from current inputs, computes a deterministic diff, and either atomically publishes through an adjacent exclusive temporary file plus rename or compares exact serialized bytes in check mode. Legacy query reloads the committed manifest and regenerates a live manifest before use, rejecting stale bytes; hydration binds the selected generation before reading artifacts. Missing retrieval output is recoverable by `build --write`, whereas missing or malformed crawl input prevents generation. [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:685-743] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:746-782] [SOURCE: .opencode/skills/sk-design/styles/_engine/style-library.mjs:73-109] [SOURCE: .opencode/skills/sk-design/styles/_engine/style-library.mjs:123-177]

8. **The database pipeline does not read the retrieval manifest.** `indexStyleCorpus()` reads and hashes `_manifest.json` directly, joins crawl rows to a separately parsed artifact projection, and computes its own generation hash from DB schema/version, crawl hash, active style ID/aggregate-hash pairs, and inactive lifecycle states. It then publishes active/quarantined/tombstoned generation state transactionally in SQLite. Consequently, making the current retrieval JSON the sole input would require a deliberate DB contract change; deleting crawl state after merely redirecting engine readers would break indexing. [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:187-206] [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:623-662] [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:740-753] [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:808-850] [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:954-982]

9. **Current canonicality is split by field ownership, despite exact membership parity.** The committed files both contain 1,290 unique slugs with identical slug membership, but crawl state is authoritative for acquisition lifecycle while artifact files are authoritative for enriched searchable content; retrieval JSON is a reproducible publication over both. A consolidated design therefore needs a canonical input model plus derived projections, not a literal choice between the two current JSON shapes. [SOURCE: .opencode/skills/sk-design/styles/_retrieval-manifest.json:1-6] [SOURCE: .opencode/skills/sk-design/styles/_harness/extract-refero.mjs:392-435] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:434-513] [INFERENCE: bounded invariant check confirmed equal 1,290-slug membership, while the writer trace assigns different field authorities]

## Questions Answered

- **Answered:** What fields, invariants, and lifecycle roles differ between the crawl manifest and retrieval manifest schemas? The field-by-field ownership, validation, ordering, hash, publication, and reader contracts are mapped above. [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:29-73] [SOURCE: .opencode/skills/sk-design/styles/_harness/extract-refero.mjs:388-435]
- **Partially answered:** Which manifest should be canonical, which data should be derived, and how should hashes, provenance, and deterministic regeneration work? Evidence now establishes split authority and exact existing hash semantics, but the target canonical schema and compatibility boundary remain design decisions for the next pass. [INFERENCE: current writers establish field ownership but do not define the desired consolidated contract]

## Questions Remaining

- Choose the canonical input model and derived projection boundary without losing resumable crawl lifecycle or artifact-derived retrieval data.
- Complete the mutable/indirect reference sequence with executable validation commands.
- Define two-stage cutover, stale-artifact detection, rollback, and proof obligations for naming first and consolidation second.

## Ruled Out

- Treating retrieval JSON as the database indexer's current source: the indexer reads crawl bytes and artifacts independently. [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:645-695]
- Treating crawl row order as semantic or deterministic: the writer preserves sitemap/history order and the committed array is sorted by neither UUID nor slug. [SOURCE: .opencode/skills/sk-design/styles/_harness/extract-refero.mjs:103-115] [SOURCE: .opencode/skills/sk-design/styles/_harness/extract-refero.mjs:392-399] [INFERENCE: bounded invariant check found both ordering predicates false]
- Consolidating by taking a union of the two JSON schemas: field ownership spans mutable crawl state and independently canonical artifact content, so a union alone would create two writers for one document or force one subsystem to own data it does not produce. [INFERENCE: writer traces in `extract-refero.mjs` and `manifest.mjs` establish separate authorities]

## Dead Ends

- No new approach was exhausted. Reading sample JSON alone would not have established ordering, validation, or lifecycle guarantees; tracing writers/readers and checking the full corpus closed those gaps. [INFERENCE: code-level contracts and corpus-wide checks supplied facts absent from samples]

## Sources Consulted

- `.opencode/skills/sk-design/styles/_manifest.json:1-70`
- `.opencode/skills/sk-design/styles/_retrieval-manifest.json:1-190`
- `.opencode/skills/sk-design/styles/_harness/extract-refero.mjs:103-115,310-315,388-435`
- `.opencode/skills/sk-design/styles/_engine/manifest.mjs:29-809`
- `.opencode/skills/sk-design/styles/_engine/style-library.mjs:73-177`
- `.opencode/skills/sk-design/styles/_db/indexer.mjs:187-206,623-753,808-982`
- `.opencode/skills/sk-design/styles/_db/generation-manifest.mjs:1-170`
- Bounded Node invariant check over both committed manifests.

## Assessment

- New information ratio: **0.94** (8 fully new findings and 1 partially new schema-role expansion across 9 findings; no simplicity bonus).
- Questions addressed: full schema/lifecycle difference; canonical-versus-derived constraints; hash/provenance/regeneration foundations.
- Questions answered: manifest schema/invariant/lifecycle differences (2 of 5 key questions now answered across the lineage).
- Status: **complete** for iteration 2; convergence remains telemetry because `stopPolicy=max-iterations` requires five iterations.
- Edge cases: the crawl loader conflates missing, unreadable, and malformed state; exact-byte crawl hashing makes non-semantic reformatting generation-significant.

## Reflection

- What worked and why: tracing every writer and reader before interpreting sample JSON separated operational authority, derived publication, and database state instead of conflating three uses of “manifest.”
- What did not work and why: the first broad lifecycle grep included unrelated uses of “stable”; narrowing to manifest symbols and owner files removed that noise.
- What I would do differently: begin with exported build/load/write symbols and both physical filenames, then run corpus-wide invariant checks only after reconstructing the algorithms they are meant to verify.

## Recommended Next Focus

Broaden from schema mechanics to target architecture and migration consequences: design the canonical input plus derived projections, decide whether crawl lifecycle becomes a versioned section or separate writer-owned state, define semantic versus byte hashes and provenance ownership, and map compatibility requirements for engine and database consumers. Carry those decisions into a two-stage cutover/rollback model, but defer final validation-command enumeration to the following dedicated proof pass.
