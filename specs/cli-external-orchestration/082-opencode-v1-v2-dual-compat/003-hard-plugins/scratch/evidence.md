# 003 evidence ledger (orchestrator-run)

The orchestrator ran every command below in the build worktree. The output files are in this folder. Decisions 1 to 13 are in decisions.txt.

## Baseline (before any change)
- baseline-floor.txt: the phase 2 plugin suite floor is 331 pass, 0 fail.
- status-before.txt: git status at the phase start.
- hard-5.txt: the five hard plugins: opencode-goal, sk-vision, system-completion-sentinel, system-skill-advisor, system-spec-gate.
- sk-vision-build-before.txt: dist/plugin.js before the port, 504601 bytes.
- phase1-answers.txt: the phase 1 verdicts on Q5, Q6, Q7 and Q11, plus a live re-probe. v2 2.0.32 sends no `session.idle`. The end of a turn is `session.execution.succeeded`. Compaction ends with `session.compaction.ended`, and there is no `session.compacted`.
- v2-types.txt: DeepSeek's read-only survey of the v2 types (T004).

## Red first
- hard-before.txt: tests/v2-hard-plugins.test.cjs against the unported tree. 9 tests, 0 pass, 9 fail. All five registration cases fail, and so do the four behaviour cases (sentinel, spec gate, goal queue, advisor).

## Ports
- The four JavaScript hard plugins export `dualPlugin(id, server)` from lib/v2-bridge.js (decision 5). The bridge carries the v2 leg in one place, and each v1 hook body stays unchanged.
- The seams moved to lib/completion-sentinel-core.js and lib/opencode-goal-core.js. The spec-gate seam is removed because no test read it (decision 2).
- sk-vision registers its command through `ctx.command.transform` on v2 and keeps `command.execute.before` on v1. The named export SkVisionPlugin is removed (decision 3), and the package pin stays (decision 4).
- The bridge maps v1 client calls onto v2 session calls. `session.promptAsync` becomes `ctx.session.prompt` with `delivery: 'queue'` (lib/v2-bridge.js:148). The context hook registers through `ctx.session.hook('context')` (lib/v2-bridge.js:351), and the tool map goes through `ctx.tool.transform` (lib/v2-bridge.js:367).
- port-a-tests.txt (50 of 50) and port-b-tests.txt (138 of 138) are the per-port runs. The goal tool-path test needed one orchestrator fix, `testDir` to `__dirname` (decision 6).

## Live v2 proof (two short model runs, approved by the operator)
- live-probe/run1-output.txt and live-probe/run2-events.jsonl: real v2 runs on llmgateway/deepseek-v4.1-flash with a probe plugin. They proved the event names in phase1-answers.txt. This is the one deviation from CHK-031 (no paid model call). The operator approved these two runs only.

## Review and fixes
- review-003.txt: DeepSeek findings-first review (T023). P0 none. Four P1s and four P2s. Leads 1 (the compaction half), 2, 3, 4, 5, 6 and 7 were refuted with evidence.
- decisions.txt 8: the orchestrator confirmed each P1 before the fix. decisions.txt 9: the P2s and the dropped abort signal are recorded as v2 gaps.
- fix-003-report.txt: Luna's fix run. It added alias dedupe per session, the AI_SESSION_CHILD test isolation, the base64 data URL in sk-vision, and the goal evidence and usage aliases (`session.text.ended` to `message.part.updated`, `session.step.ended` to `message.updated`).
- decisions.txt 10: the orchestrator wrapped two more spec-gate cases for the child environment.
- decisions.txt 11: unconfirmed limitation. If v2 step tokens count one step, a multi-step assistant message is undercounted.
- decisions.txt 12: the sk-vision helper export `toV1FileUrl` is not loaded as a plugin on v1 (throwaway probe) or v2 (active in the load check).
- review-003-verify.txt: DeepSeek verification of the fixes. Findings 1 to 4 are closed. There is no new P0 or P1, and the verdict is PASS. Its P2 note N2 (no idle alias after a failed or interrupted v2 turn) is recorded as gap 9f in decisions.txt 14.

## Final state (after the fixes)
- hard-after.txt: 10 tests, 10 pass, 0 fail. Each of the 9 names that failed in hard-before.txt passes. The tenth case is the goal evidence case the fix added.
- fix-v2-tests.txt: v2-bridge, v2-registration and v2-hard-plugins, 50 tests, 50 pass.
- suite-after.txt: the plugin suite `node --test .opencode/plugins/tests/` with AI_SESSION_CHILD unset. 353 tests, 353 pass, 0 fail (floor 331).
- suite-after-fix-child.txt: the same suite with AI_SESSION_CHILD=1. 353 tests, 353 pass, 0 fail.
- sk-vision-build-after-fix.txt: typecheck exit 0, build exit 0, dist/plugin.js 506257 bytes, bun test 29 pass, 0 fail. sk-vision-build-after.txt is the earlier pre-fix build.
- v1-harness-after-003.jsonl: the phase 1 v1 harness, 16 of 16 loaded, with sk-vision on `command.execute.before`.
- v1-tool-ids-after-003.json: a private v1 1.19.3 `opencode serve`, 18 tool ids, the same as the baseline.
- v1-load-after-003.txt: `opencode debug config` on v1. All 16 plugin paths are listed, with 0 `failed to load plugin` lines. This lists the configured plugins. The harness and the tool ids are the load proof.
- v2-after-003.json and v2-active-003.txt: a private v2 2.0.32 `opencode2 serve`, GET /api/plugin filtered to this worktree. 16 entries, 16 active, including all five hard plugins.
- drift-after-fix.txt: run-all-drift-guards.sh, exit 0, all 4 guards passed, 9 non-blocking warnings in files outside this phase.
- grep-checks-003.txt: one `export default` per entry module, and sk-vision also exports the helper `toV1FileUrl` (decision 12). No `__test` in the entry modules. No `@opencode-ai/plugin/tool` import under .opencode/plugins. No `default(` call in the goal or advisor tests. No `return null` line changed in the four JavaScript entry modules, so REQ-011 has no guard to replace.
- scope-check-003.txt: the new paths since status-before.txt. Four are outside the spec.md section 3 list, and decision 13 rules each one in scope.
- service-state.txt: the v2 background service PID 46220 has the same start time as in phase 2, so it was not restarted. The AC-008 grep finds no service command in the captures.

## Not observed live
- A bridged tool's execute on v2 (it needs a further model run, which the operator has not yet approved).
- Live delivery of `session.created` and `session.deleted` on v2.
- Whether v2 `session.step.ended` tokens count one step or the whole message (decision 11).

## Credential scan
- `grep -i -E 'api[_-]?key|secret|password|bearer'` over this folder matches only test names and the run2.py code that reads the server password into a variable. phase1-answers.txt held one literal password of a private, already-killed probe server. It is redacted to `$OPENCODE_PASSWORD`, and the file was never committed.
