# 009 build evidence: cli-jev hub moved into cli-classifier as mode cli-jev

Build orchestrator leaf, 2026-09-29, worktree `069-cli-jev-workflow-integration`. Nothing here is committed: the session stages and commits. Raw outputs sit under `logs/` (dispatch handbacks `NN.last.txt`, final gates under `logs/final/`).

**Verdict: PASS.** The 17-row replay matches the baseline on every row, and every gate the brief names passes from the final state. Three open items belong to the session: the stale-path grep still lists 4 generated files, criterion 2 waits on the commit, and one playbook failed validation before this build touched it (section 7).

---

## 1. Baselines (taken by the session at clean HEAD `3dde18cb54`, copied from `../baselines.md`)

| Check | Command | Exit | Result |
|---|---|---|---|
| Guard | `node .skilled/bin/compiled-route-guard.cjs` | 0 | 7 hubs fresh (cli-external-orchestration, cli-jev, mcp-tooling, sk-code, sk-design, sk-doc, system-deep-loop) |
| Sync check | `node .skilled/bin/compiled-route-sync.cjs --check` | 0 | all 7 hubs resolve |
| Status | `node .skilled/bin/compiled-route-status.cjs --all` | 0 | 7 fleet hubs compiled-serving, plus 2 legacy test-artifact rows (manifest-race-308, manifest-test-308) |
| Admission | `node .skilled/bin/compiled-route-admission.cjs --all` | 0 | every hub passes, cli-jev 3 pass 0 drift 0 stale 0 n/a |
| parent-skill-check cli-classifier | `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/cli-classifier` | 0 | OK, 1 manifest mode, version 1.0.0.0 |
| parent-skill-check cli-jev | same, cli-jev | 0 | OK, 1 manifest mode, version 0.2.0.0 |
| parent-skill-check cli-external-orchestration | same | 0 | OK, 7 manifest modes, version 1.7.0.0 |
| Foundation vitest | `cd .skilled && npx vitest run --config vitest.config.bin.ts bin/compiled-routing-foundation.vitest.ts` | 0 | 1 file, 37 passed, 0 failed |
| Manifest test | `node --test .skilled/bin/tests/compiled-route-manifest.test.cjs` | 1 | 42 tests, 28 pass, 14 fail (names in `../baseline-raw/manifest-test.failnames`) |
| Dispatch audit test | `cd .skilled && npx vitest run hooks/dispatch/lib/dispatch-audit.test.mjs` | 0 | 75 passed |
| Dispatch rule-checks test | `node --test .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` | 0 | 20 tests, 20 pass |

Route replay before the move: `../route-baseline.txt`, 17 prompts through `--hub cli-jev`.

---

## 2. Proof plan and results (final state)

Phase goal criteria:

