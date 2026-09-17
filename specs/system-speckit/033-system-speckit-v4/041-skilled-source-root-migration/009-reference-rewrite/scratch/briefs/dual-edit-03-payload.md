## Edit 1

File: `.skilled/commands/scripts/validate-command-references.cjs`

OLD:

~~~~text
// grew later, so this lists every runtime with agents/ on disk.
const RUNTIME_DIR_ALLOWLIST = new Set(['.opencode', '.claude', '.codex', '.cursor', '.devin', '.pi']);
const COMMAND_INVENTORY_EXCLUDES = new Set(['assets', 'scripts', 'fixtures']);
~~~~

NEW:

~~~~text
// grew later, so this lists every runtime with agents/ on disk.
const RUNTIME_DIR_ALLOWLIST = new Set(['.skilled', '.opencode', '.claude', '.codex', '.cursor', '.devin', '.pi']);
const COMMAND_INVENTORY_EXCLUDES = new Set(['assets', 'scripts', 'fixtures']);
~~~~

## Edit 2

File: `.skilled/commands/scripts/validate-command-references.cjs`

OLD:

~~~~text
// and is then dropped by the file-shaped filter below.
const SKILL_TOKEN = /\.opencode\/skills\/[^\s"'`,()\[\]{}<>$*|]+/g;
const AGENT_REF = /\[runtime_agent_path\]\/([A-Za-z0-9][A-Za-z0-9._-]*\.md)/g;
const BARE_PHANTOM_AGENTS_DIR = /\.agents\//g;
const SCOPED_AGENTS_DIR = /(\.[a-z][a-z0-9_-]*)\/agents\//g;
const COMMAND_TARGET = /\.opencode\/commands\/[A-Za-z0-9._/-]+\.(?:md|ya?ml|txt)/g;

// ─────────────────────────────────────────────────────────────────────────────
~~~~

NEW:

~~~~text
// and is then dropped by the file-shaped filter below.
const SKILL_TOKEN = /\.(?:skilled|opencode)\/skills\/[^\s"'`,()\[\]{}<>$*|]+/g;
const AGENT_REF = /\[runtime_agent_path\]\/([A-Za-z0-9][A-Za-z0-9._-]*\.md)/g;
const BARE_PHANTOM_AGENTS_DIR = /\.agents\//g;
const SCOPED_AGENTS_DIR = /(\.[a-z][a-z0-9_-]*)\/agents\//g;
const COMMAND_TARGET = /\.(?:skilled|opencode)\/commands\/[A-Za-z0-9._/-]+\.(?:md|ya?ml|txt)/g;

// ─────────────────────────────────────────────────────────────────────────────
~~~~
