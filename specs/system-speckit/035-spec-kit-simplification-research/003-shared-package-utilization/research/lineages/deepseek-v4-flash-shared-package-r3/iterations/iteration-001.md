# Iteration 1 — Cross-skill consumers of @spec-kit/shared

Angle: every consumer outside system-spec-kit found under sk-doc, system-deep-loop/runtime, system-skill-advisor and bin; what each takes; any import reaching a path the exports map does not cover or a symbol that does not exist.

Barrel definition (verified): there is no `index.ts`; the barrel is `shared/package.json` `exports` (shared/package.json:7-13): `./*` -> `./dist/*.js`, `./*.js` -> `./dist/*.js`, explicit `./workspace/repo-root.mjs`, `./review-research-paths.cjs`, `./compact-merger`, `./budget-allocator`. `"type": "module"` (line 5), version 1.7.2 (line 3).

## Findings

1. **R3-I1-01 (P2) Import-extension inconsistency in the advisor's TS consumers.**
   Claim side: system-skill-advisor/mcp-server/lib/utils/skill-markdown.ts:12 and lib/skill-graph/doc-frontmatter.ts:12 import `@spec-kit/shared/frontmatter/parse-frontmatter` **extensionless**.
   Actual side: every CJS consumer (sk-doc 4 scripts, deep-loop runtime/scripts/check-contract-drift.cjs:12) and all other advisor subpath imports use the `.js` form (`.../parse-frontmatter.js`, `.../embeddings/factory.js`); the exports map makes both resolve (`./*` and `./*.js`), so this is consistency, not breakage.
   Severity: P2 cosmetic. Recommendation: standardize on `.js`.

2. **R3-I1-02 (P2) Vi-mock specifiers in tests are extensionless while production imports use `.js`.**
   Claim side: mcp-server/tests/scorer/semantic-shadow-cosine.vitest.ts:33, tests/scorer/semantic-shadow-ablation.vitest.ts:9, tests/skill-graph/refresh-roundtrip.vitest.ts:58-59, tests/scorer/fixtures/seed-skill-embeddings.ts:10, tests/scorer/lane-weight-sweep.vitest.ts:9 mock/import `@spec-kit/shared/embeddings/factory` (extensionless).
   Actual side: production importer lib/skill-graph/skill-graph-db.ts:18 uses `@spec-kit/shared/embeddings/factory.js`. Both resolve today; the split invites a future mock that stops matching its production specifier.
   Severity: P2 cosmetic. Recommendation: standardize on `.js` in mocks too.

3. **R3-I1-03 (P1) Two consumer trees declare the dependency but no script builds `shared/dist`, which is not git-tracked.**
   Claim side: system-deep-loop/runtime/package.json:15 and sk-doc/package.json:11 declare `"@spec-kit/shared": "file:../system-spec-kit/shared"` / `"file:../../system-spec-kit/shared"`.
   Actual side: neither package.json's scripts build shared; only the advisor's mcp-server/package.json:8 runs `npm --prefix ../../system-spec-kit/shared run build`. `git ls-files` (verified no match) shows `system-spec-kit/shared/dist/**` is untracked, so a fresh checkout has no dist; the CJS consumers `require('@spec-kit/shared/frontmatter/parse-frontmatter.js')` resolve (exports map) to a file that only exists after a manual, un-declared build. Census L6 dropped resolution as Environment in the main checkout; the missing build step is new evidence (this dist really is untracked here), complementary to L6, not a re-report.
   Severity: P1 wrong. Recommendation: add a shared build step (or prebuilt dist via `prepare`) to the two consumer trees, or document the manual build in README. (Full chain trace deferred to iteration 4.)

## Verified correct (no finding)

- All 8 named consumer import lines resolve to symbols that exist: parseFrontmatter (shared/frontmatter/parse-frontmatter.ts:58), fuseResultsMulti/RankedList/RrfItem (shared/algorithms/rrf-fusion.ts:805/832), autoSelectActiveEmbedder/AutoSelectedEmbedderProvider/AutoSelectMetadataStore/AutoSelectResult/EmbedderContentType (shared/embeddings/auto-select.ts:17-55), BackendKind (shared/embeddings/types.ts:18), createEmbeddingsProvider (shared/embeddings/factory.ts:1052), resolveProvider (factory.ts:755), getAdapter/getManifest/listManifests/listSupportedDimensions/MANIFESTS/NotImplementedError (shared/embeddings/registry.ts:34-109), canUnlinkExistingSocket/getIpcBridgeStats/parseMaxClients/resolveIpcSocketPath/startIpcSocketServer + 3 types (shared/ipc/socket-server.ts:520-533), OllamaAdapter/OllamaInputType/etc (shared/embeddings/adapters/ollama.ts:16-220).
- One import per consumer, no import reaches past the exports map into arbitrary deep files. The advisor's `lib/embedders/{types,adapter,registry,adapters/ollama}.ts` re-export shims are pure `export *` mirrors of shared modules (census R5-01 recorded; verified pure, no drift in names).
- `bin/` has **zero** imports of @spec-kit/shared; the only hit is a comment at bin/system-skill-advisor-launcher.cjs:288 describing the symlink. No finding.
- sk-doc dependency-root design (package.json:5 comment: dep at skill root so scripts/ and shared/scripts/ both resolve) is coherent; manual-testing-playbook's validator resolves through it.
- Runtime/sk-doc/adviser mcp-server `file:` dep paths resolve to `.opencode/skills/system-spec-kit/shared` via relative walk (all three correct).

## Open questions

- O1: Where does the fresh-checkout CI actually build shared/dist before running check-contract-drift.cjs and the sk-doc validators? (Iteration 4's angle; census L6 said resolution works in the main checkout, so node_modules there may have been built ad hoc.)
- O2: Since `fuseResultsMulti` is the only runtime symbol the advisor takes from `shared/algorithms/`, does the algorithm module belong in the package at all? (Deferred to iteration 3's consumer census.)
