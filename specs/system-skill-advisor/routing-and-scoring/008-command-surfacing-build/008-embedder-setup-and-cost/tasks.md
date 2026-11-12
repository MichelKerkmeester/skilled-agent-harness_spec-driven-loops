---
title: "Tasks: Phase 8: embedder-setup-and-cost"
description: "Ordered single-change tasks, grouped in waves of disjoint files, that measure the embedder's cost, make its state visible, add the plan-first doctor route, bound the prompt embedding and write the install guides."
trigger_phrases:
  - "embedder setup and cost tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 8: embedder-setup-and-cost

<!-- SPECKIT_LEVEL: 2 -->

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

Every command runs from the repository root unless a task says otherwise. `ADV` is `.skilled/skills/system-skill-advisor/runtime`. `DOC` is `.skilled/commands/doctor`. `S` is this packet's `scratch/` folder. `X` is `node .skilled/bin/skill-advisor.cjs`. `E` is `$ADV/scripts/measure-embedder-cost.mjs`. `C` is `$ADV/scripts/routing-accuracy/capture-command-routing-baseline.mjs`. `M` is `jq -c '.metrics.typed_recall_at_1, .attachedMetrics.plain, .metrics.false_offer'`. `P` is `node $ADV/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs | jq -c '[.metrics.full_corpus_top1.correct,.metrics.holdout_top1.correct,.metrics.ambiguity_top1.correct,.metrics.gold_none_false_fire.value]'`. `R` is the phase 002 rollup query over `$ADV/scripts/command-bridges/command-bridges.generated.json`, as `../002-command-inventory-and-risk-metadata/tasks.md` T026 writes it. `D` is `$ADV/scripts/command-bridges/derive-command-bridges.cjs`.

Each task is one change to the files it names, small enough for a worker with a short brief. No task reads holdout prompt text. The captures report holdout counts only. No task installs Ollama, pulls or deletes a model, or starts or stops the server. The values below follow the operator's answers of 2026-11-12 recorded in `spec.md` section 10.

