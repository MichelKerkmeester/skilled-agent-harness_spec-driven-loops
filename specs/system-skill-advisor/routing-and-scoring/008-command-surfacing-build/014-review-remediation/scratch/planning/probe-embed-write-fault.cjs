// Run from the repository root: node <this file>
// Applies the claude-only fixture with a write that throws on its second call
// and prints what the engine did about it. Builds and removes its own temp tree.
const fs = require('fs'); const os = require('os'); const path = require('path');
const S = path.resolve('.skilled/commands/doctor/scripts');
const embed = require(path.join(S, 'agents-md-embed.cjs'));
const { composeFixture } = require(path.join(S, 'tests/fixtures/agents-md/compose-fixture.cjs'));
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'probe-embed-fault-'));
const dir = path.join(tmp, 'claude-only'); composeFixture('claude-only', dir);
const ls = () => fs.readdirSync(dir).sort().join(',');
console.log('before: ' + ls());
const out = []; let calls = 0;
const hooks = {
  log: (l) => out.push(l), warn: (l) => out.push(l),
  write: (f, c) => { calls += 1; if (calls === 2) { const e = new Error('EACCES: permission denied, open ' + path.basename(f)); e.code = 'EACCES'; throw e; } fs.writeFileSync(f, c, 'utf8'); },
};
embed.main(['plan', '--root', dir, '--create-router'], hooks);
const text = out.join('\n');
const digest = /^plan-digest: (\S+)/m.exec(text)[1]; const backup = /^backup: (.*)$/m.exec(text)[1];
out.length = 0;
try { console.log('main returned ' + embed.main(['apply', '--root', dir, '--plan-digest', digest, '--create-router'], hooks)); }
catch (e) { console.log('main threw: ' + e.message); }
console.log('apply printed backup line: ' + out.some((l) => l.startsWith('backup:')) + ', undo line: ' + out.some((l) => l.startsWith('undo:')) + ', restored line: ' + out.some((l) => /restored/.test(l)));
console.log('after: ' + ls());
fs.rmSync(tmp, { recursive: true, force: true });
if (backup.startsWith(os.tmpdir())) fs.rmSync(backup, { recursive: true, force: true });
