# Research: Removing the skill advisor Ollama and embedding semantic lane

Five iterations, run as Fable 5.2 at high effort on the claude2 account, answered all five key questions. The full evidence with line numbers is in `iterations/iteration-NNN.md`. Sections 1 to 5 below are the per-iteration synthesis; this summary states the answer.

## Answer

The lane can be deleted whole, with nothing kept behind a flag, in eight ordered steps (section 5.2).

- **Scope.** 332 tracked files outside `specs/` carry a remnant at commit `44251c5befd`: 279 match the identifier pattern and 163 the prose pattern ("five-lane", "vector refresh", "semantic lane"), 23 of them in changelog folders.
- **The shared embeddings package goes too.** Its only production importers are the advisor's `lib/embedders/`, the launcher's model-server path, `shared/types.ts` (a type import) and the sk-doc model-reference validator. Spec-kit memory, its former consumer, is retired. The HuggingFace model server, its supervision library and the `@huggingface/transformers` dependency have no user once the package goes.
- **Order matters in four places.** Doctor edits land before the status flag is removed, because the status schema is strict. The lane id, status contract and vector DDL change in one commit, because the lane type derives from the registry row. `shared/types.ts` changes before the package folder is deleted. A deleted routed doc lands with its regenerated leaf manifest.
- **Existing databases are discarded and rescanned**, not migrated: raise `SCHEMA_VERSION` so no drop code carries lane names, and delete `.bak` and `.corrupt` copies.
- **User machines** get one cleanup tool, wired into `/doctor:update apply`. It deletes repo-owned leftovers without asking, asks before touching the shared Ollama and HuggingFace stores (nothing records who pulled the model), and only reports a running `ollama serve` and lane keys in dotenv files.
- **Proof of zero remnants** is a residue check modeled on `sweep-memory-residue.mjs`. It runs a repo mode and a machine mode, with exact-path allowlist rows and a planted-term fixture that must fail. It is the one permanent place the vocabulary stays.
- **Routing does not change.** The live weight is 0 and no tracked routing baseline records the lane, so the routing ratchets double as the neutrality proof.
- **Seven operator decisions** remain, each with a recommended default (section 5.6).


Path shorthand: `R/` means `.skilled/skills/system-skill-advisor/runtime/`.

## Status after iteration 1

- Answered: the advisor runtime inventory (code, tests, launcher, database schema).
- Open: doctor routes and workflows; docs, changelogs, playbooks and generated routing artifacts; the fate of `system-spec-kit/shared/embeddings`; removal order, user-machine cleanup and the residue check.

## 1. Runtime inventory (iteration 1)

### 1.1 Delete whole

- `R/lib/scorer/lanes/semantic-shadow.ts` (465 lines). [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:167]
- `R/lib/embedders/` (shims over `@spec-kit/shared/embeddings`, `schema.ts`, `embeddings-health.ts`, barrel, READMEs). [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/embedders/registry.ts:14]
- `R/lib/shared/embeddings` symlink and its build-config excludes. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tsconfig.build.json:27]
- `R/scripts/measure-embedder-cost.mjs`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/measure-embedder-cost.mjs:29]
- 20 dedicated test files: `R/tests/embedders/*`, `daemon/watcher-embedding-refresh`, `handlers/semantic-outage-degraded`, `scorer/semantic-shadow-ablation`, `scorer/semantic-shadow-cosine`, `scorer/semantic-lane-promotion`, `scorer/projection-embedding-staleness`, `scorer/fixtures/seed-skill-embeddings.ts` with `.embeddings-cache/`, `semantic-lane-weight-zero`, `semantic-prompt-embedding-degrade`, `skill-graph-embedding-outage`, `skill-graph/embedding-coverage`, `skill-graph/refresh-in-background`, `skill-graph/refresh-roundtrip`. Classified from headers and imports, not full reads. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/scorer/semantic-shadow-ablation.vitest.ts:9]

### 1.2 Edit in place

