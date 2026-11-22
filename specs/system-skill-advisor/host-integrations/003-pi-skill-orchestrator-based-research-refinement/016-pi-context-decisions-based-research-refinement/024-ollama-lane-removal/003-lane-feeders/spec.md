---
title: "Feature Specification: Phase 3: lane-feeders"
description: "The lane ships at weight 0, yet the daemon still refreshes vectors at start and after every reindex, the recommend handler wraps every prompt in an embedding call, and fusion keeps an exact rerank and a command meaning path that read cosine evidence. This phase deletes every code path that writes, computes or consumes a vector for the lane, the embeddingText field that feeds the command vectors, and the three env keys the launcher forwards for them, while the lane id and its contract stay for phase 004."
trigger_phrases:
  - "lane feeders"
  - "phase 3 lane feeders"
  - "remove the background vector refresh"
  - "remove the command meaning path"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.4 -->
# Feature Specification: Phase 3: lane-feeders

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

The lane ships at live weight 0, yet 11 call sites in the advisor still feed it: the daemon start and every watcher reindex start a background vector refresh, the scan handler refreshes vectors, the recommend handler wraps each prompt in an embedding call, fusion keeps an opt-in exact rerank and a command meaning path that reads cosine evidence, and the bridge generator writes 47 `embeddingText` fields that only the vector refresh reads. This phase deletes those feeders, their dedicated tests and the three env keys the launcher forwards for them, and leaves the lane id, the lane module, the status contract and the vector readers for phase 004. Afterwards the call-site grep in Measured Behavior prints nothing, the generated bridges carry no `embeddingText`, and the four CI routing ratchets, the command-routing slice and the corpus gate pass with every score baseline file unchanged.

**Key Decisions**: the cut follows ownership, not vocabulary: writers and callers go here, while every symbol a 004-owned file imports stays, so the compiler stays green between the two commits; the lane call at `fusion.ts` 541 stays with 004 because a lane-key test reads its output; "lane env key" in the goal means the three feeder keys, with the dead flag left to 004 and the model-server keys to 005.

**Critical Dependencies**: phase 002 lands first, because it regenerates the same bridge JSON and removes the embedder bridge; `derive-command-bridges.cjs`; phase 001's recorded gate baselines.

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
| **Phase** | 3 of 8 |
| **Predecessor** | 002-doctor-surface |
| **Successor** | 004-lane-core |
| **Handoff Criteria** | Advisor typecheck, tests and clean build pass, and the four ratchets pass with score baselines untouched |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Ollama lane removal specification.

**Scope Boundary**: What feeds the lane, in the advisor runtime: the background vector refresh in the daemon and watcher, the scan handler's refresh and its `embeddings` response field, prompt embedding on the recommend path, the exact semantic rerank, the command meaning path in `fusion.ts`, the `embeddingText` field and its generator code, the `--real-embedding` capture mode, and the env keys the launcher forwards. The lane id and schema stay until 004.

**Dependencies**:
- 002-doctor-surface: no doctor step passes the semantic-health flag, and the bridge JSON is regenerated without the embedder bridge
- `../../023-ollama-deprecation-research/research/research.md` sections 1.2 and 5.2 step 2

**Deliverables**:
- The daemon, the watcher, the recommend path and `fusion.ts` compute and read no vector, as section 3 defines it
- Advisor typecheck, tests and clean build pass, and the four ratchets pass with score baselines untouched
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The lane contributes nothing to the live score, yet its feeders still run: the daemon resolves an embedder at start, refreshes skill and command vectors after start and after every reindex, and asks Ollama whether the model is loaded each time coverage is incomplete. The recommend handler routes every prompt through an embedding wrapper, and fusion keeps two consumers of the lane's vectors, an opt-in exact rerank and a command meaning path. Phase 004 cannot delete the lane id while these callers import its module and its store functions.

