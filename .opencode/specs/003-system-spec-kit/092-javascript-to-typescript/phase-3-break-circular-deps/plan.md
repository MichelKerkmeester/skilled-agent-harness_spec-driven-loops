# Plan: Phase 2 — Break Circular Dependencies

> **Parent Spec:** 092-javascript-to-typescript/
> **Workstream:** W-B
> **Phase:** Phase 2 of 10
> **Created:** 2026-02-07

---

## Goal

Resolve `shared/` ↔ `mcp_server/` circular imports so TypeScript project references work.

**Problem:** TypeScript project references require a DAG (Directed Acyclic Graph). Currently, `shared/` imports utilities from `mcp_server/`, while `mcp_server/` imports from `shared/` — creating a cycle.

**Solution:** Move 3 self-contained files from `mcp_server/` to `shared/`, establish re-export stubs for backward compatibility, and verify the dependency graph is now acyclic.

---

## The Circular Dependency Problem

### Current (Broken) State

```
shared/
├── embeddings/providers/voyage.js       → requires mcp_server/lib/utils/retry.js
├── embeddings/providers/openai.js       → requires mcp_server/lib/utils/retry.js
└── utils.js (DEPRECATED)                → requires mcp_server/lib/utils/path-security.js

mcp_server/
├── lib/utils/retry.js
├── lib/utils/path-security.js
└── lib/scoring/folder-scoring.js

scripts/
└── memory/rank-memories.js              → requires mcp_server/lib/scoring/folder-scoring.js

Dependency arrows:
shared/ → mcp_server/ (retry, path-security)
mcp_server/ → shared/ (embeddings, trigger-extractor)
scripts/ → mcp_server/ (folder-scoring)
```

**Issue:** This creates two dependency cycles:
1. `shared/` ↔ `mcp_server/` (mutual imports)
2. `scripts/` → `mcp_server/` → `shared/` → `mcp_server/` (indirect cycle)

TypeScript project references **cannot resolve circular dependencies** — `tsc --build` will fail.

---

## File Move Strategy

### Files to Move (3)

| File | From | To | Reason |
|------|------|----|--------|
| **retry.js** | `mcp_server/lib/utils/retry.js` | `shared/utils/retry.js` | Generic utility, self-contained, no internal `mcp_server/` dependencies. Used by `shared/embeddings/providers/{voyage,openai}.js`. |
| **path-security.js** | `mcp_server/lib/utils/path-security.js` | `shared/utils/path-security.js` | Security infrastructure, depends only on Node `path` built-in. Used by deprecated `shared/utils.js`. |
| **folder-scoring.js** | `mcp_server/lib/scoring/folder-scoring.js` | `shared/scoring/folder-scoring.js` | Self-contained scoring logic. Used by `scripts/memory/rank-memories.js` — moving it to `shared/` removes the `scripts/` → `mcp_server/` cross-workspace dependency. |

All 3 files are **self-contained** — they have no dependencies on internal `mcp_server/` modules. They only use:
- Node.js built-ins (`path`, `crypto`)
- Isolated logic (pure functions, no side effects)

### Files to Delete (1)

| File | Reason |
|------|--------|
| **shared/utils.js** | DEPRECATED. Was only re-exporting `path-security.js` from `mcp_server/`. After the move, consumers can import from `shared/utils/path-security` directly. |

---

## Re-Export Stub Strategy (Backward Compatibility)

To avoid breaking existing imports during the migration, we create **re-export stubs** at the original file locations:

| Stub Location | Content |
|---------------|---------|
| `mcp_server/lib/utils/retry.js` | `module.exports = require('../../../shared/utils/retry');` |
| `mcp_server/lib/utils/path-security.js` | `module.exports = require('../../../shared/utils/path-security');` |
| `mcp_server/lib/scoring/folder-scoring.js` | `module.exports = require('../../../shared/scoring/folder-scoring');` |

**Why stubs:**
- Existing imports like `require('../../lib/utils/retry')` continue working
- Gradual migration: we can update import paths in later phases
- Reduces blast radius of this change to 5 files (3 moves + 1 delete + stubs)

**In TypeScript conversion (Phase 3+):** These stubs become:
```typescript
export * from '../../../shared/utils/retry';
```

---

## Post-Move Dependency Graph (DAG)

After moves and re-export stubs:

```
shared/
├── utils/
│   ├── retry.js           (MOVED HERE)
│   └── path-security.js   (MOVED HERE)
└── scoring/
    └── folder-scoring.js  (MOVED HERE)

mcp_server/
├── lib/utils/
│   ├── retry.js           (RE-EXPORT STUB → shared/)
│   └── path-security.js   (RE-EXPORT STUB → shared/)
└── lib/scoring/
    └── folder-scoring.js  (RE-EXPORT STUB → shared/)

scripts/
└── memory/rank-memories.js  → shared/scoring/folder-scoring.js

Dependency arrows (AFTER Phase 2):
shared/               (leaf layer — no outgoing deps to other workspaces)
  ↑
mcp_server/          (depends on shared/)
  ↑
scripts/             (depends on shared/ and mcp_server/)
```

**Result:** A proper DAG (Directed Acyclic Graph). TypeScript project references can now resolve:
- `shared/tsconfig.json` builds first (no references)
- `mcp_server/tsconfig.json` builds second (references `../shared`)
- `scripts/tsconfig.json` builds last (references `../shared`, `../mcp_server`)

---

## Verification Steps

1. **File existence:** All 3 files exist at new locations in `shared/`
2. **Re-export stubs work:** `require()` calls to original paths resolve correctly
3. **Tests pass:** All existing tests (100% pass rate) still work
4. **Circular detection:** `grep -r "require.*shared.*mcp_server\|require.*\.\.\/\.\.\/mcp_server" shared/` returns 0 results
5. **Project references viable:** `tsc --build` (after Phase 1 tsconfig setup) can resolve workspace references without circular errors

---

## Success Criteria

- [ ] 3 files moved to `shared/` and executable
- [ ] 3 re-export stubs created and functional
- [ ] 1 deprecated file (`shared/utils.js`) deleted
- [ ] All existing tests pass (100% pass rate)
- [ ] No `shared/` → `mcp_server/` imports remain
- [ ] `tsc --build` validates DAG without circular reference errors

---

## Effort Estimate

**Total:** ~2 hours (5 files touched, verification critical)

| Task | Effort |
|------|--------|
| Move 3 files | 1.5h |
| Create re-export stubs | 30m |
| Delete deprecated file | 10m |
| Verification (tests + DAG check) | 30m |

---

## Cross-References

- **Master Plan:** See `../plan.md` (lines 155-186)
- **Tasks:** See `../tasks.md` (T020-T027)
- **Checklist:** See `../checklist.md` (CHK-050–CHK-059)
- **Decision Record:** See `../decision-record.md` (D4: Circular Dependency Resolution)
