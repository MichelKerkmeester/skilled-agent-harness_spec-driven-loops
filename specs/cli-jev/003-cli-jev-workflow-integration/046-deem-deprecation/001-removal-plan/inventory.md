---
title: "Inventory: Phase 1: removal-plan"
description: "Every live file that names Deem, with the phase that removes the reference and what happens to it, plus the suites that cover them and the rules that let cli-classifier keep one mode."
trigger_phrases:
  - "deem removal inventory"
  - "deem reference owner"
  - "deem suite baseline"
  - "one-mode hub rule"
importance_tier: "important"
contextType: "implementation"
---
# Inventory: Phase 1: removal-plan

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

The list phases 002 to 004 work from. Taken on 2026-10-02 at `eb77315f46`.

---

## 1. METHOD

`git grep -l -i -P '\bdeem(\b|[-_])' -- ':!specs' ':!*/changelog/*'` printed 209 files, saved in `scratch/inventory-files.txt`. DeepSeek V4.1 Flash max drafted a row per file from each file's matching lines. The session checked that the rows and the file list match one for one and in order, reread both keep rows and every rewrite row, and moved the injection-screen scorer's own files from 003 to 002, since it is a scorer.

**Owners.** 002 owns each scorer that takes `--deem`, its tests and the docs that describe only that scorer. 003 owns `.skilled/skills/cli-classifier/` apart from the injection-screen scorer, the `.hermes/skills/` mirror, `.skilled/bin/lib/compiled-routing/`, the advisor's `skill-graph.json` and `cli-external-orchestration`. 004 owns the rest.

**Actions.** `delete` removes the file. `remove` cuts the Deem arm, test or passage. `rewrite` makes prose say Jev only. `keep` leaves the match.

**Counts.** By owner: 002: 99, 003: 60, 004: 50. By action: delete: 28, keep: 2, remove: 167, rewrite: 12.

---

## 2. ONE-MODE HUB RULES

No check needs a second mode, so `cli-classifier` can keep `cli-jev` alone (ADR-002).

| Rule | Where | Bound |
|------|-------|-------|
| The parent-hub check fails a registry with no modes | `.skilled/commands/doctor/scripts/parent-skill-check.cjs:354` | at least 1 |
| The advisor drift guard applies only when a mode is projected | `.skilled/commands/doctor/scripts/parent-skill-check.cjs:765` | none |
| The cli-classifier registry compiler fails a registry with no modes | `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/008-cli-classifier/lib/registry-compiler.cjs:153` | at least 1 |
| The cli-classifier router clarifies only when more than one mode ties | `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/008-cli-classifier/lib/router.cjs:205` | one mode routes single |
| A clarify needs two to four alternatives | `.skilled/bin/lib/compiled-routing/005-decision-evaluator/lib/decision-contract.cjs:383` | never reached with one mode |

`node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/cli-classifier` exits 0 on the unchanged hub: "OK: parent-skill-check — all hard invariants passed, 0 warnings".

---

## 3. SCORERS AND SUITES

Twenty scorers take `--deem`. Phase 002 removes each arm. Baselines were taken on the unchanged tree.

