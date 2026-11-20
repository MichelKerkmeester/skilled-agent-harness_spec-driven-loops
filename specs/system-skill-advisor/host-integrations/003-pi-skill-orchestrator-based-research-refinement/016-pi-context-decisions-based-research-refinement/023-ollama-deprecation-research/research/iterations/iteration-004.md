# Iteration 4: Documentation and generated surface outside the doctor folder

## Focus

Sweep every tracked doc, env reference, changelog, catalog, playbook, metadata file and generated artifact outside `specs/` and outside `.skilled/commands/doctor/` for remnants of the Ollama, embedding and `semantic_shadow` lane. Say for each file whether it is deleted whole, edited, regenerated or left alone. Settle the three open checks iteration 3 handed over (is `scoring-compatibility.json` a generator input, who reads `embeddingText`, does `advisor_status` stay declared on a route). State the residue check's exclusion rule for `specs/` and the trigger index.

Selected interpretation: the strategy's Next Focus text is cut off after "`.env.example` and...". The full sentence is in iteration 3's Recommended Next Focus, and that is the scope used here.

## Actions Taken

1. Read config, state log, strategy and the headings of iterations 1 to 3. Three iteration records exist, so this is iteration 4; `iteration-004.md` and `iter-004.jsonl` did not exist.
2. Listed every tracked file outside `specs/` and the doctor folder that matches a strict lane pattern (`ollama`, `semantic_shadow`, `nomic-embed`, `vec_768`, `vec_cmd_768`, `vec_metadata`, `EMBED_REFRESH`, `EXACT_SEMANTIC_RERANK`, `DISABLE_BUILTIN_SEMANTIC`, `shared/embeddings`, `hf-model-server`, `model-server-supervision`, `EMBEDDINGS_PROVIDER`, `embedder`): 262 files, 93 of them docs or data files outside test folders.
3. Ran a second vocabulary pass (`semantic lane`, `meaning match`, `vector coverage`, `vector refresh`, `five-lane`, `semanticHealth`, `embeddingText`, `HF_EMBED`, `hf-local`, `@huggingface/transformers`, `sqlite-vec`): 179 files, 66 of them not in the first list.
4. Printed the matching lines of the root docs, the advisor docs, references, feature catalog and playbook, the spec-kit docs, both env references and `.env.example`, and every skill outside the advisor and spec-kit.
5. Read the exact lines of the install docs, the advisor README lane table, the catalog index, the advisor `SKILL.md` keywords and `graph-metadata.json` trigger phrases.
6. Settled the three open checks with one grep each, then traced the owner of each generated file (trigger index, leaf manifests, sk-doc baselines, cite-drift labels, skill-graph export).
7. Parsed `trigger-index.json` with a short script to split its matching paths and phrases into `specs/` and non-`specs/` sources, and counted the matching tracked files under `specs/`.

## Findings

### F1. Scale: 93 doc and data files on the strict pattern, about 40 more on the second pattern

The strict pattern matches 262 tracked files outside `specs/` and the doctor folder: 142 in the advisor, 75 in spec-kit, 10 in sk-doc, 7 in sk-design, 6 global changelogs, and 22 elsewhere. Of these, 93 are docs or data files outside test folders. The second pattern adds 66 files the first one misses, because they say "five-lane", "vector refresh", "semantic lane" or name the npm dependency without any of the strict words. Example: the advisor's own `SKILL.md` and `graph-metadata.json` are only on the second list. A residue check built from the strict pattern alone would pass with those still in place. [SOURCE: .skilled/skills/system-skill-advisor/SKILL.md:20] [SOURCE: .skilled/skills/system-skill-advisor/graph-metadata.json:107]

### F2. Eleven doc files are deleted whole, and each has inbound links

