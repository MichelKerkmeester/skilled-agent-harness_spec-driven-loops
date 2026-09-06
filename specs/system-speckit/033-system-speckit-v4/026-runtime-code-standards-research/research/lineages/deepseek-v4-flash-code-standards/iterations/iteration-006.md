# Iteration 6: Naming & Structure Consistency

## Focus
Angle 6 — snake_case outside Python, mixed `.vitest.ts`/`.test.ts` test suffixes, and banner-numbering gaps across `shared/`, `runtime/lib`, `runtime/cli`.

## Findings

### F6.1 [P2] Mixed snake_case/camelCase keys in one frontmatter builder object
- **Code:** `runtime/cli/lib/frontmatter-migration.ts:1303-1314` — the return object binds `trigger_phrases`, `importance_tier` (snake_case) alongside `contextType`, `title`, `description` (camelCase). Local bindings at `:1256`, `:1303`, `:1306` are snake_case.
- **Standard:** `sk-code-opencode/references/typescript/style-guide/overview-strict-and-naming.md` §5 "Naming Conventions" — snake_case is reserved for properties that "directly map to database column names", and "for new code, prefer a mapping layer at the DB boundary (map to camelCase internally)". A YAML frontmatter key is not a database column.
- **What is present:** The builder mirrors `trigger_phrases`/`importance_tier` frontmatter keys as snake_case while the sibling `contextType` key is camelCase — inconsistent within one object, and outside the documented snake_case exception. The keys are data-mirrors, so the intent is defensible, but the standard's exception text does not literally cover frontmatter keys, and a single object mixes both styles.
- **Severity:** P2 (style/naming; low behavioral risk).
- **One-line fix:** **judgment-required** — either map internally to camelCase and translate at the YAML boundary, or extend the documented snake_case exception to cover frontmatter-key mirrors.

### F6.2 [P2] Test files use a `test-*.js/.cjs/.mjs` prefix naming pattern not in the convention table
- **Code:** `runtime/cli/tests/test-alignment-validator.js`, `test-ast-parser.js`, `test-five-checks.js`, `test-utils.js`, `test-validation-system.cjs`, and ~20 siblings in `runtime/cli/tests/`.
- **Standard:** `sk-code-opencode/references/shared/code-organization/directory-and-test-conventions.md` §3 "Test File Naming" — the documented patterns are `*.vitest.ts`, `*.test.ts`, `*.test.cjs`, `*.test.mjs`, `*.test.sh`, `test_*.py`. The table explicitly notes `*.test.js` is not a live convention; it lists no `test-*.js` (hyphen-prefix) row at all.
- **What is present:** Within the audited `runtime/cli/tests`, the suffix census is `*.vitest.ts`=265, `*.test.ts`=2, `*.test.mjs`=0, `*.test.cjs`=0, `*.test.js`=0, `*.test.sh`=0, `test_*.py`=1 — so the node `--test` naming convention is not used there. Instead, 20 `test-*.js/.cjs/.mjs` files sit beside the vitest suite using a pattern absent from the documented table. They are presumably invoked by a custom runner, but the naming is not discoverable from the convention.
- **Severity:** P2 (structure/consistency; risk is that a future reader or a generic `node --test` glob misses them).
- **One-line fix:** **mechanical** — rename to `*.test.mjs`/`*.test.cjs` (which the table documents) or add the `test-*.js` pattern to the convention table.

### F6.3 [Conforming] No `I`-prefixed interfaces outside the two documented legacy exceptions
- **Code:** full grep of `export (interface|class|type) I[A-Z]` across `shared/`, `runtime/lib`, `runtime/cli` excluding the two documented legacy aliases (`IEmbeddingProvider`, `IVectorStore`) returned zero rows.
- **Standard:** `overview-strict-and-naming.md` §5 "Legacy Exception" documents exactly two allowed `I`-prefixed names (`IEmbeddingProvider`, `IVectorStore`); all new interfaces omit the prefix.
- **What is present:** Conforming — no `I`-prefix creep.
- **Severity:** Baseline (no finding).

## Sources Consulted
- `runtime/cli/lib/frontmatter-migration.ts:1256,1303-1314`
- `runtime/cli/tests/*.test|vitest architecture` (suffix census) and `runtime/cli/tests/test-*.js` sample
- `sk-code-opencode/references/typescript/style-guide/overview-strict-and-naming.md` §5
- `sk-code-opencode/references/shared/code-organization/directory-and-test-conventions.md` §3

## Assessment
- **newInfoRatio:** 0.65
- **Novelty justification:** The mixed snake/camel frontmatter object and the non-convention `test-*.js` naming are new; the I-prefix check is a conforming negative.
- **Confidence:** High — all three checks are direct greps/reads. Banner-numbering gaps: a prior divider scan (iteration 1) found none, so this angle was not re-swept here.

## Reflection
- What worked: Reading the return-literal of the frontmatter builder surfaced the object-internal style inconsistency that a whole-file grep would have smoothed over.
- What failed: The `.vitest.ts` vs `.test.ts` "mixed suffix" concern turned out not to be a violation — both are live vitest conventions (2 `.test.ts` among 265 `.vitest.ts`), so the real discrepancy is the `test-*.js` prefix family, which is the opposite of the hypothesis.
- Ruled out: Reporting the `.vitest.ts`/`.test.ts` mix as a deviation (it is conforming).

## Recommended Next Focus
Angle 7 — coverage gaps: public CLI surfaces or rules missing a happy-path or edge test.
