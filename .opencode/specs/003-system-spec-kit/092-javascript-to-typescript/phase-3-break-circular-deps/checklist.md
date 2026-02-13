# Verification Checklist: Phase 2 — Break Circular Dependencies

> **Parent Spec:** 092-javascript-to-typescript/
> **Workstream:** W-B
> **Phase:** Phase 2 of 10

---

## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval to defer |
| **[P2]** | Optional | Can defer with documented reason |

**Evidence format:** When marking `[x]`, provide evidence on the next line:
```
- [x] CHK-NNN [Px] Description
  - **Evidence**: [compilation output / test result / file existence / grep output]
```

---

## Phase 2: Circular Dependency Resolution Verification

### File Moves

- [ ] CHK-050 [P0] `retry.js` exists at `shared/utils/retry.js` (moved from mcp_server)
  - **Evidence**:
  - `ls -la shared/utils/retry.js` shows file exists
  - File size matches original (385 lines)
  - `retryWithBackoff`, `withRetry`, `classifyError` functions present

- [ ] CHK-051 [P0] `path-security.js` exists at `shared/utils/path-security.js` (moved)
  - **Evidence**:
  - `ls -la shared/utils/path-security.js` shows file exists
  - File size matches original (75 lines)
  - `validateFilePath`, `escapeRegex` functions present

- [ ] CHK-052 [P0] `folder-scoring.js` exists at `shared/scoring/folder-scoring.js` (moved)
  - **Evidence**:
  - `ls -la shared/scoring/folder-scoring.js` shows file exists
  - File size matches original (397 lines)
  - `calculateFolderScores`, `rankFolders` functions present
  - `shared/scoring/` directory created if it didn't exist

---

### Backward Compatibility

- [ ] CHK-053 [P0] Re-export stub at `mcp_server/lib/utils/retry.js` resolves correctly
  - **Evidence**:
  - Stub file exists at original location
  - Content: `module.exports = require('../../../shared/utils/retry');`
  - Test: `node -e "const r = require('./mcp_server/lib/utils/retry'); console.log(typeof r.retryWithBackoff)"` → prints "function"
  - All exported functions accessible through stub

- [ ] CHK-054 [P0] Re-export stub at `mcp_server/lib/utils/path-security.js` resolves correctly
  - **Evidence**:
  - Stub file exists at original location
  - Content: `module.exports = require('../../../shared/utils/path-security');`
  - Test: `node -e "const ps = require('./mcp_server/lib/utils/path-security'); console.log(typeof ps.validateFilePath)"` → prints "function"
  - `validateFilePath` and `escapeRegex` accessible

- [ ] CHK-055 [P0] Re-export stub at `mcp_server/lib/scoring/folder-scoring.js` resolves correctly
  - **Evidence**:
  - Stub file exists at original location
  - Content: `module.exports = require('../../../shared/scoring/folder-scoring');`
  - Test: `node -e "const fs = require('./mcp_server/lib/scoring/folder-scoring'); console.log(typeof fs.calculateFolderScores)"` → prints "function"
  - All scoring functions accessible

---

### Cleanup

- [ ] CHK-056 [P0] Deprecated `shared/utils.js` deleted
  - **Evidence**:
  - `ls shared/utils.js` → file not found
  - File no longer in git working tree
  - Consumers updated to import from `shared/utils/path-security` directly (if any existed)

- [ ] CHK-057 [P0] No remaining imports from `shared/` into `mcp_server/` (grep verification)
  - **Evidence**:
  - `grep -r "require.*['\"]\\.\\./\\.\\./mcp_server" shared/ | grep -v node_modules` → 0 results
  - `grep -r "require.*mcp_server" shared/ | grep -v node_modules` → 0 results
  - All `shared/` → `mcp_server/` imports eliminated

---

### Dependency Graph Validation

- [ ] CHK-058 [P0] All existing tests pass after dependency restructuring (100% pass rate)
  - **Evidence**:
  - `npm test` in root → all tests pass
  - `npm test` in `mcp_server/` → all 46 tests pass
  - `npm test` in `scripts/` → all 13 tests pass
  - Total: 59 test files, 100% pass rate
  - No failures related to module resolution

- [ ] CHK-059 [P0] Dependency graph is a DAG: shared ← mcp_server ← scripts
  - **Evidence**:
  - After Phase 1 tsconfig setup: `tsc --build` resolves project references without circular errors
  - No "File is part of a circular module graph" errors
  - Build order verified: shared → mcp_server → scripts
  - Manual verification: no bidirectional arrows in dependency graph

---

## Additional Verification (Post-Move Functional Checks)

- [ ] CHK-060 [P1] `shared/embeddings/providers/voyage.js` imports retry successfully
  - **Evidence**:
  - File imports `retry` from new location
  - Embedding provider initializes without errors
  - API calls with retry logic functional

- [ ] CHK-061 [P1] `shared/embeddings/providers/openai.js` imports retry successfully
  - **Evidence**:
  - File imports `retry` from new location
  - OpenAI provider initializes without errors
  - API calls with retry logic functional

- [ ] CHK-062 [P1] `scripts/memory/rank-memories.js` imports folder-scoring from shared/
  - **Evidence**:
  - Script imports from `shared/scoring/folder-scoring`
  - Script executes without module resolution errors
  - Folder ranking output matches expected format

---

## Verification Summary

| Category | Total | Verified | Priority Breakdown |
|----------|------:|--------:|-------------------|
| File Moves | 3 | /3 | 3 P0 |
| Backward Compatibility | 3 | /3 | 3 P0 |
| Cleanup | 2 | /2 | 2 P0 |
| Dependency Graph | 2 | /2 | 2 P0 |
| Functional Checks | 3 | /3 | 3 P1 |
| **TOTAL** | **13** | **/13** | **10 P0, 3 P1** |

**Verification Date**: ________________

---

## Cross-References

- **Phase Plan:** See `plan.md`
- **Tasks:** See `tasks.md` (T020-T027)
- **Master Plan:** See `../plan.md` (lines 155-186)
- **Master Checklist:** See `../checklist.md` (CHK-050–CHK-059)
- **Decision Record:** See `../decision-record.md` (D4: Circular Dependency Resolution)