| Feature | Scorer | Suite | Baseline |
|---------|--------|-------|----------|
| 002 jev-tiebreak | `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs` | `.skilled/skills/system-skill-advisor/runtime/tests/parity/score-jev-tiebreak.vitest.ts` | 58 pass, 1 fail |
| 006 goal-lint | `.skilled/skills/sk-doc/sk-create-goal/scripts/score-goal-lint.cjs` | `.skilled/skills/sk-doc/sk-create-goal/scripts/tests/score-goal-lint.test.cjs` | 25 pass, 0 fail |
| 017 track-narrowing | `.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs` | `.skilled/skills/system-spec-kit/runtime/cli/tests/score-track-narrowing.vitest.ts` | 33 pass, 0 fail |
| 019 suggested-order | `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs` | `.skilled/skills/system-skill-advisor/runtime/tests/parity/score-suggested-order.vitest.ts` | 45 pass, 0 fail |
| 020 clarify-default | `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs` | `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/score-clarify-default.test.cjs` | 28 pass, 0 fail |
| 021 leaf-route-replay | `.skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs` | `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/leaf-route-replay.test.cjs` | 37 pass, 0 fail |
| 022 alignment-suggestion | `.skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts` | `.skilled/skills/system-spec-kit/runtime/cli/tests/score-alignment-suggestion.vitest.ts` | 42 pass, 0 fail |
| 023 judge-agreement | `.skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.mjs` | `.skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.test.mjs` | 43 pass, 0 fail |
| 024 d4-agreement | `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs` | `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/d4-agreement.vitest.ts` | 32 pass, 0 fail |
| 025 verdict-fallback | `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs` | `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/verdict-fallback.vitest.ts` | 31 pass, 0 fail |
| 026 completion-claims | `.skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs` | `.skilled/skills/system-spec-kit/runtime/tests/completion-claim-audit.vitest.ts` | 24 pass, 0 fail |
| 027 stop-rater | `.skilled/skills/system-deep-loop/runtime/scripts/score-stop-rater.cjs` | `.skilled/skills/system-deep-loop/runtime/tests/unit/score-stop-rater.vitest.ts` | 61 pass, 0 fail |
| 028 stop-hint | `.skilled/skills/system-deep-loop/runtime/scripts/score-stop-hint.cjs` | `.skilled/skills/system-deep-loop/runtime/tests/unit/score-stop-hint.vitest.ts` | 28 pass, 0 fail |
| 029 severity-replay | `.skilled/skills/system-deep-loop/runtime/scripts/score-severity-replay.cjs` | `.skilled/skills/system-deep-loop/runtime/tests/unit/score-severity-replay.vitest.ts` | 33 pass, 0 fail |
| 030 fanout-pairs | `.skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs` | `.skilled/skills/system-deep-loop/runtime/tests/unit/score-fanout-pairs.vitest.ts` | 42 pass, 0 fail |
| 031 debug-next-check | `.skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs` | `.skilled/skills/system-spec-kit/runtime/tests/debug-next-check.vitest.ts` | 31 pass, 0 fail |
| 032 cite-drift-scan | `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs` | `.skilled/skills/sk-doc/scripts/tests/test-cite-drift-scan.mjs` | 32 pass, 0 fail |
| 033 residue-flagger | `.skilled/skills/system-deep-loop/deep-review/scripts/score-residue-flagger.cjs` | `.skilled/skills/system-deep-loop/deep-review/scripts/tests/score-residue-flagger.test.cjs` | 36 pass, 0 fail |
| 034 reader-lens | `.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_reader_lens.py` | `.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/tests/test_hvr_reader_lens.py` | 41 pass, 1 fail |
| 035 injection-screen | `.skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs` | `.skilled/skills/cli-classifier/benchmark/injection-screen/tests/score-injection-screen.test.mjs` | 40 pass, 0 fail |

Other suites that match the pattern:

| Suite | Baseline | Owner |
|-------|----------|-------|
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` | 20 pass, 0 fail | 004 |
| `.skilled/hooks/goal/lib/score-verifier-labeled-set.test.cjs` | 12 pass, 0 fail | 004 |
| `.skilled/skills/cli-classifier/cli-deem/scripts/tests/cli-deem.test.mjs` | 44 pass, 0 fail | 003 |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-merge.vitest.ts` | 61 pass, 0 fail | 004 |
| `.skilled/skills/system-spec-kit/runtime/tests/compaction-recall.vitest.ts` | 24 pass, 0 fail | 004 |

**Baseline failures.** Two Deem tests fail before any change, and both go with their arms in 002. `score-jev-tiebreak.vitest.ts` fails "prints the deem column from the real client against a scripted server" twice in a row: the calibration line it expects is missing. `test_hvr_reader_lens.py` fails "deem gate skips a stub backend". Neither failure is reproduced or fixed here.

**Runners.** `.vitest.ts` runs from the nearest `vitest.config.*`. The two `system-spec-kit/runtime/cli/tests/` files run from `runtime` with `--config ../vitest.config.ts`. `.mjs` and `.cjs` run under `node --test`. `test_hvr_reader_lens.py` runs as a script and prints `N FAILED` on failure.

---

## 4. NOTES FOR THE LATER PHASES

- `.hermes/skills/` rows are regenerated by `sync-skills-hermes.cjs`, never edited by hand. A phase that edits a `SKILL.md` reruns the sync and `--check`.
- `.skilled/hooks/goal/lib/score-verifier-labeled-set.cjs` takes no `--deem`. Its test already expects `error: unknown flag --deem`. Its match is a gate line, so it is a 004 rewrite.
- `playbook-failclosed-allowlist.txt` registers the `cli-deem` playbook root, so 003 cuts that entry in the commit that deletes the packet.
- `system-spec-kit/runtime/cli/retrieval/fixtures/phrase-variants.json` is generated. 004 regenerates it with its tool rather than editing it by hand, if the tool covers it.
- `cli-classifier/feature-catalog/feature-catalog.md` stays with 003, since it is the hub's aggregate. The injection-screen scorer's own pages are 002's.

---

## 5. ROWS

