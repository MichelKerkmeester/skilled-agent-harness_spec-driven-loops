// MODULE: Deep-Loop Dependency Seams — Self-Containment Guard
//
// Guards that the runtime resolves its external dependencies (zod,
// better-sqlite3, tsx) from this skill's OWN node_modules rather than reaching
// into a sibling skill's installed packages. A regression here means a deep
// reach-in path was reintroduced, which re-couples the runtime to
// system-spec-kit's internal layout and risks a native-binding ABI mismatch.

import { describe, expect, it } from 'vitest';

import { createRequire } from 'node:module';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const testDir = dirname(fileURLToPath(import.meta.url));
const runtimeRoot = resolve(testDir, '..', '..');
const skillsRoot = resolve(runtimeRoot, '..');

// Resolve bare specifiers as they resolve from inside the runtime's own lib/
// directory — the same vantage point the production lib files import from.
const runtimeRequire = createRequire(resolve(runtimeRoot, 'lib', 'index.cjs'));

// Versions system-spec-kit pins. The runtime must install the SAME versions so a
// process that loads both skills' native better-sqlite3 binding stays ABI-safe.
const PINNED = {
  'better-sqlite3': '12.10.0',
  zod: '4.4.3',
  tsx: '4.21.0',
} as const;

function packageVersionFor(specifier: string): string {
  const pkgPath = runtimeRequire.resolve(`${specifier}/package.json`);
  return JSON.parse(readFileSync(pkgPath, 'utf8')).version as string;
}

describe('runtime dependency self-containment', () => {
  it('resolves zod, better-sqlite3, and tsx from the runtime\'s own node_modules', () => {
    const ownNodeModules = resolve(runtimeRoot, 'node_modules') + sep;
    for (const specifier of Object.keys(PINNED)) {
      const resolved = runtimeRequire.resolve(`${specifier}/package.json`);
      expect(resolved.startsWith(ownNodeModules)).toBe(true);
    }
  });

  it('never resolves an external dependency through a sibling skill', () => {
    const siblingNodeModules = resolve(skillsRoot, 'system-spec-kit') + sep;
    for (const specifier of Object.keys(PINNED)) {
      const resolved = runtimeRequire.resolve(`${specifier}/package.json`);
      expect(resolved.startsWith(siblingNodeModules)).toBe(false);
    }
  });

  it('installs the same dependency versions system-spec-kit pins', () => {
    for (const [specifier, version] of Object.entries(PINNED)) {
      expect(packageVersionFor(specifier)).toBe(version);
    }
  });

  it('bare-resolves the tsx loader the .cjs scripts boot from', () => {
    const loader = runtimeRequire.resolve('tsx');
    expect(loader.endsWith(`${sep}dist${sep}loader.mjs`)).toBe(true);
    expect(loader.startsWith(resolve(runtimeRoot, 'node_modules') + sep)).toBe(true);
  });

  it('keeps every lib and script free of deep sibling-skill node_modules reach-ins', () => {
    // Two reach-in shapes exist in this tree's history: the `.ts` import string
    // (a contiguous path) and the `.cjs` tsx-loader built from a path.resolve()
    // arg array split across lines. Both must be caught — the array form is how
    // the loader scripts referenced a sibling skill before self-containment.
    const REACH_IN = /system-spec-kit[\\/](?:mcp_server|scripts)[\\/]node_modules/;
    const REACH_IN_ARRAY = /'system-spec-kit'\s*,\s*'(?:mcp_server|scripts)'\s*,\s*'node_modules'/;
    const offenders: string[] = [];
    for (const root of ['lib', 'scripts'] as const) {
      for (const file of walk(resolve(runtimeRoot, root))) {
        if (!/\.(ts|cjs|mjs|js)$/.test(file)) continue;
        const content = readFileSync(file, 'utf8');
        if (REACH_IN.test(content) || REACH_IN_ARRAY.test(content)) offenders.push(file);
      }
    }
    expect(offenders).toEqual([]);
  });

  it('loads the bare imports the lib production code depends on', async () => {
    const { z } = await import('zod');
    expect(typeof z.string).toBe('function');

    const Database = (await import('better-sqlite3')).default;
    const db = new Database(':memory:');
    db.exec('CREATE TABLE seam_probe (value INTEGER)');
    db.prepare('INSERT INTO seam_probe (value) VALUES (?)').run(7);
    expect(db.prepare('SELECT value FROM seam_probe').get()).toEqual({ value: 7 });
    db.close();
  });
});

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules') continue;
      out.push(...walk(full));
    } else {
      out.push(full);
    }
  }
  return out;
}
