## Edit 1

File: `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs`

OLD:

~~~~text
// `permission:` block, so agents deliberately source from .claude/agents.
// Commands have no dialect split and source from .opencode directly.
const CLAUDE_AGENTS = '.claude/agents';
const CLAUDE_COMMANDS = '.claude/commands';
const OPENCODE_COMMANDS = '.opencode/commands';

const HOOK_CONFIGS = [
~~~~

NEW:

~~~~text
// `permission:` block, so agents deliberately source from .claude/agents.
// Commands have no dialect split and source from .skilled directly.
const CLAUDE_AGENTS = '.claude/agents';
const CLAUDE_COMMANDS = '.claude/commands';
const OPENCODE_COMMANDS = '.skilled/commands';

const HOOK_CONFIGS = [
~~~~

## Edit 2

File: `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs`

OLD:

~~~~text
  const raw = fs.readFileSync(absolute, 'utf8');
  const matches = raw.match(/\.opencode\/[A-Za-z0-9_./-]+?\.(?:mjs|cjs|js|sh|py)/g) || [];
  return [...new Set(matches)].sort();
~~~~

NEW:

~~~~text
  const raw = fs.readFileSync(absolute, 'utf8');
  const matches = raw.match(/\.skilled\/[A-Za-z0-9_./-]+?\.(?:mjs|cjs|js|sh|py)/g) || [];
  return [...new Set(matches)].sort();
~~~~
