# Research — Round Three: @spec-kit/shared five new angles (DeepSeek V4 Flash)

Lineage: `deepseek-v4-flash-shared-package-r3` — 5 iterations, stop reason `maxIterationsReached`, 22 findings (2 P1 new dead surface + 5 P1 attribution/mechanism rows + 15 P2). No edits; no repo tooling; all writes inside the lineage dir. Every row censused against earlier rounds via confirmed-findings.md (read once, iteration 1) — no censused row is re-reported except where new evidence contradicts its stated reason (R3-I5-01, and R3-I1-03/R3-I4-02 which are complementary to census L6, not re-reports).

---

## 1. CROSS-SKILL CONSUMERS (iteration 1)

The barrel is `shared/package.json` `exports` (no index.ts). All 8 named consumers resolve to existing symbols; no import reaches past the exports map; `bin/` has zero imports (one comment only).

| ID | Finding | Sev |
|----|---------|-----|
| R3-I1-01 | Import-extension inconsistency: advisor TS consumers import `@spec-kit/shared/frontmatter/parse-frontmatter` extensionless (skill-markdown.ts:12, doc-frontmatter.ts:12) while all CJS consumers use `.js`. Barrel maps both — consistency only. | P2 |
| R3-I1-02 | Vi-mock specifiers in advisor tests are extensionless (semantic-shadow-cosine.vitest.ts:33, semantic-shadow-ablation.vitest.ts:9, refresh-roundtrip.vitest.ts:58-59, seed-skill-embeddings.ts:10, lane-weight-sweep.vitest.ts:9) while production imports use `.js` (skill-graph-db.ts:18). Mock-vs-production specifier split. | P2 |
| R3-I1-03 | deep-loop runtime (package.json:15) and sk-doc (package.json:11) declare `file:` deps on @spec-kit/shared but neither builds it; `shared/dist/**` is untracked (git ls-files: no match). Only the advisor's mcp-server package.json:8 builds shared. Fresh checkout: requires resolve (exports map) to a file that exists only after an undeclared manual build. Complementary to census L6 (resolution environment) — new evidence: the build step is missing, not just the resolution. | P1 |

## 2. TYPE DUPLICATION (iteration 2)

No consumer re-declares the shared context-type family (frontmatter-migration.ts:15 imports them), no EmbeddingProfile/ProviderMetadata duplicates in runtime/, no config-shape duplicate post-009.

| ID | Finding | Sev |
|----|---------|-----|
| R3-I2-01 | tree-thinning.ts:78-80 comment claims "re-export for backward compatibility" but no re-export exists (import line 79, use line 228 only). Residue of census R7-02's fix — the comment lines survived. | P2 |
| R3-I2-02 | Name collision: runtime/lib/validation/spec-doc-structure.ts:95 declares `ParsedFrontmatter { rawBlock; error; memoryError; ... }` — a different shape than shared's exported `ParsedFrontmatter { frontmatter; body; raw }` (parse-frontmatter.ts:18); orchestrator.ts imports both modules in one file (lines 10,14), so two shapes of one name coexist in one module. | P2 |

## 3. EXPORTS WITHOUT CONSUMERS / TESTS (iteration 3)

