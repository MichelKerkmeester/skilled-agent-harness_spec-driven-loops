The in-session handover does what its documentation says and all 937 of its tests pass, but I am requesting changes: one blocker and three required fixes, each reproduced against the code in the scratchpad.

SKILL ROUTING: User directed → `@review` agent with the sk-code review mode. The advisor's stale hint named system-spec-kit, which your explicit direction overrides.

## Focused File Review: in-session handover (session relaunch loop)

**Files reviewed**: 18 files, about 7,700 lines, read in full. There is no diff: this is the feature as it stands on `main`.
**Overall assessment**: REQUESTED_CHANGES
**Baseline used**: sk-code (`sk-code-review`)
**Surface evidence used**: SKILLED
**Quality gate evidence**: absent
Rule sources: hub:sk-code/shared/references/universal/code-quality-standards.md; hub:sk-code/sk-code-skilled/assets/checklists/universal-checklist.md; hub:sk-code/sk-code-skilled/assets/checklists/shell-checklist.md; hub:sk-code/sk-code-skilled/assets/checklists/javascript-checklist.md; hub:sk-code/sk-code-skilled/assets/checklists/typescript-checklist.md. Overrides: review.todo-tracking replace from hub:sk-code/sk-code-skilled/assets/checklists/universal-checklist.md. Refused: none. Ignored: none. Conflicts: none

Advisory score: 74/100. It informs and decides nothing.

- Correctness 22/30: the state machine is careful, and findings 3 and 4 are the gaps.
- Security 13/25: findings 1 and 2.
- Patterns 18/20: consistent module layout, one shared core, one withdraw helper.
- Maintainability 12/15: the core is 1,927 lines and the wrapper 1,088 lines of bash.
- Performance 9/10: bounded transcript tails and a cached flags read.

The score breakdown and the self-check below are bullets because the repository's reply rule bans tables.

## Findings

### P0 - Critical

1. [.skilled/bin/skilled-loop-shell.sh:189] The shell shim runs whichever `skilled-loop` the current directory tree holds
   - Case: with the shim sourced, the operator changes into any directory at or below one that contains `.skilled/bin/skilled-loop`, such as a cloned repository or an unpacked archive, and types `claude`. `skilled_loop_find_wrapper` (lines 160 to 172) returns that file and line 189 runs it with `bash`.
   - Evidence: I planted a fake wrapper in a scratchpad tree, sourced the shim in a terminal session and typed `claude 'hello'` two directories below it. The fake wrapper ran under your account and received `claude hello`.
   - User impact: any repository you open can run code as you the moment you start a runtime in it, before the runtime itself starts. The same holds for `pi`, `opencode`, `codex`, `devin` and `cursor-agent`.
   - Finding class: class-of-bug. Scope proof: `rg -n "skilled_loop_find_wrapper|skilled_loop_launch " .skilled/bin/skilled-loop-shell.sh` shows one resolver and all six runtime functions going through it, so one fix covers them.
   - Recommended fix: run only a wrapper whose real path belongs to the checkout the shim was sourced from. That still covers a repository that links this `.skilled`. A vendored copy would need an allow list you edit yourself.

### P1 - High

2. [.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:1059] The state directory is checked on writes and trusted on reads
   - Case: the state directory is a symlink or belongs to another account, the two cases `ensureStateDir` (lines 137 to 152) says it rejects. `readRelaunchFile` reads the same directory with no such check, and `should-relaunch` and `consume` (`session-relaunch.cjs:599` and `:707`) rely on it. `consume` then reads the record's `handoff` path with no containment check.
   - Evidence: with the directory replaced by a symlink, `ensureStateDir` refused it, while `should-relaunch` answered `relaunch: true` with exit 0 for a record planted there. Run end to end with a fake runtime, the wrapper restarted that runtime inside the planted directory with a claim seed naming a planted note outside the handoffs folder.
   - User impact: whoever creates that directory first decides where your next session starts and which note it is told to continue. On a shared Linux host with `XDG_RUNTIME_DIR` unset, that is any other local account. This Mac is not exposed, because its temp directory is per user. The cross-account step is inferred: I tested with a symlink, not a second account.
   - Finding class: cross-consumer. Scope proof: `rg -c "readRelaunchFile\("` counts 20 call sites in 8 production files, and `rg -n "ensureStateDir\("` shows the check only on the prepare, log, nudge-state and killer write paths.
   - Recommended fix: apply the directory check inside `readRelaunchFile`, and have `consume` refuse a `handoff` outside the handoffs directory, as `claim` already does.

