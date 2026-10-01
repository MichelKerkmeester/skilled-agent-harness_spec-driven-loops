---
title: "Workspace: Root Resolution Helpers"
description: "The two walk-up resolvers shared code uses to find the repository root by sentinel and the skill package root by marker directories."
trigger_phrases:
  - "workspace root resolution"
  - "repo root sentinel"
  - "package root markers"
  - "findRepoRoot"
---

# Workspace: Root Resolution Helpers

---

## 1. OVERVIEW

`workspace/` holds the two root-resolution walks the rest of spec-kit shares. `repo-root.mjs` finds the repository a process may safely write state under. `package-root.ts` finds the skill package directory that holds `shared/` and `runtime/`. Both are pure path walks over `node:fs` and `node:path` with no state, no caching and no network.

Current state:

- `repo-root.mjs` ships as source so build and CI scripts can `require()` it before any build exists.
- `package-root.ts` is compiled and serves TypeScript callers, so the marker set lives in one place.
- Neither module writes anything, and both return an absolute directory or an explicit failure value.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `package-root.ts` | Package root walk by marker directories, exported as `findPackageRoot` and `resolvePackageRoot` |
| `repo-root.mjs` | Repository root and source root resolution by authored sentinel, exported as `findRepoRoot` and `findSourceRoot` |
| `repo-root.d.mts` | Type declarations for the build-free ESM resolver so TypeScript consumers reuse the one algorithm |

---

## 3. BOUNDARIES

| Boundary | Rule |
|---|---|
| Imports | `node:fs` and `node:path` only, no dependency on `runtime/` or another shared module |
| Exports | The sentinel and marker constants plus the four resolution functions listed in section 4 |
| Ownership | Root discovery belongs here. Callers keep their own policy for what they write under the root they receive |

The repository walk prefers the nearest directory that carries the authored sentinel, because a bare `.opencode` directory sentinel would be created by a buggy caller and then satisfy every later walk. When the walk exhausts, `findRepoRoot` narrows in this order:

```text
findRepoRoot(start)
        │
        ▼
  sentinel walk up to DEFAULT_MAX_DEPTH (14) levels
        │
        ▼
  nearestSentinelHolder(start)   # a capped walk may have skipped the root
        │
        ▼
  hoistAboveOpencodeTree(start)  # never hand back a root inside the source tree
        │
        ▼
  resolve(start)
```

---

## 4. ENTRYPOINTS

| Entrypoint | File | Purpose |
|---|---|---|
| `PACKAGE_ROOT_MARKERS` | `package-root.ts` | The directories every package root carries: `shared`, `runtime`, `runtime/cli` |
| `findPackageRoot(startDir, options?)` | `package-root.ts` | Nearest directory holding every marker, or `null` at the filesystem root or the depth cap |
| `resolvePackageRoot(startDir, options?)` | `package-root.ts` | The same walk for callers that cannot continue, throwing `Unable to resolve package root from: <startDir>` |
| `REPO_ROOT_SENTINEL` | `repo-root.mjs` | `.opencode/skills/system-spec-kit/SKILL.md`, an authored file rather than a bare directory |
| `SOURCE_ROOT_NAMES` | `repo-root.mjs` | A checkout may spell the source tree `.skilled` or `.opencode`, and both names mark the same tree |
| `SOURCE_ROOT_SENTINEL` | `repo-root.mjs` | `skills/system-spec-kit/SKILL.md`, the authored file that proves the source tree is really present |
| `findRepoRoot(start?, opts?)` | `repo-root.mjs` | Absolute directory safe to write state under, defaulting to `process.cwd()` |
| `findSourceRoot(repoRoot)` | `repo-root.mjs` | The source root the repository actually carries, preferring `.skilled`, or `null` when neither name holds the sentinel |
| `hoistAboveOpencodeTree(dir)` | `repo-root.mjs` | Directory containing the outermost source-root segment, or `null` when `dir` is not inside one |

`PackageRootOptions` accepts `markers` to replace the defaults and `maxDepth` to cap the walk. `findRepoRoot` accepts `maxDepth` and a `sentinel` override.

---

## 5. RELATED

- [`shared/`](../README.md)
- [`system-spec-kit` architecture](../../ARCHITECTURE.md)
