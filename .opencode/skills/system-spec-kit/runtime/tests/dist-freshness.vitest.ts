import { describe, it, expect } from 'vitest';
import { createRequire } from 'node:module';
import { mkdtempSync, mkdirSync, readFileSync, existsSync, statSync, readdirSync, writeFileSync, utimesSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, relative } from 'node:path';

const require = createRequire(import.meta.url);
const distFreshness = require('../cli/lib/dist-freshness.cjs') as {
  checkPackageFreshness: (packageId: string, options?: Record<string, unknown>) => Record<string, unknown>;
  writePackageSourceHashCache: (packageId: string, options?: Record<string, unknown>) => Record<string, unknown>;
};

const SERVER_ROOT = dirname(__dirname);
const LIB = join(SERVER_ROOT, 'lib');
const DIST_LIB = join(SERVER_ROOT, 'dist', 'lib');


function walkTsFiles(dir: string, out: string[] = []): string[] {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      // test-helpers/ is excluded from the production tsc build, so it never
      // produces dist output — skip it to mirror the build's scope.
      if (entry.name === 'test-helpers') continue;
      walkTsFiles(full, out);
    }
    else if (entry.isFile() && entry.name.endsWith('.ts') && !entry.name.endsWith('.d.ts')) out.push(full);
  }
  return out;
}

describe('dist freshness — global walk', () => {
  it('every lib/**/*.ts has a corresponding dist/lib/**/*.js', () => {
    const sources = walkTsFiles(LIB);
    const missing: string[] = [];
    for (const src of sources) {
      const rel = relative(LIB, src);
      const distPath = join(DIST_LIB, rel.replace(/\.ts$/, '.js'));
      if (!existsSync(distPath)) missing.push(rel);
    }
    expect(
      missing,
      `${missing.length} source file(s) missing from dist — run 'npm run build':\n  ${missing.slice(0, 10).join('\n  ')}${missing.length > 10 ? `\n  ...and ${missing.length - 10} more` : ''}`,
    ).toEqual([]);
  });

  it('no lib/**/*.ts is newer than its compiled dist counterpart', () => {
    const sources = walkTsFiles(LIB);
    const stale: string[] = [];
    for (const src of sources) {
      const rel = relative(LIB, src);
      const distPath = join(DIST_LIB, rel.replace(/\.ts$/, '.js'));
      if (!existsSync(distPath)) continue;
      const srcMtime = statSync(src).mtimeMs;
      const dstMtime = statSync(distPath).mtimeMs;
      if (srcMtime > dstMtime + 1000) stale.push(`${rel} (src newer by ${Math.round((srcMtime - dstMtime) / 1000)}s)`);
    }
    expect(
      stale,
      `${stale.length} source file(s) newer than dist — run 'npm run build':\n  ${stale.slice(0, 10).join('\n  ')}${stale.length > 10 ? `\n  ...and ${stale.length - 10} more` : ''}`,
    ).toEqual([]);
  });
});

