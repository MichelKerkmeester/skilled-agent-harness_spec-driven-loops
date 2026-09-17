// ───────────────────────────────────────────────────────────────
// MODULE: Divergence Ledger Capture Workspace-Root Tests
// ───────────────────────────────────────────────────────────────
// The capture script finds the workspace by the system-spec-kit sentinel before it
// loads the built scorer. Run from a copy with no build beside it, a script that got
// past the lookup fails on the missing scorer instead of on the workspace root.

import { copyFileSync, mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const SCRIPT = resolve(dirname(fileURLToPath(import.meta.url)), '../../scripts/routing-accuracy/capture-local-native-divergence-ledger.mjs');
const SCRIPT_SUBPATH = join('skills', 'system-skill-advisor', 'runtime', 'scripts', 'routing-accuracy', 'capture-local-native-divergence-ledger.mjs');

// A checkout holds the tree under .opencode, under .skilled, or under .skilled with
// .opencode linked to it, and Node runs a script through that link by its real path.
const LAYOUTS = [
  { name: 'today', realRoot: '.opencode', linked: false, entries: ['.opencode'] },
  { name: 'skilled-only', realRoot: '.skilled', linked: false, entries: ['.skilled'] },
  { name: 'whole-link', realRoot: '.skilled', linked: true, entries: ['.opencode', '.skilled'] },
] as const;

describe('capture-local-native-divergence-ledger workspace root', () => {
  for (const layout of LAYOUTS) {
    for (const entry of layout.entries) {
      it(`${layout.name} through ${entry}: finds the workspace root before loading the scorer`, () => {
        const root = mkdtempSync(join(tmpdir(), 'capture-ledger-root-'));
        try {
          const scriptCopy = join(root, layout.realRoot, SCRIPT_SUBPATH);
          mkdirSync(dirname(scriptCopy), { recursive: true });
          copyFileSync(SCRIPT, scriptCopy);
          const skillDir = join(root, layout.realRoot, 'skills', 'system-spec-kit');
          mkdirSync(skillDir, { recursive: true });
          writeFileSync(join(skillDir, 'SKILL.md'), '# sentinel\n');
          if (layout.linked) symlinkSync('.skilled', join(root, '.opencode'));

          const result = spawnSync(process.execPath, [join(root, entry, SCRIPT_SUBPATH)], { encoding: 'utf8', timeout: 30_000 });

          expect(result.stderr).not.toContain('Unable to locate the workspace root');
          expect(result.stderr).toContain('fusion.js');
        } finally {
          rmSync(root, { recursive: true, force: true });
        }
      });
    }
  }
});