- Daemon start and watcher: `advisor-server.ts` 23, 26, 398 to 411, 444 to 464; `lib/daemon/watcher.ts` 15, 496 to 515. [SOURCE: .skilled/skills/system-skill-advisor/runtime/advisor-server.ts:445] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/daemon/watcher.ts:496]
- Handlers: `advisor-recommend.ts` 28 to 30, 110 to 126, 601 to 618; `advisor-status.ts` 19 to 32, 57, 136 to 137, 151 to 251, 392 to 420, 538, 562, 579 to 584; `skill-graph/scan.ts` 7, 54, 67. [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:601] [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts:163]
- Public contract: `schemas/advisor-tool-schemas.ts` 243 onward, 385 to 386, 395 onward, 459 to 460; `tools/advisor-status.ts` 16 to 17; `skill-advisor-cli-manifest.ts` 87 to 88. [SOURCE: .skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:385]
- Scorer: `lane-registry.ts` 13; `fusion.ts` 32, 77 to 80, 169 to 172, 197 to 205, 299 to 315, 396 to 412, 541, 869 to 881, 908 to 948, 1098 onward, 1300 to 1304, 1450 to 1459, 1622, 1635; `types.ts` 84 to 99, 113 to 114; `projection.ts` 14, 16, 25 to 26, 768 to 779, 1390 to 1690, 1743, 1762 to 1763; `weights-config.ts` 18; `lanes/graph-causal.ts` 88; `lib/metrics.ts` 666. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts:13] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:541]
- Skill graph store: `lib/skill-graph/skill-graph-db.ts` imports 20 to 25 and 40, types 107 to 138, helpers 726 to 816, embedding functions 1297 to 1920. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:1299]
- Launcher: `.skilled/bin/system-skill-advisor-launcher.cjs` 184 to 188, with `.skilled/bin/launcher-threshold-env.vitest.ts` 22 to 39. [SOURCE: .skilled/bin/system-skill-advisor-launcher.cjs:185]
- Scripts and generated data: `derive-command-bridges.cjs` 690 to 693 and 1353 (47 `embeddingText` fields in the tracked generated JSON); `capture-command-routing-baseline.mjs` `--real-embedding` mode; `run-command-behaviour.mjs` 1014. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:1353]
- About 30 test files with lane-key fixtures, status or scan contract fields, launcher env or schema DDL fixtures. Full list in iteration 1, finding F6.

### 1.3 Dependencies the removal must settle

- Removing the registry row changes the tool output from five lane keys to four, because the lane enum and the status weight record derive from it. [SOURCE: .skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:21]
- The shadow weight channel drops from 1.00 to 0.95; live weights stay at 0.95. [INFERENCE: arithmetic on lane-registry.ts lines 9 to 13]
- The command "meaning" path in fusion accepts only real cosine evidence from the lane and becomes dead code. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:876]
- The advisor keeps `@spec-kit/shared` for RRF fusion, IPC and frontmatter parsing; only the embeddings subpath is cut. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:9]

### 1.4 Database objects

- `vec_metadata`, `vec_<dim>`, `vec_cmd_<dim>` and their `_model` and `_hash` indexes. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/embedders/schema.ts:71] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:262]
- Legacy inline store on `skill_nodes`: columns `embedding`, `embedding_model_id`, `embedding_content_hash` and two indexes. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:235]
- No code drops any of these and the schema version only moves up, so existing databases keep them until an explicit drop or a rebuild. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:533]
- Observed on this machine: `vec_768` (15 rows), `vec_cmd_768` (47 rows), an orphan `vec_1024`, pointer `nomic-embed-text-v1.5 / 768 / ollama`, and an untracked `.bak` pre-rebuild copy beside the database.

### 1.5 Leads for the next iterations

- The advisor launcher supervises a HuggingFace model server (section at 1115 to 1310, allowlist 180 to 183). Whether it goes depends on who else uses `shared/embeddings`. [SOURCE: .skilled/bin/system-skill-advisor-launcher.cjs:1115]
- `SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC` has writers and no reader in a grep of `.skilled`; scope decision open. [SOURCE: .skilled/bin/system-skill-advisor-launcher.cjs:163]
- `R/dist/` is untracked, so compiled lane files persist until a clean rebuild; the residue check must cover it.
- A residue check must match vector tables by pattern, not by dimension 768, and needs an allow entry for two prompt-corpus lines that use the word "embedder". [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/routing-parity-deep-skills.vitest.ts:55]

## Status after iteration 2

- Answered: the runtime inventory; who consumes `system-spec-kit/shared/embeddings` and whether it can be deleted whole (it can).
- Open: doctor routes and workflows; docs, changelogs, playbooks and generated routing artifacts; removal order, user-machine cleanup and the residue check.
- Closed lead from 1.5: the HuggingFace model server has no user once the lane is gone, so it is deleted too.

## 2. The shared embeddings package and the HF model server (iteration 2)

Path shorthand: `K/` means `.skilled/skills/system-spec-kit/`.

### 2.1 Verdict

Delete the package whole. Its only production importer is the advisor's `lib/embedders/` folder, which section 1.1 already deletes. No handler, CLI, hook or library in spec-kit imports it; spec-kit memory is retired. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/embedders/embeddings-health.ts:12] [SOURCE: .skilled/skills/system-spec-kit/shared/README.md:116] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-memory-residue.mjs:5]

### 2.2 Delete whole

