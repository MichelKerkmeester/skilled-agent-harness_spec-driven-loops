// ───────────────────────────────────────────────────────────────────
// MODULE: Workflow Event Dir Binding Test
// ───────────────────────────────────────────────────────────────────
// A workflow command block that stages ledger events reads them from a temp
// directory it creates and then removes with `rm -rf "$EVENT_DIR"`. A block that
// reads the variable without assigning it inherits whatever the environment
// holds, so the cleanup could delete a directory the block never made.

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { runtimeRoot } from '../helpers/spawn-cjs';

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const ASSETS = resolve(runtimeRoot, '..', '..', '..', 'commands', 'deep', 'assets');
const YAML_FILES = readdirSync(ASSETS).filter((name) => name.endsWith('.yaml'));

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

/** Each `command: |` block, as its first line number and body text. */
function commandBlocks(text: string): Array<{ line: number; body: string }> {
  const lines = text.split(/\r?\n/u);
  const blocks: Array<{ line: number; body: string }> = [];
  for (let i = 0; i < lines.length; i += 1) {
    const header = /^(\s*)command:\s*\|\s*$/u.exec(lines[i]);
    if (!header) continue;
    const indent = header[1].length;
    const body: string[] = [];
    let j = i + 1;
    for (; j < lines.length; j += 1) {
      const line = lines[j];
      if (line.trim() !== '' && line.length - line.trimStart().length <= indent) break;
      body.push(line);
    }
    blocks.push({ line: i + 1, body: body.join('\n') });
    i = j - 1;
  }
  return blocks;
}

// ───────────────────────────────────────────────────────────────────
// 4. TESTS
// ───────────────────────────────────────────────────────────────────

describe('workflow command blocks bind EVENT_DIR before using it', () => {
  it('finds the workflow assets', () => {
    expect(YAML_FILES.length).toBeGreaterThan(0);
  });

  for (const name of YAML_FILES) {
    it(`${name}: every block that reads $EVENT_DIR assigns it first`, () => {
      const unbound = commandBlocks(readFileSync(resolve(ASSETS, name), 'utf8'))
        .filter(({ body }) => body.includes('$EVENT_DIR') && !/\bEVENT_DIR=/u.test(body))
        .map(({ line }) => `line ${line}`);
      expect(unbound).toEqual([]);
    });
  }
});
