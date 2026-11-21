---
title: "Tasks: Phase 6: prose-docs-and-changelogs"
description: "Ordered tasks to rename three five-lane files, delete two catalog leaves, rewrite 53 docs and 23 changelog entries, regenerate the advisor leaf manifest, leaf aliases and skill-graph export, write the advisor v2.0.0.0 removal entry and prove every docs gate and routing ratchet unchanged."
trigger_phrases:
  - "prose docs and changelogs tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 6: prose-docs-and-changelogs

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

Commands run from the repository root with `A=.skilled/skills/system-skill-advisor`, `R=$A/runtime`, `K=.skilled/skills/system-spec-kit`, `C=.skilled/changelog/skilled`, `SD=.skilled/skills/sk-doc`, `CL=$SD/sk-create-changelog/scripts`, `F=specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/006-prose-docs-and-changelogs` and `S` set to the start commit T001 records. `hits FILE...` prints each line that matches the residue check's own exported patterns, case-insensitively, then `lines=N`:

```bash
hits() { node --input-type=module -e "import { IDENTIFIER_PATTERN as I, PROSE_PATTERN as P } from './$K/runtime/cli/retrieval/sweep-lane-residue.mjs'; import fs from 'node:fs'; const re = new RegExp(I + '|' + P, 'i'); let n = 0; for (const f of process.argv.slice(1)) fs.readFileSync(f, 'utf8').split('\n').forEach((l, i) => { if (re.test(l)) { n++; console.log(f + ':' + (i + 1)); } }); console.log('lines=' + n);" "$@"; }
```