- `K/shared/embeddings/` (14 tracked files, 5,376 lines). No export row or tsconfig row to remove: the subpath resolves through a wildcard. [SOURCE: .skilled/skills/system-spec-kit/shared/package.json:11]
- `.skilled/bin/hf-model-server.cjs`, `.skilled/bin/lib/model-server-supervision.cjs` and the launcher's supervision section. The server's only client is `providers/hf-local.ts` inside the package, and the spawner is off unless `SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED=1`. [SOURCE: .skilled/bin/system-skill-advisor-launcher.cjs:1118] [SOURCE: .skilled/skills/system-spec-kit/shared/embeddings/factory.ts:10]
- Shared package tests (4 of 16): `auto-select.test.ts`, `registry.test.ts`, `profile.test.ts`, `model-server-constants.test.ts`. [SOURCE: .skilled/skills/system-spec-kit/shared/tests/registry.test.ts:22]
- Spec-kit runtime tests (24 files): `K/runtime/tests/embedders/` (12), `K/runtime/tests/local-llm-features/` (7), `factory-auto-resolution`, `api-key-validation`, `api-validation`, `model-server-demand-probe`, `model-server-respawn-lock-atomic`. This replaces iteration 1's estimate of about 14. No CI workflow, Vitest config or `package.json` names them. [SOURCE: .skilled/skills/system-spec-kit/runtime/tests/embedders/hf-local-client.vitest.ts:14] [SOURCE: .skilled/skills/system-spec-kit/runtime/tests/factory-auto-resolution.vitest.ts:11]
- `sk-doc/scripts/validate-doc-model-refs.js` (recommended). It reads `registry.ts` as text and has no other canonical source. Its callers go with it: the report-only CI step, one validation-switch test row, the typo-flag test and the scripts README row. [SOURCE: .skilled/skills/sk-doc/scripts/validate-doc-model-refs.js:25] [SOURCE: .github/workflows/advisory-checks.yml:63]
- The `@huggingface/transformers` rows in two `package.json` files, both lockfiles, and the import check in the advisor's `scripts/doctor.sh`. Only the model server imports the module. [SOURCE: .skilled/skills/system-skill-advisor/runtime/package.json:20] [SOURCE: .skilled/skills/system-spec-kit/package.json:48] [SOURCE: .skilled/skills/system-skill-advisor/scripts/doctor.sh:58]

### 2.3 Edit in place

- `K/shared/types.ts`: the type import at line 5 and the embedding type section. The shared build fails if the folder is deleted before this edit. [SOURCE: .skilled/skills/system-spec-kit/shared/types.ts:5]
- Six tests: `launcher-ipc-bridge-probe.vitest.ts` 17 and 242, `orphan-sweeper-temp-path.vitest.ts` 194, `cli/tests/memory-pipeline-regressions.vitest.ts` 32, `process-memory-harness`, `process-sweep`, and the fixture path string at `sweep-memory-residue.vitest.ts` 127. [SOURCE: .skilled/skills/system-spec-kit/runtime/tests/launcher-ipc-bridge-probe.vitest.ts:17]
- The doctor orphan check, its test and the orphan sweeper (their `hf-model-server` class). [SOURCE: .skilled/commands/doctor/scripts/orphan-process-check.cjs:25]
- `K/shared/scripts/env-reader-table.mjs` 21 to 25, then regenerate the env table in `K/shared/README.md` (a test guards it); the README's other package rows; `K/shared/tests/README.md`. [SOURCE: .skilled/skills/system-spec-kit/shared/scripts/env-reader-table.mjs:21]
- `.env.example` section 7 (229 to 264) and line 409; spec-kit `ENV-REFERENCE.md`, `references/memory/embedder-pluggability.md` (whole file), `references/config/environment-variables.md`, `ARCHITECTURE.md`. [SOURCE: .env.example:229]
- Generated data to regenerate: `K/runtime/data/trigger-index.json`, the retrieval fixtures (`corpus-manifest.json`, `phrase-variants.json`, `generation-diagnostics.json`) and sk-doc's `code-folder` fixtures.

### 2.4 Constraints for the removal order and the residue check

- `K/shared/dist/` is untracked and built incrementally. The compiled `embeddings/` tree stays after the sources go, and the wildcard export keeps resolving it. Clean `shared/dist/embeddings` explicitly and scan `shared/dist` in the residue check. [SOURCE: .skilled/skills/system-spec-kit/shared/package.json:15]
- Stop any running `hf-model-server` on a user machine before the orphan check and sweeper lose their class for it; they are the only code that recognizes that process.
- The memory residue sweeper exempts the database filename because the advisor's embedding profile derived it. Revisit that exemption in the same change. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-memory-residue.mjs:122]

### 2.5 User-machine artifacts added by this iteration

- `/tmp/system-hf-embed/` (socket, pid file, respawn lock, give-up file). [SOURCE: .skilled/bin/hf-model-server.cjs:29]
- One model directory in `~/.cache/huggingface/hub/`. The cache is shared with other tools: remove only the exact attributable directory, never by a `models--nomic*` glob. This machine holds an unrelated `models--nomic-ai--CodeRankEmbed`. [SOURCE: .skilled/bin/hf-model-server.cjs:487]
- Vector shards `vectors/context-vectors__<slug>.sqlite` beside the database named by `MEMORY_DB_PATH`. [SOURCE: .skilled/skills/system-spec-kit/shared/embeddings/factory.ts:450]
- The installed `@huggingface/transformers` tree in `node_modules`, until a reinstall or prune.
- None of the first three exist on this machine, which fits the default-off spawner.

### 2.6 Open checks

