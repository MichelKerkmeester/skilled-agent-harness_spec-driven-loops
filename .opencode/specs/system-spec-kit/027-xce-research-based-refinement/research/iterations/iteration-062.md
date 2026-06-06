# Iteration 062 — coco-purge: 002/003/004/006 specs enumeration + disappearing-scope

**Executor:** cli-opencode `openai/gpt-5.5-fast` --variant xhigh (read-only). **Status:** complete. **newInfoRatio:** 0.64. **Findings:** 5.
**Raw analysis:** `research/prompts/iteration-062.out`

### FINDINGS

[F-062-01] `002-memory-write-safety` is incidental: the only Coco hit is an Out-of-Scope exclusion for “Coco rerank feedback weights,” while the requirements are auto-provenance, manual-edge preservation, and retention deletion safety. `002-memory-write-safety/spec.md:132`, `002-memory-write-safety/spec.md:158`, `002-memory-write-safety/spec.md:159`, `002-memory-write-safety/spec.md:162`

[F-062-02] `003-incremental-index-foundation` is structural-but-rewritable: Coco appears as research basis and phase rationale for memo records, stable fingerprints, and dependency invalidation, but the requirements can survive as local Spec Kit Memory memoization/DAG/chunk-fingerprint requirements. `003-incremental-index-foundation/spec.md:61`, `003-incremental-index-foundation/spec.md:65`, `003-incremental-index-foundation/spec.md:76`, `003-incremental-index-foundation/spec.md:156`, `003-incremental-index-foundation/spec.md:160`

[F-062-03] `004-causal-edge-tombstones` is structural-but-rewritable: Coco lifecycle/tombstone evidence underpins the tombstone-helper concept, but the actual requirements are local causal-edge tombstones, unlink tombstones, and `memory_health` orphan repair. `004-causal-edge-tombstones/spec.md:61`, `004-causal-edge-tombstones/spec.md:67`, `004-causal-edge-tombstones/spec.md:78`, `004-causal-edge-tombstones/spec.md:174`, `004-causal-edge-tombstones/spec.md:178`

[F-062-04] `006-write-path-reconciliation` is structural-but-rewritable: Coco’s statediff rows define the imported vocabulary, but the surviving scope is a local typed desired/prior `DiffAction[]` model plus subscribers; the Coco KV-store out-of-scope mention and open question should be stripped. `006-write-path-reconciliation/spec.md:62`, `006-write-path-reconciliation/spec.md:67`, `006-write-path-reconciliation/spec.md:81`, `006-write-path-reconciliation/spec.md:148`, `006-write-path-reconciliation/spec.md:175`, `006-write-path-reconciliation/spec.md:227`

[F-062-05] Non-spec Coco echoes found in requested metadata are generated `causal_summary` strings for 003/004/006 and should be synced to the same Coco-free rewrites as their specs. `003-incremental-index-foundation/graph-metadata.json:207`, `004-causal-edge-tombstones/graph-metadata.json:207`, `006-write-path-reconciliation/graph-metadata.json:209`

### COCO_REFERENCE_TABLE

file | line | snippet | REMOVE|REWRITE | coco-free equivalent
002-memory-write-safety/spec.md | 132 | `Coco rerank feedback weights.` | REMOVE | Delete the out-of-scope exclusion; no replacement.
003-incremental-index-foundation/spec.md | 61 | `external/cocoindex-main/... ComponentMemoization` | REWRITE | Local `memoization_records` for indexing components keyed by canonical fingerprint.
003-incremental-index-foundation/spec.md | 62 | `external/cocoindex-main/... FunctionMemoizationPrefix` | REWRITE | Local memo namespaces for parser/canonicalizer/embed stages.
003-incremental-index-foundation/spec.md | 63 | `reserve_memoization` / `cached()` | REWRITE | Local memo lookup before expensive derived work.
003-incremental-index-foundation/spec.md | 64 | `If a cached result exists` | REWRITE | Skip-before-execute using local memo hit state.
003-incremental-index-foundation/spec.md | 65 | `Fingerprint of the memoization key` | REWRITE | Canonical input fingerprint determines unchanged-stage skip.
003-incremental-index-foundation/spec.md | 76 | `CocoIndex shows two transferable ideas` | REWRITE | “Spec Kit Memory needs memo records keyed by stable fingerprints and dependency-aware invalidation.”
003-incremental-index-foundation/graph-metadata.json | 207 | `CocoIndex shows two transferable ideas...` | REWRITE | Sync generated summary to the Coco-free 003 phase-context wording.
004-causal-edge-tombstones/spec.md | 61 | `ChildExistencePrefix` | REWRITE | Local causal-edge endpoint/existence tracking before cleanup.
004-causal-edge-tombstones/spec.md | 62 | `ChildComponentTombstonePrefix` | REWRITE | Local `causal_edge_tombstones` audit table.
004-causal-edge-tombstones/spec.md | 63 | `generation... race conditions during deletion` | REWRITE | Local `lifecycle_generation` for delete/recreate races.
004-causal-edge-tombstones/spec.md | 64 | `StablePath... prefix diff` | REWRITE | Local orphan/diff sweep over `causal_edges`.
004-causal-edge-tombstones/spec.md | 65 | `fn del_child` | REWRITE | Missing endpoint cleanup routes through sweep helper.
004-causal-edge-tombstones/spec.md | 66 | `flush_component_tombstones` | REWRITE | Write tombstone audit rows before hard delete.
004-causal-edge-tombstones/spec.md | 67 | `cleanup_tombstone` | REWRITE | Local tombstone retention/cleanup path after audit window.
004-causal-edge-tombstones/spec.md | 78 | `adapts CocoIndex's lifecycle invariant` | REWRITE | “Adapts lifecycle/audit cleanup into a relational causal-edge tombstone helper.”
004-causal-edge-tombstones/graph-metadata.json | 207 | `adapts CocoIndex's lifecycle invariant...` | REWRITE | Sync generated summary to the Coco-free 004 phase-context wording.
006-write-path-reconciliation/spec.md | 62 | `DiffAction = ...` | REWRITE | Local TypeScript `DiffAction = insert | upsert | replace | delete`.
006-write-path-reconciliation/spec.md | 63 | `TrackingRecordTransition` | REWRITE | Local transition type wrapping desired rows, prior rows, and prior completeness.
006-write-path-reconciliation/spec.md | 64 | `def diff(` | REWRITE | Local deterministic diff engine.
006-write-path-reconciliation/spec.md | 65 | `_coco.is_non_existence` | REWRITE | Local desired-absent state maps to delete action.
006-write-path-reconciliation/spec.md | 66 | `p != t.desired... replace` | REWRITE | Local divergent-prior handling maps to replace action.
006-write-path-reconciliation/spec.md | 67 | `diff_composite` | REWRITE | Local composite target model for memory parent/child rows.
006-write-path-reconciliation/spec.md | 81 | `ports CocoIndex's statediff model` | REWRITE | “Introduces an owned target-state reconciliation layer for Spec Kit Memory.”
006-write-path-reconciliation/spec.md | 148 | `CocoIndex's heed-encoded KV store` | REWRITE | Keep “cross-system replication” out of scope; delete Coco KV-store wording.
006-write-path-reconciliation/spec.md | 227 | `outside CocoIndex's four literals` | REWRITE | “outside the four local `DiffAction` literals.”
006-write-path-reconciliation/graph-metadata.json | 209 | `ports CocoIndex's statediff model...` | REWRITE | Sync generated summary to the Coco-free 006 phase-context wording.

