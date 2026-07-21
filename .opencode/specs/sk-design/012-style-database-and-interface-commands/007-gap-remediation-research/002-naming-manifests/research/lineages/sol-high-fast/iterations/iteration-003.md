# Iteration 3: Canonical Manifest Architecture and Migration Consequences

## Focus

Design the target single-source architecture from the proven split ownership: acquisition lifecycle belongs to the crawl writer, enriched retrieval data belongs to corpus artifacts, and engine/database products are derived projections. This pass compares three viable physical designs, specifies the recommended schema and hash/provenance contracts, and identifies compatibility consequences without executing the cutover or enumerating its final proof commands.

## Actions Taken

1. Read the detached lineage's config, state, strategy, registry, and both prior iteration narratives; confirmed run 3, lineage-only writes, `progressiveSynthesis=false`, and the explicit architecture focus taking precedence over the reducer's broader cutover wording. [SOURCE: .opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/002-naming-manifests/research/lineages/sol-high-fast/deep-research-config.json:18-20] [SOURCE: .opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/002-naming-manifests/research/lineages/sol-high-fast/deep-research-strategy.md:138-152]
2. Re-traced the exact hash, projection, publication, and acquisition-write boundaries needed to judge whether two writers can safely share one physical document. [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:141-176] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:584-637] [SOURCE: .opencode/skills/sk-design/styles/_harness/extract-refero.mjs:310-315]
3. Re-traced the engine's derived-field assembly and deterministic build/atomic publication behavior to preserve compatible projection semantics in the target model. [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:434-513] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:685-743]
4. Inspected database canonical serialization, per-crawl-record hashing, corpus generation identity, and transactional indexing to separate reusable source identity from DB-specific generation identity. [SOURCE: .opencode/skills/sk-design/styles/_db/canonical.mjs:21-69] [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:187-206] [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:623-753]
5. Checked engine and database tests for stale-derived-output rejection, byte-stable regeneration, provenance-only invalidation, and crash-safe publication constraints. [SOURCE: .opencode/skills/sk-design/styles/_engine/__tests__/check-stable.test.mjs:14-79] [SOURCE: .opencode/skills/sk-design/styles/_db/__tests__/indexer.test.mjs:141-186] [SOURCE: .opencode/skills/sk-design/styles/_db/__tests__/indexer.test.mjs:211-243]

## Findings

1. **Recommended ownership model: one writer-owned canonical corpus manifest plus artifact-owned content; no second committed retrieval manifest.** `styles/manifest.json` should be the only corpus manifest and the harness should be its only writer. It owns membership, source identity, and acquisition lifecycle. Per-style artifact files remain canonical for enriched content. A shared pure projector reads those two authorities and supplies the same deterministic in-memory retrieval projection to both the legacy engine and DB indexer; neither consumer writes back to `manifest.json`. This is a single source of manifest truth without falsely moving artifact-derived title, theme, facets, sections, or content provenance into acquisition state. [SOURCE: .opencode/skills/sk-design/styles/_harness/extract-refero.mjs:392-435] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:434-513] [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:649-710] [INFERENCE: assigning one physical file to the sole acquisition writer preserves proven field authority while a shared projector removes duplicate manifest publications]

2. **Exact target canonical schema.** The write-once shape should be a closed version-2 envelope, normalized and serialized in raw-string `id` order:

   ```json
   {
     "schemaVersion": 2,
     "kind": "style-corpus",
     "entries": [
       {
         "id": "<refero-uuid>",
         "slug": "<string-or-null>",
         "source": {
           "url": "<url>",
           "lastModified": "<string-or-null>"
         },
         "acquisition": {
           "status": "pending|captured|stale|error",
           "capturedAt": "<iso-string-or-null>",
           "error": "<string-or-null>"
         }
       }
     ]
   }
   ```

   `id` replaces crawl `uuid` as the stable join key; nullable `slug` preserves pre-capture rows; nested `source` and `acquisition` make ownership explicit without importing retrieval fields. Exact-key/type/uniqueness validation should reject unknown top-level, entry, source, and acquisition fields. Sorting on write is canonical serialization, not business semantics. [SOURCE: .opencode/skills/sk-design/styles/_harness/extract-refero.mjs:392-399] [SOURCE: .opencode/skills/sk-design/styles/_harness/extract-refero.mjs:417-435] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:297-315] [INFERENCE: the schema is a versioned normalization of the seven crawl-owned fields and deliberately excludes all artifact-derived retrieval fields]

3. **Use semantic source identity for invalidation and retain byte identity only for diagnostics.** Define `sourceSemanticHash = sha256(lengthFrame("style-corpus-manifest-v2") + lengthFrame(stableJson(normalizedEnvelope)))`; normalization validates the schema and orders entries by `id`, while `stableJson` sorts object keys. Define `sourceByteHash = sha256(raw manifest bytes)` only for audit/debug output, never as a cache key. Keep each style's existing artifact-content hash over ordered `path + NUL + raw bytes + NUL`. Define retrieval `generationHash` from projection schema version, `sourceSemanticHash`, and sorted `id/contentHash` pairs. This prevents whitespace and historical row-order changes from invalidating products while preserving meaningful lifecycle/provenance changes; the repository already has the required locale-free key sorting and unambiguous length framing. [SOURCE: .opencode/skills/sk-design/styles/_db/canonical.mjs:21-69] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:149-176] [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:187-206] [INFERENCE: replacing current exact-byte crawl identity with validated canonical semantics removes false staleness without weakening content binding]

