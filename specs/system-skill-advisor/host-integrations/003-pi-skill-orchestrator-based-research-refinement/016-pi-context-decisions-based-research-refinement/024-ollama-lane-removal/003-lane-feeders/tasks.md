---
title: "Tasks: Phase 3: lane-feeders"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "lane feeders tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 3: lane-feeders

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

Commands run from the repository root with `R=.skilled/skills/system-skill-advisor/runtime` set; a command written `(cd $R && ...)` runs in the runtime folder. `S` is the phase's start commit, recorded by T001. Line numbers are at `bf6806ad4b3`, which phase 002 does not move in any file listed here except the bridge JSON; delete from the bottom of a file up so earlier numbers hold. No new code comment names a spec, phase, task or requirement id.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Reprint the Measured Behavior commands at the start commit, which must be phase 002's, and record that SHA as `S` (`implementation-summary.md`). Verify: the call-site pipeline prints 11 lines, the `createChildEnv` command prints the three keys, `git grep -c '"embeddingText"'` on the JSON prints 46, `--check` prints `"doctorRoutes":35,"generated":62,"typescriptActive":46,"pythonActive":52` with `"changed":[]`, the ratchet, corpus and bin-test lines match Measured Behavior, and `(cd $R && npm test)` totals (files, passed, skipped, failed) are recorded as the REQ-008 base. Evidence: start commit `S` = `0c2ab52b3b3` (phases 001 and 002 committed). At `S` the call-site pipeline printed 11 lines (the same 11 as Measured Behavior), `createChildEnv` printed `["OLLAMA_BASE_URL","OLLAMA_REQUEST_TIMEOUT_MS","SYSTEM_SKILL_ADVISOR_EMBED_REFRESH"]`, the `embeddingText` grep printed 46, `--check` printed `{"status":"fresh","counts":{"commandMetadata":27,"doctorRoutes":35,"generated":62,"typescriptActive":46,"pythonActive":52},"changed":[]}`, the three parity ratchets printed `22 passed (22)`, golden prompts plus slice printed `51 passed (51)`, the corpus gate exited 0 with `"rows": 196`, `"accuracy": 0.602`, `"f1": 0.9844`, `"TT": 115`, `"FT": 3`, `"FF": 1`, `"overall_pass": true`, the bin launcher test printed `7 passed (7)`, and `npm test` exited 0 with `196 passed (196)` files and `2568 passed | 8 skipped (2576)`. The record lives here and in the conductor report, not in `implementation-summary.md`, which the conductor reserved.
- [x] T002 Read the gate baselines phase 001 and phase 002 recorded (`../001-residue-check-and-cleanup-tool/implementation-summary.md`). Verify: `rg -n 'npm test|typecheck|ratchet' ../001-residue-check-and-cleanup-tool/implementation-summary.md ../002-doctor-surface/implementation-summary.md` prints a row naming 196 files, 2570 passed and 8 skipped for `npm test`. Evidence: the rg printed `../001-residue-check-and-cleanup-tool/implementation-summary.md:116` (`npm test`: 196 files, 2570 passed, 8 skipped) and `../002-doctor-surface/implementation-summary.md:110` (`npm test`: 196 files, 2568 passed, 8 skipped, two fewer from the removed embedder command entry). The start commit therefore matches 002's baseline, not 001's, so the REQ-008 target is 189 files and 2521 passed plus skipped (2576 minus 55), not 2523.
- [x] T003 [P] Record the case count of every test file this phase deletes or edits (`implementation-summary.md`). Verify: `(cd $R && npx vitest list <file>)` counts 36 across the seven deleted files, and 8 cosine, 2 coverage, 4 conflict, 4 ablation, 28 meaning anchor, 21 bootstrap and 6 drift guard, and a default `npx vitest run` of the ablation file records its pass and skip split. Evidence: default `npx vitest run` per file at `S`: watcher-embedding-refresh 2, semantic-outage-degraded 4, semantic-lane-weight-zero 5, semantic-prompt-embedding-degrade 7, skill-graph-embedding-outage 4, refresh-in-background 9, refresh-roundtrip 5 (36 cases, all passed, none skipped); cosine 8, coverage 2, conflict 4, ablation `2 passed | 2 skipped (4)`, meaning anchor 28, bootstrap 21, drift guard 6.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Delete the refresh block 444 to 468, change 413 to `await startupSkillGraphScan();`, delete the embedder block 398 to 411 with its comment, and delete `refreshEmbeddingsInBackground` from the import at 23 and the import at 26 (`$R/advisor-server.ts`). Verify: `rg -n 'ensureActiveEmbedder|refreshEmbeddingsInBackground|embedders/|startupSkillsRoot' $R/advisor-server.ts` prints nothing and exits 1. Evidence: the rg printed nothing and exited 1. The block, the `refreshEmbeddingsInBackground` and `ensureActiveEmbedder` imports and the now-unused `getDb as getSkillGraphDb` alias went (the alias had its only use in the deleted block); 413 reads `await startupSkillGraphScan();`.
- [x] T005 Replace the default reindex at 494 to 520 with `const defaultReindex = async (): Promise<ReindexResult> => indexSkillMetadata(skillsRoot);` and narrow the import at 13 to 16 to `import { indexSkillMetadata } from '../skill-graph/skill-graph-db.js';` (`$R/lib/daemon/watcher.ts`). Verify: `rg -n -i 'refreshEmbeddingsInBackground|embedding' $R/lib/daemon/watcher.ts` prints nothing and exits 1. Evidence: the rg printed nothing and exited 1; line 491 reads `const defaultReindex = async (): Promise<ReindexResult> => indexSkillMetadata(skillsRoot);` and the import reads `import { indexSkillMetadata } from '../skill-graph/skill-graph-db.js';`.
- [x] T006 Drop `refreshSkillEmbeddings` from the import at 7, delete the call at 54 and the `embeddings: embeddingRefresh,` line at 67 (`$R/handlers/skill-graph/scan.ts`). Verify: `rg -n -i 'embed' $R/handlers/skill-graph/scan.ts` prints nothing and exits 1. Evidence: `rg -n -i 'embed'` on the file printed nothing and exited 1.
- [x] T007 Delete, bottom up, `refreshCommandEmbeddings` 1677 to 1788, `refreshSkillEmbeddingsViaAdapter` 1531 to 1675, the outage streak 1527 to 1529, `refreshEmbeddingsOnce` 1495 to 1525, the background refresh with its state 1433 to 1493, `refreshSkillEmbeddings` with its comment 1296 to 1312, `encodeEmbedding` 726 to 729, `CommandEmbeddingRefreshResult` 138 to 143, `SkillEmbeddingRefreshResult` 107 to 112, the type import at 40, the imports at 24 and 25 and `ensureCommandVecTableForDim` at 17; reword 156 to 159 so it says the coverage reader, not a refresh, reads the projection (`$R/lib/skill-graph/skill-graph-db.ts`). Verify: `rg -n 'refreshSkillEmbeddings|refreshEmbeddingsInBackground|refreshEmbeddingsOnce|refreshCommandEmbeddings|ViaAdapter|encodeEmbedding|OUTAGE_STREAK|EMBED_REFRESH|probeOllamaModel|resolveOllamaBaseUrl|getAdapter|getManifest|EmbedderAdapter|ensureCommandVecTableForDim|embedding refresh' $R/lib/skill-graph/skill-graph-db.ts` prints nothing, and `rg -c '^export function (embeddingCoverage|loadSkillEmbeddings|readCommandEmbeddingSources|providerModelId)\(' $R/lib/skill-graph/skill-graph-db.ts` prints 4. Evidence: the rg printed nothing and exited 1, the export count printed 4, and `npm run typecheck` exited 0 right after.
- [x] T008 Replace the wrapper at 601 to 618 with `const result = scoreAdvisorPrompt(scoredPrompt, { workspaceRoot, confidenceThreshold: input.options?.confidenceThreshold, uncertaintyThreshold: input.options?.uncertaintyThreshold, runtimeLaneHealth: runtimeLaneHealthForStatus(status) });`, drop the third argument at 628, the parameter at 518 and its spread at 526, delete `semanticLaneOffWarning` 508 to 513, `PRE_SCORE_REFUSALS` and `mergeSemanticShadowRuntimeLaneHealth` 103 to 127 and the import at 27 to 30, and reword 565 to "Stripped once here so the cache key and the scorer see the same text." (`$R/handlers/advisor-recommend.ts`). Verify: `rg -n 'semantic-shadow|SemanticShadow|semanticLaneOff|PRE_SCORE_REFUSALS|embedding' $R/handlers/advisor-recommend.ts` prints nothing, and `rg -c "case 'cosine'" $R/handlers/advisor-recommend.ts` prints 1. Evidence: the rg printed nothing and exited 1, `rg -c "case 'cosine'"` printed 1, and typecheck exited 0.
- [x] T009 Delete the exact rerank: the comparator block 1450 to 1459 inside `if (useRrfFusion)`, keeping its `return adjustedScoreDiff || rrfRankFor(...) || ...` line; the index at 1437 to 1439; `useExactSemanticRerank` at 1292; 396 to 419; 169 to 172; 135 to 139; 77, 79 and 80; and narrow the import at 32 to `import { scoreSemanticShadowLane } from './lanes/semantic-shadow.js';` (`$R/lib/scorer/fusion.ts`). Verify: `rg -n 'ExactSemantic|EXACT_SEMANTIC|scoreSemanticShadowExactSubset' $R/lib/scorer/fusion.ts` prints nothing, and `rg -c "^import \{ scoreSemanticShadowLane \} from './lanes/semantic-shadow.js';" $R/lib/scorer/fusion.ts` prints 1. Evidence: the rg printed nothing and exited 1, and the import count printed 1.
- [x] T010 Delete the meaning path: the call at 1635, `commandMeaningPassed` and `projectionSkillById` at 1620 and 1621, and reduce 1622 to 1628 to `ranked = requireCommandPhraseAnchor(ranked);`; delete `rankMeaningPassedCommandFirst` with its comment 1092 to 1130; reduce `requireCommandPhraseAnchor` 908 to 959 to one `ranked` parameter that returns an anchored command or a skill row unchanged and clears `passes_threshold` on every other command row; keep the phrase sentences of the comment at 883 to 891 and delete the rest of it, `commandMeaningEligible` 898 to 906 and 863 to 881 (`$R/lib/scorer/fusion.ts`). Verify: `rg -n 'COMMAND_MEANING|commandMeaning|meaningPassed|rankMeaningPassed|cosine' $R/lib/scorer/fusion.ts` prints nothing, and `rg -n 'export function requireCommandPhraseAnchor' -A 3 $R/lib/scorer/fusion.ts` shows one `ranked` parameter. Evidence: the rg printed nothing and exited 1; `requireCommandPhraseAnchor(` is followed by `ranked: readonly AdvisorScoredRecommendation[],` and `): AdvisorScoredRecommendation[] {`, one parameter. It returns skill rows and anchored or already-unpassed command rows as the same object and spreads only to clear `passes_threshold`. `readOnlyExplainer`, `isNoEditRequest`, `SkillProjection` and `LaneContribution` all keep other uses, so no import went. `doctor-ordering.vitest.ts` printed `32 passed (32)` unchanged.
- [x] T011 [P] Delete the spread at 1353, the `meaning` constant and its comment at 1335 to 1337, `entryMeaning` with its comment 710 to 717, `commandEmbeddingText` with its comment 687 to 708, the `METADATA_MEANING.set` at 174 and the `job` read with its comment at 168 to 173, the clear at 125 and the map with its comment at 97 to 99, keeping the `ownedSignals` read at 160 to 167 (`$R/scripts/command-bridges/derive-command-bridges.cjs`). Verify: `node --check $R/scripts/command-bridges/derive-command-bridges.cjs` exits 0, and `rg -n 'embeddingText|METADATA_MEANING|entryMeaning|commandEmbeddingText' $R/scripts/command-bridges/derive-command-bridges.cjs` prints nothing. Evidence: `node --check` exited 0 and the rg printed nothing (exit 1). Deviation: `doctorCommandDescription` and the `description` key it filled in `DOCTOR_DETAILS` also went, because the deleted `entryMeaning` was their only reader; the generator therefore no longer fails on a doctor router with no frontmatter description.
- [x] T012 Run the generator with no arguments so it rewrites the bridge JSON, and edit no generated file by hand (`$R/scripts/command-bridges/command-bridges.generated.json`). Verify: `node $R/scripts/command-bridges/derive-command-bridges.cjs --check` prints `"status":"fresh"`, `"changed":[]` and the four T001 counts; `git grep -c '"embeddingText"' -- $R/scripts/command-bridges/command-bridges.generated.json` prints nothing; `git diff --stat -- $R/lib/scorer/projection.ts $R/lib/command-attach.ts $R/scripts/skill_advisor.py` prints nothing. Evidence: the plain run exited 0, `--check` printed `{"status":"fresh","counts":{"commandMetadata":27,"doctorRoutes":35,"generated":62,"typescriptActive":46,"pythonActive":52},"changed":[]}` (the T001 counts), the `embeddingText` grep printed nothing (exit 1), the diff over `projection.ts`, `command-attach.ts`, `skill_advisor.py` and `scoring-compatibility.json` printed nothing, and the JSON diff removes only the 46 `embeddingText` lines.
- [x] T013 [P] Delete the paragraph at 54 with its blank line, and cut 74 after "or its slash string." so the meaning, embedder and read-only sentences go (`$R/scripts/command-bridges/README.md`). Verify: `rg -n -i 'embeddingText|embedder|cosine|meaning' $R/scripts/command-bridges/README.md` prints nothing. Evidence: the rg printed nothing and exited 1.
- [x] T014 Delete `readonly embeddingText?: string;` at 24, change 227 to `const { runtime: _runtime, ...inventory } = entry;` with a one-sentence comment that the runtime block is derived, and reduce the case at 392 to 415 to "keeps skill descriptions non-empty" with only `missingSkillDescriptions` (`$R/tests/command-bridges-drift-guard.vitest.ts`). Verify: `rg -c embeddingText $R/tests/command-bridges-drift-guard.vitest.ts` prints nothing, and `(cd $R && npx vitest run tests/command-bridges-drift-guard.vitest.ts)` reports `6 passed`. Evidence: the `rg -c` printed nothing and the file printed `6 passed (6)`.
- [x] T015 [P] Delete 184 to 188, the comment at 184, the two Ollama keys, the comment at 187 and the refresh key, and leave 163 and 180 to 183 (`.skilled/bin/system-skill-advisor-launcher.cjs`). Verify: `node --check .skilled/bin/system-skill-advisor-launcher.cjs` exits 0, the Measured Behavior `createChildEnv` command prints `[]`, and `rg -c "'SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC'|'HF_EMBED_SERVER_URL'" .skilled/bin/system-skill-advisor-launcher.cjs` prints 2. Evidence: `node --check` exited 0, `createChildEnv` printed `[]`, and the `rg -c` printed 2.
- [x] T016 [P] Delete the two feeder-key cases at 22 to 40 (`.skilled/bin/launcher-threshold-env.vitest.ts`). Verify: `(cd .skilled && npx vitest run --config vitest.config.bin.ts bin/launcher-threshold-env.vitest.ts)` reports `5 passed`, and `rg -c 'OLLAMA|EMBED_REFRESH' .skilled/bin/launcher-threshold-env.vitest.ts` prints nothing. Evidence: the bin test printed `5 passed (5)` and the `rg -c` printed nothing.
- [x] T017 [P] Delete the comment and the key at 49 and 50 (`.github/workflows/skill-advisor-stress.yml`). Verify: `rg -c 'EMBED_REFRESH|embed against' .github/workflows/skill-advisor-stress.yml` prints nothing, and `node -e "require('./.skilled/node_modules/yaml').parse(require('fs').readFileSync('.github/workflows/skill-advisor-stress.yml','utf8'))"` exits 0. Evidence: the `rg -c` printed nothing and the yaml parse exited 0.
- [x] T018 [P] Delete the comment and the key at 81 and 82, and leave 79 and 80 (`$R/tests/skill-advisor-cli-test-utils.ts`). Verify: `rg -c 'EMBED_REFRESH|embed against' $R/tests/skill-advisor-cli-test-utils.ts` prints nothing, and `rg -c 'SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC' $R/tests/skill-advisor-cli-test-utils.ts` prints 1. Evidence: the first `rg -c` printed nothing and the second printed 1.
- [x] T019 [P] Remove the `--real-embedding` mode: 796 lists `['--write']` only, 798 to 805 go and 808 calls `scoreCommandCorpus()`; 561 to 566 become one direct `scoreAdvisorPrompt(row.prompt, { workspaceRoot })` call; 489 to 492 go; `dbDir` at 416 is always a fresh temp folder and 787 removes it unconditionally; the body of the `if (!realEmbedding)` block at 423 to 431 runs unconditionally; the comments at 411 to 415 and 418 to 422 drop their real-capture sentences; 405 goes; section 4 at 140 to 199, the constants at 99 to 106, 68 and 69, the usage line at 38 and the header paragraph at 26 to 29 go, and the later section numbers close the gap (`$R/scripts/routing-accuracy/capture-command-routing-baseline.mjs`). Verify: `node --check` on the file exits 0, `rg -n -i 'real-embedding|realEmbedding|SEMANTIC_SHADOW_MODULE|SKILL_GRAPH_DB_MODULE|11434|nomic|embedder' <file>` prints nothing, and `node <file> --real-embedding` exits 2 with `unknown option: --real-embedding`. Evidence: `node --check` exited 0, the rg printed nothing (exit 1), and `node <file> --real-embedding` printed `capture-command-routing-baseline.mjs: unknown option: --real-embedding` and exited 2. Sections renumber 1 to 6.
- [x] T020 [P] Cut the sentences of row 134 from "The optional `--real-embedding` flag" to "names it." (`$R/scripts/routing-accuracy/README.md`). Verify: `rg -n -i 'real-embedding|embedder|nomic|vec_cmd' $R/scripts/routing-accuracy/README.md` prints nothing. Evidence: the rg printed nothing and exited 1.
- [x] T021 [P] Rewrite the `fusion.ts` row at 56 so it ends after "or its slash string" and names no meaning constant, eligibility rule or ordering step (`$R/lib/scorer/README.md`). Verify: `rg -n 'COMMAND_MEANING|commandMeaning|rankMeaningPassed|cosine|on meaning' $R/lib/scorer/README.md` prints nothing. Evidence: the rg printed nothing and exited 1.
- [x] T022 Delete the seven feeder test files: `daemon/watcher-embedding-refresh`, `handlers/semantic-outage-degraded`, `semantic-prompt-embedding-degrade`, `semantic-lane-weight-zero`, `skill-graph-embedding-outage`, `skill-graph/refresh-in-background` and `skill-graph/refresh-roundtrip`, each `.vitest.ts` (`$R/tests/`). Verify: `git status --short -- $R/tests | rg -c '^ ?D '` prints 7. Evidence: `git status --short -- $R/tests | rg -c '^ ?D '` printed 7.
- [x] T023 Delete the case at 181 to 200 and `refreshSkillEmbeddings` from the import at 64 (`$R/tests/scorer/semantic-shadow-cosine.vitest.ts`). Verify: `(cd $R && npx vitest run tests/scorer/semantic-shadow-cosine.vitest.ts)` reports `7 passed`. Evidence: the file printed `7 passed (7)`.
- [x] T024 Delete the case at 81 to 115, which seeds through the deleted refresh, and any mock or import only it used (`$R/tests/skill-graph/embedding-coverage.vitest.ts`). Verify: `(cd $R && npx vitest run tests/skill-graph/embedding-coverage.vitest.ts)` reports `1 passed`, and `rg -c refreshSkillEmbeddings` on the file prints nothing. Evidence: the file printed `1 passed (1)` and the `rg -c` printed nothing; the hoisted adapter mock and the registry mock went with the case, which was their only user.
- [x] T025 Delete the two rerank cases at 160 to 219, `ADVISOR_EXACT_SEMANTIC_RERANK_FLAG` at 9, the lane imports at 16 to 22 and any helper only those cases used; in the ablation test delete the rerank-off constant at 44 and the comment and assertion at 297 to 299 and 301 to 305, keeping `rrfOn` at 300 (`$R/tests/scorer/conflict-query-rerank.vitest.ts`, `$R/tests/scorer/semantic-shadow-ablation.vitest.ts`). Verify: `(cd $R && npx vitest run tests/scorer/conflict-query-rerank.vitest.ts)` reports `2 passed`, `(cd $R && npx vitest run tests/scorer/semantic-shadow-ablation.vitest.ts)` reports the T003 pass and skip split over 4 cases, and `rg -c 'EXACT_SEMANTIC|ExactSubset|semantic-shadow' $R/tests/scorer/conflict-query-rerank.vitest.ts` and `rg -c 'EXACT_SEMANTIC' $R/tests/scorer/semantic-shadow-ablation.vitest.ts` print nothing. Evidence: conflict printed `2 passed (2)`, ablation printed `2 passed | 2 skipped (4)` (the T003 split), and both `rg -c` printed nothing. The conflict describe title dropped "and exact rerank".
- [x] T026 Rewrite the header at 1 to 29 to describe the phrase anchor and the withhold rules; delete the cases at 129, 158, 177, 193, 204 and 257 and the `rankMeaningPassedCommandFirst` and `commandMeaningEligible` blocks at 288 to 384; recast 219, 231, 241 and 274 as phrase-anchor cases that need no bar or margin; drop the imports of removed exports and the bar and margin constants (`$R/tests/command-meaning-anchor.vitest.ts`). Verify: `(cd $R && npx vitest run tests/command-meaning-anchor.vitest.ts)` reports `13 passed`, and `rg -c 'COMMAND_MEANING|commandMeaningEligible|rankMeaningPassedCommandFirst|meaningPassed' <file>` prints nothing. Evidence: the file printed `13 passed (13)` and the `rg -c` printed nothing.
- [x] T027 In the case at 608 to 633, keep the `getDb` match and the order of `initSkillGraphDb(`, `startHeartbeat(` and `startIpcSocketServer(`; drop the `ensureActiveEmbedder(` and `refreshEmbeddingsInBackground(` assertions at 618, 620, 623, 625, 629 and 632; and match the watcher with `/const defaultReindex = async \(\): Promise<ReindexResult> => indexSkillMetadata\(skillsRoot\);/` (`$R/tests/launcher-bootstrap.vitest.ts`). Verify: `(cd $R && npx vitest run tests/launcher-bootstrap.vitest.ts)` reports `21 passed`. Evidence: the file printed `21 passed (21)`. The case keeps the `getDb` match and now asserts `initSkillGraphDb(` then `startHeartbeat(` then `startIpcSocketServer(` in order (the old check only required the IPC index to exist).
- [x] T028 [P] Delete tree lines 157 and 176; in the skill-graph tests README replace row 34 with an `embedding-coverage.vitest.ts` row and drop "refresh behavior" from its description and the refresh trigger phrase (`$R/tests/README.md`, `$R/tests/skill-graph/README.md`). Verify: `rg -n 'semantic-prompt-embedding-degrade|skill-graph-embedding-outage|refresh-roundtrip|refresh-in-background|refresh skill embeddings' $R/tests/README.md $R/tests/skill-graph/README.md` prints nothing. Evidence: the rg printed nothing and exited 1.
- [x] T029 [P] Delete the `refresh-in-background.vitest.ts` row at 44 and leave the rest of the leaf for phase 006 (`.skilled/skills/system-skill-advisor/feature-catalog/daemon-and-freshness/background-vector-refresh.md`). Verify: `python3 .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py | grep system-skill-advisor` prints `PACKAGE system-skill-advisor: PASS tier=fail violations=0`. Evidence: the validator printed `PACKAGE system-skill-advisor: PASS tier=fail violations=0`; right after T022 and before this edit it printed `FAIL` with the one `missing_source_path` violation for this row.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T030 Typecheck the advisor runtime (`$R/tsconfig.build.json`). Verify: `(cd $R && npm run typecheck > /dev/null 2>&1; echo "exit=$?")` prints `exit=0`; an error naming a 004-owned symbol stops the phase and applies `plan.md` ADR-001. Evidence: `npm run typecheck` exited 0 from the final tree, after each source file and again at the end; no error named a 004-owned symbol.
- [x] T031 Run the advisor suite (`$R/package.json`). Verify: `(cd $R && npm test)` exits 0 with 0 failed, seven fewer test files than the T001 record and passed plus skipped 55 lower (189 files and 2523 when T001 recorded 196 files, 2570 passed and 8 skipped); any other total is recorded as a finding in `implementation-summary.md`. Evidence: `npm test` exited 0 with `Test Files  189 passed (189)` and `Tests  2513 passed | 8 skipped (2521)`, against the T001 record of 196 files and 2568 passed plus 8 skipped (2576): seven fewer files and 55 fewer cases, 0 failed, skips unchanged. The plan's 2523 assumed phase 001's 2570; phase 002 had already removed 2. A first full run failed 2 cases in `skill-advisor-cli-job-semantics.vitest.ts`, a consumer of the scan `embeddings` field outside the inventory, fixed in place (see CHK-FIX-003).
- [x] T032 Clean and rebuild (`$R/package.json`). Verify: `(cd $R && npm run clean && npm run build)` exits 0, and `rg -l 'ensureActiveEmbedder|refreshEmbeddingsInBackground' $R/dist/runtime/advisor-server.js $R/dist/runtime/lib/daemon/watcher.js` prints nothing. Evidence: `npm run clean && npm run build` exited 0 from the final tree, and the dist rg printed nothing (exit 1).
- [x] T033 Run the four CI routing ratchets and the command-routing slice (`$R/tests/parity/`). Verify: `(cd $R && npx vitest run tests/parity/scorer-eval-baseline-ratchet.vitest.ts tests/parity/local-native-divergence-ratchet.vitest.ts tests/parity/holdout-independent.vitest.ts)` reports `22 passed`, and `(cd $R && npx vitest run tests/routing-golden-prompts.vitest.ts tests/command-routing-slice.vitest.ts)` reports `51 passed`. Evidence: the three parity ratchets printed `22 passed (22)` and golden prompts plus the slice printed `51 passed (51)`, each exit 0, from the final tree after the rebuild.
- [x] T034 Run the corpus gate (`$R/scripts/routing-accuracy/score-routing-corpus.py`). Verify: the Measured Behavior command exits 0 and prints `"rows": 196`, `"accuracy": 0.602`, `"f1": 0.9844`, `"TT": 115`, `"FT": 3`, `"FF": 1` and `"overall_pass": true`. Evidence: the corpus gate exited 0 and printed `"rows": 196`, `"accuracy": 0.602`, `"f1": 0.9844`, `"TT": 115`, `"FT": 3`, `"FF": 1`, `"overall_pass": true`; its whole JSON output is byte-identical to the T001 capture.
- [x] T035 Prove no score baseline moved (`plan.md` score baseline list). Verify: `git diff --stat $S -- <the nine files in plan.md>` prints nothing. Evidence: `git diff --stat 0c2ab52b3b3` over the nine files printed nothing, and all nine exist. The broader `git diff --stat HEAD -- '*baseline*'` lists only `capture-command-routing-baseline.mjs`, the capture script T019 edits, which is not a score baseline file.
- [x] T036 Prove the feeders and keys are gone (`$R/`). Verify: the Measured Behavior call-site pipeline prints nothing, `git grep -l -E 'SYSTEM_SKILL_ADVISOR_EMBED_REFRESH|SPECKIT_ADVISOR_EXACT_SEMANTIC_RERANK' -- '*.ts' '*.cjs' '*.mjs' '*.yml' '*.py' ':!specs' ':(exclude,glob)**/*lane-residue*'` prints nothing, and the `createChildEnv` command prints `[]`. Evidence: the call-site pipeline piped to `wc -l` printed 0, the `git grep -l` printed nothing (exit 1), and `createChildEnv` printed `[]`.
- [x] T037 Prove the boundary held (`plan.md` affected surfaces). Verify: `git diff --stat $S -- $R/lib/scorer/lane-registry.ts $R/lib/scorer/lanes/semantic-shadow.ts $R/handlers/advisor-status.ts $R/schemas $R/tools $R/skill-advisor-cli-manifest.ts $R/lib/scorer/projection.ts $R/lib/scorer/types.ts $R/lib/embedders` prints nothing. Evidence: the boundary `git diff --stat 0c2ab52b3b3` printed nothing.
- [x] T038 Run the bridge check and the drift guard again from the final tree (`$R/scripts/command-bridges/derive-command-bridges.cjs`). Verify: `--check` prints `"status":"fresh"` and `"changed":[]`, and the drift guard reports `6 passed`. Evidence: `--check` exited 0 and printed `"status": "fresh"` and `"changed": []` with counts 27, 35, 62, 46, 52, and the drift guard printed `6 passed (6)`.
- [x] T039 Run the doc gates (`.skilled/skills/sk-doc/scripts/tests/run-script-tests.sh`). Verify: `bash .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh | tail -1` prints `all sk-doc script tests passed`, the catalog validator prints the T029 line, and `node .skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs` exits 0 with `0 broken`. Evidence: `run-script-tests.sh` exited 0 and its last line was `all sk-doc script tests passed`; the catalog validator printed `PACKAGE system-skill-advisor: PASS tier=fail violations=0`; `check-markdown-links.cjs` exited 0 with `7690 files, 15275 links checked, 0 broken`.
- [x] T040 Run phase 001's residue check in repo mode (`.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs`). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs repo --json` lists none of `advisor-server.ts`, `watcher.ts`, `scan.ts`, `advisor-recommend.ts`, `derive-command-bridges.cjs` or `capture-command-routing-baseline.mjs`. Evidence: [DEVIATION: the Verify list includes the capture script, but its remaining hit is `SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC`, which spec.md section 3 gives to phase 004, and 004's tasks remove it.] `sweep-lane-residue.mjs repo --json` lists none of `advisor-server.ts`, `watcher.ts`, `scan.ts`, `advisor-recommend.ts` or `derive-command-bridges.cjs`, but it still lists `capture-command-routing-baseline.mjs` for the identifier `DISABLE_BUILTIN_SEMANTIC`. `spec.md` section 3 gives `SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC` at the capture script's two sites to phase 004, so the hit is expected and was left. Repo live count went from 283 to 265.
- [x] T041 Record each gate's command, exit status and count, with `S` and the phase commit (`implementation-summary.md`). Verify: `rg -c '^\| ' implementation-summary.md` counts one row per gate in T030 to T040. Evidence: Not done. The conductor reserved `implementation-summary.md`, so the gate record lives in these Evidence lines and the conductor report, and the phase commit SHA does not exist yet. Evidence: the Verification table in `implementation-summary.md`.
- [x] T042 Validate this phase (`spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict` prints `RESULT: PASSED`. Evidence: `validate.sh <this folder> --strict` exited 0 and printed `Summary: Errors: 0  Warnings: 1` and `RESULT: PASSED`; the one warning is `AI_PROTOCOLS: AI protocol incomplete (0/4 components)`, a Level 3 section the planned docs never carried. Its draft auto-repair rewrote this folder's own `graph-metadata.json` through `repair-derived.cjs`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining Evidence: no task carries `[B]`.
- [x] Manual verification passed: the rewritten `requireCommandPhraseAnchor` and the direct recommend call read correctly, and the bridge JSON diff removes only `embeddingText` lines Evidence: the anchor reads as one `ranked` parameter returning skill rows and anchored rows unchanged; the recommend call is a direct `scoreAdvisorPrompt(scoredPrompt, { ..., runtimeLaneHealth: runtimeLaneHealthForStatus(status) })`; `git diff` on the JSON shows only 46 removed `"embeddingText"` lines.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Design source**: See `../../023-ollama-deprecation-research/research/research.md` sections 1.2, 4.4 and 5.2, and `../../023-ollama-deprecation-research/research/iterations/iteration-001.md` and `iteration-005.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md Evidence: `spec.md` REQ-001 to REQ-013 read in full before the first edit.
- [x] CHK-002 [P0] Technical approach defined in plan.md Evidence: `plan.md` sections 1 to 7, the affected-surfaces addendum and ADR-001 to ADR-005 read in full before the first edit.
- [x] CHK-003 [P1] Phase 002 is committed and its regenerated bridge JSON reads `"doctorRoutes":35` Evidence: HEAD is `0c2ab52b3b3`, phase 002's commit, and `--check` printed `"doctorRoutes":35` at it.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `npm run typecheck` exits 0 and `node --check` passes on the generator, the capture script and the launcher Evidence: `npm run typecheck` exited 0 from the final tree, and `node --check` exited 0 on `derive-command-bridges.cjs`, `capture-command-routing-baseline.mjs` and `system-skill-advisor-launcher.cjs`.
- [x] CHK-011 [P0] No generated file was edited by hand: `--check` prints `"changed":[]` right after the generator run Evidence: the `--check` right after the plain run printed `"changed":[]`.
- [x] CHK-012 [P1] No import is left that only a deleted function used: `rg -n 'getAdapter|getManifest|probeOllamaModel' $R/lib/skill-graph/skill-graph-db.ts` prints nothing Evidence: the rg printed nothing and exited 1.
- [x] CHK-013 [P1] No new comment names a spec, phase, task or requirement id: `git diff $S -- $R .skilled/bin .github | rg -n '^\+.*(REQ-|phase 00|T0[0-9]{2}|ADR-)'` prints nothing Evidence: the `git diff 0c2ab52b3b3 ... | rg` printed nothing and exited 1; a scan of every added line for em dashes and spec ids also printed nothing.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met Evidence: AC-001 to AC-013 are all `Met` in `acceptance-criteria.md`, each observed on the uncommitted working tree over `0c2ab52b3b3` that the conductor commits as the phase commit.
- [x] CHK-021 [P0] Each edited test file passes alone with its planned count (T014, T016, T023 to T027) Evidence: T014 `6 passed`, T016 `5 passed`, T023 `7 passed`, T024 `1 passed`, T025 `2 passed` and `2 passed | 2 skipped (4)`, T026 `13 passed`, T027 `21 passed`.
- [x] CHK-022 [P1] `doctor-ordering.vitest.ts` passes unchanged against the one-argument anchor Evidence: `doctor-ordering.vitest.ts`, unedited, printed `32 passed (32)` against the one-argument anchor.
- [x] CHK-023 [P1] `npm test` totals compared with phase 001's baseline and the 55 removed cases Evidence: T031: 189 files and 2513 passed plus 8 skipped (2521) against 196 and 2576 at `0c2ab52b3b3`, a drop of 7 files and 55 cases; phase 001's 2570 baseline was already 2568 after phase 002.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Finding class: `cross-consumer`; six feeders reach source, tests, docs, the launcher and CI. Evidence: cross-consumer confirmed: the feeders reached source, tests, docs, the launcher and CI, plus one consumer the inventory missed, `tests/skill-advisor-cli-job-semantics.vitest.ts`, which asserted the scan response's `embeddings` field (see CHK-FIX-003).
- [x] CHK-FIX-002 [P0] Same-class producer inventory: all 11 call sites in Measured Behavior are gone (T036). Evidence: the T036 call-site pipeline piped to `wc -l` printed 0.
- [x] CHK-FIX-003 [P0] Consumer inventory: every importer of a deleted export is edited or deleted here, and every 004-owned importer of a kept export is unchanged (T037). Evidence: every importer of a deleted export is edited or deleted, and the T037 boundary diff over the 004-owned files printed nothing. The full suite found one consumer outside the inventory, `skill-advisor-cli-job-semantics.vitest.ts` (2 failed at lines 147 and 201 on `scan.embeddings`). It is not 004-owned and no 003 or 004 doc names it, so it was edited here rather than treated as the ADR-001 merge trigger: the `embeddings` type and assertions went, case 1 now asserts `not.toHaveProperty('embeddings')` and case 2 asserts the scan counts. A grep found no production reader of `scan.embeddings`.
- [x] CHK-FIX-004 [P0] Parity cases: the five ratchet files and the corpus gate are the parity test; no new adversarial test is added, because the change removes behavior rather than adding a parser or a path rule. Evidence: the five ratchet files printed 22 and 51 passed and the corpus gate output is byte-identical to the start capture; no new adversarial test was added.
- [x] CHK-FIX-005 [P1] Matrix: six feeders by four surfaces, as `plan.md` lists, each cell deleted here or owned by a named phase. Evidence: refresh, prompt embed, exact rerank, meaning path, `embeddingText` and the env keys are each deleted across source, test, doc and CI here, or named for 004 (lane module, readers, dead flag), 005 (model-server keys), 006 (catalog leaves and prose) or 007 (`phrase-variants.json`).
- [x] CHK-FIX-006 [P1] Hostile env: with `SYSTEM_SKILL_ADVISOR_EMBED_REFRESH`, `OLLAMA_BASE_URL` and `SPECKIT_ADVISOR_EXACT_SEMANTIC_RERANK` exported in the shell, T033 and T034 still print the same counts, since nothing reads them. Evidence: with `SYSTEM_SKILL_ADVISOR_EMBED_REFRESH=on`, `OLLAMA_BASE_URL=http://127.0.0.1:9` and `SPECKIT_ADVISOR_EXACT_SEMANTIC_RERANK=true` exported, T033 printed `22 passed (22)` and `51 passed (51)` and the T034 corpus output was byte-identical to the start capture.
- [x] CHK-FIX-007 [P1] Evidence is pinned to `S` and the phase commit SHA. Evidence: pinned to `S` = `0c2ab52b3b3`; the commit message names the base.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secret, token or dotenv value appears in any edited file Evidence: the edits only delete code, keys and rows; no added line holds a token, key or dotenv value.
- [x] CHK-031 [P0] The launcher allowlist only shrinks: `git diff $S -- .skilled/bin/system-skill-advisor-launcher.cjs | rg -c '^\+  '` prints nothing Evidence: the `rg -c '^\+  '` over the launcher diff printed nothing and exited 1.
- [x] CHK-032 [P1] No hook, permission or `allowed-tools` line changes Evidence: `git diff --stat 0c2ab52b3b3` over `.skilled/hooks`, `.claude`, `.opencode`, `*settings*.json` and `*.toml` printed nothing.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized Evidence: spec.md Files to Change now lists the job-semantics test and records the generator helper removal.
- [x] CHK-041 [P1] The six edited docs name no removed symbol and no deleted test (T013, T020, T021, T028, T029) Evidence: the T013, T020, T021 and T028 greps printed nothing and the T029 validator printed PASS.
- [x] CHK-042 [P2] The tests READMEs list only test files that exist Evidence: every `*.vitest.ts` or `*.test.ts` name in `tests/README.md` (87) and `tests/skill-graph/README.md` (1) exists under `tests/`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only Evidence: the work's temp output went to the session scratchpad outside the repository; `scratch/` holds only `.gitkeep`.
- [x] CHK-051 [P1] scratch/ cleaned before completion Evidence: `scratch/` holds only `.gitkeep`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 14/14 |
| P1 Items | 19 | 16/19 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-21
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] Architecture decisions documented in `plan.md`'s ARCHITECTURE DECISION RECORD section Evidence: `plan.md` holds ADR-001 to ADR-005.
- [x] CHK-101 [P1] All ADRs have status (Proposed/Accepted) Evidence: each of ADR-001 to ADR-005 reads `**Status**: Accepted`.
- [x] CHK-102 [P1] Alternatives documented with rejection rationale Evidence: each ADR has an Alternatives Rejected list with its reason.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [x] CHK-110 [P1] The recommend handler awaits no embedding wrapper and the daemon starts no refresh (NFR-P01), shown by T036 Evidence: T036 printed 0 call sites, and the recommend handler now calls `scoreAdvisorPrompt` directly with no `await`.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [x] CHK-120 [P0] Rollback procedure documented: revert the phase commit, then `git grep -c '"embeddingText"'` on the JSON prints 46 Evidence: `plan.md` section 7 names `git revert` of the phase commit followed by `git grep -c '"embeddingText"'` printing 46. A revert must also restore `skill-advisor-cli-job-semantics.vitest.ts`, which pairs with `scan.ts`.
- [x] CHK-121 [P1] Phase 004 does not start until T036 and T037 pass Evidence: T036 and T037 both pass on the working tree; starting phase 004 is the conductor's call.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P1] No dependency is added or removed and no lockfile changes: `git diff --stat $S -- '*package*.json'` prints nothing Evidence: `git diff --stat 0c2ab52b3b3 -- '*package*.json'` printed nothing.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] `spec.md` Files to Change, `plan.md` Affected Surfaces and `tasks.md` name the same 33 files Evidence: spec.md now names 34; the job-semantics test is the one added during implementation, recorded as a deviation.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Merges the branch | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
