---
title: "Feature Specification: Phase 4: lane-core"
description: "After phase 003 nothing feeds the lane, yet the registry still lists it, advisor_status still accepts the semantic-health flag and reports a fifth lane weight, the skill graph still creates vector tables and embedding columns, and the runtime still ships an embedder package and a symlink into the shared embeddings package. This phase deletes all of it in one commit, discards any database stored at the old schema version so a rescan rebuilds it, and removes the dead disable flag at every writer site."
trigger_phrases:
  - "lane core"
  - "phase 4 lane core"
  - "remove the lane registry row"
  - "discard old advisor databases"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.4 -->
# Feature Specification: Phase 4: lane-core

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

Once phase 003 lands, the lane computes nothing in production, but its id still sits in the scorer registry, `advisor_status` still returns five lane weights and accepts `includeSemanticHealth`, the skill graph still creates four `vec_*` tables and three embedding columns, and 100 runtime files still name the lane, its embedders or the embeddings package. This phase deletes the registry row and everything the compiler then names, the status contract fields, the vector DDL and readers, `lib/embedders/`, the `lib/shared/embeddings` symlink, the dead `SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC` flag at every writer site and every remaining lane test, in one commit. Afterwards `advisor_status` reports four lane keys and rejects the flag with exit 64, a database stored at schema version 1 is deleted with its `-wal`, `-shm` and `-journal` files and rebuilt by the daemon's startup scan, and the four CI routing ratchets pass with every score baseline file unchanged.

**Key Decisions**: raise `SCHEMA_VERSION` to 2 and discard, never migrate, an older database; delete the two legacy CHECK-rebuild migrations the discard makes unreachable; delete the symlink here, since nothing reads through it; keep `debug` as an accepted but inert status input; delete a test whose subject is the lane or the embeddings package and edit the rest; merge with phase 005 only if a gate needs a 005-owned edit.

**Critical Dependencies**: phase 003 lands first, because the lane call and its readers stay until then; the four routing ratchets and the corpus gate, which double as the neutrality proof; the advisor daemon's startup scan, which rebuilds a discarded database before the daemon serves.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-20 |
| **Branch** | `worktrees/497-ollama-lane-removal` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 8 |
| **Predecessor** | 003-lane-feeders |
| **Successor** | 005-shared-embeddings-package |
| **Handoff Criteria** | Advisor typecheck, tests, clean build, stress suite and ratchets pass; `advisor_status` reports four lane keys; the advisor imports nothing from the embeddings package |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Ollama lane removal specification.

**Scope Boundary**: One atomic commit in the advisor runtime: the lane registry row and every site the compiler then names, the status contract and tool schema fields, the vector DDL and its readers, `lib/embedders/`, the `lib/shared/embeddings` symlink, `SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC` at every writer site, `SCHEMA_VERSION` raised for discard and rescan, every remaining lane test and fixture, and the catalog rows and README baselines a deleted file would otherwise break. The remaining live and shadow weights stay at 0.95.

**Dependencies**:
- 003-lane-feeders: nothing writes, computes or consumes a vector on the daemon, scan, recommend or fusion path
- `../../023-ollama-deprecation-research/research/research.md` sections 1, 4, 5.1, 5.2 step 3, 5.3 and 5.7, and decisions Q003, Q004 and Q008 in `../../023-ollama-deprecation-research/decision-record.md`

**Deliverables**:
- `advisor_status` reports four lane keys and refuses `includeSemanticHealth` at the schema, the handler and the CLI
- Advisor typecheck, tests, clean build, stress suite and the four ratchets pass with score baselines untouched
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The lane is dead after phase 003 but its contract is not. The registry row at `lane-registry.ts` 13 still derives a fifth `ScorerLane`, so every lane weight record, every `laneContributions` list and `advisor_status.laneWeights` carry `semantic_shadow`; the status schema still accepts `includeSemanticHealth` and `includeEmbeddingsHealth` and probes Ollama and the model server for them; `skill-graph-db.ts` still creates `vec_metadata`, `vec_768`, `vec_1024` and three embedding columns on every open; and `lib/embedders/` and the `lib/shared/embeddings` symlink keep the advisor tied to the shared embeddings package that phase 005 deletes. Every user database built so far holds those tables at schema version 1.

### Purpose
The advisor has no semantic lane left: four lane keys in every contract, no vector object in any database it opens, and no import from the embeddings package, with routing results unchanged.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Measured at `35983033f76`, phase 001's commit, which changes no advisor runtime file against `bf6806ad4b3`. Phase 002 is built in this worktree but not committed, so every count below includes its 28 edits; of the files this phase changes, only `projection.ts` is among them, and 002 removes its lines 764 to 781. Phase 003 is planned, not built: the counts include its feeders. Phase 002 has since landed as `0c2ab52b3b3`; among the files this phase edits it changes only `projection.ts`, so the `projection.ts` numbers below are that commit's.

