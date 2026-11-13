// Run from the repository root: node <this file>
// Builds a scratch repository, snapshots it, creates two files a turn would leave
// (one whose name holds a space), restores the turn and prints what is left.
// Removes its own temporary repository.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
const { restoreTurn, statusSnapshot } = await import(resolve('.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/worktree-restore.mjs'));
const root = mkdtempSync(join(tmpdir(), 'probe-restore-quoted-'));
const git = (args) => execFileSync('git', ['-c', 'core.fsmonitor=false', ...args], { cwd: root, encoding: 'utf8' });
try {
  git(['init', '--quiet']);
  writeFileSync(join(root, 'kept.txt'), 'kept\n');
  git(['add', 'kept.txt']);
  git(['-c', 'user.name=probe', '-c', 'user.email=probe@example.invalid', 'commit', '--quiet', '-m', 'base']);
  const before = statusSnapshot(root);
  writeFileSync(join(root, 'notes draft.md'), 'draft\n');
  writeFileSync(join(root, 'plain.md'), 'plain\n');
  console.log(`snapshot keys after the turn: ${JSON.stringify([...statusSnapshot(root).keys()].sort())}`);
  console.log(`restoreTurn: ${JSON.stringify(restoreTurn({ cwd: root, before }))}`);
  console.log(`left on disk: notes draft.md ${existsSync(join(root, 'notes draft.md'))}, plain.md ${existsSync(join(root, 'plain.md'))}`);
} finally {
  rmSync(root, { recursive: true, force: true });
}
