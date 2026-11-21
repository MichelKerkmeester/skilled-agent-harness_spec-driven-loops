// One-off check: the new track reader returns byte-identical output to the
// previous one on trees that hold a single sub-track level.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
const [oldPath, newPath, fixturePath, repoSpecs] = process.argv.slice(2);
const oldReader = await import(oldPath);
const newReader = await import(newPath);
const { buildSubtrackTree, buildFlatTree } = await import(fixturePath);
const dump = (tracks) => JSON.stringify({ tracks, diagnostics: tracks.diagnostics });
const results = [];
const check = (label, specs) => {
  const a = dump(oldReader.readWorkingTreeTracks(specs));
  const b = dump(newReader.readWorkingTreeTracks(specs));
  results.push(`${label} working-tree identical=${a === b} bytes=${a.length}`);
};
const checkCommit = (label, specs) => {
  const a = JSON.stringify(oldReader.readCommitTracks(specs, 'HEAD'));
  const b = JSON.stringify(newReader.readCommitTracks(specs, 'HEAD'));
  results.push(`${label} commit identical=${a === b} bytes=${a.length}`);
};
for (const [label, build] of [['subtrack-fixture', buildSubtrackTree], ['flat-fixture', buildFlatTree], ['subtrack-fixture-no-flat', (r) => buildSubtrackTree(r, { flat: false })]]) {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'one-level-parity-')));
  const { specs } = build(root);
  check(label, specs);
  execFileSync('git', ['init', '--quiet'], { cwd: root });
  execFileSync('git', ['add', '-A', '-f'], { cwd: root });
  execFileSync('git', ['-c', 'commit.gpgsign=false', '-c', 'user.name=F', '-c', 'user.email=f@example.com', 'commit', '--quiet', '--no-verify', '-m', 'f'], { cwd: root });
  checkCommit(label, specs);
  fs.rmSync(root, { recursive: true, force: true });
}
check('this-repository', repoSpecs);
checkCommit('this-repository', repoSpecs);
console.log(results.join('\n'));