| File | Lines | Inbound references that break |
| --- | --- | --- |
| `system-skill-advisor/feature-catalog/daemon-and-freshness/background-vector-refresh.md` | 58 | `feature-catalog.md` 26 (category count 8 becomes 7) and 54 |
| `system-skill-advisor/feature-catalog/scorer-fusion/command-meaning-matching.md` | 79 | `feature-catalog.md` 29 (count 10 becomes 9) and 102; `doctor-command-routing.md` 31; `pasted-reply-stripping.md` 53; `leaf-aliases.json` 214 and 215; `leaf-manifest.json` 47 |
| `system-skill-advisor/runtime/lib/embedders/README.md` | 80 | `runtime/lib/README.md` 63, 128, 158, 192, 217; `runtime/lib/shared/README.md` 73; `runtime/README.md` 26 |
| `system-skill-advisor/runtime/lib/embedders/adapters/README.md` | 69 | same folder |
| `system-skill-advisor/runtime/tests/embedders/README.md` | not read | sk-doc baselines (F11) |
| `system-spec-kit/references/memory/embedder-pluggability.md` | 253 | advisor `INSTALL-GUIDE.md` 354 and 387; spec-kit `ROUTER.md` 46 and 243; `leaf-aliases.json` 64 and 65; `leaf-manifest.json` 17; `memory-system.md` 256; `shared/embeddings/providers/README.md` 104 |
| `system-spec-kit/shared/embeddings/README.md` | 172 | sk-doc baselines (F11) |
| `system-spec-kit/shared/embeddings/adapters/README.md` | 62 | same |
| `system-spec-kit/shared/embeddings/providers/README.md` | 109 | same |
| `system-spec-kit/runtime/tests/embedders/README.md` | not read | same |
| `system-spec-kit/runtime/tests/embedders/fixtures/README.md` | not read | same |

The spec-kit `ROUTER.md` RETRIEVAL_TUNING route loads `embedder-pluggability.md` by name, so the router line, the route table entry and both leaf files change in the same commit as the deletion. [SOURCE: .skilled/skills/system-spec-kit/ROUTER.md:46] [SOURCE: .skilled/skills/system-spec-kit/ROUTER.md:243] [SOURCE: .skilled/skills/system-spec-kit/leaf-manifest.json:17] [SOURCE: .skilled/skills/system-skill-advisor/feature-catalog/feature-catalog.md:26] [SOURCE: .skilled/skills/system-skill-advisor/feature-catalog/feature-catalog.md:29]

### F3. Install docs: one section, one table row, one troubleshooting row, and a verification command that will fail

- `INSTALL-SKILLED.md`: the section "Meaning Matching For Commands" from 86 to 98 goes whole. Row 5 of the install order at 157 goes and `/doctor:setup` becomes step 5. The troubleshooting row for `semantic_lane_off` at 342 goes. The link text at 351 drops "its embedder". [SOURCE: INSTALL-SKILLED.md:86] [SOURCE: INSTALL-SKILLED.md:157] [SOURCE: INSTALL-SKILLED.md:342] [SOURCE: INSTALL-SKILLED.md:351]
- Advisor `INSTALL-GUIDE.md`: section 12 "CHOOSING AN EMBEDDER" runs from 275 to 378 (seven subsections) and goes whole, so sections 13 and 14 renumber. The prerequisites bullet at 54 goes. The related-resources row at 387 goes. `INSTALL-SKILLED.md` 98 links to the anchor `#127-setup-route-and-cost`, which disappears with section 12. [SOURCE: .skilled/skills/system-skill-advisor/INSTALL-GUIDE.md:275] [SOURCE: .skilled/skills/system-skill-advisor/INSTALL-GUIDE.md:54] [SOURCE: .skilled/skills/system-skill-advisor/INSTALL-GUIDE.md:387] [SOURCE: INSTALL-SKILLED.md:98]
- `INSTALL-GUIDE.md` 105 is a package check that imports `dist/runtime/lib/scorer/lanes/semantic-shadow.js`. Once the lane file is deleted this command fails for anyone who follows the guide. This is a broken instruction, not only stale wording, so it needs a replacement module to import. [SOURCE: .skilled/skills/system-skill-advisor/INSTALL-GUIDE.md:105]
- Root `README.md`: the sentence at 204 goes, and 26 says "5-lane fusion". [SOURCE: README.md:204] [SOURCE: README.md:26]

### F4. Advisor identity files: README, ARCHITECTURE, SKILL.md, ROUTER.md, graph-metadata

