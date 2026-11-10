# 002 evidence ledger (orchestrator-run)

Every command below was run by the orchestrator in the build worktree. Output files are in this folder. Decisions 1 to 14 are in decisions.txt.

## Baseline (before any change)
- baseline-floor.txt: plugin suite 303 pass, 0 fail.
- status-before.txt: git status at the phase start.
- 001 baseline (../../001-unknowns-and-baseline/baseline.json): v1 16 of 16 loaded, v2 0 of 16 active.

## Red first
- negative-control-registration.txt: v2-registration.test.cjs run before any port: 11 tests, 0 pass, 11 fail, each on "default export must be a non-function object".

## Final state
- suite-final.txt: plugin suite `node --test .opencode/plugins/tests/*.test.cjs`: 331 tests, 331 pass, 0 fail (floor 303; the 28 added are 11 registration and 17 bridge tests).
- suite-after-port.txt and suite-after-port-2.txt: an earlier full run had one failure, the timing test "cache TTL starts when CLI work completes", under heavy machine load. It passed 3 of 3 runs alone, passes on main, and passed in the next full run (328 of 328). Recorded as a load-dependent timing test, not a regression.
- registration-final.txt: 11 tests, 11 pass.
- bridge-final.txt: 17 tests, 17 pass.
- classifier-tests.txt: classifier scorer and hook tests, 78 of 78 pass, the same as main.
- v1-harness-final.jsonl: the 001 v1 harness, 16 of 16 loaded, 0 differences from the 001 baseline rows, including hook keys.
- v1-tool-ids-final.json: a private v1 1.19.3 `opencode serve`, GET /experimental/tool/ids returns 18 ids, identical to the 001 baseline, including the 4 plugin tools.
- v2-plugin-final.json: a private v2 2.0.32 `opencode2 serve`, GET /api/plugin filtered to this worktree: 16 entries, 11 active. All 11 ported plugins are active. The 5 failing are the 5 hard plugins, which phase 3 ports: opencode-goal, sk-vision, system-completion-sentinel, system-skill-advisor, system-spec-gate.
- The oracle is ../../scratch/oracle.py (v1 and v2 modes, password never printed).
- grep-checks.txt: pins (.opencode: @opencode-ai/plugin 1.19.3, zod 4.1.8, no devDependencies; .skilled: 1.19.3, zod, @opencode/plugin 2.0.32 in devDependencies), no @opencode/plugin in .opencode/package.json, no @opencode-ai/plugin/tool import left, no __test on the 11 entry modules, exactly one export (the dualPlugin default) per entry module, and the changed paths.
- scope-check.txt: the earlier scope capture. Paths under .skilled/hooks/dispatch/lib and cli-opencode/hard-rules.json in it belong to phase 5, which was edited at the same time and is committed separately in d0a4be2080.
- replay-session-event.mjs and .txt: v2 session.created, session.deleted and session.updated events reach a v1 event hook with properties.info.id set. message.updated keeps its own info.

## Reviews
- review-1-bridge.log: DeepSeek review of the bridge, 1 P1 and 4 P2, all fixed (decision 9).
- review-2-phase.log: DeepSeek whole-phase review, 2 P1 and 3 P2. The seam P1 was an orchestrator brief error, fixed per the spec (decision 12). The session-payload P1 is fixed (decision 13). The 3 P2s are doc rows, fixed in this closeout (decision 14).

## Deviations to record in the spec docs
- Decision 8: one shared bridge (lib/v2-bridge.js) builds every v2 setup leg from the unchanged v1 server, instead of 11 hand-written setup bodies.
- Decision 10: the scope adds score-injection-screen.mjs, the import-time argv[1] fix for the Bun-compiled v2.
- Decision 9: tool results convert to v2 { content, metadata }. A live v2 execute of a bridged tool is not yet observed, owed before phase 3 closes.
- Decision 13: v2 session event delivery is unit-tested and type-checked, not observed live.

## Round 2 captures (orchestrator-run)
- service-state.txt (AC-005, T031 service clause): the v2 background service is PID 46220, started 12:18:22 on 2026-10-18, before the phase began at 867b83b671 (16:16:59). It is the same PID now, so no step stopped, started or restarted it. The only run-log lines naming the service commands are quoted rule and criteria text, listed in full there. The oracle script names none.
- scope-check.txt and status-after.txt (AC-009, T028, CHK-050): the rerun after the xcrun_db removal, with each changed path attributed: this phase's files, the parent oracle (decision 11), the classifier file (decision 10), phase 3 preparation captures under 003-hard-plugins/scratch/, and the phase 5 paths, now committed in d0a4be2080. xcrun_db was an xcrun cache the codex sandbox wrote into the working directory, removed with operator approval.
- child-refusals.txt (CHK-022): 38 non-zero command exits across the phase 2 implementer logs, none with a sandbox or permission denial. No check was refused, and the orchestrator ran every check outside the sandbox.
- doc-agreement.txt (CHK-040): 31 open task lines at the plan commit 2676c846c3 before any tick, task ids T001 to T031 in tasks.md, and every spec.md section 3 file named in tasks.md except four: the two lock files, lib/v2-bridge.js and score-injection-screen.mjs. The bridge and the classifier file come from decisions 8 and 10, made after the plan. The lock files change with the pins.
- decisions.txt decision 15: T031 and CHK-051 keep every cited capture and remove only uncited working files. No temporary database or serve log was ever in scratch/.
