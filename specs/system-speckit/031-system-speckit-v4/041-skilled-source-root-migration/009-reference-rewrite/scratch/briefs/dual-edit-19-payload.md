## Edit 1

File: `.skilled/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts`

OLD:

~~~~text
  const normalized = candidate
    .replace(/^\.opencode\//, '')
    .replace(/^\.\/+/, '')
~~~~

NEW:

~~~~text
  const normalized = candidate
    .replace(/^\.(?:skilled|opencode)\//, '')
    .replace(/^\.\/+/, '')
~~~~