describe('dist freshness — build cache bootstrap', () => {
  it('pre-warms the checker hash cache so content-identical mtime skew reports fresh', () => {
    const workspaceRoot = mkdtempSync(join(tmpdir(), 'dist-freshness-bootstrap-'));
    const packageRoot = join(workspaceRoot, '.opencode', 'skills', 'system-spec-kit', 'runtime');
    mkdirSync(join(packageRoot, 'dist'), { recursive: true });
    mkdirSync(join(packageRoot, 'schemas'), { recursive: true });
    // The checker refuses to judge freshness for a package root that carries no
    // package.json AND node_modules, because a checkout that thin cannot rebuild
    // anyway. This fixture has to clear that bar or every assertion below reads
    // "unprovisioned" instead of exercising the staleness logic under test.
    mkdirSync(join(packageRoot, 'node_modules'), { recursive: true });
    writeFileSync(join(packageRoot, 'package.json'), '{"name":"fixture"}\n');
    writeFileSync(join(packageRoot, 'tsconfig.json'), '{"compilerOptions":{}}\n');
    mkdirSync(join(packageRoot, 'dist', 'lib', 'validation'), { recursive: true });
    mkdirSync(join(packageRoot, 'lib', 'validation'), { recursive: true });
    for (const dir of ['templates', 'spec', 'graph', 'config', 'description']) {
      mkdirSync(join(packageRoot, 'lib', dir), { recursive: true });
      writeFileSync(join(packageRoot, 'lib', dir, 'index.ts'), `export const ${dir}Fixture = true;\n`);
    }
    writeFileSync(join(packageRoot, 'lib', 'validation', 'orchestrator.ts'), 'export const orchestrator = true;\n');
    writeFileSync(join(packageRoot, 'dist', 'lib', 'validation', 'orchestrator.js'), 'console.log("built");\n');

    const oldTime = new Date('2026-01-01T00:00:00.000Z');
    const newTime = new Date('2026-01-02T00:00:00.000Z');
    utimesSync(join(packageRoot, 'dist', 'lib', 'validation', 'orchestrator.js'), oldTime, oldTime);
    for (const source of ['package.json', 'tsconfig.json', join('lib', 'validation', 'orchestrator.ts')]) {
      utimesSync(join(packageRoot, source), newTime, newTime);
    }

    const before = distFreshness.checkPackageFreshness('system-spec-kit/runtime', {
      workspaceRoot,
      entry: 'validation-orchestrator',
    });
    expect(before.status).toBe('stale');

    const cacheWrite = distFreshness.writePackageSourceHashCache('system-spec-kit/runtime', {
      workspaceRoot,
      entry: 'validation-orchestrator',
    });
    expect(cacheWrite.status).toBe('cached');
    expect(existsSync(String(cacheWrite.cachePath))).toBe(true);

    const after = distFreshness.checkPackageFreshness('system-spec-kit/runtime', {
      workspaceRoot,
      entry: 'validation-orchestrator',
    });
    expect(after.status).toBe('fresh');
    expect(after).not.toHaveProperty('newestSourceMtime');

    writeFileSync(join(packageRoot, 'lib', 'validation', 'orchestrator.ts'), 'export const orchestrator = false;\n');
    utimesSync(join(packageRoot, 'lib', 'validation', 'orchestrator.ts'), newTime, newTime);
    const stale = distFreshness.checkPackageFreshness('system-spec-kit/runtime', {
      workspaceRoot,
      entry: 'validation-orchestrator',
    });
    expect(stale.status).toBe('stale');
  });

  it('uses per-entry cache paths so one entry cannot vouch for another', () => {
    const workspaceRoot = mkdtempSync(join(tmpdir(), 'dist-freshness-entry-'));
    const packageRoot = join(workspaceRoot, '.opencode', 'skills', 'system-spec-kit', 'runtime');
    mkdirSync(join(packageRoot, 'dist', 'lib', 'validation'), { recursive: true });
    mkdirSync(join(packageRoot, 'lib', 'validation'), { recursive: true });
    for (const dir of ['templates', 'spec', 'graph', 'config', 'description']) {
      mkdirSync(join(packageRoot, 'lib', dir), { recursive: true });
    }
    // The 'default' entry hashes the whole package sourceCandidates list, so the
    // fixture has to carry one file per candidate directory or the hash errors.
    for (const dir of ['api', 'configs', 'core', 'handlers', 'hooks', 'scripts']) {
      mkdirSync(join(packageRoot, dir), { recursive: true });
      writeFileSync(join(packageRoot, dir, 'index.ts'), `export const ${dir}Fixture = true;\n`);
    }
    for (const file of ['package.json', 'tsconfig.json']) {
      writeFileSync(join(packageRoot, file), '{}\n');
    }
    writeFileSync(join(packageRoot, 'lib', 'validation', 'orchestrator.ts'), 'export const orchestrator = true;\n');
    for (const dir of ['templates', 'spec', 'graph', 'config', 'description']) {
      writeFileSync(join(packageRoot, 'lib', dir, 'index.ts'), `export const ${dir}Fixture = true;\n`);
    }
    writeFileSync(join(packageRoot, 'dist', 'tsconfig.tsbuildinfo'), 'buildinfo\n');
    writeFileSync(join(packageRoot, 'dist', 'lib', 'validation', 'orchestrator.js'), 'orchestrator\n');

    const defaultCache = distFreshness.writePackageSourceHashCache('system-spec-kit/runtime', {
      workspaceRoot,
      entry: 'default',
    });
    const orchestratorCache = distFreshness.writePackageSourceHashCache('system-spec-kit/runtime', {
      workspaceRoot,
      entry: 'validation-orchestrator',
    });

    expect(defaultCache.status).toBe('cached');
    expect(orchestratorCache.status).toBe('cached');
    expect(defaultCache.cachePath).not.toBe(orchestratorCache.cachePath);
  });
});
