# Iteration 3 — Exports without consumers, and without tests

Angle: every symbol the barrel exposes (package.json `exports` `./*` -> dist plus explicit entries), sampled across modules; for each chosen symbol, search runtime/cli/sk-doc/deep-loop for an importer and shared/ for a test naming it. A symbol with no importer, or with an importer and no shared-side test, is a finding.

Sample (12 symbols, one per module cluster): parseFrontmatter/stringifyFrontmatter, mergeCompactBrief/MergeInput, allocateBudget/createDefaultSources, semanticChunk, canonicalFold, trigger-extractor (removeMarkdown), classifyPrompt/validateSpecFolderBinding/FILE_WRITE_TRIGGERS/GATE_3_VOCABULARY, estimateTokenCount, retryWithBackoff, validateFilePath/escapeRegex, isPathInsideRoot/assertPathInsideRoot, stripJsoncComments.

## Findings

1. **R3-I3-01 (P1) `./budget-allocator` export entry has no external consumer; the module is only reached by an internal relative import.**
   Claim side: shared/package.json:11 lists `"./budget-allocator": "./dist/budget-allocator.js"` as an explicit barrel entry.
   Actual side: the only importer of budget-allocator is shared/compact-merger.ts:5 (`'./budget-allocator.js'`, relative, inside the package). No `@spec-kit/shared/budget-allocator` import exists in runtime, cli, sk-doc, deep-loop or the advisor (grep verified). The runtime test runtime/tests/budget-allocator.vitest.ts:5 imports the module by source-relative path, not via the package entry.
   Severity: P1 (unused export entry + a package-public surface with no public consumer). Recommendation: drop the explicit entry and internalize the module (the `./*` catch-all keeps dist reachable either way), or document it as internal.

2. **R3-I3-02 (P1) `stringifyFrontmatter` has no production importer anywhere.**
   Claim side: shared/frontmatter/parse-frontmatter.ts:140 exports `stringifyFrontmatter`.
   Actual side: every occurrence of the symbol in the tree is the definition + its own test (shared/frontmatter/parse-frontmatter.test.ts:5,85). No consumer in runtime, cli, hooks, sk-doc, deep-loop, or the advisor.
   Severity: P1 (dead export; census L9 cleared stale exports but did not name this one). Recommendation: remove the export, or wire a round-trip consumer.

3. **R3-I3-03 (P2) Shared `escapeRegex` has zero consumers; two local duplicates exist in runtime.**
   Claim side: shared/utils/path-security.ts:115 exports `escapeRegex`.
   Actual side: no file imports it; runtime/cli/continuity/migrate-trigger-phrase-residual.ts:154 and runtime/cli/utils/spec-affinity.ts:134 each define their own (identical-purpose) local `escapeRegex` instead.
   Severity: P2 (unused export exposed; duplication). Recommendation: remove the shared export or repoint the two locals to it.

4. **R3-I3-04 (P2) `retryWithBackoff` module has no test anywhere.**
   Claim side: shared/utils/retry.ts exports retryWithBackoff and the status-code/error-pattern sets; census L1 kept it ("imported by the OpenAI and Voyage providers and stays").
   Actual side: that reason holds (providers/openai.ts:7, providers/voyage.ts:7, both live via factory.ts:11,21), but `grep` for retry* across all shared and runtime tests finds no test naming retryWithBackoff or utils/retry — the kept module is untested, which the census row never claimed to the contrary.
   Severity: P2 (test gap). Recommendation: add a shared test; the provider behavior is load-bearing.

