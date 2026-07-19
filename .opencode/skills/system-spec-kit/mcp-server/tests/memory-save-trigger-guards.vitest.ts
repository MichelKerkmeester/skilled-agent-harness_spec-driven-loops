import { describe, expect, it } from 'vitest';

import { __memorySaveTestables } from '../handlers/memory-save';

describe('memory save trigger guards', () => {
  it('merges auto-extracted triggers after authored triggers with case-insensitive dedupe and cap', () => {
    const merged = __memorySaveTestables.mergeTriggerPhrases(
      ['User Authored', 'keep this phrase'],
      [
        'user authored',
        'generated one',
        'generated two',
        'generated three',
        'generated four',
        'generated five',
        'generated six',
        'generated seven',
        'generated eight',
        'generated nine',
      ],
    );

    expect(merged).toHaveLength(10);
    expect(merged.slice(0, 2)).toEqual(['User Authored', 'keep this phrase']);
    expect(merged.filter((phrase) => phrase.toLowerCase() === 'user authored')).toHaveLength(1);
    expect(merged).not.toContain('generated nine');
  });

  it('identifies temporary and sandbox constitutional source paths', () => {
    expect(__memorySaveTestables.isSandboxConstitutionalSource('/tmp/speckit-manual-playbook-sandbox/rule.md')).toBe(true);
    expect(__memorySaveTestables.isSandboxConstitutionalSource('/workspace/.opencode/skills/system-spec-kit/constitutional/rule.md')).toBe(false);
  });
});
