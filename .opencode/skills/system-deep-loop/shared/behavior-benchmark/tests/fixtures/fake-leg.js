'use strict';
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: fake-leg (behavior-bench hermetic executor)                    ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Stand-in executor for the hermetic test. Emits one presentation ║
// ║          marker, one task-dispatch line, and one fixture artifact, then   ║
// ║          exits 0. HANG mode prints one line then idles forever so the     ║
// ║          runner's watchdog must kill it.                                  ║
// ╚══════════════════════════════════════════════════════════════════════════╝
// Runs as an ES module: the nearest package.json declares "type": "module",
// so a .js executor uses import syntax rather than require.
import fs from 'node:fs';
import path from 'node:path';

const FIXTURE_DIR = process.env.FAKE_LEG_FIXTURE;

// The literal marker the SMOKE scenario contract declares.
process.stdout.write('BENCH-SMOKE-MARKER\n');

if (process.env.FAKE_LEG_HANG === '1') {
  // One line of activity, then silence: the watchdog's activity-stale check must fire.
  setInterval(() => {}, 1000);
} else {
  // A dispatch-looking line the runner counts as delegation evidence.
  process.stdout.write('{"tool":"task","subagent_type":"deep-research"}\n');
  if (FIXTURE_DIR) {
    try {
      fs.mkdirSync(FIXTURE_DIR, { recursive: true });
      fs.writeFileSync(path.join(FIXTURE_DIR, 'artifact.txt'), 'smoke\n');
    } catch {
      // best-effort; the runner tolerates a missing artifact
    }
  }
  process.exit(0);
}
