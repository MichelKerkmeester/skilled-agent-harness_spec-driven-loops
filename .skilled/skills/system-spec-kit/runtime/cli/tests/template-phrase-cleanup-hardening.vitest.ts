// ───────────────────────────────────────────────────────────────────
// MODULE: Template Phrase Cleanup Hardening Tests
// ───────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { runCleanup } from '../spec/template-phrase-cleanup.mjs';
import { loadTemplateDefaults } from '../spec/template-phrase-census.mjs';

const TEMP_ROOTS: string[] = [];

function createSpecFile(packetName: string, content: string): { root: string; file: string } {
  const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'template-phrase-hardening-'));
  TEMP_ROOTS.push(temporaryRoot);
  const root = path.join(temporaryRoot, 'specs');
  const packet = path.join(root, packetName);
  fs.mkdirSync(packet, { recursive: true });
  const file = path.join(packet, 'spec.md');
  fs.writeFileSync(file, content, 'utf8');
  return { root, file };
}

function templateSpecContent(): string {
  const rows = loadTemplateDefaults().spec.rows.join('\n');
  return [
    '---',
    'title: "Atomic cleanup fixture"',
    'description: "Atomic file replacement fixture"',
    'trigger_phrases:',
    rows,
    'importance_tier: "normal"',
    '---',
    '',
    '# Atomic cleanup fixture',
    '',
  ].join('\n');
}

afterEach(() => {
  vi.restoreAllMocks();
  for (const root of TEMP_ROOTS) fs.rmSync(root, { recursive: true, force: true });
  TEMP_ROOTS.length = 0;
});

describe('template phrase cleanup hardening', () => {
  it('renames a complete temporary write, retains its mode and reports hashes', () => {
    const { root, file } = createSpecFile('001-atomic-write', templateSpecContent());
    fs.chmodSync(file, 0o664);
    const previousUmask = process.umask(0o022);
    let report: ReturnType<typeof runCleanup>;
    try {
      report = runCleanup(root, { apply: true, includeArchive: false });
    } finally {
      process.umask(previousUmask);
    }

    expect(report.changed).toBe(1);
    expect(report.changes[0].beforeHash).toMatch(/^[a-f0-9]{64}$/);
    expect(report.changes[0].afterHash).toMatch(/^[a-f0-9]{64}$/);
    expect(fs.readFileSync(file, 'utf8')).toContain('  - "atomic file replacement fixture"');
    expect(fs.statSync(file).mode & 0o777).toBe(0o664);
    expect(fs.readdirSync(path.dirname(file)).filter((entry) => entry.endsWith('.tmp'))).toEqual([]);
  });

  it('leaves the original file intact when rename fails', () => {
    const original = templateSpecContent();
    const { root, file } = createSpecFile('002-atomic-failure', original);
    vi.spyOn(fs, 'renameSync').mockImplementation(() => {
      throw new Error('injected rename failure');
    });

    const report = runCleanup(root, { apply: true, includeArchive: false });

    expect(report.changed).toBe(0);
    expect(report.issues[0].reason).toContain('injected rename failure');
    expect(fs.readFileSync(file, 'utf8')).toBe(original);
    expect(fs.readdirSync(path.dirname(file)).filter((entry) => entry.endsWith('.tmp'))).toEqual([]);
  });

  it('reports no-frontmatter files with the fixer path and command', () => {
    const { root, file } = createSpecFile('003-no-frontmatter', '# No frontmatter\n');
    const report = runCleanup(root, { apply: true, includeArchive: false });

    expect(report.skipped).toBe(0);
    expect(report.routed).toHaveLength(1);
    expect(report.routed[0]).toMatchObject({
      path: '003-no-frontmatter/spec.md',
      fixer: 'fill-frontmatter',
    });
    expect(report.routed[0].fixerPath).toContain('upgrade-legacy.mjs');
    expect(report.routed[0].args).toContain('--roots');
    expect(report.routed[0].args).toContain('--apply');
    expect(report.routed[0].command).toContain('upgrade-legacy.mjs');
    expect(fs.readFileSync(file, 'utf8')).toBe('# No frontmatter\n');
  });
});