### Purpose
No code on the daemon, watcher, scan, recommend or fusion path writes, computes or consumes a vector, so phase 004 can delete the lane, its readers and its contract in one compiler-forced commit.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ git rev-parse --short HEAD
bf6806ad4b3
$ R=.skilled/skills/system-skill-advisor/runtime
$ F='refreshEmbeddingsInBackground\(|refreshSkillEmbeddings\(|ensureActiveEmbedder\(|withSemanticShadowPromptEmbedding\(|scoreSemanticShadowExactSubset\(|commandMeaningCosine\(|rankMeaningPassedCommandFirst\(|commandEmbeddingText\('
$ git grep -n -E "$F" -- "$R/*.ts" "$R/*.cjs" ":!$R/tests" ":!$R/stress-test" ":!$R/lib/embedders" | grep -v -E 'function [a-zA-Z]+(<T>)?\(' | cut -d: -f1,2
.skilled/skills/system-skill-advisor/runtime/advisor-server.ts:402
.skilled/skills/system-skill-advisor/runtime/advisor-server.ts:445
.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:601
.skilled/skills/system-skill-advisor/runtime/handlers/skill-graph/scan.ts:54
.skilled/skills/system-skill-advisor/runtime/lib/daemon/watcher.ts:496
.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:408
.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:918
.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1103
.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1635
.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:1524
.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:1353
$ (same pipeline) | wc -l
      11
$ git grep -c '"embeddingText"' -- $R/scripts/command-bridges/command-bridges.generated.json
.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json:47
$ git grep -n -E "^  '(OLLAMA_BASE_URL|OLLAMA_REQUEST_TIMEOUT_MS|SYSTEM_SKILL_ADVISOR_EMBED_REFRESH)'," -- .skilled/bin/system-skill-advisor-launcher.cjs
.skilled/bin/system-skill-advisor-launcher.cjs:185:  'OLLAMA_BASE_URL',
.skilled/bin/system-skill-advisor-launcher.cjs:186:  'OLLAMA_REQUEST_TIMEOUT_MS',
.skilled/bin/system-skill-advisor-launcher.cjs:188:  'SYSTEM_SKILL_ADVISOR_EMBED_REFRESH',
$ node -e "const l=require('./.skilled/bin/system-skill-advisor-launcher.cjs');const e=l.createChildEnv({OLLAMA_BASE_URL:'x',OLLAMA_REQUEST_TIMEOUT_MS:'1',SYSTEM_SKILL_ADVISOR_EMBED_REFRESH:'off',PATH:'/usr/bin'});console.log(JSON.stringify(['OLLAMA_BASE_URL','OLLAMA_REQUEST_TIMEOUT_MS','SYSTEM_SKILL_ADVISOR_EMBED_REFRESH'].filter(k=>k in e)))"
["OLLAMA_BASE_URL","OLLAMA_REQUEST_TIMEOUT_MS","SYSTEM_SKILL_ADVISOR_EMBED_REFRESH"]
$ (cd $R && npm run typecheck > /dev/null 2>&1; echo "exit=$?")
exit=0
$ node $R/scripts/command-bridges/derive-command-bridges.cjs --check | tr -d '\n '
{"status":"fresh","counts":{"commandMetadata":27,"doctorRoutes":36,"generated":63,"typescriptActive":47,"pythonActive":53},"changed":[]}
$ (cd $R && npx vitest run tests/parity/scorer-eval-baseline-ratchet.vitest.ts tests/parity/local-native-divergence-ratchet.vitest.ts tests/parity/holdout-independent.vitest.ts) | grep -E 'Test Files|Tests '
 Test Files  3 passed (3)
      Tests  22 passed (22)
$ (cd $R && npx vitest run tests/routing-golden-prompts.vitest.ts tests/command-routing-slice.vitest.ts) | grep -E 'Test Files|Tests '
 Test Files  2 passed (2)
      Tests  51 passed (51)
$ (cd $R && python3 scripts/routing-accuracy/score-routing-corpus.py --dataset "$PWD/scripts/routing-accuracy/labeled-prompts.jsonl" --min-advisor-accuracy 0.5333 --min-gate3-f1 0.9843 --min-joint-tt 101 --max-joint-ft 3 --max-joint-ff 1 --require-historical-clean; echo "exit=$?") | grep -E '"rows"|"accuracy"|"f1"|"TT"|"FT"|"FF"|"overall_pass"|exit='
  "rows": 196,
    "accuracy": 0.602,
    "f1": 0.9844,
    "TT": 115,
    "FT": 3,
    "FF": 1
  "overall_pass": true