```text
$ git rev-parse --short HEAD
35983033f76
$ git status --short -- .skilled | wc -l
      28
$ R=.skilled/skills/system-skill-advisor/runtime
$ grep -n "SCHEMA_VERSION = " $R/lib/skill-graph/skill-graph-db.ts
151:export const SCHEMA_VERSION = 1;
$ sqlite3 -readonly "file:$R/database/skill-graph.sqlite?mode=ro" "SELECT 'version', version FROM schema_version; SELECT type, name FROM sqlite_master WHERE name LIKE 'vec_%' OR name LIKE '%embedding%' ORDER BY name;"
version|1
index|idx_skill_nodes_embedding_hash
index|idx_skill_nodes_embedding_model
table|vec_1024
table|vec_768
table|vec_cmd_768
table|vec_metadata
$ node --input-type=module -e "const s=await import('./$R/dist/runtime/schemas/advisor-tool-schemas.js');const w=await import('./$R/dist/runtime/lib/scorer/weights-config.js');console.log(JSON.stringify(Object.keys(w.DEFAULT_SCORER_WEIGHTS)));console.log(s.AdvisorStatusInputSchema.safeParse({workspaceRoot:process.cwd(),includeSemanticHealth:true}).success)"
["explicit_author","lexical","graph_causal","derived_generated","semantic_shadow"]
true
$ git ls-files $R/lib/embedders | wc -l
       9
$ git ls-files -s $R/lib/shared/embeddings
120000 7ca9b9b687d7fb51598f293c8c1f48cb94d06fd9 0	.skilled/skills/system-skill-advisor/runtime/lib/shared/embeddings
$ P='semantic_shadow|SemanticShadow|semantic-shadow|semanticLaneHealth|includeSemanticHealth|includeEmbeddingsHealth|embeddingsHealth|lib/embedders|shared/embeddings|embedders/|DISABLE_BUILTIN_SEMANTIC'
$ git grep -l -E "$P" -- $R ":!$R/dist" | wc -l
     100
$ git grep -l SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC -- ':!specs' | wc -l
      34
$ (cd $R && npm run typecheck > /dev/null 2>&1; echo "exit=$?")
exit=0
$ (cd $R && npx vitest run tests/parity/scorer-eval-baseline-ratchet.vitest.ts tests/parity/local-native-divergence-ratchet.vitest.ts tests/parity/holdout-independent.vitest.ts) | grep -E 'Test Files|Tests '
 Test Files  3 passed (3)
      Tests  22 passed (22)
$ (cd $R && npx vitest list <the 24 test files this phase deletes or edits>) | cut -d'>' -f1 | sort | uniq -c
   6 tests/cli-exit-taxonomy.vitest.ts
   6 tests/embedders/embeddings-health.vitest.ts
   5 tests/embedders/ensure-active-embedder.vitest.ts
   3 tests/embedders/registry.vitest.ts
   6 tests/embedders/schema.vitest.ts
   9 tests/embedders/shared-factory-parity.vitest.ts
  35 tests/handlers/advisor-status.vitest.ts
   9 tests/handlers/advisor-trust-gate.vitest.ts
  21 tests/launcher-bootstrap.vitest.ts
   6 tests/parity/holdout-independent.vitest.ts
   4 tests/scorer/conflict-query-rerank.vitest.ts
   6 tests/scorer/lane-registry-env-override.vitest.ts
   3 tests/scorer/lane-weight-sweep.vitest.ts
  21 tests/scorer/native-scorer.vitest.ts
   6 tests/scorer/projection-embedding-staleness.vitest.ts
   4 tests/scorer/rrf-determinism-spine.vitest.ts
   4 tests/scorer/runtime-lane-health.vitest.ts
   5 tests/scorer/semantic-lane-promotion.vitest.ts
   4 tests/scorer/semantic-shadow-ablation.vitest.ts
   8 tests/scorer/semantic-shadow-cosine.vitest.ts
   3 tests/shadow-sink.vitest.ts
   2 tests/shared-import-specifier-extension.vitest.ts
  11 tests/skill-graph-db.vitest.ts
   2 tests/skill-graph/embedding-coverage.vitest.ts
$ node scratch/lane-neutrality-probe2.mjs "$PWD"
{"rows":545,"passIds":0,"top3":0,"passValues":0,"recMembership":0,"conf":0,"unc":225,"score":0}
$ node scratch/runtime-lane-health-probe.mjs "$PWD"
{"baseConf":0.5992,"degConf":0.6118,"delta":0.0126,"baseLive":4,"degLive":3,"sameScore":true,"graphWeight":0.13}
$ node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --check .skilled/skills/system-skill-advisor
leaf-manifest.json OK (dedd8320b72b7f7bb6ce4f2cab37e893d999c2619f9e91ce31c5260b5773185b)
$ python3 .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py | grep system-skill-advisor
PACKAGE system-skill-advisor: PASS tier=fail violations=0
$ node .skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs repo | grep -E '^(files|allowlisted|live) '
files       : 310 (identifier 255, prose 152, path 40, symlink 1)
allowlisted : 27
live        : 283
$ git rev-parse --short HEAD   # after phase 002 landed during planning
0c2ab52b3b3
$ node $R/scripts/command-bridges/derive-command-bridges.cjs --check | tr -d '\n '
{"status":"fresh","counts":{"commandMetadata":27,"doctorRoutes":35,"generated":62,"typescriptActive":46,"pythonActive":52},"changed":[]}
```

