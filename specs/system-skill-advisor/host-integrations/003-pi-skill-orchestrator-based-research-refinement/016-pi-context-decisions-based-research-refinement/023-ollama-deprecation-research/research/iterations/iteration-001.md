# Iteration 1: Advisor runtime inventory for the Ollama, embedding and semantic_shadow lane

## Focus

Inventory the advisor runtime (code, tests, launcher, database schema) that exists only for Ollama, embeddings or the `semantic_shadow` lane, with file:line, and trace how fusion, the lane registry and status depend on it.

Scope taken: `.skilled/skills/system-skill-advisor/runtime/` (sources, tests, scripts, schema), `.skilled/bin/` (launcher and its tests) and the live gitignored database on this machine, read-only. Doctor routes, docs and the fate of `system-spec-kit/shared/embeddings` are the other key questions and were only noted where the runtime touches them.

Path shorthand used in the lists below: `R/` means `.skilled/skills/system-skill-advisor/runtime/`. Every source tag carries the full repo-relative path.

## Actions Taken

1. Read config, state log, strategy and registry. Zero iteration records, so this is iteration 1; `iterations/` and `deltas/` were empty.
2. Counted and line-listed every match for `ollama|semantic_shadow|semanticShadow|nomic-embed|embedding|embedder|vec_*|EMBED_REFRESH|EXACT_SEMANTIC` under the advisor runtime (sources, then tests), excluding `node_modules` and `dist`.
3. Extracted schema DDL, exports and embedding functions from `skill-graph-db.ts`, and the import and export surface of `lib/embedders/*`, `semantic-shadow.ts`, `projection.ts`, `advisor-status.ts`.
4. Read `lane-registry.ts` in full and the fusion ranges that touch the lane.
5. Grepped the launcher and `.skilled/bin` for env forwarding and model-server supervision.
6. Queried the live `skill-graph.sqlite` read-only (`sqlite3 -readonly`) for tables, indexes, the active pointer and row counts.
7. Checked git tracking for `dist/`, `database/` and the `lib/shared/embeddings` symlink.

## Findings

### F1. Four source units exist only for the lane and can be deleted whole

- `R/lib/scorer/lanes/semantic-shadow.ts` (465 lines). Exports: `PROMPT_EMBEDDING_DEADLINE_MS` (32), `SemanticShadowRuntimeHealth` (39), `getSemanticShadowRuntimeHealth` (66), `PromptEmbeddingTimeoutError` (122), `setSemanticShadowPromptEmbedding` (146), `clearSemanticShadowPromptEmbedding` (150), `withSemanticShadowPromptEmbedding` (167), `_semanticShadowTest` (269), `scoreSemanticShadowExactSubset` (277), `scoreSemanticShadowLane` (356). [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:167]
- `R/lib/embedders/` (8 files plus `adapters/`): `adapter.ts` (10 lines), `types.ts` (8), `registry.ts` (14) and `adapters/ollama.ts` (7) are one-line re-export shims of `@spec-kit/shared/embeddings/*`; `schema.ts` (310) owns the vector tables and the active pointer; `embeddings-health.ts` (309) is the status probe; `index.ts` (42) is the barrel; two READMEs. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/embedders/registry.ts:14] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/embedders/adapters/ollama.ts:7] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/embedders/schema.ts:16] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/embedders/embeddings-health.ts:12]
- `R/lib/shared/embeddings`, a tracked symlink (git mode 120000) to `../../../../system-spec-kit/shared/embeddings`, plus its two exclude entries in the build config and three rows in the folder README. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tsconfig.build.json:27] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/shared/README.md:26]
- `R/scripts/measure-embedder-cost.mjs` (whole file: imports the shared dist adapter at 29 to 30, pins `nomic-embed-text:v1.5` at 36 to 38, reads `OLLAMA_BASE_URL` at 58, scans for `ollama serve` at 109). [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/measure-embedder-cost.mjs:29]

### F2. Sixteen mixed source files need line-level edits