Worker waves. Tasks in one wave touch different files and can run in parallel.
- Wave 0: T001, T002, T003, T004, T005. Read-only setup.
- Wave 1: T006 (`E`), T007 (`semantic-shadow.ts`), T008 (`advisor-tool-schemas.ts`), T009 (route workflow YAML), T010 (`skill-graph-db.ts`).
- Wave 2: T011 (`E`), T012 (`semantic-shadow.ts`), T013 (`advisor-status.ts`), T014 (`_routes.yaml`), T015 (skill-advisor presentation).
- Wave 3: T016 (`E`), T017 (`advisor-status.ts`), T018 (`skill-advisor.md`), T019 (degrade test), T020 (`scoring-compatibility.json` and the files `D` regenerates).
- Wave 4: T021 (`advisor-recommend.ts`), T022 (status test), T023 (`doctor-setup.yaml`), T024 (setup presentation), T025 (`doctor-install.yaml`), T026 (install presentation).
- Wave 5: T027 (degrade test), T028 (route contract test), T029 (install contract test), T030 (`$ADV/scripts/README.md`), T031 (build and scan, no tracked file).
- Then one at a time: T032 to T036, then T037 to T044.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Record the before numbers (`$S/before.txt`). Verify: `node $C | $M` prints `{"correct":24,"total":44}`, tune combined 9 of 45, holdout combined 0 of 44 and `{"count":0,"total":35}`. `node $C --real-embedding | $M` prints tune combined 14 of 45 and holdout combined 2 of 44. `$P` prints `[159,50,20,5]` and `R` prints `{"ask":17,"run":7,"start":20}`.
- [ ] T002 Copy `../004-command-meaning-matching/scratch/hook-latency.mjs` to `$S/hook-latency.mjs` and run it three times (`$S/hook-latency-before-{1,2,3}.json`). Verify: `jq -c '[.n,.medianMs,.p95Ms]'` on each file prints 44 and two numbers.
- [ ] T003 Record whether Ollama keeps loading the model after a client gives up (`$S/cold-after-abort.txt`). Wait until `curl -s localhost:11434/api/ps | jq '.models | length'` prints 0, then run `curl -s -m 0.05 localhost:11434/api/embed -d '{"model":"nomic-embed-text:v1.5","input":"x"}'; sleep 3; curl -s localhost:11434/api/ps | jq -r '.models[].name'`. Verify: the file holds the last command's output and one line saying whether it lists `nomic-embed-text:v1.5`.
- [ ] T004 Save every reader of the semantic lane health and of `disabledReason` (`$S/health-consumers.txt`). Verify: `rg -n "semanticLaneHealth|SemanticLaneHealth|disabledReason" $ADV .skilled/commands/doctor --glob '!**/dist/**' --glob '!**/node_modules/**' > $S/health-consumers.txt` exits 0 and each line is marked `reads`, `writes` or `test`.
- [ ] T005 Confirm phase 005 is merged before any edit to its files (`$ADV/schemas/advisor-tool-schemas.ts`). Verify: `rg -n "ownerSkillId" $ADV/schemas/advisor-tool-schemas.ts` prints at least one line. If it prints nothing, stop and report.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Create `E` with the server section only: read `/api/version`, `/api/tags` (the size of `nomic-embed-text:v1.5`) and `/api/ps` (loaded name, `size`, `size_vram` and `expires_at`) from `OLLAMA_BASE_URL` or `http://127.0.0.1:11434`, read `ps -axo pid,rss,command` for the `ollama serve` row and the model runner row (`llama-server` or `ollama runner`), print one JSON object and exit 2 with `ollama server not answering at <url>` on stderr when `/api/version` fails (`E`). Verify: `node $E | jq -c 'keys'` lists the server keys and exits 0, and `OLLAMA_BASE_URL=http://127.0.0.1:9 node $E` exits 2 and prints that message.
- [ ] T007 In `withSemanticShadowPromptEmbedding`, add `export const PROMPT_EMBEDDING_DEADLINE_MS = 750` and race `adapter.embed([prompt], { inputType: 'query' })` against a timer that rejects with an error named `PromptEmbeddingTimeoutError`. Clear the timer in a `finally`, and attach `.catch(() => undefined)` to the embed promise so a late rejection is never unhandled (`$ADV/lib/scorer/lanes/semantic-shadow.ts`). Verify: `npm --prefix $ADV run typecheck` exits 0, in `$ADV` `npx vitest run tests/scorer` reports 0 failed, and `node $C | $M` prints the T001 numbers.
- [ ] T008 Add two optional fields to the semantic lane health schema. `backend` is an object with `state` in `reachable`, `unreachable`, `model_missing` or `probe_not_implemented` and a nullable `reason` string. `commandVectorCoverage` is an object with non-negative integers `embedded` and `total`. Keep the schema `.strict()` (`$ADV/schemas/advisor-tool-schemas.ts`). Verify: `npm --prefix $ADV run typecheck` exits 0 and `rg -n "commandVectorCoverage|probe_not_implemented" $ADV/schemas/advisor-tool-schemas.ts` prints two lines.
- [ ] T009 Create the route workflow. Phase 1 probes read-only: `command -v ollama`, `/api/version`, `/api/tags` and `X advisor_status --workspace-root "$PWD" --include-semantic-health true --format json --warm-only`. Phase 2 prints the plan through the presentation contract, one line per missing step with its cost from `node $E` or the install guide and its undo. Phase 3 asks for approval and stops with `STATUS=CANCELLED` on anything but approve, or stops with `STATUS=OK` after the plan under `--dry-run`. Phase 4 runs only the approved steps: `ollama pull nomic-embed-text:v1.5` and `ollama serve` in the background, while the Ollama install itself is only printed for the user to run. Phase 5 runs `X skill_graph_scan --trusted --format json`. Phase 6 reruns the probe and renders the result, naming a daemon restart when `activeEmbedder` is null (`DOC/assets/doctor-skill-advisor-embedder.yaml`). Verify: `python3 -c 'import sys,yaml; yaml.safe_load(open(sys.argv[1]))' DOC/assets/doctor-skill-advisor-embedder.yaml` exits 0 and `rg -n "CANCELLED|dry_run|skill_graph_scan" DOC/assets/doctor-skill-advisor-embedder.yaml` prints at least three lines.
- [ ] T010 Export `readCommandEmbeddingSources` unchanged, so status can count the command entries that carry `embeddingText` (`$ADV/lib/skill-graph/skill-graph-db.ts`). Verify: `rg -n "^export function readCommandEmbeddingSources" $ADV/lib/skill-graph/skill-graph-db.ts` prints one line and `npm --prefix $ADV run typecheck` exits 0.
- [x] T011 Add the embedding section to `E`: 30 query embeddings through the shared `OllamaAdapter` from `.skilled/skills/system-spec-kit/shared/dist/embeddings/adapters/ollama.js` with the `nomic-embed-text-v1.5` manifest from `registry.js`, printed as `warm.medianMs` and `warm.p95Ms`. When `/api/ps` listed no model before the first call, record that first call as `cold.firstCallMs` and the `ollama serve` resident memory as `idle.serveRssKb`. Otherwise print `cold: null` with the reason `model already loaded` (`E`). Verify: `node $E | jq -c '.warm, .cold'` prints `n` 30, a median, a p95 and either `null` or a number.
- [ ] T012 In the `catch` of `withSemanticShadowPromptEmbedding`, set `disabledReason` from the error that `adapter.embed` or the deadline raised: `prompt_embedding_model_missing` for `OllamaModelNotLoadedError`, `prompt_embedding_timeout` for `PromptEmbeddingTimeoutError` or `OllamaRequestTimeoutError`, `prompt_embedding_unreachable` for any other `OllamaBackendUnreachableError` and `prompt_embedding_failed` otherwise. Leave the reasons set before the embed (`database_absent`, `adapter_unavailable`, `dim_mismatch`) as they are (`$ADV/lib/scorer/lanes/semantic-shadow.ts`). Verify: `rg -n "prompt_embedding_(model_missing|timeout|unreachable)" $ADV/lib/scorer/lanes/semantic-shadow.ts` prints three lines and in `$ADV` `npx vitest run tests/scorer` reports 0 failed.
- [ ] T013 In `readSemanticLaneHealth`, add `commandVectorCoverage`: `embedded` counts rows of `commandVecTableNameForDim(activeDim)` when that table exists and 0 otherwise, and `total` is `readCommandEmbeddingSources()?.length ?? 0` (`$ADV/handlers/advisor-status.ts`). Verify: `npm --prefix $ADV run typecheck` exits 0 and in `$ADV` `npx vitest run tests/handlers/advisor-status.vitest.ts` reports 0 failed. The live value is checked in T042.
- [ ] T014 Add the route to the manifest after `router-reach`: `command: /doctor:skill-advisor`, `target: embedder`, `yaml: doctor-skill-advisor-embedder.yaml`, `setup_vars: [execution_mode, dry_run]`, `allowed_flags: ["--dry-run"]`, `mutating: mutates`, a `gate3_location` naming the advisor database and the user's Ollama model store, the `cli_commands` T009 runs and three or more `trigger_phrases` of three or more words, such as "set up meaning matching", "install the local embedder" and "ollama is not running for the advisor" (`DOC/_routes.yaml`). Verify: `bash DOC/scripts/route-validate.sh` exits 0.
- [ ] T015 Add the embedder blocks to the presentation contract: the probe dashboard, the plan table with columns step, cost and undo, the approval prompt, the dry-run result and the final result (`DOC/assets/doctor-skill-advisor-presentation.txt`). Verify: `rg -n -i "embedder" DOC/assets/doctor-skill-advisor-presentation.txt` prints at least five lines.
- [x] T016 Add the CLI section to `E`: five `X advisor_recommend` calls with distinct prompts timed end to end, printed as `cli.ms` (all five) and `cli.medianMs` (`E`). Verify: `node $E | jq -c '.cli'` prints five numbers and a median, and `git status --short` shows no change made by the run.
- [ ] T017 In `handleAdvisorStatus`, when `includeSemanticHealth` is set and the active manifest's backend is `ollama`, await `probeOllamaModel(resolveOllamaBaseUrl(), <manifest ollamaName>, 500)` and merge `backend` into `semanticLaneHealth`: `reachable` when available, `model_missing` when the reason says the model is not loaded and `unreachable` otherwise. Set `laneEnabled` to false unless `reachable`. A non-Ollama backend gets `probe_not_implemented`. Keep `readAdvisorStatus` synchronous (`$ADV/handlers/advisor-status.ts`). Verify: `npm --prefix $ADV run typecheck` exits 0 and in `$ADV` `npx vitest run tests/handlers/advisor-status.vitest.ts` reports 0 failed. The live value is checked in T042.
- [ ] T018 Add the `embedder` row to the execution target table and to the `argument-hint` line (`DOC/skill-advisor.md`). Verify: `rg -n "embedder" DOC/skill-advisor.md` prints at least two lines.
- [ ] T019 Create the degrade test with the adapter, the active pointer and the read-only database mocked, and `VITEST` stubbed to `false` inside each case. Six rows: warm answer scored with a cosine, cold answer at 300 ms scored with a cosine, absent server, missing model, an answer that never arrives, which returns inside `PROMPT_EMBEDDING_DEADLINE_MS` plus 100 ms, and a failure that leaves the result equal to the no-embedder result. Each failure row checks its `disabledReason` (`$ADV/tests/semantic-prompt-embedding-degrade.vitest.ts`). Verify: in `$ADV` `npx vitest run tests/semantic-prompt-embedding-degrade.vitest.ts` reports 6 passed.
- [ ] T020 Add the route's activation entry to both the `typescript` and the `python` lists, copying the shape of the `command-doctor-skill-advisor-router-reach` entries, then run `node $D` (`$ADV/scripts/command-bridges/scoring-compatibility.json`). Verify: `node $D --check` prints `"status": "fresh"` and `R` prints `{"ask":17,"run":7,"start":20}`.
- [ ] T021 Add `export function semanticLaneOffWarning(reason: string | null): string[]`, which returns a one-item array holding `semantic_lane_off:<reason>` for a reason and an empty array for null, and call it in `outputWarnings` with `getSemanticShadowRuntimeHealth().disabledReason` read right after the scored call (`$ADV/handlers/advisor-recommend.ts`). Verify: in `$ADV` `npx vitest run tests/handlers` reports 0 failed.
- [ ] T022 Add status cases with fixture databases: `commandVectorCoverage` with and without a `vec_cmd_<dim>` table, and `backend` for reachable, unreachable and model missing with `probeOllamaModel` mocked (`$ADV/tests/handlers/advisor-status.vitest.ts`). Verify: in `$ADV` `npx vitest run tests/handlers/advisor-status.vitest.ts` reports 0 failed and at least five more passed than before.
- [ ] T023 Add the sixth leg after the advisor leg: run `X advisor_status --workspace-root "$PWD" --include-semantic-health true --format json --timeout-ms 1500 --warm-only`. PASS when `laneEnabled` is true and `commandVectorCoverage.embedded` is above 0. DEGRADED otherwise, never FAIL, with repair `/doctor:skill-advisor embedder`. Exit 75 is SKIP, as for the advisor leg. Change "five read-only legs" to "six" in the file (`DOC/assets/doctor-setup.yaml`). Verify: `rg -n "Leg embedder" DOC/assets/doctor-setup.yaml` prints one line and `rg -n "five read-only" DOC/assets/doctor-setup.yaml` prints nothing.
- [ ] T024 Add the `embedder` leg row to the per-leg table and the `/doctor:skill-advisor embedder` row to the target list (`DOC/assets/doctor-setup-presentation.txt`). Verify: `rg -n "skill-advisor embedder" DOC/assets/doctor-setup-presentation.txt` prints at least two lines.
- [ ] T025 In the checklist sentence, insert "5) /doctor:skill-advisor embedder, from inside the target repo, to set up meaning matching for commands. It shows its cost and asks before it pulls the model or starts the server, and a no leaves a phrase-only install" before the `/doctor:setup` step, and renumber that step to 6 (`DOC/assets/doctor-install.yaml`). Verify: `rg -n "5\) /doctor:skill-advisor embedder" DOC/assets/doctor-install.yaml` prints one line and `rg -n "6\) /doctor:setup" DOC/assets/doctor-install.yaml` prints one line.
- [ ] T026 In the printed checklist block, insert step `5) /doctor:skill-advisor embedder   [class]` with the line "Why: sets up meaning matching for commands. It shows the cost and asks before it pulls the model or starts the server. Run it from the target repo." and renumber `/doctor:setup` to step 6 (`DOC/assets/doctor-install-presentation.txt`). Verify: `rg -n "^5\) /doctor:skill-advisor embedder|^6\) /doctor:setup" DOC/assets/doctor-install-presentation.txt` prints two lines.
- [ ] T027 Add a seventh row to the degrade test: `semanticLaneOffWarning` returns `["semantic_lane_off:prompt_embedding_unreachable"]` for that reason and `[]` for null (`$ADV/tests/semantic-prompt-embedding-degrade.vitest.ts`). Verify: in `$ADV` `npx vitest run tests/semantic-prompt-embedding-degrade.vitest.ts` reports 7 passed.
- [ ] T028 Add embedder cases to the route contract test: the route is in the manifest, its YAML stops at an approval before any `ollama pull`, `ollama serve` or `skill_graph_scan`, `--dry-run` stops after the plan and no step installs Ollama (`DOC/scripts/tests/skill-advisor-route-contract.test.cjs`). Verify: `node DOC/scripts/tests/skill-advisor-route-contract.test.cjs` exits 0.
- [ ] T029 Update the install contract test so it expects six steps with `/doctor:skill-advisor embedder` as step 5 and `/doctor:setup` as step 6 (`DOC/scripts/tests/doctor-install-contract.test.cjs`). Verify: `node DOC/scripts/tests/doctor-install-contract.test.cjs` exits 0.
- [ ] T030 Add one entry for `measure-embedder-cost.mjs`: what it reads, that it writes and unloads nothing, its exit 2 and how to take a cold sample (`$ADV/scripts/README.md`). Verify: `rg -n "measure-embedder-cost" $ADV/scripts/README.md` prints at least one line.
- [ ] T031 Build and rescan so the daemon serves the new code and the route's bridge has a vector. Run `npm --prefix $ADV run build`, then `X skill_graph_scan --trusted --format json`. Verify: the scan exits 0 and `sqlite3 -readonly $ADV/database/skill-graph.sqlite 'select count(*) from vec_cmd_768'` prints the same number as `jq '[.entries[] | select(.embeddingText != null)] | length' $ADV/scripts/command-bridges/command-bridges.generated.json`.
- [ ] T032 Run `E` with the model loaded (`$S/cost-warm.json`). Verify: `node $E > $S/cost-warm.json` exits 0 and `jq -c '[.model.sizeBytes, .memory.serveRssKb, .memory.runnerRssKb, .warm.medianMs, .warm.p95Ms, .cli.medianMs]' $S/cost-warm.json` prints six numbers.
- [ ] T033 Run `E` again after the model unloaded on its own (`$S/cost-cold.json`). Wait until `curl -s localhost:11434/api/ps | jq '.models | length'` prints 0, without unloading it by hand. Verify: `jq -c '[.cold.firstCallMs, .idle.serveRssKb]' $S/cost-cold.json` prints two numbers.
- [ ] T034 Add row 5 `/doctor:skill-advisor embedder` to the Step 2 table and renumber `/doctor:setup` to 6. Add a subsection "Meaning Matching for Commands" to section 2 with what a user gains, the cost table from T032 and T033 with the date (disk, idle memory, loaded memory, the 5 minute unload, warm and cold latency), the fact that the step asks before it pulls the model or starts the server and never installs Ollama, and the fact that a no keeps a phrase-only install. Add a troubleshooting row for `semantic_lane_off` (`INSTALL-SKILLED.md`). Verify: `rg -n "meaning matching|skill-advisor embedder|semantic_lane_off" INSTALL-SKILLED.md` prints at least three lines and each number in the table appears in `$S/cost-warm.json` or `$S/cost-cold.json`.
- [ ] T035 Add one line to section 2 saying `/doctor:install` sets up the embedder by default behind a yes, and a subsection to section 12 with the same cost table, the setup route and the fact that `skill_graph_scan` writes the vectors and the database is gitignored (`.skilled/skills/system-skill-advisor/INSTALL-GUIDE.md`). Verify: `rg -n "skill-advisor embedder|vec_cmd" .skilled/skills/system-skill-advisor/INSTALL-GUIDE.md` prints at least two lines.
- [ ] T036 Add one sentence to section 12 saying `includeEmbeddingsHealth` probes the hf-local server only and `includeSemanticHealth` reports the active embedder (`.skilled/skills/system-skill-advisor/INSTALL-GUIDE.md`). Verify: `rg -n "includeEmbeddingsHealth" .skilled/skills/system-skill-advisor/INSTALL-GUIDE.md` prints one line that names hf-local.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T037 Run the typecheck and the suite. Verify: `npm --prefix $ADV run typecheck` exits 0 and `npm --prefix $ADV test` reports 0 failed.
- [ ] T038 Rerun the default capture, the floor and the rollup. Verify: `node $C | $M` prints the T001 numbers, `$P` prints `[159,50,20,5]` and `R` prints `{"ask":17,"run":7,"start":20}`.
- [ ] T039 Rerun the real-embedding capture and the phrase-reach probe (`$S/real-embedding-after.json`). Verify: `node $C --real-embedding > $S/real-embedding-after.json` exits 0, `$M` over it prints tune combined 14 of 45, holdout combined 2 of 44, typed 24 of 44 and false offers 0 of 35, and `node DOC/scripts/doctor-phrase-reach.cjs` exits 0.
- [ ] T040 Run the doctor suites. Verify: `bash DOC/scripts/tests/run-all.sh` reports 0 failed and `bash DOC/scripts/route-validate.sh` exits 0.
- [ ] T041 Run `$S/hook-latency.mjs` three times (`$S/hook-latency-after-{1,2,3}.json`). Verify: the middle median is at most 25 ms over the T002 middle median and the middle p95 at most 40 ms over the T002 middle p95.
- [ ] T042 Run the new setup leg's command once with the server running (`$S/setup-leg.txt`). Verify: `jq -c '.data.semanticLaneHealth | [.laneEnabled, .backend.state, .commandVectorCoverage.embedded > 0]'` over its output prints `[true,"reachable",true]`.
- [ ] T043 Run `/doctor:skill-advisor embedder --dry-run` in a session (`$S/route-dry-run.txt`). Verify: the transcript shows the plan with a cost and an undo per step and `STATUS=OK`, `git status --short` is unchanged and the database's `stat -f %m` is unchanged.
- [ ] T044 Write `implementation-summary.md` and mark each row in `acceptance-criteria.md` with its evidence. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] `$S/cost-warm.json` and `$S/cost-cold.json` hold the numbers the install guides print, and the degrade test reports 7 passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Skill-level embedding owner**: `../../001-semantic-lane-enablement/spec.md`
- **Command vectors**: `../004-command-meaning-matching/implementation-summary.md`
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

