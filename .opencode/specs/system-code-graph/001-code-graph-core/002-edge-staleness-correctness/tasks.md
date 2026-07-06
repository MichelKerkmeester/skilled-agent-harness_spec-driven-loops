---
title: "Task Breakdown: Code-Graph Edge-Staleness Correctness"
description: "Per-candidate task breakdown, code implemented default-off/tombstone-gated, fan-in benchmark acceptance remains pending. Unit 1 = reverse-dep force-parse staleness repair (benchmark-gated). Unit 2 = additive rename SUPERSEDES edge (no migration)."
trigger_phrases:
  - "code graph edge staleness tasks"
  - "reverse-dep force-parse tasks"
  - "rename supersedes edge tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/001-code-graph-core/002-edge-staleness-correctness"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author edge-staleness-correctness task breakdown from 028/002 research"
    next_safe_action: "Start T010 path-filtered queryImportersOf"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-002-edge-staleness-correctness"
      parent_session_id: null
    completion_pct: 15
    open_questions: []
    answered_questions: []
---
# Task Breakdown: Code-Graph Edge-Staleness Correctness

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

**Candidate status legend**: `CG-edge-staleness-repair` / `CG-edge-staleness-dependency-transitivity` (Unit 1) = IMPLEMENTED default-off (benchmark-gated, the 030 Wave-1 row at `030 spec.md:104`, NOT in §14's done table). `Q1-C2` / `Q1-C2-supersedes-edge` (Unit 2) = IMPLEMENTED tombstone-gated (additive, no migration, NOT in §14's done table). Neither candidate shipped in Wave-0 (030).
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm skip seam `if (skipFreshFiles && !isFileStale(file))` (`structural-indexer.ts:2175`) and the content-hash gate `isFileStale` (`code-graph-db.ts:1042`, NOT mtime). Evidence: `rg -n 'skipFreshFiles|isFileStale' .opencode/skills/system-code-graph/mcp_server`.
- [x] T002 Confirm `queryFileImportDependents()` is read-path-only, one non-test caller `handlers/query.ts:1017` (`code-graph-db.ts:1343`). Evidence: `rg -n 'queryFileImportDependents|queryImportersOf' .opencode/skills/system-code-graph/mcp_server/lib .opencode/skills/system-code-graph/mcp_server/handlers`.
- [x] T003 [P] Confirm symbol-id path-coupling `sha256(filePath::fqName::kind)` (`indexer-types.ts:102`) + content hash `sha256(content)` (`indexer-types.ts:109`) + prune (`code-graph-db.ts:1030`). Evidence: implementation uses `querySymbolIdsForFiles()` comparison before force-parse.
- [x] T004 [P] Confirm the off-by-default tombstone substrate for Q1-C2 (`code-graph-db.ts:230` gate, `:296`/`:316` inserts). Evidence: `edge-staleness-correctness.vitest.ts` covers tombstone-on and tombstone-off lineage.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Unit 1, CG-edge-staleness-repair / dependency-transitivity (M, benchmark-gated), IMPLEMENTED default-off
- [x] T010 Add a path-filtered `queryImportersOf(stalePaths)` beside `queryFileImportDependents()` (the existing one full-scans `code_edges`, `code-graph-db.ts:1344-1360`). Evidence: `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts`.
- [x] T011 In the scan driver: snapshot the stale set, expand with reverse-dependents, populate a `forceParse: Set<string>`, **BEFORE any `replaceNodes`** (HARD ORDERING CONSTRAINT, post-persist JOIN returns nothing). Evidence: `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts`.
- [x] T012 Honor `forceParse` at the skip site so importers override `skipFreshFiles && !isFileStale(file)` and re-parse against new symbol ids (`structural-indexer.ts:2175`). Evidence: `forceParsedFiles` carried into `.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts`.
- [B] T013 [B] Benchmark fan-in re-parse cost on a hot high-importer file before any default-on flip (regression-baseline rule). LEFT-PENDING: live benchmark/reindex/scan was disallowed, repair remains default-off behind `SPECKIT_CODE_GRAPH_REVERSE_DEP_FORCE_PARSE`.

### Unit 2, Q1-C2 / Q1-C2-supersedes-edge (S, additive, no migration), IMPLEMENTED tombstone-gated
- [x] T020 Emit a `SUPERSEDES` edge on rename/move keyed on matching `contentHash` (`indexer-types.ts:109`) instead of pure delete+create, reusing the tombstone machinery (`code-graph-db.ts:230-318`). Evidence: tombstone-gated lineage in `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts`.
- [x] T021 Keep `SCHEMA_VERSION` unchanged (stays 5), the `SUPERSEDES` edge rides the existing edge table / tombstone substrate (no `code_edges` column change). Evidence: typecheck green and `edge-staleness-correctness.vitest.ts`.
- [x] T022 [P] Confirm existing read paths are byte-identical when the `SUPERSEDES` edge is absent (additive-only). Evidence: tombstone-off assertion in `edge-staleness-correctness.vitest.ts`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T030 Unit test: index A(`import {foo} from './b'`) + B(`export function foo`), mutate B to a const export (kind-flip → new id), touch ONLY B, incremental scan → A→B `IMPORTS` survives, re-derived to the new id. Evidence: `edge-staleness-correctness.vitest.ts`.
- [x] T031 Control test: body-only edit of `foo` (stable symbol_id) → no extra A parse, A→B unchanged. Evidence: `edge-staleness-correctness.vitest.ts`.
- [x] T032 Ordering-gate test: reverse-dep query run post-`replaceNodes` returns empty (proves before-persist capture is load-bearing). Evidence: `edge-staleness-correctness.vitest.ts`.
- [x] T033 Q1-C2 test: rename emits a `contentHash`-keyed `SUPERSEDES` edge old→new, absent-edge queries byte-identical, `SCHEMA_VERSION` unchanged. Evidence: `edge-staleness-correctness.vitest.ts`.
- [x] T034 Static gate: `queryFileImportDependents` read-path caller intact, scan loop uses the path-filtered query (grep). Evidence: `rg -n 'queryFileImportDependents|queryImportersOf' .opencode/skills/system-code-graph/mcp_server/lib .opencode/skills/system-code-graph/mcp_server/handlers`.
- [x] T035 Typecheck + focused code-graph scan/indexer/db suite green. Evidence: `npm run typecheck` exit 0, broad Vitest 7 files, 135 passed, 1 skipped.
- [x] T036 `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` exit 0. Evidence: strict validation passed with 0 errors, 0 warnings.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` with evidence (commit SHA or test name), no Wave-0 pre-checks (neither candidate shipped in 030). T013 remains blocked by the no-live-benchmark constraint.
- [ ] No `[B]` blocked tasks remaining (T013 fan-in benchmark captured). LEFT-PENDING: benchmark gate not runnable in this task.
- [x] Correctness invariant holds: refactored dependency re-derives dependents' edges, body-edit incurs no extra parse, reverse-deps captured before persistence. Evidence: `edge-staleness-correctness.vitest.ts`.
- [x] Q1-C2 additive (absent-edge byte-identical), focused tests + `validate.sh --strict` pass. Evidence: focused tests passed, strict validation passed.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Research (PRIMARY)**: `../research/iterations/iteration-022.md`, `../research/iterations/iteration-016.md`, `../research/iterations/iteration-002.md`, `../../research/synthesis/01-go-candidates.md`, `../../research/synthesis/04-sibling-and-cross-cutting.md`.
- **Shipped record**: Wave-0 record (done table) (Wave-1: CG dependency-transitivity).
<!-- /ANCHOR:cross-refs -->
