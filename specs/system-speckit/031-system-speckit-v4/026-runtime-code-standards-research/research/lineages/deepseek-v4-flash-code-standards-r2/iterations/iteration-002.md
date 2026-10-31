# Iteration 2: runtime/cli/spec-folder, continuity, graph, templates, utils (TypeScript)

## Focus
Priority surface 2 — `runtime/cli/spec-folder/`, `runtime/cli/continuity/`, `runtime/cli/graph/`, `runtime/cli/templates/`, `runtime/cli/utils/` TypeScript source: boundary integrity, naming, coverage deviations, and duplicated helpers.

## Findings

### F2.1 [P1] `resolveRepoRoot()` reimplemented locally across four cli modules; the `graph/` pair is byte-identical
- **Code:** `runtime/cli/graph/backfill-graph-metadata.ts:240` and `runtime/cli/graph/migrate-generated-json.ts:149` (byte-identical file-walk root resolver); plus `runtime/cli/continuity/migrate-trigger-phrase-residual.ts:181,205` and `runtime/cli/continuity/backfill-frontmatter.ts` (a different, constant-anchored `LIVE_REPO_MEMORY_ROOT` technique).
- **Standard:** `shared/code-organization/imports-and-exports.md` §1 (single source of truth for a helper); `universal/code-quality-standards.md` §7 design-restraint ladder rung 4 (reuse an already-installed/available helper before reimplementing).
- **What is present:** The two `graph/` functions walk `process.cwd()` then ascend `moduleDir`, returning the first ancestor containing `specs/`, else a hardcoded five-level fallback — identical line for line. Both files are in the same directory and both iterate `path.join(resolveRepoRoot(), 'specs')` (backfill-graph-metadata.ts:321, migrate-generated-json.ts:597). No canonical `@spec-kit/shared` / `runtime/lib` repo-root resolver exists (`grep` across shared/, runtime/lib, runtime/api returns none), so there is no shared helper to call. The `continuity/` pair approaches it differently (constant + `path.resolve`). This is distinct from the `findRepoRoot` copies at the retrieval/hooks/codex `.mjs`/`.cjs` sites already consolidated in a prior pass.
- **Severity:** P1 — a root-resolution change (e.g., a different `specs` anchor) must be applied to two identical copies plus two divergent ones; the graph pair is a maintenance hazard specifically because it is copy-pasted.
- **One-line fix:** **judgment-required** — extract one `resolveRepoRoot()` into a shared `runtime/cli/utils` util (or `@spec-kit/shared`) and have `graph/backfill-graph-metadata.ts` and `graph/migrate-generated-json.ts` import it; then decide whether `continuity/`'s constant-anchored variant is intentionally divergent.

### F2.2 [P1] `utils/fact-coercion.ts` is a live public surface with no focused happy-path/edge test
- **Code:** `runtime/cli/utils/fact-coercion.ts:26` (`coerceFactToText`), `:104` (`coerceFactsToText`, with `structuredLog` warn on drop).
- **Standard:** `universal/code-quality-standards.md` §4 P1#2 (test coverage at boundaries — happy path plus at least one edge case per public surface).
- **What is present:** `fact-coercion.ts` exports two public functions consumed by five extractors (`extractors/conversation-extractor.ts:14,220`, `collect-session-data.ts:20,621`, `file-extractor.ts:11,98,395,456`, `diagram-extractor.ts:11,152`, `decision-extractor.ts:12,455`) and is barreled at `utils/index.ts:62-69`. It has a clear edge surface (string, nullish, object-with-text, serializable object, unserializable object via the `JSON.stringify` `try/catch`, primitive) yet no test file references `fact-coercion` or either exported function (`grep` over `runtime/cli/tests` returns zero hits).
- **Severity:** P1 — public, widely-used coercion logic with a non-trivial drop path (object shaped, unserializable object) has no coverage; a regression in the drop/`structuredLog` path would be silent. Framed as "no focused/direct test reference", not "definitely uncovered at runtime".
- **One-line fix:** **mechanical-adjacent / judgment-required** — add a `tests/facts-coercion.vitest.ts` covering the happy path (string / primitive) plus edge cases (nullish drop, `{text}` object, unserializable object) and the drop-count `structuredLog` warn.

## Sources Consulted
- `runtime/cli/graph/backfill-graph-metadata.ts:240,321`
- `runtime/cli/graph/migrate-generated-json.ts:149,597`
- `runtime/cli/continuity/migrate-trigger-phrase-residual.ts:181,205`
- `runtime/cli/utils/fact-coercion.ts:26,104`
- `runtime/cli/utils/index.ts:62-69`
- `runtime/cli/extractors/{conversation,collect-session-data,file,diagram,decision}-extractor.ts`
- `runtime/cli/tests/` (no fact-coercion reference)
- `shared/code-organization/imports-and-exports.md`
- `shared/references/universal/code-quality-standards.md` §4 P1#2

## Assessment
- **newInfoRatio:** 0.8
- **Novelty justification:** The repo-root duplication is new because the prior `findRepoRoot` consolidation was scoped to the retrieval/hooks/codex `.mjs`/`.cjs` sites — the `graph/` byte-identical pair and the `continuity/` constant-anchored resolvers were untouched. The `fact-coercion.ts` zero-coverage gap is new.
- **Confidence:** High for both (verified by byte-comparison of the two `resolveRepoRoot` bodies, and by repo-wide import/test greps). Confirmed-negatives for this surface: no `dist/`-path import, no snake_case declaration, clean reuse of `@spec-kit/shared/utils/path-security` and `@spec-kit/shared/frontmatter/parse-frontmatter`.

## Reflection
- What worked: Byte-comparing the two `graph/` root resolvers made the copy-paste duplication unambiguous rather than inferential; the absence of a canonical shared root resolver (`grep` in shared/, runtime/lib, runtime/api) confirms there is no helper these are bypassing.
- What failed: The redundant-barrel detector used in iteration 1 found no second instance here; boundary and naming angles returned only conforming negatives.
- Ruled out: Reporting a boundary break — the `@spec-kit/runtime/api` and `@spec-kit/shared/*` imports in these dirs are package-alias boundary-compliant, and there is no `dist/` import.

## Recommended Next Focus
Iteration 3 — `runtime/cli/rules/*.sh` and `runtime/cli/spec/*.sh` against the shell standards: exit codes, quoting, sourcing, documented flags vs parsed flags, dead helpers.