- `README.md`: 38 ("Five lanes are registered"), 46 (the `semantic_shadow` table row), 48 (the paragraph on enabling the lane), 90 ("the embedder" in the daemon's holdings), 92 (startup refresh sentence), 113 ("Five-lane score" in the diagram). [SOURCE: .skilled/skills/system-skill-advisor/README.md:38] [SOURCE: .skilled/skills/system-skill-advisor/README.md:46] [SOURCE: .skilled/skills/system-skill-advisor/README.md:48]
- `ARCHITECTURE.md`: 22, 79, 126 ("Five lanes fuse ... and a semantic shadow lane"), 130, and the ADR-001 row at 160 ("Five-lane scorer"). [SOURCE: .skilled/skills/system-skill-advisor/ARCHITECTURE.md:126] [SOURCE: .skilled/skills/system-skill-advisor/ARCHITECTURE.md:160]
- `SKILL.md`: the keyword `semantic-lane` at 20, and the sentence at 111 that documents `includeEmbeddingsHealth` and `includeSemanticHealth`. [SOURCE: .skilled/skills/system-skill-advisor/SKILL.md:20] [SOURCE: .skilled/skills/system-skill-advisor/SKILL.md:111]
- `ROUTER.md`: the routing keyword "five-lane" at 42 and 175. [SOURCE: .skilled/skills/system-skill-advisor/ROUTER.md:42] [SOURCE: .skilled/skills/system-skill-advisor/ROUTER.md:175]
- `graph-metadata.json`: four trigger phrases, "vector coverage" 106, "semantic lane" 107, "background vector refresh" 114, "vector refresh" 115. These phrases route prompts to the advisor skill today. They are copied into the tracked export `runtime/scripts/skill-graph.json` and into each user's `skill-graph.sqlite`, so both are refreshed after the edit. [SOURCE: .skilled/skills/system-skill-advisor/graph-metadata.json:106] [SOURCE: .skilled/skills/system-skill-advisor/graph-metadata.json:114]

No other `graph-metadata.json` or `description.json` outside `specs/` matches either pattern.

### F5. The lane count changes from five to four in 45 tracked files

`five-lane`, `5-lane` or `five lanes` appears in 45 tracked files outside `specs/`. Three file names carry it: `feature-catalog/scorer-fusion/five-lane-fusion.md`, `manual-testing-playbook/scorer-fusion/five-lane-fusion.md` and `runtime/stress-test/skill-advisor/five-lane-fusion-stress.vitest.ts`. The catalog file has inbound links from `df-idf-corpus.md` 53, `doc-frontmatter-harvest.md` 60, `provenance-and-trust-lanes.md` 72, `ambiguity.md` 60, `executor-delegation.md` 73, `pasted-reply-stripping.md` 52, `projection.md` 67, `feature-catalog.md` 95, `leaf-aliases.json` 229 and 230 and `leaf-manifest.json` 50. The playbook file has them from `manual-testing-playbook.md` 277, `projection.md` 90, `leaf-aliases.json` 534 and 535 and `leaf-manifest.json` 111. Renaming the files is a decision the removal plan must make: a rename touches all of those, keeping the name leaves a file called "five-lane" that describes four. One match is unrelated: spec-kit's `heal-spec-docs` has "five lane modes" of its own. [SOURCE: .skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/five-lane-fusion.md:3] [SOURCE: .skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:277] [SOURCE: .skilled/skills/system-skill-advisor/leaf-manifest.json:50]

### F6. Advisor references: six files edited in place

| File | Lines | What changes |
| --- | --- | --- |
| `references/scoring/advisor-scorer.md` | 55, 65, 79, 81, 83 | lane table row and the whole semantic shadow subsection |
| `references/scoring/lane-weight-tuning.md` | 58 | the "semantic lane scored higher" troubleshooting entry |
| `references/scoring/validation-baselines.md` | 147 | the p95 row's semantic lookup cause |
| `references/runtime/freshness-contract.md` | 146 | background vector refresh sentence |
| `references/config/db-path-policy.md` | 96, 97 | the `MEMORY_DB_PATH` rationale, which exists only for `shared/embeddings/factory.ts` |
| `references/runtime/daemon-lease-contract.md` | 138 | matched the second pattern; the matched words were not read |

[SOURCE: .skilled/skills/system-skill-advisor/references/scoring/advisor-scorer.md:55] [SOURCE: .skilled/skills/system-skill-advisor/references/scoring/advisor-scorer.md:79] [SOURCE: .skilled/skills/system-skill-advisor/references/config/db-path-policy.md:96] [SOURCE: .skilled/skills/system-skill-advisor/references/runtime/freshness-contract.md:146]

### F7. Feature catalog: nine files edited in place (two more deleted in F2)

`cli-surface/advisor-status.md` 31, 49, 50, 59 (the `semanticLaneHealth` block and three source rows); `daemon-and-freshness/lifecycle.md` 28; `daemon-and-freshness/watcher.md` 22 (second pattern, words not read); `lifecycle-routing/age-haircut.md` 22; `scorer-fusion/ablation.md` 40 (row for the ablation test iteration 1 marks for deletion); `scorer-fusion/attribution.md` 37; `scorer-fusion/doctor-command-routing.md` 31 (the "can also pass on meaning" sentence); `scorer-fusion/five-lane-fusion.md` 3, 30, 32, 59; `scorer-fusion/weights-config.md` 22, 24. [SOURCE: .skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-status.md:31] [SOURCE: .skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/weights-config.md:22] [SOURCE: .skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/doctor-command-routing.md:31]

### F8. Manual testing playbook: eight scenario files edited, none deleted

No scenario file is dedicated to the lane, so none goes whole. The edits:

| File | Lines |
| --- | --- |
| `auto-update-daemon/daemon-lifecycle-shutdown.md` | 107 |
| `auto-update-daemon/watcher-narrow-scope.md` | 87 |
| `lifecycle-routing/age-haircut.md` | 3, 19, 26, 56 |
| `native-cli-tools/native-status-transitions.md` | 77 |
| `operator-h5/degraded-daemon.md` | 61, 62, 115, 181 |
| `scorer-fusion/ablation.md` | 58, 59 |
| `scorer-fusion/five-lane-fusion.md` | 3, 21, 28, 63, 64, 65, 76, 77 |
| `scorer-fusion/lane-attribution.md` | 58, 59, 70, 104 |

Four of these lines (107, 115, 181, 104) are expected-output JSON that lists `"semantic_shadow": 0` among the weights. A tester following the playbook after the removal would see a mismatch there, so these are correctness edits. [SOURCE: .skilled/skills/system-skill-advisor/manual-testing-playbook/operator-h5/degraded-daemon.md:115] [SOURCE: .skilled/skills/system-skill-advisor/manual-testing-playbook/scorer-fusion/five-lane-fusion.md:63] [SOURCE: .skilled/skills/system-skill-advisor/manual-testing-playbook/native-cli-tools/native-status-transitions.md:77]

### F9. Env references: one whole section in each of three files, plus scattered rows

- `.env.example`: section 7 "EMBEDDING + LOCAL HF MODEL SERVER" starts at 228; lines 232 to 250 are the provider cascade keys (the end of the section was not read). Outside it: `SPEC_KIT_DB_DIR` 95, `MEMORY_DB_PATH` 96, the "shared: owned by the HF model server and the skill advisor" note at 100, `SYSTEM_SKILL_ADVISOR_EMBED_REFRESH` 409 and `SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC` 411. [SOURCE: .env.example:229] [SOURCE: .env.example:237] [SOURCE: .env.example:409] [SOURCE: .env.example:411]
- `system-spec-kit/runtime/ENV-REFERENCE.md`: section 6 "EMBEDDING" from 293 with its "Local HF model server" subsection at 327; the "EMBEDDER CASCADE PROBE" section at 447; the quick start "Bring up local HF embeddings" at 593; the database-directory rows at 187 and 188 and their prose at 168 to 173; the skill advisor rows at 391, 392, 394, 395 and 396 (both weights JSON defaults list `semantic_shadow`). The "RSS watchdog (shared supervisor)" subsection at 347 documents generic `SPECKIT_LAUNCHER_RSS_*` keys; whether it survives depends on whether the launcher keeps a supervised tree once the model server is gone, which this iteration did not read. [SOURCE: .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:293] [SOURCE: .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:394] [SOURCE: .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:447] [SOURCE: .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:347]
- `system-spec-kit/references/config/environment-variables.md`: 38, 59 to 66, 72, 92, 133, 136. [SOURCE: .skilled/skills/system-spec-kit/references/config/environment-variables.md:59]
- `system-spec-kit/ARCHITECTURE.md`: the env row at 160 and the ADR-007 row at 200 (the provider cascade decision). `system-spec-kit/shared/README.md`: 54, 85, 122, 181, 195, 197, 198, 199, 266, 279. [SOURCE: .skilled/skills/system-spec-kit/ARCHITECTURE.md:200] [SOURCE: .skilled/skills/system-spec-kit/shared/README.md:181]

### F10. Launcher READMEs, the orphan sweeper, the create-command workflow and one CI workflow

- `.skilled/bin/README.md` 27, 55, 59, 73, 111, 120, 121, 167, 228, 229 and `.skilled/bin/lib/README.md` 14, 18, 37, 66, 86, 140, 157, 170 describe `hf-model-server.cjs` and `model-server-supervision.cjs`. They change if iteration 2's verdict (the model server has one client, inside the package) is acted on. [SOURCE: .skilled/bin/README.md:27] [SOURCE: .skilled/bin/lib/README.md:18]
- `.skilled/scripts/orphan-mcp-sweeper.sh` classifies the model server at 216 and 504 and preserves `ollama runner` and `ollama serve` processes at 491. Line 491 protects a user's own Ollama from the sweeper. Removing it makes the sweeper free to treat those processes as any other; keeping it leaves the word "ollama" in the tree. The spec-kit catalog entry describes this at `orphan-mcp-sweeper-and-launchagent-template.md` 37. [SOURCE: .skilled/scripts/orphan-mcp-sweeper.sh:491] [SOURCE: .skilled/scripts/orphan-mcp-sweeper.sh:216]
- `/create:command` tells the operator the daemon "embeds it when Ollama is reachable": `create-command-auto.yaml` 472, `create-command-confirm.yaml` 484, `create-command-presentation.txt` 168. [SOURCE: .skilled/commands/create/assets/create-command-auto.yaml:472] [SOURCE: .skilled/commands/create/assets/create-command-presentation.txt:168]
- `.github/workflows/skill-advisor-stress.yml` 49 and 50 set `SYSTEM_SKILL_ADVISOR_EMBED_REFRESH: 'off'`. [SOURCE: .github/workflows/skill-advisor-stress.yml:50]
- `system-skill-advisor/scripts/doctor.sh` requires `@huggingface/transformers` to import (58) and exits 26 when it does not (16). If the dependency is dropped from `runtime/package.json` 20 and this script is not edited, the advisor's own health script fails on every machine. `scripts/README.md` 21 documents the same check. [SOURCE: .skilled/skills/system-skill-advisor/scripts/doctor.sh:58] [SOURCE: .skilled/skills/system-skill-advisor/scripts/doctor.sh:16] [SOURCE: .skilled/skills/system-skill-advisor/runtime/package.json:20]

### F11. Generated and derived artifacts, and who owns each

| Artifact | Lines | Owner | Action |
| --- | --- | --- | --- |
| `runtime/scripts/command-bridges/command-bridges.generated.json` | 1634 to 1671, 3038 | output of `derive-command-bridges.cjs` (`OUTPUT_PATH` 27, written at 1385) | regenerate |
| `runtime/scripts/command-bridges/scoring-compatibility.json` | 266, 268, 611, 613 | **input** of the same generator (`COMPATIBILITY_PATH` 26, validated at 781 and 920, never written) | hand-edit before regenerating |
| `system-spec-kit/runtime/data/trigger-index.json` | 1292 matching lines | `generate-trigger-index.mjs` over `CORPUS_ROOTS` | regenerate after the doc edits |
| `runtime/scripts/skill-graph.json` (tracked) | graph-metadata phrases | diagnostic export, "ignored by the runtime" | regenerate |
| sk-doc `scripts/tests/code-folder/baseline-readme-verdicts.json` | 7713, 7723, 7903, 9308, 9318, 9448, 9458, 9468 | `test_readme_verdict_parity.py --write` | rebuild |
| sk-doc `scripts/tests/code-folder/durable-directory-manifest.json` | 677, 678, 696, 829, 839, 840, 841 | `test_readme_manifest.py` | rebuild |
| sk-doc `shared/scripts/cite-drift-labels.jsonl` | 14, 36 | written only by `cite-drift-scan.mjs --draw`; operator-labeled rows | two labeled rows target `semantic-shadow.ts`; delete or redraw |
| `leaf-manifest.json`, `leaf-aliases.json` (advisor and spec-kit) | advisor 47, 50, 111 and 214 to 535; spec-kit 17 and 64, 65 | **writer not found**; the only writers located build the deep-loop and sk-design manifests | unconfirmed: hand-edit or generator |
| `runtime/scripts/routing-accuracy/scorer-eval-baseline.json` | 9 | `capture-scorer-eval-baseline.mjs`; records `SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC` in its regime | recapture |
| `runtime/tsconfig.build.json` | 27, 28 | hand-written | edit |
| lockfiles: advisor `runtime/package-lock.json` 9 and 50; spec-kit `package-lock.json` 17, 741, 743; `system-deep-loop/package-lock.json` 21 | | npm | regenerate |
| spec-kit retrieval fixtures `corpus-manifest.json` 8990, `phrase-variants.json` 47322 | | `generate-trigger-index.mjs` and `measure-cold-lookup.mjs` reference them | regenerate with the index |

[SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:26] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:27] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:1385] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json:266] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs:31] [SOURCE: .skilled/skills/sk-doc/scripts/tests/test_readme_verdict_parity.py:4] [SOURCE: .skilled/skills/sk-doc/scripts/tests/test_readme_manifest.py:23] [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:84] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json:9] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tsconfig.build.json:27]

