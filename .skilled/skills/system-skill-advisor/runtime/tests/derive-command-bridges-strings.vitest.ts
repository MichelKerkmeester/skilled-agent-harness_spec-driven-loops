// ───────────────────────────────────────────────────────────────
// MODULE: Derive Command Bridges Strings
// ───────────────────────────────────────────────────────────────

// Pins the escaping in the deriver's string literal writer. A generated literal
// holding a raw line break no longer parses, so the generated source would stop
// compiling the next time a derived name or phrase carried one.

import { createRequire } from 'node:module';

import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);

const bridges = require('../scripts/command-bridges/derive-command-bridges.cjs') as {
  tsString(value: string): string;
};

const BREAK_CASES: Array<[string, string]> = [
  ['LF', 'a\nb'],
  ['CR', 'a\rb'],
  ['U+2028', 'a\u2028b'],
  ['U+2029', 'a\u2029b'],
  ['a quote and a backslash', "it's a \\ path"],
];

describe('tsString', () => {
  it.each(BREAK_CASES)('round-trips a value holding %s', (_label, value) => {
    const literal = bridges.tsString(value);
    expect(literal).toMatch(/^'[^\n\r\u2028\u2029]*'$/);
    expect(new Function('return ' + literal + ';')()).toBe(value);
  });
});
