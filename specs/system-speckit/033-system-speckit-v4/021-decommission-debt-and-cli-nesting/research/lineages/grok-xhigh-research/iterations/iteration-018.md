# Iteration 18: Extraction README and transaction-manager DB path

## Focus
Angle 5 plus leftover runtime modules. The extraction code README versus files on disk, and `resolveDatabasePaths()` still defaulting through `DB_PATH`.

## Findings

### F-I18-001 — Extraction README describes a deleted after-tool memory pipeline. CONFIRMED. P1
Frontmatter: "entity extraction, and ontology checks for memory creation." [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/extraction/README.md:3]
Overview and data flow still resolve target memory IDs and `insert working-memory attention or extracted record data`. [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/extraction/README.md:14,20-31]
Key files table lists `extraction-adapter.ts`, `redaction-gate.ts`, `ontology-hooks.ts`. [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/extraction/README.md:39-43]
Existence checks: those three files are ABSENT. `entity-extractor.ts` and `entity-denylist.ts` exist.
Entrypoints still advertise `initExtractionAdapter()`, `storeEntities()`, `updateEntityCatalog()`. [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/extraction/README.md:57-64]
This is a code README that claims behavior the folder no longer has. It is in T009's written scope ("write or refresh every code README"). [SOURCE: .opencode/specs/system-speckit/054-decommission-debt-fixes/tasks.md:52]
Smallest fix: rewrite the README around `extractEntities` / `filterEntities` for graph-metadata-parser. Drop adapter/redaction/ontology/store entrypoints or mark them deleted.

### F-I18-002 — `storeEntities` is still exported and tested. CONFIRMED. P1
`storeEntities` INSERT OR REPLACE into `memory_entities` for a `memory_index` row id. [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/extraction/entity-extractor.ts:282-308]
Tests describe `storeEntities` and `updateEntityCatalog`. [SOURCE: .opencode/skills/system-spec-kit/runtime/tests/entity-extractor.vitest.ts:2,11-12,338-512]
Extends F-I11-001/003 with the public insert helper, not only rebuild.
Smallest fix: same as F-I11-002 — delete the sqlite helpers and their describes.

### F-I18-003 — `resolveDatabasePaths()` still defaults to `DB_PATH` basename. CONFIRMED. P1
`computeDatabasePaths` joins `path.basename(DB_PATH)` when no override path is set. [SOURCE: .opencode/skills/system-spec-kit/runtime/core/config.ts:94-96]
`DB_PATH` is the retired `context-index.sqlite` filename (F-I2-001). `transaction-manager` recovers pending files against `resolveDatabasePaths().databasePath`. [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/storage/transaction-manager.ts:9,383]
Core README still documents `resolveDatabasePaths()` as computing database directory, database file, and update-marker paths. [SOURCE: .opencode/skills/system-spec-kit/runtime/core/README.md:93,118]
D5 allows `runtime/database` as the HF default directory. It does not require the default *filename* to stay `context-index.sqlite` or a pending-file recoverer to key off that store.
Smallest fix: if any sqlite remains for D5, give it an honest name. If not, stop exporting a default DB file path from spec-kit config.

### F-I18-004 — transaction-manager is file+db recovery, not a memory MCP. CONFIRMED. P2 (negative)
Header: atomic file + index operations with pending file recovery. [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/storage/transaction-manager.ts:1-8]
Do not treat the module name as a retired mutation-handler surface. The residue is the default path it resolves (F-I18-003).
Smallest fix: none on the module itself until callers are inventoried in T009.

## Sources Consulted
- .opencode/skills/system-spec-kit/runtime/lib/extraction/README.md:3,14,20-31,39-43,57-64
- .opencode/skills/system-spec-kit/runtime/lib/extraction/entity-extractor.ts:282-308
- .opencode/skills/system-spec-kit/runtime/tests/entity-extractor.vitest.ts:2,11-12,338-512
- .opencode/skills/system-spec-kit/runtime/core/config.ts:94-96
- .opencode/skills/system-spec-kit/runtime/core/README.md:93,118
- .opencode/skills/system-spec-kit/runtime/lib/storage/transaction-manager.ts:1-9,383
- existence checks on extraction-adapter.ts, redaction-gate.ts, ontology-hooks.ts

## Assessment
- newInfoRatio: 0.70
- Novelty justification: ghost files in a code README (T009-shaped), storeEntities public API, default DB basename used by transaction-manager.
- Confidence: high.

## Reflection
- Worked: existence checks on every file the README names.
- Failed: none.
- Ruled out: treating transaction-manager as a leftover MCP handler module.

## Dead Ends
- None.

## Recommended Next Focus
Contradiction sweep: what still looks like a miss but is D5 or already absorbed.
