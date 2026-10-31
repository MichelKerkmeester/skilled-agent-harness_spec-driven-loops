## Edit 1

File: `.skilled/skills/system-deep-loop/deep-improvement/scripts/lib/mirror-sync-verify.cjs`

OLD:

~~~~text
    // real body difference elsewhere still registers as drift.
    .replace(/\.(?:opencode|claude|pi)\/agents\/\*\.md/g, '<runtime-agent-path>')
    .replace(/\.(?:opencode|claude|pi)\/agents\/[A-Za-z0-9_<>-]+\.md/g, '<runtime-agent-file>')
    .replace(/\.codex\/agents\/[A-Za-z0-9_<>-]+\.toml/g, '<runtime-agent-file>')
~~~~

NEW:

~~~~text
    // real body difference elsewhere still registers as drift.
    .replace(/\.(?:skilled|opencode|claude|pi)\/agents\/\*\.md/g, '<runtime-agent-path>')
    .replace(/\.(?:skilled|opencode|claude|pi)\/agents\/[A-Za-z0-9_<>-]+\.md/g, '<runtime-agent-file>')
    .replace(/\.codex\/agents\/[A-Za-z0-9_<>-]+\.toml/g, '<runtime-agent-file>')
~~~~
