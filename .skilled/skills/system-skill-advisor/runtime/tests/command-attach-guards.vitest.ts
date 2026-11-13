// ───────────────────────────────────────────────────────────────
// MODULE: Command attach guards
// ───────────────────────────────────────────────────────────────

// A hub route names the command that acts on the mode it picked, so it has to
// honour the same no-edit wording the scorer honours. A reader who rules out a
// change must not be handed a command that changes files.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  attachCommand,
  isNoEditRequest,
  NO_EDIT_REQUEST,
  typedCommandForTop,
  typedCommandIn,
} from '../lib/command-attach.js';

// The only route shape that names a command unambiguously: one decision and one
// selected target.
function SINGLE(workflowMode: string): Record<string, unknown> {
  return { action: 'route', selectionKind: 'single', targets: [{ workflowMode }] };
}

// The endings a reader uses to rule out a change. One writes the contraction
// with a curly apostrophe, which is the form many keyboards produce.
const NOEDIT4 = [
  "don't change anything yet",
  'no changes yet',
  'don\u2019t touch any files',
  'make no changes',
];

describe('command attach on a no-edit prompt', () => {
  it('offers no hub command when the prompt rules out a change', () => {
    const prompt = 'use sk-doc to create a skill called invoice-parser, do not change anything yet';
    expect(attachCommand('sk-doc', SINGLE('sk-create-skill'), prompt)).toBeUndefined();
  });

  it('offers the command when the same prompt asks for the change', () => {
    const prompt = 'use sk-doc to create a skill called invoice-parser';
    expect(attachCommand('sk-doc', SINGLE('sk-create-skill'), prompt)).toBe('/create:sk-skill');
  });

  it('reads the shared no-edit wording', () => {
    expect(NO_EDIT_REQUEST.test('just show me the plan')).toBe(true);
  });

  it.each(NOEDIT4)('offers no hub command when the prompt ends %s', (ending) => {
    const prompt = 'use sk-doc to create an agent called invoice-parser, ' + ending;
    expect(attachCommand('sk-doc', SINGLE('sk-create-agent'), prompt)).toBeUndefined();
  });

  it('offers the agent command when the prompt asks for the change', () => {
    const prompt = 'use sk-doc to create an agent called invoice-parser';
    expect(attachCommand('sk-doc', SINGLE('sk-create-agent'), prompt)).toBe('/create:agent');
  });

  it('reads a curly apostrophe as a straight one', () => {
    expect(isNoEditRequest('Don\u2019t touch any files')).toBe(true);
    expect(isNoEditRequest('touch the files')).toBe(false);
  });

  // A change request can say what must stay the same, and that is still a
  // request for the change.
  it.each([
    'refactor the parser so there are no changes to its public api',
    'fix the flaky test and make sure there are no changes in behaviour',
    'create an agent called invoice-parser with no changes to existing agents',
  ])('keeps a change request that limits its scope: %s', (prompt) => {
    expect(isNoEditRequest(prompt)).toBe(false);
  });

  // The phrase reads as no change whatever follows it. The first row is a real
  // no-edit request. The second is a change request that pays for the safe
  // reading by losing its command.
  it.each([
    'show me the plan and make no changes to the files',
    'refactor the parser and make no changes to its public api',
  ])('reads make no changes as ruling out a change: %s', (prompt) => {
    expect(isNoEditRequest(prompt)).toBe(true);
  });
});

describe('command attach on a deep-loop prompt', () => {
  it('withholds the review command when another deep-loop command is named', () => {
    expect(attachCommand('system-deep-loop', SINGLE('review'), 'what did /deep:ai-council decide')).toBeUndefined();
  });

  it('withholds the review command when an unknown deep-loop command is named', () => {
    expect(attachCommand('system-deep-loop', SINGLE('review'), 'what did /deep:reviw decide')).toBeUndefined();
  });

  it('offers the review command when it is the command typed', () => {
    expect(attachCommand('system-deep-loop', SINGLE('review'), 'run /deep:review now')).toBe('/deep:review');
  });

  it('offers the review command when the prompt asks for depth', () => {
    expect(attachCommand('system-deep-loop', SINGLE('review'), 'review the parser in depth')).toBe('/deep:review');
  });
});

describe('typed command boundaries', () => {
  it('does not read a file name with an extension as a typed command', () => {
    expect(typedCommandIn('see /create:sk-skill.md for details')).toBeUndefined();
  });

  it('does not read a path segment as a typed command', () => {
    expect(typedCommandIn('open /create:readme/notes.txt')).toBeUndefined();
  });

  it('reads a command that ends a sentence', () => {
    expect(typedCommandIn('run /create:sk-skill.')).toBe('/create:sk-skill');
  });

  it('reads a command followed by a comma', () => {
    expect(typedCommandIn('run /create:sk-skill, then stop')).toBe('/create:sk-skill');
  });

  it('reads the longest command when a prefix also matches', () => {
    expect(typedCommandIn('/create:skill-parent now')).toBe('/create:skill-parent');
  });

  it('carries no command when the prompt only names a file', () => {
    expect(typedCommandForTop('sk-doc', 'open /create:readme.md and summarise it')).toBeUndefined();
  });
});

describe('generated command table', () => {
  it('holds no separate policy table', async () => {
    expect('COMMAND_POLICIES' in await import('../lib/command-attach.js')).toBe(false);
  });

  it('the command-bridges README names every command row field', () => {
    const source = readFileSync(join(import.meta.dirname, '../lib/command-attach.ts'), 'utf8');
    const readme = readFileSync(join(import.meta.dirname, '../scripts/command-bridges/README.md'), 'utf8');
    const interfaceBlock = /export interface CommandRow \{([\s\S]*?)\n\}/.exec(source)?.[1] ?? '';
    const fields = [...interfaceBlock.matchAll(/readonly (\w+)\??:/g)].map((match) => match[1]);
    expect(fields).toEqual(['command', 'policy', 'mutating', 'ownerSkillId']);
    const sentence = /Each row carries [^\n]*/.exec(readme)?.[0] ?? '';
    for (const field of fields) {
      expect(sentence).toContain('`' + field + '`');
    }
  });
});
