import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const CLI_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SKILL_ROOT = path.resolve(CLI_ROOT, '..', '..');
const REGISTRY_PATH = path.join(CLI_ROOT, 'lib', 'validator-registry.json');

/** The documents allowed to state the registry's size as "<N>-rule registry". */
const DOCS = [
  path.join(SKILL_ROOT, 'README.md'),
  path.join(CLI_ROOT, 'README.md'),
  path.join(SKILL_ROOT, 'SKILL.md'),
];

function registrySize(): number {
  const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8')) as unknown[];
  expect(Array.isArray(registry), 'validator-registry.json must stay an array').toBe(true);
  return registry.length;
}

/** Collects every "<N>-rule registry" phrase written in the tracked docs. */
function documentedCounts(): Array<{ count: number; doc: string }> {
  const claims: Array<{ count: number; doc: string }> = [];
  for (const doc of DOCS) {
    const text = fs.readFileSync(doc, 'utf8');
    for (const match of text.matchAll(/(\d+)-rule registry/g)) {
      claims.push({ count: Number.parseInt(match[1] as string, 10), doc });
    }
  }
  return claims;
}

describe('validator-registry.json versus the documented rule count', () => {
  it('keeps every "<N>-rule registry" claim equal to the registry length', () => {
    const size = registrySize();
    const claims = documentedCounts();
    expect(claims.length, 'at least one documented count must exist to guard').toBeGreaterThan(0);
    for (const claim of claims) {
      expect(claim.count, `${path.relative(SKILL_ROOT, claim.doc)} claims ${claim.count} rules`).toBe(size);
    }
  });
});
