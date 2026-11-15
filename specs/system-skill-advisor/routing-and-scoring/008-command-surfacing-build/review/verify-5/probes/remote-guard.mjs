// Probe: does a git remote that one turn adds survive the per-turn restore, and
// is the no-remote check the boundary that stops a push? Local file URLs only.
// Runs no model session: it calls the runner's exported guard and the restore
// module directly against a temp arena-shaped repository.
import { spawnSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { liveArmRefusal } from '../../../../../../../.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs';
import { restoreTurn, statusSnapshot } from '../../../../../../../.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/worktree-restore.mjs';

const T = '/tmp/v5-remote-probe';
rmSync(T, { recursive: true, force: true });
const arena = join(T, 'arena');
const bare = join(T, 'outside.git');
const bareDirect = join(T, 'outside-direct.git');
mkdirSync(arena, { recursive: true });
const git = (cwd, ...args) => {
  const r = spawnSync('git', ['-c', 'core.fsmonitor=false', '-c', 'user.name=probe', '-c', 'user.email=probe@example.invalid', ...args], { cwd, encoding: 'utf8' });
  return { status: r.status, out: (r.stdout + r.stderr).trim() };
};
try {
  git(T, 'init', '-q', '--bare', bare);
  git(T, 'init', '-q', '--bare', bareDirect);
  git(arena, 'init', '-q');
  writeFileSync(join(arena, 'a.txt'), 'a\n');
  git(arena, 'add', '-A');
  git(arena, 'commit', '-qm', 'base');
  writeFileSync(join(arena, '.git', 'skilled-behaviour-arena'), 'probe\n');

  console.log('turn 1 guard (the only call runTurn makes):', JSON.stringify(liveArmRefusal(arena)));
  const before = statusSnapshot(arena);
  // What a turn would run: add a remote.
  git(arena, 'remote', 'add', 'origin', `file://${bare}`);
  const after = statusSnapshot(arena);
  console.log('status paths before', before.size, 'after', after.size, '(the restore sees no change)');
  const restore = restoreTurn({ cwd: arena, before });
  console.log('restoreTurn:', JSON.stringify({ restored: restore.restored, leftoverPaths: restore.leftoverPaths }));
  console.log('remotes after restore:', JSON.stringify(git(arena, 'remote').out));
  console.log('guard if it ran before turn 2:', JSON.stringify(liveArmRefusal(arena)));
  const pushed = git(arena, 'push', '-q', 'origin', 'HEAD:refs/heads/probe');
  console.log('turn 2 push through the surviving remote: exit', pushed.status);

  // Boundary check: a single turn with no remote at all pushes to an explicit URL.
  git(arena, 'remote', 'remove', 'origin');
  console.log('guard with no remote:', JSON.stringify(liveArmRefusal(arena)));
  const direct = git(arena, 'push', '-q', `file://${bareDirect}`, 'HEAD:refs/heads/probe');
  console.log('push to an explicit URL with no remote: exit', direct.status);
} finally {
  rmSync(T, { recursive: true, force: true });
  console.log('cleaned');
}
