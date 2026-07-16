---
iteration: 031
rq: RQ-N2
phase_target: 003-incremental-index-foundation
newInfoRatio: 0.72
verdict: ADAPT
---

# Iteration 031 — RQ-N2: Memoization and Fingerprint Primitive Audit

## Research Question

What memoization and fingerprint primitives are (A) already present in the current memory indexer/MCP code and (B) still missing per the spec for phase `003-incremental-index-foundation`? Produce a revised scope table.

---

## Evidence Gathered

### 1. Entry Points

The scan entry point is `handlers/memory-index.ts`. At line 446 it calls:

```
incrementalIndex.categorizeFilesForIndexing(files)
```

This is imported from `lib/storage/incremental-index.ts` (line 25 of `memory-index.ts`). All incremental skip/reindex decisions flow through `categorizeFilesForIndexing()` (incremental-index.ts:233) which invokes `shouldReindex()` (incremental-index.ts:155).

### 2. What Already Exists

#### A. Content Hash (SHA-256) — file-level

`lib/storage/incremental-index.ts:7` imports `createHash` from `node:crypto`.

`lib/storage/incremental-index.ts:139–142` implements `computeFileContentHash()`:
```ts
function computeFileContentHash(filePath: string): string | null {
  const content = fs.readFileSync(filePath);
  return createHash('sha256').update(content).digest('hex');
}
```

The `StoredMetadata` interface at line 37 includes `content_hash: string | null`. The schema column `content_hash TEXT` on `memory_index` is confirmed at `lib/search/vector-index-schema.ts:2410` (full schema DDL) and its migration path at `vector-index-schema.ts:1802–1810`. An index `idx_save_parent_content_hash_scope` is defined at `vector-index-schema.ts:60`.

Decision logic at `incremental-index.ts:179–183` compares stored vs. current content hash as a secondary guard after the mtime fast path:
```ts
if (stored.content_hash) {
  const currentContentHash = computeFileContentHash(filePath);
  if (currentContentHash && currentContentHash !== stored.content_hash) {
    return 'modified';
  }
}
```

**Assessment:** File-level SHA-256 content-addressing is **present** and exercised in production.

#### B. Canonical Path Normalization

`lib/storage/incremental-index.ts:14` imports `getCanonicalPathKey` from `lib/utils/canonical-path.js`. The `canonical_file_path` column is added by migration at `vector-index-schema.ts:1970–1976` and backfilled at lines 1996–2024. A separate `hasCanonicalPathColumn()` guard (incremental-index.ts:71–86) ensures backward compatibility.

**Assessment:** Canonical-path keying is **present**. This is not the same as a "canonical input fingerprint" for structured document content, but it is the path-normalization layer the spec references.

#### C. Mtime Fast-Path Skipping

`incremental-index.ts:173`: `Math.abs(fileInfo.mtime - stored.file_mtime_ms) < MTIME_FAST_PATH_MS` provides a 1-second fast-path. This is a coarse gate, not content-based memoization. `file_mtime_ms` schema column confirmed at `vector-index-schema.ts:2403` and migration at `vector-index-schema.ts:563–577`.

**Assessment:** Present, but explicitly identified in the spec (003-spec.md:102–104) as the coarse mechanism that the new phase must supersede.

#### D. Parent/Chunk Row Shape

`vector-index-schema.ts:2413–2415` shows:
```sql
parent_id INTEGER REFERENCES memory_index(id) ON DELETE CASCADE,
chunk_index INTEGER,
chunk_label TEXT,
```

Also `anchor_id TEXT` at line 2364, with a UNIQUE constraint `(spec_folder, file_path, anchor_id)` at line 2419. Migration v16 added `parent_id` (line 866), `chunk_index` (line 875), `chunk_label` (line 884), and the composite index `idx_parent_chunk ON memory_index(parent_id, chunk_index)` at line 894.

`memory-parser.ts` validates `<!-- ANCHOR:id -->` / `<!-- /ANCHOR:id -->` tags (lines 1014–1052) and the `anchor_id` value is stored per-row.

**Assessment:** The parent-child chunk row shape is **present**. The ANCHOR tag parsing/validation infrastructure is **present**. However, `chunk_fingerprint`, `chunk_kind`, `chunk_start_line`, and `chunk_end_line` — the four new columns specified in 003-spec.md:120 — are **absent** from the schema DDL and all migration paths (confirmed by grep returning no results for `chunk_fingerprint`, `chunk_kind`, `chunk_start_line`, `chunk_end_line` across all TS files).

#### E. Anchor-First Chunk Identity in memory-parser.ts

`memory-parser.ts` extracts and validates anchors and stores `anchor_id` per row. However, the file does not emit `chunk_start_line`, `chunk_end_line`, or `chunk_fingerprint` per section. There is no `chunkFingerprint`, `chunkRecord`, or line-span tracking (confirmed by grep with no results at memory-parser.ts for these tokens). The parser validates anchor structure for correctness, but does not produce per-chunk fingerprint records for downstream invalidation.

