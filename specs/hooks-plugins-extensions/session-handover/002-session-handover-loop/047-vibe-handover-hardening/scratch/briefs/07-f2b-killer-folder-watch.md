REPOSITORY ROOT: /Users/michelkerkmeester/worktrees/public/418-vibe-handover-hardening
Every read, write and command uses this root. Your environment block may name a different
"Workspace root folder": ignore it, it is another checkout of the same repository.

GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  /Users/michelkerkmeester/worktrees/public/418-vibe-handover-hardening/specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/047-vibe-handover-hardening

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
A failed edit match means a stale anchor: re-read the file and retry; halt only after three
failures on the same file.
Your task is complete only when files exist on disk and the verification command has been run.

PERSONA: You are a careful Node.js maintainer. You make the smallest edit that does the job, match the file's existing style, and never add comments that name tickets, phases, specs or findings.

RULES: Edit only the two files named below. No git commands. Do not run vibe or any other AI CLI. Never read, write or name a dotenv file. Other workers are editing other files in this checkout at the same time; touch nothing else.

TASK (one change): the killer's idle watch accepts a folder. Vibe writes numbered journal segments and starts a new one at every fold, so a single segment goes quiet even while the session keeps writing. Given a folder, the killer treats it as active while the folder or any numbered segment in it changes. A file path behaves exactly as today.

Root = /Users/michelkerkmeester/worktrees/public/418-vibe-handover-hardening
K = Root/.skilled/hooks/session-handover/lib/killer.cjs
T = Root/.skilled/hooks/session-handover/tests/killer.test.cjs

1. In K, replace the whole function

```
function transcriptMtime(transcriptPath) {
  try {
    return fs.statSync(transcriptPath).mtimeMs;
  } catch {
    return null;
  }
}
```

with

```
// Vibe journal segments are named by number, and a fold starts a new one.
const JOURNAL_SEGMENT_NAME = /^\d+\.jsonl$/;

function transcriptMtime(transcriptPath) {
  try {
    const stats = fs.statSync(transcriptPath);
    if (!stats.isDirectory()) return stats.mtimeMs;
    // A Vibe session folder is idle only when neither the folder, which changes when a
    // segment is added or removed, nor any segment in it has been written.
    let newest = stats.mtimeMs;
    for (const name of fs.readdirSync(transcriptPath)) {
      if (!JOURNAL_SEGMENT_NAME.test(name)) continue;
      try {
        newest = Math.max(newest, fs.statSync(path.join(transcriptPath, name)).mtimeMs);
      } catch {
        // A segment removed between the listing and the stat is not a write.
      }
    }
    return newest;
  } catch {
    return null;
  }
}
```

`path` is already required at the top of K.

2. In T, directly after the test named `killer times out on an active transcript, unarms and releases its lock`, add these two tests. They reuse the helpers that test uses.

```

test('killer times out on a journal folder whose newest segment keeps changing', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = String(process.pid);
  const journal = path.join(sandbox.root, 'journal');
  fs.mkdirSync(journal);
  fs.writeFileSync(path.join(journal, '0000000000000001.jsonl'), '{}\n');
  const active = path.join(journal, '0000000000000002.jsonl');
  fs.writeFileSync(active, '{}\n');
  const target = startTarget(sandbox, path.join(sandbox.root, 'target-signal'));
  await waitForTargetReady(target);
  createRelaunchRecord(sandbox, loopId);
  const touchTimer = setInterval(() => {
    const now = new Date();
    fs.utimesSync(active, now, now);
  }, 100);
  const killer = runKiller(sandbox, { loopId, targetPid: target.pid, transcriptPath: journal });
  try {
    const result = await waitForExit(killer, 5000);
    assert.equal(result.timedOut, undefined, 'killer should stop after its configured timeout');
    assert.equal(process.kill(target.pid, 0), true);
    const record = JSON.parse(fs.readFileSync(
      path.join(sandbox.xdgRuntimeDir, 'skilled-relaunch', `relaunch-${loopId}.json`),
      'utf8',
    ));
    assert.equal(record.disarmReason, 'killer-timeout');
  } finally {
    clearInterval(touchTimer);
    killChild(killer);
    killChild(target);
  }
});

test('killer still signals an idle journal folder after its first segment is removed', async (t) => {
  const sandbox = createSandbox(t);
  const loopId = String(process.pid);
  const signalPath = path.join(sandbox.root, 'target-signal');
  const journal = path.join(sandbox.root, 'journal');
  fs.mkdirSync(journal);
  const first = path.join(journal, '0000000000000001.jsonl');
  fs.writeFileSync(first, '{}\n');
  fs.writeFileSync(path.join(journal, '0000000000000002.jsonl'), '{}\n');
  const target = startTarget(sandbox, signalPath);
  await waitForTargetReady(target);
  createRelaunchRecord(sandbox, loopId);
  const killer = runKiller(sandbox, { loopId, targetPid: target.pid, transcriptPath: journal });
  setTimeout(() => fs.rmSync(first, { force: true }), 300);
  try {
    const result = await waitForExit(killer, 6500);
    assert.equal(result.timedOut, undefined, 'killer should exit after signaling an idle target');
    assert.equal(fs.readFileSync(signalPath, 'utf8'), 'SIGTERM');
  } finally {
    killChild(killer);
    killChild(target);
  }
});
```

VERIFY: run this from Root and paste the last 12 lines of its output and its exit status:

  node --test --test-name-pattern="journal folder|active transcript|idle target and releases" .skilled/hooks/session-handover/tests/killer.test.cjs

If a test fails, read the failure, fix your edit (not the assertions), and run it again (at most three times).

HANDBACK: list the files you changed, the verify output tail with its exit status, and anything you could not do. Do not claim success without the command output.
