## Edit 1

File: `.skilled/skills/system-spec-kit/runtime/tests/multi-ai-council-runtime-parity.vitest.ts`

OLD:

~~~~text
    .replace(/\.(?:skilled|opencode|claude|pi)\/agents\/[A-Za-z0-9_<>-]+\.md/g, '<runtime-agent-file>')
    .replace(/\s+/g, ' ')
~~~~

NEW:

~~~~text
    .replace(/\.(?:skilled|opencode|claude|pi)\/agents\/[A-Za-z0-9_<>-]+\.md/g, '<runtime-agent-file>')
    .replace(/\.(?:skilled|opencode|claude|pi)\/agents\/(?![A-Za-z0-9_<>*-])/g, '<runtime-agent-dir>')
    .replace(/\s+/g, ' ')
~~~~