**Assessment:** Anchor identity is **partially present** (anchor_id column + parser validation). Stable chunk fingerprints over anchor-bounded content are **missing**.

### 3. What Is Missing

Confirmed absent by exhaustive grep across all `.ts` files in `mcp_server/`:

- `memoization_records` table — **absent**
- `dependency_edges` table — **absent**
- `lib/storage/memo.ts` — **absent** (not in `lib/storage/` directory listing)
- `lib/storage/canonical-fingerprint.ts` — **absent** (not in `lib/storage/` directory listing)
- `chunk_fingerprint` column on `memory_index` — **absent**
- `chunk_kind` column on `memory_index` — **absent**
- `chunk_start_line` column on `memory_index` — **absent**
- `chunk_end_line` column on `memory_index` — **absent**
- DAG traversal in `incremental-index.ts` — **absent** (categorizeFilesForIndexing performs no dependency-edge walks; confirmed at lines 233–278)
- Scan planner in `memory-index.ts` consulting memo state — **absent** (handler calls `categorizeFilesForIndexing` directly with no memo lookup; confirmed at line 446)

---

## Revised Scope Table

| Primitive | Status | File:Line | LOC Estimate |
|-----------|--------|-----------|--------------|
| File-level SHA-256 content hash (`content_hash`) | EXISTS | `lib/storage/incremental-index.ts:139–142`, `lib/search/vector-index-schema.ts:2410` | 0 (exists) |
| Mtime fast-path skip (`file_mtime_ms`) | EXISTS | `lib/storage/incremental-index.ts:173`, `vector-index-schema.ts:2403` | 0 (exists) |
| Canonical path key (`canonical_file_path`) | EXISTS | `lib/storage/incremental-index.ts:14`, `vector-index-schema.ts:1964–1982` | 0 (exists) |
| Parent-child row shape (`parent_id`, `chunk_index`, `chunk_label`) | EXISTS | `vector-index-schema.ts:2413–2415`, migration v16:866–894 | 0 (exists) |
| Anchor ID storage and parser validation (`anchor_id`) | EXISTS (partial) | `vector-index-schema.ts:2364`, `lib/parsing/memory-parser.ts:1014–1052` | 0 (exists); ~80 LOC for fingerprint extension |
| `memoization_records` table schema + migration | MISSING | — | ~60–90 LOC |
| `dependency_edges` table schema + migration | MISSING | — | ~40–60 LOC |
| `lib/storage/canonical-fingerprint.ts` (deterministic normalized-input hash) | MISSING | — | ~120–180 LOC |
| `lib/storage/memo.ts` (CRUD over memo records and dependency edges) | MISSING | — | ~150–240 LOC |
| `chunk_fingerprint` column + migration | MISSING | — | ~30–50 LOC |
| `chunk_kind` column + migration | MISSING | — | ~20–30 LOC |
| `chunk_start_line` / `chunk_end_line` columns + migration | MISSING | — | ~30–50 LOC |
| `memory-parser.ts` anchor-first chunk fingerprint emission | MISSING | — | ~80–140 LOC |
| `incremental-index.ts` DAG traversal + dependent invalidation | MISSING | — | ~140–220 LOC |
| `handlers/memory-index.ts` scan planner consulting memo state | MISSING | — | ~80–140 LOC |

**Total new LOC estimate:** ~750–1,200 production lines across 5 files (3 create, 2 modify) plus schema DDL additions.

---

## ADAPT Rationale

The pt-04 audit verdict REVISE_SCOPE is well-founded. The spec assumes a blank slate for memoization, but the codebase already has:
1. SHA-256 content hashing at the file level — the canonical-fingerprint module can build on this algorithm rather than re-introducing it.
2. A parent-child chunk row shape and anchor_id column — the new `chunk_fingerprint`/`chunk_kind`/`chunk_start_line`/`chunk_end_line` columns are **additive extensions** to an existing shape, not a new table.
3. Anchor parser validation already in `memory-parser.ts` — the fingerprint-emission work is an extension to existing anchor extraction, estimated at ~80 LOC, not a rewrite.

The scope should ADAPT to:
- Reuse the existing `createHash('sha256')` import and `computeFileContentHash` pattern for canonical-fingerprint.ts rather than duplicating hash infrastructure.
- Treat the new chunk columns as an additive migration on `memory_index` (consistent with the existing v6 and v16 migration patterns) rather than a new table.
- Keep `memoization_records` and `dependency_edges` as new tables (they have no structural analog in the current schema).
- The LOC estimate of 750–1,200 production lines is realistic for Phase 003 scope at Level 3 documentation.

---

## Key Finding

File-level SHA-256 hashing and the parent/chunk row shape exist, but `memoization_records`, `dependency_edges`, `canonical-fingerprint.ts`, `memo.ts`, and all four new chunk-metadata columns (`chunk_fingerprint`, `chunk_kind`, `chunk_start_line`, `chunk_end_line`) are entirely absent — the spec-003 scope is accurate for those missing primitives and should ADAPT to reuse existing hash infrastructure where it overlaps.
