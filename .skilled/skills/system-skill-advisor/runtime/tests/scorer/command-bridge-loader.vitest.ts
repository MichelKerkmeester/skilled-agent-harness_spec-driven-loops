// ───────────────────────────────────────────────────────────────────
// MODULE: Command Bridge Loader
// ───────────────────────────────────────────────────────────────────

import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

import { loadCommandBridges } from '../../lib/scorer/command-bridge-loader.js';
import { COMMAND_BRIDGES, GENERATED_COMMAND_BRIDGES } from '../../lib/scorer/projection.js';

const JSON_PATH = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '..', '..', 'scripts', 'command-bridges', 'command-bridges.generated.json',
);

const scratch: string[] = [];
afterEach(() => {
  for (const dir of scratch.splice(0)) rmSync(dir, { recursive: true, force: true });
});

function writeVariant(mutate: (data: { entries: Array<Record<string, any>> }) => void): string {
  const dir = mkdtempSync(join(tmpdir(), 'bridges-'));
  scratch.push(dir);
  const data = JSON.parse(readFileSync(JSON_PATH, 'utf8'));
  mutate(data);
  const path = join(dir, 'command-bridges.generated.json');
  writeFileSync(path, JSON.stringify(data));
  return path;
}

// A project that regenerates the bridges JSON gets the new bridges without
// rebuilding the advisor, and the compiled copy stays the fallback.
describe('command bridges load from the generated JSON at runtime', () => {
  it('renders the shipped JSON exactly as the compiled block', () => {
    expect(loadCommandBridges(JSON_PATH)).toEqual(GENERATED_COMMAND_BRIDGES);
    expect(COMMAND_BRIDGES).toEqual(GENERATED_COMMAND_BRIDGES);
  });

  it('picks up a keyword added to the JSON without a rebuild', () => {
    const path = writeVariant((data) => {
      const entry = data.entries.find((candidate) => candidate.runtime.typescript.enabled);
      entry!.runtime.typescript.keywords.push('a phrase only the json knows');
    });
    const bridges = loadCommandBridges(path)!;
    expect(bridges.some((bridge) => bridge.keywords.includes('a phrase only the json knows'))).toBe(true);
  });

  it('returns null for a missing or malformed file so the compiled copy is used', () => {
    expect(loadCommandBridges(join(tmpdir(), 'no-such-dir', 'missing.json'))).toBeNull();
    const path = writeVariant((data) => { (data as any).entries = 'not a list'; });
    expect(loadCommandBridges(path)).toBeNull();
  });
});
