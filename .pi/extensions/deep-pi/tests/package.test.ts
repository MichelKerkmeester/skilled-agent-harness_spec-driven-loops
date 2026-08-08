// ───────────────────────────────────────────────────────────────────
// MODULE: DeepPi Package Tests
// ───────────────────────────────────────────────────────────────────

import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const extensionsDir = fileURLToPath(new URL('../extensions', import.meta.url));

describe('DeepPi package identity', () => {
  it('uses the final package and extension names', async () => {
    const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
    expect(pkg.name).toBe('@arter/deep-pi');
    expect(pkg.version).toBe('1.0.0');
    expect(pkg.pi.extensions).toEqual(['./extensions/deeppi.ts']);
    expect(pkg.scripts['benchmark:live']).toBe('node scripts/live-benchmark.mjs');
  });

  it('uses the Apache 2.0 license', async () => {
    const license = await readFile(new URL('../LICENSE', import.meta.url), 'utf8');
    expect(license).toContain('Apache License');
    expect(license).toContain('Version 2.0, January 2004');
  });

  it('contains no stale runtime branding', async () => {
    const files = await readdir(new URL('../extensions', import.meta.url), { recursive: true });
    const sources = await Promise.all(
      files.filter((file) => file.endsWith('.ts'))
        .map((file) => readFile(join(extensionsDir, file), 'utf8')),
    );
    expect(sources.join('\n')).not.toMatch(/PI_HARNESS|deepseek-optimized|harnessPlugin/);
  });
});