The two probes were throwaway scripts in this folder's `scratch/`, deleted after the run. Both imported the built `fusion.js` in the force-local regime the ratchets use (`SYSTEM_SKILL_ADVISOR_DB_DIR` an empty temp folder, `SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1`, `VITEST=true`, weight overrides unset) and compared default scoring with `disabledLanes: ['semantic_shadow']`. The first scored all 545 prompts in the golden, labeled, holdout, ambiguity and command corpora: no top skill, passing set, score or confidence moved, and 225 rows moved only in `uncertainty`. The second reran the `runtime-lane-health.vitest.ts` fixture with its `{"semantic_shadow":0.05}` override removed and the lane skipped, which predicts that file's post-phase values. `disabledLanes` is a proxy for a deleted row: equal by reading, because a lane at weight 0 adds nothing to the weight total and a skipped lane emits no evidence, but not yet observed on the edited code.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

"No semantic lane left" in this phase means: the lane id appears in no registry, type, weight record, schema, handler, test or stress file of the advisor runtime; no file in the runtime imports from `lib/embedders/` or the `@spec-kit/shared/embeddings` package; and no database the advisor opens holds a `vec_*` table, an embedding column or an embedding index. Three named files keep a lane string on purpose: `scorer-eval-baseline.json` line 9, a score baseline goal criterion 4 freezes, and the two refusal tests that must pass the removed flag to prove it is refused.

### In Scope
- Delete the registry row at `lane-registry.ts` 13, `SEMANTIC_SHADOW_WEIGHT`, the lane module `lanes/semantic-shadow.ts`, and every site the narrowed `ScorerLane` type then names: the lane call, lane multipliers and lane health in `fusion.ts`, the guard in `graph-causal.ts`, the metrics lane list, the `cosine` evidence label in `advisor-recommend.ts`, and the projection's embedding staleness probe with its types.
- Delete the status contract fields: `includeSemanticHealth`, `includeEmbeddingsHealth`, `semanticLaneHealth` and `embeddingsHealth` in the zod schemas, the MCP tool definition, the CLI manifest and the handler, keeping `debug` as an accepted input that adds nothing.
- Delete the vector DDL, migrations and readers in `skill-graph-db.ts`, raise `SCHEMA_VERSION` to 2, and discard a database stored at a lower version before it opens.
- Delete `lib/embedders/`, the `lib/shared/embeddings` symlink with its two `tsconfig.build.json` excludes, and every test import of the embeddings package.
- Remove `SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC` and the `VITEST` assignment written beside it at every code writer site: the launcher, the classifier replay helper, `advisor-validate.ts`, five routing-accuracy scripts, two Python harnesses, two stress files, 18 test files and the CLI test utils.
- Delete the 11 test files whose subject is the lane or the embeddings package, with their seeding fixture and cache, and edit the 21 test files and four stress files that touch the lane beside surviving code; edit the runtime READMEs, six catalog SOURCE FILES rows and two sk-doc README baselines that a deleted file would otherwise break.

