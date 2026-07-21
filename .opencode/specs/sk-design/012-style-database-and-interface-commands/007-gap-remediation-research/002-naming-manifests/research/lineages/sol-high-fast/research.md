---
title: "Kebab-Case Styles Backend and Manifest Consolidation Research"
description: "Five-iteration synthesis of the exact rename map, safe reference cutover, and single-source manifest design."
status: complete
---

# Kebab-Case Styles Backend and Manifest Consolidation

## 1. Executive Summary

The five legacy filesystem names are not exempt from the repository's kebab-case canon. The exact name-only migration is:

| Current path | Name-only target | Final role |
|---|---|---|
| `styles/_db/` | `styles/database/` | Database implementation |
| `styles/_engine/` | `styles/engine/` | Shared projection and retrieval engine |
| `styles/_harness/` | `styles/harness/` | Refero extraction and canonical-manifest writer |
| `styles/_manifest.json` | `styles/manifest.json` | Sole canonical corpus manifest |
| `styles/_retrieval-manifest.json` | `styles/retrieval-manifest.json` | Temporary name-only bridge, then removed |

The naming move and manifest consolidation must be separate checkpoints. Checkpoint A performs only the five moves and coordinated reference updates, with byte-for-byte manifest and observable runtime parity. Checkpoint B introduces a versioned `manifest.json` schema, shared pure projection, semantic source hashing, compatibility bridges, and eventual removal of `retrieval-manifest.json`. [SOURCE: .opencode/skills/sk-doc/shared/references/filesystem-naming-convention.md:18-64] [SOURCE: .opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/gap-analysis.md:44-70]

The final source-of-truth model is not a literal union of both existing JSON documents:

- `manifest.json` is the harness-owned authority for corpus membership, source identity, and acquisition lifecycle.
- Per-style artifact files remain authoritative for enriched design content.
- A shared deterministic projector derives retrieval records for the flat-file engine and database indexer.
- The DB generation manifest remains a distinct publication pointer to immutable DB artifacts, not another corpus manifest. [SOURCE: .opencode/skills/sk-design/styles/_harness/extract-refero.mjs:392-435] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:434-637] [SOURCE: .opencode/skills/sk-design/styles/_db/generation-manifest.mjs:121-185]

## 2. Scope and Method

Research covered the naming canon, both committed 1,290-style manifests, their writers/readers, engine and DB hashes, direct and computed references, test-command ownership, active planning consumers, stale-cache behavior, and rollback mechanics. It did not rename files, change schemas, run mutating tests, or decide whether SQLite becomes the default mode.

Five forced-depth iterations were used:

1. Naming authority, rename map, and reference inventory.
2. Manifest schemas, ownership, writers/readers, hashes, and ordering.
3. Target single-source architecture and alternatives.
4. Executable cutover, validation, and rollback design.
5. Adversarial correction of counts, active consumers, invariants, and rollback assumptions.

## 3. Naming Authority

The canon requires kebab-case for in-scope directories, filenames, and scripts. Python package/source requirements, tool-mandated names, generated output, vendored trees, runner magic, and frozen history are the relevant exemptions. The three JavaScript backend directories and two authored JSON files match none of them. [SOURCE: .opencode/skills/sk-doc/shared/references/filesystem-naming-convention.md:18-64]

The leading underscores are not an organizational exception. `database`, `engine`, and `harness` are the semantic names already identified by the parent gap analysis; `manifest.json` and `retrieval-manifest.json` are the direct kebab-compliant filename forms. [SOURCE: .opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/gap-analysis.md:44-58]

## 4. Exact Rename Map

Checkpoint A applies these moves atomically with their mutable reference closure:

```text
.opencode/skills/sk-design/styles/_db/
  -> .opencode/skills/sk-design/styles/database/

.opencode/skills/sk-design/styles/_engine/
  -> .opencode/skills/sk-design/styles/engine/

.opencode/skills/sk-design/styles/_harness/
  -> .opencode/skills/sk-design/styles/harness/

.opencode/skills/sk-design/styles/_manifest.json
  -> .opencode/skills/sk-design/styles/manifest.json

.opencode/skills/sk-design/styles/_retrieval-manifest.json
  -> .opencode/skills/sk-design/styles/retrieval-manifest.json
```