| # | Criterion | Command | Expected | Result |
|---|---|---|---|---|
| 1 | Baseline file of the prompts through `--hub cli-jev` at 81 hub files | `../route-baseline.txt` (session, before any move) | JSON and exit per prompt | PASS: 17 prompts, each with JSON and exit status |
| 2 | Move commit: `git ls-files .skilled/skills/cli-jev` prints 0; renames for moved files, `D` only for merged hub-level files | pre-commit proxy: `git diff HEAD -M --name-status` and `find .skilled/skills/cli-jev` | 70 renames, 11 `D` | PENDING COMMIT. The working tree gives 70 `R` plus 11 `D` under the hub, and the `D` rows are exactly the 11 merges. `find` prints "No such file or directory". The index still lists the 11 merge sources until the session stages them |
| 3 | parent-skill-check exits 0, two modes, one `cli-jev` over `cli-usage` | `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/cli-classifier` | exit 0, 2 modes | PASS: exit 0, "3b: mode-registry.json declares 2 modes", 13a/13b at 1.1.0.0, "OK ... 0 warnings" |
| 4 | Replay through `--hub cli-classifier` matches on action, selectionKind, packetId | `replay.sh cli-classifier route-after.txt` then `runs/compare-replay.py` | 0 mismatch | PASS: "TOTAL 17 rows, 17 match, 0 mismatch", exit 0 |
| 5 | REQ-008 stale-path grep prints nothing | `git grep -l '\.skilled/skills/cli-jev/' -- . ':!specs' ':!**/changelog/**' ':!**/benchmark/reports/**'` | no output | OPEN: prints 4 files, all generator output the session owns: `sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json` (its generator reads `git ls-files`, so it waits on staging), `system-spec-kit/runtime/cli/retrieval/fixtures/corpus-manifest.json` and `generation-diagnostics.json`, and `system-spec-kit/runtime/data/trigger-index.json`. The session rebuilds the last three in one generator run. No hand-edited file matches |
| 6 | `validate.sh --strict` on the phase | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-jev/003-cli-jev-workflow-integration/009-cli-jev-hub-move --strict` | `RESULT: PASSED` | PASS: "Summary: Errors: 0  Warnings: 0", "RESULT: PASSED", exit 0 (docs still say Planned; the closure leaf updates them) |

Spec proof-plan rows not covered above:

| Row | Result |
|---|---|
| Entry gate | `008-cli-classifier-hub/spec.md:27` Status Complete; parent-skill-check exit 0 at baseline |
| Manifest | `compiled-route-manifest.cjs refresh --hub cli-classifier --skill-root .skilled/skills/cli-classifier` exit 0; SHA-256 `aa840b21735c7de220e5054f84a4faac84a8641862673dd952ef87f4294ddc7a` before and after; `freshness` exit 0, `fresh: true`, `causeCode: fresh` |
| Fleet | status, guard, admission and sync, all in section 4 |

### 17-row replay (baseline read with hub `cli-jev` as `cli-classifier`, skillId `cli-jev` as `cli-classifier`, workflowMode `cli-usage` as `cli-jev`; hash and generation ignored)

Output of `runs/compare-replay.py ../route-baseline.txt route-after.txt`, exit 0:

1. MATCH `use jev choice to pick a queue`: route single cli-jev/cli-usage, exit 0
2. MATCH `cli-jev noul for this question`: route single cli-jev/cli-usage, exit 0
3. MATCH `use jev judgment to decide whether this incident is urgent`: route single cli-jev/cli-usage, exit 0
4. MATCH `jev score these three severity levels`: route single cli-jev/cli-usage, exit 0
5. MATCH `summarize the open questions in this spec packet`: defer, exit 0
6. MATCH `describe the json value in this file`: defer, exit 0
7. MATCH `forbidden judgment operation`: reject, exit 0
8. MATCH `Use jev judgment to decide whether this incident is urgent, and give me the probability.`: route single cli-jev/cli-usage, exit 0
9. MATCH `ask jev for a probability that this plan ships on time`: route single cli-jev/cli-usage, exit 0
10. MATCH `score these three levels with jev`: route single cli-jev/cli-usage, exit 0
11. MATCH `run a batch of typed questions through jev`: route single cli-jev/cli-usage, exit 0
12. MATCH `pick one option with jev`: route single cli-jev/cli-usage, exit 0
13. MATCH `order levels with jev`: route single cli-jev/cli-usage, exit 0
14. MATCH `batch typed questions through jev`: route single cli-jev/cli-usage, exit 0
15. MATCH `cli-jev noul for this question.`: route single cli-jev/cli-usage, exit 0
16. MATCH `Summarize the open questions in this spec packet.`: defer, exit 0
17. MATCH `score this flavor of ice cream`: defer, exit 0

Total: 17 rows, 17 match, 0 mismatch. The kill rule did not fire.

---

## 3. Suites: baseline to final

| Suite | Baseline | Final | Delta |
|---|---|---|---|
| Foundation vitest | 37 passed, exit 0 | 37 passed, exit 0 | none |
| Manifest test (`node --test`) | 42 tests, 28 pass, 14 fail, exit 1 | 42 tests, 28 pass, 14 fail, exit 1 | none; failing names identical (`diff` of sorted names prints nothing) |
| Dispatch audit vitest | 75 passed | 75 passed, exit 0 | none |
| Dispatch rule-checks `node --test` | 20 of 20 | 20 of 20, exit 0 | none |
| system-deep-loop `tests/unit/fanout-merge.vitest.ts` | no baseline taken | 61 passed, exit 0 | n/a |
| system-skill-advisor full suite (`npx vitest run`) | no baseline taken | 130 files passed, 1030 passed, 6 skipped, exit 0 (same on an early run before the doc sweep ended) | n/a |

---

## 4. Final-state gate log (command, result line, exit)

| Command | Result | Exit |
|---|---|---|
| `node .skilled/bin/compiled-route-status.cjs --all` | 7 fleet hubs compiled; `cli-classifier` compiled, shadowOnly false, generation 1, fence 1; no `cli-jev` row; the 2 legacy test rows as at baseline | 0 |
| `node .skilled/bin/compiled-route-guard.cjs` | 7 hubs fresh incl. `cli-classifier`; "All hubs fresh or excused" | 0 |
| `node .skilled/bin/compiled-route-admission.cjs --hub cli-classifier` | "cli-classifier pass 5 pass, 0 drift, 0 stale, 0 n/a" (CC-001 cli-deem, CC-002/CJ-001/CJ-002 cli-jev, CC-003 negative) | 0 |
| `node .skilled/bin/compiled-route-admission.cjs --all` | "Every hub passes the admission check." | 0 |
| `node .skilled/bin/compiled-route-sync.cjs --check` | "all 7 hubs resolve" | 0 |
| `node .skilled/bin/compiled-route-sync.cjs --verify` | "move-simulation OK: all 7 hubs resolve; 0 reads under .opencode/specs" | 0 |
| `compiled-route-manifest.cjs refresh` then `freshness` (cli-classifier) | SHA-256 equal before and after; `fresh: true` | 0, 0 |
| `parent-skill-check.cjs .skilled/skills/cli-external-orchestration` | OK, 7 modes, 13a/13b 1.7.0.0, 0 warnings | 0 |
| `skill_advisor.py "ask jev for a probability that this plan ships on time" --threshold 0.5` | top `cli-classifier` 0.8483; no `cli-jev` entry | 0 |
| `skill_advisor.py "ask deem for a probability that this incident is urgent" --threshold 0.5` | top `cli-classifier` 0.8963; no `cli-jev` entry | 0 |
| `git ls-files .skilled/skills/cli-jev` | 11 lines: the merge sources, deleted in the tree, unstaged | 0 |
| `find .skilled/skills/cli-jev` | "No such file or directory" | 1 |
| `generate-leaf-manifest.cjs --check .skilled/skills/cli-classifier` | "leaf-manifest.json OK (f5f53d9a...)" | 0 |
| `skill_graph_compiler.py --validate-only` | "VALIDATION PASSED" | 0 |
| `sync-runtime-mirrors.cjs --check` | "PASS: 170 mirrors across 8 trees are in sync." | 0 |
| `codex/sync-agents.cjs --check` | "PASS: 12 agents are in sync." | 0 |
| `hermes/sync-skills-hermes.cjs --check` | "PASS: 72 Hermes skill copies in sync" | 0 |
| `pi/sync-agents-pi.cjs` (write) | "Wrote 2 of 12 generated agents." | 0 |
| `test_readme_manifest.py` | "SUMMARY: discovery=pass exclusions=21/21 manifest=reproducible" | 0 |
| `test_readme_verdict_parity.py` | 6 diff entries, all `.skilled/skills/cli-jev/...` READMEs recorded in the fixture; regeneration waits on staging | 1 |
| Twin byte identity (`cmp` runtime vs authored twin) | harness, 3 libs, canary fixture, `014-runtime-engine/lib/{compiled-route,resolve}.cjs`, both activation manifests: all identical | 0 |
| Code-comment hygiene (added comment lines in `*.cjs/*.mjs/*.ts`) | no spec path, phase number or task id | n/a |

---

## 5. validate_document on every changed skill doc (`runs/changed-docs.txt`, 31 files; full lines in `logs/final/validate-docs.txt`)

30 of 31 exit 0 under auto-detection. Where auto-detection falls back to README rules, the explicit type also passes: `--type playbook` for the hub playbook root, `--type feature_catalog` for both catalog roots.

One fails: `.skilled/skills/cli-classifier/cli-usage/manual-testing-playbook/manual-testing-playbook.md` exits 1. It reports "Missing required section: overview" under auto-detection (2 issues) and 4 issues under `--type playbook`. The HEAD copy at `.skilled/skills/cli-jev/cli-usage/...` gives the same exit and the same counts, so the failure predates this build. The build changed one table row in that file (brief 30), and restructuring the moved packet's playbook is outside this phase.

---

## 6. Files changed, with brief and executor

Dispatches: 62, all exit 0, one at a time (Devin 16, Pi 46). BLOCKED at the end: none.

| Files | Brief, executor |
|---|---|
| `cli-classifier/mode-registry.json` (+ plain `rm` of `cli-jev/mode-registry.json`) | 01 Devin |
| `cli-classifier/hub-router.json` (+ `rm` source) | 02 Devin |
| `cli-classifier/SKILL.md` (+ `rm` source) | 03 Pi |
| `cli-classifier/cli-usage/SKILL.md` | 04 Devin |
| `cli-classifier/cli-deem/SKILL.md` | 05 Pi |
| `cli-external-orchestration/mode-registry.json` | 06 Devin |
| `014-runtime-engine/lib/compiled-route.cjs`, runtime and twin (`HUB_CHILD`) | 07 Devin |
| `014-runtime-engine/lib/resolve.cjs`, runtime and twin (`DEFAULT_ON_HUBS`) | 08 Devin |
| `.skilled/bin/compiled-route-guard.cjs` | 09 Devin |
| `.skilled/bin/compiled-route-sync.cjs` | 10 Devin |
| `system-skill-advisor/runtime/lib/compiled-routing-flag.ts` | 11 Devin |
| `008-cli-classifier/harness/build-artifacts.cjs`, runtime and twin | 12 Devin |
| `008-cli-classifier/lib/registry-compiler.cjs`, both trees | 13 Devin |
| `008-cli-classifier/lib/router.cjs`, both trees | 14 Devin |
| `008-cli-classifier/lib/policy-card.cjs`, both trees | 15 Devin |
| `008-cli-classifier/fixtures/canary-cases.v1.json`, both trees (7 Jev cases expect `cli-jev`, plus `deem-choice-single` and `deem-verb-narrowness`) | 16 Pi |
| `.skilled/hooks/dispatch/lib/dispatch-audit.mjs`, `dispatch-audit.test.mjs` | 17 Devin |
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` | 18 Devin |
| `.skilled/agents/orchestrate.md` | 19 Pi, 19b Pi (line 838, also `.claude` line 826) |
| `.claude/agents/orchestrate.md` | 19b Pi, 19c Pi |
| `.skilled/agents/prompt-improver.md` | 20 Pi |
| `.claude/agents/prompt-improver.md` | 20b Pi |
| `cli-external-orchestration/feature-catalog/cli-executor-dispatch-routing/...md` | 21 Pi |
| `cli-external-orchestration/feature-catalog/feature-catalog.md` | 22 Pi |
| `cli-external-orchestration/graph-metadata.json` | 23 Pi |
| `sk-prompt/assets/cli-prompt-quality-card.md` | 24 Pi |
| `README.md` | 25 Pi |
| `.skilled/skills/README.txt` | 26 Pi |
| `system-deep-loop/runtime/tests/unit/fanout-merge.vitest.ts` | 27 Devin |
| `cli-usage/manual-testing-playbook/dispatch-guards/dispatch-resolves-from-command.md` | 28 Pi |
| `cli-usage/manual-testing-playbook/dispatch-guards/prose-mention-is-not-a-dispatch.md` | 29 Pi, 29b Pi |
| `cli-usage/manual-testing-playbook/manual-testing-playbook.md` | 30 Pi |
| `cli-usage/feature-catalog/dispatch-guards/dispatch-guards.md` | 31 Pi |
| `cli-usage/feature-catalog/feature-catalog.md` | 32 Pi |
| `cli-usage/feature-catalog/transport-classification/transport-classification.md` | 33 Pi |
| `cli-usage/README.md` | 34 Pi |
| `cli-deem/README.md` | 35 Pi |
| `cli-classifier/shared/README.md` | 36, 36b, 36c Pi |
| `013-live-activation/activation/cli-classifier/manifest.json`, both trees (library canonical bytes, prepared by `runs/gen-manifest.cjs`) | 37 Pi |
| `.skilled/bin/lib/compiled-routing/serving-closure.manifest.json` (fileCount 62) | 38 Pi |
| twin `activation/cli-external-orchestration/manifest.json` | 39 Pi |
| `cli-classifier/README.md` (+ `rm` source) | 40 Pi |
| `cli-classifier/ROUTER.md` (+ `rm` source) | 41 Pi |
| `cli-classifier/description.json` (+ `rm` source) | 42 Pi |
| `cli-classifier/graph-metadata.json` (+ `rm` source) | 43 Pi |
| `cli-classifier/benchmark/README.md` (+ `rm` source) | 44 Pi |
| `cli-classifier/benchmark/reports/README.md` | 45 Pi |
| `cli-classifier/changelog/v1.1.0.0.md` (new) | 46 Pi |
| `rm cli-jev/leaf-manifest.json` | 47 Pi |
| `cli-classifier/manual-testing-playbook/manual-testing-playbook.md` (+ `rm` source) | 48 Pi |
| `hub-routing/out-of-domain-resolves-nothing.md` (merged with CJ-003, + `rm` source) | 49 Pi |
| `hub-routing/deem-request-routes-to-transport.md` (CC-001) | 50 Pi |
| `hub-routing/jev-request-stays-with-cli-jev.md` (CC-002, rewritten in place) | 51 Pi |
| `hub-routing/judgment-request-routes-to-transport.md` (CJ-001) | 52 Pi, 52b Pi |
| `hub-routing/alias-still-resolves.md` (CJ-002) | 53 Pi, 53b Pi |
| `rmdir` of the 32 empty `cli-jev` folders | 54 Pi |

Generated files, each regenerated by its own generator, run by the orchestrator:

| File | Generator |
|---|---|
| `cli-classifier/leaf-manifest.json` | `generate-leaf-manifest.cjs --write`, then `--check` OK |
| twin `008-cli-classifier/compiled/*` (6) and `activation/*` (acceptance, manifest.candidate) | `harness/build-artifacts.cjs`, exit 0, `effectivePolicyHash 63c0e7c4...` |
| runtime `activation/cli-external-orchestration/manifest.json` (gen 5, `fa529238...`) | `compiled-route-manifest.cjs refresh --hub cli-external-orchestration`; a second refresh was byte-stable |
| `system-skill-advisor/runtime/scripts/skill-graph.json` | `skill_graph_compiler.py --export-json` after `--validate-only` |
| advisor SQLite (not tracked) | `skill-advisor.cjs skill_graph_scan`, generation 84 to 85 |
| `runtime/tests/parity/fixtures/local-native-approved-divergences.json` | `capture-local-native-divergence-ledger.mjs --write` (one row changed, `harder:a936c52192b6`) |
| advisor `dist/` (untracked build output) | `npm run build`, exit 0 |
| `.codex/agents/{orchestrate,prompt-improver}.toml` | `codex/sync-agents.cjs` |
| `.pi/agents/{orchestrate,prompt-improver}.md` | `pi/sync-agents-pi.cjs` |
| `.hermes/skills/{cli-classifier,cli-deem,cli-usage,agent-orchestrate,agent-prompt-improver}/SKILL.md`, `.hermes/skills/cli-jev/` pruned | `hermes/sync-skills-hermes.cjs` |
| `sk-doc/scripts/tests/code-folder/durable-directory-manifest.json` | `test_readme_manifest.py --write` |

---

## 7. Re-dispatches, deviations, premises and open items

Re-dispatches:
- **36 to 36b.** 36 retitled the shared README, and it failed `validate_document` on an OVERVIEW section that was already missing at HEAD.
- **36b to 36c.** 36b's templated rewrite scored 26% rename similarity against its HEAD source. At `-M` 50% that shows as `D` plus `A`, which breaks criterion 2. 36c is the moved text plus the title and one OVERVIEW heading: R088, validates with 0 issues.
- **52 to 52b and 53 to 53b.** The CJ-001 and CJ-002 rewrites scored R050 and R044. The v2 copies keep the pre-move recorded result above the 2026-09-29 one, and CJ-002 keeps its still-true Why paragraph. Both now score R052.
- **29 to 29b.** My brief's expect-0 check contradicted its one-line scope: line 56 carries the same phrase. Pi stopped correctly, and 29b edited line 56.
- **19b, 19c and 20b.** These are follow-ups, not failures. Brief 19 missed the `.skilled` line 838 row, and `.claude/agents/` turned out to be a hand-kept sibling rather than a generated mirror.

Deviations and premises:
- **Authored twin.** `014-runtime-engine/lib/{resolve,compiled-route}.cjs` were edited in the authored twin as well as the runtime. The spec names only the runtime paths, but sync `--check` requires the twin to match.
- **Hub-routing scenario count.** The ruling "hub-routing/ holds exactly three scenarios" conflicts with REQ-013 and REQ-003, which keep and rewrite CJ-001 and CJ-002. `hub-routing/` holds 5 files covering 3 categories: cli-deem (CC-001), cli-jev (CC-002, CJ-001, CJ-002) and out-of-domain (CC-003, which absorbed CJ-003). CC-002 was rewritten in place, not retired.
- **Prompt count.** The spec says 10 prompts, but the baseline file holds 17, and all 17 were replayed.
- **Dispatch audit.** It reports the hub id `cli-classifier` with packetPath `cli-classifier/cli-usage`, as the spec asks, while other shapes report packet ids. `dispatch-rule-checks.test.mjs` now scans the classifier hub, filtered to the packets a dispatch shape governs, so `cli-deem` is excluded.
- **Twin activation records.** `activation-record.json`, `manifest.candidate.json`, `manifest.prior.json`, `manifest.serving-prior.json` and `serving-flip-record.json` moved byte-identical and still record the cli-jev first activation (hash `3240...`). Regenerating them would claim a rollback rehearsal that was not performed.
- **Activation manifest.** `activation/cli-classifier/manifest.json` shows as `D` plus `A` against HEAD in both trees, because its canonical bytes carry a new policy hash. The same holds for the twin's regenerated `compiled/*`. None of these are among the 81 hub files. The `refresh` also left the runtime manifest at file mode 0600.
- **Other hub reminted.** Brief 06's registry text edit staled the cli-external-orchestration manifest. It was reminted by `refresh` to gen 5, and brief 39 copied the twin.
- **Absorbed generator drift.** `durable-directory-manifest.json --write` also absorbed `.skilled/hooks/goal/lib` and the `cli-classifier` folders, which were missing at HEAD because the fixture was already stale after 008.
- **Left as recorded.** The `004-cli-external-orchestration` canary case `jev-transport-single` stays unchanged, as spec line 169 directs. A "Real user request" line in `declared-hard-rules-refuse-violations.md:28` says "the cli-jev packet" and is left as-is.
- **Scope slips.** I wrote temp files outside `w3-build/`: `/tmp/x`, `/tmp/.vd*`, `/tmp/.h*`, and similarity scratch under the session scratchpad. All were removed.

Open, for the session:
- Stage, then run `test_readme_verdict_parity.py --write`.
- Rebuild `trigger-index.json` and the retrieval fixtures.
- Rerun the REQ-008 grep.
- Commit, then check criterion 2 with `git show -M --name-status`.
