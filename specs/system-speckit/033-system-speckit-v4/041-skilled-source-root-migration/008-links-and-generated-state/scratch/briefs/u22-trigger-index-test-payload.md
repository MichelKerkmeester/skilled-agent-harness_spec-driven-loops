## Edit 1

File: `.skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index.vitest.ts`

OLD:

~~~~text
    writeDoc(root, 'specs/track/research/synthesis.md', frontmatter(['kept']));
    writeDoc(root, '.opencode/skills/demo/SKILL.md', frontmatter(['skill']));
    writeDoc(root, '.opencode/skills/demo/node_modules/pkg/readme.md', frontmatter(['vendored']));

    const { files } = walkCorpus(root);
~~~~

NEW:

~~~~text
    writeDoc(root, 'specs/track/research/synthesis.md', frontmatter(['kept']));
    writeDoc(root, '.skilled/skills/demo/SKILL.md', frontmatter(['skill']));
    writeDoc(root, '.skilled/skills/demo/node_modules/pkg/readme.md', frontmatter(['vendored']));

    const { files } = walkCorpus(root);
~~~~

## Edit 2

File: `.skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index.vitest.ts`

OLD:

~~~~text
    expect(files).toEqual([
      '.opencode/skills/demo/SKILL.md',
      'specs/track/a.md',
~~~~

NEW:

~~~~text
    expect(files).toEqual([
      '.skilled/skills/demo/SKILL.md',
      'specs/track/a.md',
~~~~

## Edit 3

File: `.skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index.vitest.ts`

OLD:

~~~~text
  });

  it('also walks .opencode/install-guides, the widened corpus root', () => {
    const root = makeTempDir('speckit-trigger-install-guides-');
    writeDoc(root, '.opencode/install-guides/README.md', frontmatter(['install guides']));
    writeDoc(root, '.opencode/skills/demo/SKILL.md', frontmatter(['skill']));

    const { files } = walkCorpus(root);
~~~~

NEW:

~~~~text
  });

  it('also walks .skilled/install-guides, the widened corpus root', () => {
    const root = makeTempDir('speckit-trigger-install-guides-');
    writeDoc(root, '.skilled/install-guides/README.md', frontmatter(['install guides']));
    writeDoc(root, '.skilled/skills/demo/SKILL.md', frontmatter(['skill']));

    const { files } = walkCorpus(root);
~~~~

## Edit 4

File: `.skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index.vitest.ts`

OLD:

~~~~text
    expect(files).toEqual([
      '.opencode/install-guides/README.md',
      '.opencode/skills/demo/SKILL.md',
    ]);
~~~~

NEW:

~~~~text
    expect(files).toEqual([
      '.skilled/install-guides/README.md',
      '.skilled/skills/demo/SKILL.md',
    ]);
~~~~

## Edit 5

File: `.skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index.vitest.ts`

OLD:

~~~~text
    expect(canonicalRelativePath('.opencode/specs/track/a.md')).toBe('specs/track/a.md');
    expect(canonicalRelativePath('.opencode/skills/demo/SKILL.md')).toBe('.opencode/skills/demo/SKILL.md');
  });
~~~~

NEW:

~~~~text
    expect(canonicalRelativePath('.opencode/specs/track/a.md')).toBe('specs/track/a.md');
    expect(canonicalRelativePath('.skilled/skills/demo/SKILL.md')).toBe('.skilled/skills/demo/SKILL.md');
  });
~~~~

## Edit 6

File: `.skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index.vitest.ts`

OLD:

~~~~text
    const root = makeTempDir('speckit-trigger-fixtures-');
    writeDoc(root, '.opencode/skills/demo/tests/fixtures/broken.md', '---\ntrigger_phrases:\n');
    writeDoc(root, '.opencode/skills/demo/tests/fixtures/nested/also-broken.md', '---\ntrigger_phrases:\n');
    writeDoc(root, '.opencode/skills/demo/scripts/__fixtures__/sample.md', frontmatter(['fixture phrase']));
    writeDoc(root, '.opencode/skills/demo/test-fixtures/sample.md', frontmatter(['fixture phrase']));
    writeDoc(root, '.opencode/skills/demo/tests/advisor-fixtures/sample.md', frontmatter(['fixture phrase']));
    writeDoc(root, '.opencode/skills/demo/SKILL.md', frontmatter(['skill']));
    // A spec packet may legitimately be named for fixtures, or hold a folder of
~~~~

NEW:

~~~~text
    const root = makeTempDir('speckit-trigger-fixtures-');
    writeDoc(root, '.skilled/skills/demo/tests/fixtures/broken.md', '---\ntrigger_phrases:\n');
    writeDoc(root, '.skilled/skills/demo/tests/fixtures/nested/also-broken.md', '---\ntrigger_phrases:\n');
    writeDoc(root, '.skilled/skills/demo/scripts/__fixtures__/sample.md', frontmatter(['fixture phrase']));
    writeDoc(root, '.skilled/skills/demo/test-fixtures/sample.md', frontmatter(['fixture phrase']));
    writeDoc(root, '.skilled/skills/demo/tests/advisor-fixtures/sample.md', frontmatter(['fixture phrase']));
    writeDoc(root, '.skilled/skills/demo/SKILL.md', frontmatter(['skill']));
    // A spec packet may legitimately be named for fixtures, or hold a folder of
~~~~

## Edit 7

File: `.skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index.vitest.ts`

OLD:

~~~~text
    expect(files).toEqual([
      '.opencode/skills/demo/SKILL.md',
      'specs/track/002-contracts-and-fixtures/spec.md',
~~~~

NEW:

~~~~text
    expect(files).toEqual([
      '.skilled/skills/demo/SKILL.md',
      'specs/track/002-contracts-and-fixtures/spec.md',
~~~~

## Edit 8

File: `.skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index.vitest.ts`

OLD:

~~~~text
    writeDoc(root, 'specs/track/a.md', frontmatter(['spec folder question', 'gate three']));
    writeDoc(root, '.opencode/skills/demo/SKILL.md', frontmatter(['skill routing']));
    const options = generationPaths(root);
~~~~

NEW:

~~~~text
    writeDoc(root, 'specs/track/a.md', frontmatter(['spec folder question', 'gate three']));
    writeDoc(root, '.skilled/skills/demo/SKILL.md', frontmatter(['skill routing']));
    const options = generationPaths(root);
~~~~