- `R/advisor-server.ts`: imports 23 and 26; `ensureActiveEmbedder` startup block 398 to 411; startup background refresh 444 to about 464. [SOURCE: .skilled/skills/system-skill-advisor/runtime/advisor-server.ts:402] [SOURCE: .skilled/skills/system-skill-advisor/runtime/advisor-server.ts:445]
- `R/lib/daemon/watcher.ts`: import 15; refresh after reindex 496 to about 515. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/daemon/watcher.ts:496]
- `R/handlers/skill-graph/scan.ts`: import 7, `refreshSkillEmbeddings` call 54, `embeddings` response field 67. The field is part of the scan response contract. [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/skill-graph/scan.ts:54]
- `R/handlers/advisor-recommend.ts`: imports 28 to 30; `mergeSemanticShadowRuntimeLaneHealth` 110 to about 126; the whole scored call is wrapped in `withSemanticShadowPromptEmbedding` at 601 to 618. [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:601]
- `R/handlers/advisor-status.ts`: imports 19, 21, 26 to 30, 32; `SemanticLaneHealth` 57; `vec_metadata` reader 136 to 137; `baseSemanticLaneHealth` and `readSemanticLaneHealth` 151 to 251; `probeSemanticLaneBackend` 392 to about 420; call sites 538, 562, 579 to 584. [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts:163] [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts:579]
- `R/schemas/advisor-tool-schemas.ts`: `semanticLaneHealthSchema` from 243; inputs `includeSemanticHealth` 385 and `includeEmbeddingsHealth` 386; `embeddingsHealthSchema` from 395; outputs 459 and 460. [SOURCE: .skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:243] [SOURCE: .skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:385]
- `R/tools/advisor-status.ts` 16 to 17 and `R/skill-advisor-cli-manifest.ts` 87 to 88: the two status options in the MCP tool schema and the CLI manifest. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tools/advisor-status.ts:16] [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli-manifest.ts:87]
- `R/lib/scorer/types.ts`: `AdvisorEmbeddingSignature` 84, `AdvisorEmbeddingStalenessVerdict` 92, projection fields 113 to 114. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/types.ts:84]
- `R/lib/scorer/projection.ts`: imports 14, 16, 25 to 26; the embedding staleness block 1390 to about 1690 (pointer keys 1411 to 1413, `vec_[0-9]*` table glob 1540, legacy inline summary 1574 to 1583, `readAdvisorEmbeddingStaleness` 1676); use at 1743 and 1762 to 1763. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:1676] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:1540]
- `R/lib/skill-graph/skill-graph-db.ts`: imports 20 to 25 and 40; result and row types 107 to 138; `encodeEmbedding`, `decodeEmbedding`, `skillDescriptionForEmbedding` 726 to 739; `readCommandEmbeddingSources` 755; `providerModelId` 816; everything from `refreshSkillEmbeddings` (1299) through `appendCommandEmbeddingRows` (1871 to about 1920), including `embeddingCoverage` 1325, `refreshEmbeddingsInBackground` 1442 with the `SYSTEM_SKILL_ADVISOR_EMBED_REFRESH` read at 1449, the Ollama probe 1507 to 1510 and `loadSkillEmbeddings` 1790. Schema lines are in F4. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:1299] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:1449]
- Single-line touches: `R/lib/scorer/weights-config.ts` 18 (`SEMANTIC_SHADOW_WEIGHT`), `R/lib/scorer/lanes/graph-causal.ts` 88 (skips the lane), `R/lib/metrics.ts` 666 (lane list), `R/lib/prompt-policy.ts` 265 (comment). [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/weights-config.ts:18] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/graph-causal.ts:88] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:666]
- Embedder command rows (overlap with the doctor question): `R/lib/scorer/projection.ts` 768 to 779 and `R/lib/command-attach.ts` 97 and 166. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:97]

### F3. How fusion, the lane registry and status depend on the lane

