## Edit 1

File: `.skilled/skills/system-spec-kit/runtime/cli/utils/tool-sanitizer.ts`

OLD:

~~~~text
    .replace(/(?:\/(?:Users|home|var|tmp|opt|etc|usr)\/|[A-Z]:\\)[^\s"'`,;)}\]]+/g, '[path]')
    // Replace .opencode/ internal paths
    .replace(/\.opencode\/[^\s"'`,;)}\]]+/g, '[internal-path]')
    // Replace .claude/ internal paths
~~~~

NEW:

~~~~text
    .replace(/(?:\/(?:Users|home|var|tmp|opt|etc|usr)\/|[A-Z]:\\)[^\s"'`,;)}\]]+/g, '[path]')
    // Replace .skilled/ and .opencode/ internal paths
    .replace(/\.(?:skilled|opencode)\/[^\s"'`,;)}\]]+/g, '[internal-path]')
    // Replace .claude/ internal paths
~~~~