3. [.skilled/bin/skilled-loop:477] A hop drops every launch flag except model, effort, name, provider and Pi extensions
   - Case: `skilled-loop claude --permission-mode plan --model opus --add-dir /tmp "first prompt"` reaches the threshold and hops. `build_relaunch_arguments` rebuilds the argument list from the carried settings alone (called at line 1017).
   - Evidence: in the same fake-runtime run, the first launch received all of those arguments and the relaunch received `--model opus` and the seed. `--permission-mode plan` and `--add-dir /tmp` were gone.
   - User impact: a session you restricted with a permission mode, a Codex sandbox or a tool allow list continues after the hop without that restriction, with nobody watching. In the other direction, a session started to run unattended loses its permission flags and stalls at the first prompt. The README lists what is carried and never says the rest is dropped, while `AGENTS.md` calls a hop the same session.
   - Finding class: class-of-bug across all six runtime arms. Scope proof: `rg -n "original_arguments|launch_arguments=\(\)" .skilled/bin/skilled-loop` shows the first launch's arguments are read only during the option scan at lines 606 to 627.
   - Recommended fix: replay the first launch's full argument list on a hop and replace only the start prompt and the settings the record overrides. If a flag must not repeat, name it in a deny list and document it.

4. [.skilled/hooks/session-relaunch/lib/context-usage.cjs:356] Claude's window fallback reads current large-window models as 200,000 tokens
   - Case: a checkout with no `autoCompactWindow` in any Claude settings file and no `SESSION_RELAUNCH_WINDOW_TOKENS`, on a model whose id carries no `[1m]` marker. `context-nudge.mjs:128` passes `message.model`, and the fallback returns 200,000.
   - Evidence: the six newest session logs for this project name the model `claude-fable-5-2` or `claude-opus-5-5` in both `requestedModel` and `message.model`, and their fill reaches 464,850 tokens. `resolveWindow` with no settings returns 200000 for both ids. That the real window is larger than 200,000 is inferred from that fill.
   - User impact: in such a checkout the nudge reports "80% full" at 160,000 tokens, about a third of what these sessions held. Sessions hand over several times too often and reach the ten-hop cap early. This checkout is not affected, because `.claude/settings.json` sets `autoCompactWindow` to 500000.
   - Finding class: instance-only. Scope proof: `rg -n "LARGE_WINDOW_MARKER|DEFAULT_WINDOW_TOKENS|resolveWindow\("` shows the Claude nudge as the only caller of this fallback. Codex, Pi and OpenCode take the window from the runtime and stay quiet without one.
   - Recommended fix: treat an unconfigured window as unknown. Skip the nudge, log it and have `/doctor:setup` name the missing setting, which is how the other three runtimes already behave. The trade-off is no nudge until the window is set, with auto-compaction as the fallback.

### P2 - Suggestion

5. [.skilled/hooks/session-relaunch/claude/subagent-guard.mjs:18] The sub-agent guard denies `claim`, `complete`, `keep` and `prepare`, but not `cancel` or `consume`
   - Case: a Claude sub-agent runs `session-relaunch.cjs cancel`. It shares the parent's loop id and sits directly under the runtime, so the nested-run check keeps the loop variables and the parent's prepared hand-over is withdrawn. Read from the code, not run.
   - Recommended fix: add `cancel` and `consume` to `LIFECYCLE_COMMAND`.

