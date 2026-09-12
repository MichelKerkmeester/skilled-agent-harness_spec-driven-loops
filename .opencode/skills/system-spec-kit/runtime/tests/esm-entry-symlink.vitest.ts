// ───────────────────────────────────────────────────────────────────
// MODULE: ESM Entry Point Resolution Tests
// ───────────────────────────────────────────────────────────────────
// A module asks whether it is the process entrypoint by comparing the path it was launched with
// against the location it derives from its own file. Node canonicalizes the second and not the
// first, so a launch path reaching it through a symlink made a file differ from itself: the module
// decided it had merely been imported, skipped its work, and exited 0 with no output. These cases
// pin both directions, because a fix that reports "entrypoint" unconditionally would also make the
// symlink case pass while running library code on every import.

import { mkdirSync, mkdtempSync, realpathSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';

import { afterEach, describe, expect, it } from 'vitest';

import { isMainModule } from '../cli/lib/esm-entry.js';
import { isMainModule as isMainModuleRuntime } from '../lib/esm-entry.js';

const roots: string[] = [];

/**
 * A temp root in its physical form.
 *
 * The platform temp directory is itself reached through a symlink on some systems, and a module's
 * own URL is always canonical. Handing the fixture a non-canonical path would compare two spellings
 * of the same file and fail for a reason the code under test never produces.
 */
function makeRoot(): string {
  const root = realpathSync(mkdtempSync(join(tmpdir(), 'esm-entry-')));
  roots.push(root);
  return root;
}

afterEach(() => {
  while (roots.length > 0) {
    try {
      rmSync(roots.pop() as string, { recursive: true, force: true });
    } catch {
      // best-effort cleanup
    }
  }
});

describe('isMainModule', () => {
  it('recognizes the entrypoint when the launch path runs through a symlink', () => {
    const root = makeRoot();
    mkdirSync(join(root, 'real'));
    mkdirSync(join(root, 'link'));
    const real = join(root, 'real', 'tool.mjs');
    writeFileSync(real, '\n', 'utf8');
    const linked = join(root, 'link', 'tool.mjs');
    symlinkSync(real, linked);

    const original = process.argv[1];
    try {
      process.argv[1] = linked;
      expect(isMainModule(pathToFileURL(real).href)).toBe(true);
    } finally {
      process.argv[1] = original;
    }
  });

  it('still recognizes the entrypoint when no symlink is involved', () => {
    const root = makeRoot();
    const real = join(root, 'tool.mjs');
    writeFileSync(real, '\n', 'utf8');

    const original = process.argv[1];
    try {
      process.argv[1] = real;
      expect(isMainModule(pathToFileURL(real).href)).toBe(true);
    } finally {
      process.argv[1] = original;
    }
  });

  it('reports false for a module that is imported rather than executed', () => {
    const root = makeRoot();
    const entry = join(root, 'entry.mjs');
    const other = join(root, 'library.mjs');
    writeFileSync(entry, '\n', 'utf8');
    writeFileSync(other, '\n', 'utf8');

    const original = process.argv[1];
    try {
      process.argv[1] = entry;
      expect(isMainModule(pathToFileURL(other).href)).toBe(false);
    } finally {
      process.argv[1] = original;
    }
  });

  it('reports false rather than raising when the launch path does not exist', () => {
    const root = makeRoot();
    const missing = join(root, 'gone', 'tool.mjs');

    const original = process.argv[1];
    try {
      process.argv[1] = missing;
      expect(() => isMainModule(pathToFileURL(join(root, 'other.mjs')).href)).not.toThrow();
      expect(isMainModule(pathToFileURL(join(root, 'other.mjs')).href)).toBe(false);
    } finally {
      process.argv[1] = original;
    }
  });
});

// The scripts that need this answer run straight from source with no build step, so they cannot
// import the typed helper. They use a plain-JavaScript twin, which has to agree with it.
describe('the plain-JavaScript twin', () => {
  const twin = resolve(__dirname, '..', 'cli', 'lib', 'esm-entry.mjs');

  /** What a real child process concludes when launched by `launchPath`. */
  function askChild(launchPath: string): string {
    const result = spawnSync(process.execPath, [launchPath], { encoding: 'utf8' });
    if (result.status !== 0) {
      throw new Error(`probe failed: ${result.stderr || result.stdout}`);
    }
    return result.stdout.trim();
  }

  it('lets a script launched through a symlink know it was run', () => {
    const root = makeRoot();
    mkdirSync(join(root, 'real'));
    mkdirSync(join(root, 'link'));
    const real = join(root, 'real', 'tool.mjs');
    writeFileSync(
      real,
      `import { isMainModule } from ${JSON.stringify(pathToFileURL(twin).href)};\n`
        + 'process.stdout.write(isMainModule(import.meta.url) ? "ENTRY" : "NOT-ENTRY");\n',
      'utf8',
    );
    symlinkSync(real, join(root, 'link', 'tool.mjs'));

    expect(askChild(real)).toBe('ENTRY');
    expect(askChild(join(root, 'link', 'tool.mjs'))).toBe('ENTRY');
  });

  it('leaves an imported module dormant', () => {
    const root = makeRoot();
    const library = join(root, 'library.mjs');
    writeFileSync(
      library,
      `import { isMainModule } from ${JSON.stringify(pathToFileURL(twin).href)};\n`
        + 'export const verdict = isMainModule(import.meta.url) ? "ENTRY" : "NOT-ENTRY";\n',
      'utf8',
    );
    const entry = join(root, 'entry.mjs');
    writeFileSync(
      entry,
      `const m = await import(${JSON.stringify(pathToFileURL(library).href)});\n`
        + 'process.stdout.write(m.verdict);\n',
      'utf8',
    );

    expect(askChild(entry)).toBe('NOT-ENTRY');
  });
});

// Three copies exist, each forced by a boundary the code cannot cross: the two TypeScript projects
// exclude one another's trees, and the scripts that run before any build can import neither. They
// have to answer identically, or fixing one leaves the others quietly wrong.
describe('the copies agree', () => {
  it('answers identically for a symlinked launch path, a direct one, and an import', () => {
    const root = makeRoot();
    mkdirSync(join(root, 'real'));
    mkdirSync(join(root, 'link'));
    const real = join(root, 'real', 'tool.mjs');
    writeFileSync(real, '\n', 'utf8');
    const linked = join(root, 'link', 'tool.mjs');
    symlinkSync(real, linked);
    const other = join(root, 'real', 'library.mjs');
    writeFileSync(other, '\n', 'utf8');

    const cases: Array<[string, string, boolean]> = [
      [linked, pathToFileURL(real).href, true],
      [real, pathToFileURL(real).href, true],
      [real, pathToFileURL(other).href, false],
    ];

    const original = process.argv[1];
    try {
      for (const [launch, moduleUrl, expected] of cases) {
        process.argv[1] = launch;
        expect(isMainModule(moduleUrl)).toBe(expected);
        expect(isMainModuleRuntime(moduleUrl)).toBe(expected);
      }
    } finally {
      process.argv[1] = original;
    }
  });
});
