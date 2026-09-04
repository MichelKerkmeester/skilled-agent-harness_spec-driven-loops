// ---------------------------------------------------------------
// MODULE: Dist Freshness Walker Tests
// ---------------------------------------------------------------
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { collectSourceFiles } = require(path.resolve(__dirname, '..', 'lib', 'dist-freshness.cjs'));

const createdRoots: string[] = [];

function makePackageRoot(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'dist-freshness-walker-'));
  createdRoots.push(root);
  fs.writeFileSync(path.join(root, 'package.json'), '{}\n');
  fs.mkdirSync(path.join(root, 'lib'));
  fs.writeFileSync(path.join(root, 'lib', 'index.ts'), 'export {};\n');
  return root;
}

const pkg = { id: 'test/pkg', sourceCandidates: ['.'] };

afterEach(() => {
  for (const root of createdRoots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('collectSourceFiles and symlinks', () => {
  it('collects regular sources under the root', () => {
    const root = makePackageRoot();
    const { files, missing } = collectSourceFiles(pkg, root, 'default');
    expect(missing).toEqual([]);
    expect(files.map((f: string) => path.relative(root, f)).sort()).toEqual(['lib/index.ts', 'package.json']);
  });

  it('does not descend into a symlinked directory', () => {
    const root = makePackageRoot();
    const other = fs.mkdtempSync(path.join(os.tmpdir(), 'dist-freshness-other-'));
    createdRoots.push(other);
    fs.writeFileSync(path.join(other, 'built.js'), '// built\n');
    fs.symlinkSync(other, path.join(root, 'runtime'));
    const { files } = collectSourceFiles(pkg, root, 'default');
    expect(files.some((f: string) => f.endsWith('built.js'))).toBe(false);
  });

  it('skips a dangling symlink instead of throwing', () => {
    const root = makePackageRoot();
    fs.symlinkSync(path.join(root, 'not-built-yet', 'dist'), path.join(root, 'runtime'));
    const { files, missing } = collectSourceFiles(pkg, root, 'default');
    expect(missing).toEqual([]);
    expect(files.map((f: string) => path.relative(root, f)).sort()).toEqual(['lib/index.ts', 'package.json']);
  });
});