5. **R3-I3-05 (P2) `chunking.ts` has no external production consumer and no shared-side test.**
   Claim side: shared/chunking.ts exports semanticChunk, MAX_TEXT_LENGTH, RESERVED_OVERVIEW, RESERVED_OUTCOME, MIN_SECTION_LENGTH.
   Actual side: prod importers are internal relatives only (embeddings/providers/ollama.ts:7, hf-local.ts:13); the only runtime-side importer is a test (runtime/tests/chunking-semantic.vitest.ts:10); no shared/*.test.ts names it. README.md:37 lists chunking under "the save pipeline, the hooks, the embedding providers" — the save pipeline and hooks do not import it (grep verified).
   Severity: P2 (module used only internally; README overstates consumers; no package test). Recommendation: keep (internal util) but fix the README claim and add a package-side test.

6. **R3-I3-06 (P2) compact-merger has consumers but no shared-side test.**
   Claim side: shared/compact-merger.ts exports mergeCompactBrief/MergeInput/SharedPayload*; runtime/hooks/claude/compact-inject.ts:20 imports it (production hook consumer, verified) — but the package test glob (`*.test.ts` root + 6 subdirs) sees no compact-merger test file in shared.
   Actual side: the only coverage is runtime/tests/compact-merger.vitest.ts — outside the package's own test suite (shared/package.json:17).
   Severity: P2 (coverage lives in the wrong tree; package test glob silently omits). Recommendation: move/copy a package-side test, or document that runtime owns its tests.

7. **R3-I3-07 (P2) The Gate 3 machine-contract module has no shared-side test, and its only test + its only hook importer resolve the compiled dist, not the source.**
   Claim side: shared/gate-3-classifier.ts (classifyPrompt, validateSpecFolderBinding, FILE_WRITE_TRIGGERS, GATE_3_VOCABULARY, READ_ONLY_DISQUALIFIERS, ...) is cited as the authoritative machine contract.
   Actual side: the shared package has no gate-3-classifier test; runtime/cli/tests/gate-3-classifier.vitest.ts:23 imports `'../../shared/gate-3-classifier'`, which from runtime/cli/tests resolves through the `runtime/shared -> ../shared/dist` symlink to the compiled dist; the hook importer spec-gate-core.mjs:54 imports `'../../../../shared/dist/gate-3-classifier.js'` explicitly. The module's own comment block (spec-gate-core.mjs:1049-1051) states the dist build exports only validateSpecFolderBinding/classifyPrompt — the trigger/constant exports (FILE_WRITE_TRIGGERS, GATE_3_VOCABULARY, ...) are imported by the test only, from dist.
   Severity: P2 (source/dist resolution seam; constants unused in production). Recommendation: test the source via the vitest alias already configured at runtime/vitest.config.ts:36-37 (`@spec-kit/shared` -> shared source), and confirm which exports are genuinely needed.

8. **R3-I3-08 (P2) Cluster: five shared modules have package-level test gaps.**
   Claim: shared/package.json:17 test glob covers root + frontmatter/parsing/predicates/embeddings/ipc/utils only.
   Actual: estimateTokenCount (utils/token-estimate.ts), canonicalFold (unicode-normalization.ts), trigger-extractor.ts, path-containment.ts, path-security.ts have no shared/*.test.ts; coverage exists only in runtime tests (tree-thinning.vitest.ts, adversarial-unicode.vitest.ts, trigger-extractor.vitest.ts, path-containment.vitest.ts, unit-path-security.vitest.ts). The tests themselves import the source (runtime/tests) or dist aliases (cli tests) inconsistently.
   Severity: P2 (who-owns-the-test ambiguity; the package's own suite does not cover half its live surface). Recommendation: one documented rule — package-side tests for shared modules, or a glob that includes algorithms/ too.

## Verified correct (no finding)

- parseFrontmatter: consumers verified (sk-doc x4, deep-loop runtime, advisor x2, cli x3+) and shared test exists (frontmatter/parse-frontmatter.test.ts) — fully covered.
- createEmbeddingsProvider/resolveProvider/getAdapter/getManifest/listManifests/MANIFESTS: consumers (advisor factory usage, skill-graph-db.ts:18, launcher, parity test) + shared tests (embeddings/registry.test.ts, auto-select.test.ts, profile.test.ts, model-server-constants.test.ts) — covered.
- stripJsoncComments: consumer runtime/cli/core/config.ts:11 + shared utils/jsonc-strip.test.ts (census R8-01 fix holds).
- canonicalFold: 7 production importers (hooks shared-provenance/compact-inject/hook-state, cli/lib/unicode-normalization, trigger-phrase-sanitizer, skill-label-sanitizer, shared/shared-payload) + 2 runtime tests — covered.
- TELEMETRY_STORE_DIR (config.ts:47): importer gate-3-classifier.ts + shared config.test.ts — covered (census L2 fix holds).
- SOCKET_FILE_NAME: shared ipc/socket-server.test.ts asserts the bin scripts (census R4-01 fix holds).
- boolean-expr: no code importer but census-kept documentary contract — not re-reported.

## Open questions

- O4: Who owns tests for modules living in shared but consumed only by runtime (compact-merger, chunking, budget-allocator, retry)? The package.json glob and the runtime vitest tree disagree by design or by accident.
- O5: Does the `runtime/shared -> ../shared/dist` symlink exist precisely so the hooks can import the compiled classifier without a workspace install — and if so, is testing the dist (not the source) intended or a drift risk? (Build-chain angle, iteration 4.)