A blocked task gets `[B]` and one line naming what blocks it. A route step that runs before the approval blocks the phase.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The before numbers are in `$S/before.txt` (T001).
- [ ] CHK-002 [P0] Phase 005 is merged: `rg -n "ownerSkillId" $ADV/schemas/advisor-tool-schemas.ts` prints a line (T005).
- [x] CHK-003 [P1] The four planning questions have an operator answer. Evidence: 2026-11-12, recorded in `spec.md` section 10.
- [ ] CHK-004 [P1] `$S/cold-after-abort.txt` records whether a load continues after the client gives up (T003).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `npm --prefix $ADV run typecheck` exits 0.
- [ ] CHK-011 [P0] No code comment names a spec path, a phase number or a task id: `rg -n "T0[0-9]{2}|REQ-0|specs/" <changed files>` prints nothing.
- [ ] CHK-012 [P0] No file under `.skilled/skills/system-spec-kit/shared` changed: `git diff --stat -- .skilled/skills/system-spec-kit/shared` prints nothing.
- [ ] CHK-013 [P1] The deadline timer is cleared and the late embed rejection is caught (T007).
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] The degrade test reports 7 passed (T027).
- [ ] CHK-021 [P0] The captures, the floor and the rollup are unchanged (T038, T039).
- [ ] CHK-022 [P0] The route contract test passes and no step runs before the approval (T028).
- [ ] CHK-023 [P1] The hook stays inside the budget (T041).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [ ] CHK-FIX-001 [P0] The gap is class `cross-consumer`: the prompt embedding deadline is set by a shared adapter that the hook budget never sees.
- [ ] CHK-FIX-002 [P0] Every reader of the semantic lane health and of `disabledReason` is listed in `$S/health-consumers.txt` (T004).
- [ ] CHK-FIX-003 [P0] Consumers of `outputWarnings` output are checked: `rg -n "warnings" $ADV/tests/handlers` cases still pass (T037).
- [ ] CHK-FIX-004 [P1] The six matrix rows in `plan.md` are listed in the degrade test header.
- [ ] CHK-FIX-005 [P1] The suite passes with `VITEST` set, and the degrade test stubs it off per case.
- [ ] CHK-FIX-006 [P1] Evidence names the commit it ran on.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] The route runs no `ollama pull`, `ollama serve` or scan before the approval (T028).
- [ ] CHK-031 [P0] No step installs Ollama. The install command is printed only: `rg -n "brew install|curl .*install" DOC/assets/doctor-skill-advisor-embedder.yaml` shows it only inside a print step.
- [ ] CHK-032 [P1] The script and the probe call only `OLLAMA_BASE_URL` or `http://127.0.0.1:11434`.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md` and `implementation-summary.md` state the same deadline and the same answers to the four questions.
- [ ] CHK-041 [P1] Every cost number in `INSTALL-SKILLED.md` and `INSTALL-GUIDE.md` appears in `$S/cost-warm.json` or `$S/cost-cold.json`.
- [ ] CHK-042 [P2] `$ADV/scripts/README.md` names the script and its exit 2.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Timing runs, cost output and transcripts live in `scratch/` only.
- [ ] CHK-051 [P1] `scratch/` holds only the evidence files the summary cites at completion.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 0/13 |
| P1 Items | 12 | 1/12 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-12
<!-- /ANCHOR:summary -->

---
