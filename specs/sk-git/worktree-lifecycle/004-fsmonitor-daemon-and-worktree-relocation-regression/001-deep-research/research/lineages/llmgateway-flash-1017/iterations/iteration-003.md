# Iteration 3: Every unbounded git call site, and the safest default posture

## Focus

Q4 and Q5 of section 8: which call sites in the repo's hooks and scripts run git without a timeout, which of them should opt out of fsmonitor — and, given iteration 2's lifecycle facts, what the safest default posture plus daemon-reaping design should be.

## Actions Taken

1. Resolved the hook chain that hung: `core.hooksPath=~/.config/git/hooks` → symlink to `.skilled/scripts/git-hooks/pre-push` → `ci-skill-root-metadata.cjs` → `generate-leaf-manifest.cjs`.
2. Read `generate-leaf-manifest.cjs:100-145` for the exact `check-ignore` invocation and its fallback contract.
3. Enumerated unbounded git calls across `.skilled` (excluding tests and `node_modules`) with `rg` over `spawnSync|execFileSync|execSync|execFile|spawn` for `git`.
4. Located the repository's existing fsmonitor opt-out convention (`GIT_NO_FSMONITOR`) and every module that already defines it.
5. Cross-read iteration 1's process census and iteration 2's lifecycle findings to test each candidate design against what the daemon actually does.

## Findings

1. The hung hop is the manifest builder, not the gate script. `ci-skill-root-metadata.cjs:51` imports `buildManifestBytes` from `generate-leaf-manifest.cjs`, so the gate's runtime is dominated by that builder's git calls. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:51]

2. `generate-leaf-manifest.cjs:129` runs `spawnSync('git', ['check-ignore', '-z', '--stdin'], { cwd: top, input, encoding })` with no `timeout` and no `-c core.fsmonitor=false`. `check-ignore` reads the index, so it takes the fsmonitor IPC path that iteration 2 showed is unbounded on both sides. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:129]

3. The same function's fallback cannot rescue a hang: `if (res.error || (res.status !== 0 && res.status !== 1))` requires a returned result, and a blocked `spawnSync` never returns. Adding `timeout` is therefore sufficient to make the existing fallback reachable — the repair is one option object, not a redesign. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:136]

4. The repository already has the opt-out convention: `const GIT_NO_FSMONITOR = ['-c', 'core.fsmonitor=false']` is defined in `check-source-tags-helper.mjs:53`, `cite-drift-scan.mjs:145` and `continuity-freshness.ts:38` and prepended to those modules' git argv. The hung path simply never adopted it. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs:53] [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:145] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/validation/continuity-freshness.ts:38]

5. Additional unbounded index-reading call sites in automation, each a hang surface of its own: `regenerate-skill-derived.cjs:73` (`check-ignore -q`, no timeout, no opt-out), `verify-router-sync.cjs:168` (`check-ignore --stdin`), `doctor/git-hook-gates.cjs:180` (`execFileSync('git', ...)` for a command list), `doctor/release-update.cjs:282`, `sk-git/validate-message.mjs:88` (runs inside the message gate), and `behavior-bench-run.cjs:885` (`git status --porcelain`). [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs:73] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:168] [SOURCE: .skilled/commands/doctor/scripts/git-hook-gates.cjs:180] [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:282] [SOURCE: .skilled/skills/sk-git/scripts/validate-message.mjs:88] [SOURCE: .skilled/skills/system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs:885]

6. The hooks are machine-wide: `core.hooksPath` is `~/.config/git/hooks`, every entry is a symlink into `.skilled/scripts/git-hooks`, and the skill gate is skippable only by `SPECKIT_SKIP_PREPUSH_SKILL_GATE=1`. A timeout in this repo's scripts therefore fixes every machine checkout that trusts repo hooks, and leaving it unfixed leaves every one of them able to hang. [SOURCE: ~/.config/git/hooks/pre-push:425]

7. Daemon-to-worktree attribution cannot use the command line. Iteration 1's census shows every daemon runs exactly `fsmonitor--daemon run --detach --ipc-threads=8`, with no path in argv, so the retired MCP-style `ps`-cmdline matcher has no successor by inspection of argv alone. The identifying artifact is the socket each process holds open (`.git/fsmonitor--daemon.ipc`, per worktree), which `lsof` resolves to a path. [SOURCE: ps -Ao pid,lstart,command, iteration 1] [SOURCE: specs/sk-git/035-fsmonitor-daemon-and-worktree-relocation-regression/scratch/findings.md]

8. Recovery must escalate past `stop`. Since `git fsmonitor--daemon stop` sends `quit` and then polls forever on a wedged daemon, any reaper has to bound the stop (for example 5 s) and then send SIGTERM, then SIGKILL — the same escalation the operator performed by hand at 08:51. [INFERENCE: iteration 2 findings 4-5]

9. Q5 answer, ranked: the safe default is fsmonitor ON, but only with three preconditions — worktrees outside the checkout, automation opted out and time-bounded, and a daemon reaper that guarantees no daemon outlives its worktree. Without all three, fsmonitor OFF for the main checkout (via `extensions.worktreeConfig` plus `git config --worktree core.fsmonitor false`) is safer than an immortal daemon, because the main checkout is where index-reading automation runs and a wedge there stops pushes. The relocation is a prerequisite in either branch, not the alternative. [INFERENCE: iterations 1-2 findings]