`retrieval-manifest.json` is renamed during Checkpoint A to preserve a behavior-neutral diagnostic boundary. It is deleted only at the end of Checkpoint B, after all consumers use the shared projector and clean rebuilds prove no bridge is recreated. [INFERENCE: separating path and schema changes makes regressions attributable and rollback bounded]

## 5. Current Manifest Schemas

### Crawl manifest

`_manifest.json` is an unversioned top-level array. Each observed row contains `uuid`, `url`, `lastmod`, `slug`, `status`, `capturedAt`, and `error`. The harness owns lifecycle transitions including pending, captured, stale, and error. It preserves historical/source ordering rather than canonical ID or slug order. [SOURCE: .opencode/skills/sk-design/styles/_manifest.json:1-10] [SOURCE: .opencode/skills/sk-design/styles/_harness/extract-refero.mjs:103-115] [SOURCE: .opencode/skills/sk-design/styles/_harness/extract-refero.mjs:392-435]

### Retrieval manifest

`_retrieval-manifest.json` is a closed, versioned derived document with exactly `schemaVersion`, `generationHash`, `crawlManifestHash`, `recordCount`, and `styles`. Style rows contain 16 validated retrieval fields plus nested token-axis, section, provenance, and artifact structures. It is deterministically ordered and serialized. [SOURCE: .opencode/skills/sk-design/styles/_retrieval-manifest.json:1-6] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:29-73] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:185-315]

The two files have identical committed membership: 1,290 unique slugs. They are not schema-equivalent because they represent different lifecycle layers. [SOURCE: .opencode/skills/sk-design/styles/_retrieval-manifest.json:1-6] [INFERENCE: full-corpus checks in iteration 2 confirmed 1,290 unique, equal slug sets]

## 6. Current Ownership and Hashing

Current authority is split:

- The harness writes crawl membership and acquisition status.
- Style artifact files provide title, thesis, theme, token axes, capabilities, facets, sections, provenance, artifact metadata, hydration size, and content identity.
- The retrieval manifest is a deterministic materialized projection over crawl state plus artifacts.
- The DB indexer reads crawl state plus artifacts directly; it does not consume the retrieval JSON. [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:434-621] [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:623-753]

Current hashes have distinct roles:

- `crawlManifestHash` hashes exact crawl-file bytes, so formatting and row-order changes invalidate generations.
- Per-style `contentHash` hashes ordered artifact paths and raw bytes.
- Retrieval `generationHash` binds schema version, crawl byte hash, and sorted ID/content-hash pairs.
- DB generation identity independently binds DB schema/version, crawl identity, active content aggregates, and inactive lifecycle state. [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:141-176] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:552-637] [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:187-206]

## 7. Canonical Source-of-Truth Design

Use one physical corpus manifest with one writer:

1. `styles/manifest.json` is the only corpus manifest.
2. `styles/harness/extract-refero.mjs` is its only writer.
3. Style artifacts remain canonical enriched content rather than being duplicated into the manifest.
4. A shared pure projector normalizes manifest entries, joins artifacts by stable ID, and creates deterministic retrieval rows.
5. The flat-file engine and DB indexer consume this projector.
6. No consumer writes derived data back to `manifest.json`.
7. `retrieval-manifest.json` is retained only as a migration bridge, then removed.

This design satisfies "single source of truth" without conflating corpus truth with DB publication pointers or copying artifact-derived content into acquisition state. [SOURCE: .opencode/skills/sk-design/styles/_harness/extract-refero.mjs:392-435] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:434-513] [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:649-753]

## 8. Target Manifest Schema

Recommended normalized envelope:

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

Required invariants:

- Exact top-level, entry, source, and acquisition keys.
- Unique IDs and unique non-null slugs.
- Canonical serialization in raw code-unit ID order.
- `captured` requires non-null slug and `capturedAt`, with null error.
- New `pending` rows have null capture fields.
- `stale` preserves captured identity.
- `error` requires an error and preserves any prior slug/capture state.
- Artifact UUID must equal entry ID.
- ID is the primary join key; slug is a location that may change.
- Slug changes require atomic directory rename or explicit orphan rejection.
- Parse/read failure is fatal; it must never become an empty manifest.
- Writes validate first, publish atomically, and include directory durability. [SOURCE: .opencode/skills/sk-design/styles/_harness/extract-refero.mjs:251-272] [SOURCE: .opencode/skills/sk-design/styles/_harness/extract-refero.mjs:314-315] [SOURCE: .opencode/skills/sk-design/styles/_harness/extract-refero.mjs:392-435]