- Do `K/shared/chunking.ts` and `K/shared/utils/retry.ts` have a consumer outside the package? [SOURCE: .skilled/skills/system-spec-kit/shared/chunking.ts:13]
- Do `MEMORY_DB_PATH`, `SPEC_KIT_DB_DIR` and `SPECKIT_DB_DIR` have a reader outside the package?
- What does the sk-doc validator report with an empty canonical set, if it is kept instead of deleted?
- A full `ls` of `K/runtime/tests/embedders/` (it was listed by match).

## Status after iteration 3

- Answered: the runtime inventory; the shared package and model server; the doctor surface (routes, workflows, presentation, scripts, tests).
- Open: docs, changelogs, playbooks and generated routing artifacts; removal order, user-machine cleanup and the residue check.
- Closed from 2.6: the first and third open checks, and `MEMORY_DB_PATH` from the second. `SPEC_KIT_DB_DIR` stays open.
- Closed lead from 1.5: `SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC` is in scope.

## 3. The doctor surface (iteration 3)

Path shorthand: `D/` means `.skilled/commands/doctor/`. Line numbers were read at commit `44251c5befd`.

### 3.1 Delete whole

- The embedder route block, `D/_routes.yaml` 232 to 249. [SOURCE: .skilled/commands/doctor/_routes.yaml:232]
- `D/assets/doctor-skill-advisor-embedder.yaml` (180 lines). [SOURCE: .skilled/commands/doctor/assets/doctor-skill-advisor-embedder.yaml:1]
- Section 8 of `D/assets/doctor-skill-advisor-presentation.txt`, 207 to the end at 306. [SOURCE: .skilled/commands/doctor/assets/doctor-skill-advisor-presentation.txt:207]
- Section 4 of `D/scripts/tests/skill-advisor-route-contract.test.cjs`, 326 to the end at 496, with its constants at 74 to 81 and two helpers from 193. [SOURCE: .skilled/commands/doctor/scripts/tests/skill-advisor-route-contract.test.cjs:326]

`/doctor:skill-advisor` keeps six targets: tune, rebuild, skill-graph-freshness, router-reach, skill-budget, parent-skill.

### 3.2 Edit in place

- Router doc and menu: `D/skill-advisor.md` 3 and 61; presentation 16, 31, 65, 87. Menu items after 5 renumber. [SOURCE: .skilled/commands/doctor/skill-advisor.md:61]
- Setup: `D/assets/doctor-setup.yaml` 60 (the embedder leg); setup presentation 40, 55, 64, 108; `D/setup.md` 62 goes from seven legs to six. [SOURCE: .skilled/commands/doctor/assets/doctor-setup.yaml:60] [SOURCE: .skilled/commands/doctor/setup.md:62]
- Install: `D/assets/doctor-install.yaml` 60 and install presentation 122 to 125 drop step 5, and `/doctor:setup` becomes step 5; `doctor-install-contract.test.cjs` 87 to 92 drops its entry. [SOURCE: .skilled/commands/doctor/assets/doctor-install-presentation.txt:122] [SOURCE: .skilled/commands/doctor/scripts/tests/doctor-install-contract.test.cjs:88]
- Informational vector coverage lines, all deleted: update apply 212 with update presentation 429 (first three sentences), 467 and 471 (reworded); overlay apply 124 and overlay repin 114 with overlay presentation 427, 438, 451, 463, 489, 501; symlink link 102 with symlink presentation 217, 252. No contract test pins them. [SOURCE: .skilled/commands/doctor/assets/doctor-update-apply.yaml:212] [SOURCE: .skilled/commands/doctor/assets/doctor-overlay-presentation.txt:427] [SOURCE: .skilled/commands/doctor/assets/doctor-symlink-link.yaml:102]
- Orphan check: `D/scripts/orphan-process-check.cjs` 24 to 27 and 232 to 246, its test cases, the scripts README row at 130, `D/setup.md` 72, setup presentation 87, the trigger phrase at `D/_routes.yaml` 407 and two helper fixture rows (`tune.jsonl` 60, `heldout.jsonl` 48, the second pinned by a digest at `doctor-helper-match.test.cjs` 44). [SOURCE: .skilled/commands/doctor/scripts/orphan-process-check.cjs:24] [SOURCE: .skilled/commands/doctor/scripts/tests/doctor-helper-match.test.cjs:44]
- `D/scripts/doctor-phrase-reach.cjs` 163 and 169: the comment clause and the `SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC` assignment. [SOURCE: .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs:169]

The per-file table with the required post-removal wording is in `iterations/iteration-003.md`.

### 3.3 Regenerate, do not hand-edit

- `R/scripts/command-bridges/derive-command-bridges.cjs` reads `D/_routes.yaml` and writes `command-bridges.generated.json` plus the generated blocks of `R/lib/scorer/projection.ts` (row 768), `R/lib/command-attach.ts` (97, 166) and `R/scripts/skill_advisor.py` (2737). Run it after the route block is deleted; gate with its `--check` mode and `command-bridges-drift-guard.vitest.ts`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:25] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:1385]
- `scoring-compatibility.json` names the bridge at 266 and 611. Whether it is a generator input (hand edit first) or an output is not yet read. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json:266]
- Runtime mirrors need no hand edit: the `.claude`, `.cursor` and `.opencode` doctor entries are symlinks into `.skilled`, and the `.codex`, `.pi` and `.vibe` prompt files have no lane text. The gate is `sync-runtime-mirrors.cjs --check`. [SOURCE: .skilled/commands/doctor/assets/doctor-setup.yaml:58]

