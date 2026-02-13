# Phase 2: Break Circular Dependencies

> **Parent Spec:** `092-javascript-to-typescript/`
> **Workstream:** W-B
> **Tasks:** T020–T027
> **Milestone:** M3 (Dependencies Clean)
> **SYNC Gate:** SYNC-003
> **Depends On:** Phase 1 (SYNC-002)
> **Session:** 1

---

## Goal

Resolve the `shared/` <-> `mcp_server/` circular imports so TypeScript project references work. Project references require a DAG (no cycles).

## The Problem

```
shared/embeddings/providers/voyage.js  -->  mcp_server/lib/utils/retry.js
shared/embeddings/providers/openai.js  -->  mcp_server/lib/utils/retry.js
shared/utils.js                        -->  mcp_server/lib/utils/path-security.js
mcp_server/                            -->  shared/  (multiple imports)
```

This creates a cycle: `shared/ <-> mcp_server/`.

## Scope

### File Moves (3)

| File | From | To | Reason |
|------|------|----|--------|
| `retry.js` | `mcp_server/lib/utils/` | `shared/utils/retry.ts` | Generic utility, used by shared |
| `path-security.js` | `mcp_server/lib/utils/` | `shared/utils/path-security.ts` | Security infra, shared across modules |
| `folder-scoring.js` | `mcp_server/lib/scoring/` | `shared/scoring/folder-scoring.ts` | Used by `scripts/memory/rank-memories.js` |

### Re-Export Stubs (3)

Leave thin re-export files at original locations for backward compatibility:
- `mcp_server/lib/utils/retry.ts` → re-exports `shared/utils/retry`
- `mcp_server/lib/utils/path-security.ts` → re-exports `shared/utils/path-security`
- `mcp_server/lib/scoring/folder-scoring.ts` → re-exports `shared/scoring/folder-scoring`

### Deletions (1)

- `shared/utils.js` — DEPRECATED, only re-exported `path-security.js`

## Post-Move Dependency Graph

```
shared/ <-- mcp_server/ <-- scripts/    (DAG, no cycles)
```

## Exit Criteria

- [ ] All 3 files moved and converted to `.ts`
- [ ] Re-export stubs in place at original locations
- [ ] `shared/utils.js` deleted
- [ ] All existing tests pass with new import paths
- [ ] `tsc --build` resolves project references without circular errors
- [ ] SYNC-003 gate passed
