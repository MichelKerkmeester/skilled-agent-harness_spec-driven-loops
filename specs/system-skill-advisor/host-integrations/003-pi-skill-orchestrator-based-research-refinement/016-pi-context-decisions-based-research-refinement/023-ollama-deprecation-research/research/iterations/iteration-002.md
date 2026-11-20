# Iteration 2: Consumers of the shared embeddings package and the HF model server

## Focus

Trace every consumer of `system-spec-kit/shared/embeddings` and of the HF model server (`hf-model-server.cjs`, `model-server-supervision.cjs`, `providers/hf-local.ts`, the auto-select cascade, spec-kit memory, the sk-doc validator, the spec-kit embedder test suites), to settle whether the package, the model server and the launcher's supervision block are deleted whole or in part.

Verdict up front: the package can be deleted whole. Its only production importer is the advisor lane that is being removed. Everything else that touches it is a test of the package itself, one script that reads a package file as text, and one type import inside the shared package. The HF model server, its supervision library and the launcher's supervision section go with it.

Path shorthand in the lists below: `K/` means `.skilled/skills/system-spec-kit/`, `R/` means `.skilled/skills/system-skill-advisor/runtime/`. Every source tag carries the full repo-relative path.

## Actions Taken

1. Read config, state log, strategy and iteration 1. One iteration record exists, so this is iteration 2; `iteration-002.md` and `iter-002.jsonl` did not exist.
2. Listed the tracked files of the package with line counts, and read the shared package's `package.json` and `tsconfig.json`.
3. Grepped every import-shaped reference to the package across `.skilled`, `.claude`, `.opencode`, `.codex` and `.pi` (excluding the package itself, `node_modules`, `dist`, `specs`), then listed exact import lines for code files outside the advisor.
4. Counted tracked files that mention the model-server family (`hf-model-server`, `model-server-supervision`, `hf-local`, the `HF_EMBED*` and `SPECKIT_HF_MODEL_SERVER*` keys, `system-hf-embed`).
5. Mapped imports inside the package, the advisor's non-test imports of it, and the `@huggingface/transformers` dependency entries and importers.
6. Read the sk-doc validator's loader, the launcher's model-server enable logic, the registry's canonical blocks, the existing memory residue sweeper and the factory's database path logic.
7. Checked this machine, read-only, for the model server's socket directory, a running server process, per-profile vector shards and a HuggingFace model cache entry.

## Findings

### F1. The package is 14 tracked files, exposed through a wildcard export and built without a clean step

- 14 tracked files, 5,376 lines: 11 TypeScript files (5,033 lines) and 3 READMEs. Largest: `factory.ts` 1,306, `providers/hf-local.ts` 1,176, `auto-select.ts` 559, `adapters/ollama.ts` 404. [INFERENCE: `git ls-files` plus `wc -l` over .skilled/skills/system-spec-kit/shared/embeddings, command output this run]
- The package has no export entry of its own. `@spec-kit/shared/embeddings/*` resolves through the wildcard rows that map any subpath to `dist`. Nothing in `package.json` has to be edited to remove the subpath. [SOURCE: .skilled/skills/system-spec-kit/shared/package.json:11]
- The shared TypeScript config includes every `.ts` file by glob, so there is no include row to remove either. [SOURCE: .skilled/skills/system-spec-kit/shared/tsconfig.json:12]
- `shared/dist/` has zero tracked files and currently holds a compiled `embeddings/` tree (adapter, auto-select, factory, profile, registry, types, `adapters/`, `providers/`). The shared build is a plain incremental `tsc --build` with no clean. After the sources are deleted, the stale compiled files stay on every machine and the wildcard export keeps resolving `@spec-kit/shared/embeddings/factory.js` from them. A leftover importer would therefore still load at runtime and still pass a non-typechecked test. The removal needs an explicit clean of `shared/dist/embeddings`, and the residue check has to look inside `shared/dist`. [SOURCE: .skilled/skills/system-spec-kit/shared/package.json:15] [INFERENCE: `git ls-files K/shared/dist` returned 0 and `ls K/shared/dist/embeddings` listed the compiled tree; TypeScript does not delete outputs of removed sources]

### F2. The advisor lane is the only production importer; spec-kit itself has none

