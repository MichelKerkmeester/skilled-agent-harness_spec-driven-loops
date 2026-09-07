# Iteration 7: Job 2 angle C — kept modules' user census with production/test tiering

## Focus

For the modules 009 kept, verify each consumer to production termination (not to a README or a comment): re-export shims, test-only surfaces, and live chains. Recount; never reuse a round-one count.

## Findings

| # | path:line | Declared purpose | Observed | Severity | Recommendation |
|---|-----------|------------------|----------|----------|----------------|
| R7-01 | `shared/scoring/folder-scoring.ts` | Composite folder ranking logic | **0 production consumers** in the current tree. Recount: 2 test files import it (`runtime/tests/unit-folder-scoring-types.vitest.ts:12`, `runtime/tests/folder-scoring-overflow.vitest.ts:6`); `runtime/lib/utils/index-scope.ts:169` only comments on its multiplier. The "uncalled CLI" round one named as its only production importer is not present anywhere in the current tree (runtime/cli, runtime/lib, sk-doc, deep-loop, skill-advisor all searched; only the index-scope comment). It survived 009's dead-half removal without a production termination and without the CLI that was its justification. | **P1** | remove (or wire a caller); the two tests die with it |
| R7-02 | `runtime/cli/core/tree-thinning.ts:79-81` | "Re-export for backward compatibility" | The `estimateTokenCount` re-export has **0 consumers**; the shared `utils/token-estimate` is live through the internal call at `tree-thinning.ts:229` anyway. The compatibility line carries nothing. | P2 | document: drop the re-export line |
| R7-03 | `runtime/cli/utils/path-utils.ts:107-121` | path-containment re-export | Live: 3 production consumers (nested-changelog.ts:13, generate-description.ts:15, file-extractor.ts:20) + 1 test. The shared `utils/path-containment` is reached through this shim — the shim is the real import surface; not dead, but it IS a fourth re-export layer around a shared module. | P2 (document) | document: CLI path-utils is the sanctioned surface |
| R7-04 | `runtime/cli/lib/unicode-normalization.ts` (7-line re-export) + `mcp-server/lib/shared/unicode-normalization.ts` (duplicate copy) + 5 specifier imports | One 73-line module, three mechanisms | Live chain confirmed: shared → CLI shim → trigger-phrase-sanitizer.ts:7 (1 production consumer) plus 5 direct specifier imports (shared-provenance, skill-label-sanitizer, hook-state, compact-inject, shared-payload type) plus the advisor's duplicate (prompt-policy.ts:5). Round-one L7's "one module, three mechanisms" stands exactly; the recorded decision (advisor's maintainers own the boundary) still holds. | P2 (recorded) | (none) |
| R7-05 | `parsing/*.ts` consumers | Save-quality gates | All four live via the CLI save chain: `workflow.ts:58-61` (memory-sufficiency, memory-template-contract, spec-doc-health, secret-scrubber), `quality-gates.ts:10`, `frontmatter-editor.ts:13` (type), `memory-metadata.ts:15` (type) + tests. Round-one F5.2 verified-positive stands — live gates under retired names. | P2 (verified-positive) | (none) |
| R7-06 | `runtime/hooks/lib/spec-gate/spec-gate-core.mjs:54` + `cursor/spec-gate-prebind.mjs:25` | Classifier import seams | Confirmed-findings' recorded disposition holds: the relative-dist imports remain but live inside the same skill package and are documented in `hooks/lib/spec-gate/README.md:86` as the sanctioned seam. | P2 (verified/recorded) | (none) |

## Ruled out this iteration

- The unicode "three mechanisms" row as a new finding (L7 recorded; R7-04 verifies, doesn't re-list).
- The parsing stack as residue (live gates; R7-05).
- Re-listing compact-merger/path-security/jsonc-strip/trigger-extractor (round-one verified-positive tiers; no new evidence).
- The 009 "fold back" of quality-extractors into the parsing README (no residue found there).

## Sources Consulted

- `tree-thinning.ts:79-81,229`; `path-utils.ts:107-121` + consumer list (− tests)
- `runtime/cli/lib/unicode-normalization.ts` (full, 7 lines); `trigger-phrase-sanitizer.ts:7`; advisor `prompt-policy.ts:5`; runtime specifier consumer list
- folder-scoring: specifier census over all five trees + runtime internals (0 production); `index-scope.ts:169`
- `workflow.ts:58-61`, `quality-gates.ts:10`, `frontmatter-editor.ts:13`, `memory-metadata.ts:15` (parsing chain)
- `spec-gate-core.mjs:54`, `spec-gate-prebind.mjs:25`, `hooks/lib/spec-gate/README.md:86,119`

## Assessment

- newInfoRatio: 0.75 — R7-01 (folder-scoring = test-only survivor round one classed via a CLI that is no longer present) and R7-02 (dead re-export line) are new; R7-03..R7-06 verify recorded rows.
- Confidence: high (direct census; the folder-scoring CLI absence = searched all named trees; caveat: `.opencode/commands` scripts not searched for folder-scoring — noted in the row).

## Reflection

- Worked: hunting the "uncalled CLI" round one cited — it is genuinely absent today, which converts a kept row into an orphan row with fresh evidence.
- Failed: none.
- Ruled out: dist evidence; archives.

## Recommended Next Focus

Iteration 8 (job 2, angle D): test coverage per module against the floor — which of the 20+ remaining source modules have a colocated test, what the shared `npm test` glob actually matches (config.test.ts, frontmatter, parsing, predicates, embeddings, ipc, scoring, utils — tests exist for only some utils), the trigger-extractor test fate (was any runtime test deleted with it?), and who runs the shared test lane (CI wiring claim from child 007).
