REPOSITORY ROOT: /Users/michelkerkmeester/worktrees/public/420-cross-runtime-handover-parity-fixes
Every read, write and command uses this root. Your environment block may name a different
"Workspace root folder": ignore it, it is another checkout of the same repository.

GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  /Users/michelkerkmeester/worktrees/public/420-cross-runtime-handover-parity-fixes/specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/048-cross-runtime-handover-parity-fixes/002-failed-arm-deferred-mark

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
A failed edit match means a stale anchor: re-read the file and retry; halt only after three
failures on the same file.
Your task is complete only when files exist on disk and the verification command has been run.

PERSONA: You are a careful TypeScript maintainer. You make the smallest edit that does the job, match the file's existing style, and never add comments that name tickets, phases, specs or findings.

RULES: Edit only the two files named below. No git commands. Do not run vibe or any other AI CLI. Never read, write or name a dotenv file. Other workers are editing other files in this checkout at the same time; touch nothing else.

TASK (one change): when the Pi extension finds this session's pending record at `agent_settled` but arming it throws, mark the record deferred and log it, and let the next `agent_start` withdraw a deferred record as well as an armed one. Claude already behaves this way.

Root = /Users/michelkerkmeester/worktrees/public/420-cross-runtime-handover-parity-fixes
P = Root/.skilled/hooks/session-handover/pi/session-handover.ts
T = Root/.skilled/hooks/session-handover/pi/session-handover.test.ts

1. In P, inside `interface CoreModule {`, directly after the line `  dropNestedLoop(env: NodeJS.ProcessEnv, options: { hostPid: number }): boolean;`, add:

```
  markDeferred(options: { loopId: string; env: NodeJS.ProcessEnv }): RelaunchRecord | null;
```

2. In P, in the `CORE_FUNCTIONS` list, add `  'markDeferred',` on its own line directly after `  'dropNestedLoop',`.

3. In P, directly after the closing `}` of `function logSpawnError(core: CoreModule, loopId: string, error: unknown): void {`, add:

```

// A settle that cannot arm this session's pending record marks it, so the operator's next turn
// withdraws it. Left unmarked, the record would wait for a later settle and relaunch from a note
// that predates the work done since.
function markParked(core: CoreModule, loopId: string, error: unknown): void {
  try {
    core.appendLog('agent-settled-arm-error', {
      stage: 'arm',
      loopId,
      message: error instanceof Error ? error.message : String(error),
    }, process.env);
  } catch {}
  try {
    core.markDeferred({ loopId, env: process.env });
  } catch (deferError) {
    try {
      core.appendLog('agent-settled-arm-error', {
        stage: 'defer',
        loopId,
        message: deferError instanceof Error ? deferError.message : String(deferError),
      }, process.env);
    } catch {}
  }
}
```

4. In P, inside `async function armRelaunch(`, replace

```
  const armed = modules.core.arm({
    loopId,
    cwd: ctx.cwd,
    settings: liveSettings(pi, ctx),
    env: process.env,
  });
  if (armed?.status !== 'armed') return;
```

with

```
  let armed: RelaunchRecord | null;
  try {
    armed = modules.core.arm({
      loopId,
      cwd: ctx.cwd,
      settings: liveSettings(pi, ctx),
      env: process.env,
    });
  } catch (error) {
    markParked(modules.core, loopId, error);
    return;
  }
  if (armed?.status !== 'armed') return;
```

5. In P, in the `agent_start` handler, inside the `modules.withdraw.withdrawHandOver({ ... })` call, delete the one line `        pending: 'none',`. Leave the other arguments as they are. The helper's default policy then withdraws a pending record only when a failed arm marked it deferred, so a prepared record that has not reached its settle yet is still left alone.

6. In T, find the test titled `'agent_start before the arm leaves a pending record pending'`. Directly after its closing `});`, add:

```

  it('agent_settled marks the pending record deferred when arming throws', async () => {
    setupEnv();
    const loopId = 'pi-loop-arm-throws';
    process.env.SKILLED_LOOP_ID = loopId;
    preparePending({
      loopId,
      handoffPath: '/workspace/pi/handoff.md',
      sessionId: 'pi-session-0001',
      runtime: 'pi',
      cwd: '/workspace/pi',
      env: process.env,
    });
    const { api, handlers } = makeExtensionApi();
    sessionHandover(api);

    // A cwd that cannot be written as JSON makes the arm throw after it read the record.
    await emit(
      handlers,
      'agent_settled',
      { aborted: false },
      makeContext('pi-session-0001', 1n as unknown as string),
    );

    const record = readRelaunchFile(loopId, process.env) as { status?: string; deferredAt?: unknown };
    expect(record).toMatchObject({ status: 'pending' });
    expect(typeof record.deferredAt).toBe('string');
    const logPath = path.join(process.env.XDG_RUNTIME_DIR!, 'skilled-relaunch', 'relaunch.log');
    expect(readFileSync(logPath, 'utf8')).toMatch(/agent-settled-arm-error stage=arm/);
  });

  it('agent_start withdraws a pending record a failed arm deferred', async () => {
    setupEnv();
    const loopId = 'pi-loop-deferred-0001';
    process.env.SKILLED_LOOP_ID = loopId;
    preparePending({
      loopId,
      handoffPath: '/workspace/pi/handoff.md',
      sessionId: 'pi-session-0001',
      runtime: 'pi',
      cwd: '/workspace/pi',
      env: process.env,
    });
    relaunchCore.markDeferred({ loopId, env: process.env });
    const { api, handlers } = makeExtensionApi();
    sessionHandover(api);

    await emit(handlers, 'agent_start', {}, makeContext());

    expect(readRelaunchFile(loopId, process.env)).toMatchObject({
      status: 'disarmed',
      disarmReason: 'user-message',
    });
  });
```

Do not change any other test in T.

VERIFY: from `Root/.skilled/hooks`, run `npx vitest run session-handover/pi/session-handover.test.ts` and report the `Tests` line. The suite had 67 passing tests before this change.