- Advisor non-test importers, all inside the lane's own `lib/embedders/` folder that iteration 1 marked for whole deletion: `adapter.ts` 10, `adapters/ollama.ts` 7, `embeddings-health.ts` 12, `registry.ts` 14, `schema.ts` 16 to 17, `types.ts` 8. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/embedders/embeddings-health.ts:12] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/embedders/schema.ts:16]
- Inside `system-spec-kit`, a grep over every `.ts`, `.mjs`, `.cjs` and `.js` file outside the package found importers only in test files, plus one type import in `shared/types.ts` (F4). No handler, CLI, hook or library in spec-kit's runtime imports the package. [INFERENCE: `git grep` for the import patterns over K/ code files this run returned 13 test lines, `shared/types.ts:5` and nothing else; a dynamic import built from a computed string would escape this grep]
- The shared package's own README states the same ownership: the embeddings folder is the "Provider stack owned by the skill advisor", consumed by "the skill advisor and the HF model server launcher". [SOURCE: .skilled/skills/system-spec-kit/shared/README.md:116] [SOURCE: .skilled/skills/system-spec-kit/shared/README.md:40]
- "Spec-kit memory" is no longer a consumer. The memory MCP surface is retired and has its own residue sweeper. That sweeper deliberately leaves the database filename out of its term list "because the skill advisor's embedding profile still derives it". Once the package is gone that reason is void, so the memory sweeper's exemption should be revisited in the same change. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-memory-residue.mjs:5] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-memory-residue.mjs:122]
- Outside `system-spec-kit` and the advisor, no skill imports the package. `sk-design` has its own vector store on `node:sqlite` and did not appear in the importer grep; a residue grep on the bare word "embedding" will hit it and must be scoped. [INFERENCE: the importer grep over `.skilled` listed no `sk-design` file; its `vectors.mjs` import lines reference only `node:sqlite`]

### F3. The sk-doc validator reads `registry.ts` as text, and loses its only canonical source

- `validate-doc-model-refs.js` does not import the package. It builds a path to `registry.ts`, reads the file as text and extracts model names by regular expression: every `name:` value and the `CLOUD_CANONICAL` object. The strategy's "imported by an sk-doc validator" is therefore inexact: there is no module dependency, only a file-path dependency guarded by `existsSync`. [SOURCE: .skilled/skills/sk-doc/scripts/validate-doc-model-refs.js:25] [SOURCE: .skilled/skills/sk-doc/scripts/validate-doc-model-refs.js:31] [SOURCE: .skilled/skills/sk-doc/scripts/validate-doc-model-refs.js:44]
- Its third extraction, `RERANKER_CANONICAL`, already matches nothing, because the registry removed that block. [SOURCE: .skilled/skills/sk-doc/scripts/validate-doc-model-refs.js:59] [SOURCE: .skilled/skills/system-spec-kit/shared/embeddings/registry.ts:188]
- The registry is the validator's only declared canonical source. With the registry deleted the canonical set is empty. What the script reports with an empty set (every cited model flagged, or nothing flagged) was not read this iteration; lines 100 onward decide it. Either way the validator has no purpose once the repo has no canonical embedding model. [SOURCE: .skilled/skills/sk-doc/scripts/validate-doc-model-refs.js:350]
- Recommended outcome: delete the validator with the package, together with its callers. Callers found: the report-only CI step (it resolves the script through the `.opencode/skills` symlink to `.skilled/skills`), the validation-switch test row, the typo-flag test, and the scripts README row. [SOURCE: .github/workflows/advisory-checks.yml:63] [SOURCE: .skilled/skills/sk-doc/scripts/tests/test_validation_switch.py:132] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/tests/typo-flags.test.cjs:41] [SOURCE: .skilled/skills/sk-doc/scripts/README.md:77] [INFERENCE: recommendation, based on the registry being the only canonical source named in the help text and on no other embedding consumer surviving]
- The CI step fails closed on a missing script, so deleting the script without deleting the step turns the step red (the job stays green because the step is `continue-on-error`). [SOURCE: .github/workflows/advisory-checks.yml:60]

### F4. `shared/types.ts` is coupled to the package and needs an edit in the same change