4. **Derived projection and provenance boundary.** The in-memory retrieval projection should advance to schema version 2 and retain the current `styles` records, deterministic ordering, and artifact-derived provenance, but replace `crawlManifestHash` with `sourceManifest: {schemaVersion: 2, semanticHash: "sha256:..."}`. Do not include timestamps or byte hashes in generation identity. `provenance.sourceUrl`, `uuid`, and `capturedAt` continue to prefer canonical artifact values and fall back to canonical-manifest acquisition data; derived facets, rights signals, section pointers, and artifact metadata remain projector-owned. Staleness means either the recomputed semantic source hash or any artifact content hash differs from the generation token. Regeneration remains deterministic by sorting entries/styles and set-like arrays with raw code-unit comparison and preserving document heading order only where order is content. [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:448-513] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:552-580] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:623-635] [SOURCE: .opencode/skills/sk-design/styles/_engine/__tests__/check-stable.test.mjs:29-79]

5. **Design B—one envelope with separately written `acquisition` and `retrieval` sections—is technically viable but weaker and should be eliminated.** It would require every writer to read/validate the whole document, compare-and-swap an expected semantic hash, lock across processes, merge only its owned section, and atomically replace the file. Even then, a harness save could race an engine projection save, and the file could expose acquisition version N with retrieval derived from N-1 unless both sections carry and verify a source hash. The current harness does direct whole-file writes and saves after every capture, while engine publication also replaces a whole file; sharing a path would therefore introduce lost-update and stale-section hazards absent from the recommended one-writer design. [SOURCE: .opencode/skills/sk-design/styles/_harness/extract-refero.mjs:314-315] [SOURCE: .opencode/skills/sk-design/styles/_harness/extract-refero.mjs:423-435] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:728-743] [INFERENCE: two independent whole-document replacement writers cannot safely share one file without new locking/CAS machinery and cross-section consistency rules]

6. **Design C—keep a canonical acquisition manifest and a committed retrieval cache—is viable as a transition but weaker as the target.** It preserves today's engine's committed-versus-live stale guard and atomic byte-stable `--write/--check` workflow, so it is the lowest-risk bridge while consumers migrate. It nevertheless leaves two manifest-shaped files with identical membership and requires permanent stale-cache policy; poisoned derived fields can retain unchanged source/content hashes and must be detected by full regeneration. Therefore use it only during cutover, then delete the derived file once engine readers build through the shared projector. [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:685-743] [SOURCE: .opencode/skills/sk-design/styles/_engine/__tests__/check-stable.test.mjs:14-26] [SOURCE: .opencode/skills/sk-design/styles/_engine/__tests__/check-stable.test.mjs:54-79] [INFERENCE: a reproducible materialized cache is operationally valid but does not satisfy the target's one-physical-manifest simplification]

7. **Engine/database compatibility requires shared source normalization but not a merged generation identity.** Preserve the engine's retrieval record/API shape during the bridge, then change its generation token to projection-v2 semantics and remove mandatory loading of a committed retrieval file. Change the DB indexer to consume the same normalized v2 entries and `sourceSemanticHash`, but retain DB-specific hashing over DB schema version, active aggregate hashes, and inactive lifecycle states; bump `GENERATION_HASH_VERSION` because its input contract changes, while SQLite schema version can remain 2 if no table/column changes. The DB generation-pointer manifest must remain separate: it is an atomic pointer to immutable SQLite and optional model/index artifacts, not a competing corpus manifest, and it already supports legacy pointer normalization. [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:194-206] [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:740-753] [SOURCE: .opencode/skills/sk-design/styles/_db/generation-manifest.mjs:1-32] [SOURCE: .opencode/skills/sk-design/styles/_db/generation-manifest.mjs:121-153] [INFERENCE: source identity can be shared while engine and DB generation identities remain purpose-specific and versioned]

## Questions Answered

- **Answered:** Which manifest should be canonical, which data should be derived, and how should hashes, provenance, and deterministic regeneration work? `manifest.json` v2 is the one-writer canonical acquisition manifest; artifacts remain canonical content; engine and DB consume shared deterministic projections keyed by semantic source and artifact-content hashes. [SOURCE: .opencode/skills/sk-design/styles/_harness/extract-refero.mjs:392-435] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:434-513] [INFERENCE: findings 1-4 define the exact ownership, schema, hash, provenance, and regeneration contract]
- **Partially answered:** Which imports/references and migration sequence are required? The architectural sequence is v1 normalization -> v2 canonical write -> shared projector adoption -> bridge cache removal, but the exact hidden/indirect consumer inventory and executable commands remain for iteration 4. [INFERENCE: target compatibility consequences are fixed, while command-level cutover proof was intentionally deferred]

