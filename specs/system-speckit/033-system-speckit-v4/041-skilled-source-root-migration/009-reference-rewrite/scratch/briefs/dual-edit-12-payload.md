## Edit 1

File: `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/permissions-gate.ts`

OLD:

~~~~text
  }

  const opencodeIndex = absolute.indexOf('/.opencode/');
  if (opencodeIndex >= 0) {
~~~~

NEW:

~~~~text
  }

  const opencodeIndex = absolute.search(/\/\.(?:skilled|opencode)\//);
  if (opencodeIndex >= 0) {
~~~~