### 3.4 Constraints for the removal order

- The status input schema is strict, so a doctor step that still passes `--include-semantic-health` after the key is removed is refused. The doctor edits land with the flag removal or before it. Inferred from the schema; one CLI call against a build without the key confirms it. [SOURCE: .skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:393]
- The route block, the install checklist and the install contract test entry change in one commit: the test resolves every checklist step to a manifest route. [SOURCE: .skilled/commands/doctor/scripts/tests/doctor-install-contract.test.cjs:101]
- `skill_graph_scan` stays a required advisor command in the route contract test, since `D/_routes.yaml` 125 and 147 still declare it. Whether `advisor_status` stays declared on a skill-advisor route after line 240 goes is unconfirmed. [SOURCE: .skilled/commands/doctor/_routes.yaml:125]
- The sk-doc validator reads a missing registry as an empty canonical set, which its own comment says flags every cited model name as drift. It goes in the same commit as the package (confirms the recommendation in 2.2). [SOURCE: .skilled/skills/sk-doc/scripts/validate-doc-model-refs.js:41]

### 3.5 User-machine artifacts added by this iteration

- The embedder route can have left one pulled `nomic-embed-text:v1.5` in the Ollama model store, a background `ollama serve` whose pid and log path were never persisted, and vectors in `skill-graph.sqlite`. It never installed Ollama and refused non-local hosts. [SOURCE: .skilled/commands/doctor/assets/doctor-skill-advisor-embedder.yaml:71] [SOURCE: .skilled/commands/doctor/assets/doctor-skill-advisor-embedder.yaml:131]
- The model store is shared and nothing records who pulled the model. The cleanup can detect the model but cannot prove ownership, so removing it, or stopping a running server, is an ask-first step. [INFERENCE: based on the absent marker and the shared store named in the workflow's mutation list]

### 3.6 Input for the residue check

- The spec-kit trigger index and its `phrase-variants.json` fixture carry "embedder setup and cost" as spec packet trigger phrases. A repo-wide grep cannot reach zero while they mirror historical packets, so the check needs a stated exclusion for `specs/` and the indexes derived from it, or a decision to rewrite the packets. [SOURCE: .skilled/skills/system-spec-kit/runtime/data/trigger-index.json:70806]

### 3.7 Open checks

- Is `scoring-compatibility.json` an input or an output of the generator?
- Who reads the `embeddingText` field of the generated bridges?
- Does `SPEC_KIT_DB_DIR` have a reader outside the package? `worktree-session.sh` 495 exports it.
- The menu items after item 5 in the skill-advisor presentation, and one unread loose-pattern match in `D/scripts/release-update.cjs`.
- `K/shared/chunking.ts` and `K/shared/utils/retry.ts` have only test importers left once the package goes. Deleting them is a scope decision.

---

## Status after iteration 4

- Four of five key questions are answered. The docs and generated-surface inventory is complete at file and line level, with four open items that do not change which files are on the list.
- The inventory needs two search patterns. The identifier pattern (ollama, semantic_shadow, embedder and so on) misses 66 files that describe the lane in prose: "five-lane", "vector refresh", "semantic lane", the npm dependency name.
- Remaining: the removal order with gates, the user-machine cleanup and the residue check (iteration 5).

## 4. Docs and generated surface outside the doctor folder (iteration 4)

Full line lists are in `iterations/iteration-004.md`. Paths below are under `.skilled/skills/` unless they start at the repo root.

### 4.1 Delete whole (11 doc files)

- Advisor catalog: `system-skill-advisor/feature-catalog/daemon-and-freshness/background-vector-refresh.md`, `system-skill-advisor/feature-catalog/scorer-fusion/command-meaning-matching.md`.
- Advisor READMEs: `runtime/lib/embedders/README.md`, `runtime/lib/embedders/adapters/README.md`, `runtime/tests/embedders/README.md`.
- Spec-kit: `references/memory/embedder-pluggability.md`, `shared/embeddings/README.md`, `shared/embeddings/adapters/README.md`, `shared/embeddings/providers/README.md`, `runtime/tests/embedders/README.md`, `runtime/tests/embedders/fixtures/README.md`.
- Inbound links that change in the same commit: advisor `feature-catalog.md` 26, 29, 54, 102; spec-kit `ROUTER.md` 46 and 243; `leaf-manifest.json` and `leaf-aliases.json` in both skills; advisor `INSTALL-GUIDE.md` 354 and 387; `memory-system.md` 256.

### 4.2 Edit in place

| Surface | Files and lines |
| --- | --- |
| Install docs | `INSTALL-SKILLED.md` 86 to 98 (section), 157, 342, 351; advisor `INSTALL-GUIDE.md` 54, 105, 275 to 378 (section 12; 13 and 14 renumber), 387; root `README.md` 26, 204 |
| Advisor identity | `README.md` 38, 46, 48, 90, 92, 113; `ARCHITECTURE.md` 22, 79, 126, 130, 160; `SKILL.md` 20, 111; `ROUTER.md` 42, 175; `graph-metadata.json` 106, 107, 114, 115 |
| Advisor references | `advisor-scorer.md` 55, 65, 79, 81, 83; `lane-weight-tuning.md` 58; `validation-baselines.md` 147; `freshness-contract.md` 146; `db-path-policy.md` 96, 97; `daemon-lease-contract.md` 138 |
| Advisor catalog | nine files; see iteration 4 F7 |
| Advisor playbook | eight scenario files; four lines are expected-output JSON with `"semantic_shadow": 0` |
| Env references | `.env.example` section 7 from 228, plus 95, 96, 100, 409, 411; spec-kit `runtime/ENV-REFERENCE.md` sections at 293, 327, 447, 593 and rows 187, 188, 391 to 396; `references/config/environment-variables.md`; spec-kit `ARCHITECTURE.md` 160, 200; `shared/README.md` |
| Outside the two skills | `.skilled/bin/README.md`, `.skilled/bin/lib/README.md`, `.skilled/scripts/orphan-mcp-sweeper.sh` 216, 491, 504, `.skilled/commands/create/assets/` (auto 472, confirm 484, presentation 168), `.github/workflows/skill-advisor-stress.yml` 49, 50 |
| Advisor health script | `system-skill-advisor/scripts/doctor.sh` 6, 16, 55, 58, 65, 69 and `scripts/README.md` 21 |

### 4.3 Regenerate or rebuild, do not hand-edit

- `command-bridges.generated.json` (after hand-editing its input `scoring-compatibility.json` 266, 268, 611, 613).
- `system-spec-kit/runtime/data/trigger-index.json` and the retrieval fixtures.
- `system-skill-advisor/runtime/scripts/skill-graph.json` (tracked diagnostic export).
- sk-doc `baseline-readme-verdicts.json` and `durable-directory-manifest.json`; `cite-drift-labels.jsonl` rows 14 and 36.
- `scorer-eval-baseline.json`; three lockfiles (advisor runtime, spec-kit, system-deep-loop).

### 4.4 Constraints for the removal order

- `INSTALL-GUIDE.md` 105 imports the built lane file and `scripts/doctor.sh` 58 requires `@huggingface/transformers`. Both fail after removal unless they change before or with the code.
- `embeddingText` has one production reader, the vector path in `skill-graph-db.ts`. The field and the generator code that writes it go with the lane.
- `advisor_status` stays declared on four doctor routes; only the embedder route passes the semantic-health flag.
- A deleted doc that a router loads by name (spec-kit `ROUTER.md` 46) needs its router line and leaf rows removed in the same commit.

### 4.5 Input for the residue check

- Use both patterns.
- Exclude `specs/` by path: 2,366 tracked files there match.
- Do not grep the raw trigger index: 16,869 of its 20,249 paths are under `specs/`. Regenerate it, then assert that no matching phrase resolves to a path outside the excluded set.
- Allowlist by path: cli-codex `--oss` docs, mcp-figma CLI reference, sk-design's vector store, the deep-loop `semantic_shadow_only` field, sk-create-benchmark case studies, `cite-drift-redirects.json`, sk-code `sqlite-vec` examples.

### 4.6 Open decisions and checks

- Changelogs: 23 files mention the lane and no rule says whether released entries may be rewritten. Rewrite them, or exclude changelog folders from the residue check.
- Whether the orphan sweeper keeps its `ollama-preserve` guard (line 491).
- Whether the three files named "five-lane" are renamed (45 files say five-lane or 5-lane).
- Who writes the advisor and spec-kit leaf manifests.
- Whether the RSS watchdog env subsection survives.

---

## Status after iteration 5

- All five key questions are answered. The three deliverables are designed: the removal order with gates, the user-machine cleanup and the residue check.
- Nothing was executed. The order is derived from dependency evidence and from gate commands that exist today, so "green" is a prediction until each gate is run.
- Closed from 4.6: the leaf manifest writer (`sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs`) and the RSS watchdog subsection (it goes; only the model server's supervision library uses those keys). Closed from 3.7: `SPEC_KIT_DB_DIR` stays, and the menu items after 5 are 6 and 7.
- Left for the operator: seven decisions (5.6). Left for the implementer: six small checks (5.7).

## 5. Removal order, user-machine cleanup and residue check (iteration 5)

Full evidence is in `iterations/iteration-005.md`.

### 5.1 The gates

Advisor `typecheck`, `test`, `clean` plus `build`; shared `tsc --build` and its test glob; spec-kit `typecheck` and `test`; `bash .skilled/commands/doctor/scripts/tests/run-all.sh`; `derive-command-bridges.cjs --check`; `generate-trigger-index.mjs --check`; the markdown link check; the four CI routing ratchets; the advisor stress suite; `generate-leaf-manifest.cjs --check`. The global pre-commit hook runs the mirror, leaf manifest, doc version and parent-skill checks on every commit, so those regenerations happen inside the commit that causes them. [SOURCE: .skilled/skills/system-skill-advisor/runtime/package.json:12] [SOURCE: .skilled/commands/doctor/scripts/tests/README.markdown:83] [SOURCE: .github/workflows/routing-registry-drift.yml:288] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:44]

### 5.2 The order

| Step | What lands | Gate |
| --- | --- | --- |
| 0 | Residue check in report-only mode, the unwired cleanup tool, recorded gate baselines | The check exits 1 with 332 files; all gates green |
| 1 | Doctor surface: route, asset, menu, setup leg, install step, coverage lines, contract tests, cost script; bridge input edit and regeneration; the two install docs | `run-all.sh`, bridges `--check`, drift guard, mirror check, link check, advisor tests |
| 2 | Lane feeders: vector refresh, prompt embedding, exact rerank, command meaning path, `embeddingText`, the forwarded env keys | Advisor typecheck, tests, clean build; ratchets with score baselines untouched |
| 3 | Lane id, status contract, vector DDL, `lib/embedders/`, the dead env flag, all remaining lane tests and fixtures | Advisor typecheck, tests, clean build, stress; ratchets; contract probes |
| 4 | Shared embeddings package, HF model server, launcher supervision, orphan check class, sk-doc validator, the npm dependency and lockfiles | Shared and spec-kit build and tests, advisor clean build, `run-all.sh`, sk-doc tests, `npm ci` |
| 5 | Prose docs, identity files, trigger phrases, changelog entry | Link, leaf, frontmatter and doc version checks; ratchets |
| 6 | Trigger index and fixtures, skill-graph export, cite-drift labels | Each generator's check mode |
| 7 | Cleanup wired into `/doctor:update apply`; residue check flipped to gating | Repo mode 0, machine mode 0, planted-term fixture 1 |

Step 3 is atomic because the lane type derives from the registry row. The split between steps 2 and 3 is a recommendation; if the compiler rejects it they merge. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts:13]

