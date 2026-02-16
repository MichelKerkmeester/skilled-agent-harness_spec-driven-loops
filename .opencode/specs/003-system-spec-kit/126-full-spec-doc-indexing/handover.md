<!-- SPECKIT_LEVEL: 3+ -->
# Handover: Spec 126 — Verification Follow-up

<!-- SPECKIT_TEMPLATE_SOURCE: handover | v2.2 -->

## Status

**Implementation**: Complete (75/75 tasks, all code merged)
**Spec 126 Unit Tests**: 143/143 passing in `spec126-full-spec-doc-indexing.vitest.ts`
**Full Suite**: `npm test` passing (122 files, 4184 tests; 72 skipped)
**Remaining**: 3 optional hardening areas for additional direct coverage (filesystem/live DB focused)

---

## Gap 1: `detectSpecLevelFromParsed()` — Private Function

**File**: `mcp_server/handlers/memory-save.ts:547-581`
**Why untested**: Private function (not exported), requires filesystem access

### What It Does

Reads sibling `spec.md` in the same directory to detect the spec documentation level:
1. Opens `spec.md`, reads first 2KB for `<!-- SPECKIT_LEVEL: N -->` marker
2. Maps `3+` → 4, otherwise parses integer 1-3
3. Heuristic fallback: checks sibling filenames (`decision-record.md` → 3, `checklist.md` → 2, else → 1)
4. Returns `null` on any error or missing file

### Called From

`indexMemoryFile()` at line 741-742 — only invoked when `parsed.documentType` is a spec document type (not `memory`, `readme`, or `constitutional`).

### How to Test

**Option A — Export it** (recommended):
```typescript
// Add to export block at line 1258:
export { ..., detectSpecLevelFromParsed };
```
Then test directly with temp directories containing spec.md files with/without markers.

**Option B — Test indirectly** through `indexMemoryFile()`:
- Requires full DB setup (vectorIndex.init, SQLite)
- Create a temp spec folder with spec.md containing `<!-- SPECKIT_LEVEL: 2 -->`
- Call `indexMemoryFile()` on a sibling `plan.md`
- Verify the DB row has `spec_level = 2`

### Test Cases Needed

| # | Input | Expected |
|---|-------|----------|
| 1 | spec.md with `<!-- SPECKIT_LEVEL: 1 -->` | `1` |
| 2 | spec.md with `<!-- SPECKIT_LEVEL: 2 -->` | `2` |
| 3 | spec.md with `<!-- SPECKIT_LEVEL: 3 -->` | `3` |
| 4 | spec.md with `<!-- SPECKIT_LEVEL: 3+ -->` | `4` |
| 5 | spec.md without marker, sibling `decision-record.md` | `3` |
| 6 | spec.md without marker, sibling `checklist.md` | `2` |
| 7 | spec.md without marker, no siblings | `1` |
| 8 | No spec.md in directory | `null` |
| 9 | Unreadable spec.md (permission denied) | `null` |

---

## Gap 2: Schema v13 Migration

**File**: `mcp_server/lib/search/vector-index-impl.ts:735-782`
**Why untested**: `schema-migration.vitest.ts` contains only stubs (`expect(true).toBe(true)`)

### What It Does

Migration from schema v12 → v13:
1. `ALTER TABLE memory_index ADD COLUMN document_type TEXT DEFAULT 'memory'`
2. `ALTER TABLE memory_index ADD COLUMN spec_level INTEGER`
3. `CREATE INDEX IF NOT EXISTS idx_document_type ON memory_index(document_type)`
4. `CREATE INDEX IF NOT EXISTS idx_doc_type_folder ON memory_index(document_type, spec_folder)`
5. Backfill: rows with `importance_tier = 'constitutional'` → `document_type = 'constitutional'`
6. Backfill: rows with `file_path LIKE '%readme.md'` → `document_type = 'readme'`

Each step wrapped in try/catch, gracefully handles `duplicate column` errors for idempotency.

### Fresh DB DDL

`create_schema()` at lines 1211-1212 includes both columns in the table definition:
```sql
document_type TEXT DEFAULT 'memory',
spec_level INTEGER,
```

Index definitions at lines 1346-1347.

### Existing Test File

`mcp_server/tests/schema-migration.vitest.ts` — **ALL STUBS** (lines 7-290). Contains describe blocks for T701-T750 but every `it()` block just does `expect(true).toBe(true)`. This affects all migrations, not just v13.

### How to Test

Requires `better-sqlite3` with an in-memory or temp file database:

```typescript
import Database from 'better-sqlite3';

// 1. Create a v12 schema DB (pre-migration)
// 2. Insert sample rows (constitutional, readme, memory)
// 3. Run migration 13
// 4. Verify columns exist, indexes exist, backfill correct
```

### Test Cases Needed

