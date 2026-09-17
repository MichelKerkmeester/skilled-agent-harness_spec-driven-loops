## Edit 1

File: `.skilled/skills/system-spec-kit/runtime/tests/multi-ai-council-runtime-parity.vitest.ts`

OLD:

~~~~text
    .replace(/\n## Convergence Threshold Semantics\n[\s\S]*?\n---\n/, '\n---\n')
    .replace(/\.(?:opencode|claude|pi)\/agents\/\*\.md/g, '<runtime-agent-path>')
    .replace(/\.(?:opencode|claude|pi)\/agents\/[A-Za-z0-9_<>-]+\.md/g, '<runtime-agent-file>')
    .replace(/\s+/g, ' ')
~~~~

NEW:

~~~~text
    .replace(/\n## Convergence Threshold Semantics\n[\s\S]*?\n---\n/, '\n---\n')
    .replace(/\.(?:skilled|opencode|claude|pi)\/agents\/\*\.md/g, '<runtime-agent-path>')
    .replace(/\.(?:skilled|opencode|claude|pi)\/agents\/[A-Za-z0-9_<>-]+\.md/g, '<runtime-agent-file>')
    .replace(/\s+/g, ' ')
~~~~
