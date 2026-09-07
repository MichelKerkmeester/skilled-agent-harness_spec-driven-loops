// The manifest declares a version per template and every template declares
// its own in its SPECKIT_TEMPLATE_SOURCE marker. The two had drifted apart for
// five templates before anything compared them, and the staleness checker
// pointed at a manifest path that did not exist, so it could never say so.
// This suite is the comparison.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = path.resolve(TEST_DIR, '..', '..', '..');
const TEMPLATES_DIR = path.join(SKILL_ROOT, 'templates');
const MANIFEST_PATH = path.join(TEMPLATES_DIR, 'spec-kit-docs.json');
const STALENESS_CHECKER = path.join(SKILL_ROOT, 'runtime', 'cli', 'spec', 'check-template-staleness.sh');

interface Manifest {
  versions: Record<string, string>;
  documents: Record<string, { template?: string | null }>;
  levels: Record<string, { lazyAddonDocs: string[] }>;
}

function loadManifest(): Manifest {
  return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8')) as Manifest;
}

function findTemplate(name: string): string {
  for (const role of ['core', 'addons', 'packet-types']) {
    const candidate = path.join(TEMPLATES_DIR, role, name);
    if (fs.existsSync(candidate)) return candidate;
  }
  throw new Error(`template ${name} not found under core/, addons/ or packet-types/`);
}

function markerVersion(templatePath: string): string {
  const source = fs.readFileSync(templatePath, 'utf8');
  const match = source.match(/SPECKIT_TEMPLATE_SOURCE:[^|]*\|\s*(v[0-9]+(?:\.[0-9]+)*)/);
  if (!match) throw new Error(`${templatePath} carries no SPECKIT_TEMPLATE_SOURCE marker`);
  return match[1];
}

describe('template version parity', () => {
  it('declares in the manifest the version each shipped template declares in its marker', () => {
    const manifest = loadManifest();
    const drift: string[] = [];
    for (const [templateName, declared] of Object.entries(manifest.versions)) {
      const shipped = markerVersion(findTemplate(templateName));
      if (shipped !== declared) drift.push(`${templateName}: manifest ${declared}, template ${shipped}`);
    }
    expect(drift).toEqual([]);
  });

  it('lists a version for every template a document entry names, and names no template that is missing', () => {
    const manifest = loadManifest();
    for (const [doc, entry] of Object.entries(manifest.documents)) {
      if (!entry.template) continue;
      expect(manifest.versions[entry.template], `${doc} names ${entry.template}`).toBeDefined();
      expect(() => findTemplate(entry.template as string), `${doc} template on disk`).not.toThrow();
    }
  });

  it('keeps the lazy add-on list identical across the four numbered levels', () => {
    const manifest = loadManifest();
    const base = [...manifest.levels['1'].lazyAddonDocs].sort();
    for (const level of ['2', '3', '3+']) {
      expect([...manifest.levels[level].lazyAddonDocs].sort(), `level ${level}`).toEqual(base);
    }
  });

  it('points the staleness checker at the manifest that exists', () => {
    const script = fs.readFileSync(STALENESS_CHECKER, 'utf8');
    const match = script.match(/manifest_path="\$TEMPLATE_DIR\/([^"]+)"/);
    expect(match, 'the checker declares its manifest path').not.toBeNull();
    expect(fs.existsSync(path.join(TEMPLATES_DIR, match![1]))).toBe(true);
  });
});
