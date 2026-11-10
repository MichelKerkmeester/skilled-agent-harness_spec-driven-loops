## Edit 1

File: `.skilled/skills/system-spec-kit/runtime/cli/resource-map/extract-from-evidence.cjs`

OLD:

~~~~text
  }

  if (normalized.startsWith('.skilled/commands/')) {
    return 'Commands';
~~~~

NEW:

~~~~text
  }

  if (normalized.startsWith('.skilled/commands/') || normalized.startsWith('.opencode/commands/')) {
    return 'Commands';
~~~~

## Edit 2

File: `.skilled/skills/system-spec-kit/runtime/cli/resource-map/extract-from-evidence.cjs`

OLD:

~~~~text
  if (
    normalized.startsWith('.skilled/agents/')
    || normalized.startsWith('.claude/agents/')
~~~~

NEW:

~~~~text
  if (
    normalized.startsWith('.skilled/agents/') || normalized.startsWith('.opencode/agents/')
    || normalized.startsWith('.claude/agents/')
~~~~

## Edit 3

File: `.skilled/skills/system-spec-kit/runtime/cli/resource-map/extract-from-evidence.cjs`

OLD:

~~~~text
  }

  if (normalized.startsWith('.skilled/skills/')) {
    return 'Skills';
~~~~

NEW:

~~~~text
  }

  if (normalized.startsWith('.skilled/skills/') || normalized.startsWith('.opencode/skills/')) {
    return 'Skills';
~~~~
