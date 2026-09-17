## Edit 1

File: `.opencode/skills/system-skill-advisor/runtime/tests/schemas/advisor-tool-schemas.vitest.ts`

OLD:

~~~~text
      mkdirSync(leak, { recursive: true });
      // Deeper than both fixed walks, so each must fall back, under an ancestor that
      // carries a source-root name.
      const nestedRepo = join(root, '.skilled', 'outer', 'repo');
      writeSentinel(nestedRepo, '.opencode');
      const deepStart = join(nestedRepo, '.opencode', 'skills', 'system-spec-kit', ...Array.from({ length: 14 }, () => 'deep'));
      mkdirSync(deepStart, { recursive: true });
~~~~

NEW:

~~~~text
      mkdirSync(leak, { recursive: true });
      // Deeper than both fixed walks, so each must fall back. The repository sits under
      // an ancestor named .opencode and holds its tree under .skilled, so hoisting above
      // the outermost segment would pass the repository.
      const nestedRepo = join(root, '.opencode', 'outer', 'repo');
      writeSentinel(nestedRepo, '.skilled');
      const deepStart = join(nestedRepo, '.skilled', 'skills', 'system-spec-kit', ...Array.from({ length: 14 }, () => 'deep'));
      mkdirSync(deepStart, { recursive: true });
~~~~
