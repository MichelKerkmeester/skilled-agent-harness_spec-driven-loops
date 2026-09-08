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

---

## 6. ROUND TWO (DeepSeek V4 Flash max through DevPass, 10 iterations on the remediated tree)

Source: `lineages/deepseek-v4-flash-shared-package/research.md`, stop reason `maxIterationsReached`, 49 rows: 7 P1, 42 P2 including verified-positive and recorded rows. Censused in the main checkout on 2026-09-07 before child `015-shared-package-post-remediation-cleanup` was opened.

### Verdict held

Child 009 landed: no dangling importer in any of the five consumer trees, the removed tests and the CLI shim gone, the ML dependency relocated to the skill root, the CI lane wired. The round-two P1 rows are what the removal left behind and what the live half still duplicates.

### P1 rows

| ID | Claim | Census | Disposition |
|----|-------|--------|-------------|
| R1-01 | `main` still points at the deleted `dist/index.js` | Confirmed: neither `index.ts` nor `dist/index.js` exists | Fixed: field removed |
| R1-02 | The environment reference still teaches `SPECKIT_ROLLOUT_PERCENT` | Confirmed | Fixed in child 014 |
| R2-01 | Three database-directory derivations with two base semantics | Confirmed; after the profile cluster goes, two remain: the telemetry store in `config.ts` and the factory's candidate scan, which reads the advisor's active embedder from its sqlite | Recorded decision: both are live and serve different readers; the README now states how they differ instead of implying one resolution |
| R2-02 | A baseline row for the removed `shared/ranking/README.md` breaks the sk-doc parity test | Confirmed, with a second row for the removed `shared/mcp-server/database/README.md` | Fixed: both rows removed. The test still reports 36 other mismatches from sk-doc's own validator and fixture drift, none under this package; recorded for that skill's owner |
| R2-03 | A five-function database cluster in `profile.ts` has no consumer since `paths.ts` went | Confirmed: `findUp`, `resolveDefaultActiveProfileDbDir` and `resolveActiveProfileDbPath` had zero consumers | Fixed: removed; `createProfileSlug` and `parseProfileSlug` stay |
| R5-01 | Two parallel live Ollama implementations behind one package | Confirmed: `adapters/ollama.ts` is re-exported by the skill advisor's embedder registry and `providers/ollama.ts` is built by the factory; both reach the daemon | Recorded decision not to merge: 790 lines of the advisor's live embedding stack with two contracts; a merge is that skill's refactor, and no capability is lost by leaving both |
| R7-01 | `scoring/folder-scoring.ts` has no production consumer | Confirmed: two runtime tests and one comment | Fixed: module, its README and both tests removed; the comment rewritten |

### P2 rows

| ID | Claim | Disposition |
|----|-------|-------------|
| R3-01 | README §5 reader columns omit files for three groups | Fixed: every row is now computed from the files that read the variables |
| R4-01 | The socket file name is declared in three places and asserted nowhere | Fixed: the server exports the constant and its test holds the two bin scripts to it |
| R6-01 | The `./review-research-paths.cjs` export entry has no consumer | Kept: the CLI's review-research-paths test reaches the module through it |
| R6-02, R6-03 | Eight root-resolution implementations with divergent predicates | Recorded decision: the hooks cannot import the workspace package, the compiled CLI cannot import the ESM module synchronously, and the generator stays dependency-free; the copies are the boundaries, not accidents |
| R1-03 | A test comment names the removed `quality-extractors.test.ts` | Fixed |
| R2-04 | `EmbeddingProfileExtended` has no consumer | Fixed: removed |
| R4-03 | The isolation doctrine is comment-enforced, not CI-enforced | Recorded; the decision stands as round one made it |
| R5-02, R5-04, R9-01 | Unreachable adapter branches, two backend taxonomies, a two-symbol type boundary | Recorded with R5-01: the advisor stack's shape |
| R7-02 | `tree-thinning.ts` re-exports `estimateTokenCount` for one test | Fixed: the test imports the shared module and the re-export is gone |
| R8-01 | `jsonc-strip.ts` and `context-types.ts` have no tests | Fixed: one script-style test each, in the package's own lane |
| R8-03 | The test glob names a `scoring/` directory with no tests | Fixed: the glob is gone with the directory; `utils/` now carries a test |
| R4-04, R7-03, R8-02, R10-01 to R10-03 | Verified-positive rows | Hold |

### Re-verified decisions

The `predicates/boolean-expr` keep holds on its four citations; the two-spelling override keep holds; the advisor isolation doctrine holds with its justification corrected; round one's "adapter is a shim" was wrong and is corrected by R5-01, which changes nothing about the 009 removal.


---

## 7. ROUND THREE (DeepSeek V4 Flash max through DevPass, five bounded iterations on the twice-remediated tree)

Source: `lineages/deepseek-v4-flash-shared-package-r3/research.md`, stop reason `maxIterationsReached`, 22 findings: 7 P1, 15 P2, five bounded angles. The GLM 5.3 Flash attempt that ran before the operator switched executors is kept under `lineages/glm-5-3-flash-shared-package-r3-partial/` as supplementary evidence. Censused in the main checkout on 2026-09-07 before child `021-shared-readme-generator-and-dead-exports` was opened.

| Rows | Claim | Census | Disposition |
|------|-------|--------|-------------|
| R3-I5-01 | No generator exists for the README table child 015 called generated | Confirmed: the table came from a scan that was never committed | Fixed: a generator with print, write and check modes, and a test that runs the check under `npm test` |
| R3-I5-02/03/04/05 | Row attributions name consumers that do not import; a reader is missing; the grouped union misattributes; a Gate 3 row overstates | Confirmed | Fixed: the table is one row per variable from the scan; the text-helpers row names the providers |
| R3-I3-01 | The budget-allocator export entry has no external consumer | Confirmed for production code | Recorded: the runtime's test imports it through the package, which is a consumer of the public surface |
| R3-I3-02/03 | `stringifyFrontmatter` and `escapeRegex` have no importer | Confirmed | Fixed: removed with their test lines; the two local regex escapes stay local |
| R3-I3-04/05/06/07/08 | Helper modules are tested only from the runtime | Confirmed | Fixed for retry and chunking with shared-side tests; recorded for the rest in the README's build note |
| R3-I4-02 | The mirror job requires the package with no install step | Confirmed, and never exercised because the job had never run on a push | Fixed: an install step before the checks |
| R3-I4-01 | The parity workflow builds the package for a checker that imports source | Confirmed | Fixed: the build step is gone and the comment says why |
| R3-I1-03, R3-I4-03/04 | Two neighbours declare the package as a file dependency and nothing builds it for them; typecheck and runtime resolve different surfaces | Confirmed | Documented in the README's build note |
| R3-I2-01 | A comment describes a re-export a round-two fix removed | Confirmed | Fixed |
| R3-I2-02 | The validator's `ParsedFrontmatter` collides with the package's | Confirmed | Fixed: renamed for what it is |
| R3-I1-01/02 | Import-extension inconsistency in the advisor | Confirmed | Recorded: the advisor is another lane's surface |
| GLM partials | Two GLM iterations on cross-skill consumers and type duplication before the switch | Read | Their rows overlap iterations 1 and 2 and are covered above |
