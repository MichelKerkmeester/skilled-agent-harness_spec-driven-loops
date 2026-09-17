## Edit 1

File: `.skilled/skills/system-spec-kit/runtime/lib/continuity/authored-continuity-snapshot.ts`

OLD:

~~~~text
    .replace(/^specs\//u, '')
    .replace(/^\.opencode\//u, '')
    .replace(/\/+$/u, '');
~~~~

NEW:

~~~~text
    .replace(/^specs\//u, '')
    .replace(/^\.(?:skilled|opencode)\//u, '')
    .replace(/\/+$/u, '');
~~~~