### DISAPPEARING_SCOPE

None for in-scope requirements or acceptance criteria: 003 requirements are memoization/chunk/DAG requirements, 004 requirements are tombstone/delete-path requirements, and 006 requirements are local statediff/action-plan requirements. `003-incremental-index-foundation/spec.md:156`, `003-incremental-index-foundation/spec.md:160`, `004-causal-edge-tombstones/spec.md:174`, `004-causal-edge-tombstones/spec.md:178`, `006-write-path-reconciliation/spec.md:175`, `006-write-path-reconciliation/spec.md:180`

Out-of-scope-only disappearance: `Coco rerank feedback weights` is a Coco-only exclusion and can disappear entirely without deleting live work. `002-memory-write-safety/spec.md:129`, `002-memory-write-safety/spec.md:132`

### RULED_OUT

- `002` has no Coco-bearing requirement/AC; its requirement rows cover auto provenance, manual edge preservation, and retention safety. `002-memory-write-safety/spec.md:158`, `002-memory-write-safety/spec.md:159`, `002-memory-write-safety/spec.md:162`
- `003/004/006` metadata Coco scope is generated summary echo, not manual graph edges; manual relation arrays are empty. `003-incremental-index-foundation/graph-metadata.json:7`, `004-causal-edge-tombstones/graph-metadata.json:7`, `006-write-path-reconciliation/graph-metadata.json:7`
- `006` Coco references outside the research basis are not requirements: one is Out of Scope and one is an Open Question. `006-write-path-reconciliation/spec.md:148`, `006-write-path-reconciliation/spec.md:227`

### METRICS

newInfoRatio: 0.64

novelty: Mapped all Coco references in 002/003/004/006 and separated incidental deletion from structural rewrites without finding any in-scope requirement/AC that must vanish.

status: complete

sources: 002-memory-write-safety/spec.md:132, 002-memory-write-safety/spec.md:158, 002-memory-write-safety/spec.md:159, 002-memory-write-safety/spec.md:162, 003-incremental-index-foundation/spec.md:61, 003-incremental-index-foundation/spec.md:62, 003-incremental-index-foundation/spec.md:63, 003-incremental-index-foundation/spec.md:64, 003-incremental-index-foundation/spec.md:65, 003-incremental-index-foundation/spec.md:76, 003-incremental-index-foundation/spec.md:156, 003-incremental-index-foundation/spec.md:160, 003-incremental-index-foundation/graph-metadata.json:207, 004-causal-edge-tombstones/spec.md:61, 004-causal-edge-tombstones/spec.md:62, 004-causal-edge-tombstones/spec.md:63, 004-causal-edge-tombstones/spec.md:64, 004-causal-edge-tombstones/spec.md:65, 004-causal-edge-tombstones/spec.md:66, 004-causal-edge-tombstones/spec.md:67, 004-causal-edge-tombstones/spec.md:78, 004-causal-edge-tombstones/spec.md:174, 004-causal-edge-tombstones/spec.md:178, 004-causal-edge-tombstones/graph-metadata.json:207, 006-write-path-reconciliation/spec.md:62, 006-write-path-reconciliation/spec.md:63, 006-write-path-reconciliation/spec.md:64, 006-write-path-reconciliation/spec.md:65, 006-write-path-reconciliation/spec.md:66, 006-write-path-reconciliation/spec.md:67, 006-write-path-reconciliation/spec.md:81, 006-write-path-reconciliation/spec.md:148, 006-write-path-reconciliation/spec.md:175, 006-write-path-reconciliation/spec.md:180, 006-write-path-reconciliation/spec.md:227, 006-write-path-reconciliation/graph-metadata.json:209