- `shared/types.ts` imports the type `HfLocalDtype` from the package, so deleting the folder breaks the shared build until that file is edited. [SOURCE: .skilled/skills/system-spec-kit/shared/types.ts:5]
- The file's first section is embedding types: `EmbeddingProfileData` 13, `EmbeddingProfile` 26, `IEmbeddingProvider` 34, `EmbeddingProfileDtype` 48, the provider options with `dtype` at 96, `EmbeddingCacheStats` 118, `BatchEmbeddingOptions` 136, and the task prefix constants near 370. [SOURCE: .skilled/skills/system-spec-kit/shared/types.ts:34] [SOURCE: .skilled/skills/system-spec-kit/shared/types.ts:118]
- A grep for those type names outside the package and outside `types.ts` found one spec-kit test (`default-model-selection.vitest.ts`) and three `sk-design` files that define same-named local concepts. So the embedding section of `types.ts` has no surviving consumer and can be removed with the package. [INFERENCE: `git grep` over `.skilled` code files for the exported type names this run; `ProviderResolution`, `ParsedProfileSlug`, `ProfileJson`, `ModelDimensions`, `UsageStats` and `TaskPrefixMap` are imported by package files and were not grepped separately]
- Two shared helpers are imported by the providers: `semanticChunk` and `MAX_TEXT_LENGTH` from `chunking.ts`, and `retryWithBackoff` from `utils/retry.ts`. Whether either has a consumer outside the package was not checked. `chunking.ts` describes itself as serving embedding modules. This is the one open item that decides whether the deletion stops at the package folder or also takes those two helpers and their tests. [SOURCE: .skilled/skills/system-spec-kit/shared/chunking.ts:13] [SOURCE: .skilled/skills/system-spec-kit/shared/embeddings/providers/openai.ts:7]

### F5. Shared package tests: 4 of 16 files go

- Delete whole: `K/shared/tests/auto-select.test.ts` (23 lines), `registry.test.ts` (86), `profile.test.ts` (114), `model-server-constants.test.ts` (49, asserts the client and the binder agree on the socket directory). [SOURCE: .skilled/skills/system-spec-kit/shared/tests/auto-select.test.ts:9] [SOURCE: .skilled/skills/system-spec-kit/shared/tests/registry.test.ts:22] [SOURCE: .skilled/skills/system-spec-kit/shared/tests/profile.test.ts:88] [SOURCE: .skilled/skills/system-spec-kit/shared/tests/model-server-constants.test.ts:27]
- Edit: `K/shared/tests/README.md` (6 matching lines). The other 11 test files have zero matches for `embed`, `ollama`, `hf-local`, `model-server` or `voyage`. [INFERENCE: per-file match counts from a case-insensitive grep over the 16 tracked files in .skilled/skills/system-spec-kit/shared/tests this run]
- The shared test script runs a glob, so no test list needs editing. [SOURCE: .skilled/skills/system-spec-kit/shared/package.json:17]

### F6. Spec-kit runtime tests: 24 files to delete whole, 6 to edit (iteration 1 estimated about 14)

Delete whole (the subject of every file is the package or the model server; classified from import lines and module headers, bodies not read in full):

