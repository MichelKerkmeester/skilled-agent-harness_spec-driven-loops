# Iteration 6: Job 2 angle B — root resolvers, directory derivations, layout assumptions

## Focus

Count every "find the root/directory" implementation in the current tree (post-009), compare in-package resolvers' predicates, and grade the new export-map entry for review-research-paths (added by the L5 fix — is it wired?).

## Findings

| # | path:line | Declared purpose | Observed | Severity | Recommendation |
|---|-----------|------------------|----------|----------|----------------|
| R6-01 | `shared/package.json:9` (`"./review-research-paths.cjs"`) vs `system-deep-loop/runtime/lib/deep-loop/artifact-root.cjs:17-18` | L5 fix: export entry for the path contract | The entry has **0 consumers**: `artifact-root.cjs` still requires the file via `path.join(__dirname, '..', '..', '..', '..', 'system-spec-kit', 'shared', 'review-research-paths.cjs')` — the relative bypass the entry was meant to legalize is still the only seam. The export entry is unwired dead weight (a specifier-import of it would resolve, but nobody writes one). | P2 | fix: repoint artifact-root.cjs to `require('@spec-kit/shared/review-research-paths.cjs')` (now that the entry exists) or drop the entry |
| R6-02 | `shared/config.ts:23-31` vs `shared/embeddings/factory.ts:243-254` vs `shared/embeddings/profile.ts:250-274` | "The skill root" | **Three predicates define the same root differently:** config walks for `runtime`+`shared`; factory walks for `runtime/cli`+`shared`; profile walks for `runtime/database`+`shared`, then a second walk for `.opencode/skills/system-spec-kit/runtime/database` (a repo-root-shaped walk). Shared code therefore knows and depends on runtime layout in three shapes — the charter's "shared assumes runtime or database layout it should not know" is concentrated here, not diffuse. | P2 | merge: one root resolver (repo-root.mjs or a config export); document the divergence if kept |
| R6-03 | inventory | Root-resolution implementations | **7 implementations** in the tree: 3 in-shared (config findUp+resolvePackageRoot; factory resolveSpecKitPackageRoot; profile findUp ×2), 1 shared repo-root.mjs (findRepoRoot, git-aware; the hooks' copy is a verified 7-line re-export of it — confirmed-findings L8 correction holds), 3 runtime-side (evals/check-source-dist-alignment.ts:98, evals/check-architecture-boundaries.ts:92, ops/retrofit-convention.mjs:1057, retrieval/generate-trigger-index.mjs:81 — observe: that's 4 runtime-side; the count is 3 in-shared + 1 shared-repo-root + 4 runtime-side = **8**). Absolute recount: the L2 fix removed 1 (paths.ts); the proliferation is unchanged in shape. | P2 | merge: the two eval resolvers + the two CLI resolvers could import repo-root.mjs |
| R6-04 | `shared/package.json:7-10` | Named export entries | `./compact-merger` + `./budget-allocator` used (compact: 1 production + 2 tests; budget: 1 test). `budget-allocator`'s production consumer is internal-only (`compact-merger.ts:5`) — the named entry's only package-boundary consumer is the test. Mechanically redundant with `./*` but matching what consumers write. | P2 (document) | document: budget-allocator entry = test-facing |
| R6-05 | `runtime/hooks/claude/compact-inject.ts:20` | PreCompact chain | Compact-merger production consumer confirmed (1 hook adapter + 2 tests); round-one's verified-positive compaction chain stands unchanged post-009. | P2 (verified-positive) | (none) |

## Ruled out this iteration

- Re-listing of L8's "diverged repo-root copy" — verified re-export (R6-03 control).
- The dist-freshness / bin launcher root usage (environment question, already dispositioned).

## Sources Consulted

- `shared/config.ts:13-45`, `shared/embeddings/factory.ts:243-254`, `shared/embeddings/profile.ts:250-274`
- `shared/workspace/repo-root.mjs:59`; `runtime/hooks/lib/workspace/repo-root.mjs` (full read)
- Definition sweep: findUp|resolvePackageRoot|resolveSpecKitPackageRoot|findRepoRoot over `shared` + `runtime` (checked-in)
- `system-deep-loop/runtime/lib/deep-loop/artifact-root.cjs:14-19`; `feature-catalog.md:36` (seam description)
- Consumer sweep: `@spec-kit/shared/review-research-paths.cjs` (0), `@spec-kit/shared/compact-merger` (3), `budget-allocator` (2)
- `runtime/cli/evals/check-source-dist-alignment.ts:98`, `check-architecture-boundaries.ts:92`, `ops/retrofit-convention.mjs:1057`, `retrieval/generate-trigger-index.mjs:81`

## Assessment

- newInfoRatio: 0.8 — R6-01 (unwired export entry — L5 half-complete), R6-02 (three divergent root predicates), R6-03 (fresh count: 8 root-resolution implementations) are new; R6-04/R6-05 verify.
- Confidence: high (direct reads; the count is a recount of the current tree, not a reuse).

## Reflection

- Worked: refusing to accept "export entry added" as "seam fixed" — following the actual require showed the bypass unchanged.
- Failed: none.
- Ruled out: named-entry redundancy (consumers write the named form; the "redundant vs ./" observation is map mechanics only).

## Recommended Next Focus

Iteration 7 (job 2, angle C): the kept modules' user census with production/test tiering — chunking (2 internal), retry (2 internal), token-estimate + path-containment (re-export shims in the CLI), context-types, trigger-extractor, unicode-normalization, jsonc-strip, path-security, memory-* parsing, spec-doc-health, folder-scoring, gate-3-classifier, types.ts crossing symbols — each verified to a runner, not to a README.