`system-deep-loop/package-lock.json` 21 lists `@huggingface/transformers` under `../system-spec-kit/shared`, yet `shared/package.json` does not declare it and `shared/README.md` 54 says the package "declares no ML dependency". The lockfile is already stale on this point. [SOURCE: .skilled/skills/system-deep-loop/package-lock.json:21] [SOURCE: .skilled/skills/system-spec-kit/shared/README.md:54]

### F12. The three open checks from iteration 3

1. **`scoring-compatibility.json` is an input.** The generator reads it and never writes it; its only writes are the output file at 1385 and the three source files at 1388. The four embedder lines in it are hand-removed, and the generator must then pass `--check`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:1388]
2. **`embeddingText` has one production reader, and it is the vector path.** The generator writes the field at 1353. `skill-graph-db.ts` parses it at 784 to 810 and uses it only to hash and embed command text (1416, 1743, 1763). Every other reader is a test or a doc. So the field, and the generator code that composes it, go with the lane, and `command-bridges-drift-guard.vitest.ts` 24, 227 and 397 are edited. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:1353] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:784] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:1763] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/command-bridges-drift-guard.vitest.ts:397]
3. **`advisor_status` stays declared.** `_routes.yaml` calls it at 122, 145, 167 and 392 without the semantic-health flag; only the embedder route's call at 240 passes `--include-semantic-health`. The route contract test can keep requiring `advisor_status`. [SOURCE: .skilled/commands/doctor/_routes.yaml:122] [SOURCE: .skilled/commands/doctor/_routes.yaml:240]