| ID | Finding | Sev |
|----|---------|-----|
| R3-I3-01 | `./budget-allocator` explicit export entry (shared/package.json:11) has no external consumer; the only importer is an internal relative import (compact-merger.ts:5). | P1 |
| R3-I3-02 | `stringifyFrontmatter` (parse-frontmatter.ts:140) has zero production importers — only its own test. | P1 |
| R3-I3-03 | Shared `escapeRegex` (path-security.ts:115) has zero consumers; two local duplicates exist (migrate-trigger-phrase-residual.ts:154, spec-affinity.ts:134). | P2 |
| R3-I3-04 | `utils/retry.ts` (census-kept, reason: imported by OpenAI/Voyage providers — holds) has no test anywhere (shared or runtime). | P2 |
| R3-I3-05 | `chunking.ts` has no external production consumer (only internal providers + runtime test) and no shared-side test; README:37 overstates "save pipeline, hooks" consumers. | P2 |
| R3-I3-06 | compact-merger has a prod consumer (hooks/claude/compact-inject.ts:20) but no shared-side test; coverage lives only in runtime/tests (package test glob can't see it). | P2 |
| R3-I3-07 | Gate 3 classifier: no shared-side test; its only test (runtime/cli/tests/gate-3-classifier.vitest.ts:23) resolves through the `runtime/shared -> ../shared/dist` symlink to compiled dist; the hook import is explicit dist (spec-gate-core.mjs:54); trigger/constant exports are imported by the test only. | P2 |
| R3-I3-08 | Five modules (token-estimate, unicode-normalization, trigger-extractor, path-containment, path-security) have no shared-side tests; the package glob covers root+6 subdirs but those files' coverage lives only in runtime tests. | P2 |

## 4. THE BUILD CHAIN (iteration 4)

| ID | Finding | Sev |
|----|---------|-----|
| R3-I4-01 | command-tree-parity.yml:28-34 builds shared to satisfy "checkers require @spec-kit/shared ... .js subpaths point at compiled dist" — but the only checker (sync-runtime-mirrors.cjs:32) imports `@spec-kit/shared/workspace/repo-root.mjs`, a checked-in source file; no compiled subpath is imported by anything the workflow runs. Meanwhile the real dist consumers (spec-gate-core.mjs:54 shared/dist/gate-3-classifier.js, :32 advisor mcp-server/dist/policy-plan.js) are not built by this workflow. | P1 |
| R3-I4-02 | spec-kit-check.yml `mirrors` job runs sync-runtime-mirrors.cjs / sync-agents.cjs / sync-prompts.cjs (each `require('@spec-kit/shared/workspace/repo-root.mjs')`) after checkout+setup-node only — no `npm ci`, so the `node_modules/@spec-kit/shared` symlink (verified to exist only after the root install) is absent on a clean checkout. | P1 |
| R3-I4-03 | CLI typechecks against shared source (`paths: @spec-kit/shared/* -> ../../shared/*`) but executes against shared dist (node_modules exports). spec-gate-core.mjs:1049-1051 itself documents the surface divergence. | P2 |
| R3-I4-04 | The only Gate 3 classifier test loads compiled dist via the `runtime/shared` symlink while sibling relative imports (chunking-semantic.vitest.ts:10) load source — same package, two surfaces chosen by directory rather than intent. | P2 |

## 5. THE GENERATED README READER TABLE (iteration 5)

| ID | Finding | Sev |
|----|---------|-----|
| R3-I5-01 | No generator exists for README §5. Census R3-01 said "every row is now computed from the files that read the variables" — false in this tree: no script anywhere emits or validates the table (grep of table headers/vocabulary across .ts/.cjs/.mjs/.py/.sh: README only). Hand-maintained markdown; new evidence against the stated fix's reason. | P1 |
| R3-I5-02 | §5/§3 Text-helpers row attributes chunking.ts and utils/retry.ts to "the save pipeline, the hooks" — no save-pipeline or hooks importer exists; only shared-internal embedding providers import them. | P1 |
| R3-I5-03 | §5 Provider-selection row omits real reader embeddings/auto-select.ts:501 (reads EMBEDDINGS_PROVIDER). | P2 |
| R3-I5-04 | §5 Database row's grouped-union convention makes config.ts (reads only the two DB_DIR spellings) appear to read MEMORY_DB_PATH; per-row ambiguity the R3-01 fix was meant to remove. | P2 |
| R3-I5-05 | §3 Gate 3 row overstates: the pi plugin imports the hook core, not the classifier; spec-root-registry references it only in a comment (spec-root-registry.ts:92). | P2 |

## VERIFIED-CORRECT SUMMARY (positive controls)

- All 8 cross-skill consumer import lines resolve to real symbols; no import escapes the exports map.
- The advisor's `lib/embedders/*` re-export shims are pure `export *` mirrors (census R5-01 recorded decision holds; no name drift).
- No shared context-type/embedding/profile/config shape is re-declared in runtime/ or runtime/cli/.
- README §5 env rows for Ollama/HF/OpenAI/Voyage/Cascade/IPC/Rank-fusion match per-file process.env reads (verified one file at a time); rank-fusion's SPECKIT_RETRIEVAL_PROFILE_WEIGHTS is read via env[] (rrf-fusion.ts:278) and is correctly listed.
- spec-kit-check.yml `check` job IS a faithful reproduction of the dist chain (root ci + shared build + runtime build + cli build before shared tests/vitest).
- Census-fixed rows holding: jsonc-strip test (R8-01), SOCKET_FILE_NAME assertion (R4-01), telemetry store single source (L2), boolean-expr documentary contract, tree-thinning re-export removal (R7-02 — except now-stale comments, R3-I2-01), 009 removals complete at the importer level.

## CENSUS DISPOSITIONS RE-CONFIRMED (no new evidence found against them)

L1 removal completeness (algorithms barrel gone; rrf-fusion stands alone), L3 two-spelling keep, L5 hook-relative imports of the classifier stay, R2-01 two-live-derivations decision, R2-02/R2-03 fixed rows, R5-01 two-Ollama decision (both implementations live; verified factory.ts:18 builds providers/ollama.ts and registry exports adapters/ollama.ts), R6-01 kept export entry (used by cli test), R6-02/03 root-resolution copies (boundaries), R7-01 folder-scoring removal, R4-03 comment-enforced isolation.

## CONVERGENCE

Stop reason: maxIterationsReached (5/5; antiConvergence minIterations 5, no early synthesis). newInfoRatio trend: 0.9, 0.8, 0.85, 0.9, 0.85 — no collapse; each angle produced distinct new evidence. Questions q1-q5 answered; 9 open questions carried (O1-O9).

## OPEN QUESTIONS CARRIED

O1: Which CI step builds shared/dist before check-contract-drift.cjs and the sk-doc validators run (census L6 said main-checkout resolution works; R3-I1-03/R3-I4-02 say no step provisions it).
O2: Does algorithms/rrf-fusion belong in the shared package at all, given the advisor is its only consumer?
O3: Is the spec-doc-structure ParsedFrontmatter collision latent only (no same-module merge found)?
O4: Who owns tests for modules living in shared but consumed only by runtime (compact-merger, chunking, budget-allocator, retry)?
O5: Does the runtime/shared -> dist symlink exist so hooks import the compiled classifier without a workspace install — intended or drift risk?
O6: Which workflow provisions shared/dist and advisor dist before the spec-gate hooks run?
O7: Is spec-gate-core's import of system-skill-advisor/mcp-server/dist (cross-package dist) covered by any build-order contract?
O8: Which packet/commit last touched README §5, and with what evidence, given the "computed" wording is false?
O9: Does any CI job or doctor command validate README §5 reader rows? (None found.)