Eight groups of edits cannot be split across commits. The two not named in earlier sections: the ablation test goes with line 95 of `holdout-independent.vitest.ts`, which CI runs by name, and a deleted routed doc goes with its regenerated leaf manifest. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts:95] [SOURCE: .github/workflows/routing-registry-drift.yml:315]

The ratchets double as proof that the removal is routing-neutral: no tracked baseline under the advisor runtime records the lane, and its live weight is 0. A ratchet that needs recapturing is a finding, not a formality. [INFERENCE: based on an empty grep over the runtime's JSON and JSONL files and the weight at lane-registry.ts 13]

### 5.3 Existing databases

The vector tables are plain tables with a BLOB column, in a database the rebuild workflow calls derived state. Recommended: raise `SCHEMA_VERSION` and discard any database with an older stored version, then rescan. The rule names no table, so it carries no lane vocabulary and never needs removing. Dropping in place keeps lane names in migration code and leaves the dropped rows in free pages unless `VACUUM` runs. Confirm first that an empty database is rescanned at daemon start and that `skill_graph_metadata` holds nothing a scan cannot rebuild. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/embedders/schema.ts:119] [SOURCE: .skilled/commands/doctor/assets/doctor-skill-advisor-rebuild.yaml:23] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:533]

The rebuild workflow keeps a `.bak` copy of the old database and `/doctor:update apply` prompts for that rebuild, so the cleanup runs after the prompt and deletes every `.bak` and `.corrupt` sibling. [SOURCE: .skilled/commands/doctor/assets/doctor-skill-advisor-rebuild.yaml:91] [SOURCE: .skilled/commands/doctor/assets/doctor-update-apply.yaml:205] [SOURCE: .skilled/skills/system-skill-advisor/runtime/database/.gitignore:18]