### F13. Changelogs: 23 files mention the lane, and no rule says whether released entries may be rewritten

On the strict pattern: six global changelogs (`v3.4.0.0.md` 167; `v3.5.0.0.md` 16, 77, 78, 86, 335; `v3.5.0.3.md` 14, 66; `v4.0.0.0.md` 130, 1002; `v4.1.0.0.md` 11 lines from 87 to 770; `v4.2.0.0.md` 12 lines from 3 to 383), five advisor changelogs (`v0.2.0.0.md`, `v0.17.6.0.md`, `v1.0.0.0.md` 13 lines, `v1.2.0.0.md` 8 lines, `v1.3.0.0.md` 6 lines), four spec-kit changelogs, the doctor skill's `v1.1.7.0.md` 47 and 49, and sk-doc's `v1.6.0.0.md` 97. The second pattern adds seven older global changelogs, the advisor's `v0.11.0.0.md` and two spec-kit ones. [SOURCE: .skilled/changelog/skilled/v4.2.0.0.md:3] [SOURCE: .skilled/skills/system-skill-advisor/changelog/v1.3.0.0.md:8] [SOURCE: .skilled/skills/system-skilled-doctor/changelog/v1.1.7.0.md:47]

A search of `sk-create-changelog` (its `SKILL.md` and references), the repo rules and the changelog README found no line that forbids or allows rewriting a released entry. So this is an operator decision, and it conflicts with the topic's "zero remnants ... changelog": either released entries are rewritten, or the residue check excludes changelog folders by path. Changelog files are also part of the trigger index corpus (the phrase "advisor background vector refresh" resolves to `v1.3.0.0.md`), so leaving them leaves those phrases in the index. [INFERENCE: based on the empty policy grep and the trigger-index phrase sample]