exit=0
$ (cd .skilled && npx vitest run --config vitest.config.bin.ts bin/launcher-threshold-env.vitest.ts) | grep -E 'Test Files|Tests '
 Test Files  1 passed (1)
      Tests  7 passed (7)
$ (cd $R && npx vitest list <the seven test files section 3 deletes>) | cut -d'>' -f1 | sort | uniq -c
   2 tests/daemon/watcher-embedding-refresh.vitest.ts
   4 tests/handlers/semantic-outage-degraded.vitest.ts
   5 tests/semantic-lane-weight-zero.vitest.ts
   7 tests/semantic-prompt-embedding-degrade.vitest.ts
   4 tests/skill-graph-embedding-outage.vitest.ts
   9 tests/skill-graph/refresh-in-background.vitest.ts
   5 tests/skill-graph/refresh-roundtrip.vitest.ts
$ python3 .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py | grep system-skill-advisor
PACKAGE system-skill-advisor: PASS tier=fail violations=0
$ node .skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs | grep 'links checked'
check-markdown-links: 7690 files, 15283 links checked, 0 broken
$ bash .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh | tail -1
all sk-doc script tests passed
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

"Compute or read a vector" in this phase means an embedder call, an embedder or model probe, an embedder pointer write, or a read, decode or write of a stored embedding value. After this phase none of those sits in `advisor-server.ts`, `lib/daemon/watcher.ts`, `handlers/skill-graph/scan.ts`, `handlers/advisor-recommend.ts` or `fusion.ts`. Two reads stay, both owned by phase 004: the lane scorer that `fusion.ts` 541 still calls, which in production returns before any vector read because no prompt vector exists, and the projection's staleness probe, which reads `vec_*` model ids and never a vector value.

### In Scope
- Delete the daemon's embedder resolution and background vector refresh at start (`advisor-server.ts` 398 to 411 and 444 to 468), the watcher's refresh after each reindex (`watcher.ts` 496 to 518), the scan handler's refresh and its `embeddings` response field, and every vector writer in `skill-graph-db.ts`, with the `SYSTEM_SKILL_ADVISOR_EMBED_REFRESH` read and the Ollama probe.
- Delete the prompt embedding wrapper and the runtime-health plumbing that only reports its outcome from the recommend handler, so it calls `scoreAdvisorPrompt` directly.
- Delete the exact semantic rerank and the command meaning path from `fusion.ts`, keeping the phrase-anchor half of `requireCommandPhraseAnchor`.
- Delete the `embeddingText` generator code from `derive-command-bridges.cjs`, regenerate the bridge JSON, and remove the `--real-embedding` capture mode.
- Stop forwarding `OLLAMA_BASE_URL`, `OLLAMA_REQUEST_TIMEOUT_MS` and `SYSTEM_SKILL_ADVISOR_EMBED_REFRESH` from the launcher and drop the refresh key from CI and the CLI test env; delete the seven tests whose subject is a removed feeder, edit the nine that cover one beside surviving code, and edit the six docs that name a removed symbol or test.