### 5.4 User-machine cleanup

One tool with report and apply modes, run per checkout and per linked worktree. Every action deletes; none copies.

- Without asking: discard and rescan the database; delete `.bak` and `.corrupt` copies and vector shards; stop a model server whose command line is this checkout's script and delete `/tmp/system-hf-embed`; clean and rebuild the advisor's `dist`; delete `shared/dist` by path (the shared package has no clean script); `npm ci`.
- Ask first: the exact HuggingFace cache folder and the pulled Ollama model. Both stores are shared with other tools and nothing records who pulled the model. The answer is not remembered, because remembering it would write new lane state to the machine.
- Report only: a running `ollama serve`, whose pid the route never recorded, and lane env keys in dotenv files. A hook refuses any shell read of `.env`; key names come from `env-secret.cjs keys`.
- Kept: `SPEC_KIT_DB_DIR`, and the stores' own `OLLAMA_HOST`, `OLLAMA_MODELS`, `HF_HOME`, `HF_HUB_CACHE`.

[SOURCE: https://docs.ollama.com/api/delete] [SOURCE: https://huggingface.co/docs/huggingface_hub/guides/manage-cache] [SOURCE: .skilled/hooks/env-secret-guard/cli/env-secret.cjs:1] [SOURCE: .skilled/bin/worktree-session.sh:495]

Observed on the research machine: compiled lane output in both `dist` trees, the HuggingFace module tree in both `node_modules`, and `nomic-embed-text:v1.5` as the only model in the Ollama store. No model server or Ollama process, no `/tmp/system-hf-embed`, no lane key in `.env`.

### 5.5 Residue check

A sibling of `sweep-memory-residue.mjs`, with its exit contract (0 clean, 1 live hits, 2 invocation error) and exemptions as data rows with reasons. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-memory-residue.mjs:58]