### Out of Scope
- `.skilled/skills/system-spec-kit/shared/embeddings/`, `.skilled/bin/hf-model-server.cjs`, `.skilled/bin/lib/model-server-supervision.cjs`, launcher 180 to 183 and the code that starts the model server, the `@huggingface/transformers` dependency in `R/package.json` and the lockfiles, the spec-kit `tests/embedders/` suite, the sk-doc model-reference validator, and `launcher-bootstrap.vitest.ts` 245 and 269 - phase 005, which deletes the package and the server once nothing in the advisor imports them.
- Whether the launcher still needs to forward `MEMORY_DB_PATH`, whose only purpose the deleted end-to-end cases describe as pointing the shared factory at the advisor database - phase 005, with the factory.
- Prose: the catalog leaves `advisor-status.md`, `background-vector-refresh.md`, `ablation.md`, `attribution.md`, `command-meaning-matching.md` and `five-lane-fusion.md` beyond the six rows below, `references/scoring/advisor-scorer.md` 79 to 83, `references/scoring/lane-weight-tuning.md` 79 and 161, `SKILL.md` 111, the advisor `README.md` 48, `.env.example` 411, `ENV-REFERENCE.md` 391 and 392, the four playbook entries that pass `--include-semantic-health`, every changelog, and the three "five-lane" renames, including `stress-test/skill-advisor/five-lane-fusion-stress.vitest.ts` (decision Q004) - phase 006.
- `phrase-variants.json`, the trigger index and `cite-drift-labels.jsonl` rows that name a file this phase deletes - phase 007, which regenerates them.
- Every score baseline file listed in `plan.md`, including `scorer-eval-baseline.json` line 9 and the lane prose in `local-native-approved-divergences.json` 664 - goal criterion 4 freezes them; phase 008's residue check decides between an allowlist row and a recapture.
- Renormalizing the remaining live or shadow weights - decision Q003 keeps both at 0.95.

### Files to Change