## 9. Hash, Provenance, and Regeneration Contract

Use semantic source identity:

```text
sourceSemanticHash = sha256(
  lengthFrame("style-corpus-manifest-v2") +
  lengthFrame(stableJson(normalizedEnvelope))
)
```

`stableJson` validates and normalizes the schema, sorts object keys, and orders entries by ID. Keep `sourceByteHash` only as audit/debug metadata. Formatting or entry permutation must not change semantic identity; meaningful source or lifecycle changes must. The repository already has locale-free sorting and length-framed canonical hashing primitives. [SOURCE: .opencode/skills/sk-design/styles/_db/canonical.mjs:21-69]

Retain per-style artifact content hashes. Define engine generation identity from projection schema version, `sourceSemanticHash`, and sorted ID/content-hash pairs. Define DB generation identity separately with a version bump because its source-hash input changes. Do not require old and new generation hashes to match; require deterministic reproduction and semantic output parity. [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:552-637] [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:187-206]

Projector reuse must refresh acquisition-derived provenance. Either rebuild provenance whenever acquisition state changes or include a per-entry acquisition hash in reuse identity. Provenance must distinguish artifact-known data from manifest fallback data. [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:448-513] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:584-621]

## 10. Import and Reference Update Plan

Do not freeze the research-time count as an acceptance fixture. Iteration 1 found 140 matches in 46 files; iteration 5 found 144 in 47 files. Regenerate a machine-readable inventory immediately before implementation. Success means zero mutable legacy matches after classified historical exceptions. [INFERENCE: iteration 5 bounded inventory corrected the earlier count]

Update in this order during Checkpoint A:

1. Static cross-directory imports and backend module paths.
2. Manifest constants and direct filename readers/writers.
3. Computed paths using `import.meta.url`, `path.resolve`, `path.join`, or `new URL`.
4. Tests and fixture helpers.
5. Generator source inputs, then regenerate build output.
6. Current scripts, operator commands, and manual-testing instructions.
7. Current README, SKILL, feature-catalog, and backend documentation.
8. Active planning/continuity consumers, including packets 013 and 015 and derived graph metadata.
9. Preserve changelogs and completed packet narratives as frozen historical evidence.

Key runtime classes include the four mode-corpus imports, engine manifest/style-library constants, persistent adapter DB imports, harness writer, DB indexer, DB oracle fixtures, generator study preparation, engine/DB tests, and mode-corpus fixtures. [SOURCE: .opencode/skills/sk-design/design-motion/corpus/motion-evidence.mjs:24] [SOURCE: .opencode/skills/sk-design/design-foundations/corpus/relationship-blueprint.mjs:28] [SOURCE: .opencode/skills/sk-design/design-interface/corpus/relational-exemplar.mjs:28] [SOURCE: .opencode/skills/sk-design/design-audit/corpus/comparison-lane.mjs:28] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/study-prepare.ts:54-66]

The environment variable `SK_DESIGN_STYLE_DB_MODE` changes adapter behavior, not module-path selection; its imports still move in Checkpoint A. [SOURCE: .opencode/skills/sk-design/styles/_engine/persistent-adapter.mjs:9-13] [SOURCE: .opencode/skills/sk-design/styles/_engine/persistent-adapter.mjs:97-110]

## 11. Two-Checkpoint Migration and Verification

### Checkpoint A: name-only parity

Before changes:

- Save the classified legacy-token inventory.
- Record hashes/counts for both current manifests.
- Record representative query, hydration, and DB status/current-generation outputs.
- Run and retain command transcripts for every gate.

Apply all five moves and the reference closure in one change. Do not change schema, serialization, hash algorithms, or behavior.

Repository-confirmed gates:

```text
# In .opencode/skills/sk-design/design-md-generator/backend/
npm run typecheck
npm run build
npm test

# From repository root
node --test .opencode/skills/sk-design/design-motion/corpus/__tests__/*.test.mjs
node --test .opencode/skills/sk-design/design-foundations/corpus/__tests__/*.test.mjs
node --test .opencode/skills/sk-design/design-interface/corpus/__tests__/*.test.mjs
node --test .opencode/skills/sk-design/design-audit/corpus/__tests__/*.test.mjs
```

