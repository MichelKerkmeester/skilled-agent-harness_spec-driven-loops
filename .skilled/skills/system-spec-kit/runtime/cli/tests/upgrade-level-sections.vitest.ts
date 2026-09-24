// ───────────────────────────────────────────────────────────────────
// MODULE: Upgrade Level Section Tests
// ───────────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

const SK = path.resolve(__dirname, '../../..');
const SCRIPT = path.join(SK, 'runtime/cli/spec/upgrade-level.sh');
const RENDERER = path.join(SK, 'runtime/cli/templates/inline-gate-renderer.sh');
const DOCS = ['spec', 'plan', 'tasks', 'implementation-summary'] as const;
const tempDirs: string[] = [];

function createLevelOnePacket(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'upgrade-level-sections-'));
  tempDirs.push(root);
  const packet = path.join(root, '001-probe');
  fs.mkdirSync(packet);

  for (const doc of DOCS) {
    const template = path.join(SK, 'templates/core', `${doc}.md.tmpl`);
    const rendered = spawnSync('bash', [RENDERER, '--level', '1', template], { encoding: 'utf8' });
    expect(rendered.status, rendered.stderr).toBe(0);
    fs.writeFileSync(path.join(packet, `${doc}.md`), rendered.stdout);
  }

  return packet;
}

function upgrade(packet: string, level: 2 | 3): void {
  const result = spawnSync('bash', [SCRIPT, packet, '--to', String(level)], { encoding: 'utf8' });
  expect(result.status, result.stderr).toBe(0);
}

function normalizedHeading(line: string): string {
  return line
    .replace(/^##\s+/, '')
    .replace(/^\d+\.?\s*/, '')
    .trim()
    .toLowerCase();
}

function expectDocumentShape(file: string, doc: string): void {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split(/\r?\n/);

  expect(lines.filter((line) => line.startsWith('title:')).length, `${doc} title lines`).toBe(1);
  expect(lines.filter((line) => line.includes('<!-- SPECKIT_LEVEL:')).length, `${doc} level markers`).toBe(1);

  const headingKeys = lines.filter((line) => /^##\s+/.test(line)).map(normalizedHeading);
  expect(new Set(headingKeys).size, `${doc} repeated headings`).toBe(headingKeys.length);

  const opens = new Map<string, number>();
  const closes = new Map<string, number>();
  for (const line of lines) {
    for (const [, name] of line.matchAll(/<!-- ANCHOR:([\w-]+) -->/g)) {
      opens.set(name, (opens.get(name) ?? 0) + 1);
    }
    for (const [, name] of line.matchAll(/<!-- \/ANCHOR:([\w-]+) -->/g)) {
      closes.set(name, (closes.get(name) ?? 0) + 1);
    }
  }
  for (const [name, count] of opens) {
    expect(count, `${doc} opens ${name}`).toBe(1);
    expect(closes.get(name) ?? 0, `${doc} closes ${name}`).toBe(1);
  }

  for (let index = 0; index < lines.length; index += 1) {
    if (lines[index].trim() !== '---') continue;
    let next = index + 1;
    while (next < lines.length && lines[next].trim() === '') next += 1;
    expect(lines[next]?.trim(), `${doc} has adjacent dividers`).not.toBe('---');
  }

  for (let index = 0; index < lines.length;) {
    if (!lines[index].startsWith('|')) {
      index += 1;
      continue;
    }

    const tableStart = index;
    while (index < lines.length && lines[index].startsWith('|')) index += 1;
    expect(lines[tableStart + 1], `${doc} table separator`).toMatch(/^\|(?:\s*:?-{3,}:?\s*\|)+\s*$/);
  }
}

afterEach(() => {
  for (const dir of tempDirs.splice(0)) fs.rmSync(dir, { recursive: true, force: true });
});

describe('upgrade-level.sh section fragments', () => {
  it.each([2, 3] as const)('keeps level-one document structure when upgrading to level %i', (level) => {
    const packet = createLevelOnePacket();
    upgrade(packet, level);

    for (const doc of ['spec', 'plan', 'tasks']) {
      expectDocumentShape(path.join(packet, `${doc}.md`), doc);
    }

    const criteria = fs.readFileSync(path.join(packet, 'acceptance-criteria.md'), 'utf8').split(/\r?\n/);
    const frontmatterEnd = criteria.indexOf('---', 1);
    expect(criteria[0]).toBe('---');
    expect(frontmatterEnd, 'acceptance-criteria frontmatter closes').toBeGreaterThan(0);
    expect(
      criteria.slice(1, frontmatterEnd).some((line) => line.includes('<!--')),
      'comment inside acceptance-criteria frontmatter',
    ).toBe(false);
    expect(criteria.filter((line) => line.includes('<!-- SPECKIT_LEVEL:'))).toHaveLength(1);
    expect(
      criteria.findIndex((line) => line.includes('<!-- SPECKIT_LEVEL:')),
      'acceptance-criteria level marker follows its H1',
    ).toBeGreaterThan(criteria.findIndex((line) => line.startsWith('# ')));

    const criteriaText = criteria.join('\n');
    for (const slot of ['[PACKET-ID]', '[YYYY-MM-DDTHH:MM:SSZ]', '[SESSION-ID]', '[NAME]']) {
      expect(criteriaText.includes(slot), `acceptance-criteria keeps ${slot}`).toBe(false);
    }
    expect(criteriaText).toContain('packet_pointer: "scaffold/001-probe"');

    if (level === 3) {
      const spec = fs.readFileSync(path.join(packet, 'spec.md'), 'utf8');
      const headings = spec.split(/\r?\n/).filter((line) => /^##\s+/.test(line));
      expect(headings.filter((line) => line === '## EXECUTIVE SUMMARY')).toHaveLength(1);
      expect(headings.filter((line) => /RISK MATRIX\s*$/i.test(line))).toHaveLength(1);
      expect(headings.filter((line) => /USER STORIES\s*$/i.test(line))).toHaveLength(1);
    }
  });

  it('stamps the implementation-summary it recreates on upgrade', () => {
    const packet = createLevelOnePacket();
    fs.rmSync(path.join(packet, 'implementation-summary.md'));
    upgrade(packet, 2);

    const summary = fs.readFileSync(path.join(packet, 'implementation-summary.md'), 'utf8');
    expect(summary.includes('[###-feature-name]'), 'no template packet-name slot').toBe(false);
    expect(summary.includes('template-session'), 'no template session id').toBe(false);
    expect(summary.includes('[template:'), 'no template title suffix').toBe(false);
    expect(summary).toContain('packet_pointer: "scaffold/001-probe"');
  });
});