10. Prevention invariant: no fsmonitor daemon may outlive its worktree, and no automated git call may wait without a ceiling. Enforcement points are stop-before-`git worktree remove`, a stray-daemon reap in the doctor and after each removal, and a wedge probe that runs a bounded index read and restarts the daemon on timeout. [INFERENCE: findings 2, 7, 8]

11. The highest-leverage single change is the hook path, not the daemon: the only user-visible damage was a 30-minute push, and a bounded, opted-out `check-ignore` turns a wedged daemon into a fast gate warning through the fallback that already exists. Daemon reaping and relocation then remove the recurrence rather than the symptom. [INFERENCE: findings 2-3 plus the packet's symptom record]

## Questions Answered

- Q4. Which call sites in the repo's hooks and scripts run git without a timeout, and which of them should opt out of fsmonitor? — Answer: the proven one is `generate-leaf-manifest.cjs:129` (`check-ignore`, no timeout, no opt-out, reached from the pre-push skill gate). Further unbounded sites: `regenerate-skill-derived.cjs:73`, `verify-router-sync.cjs:168`, `doctor/git-hook-gates.cjs:180`, `doctor/release-update.cjs:282`, `validate-message.mjs:88`, `behavior-bench-run.cjs:885`. Every index-reading one should opt out with the repo's existing `GIT_NO_FSMONITOR` convention and carry a timeout; non-index calls (`rev-parse`, `cat-file`, `log`) need only the timeout where they run in a gate.

- Q5. What is the safest default: fsmonitor on with worktrees outside the checkout, or fsmonitor off for the main checkout and on per worktree? — Answer: on with worktrees outside the checkout, plus opted-out and time-bounded automation plus a daemon reaper; if any of the three cannot be guaranteed, off for the main checkout via per-worktree config and on only in worktrees.

## Questions Remaining

- None of the five section-8 questions is unanswered.
- Carried forward as an implementation-packet question: the measured status-time benefit of fsmonitor in this checkout, which requires index-writing commands and was deliberately not measured inside this read-only research run.

## Ruled Out

- "Restore the reaper's daemon handling." Ruled out by iteration 1: that code targeted MCP context-server daemons and the reaper now promises never to signal a process.
- "Rely on `git fsmonitor--daemon stop` in a reaper." Ruled out by iteration 2: stop hangs on exactly the daemon a reaper needs to remove.
- "Match daemons by command line." Ruled out by finding 7: argv is identical for every daemon.
- "Disable fsmonitor everywhere." Rejected as the default rather than ruled out as an option: it discards a measured benefit on a 570k-file checkout, and per-worktree config gives the same safety with a narrower blast radius.

## Dead Ends

- Measuring status latency with and without fsmonitor: every such command can write the index, which is a repository write outside this lineage's authority. Deferred with the reason recorded.

## Edge Cases

- Partial success: Q4's list is exhaustive over the patterns and directories searched, not over every possible shell `git` invocation in the tree; shell-level calls inside `.skilled/scripts/git-hooks/*` were reviewed through the gate they invoke, not each line. Stated as a coverage limit rather than a complete audit.

## Sources Consulted

- `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:51`
- `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:100-145`
- `.skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs:73`
- `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:168`
- `.skilled/commands/doctor/scripts/git-hook-gates.cjs:86,95,180`
- `.skilled/commands/doctor/scripts/release-update.cjs:282`
- `.skilled/skills/sk-git/scripts/validate-message.mjs:81,88`
- `.skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs:290`
- `.skilled/skills/system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs:885`
- `.skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs:53,206`
- `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:145`
- `.skilled/skills/system-spec-kit/runtime/cli/validation/continuity-freshness.ts:38`
- `~/.config/git/hooks/pre-push:425`
- `git config --get core.hooksPath`
- Iteration 1 process census and iteration 2 lifecycle findings

## Assessment

- New information ratio: 0.80
- Questions addressed: Q4, Q5
- Questions answered: Q4, Q5

## Reflection

- What worked and why: following the hook symlink from `core.hooksPath` into the gate script and then into its imported builder put the exact hung `spawnSync` in one chain of three files. Grepping for an existing `GIT_NO_FSMONITOR` constant then showed the fix pattern already exists in-repo, which lowers the implementation risk to "adopt the convention here".
- What did not work and why: trying to design a cmdline-based daemon reaper failed against the census — every daemon's argv is identical, so the reaper needs the socket path, which is a stronger requirement than sk-git/026's MCP-era design.
- What I would do differently: check for an in-repo precedent (`GIT_NO_FSMONITOR`) before writing a fix proposal from scratch; the repository had already solved the same problem in three other modules.

## Recommended Next Focus

Synthesis. The five section-8 questions now have cited answers, the root-cause chain is complete from config to unbounded wait to hook, and the fix design has four independent layers with an explicit order. The remaining work is measurement (status latency with and without fsmonitor) and implementation, both of which belong to the follow-up packet.
