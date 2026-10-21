// ───────────────────────────────────────────────────────────────────
// MODULE: Orphan Process Check Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS AND FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const test = require('node:test');
const {
  classify,
  main,
  parseEtime,
  parsePsOutput,
  selectOrphans,
} = require('../orphan-process-check.cjs');

const CURRENT_UID = 501;
const LIVE_PATHS = new Set([
  '/existing/advisor-checkout',
  '/existing/advisor checkout',
  '/existing/model-checkout',
  '/existing/model checkout',
  '/existing/live-repo',
  '/existing/live repo',
]);
const pathExists = (candidatePath) => LIVE_PATHS.has(candidatePath);

function psRow({
  pid,
  ppid = 1,
  uid = CURRENT_UID,
  etime = '1:00:00',
  rssKb = 1024,
  command,
}) {
  return `${pid} ${ppid} ${uid} ${etime} ${rssKb} ${command}`;
}

const PROCESS_TABLE = [
  psRow({
    pid: 1001,
    etime: '1-02:03:04',
    rssKb: 10240,
    command: ['node --test', '/tmp/removed-worktree/sample.test.cjs'].join(' '),
  }),
  psRow({ pid: 1002, rssKb: 2048, command: '/repo/node_modules/.bin/vitest run' }),
  psRow({ pid: 1003, rssKb: 3072, command: 'tail -F /tmp/session.log' }),
  psRow({ pid: 1004, rssKb: 4096, command: 'grep -R needle /private/tmp' }),
  psRow({
    pid: 1005,
    rssKb: 5120,
    command: [
      'node --test',
      '/repo/.skilled/hooks/session-relaunch/tests/hop-history.test.cjs',
    ].join(' '),
  }),
  psRow({ pid: 1006, rssKb: 6144, command: 'pi --model test-model' }),
  psRow({ pid: 1007, rssKb: 7168, command: 'codex exec --model test-model' }),
  psRow({ pid: 1008, rssKb: 8192, command: 'devin -p run task' }),
  psRow({
    pid: 1009,
    rssKb: 9216,
    command: 'node /missing/checkout/.skilled/bin/system-skill-advisor-launcher.cjs',
  }),
  psRow({
    pid: 1010,
    rssKb: 1024,
    command: 'node /existing/advisor-checkout/.skilled/bin/system-skill-advisor-launcher.cjs',
  }),
  psRow({
    pid: 1011,
    rssKb: 1024,
    command: 'node /missing/model-checkout/.skilled/bin/hf-model-server.cjs',
  }),
  psRow({
    pid: 1012,
    rssKb: 1024,
    command: 'node /existing/model-checkout/.skilled/bin/hf-model-server.cjs',
  }),
  psRow({
    pid: 1032,
    rssKb: 1024,
    command: 'node .skilled/bin/hf-model-server.cjs',
  }),
  psRow({
    pid: 1033,
    rssKb: 1024,
    command: 'node /existing/model checkout/.skilled/bin/hf-model-server.cjs',
  }),
  psRow({
    pid: 1034,
    rssKb: 1024,
    command: 'node /missing/model checkout/.skilled/bin/hf-model-server.cjs',
  }),
  psRow({
    pid: 1035,
    rssKb: 1024,
    command: 'node --max-old-space-size=4096 /existing/model-checkout/.skilled/bin/hf-model-server.cjs',
  }),
  psRow({
    pid: 1013,
    rssKb: 1024,
    command: 'bash /missing/live-repo/.skilled/bin/git-live-follow.sh --live main',
  }),
  psRow({
    pid: 1014,
    rssKb: 1024,
    command: 'bash /existing/live-repo/.skilled/bin/git-live-follow.sh --live main',
  }),
  psRow({ pid: 1015, command: 'opencode serve' }),
  psRow({ pid: 1016, command: 'codex app-server' }),
  psRow({ pid: 1017, command: '/bin/zsh -l' }),
  psRow({ pid: 1018, command: '/Applications/Visual Studio Code.app/Contents/MacOS/Electron' }),
  psRow({ pid: 1019, etime: '10:00', command: 'node --test /tmp/recent.test.cjs' }),
  psRow({ pid: 1020, ppid: 2, command: 'node --test /tmp/other-parent.test.cjs' }),
  psRow({ pid: 1021, uid: 502, command: 'node --test /tmp/other-user.test.cjs' }),
  psRow({ pid: 1022, command: 'python3 -m http.server 0' }),
  psRow({ pid: 1023, command: 'tail -fn 100 /tmp/session.log' }),
  psRow({ pid: 1024, command: 'tail -Fq /tmp/session.log' }),
  psRow({ pid: 1025, command: 'grep -rn needle /private/tmp' }),
  psRow({ pid: 1026, command: 'grep --recursive needle /private/tmp' }),
  psRow({
    pid: 1027,
    command: 'node /missing/advisor checkout/.skilled/bin/system-skill-advisor-launcher.cjs',
  }),
  psRow({
    pid: 1028,
    command: 'node /existing/advisor checkout/.skilled/bin/system-skill-advisor-launcher.cjs',
  }),
  psRow({
    pid: 1029,
    command: 'node relative advisor checkout/.skilled/bin/system-skill-advisor-launcher.cjs',
  }),
  psRow({
    pid: 1030,
    command: '/missing/live repo/.skilled/bin/git-live-follow.sh --live main',
  }),
  psRow({
    pid: 1031,
    command: '/existing/live repo/.skilled/bin/git-live-follow.sh --live main',
  }),
].join('\n');

