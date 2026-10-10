# Iteration 5 — security (final pass)

## Dimension
security. Cross-cut focus from the dispatch: untrusted stdin in the three hooks that adopted the shared deadline reader (oversized input; invalid JSON at or after the deadline; a late write after the deadline), interpolation or shell injection in run-all-drift-guards.sh, the prevent-overengineering read of each fix, and a full regression run of the five suites next to the touched scripts. Untrusted-content guard: nothing in the reviewed artifacts read as an instruction; all reviewed content was treated as data.

## Files Reviewed
- [SOURCE: .skilled/hooks/shared/hook-adapter-shared.cjs:20] — shared readStdin the three hooks now call; settled guard (:23), unconditional chunk push (:26), settle-on-end (:27), listener removal plus pause (:39–:44), 3000 ms default timer (:47).
- [SOURCE: .skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs:388] — JSON.parse(await readStdin()); fail-open catch exits 0 (:389–:390); deny envelope is JSON.stringify'd (:369, :372).
- [SOURCE: .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs:84] — same read; fail-open approve() (:85–:86); kill-switch checked before the read (:81).
- [SOURCE: .skilled/skills/sk-vision/hooks/devin/sk-vision.mjs:63] — same read; fail-open emit({}) (:64–:65); stderr stays empty by test.
- [SOURCE: .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh:42] — tee to a mktemp file (:40), grep -c warn count (:44), arithmetic (:45), cleanup (:55), quoted guard invocations (:59–:78).
- [SOURCE: .skilled/skills/sk-code/sk-code-webflow/assets/scripts/test-minified-runtime.mjs:442] — cap warning print; skip counter (:42); MAX_SYNC_CALLBACK_DEPTH at (:30).
- Tests read and run: stdin-deadline.test.mjs (LATEST_EXIT_MS at :26, cases at :47), sk-vision-devin.test.mjs (:130 known dist case), pi/git-message-gate.test.ts (:10 vitest import, :13 wrapper import).
- Diff reads for the overengineering pass: git diff 1d078f3356^..d1741a28f7 over the five changed code files; git diff --name-only for the shared helper returned 0 — the helper is untouched by the range.

## Findings by Severity
### P0
None.
### P1
None.
### P2
None new. R2-P2-001 (dead spec citation, .skilled/skills/sk-code/sk-code-webflow/references/performance/webflow-constraints.md:168) and R3-P2-001 (provenance clause) remain open; this iteration produced no new evidence on either and does not re-report them.

## Focus Evidence
1. Late write after the deadline — after settlement the reader removes the data, end and error listeners and pauses stdin, and the settled flag makes a second settle unreachable [SOURCE: .skilled/hooks/shared/hook-adapter-shared.cjs:23], [SOURCE: .skilled/hooks/shared/hook-adapter-shared.cjs:39]. Probe: partial payload held open 4 s, then completed; the hook had already exited 0 with {} and the late bytes changed nothing. The open-stdin suite observes self-exit at ~3032 ms [SOURCE: .skilled/skills/sk-git/scripts/hooks/stdin-deadline.test.mjs:47]. Ruled out.
2. Invalid JSON at the deadline — a cut payload cannot parse, and every hook catches the parse failure into its documented fail-open path (gate exit 0, preflight approve, Devin empty object) [SOURCE: .skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs:389], [SOURCE: .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs:85], [SOURCE: .skilled/skills/sk-vision/hooks/devin/sk-vision.mjs:64]. No crash path, empty stderr. Matches the already-registered fail_open_semantics disposition; not re-entered as a finding.
3. Oversized input — a 32 MiB valid payload through the Devin hook: exit 0, output {}, pipeline wall 0.04 s, peak RSS 196,804,608 bytes (~5.9x input). The shared reader caps nothing [SOURCE: .skilled/hooks/shared/hook-adapter-shared.cjs:26], but it predates the range (0 changed files in the range) and is the canonical reader for 56 files; the three hooks join it and add no buffering of their own [SOURCE: .skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs:40]. Growth is process-local and linear, the 3 s deadline bounds time rather than size, and the failure mode is fail-open exit 0. Ruled out with a residual note: a byte cap would be a corpus-wide reader decision, not a defect this commit introduced.
4. Injection in run-all-drift-guards.sh — every expansion reaches its command quoted ("$@", "${out}", "${warn_count}"), warn_count is a grep count, guard names are literals, the temp path comes from mktemp [SOURCE: .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh:42], [SOURCE: .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh:44]; no eval, source, or base64 anywhere; bash -n passes; the umbrella exits 0 and the printed total (272) equals the counted warnings. Ruled out.
5. prevent-overengineering — each fix was checked against .skilled/repo-rules/prevent-overengineering.md:43. The three hooks swap a local unbounded reader for the existing shared deadline reader; the helper is untouched in the range; no new option, env var, flag, fallback, or abstraction layer is added; the two new counters (warnings in the guard umbrella, skipped_callbacks in the runtime test) are exactly the state their findings needed. run_guard was extended in place, not duplicated. Pass — no overengineering finding.

