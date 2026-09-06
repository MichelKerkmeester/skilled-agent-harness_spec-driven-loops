# Iteration 1: runtime/cli/core + runtime/cli/extractors (TypeScript)

## Focus
Priority surface 1 — `runtime/cli/core/` and `runtime/cli/extractors/` TypeScript source: error handling, dead exports, duplicate helpers, naming, and the coverage floor (happy path + one edge case per public surface).

## Findings

### F1.1 [P1] Two `quality-scorer.ts` modules export the same-named `scoreMemoryQuality` with divergent logic
- **Code:** `runtime/cli/core/quality-scorer.ts:140` (legacy 8-parameter `scoreMemoryQuality`) and `runtime/cli/extractors/quality-scorer.ts:105` (canonical `QualityInputs`-based `scoreMemoryQuality`).
- **Standard:** `sk-code-opencode/references/typescript/style-guide/overview-strict-and-naming.md` §5 (function + module naming; one canonical implementation) and `shared/code-organization/imports-and-exports.md` §1 (single source of truth for a helper).
- **What is present:** `core/quality-scorer.ts:139` docstring states "Legacy 8-parameter variant retained for backward compatibility. Prefer `scoreMemoryQuality` from `extractors/quality-scorer.ts`". Production code (`core/workflow.ts:40`) imports `scoreMemoryQuality` from `../extractors/quality-scorer.js`. The legacy `core/quality-scorer.ts` export is referenced by NO production caller — only by tests: `tests/quality-scorer-disambiguation.vitest.ts:9` (`scoreRenderQuality`) and `tests/description-enrichment.vitest.ts:3`. The disambiguation test exists precisely because two same-named functions produce different field sets (`buildRenderQualityScoreFields` vs `buildInputCompletenessScoreFields`). The two scorers also diverge in logic (legacy retains description-provenance scoring; canonical is V-rule based).
- **Severity:** P1 — a by-name collision means `import { scoreMemoryQuality } from '../core/quality-scorer'` vs `'../extractors/quality-scorer'` silently selects a different scoring algorithm; the legacy helper is maintained only to satisfy tests.
- **One-line fix:** **judgment-required** — rename the legacy export to `scoreMemoryQualityLegacy` (and `buildRenderQualityScoreFields` to a distinct name) so the two implementers are not confusable, or fold the legacy description-provenance behavior into the canonical scorer and delete the core module.

### F1.2 [P2] `core/memory-indexer.ts` is a retired, type-only stub whose exported types are never consumed
- **Code:** `runtime/cli/core/memory-indexer.ts:9` (`IndexingStatusValue`), `:17` (`WorkflowIndexingStatus`), `:25-26` (both re-exported).
- **Standard:** `universal/code-quality-standards.md` §7 design-restraint ladder rung 1 (YAGNI) and §3 P0#3 (no commented-out/dormant code); `shared/code-organization/imports-and-exports.md` §1 (an export should be consumable).
- **What is present:** The file is type-only, and its own body says "Legacy workflow-side indexing wrappers have been retired." Neither type is imported anywhere in `.opencode/` source, and `core/index.ts` does not barrel it. The canonical replacement already lives at `shared/parsing/quality-extractors.ts` (whose header notes "replaces duplicates in memory-indexer.ts").
- **Severity:** P2 — retired residue, no runtime behavior, but a misleading public-looking module that implies workflow-side indexing exists.
- **One-line fix:** **mechanical** — delete `core/memory-indexer.ts` (nothing imports it); the types it exported are unused.

### F1.3 [P2] `extractors/session-activity-signal.ts` is a redundant re-export shim
- **Code:** `runtime/cli/extractors/session-activity-signal.ts:5` (`export * from '../lib/session-activity-signal.js'`), duplicated by `runtime/cli/extractors/index.ts:14` (`export * from '../lib/session-activity-signal.js'`).
- **Standard:** `shared/code-organization/imports-and-exports.md` §3 (a barrel should be the single re-export surface for a module).
- **What is present:** The extractors `session-activity-signal.ts` is an empty shim re-exporting `lib/session-activity-signal.js`; `extractors/index.ts` already re-exports the same lib module directly. No source file imports `extractors/session-activity-signal` (repo-wide grep returns nothing). `extractors/README.md:74` lists `session-activity-signal.ts` as an extractors module even though its real definition lives in `lib/`.
- **Severity:** P2 — redundant surface plus a README/ownership mismatch.
- **One-line fix:** **mechanical** — remove `extractors/session-activity-signal.ts` and adjust `extractors/README.md:74` to point at `lib/session-activity-signal.ts`.

## Sources Consulted
- `runtime/cli/core/quality-scorer.ts:140`, `:139` (legacy docstring), `:359`
- `runtime/cli/extractors/quality-scorer.ts:105`
- `runtime/cli/core/workflow.ts:40`
- `runtime/cli/tests/quality-scorer-disambiguation.vitest.ts:8-14`
- `runtime/cli/tests/description-enrichment.vitest.ts:3`
- `runtime/cli/core/memory-indexer.ts:9-26`
- `runtime/cli/core/index.ts` (missing barrel for memory-indexer)
- `shared/parsing/quality-extractors.ts:22`
- `runtime/cli/extractors/session-activity-signal.ts`
- `runtime/cli/extractors/index.ts:14`
- `runtime/cli/extractors/README.md:74`
- `sk-code-opencode/references/typescript/style-guide/overview-strict-and-naming.md`
- `sk-code-opencode/references/shared/code-organization/imports-and-exports.md`
- `shared/references/universal/code-quality-standards.md`

## Assessment
- **newInfoRatio:** 0.9
- **Novelty justification:** The core/extractors `scoreMemoryQuality` duplication (two modules, same exported name, divergent logic, legacy one live only via tests) is new; the retired `memory-indexer.ts` type-only stub and the redundant `session-activity-signal.ts` shim are new to this packet.
- **Confidence:** High for all three (verified by repo-wide grep for consumers/imports and direct source reads). Confirmed-negatives for `any`, empty `catch {}`, non-`unknown` catch params, `process.exit`, `console.log`, and ephemeral-artifact-comment labels in core/extractors — those baseline scans returned zero hits.

## Reflection
- What worked: A named-export census across the two quality-scorer modules exposed the collision that per-file reads hide; dead export detection via repo-wide import grep was fast and decisive.
- What failed: The snake_case scan surfaced many hits, but nearly all are contract/domain-mapped (reason codes `path_fragment`/`standalone_stopword`/`synthetic_bigram` from `lib/trigger-phrase-sanitizer.ts`, memory-metadata fields `trigger_phrases`/`importance_tier`, `causal_links`), so they are covered by the documented snake_case exception and are not findings. The coverage-floor half of this angle was largely a confirming pass — core/ and extractors/ surfaces are broadly referenced by tests.
- Ruled out: Reporting `core/quality-scorer.ts`'s snake_case dimensions as a naming violation — they are domain/reason-code contract values.

## Recommended Next Focus
Iteration 2 — `runtime/cli/spec-folder`, `runtime/cli/continuity`, `runtime/cli/graph`, `runtime/cli/templates`, `runtime/cli/utils` (TypeScript): boundary/naming/coverage deviations and duplicated helpers.