The fully rooted engine/DB glob commands must be baseline-proven before being treated as gates. The DB playbook's documented command conflicts with its stated repository-root working directory. [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/package.json:13-20] [SOURCE: .opencode/skills/sk-design/styles/manual-testing-playbook.md:13-39]

Require identical old/new manifest bytes, equivalent query/hydration/DB outputs, successful command transcripts, regenerated output consistency, and no mutable legacy token. Rollback A reverses the five moves and reference patch together.

### Checkpoint B: consolidation

Use five ordered gates:

1. Add a fail-closed pure normalizer accepting current v1 and target v2; prove normalized equality across 1,290 entries.
2. Add the shared projector behind existing engine and DB surfaces while retaining the retrieval bridge.
3. Prove retrieval record parity, ordering, active/inactive DB membership, aggregate identities, and representative query parity.
4. Switch the harness to atomic validated v2 writes and move engine/DB source identity to semantic hashes with versioned generation changes.
5. Delete the bridge only after every reader uses the projector, stale/missing bridge tests pass, mutable references are clean, and a clean rebuild does not recreate it.

Stale/invalidation proof must include:

- Formatting and entry permutation preserve semantic source hash.
- Acquisition/source changes alter semantic source hash.
- Artifact changes preserve source hash but alter content and purpose-specific generation identities.
- Poisoned bridge payload is rejected even if stored hash fields are unchanged.
- Missing bridge and immediately previous-generation bridge behavior are tested before deletion.

Rollback B must pin an exact v1 corpus snapshot or validated v2-to-v1 downgrade, bridge bytes or deterministic regeneration recipe, and pre-v2 DB generation artifacts. Current-plus-one DB retention is insufficient after multiple v2 builds. Restore/downgrade in reverse order before old readers start. [SOURCE: .opencode/skills/sk-design/styles/_db/generation-manifest.mjs:121-185] [SOURCE: .opencode/skills/sk-design/styles/_db/operator.mjs:123-185]

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Treat underscore paths as exempt | They are authored JS/JSON filesystem names outside every naming exemption. | `filesystem-naming-convention.md:18-64` | 1 |
| Make the richer retrieval JSON canonical | It currently derives from crawl bytes and artifacts; the DB does not consume it. | `_engine/manifest.mjs:434-637`, `_db/indexer.mjs:623-753` | 1-2 |
| Literal union of both schemas | It preserves split writers and duplicates artifact-owned content instead of resolving authority. | `_harness/extract-refero.mjs:392-435`, `_engine/manifest.mjs:434-513` | 2 |
| Permanent multi-writer manifest | Whole-file writers create race, lost-update, and torn-generation hazards without new lock/CAS machinery. | `_harness/extract-refero.mjs:314-315`, `_engine/manifest.mjs:735-743` | 3 |
| Permanent committed retrieval cache | Valid as a bridge, but retains duplicate membership and permanent stale-cache policy. | `_engine/__tests__/check-stable.test.mjs:54-79` | 3 |
| Exact-byte crawl hash as semantic identity | Formatting and historical order create false invalidation; canonical hashing primitives exist. | `_db/canonical.mjs:21-69`, `_engine/manifest.mjs:584-592` | 3 |
| Delete bridge when v2 writer lands | Readers must first move behind the projector and pass parity/stale gates. | `_engine/manifest.mjs:685-782`, `_db/indexer.mjs:623-753` | 4 |
| Require old/new generation hash equality | Versioned hash inputs intentionally change; deterministic reproduction and semantic parity are the valid proof. | `_db/indexer.mjs:194-206`, `_engine/manifest.mjs:623-635` | 4 |
| Treat 46 files / 140 matches as fixed acceptance | The live closure already changed to 47 files / 144 matches. | Iteration 5 bounded inventory | 5 |
| Treat every spec-folder hit as frozen | Active packets 013 and 015 contain mutable planning and continuity references. | `013.../spec.md`, `015.../spec.md` | 5 |

## Divergence Map

No divergent-mode pivots ran. Breadth came from five forced-depth focuses: naming/reference closure, schema/lifecycle reconstruction, architecture comparison, cutover proof, and adversarial correction. Saturated directions are the eliminated alternatives above. The remaining frontier is implementation proof rather than another architecture branch.

