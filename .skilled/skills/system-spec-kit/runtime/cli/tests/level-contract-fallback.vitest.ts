// ───────────────────────────────────────────────────────────────────
// TEST: Level Contract Fallback
// ───────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  resolveLevelContract,
  serializeLevelContract,
  type SpecKitLevel,
} from '../../lib/templates/level-contract-resolver';

const LEVELS: SpecKitLevel[] = ['1', '2', '3', '3+', 'phase', 'review', 'research'];
const TEMPLATE_UTILS_SOURCE = path.resolve(__dirname, '../lib/template-utils.sh');
const MANIFEST_SOURCE = path.resolve(__dirname, '../../../templates/spec-kit-docs.json');

// template-utils.sh is copied into a skill tree with no node_modules and no
// TypeScript resolver, so resolve_level_contract can only take its plain-Node
// fallback, which reads the manifest copied beside it.
let workRoot: string;
let templateUtils: string;
let manifestPath: string;

function resolveThroughFallback(level: string) {
  return spawnSync('bash', ['-c', 'source "$1" && resolve_level_contract "$2"', 'resolve', templateUtils, level], {
    encoding: 'utf8',
  });
}

function withManifest(mutate: (manifest: Record<string, any>) => void, run: () => void) {
  const original = fs.readFileSync(MANIFEST_SOURCE, 'utf8');
  const manifest = JSON.parse(original);
  mutate(manifest);
  fs.writeFileSync(manifestPath, JSON.stringify(manifest), 'utf8');
  try {
    run();
  } finally {
    fs.writeFileSync(manifestPath, original, 'utf8');
  }
}

beforeAll(() => {
  workRoot = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'level-contract-fallback-')));
  const libDir = path.join(workRoot, 'skill', 'runtime', 'cli', 'lib');
  const templatesDir = path.join(workRoot, 'skill', 'templates');
  fs.mkdirSync(libDir, { recursive: true });
  fs.mkdirSync(templatesDir, { recursive: true });
  templateUtils = path.join(libDir, 'template-utils.sh');
  manifestPath = path.join(templatesDir, 'spec-kit-docs.json');
  fs.copyFileSync(TEMPLATE_UTILS_SOURCE, templateUtils);
  fs.copyFileSync(MANIFEST_SOURCE, manifestPath);
});

afterAll(() => {
  fs.rmSync(workRoot, { recursive: true, force: true });
});

describe('level contract fallback', () => {
  it('runs without tsx or the TypeScript resolver', () => {
    expect(fs.existsSync(path.join(workRoot, 'skill', 'node_modules'))).toBe(false);
    expect(fs.existsSync(path.join(workRoot, 'skill', 'runtime', 'lib'))).toBe(false);
  });

  it.each(LEVELS)('prints the same contract JSON as the TypeScript resolver for Level %s', (level) => {
    const result = resolveThroughFallback(level);
    expect(result.status, result.stderr).toBe(0);
    expect(result.stdout).toBe(JSON.stringify(serializeLevelContract(resolveLevelContract(level))));
  });

  it('carries the optional and lifecycle docs create.sh scaffolds from', () => {
    const contract = JSON.parse(resolveThroughFallback('2').stdout);
    expect(contract.optionalAddonDocs).toContain('acceptance-criteria.md');
    expect(contract.lifecycleRequiredDocs.afterImplementationStarts).toContain('implementation-summary.md');
  });

  it('rejects an unknown level with the TypeScript resolver message', () => {
    let expected = '';
    try {
      resolveLevelContract('bogus' as SpecKitLevel);
    } catch (error) {
      expected = (error as Error).message;
    }
    expect(expected).not.toBe('');

    const result = resolveThroughFallback('bogus');
    expect(result.status).toBe(3);
    expect(result.stdout).toBe('');
    expect(result.stderr.trim()).toBe(expected);
  });

  it.each([
    ['a missing level row', (m: Record<string, any>) => { delete m.levels['2']; }],
    ['an empty required core list', (m: Record<string, any>) => { m.levels['2'].requiredCoreDocs = []; }],
    ['a non-array addon list', (m: Record<string, any>) => { m.levels['2'].optionalAddonDocs = 'acceptance-criteria.md'; }],
    ['a document name that climbs out', (m: Record<string, any>) => { m.levels['2'].optionalAddonDocs = ['../escape.md']; }],
    ['a malformed lifecycle block', (m: Record<string, any>) => { m.levels['2'].lifecycleRequiredDocs = ['implementation-summary.md']; }],
    ['an unknown section gate level', (m: Record<string, any>) => { m.levels['2'].sectionGates = { problem: ['9'] }; }],
    ['a missing frontmatter marker level', (m: Record<string, any>) => { delete m.levels['2'].frontmatterMarkerLevel; }],
  ])('rejects %s instead of printing a partial contract', (_name, mutate) => {
    withManifest(mutate, () => {
      const result = resolveThroughFallback('2');
      expect(result.status).toBe(3);
      expect(result.stdout).toBe('');
      expect(result.stderr.trim()).toBe('Internal template contract could not be resolved for Level 2');
    });
  });
});