`R/` is `.skilled/skills/system-skill-advisor/runtime/`. Line numbers are at `35983033f76`; `projection.ts` numbers are given with phase 002 applied, and `fusion.ts`, `capture-command-routing-baseline.mjs`, `command-meaning-anchor.vitest.ts`, `conflict-query-rerank.vitest.ts` and `skill-graph-db.ts` shift once phase 003 lands, so `tasks.md` names the symbol beside each number.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `R/lib/scorer/lane-registry.ts` | Modify | Delete the `semantic_shadow` row at 13 |
| `R/lib/scorer/weights-config.ts` | Modify | Delete `SEMANTIC_SHADOW_WEIGHT` at 18 |
| `R/lib/scorer/fusion.ts` | Modify | Delete the `scoreSemanticShadowLane` import, its call in `buildLaneScores` (541), the lane keys in `queryClassLaneMultipliers` (197 to 205) and `projectionRuntimeLaneHealth` (299 to 315); `scoreAdvisorPrompt` (1300 to 1304) passes `options.runtimeLaneHealth` |
| `R/lib/scorer/lanes/semantic-shadow.ts` | Delete | The lane module |
| `R/lib/scorer/lanes/graph-causal.ts` | Modify | Delete the lane guard at 88 |
| `R/lib/scorer/lanes/README.md` | Modify | Delete the `semantic-shadow.ts` row at 74 |
| `R/lib/scorer/projection.ts` | Modify | Delete imports 14, 16, 21, 25 and 26, `MetadataRow` through the end of section 8 (1363 to 1653) and `readAdvisorEmbeddingStaleness` (1658 to 1674), the call at 1725 and the fields at 1744 and 1745; renumber sections 9 and 10 |
| `R/lib/scorer/types.ts` | Modify | Delete `AdvisorEmbeddingSignature` and `AdvisorEmbeddingStalenessVerdict` (84 to 99) and the two projection fields (113, 114) |
| `R/lib/skill-graph/skill-graph-db.ts` | Modify | `SCHEMA_VERSION` 2 at 151 and a discard step in `initDb`; delete the embedding columns (235 to 237), `vec_metadata` (262 to 266), the vector migrations (365 to 367, 398 to 410), both CHECK rebuilds (412 to 499), the readers and their types, constants and imports; reword `getDbReadOnly` |
| `R/lib/skill-graph/README.md` | Modify | Only if it names a removed reader; T013 checks |
| `R/handlers/advisor-status.ts` | Modify | Delete imports 19, 21 and 26 to 32, the type at 57, helpers 135 to 257 and 386 to 422, the spreads at 538 and 562; `handleAdvisorStatus` returns the plain status |
| `R/handlers/advisor-recommend.ts` | Modify | Delete `case 'cosine'` at 190 and 191 |
| `R/handlers/advisor-validate.ts` | Modify | Delete the flag at 423 |
| `R/schemas/advisor-tool-schemas.ts` | Modify | Delete `semanticLaneHealthSchema` (243 to 272), the two inputs (385, 386), `embeddingsHealthSchema` (395 to 434) and the two outputs (459, 460) |
| `R/tools/advisor-status.ts` | Modify | Delete the two properties at 16 and 17; reword `debug` at 18 |
| `R/skill-advisor-cli-manifest.ts` | Modify | Delete 87 and 88; reword `debug` at 89 identically |
| `R/lib/metrics.ts` | Modify | Drop the lane from `SPECKIT_SCORER_LANES` (665 to 666) |
| `R/lib/prompt-policy.ts` | Modify | Reword the comment at 265 |
| `R/lib/embedders/` | Delete | Nine files: adapter, adapters/ollama, adapters/README, embeddings-health, index, README, registry, schema, types |
| `R/lib/shared/embeddings` | Delete | Symlink to `../../../../system-spec-kit/shared/embeddings` |
| `R/tsconfig.build.json` | Modify | Delete the excludes at 27 and 28 |
| `R/lib/shared/README.md` | Modify | Delete rows 16, 26, 36 and 43 and the link at 73 |
| `R/lib/README.md` | Modify | Delete 63, 128, 158, 192 and 217 |
| `R/README.md` | Modify | Drop `embedders/` from 26 |
| `R/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs` | Modify | Delete the flag at 54, the `VITEST` line with its comment at 57 to 61, and the flag in the written env block at 224 |
| `R/scripts/routing-accuracy/capture-local-native-divergence-ledger.mjs` | Modify | Delete the flag at 74 and `VITEST` at 77 |
| `R/scripts/routing-accuracy/derive-ambiguity-slice.mjs` | Modify | Delete the flag at 47 and `VITEST` with its comment at 50 to 54 |
| `R/scripts/routing-accuracy/capture-command-routing-baseline.mjs` | Modify | Drop both names from `PROJECTED_ENV_NAMES` (89, 90) and both assignments with their comment from the projection block (425 to 430) |
| `R/scripts/routing-accuracy/score-routing-corpus.py` | Modify | Delete the assignment at 245 and `advisor_env_name` at 272 to 274 |
| `R/scripts/skill_advisor_bench.py` | Modify | Delete `BENCH_ENV_FLAG` (36) and its uses at 109, 142, 143, 162 to 165 and 179 |
| `R/scripts/skill_advisor_regression.py` | Modify | Delete 108 |
| `.skilled/bin/system-skill-advisor-launcher.cjs` | Modify | Delete the allowlist entry at 163 |
| `.skilled/skills/cli-classifier/benchmark/pi-transport/replay-helpers.mjs` | Modify | Delete the flag at 257 and `VITEST` with its comment at 258 to 264 |
| `R/tests/embedders/` | Delete | Five test files and `README.md` |
| `R/tests/scorer/semantic-shadow-cosine.vitest.ts`, `semantic-shadow-ablation.vitest.ts`, `semantic-lane-promotion.vitest.ts`, `projection-embedding-staleness.vitest.ts`, `lane-weight-sweep.vitest.ts` | Delete | Subject is the lane or its seeded vectors |
| `R/tests/skill-graph/embedding-coverage.vitest.ts` | Delete | Subject is `embeddingCoverage` |
| `R/tests/scorer/fixtures/seed-skill-embeddings.ts`, `fixtures/.embeddings-cache/skill-embeddings.json` | Delete | Seeding fixture and its cache |
| `R/tests/handlers/advisor-status.vitest.ts` | Modify | Delete 11 lane cases, their mocks and helpers; recast 721; add one refusal case |
| `R/tests/cli-exit-taxonomy.vitest.ts` | Modify | Recast the case at 79 as a refusal with exit 64 |
| `R/tests/launcher-bootstrap.vitest.ts` | Modify | Delete import 15, the end-to-end block 283 to about 420 and its node:sqlite helper; drop the key at 485 |
| `R/tests/scorer/native-scorer.vitest.ts` | Modify | Drop the key and import (22, 54) and retitle 48; delete AC-5 (102 to 119); add the override case moved from the deleted sweep file |
| `R/tests/skill-graph-db.vitest.ts` | Modify | Replace the cases at 211 and 280 with a discard case and a keep case |
| `R/tests/scorer/runtime-lane-health.vitest.ts` | Modify | Delete the hoisted override (7 to 9) and its cleanup; set the four-lane values at 81, 100, 101, 103, 106 and 147 |
| `R/tests/scorer/lane-registry-env-override.vitest.ts` | Modify | Drop the key at 15 and 23; case 88 overrides `derived_generated` |
| `R/tests/command-meaning-anchor.vitest.ts` | Modify | Delete the `semantic()` helper (67 to 77) and recast its surviving callers |
| `R/tests/parity/holdout-independent.vitest.ts` | Modify | Delete the consumer row at 95, the `lane-weight-sweep` surface at 141 to 155 and the flag at 306 |
| `R/tests/scorer/conflict-query-rerank.vitest.ts`, `rrf-determinism-spine.vitest.ts`, `R/tests/shadow-sink.vitest.ts`, `R/tests/handlers/advisor-trust-gate.vitest.ts`, `advisor-recommend-unavailable.vitest.ts`, `advisor-recommend.vitest.ts`, `R/tests/compat/daemon-probe.vitest.ts`, `R/tests/advisor-rebuild.vitest.ts`, `R/tests/lane-attribution.test.ts`, `R/tests/parity/local-native-divergence-ratchet.vitest.ts`, `R/tests/shared-import-specifier-extension.vitest.ts`, `R/tests/python/test_skill_advisor.py` | Modify | One to three lines each that name the lane, a removed reader or the embeddings package (`tasks.md` T031) |
| 16 further test files and `R/tests/skill-advisor-cli-test-utils.ts` | Modify | Delete the dead flag line (`tasks.md` T020) |
| `R/stress-test/skill-advisor/five-lane-fusion-stress.vitest.ts`, `scorer-extras-stress.vitest.ts`, `mcp-diagnostics-stress.vitest.ts`, `advisor-recommend-handler-stress.vitest.ts`, `python-bench-runner-stress.vitest.ts`, `python-compat-stress.vitest.ts` | Modify | Four lane contributions, four lane keys, and the dead flag |
| `R/tests/README.md`, `R/tests/skill-graph/README.md`, `R/tests/scorer/fixtures/README.md` | Modify | List only files that exist |
| `.skilled/skills/system-skill-advisor/feature-catalog/` six leaves | Modify | Delete the SOURCE FILES rows that name a deleted file: `cli-surface/advisor-status.md` 49, 50 and 59, `daemon-and-freshness/background-vector-refresh.md` 45, `scorer-fusion/ablation.md` 40, `scorer-fusion/attribution.md` 37, `scorer-fusion/command-meaning-matching.md` 56, `scorer-fusion/five-lane-fusion.md` 59 |
| `.skilled/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json`, `durable-directory-manifest.json` | Regenerate | With each test's `--write`, for the deleted and edited advisor READMEs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The built registry lists four lanes: after a clean build, `SCORER_LANE_IDS` prints `["explicit_author","lexical","graph_causal","derived_generated"]`, the default live and shadow weight records each sum to 0.95 with every remaining value unchanged, `lanes/semantic-shadow.ts` does not exist, and `git grep -l -E 'semantic_shadow\|SemanticShadow\|semantic-shadow' -- R ':!R/dist'` prints nothing. |
| REQ-002 | `advisor_status` keeps a four-key contract: `AdvisorStatusOutputSchema` has no `semanticLaneHealth` or `embeddingsHealth`, `laneWeights` in a status response has exactly the four keys, `AdvisorStatusInputSchema.safeParse` rejects `includeSemanticHealth` and `includeEmbeddingsHealth` with `unrecognized_keys`, `handleAdvisorStatus` rejects either flag, neither the MCP tool nor the CLI manifest lists them, and `skill-advisor.cjs advisor_status` with `includeSemanticHealth` exits 64 naming the parameter. |
| REQ-003 | The advisor imports nothing from the embeddings package: `git grep -n -E 'shared/embeddings\|embedders' -- R ':!R/dist'` prints nothing, `lib/embedders/` and the `lib/shared/embeddings` symlink do not exist, and after `npm run clean && npm run build` the folder `R/dist/runtime/lib/embedders` does not exist. |
| REQ-004 | A database stored below schema version 2 is discarded and rebuilt: `SCHEMA_VERSION` is 2; `initDb` deletes the database file with its `-wal`, `-shm` and `-journal` siblings when the version it reads from the file is lower, or when the file's content has no readable version, meaning skill tables with no `schema_version` table; a transient failure to read (a lock held past the wait, a hot rollback journal only a writer may replay, an I/O, permission or descriptor error) never counts as unreadable, so the read-only probe leaves the file to the read-write open, which reports the error or, when it reads a version below 2, discards the file then; an empty file or one holding neither table is kept, as is one stored at 2; it writes no copy; the recreated schema has no `sqlite_master` name matching `/^vec_\|embedding/i` and no `skill_nodes` column matching `/^embedding/i`; `rg -n -i 'vec_\|embedding\|embedder' R/lib/skill-graph/skill-graph-db.ts` prints nothing; and the discard and keep cases in `skill-graph-db.vitest.ts` pass. |
| REQ-005 | The dead flag is gone from every code writer: `git grep -l SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC -- ':!specs'` prints exactly `.env.example`, `R/scripts/routing-accuracy/scorer-eval-baseline.json` and `.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs`, and every edited `.mjs`, `.cjs` and `.py` file passes `node --check` or `python3 -m py_compile`. |
| REQ-006 | In `R/`, `npm run typecheck` exits 0; `npm test` exits 0 with 0 failed, 11 fewer test files and a passed-plus-skipped total 67 lower than at the start commit (measured from 189 files and 2521 at the start commit: 178 files and 2454 after the lane removal, then 2460 once the review fixes added six database cases); `npm run clean && npm run build` exits 0; and `npm run test:stress -- --config vitest.stress.config.ts` exits 0 with 21 files and 65 passed, phase 001's baseline. |
| REQ-007 | The four CI routing ratchets and the command-routing slice pass with the start commit's counts (22 and 51 passed at the Measured Behavior and phase 003 baselines), the corpus gate exits 0 with the start commit's seven numbers, `derive-command-bridges.cjs --check` prints `"status":"fresh"` and `"changed":[]` with the start commit's counts, and `git diff --stat` from the start commit over the score baseline files in `plan.md` prints nothing. A failure of any of these is a halt, never a recapture. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-008 | The 11 lane test files, the seeding fixture, its cache file and `tests/embedders/README.md` are gone, and each edited test file passes alone with its planned count: status 25, CLI exit taxonomy 6, bootstrap 19, native scorer 21, skill graph database 15 (11 planned, four added by the review fix), runtime lane health 4, env override 6, meaning anchor 13, holdout 6, conflict 2, determinism spine 4, shadow sink 3, trust gate 9 and import specifier 2. |
| REQ-009 | The Measured Behavior pattern `P` matches exactly three runtime files: `git grep -l -E "$P" -- R ':!R/dist'` prints `scripts/routing-accuracy/scorer-eval-baseline.json`, `tests/cli-exit-taxonomy.vitest.ts` and `tests/handlers/advisor-status.vitest.ts`, the last two only for the refusal cases. |
| REQ-010 | The docs gates hold: `validate_catalog_package.py` prints `PACKAGE system-skill-advisor: PASS tier=fail violations=0`, the link check reports 0 broken, `run-script-tests.sh` prints `all sk-doc script tests passed` after the two baselines are regenerated with a diff limited to advisor READMEs this phase deleted or edited, and the advisor leaf manifest `--check` prints `OK`. |
| REQ-011 | No 005-owned path changes: `git diff --stat` from the start commit over `.skilled/skills/system-spec-kit/shared`, `.skilled/bin/hf-model-server.cjs`, `.skilled/bin/lib/model-server-supervision.cjs`, `R/package.json` and every `package-lock.json` prints nothing, and the launcher still lists `HF_EMBED_SERVER_URL` and `SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED`. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The lane-key count in a status response drops from 5 to 4, the schema accepts `includeSemanticHealth` before (`true` in Measured Behavior) and rejects it after, and the pattern `P` file count drops from 100 to 3.
- **SC-002**: This worktree's database, stored at version 1 with four `vec_*` tables and two embedding indexes, comes back from a copy run through `initDb` at version 2 with none of them and no copy file beside it.
- **SC-003**: Typecheck, `npm test`, the clean build and the stress suite exit 0, and the ratchets, the command-routing slice and the corpus gate print the start commit's numbers with no score baseline file changed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 003's commit | Without it the lane call, the exact rerank and the meaning path still import the lane module, so deleting it here breaks the build | T001 checks that `fusion.ts` imports only `scoreSemanticShadowLane` from the lane module and that the seven feeder tests are gone |
| Risk | Removing the lane moves a routing result | High | Measured: on 545 corpus rows no top skill, passing set, score or confidence moved with the lane skipped; a moved ratchet halts the phase (`plan.md` ADR-001) |
| Risk | A test pins an `uncertainty` value that the lane's test-regime evidence moved | Med | 225 corpus rows moved only in uncertainty; the per-file runs in T021 to T032 name such a test, which is edited only if it pins a non-baseline fixture, never a score baseline |
| Risk | The discard deletes a database another process holds open | Low | The daemon is the single writer and calls `initDb` before it serves; an old process keeps its unlinked file until it exits, and the rescan rebuilds derived state |
| Risk | A non-daemon caller of `getDb()` sees an empty database until the next scan | Low | Outside the daemon only `handlers/skill-graph/validate.ts` 45 and the `skill_graph_query` path through `skill-graph-queries.ts` open lazily; the daemon scans at `advisor-server.ts` 413 before its IPC server starts at 431 |
| Risk | A gate needs an edit to a 005-owned file | High | No file outside the advisor imports `lib/embedders/` (only comments in `shared/embeddings/*.ts` name it); if it happens, the `plan.md` ADR-009 fallback merges 004 and 005 |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: `advisor_status` makes no Ollama probe and no model-server probe, and `initDb` adds one read-only open of an existing database file before its first read-write open.