## 12. Open Questions

No original research question remains open. Implementation must still verify:

- Exit status of corrected fully rooted engine and DB test commands.
- Exact v2 transition table and downgrade serializer bytes.
- ID-to-slug directory migration and orphan handling.
- Acquisition-bound projector reuse and provenance-refresh tests.
- Whether installed or out-of-tree consumers require a time-bounded compatibility policy. Local repository search cannot prove their absence.

## 13. Risks and Failure Modes

- A v2 parser that maps corruption to an empty manifest can erase acquisition state.
- Direct whole-file writes can expose partial or torn JSON.
- Slug changes can leave duplicate directories for one ID.
- Content-only reuse can retain stale acquisition provenance.
- Active spec/continuity references can become broken resume instructions even when runtime imports pass.
- Old readers cannot consume v2 without a downgrade or retained v1 snapshot.
- DB retention may prune the pre-v2 rollback generation after subsequent v2 builds.
- A fixed match-count gate will age; classify current matches instead.

## 14. Implementation Prerequisites

Before coding:

1. Freeze a fresh machine-readable mutable/frozen reference inventory.
2. Prove exact baseline engine and DB commands and store transcripts.
3. Specify v2 JSON schema, lifecycle transition matrix, canonical serializer, and downgrade serializer.
4. Specify shared projector API and ID-first join behavior.
5. Define parity fixtures for all 1,290 entries and representative retrieval/DB results.
6. Pin pre-v2 corpus, retrieval bridge, and DB generation rollback artifacts.
7. Plan Checkpoint A and Checkpoint B as separate reviewable changes.

## 15. Source Index

Primary authorities:

- `.opencode/skills/sk-doc/shared/references/filesystem-naming-convention.md`
- `.opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/gap-analysis.md`
- `.opencode/skills/sk-design/styles/_manifest.json`
- `.opencode/skills/sk-design/styles/_retrieval-manifest.json`
- `.opencode/skills/sk-design/styles/_harness/extract-refero.mjs`
- `.opencode/skills/sk-design/styles/_engine/manifest.mjs`
- `.opencode/skills/sk-design/styles/_engine/style-library.mjs`
- `.opencode/skills/sk-design/styles/_engine/persistent-adapter.mjs`
- `.opencode/skills/sk-design/styles/_db/canonical.mjs`
- `.opencode/skills/sk-design/styles/_db/indexer.mjs`
- `.opencode/skills/sk-design/styles/_db/generation-manifest.mjs`
- `.opencode/skills/sk-design/styles/_db/operator.mjs`
- `.opencode/skills/sk-design/styles/manual-testing-playbook.md`
- `.opencode/specs/sk-design/013-styles-database-rust-opportunities/spec.md`
- `.opencode/specs/sk-design/015-styles-database-evolution/spec.md`

The generated lineage resource map is `resource-map.md`.

## 16. Convergence Report

- Stop reason: `maxIterationsReached`
- Stop policy: `max-iterations`
- Iterations completed: 5 / 5
- Questions answered: 5 / 5
- Open questions: 0 original research questions
- `newInfoRatio` trend: `1.00 -> 0.94 -> 1.00 -> 0.86 -> 0.89`
- Average `newInfoRatio`: `0.938`
- Stuck iterations: 0
- Final reducer convergence score: 0.89
- Graph convergence: unavailable; no graph events were persisted
- Quality: cited findings, schema/ownership triangulation, full-corpus checks, and adversarial correction were completed

Early convergence was telemetry only. The forced fifth pass materially corrected reference counts, active-consumer classification, command certainty, v2 invariants, projector reuse, and rollback symmetry.

## 17. Conclusion

Implement a strict two-checkpoint migration. First, perform the exact five-path kebab rename with a regenerated dependency closure and behavior-neutral parity. Second, make `manifest.json` v2 the sole harness-owned corpus manifest, retain artifacts as canonical enriched content, route engine and DB through a shared deterministic projector, replace byte-sensitive source identity with semantic canonical hashing, and remove `retrieval-manifest.json` only after compatibility, stale-cache, clean-rebuild, and rollback gates pass.

This design removes the naming violations and duplicate manifest authority without conflating corpus state, artifact content, retrieval projection, or DB publication state.
