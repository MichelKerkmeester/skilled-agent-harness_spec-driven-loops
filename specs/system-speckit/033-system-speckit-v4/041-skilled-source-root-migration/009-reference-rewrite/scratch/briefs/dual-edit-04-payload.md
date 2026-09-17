## Edit 1

File: `.skilled/hooks/vitest.config.ts`

OLD:

~~~~text
      {
        find: /^(\.\.\/)+\.opencode\//,
        replacement: `${OPENCODE_ROOT}/`,
~~~~

NEW:

~~~~text
      {
        find: /^(\.\.\/)+\.(?:skilled|opencode)\//,
        replacement: `${OPENCODE_ROOT}/`,
~~~~
