# Verified findings for phase 001-workflow-reentry-seed

Source: `../scratch/verify-1.md` in the parent packet, written by the verifying reviewer on 2026-11-12. This file is the brief for this phase. The work package comes first, then each finding it covers.

## Work package

1. **WP1. Re-entering a workflow and its goal context** (F2, F10, F11, F1 seed half, N5, F13 first half)
   - Files: `.skilled/hooks/session-relaunch/lib/nudge.cjs`, `.skilled/commands/speckit/handoff.md`, `.skilled/hooks/session-relaunch/tests/nudge.test.cjs`.
   - Must fail first: `handoffText` asks for an `Active command:` line and a deep-loop lock release; `seedText` has a re-run step and a "read the spec folder's goal.md" step; the codex `handoffText` asks for an `Active goal:` line.

## Findings

### F2. No workflow re-entry
- **Evidence.** `relaunch-core.cjs:29` (four sections and no command field). `nudge.cjs:143-161` (the note shape) and `247-253` (the only work step is "Continue the work under Remaining work"). `handoff.md:100-132` (the template). The relaunch record carries no command field either (`preparePending` arguments at `session-relaunch.cjs:546-558`).
- **Refutation attempt.** I looked for any resume branch in the workflows. `speckit-resume-auto.yaml:203` only suggests "Run /speckit:implement if tasks remain". `speckit-complete.yaml:656-699` detects a folder that already exists (repair mode, healthy folder), so running it again is not catastrophic, but it has no step state. The deep commands do resume from disk (`deep-research-auto.yaml:303-321`), but only after the lock step at `:286` (see F10).
- **Can an "active command" ride without changing the record format?** Yes, two ways. (a) A line under `## In-flight state`. `claim` prints the body (`session-relaunch.cjs:350-356`), so it reaches the receiver with no code change. (b) A flat frontmatter key. `parseHandoff` (`relaunch-core.cjs:318-327`) accepts any `[A-Za-z0-9_-]` key and splits only at the first colon, so a value like `/deep:research :auto ...` parses. `validateHandoff` (`:358-388`) does not reject unknown keys. `updateFrontmatter` (`:222-246`) keeps other keys when `prepare` writes `goal_packet`. But `claim` prints only the body, so (b) needs `claim` to echo the key, the way it echoes `Goal packet:`. Neither way touches the relaunch record (`relaunch-<loop>.json`), so decision D3 of packet 036 holds. D3 sits in `036-review-remediation/goal.md:49`, and that packet is Complete. It binds a new packet only if that packet adopts it.
- **Verdict.** CONFIRMED that nothing structured is carried. What the model then does is inferred. P1 for `:autopilot` and unattended runs and for deep loops, P2 for interactive commands.
- **The fix.** Way (a) is the smallest and correct, in `nudge.cjs` (both `handoffText` and `seedText`) and `handoff.md`. Two corrections. First, tell the receiver to run the command again with the same mode and arguments, and to let the command's own state detection pick the step, rather than claiming the step will be resumed. Second, the fix must ship with F10, or the deep loops fail closed on the lock.
- **Tests.** `nudge.test.cjs`: `handoffText` asks for an `Active command:` line, and `seedText` has a re-run step (both fail today). `session-relaunch-cli.test.cjs`: a claim of a note with the line prints it (passes today; it pins that no code change is needed).

### F10. Deep-loop lock
- **Evidence.** `loop-lock.ts:637-644` (`transient` is never owner-dead). `loop-lock.cjs:183-186` (a CLI acquire is transient). The assets use `--ttl-ms 1800000` (`deep-research-auto.yaml:286`, `deep-review-auto.yaml:324`). Acquire runs before classification (`:286` comes before `:303`) and "fail closed" on `acquired=false` (`:287`). Nothing in any hook releases a deep-loop lock (no match in `.skilled/hooks`, `.opencode/plugins` or `.claude/settings.json`).
- **Verdict.** CONFIRMED by code. P2, and a blocker for F2's fix on deep loops.
- **The fix.** One sender step in `handoffText`, plus `handoff.md`: before `prepare`, release a held deep-loop lock with the `release --owner-pid --nonce` values the command captured, and write the re-run command on the Active command line. It is correct and prose only.

### F11. `/loop` and wakeups
- PLAUSIBLE, P3. There is no reference in the relaunch code. The F2 line covers it if it holds the loop prompt and the interval.

### F1. Codex loses its goal
- **Evidence.** `relaunch-core.cjs:761-774`: only `GOAL_RECORD_RUNTIMES` and `claude` resolve, so Codex falls through to `''`. Nothing in `session-relaunch.cjs:389-403` prints anything. The README states it as design at lines 171 and 184 ("The seed instruction waits for a Codex goal reader").
- **Refutation attempt.** I looked for a Codex reader anywhere. There is none, and `goals_1.sqlite` could not be opened read-only from this sandbox (`unable to open database file (14)`). Codex does hop automatically, so the loss happens on every Codex hop that has a goal.
- **Verdict.** OVERSTATED. P0 is wrong for a documented limitation that is not a regression. P2.
- **The fix.** The signal half is right. Print it on stderr rather than stdout, because `session-relaunch-cli.test.cjs:394` pins the prepare stdout. The seed half ("read the bound packet's goal.md") cannot work, because a Codex note never carries `goal_packet`. A version that can work: in `handoffText` (`nudge.cjs:118-201`), for `runtime === 'codex'`, ask the sender to name its goal, or its packet path, on an `Active goal:` line under In-flight state. In `seedText`, have the receiver bring it back the way Codex sets goals (`create_goal`, per README:184). This is prose only, and it changes neither the note format nor the record format.
- **Tests.** `session-relaunch-cli.test.cjs`: a codex `prepare` prints one `goal not carried` line on stderr (fails today). `nudge.test.cjs`: the codex `handoffText` contains the `Active goal:` request (fails today).

### F13. Doc drift
- CONFIRMED, P3, both halves. The `handoff.md:127` fix fits in work package WP1, the `hook-flags.env.example` row in WP7.

**N5. Nothing enforces reading the child goal.md** (P3, confirmed absence)
- **Evidence.** No hook or guard checks it (search of the goal and relaunch code). Soft paths exist: the Claude slice holds the binding table, the plugin objective holds a `BINDING:` sentence when the parent has a binding anchor (`goal-slice.cjs:129-141`), and `/speckit:resume <child>` reads "the packet goal.md durable slice" of the folder it is given (`speckit-resume-auto.yaml:46`). The seed itself never mentions a goal (`nudge.cjs:204-255`).
- **Smallest fix.** One `seedText` step: when the spec folder holds a `goal.md`, read it before the Remaining work; it binds under the session goal. This goes in WP1.