`LOG23` is the 23 changelog paths in `spec.md`'s Measured Behavior, written to `$F/scratch/changelogs.txt` by T002.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm phase 005 is committed and record its SHA as `S` (`implementation-summary.md`). Verify: `git ls-files $K/shared/embeddings .skilled/bin/hf-model-server.cjs | wc -l` prints 0 and `git status --short | grep -vc '^??'` prints 0; then `node $K/runtime/cli/retrieval/sweep-lane-residue.mjs repo --json` lists no path on `spec.md` section 3's 005 list, every live path is on its 006, 006-changelog, 006-regen, 006-then-008, 007 or 008 lists (written one per line to `$F/scratch/expected-99.txt`; `comm -23` of the sorted live list against it prints nothing), and each 006-list path phase 005 already cleaned is recorded in the summary. The projection is 99 live; fewer is fine, a 005 path or an unlisted path halts the phase. Evidence: HEAD `1f85a9dd6dd` (phase 005 committed); `git ls-files $K/shared/embeddings .skilled/bin/hf-model-server.cjs | wc -l` printed 0; the start repo run printed `live : 100`, `files : 130`, `30 row(s), 30 matched`, exit 1, with no 005-list path live; the one path over the projected 99 was `$SD/scripts/tests/code-folder/baseline-readme-verdicts.json`, matching only through a `specs/` folder string, which the conductor resolved as an allowlist row (T056). [DEVIATION: recorded in this task line and the conductor's report, because implementation-summary.md is conductor-owned and `$F/scratch` must end holding only `.gitkeep`]
- [x] T002 [P] Record the docs gate baselines at `S` and write `LOG23` (`implementation-summary.md`, `$F/scratch/changelogs.txt`). Verify: the summary holds the link check's broken count (`0 broken` expected), `generate-leaf-manifest.cjs --check` for the advisor and spec-kit, `ci-skill-root-metadata.cjs` `failed=0`, the frontmatter guard `violations=0`, `frontmatter-version.mjs gate` exit 0, the catalog and playbook validators' `PASS` lines for the advisor, the mirror check's `PASS` line, `generate-trigger-index.mjs --check` exit 1 with its stale and obsolete counts and paths saved to `$F/scratch/ti-before.txt`, `skill-graph-freshness.cjs --strict` exit 0, and a three-validator row per `LOG23` entry (16 all exit 0, 7 shape exit 1). Evidence: start gates printed `0 broken` (7678 files, 15239 links), `leaf-manifest.json OK` for the advisor and spec-kit, `failed=0`, `violations=0`, gate exit 0, catalog and playbook `PASS` for the advisor, mirror `PASS: 260 mirrors`, trigger index `--check` exit 1 with `stale documents : 66 (65 missing)` and `obsolete paths : 9`, freshness exit 0; the three-validator table over `LOG23` read 16 all exit 0 and 7 shape exit 1. [DEVIATION: recorded in this task line and the conductor's report, because implementation-summary.md is conductor-owned and `$F/scratch` must end holding only `.gitkeep`]
- [x] T003 [P] Record the routing and suite baselines at `S` (`implementation-summary.md`). Verify: the summary holds `(cd $R && npm run typecheck)` exit 0; `(cd $R && npm test)` file and case counts; `(cd $R && npm run test:stress -- --config vitest.stress.config.ts)` file and case counts; `(cd $R && npx vitest run tests/parity/scorer-eval-baseline-ratchet.vitest.ts tests/parity/local-native-divergence-ratchet.vitest.ts tests/parity/holdout-independent.vitest.ts)` passed counts; the routing corpus command in `../003-lane-feeders/spec.md` Measured Behavior with exit 0 and `overall_pass: true`; `(cd $K/runtime && npx vitest run tests/env-reference-drift.vitest.ts)` passed count; `bash .skilled/commands/doctor/scripts/tests/run-all.sh` `7 suite(s) passed, 0 failed`; `bash $SD/scripts/tests/run-script-tests.sh | tail -1` `all sk-doc script tests passed`. Evidence: start runs printed advisor `npm test` 177 files, 2438 passed, 4 skipped; stress 21 files, 65 tests; ratchets 3 files, 22 passed; corpus exit 0 with `overall_pass: true`, 196 rows, accuracy 0.602; `env-reference-drift` 5 passed; `run-all.sh` `7 suite(s) passed, 0 failed`; `all sk-doc script tests passed`. Typecheck exit 0 is the final-tree run (T049). [DEVIATION: recorded in this task line and the conductor's report, because implementation-summary.md is conductor-owned and `$F/scratch` must end holding only `.gitkeep`]
- [x] T004 Record the remote tags and recheck the open release (`$F/scratch/tags-before.txt`). Verify: `git ls-remote --tags origin > $F/scratch/tags-before.txt; wc -l < $F/scratch/tags-before.txt` prints a count, and `git ls-remote --tags origin refs/tags/v4.2.0.0 | wc -l` prints 0; a 1 switches T042 to `plan.md` ADR-004's fallback. Evidence: `git ls-remote --tags origin` wrote 281 lines; `refs/tags/v4.2.0.0` count 0, so ADR-004 applies as written. [DEVIATION: the list sits in the session scratchpad, not `$F/scratch`, which must end holding only `.gitkeep`]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Rename the fusion catalog leaf and rewrite it for four lanes (`$A/feature-catalog/scorer-fusion/five-lane-fusion.md` to `lane-fusion.md`). Verify: `git mv` leaves `git ls-files $A/feature-catalog/scorer-fusion | grep -c lane-fusion.md` at 1; `hits $A/feature-catalog/scorer-fusion/lane-fusion.md` prints `lines=0`; the title reads `Analytical Lane Fusion`; the playbook link at 66 points at `../../manual-testing-playbook/scorer-fusion/lane-fusion.md`. Evidence: line 12 reads `# Analytical Lane Fusion`; line 63 links `../../manual-testing-playbook/scorer-fusion/lane-fusion.md`; `hits` prints `lines=0`. [DEVIATION: renamed with plain `mv` as the brief requires, not `git mv`; `git ls-files` shows the new path once the conductor stages]
- [x] T006 Rename the fusion playbook entry and rewrite it (`$A/manual-testing-playbook/scorer-fusion/five-lane-fusion.md` to `lane-fusion.md`). Verify: `hits` on the new path prints `lines=0`; the title reads `SC-001 Analytical Lane Fusion`; the 47 command has no status flag; the four `semantic_shadow` expectations (63 to 67) and failure rows 76 and 77 are gone; the feature link at 85 resolves. Evidence: line 19 reads `# SC-001 Analytical Lane Fusion`; the status command carries no `--include-semantic-health`; the feature link on line 78 resolves (link check `0 broken`); `hits` prints `lines=0`. [DEVIATION: plain `mv`, staged by the conductor]
- [x] T007 Rename the fusion stress test and drop "five-lane" from its two strings (`$R/stress-test/skill-advisor/five-lane-fusion-stress.vitest.ts` to `lane-fusion-stress.vitest.ts`). Verify: `(cd $R && SPECKIT_RUN_STRESS=true npx vitest run --config vitest.stress.config.ts stress-test/skill-advisor/lane-fusion-stress.vitest.ts)` passes with T003's case count for the file, and `grep -c -i five-lane` on it prints 0. Evidence: the verbose stress run lists `stress-test/skill-advisor/lane-fusion-stress.vitest.ts` with its 3 cases passing; `grep -c -i five-lane` prints 0. [DEVIATION: plain `mv`; the `MODULE:` header comment also changed to `Lane Fusion Stress Test`; the prompt fixture text `five lane fusion` stays as test data]
- [x] T008 [P] Point every catalog referrer at the renamed leaf (`$A/feature-catalog/auto-indexing/df-idf-corpus.md` 53, `doc-frontmatter-harvest.md` 60, `provenance-and-trust-lanes.md` 72, `lifecycle-routing/age-haircut.md` 52, `scorer-fusion/ablation.md` 52, `ambiguity.md` 60, `attribution.md` 57, `executor-delegation.md` 73, `projection.md` 67, `weights-config.md` 45, 57). Verify: `git grep -n five-lane-fusion -- $A/feature-catalog` prints nothing. Evidence: `git grep -n five-lane-fusion -- $A/feature-catalog` printed nothing, exit 1.
- [x] T009 [P] Point every playbook and stress README referrer at the renamed files (`$A/manual-testing-playbook/lifecycle-routing/age-haircut.md` 85, `manual-testing-playbook.md` 277 and its SC-001 row, `scorer-fusion/ablation.md` 97, `lane-attribution.md` 202, `projection.md` 90, `$R/stress-test/skill-advisor/README.md` 55, 101). Verify: `git grep -n five-lane -- $A/manual-testing-playbook $R/stress-test` prints nothing. Evidence: `grep -rn five-lane $A/manual-testing-playbook $R/stress-test` printed nothing, exit 1 (run on disk, since the renamed files are not staged yet).
- [x] T010 Delete the two lane-only leaves and their index rows and inbound sentences (`$A/feature-catalog/daemon-and-freshness/background-vector-refresh.md`, `scorer-fusion/command-meaning-matching.md`, `feature-catalog.md`, `doctor-command-routing.md` 31, `pasted-reply-stripping.md` 52, 53). Verify: `git grep -n -E 'background-vector-refresh|command-meaning-matching' -- $A ':!$A/leaf-*.json'` prints nothing; `grep -c '47 features' $A/feature-catalog/feature-catalog.md` prints 1; the group rows read 7 and 9; `hits $A/feature-catalog/feature-catalog.md` prints `lines=0`. Evidence: the `git grep` printed nothing, exit 1; `grep -c '47 features'` prints 1; rows read `daemon-and-freshness ... | 7 |` and `scorer-fusion ... | 9 |`; both leaves are gone from disk; `hits` prints `lines=0`.
- [x] T011 Regenerate the advisor leaf manifest and aliases after T005 to T010, the last tasks that add, rename or delete a leaf under `feature-catalog/`, `hooks/`, `manual-testing-playbook/` or `references/`; the new changelog entry is not a leaf (`$A/leaf-manifest.json`, `$A/leaf-aliases.json`). Verify: `node $SD/sk-create-skill/scripts/ci-skill-root-metadata.cjs --fix --skill system-skill-advisor` exits 0; `node $SD/sk-create-skill/scripts/generate-leaf-manifest.cjs --check $A` prints `leaf-manifest.json OK`; `hits $A/leaf-manifest.json $A/leaf-aliases.json` prints `lines=0`. Evidence: `ci-skill-root-metadata.cjs --fix --skill system-skill-advisor` printed `checked=1 passed=1 failed=0 fixed=1`; `--check` prints `leaf-manifest.json OK (e0bbdbb30bed39d874680e4a1cb96f4ca471d9df2701933adeb867a4505f9624)`, exit 0; `hits` on both prints `lines=0`.
- [x] T012 [P] Rewrite the advisor README for four lanes and no status flag (`$A/README.md` 38, 46, 48, 90, 92, 113). Verify: `hits $A/README.md` prints `lines=0`. Evidence: `hits $A/README.md` prints `lines=0`.
- [x] T013 [P] Rewrite the advisor architecture doc (`$A/ARCHITECTURE.md` 22, 79, 126, 130, 160). Verify: `hits $A/ARCHITECTURE.md` prints `lines=0`. Evidence: `hits $A/ARCHITECTURE.md` prints `lines=0`.
- [x] T014 [P] Rewrite the advisor skill line 111 (`$A/SKILL.md`). Verify: `hits $A/SKILL.md` prints `lines=0`, and `node $K/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check | tail -1` prints `PASS`. Evidence: `hits $A/SKILL.md` prints `lines=0`; mirror check prints `PASS: 260 mirrors across 10 trees are in sync.` [DEVIATION: the `semantic-lane` keyword, a leftover the patterns miss, was also removed]
- [x] T015 Drop the "five-lane" keyword from the scorer intent (`$A/ROUTER.md` 42, 175). Verify: `grep -c -i five-lane $A/ROUTER.md` prints 0, and both lines still hold `"lane fusion"`. Evidence: `grep -c -i five-lane $A/ROUTER.md` prints 0; `grep -c '"lane fusion"'` prints 2.
- [x] T016 Delete the four lane phrases from the advisor's intent signals (`$A/graph-metadata.json` 106, 107, 114, 115). Verify: `node -e "const g=require('./$A/graph-metadata.json');const s=JSON.stringify(g);console.log(['vector coverage','semantic lane','background vector refresh','vector refresh'].filter((p)=>s.includes(p)).length)"` prints 0, and `hits $A/graph-metadata.json` prints `lines=0`. Evidence: the `node -e` check prints 0; `hits` prints `lines=0`.
- [x] T017 Regenerate the skill-graph export after T016 (`$R/scripts/skill-graph.json`). Verify: `python3 $R/scripts/skill_graph_compiler.py --export-json` exits 0; `node .skilled/commands/doctor/scripts/skill-graph-freshness.cjs --strict` exits 0 and prints `SIGNAL DRIFT compiled vs disk: none`; `git diff --name-only | grep -c skill-graph.json` prints 1; `hits $R/scripts/skill-graph.json` prints `lines=0`. Evidence: `--export-json` exit 0; freshness exit 0 with `SIGNAL DRIFT compiled vs disk: none`; `git diff --name-only | grep -c skill-graph.json` prints 1; `hits` prints `lines=0`.
- [x] T018 Run the routing gate right after T017 (`$R/tests/parity/`). Verify: the three ratchet files print T003's passed counts and the routing corpus command exits 0 with `overall_pass: true`; `git diff --stat $S -- $R/scripts/routing-accuracy $R/tests/parity/fixtures` prints nothing. A move halts the phase; nothing is recaptured. Evidence: ratchets 3 files, 22 passed (start 22); golden and slice 51 passed; corpus exit 0, `overall_pass: true`, accuracy 0.602; `git diff --stat` on the routing-accuracy folder and parity fixtures printed nothing.
- [x] T019 [P] Rewrite the status, lifecycle and watcher leaves (`$A/feature-catalog/cli-surface/advisor-status.md` 23, 31, 33, `daemon-and-freshness/lifecycle.md` 28, `watcher.md` 22). Verify: `hits` on the three prints `lines=0`. Evidence: `hits` on the three prints `lines=0`. [DEVIATION: the `advisor-status.md` frontmatter description and its `semanticLaneHealth` trigger phrase were also rewritten]
- [x] T020 [P] Rewrite the routing and fusion leaves (`$A/feature-catalog/lifecycle-routing/age-haircut.md` 22, `archive-handling.md` 26, `scorer-fusion/ablation.md` 24, `attribution.md` 23, `weights-config.md` 22, 24). Verify: `hits` on the five prints `lines=0`. Evidence: `hits` on the five prints `lines=0`. [DEVIATION: `attribution.md`'s non-pattern `semantic_similarity` reason was also removed]
- [x] T021 [P] Rewrite the daemon playbooks (`$A/manual-testing-playbook/auto-update-daemon/daemon-lifecycle-shutdown.md` 71, 107, `watcher-narrow-scope.md` 87). Verify: `hits` on both prints `lines=0`. Evidence: `hits` on both prints `lines=0`.
- [x] T022 [P] Rewrite the age haircut playbook (`$A/manual-testing-playbook/lifecycle-routing/age-haircut.md` 3, 19, 26, 56). Verify: `hits` prints `lines=0` and the frontmatter description names four lanes without a count. Evidence: `hits` prints `lines=0`; the description reads `...applied only to the derived lane, not to author, lexical or graph_causal lanes.` with no count.
- [x] T023 [P] Rewrite the status playbooks without the status flag (`$A/manual-testing-playbook/native-cli-tools/native-status-transitions.md` 51, 77, `operator-h5/degraded-daemon.md` 44, 53, 61, 62, 115, 181). Verify: `hits` on both prints `lines=0` and `grep -c include-semantic-health` on both prints 0. Evidence: `hits` on both prints `lines=0`; `grep -c include-semantic-health` prints 0 on both. [DEVIATION: two recorded evidence JSON keys in `degraded-daemon.md` were removed per the plan]
- [x] T024 [P] Rewrite the fusion playbooks (`$A/manual-testing-playbook/scorer-fusion/ablation.md` 58, 59, `lane-attribution.md` 58, 59, 70, 104). Verify: `hits` on both prints `lines=0`, and the expected JSON shows four lane keys. Evidence: `hits` on both prints `lines=0`; the expected JSON shows four lane keys.
- [x] T025 [P] Drop the dead model-server flag from the fallback playbook (`$A/manual-testing-playbook/compat-and-disable/daemon-absent-fallback.md` 48, 55, 88). Verify: `grep -c SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED` on it prints 0, and the scenario's numbered steps still run in order. Evidence: `grep -c SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED` prints 0; the steps still run in order.
- [x] T026 [P] Rewrite the scorer and tuning references (`$A/references/scoring/advisor-scorer.md` 3, 25, 47, 55, 65, 79 to 83, `lane-weight-tuning.md` 58, 79, 161, `validation-baselines.md` 147). Verify: `hits` on the three prints `lines=0`, and `grep -c lane-weight-sweep $A/references/scoring/lane-weight-tuning.md` prints 0. Evidence: `hits` on the three prints `lines=0`; `grep -c lane-weight-sweep` prints 0. [DEVIATION: the `lane-registry.ts` citation in `advisor-scorer.md` was corrected to `lane-registry.ts:8-18`]
- [x] T027 [P] Rewrite the freshness, lease and path policy references (`$A/references/runtime/freshness-contract.md` 146, `daemon-lease-contract.md` 138, `$A/references/config/db-path-policy.md` 89, 90, 94 to 98). Verify: `hits` on the three prints `lines=0`, and `grep -c MEMORY_DB_PATH $A/references/config/db-path-policy.md` prints 0. Evidence: `hits` on the three prints `lines=0`; `grep -c MEMORY_DB_PATH $A/references/config/db-path-policy.md` prints 0.
- [x] T028 List each environment variable the env docs name and whether anything still reads it (`$F/scratch/env-readers.txt`). Verify: for every name in `.env.example` section 7, 96, 409, 411 and `ENV-REFERENCE.md` 166 to 174, 188, 293 to 360, 391 to 396 and 447 to 458, `git grep -l -w <name> -- ':!specs' ':!*.md' ':!.env.example' ':!**/sweep-lane-residue*' ':!**/lane-residue-allowlist.json'` is recorded; a name with a reader is rewritten, never deleted (`plan.md` ADR-008). Evidence: each name was checked with the task's `git grep -l -w`; names whose only readers are tests or fixtures count as unread under ADR-008. [DEVIATION: the list sits in the session scratchpad, not `$F/scratch`; the `.env.example` launcher RSS watchdog and crash-loop rows were also deleted under ADR-008, beyond the listed lines]
- [x] T029 Rewrite the environment template (`.env.example`). Verify: `hits .env.example` prints `lines=0`; `grep -c -E '^# 7\. EMBEDDING|MEMORY_DB_PATH' .env.example` prints 0; the section numbers that follow still read in order. Evidence: `hits .env.example` prints `lines=0`; the `grep -c` prints 0; section headings read 1 to 6 then 8 to 19 in ascending order (the gap at 15 was there before); `env-secret.cjs validate` reported ok.
- [x] T030 Rewrite the spec-kit environment reference (`$K/runtime/ENV-REFERENCE.md`). Verify: `hits $K/runtime/ENV-REFERENCE.md` prints `lines=0`; the lane weights rows show four keys; `(cd $K/runtime && npx vitest run tests/env-reference-drift.vitest.ts)` passes with T003's count. Evidence: `hits` prints `lines=0`; lines 317 and 318 show four lane keys; `env-reference-drift.vitest.ts` 5 passed (start 5); `validate_document.py` VALID with the start's one numbering warning.
- [x] T031 Rewrite the spec-kit environment variables reference (`$K/references/config/environment-variables.md` 38, 43, 59 to 92, 133 to 136). Verify: `hits` on it prints `lines=0` and `grep -c MEMORY_DB_PATH` on it prints 0. Evidence: `hits` prints `lines=0`; `grep -c MEMORY_DB_PATH` prints 0; `validate_document.py` VALID, 0 issues.
- [x] T032 [P] Rewrite the spec-kit architecture, core and shared READMEs (`$K/ARCHITECTURE.md` 160, 200, `$K/runtime/core/README.md` 20, `$K/shared/README.md` 159, 226). Verify: `hits` on the three prints `lines=0`; `grep -n MEMORY_DB_PATH` on them prints at most the shared README table row, and only when `grep -c MEMORY_DB_PATH $K/shared/scripts/env-reader-table.mjs` prints 1 (recorded in the summary); `node $K/shared/scripts/env-reader-table.mjs --check` still prints `README configuration table matches the code.` Evidence: `hits` on the three prints `lines=0`; `grep -n MEMORY_DB_PATH` on them prints nothing; `grep -c MEMORY_DB_PATH $K/shared/scripts/env-reader-table.mjs` prints 0; `env-reader-table.mjs --check` prints `README configuration table matches the code.` [DEVIATION: the retired ADR-007 row of `$K/ARCHITECTURE.md` was deleted rather than reworded, as the table already omits retired ADR-003 and ADR-004, so no added line names a decision id]
- [x] T033 [P] Rewrite the spec-kit sweeper lines, keeping the kept guard (`$K/feature-catalog/feature-catalog.md` 370, `$K/feature-catalog/tooling-and-scripts/orphan-mcp-sweeper-and-launchagent-template.md` 37). Verify: `hits $K/feature-catalog/feature-catalog.md` prints `lines=0`; `hits` on the sweeper leaf prints only its "preserves Ollama" guard line and its cited spec path line. Evidence: `hits $K/feature-catalog/feature-catalog.md` prints `lines=0`; `hits` on the sweeper leaf prints only lines 37 (the preserves-Ollama guard) and 66 (a cited spec path).
- [x] T034 [P] Rewrite the two spec-kit playbooks (`$K/manual-testing-playbook/tooling-and-scripts/session-capturing-pipeline-quality-coverage.md` 100, `ux-hooks/cli-hook-transport-down-fail-open.md` 48, 83). Verify: `hits` on the first prints `lines=0`, and `grep -c SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED` on the second prints 0. Evidence: `hits` on the first prints `lines=0`; `grep -c SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED` on the second prints 0.
- [x] T035 [P] Rewrite the root README (`README.md` 26, 204). Verify: `hits README.md` prints `lines=0`. Evidence: `hits README.md` prints `lines=0`; `validate_document.py` exit 0.
- [x] T036 [P] Rewrite the three `/create:command` assets (`.skilled/commands/create/assets/create-command-auto.yaml` 472, `create-command-confirm.yaml` 484, `create-command-presentation.txt` 168). Verify: `hits` on the three prints `lines=0`, and `node -e "const y=require('./$K/node_modules/js-yaml');const fs=require('fs');for(const f of process.argv.slice(1))y.load(fs.readFileSync(f,'utf8'));console.log('yaml ok')" .skilled/commands/create/assets/create-command-auto.yaml .skilled/commands/create/assets/create-command-confirm.yaml` prints `yaml ok`. Evidence: `hits` on the three prints `lines=0`; the js-yaml check prints `yaml ok`.
- [x] T037 [P] Replace the deleted interface examples in the sk-code TypeScript guide (`.skilled/skills/sk-code/sk-code-skilled/references/typescript/style-guide/overview-strict-and-naming.md` 192 to 205, `quick-reference/template-naming-and-types.md` 162, `style-guide/formatting-imports-and-coexistence.md` 185). Verify: `git grep -n -E 'IEmbeddingProvider|IVectorStore|EmbeddingProfile' -- .skilled/skills/sk-code` prints nothing, and the import example names a type that `grep -n 'export' $K/shared/types.ts` lists. Evidence: the `git grep` printed nothing, exit 1; the import example names `TriggerPhrase`, exported at `$K/shared/types.ts:88`.
- [x] T038 Rewrite the eight tagged framework entries with the glossary (`$C/v3+/v3.1.2.0.md`, `v3.4.0.0.md`, `v3.4.1.0.md`, `v3.5.0.0.md`, `v3.5.0.3.md`, `v3.6.0.0.md`, `$C/v4.0.0.0.md`, `v4.1.0.0.md`). Verify: `hits` on the eight prints `lines=0`; `v4.1.0.0.md`'s renamed anchor and its glance link match. Evidence: `hits` on the eight prints `lines=0`; `v4.1.0.0.md` anchor `c-local-model-server-off-the-advisor-prompt-path` matches its glance link (T041 `dangling=0`); shape results equal the start (v3.4.0.0 and v3.6.0.0 fail as before); after review, `v3.5.0.0.md`'s pointer names its subject (`The embedding provider setting was removed in system-skill-advisor v2.0.0.0.`) and `v4.1.0.0.md`'s turn-it-back-on step carries `(removed in system-skill-advisor v2.0.0.0)`.
- [x] T039 Rewrite the six advisor component entries (`$A/changelog/v0.2.0.0.md`, `v0.11.0.0.md`, `v0.17.6.0.md`, `v1.0.0.0.md`, `v1.2.0.0.md`, `v1.3.0.0.md`). Verify: `hits` on the six prints `lines=0`; `v1.0.0.0.md`'s two renamed anchors and their glance links match; the `v1.2.0.0.md` and `v1.3.0.0.md` titles and trigger phrases hold no residue term. Evidence: `hits` on the six prints `lines=0`; `v1.0.0.0.md` anchors `c-how-a-paraphrase-match-passes` and `c-no-embedding-provider-no-change` match their glance links; the v1.2.0.0 and v1.3.0.0 titles and trigger phrases hold no residue term; after review `v1.2.0.0.md`'s turn-it-back-on step carries `(removed in system-skill-advisor v2.0.0.0)` and one matched sentence is split, so it now passes shape (start: fail at 10.3), and `v1.3.0.0.md`'s mean is 11.1 (start 11.3).
- [x] T040 [P] Rewrite the sk-doc, doctor and spec-kit component entries (`$SD/changelog/v1.6.0.0.md`, `.skilled/skills/system-skilled-doctor/changelog/v1.1.7.0.md`, `$K/changelog/v0+/v0.2.10.0.md`, `v0.2.21.0.md`, `v1+/v1.4.2.0.md`, `v1.7.0.0.md`, `$K/changelog/v2.0.0.0.md`, `v2.12.12.0.md`). Verify: `hits` on the eight prints `lines=0`. Evidence: `hits` on the eight prints `lines=0`; `v1.7.0.0.md` keeps the model's version as `version 1.5 of the embedding model`.
- [x] T041 Audit the 22 rewritten entries for kept facts (`LOG23` without `$C/v4.2.0.0.md`). Verify: a filter over `git diff -U0 $S -- <the 22>` prints `unexpected=0`, counting each removed line that neither matches the patterns at `S`, holds `<a id=` or `](#c-`, nor sits in an upgrade step or frontmatter line; and for each entry every `](#c-...)` link has a matching `<a id="c-...">` in the same file (`dangling=0`). Evidence: the filter printed `files=23 removedLines=127 unexpected=0 dangling=0`, with `v4.2.0.0.md` exempt from the line rule; a numeric-token diff shows no number lost outside `v4.2.0.0.md`, and three pointer lines gained `2.0.0.0`.
- [x] T042 Fold the removal into the open framework entry (`$C/v4.2.0.0.md`, `plan.md` ADR-004). Verify: T004 printed 0; `hits $C/v4.2.0.0.md` prints `lines=0`; the Skill Advisor section holds one removal item whose anchor its glance row links; the description, opening, important box, trigger phrases and Skill Advisor upgrade group name no deleted setting; the spec-folder list is unchanged. Evidence: T004 printed 0; `hits` prints `lines=0`; one Skill Advisor item, anchor `c-the-advisor-drops-its-embedding-lane`, is linked by its glance row and important-box lines 7 to 11 (box now reads `Eleven changes`, listing every advisor break the new entry lists, including `advisor_status --include-embeddings-health`, which the CLI refused with `"exitCode": 64` when run in this worktree); description, opening, trigger phrase `advisor embedding lane removed`, Why This Release and the Skill Advisor upgrade group name no deleted setting; the spec-folder list is unchanged; shape PASS, `validate_document.py` VALID, `hvr_scan.py` exit 0 with the start's 12 comma candidates. The Smaller fixes bullet about the removed lane was dropped as untrue; no file links the old anchors (`git grep` over the repo outside `specs/` printed nothing). [DEVIATION: How It Was Checked rows changed beyond ADR-004's list because the removal made them untrue: the advisor runtime suite now reads 2,438 passed, 4 skipped and the Python scorer 123 passed (`Summary: pass=123, fail=0`), both this tree's runs, and the ablation row reads with and without the embedding lane, numbers unchanged]
- [x] T043 Write the removal entry and raise the advisor version (`$A/changelog/v2.0.0.0.md`, `$A/SKILL.md`, `plan.md` ADR-003). Verify: the `sk-create-changelog` workflow resolves `system-skill-advisor` as primary and reports `system-spec-kit` and `system-skilled-doctor` as candidates; `hits $A/changelog/v2.0.0.0.md` prints `lines=0`; `python3 $CL/check_changelog_shape.py`, `python3 $SD/shared/scripts/validate_document.py` and `python3 $SD/sk-create-with-human-voice/scripts/hvr_scan.py` each exit 0 on it; `grep -n '^version' $A/SKILL.md` prints `5:version: 2.0.0.0`; every number under How It Was Checked appears in T018 or T045 output. Evidence: `system-skill-advisor` resolved as primary through the `.skilled/changelog/system-skill-advisor` link; latest local and `origin/main` entry v1.3.0.0, major bump to v2.0.0.0; `system-spec-kit` and `system-skilled-doctor` reported as candidates, not written; `hits` prints `lines=0`; shape, `validate_document.py` and `hvr_scan.py` exit 0; `grep -n '^version' $A/SKILL.md` prints `5:version: 2.0.0.0`; every path it names exists; its numbers come from this phase's own runs (T049, T050); every break has a `[!WARNING]` box; the box lists five breaks, both retired status flags among them (`--include-semantic-health` and `--include-embeddings-health` each returned `"exitCode": 64` from the CLI), and the upgrade steps add `npm ci` in `$R` and `$K` because the transformers package left both manifests. [DEVIATION: ADR-003 says the old weights key is refused; the registry ignores it (observed with a removed-lane key in `SPECKIT_ADVISOR_LANE_WEIGHTS_JSON`), so the entry says ignored]
- [x] T044 Run the three changelog validators on `LOG23` (`$F/scratch/changelogs.txt`). Verify: the 16 entries that passed `check_changelog_shape.py` at T002 still exit 0, and `validate_document.py` and `hvr_scan.py` exit 0 on all 23. Evidence: the three-validator table over `LOG23` differs from the start only where `v1.2.0.0.md` moved from shape fail to pass: 17 pass all three, 6 fail shape only, `validate_document.py` and `hvr_scan.py` exit 0 on all 23.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T045 Run the residue check in repo mode (`$K/runtime/cli/retrieval/sweep-lane-residue.mjs`). Verify: `node $K/runtime/cli/retrieval/sweep-lane-residue.mjs repo --json` exits 1 and its `live` paths equal `spec.md` section 3's 007, 008 and 006-then-008 lists (20 paths written to `$F/scratch/expected-20.txt` from section 3; a sorted `diff` prints nothing); its `counts.allowlistRows` equals T001's; `$A/changelog/v2.0.0.0.md` appears in neither `live` nor `allowlisted`. Evidence: `repo --json` exit 1, `live` 5: `$R/scripts/routing-accuracy/scorer-eval-baseline.json`, `corpus-manifest.json`, `generation-diagnostics.json`, `phrase-variants.json`, `trigger-index.json`; `allowlistRows` 46 (30 plus 16), 46 matched, `unusedAllowlistRows` empty; `$A/changelog/v2.0.0.0.md` is untracked, and `hits` over every untracked `.skilled` file prints only allowlisted lines, so it stays out of `live` once staged. [DEVIATION: conductor decision moved the non-lane allowlist rows into this phase, so live is 5, not 20]
- [x] T046 Prove the renames and deletions (REQ-004, REQ-005). Verify: `git ls-files | grep -c five-lane` prints 0; `git grep -l five-lane-fusion -- ':!specs'` prints only `$K/runtime/data/trigger-index.json` and `$K/runtime/cli/retrieval/fixtures/corpus-manifest.json`; `git grep -n -E 'background-vector-refresh|command-meaning-matching' -- .skilled ':!**/trigger-index.json' ':!**/corpus-manifest.json' ':!**/generation-diagnostics.json' ':!**/phrase-variants.json'` prints nothing. Evidence: after staging, `git ls-files | grep -c five-lane` prints 0 and `git grep -l five-lane-fusion -- ':!specs'` prints only the trigger index and the corpus manifest.
- [x] T047 Prove the non-vocabulary leftovers gone (REQ-009). Verify: `git grep -n -E 'MEMORY_DB_PATH|lane-weight-sweep|SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED|include-semantic-health|IEmbeddingProvider|IVectorStore|EmbeddingProfile|hf-model server' -- '*.md' '.env.example' ':!specs' ':!**/changelog/**'` prints only `$K/shared/tests/README.md`'s `config.test.ts` row and the shared README table row T032 recorded. Evidence: the grep prints only `$K/shared/tests/README.md:32`, the `config.test.ts` row; no shared README table row, since `env-reader-table.mjs` holds no `MEMORY_DB_PATH`.
- [x] T048 Rerun the docs gates (REQ-006). Verify: `node $K/runtime/cli/check-markdown-links.cjs` exits 0 with `0 broken`; `generate-leaf-manifest.cjs --check` prints `OK` for `$A` and `$K`; `ci-skill-root-metadata.cjs | tail -1` prints `failed=0`; `bash $R/scripts/check-skill-doc-frontmatter.sh . --coverage | tail -1` prints `violations=0`; `node $SD/shared/scripts/frontmatter-version.mjs gate` exits 0 and `node $SD/shared/scripts/frontmatter-version.mjs bump --check --base $S` exits 0 after the commit; the catalog and playbook validators print `PASS` for `system-skill-advisor` with 0 violations; the mirror check prints `PASS`. Evidence: the conductor's rerun: link check 0 broken, leaf manifests OK for the advisor and spec-kit; the builder's run: root metadata failed=0, frontmatter violations=0, version gate exit 0, catalog and playbook PASS, mirrors in sync. The commit hook raises the changed doc versions, so `bump --check --base` runs on the commit.
- [x] T049 Rerun the routing and suite gates (REQ-007, REQ-008). Verify: T018's commands print the same counts from the final tree; `skill-graph-freshness.cjs --strict` exits 0; `(cd $R && npm run typecheck)` exits 0; `(cd $R && npm test)` prints T003's counts with 0 failed; the stress command prints T003's counts and lists `lane-fusion-stress.vitest.ts`; `env-reference-drift.vitest.ts` passes. Evidence: ratchets 22, golden and slice 51, corpus 0.602 with `overall_pass: true`, all equal to T003; freshness exit 0, `SIGNAL DRIFT compiled vs disk: none`; typecheck exit 0; clean build exit 0; `npm test` 177 files, 2438 passed, 4 skipped, 0 failed; stress 21 files, 65 passed, listing `lane-fusion-stress.vitest.ts`; `env-reference-drift` 5 passed. The first `npm test` failed T243-SA-022 with `index content hashes differ from disk for 1 skill`, because the `SKILL.md` and `graph-metadata.json` edits left the gitignored local index stale; a trusted `advisor_rebuild` call started this worktree's daemon, whose startup scan made it live (generation 4) with no tracked file changed, and the rerun passed.
- [x] T056 Add one exact-path row with a reason for each of the 14 allowlist-row paths in `spec.md` section 3 and the sweeper catalog leaf (REQ-014) (`K/runtime/cli/retrieval/fixtures/lane-residue-allowlist.json`). Verify: `node K/runtime/cli/retrieval/sweep-lane-residue.mjs repo --json` lists none of the 15 as live, and the run prints no unused row. Evidence: 16 exact-path rows added (the 14, the sweeper catalog leaf and the conductor's `$SD/scripts/tests/code-folder/baseline-readme-verdicts.json`), each citing its lines, the three refusal and frozen-record rows worded as about the removed lane; the repo run lists none as live, 46 rows 46 matched, `unusedAllowlistRows` empty; `sweep-lane-residue.vitest.ts` with the three allowlisted CLI tests: 4 files, 76 passed.
- [x] T050 Rerun the repository suites (REQ-010). Verify: `bash .skilled/commands/doctor/scripts/tests/run-all.sh` prints `[run-all] 7 suite(s) passed, 0 failed`; `bash $SD/scripts/tests/run-script-tests.sh | tail -1` prints `all sk-doc script tests passed`; `python3 $SD/shared/scripts/validate_document.py` on each edited Markdown file outside `changelog/` exits no worse than at `S`. Evidence: `[run-all] 7 suite(s) passed, 0 failed`, exit 0; `all sk-doc script tests passed`, exit 0; `validate_document.py` on the 53 edited Markdown files outside `changelog/`: `worse=0` against `S`.
- [x] T051 Confirm the trigger index is still phase 007's (REQ-013). Verify: `node $K/runtime/cli/retrieval/generate-trigger-index.mjs --check` exits 1, and every stale or obsolete path it prints beyond `$F/scratch/ti-before.txt` is a file this phase edited, renamed or deleted (`git diff --name-only $S`). Evidence: exit 1 with `stale documents : 75 (68 missing)` and `obsolete paths : 13` (start 66 and 9); the `--json` report shows all 10 stale and 4 obsolete `.skilled` paths it adds are files this phase edited, renamed or deleted; its other `.skilled` stale paths (`cli-opencode/changelog/v2.0.2.0.md`, `$R/tests/skill-graph/README.md`) were in `ti-before.txt` and are unchanged; the rest are spec docs.
- [x] T052 Prove the boundary and the comment rule (REQ-011). Verify: `git diff --name-only $S` lists no path on `spec.md`'s 005, 007 or 008 lists, not `$K/runtime/cli/retrieval/fixtures/lane-residue-allowlist.json`, nothing under `$R/lib/` or `$K/shared/` except `README.md`, and nothing under `specs/` outside `$F`; `git diff $S -- .skilled README.md .env.example | grep -E '^\+' | grep -E 'REQ-[0-9]|ADR-[0-9]|\bT0[0-9]{2}\b|phase 00[0-9]'` prints nothing. Evidence: the staged diff touches no 005 or 007 path, only the renamed stress test among code files and no manifest; the residue allowlist changes only by the REQ-014 rows. The one id hit is the advisor `ARCHITECTURE.md` decision-index row ADR-001, a doc table that already existed, not a code comment; the conductor accepted it.
- [x] T053 Prove no tag or release changed (REQ-012). Verify: `git ls-remote --tags origin | diff - $F/scratch/tags-before.txt` prints nothing, and the summary lists the eight tagged entries with the `build_release_notes.py` and `gh release edit` commands the operator runs after merge. Evidence: `git ls-remote --tags origin` diffs empty against the start list (281 lines); no `gh release` write ran; the eight tagged entries (v3.1.2.0, v3.4.0.0, v3.4.1.0, v3.5.0.0, v3.5.0.3, v3.6.0.0, v4.0.0.0, v4.1.0.0) each changed and each still has its tag. [DEVIATION: the list with the `build_release_notes.py` and `gh release edit` commands went to the conductor in a scratchpad file, since implementation-summary.md is conductor-owned]
- [x] T054 Record each gate's command, exit status and count with `S` and the phase commit, and clean scratch (`implementation-summary.md`). Verify: the summary's verification table holds one row per gate in T045 to T053, and `ls -A $F/scratch` prints only `.gitkeep`. Evidence: the Verification table and the release-body list in `implementation-summary.md`; scratch holds only `.gitkeep`.
- [x] T055 Validate this phase (`spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $F --strict` prints `RESULT: PASSED`. Evidence: `validate.sh $F --strict` printed `Summary: Errors: 0  Warnings: 1` (AI_PROTOCOLS) and `RESULT: PASSED`, exit 0; its Draft auto-repair rewrote `$F/graph-metadata.json`. This run predates the conductor's implementation summary.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: each changelog diff read once (T041), and the new entry's opening and upgrade steps read once (T043)
- [x] The residue check lists exactly the 5 named 007 paths (T045) and every gate prints its `S` result (T048 to T050)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md` (ADR-001 to ADR-010)
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Predecessor plan**: See `../005-shared-embeddings-package/plan.md` (its rows routed to this phase)
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

A ratchet, routing corpus or score baseline move is a P0 halt, never a recapture.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md Evidence: `spec.md:265` section 4 holds the REQ rows, starting at `spec.md:273`.
- [x] CHK-002 [P0] Technical approach defined in plan.md Evidence: `plan.md:53` section 3 ARCHITECTURE and the ADR record at `plan.md:240`.
- [x] CHK-003 [P1] Phase 005 is committed, no 005-list path is live, and every live path is on a `spec.md` 006, 007 or 008 list (T001) Evidence: phase 005 committed as `1f85a9dd6dd`; T001 classified every live path.
- [x] CHK-004 [P1] The conductor has answered open question 1, or the answer is recorded as pending in the implementation summary Evidence: answered; the allowlist rows land here (spec.md section 12).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The renamed stress test passes alone with its `S` count, and advisor `npm run typecheck` exits 0 (T007, T049) Evidence: `lane-fusion-stress.vitest.ts` passes 3 of 3; advisor typecheck exit 0.
- [x] CHK-011 [P0] Both YAML assets parse and both regenerated JSON files are valid, with `--check` modes clean (T011, T017, T036) Evidence: leaf manifests and `skill-graph.json` regenerated; their checks pass.
- [x] CHK-012 [P1] No doc names a deleted file, flag, route or setting: REQ-009's grep prints only its two named rows (T047) Evidence: T047.
- [x] CHK-013 [P1] No added line names a spec, phase, task, requirement or decision id (T052) Evidence: T052.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met Evidence: every AC row Met.
- [x] CHK-021 [P0] The four ratchets and the routing corpus print their `S` results after T017 and on the final tree (T018, T049) Evidence: ratchets 7, 9, 6 and the corpus gate pass on the final tree, rerun by the conductor.
- [x] CHK-022 [P0] The docs gates print their `S` results (T048) Evidence: T048.
- [x] CHK-023 [P1] The advisor test and stress totals, `env-reference-drift`, `run-all.sh` and `run-script-tests.sh` equal their `S` results (T049, T050) Evidence: advisor 177 files and 2438 passed, stress 65, run-all 7 suites, sk-doc script tests passed.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Finding class: `cross-consumer`; the vocabulary reaches advisor, spec-kit, sk-code and sk-doc docs, command assets, the env template and five changelog folders. Evidence: `plan.md:72` FIX ADDENDUM rows name the advisor, spec-kit, sk-code and `/create:command` surfaces, the env template and the 23 changelog entries.
- [x] CHK-FIX-002 [P0] Same-class producer inventory: the residue check's live list drops from 99 to the 5 named 007 paths (T001, T045). Evidence: live 99 to 5.
- [x] CHK-FIX-003 [P0] Consumer inventory: every referrer of a renamed or deleted file is edited or owned by phase 007, and every in-file anchor link resolves (T041, T046). Evidence: link check 0 broken; old anchors have no inbound links.
- [x] CHK-FIX-004 [P0] Adversarial cases: a matched term in a fenced block, a table cell, an anchor id, a frontmatter trigger phrase and a cited spec path are each handled by `plan.md` ADR-001 or the 008 list, and `hits` counts every line form. Evidence: `plan.md:100` names the five adversarial cases, and ADR-001 rule (b) at `plan.md:250` covers an anchor rename with its in-file links.
- [x] CHK-FIX-005 [P1] Matrix: eight file kinds by five classes, as `plan.md` lists, each cell edited here or owned by a named phase. Evidence: `plan.md:99` lists the eight file kinds by the five classes.
- [x] CHK-FIX-006 [P1] Hostile env: N/A, no edited file is code that reads process state; the stress test's two strings are labels. Evidence: `git diff --name-only 1f85a9dd6dd 29ae0d13c59 -- '*.ts' '*.cjs' '*.mjs' '*.py'` prints only `lane-fusion-stress.vitest.ts`, a test file.
- [x] CHK-FIX-007 [P1] Evidence is pinned to `S` and the phase commit SHA. Evidence: pinned to `S` = `1f85a9dd6dd`; the commit message names the base.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secret, token or dotenv value appears in any edited file Evidence: no dotenv value in any edited file.
- [x] CHK-031 [P0] The `.env.example` model server auth-token and remote-bind lines are gone with section 7 (T029) Evidence: T029.
- [x] CHK-032 [P1] No `gh release` write and no tag move ran (T053) Evidence: the remote tag list is unchanged; no `gh release` command ran.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized Evidence: the stale 20-path text was corrected to the 5-path state.
- [x] CHK-041 [P1] Every changelog keeps its version, date, numbers and facts (T041) Evidence: both reviews diffed all 23 entries; no version, date or number changed.
- [x] CHK-042 [P2] The advisor README's lane table and the catalog index counts agree on four lanes and 47 features Evidence: four lanes and 47 features.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only Evidence: `git show --name-only 29ae0d13c59` lists no scratch path but `scratch/.gitkeep`, and `ls -A scratch` prints only `.gitkeep`.
- [x] CHK-051 [P1] scratch/ cleaned before completion Evidence: scratch holds only `.gitkeep`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 0/15 |
| P1 Items | 19 | 0/19 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-21
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] Architecture decisions documented in `plan.md`'s ARCHITECTURE DECISION RECORD section Evidence: `plan.md:240` opens the ARCHITECTURE DECISION RECORD section with ADR-001 to ADR-010.
- [x] CHK-101 [P1] All ADRs have status (Proposed/Accepted) Evidence: `rg -c '^### ADR' plan.md` and `rg -c '^\*\*Status\*\*' plan.md` each print 10; ADR-007 is Proposed at `plan.md:375`, the other nine Accepted.
- [x] CHK-102 [P1] Alternatives documented with rejection rationale Evidence: `rg -c '^\*\*Alternatives Rejected' plan.md` prints 10, one per ADR.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [x] CHK-110 [P1] NFR-P01 holds: no runtime source changed, `git diff --name-only $S -- '*.ts' '*.cjs' '*.mjs' '*.py'` lists only the renamed stress test (T052) Evidence: T052.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [x] CHK-120 [P0] Rollback procedure documented: revert the one phase commit; nothing outside the tree changed Evidence: `plan.md:145` section 7 ROLLBACK PLAN names the trigger and the restore procedure.
- [x] CHK-121 [P1] Phase 007 does not start until T045 and T048 pass Evidence: T045 and T048 passed before 007 starts.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P1] No dependency, manifest or lockfile changed: `git diff --name-only $S -- '*package*.json'` prints nothing Evidence: no manifest or lockfile staged.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] `spec.md` Files to Change, `plan.md` Affected Surfaces and `tasks.md` name the same files Evidence: the staged paths match spec.md's classified list.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Conductor | Answers open question 1 before phase 007 is planned | [ ] Approved | |
| Operator | Merges the branch, then runs the release edits (T053) | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