| # | Scenario | Verify |
|---|----------|--------|
| 1 | Fresh v13 DB | `document_type` and `spec_level` columns exist in DDL |
| 2 | v12 → v13 migration | Both columns added |
| 3 | Migration idempotency | Running migration twice doesn't error |
| 4 | Backfill: constitutional | Rows with `importance_tier='constitutional'` get `document_type='constitutional'` |
| 5 | Backfill: readme | Rows with `file_path LIKE '%readme.md'` get `document_type='readme'` |
| 6 | Backfill: memory unchanged | Other rows keep `document_type='memory'` |
| 7 | Index creation | `idx_document_type` and `idx_doc_type_folder` exist |
| 8 | SCHEMA_VERSION = 13 | Constant is correct |
| 9 | `spec_level` is nullable | INSERT with `spec_level = NULL` succeeds |
| 10 | Default value | INSERT without `document_type` defaults to `'memory'` |

---

## Gap 3: Phase 3 Discovery — `findSpecDocuments()` and `detectSpecLevel()`

**File**: `mcp_server/handlers/memory-index.ts:57-149`
**Why untested**: Requires filesystem (directory walking, file reads)

### findSpecDocuments() (lines 57-107)

Walks `.opencode/specs/` and `specs/` directories to find spec folder documents.

**Signature**: `findSpecDocuments(workspacePath: string, options?: { specFolder?: string | null }): string[]`

**Key behaviors**:
- Checks both `.opencode/specs/` and `specs/` roots
- Matches filenames against `SPEC_DOCUMENT_FILENAMES` set (8 files)
- Excludes: `z_archive/`, `scratch/`, `memory/`, `node_modules/`, hidden dirs (`.xxx`)
- Supports `specFolder` filter (only returns files under matching path)
- Feature flag: returns `[]` when `SPECKIT_INDEX_SPEC_DOCS=false`
- Silently skips unreadable directories

### detectSpecLevel() (lines 114-149)

Same logic as `detectSpecLevelFromParsed()` but designed for standalone use.

**Signature**: `detectSpecLevel(specPath: string): number | null`

Both functions **are exported** (lines 617-625).

### Integration Point

In `handleMemoryIndexScan()` at lines 383-384:
```typescript
const specDocFiles = include_spec_docs ? findSpecDocuments(workspacePath, { specFolder }) : [];
const files = [...specFiles, ...constitutionalFiles, ...readmeFiles, ...projectReadmeFiles, ...specDocFiles];
```

Causal chain creation at lines 527-568 groups indexed spec docs by folder and creates chains.

### How to Test

Create temp directory structures with `fs.mkdtempSync()`:

```typescript
import fs from 'fs';
import path from 'path';
import os from 'os';

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'spec126-'));
// Create .opencode/specs/003/100-feature/ with spec.md, plan.md, etc.
// Call findSpecDocuments(tmpDir)
// Verify returned paths
```

### Test Cases Needed

**findSpecDocuments():**

| # | Scenario | Expected |
|---|----------|----------|
| 1 | Folder with all 8 spec docs | Returns 8 paths |
| 2 | Folder with only spec.md + plan.md | Returns 2 paths |
| 3 | Folder in z_archive/ | Excluded (0 results) |
| 4 | Folder in scratch/ | Excluded |
| 5 | Folder in memory/ | Excluded |
| 6 | Hidden directory (.draft/) | Excluded |
| 7 | Non-.md file named spec.txt | Excluded |
| 8 | `specFolder` filter matches | Only matching folder's files returned |
| 9 | `specFolder` filter doesn't match | Empty array |
| 10 | `SPECKIT_INDEX_SPEC_DOCS=false` | Empty array |
| 11 | Both `.opencode/specs/` and `specs/` exist | Returns from both |
| 12 | Neither specs directory exists | Empty array |

**detectSpecLevel():**

Same test cases as Gap 1 (tests 1-9), since logic is identical.

---

## Priority & Effort Estimate

| Gap | Priority | Effort | Blocker? |
|-----|----------|--------|----------|
| Gap 1: detectSpecLevelFromParsed | P2 | Low (export + 9 tests) | No — tested indirectly |
| Gap 2: Schema v13 migration | P1 | Medium (DB setup + 10 tests) | No — but schema-migration.vitest.ts is entirely stubbed |
| Gap 3: findSpecDocuments + detectSpecLevel | P1 | Medium (temp dirs + 12+9 tests) | No — functions are exported and working |

**Total new tests needed**: ~40

## Dependencies

- `better-sqlite3` (for Gap 2 — already a project dependency)
- `fs`, `os`, `path` (for Gaps 1 and 3 — Node.js built-ins)
- Temp directory cleanup in `afterAll()` hooks

## Cross-References

- **Spec**: `spec.md`
- **Tasks**: `tasks.md` (T061-T075, all marked complete with caveats noted)
- **Checklist**: `checklist.md` (all verification items marked complete)
- **Test suite**: `mcp_server/tests/spec126-full-spec-doc-indexing.vitest.ts` (143 tests)
- **Stub file**: `mcp_server/tests/schema-migration.vitest.ts` (needs full implementation beyond Spec 126)

<!--
HANDOVER: Spec 126 verification follow-up and optional hardening backlog
3 gaps: private function, schema migration, filesystem discovery
~40 additional tests needed
All implementation code and full-suite verification are complete
-->