- Baseline at commit `44251c5befd`: 332 tracked files outside `specs/` match (279 on the identifier pattern, 163 on the prose pattern), 23 of them in changelog folders.
- Repo mode: both patterns over tracked files with `specs/` excluded; tracked file names; generator check modes; regenerate the trigger index and assert no matching phrase resolves outside `specs/`; dependency rows; the symlink; behavioral probes (flag refused, four lane keys, no `embeddings` field, six doctor targets); a planted-term fixture that must exit 1.
- Machine mode: build output; `node_modules`; every SQLite file in the database directory, including a byte search; processes; the HuggingFace folder; the Ollama model; dotenv key names; linked worktrees.
- Allowlist rows are exact paths, never folders.
- It cannot prove: a model on a remote Ollama host, a cache an old env value pointed elsewhere, the log of an unrecorded background server, or other machines before they update.
- The check, its allowlist and its test are the one permanent place the vocabulary stays.

### 5.6 Operator decisions, with a recommended default each

1. Released changelogs: exclude the folders from the check (not rewrite 23 files).
2. Shadow weights: leave at 0.95 (not renormalize).
3. The three "five-lane" file names: rename to a name without a count.
4. The sweeper's `ollama-preserve` guard: keep, with an allowlist row.
5. A pulled model nobody can attribute: ask on each run.
6. `shared/chunking.ts` and `shared/utils/retry.ts`: delete with the package.
7. Existing databases: discard and rescan.

### 5.7 Checks left for the implementer

- Is an empty database rescanned at daemon start, and what do the three `skill_graph_metadata` rows hold?
- Does a routing corpus row expect the embedder command?
- Does `/doctor:env` have a remove mode?
- Does `generate-leaf-manifest.cjs` also write `leaf-aliases.json`?
- Unread matches: advisor catalog `watcher.md` 22, one file under `cli-classifier`, `content-normalizer.ts`, `trigger-extractor.vitest.ts`.
- `SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC` has five more writer sites than iteration 1 listed; see iteration 5 F12.

---

## Eliminated Alternatives

- **Keep the lane at weight 0 behind a flag.** Ruled out by the operator's deletion decision: it keeps every vector refresh, doctor leg and doc that the research inventoried.
- **Drop the vector tables with a migration.** Ruled out in favor of discard and rescan: drop code would keep lane table names in the codebase forever, and dropped rows stay in free pages unless `VACUUM` runs (iteration 5).
- **Delete the shared embeddings package only in part.** Ruled out: no consumer outside the advisor survives, and the sk-doc validator reads an empty registry as drift for every model name, so it goes in the same commit (iterations 2 and 3).
- **A one-pattern residue grep.** Ruled out: the identifier pattern misses 66 files that describe the lane in prose, and the raw trigger index is dominated by `specs/` paths (iteration 4).
- **Remove the shared-store model without asking.** Ruled out: the Ollama and HuggingFace stores are shared, the embedder route never recorded what it pulled, and this machine holds an unrelated nomic model in the HuggingFace cache (iterations 2, 3 and 5).
- **Remembering the cleanup answer per machine.** Ruled out: storing it would write new lane state to the machine the cleanup is meant to clear (iteration 5).

## Divergence Map

- Saturated directions: none recorded.
- Pivots taken: none. The run used the default convergence mode with a max-iterations stop policy.
- Pivot failures and audited overrides: none.
- Remaining frontier: the implementer checks in section 5.7 and the operator decisions in section 5.6.

## Open Questions

- The seven operator decisions in section 5.6.
- The six implementer checks in section 5.7, chiefly whether an empty database is rescanned at daemon start.
- Whether `scoring-compatibility.json` 266 and 611 is edited by hand before the bridge regeneration (section 4.3 treats it as the generator input).

## References

- Iteration evidence: `iterations/iteration-001.md` to `iterations/iteration-005.md`.
- Prior measurements: phases 017, 018 and 019 of this epic.
- External: the Ollama delete API and the HuggingFace cache management guide, cited in section 5.4.


## Convergence Report

- Stop reason: maxIterationsReached (stop policy max-iterations, as the operator asked for five iterations)
- Total iterations: 5
- Questions answered: 5 / 5
- Remaining questions: 0
- Last 3 iteration summaries: run 3, the doctor surface (0.71); run 4, docs and generated surface (0.87); run 5, removal order, user-machine cleanup and residue check (0.79)
- Convergence threshold: 0.05
- Divergence summary: no divergent pivots recorded
- Executor: Fable 5.2 at high effort on the claude2 account, launched directly because the workflow's dispatch script refuses a Claude launch from inside a Claude session