- The lane is one row in `LANE_DEFINITIONS`. `ScorerLaneId` (31), `SCORER_LANE_IDS` (96) and both weight records derive from that array, so deleting line 13 removes the id from the type everywhere. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts:13] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts:96]
- That type feeds the public contract: `AdvisorLaneSchema = z.enum(SCORER_LANE_IDS)` and the status `laneWeights` record keyed by it. Removing the lane changes the tool output shape from five lane keys to four. [SOURCE: .skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:21] [SOURCE: .skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:458]
- Every `Record<ScorerLane, number>` literal must drop the key or the compile fails: the five query-class multiplier rows in fusion at 197 to 205 and the fixtures in the tests listed in F6. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:197]
- Live weights sum to 0.95 with or without the lane (0.42 + 0.28 + 0.13 + 0.12 + 0). Shadow weights sum to 1.00 with it (0.40 + 0.25 + 0.20 + 0.10 + 0.05) and 0.95 without. The removal has to decide whether the shadow channel is renormalized. [INFERENCE: arithmetic on the five rows at .skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts:9 to 13]
- Fusion call sites: import 32; lane scoring 541; `projectionRuntimeLaneHealth` 299 to 315 and its call 1300 to 1304. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:541] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:305]
- Exact semantic rerank: flag and constants 77 to 80, enable check 169 to 172, index builder 396 to 412 (calls `scoreSemanticShadowExactSubset` at 408), comparator branch 1450 to 1459. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:77] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:408]
- A second dependent path that the starting inventory did not name: command "meaning" matching. `COMMAND_MEANING_MIN_COSINE` and `COMMAND_MEANING_MARGIN` (869 to 870), `commandMeaningCosine` (876 to 881), the `meaningPassed` half of `requireCommandPhraseAnchor` (908 to 948), `rankMeaningPassedCommandFirst` (1098 onward) and the two call sites (1622, 1635) all read the lane's contribution and accept only real `cosine:` evidence. Without the lane, `meaningPassed` is always empty and this half is dead code. The phrase-anchor half of `requireCommandPhraseAnchor` does not depend on the lane and stays. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:876] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:919] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1635]
- Status derives the lane's `disabledReason` from `DEFAULT_SCORER_LANE_WEIGHTS.semantic_shadow` and reads `vec_metadata` and `vec_<dim>` directly. [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts:212] [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts:137]
- Under Vitest the lane does not call an embedder; it substitutes word-overlap fixture vectors. The committed routing baselines were therefore captured with a fixture lane present in the shadow channel at weight 0.05, so baselines that record shadow telemetry or five-lane contributions may need recapture after removal. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:175] [INFERENCE: the fixture branch at semantic-shadow.ts:175 plus the 0.05 shadow weight at lane-registry.ts:13; not confirmed by running a capture]

### F4. Database schema objects, and what is on this machine

Code that creates them:

- `vec_metadata` is created twice: in the base schema and in the embedder schema helper. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:262] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/embedders/schema.ts:86]
- `vec_<dim>` (skills) and `vec_cmd_<dim>` (commands) are created per dimension, each with `idx_<table>_model` and `idx_<table>_hash`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/embedders/schema.ts:71] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/embedders/schema.ts:81] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/embedders/schema.ts:126]
- A legacy inline store the starting inventory did not name: three columns on `skill_nodes` (`embedding`, `embedding_model_id`, `embedding_content_hash`) in the base DDL at 235 to 237, re-added by migration at 398 to 405, indexed at 408 to 409 (`idx_skill_nodes_embedding_model`, `idx_skill_nodes_embedding_hash`) and copied through the table rebuild at 438 to 456. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:235] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:399] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:408]
- `SCHEMA_VERSION` is 1 and the only version logic is an upward stamp. Every table is `CREATE TABLE IF NOT EXISTS` and no code drops a vector table. Deleting the code therefore leaves the tables, indexes and columns on every existing database; they go only through an explicit drop step or a full database rebuild. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:151] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:533]

Observed on this machine (read-only query of `R/database/skill-graph.sqlite`, command output, exit 0):

- Tables `vec_metadata`, `vec_768`, `vec_cmd_768` and `vec_1024`; indexes `idx_vec_768_*`, `idx_vec_cmd_768_*`, `idx_vec_1024_*` and the two `idx_skill_nodes_embedding_*`. [INFERENCE: direct observation, not a derivation: `sqlite_master` listing from the read-only query this run; the database is gitignored, so no tracked file:line exists for it]
- Pointer rows: `active_embedder_name=nomic-embed-text-v1.5`, `active_embedder_dim=768`, `active_embedder_provider=ollama`. [INFERENCE: direct observation from the same query, `SELECT key, value FROM vec_metadata`]
- `vec_768` holds 15 rows (model `nomic-embed-text-v1.5`), `vec_cmd_768` 47 rows, `skill_nodes` inline embeddings 0, `schema_version` 1. [INFERENCE: direct observation from the same query, `count(*)` per table]
- `vec_1024` exists and returned no model ids, which reads as empty. It is an orphan from an earlier embedder and is not in the starting inventory. The projection already scans `vec_[0-9]*`, so user machines can hold any dimension; a residue check must glob, not hard-code 768. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:1540]
- The same directory holds `skill-graph.sqlite.pre-doctor-skill-advisor-rebuild.20261028152419.bak` (471,040 bytes), an untracked backup covered by the `*.sqlite.*` ignore line. A pre-rebuild backup can carry the same vector tables, so the user-machine cleanup has to cover these files under "delete, never back up". Its contents were not opened. [SOURCE: .skilled/skills/system-skill-advisor/runtime/database/.gitignore:4]