6. [.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:1410] The stale-lock reclaim in `withAppendLock` checks and then acts
   - Case: a holder dies and leaves a lock directory older than ten seconds while two processes wait on it. Both read it as stale. The first removes it and takes the lock, then the second removes that fresh lock and takes it as well, so two writers change one record. Read from the code, not reproduced.
   - Recommended fix: rename the stale directory to a private name before removing it, as `killer.cjs` already does for its takeover mutex.

7. [.skilled/bin/skilled-loop:799] The loop id is the wrapper's pid, and a leftover record is never cleared at start
   - Case: the terminal closes while a record exists, for example after a withdrawn hand-over, so the wrapper never consumes it. A later wrapper that gets the same pid prints a warning or a claim command for that unrelated note when its runtime exits. A relaunch needs a record armed in the last ten minutes, so the impact stays low. Read from the code.
   - Recommended fix: remove this loop's record file before the first launch.

8. [.skilled/hooks/session-relaunch/README.md:258] The README says every switch also resolves from `hook-flags.env`, and the window switch does not
   - Case: an operator saves `SESSION_RELAUNCH_WINDOW_TOKENS` in `hook-flags.env` and the fill is still measured against the default, because all four readers take it from the environment only (`context-usage.cjs:308` and `:340`, `pi/session-relaunch.ts:288`, `.opencode/plugins/session-relaunch.js:76`). `.env.example` describes it correctly.
   - Recommended fix: read it through the merged switches, or mark it environment-only in the README table.

## Adversarial self-check on the P0 and P1 findings

- Finding 1: raised as P0. Challenge: starting an agent in an untrusted tree is risky anyway, and a wrapper per repository is intended. Verdict: confirmed at P0, because the code runs before the runtime can ask anything and the reach was shown live.
- Finding 2: raised as P0. Challenge: it needs a shared temp directory and a second account, which this platform does not offer. Verdict: downgraded to P1, and it stays there because the code claims this exact validation.
- Finding 3: raised as P1. Challenge: the README lists what is carried, so the drop may be intended. Verdict: confirmed at P1 for the dropped restriction. This one is judgment: if you rule restricted sessions out of scope for the loop, it is P2.
- Finding 4: raised as P1. Challenge: the fallback is documented, errs toward an early hand-over and does not touch this checkout. Verdict: confirmed at P1, because the release note promises a hand-over near 80% of the context window.

## Positive highlights

- Every record change runs under one lock and carries an arm identity. The killer re-checks and stamps the record in the same locked step before it signals, so a cancel cannot land between the check and the signal.
- The hop cap and the freshness limit are enforced at the wrapper, at `prepare` and in the killer, so a session is never ended for a relaunch the wrapper would refuse.
- Every withdraw path goes through one helper, and the paths given to `claim`, `complete` and `prepare` are held inside the handoffs directory with real-path checks.

## Removal/Iteration Plan

Nothing to remove. Fix in the order 1, 2, 3, 4, each with a test that fails today. The P2 items can ride along with the fix that touches the same file.

## Next Steps

What ran: `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs` passed 813 of 813 with exit 0, the OpenCode plugin suite passed 65 of 65 with exit 0, and the Pi vitest suite passed 59 of 59 with exit 0. Findings 1 to 4 were reproduced with fixtures in the scratchpad. Findings 5 to 7 come from reading the code. The repository is untouched by this review: branch `main`, already dirty when I started. Ten more tracked files, among them `README.md` and several sk-doc scripts, changed at 08:40 while I was reading, so another session is writing in this checkout. Residual risk: no hop ran on a real runtime.

1. Yours: say which findings to fix. That work writes files, so I will ask the spec folder question first. I can also publish this report as a page if you want to pass it on.

Not checked: live hops on real runtimes, finding 2 with a second operating-system account, and the JavaScript, TypeScript and shell style checklists item by item, so this review makes no style-conformance claim

Review status: REQUESTED_CHANGES
