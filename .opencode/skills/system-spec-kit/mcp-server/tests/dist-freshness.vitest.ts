import { describe, it, expect } from 'vitest';
import { createRequire } from 'node:module';
import { mkdtempSync, mkdirSync, readFileSync, existsSync, statSync, readdirSync, writeFileSync, utimesSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, relative } from 'node:path';

const require = createRequire(import.meta.url);
const distFreshness = require('../../scripts/lib/dist-freshness.cjs') as {
  checkPackageFreshness: (packageId: string, options?: Record<string, unknown>) => Record<string, unknown>;
  writePackageSourceHashCache: (packageId: string, options?: Record<string, unknown>) => Record<string, unknown>;
};

const SERVER_ROOT = dirname(__dirname);
const LIB = join(SERVER_ROOT, 'lib');
const DIST_LIB = join(SERVER_ROOT, 'dist', 'lib');

interface CanonicalExport {
  source: string;
  dist: string;
  markers: string[];
}

const CANONICAL: CanonicalExport[] = [
  {
    source: 'search/rerank/retrieval-rescue.ts',
    dist: 'search/rerank/retrieval-rescue.js',
    markers: ['SPECKIT_RERANK_LAYER', 'applyRetrievalRescueLayer', 'isRetrievalRescueEnabled'],
  },
  {
    source: 'search/pipeline/stage2-fusion.ts',
    dist: 'search/pipeline/stage2-fusion.js',
    markers: ['applyRetrievalRescueLayer'],
  },
  {
    source: 'embedders/registry.ts',
    dist: 'embedders/registry.js',
    markers: ['@spec-kit/shared/embeddings/registry.js'],
  },
  {
    source: 'embedders/adapter.ts',
    dist: 'embedders/adapter.js',
    markers: ['EmbedderAdapter'],
  },
];

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