### F5. Launcher: three known env keys, plus a model-server supervisor nobody listed

- Known: the child-env allowlist forwards `OLLAMA_BASE_URL`, `OLLAMA_REQUEST_TIMEOUT_MS` (184 to 186) and `SYSTEM_SKILL_ADVISOR_EMBED_REFRESH` (187 to 188). Test: `.skilled/bin/launcher-threshold-env.vitest.ts` 22 to 39. [SOURCE: .skilled/bin/system-skill-advisor-launcher.cjs:185] [SOURCE: .skilled/bin/launcher-threshold-env.vitest.ts:22]
- New: the advisor launcher also supervises a local HuggingFace embedding server. Module load 21 and 30 to 32; lease field and files dir 104 to 113; allowlist keys `SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED`, `SPECKIT_HF_MODEL_SERVER_IDLE_TIMEOUT_MIN`, `HF_EMBEDDINGS_MODEL`, `HF_EMBED_SERVER_URL` at 180 to 183; socket default 347 to 348; lease flag 529; section "MODEL SERVER CONTROL" 1115 to about 1310; exit hooks 1668 and 1701; pin 1739; demand listener 1800 to 1804. [SOURCE: .skilled/bin/system-skill-advisor-launcher.cjs:1115] [SOURCE: .skilled/bin/system-skill-advisor-launcher.cjs:180] [SOURCE: .skilled/bin/system-skill-advisor-launcher.cjs:1800]
- Its parts: `.skilled/bin/hf-model-server.cjs` (default model `nomic-ai/nomic-embed-text-v1.5`), `.skilled/bin/lib/model-server-supervision.cjs`, and the client in the shared package. Among `.skilled/bin` files, the advisor launcher is the only caller of the supervision module. [SOURCE: .skilled/bin/hf-model-server.cjs:30] [SOURCE: .skilled/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:53]
- Consequence for the cleanup design: "background server" on a user machine has two candidates. `ollama serve` is user-owned and external. The HF model server is repo-owned, spawned by this launcher, and keeps pid, lock and socket files in `/tmp/system-hf-embed` by default. [SOURCE: .skilled/bin/system-skill-advisor-launcher.cjs:113]
- The orphan sweeper knows both: an `hf-model-server` class at 216 and 504, and an `ollama-preserve` class at 491. [SOURCE: .skilled/scripts/orphan-mcp-sweeper.sh:491] [SOURCE: .skilled/scripts/orphan-mcp-sweeper.sh:216]
- `SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC` is forwarded at 163 and set by about 25 tests and scripts and by `advisor-validate.ts` 423. A grep over `.skilled` (excluding docs, JSON, `dist`, `node_modules`) found writers only and no reader, so it looks like a dead flag left from an earlier semantic path. This rests on that grep; a reader that exists only in compiled `dist` or outside `.skilled` would refute it. `R/scripts/routing-accuracy/scorer-eval-baseline.json` 9 records the flag as data. [SOURCE: .skilled/bin/system-skill-advisor-launcher.cjs:163] [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-validate.ts:423]

### F6. Tests: 20 dedicated files, about 30 files to edit

Dedicated to the lane (delete whole). Classified from the module header and import lines of each file; the bodies were not read in full.