### F14. Matches that are not remnants (the residue check's allowlist)

- cli-codex `--oss` mode, which is Codex's own Ollama support: `cli-reference.md` 105, 173, 549 and `providers-and-models.md` 64. [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/references/cli-reference.md:105]
- mcp-figma `figma-cli-reference.md` 92 (the Figma CLI's own local LLM support). [SOURCE: .skilled/skills/mcp-tooling/mcp-figma/references/figma-cli-reference.md:92]
- sk-design's own vector store, seven files that use "embedder" as a parameter name. [SOURCE: .skilled/skills/sk-design/sk-design-md-generator/styles/lib/database/vectors.mjs:135]
- system-deep-loop's `semantic_shadow_only` field, a namesake in the semantic community projection. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/semantic-communities/community-projection.ts:747]
- sk-create-benchmark case studies of past embedder bake-offs (`case-studies.md` 11 lines, `README.md` 25 and 64, `SKILL.md` 53) and the sk-create-changelog worked example at 103. These are teaching examples about other systems. [SOURCE: .skilled/skills/sk-doc/sk-create-benchmark/references/shared/case-studies.md:34]
- `cite-drift-redirects.json`, 25 lines that are old-to-new spec folder paths containing "embedder-testing-and-architecture". [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-redirects.json:2190]
- sk-code's TypeScript references use `sqlite-vec` as a typing example. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/checklists/typescript-checklist.md:81]
- `mcp-click-up/.../auto-note.md` 19 matched the strict pattern in a line about Apple Intelligence; the matched word is beyond the part of the line that was read, so this one is unclassified.

### F15. The exclusion rule the residue check needs for `specs/` and the trigger index

- 2,366 tracked files under `specs/` match a narrow lane pattern, and 65 of them are `graph-metadata.json` or `description.json`. Rewriting them is a different project from the removal.
- The trigger index holds 20,249 source paths, 16,869 of them under `specs/`. 989 of its paths match; only 8 are outside `specs/`, and all 8 are the READMEs and the reference F2 deletes. 334 of its phrases match; roughly 29 of those resolve to a path outside `specs/` (the count comes from a loose id match in a script, so treat it as approximate).

Recommended rule: the residue check scans tracked files with `specs/` excluded by path, excludes or allowlists the changelog folders per the F13 decision, allowlists the F14 files by path, and uses both patterns from F1. For the trigger index it does not grep the file; it regenerates the index and asserts that no matching phrase resolves to a path outside the excluded set. Grepping the raw index would fail forever on phrases that come from historical packets. [INFERENCE: based on the trigger-index path split, the specs match count and CORPUS_ROOTS at corpus.mjs 31]

## Questions Answered

- **Which docs, changelogs, feature catalogs, manual testing playbooks, READMEs, env references, graph-metadata trigger phrases and generated or compiled routing artifacts carry Ollama or semantic-lane remnants?** Answered by F1 to F14 with file and line. Four items inside it stay open and are listed below; none changes which files are on the list.
- Carried forward from iteration 3: `scoring-compatibility.json` is a generator input (F12). `embeddingText` goes with the lane (F12). `advisor_status` stays declared on four routes (F12).
- Carried forward from iteration 2: generator ownership for the generated files, except the leaf manifests (F11).

## Questions Remaining

- What removal order keeps every gate green, how are repo users machines cleaned (pulled model, vector tables, background server, env vars) without a backup, and what residue check proves nothing is left? Iteration 5 builds this from the four inventories.
- Are released changelog entries rewritten, or are changelog folders excluded from the residue check? No rule was found either way (F13). Operator decision.
- Who writes the advisor and spec-kit `leaf-manifest.json` and `leaf-aliases.json`? Not found (F11).
- Does the orphan sweeper keep its `ollama-preserve` guard at 491 (F10)?
- Are the three files named "five-lane" renamed (F5)?
- Does the "RSS watchdog (shared supervisor)" env subsection survive (F9)? It depends on what the launcher still supervises.
- Still open from earlier iterations: shadow weight renormalization, whether `SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC` is in scope, and whether the cleanup removes a pulled model it cannot prove it pulled.

## Ruled Out

- Grepping the raw `trigger-index.json` as a residue signal: 981 of its 989 matching paths are under `specs/`, so the file matches for as long as historical packets exist.
- Treating the strict pattern as sufficient: 66 files, including the advisor's `SKILL.md`, `ROUTER.md` and `graph-metadata.json`, match only the second vocabulary.
- Runtime mirror folders as a separate doc surface: the tracked-file sweep found no match outside `.skilled/`, `.github/`, `README.md`, `INSTALL-SKILLED.md` and `.env.example`.
- Looking for other skills' `graph-metadata.json` trigger phrases: only the advisor's own file matches.

## Dead Ends

- The files in F14 are not remnants and should not be revisited as inventory: cli-codex `--oss`, mcp-figma, sk-design's vector store, the deep-loop `semantic_shadow_only` namesake, sk-create-benchmark case studies, cite-drift redirects, sk-code `sqlite-vec` examples.

## Edge Cases

- Ambiguous input: the strategy's Next Focus is truncated; the full text from iteration 3 was used. The topic's "zero remnants ... changelog" has two readings (rewrite history, or exclude it); both are recorded in F13 and neither was chosen.
- Contradictory evidence: `system-deep-loop/package-lock.json` 21 lists a dependency under the shared package that the shared package does not declare. Recorded in F11 as a stale lockfile; the shared `package.json` is the better source.
- Missing dependencies: none.
- Partial success: three second-pattern doc hits (`daemon-lease-contract.md` 138, `watcher.md` 22, `auto-note.md` 19) and the three test READMEs' line counts were not read. Code files that appear only on the second list (`prompt-policy.ts`, `skill-advisor-cli-manifest.ts`, `content-normalizer.ts`, the `local-llm-features` benches, `trigger-extractor.vitest.ts`) were not opened; they are code, outside this iteration's doc focus, and iteration 5 should check them against the iteration 1 and 2 inventories.

## Sources Consulted

- `INSTALL-SKILLED.md`, `README.md`, `.env.example`, `.github/workflows/skill-advisor-stress.yml`
- `.skilled/skills/system-skill-advisor/`: `INSTALL-GUIDE.md`, `README.md`, `ARCHITECTURE.md`, `SKILL.md`, `ROUTER.md`, `graph-metadata.json`, `leaf-manifest.json`, `leaf-aliases.json`, `references/`, `feature-catalog/`, `manual-testing-playbook/`, `changelog/`, `scripts/doctor.sh`, `scripts/README.md`, `runtime/package.json`, `runtime/tsconfig.build.json`, runtime READMEs, `runtime/scripts/command-bridges/` (generator, input, output), `runtime/scripts/routing-accuracy/scorer-eval-baseline.json`, `runtime/lib/skill-graph/skill-graph-db.ts`
- `.skilled/skills/system-spec-kit/`: `runtime/ENV-REFERENCE.md`, `references/config/environment-variables.md`, `references/memory/embedder-pluggability.md` (match list and inbound links), `ARCHITECTURE.md`, `ROUTER.md`, `shared/README.md`, `leaf-manifest.json`, `leaf-aliases.json`, `runtime/data/trigger-index.json`, `runtime/cli/retrieval/lib/corpus.mjs`, changelogs
- `.skilled/skills/sk-doc/`: `scripts/tests/code-folder/*.json`, `scripts/tests/test_readme_*.py`, `shared/scripts/cite-drift-*`
- `.skilled/bin/README.md`, `.skilled/bin/lib/README.md`, `.skilled/scripts/orphan-mcp-sweeper.sh`, `.skilled/commands/create/assets/`, `.skilled/commands/doctor/_routes.yaml`, `.skilled/changelog/skilled/`
- Prior packet evidence: iterations 1 to 3

## Assessment

- New information ratio: 0.87
- Basis: 15 findings; 11 fully new (F1, F4, F5, F6, F7, F8, F10, F11, F12, F13, F14), 4 partially new (F2, F3, F9 extend files the starting inventory already named; F15 is a recommendation built on new counts). (11 + 0.5 x 4) / 15 = 0.87.
- Questions addressed: the docs and generated-surface question; three open checks from iteration 3; generator ownership from iteration 2; the residue check's exclusion rule.
- Questions answered: the docs and generated-surface question.

## Reflection

- What worked and why: running a second vocabulary pass and diffing its file list against the first. The lane is described in prose with words ("five-lane", "vector refresh", "semantic lane") that the identifier-shaped pattern never matches, and the diff surfaced the advisor's own identity files in one step.
- What did not work and why: the first inventory command combined `-l` with `-c`, so it returned file names without counts and the bucket table printed zeros. It cost one extra call to rebuild the counts with line numbers.
- What I would do differently: parse `trigger-index.json` as structured data from the start. Its 1,292 matching lines say nothing until they are split by source path, and that split is what decides the exclusion rule.

## Recommended Next Focus

Build the three deliverables from the four inventories. First the removal order with a gate after each step: doctor edits and the `includeSemanticHealth` flag removal in one commit (iteration 3, F6), `scoring-compatibility.json` hand-edit before the bridge regeneration, router and leaf-manifest edits in the same commit as each deleted doc, `doctor.sh` and `INSTALL-GUIDE.md` 105 before the dependency and the lane file go, then the regenerations (bridges, trigger index, skill-graph export, sk-doc baselines, lockfiles). Second the user-machine cleanup: vector tables and the active pointer in `skill-graph.sqlite`, the model server socket directory and process, the HuggingFace cache entry, the pulled Ollama model and its ownership question, env keys in user `.env` files. Third the residue check: both patterns, the path exclusions from F15, the allowlist from F14, and the regenerate-then-assert rule for the trigger index. While doing so, check the code files that only the second pattern found against the iteration 1 and 2 inventories, and state the open decisions (changelog history, `ollama-preserve`, the "five-lane" file names) as explicit options for the operator.