function runMain(args, overrides = {}) {
  let output = '';
  const code = main(args, {
    uid: CURRENT_UID,
    pathExists,
    runPs: () => PROCESS_TABLE,
    write: (text) => { output += text; },
    ...overrides,
  });
  return code.then((exitCode) => ({ exitCode, output }));
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. TESTS
// ─────────────────────────────────────────────────────────────────────────────

test('parseEtime accepts MM:SS, HH:MM:SS, and D-HH:MM:SS', () => {
  assert.equal(parseEtime('02:05'), 125);
  assert.equal(parseEtime('12:34:56'), 45296);
  assert.equal(parseEtime('1-02:03:04'), 93784);
  assert.equal(parseEtime('1-24:00:00'), null);
});

test('parsePsOutput accepts Linux-style and macOS-style column spacing', () => {
  const rows = parsePsOutput([
    '3021 1 501 01:02 1024 node --test /tmp/fixture.test.cjs',
    '  3022     1  501  1-02:03:04   2048  tail -F /tmp/fixture.log',
  ].join('\n'));
  assert.equal(rows.length, 2);
  assert.deepEqual(rows.map((row) => row.pid), [3021, 3022]);
  assert.deepEqual(rows.map((row) => row.ageSeconds), [62, 93784]);
  assert.equal(rows[1].command, 'tail -F /tmp/fixture.log');
});

test('selectOrphans reports stale and unsupervised helpers while filtering unrelated rows', () => {
  const selected = selectOrphans(parsePsOutput(PROCESS_TABLE), {
    uid: CURRENT_UID,
    minAgeMinutes: 60,
    pathExists,
  });
  const kindsByPid = new Map(selected.map((row) => [row.pid, row.kind]));
  assert.deepEqual(
    Array.from(new Set(selected.map((row) => row.kind))).sort(),
    [
      'executor-worker',
      'grep-search',
      'node-test',
      'relaunch-test-helper',
      'stale-advisor-launcher',
      'stale-live-follow',
      'stale-model-server',
      'tail-monitor',
      'unsupervised-model-server',
      'vitest',
    ],
  );
  assert.equal(kindsByPid.get(1001), 'node-test');
  assert.equal(kindsByPid.get(1005), 'relaunch-test-helper');
  assert.equal(kindsByPid.get(1009), 'stale-advisor-launcher');
  assert.equal(kindsByPid.get(1011), 'stale-model-server');
  assert.equal(kindsByPid.get(1012), 'unsupervised-model-server');
  assert.equal(kindsByPid.get(1032), 'unsupervised-model-server');
  assert.equal(kindsByPid.get(1033), 'unsupervised-model-server');
  assert.equal(kindsByPid.get(1034), 'stale-model-server');
  assert.equal(kindsByPid.get(1035), 'unsupervised-model-server');
  assert.equal(kindsByPid.get(1013), 'stale-live-follow');
  assert.equal(kindsByPid.get(1023), 'tail-monitor');
  assert.equal(kindsByPid.get(1024), 'tail-monitor');
  assert.equal(kindsByPid.get(1025), 'grep-search');
  assert.equal(kindsByPid.get(1026), 'grep-search');
  assert.equal(kindsByPid.get(1027), 'stale-advisor-launcher');
  assert.equal(kindsByPid.get(1030), 'stale-live-follow');
  for (const pid of [1010, 1014, 1015, 1016, 1017, 1018, 1019, 1020, 1021, 1022, 1028, 1029, 1031]) {
    assert.equal(kindsByPid.has(pid), false, `pid ${pid} must not be reported`);
  }
});

test('classify keeps live advisor and live-follow daemons unlisted and reports model servers', () => {
  assert.equal(
    classify(
      'node /existing/advisor-checkout/.skilled/bin/system-skill-advisor-launcher.cjs',
      pathExists,
    ),
    null,
  );
  assert.equal(
    classify('node /existing/model-checkout/.skilled/bin/hf-model-server.cjs', pathExists),
    'unsupervised-model-server',
  );
  assert.equal(
    classify('node .skilled/bin/hf-model-server.cjs', pathExists),
    'unsupervised-model-server',
  );
  assert.equal(
    classify('node /missing/model-checkout/.skilled/bin/hf-model-server.cjs', pathExists),
    'stale-model-server',
  );
  assert.equal(
    classify('node /existing/model checkout/.skilled/bin/hf-model-server.cjs', pathExists),
    'unsupervised-model-server',
  );
  assert.equal(
    classify('node /missing/model checkout/.skilled/bin/hf-model-server.cjs', pathExists),
    'stale-model-server',
  );
  assert.equal(
    classify(
      'node --max-old-space-size=4096 /existing/model-checkout/.skilled/bin/hf-model-server.cjs',
      pathExists,
    ),
    'unsupervised-model-server',
  );
  assert.equal(
    classify('bash /existing/live-repo/.skilled/bin/git-live-follow.sh --live main', pathExists),
    null,
  );
});

test('classify ignores shell command text and app arguments that resemble helpers', () => {
  assert.equal(classify("bash -lc 'node --test /tmp/wrapped.test.cjs'"), null);
  assert.equal(
    classify('node /tmp/other-process.cjs .skilled/bin/hf-model-server.cjs', pathExists),
    null,
  );
  assert.equal(
    classify('/Applications/Editor.app/Contents/MacOS/Electron node --test /tmp/app.test.cjs'),
    null,
  );
});

test('--json returns the orphan array, count, and total RSS', async () => {
  const result = await runMain(['--json'], {
    runPs: () => psRow({ pid: 2031, rssKb: 2048, command: 'tail -f /tmp/fixture.log' }),
  });
  const report = JSON.parse(result.output);
  assert.equal(result.exitCode, 0);
  assert.equal(report.count, 1);
  assert.equal(report.totalRssMb, 2);
  assert.equal(report.orphans[0].kind, 'tail-monitor');
  assert.equal(report.orphans[0].rssMb, 2);
});

test('--summary prints the complete doctor line or orphans: none', async () => {
  const populated = await runMain(['--summary'], {
    runPs: () => psRow({ pid: 2032, rssKb: 2048, command: 'tail -f /tmp/fixture.log' }),
  });
  assert.equal(
    populated.output,
    'orphans: 1, about 2 MB; list them with node .skilled/commands/doctor/scripts/orphan-process-check.cjs --reap\n',
  );
  const empty = await runMain(['--summary'], { runPs: () => '' });
  assert.equal(empty.output, 'orphans: none\n');
});

test('renderTable keeps the age column aligned across kinds', async () => {
  const result = await runMain([]);
  const lines = result.output.trimEnd().split('\n');
  const ageOffset = lines[0].indexOf('AGE');
  const rowLines = lines.filter((line) => /^\d+\s/.test(line));

  assert.ok(rowLines.length > 1);
  assert.ok(rowLines.some((line) => line.includes('unsupervised-model-server')));
  for (const line of rowLines) {
    assert.match(line.slice(ageOffset), /^(?:\d+-)?\d{2}:\d{2}(?::\d{2})?\s/);
  }
});

test('--min-age-min overrides the default threshold', async () => {
  const result = await runMain(['--summary', '--min-age-min', '5'], {
    runPs: () => psRow({
      pid: 2037,
      etime: '10:00',
      rssKb: 1024,
      command: 'node --test /tmp/recent.test.cjs',
    }),
  });
  assert.equal(result.exitCode, 0);
  assert.equal(
    result.output,
    'orphans: 1, about 1 MB; list them with node .skilled/commands/doctor/scripts/orphan-process-check.cjs --reap\n',
  );
});

test('a ps failure is informational and exits zero', async () => {
  const result = await runMain(['--summary'], {
    runPs: () => { throw new Error('ps unavailable'); },
  });
  assert.equal(result.exitCode, 0);
  assert.equal(result.output, 'orphan check could not run: ps unavailable\n');
});

test('--reap without --yes prints confirmation and never signals', async () => {
  let signalCount = 0;
  const result = await runMain(['--reap'], {
    runPs: () => psRow({ pid: 2033, command: 'tail -f /tmp/fixture.log' }),
    signalProcess: () => { signalCount += 1; },
  });
  assert.equal(result.exitCode, 0);
  assert.equal(signalCount, 0);
  const confirmation = [
    'To confirm, run:',
    'node .skilled/commands/doctor/scripts/orphan-process-check.cjs',
    '--reap --yes',
  ].join(' ');
  assert.ok(result.output.includes(confirmation));
});

test('--reap --yes skips a pid whose command changed', async () => {
  let calls = 0;
  let signalCount = 0;
  const result = await runMain(['--reap', '--yes'], {
    runPs: () => {
      calls += 1;
      if (calls === 1) return psRow({ pid: 2034, command: 'node --test /tmp/original.test.cjs' });
      return '1:00:00 501 node --test /tmp/reused.test.cjs\n';
    },
    signalProcess: () => { signalCount += 1; },
  });
  assert.equal(result.exitCode, 0);
  assert.equal(signalCount, 0);
  assert.match(result.output, /skipped pid=2034: command changed/);
});

test('--reap --yes checks the uid and sends SIGTERM only to the original process', async () => {
  let calls = 0;
  let nowCalls = 0;
  const signals = [];
  const result = await runMain(['--reap', '--yes'], {
    now: () => {
      nowCalls += 1;
      return nowCalls === 1 ? 1000000 : 1100000;
    },
    runPs: (args) => {
      calls += 1;
      if (calls === 1) return psRow({ pid: 2035, command: 'tail -f /tmp/fixture.log' });
      assert.deepEqual(args, ['-o', 'etime=,uid=,command=', '-p', '2035']);
      return '1:01:40 501 tail -f /tmp/fixture.log\n';
    },
    signalProcess: (pid, signal) => { signals.push({ pid, signal }); },
    isAlive: (() => {
      let checks = 0;
      return () => { checks += 1; return checks === 1; };
    })(),
    sleep: async () => {},
  });
  assert.equal(result.exitCode, 0);
  assert.equal(calls, 2);
  assert.deepEqual(signals, [{ pid: 2035, signal: 'SIGTERM' }]);
  assert.match(result.output, /killed pid=2035 kind=tail-monitor/);
});

test('--reap --yes skips a pid whose rechecked age differs from the scan', async () => {
  let calls = 0;
  let signalCount = 0;
  const result = await runMain(['--reap', '--yes'], {
    now: () => 1000000,
    runPs: () => {
      calls += 1;
      if (calls === 1) return psRow({ pid: 2038, command: 'tail -f /tmp/fixture.log' });
      return '2:00:00 501 tail -f /tmp/fixture.log\n';
    },
    signalProcess: () => { signalCount += 1; },
    isAlive: () => false,
    sleep: async () => {},
  });
  assert.equal(result.exitCode, 0);
  assert.equal(signalCount, 0);
  assert.match(result.output, /skipped pid=2038: start time changed/);
});

test('--reap --yes skips a pid whose rechecked uid changed', async () => {
  let calls = 0;
  let signalCount = 0;
  const result = await runMain(['--reap', '--yes'], {
    now: () => 1000000,
    runPs: () => {
      calls += 1;
      if (calls === 1) return psRow({ pid: 2039, command: 'tail -f /tmp/fixture.log' });
      return '1:00:00 502 tail -f /tmp/fixture.log\n';
    },
    signalProcess: () => { signalCount += 1; },
    isAlive: () => false,
    sleep: async () => {},
  });
  assert.equal(result.exitCode, 0);
  assert.equal(signalCount, 0);
  assert.match(result.output, /skipped pid=2039: uid changed to 502/);
});

test('--reap --yes reports a process that stays alive after the grace period', async () => {
  let calls = 0;
  const result = await runMain(['--reap', '--yes'], {
    now: () => 1000000,
    runPs: () => {
      calls += 1;
      if (calls === 1) return psRow({ pid: 2036, command: 'tail -f /tmp/fixture.log' });
      return '1:00:00 501 tail -f /tmp/fixture.log\n';
    },
    signalProcess: () => {},
    isAlive: () => true,
    sleep: async () => {},
  });
  assert.equal(result.exitCode, 0);
  assert.match(result.output, /still-alive pid=2036 kind=tail-monitor/);
});