- `R/tests/embedders/`: `embeddings-health.vitest.ts`, `ensure-active-embedder.vitest.ts`, `registry.vitest.ts`, `schema.vitest.ts`, `shared-factory-parity.vitest.ts`, `README.md`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/embedders/registry.vitest.ts:5] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/embedders/ensure-active-embedder.vitest.ts:15]
- `R/tests/daemon/watcher-embedding-refresh.vitest.ts`; `R/tests/handlers/semantic-outage-degraded.vitest.ts`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/daemon/watcher-embedding-refresh.vitest.ts:2] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/handlers/semantic-outage-degraded.vitest.ts:3]
- `R/tests/scorer/`: `semantic-shadow-ablation.vitest.ts`, `semantic-shadow-cosine.vitest.ts`, `semantic-lane-promotion.vitest.ts`, `projection-embedding-staleness.vitest.ts`, `fixtures/seed-skill-embeddings.ts` and the `fixtures/.embeddings-cache/` directory. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/scorer/semantic-shadow-ablation.vitest.ts:9] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/scorer/fixtures/seed-skill-embeddings.ts:10]
- `R/tests/semantic-lane-weight-zero.vitest.ts`, `R/tests/semantic-prompt-embedding-degrade.vitest.ts`, `R/tests/skill-graph-embedding-outage.vitest.ts`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/semantic-prompt-embedding-degrade.vitest.ts:2] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/skill-graph-embedding-outage.vitest.ts:2]
- `R/tests/skill-graph/`: `embedding-coverage.vitest.ts`, `refresh-in-background.vitest.ts`, `refresh-roundtrip.vitest.ts`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/skill-graph/refresh-in-background.vitest.ts:2] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/skill-graph/refresh-roundtrip.vitest.ts:2]

Needs a body read before delete-or-edit is settled:

- `R/tests/scorer/lane-weight-sweep.vitest.ts` (34 matches in 667 lines; imports the shared embeddings factory at 9). [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/scorer/lane-weight-sweep.vitest.ts:9]
- `R/tests/scorer/conflict-query-rerank.vitest.ts` (17 in 220; imports the rerank flag at 9 and the lane test hooks at 17 to 18). [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/scorer/conflict-query-rerank.vitest.ts:9]
- `R/tests/command-meaning-anchor.vitest.ts` (506 lines, 54 references to the meaning path). It covers `requireCommandPhraseAnchor`, whose phrase half survives, so this is an edit, not a delete. `R/tests/scorer/doctor-ordering.vitest.ts` has 6 references to the same path. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/command-meaning-anchor.vitest.ts:7]

Edit (lane-only lines inside tests that otherwise stay):

- Status and launcher: `R/tests/handlers/advisor-status.vitest.ts` (75 matches in 965 lines, Ollama mocks from 13); `R/tests/launcher-bootstrap.vitest.ts` (imports the shared factory at 15, model-server expectations 25 to 279, Ollama pointer fixtures 331 to 366); `R/tests/launcher-model-server-default.vitest.ts` (whole file is model-server supervision; fate follows F5); `.skilled/bin/launcher-threshold-env.vitest.ts` 22 to 39. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-status.vitest.ts:13] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/launcher-bootstrap.vitest.ts:335]
- Lane-key fixtures (`semantic_shadow: ...`): `R/tests/scorer/lane-registry-env-override.vitest.ts` 15, 23, 89; `R/tests/scorer/native-scorer.vitest.ts` 22, 54, 115; `R/tests/scorer/runtime-lane-health.vitest.ts` 8; `R/tests/scorer/rrf-determinism-spine.vitest.ts` 80; `R/tests/lane-attribution.test.ts` 56; `R/tests/shadow-sink.vitest.ts` 34, 43; `R/tests/compat/daemon-probe.vitest.ts` 29; `R/tests/handlers/advisor-recommend.vitest.ts` 54; `R/tests/handlers/advisor-recommend-unavailable.vitest.ts` 56, 116; `R/tests/advisor-rebuild.vitest.ts` 31; `R/tests/python/test_skill_advisor.py` 915, 927; stress tests `R/stress-test/skill-advisor/advisor-recommend-handler-stress.vitest.ts` 79, `mcp-diagnostics-stress.vitest.ts` 75, `scorer-extras-stress.vitest.ts` 73. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/scorer/lane-registry-env-override.vitest.ts:15] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/lane-attribution.test.ts:56]
- Contract and schema fixtures: `R/tests/cli-exit-taxonomy.vitest.ts` 79 to 88; `R/tests/skill-advisor-cli-job-semantics.vitest.ts` 52, 147, 156; `R/tests/skill-advisor-cli-test-utils.ts` 81 to 82 (`SYSTEM_SKILL_ADVISOR_EMBED_REFRESH: 'off'`); `R/tests/handlers/advisor-trust-gate.vitest.ts` 20, 202 to 204; `R/tests/skill-graph-db.vitest.ts` 231, 293; `R/tests/scorer/projection-fallback-049-005.vitest.ts` 79 to 80; `R/tests/shared-import-specifier-extension.vitest.ts` 15, 54 to 62; `R/tests/command-bridges-drift-guard.vitest.ts` 24, 227, 392; `R/tests/parity/holdout-independent.vitest.ts` 95 (lists the ablation test path). [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-test-utils.ts:82] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts:95]
- Comment-only: `R/tests/doctor-routing-slice.vitest.ts` 57; `R/tests/scorer/doctor-handoff-command.vitest.ts` 40; `R/tests/parity/local-native-divergence-ratchet.vitest.ts` 17 to 18; `R/tests/parity/scorer-eval-baseline-ratchet.vitest.ts` 107. READMEs: `R/tests/README.md` 69, 157, 176; `R/tests/skill-graph/README.md`; `R/tests/scorer/fixtures/README.md`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/README.md:157]
- Not a remnant: `R/tests/routing-parity-deep-skills.vitest.ts` 55 and 71 use the word "embedder" inside prompt-corpus text. A residue grep will hit these two lines and needs an allow entry or reworded prompts. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/routing-parity-deep-skills.vitest.ts:55]