## Regression Runs
- sk-git hooks: node --test .skilled/skills/sk-git/scripts/hooks/ — 10 tests, 9 pass, 1 fail. Both stdin-deadline cases pass (gate and preflight self-exit at ~3032 ms). The sole failure is .skilled/skills/sk-git/scripts/hooks/pi/git-message-gate.test.ts under node --test: ERR_MODULE_NOT_FOUND resolving its extensionless './git-message-gate' import. The file declares a vitest suite [SOURCE: .skilled/skills/sk-git/scripts/hooks/pi/git-message-gate.test.ts:10], the pi README documents it as the vitest suite, no vitest config or binary exists for the sk-git package in this worktree, and the file is untouched by the range. Characterized as a runner mismatch, not a regression.
- sk-vision hooks: node --test sk-vision-devin.test.mjs — the only failing test is the known 'resolves a built entry' case (vision-runtime/dist is not built in this worktree); every other case passes.
- sk-code-opencode guard tests: node --test scripts/tests/ — 17 tests, 17 pass, exit 0.
- Drift guards: bash run-all-drift-guards.sh — exit 0, all 4 guards PASSED, 272 non-blocking warnings, matching iteration 2's count.
- Webflow runtime test: known-good fixture 2/2 pass, exit 0, exactly one cap warning ('1 callback(s) past depth 20') at [SOURCE: .skilled/skills/sk-code/sk-code-webflow/assets/scripts/test-minified-runtime.mjs:442]; known-bad fixture 4/4 fail, exit 1. Both as specified.
- deep-improvement mirror: node check-agent-mirror-sync.cjs --all — 12 agents checked, all mirrors in sync, exit 0. Its vitest family, run from deep-improvement/scripts where the config lives [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/vitest.config.mjs:11]: 3 files, 13/13 tests pass, exit 0. (A first attempt from the package root found no tests; the config's include is */tests/**/*.vitest.ts, corrected invocation noted.)

## Traceability Checks
- spec_code: no new security-relevant claims in the five phases beyond the deadline behavior, whose implementation matches the shared helper [SOURCE: .skilled/hooks/shared/hook-adapter-shared.cjs:20]; iteration 4's carrier/changelog verification carries forward.
- checklist_evidence: unchanged — the five phases closed through their goal criteria, and this iteration adds the regression-suite evidence above without reopening any criterion.
- Overlay: agent_cross_runtime — mirror checker and its vitest family green (above). skill_agent, feature_catalog_code, playbook_capability unchanged this iteration.

## Ruled Out
- Shell injection or interpolation in run-all-drift-guards.sh: quoted expansions, no eval/source, fixed guard literals, syntactic check clean, live run green (272 warnings counted and printed).
- Oversized stdin as a defect of this range: no cap exists, but the unbounded reader is the pre-existing corpus-wide helper (56 files) the hooks adopt; process-local linear growth, deadline-bounded, fail-open. Residual noted, not filed.
- Invalid JSON at the deadline: parse failure lands in each hook's fail-open branch; no crash, empty stderr.
- Late write after the deadline: listeners removed and stdin paused after settle; single-settle guard; late bytes cannot mutate the decision.
- Overengineering: no new abstraction, option, flag, or fallback; two minimal counters; helper reuse instead of new code.
- pi/node --test failure as a range regression: the file is untouched by the range (git diff --name-only proof) and fails at vitest-resolver-dependent module resolution, not behavior.

## Not Proven
- Whether pi/git-message-gate.test.ts passes under its intended vitest runner in an environment that can resolve vitest and the Pi extension package: not established here; no vitest binary or config for the sk-git package exists in this worktree.
- That node --test over the sk-git hooks directory would exit 0 in this environment: it exits 1 by the runner mismatch alone, independent of the reviewed range (the file is unchanged in the range).

## SCOPE VIOLATIONS
None. No out-of-scope mutation was attempted; the only writes are the three allowed artifacts plus the append gateway's own state writes.

## Verdict
P0=0, P1=0, P2=0 new this iteration. Security closes the four-dimension coverage matrix. Every assigned probe is accounted for: oversized input, deadline-cut invalid JSON, late write, shell injection, overengineering, and the five regression suites. The only non-green items are the two characterized non-defects (known sk-vision dist case; pi vitest suite under the wrong runner). PASS, with the two pre-existing P2s carried open and no advisories added.

## Next Dimension
None — iteration 5 of 5; all four dimensions covered. Open items for a follow-up: R2-P2-001 and R3-P2-001.

Review verdict: PASS
