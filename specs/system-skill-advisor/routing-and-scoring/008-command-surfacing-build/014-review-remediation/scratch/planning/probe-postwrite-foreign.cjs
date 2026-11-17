// Run from the repository root: node <this file>
// Applies each agents-md fixture in a temporary folder and counts the foreign
// lines the post-write proof would see on disk, after the pointer sync ran.
const fs = require('fs'); const os = require('os'); const path = require('path');
const R = path.resolve(".skilled/commands/doctor/scripts");
const embed = require(path.join(R, 'agents-md-embed.cjs'));
const { composeFixture, MANIFEST_PATH } = require(path.join(R, 'tests/fixtures/agents-md/compose-fixture.cjs'));
const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'probe-postwrite-'));
const lines = [];
for (const name of ['absent', 'adopted', 'claude-only', 'foreign', 'forked', 'pure', 'shadowed-pin', 'stale']) {
  for (const extra of [[], ['--create-router']]) {
    const dir = path.join(tmp, `${name}${extra.length}`); composeFixture(name, dir);
    const out = []; const hooks = { log: (l) => out.push(l), warn: (l) => out.push(l) };
    let c; try { c = embed.compose({ root: dir, manifest, createRouter: extra.length > 0 }); } catch (e) { lines.push(`${name}${extra.join('')}: compose throws ${e.constructor.name}`); continue; }
    const planCode = embed.main(['plan', '--root', dir, ...extra], hooks);
    const digest = (out.find((l) => l.startsWith('plan-digest:')) || '').split(/\s+/)[1];
    if (!digest) { lines.push(`${name}${extra.join('')}: plan ${planCode} no digest (writes ${c.writes.length})`); continue; }
    out.length = 0;
    const code = embed.main(['apply', '--root', dir, '--plan-digest', digest, ...extra], hooks);
    const onDisk = fs.readFileSync(path.join(dir, manifest.root_file), 'utf8');
    const p = embed.preservationCheck(c.oldText, onDisk, manifest, { removed: c.removedCopies });
    const backup = (out.find((l) => l.startsWith('backup:')) || '').slice(8).trim();
    if (backup && backup.startsWith(os.tmpdir())) fs.rmSync(backup, { recursive: true, force: true });
    lines.push(`${name}${extra.join('')}: apply exit ${code} dropped=${p.dropped.length} foreign=${p.foreign.length}`);
  }
}
fs.rmSync(tmp, { recursive: true, force: true });
console.log(lines.join('\n'));
