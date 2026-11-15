REPOSITORY ROOT: /Users/michelkerkmeester/worktrees/public/420-cross-runtime-handover-parity-fixes
Every read, write and command uses this root. Your environment block may name a different
"Workspace root folder": ignore it, it is another checkout of the same repository.

GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  /Users/michelkerkmeester/worktrees/public/420-cross-runtime-handover-parity-fixes/specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/048-cross-runtime-handover-parity-fixes/001-pi-opencode-history-lookup

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
A failed edit match means a stale anchor: re-read the file and retry; halt only after three
failures on the same file.
Your task is complete only when files exist on disk and the verification command has been run.

PERSONA: You are a careful Node.js test author. You add exactly the tests asked for, match the file's existing style, and never add comments that name tickets, phases, specs or findings.

RULES: Edit only the one test file named below. No git commands. Do not run vibe or any other AI CLI. Never read, write or name a dotenv file. Touch nothing else.

TASK (one change): add four tests proving that a claim of a Pi or OpenCode note prints a History Lookup whose command really answers, and prints none when the reader cannot find the session there.

Root = /Users/michelkerkmeester/worktrees/public/420-cross-runtime-handover-parity-fixes
T = Root/.skilled/hooks/session-handover/tests/session-handover-cli.test.cjs

1. In T, find the test whose title is `'the command a claim prints answers with the sender turns from a Vibe store'`. Directly after the closing `});` of that test, insert this block (keep one blank line before and after it):

```
// Pi files each session under a folder named for the folder it ran in, with a header line that
// records that folder, so the reader finds the session only from the folder the note names.
function writePiSession(sandbox, sessionId, { cwd }) {
  const projectKey = `--${cwd.replace(/^\/+/, '').replaceAll('/', '-')}--`;
  const sessionPath = path.join(
    sandbox.env.HOME, '.pi', 'agent', 'sessions', projectKey,
    `2026-10-16T12-00-00-000Z_${sessionId}.jsonl`,
  );
  const lines = [
    { type: 'session', version: 3, id: sessionId, timestamp: '2026-10-16T12:00:00.000Z', cwd },
    {
      type: 'message',
      id: 'pi-u1',
      timestamp: '2026-10-16T12:00:01.000Z',
      message: { role: 'user', content: [{ type: 'text', text: 'Say the probe word.' }] },
    },
    {
      type: 'message',
      id: 'pi-a1',
      timestamp: '2026-10-16T12:00:02.000Z',
      message: { role: 'assistant', content: [{ type: 'text', text: 'probe-ok' }] },
    },
  ];
  fs.mkdirSync(path.dirname(sessionPath), { recursive: true });
  fs.writeFileSync(sessionPath, `${lines.map((line) => JSON.stringify(line)).join('\n')}\n`);
}

// OpenCode keeps every session in one SQLite store whose session row records the folder the
// session ran in, so the reader finds the session only from the folder the note names.
function writeOpenCodeStore(sandbox, sessionId, { cwd }) {
  const { DatabaseSync } = require('node:sqlite');
  sandbox.env.XDG_DATA_HOME = path.join(sandbox.root, 'xdg-data');
  delete sandbox.env.OPENCODE_DB;
  const storeRoot = path.join(sandbox.env.XDG_DATA_HOME, 'opencode');
  fs.mkdirSync(storeRoot, { recursive: true });
  const database = new DatabaseSync(path.join(storeRoot, 'opencode.db'));
  try {
    database.exec('CREATE TABLE session (id TEXT, directory TEXT)');
    database.exec('CREATE TABLE message (id TEXT, session_id TEXT, time_created INTEGER, data TEXT)');
    database.exec('CREATE TABLE part (id TEXT, message_id TEXT, session_id TEXT, time_created INTEGER, data TEXT)');
    database.prepare('INSERT INTO session VALUES (?, ?)').run(sessionId, cwd);
    database.prepare('INSERT INTO message VALUES (?, ?, ?, ?)')
      .run('m-user', sessionId, 1000, JSON.stringify({ role: 'user' }));
    database.prepare('INSERT INTO message VALUES (?, ?, ?, ?)')
      .run('m-model', sessionId, 2000, JSON.stringify({ role: 'assistant' }));
    database.prepare('INSERT INTO part VALUES (?, ?, ?, ?, ?)')
      .run('p-user', 'm-user', sessionId, 1000, JSON.stringify({ type: 'text', text: 'Say the probe word.' }));
    database.prepare('INSERT INTO part VALUES (?, ?, ?, ?, ?)')
      .run('p-model', 'm-model', sessionId, 2000, JSON.stringify({ type: 'text', text: 'probe-ok' }));
  } finally {
    database.close();
  }
}

// The printed command must redeem for a runtime whose handle names no file, so each case runs
// the command the claim printed against the same store.
for (const { runtime, writeStore } of [
  { runtime: 'pi', writeStore: writePiSession },
  { runtime: 'opencode', writeStore: writeOpenCodeStore },
]) {
  test(`the command a claim prints answers with the sender turns from a ${runtime} store`, (t) => {
    const sandbox = createSandbox(t);
    const { handoffPath, workspace } = claimableHandoff(sandbox);
    setNoteLine(handoffPath, /^runtime: .*$/m, `runtime: ${runtime}`);
    writeStore(sandbox, SESSION_ID, { cwd: workspace });

    const claimed = runCli(sandbox, ['claim', handoffPath, '--session', RECEIVER_SESSION_ID]);
    assert.equal(claimed.status, 0, claimed.stderr);
    assert.match(claimed.stdout, /## History Lookup/);
    assert.ok(claimed.stdout.includes(`SPECKIT_RUNTIME=${runtime} `), claimed.stdout);
    const handle = /--handle '(hl1_[a-f0-9]{32})'/.exec(claimed.stdout)?.[1];
    assert.ok(handle, claimed.stdout);

    const redeemed = spawnSync(process.execPath, [
      path.resolve(__dirname, '../bin/history-lookup.mjs'),
      '--session', SESSION_ID,
      '--handle', handle,
      'search', JSON.stringify({ query: 'probe-ok' }),
    ], {
      cwd: workspace,
      env: { ...sandbox.env, SPECKIT_RUNTIME: runtime },
      encoding: 'utf8',
      timeout: 10000,
    });

    assert.equal(redeemed.status, 0, redeemed.stdout);
    assert.ok(redeemed.stdout.includes('probe-ok'), redeemed.stdout);
  });

  test(`a claim prints no history lookup when the ${runtime} store holds the session for another folder`, (t) => {
    const sandbox = createSandbox(t);
    const { handoffPath, workspace } = claimableHandoff(sandbox);
    setNoteLine(handoffPath, /^runtime: .*$/m, `runtime: ${runtime}`);
    writeStore(sandbox, SESSION_ID, { cwd: path.join(sandbox.root, 'another-folder') });

    const result = runCli(sandbox, ['claim', handoffPath, '--session', RECEIVER_SESSION_ID]);

    assert.equal(result.status, 0, result.stderr);
    assert.doesNotMatch(result.stdout, /## History Lookup/);
    assert.equal(fs.existsSync(hookStatePath(sandbox, workspace, SESSION_ID)), false);
  });
}
```

Do not change any other test or helper in T.

VERIFY: run `node --test .skilled/hooks/session-handover/tests/session-handover-cli.test.cjs` from Root and report the `tests`, `pass` and `fail` lines. If a new test fails, report its failure message exactly and do not edit any file other than T to fix it.
