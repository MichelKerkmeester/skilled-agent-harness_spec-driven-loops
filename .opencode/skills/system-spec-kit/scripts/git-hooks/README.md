---
title: "Git Hooks Source: memory-index drift marker writer"
description: "TypeScript source for the drift marker that git lifecycle hooks write after a rename or delete under .opencode/specs."
---

# Git Hooks Source

---

## 1. OVERVIEW

`scripts/git-hooks/` holds the TypeScript source for the memory-index drift marker. It compiles to `scripts/dist/git-hooks/drift-marker-write.js`, which the repo's git lifecycle hooks (`post-commit`, `post-merge`, `post-rewrite` under `.opencode/scripts/git-hooks/`) invoke by path, not by importing this source directly.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `drift-marker-write.ts` | Reads `MEMORY_DRIFT_DIFF` and `MEMORY_DRIFT_REPO_ROOT` from the environment, parses renamed and deleted `.opencode/specs` paths out of a `git diff-tree --name-status` diff and merges them into a lock-guarded, atomically written drift-marker JSON file so the memory index can reconcile stale paths. |

## 3. CONSUMERS

- `.opencode/scripts/git-hooks/lib/memory-drift-marker.sh` invokes the compiled `scripts/dist/git-hooks/drift-marker-write.js` with `MEMORY_DRIFT_DIFF`/`MEMORY_DRIFT_REPO_ROOT`/`MEMORY_DRIFT_SOURCE` set, from `post-commit`, `post-merge` and `post-rewrite`.

## 4. VALIDATION

```bash
npx vitest run .opencode/skills/system-spec-kit/scripts/tests/drift-marker-write.vitest.ts
```

## 5. RELATED

- [`.opencode/scripts/git-hooks/lib/memory-drift-marker.sh`](../../../../scripts/git-hooks/lib/memory-drift-marker.sh): shell caller that sets the environment this script reads.