- `K/runtime/tests/embedders/` (12 matching files, 3,486 lines): `hf-local-client.vitest.ts` 844, `hf-model-server.vitest.ts` 580, `launcher-model-server-idle-eviction.vitest.ts` 502, `launcher-model-server-single-writer-cluster.vitest.ts` 403, `hf-model-server-perimeter.vitest.ts` 366, `hf-model-server-shutdown.vitest.ts` 235, `launcher-model-server-live-two-launcher.vitest.ts` 194, `model-server-perimeter.vitest.ts` 154, `hf-local-model-identity.vitest.ts` 70, `README.md`, `fixtures/README.md`, `fixtures/hf-model-server-shutdown-harness.cjs`. The directory was listed by match, not by `ls`; a file in it with no matching term would be missed. [SOURCE: .skilled/skills/system-spec-kit/runtime/tests/embedders/hf-local-client.vitest.ts:14] [SOURCE: .skilled/skills/system-spec-kit/runtime/tests/embedders/hf-local-model-identity.vitest.ts:7]
- `K/runtime/tests/local-llm-features/` (7 files, 536 lines): `default-model-selection.vitest.ts`, `health-reporting.vitest.ts`, `prefix-system.vitest.ts`, `performance/cold-start.bench.ts`, `performance/embedding-latency.bench.ts`, `performance/throughput.bench.ts`, `README.md`. [SOURCE: .skilled/skills/system-spec-kit/runtime/tests/local-llm-features/default-model-selection.vitest.ts:13] [SOURCE: .skilled/skills/system-spec-kit/runtime/tests/local-llm-features/prefix-system.vitest.ts:10]
- Factory tests: `K/runtime/tests/factory-auto-resolution.vitest.ts` (imports the compiled `shared/dist` factory directly), `api-key-validation.vitest.ts`, `api-validation.vitest.ts`. [SOURCE: .skilled/skills/system-spec-kit/runtime/tests/factory-auto-resolution.vitest.ts:11] [SOURCE: .skilled/skills/system-spec-kit/runtime/tests/api-validation.vitest.ts:6]
- Supervision tests: `K/runtime/tests/model-server-demand-probe.vitest.ts`, `model-server-respawn-lock-atomic.vitest.ts`. [SOURCE: .skilled/skills/system-spec-kit/runtime/tests/model-server-demand-probe.vitest.ts:20] [SOURCE: .skilled/skills/system-spec-kit/runtime/tests/model-server-respawn-lock-atomic.vitest.ts:20]

Edit (a few lines inside tests that otherwise stay):

- `K/runtime/tests/launcher-ipc-bridge-probe.vitest.ts` (491 lines; loads the supervision module at 17, one model-server case at 242). It loads a module that is being deleted, so it needs a body read before the edit is scoped. [SOURCE: .skilled/skills/system-spec-kit/runtime/tests/launcher-ipc-bridge-probe.vitest.ts:17]
- `K/runtime/tests/orphan-sweeper-temp-path.vitest.ts` 194 (one `hf-model-server` preserve case). [SOURCE: .skilled/skills/system-spec-kit/runtime/tests/orphan-sweeper-temp-path.vitest.ts:194]
- `K/runtime/cli/tests/memory-pipeline-regressions.vitest.ts` 32 (unmocks the factory; 8 matching lines in 66), `process-memory-harness.vitest.ts` (2 matches), `process-sweep.vitest.ts` (1 match). [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/memory-pipeline-regressions.vitest.ts:32]
- `K/runtime/cli/tests/sweep-memory-residue.vitest.ts` 127 uses the string `shared/embeddings.ts` as a path-classification fixture. It is not a consumer, but a residue grep hits it; reword the fixture path or allow-list it. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/sweep-memory-residue.vitest.ts:127]

No CI workflow, Vitest config or `package.json` names any of these tests; a grep for the directory and file names over `.github`, Vitest configs, the three `package.json` files and all YAML returned nothing. They run by glob, so deleting them needs no runner edit. [INFERENCE: clean no-hit from that grep this run]

### F7. The HF model server has one client, and that client lives in the package