### Out of Scope
- The lane registry row, `lanes/semantic-shadow.ts` (including its now-uncalled `withSemanticShadowPromptEmbedding` and `scoreSemanticShadowExactSubset`), the `fusion.ts` lane call at 541 and its `scoreSemanticShadowLane` import, the query-class multipliers at 197 to 205 and `projectionRuntimeLaneHealth` at 299 to 315 - phase 004, because `native-scorer.vitest.ts` 116 asserts a non-zero `semantic_shadow` score through `scoreAdvisorPrompt` and the lane type derives from the registry row (`plan.md` ADR-002).
- The vector readers `embeddingCoverage`, `loadSkillEmbeddings`, `readCommandEmbeddingSources`, `providerModelId` and their helpers in `skill-graph-db.ts`, the vector DDL, `SCHEMA_VERSION`, `projection.ts` staleness 1381 to 1692 and its use at 1743 and 1762 to 1763, `types.ts` 84 to 99 and 113 to 114, `advisor-status.ts`, the tool schema, the tool and CLI rows, and `lib/embedders/` - phase 004, because `advisor-status.ts` imports the readers and the staleness check.
- `advisor-recommend.ts` 190 to 191, which maps `cosine` evidence to `semantic_similarity` - phase 004 removes it with the lane that emits the evidence.
- `SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC` at every site, including launcher 163, `skill-advisor-cli-test-utils.ts` 80 and the capture script's 89 and 425 - phase 004 owns the dead flag at every site.
- Launcher 180 to 183, the model-server keys - phase 005 deletes the model server they configure.
- The feature catalog leaves `background-vector-refresh.md` and `command-meaning-matching.md`, `.env.example`, `ENV-REFERENCE.md`, `INSTALL-GUIDE.md`, `ARCHITECTURE.md`, the advisor `README.md`, the `scorer-fusion/ablation.md` catalog leaf and playbook entry and every changelog - phase 006, except the one row at `background-vector-refresh.md` 44 that names a test this phase deletes (`plan.md` ADR-004).
- The trigger-index fixture `phrase-variants.json`, whose phrase list names `refreshSkillEmbeddings` - phase 007 regenerates it.
- `run-command-behaviour.mjs` 1014, the `OLLAMA_` prefix in its env scrub list - not a feeder; it keeps inherited keys out of behaviour runs, and phase 008's residue check decides between deletion and an allowlist row.

### Files to Change

