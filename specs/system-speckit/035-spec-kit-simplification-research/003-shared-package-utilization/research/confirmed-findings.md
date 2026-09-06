---
title: "Confirmed findings: shared package utilization"
description: "Every P1 row from the GLM 5.3 Flash synthesis over @spec-kit/shared, censused against the real tree, with the corrections the census forced and the remediation each row was handed to."
trigger_phrases:
  - "shared package confirmed findings"
  - "shared dead half census"
  - "embeddings monolith removal"
  - "database path theater"
importance_tier: "important"
contextType: "research"
---
# Confirmed findings: shared package utilization

Source: `lineages/glm-5-3-flash-shared-package/research.md` (10 of 10 iterations, stop reason `maxIterationsReached`, 53 findings). Every row was re-checked in the main checkout on 2026-09-07 with a file walk over the real tree: `.opencode`, the runtime mirrors, `.github` and the root, excluding the gitignored repository copy under `barter/`, the old worktree under `.worktrees/`, `specs/`, changelogs, benchmarks, `dist/` and `node_modules/`. The lane had run in worktree 046, whose unprovisioned shared root and cross-worktree symlinks produced several claims that do not hold in the main checkout; those are marked **Environment**.

---

## 1. THE TEN P1 ROWS

| ID | Claim | Census in the main checkout | Disposition |
|----|-------|-----------------------------|-------------|
| L1 | Eight surfaces, about 2,300 lines, have no production importer | Confirmed for the embeddings monolith, the algorithms barrel, adaptive fusion, the MMR reranker, the learned combiner, matrix math, the retrieval-trace contracts, the quality extractors and the structure-aware chunker: each was imported only by the root barrel or by tests. **Corrected in four places:** `utils/retry.ts` is imported by the OpenAI and Voyage providers and stays; the CLI embeddings shim had one importer, an unused import in `core/workflow.ts`; `context-types.ts` is imported by the frontmatter migration and stays; `predicates/boolean-expr.ts` has no code importer but the speckit and deep command contracts cite it as the grammar of their `when:` predicates, so it stays as a documentary contract. | Removed in 009 with their tests; the root barrel and the `./embeddings` export went with them. |
| L2 | Four to six derivations of one database directory, a sentinel nobody writes, a directory that does not exist | The directory exists and holds `access-telemetry.json`, written by the engine; the claim that it does not exist was the worktree's. The `.db-updated` path was derived in `shared/config.ts` and `runtime/core/config.ts` and read only through `path.dirname()` by the Gate 3 classifier and the telemetry store. The runtime block, `shared/paths.ts` and its `DB_PATH` derivation had no production consumer beyond that block and two tests of the retired resolution. | Fixed in 009: `shared/config.ts` exports the telemetry directory itself, both readers use it, the runtime block and `shared/paths.ts` are removed with their two tests. |
| L3 | Twenty-four env reads, seven documented; a two-spelling family | Confirmed: `VOYAGE_API_URL` in the profile against `VOYAGE_BASE_URL` in the provider and the probes; the README table listed seven of the variables the package reads. | Fixed in 009: the profile reads `VOYAGE_BASE_URL`; the README's configuration table now lists every variable by the module that reads it. The `SPEC_KIT_DB_DIR` and `SPECKIT_DB_DIR` pair stays, documented, because operator configs carry both. |
| L4 | The committed dist is stale and the freshness engine reports an unprovisioned root as fresh | **Environment.** In the main checkout `checkPackageFreshness('system-spec-kit/shared')` reports `fresh` and `check-all` passes; the stale hash and the unprovisioned status were the worktree's, where the shared root has no `node_modules`. | Dropped. |
| L5 | Four import mechanisms, an export map that predicts nothing, a three-symbol barrel | The root barrel had two importers, one a type-only import and one a test of the removed monolith. `review-research-paths.cjs` is required relatively by the deep-loop artifact root and had no export entry. | Fixed in 009: barrel and root export removed, the type import repointed, an export entry added for the path contract. The hooks' relative imports of the Gate 3 classifier stay: they live inside the same package. |
| L6 | Consumers declare the dependency but two of five install it; one resolution is broken; the test lane is not invoked | **Environment** for the resolution: from the sk-doc scripts, the deep-loop runtime and the advisor, `require.resolve` finds the package in the main checkout. The test lane was wired into CI by child 007 the day before. The `test:task-enrichment` no-op script was real. | Script removed in 009; the rest dropped. |
| L7 | The advisor duplicates a 73-line module for isolation while importing the embedding stack directly | Confirmed as described; the isolation doctrine is the skill advisor's, and its CI file is named differently from the claim. | Recorded decision: no change from this program; the advisor's boundary is the advisor's. |
| L8 | Four unwatched conventions couple the packages | **Corrected:** the hooks' `repo-root.mjs` is a seven-line re-export of the shared resolver, not a diverged copy. The two-spelling equivalence and the launcher's env allowlist are the advisor's contracts. The model-server socket directory and the owner-lease file name are declared twice, in the shared client and in the bin scripts that bind and write them, with only a comment keeping them equal. | Fixed in 009: a shared test now reads both declarations and fails on drift. The rest recorded. |
| L9 | Dead types, diverged contracts, stale exports | `EmbedderNotConfiguredError` is thrown inside the registry, so only its export was dead; `getVectorShardPath` had no caller; the `SharedPayload*` interfaces are used inside the compaction merger; `HfLocalDtype` was imported from a provider implementation; the README named a `code-graph-contracts.ts` and a `runtime/lib/providers/embeddings.ts` that do not exist. | Fixed in 009: the class is internal, the shard path method is gone, the dtype lives in the embedding types, the README is rewritten. The interfaces stay. |
| L10 | Dead weights inside live modules | Confirmed as trims: the `@huggingface/transformers` dependency the package declares but never imports, the dist that carried compiled test files, the no-op script. | Fixed in 009: dependency dropped with the lockfile updated, tests excluded from the build, script removed. |

---

## 2. WHAT THE LANE GOT WRONG, AND WHY

Every environment claim traces to the worktree the lane ran in: its shared root is consumed through other packages' symlinks and never installed, so the freshness engine reported it unprovisioned, `require.resolve` walked to the main checkout, and `runtime/database/` had never been created there. The lane's own caveats section named the resolution locus as inferred; the census confirms the inference and confines it to the worktree.

The utility module and the context types were miscounted because the lane searched for barrel-style specifiers and missed relative imports inside the package. The predicate module is the one case where a module with no code importer stays: a contract that other documents name as their grammar has a consumer, even if that consumer is a comment.

---

## 3. OPEN QUESTIONS CARRIED

1. Whether the skill advisor should keep its half-isolation from this package, or import everything it uses; the advisor's maintainers decide.
2. Whether the `SPEC_KIT_DB_DIR` and `SPECKIT_DB_DIR` pair should collapse to one spelling once no operator config carries the other.