- Dependency chain: `.skilled/bin/hf-model-server.cjs` is started by `.skilled/bin/lib/model-server-supervision.cjs`, which only the advisor launcher loads; the server's only client is `providers/hf-local.ts`, imported by the package's factory and cascade. [SOURCE: .skilled/bin/system-skill-advisor-launcher.cjs:32] [SOURCE: .skilled/skills/system-spec-kit/shared/embeddings/factory.ts:10] [SOURCE: .skilled/skills/system-spec-kit/shared/embeddings/auto-select.ts:10]
- The spawner is off by default. It starts only when `SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED=1`, and the launcher's own comment gives the reason: "the advisor's prompt path cannot use hf-local vectors". So on a default install the server never ran, and it has no purpose beyond the lane. [SOURCE: .skilled/bin/system-skill-advisor-launcher.cjs:1118] [SOURCE: .skilled/bin/system-skill-advisor-launcher.cjs:1122]
- Conclusion: delete `hf-model-server.cjs`, `model-server-supervision.cjs` and the launcher's supervision section whole (the launcher lines are in iteration 1, F5). This answers iteration 1's open question on the model server. [INFERENCE: sole-client chain above plus F2's finding that the package has no importer outside the lane]
- Other tracked files that name the server family (82 outside `specs/` in total, most already counted in F5, F6 and iteration 1): the doctor orphan check and its test (13 matches), the orphan sweeper, `.skilled/bin/README.md` (10), `.skilled/bin/lib/README.md` (8), `.env.example` section 7, and one line in `doctor-setup-presentation.txt`. [SOURCE: .skilled/commands/doctor/scripts/orphan-process-check.cjs:25] [SOURCE: .skilled/commands/doctor/scripts/orphan-process-check.cjs:242] [SOURCE: .env.example:229]
- Ordering consequence for the user-machine cleanup: the orphan check and the sweeper are the only code that recognizes a stray `hf-model-server` process. If their `hf-model-server` class is deleted in the same commit as the server, a server still running on a user machine from before the update is no longer recognized by anything. The cleanup step has to stop that process before, or as part of, removing the class. [INFERENCE: based on .skilled/commands/doctor/scripts/orphan-process-check.cjs:25 and .skilled/scripts/orphan-mcp-sweeper.sh:216 being the only process matchers found]

### F8. One npm dependency exists only for the model server

- `@huggingface/transformers` is declared in the advisor runtime (dependency) and in `system-spec-kit` (dev dependency). Its only code importer is the model server, which resolves it from the spec-kit package root. [SOURCE: .skilled/skills/system-skill-advisor/runtime/package.json:20] [SOURCE: .skilled/skills/system-spec-kit/package.json:48] [SOURCE: .skilled/bin/hf-model-server.cjs:447]
- The advisor's `scripts/doctor.sh` asserts that the module imports and carries stale comments about it downloading "Jina" models. Lines 6, 55 to 69. [SOURCE: .skilled/skills/system-skill-advisor/scripts/doctor.sh:58]
- Removal therefore includes both `package.json` rows, both lockfiles and the doctor script check. On user machines the installed module tree (the heaviest in the advisor's `node_modules`, with its ONNX runtime) stays until a reinstall or prune runs; that is a user-machine residue item. The `sharp` override in spec-kit's `package.json` may exist only for this tree; not verified. [SOURCE: .skilled/skills/system-spec-kit/package.json:41] [INFERENCE: npm leaves installed packages in place when a dependency row is removed until `npm install` or `npm prune` runs]

### F9. On-disk artifacts the package and the server create on user machines

- Model server runtime directory, default `/tmp/system-hf-embed`: socket `hf-embed.sock`, pid file, `hf-model-server.respawn.lock`, give-up file `hf-embed-giveup.json`. [SOURCE: .skilled/bin/hf-model-server.cjs:29] [SOURCE: .skilled/bin/hf-model-server.cjs:26] [SOURCE: .skilled/bin/lib/model-server-supervision.cjs:48]
- HuggingFace model cache at `~/.cache/huggingface/hub/`, written when the server first loads its model (default `nomic-ai/nomic-embed-text-v1.5`). The cache is shared with any other HuggingFace tool on the machine, so the cleanup may remove only the one model directory it can attribute, never the hub directory. [SOURCE: .skilled/bin/hf-model-server.cjs:487] [SOURCE: .skilled/bin/hf-model-server.cjs:30]
- Per-profile vector shards: the factory looks for `vectors/context-vectors__<provider>__<model>__<dim>.sqlite` beside the database named by `MEMORY_DB_PATH`, which the launcher sets for the advisor child. [SOURCE: .skilled/skills/system-spec-kit/shared/embeddings/factory.ts:450] [SOURCE: .skilled/skills/system-spec-kit/shared/embeddings/factory.ts:384] [SOURCE: .skilled/bin/system-skill-advisor-launcher.cjs:332]
- Env keys read by the package that the launcher or `.env.example` carry: `MEMORY_DB_PATH`, `SPEC_KIT_DB_DIR`, `SPECKIT_DB_DIR`, the whole of `.env.example` section 7 (lines 229 to 264: provider selection, Ollama, HF, OpenAI and Voyage embedding keys) and line 409. `MEMORY_DB_PATH` and the two directory keys may have other readers; not checked. [SOURCE: .env.example:236] [SOURCE: .env.example:409]
- Observed on this machine (read-only): `/tmp/system-hf-embed` does not exist, no `hf-model-server` process is running, no `context-vectors__*.sqlite` file exists under `.skilled`, and the HuggingFace cache has no `nomic-embed-text` entry. It does hold `models--nomic-ai--CodeRankEmbed`, a different model whose owner is unknown; a cleanup that globbed `models--nomic*` would delete it wrongly. This matches the default-off spawner: on this machine only the Ollama path left residue (iteration 1, F4). [INFERENCE: direct observation from `ls`, `pgrep` and `find` this run, not a derivation; other machines that set the enable flag will differ]

### F10. Docs, generators and generated data that cite the package (input for the docs question)

- Spec-kit docs: `K/runtime/ENV-REFERENCE.md` (17 package-path lines, 35 model-server lines), `K/references/memory/embedder-pluggability.md` (16; the whole file describes the package), `K/references/config/environment-variables.md`, `K/ARCHITECTURE.md` (1), one manual-testing playbook file, `K/shared/README.md` (rows at 26, 40, 54, 85, 94, 116 to 122, 158, 181 and the env table at 195 to 214), `K/shared/embeddings/**/README.md` (deleted with the folder). [SOURCE: .skilled/skills/system-spec-kit/shared/README.md:158] [SOURCE: .skilled/skills/system-spec-kit/shared/README.md:195]
- The README's env table is not hand-written. `shared/scripts/env-reader-table.mjs` defines the embedding groups at 21 to 25 and a test (`readme-env-readers.test.ts`) guards the table. The order is: edit the script's groups, regenerate, then the test passes; editing the README alone fails the guard. [SOURCE: .skilled/skills/system-spec-kit/shared/scripts/env-reader-table.mjs:21] [INFERENCE: the guard relationship is read from the file names and the README table matching the script's groups; the test body was not read]
- Generated or fixture data that will need regeneration, not hand edits: `K/runtime/data/trigger-index.json` (40 model-server lines), `K/runtime/cli/retrieval/fixtures/corpus-manifest.json` (41), `phrase-variants.json` (64), `generation-diagnostics.json` (1), and sk-doc's `code-folder` fixtures `durable-directory-manifest.json` and `baseline-readme-verdicts.json` (3 each, they list the package's directories). [INFERENCE: match counts from the two greps this run; which generator owns each file was not traced]
- `.skilled/output/local-skilled-alignment/**` holds four files with package paths. The grep that found them was not limited to tracked files, so whether they are tracked was not established. [INFERENCE: hit in the recursive grep of action 3 only]

## Questions Answered

- Who else consumes system-spec-kit/shared/embeddings (auto-select cascade, hf-local model server, spec-kit memory, sk-doc validators), and can the package and its tests be deleted entirely or only in part?

Answer: nobody else in production. The package, its 4 shared tests, 24 spec-kit runtime test files, the model server, its supervision library and the launcher's supervision section can all be deleted whole. The same change must edit `shared/types.ts`, delete or retarget the sk-doc validator and its CI step, drop `@huggingface/transformers`, and clean `shared/dist/embeddings`. Three named caveats remain: whether `chunking.ts` and `utils/retry.ts` have a consumer outside the package (F4), the validator's behavior with an empty canonical set (F3), and a full listing of `tests/embedders/` (F6).

Carried-forward items this iteration closes:

- Is the HF model server still used by anything once the advisor lane is gone? No (F7).

## Questions Remaining

- Which doctor routes, YAML workflows, presentation files, scripts and their tests reference the embedder (install, setup, update apply, overlay apply and repin, symlink link, skill-advisor embedder), and what must each say or do after removal?
- Which docs, changelogs, feature catalogs, manual testing playbooks, READMEs, env references, graph-metadata trigger phrases and generated or compiled routing artifacts carry Ollama or semantic-lane remnants?
- What removal order keeps every gate green, how are repo users machines cleaned (pulled model, vector tables, background server, env vars) without a backup, and what residue check proves nothing is left?

Open sub-items carried forward:

- Do `shared/chunking.ts` and `shared/utils/retry.ts` have a consumer outside the package?
- Do `MEMORY_DB_PATH`, `SPEC_KIT_DB_DIR` and `SPECKIT_DB_DIR` have a reader outside the package?
- Which generator owns each of the generated files in F10?
- Still open from iteration 1: shadow weight renormalization, the fate of `SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC`, and the command "meaning" path and its baselines.

## Ruled Out

- Keeping part of the package for the cloud providers (OpenAI, Voyage): they have no caller outside the factory, and the factory has no caller outside the lane.
- Spec-kit memory as a surviving consumer: the memory MCP surface is retired and no spec-kit runtime source imports the package.
- `sk-design` as a consumer: it has its own vector store and does not import the package.

## Dead Ends

None this iteration.

## Edge Cases

- Ambiguous input: "consumes" was read as "imports, loads, or reads a file of the package". That is why the sk-doc validator counts as a consumer even though it has no module dependency.
- Contradictory evidence: iteration 1 estimated "about 14 spec-kit test files" for the model server; the count by import and header is 24 delete-whole plus 6 edits in the spec-kit runtime and 4 in the shared package. The strategy's Known Context says the package "is imported by an sk-doc validator"; the validator reads `registry.ts` as text. Both corrections are recorded with their evidence in F3 and F6.
- Missing dependencies: none.
- Partial success: none. Three checks were left out by budget and are named as caveats.

## Sources Consulted

- `.skilled/skills/system-spec-kit/shared/embeddings/**` (file list, import lines, `registry.ts` canonical blocks, `factory.ts` 378 to 390 and 440 to 455)
- `.skilled/skills/system-spec-kit/shared/package.json`, `tsconfig.json`, `types.ts`, `chunking.ts`, `README.md`, `scripts/env-reader-table.mjs`, `tests/**`
- `.skilled/skills/system-spec-kit/runtime/tests/**`, `runtime/cli/tests/**` (match listing and import lines)
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-memory-residue.mjs` and its allowlist fixture
- `.skilled/skills/system-spec-kit/package.json`, `.skilled/skills/system-skill-advisor/runtime/package.json`
- `.skilled/skills/sk-doc/scripts/validate-doc-model-refs.js` (1 to 100, 340 to 356) and its callers
- `.github/workflows/advisory-checks.yml` (55 to 75)
- `.skilled/bin/system-skill-advisor-launcher.cjs` (1115 to 1140, 328 to 336, 1796 to 1806), `.skilled/bin/hf-model-server.cjs` (1 to 45), `.skilled/bin/lib/model-server-supervision.cjs`
- `.skilled/commands/doctor/scripts/orphan-process-check.cjs`, `.skilled/skills/system-skill-advisor/scripts/doctor.sh`, `.env.example`
- This machine, read-only: `/tmp/system-hf-embed`, `~/.cache/huggingface/hub/`, the process list, `find` for vector shards

## Assessment

- New information ratio: 0.85
- Basis: 10 findings. F1, F2, F3, F4, F5, F8 and F9 are fully new. F6 and F7 extend iteration 1's model-server inventory, and F10 overlaps the strategy's Known Context. (7 + 0.5 x 3) / 10.
- Questions addressed: the shared-package consumer question; iteration 1's model-server sub-question.
- Questions answered: the shared-package consumer question, with the three caveats above.

## Reflection

- What worked and why: grepping import-shaped patterns separately from the bare package path. The path grep returned 55 files, mostly docs and fixtures; the import grep cut that to 20 code lines and showed in one pass that no spec-kit production file is among them.
- What worked and why: reading the launcher's enable function instead of counting its references. One comment and five lines established that the server is opt-in and why, which settles its fate without reading the 200-line control section.
- What did not work and why: the first importer grep was recursive rather than limited to tracked files, so it mixed in `.skilled/output/` files whose tracking status is now unknown.
- What I would do differently: check the two shared helpers (`chunking.ts`, `utils/retry.ts`) in the same grep as the type names, since they decide where the deletion boundary sits.

## Recommended Next Focus

Inventory the doctor surface: `.skilled/commands/doctor/_routes.yaml`, the embedder workflow asset, the setup, install, update-apply, overlay and symlink YAML and presentation files, the doctor scripts and their tests (including `orphan-process-check.cjs` and the orphan sweeper found here), with file:line and the required post-removal wording or behavior for each. In the same pass, settle the three small open checks from this iteration with one grep each: consumers of `shared/chunking.ts` and `shared/utils/retry.ts` outside the package, readers of `MEMORY_DB_PATH`, and the validator's behavior on an empty canonical set. The docs, changelog and generated-artifact sweep follows in iteration 4, and the removal order, user-machine cleanup and residue check in iteration 5.
