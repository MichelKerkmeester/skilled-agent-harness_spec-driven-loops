---
title: "Workspace: Repository-Root Resolution"
description: "A single sentinel-based repo-root resolver so every runtime writer anchors state to the real repository root, never a nested working directory."
trigger_phrases:
  - "repository root resolution"
  - "repo root sentinel"
  - "findRepoRoot"
---

# Workspace: Repository-Root Resolution

---

## 1. OVERVIEW

`lib/workspace/` holds one file: a repository-root resolver that any runtime writer can call before it persists state. Deriving a write root from `process.cwd()` instead plants a nested `.opencode/` tree wherever the process happened to run, and that nested tree then satisfies future walk-ups, so the leak becomes permanent and spreads. `findRepoRoot()` exists to make that class of bug structurally unreachable.

Current state:

- The resolver walks up from a starting directory looking for an authored sentinel file, `.opencode/skills/system-spec-kit/SKILL.md`.
- If the walk exhausts without finding the sentinel, it falls back to hoisting above the outermost `.opencode` segment in the starting path, so a candidate that is already inside an `.opencode` tree can never resolve to a subtree of itself.
- The sentinel is a real authored file, not a bare directory, because a directory sentinel is self-perpetuating: once a buggy caller creates `<wrong-dir>/.opencode/...`, every later walk-up from that subtree finds it and returns the wrong root forever.

---

## 2. KEY FILES

| File | Responsibility |
|---|---|
| `repo-root.mjs` | Exports `REPO_ROOT_SENTINEL`, `hoistAboveOpencodeTree(dir)` and `findRepoRoot(start, opts)`. |

---

## 3. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `findRepoRoot(start = process.cwd(), opts)` | Function | Resolve the repository root for a runtime writer. `opts.maxDepth` (default 14) bounds the upward walk; `opts.sentinel` overrides the sentinel path. Always returns a directory, never throws. |
| `hoistAboveOpencodeTree(dir)` | Function | Return the directory containing the outermost `.opencode` segment in `dir`, or `null` when `dir` is not inside an `.opencode` tree. Used as `findRepoRoot`'s fallback. |
| `REPO_ROOT_SENTINEL` | Constant | The authored file (`.opencode/skills/system-spec-kit/SKILL.md`) whose presence marks the real repository root. |

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Only `node:fs` and `node:path`. No dependency on any runtime adapter or on `spec-gate-core.mjs`. |
| Direction | `lib/spec-gate/spec-gate-core.mjs` imports `findRepoRoot` from here; nothing in this folder imports back out. |
| Never throws | A walk that finds nothing still returns a directory (the hoisted or resolved fallback), so a caller never needs a try/catch around this resolver. |

Main flow:

```text
╭──────────────────────────────────────────╮
│ Caller passes a starting directory        │
│ (or process.cwd())                        │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ Walk upward looking for the sentinel file │
│ (bounded by maxDepth)                     │
└──────────────────────────────────────────┘
                  │
        found ────┴──── not found
          │                │
          ▼                ▼
┌──────────────────┐  ┌──────────────────────────────┐
│ Return that       │  │ Hoist above the outermost     │
│ directory          │  │ .opencode segment, or return  │
│                    │  │ the resolved start directory  │
└──────────────────┘  └──────────────────────────────┘
```

---

## 5. VALIDATION

Run from `.opencode/skills/system-spec-kit/runtime`.

```bash
node --check hooks/lib/workspace/repo-root.mjs
```

Expected result: no syntax errors. `findRepoRoot` and `hoistAboveOpencodeTree` are exercised indirectly through `hooks/lib/spec-gate/spec-gate-core.test.mjs`, the only current consumer of this module.

---

## 6. RELATED

- [`../README.md`](../README.md): the owning `lib/` folder.
- [`../spec-gate/README.md`](../spec-gate/README.md): the sole current consumer of `findRepoRoot`.