describe('dist freshness — canonical exports', () => {
  for (const entry of CANONICAL) {
    const srcPath = join(LIB, entry.source);
    const distPath = join(DIST_LIB, entry.dist);

    it(`${entry.source}: source file exists`, () => {
      expect(existsSync(srcPath), `Missing source file: ${srcPath}`).toBe(true);
    });

    it(`${entry.source}: compiled dist file exists`, () => {
      expect(existsSync(distPath), `Missing dist file — run 'npm run build': ${distPath}`).toBe(true);
    });

    it(`${entry.source}: all canonical markers present in dist`, () => {
      const distContent = readFileSync(distPath, 'utf8');
      const missing = entry.markers.filter(m => !distContent.includes(m));
      expect(missing, `Markers missing from ${entry.dist} — run 'npm run build'. Missing: ${missing.join(', ')}`).toEqual([]);
    });

    it(`${entry.source}: dist mtime >= source mtime`, () => {
      const srcMtime = statSync(srcPath).mtimeMs;
      const dstMtime = statSync(distPath).mtimeMs;
      expect(dstMtime, `Source ${entry.source} is newer than dist — run 'npm run build'`).toBeGreaterThanOrEqual(srcMtime - 1000);
    });
  }
});

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
    const packageRoot = join(workspaceRoot, '.opencode', 'skills', 'system-spec-kit', 'mcp-server');
    mkdirSync(join(packageRoot, 'dist'), { recursive: true });
    mkdirSync(join(packageRoot, 'schemas'), { recursive: true });
    writeFileSync(join(packageRoot, 'package.json'), '{"name":"fixture"}\n');
    writeFileSync(join(packageRoot, 'tsconfig.json'), '{"compilerOptions":{}}\n');
    writeFileSync(join(packageRoot, 'spec-memory-cli.ts'), 'export const cli = true;\n');
    writeFileSync(join(packageRoot, 'tool-schemas.ts'), 'export const schemas = true;\n');
    writeFileSync(join(packageRoot, 'schemas', 'memory.json'), '{"type":"object"}\n');
    writeFileSync(join(packageRoot, 'dist', 'spec-memory-cli.js'), 'console.log("built");\n');

    const oldTime = new Date('2026-01-01T00:00:00.000Z');
    const newTime = new Date('2026-01-02T00:00:00.000Z');
    utimesSync(join(packageRoot, 'dist', 'spec-memory-cli.js'), oldTime, oldTime);
    for (const source of ['package.json', 'tsconfig.json', 'spec-memory-cli.ts', 'tool-schemas.ts', join('schemas', 'memory.json')]) {
      utimesSync(join(packageRoot, source), newTime, newTime);
    }

    const before = distFreshness.checkPackageFreshness('system-spec-kit/mcp-server', {
      workspaceRoot,
      entry: 'spec-memory-cli',
    });
    expect(before.status).toBe('stale');

    const cacheWrite = distFreshness.writePackageSourceHashCache('system-spec-kit/mcp-server', {
      workspaceRoot,
      entry: 'spec-memory-cli',
    });
    expect(cacheWrite.status).toBe('cached');
    expect(existsSync(String(cacheWrite.cachePath))).toBe(true);

    const after = distFreshness.checkPackageFreshness('system-spec-kit/mcp-server', {
      workspaceRoot,
      entry: 'spec-memory-cli',
    });
    expect(after.status).toBe('fresh');
    expect(after).not.toHaveProperty('newestSourceMtime');

    writeFileSync(join(packageRoot, 'spec-memory-cli.ts'), 'export const cli = false;\n');
    utimesSync(join(packageRoot, 'spec-memory-cli.ts'), newTime, newTime);
    const stale = distFreshness.checkPackageFreshness('system-spec-kit/mcp-server', {
      workspaceRoot,
      entry: 'spec-memory-cli',
    });
    expect(stale.status).toBe('stale');
  });

  it('uses per-entry cache paths so one entry cannot vouch for another', () => {
    const workspaceRoot = mkdtempSync(join(tmpdir(), 'dist-freshness-entry-'));
    const packageRoot = join(workspaceRoot, '.opencode', 'skills', 'system-spec-kit', 'mcp-server');
    mkdirSync(join(packageRoot, 'dist', 'lib', 'validation'), { recursive: true });
    mkdirSync(join(packageRoot, 'lib', 'validation'), { recursive: true });
    for (const dir of ['templates', 'spec', 'graph', 'config', 'description']) {
      mkdirSync(join(packageRoot, 'lib', dir), { recursive: true });
    }
    mkdirSync(join(packageRoot, 'schemas'), { recursive: true });
    for (const file of ['package.json', 'tsconfig.json']) {
      writeFileSync(join(packageRoot, file), '{}\n');
    }
    writeFileSync(join(packageRoot, 'spec-memory-cli.ts'), 'export const cli = true;\n');
    writeFileSync(join(packageRoot, 'tool-schemas.ts'), 'export const schemas = true;\n');
    writeFileSync(join(packageRoot, 'schemas', 'memory.json'), '{"type":"object"}\n');
    writeFileSync(join(packageRoot, 'lib', 'validation', 'orchestrator.ts'), 'export const orchestrator = true;\n');
    for (const dir of ['templates', 'spec', 'graph', 'config', 'description']) {
      writeFileSync(join(packageRoot, 'lib', dir, 'index.ts'), `export const ${dir}Fixture = true;\n`);
    }
    writeFileSync(join(packageRoot, 'dist', 'spec-memory-cli.js'), 'cli\n');
    writeFileSync(join(packageRoot, 'dist', 'lib', 'validation', 'orchestrator.js'), 'orchestrator\n');

    const cliCache = distFreshness.writePackageSourceHashCache('system-spec-kit/mcp-server', {
      workspaceRoot,
      entry: 'spec-memory-cli',
    });
    const orchestratorCache = distFreshness.writePackageSourceHashCache('system-spec-kit/mcp-server', {
      workspaceRoot,
      entry: 'validation-orchestrator',
    });

    expect(cliCache.status).toBe('cached');
    expect(orchestratorCache.status).toBe('cached');
    expect(cliCache.cachePath).not.toBe(orchestratorCache.cachePath);
  });
});