### F7. Scripts and generated artifacts inside the runtime

- `R/scripts/command-bridges/derive-command-bridges.cjs` builds an `embeddingText` field whose only reader is an embedder (690 to 693, emitted at 1353). The tracked `command-bridges.generated.json` carries 47 such fields, the same count as `vec_cmd_768` rows, and `readCommandEmbeddingSources` reads them. Removing the field means regenerating the artifact and updating the drift guard. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:1353] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:755]
- `R/scripts/routing-accuracy/capture-command-routing-baseline.mjs` has a `--real-embedding` mode: comments 27 and 38, dist lane module path 68, probe constants 103 to 105 (`http://localhost:11434/api/tags`, `nomic-embed-text`), preflight 141 to 198, option handling 405 to 423, 491 to 492 and 796 to 808. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs:103] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs:798]
- `R/scripts/routing-accuracy/run-command-behaviour.mjs` 1014 lists the `OLLAMA_` env prefix; `capture-scorer-eval-baseline.mjs` 58 and `derive-ambiguity-slice.mjs` 51 carry fixture-vector comments. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:1014]
- Embedder command rows in data: `R/scripts/skill_advisor.py` 2737 to 2740 and `R/scripts/command-bridges/scoring-compatibility.json` 266 to 268 and 611 to 613. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:2737] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json:266]
- Not lane code: `skill_advisor.py` 1793, 1907 to 1908 and 1921 route the words "embedding", "embeddings" and "voyage" to `system-spec-kit`. Whether they stay depends on what remains of embeddings in spec-kit. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:1907]

### F8. Build wiring: the advisor keeps `@spec-kit/shared`, only the embeddings subpath is cut

- The advisor build first builds the shared package and links it as a file dependency. [SOURCE: .skilled/skills/system-skill-advisor/runtime/package.json:12] [SOURCE: .skilled/skills/system-skill-advisor/runtime/package.json:21]
- Non-embedding imports of the shared package that stay: RRF fusion, the IPC socket server and frontmatter parsing. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:9] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/ipc/socket-server.ts:16] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/doc-frontmatter.ts:16]
- `R/dist/` has zero tracked files. Compiled lane modules therefore persist on every machine until a clean rebuild, and one script loads `dist/lib/scorer/lanes/semantic-shadow.js` directly. The residue check has to cover `dist`, and the removal needs a clean build step, not an incremental one. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs:68] [INFERENCE: `git ls-files R/dist` returned 0 files; TypeScript does not delete outputs of removed sources]

## Questions Answered

- Which advisor runtime files, functions, tests, launcher lines and database schema objects (tables, migrations, columns) exist only for Ollama, embeddings or the semantic_shadow lane, with file:line?

Answered by F1 to F8. Two parts carry a named caveat: three test files need a body read before delete-or-edit is settled (F6), and the launcher's model-server block is inventoried but its fate depends on the shared-package question (F5).

## Questions Remaining

- Which doctor routes, YAML workflows, presentation files, scripts and their tests reference the embedder, and what must each say or do after removal?
- Which docs, changelogs, feature catalogs, manual testing playbooks, READMEs, env references, graph-metadata trigger phrases and generated or compiled routing artifacts carry Ollama or semantic-lane remnants?
- Who else consumes system-spec-kit/shared/embeddings, and can the package and its tests be deleted entirely or only in part?
- What removal order keeps every gate green, how are repo users machines cleaned without a backup, and what residue check proves nothing is left?

Open sub-items this iteration raised, for the questions above:

- Is the HF model server (launcher supervision, `hf-model-server.cjs`, `model-server-supervision.cjs`, about 14 spec-kit test files) still used by anything once the advisor lane is gone?
- Is `SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC` in scope for this removal, given it has no reader?
- Does the command "meaning" path go with the lane, and which baselines record it?
- Should the shadow weight channel be renormalized after losing 0.05?

## Ruled Out

- Reading `dist/` as an inventory source: it is untracked build output, so it tells the residue check where stale files live but is not a file to edit.
- Treating every "embedding" grep hit as a remnant: `routing-parity-deep-skills.vitest.ts` 55 and 71 and `skill_advisor.py` 1793 are prompt or keyword text.

## Dead Ends

None this iteration.

## Edge Cases

- Ambiguous input: "exists only for" was read as "has no purpose once the lane, the embedder and the vectors are gone". The model-server supervisor fits "embeddings" but may serve another consumer, so it is inventoried and its fate deferred.
- Contradictory evidence: the strategy's Known Context names three vector tables; the live database has a fourth, `vec_1024`. Both are recorded; the live query is the stronger source for this machine.
- Missing dependencies: none. `resource-map.md` is absent and the coverage gate was skipped by the workflow.
- Partial success: none. The state log holds an earlier `iteration_start` and a `dispatch_failure` (`recursion-guard-ancestry`) for iteration 1; no iteration record existed, so this run is iteration 1.

## Sources Consulted

- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts` (full read)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts` (ranges 164 to 176, 296 to 318, 396 to 416, 528 to 546, 868 to 925, 1098 to 1110, 1296 to 1308, 1440 to 1462)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts`, `projection.ts`, `types.ts`, `weights-config.ts`
- `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts`
- `.skilled/skills/system-skill-advisor/runtime/lib/embedders/*`
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts`, `advisor-recommend.ts`, `skill-graph/scan.ts`, `advisor-validate.ts`
- `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts`, `tools/advisor-status.ts`, `skill-advisor-cli-manifest.ts`
- `.skilled/skills/system-skill-advisor/runtime/advisor-server.ts`, `lib/daemon/watcher.ts`
- `.skilled/skills/system-skill-advisor/runtime/tests/**`, `stress-test/**` (match listing)
- `.skilled/skills/system-skill-advisor/runtime/scripts/**`
- `.skilled/skills/system-skill-advisor/runtime/package.json`, `tsconfig.build.json`, `database/.gitignore`
- `.skilled/bin/system-skill-advisor-launcher.cjs`, `.skilled/bin/launcher-threshold-env.vitest.ts`, `.skilled/bin/hf-model-server.cjs`
- `.skilled/scripts/orphan-mcp-sweeper.sh`
- Live database `.skilled/skills/system-skill-advisor/runtime/database/skill-graph.sqlite`, queried read-only
- `git ls-files` for `dist`, `database` and the `lib/shared/embeddings` symlink

## Assessment

- New information ratio: 0.75
- Basis: 8 findings; F1, F6, F7 and F8 are fully new, F2 to F5 extend the starting inventory in the strategy's Known Context. (4 + 0.5 x 4) / 8.
- Questions addressed: the runtime inventory question.
- Questions answered: the runtime inventory question, with the two caveats above.

## Reflection

- What worked and why: one wide pattern counted per file, then line listings for the dense files. The counts separated dedicated files from mixed ones before any file was opened, which kept the read budget for the files that decide the design (lane registry, fusion, schema).
- What worked and why: querying the live database instead of trusting the DDL. It surfaced `vec_1024` and the `.bak` file, neither of which any source file mentions.
- What did not work and why: classifying tests from headers and match density. It is fast but leaves three files undecided, because a file can import lane hooks and still test surviving behavior.
- What I would do differently: grep the symbol names of the dependent paths (`meaningPassed`, model-server functions) in the first pass, since two of the larger surprises were code that never says "embedding" or "ollama".

## Recommended Next Focus

Trace the consumers of `system-spec-kit/shared/embeddings` and of the HF model server (`hf-model-server.cjs`, `model-server-supervision.cjs`, `providers/hf-local.ts`, the auto-select cascade, spec-kit memory, the sk-doc validator and the spec-kit embedder test suites), to settle whether the package, the model server and the launcher's supervision block are deleted whole or in part. That answer decides the fate of F5's model-server block and of about 14 spec-kit test files, and it has to precede the removal-order question. Doctor routes and docs can follow in the iteration after.
