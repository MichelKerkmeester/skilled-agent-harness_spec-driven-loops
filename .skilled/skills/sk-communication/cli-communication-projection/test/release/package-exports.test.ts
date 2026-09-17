// ───────────────────────────────────────────────────────────────────
// MODULE: Package Export Boundary Tests
// ───────────────────────────────────────────────────────────────────

import { execFileSync } from 'node:child_process';
import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

import { beforeAll, describe, expect, it } from 'vitest';

interface PackageExportTarget {
  readonly types: string;
  readonly import: string;
}

interface PackageManifest {
  readonly exports: Readonly<Record<string, PackageExportTarget>>;
}

const PACKAGE_ROOT = fileURLToPath(new URL('../..', import.meta.url));
const EXPECTED_EXPORTS = [
  '.',
  './contracts',
  './versioning',
  './doctor',
  './release',
  './providers',
  './runtimes',
  './privacy',
  './evaluation',
  './observability',
] as const;

beforeAll(() => {
  execFileSync('npm', ['run', 'build'], {
    cwd: PACKAGE_ROOT,
    encoding: 'utf8',
    stdio: 'pipe',
  });
});

describe('package export boundary', () => {
  it('publishes the complete coherent public surface', async () => {
    const manifest = await readPackageManifest();

    expect(Object.keys(manifest.exports)).toEqual(EXPECTED_EXPORTS);
  });

  it('resolves every declared export to built JavaScript and declaration files', async () => {
    const manifest = await readPackageManifest();

    for (const [subpath, target] of Object.entries(manifest.exports)) {
      const importPath = resolve(PACKAGE_ROOT, target.import);
      const typesPath = resolve(PACKAGE_ROOT, target.types);
      expect((await stat(importPath)).isFile(), `${subpath} JavaScript`).toBe(true);
      expect((await stat(typesPath)).isFile(), `${subpath} declarations`).toBe(true);

      const loaded = await import(pathToFileURL(importPath).href);
      expect(Object.keys(loaded).length, `${subpath} runtime exports`).toBeGreaterThan(0);
    }
  });
});

async function readPackageManifest(): Promise<PackageManifest> {
  const serialized = await readFile(resolve(PACKAGE_ROOT, 'package.json'), 'utf8');
  return JSON.parse(serialized) as PackageManifest;
}