`R/` is `.skilled/skills/system-skill-advisor/runtime/`.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `R/advisor-server.ts` | Modify | Delete imports 23 and 26, the embedder block 398 to 411, the binding at 413 and the refresh block 444 to 468 |
| `R/lib/daemon/watcher.ts` | Modify | Import 15 goes; the default reindex at 494 to 520 returns `indexSkillMetadata(skillsRoot)` alone |
| `R/handlers/skill-graph/scan.ts` | Modify | Drop `refreshSkillEmbeddings` from import 7, the call at 54 and the `embeddings` field at 67 |
| `R/lib/skill-graph/skill-graph-db.ts` | Modify | Delete the writers 1296 to 1312 and 1433 to 1788, `encodeEmbedding` 726 to 729, two result types 107 to 112 and 138 to 143, and the imports only they use (17, 24, 25, 40); reword 156 to 159 |
| `R/handlers/advisor-recommend.ts` | Modify | Delete imports 27 to 30, 103 to 127, 508 to 513 and the wrapper 601 to 618; drop the warning parameter at 518, its spread at 526 and its argument at 628; reword 565 |
| `R/lib/scorer/fusion.ts` | Modify | Exact rerank 32, 77, 79, 80, 135 to 139, 169 to 172, 396 to 419, 1292, 1437 to 1439, 1450 to 1459; meaning path 863 to 906, 908 to 959 reduced to the phrase anchor, 1092 to 1130, 1620 to 1628 and 1635 |
| `R/scripts/command-bridges/derive-command-bridges.cjs` | Modify | Delete 97 to 99, 125, 168 to 174, 687 to 717, 1335 to 1337 and the spread at 1353. [DEVIATION: `doctorCommandDescription` and the three `description:` fields on `DOCTOR_DETAILS` also go; the deleted meaning code was their only reader.] |
| `R/tests/skill-advisor-cli-job-semantics.vitest.ts` | Modify | [DEVIATION: added during implementation.] Assert the scan response has no `embeddings` field and check its scan counts |
| `R/scripts/command-bridges/command-bridges.generated.json` | Regenerate | Generator output without `embeddingText` |
| `R/scripts/routing-accuracy/capture-command-routing-baseline.mjs` | Modify | Remove the `--real-embedding` mode: 26 to 29, 38, 68, 69, 99 to 106, 140 to 199, 405, 411 to 431, 489 to 492, 561 to 566, 796 to 808 |
| `.skilled/bin/system-skill-advisor-launcher.cjs` | Modify | Delete 184 to 188, the three feeder keys and their two comments |
| `.github/workflows/skill-advisor-stress.yml` | Modify | Delete the comment and key at 49 and 50 |
| `R/tests/daemon/watcher-embedding-refresh.vitest.ts` | Delete | Subject is the watcher refresh |
| `R/tests/handlers/semantic-outage-degraded.vitest.ts` | Delete | Subject is `mergeSemanticShadowRuntimeLaneHealth` |
| `R/tests/semantic-prompt-embedding-degrade.vitest.ts` | Delete | Subject is the prompt embedding wrapper and its warning |
| `R/tests/semantic-lane-weight-zero.vitest.ts` | Delete | Subject is the wrapper, the exact subset and the merge function at weight zero |
| `R/tests/skill-graph-embedding-outage.vitest.ts` | Delete | Subject is the refresh outage handling |
| `R/tests/skill-graph/refresh-in-background.vitest.ts` | Delete | Subject is the background refresh |
| `R/tests/skill-graph/refresh-roundtrip.vitest.ts` | Delete | Subject is the refresh round trip |
| `R/tests/scorer/semantic-shadow-cosine.vitest.ts` | Modify | Delete the refresh case at 181 to 200 and import 64 |
| `R/tests/skill-graph/embedding-coverage.vitest.ts` | Modify | Delete the case at 81 to 115, which seeds through the refresh |
| `R/tests/scorer/conflict-query-rerank.vitest.ts` | Modify | Delete the two rerank cases at 160 to 219 and the imports and helpers only they use |
| `R/tests/scorer/semantic-shadow-ablation.vitest.ts` | Modify | Delete the rerank-off constant at 44 and its assertion with its comment at 297 to 305, keeping 300; the rest of the file is 004's |
| `R/tests/command-meaning-anchor.vitest.ts` | Modify | Keep 13 phrase-anchor, withhold and no-embedder cases; delete 15 meaning cases |
| `R/tests/launcher-bootstrap.vitest.ts` | Modify | Case 608 to 633 drops the two removed calls and matches the new reindex line |
| `R/tests/command-bridges-drift-guard.vitest.ts` | Modify | Drop `embeddingText` at 24 and 227 and the embedding half of the case at 392 to 415 |
| `R/tests/skill-advisor-cli-test-utils.ts` | Modify | Delete the comment and key at 81 and 82 |
| `.skilled/bin/launcher-threshold-env.vitest.ts` | Modify | Delete the two feeder-key cases at 22 to 40 |
| `R/scripts/command-bridges/README.md` | Modify | Delete the paragraph at 54; cut the meaning sentences from 74 |
| `R/scripts/routing-accuracy/README.md` | Modify | Cut the `--real-embedding` sentences from row 134 |
| `R/lib/scorer/README.md` | Modify | Row 56 describes the phrase anchor only |
| `R/tests/README.md` | Modify | Delete tree lines 157 and 176 |
| `R/tests/skill-graph/README.md` | Modify | Replace row 34 and the refresh wording in the frontmatter |
| `.skilled/skills/system-skill-advisor/feature-catalog/daemon-and-freshness/background-vector-refresh.md` | Modify | Delete row 44, which names a deleted test |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The Measured Behavior call-site pipeline prints nothing and `wc -l` prints 0, and `rg -n 'ensureActiveEmbedder\|refreshEmbeddingsInBackground\|refreshSkillEmbeddings\|embedders/' R/advisor-server.ts R/lib/daemon/watcher.ts R/handlers/skill-graph/scan.ts` prints nothing. |
| REQ-002 | `skill-graph-db.ts` defines no `refreshSkillEmbeddings`, `refreshEmbeddingsInBackground`, `refreshEmbeddingsOnce`, `refreshSkillEmbeddingsViaAdapter`, `refreshCommandEmbeddings`, `encodeEmbedding` or `EMBEDDING_BACKEND_OUTAGE_STREAK`, reads no `SYSTEM_SKILL_ADVISOR_EMBED_REFRESH` and imports none of `getAdapter`, `getManifest`, `probeOllamaModel`, `resolveOllamaBaseUrl`, `ensureCommandVecTableForDim` or `EmbedderAdapter`, while `embeddingCoverage`, `loadSkillEmbeddings`, `readCommandEmbeddingSources` and `providerModelId` stay exported. |
| REQ-003 | `advisor-recommend.ts` calls `scoreAdvisorPrompt` directly with `runtimeLaneHealthForStatus(status)`, imports nothing from `lanes/semantic-shadow.js`, and defines no `mergeSemanticShadowRuntimeLaneHealth`, `PRE_SCORE_REFUSALS` or `semanticLaneOffWarning`. |
| REQ-004 | `fusion.ts` holds no exact rerank: `rg -n 'ExactSemantic\|EXACT_SEMANTIC\|scoreSemanticShadowExactSubset' R/lib/scorer/fusion.ts` prints nothing, and its only lane-module import is `scoreSemanticShadowLane`. |
| REQ-005 | `fusion.ts` holds no command meaning path: `rg -n 'COMMAND_MEANING\|commandMeaning\|meaningPassed\|rankMeaningPassed\|cosine' R/lib/scorer/fusion.ts` prints nothing, and `requireCommandPhraseAnchor(ranked)` takes one argument and clears `passes_threshold` on every command row with no positive `explicit_author` contribution. |
| REQ-006 | `derive-command-bridges.cjs` holds no `embeddingText`, `commandEmbeddingText`, `entryMeaning` or `METADATA_MEANING`; after a plain generator run the bridge JSON holds no `embeddingText` field, `--check` prints `"status":"fresh"` and `"changed":[]` with the same four counts as at the phase's start commit, and the run changes no file but the JSON. |
| REQ-007 | The Measured Behavior `createChildEnv` command prints `[]`, and `git grep -l -E 'SYSTEM_SKILL_ADVISOR_EMBED_REFRESH\|SPECKIT_ADVISOR_EXACT_SEMANTIC_RERANK' -- '*.ts' '*.cjs' '*.mjs' '*.yml' '*.py' ':!specs' ':(exclude,glob)**/*lane-residue*'` prints nothing; the exclusion keeps phase 001's residue check, which must name both keys to find them. |
| REQ-008 | In `R/`, `npm run typecheck` exits 0, `npm test` exits 0 with 0 failed, seven fewer test files than at the start commit and a passed-plus-skipped total 55 lower than at the start commit (189 files and 2523 when the start commit matches the 001 baseline of 196 files, 2570 passed and 8 skipped), and `npm run clean && npm run build` exits 0. |
| REQ-009 | The four CI routing ratchets (golden prompts, scorer-eval baseline, local-native divergence, holdout) and `command-routing-slice.vitest.ts` pass with the Measured Behavior counts, the corpus gate exits 0 with the Measured Behavior numbers, and `git diff --stat` from the start commit over the score baseline files in `plan.md` prints nothing. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-010 | `capture-command-routing-baseline.mjs` passes `node --check`, names no `realEmbedding`, `SEMANTIC_SHADOW_MODULE`, `11434` or `nomic`, and `node capture-command-routing-baseline.mjs --real-embedding` exits 2 with `unknown option: --real-embedding`. |
| REQ-011 | The seven feeder test files are gone, and each edited test file passes alone with its planned count: cosine 7, coverage 1, conflict 2, ablation 4 (its start-commit pass and skip split), meaning anchor 13, bootstrap 21, drift guard 6, and the bin launcher test 5. |
| REQ-012 | The six docs name no removed symbol and no deleted test: `validate_catalog_package.py` prints `PACKAGE system-skill-advisor: PASS tier=fail violations=0`, the link check reports 0 broken, and `run-script-tests.sh` prints `all sk-doc script tests passed`. |
| REQ-013 | No 004- or 005-owned file changes: `git diff --stat` from the start commit over `lane-registry.ts`, `lanes/semantic-shadow.ts`, `advisor-status.ts`, `schemas/`, `tools/`, `skill-advisor-cli-manifest.ts`, `projection.ts`, `types.ts` and `lib/embedders/` prints nothing, and the launcher still lists `SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC` and `HF_EMBED_SERVER_URL`. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The Measured Behavior call-site count drops from 11 to 0, the `embeddingText` count from 47 (46 once phase 002 lands) to 0, and the `createChildEnv` command prints `[]` instead of three keys.
- **SC-002**: Typecheck, `npm test` and the clean build exit 0, with seven fewer test files than at the start commit and 0 failed.
- **SC-003**: The five ratchet files print 22 and 51 passed as in Measured Behavior, the corpus gate prints the same seven numbers, and no score baseline file changed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 002's commit, which regenerates the same bridge JSON | Regenerating before 002 lands would put both phases' edits in one JSON diff | T001 reprints the counts at the start commit; the JSON must already read `"doctorRoutes":35` |
| Risk | A file outside the inventory imports a removed feeder symbol | High | Typecheck and `npm test` name it; a fix that needs a 004-owned edit triggers the `plan.md` fallback, never an ad hoc edit |
| Risk | Removing the meaning path or the rerank moves a routing result | Med | The meaning path acts only on `cosine:` evidence for a command row and the rerank only under its opt-in flag; under Vitest with no prompt embedding set the lane emits `shadow:test-fallback`, so no ratchet sees either; a moved ratchet is a goal D2 finding and halts the phase |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The recommend handler makes no embedder call and awaits no embedding wrapper, and daemon start and each reindex start no background refresh, so neither path takes longer than at the start commit.

