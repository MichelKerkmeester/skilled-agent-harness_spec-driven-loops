## Edit 1

File: `.skilled/skills/system-spec-kit/runtime/cli/tests/retrieval-coverage-parity.vitest.ts`

OLD:

~~~~text
  it('walks the roots the coverage decision names, in both lanes', () => {
    expect(Array.from(CORPUS_ROOTS)).toEqual(['specs', '.opencode/skills', '.opencode/install-guides', '.opencode/hooks']);
    expect(Array.from(DEFAULT_ROOTS)).toEqual(['specs', '.opencode']);
  });
~~~~

NEW:

~~~~text
  it('walks the roots the coverage decision names, in both lanes', () => {
    expect(Array.from(CORPUS_ROOTS)).toEqual(['specs', '.skilled/skills', '.skilled/install-guides', '.skilled/hooks']);
    expect(Array.from(DEFAULT_ROOTS)).toEqual(['specs', '.skilled']);
  });
~~~~
