## Edit 1

File: `.skilled/skills/system-deep-loop/deep-improvement/scripts/lib/mirror-sync-verify.cjs`

OLD:

~~~~text
    .replace(/\.(?:skilled|opencode|claude|pi)\/agents\/[A-Za-z0-9_<>-]+\.md/g, '<runtime-agent-file>')
    .replace(/\.codex\/agents\/[A-Za-z0-9_<>-]+\.toml/g, '<runtime-agent-file>')
~~~~

NEW:

~~~~text
    .replace(/\.(?:skilled|opencode|claude|pi)\/agents\/[A-Za-z0-9_<>-]+\.md/g, '<runtime-agent-file>')
    .replace(/\.(?:skilled|opencode|claude|pi)\/agents\/(?![A-Za-z0-9_<>*-])/g, '<runtime-agent-dir>')
    .replace(/\.codex\/agents\/[A-Za-z0-9_<>-]+\.toml/g, '<runtime-agent-file>')
~~~~
