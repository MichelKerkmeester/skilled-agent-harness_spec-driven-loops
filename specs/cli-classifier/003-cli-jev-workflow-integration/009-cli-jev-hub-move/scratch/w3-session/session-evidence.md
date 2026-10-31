# 009 session evidence: verification, review, fixes and commits

The orchestrator session's record for phase 009. The session reran every gate from the final state itself; where this file and `../w3-build/build-evidence.md` disagree, this file wins.

## 1. Baselines

Taken by the session at clean HEAD `3dde18cb54` before any move: `../baselines.md`, raw outputs in `../baseline-raw/`, the 17-prompt route baseline in `../route-baseline.txt`, prompts in `../prompts.txt`. The 17 prompts hold the 7 canary prompts and the hub-routing scenario prompts the spec names as 10, plus phrasing variants, so the 10 are a subset.

## 2. Moves and build

The session ran `git mv` for 70 hub files and for the rollout child and activation folders in both trees, staged, before the build orchestrator started. The build orchestrator (fresh Opus 5.5 xhigh leaf) ran 62 executor dispatches, Devin `deepseek-v4-1-flash-max` 16 and Pi `llmgateway/mimo-v2.6-pro` 46, all exit 0, and reported PASS with its record in `../w3-build/build-evidence.md`.

## 3. Session verification from the final state

