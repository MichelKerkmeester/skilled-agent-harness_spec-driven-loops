// ───────────────────────────────────────────────────────────────
// MODULE: Command attach guards
// ───────────────────────────────────────────────────────────────

// A hub route names the command that acts on the mode it picked, so it has to
// honour the same no-edit wording the scorer honours. A reader who rules out a
// change must not be handed a command that changes files.

import { describe, expect, it } from 'vitest';

import {
  attachCommand,
  NO_EDIT_REQUEST,
  typedCommandForTop,
  typedCommandIn,
} from '../lib/command-attach.js';

// The only route shape that names a command unambiguously: one decision and one
// selected target.
function SINGLE(workflowMode: string): Record<string, unknown> {
  return { action: 'route', selectionKind: 'single', targets: [{ workflowMode }] };
}

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
});
