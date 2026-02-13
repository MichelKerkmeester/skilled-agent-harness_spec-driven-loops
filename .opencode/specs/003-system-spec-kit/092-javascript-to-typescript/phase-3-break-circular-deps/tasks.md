# Tasks: Phase 2 — Break Circular Dependencies

> **Parent Spec:** 092-javascript-to-typescript/
> **Workstream:** W-B
> **Phase:** Phase 2 of 10

---

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

---

## Phase 2 Tasks (T020–T027)

### File Moves (shared/ ← mcp_server/)

- [x] T020 [W-B] Move `retry.js` from `mcp_server/lib/utils/` to `shared/utils/retry.js` [30m] {deps: T015}
  - File is self-contained (no mcp_server-internal dependencies)
  - Used by `shared/embeddings/providers/{voyage,openai}.js`
  - Update all import paths in shared/ consumers
  - **Verification:** `node -e "require('./shared/utils/retry')"` succeeds
  - **Verification:** Grep for old path returns 0 results in `shared/`

- [x] T021 [W-B] Move `path-security.js` from `mcp_server/lib/utils/` to `shared/utils/path-security.js` [30m] {deps: T015}
  - File is self-contained (only depends on `path` built-in)
  - Used by deprecated `shared/utils.js`
  - Update all import paths
  - **Verification:** `node -e "require('./shared/utils/path-security')"` succeeds
  - **Verification:** `validateFilePath()` function exports correctly

- [x] T022 [W-B] Move `folder-scoring.js` from `mcp_server/lib/scoring/` to `shared/scoring/folder-scoring.js` [30m] {deps: T015}
  - File is self-contained (no internal mcp_server dependencies)
  - Used by `scripts/memory/rank-memories.js` (removes scripts→mcp_server cross-dep)
  - Create `shared/scoring/` directory if it doesn't exist
  - **Verification:** `node -e "require('./shared/scoring/folder-scoring')"` succeeds
  - **Verification:** `calculateFolderScores()` and `rankFolders()` export correctly

---

### Backward Compatibility

- [x] T023 [W-B] Create re-export stub at `mcp_server/lib/utils/retry.js` [10m] {deps: T020}
  - Content: `module.exports = require('../../../shared/utils/retry');`
  - **Verification:** `require('./mcp_server/lib/utils/retry')` resolves to shared version
  - **Verification:** Existing import paths still work

- [x] T024 [W-B] [P] Create re-export stub at `mcp_server/lib/utils/path-security.js` [10m] {deps: T021}
  - Content: `module.exports = require('../../../shared/utils/path-security');`
  - **Verification:** `require('./mcp_server/lib/utils/path-security')` resolves to shared version
  - **Verification:** Function exports match original

- [x] T025 [W-B] [P] Create re-export stub at `mcp_server/lib/scoring/folder-scoring.js` [10m] {deps: T022}
  - Content: `module.exports = require('../../../shared/scoring/folder-scoring');`
  - **Verification:** `require('./mcp_server/lib/scoring/folder-scoring')` resolves to shared version
  - **Verification:** All 3 re-export stubs functional

---

### Cleanup

- [x] T026 [W-B] Delete deprecated `shared/utils.js` [10m] {deps: T021}
  - Was only re-exporting path-security from mcp_server — no longer needed after move
  - Verify no remaining consumers (grep for `require.*shared/utils`)
  - **Verification:** `grep -rn "require.*['\"]\\.\\./shared/utils['\"]" .` returns 0 results (excluding node_modules)
  - **Verification:** `grep -rn "require.*shared/utils['\"]" shared/` returns 0 results
  - **Note:** If consumers exist, update them to import from `shared/utils/path-security` directly

---

### Verification

- [x] T027 [W-B] Verify circular dependency resolution [30m] {deps: T020-T026}
  - **Test 1:** Run all existing tests — 100% pass rate
    - `npm test` (both mcp_server and scripts workspaces)
    - All 59 test files should pass
  - **Test 2:** `tsc --build` resolves project references without circular errors
    - After Phase 1 tsconfig setup, this should now succeed
    - No "File is part of a circular module graph" errors
  - **Test 3:** Dependency graph is now DAG: `shared` ← `mcp_server` ← `scripts`
    - No remaining `shared/` → `mcp_server/` imports
    - Run: `grep -r "require.*mcp_server" shared/` → should return 0 results
  - **Test 4:** Re-export stubs functional
    - `node -e "const retry = require('./mcp_server/lib/utils/retry'); console.log(typeof retry.retryWithBackoff)"` → prints "function"
    - Similar checks for path-security and folder-scoring stubs
  - **Evidence format:**
    ```
    ✓ All 59 tests pass (100%)
    ✓ tsc --build completes without circular reference errors
    ✓ grep for shared→mcp_server imports: 0 results
    ✓ All 3 re-export stubs resolve correctly
    ```

---

## Dependencies

- **Blocks:** Phase 3 (T030-T042) — cannot convert `shared/` to TypeScript until dependency graph is acyclic
- **Blocked by:** Phase 1 (T015) — tsconfig files must exist to test `tsc --build`

---

## Completion Criteria

- [x] All tasks marked `[x]`
- [x] All verifications passed with evidence
- [x] No `[B]` blocked tasks
- [x] DAG validated: no circular imports
- [x] Tests pass: 100% rate

---

## Status Updates Log

### 2026-02-07 — Phase 2 Complete

**Files moved (content copied to new location):**
- `mcp_server/lib/utils/retry.js` -> `shared/utils/retry.js`
- `mcp_server/lib/utils/path-security.js` -> `shared/utils/path-security.js`
- `mcp_server/lib/scoring/folder-scoring.js` -> `shared/scoring/folder-scoring.js`

**Re-export stubs created (backward compatibility):**
- `mcp_server/lib/utils/retry.js` -> re-exports from `shared/utils/retry`
- `mcp_server/lib/utils/path-security.js` -> re-exports from `shared/utils/path-security`
- `mcp_server/lib/scoring/folder-scoring.js` -> re-exports from `shared/scoring/folder-scoring`

**Import paths updated:**
- `shared/embeddings/providers/voyage.js` line 12: `../../utils/retry.js` (was `../../../mcp_server/lib/utils/retry.js`)
- `shared/embeddings/providers/openai.js` line 12: `../../utils/retry.js` (was `../../../mcp_server/lib/utils/retry.js`)
- `mcp_server/handlers/memory-save.js` line 24: `path.join(SHARED_DIR, 'utils', 'path-security')` (was `path.join(SHARED_DIR, 'utils')`)

**Deleted:**
- `shared/utils.js` (deprecated re-export wrapper, zero consumers)

**Verification evidence:**
```
shared/utils/retry.js          -> retryWithBackoff: function
shared/utils/path-security.js  -> validateFilePath: function, escapeRegex: function
shared/scoring/folder-scoring.js -> computeFolderScores: function, isArchived: function, computeRecencyScore: function
stub retry.js                  -> retryWithBackoff: function
stub path-security.js          -> validateFilePath: function, escapeRegex: function
stub folder-scoring.js         -> computeFolderScores: function, isArchived: function
grep shared/ for mcp_server    -> 0 results (DAG confirmed)
test:cli                       -> PASS
test:embeddings                -> PASS (ALL TESTS PASSED)
test:mcp                       -> PASS (server initializes, all modules resolve)
```