### Security
- **NFR-S01**: The launcher forwards three fewer keys to the daemon child and no edited file reads or prints a dotenv value, a token or a key.

### Reliability
- **NFR-R01**: The four CI routing ratchets, the command-routing slice and the corpus gate keep their start-commit results with every score baseline file unchanged.

---

## 8. EDGE CASES

- Empty input: a machine that never ran the embedder has no vector tables; the daemon now starts without touching them and the staleness probe, still in place for 004, finds no `vec_*` table.
- Maximum input: an operator who set a positive `semantic_shadow` weight override gets an empty lane that still counts in confidence normalization between this phase and 004, because the merge that marked a failed embed as degraded is gone; the shipped weight is 0 and is unaffected.
- Failure path: `capture-command-routing-baseline.mjs --real-embedding` exits 2 with `unknown option`, and an `includeSemanticHealth` status call now probes the default Ollama URL because the launcher no longer forwards `OLLAMA_BASE_URL`; phase 004 removes that probe.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 16/25 | Files: 33, LOC: about 2,400, almost all deleted (1,290 in the seven test files), Systems: daemon, recommend handler, scorer, bridge generator, launcher, CI |
| Risk | 10/25 | Auth: N, API: Y (the scan response loses `embeddings`), Breaking: N for routing, guarded by five ratchets |
| Research | 4/20 | Research iterations 1 and 5 inventory the feeders; this plan re-read every range at HEAD and measured the gates |
| Multi-Agent | 2/15 | Workstreams: 1 |
| Coordination | 9/15 | Dependencies: 3, phase 002's regeneration, the 004 ownership line, one catalog row from 006's area |
| **Total** | **41/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | The split fails to compile because a 004-owned file imports a symbol this phase deletes | H | L | Every deleted symbol was grepped for importers; typecheck runs first, and the `plan.md` fallback merges 003 into 004 rather than editing a 004 file here |
| R-002 | A ratchet or a score baseline moves | H | L | Goal decision D2: halt and record a finding; no recapture |
| R-003 | The catalog validator fails the advisor package on the deleted test path | M | H | T029 deletes the one row at `background-vector-refresh.md` 44 in the same commit |
| R-004 | A positive semantic weight override lowers confidence until 004 | L | L | Shipped weight is 0; section 8 names it and 004 removes the lane |

---

## 11. USER STORIES

### US-001: Nothing feeds the lane before it goes (Priority: P0)

**As a** maintainer removing the lane, **I want** no daemon, scan, recommend or fusion path to write, compute or consume a vector, **so that** phase 004 can delete the lane id and its contract in one compiler-forced commit.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: The daemon stops talking to Ollama (Priority: P1)

**As a** user whose machine runs the advisor daemon, **I want** start and every reindex to stop resolving an embedder and probing Ollama, **so that** a lane that scores nothing costs nothing.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None blocking. Does the lane call at `fusion.ts` 541 move here? Decision: no; `native-scorer.vitest.ts` 116 asserts a non-zero `semantic_shadow` rawScore through `scoreAdvisorPrompt`, so removing the call would edit a 004 test (`plan.md` ADR-002).
- Which keys does goal criterion 4's "lane env key" name? Decision: the three keys a removed feeder reads; launcher 163 is the dead flag phase 004 removes at every site, and 180 to 183 configure the model server phase 005 deletes (`plan.md` ADR-003).
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Design source**: See `../../023-ollama-deprecation-research/research/research.md` sections 1.2, 4.4 and 5.2