| File | Owner | Action | Note |
|------|-------|--------|------|
| `.hermes/skills/cli-classifier/SKILL.md` | 003 | rewrite | Generated hub mirror: two transports, mode row, keywords |
| `.hermes/skills/cli-deem/SKILL.md` | 003 | delete | Generated cli-deem packet mirror; whole file goes |
| `.hermes/skills/cli-jev/SKILL.md` | 003 | remove | Mirror says cli-jev sits beside cli-deem |
| `.hermes/skills/deep-improvement/SKILL.md` | 003 | remove | Mirror of scorer --jev/--deem arm text |
| `.hermes/skills/deep-review/SKILL.md` | 003 | remove | Mirror of flagger's --jev/--deem switch text |
| `.hermes/skills/sk-communication/SKILL.md` | 003 | rewrite | Mirror frames a Deem or Jev judge |
| `.hermes/skills/sk-create-skill/SKILL.md` | 003 | remove | Mirror of clarify-default and leaf-route-replay arm rows |
| `.hermes/skills/sk-create-with-human-voice/SKILL.md` | 003 | remove | Mirror of lens --jev/--deem switch text |
| `.hermes/skills/sk-doc/SKILL.md` | 003 | remove | Mirror of cite-drift-scan arm text |
| `.hermes/skills/system-deep-loop/SKILL.md` | 003 | remove | Mirror of runtime replay arm text |
| `.hermes/skills/system-skill-advisor/SKILL.md` | 003 | remove | Mirror of eval rows naming --jev/--deem |
| `.hermes/skills/system-spec-kit/SKILL.md` | 003 | remove | Mirror of measurement rows naming --deem |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/008-cli-classifier/fixtures/canary-cases.v1.json` | 003 | remove | Canary case expects a cli-deem target |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/008-cli-classifier/harness/build-artifacts.cjs` | 003 | remove | Harness maps cli-deem SKILL.md as source input |
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` | 004 | remove | Comment says the hub's Deem client has no shape |
| `.skilled/hooks/goal/lib/score-verifier-labeled-set.cjs` | 004 | remove | Gate line: deem arm condition holds |
| `.skilled/hooks/goal/lib/score-verifier-labeled-set.test.cjs` | 004 | remove | Test pins deem gate line and cli-deem stub |
| `.skilled/skills/README.txt` | 004 | rewrite | Catalog row routes to two transports, includes cli-deem |
| `.skilled/skills/cli-classifier/README.md` | 003 | rewrite | Hub overview: two transports, cli-deem row, client tests |
| `.skilled/skills/cli-classifier/ROUTER.md` | 003 | remove | Three DEEM_* intents, keywords and RESOURCE_MAP entries |
| `.skilled/skills/cli-classifier/SKILL.md` | 003 | rewrite | Hub doc: two transports, mode row, cli-deem keywords |
| `.skilled/skills/cli-classifier/benchmark/README.md` | 003 | rewrite | Benchmark prose routes a Deem request to cli-deem |
| `.skilled/skills/cli-classifier/benchmark/injection-screen/README.md` | 002 | remove | Scorer usage line and --deem arm passage |
| `.skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs` | 002 | remove | Scorer's --deem arm, gate and DEEM constants |
| `.skilled/skills/cli-classifier/benchmark/injection-screen/tests/README.md` | 002 | remove | Tests README names stub jev and cli-deem binaries |
| `.skilled/skills/cli-classifier/benchmark/injection-screen/tests/score-injection-screen.test.mjs` | 002 | remove | Scorer tests for the deem arm, stubs, verdicts |
| `.skilled/skills/cli-classifier/cli-deem/README.md` | 003 | delete | cli-deem packet README; whole file goes |
| `.skilled/skills/cli-classifier/cli-deem/SKILL.md` | 003 | delete | cli-deem transport skill doc; whole file goes |
| `.skilled/skills/cli-classifier/cli-deem/feature-catalog/availability-check/health-check.md` | 003 | delete | cli-deem health-check feature doc; whole file goes |
| `.skilled/skills/cli-classifier/cli-deem/feature-catalog/feature-catalog.md` | 003 | delete | cli-deem feature catalog; whole file goes |
| `.skilled/skills/cli-classifier/cli-deem/feature-catalog/judgment-subcommands/batched-run.md` | 003 | delete | cli-deem run subcommand doc; whole file goes |
| `.skilled/skills/cli-classifier/cli-deem/feature-catalog/judgment-subcommands/choice-selection.md` | 003 | delete | cli-deem choice subcommand doc; whole file goes |
| `.skilled/skills/cli-classifier/cli-deem/feature-catalog/judgment-subcommands/noul-probability.md` | 003 | delete | cli-deem noul subcommand doc; whole file goes |
| `.skilled/skills/cli-classifier/cli-deem/feature-catalog/judgment-subcommands/score-level.md` | 003 | delete | cli-deem score subcommand doc; whole file goes |
| `.skilled/skills/cli-classifier/cli-deem/manual-testing-playbook/availability-gate/health-accepts-pinned-install.md` | 003 | delete | cli-deem pinned-install scenario; whole file goes |
| `.skilled/skills/cli-classifier/cli-deem/manual-testing-playbook/availability-gate/health-refuses-stub-backend.md` | 003 | delete | cli-deem stub-refusal scenario; whole file goes |
| `.skilled/skills/cli-classifier/cli-deem/manual-testing-playbook/availability-gate/health-refuses-wrong-model.md` | 003 | delete | cli-deem model-pin refusal scenario; whole file goes |
| `.skilled/skills/cli-classifier/cli-deem/manual-testing-playbook/availability-gate/refused-port-health-reports-unreachable.md` | 003 | delete | cli-deem unreachable-port scenario; whole file goes |
| `.skilled/skills/cli-classifier/cli-deem/manual-testing-playbook/dormant-path/completion-claim-audit-skips-without-deem.md` | 003 | delete | DEE-010 scenario about the Deem arm; whole file goes |
| `.skilled/skills/cli-classifier/cli-deem/manual-testing-playbook/dormant-path/judgment-never-reads-a-refusal-as-a-value.md` | 003 | delete | cli-deem refusal-error shape under retired |
| `.skilled/skills/cli-classifier/cli-deem/manual-testing-playbook/judgment-subcommands/batch-run-translates-every-answer.md` | 003 | delete | cli-deem batch-run scenario; whole file goes |
| `.skilled/skills/cli-classifier/cli-deem/manual-testing-playbook/judgment-subcommands/choice-returns-submitted-key.md` | 003 | delete | cli-deem choice scenario; whole file goes |
| `.skilled/skills/cli-classifier/cli-deem/manual-testing-playbook/judgment-subcommands/noul-returns-probability.md` | 003 | delete | cli-deem noul scenario; whole file goes |
| `.skilled/skills/cli-classifier/cli-deem/manual-testing-playbook/judgment-subcommands/score-returns-zero-based-position.md` | 003 | delete | cli-deem score scenario; whole file goes |
| `.skilled/skills/cli-classifier/cli-deem/manual-testing-playbook/manual-testing-playbook.md` | 003 | delete | cli-deem playbook index; whole file goes |
| `.skilled/skills/cli-classifier/cli-deem/references/deem-ctl-lifecycle.md` | 003 | delete | Deem server lifecycle reference; whole file goes |
| `.skilled/skills/cli-classifier/cli-deem/references/model-pin.md` | 003 | delete | Deem model pin reference; whole file goes |
| `.skilled/skills/cli-classifier/cli-deem/references/wire-contract.md` | 003 | delete | Deem wire contract reference; whole file goes |
| `.skilled/skills/cli-classifier/cli-deem/scripts/README.md` | 003 | delete | cli-deem client scripts README; whole file goes |
| `.skilled/skills/cli-classifier/cli-deem/scripts/cli-deem.mjs` | 003 | delete | The cli-deem client itself; whole file goes |
| `.skilled/skills/cli-classifier/cli-deem/scripts/tests/README.md` | 003 | delete | cli-deem client tests README; whole file goes |
| `.skilled/skills/cli-classifier/cli-deem/scripts/tests/cli-deem.test.mjs` | 003 | delete | cli-deem client test suite; whole file goes |
| `.skilled/skills/cli-classifier/cli-jev/SKILL.md` | 003 | remove | Packet doc says cli-jev sits beside cli-deem |
| `.skilled/skills/cli-classifier/description.json` | 003 | remove | cli-deem mode, deem keywords and example phrasings |
| `.skilled/skills/cli-classifier/feature-catalog/feature-catalog.md` | 003 | remove | Hub catalog rows for injection-screen's two arms |
| `.skilled/skills/cli-classifier/feature-catalog/measurements/injection-screen-measurement.md` | 002 | remove | Measurement page for the scorer's Jev and Deem arms |
| `.skilled/skills/cli-classifier/graph-metadata.json` | 003 | remove | cli-deem family, keywords, contexts and mode entries |
| `.skilled/skills/cli-classifier/hub-router.json` | 003 | remove | cli-deem mode, tieBreak slot and vocabulary classes |
| `.skilled/skills/cli-classifier/leaf-manifest.json` | 003 | remove | Leaf entries for cli-deem references and mode |
| `.skilled/skills/cli-classifier/manual-testing-playbook/hub-routing/alias-still-resolves.md` | 003 | remove | Expected signals exclude a cli-deem target |
| `.skilled/skills/cli-classifier/manual-testing-playbook/hub-routing/deem-request-routes-to-transport.md` | 003 | delete | Deem-only routing scenario CC-001; whole file goes |
| `.skilled/skills/cli-classifier/manual-testing-playbook/hub-routing/jev-request-stays-with-cli-jev.md` | 003 | remove | Scenario fails if a cli-deem target appears |
| `.skilled/skills/cli-classifier/manual-testing-playbook/hub-routing/judgment-request-routes-to-transport.md` | 003 | rewrite | Prose says the prompt names no Deem phrase |
| `.skilled/skills/cli-classifier/manual-testing-playbook/hub-routing/out-of-domain-resolves-nothing.md` | 003 | rewrite | Prose says vocabulary names Jev or Deem |
| `.skilled/skills/cli-classifier/manual-testing-playbook/manual-testing-playbook.md` | 003 | remove | Index row and description for the Deem routing scenario |
| `.skilled/skills/cli-classifier/manual-testing-playbook/measurements/injection-screen-measurement.md` | 002 | remove | Scenario runs the scorer's --jev/--deem switches |
| `.skilled/skills/cli-classifier/mode-registry.json` | 003 | remove | cli-deem mode entry, packet mapping and keywords |
| `.skilled/skills/cli-external-orchestration/graph-metadata.json` | 003 | rewrite | Graph context pairs hosted Jev with local Deem |
| `.skilled/skills/sk-communication/README.md` | 004 | rewrite | README row pairs a Deem or Jev judge |
| `.skilled/skills/sk-communication/SKILL.md` | 004 | rewrite | Skill doc pairs a Deem or Jev judge |
| `.skilled/skills/sk-communication/benchmark/reply-harness/README.md` | 002 | remove | Harness README documents the scorer's --deem switch |
| `.skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.mjs` | 002 | remove | Scorer's DEEM ARM section and verdict column |
| `.skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.test.mjs` | 002 | remove | Test stubs cli-deem and asserts deem columns |
| `.skilled/skills/sk-communication/feature-catalog/evaluation-and-observability/offline-judge-agreement.md` | 002 | remove | Feature page for the scorer's Jev and Deem arms |
| `.skilled/skills/sk-communication/feature-catalog/feature-catalog.md` | 004 | remove | Catalog entry describes the Deem or Jev judge arms |
| `.skilled/skills/sk-communication/manual-testing-playbook/manual-testing-playbook.md` | 004 | remove | Playbook prose skips a stub Deem backend |
| `.skilled/skills/sk-communication/manual-testing-playbook/release-gating/offline-judge-census-stops-at-label-gate.md` | 002 | remove | COMM-011 scenario skips a stub Deem backend |
| `.skilled/skills/sk-doc/README.md` | 004 | remove | README row names cite-drift-scan's --jev/--deem |
| `.skilled/skills/sk-doc/SKILL.md` | 004 | remove | Skill doc row names the scorer's two backends |
| `.skilled/skills/sk-doc/feature-catalog/compiled-routing-and-legacy-fallback/clarify-default-measurement.md` | 002 | remove | Feature page for score-clarify-default's --deem gate |
| `.skilled/skills/sk-doc/feature-catalog/document-validation/citation-drift-scan.md` | 002 | remove | Feature page for cite-drift-scan's --jev/--deem arms |
| `.skilled/skills/sk-doc/feature-catalog/document-validation/goal-criteria-lint.md` | 002 | remove | Feature page for score-goal-lint's Deem arm |
| `.skilled/skills/sk-doc/feature-catalog/document-validation/hvr-reader-needed-lens.md` | 002 | remove | Feature page for the lens's Jev and Deem arms |
| `.skilled/skills/sk-doc/feature-catalog/feature-catalog.md` | 004 | remove | Catalog rows carry four scorers' --jev/--deem switches |
| `.skilled/skills/sk-doc/feature-catalog/packet-authored-registry-routing/leaf-route-replay.md` | 002 | remove | Feature page for leaf-route-replay's --jev/--deem tie-breaks |
| `.skilled/skills/sk-doc/manual-testing-playbook/document-validation/citation-drift-scan.md` | 002 | remove | SD-021 scenario runs a --deem arm with stubs |
| `.skilled/skills/sk-doc/manual-testing-playbook/manual-testing-playbook.md` | 004 | remove | Playbook rows pair the scorer's two backend switches |
| `.skilled/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json` | 004 | remove | Pinned verdict row for the cli-deem README |
| `.skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json` | 004 | remove | Directory manifest lists the cli-deem packet folder |
| `.skilled/skills/sk-doc/scripts/tests/test-cite-drift-scan.mjs` | 002 | remove | cite-drift-scan test: cli-deem stub and deem cases |
| `.skilled/skills/sk-doc/shared/scripts/README.md` | 002 | remove | Shared scripts README names the scorer's two arms |
| `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs` | 002 | remove | Scorer's --deem arm and Deem re-qualification check |
| `.skilled/skills/sk-doc/sk-create-goal/README.md` | 004 | remove | Packet README documents the scorer's Jev and Deem arms |
| `.skilled/skills/sk-doc/sk-create-goal/scripts/README.md` | 002 | remove | Scripts README documents score-goal-lint's two arms |
| `.skilled/skills/sk-doc/sk-create-goal/scripts/score-goal-lint.cjs` | 002 | remove | Scorer's DEEM constants, health timeout and arm |
| `.skilled/skills/sk-doc/sk-create-goal/scripts/tests/score-goal-lint.test.cjs` | 002 | remove | Test stubs cli-deem for the scorer's arm cases |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/playbook-failclosed-allowlist.txt` | 003 | remove | Allowlist registers the cli-deem playbook root |
| `.skilled/skills/sk-doc/sk-create-skill/README.md` | 004 | remove | Packet README documents both scorers' switch usage |
| `.skilled/skills/sk-doc/sk-create-skill/SKILL.md` | 004 | remove | Skill doc rows carry both scorers' --deem usage |
| `.skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/manual-testing-playbook.md` | 004 | remove | Playbook prose stubs jev and cli-deem on PATH |
| `.skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/parent-hub/count-clarify-and-stop-at-the-label-gate.md` | 002 | remove | SKL-007 scenario runs score-clarify-default with --deem |
| `.skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/parent-hub/replay-stage-two-leaf-routes.md` | 002 | remove | SKL-008 scenario also stubs cli-deem |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/README.md` | 002 | remove | Scripts README row names leaf-route-replay's two arms |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs` | 002 | remove | Scorer's DEEM constants, arm and client path |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs` | 002 | remove | Scorer's DEEM constants, usage and arm |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/leaf-route-replay.test.cjs` | 002 | remove | Test stubs cli-deem health and arm cases |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/score-clarify-default.test.cjs` | 002 | remove | Test stubs cli-deem for label-gate arm cases |
| `.skilled/skills/sk-doc/sk-create-with-human-voice/README.md` | 004 | remove | Packet README names the lens's two backend switches |
| `.skilled/skills/sk-doc/sk-create-with-human-voice/SKILL.md` | 004 | remove | Skill doc names the lens's --jev/--deem switches |
| `.skilled/skills/sk-doc/sk-create-with-human-voice/manual-testing-playbook/manual-testing-playbook.md` | 004 | remove | Playbook prompt runs the lens once with --deem |
| `.skilled/skills/sk-doc/sk-create-with-human-voice/manual-testing-playbook/tell-detection/reader-needed-lens-measurement.md` | 002 | remove | Scenario runs the lens's --deem arm against stubs |
| `.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/README.md` | 002 | remove | Scripts README lists the lens --deem invocation |
| `.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_reader_lens.py` | 002 | remove | Lens DEEM ARM section, --deem flag, health gate |
| `.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/tests/README.md` | 002 | remove | Suite README names cli-deem stubs on PATH |
| `.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/tests/test_hvr_reader_lens.py` | 002 | remove | Test ships a DEEM_STUB cli-deem double |
| `.skilled/skills/system-deep-loop/SKILL.md` | 004 | remove | Skill doc rows name the replay scripts' arms |
| `.skilled/skills/system-deep-loop/deep-improvement/README.md` | 004 | remove | Packet README names verdict-fallback's --jev/--deem |
| `.skilled/skills/system-deep-loop/deep-improvement/SKILL.md` | 004 | remove | Skill doc bullet names score-d4-agreement's two arms |
| `.skilled/skills/system-deep-loop/deep-improvement/feature-catalog/feature-catalog.md` | 004 | remove | Catalog entries for Deem or Jev grader agreement |
| `.skilled/skills/system-deep-loop/deep-improvement/feature-catalog/model-benchmark-mode/reviewer-verdict-fallback.md` | 002 | remove | Feature page for verdict-fallback's Deem and Jev arms |
| `.skilled/skills/system-deep-loop/deep-improvement/feature-catalog/scoring-system/hallucination-grader-agreement.md` | 002 | remove | Feature page for score-d4-agreement's Deem arm |
| `.skilled/skills/system-deep-loop/deep-improvement/manual-testing-playbook/five-d-scorer/unknown-grader-and-d4-census.md` | 002 | remove | Five-d scenario runs the d4 census --deem arm |
| `.skilled/skills/system-deep-loop/deep-improvement/manual-testing-playbook/manual-testing-playbook.md` | 004 | remove | Playbook summaries skip a stub Deem backend |
| `.skilled/skills/system-deep-loop/deep-improvement/manual-testing-playbook/model-benchmark-mode/verdict-fallback-census.md` | 002 | remove | MB-052 scenario skips a stub Deem backend by name |
| `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/README.md` | 002 | remove | Lib README names score-verdict-fallback's two backends |
| `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs` | 002 | remove | Scorer's DEEM constants, gate and runDeemArm |
| `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/README.md` | 002 | remove | Scorer README names score-d4-agreement's --deem arm |
| `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs` | 002 | remove | Scorer's DEEM GATE section, usage, backend param |
| `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/README.md` | 002 | remove | Tests README names the fallback's Deem and Jev gates |
| `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/d4-agreement.vitest.ts` | 002 | remove | Test covers the Deem gate, arm and verdicts |
| `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/verdict-fallback.vitest.ts` | 002 | remove | Test stubs cli-deem, covers Deem gate and arm |
| `.skilled/skills/system-deep-loop/deep-review/README.md` | 004 | remove | Packet README row names the flagger's two arms |
| `.skilled/skills/system-deep-loop/deep-review/SKILL.md` | 004 | remove | Skill doc says --jev and --deem are the calling switches |
| `.skilled/skills/system-deep-loop/deep-review/feature-catalog/feature-catalog.md` | 004 | remove | Catalog entry for a Jev or Deem flagger answer |
| `.skilled/skills/system-deep-loop/deep-review/feature-catalog/review-dimensions/residue-flagger-measurement.md` | 002 | remove | Feature page for the flagger's two arms |
| `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/entry-points-and-modes/residue-flagger-measurement.md` | 002 | remove | DRV-069 scenario skips a stub backend behind --deem |
| `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md` | 004 | remove | Playbook entries expect a skipped stub Deem backend |
| `.skilled/skills/system-deep-loop/deep-review/scripts/README.md` | 002 | remove | Scripts README row names the flagger's two switches |
| `.skilled/skills/system-deep-loop/deep-review/scripts/score-residue-flagger.cjs` | 002 | remove | Scorer's DEEM constants, gate and arm |
| `.skilled/skills/system-deep-loop/deep-review/scripts/tests/score-residue-flagger.test.cjs` | 002 | remove | Test stubs cli-deem, asserts its log stays empty |
| `.skilled/skills/system-deep-loop/runtime/README.md` | 004 | remove | Runtime README rows name four replays' two switches |
| `.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-pair-replay.md` | 002 | remove | Feature page for the replay's Jev and Deem arms |
| `.skilled/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md` | 004 | remove | Catalog entries for the replays' Jev or Deem arms |
| `.skilled/skills/system-deep-loop/runtime/feature-catalog/scoring/severity-replay.md` | 002 | remove | Feature page for the replay's Deem severity arm |
| `.skilled/skills/system-deep-loop/runtime/feature-catalog/scoring/stop-hint-replay.md` | 002 | remove | Feature page adds the stored jev and deem columns |
| `.skilled/skills/system-deep-loop/runtime/feature-catalog/scoring/stop-rater-replay.md` | 002 | remove | Feature page for the Deem gate and rating arms |
| `.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/fanout/fanout-pair-replay.md` | 002 | remove | Scenario confirms the Deem gate skips a stub |
| `.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/manual-testing-playbook.md` | 004 | remove | Playbook summaries name --deem and --jev arm skips |
| `.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/scoring/severity-replay.md` | 002 | remove | Scenario runs the replay's Jev or Deem arms |
| `.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/scoring/stop-hint-replay.md` | 002 | remove | Scenario runs the replay with --jev and --deem stubs |
| `.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/scoring/stop-rater-replay.md` | 002 | remove | Scenario runs the stop-rater's two rating arms |
| `.skilled/skills/system-deep-loop/runtime/scripts/README.md` | 002 | remove | Scripts README rows name four replays' two switches |
| `.skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs` | 002 | remove | Scorer's DEEM_ORDERS, DEEM constants and gate |
| `.skilled/skills/system-deep-loop/runtime/scripts/score-severity-replay.cjs` | 002 | remove | Scorer's DEEM_MODEL, p50 and severity arm |
| `.skilled/skills/system-deep-loop/runtime/scripts/score-stop-hint.cjs` | 002 | remove | Scorer's deem model column and usage line |
| `.skilled/skills/system-deep-loop/runtime/scripts/score-stop-rater.cjs` | 002 | remove | Scorer's DEEM constants, usage and rating arm |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-merge.vitest.ts` | 004 | keep | Recorded research finding labels; historical fixture text |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/score-fanout-pairs.vitest.ts` | 002 | remove | Test stubs cli-deem, covers Deem gate and arm |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/score-severity-replay.vitest.ts` | 002 | remove | Test covers the Deem gate, arm and verdict line |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/score-stop-hint.vitest.ts` | 002 | remove | Test asserts deem columns and verdicts under --deem |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/score-stop-rater.vitest.ts` | 002 | remove | Test stubs cli-deem, covers the Deem gate and arm |
| `.skilled/skills/system-skill-advisor/README.md` | 004 | remove | README rows name the two evals' Jev and Deem runs |
| `.skilled/skills/system-skill-advisor/SKILL.md` | 004 | remove | Skill doc rows name the tie-break and order evals |
| `.skilled/skills/system-skill-advisor/feature-catalog/feature-catalog.md` | 004 | remove | Catalog row points at the Jev and Deem eval |
| `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/suggested-order-eval.md` | 002 | remove | Feature page for the order eval's Deem arm |
| `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/tie-break-eval.md` | 002 | remove | Feature page for the tie-break eval's Deem pick |
| `.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md` | 004 | remove | Playbook index row names SC-006 Jev and Deem |
| `.skilled/skills/system-skill-advisor/manual-testing-playbook/scorer-fusion/suggested-order-eval.md` | 002 | remove | SC-007 scenario confirms a failed Deem gate skips |
| `.skilled/skills/system-skill-advisor/manual-testing-playbook/scorer-fusion/tie-break-eval.md` | 002 | remove | SC-006 scenario includes one local --deem run |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md` | 002 | remove | README rows name both evals' --jev/--deem switches |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs` | 002 | remove | Scorer's DEEM constants, gate and tie-break arm |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs` | 002 | remove | Scorer's DEEM constants and local Deem arm |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` | 003 | remove | Advisor graph carries cli-deem in its family data |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/README.md` | 002 | remove | Parity README rows name the evals' stub backends |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/score-jev-tiebreak.vitest.ts` | 002 | remove | Test stubs cli-deem, covers the deem gate |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/score-suggested-order.vitest.ts` | 002 | remove | Test stubs cli-deem and judges the deem column |
| `.skilled/skills/system-spec-kit/README.md` | 004 | remove | README rows name four measurements' --deem arms |
| `.skilled/skills/system-spec-kit/SKILL.md` | 004 | remove | Skill doc rows name measurements' --deem arms |
| `.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md` | 004 | remove | Catalog entries name scorer --deem arms |
| `.skilled/skills/system-spec-kit/feature-catalog/retrieval/track-narrowing-measurement.md` | 002 | remove | Feature page for the narrowing scorer's two arms |
| `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/alignment-suggestion-measurement.md` | 002 | remove | Feature page for alignment suggestion's --jev/--deem arms |
| `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/compaction-recall-census.md` | 004 | remove | Census page names stub jev and cli-deem binaries |
| `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/completion-claim-audit.md` | 002 | remove | Feature page for the audit's --deem and --jev arms |
| `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/debug-next-check.md` | 002 | remove | Feature page for the scorer's two backend arms |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/retrieval/track-narrowing-measurement.md` | 002 | remove | Scenario confirms the Deem arm skips a stub |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/alignment-suggestion-measurement.md` | 002 | remove | Scenario runs the align scorer's deem arm |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/compaction-recall-census.md` | 004 | remove | Scenario places stub jev and cli-deem binaries |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/completion-claim-audit.md` | 002 | remove | Scenario runs the audit's deem arm against a stub |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/debug-next-check.md` | 002 | remove | Scenario runs the deem arm against stub backends |
| `.skilled/skills/system-spec-kit/runtime/cli/evals/README.md` | 002 | remove | Evals README names the scorer's --jev/--deem columns |
| `.skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts` | 002 | remove | Scorer's DEEM constants, backend param and arm |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/README.md` | 002 | remove | Retrieval README names the narrowing scorer's --deem |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/corpus-manifest.json` | 004 | remove | Corpus manifest lists cli-deem docs; regenerate hash |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/generation-diagnostics.json` | 004 | remove | Diagnostics fixture rows for cli-deem docs; counts stale |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/phrase-variants.json` | 004 | remove | Generated phrase variants for cli-deem docs and headings |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs` | 004 | keep | Ignore-list entries for model cards under specs; stay |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs` | 002 | remove | Scorer's DEEM ARM section and --deem flag |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/score-alignment-suggestion.vitest.ts` | 002 | remove | Test stubs cli-deem and runs the --deem arm |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/score-track-narrowing.vitest.ts` | 002 | remove | Test covers deem gate, arm, verdicts, stub binaries |
| `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` | 004 | remove | Generated trigger index carries cli-deem doc entries |
| `.skilled/skills/system-spec-kit/runtime/scripts/README.md` | 002 | remove | Scripts README rows name two audits' --deem arms |
| `.skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/README.md` | 002 | remove | Module README maps the deem gate and arm zones |
| `.skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs` | 002 | remove | Scorer's DEEM_MODEL, keep threshold and arm |
| `.skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/README.md` | 002 | remove | Module README names the scorer's two arms |
| `.skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs` | 002 | remove | Scorer's DEEM_MODEL, DEEM_P50_MS and arm |
| `.skilled/skills/system-spec-kit/runtime/tests/compaction-recall.vitest.ts` | 004 | remove | Test places stub jev and cli-deem binaries |
| `.skilled/skills/system-spec-kit/runtime/tests/completion-claim-audit.vitest.ts` | 002 | remove | Test stubs cli-deem and exercises the deem arm |
| `.skilled/skills/system-spec-kit/runtime/tests/debug-next-check.vitest.ts` | 002 | remove | Test stubs cli-deem and exercises the deem arm |
| `README.md` | 004 | rewrite | Root README names the hub's Jev and Deem transports |