### Security
- **NFR-S01**: The launcher forwards one fewer key to the daemon child, the discard deletes only the advisor's own database file and its three siblings by exact name, and no edited file reads or prints a dotenv value, a token or a key.

### Reliability
- **NFR-R01**: The four CI routing ratchets, the command-routing slice and the corpus gate keep their start-commit results with every score baseline file unchanged, and a discarded database is rebuilt by the daemon's startup scan before it serves a request.

---

## 8. EDGE CASES

- Empty input: no database file yet; `initDb` finds nothing to discard and creates a version 2 database, as at HEAD.
- Maximum input: a database at version 1 holding all four vector tables, the embedding columns and both legacy CHECK constraints; `initDb` deletes it and its siblings, recreates it, and a scan indexes an `sk-hub` skill and a novel edge type without a CHECK failure.
- Failure path: a database whose content has skill tables but no `schema_version` table has no readable version, counts as version 0 and is discarded; a file the probe cannot read for a transient reason (a lock held past every wait, a hot rollback journal, an I/O, permission or descriptor error) is never discarded on that account and goes to the read-write open, which reports the error, or discards the file once it reads a version below 2; an empty file or one with neither table is a file another opener is creating and is kept; a database stored above 2 by a later build is kept, as at HEAD; a caller passing `includeSemanticHealth` or `includeEmbeddingsHealth` gets a schema error (exit 64 on the CLI); an operator override `SPECKIT_ADVISOR_LANE_WEIGHTS_JSON='{"semantic_shadow":0.05}'` is ignored, because the registry reads only known lane ids.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Files: about 110 touched (25 deleted, about 85 edited), LOC: about 4,500, mostly deleted; Systems: scorer, status contract, skill graph store, CLI and MCP surfaces, scripts, tests, stress, catalog |
| Risk | 14/25 | Auth: N, API: Y (two status inputs and two output fields go), Breaking: Y for callers of the removed flags, N for routing, guarded by five ratchets; destructive: an old database is deleted |
| Research | 4/20 | Research iterations 1, 4 and 5 inventory the core; this plan re-read every range at HEAD and measured lane neutrality on 545 rows |
| Multi-Agent | 2/15 | Workstreams: 1 |
| Coordination | 10/15 | Dependencies: phase 003's commit, the 005 ownership line, catalog rows and README baselines from 006's area |
| **Total** | **50/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A ratchet, the command slice or the corpus gate moves | H | L | Measured neutral on 545 rows; a move halts the phase with a finding, never a recapture (ADR-001) |
| R-002 | The discard runs on every start because the stored version is never written | H | L | The keep case in `skill-graph-db.vitest.ts` opens, closes and reopens a version 2 database with a marker row and asserts the row survives |
| R-003 | A stale `-journal` replays into the recreated database | M | L | The discard removes `-journal` with `-wal` and `-shm`, because `initDb` falls back to `journal_mode = DELETE` at 521 |
| R-004 | Test files assert lane values that typecheck cannot see, since `tsconfig.build.json` excludes `tests/` and `stress-test/` | M | M | REQ-009's grep covers tests and stress files, and every edited file runs alone with its planned count |
| R-005 | The residue check counts the two refusal tests | L | H | Expected: they must name the flag; phase 008 adds their allowlist rows |

