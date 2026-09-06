# Iteration 2: Helpers Duplicating @spec-kit/shared or runtime/lib Exports

## Focus
Angle 2 — determine whether `runtime/cli` and `runtime/lib` reimplement functionality that `@spec-kit/shared` already exports, specifically frontmatter parsing, path containment, and repo-root resolution.

## Findings

### F2.1 [P1] Parallel frontmatter parser in `runtime/cli/lib/frontmatter-migration.ts` does not reuse the shared parser
- **Code:** `runtime/cli/lib/frontmatter-migration.ts:386` (`detectFrontmatter`), `:473` (`parseFrontmatterSections`), `:606` (`parseSectionValue`). The module imports `@spec-kit/shared/context-types` but NOT `@spec-kit/shared/frontmatter/parse-frontmatter`.
- **Standard:** `sk-code-opencode/references/shared/code-organization/imports-and-exports.md` §1 (reuse shared modules); `shared/references/universal/code-quality-standards.md` §7 Design-Restraint rung 5 ("Can it be one line?" / reuse existing). The canonical parser is `shared/frontmatter/parse-frontmatter.ts` and is imported by 15+ other modules (`runtime/cli/core/frontmatter-editor.ts:9`, `runtime/cli/lib/validate-memory-quality.ts:19`, `runtime/lib/parsing/content-normalizer.ts:11`, etc.).
- **What is present:** Two frontmatter readers coexist in the same package: the canonical shared `parseFrontmatter` (a single fence split + YAML mapping) and this module's own `detectFrontmatter`/`parseFrontmatterSections`/`parseSectionValue`. `runtime/cli/retrieval/lib/frontmatter.mjs:18` documents the tension: it reuses the shared parser but notes `frontmatter-migration.ts` was not reused because "its parseSectionValue collapses several distinct failure shapes into a single `undefined`".
- **Severity:** P1 — two hand-maintained fence/delimiter implementations that must stay synchronized; a fence semantics bug fixed in one is not inherited by the other.
- **One-line fix:** **judgment-required** — either delegate the fence split to `@spec-kit/shared/frontmatter/parse-frontmatter` and keep only the migration-specific value classifier, or document `frontmatter-migration.ts` as a sanctioned second parser in the module map.

### F2.2 [P2] Redundant barrel `runtime/cli/utils/memory-frontmatter.ts`
- **Code:** `runtime/cli/utils/memory-frontmatter.ts` (entire file) re-exports every symbol from `../lib/memory-frontmatter.js`. The implementation lives once; the barrel adds a second import path.
- **Standard:** `imports-and-exports.md` §3 "Export Patterns" — barrels are for re-exporting across submodules, not for mirroring the same module under a second path.
- **What is present:** `runtime/cli/utils/memory-frontmatter.ts` duplicates the public surface of `runtime/cli/lib/memory-frontmatter.ts`, so consumers can import from either path. Low behavioral risk.
- **Severity:** P2.
- **One-line fix:** **mechanical** — keep one import path and either delete the barrel or make it forward through `index` re-exports only.

### F2.3 [Conforming] Path-containment primitives re-export the shared module
- **Code:** `runtime/cli/utils/path-utils.ts:107-121` re-exports the containment primitives from `@spec-kit/shared/utils/path-containment`; `runtime/cli/core/workflow-path-utils.ts:20` imports `validateFilePath` from `@spec-kit/shared/utils/path-security`.
- **Standard:** `imports-and-exports.md` §3; universal reuse.
- **What is present:** These are reuse/re-export, not duplication. However `workflow-path-utils.ts:24-29` defines a local `normalizeFilePath` whose slash-normalization body (`replace(/\\/g,'/')`, `.replace(/^\.\//,'')`, `.replace(/\/+/g,'/')`, `.replace(/\/$/,'')`) recurs in `runtime/lib/graph/graph-metadata-parser.ts:920,946,988,1029` and `runtime/cli/spec-folder/folder-detector.ts:148`. The normalization pattern is the more meaningful duplication than the containment primitive.
- **Severity:** Reported as P2 note (normalization pattern duplication) rather than a hard finding.

## Sources Consulted
- `runtime/cli/lib/frontmatter-migration.ts:386,473,606`
- `runtime/cli/utils/memory-frontmatter.ts`
- `runtime/cli/utils/path-utils.ts:107-121`
- `runtime/cli/core/workflow-path-utils.ts:20,24-29`
- `runtime/lib/graph/graph-metadata-parser.ts:920,946,988,1029`
- `runtime/cli/spec-folder/folder-detector.ts:148`
- `runtime/cli/retrieval/lib/frontmatter.mjs:18`
- `sk-code-opencode/references/shared/code-organization/imports-and-exports.md`

## Assessment
- **newInfoRatio:** 0.85
- **Novelty justification:** The `frontmatter-migration.ts` parallel parser and the `utils/memory-frontmatter.ts` redundant barrel are new; the path-containment finding is a conforming baseline with a P2 normalization-pattern note.
- **Confidence:** High for F2.1/F2.2 (direct source reads); medium for F2.3's normalization recurrence (pattern similarity, not a full call-graph).

## Reflection
- What worked: Grepping import adjacency and "hand-rolled" delimiter detection across `runtime/cli` surfaced the parallel parser quickly, then confirmed it against the reuse set.
- What failed: Distinguishing genuine duplication from deliberate re-export required reading the shared vs migration modules; grep alone over-flagged `path-utils.ts`.
- Ruled out: Treating the path-containment re-export as a violation (it is correct reuse).

## Recommended Next Focus
Angle 3 — error handling and exit-code contract: swallowed exceptions, exit codes off the 0/1/2/3 contract, and inconsistent stdout/stderr in CLI entry points.