- Replay: `replay.sh cli-classifier` then `compare-replay.py ../route-baseline.txt route-after-session.txt` (the session's own comparer, which also compares packetKind, backendKind and the exit code): `rows 17 after 17 mismatch 0`, exit 0. Rerun at committed HEAD `c0178c093d`, output in `compare-output.txt`.
- Deem prompts through `--hub cli-classifier`: "ask deem to pick a queue locally", "use the local deem classifier to score these three severity levels" and "use deem choice to pick one option" each route single `cli-deem`, compiled, policy hash `63c0e7c4...`, generation 1.
- `compiled-route-status.cjs --all` exit 0: 7 fleet hubs compiled (cli-classifier gen 1, cli-external-orchestration gen 5, mcp-tooling, sk-code, sk-design, sk-doc, system-deep-loop), plus the 2 legacy test rows present at baseline. No `cli-jev` row.
- `compiled-route-guard.cjs` exit 0, 7 hubs fresh including `cli-classifier`, before and after the commit's re-mint.
- `compiled-route-admission.cjs --hub cli-classifier` exit 0, 5 pass 0 drift. `--all` exit 0, every hub passes.
- `compiled-route-sync.cjs --check` exit 0 (all 7 hubs resolve), `--verify` exit 0 (move-simulation OK).
- `parent-skill-check.cjs` exit 0 on `cli-classifier` (3b: 2 modes, 13a and 13b at 1.1.0.0) and on `cli-external-orchestration`.
- `compiled-route-manifest.cjs freshness` `fresh: true` on `cli-classifier` and `cli-external-orchestration`, before and after the commit.
- Suites against `../baselines.md`: foundation vitest 37 passed (baseline 37). Manifest test 42 tests 28 pass 14 fail, failing names identical to baseline. Dispatch audit vitest 75 passed (75). Dispatch rule-checks `node --test` 20 of 20 (20). Advisor full suite 130 files, 1030 passed, 6 skipped, exit 0 (the recorded wave-3 figure 130 / 1030 / 6). Fan-out merge vitest 61 passed, and the file holds 61 tests at HEAD and after (the diff changes two fixture source paths only).
- Comment hygiene over every added line in `*.cjs`, `*.mjs`, `*.ts` and `*.js`: no spec path, phase or packet number, REQ, task, ADR or finding id.
- `validate_document.py` on every changed skill doc (64 `.md` files outside `specs/`, changelogs and dated reports): all exit 0 except 5 files that moved at 100 percent similarity with no byte changed (`cli-usage/assets/question-shaping-card.md` and `cli-usage/references/{cli-reference,integration-patterns,mcp-server,providers-and-models}.md`); their HEAD copies fail the same way (missing `overview`), so the build changed none of them.

## 4. Cross-family review

Split by author family, read-only. Pi MiMo reviewed what Devin DeepSeek wrote, Devin DeepSeek reviewed what Pi MiMo wrote. Briefs `review-brief-pi.md` and `review-brief-devin.md`, outputs `review-pi-r1.txt` and `review-devin-r1.txt`. `git status --porcelain` and the SHA-1 of `git diff HEAD` and `git diff --cached` were equal before and after, so neither wrote to the tree. Both printed `VERDICT: FAIL`.

P1 findings:
1. Both: the REQ-008 grep printed 4 generator outputs. Closed by the commit sequence: `test_readme_verdict_parity.py --write` after staging, then the trigger index rebuild from committed content (`c0178c093d`). After it, `git grep -l '\.skilled/skills/cli-jev/' -- . ':!specs' ':!**/changelog/**' ':!**/benchmark/reports/**'` prints nothing.
2. Pi: the `008-cli-classifier` canary harness recorded outcomes without asserting the fixture's expectations. Confirmed by the session: 6 of 7 rollout harnesses, HEAD's `008-cli-jev` included, had no such check, and only `009-sk-design` did. Fixed in fix round 1 (`fix-brief.md`, evidence `../w3-build/fix-1/fix-evidence.md`): Devin added `assertGoldExpectations` (action, selection kind, modes, intents, resources), byte-identical in the twin. Negative proof: `threw code=GOLD_MISMATCH message=gold mismatch for deem-choice-single: modes [cli-deem] but expected [cli-jev]`. Gates after the fix: sync, guard, admission, freshness exit 0, foundation 37 passed. The fix leaf's own Pi check made no tool calls, so the session reran it with the diff pasted into the brief: `review-pi-fix-r2.txt`, findings none, `VERDICT: PASS`, tree unchanged.

P2 findings, recorded, not chased (parent D5):
1. `cli-classifier/hub-router.json`: `cli-classifier` and `cli classifier` are no longer `cli-deem` aliases, so "run the cli-classifier on this" defers where 008's one-mode hub routed it to `cli-deem`. Intended: the hub name picks no single mode once the hub has two.
2. `004-cli-external-orchestration/fixtures/canary-cases.v1.json:201-214` `jev-transport-single` still expects `cli-jev`, while that hub now defers the prompt. The spec keeps that expectation as written, and that harness reads no `expectedModes`.
3. "use jev and deem to score this" routes single `cli-deem` (dispatch-phrase scores 8 against 4). An alias prompt naming both gives `orderedBundle [cli-jev, cli-deem]`, so REQ-009 holds.
4. `system-spec-kit/feature-catalog/governance/feature-flag-governance.md:56` and `sk-doc/sk-create-skill/references/parent-skill/compiled-routing-architecture.md:34` list 5 compiled hubs. Predates this phase.
5. `.skilled/bin/tests/compiled-route-manifest.test.cjs:1127` asserts a cohort of 6 against 7. In the recorded baseline failures, unchanged.

Fix round 1 also made the moved `cli-usage/manual-testing-playbook/manual-testing-playbook.md` pass `validate_document.py` (auto and `--type playbook`, 0 issues), since the build had changed a row in it: sections renamed and moved, 22 scenario rows unchanged, rename similarity 94 percent.

## 5. Commits (worktree 069, branch `worktrees/069-cli-jev-workflow-integration`, not pushed)

- `ea883967d4` refactor(cli-classifier): the move, merges, literal lists, compiled onboarding, harness assertion, docs, mirrors and regenerated artifacts. 177 paths. `git show -M --name-status` holds 70 renames and 11 `D` rows under `.skilled/skills/cli-jev/`, the 11 named merges, and every changelog row is R100. After it `git ls-files .skilled/skills/cli-jev` prints 0 lines and the folder does not exist. The pre-commit route-remint gate re-minted `cli-classifier` and `cli-external-orchestration` and staged both manifests, and the guard and freshness stayed fresh after.
- `347f9db711` docs(cli-jev): the 2026-09-29 spec amendments (009 released on 008 Complete, Jev first) and the live 017 Jev run record.
- `c0178c093d` chore(system-spec-kit): trigger index and retrieval fixtures rebuilt from an archive of HEAD. Generator check: 23,318 documents, 0 stale, 0 obsolete, 0 untrusted.

## 6. Deviations the session rules on

- REQ-007 wants the trigger index in the move commit. The index is built from an archive of HEAD, so it follows the move in its own commit `c0178c093d`, as every earlier phase of this packet did. The advisor graph is in the move commit.
- REQ-002, REQ-006 and the goal criteria name 10 prompts. The baseline and the replay hold 17, a superset of the 10.
- `hub-routing/` holds 5 scenarios covering the 3 cases REQ-012 names (cli-deem, cli-jev, out-of-domain), because REQ-013 keeps and rewrites CJ-001 and CJ-002.
- Generator output absorbed older drift: `durable-directory-manifest.json` gained `.skilled/hooks/goal/lib` and the 008 `cli-classifier` folders, and `baseline-readme-verdicts.json` gained 43 tracked READMEs committed since its last write (30 of them in this packet), with only the 3 merged hub READMEs changing verdict (fail to pass). Both are whole-file generators.
- The authored twin's `014-runtime-engine/lib/{compiled-route,resolve}.cjs` were edited with the runtime copies, because sync `--check` needs them equal.
- The agent-mirror-sync pre-commit gate could not load `@spec-kit/shared` in this worktree (`MODULE_NOT_FOUND`: `.skilled/skills/system-deep-loop/node_modules` is not provisioned here). Provisioning it is an install that needs the operator's yes (as phase 018 ruled for sk-doc), so the session ran the commits with `NODE_PATH` pointing at a scratch folder holding one link to this worktree's own `system-spec-kit/shared`. Every gate ran; none was bypassed. The checker printed `2 agent(s) checked — all mirrors in sync — OK` when run the same way by hand.
- The 5 byte-identical moved docs that fail `validate_document.py` are recorded above as a gap older than this phase.

## 7. Open for the operator

- Provision `system-deep-loop` in this worktree (`bash .skilled/skills/sk-git/scripts/worktree-naming.sh provision`, an install), or leave the `NODE_PATH` workaround as the record.
- The P2 findings above.