---

## 11. USER STORIES

### US-001: The advisor has four lanes everywhere (Priority: P0)

**As a** maintainer removing the lane, **I want** the registry, every lane record, the status contract and the tests to name four lanes, **so that** no code path or contract can bring the semantic lane back by accident.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Old databases clean themselves (Priority: P1)

**As a** user whose advisor database was built with vector tables, **I want** the next daemon start to discard and rebuild it, **so that** no lane data stays on my machine and I run no manual step.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None blocking. Is the `lib/shared/embeddings` symlink deleted here or with the package in 005? Decision: here; nothing imports through it, the parent scope boundary names it, and the residue check's symlink term counts it (`plan.md` ADR-004).
- Are the two CHECK-rebuild migrations kept? Decision: deleted; `SCHEMA_SQL` at 224 to 290 creates neither CHECK, every database built before this phase is stored at version 1 and discarded, so no database `initDb` keeps can carry one (`plan.md` ADR-003).
- Is `debug` kept on `advisor_status`? Decision: kept as an accepted input that adds nothing, with its description reworded, so a caller passing it does not start failing (`plan.md` ADR-005).
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Design source**: See `../../023-ollama-deprecation-research/research/research.md` sections 1, 4, 5.1, 5.2, 5.3 and 5.7, and `../../023-ollama-deprecation-research/decision-record.md` Q003, Q004 and Q008
