import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';

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
    markers: ['MANIFESTS', 'getAdapter'],
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
    if (entry.isDirectory()) walkTsFiles(full, out);
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
