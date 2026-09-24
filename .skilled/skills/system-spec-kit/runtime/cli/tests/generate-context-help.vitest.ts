import { describe, expect, it } from 'vitest';

import { HELP_TEXT } from '../continuity/generate-context';

describe('generate-context --help planner mode copy', () => {
  it('states that only full-auto writes continuity fields', () => {
    expect(HELP_TEXT).toContain('only full-auto writes the continuity fields');
    expect(HELP_TEXT).not.toContain('mutation-first');
  });
});
