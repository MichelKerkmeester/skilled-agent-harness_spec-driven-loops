# Session evidence: phase 038 build (orchestrator record, 2026-09-30)

Branch `worktrees/071-cli-jev-sk-alignment` (worktree 071). Raw outputs sit beside this file.

## Operator decisions

- "Plan the integration": an opt-in Pi transport for Jev `choice`, documented for cli-pi workers.
- Mid-build, 2026-09-30: "Sont use mimo anymore, only use deepseek v4.1 flash through cli pi cline provider and opencodego provider AND SWE 2 max through cli devin AND LUNA 6 max fast through cli codex". The MiMo review that had started was stopped before it reported, and the roster amendment is commit `c5c72d31ec`.

## Executors

- DeepSeek V4.1 Flash on cli-pi (Cline, xhigh) wrote everything, all STATUS DONE: the design, M1 the module and its tests (steps 1 to 5), M2 the two caller opt-ins with before and after recordings (steps 6 and 7), M3 the docs (steps 8 to 12), and the env-switch test after review.
- SWE 2 max on cli-devin reviewed (`review-swe2-r1.txt`, 979 s): VERDICT PASS, all five criteria met.

## What was built

- `.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs`: `resolveTransport`, `choiceRequestFrom`, `classifierContextFor`, `choicePayloadFor`, `spawnClassifierCall`. `JEV_TRANSPORT` in the caller's env or a `transport` option picks Pi. Only a `choice` request reaches Pi. Package, model, credential and backend gates each print one skip line and fall back to the jev CLI. No top-level await, so `.cjs` callers can `require` it. No credential read.
- Callers opted in with one `require` and one call-site line each: `sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs` and `score-clarify-default.cjs`. The 037 scorer's CLI arm was rejected by design (it is the CLI column of a measurement).
- Docs: `cli-jev/SKILL.md` Transport Selection (version 0.1.2.0 to 0.1.3.0, changelog `v0.1.3.0.md`), `cli-pi/SKILL.md` classifier section (1.5.12.0 to 1.5.13.0, changelog `v1.5.13.0.md`), catalog entry `feature-catalog/measurements/pi-transport-integration.md` and playbook scenario `manual-testing-playbook/measurements/pi-transport-integration.md` with their index rows.

## Gates from the final state

- Criterion 1: `leaf-route-replay.before.txt` and `.after.txt` (59 lines) and `score-clarify-default.before.txt` and `.after.txt` (202 lines) are byte-identical with `JEV_TRANSPORT` unset. The reviewer re-ran the HEAD source in memory and reproduced each before file byte for byte, and the current tree reproduced each after file. The runs drive 16 and 91 jev calls through the changed call site.
- Criterion 2: `transport-tests.txt` 22 pass, 0 fail, including the switch-on path through the option and through the env.
- Criterion 3: one test per gate (package, model, credential, backend throw, `stopReason: 'error'`, foreign pick, partial map, unknown switch value), each asserting one line and one CLI spawn.
- Criterion 4: 9 changed docs VALID. Hub playbook PASS, 8 scenarios, `warnings=0`. Catalog `cli-classifier` PASS. No cli-classifier version at or above 1.0.0.0.
- Criterion 5: the 13 runtime-tree callers stay listed in `spec.md` section 3 as a follow-up, untouched.
- Caller suites: leaf-route-replay 37 pass, score-clarify-default 28 pass, both equal to their baselines.
- Routing and sync: `g.txt` all hubs fresh (cli-classifier and cli-external-orchestration re-minted), `l.txt` leaf 15 of 15, `df.txt` derived 15 of 15, `h.txt` Hermes 72 in sync. `parent-skill-check` OK on both hubs, README manifest reproducible, README parity PASS.

## Review P2s

1. `calls.jsonl` in the callers writes `backend: "jev"` even when Pi answered. Recorded, not fixed: the module returns the CLI's contract on purpose, and naming the backend needs a caller record change.
2. No end-to-end test of the env switch reaching Pi. Fixed: `spawn_call_environment_switch_answers_through_pi`.
3. The package gate accepts any Pi version while the 037 verdict holds for 0.99.1. Recorded.
4. Closure docs were still stubs at review time. Closed by this record.
