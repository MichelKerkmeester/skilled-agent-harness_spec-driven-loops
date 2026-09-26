import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

const root = join(import.meta.dirname, '..');
const starter = join(root, 'starter');
const recording = join(root, 'agent-run');
const files = ['.gitignore', 'package.json', 'package-lock.json', 'src/session.js', 'tests/session.test.js'];
const temporary = mkdtempSync(join(tmpdir(), 'supercov-tutorial-verify-'));
const project = join(temporary, 'project');
const launcher = join(root, 'node_modules/supercov/bin/supercov.js');
const original = readFileSync(join(starter, 'tests/session.test.js'), 'utf8');
const completed = readFileSync(join(recording, 'completed/tests/session.test.js'), 'utf8');

function cli(args, status = 0) {
  const result = spawnSync(process.execPath, [launcher, ...args], {
    cwd: project, encoding: 'utf8', timeout: 120000, maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, NO_COLOR: '1', FORCE_COLOR: '0' },
  });
  assert.ifError(result.error);
  assert.equal(result.status, status, result.stdout + result.stderr);
  return result.stdout;
}

function summary(tests, conditions) {
  const data = JSON.parse(cli(['runs', 'latest', '--json'])).data;
  assert.equal(data.valid, true);
  assert.equal(data.testExitCode, 0);
  assert.equal(data.measurement.complete, true);
  assert.equal(data.tests, tests);
  assert.equal(data.testOutcomes.passed, tests);
  assert.equal(data.coverage.lines.percentage, 100);
  assert.equal(data.coverage.branches.percentage, 100);
  assert.equal(data.coverage.conditionCoveragePct, conditions * 50);
  assert.equal(data.confidence.assertionCoveredMcdcConditions, conditions);
  return data;
}

try {
  assert.deepEqual(readdirSync(join(starter, 'tests')), ['session.test.js']);
  assert.equal((original.match(/\btest\(/g) ?? []).length, 2);
  assert.ok(completed.startsWith(original), 'The agent must preserve the original tests.');
  assert.equal(JSON.parse(readFileSync(join(starter, 'package.json'), 'utf8')).scripts.test, 'node --test');
  for (const file of files) {
    mkdirSync(dirname(join(project, file)), { recursive: true });
    cpSync(join(starter, file), join(project, file));
  }

  cli(['--', 'npm', 'test']);
  const before = summary(2, 1);
  writeFileSync(join(project, 'tests/session.test.js'), completed);
  cli(['--', 'npm', 'test']);
  const after = summary(3, 2);
  const diff = JSON.parse(cli(['diff', before.run, after.run, '--json'])).data;
  assert.deepEqual(diff.delta, { lines: 0, branches: 0, mcdc: 50 });
  assert.deepEqual(diff.gained.mcdc, ['src/session.js:2 C2 !expired']);
  assert.deepEqual([diff.lost.lineCount, diff.lost.branchCount, diff.lost.mcdcCount], [0, 0, 0]);

  const source = readFileSync(join(project, 'src/session.js'), 'utf8');
  assert.ok(source.includes('signedIn && !expired'));
  writeFileSync(join(project, 'src/session.js'), source.replace('signedIn && !expired', 'signedIn'));
  writeFileSync(join(project, 'tests/session.test.js'), original);
  cli(['--', 'npm', 'test']);
  writeFileSync(join(project, 'tests/session.test.js'), completed);
  assert.match(cli(['--', 'npm', 'test'], 1), /expired session/);
  writeFileSync(join(project, 'src/session.js'), source);
  cli(['--', 'npm', 'test']);

  // Keep the published record tied to the unchanged starter and saved agent edit.
  const metadata = JSON.parse(readFileSync(join(recording, 'metadata.json'), 'utf8'));
  const hash = bytes => createHash('sha256').update(bytes).digest('hex');
  for (const file of files) {
    assert.equal(hash(readFileSync(join(starter, file))), metadata.files[file].before);
    const afterBytes = file === 'tests/session.test.js' ? completed : readFileSync(join(starter, file));
    assert.equal(hash(afterBytes), metadata.files[file].after);
  }
  const commands = readFileSync(join(recording, 'commands.jsonl'), 'utf8').trim().split('\n').map(JSON.parse);
  for (const name of ['before-summary', 'before-file', 'after-summary', 'diff']) {
    const excerpt = readFileSync(join(recording, `${name}.txt`), 'utf8');
    assert.ok(commands.some(command => command.exitCode === 0 && command.stdout === excerpt), `${name} must match the recorded output`);
  }
  const guide = readFileSync(join(root, '../../docs/agent-loop.md'), 'utf8');
  const prompt = /```text(?: supercov-prompt)?\n([\s\S]*?)\n```/.exec(guide)?.[1];
  const example = guide.split('## Example\n')[1]?.split('\n## ')[0];
  assert.ok(example, 'The workflow must include the recorded example.');
  const blocks = [...example.matchAll(/```text\n([\s\S]*?)\n```/g)].map(match => match[1]);
  const normalize = value => value.replace(/\s+/g, ' ').trim();
  assert.equal(normalize(prompt), normalize(metadata.prompt));
  assert.equal(blocks.length, 3, 'Keep the summary, gap, and comparison output.');
  for (const block of blocks) {
    assert.ok(commands.some(command => command.stdout.includes(block)), 'Example output must come from the recorded run.');
  }
  const shownTest = /```js\n(test\('a signed-in visitor[\s\S]*?)\n```/.exec(guide)?.[1];
  assert.ok(shownTest && completed.includes(shownTest), 'The workflow must show the saved agent test.');
  console.log('Workflow example verified: clean starter, saved agent test, MC/DC 50% → 100%, and regression detected.');
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