## Questions Remaining

- Which indirect/runtime-computed consumers, imports, mutable references, and generated paths must change, and what exact executable sequence updates them safely?
- What baseline, cutover, stale-detection, rollback, and post-cutover proof demonstrates parity for naming first and consolidation second?

## Ruled Out

- A permanently multi-writer physical manifest with writer-owned sections: viable only with locks, compare-and-swap, whole-document validation, and source-version binding, all of which add race and torn-generation failure modes without eliminating derived state. [SOURCE: .opencode/skills/sk-design/styles/_harness/extract-refero.mjs:314-315] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:735-743]
- A permanent committed retrieval-manifest cache: viable as a migration bridge, but it preserves the duplicated physical manifest and stale-derived-file surface the consolidation is intended to remove. [SOURCE: .opencode/skills/sk-design/styles/_engine/__tests__/check-stable.test.mjs:54-79]
- Reusing current exact-byte `crawlManifestHash` as target semantic identity: current bytes reflect formatting and non-semantic row history; stable canonical JSON and length-framed hashes already exist in the DB subsystem. [SOURCE: .opencode/skills/sk-design/styles/_db/canonical.mjs:25-69] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:584-592]
- Treating the DB generation-pointer manifest as duplicate corpus truth: it points to immutable published DB artifacts and has independent rollback/legacy-reader responsibilities. [SOURCE: .opencode/skills/sk-design/styles/_db/generation-manifest.mjs:5-10] [SOURCE: .opencode/skills/sk-design/styles/_db/generation-manifest.mjs:121-153]

## Dead Ends

- No productive architecture path was exhausted. The two weaker designs remain valid transitional/defensive patterns, but repository write and stale-guard behavior makes them inferior as the final ownership model. [INFERENCE: the comparison eliminated target designs by concrete concurrency and duplication costs rather than by assuming they are impossible]

## Sources Consulted

- `.opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/002-naming-manifests/research/lineages/sol-high-fast/deep-research-config.json:1-67`
- `.opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/002-naming-manifests/research/lineages/sol-high-fast/deep-research-strategy.md:15-170`
- `.opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/002-naming-manifests/research/lineages/sol-high-fast/iterations/iteration-001.md:1-123`
- `.opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/002-naming-manifests/research/lineages/sol-high-fast/iterations/iteration-002.md:1-83`
- `.opencode/skills/sk-design/styles/_harness/extract-refero.mjs:310-435`
- `.opencode/skills/sk-design/styles/_engine/manifest.mjs:141-176,434-637,685-782`
- `.opencode/skills/sk-design/styles/_engine/__tests__/check-stable.test.mjs:14-79`
- `.opencode/skills/sk-design/styles/_engine/__tests__/invalidation.test.mjs:92-138`
- `.opencode/skills/sk-design/styles/_db/canonical.mjs:1-70`
- `.opencode/skills/sk-design/styles/_db/indexer.mjs:187-206,623-853`
- `.opencode/skills/sk-design/styles/_db/generation-manifest.mjs:1-185`
- `.opencode/skills/sk-design/styles/_db/__tests__/indexer.test.mjs:141-259`

## Assessment

- New information ratio: **1.00** (6 fully new architecture findings and 1 partial expansion of prior split-ownership evidence yield 0.93; +0.10 simplicity bonus for resolving the canonical-design question, capped at 1.00).
- Questions addressed: canonical ownership; exact target schema; semantic versus byte hashes; provenance; deterministic regeneration; stale detection; multi-writer feasibility; engine/database compatibility.
- Questions answered: canonical/derived/hash/provenance/regeneration design (3 of 5 lineage key questions now answered).
- Status: **complete** for iteration 3; synthesis remains prohibited and `stopPolicy=max-iterations` requires iterations 4 and 5.
- Edge cases: no contradictory evidence or missing dependency; the phrase “single source of truth” is interpreted as one corpus manifest plus artifact-owned content, not deletion of DB publication pointers or duplication of artifact content into JSON.

## Reflection

- What worked and why: comparing ownership and publication mechanics rather than document richness exposed the minimum stable architecture—one manifest writer, shared pure projections, and purpose-specific generation identities.
- What did not work and why: none of the three designs failed to be technically viable; the distinction required evaluating concurrency, stale-state, and compatibility costs rather than binary feasibility.
- What I would do differently: in the cutover pass, start from externally observable gates and hidden consumers, then derive migration steps backward so compatibility bridges exist only where a test proves they are needed.

## Recommended Next Focus

Broaden iteration 4 to executable cutover validation and rollback: discover hidden and runtime-computed consumers beyond the direct-reference list; enumerate exact baseline and post-change commands; prove v1-to-v2 normalization, semantic-hash stability under formatting/order changes, projection parity, DB generation compatibility, stale-cache rejection, and removal of the bridge retrieval file; define rollback checkpoints separately for the naming-only move and later manifest consolidation.
