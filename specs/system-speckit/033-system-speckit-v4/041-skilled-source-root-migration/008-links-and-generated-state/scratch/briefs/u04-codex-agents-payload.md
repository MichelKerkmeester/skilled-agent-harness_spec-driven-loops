## Edit 1

File: `.skilled/skills/system-spec-kit/runtime/cli/codex/sync-agents.cjs`

OLD:

~~~~text
const REPO_ROOT = findRepoRoot(__dirname);
const SOURCE_DIR = path.join(REPO_ROOT, '.opencode', 'agents');
const OUTPUT_DIR = path.join(REPO_ROOT, '.codex', 'agents');
~~~~

NEW:

~~~~text
const REPO_ROOT = findRepoRoot(__dirname);
const SOURCE_DIR = path.join(REPO_ROOT, '.skilled', 'agents');
const OUTPUT_DIR = path.join(REPO_ROOT, '.codex', 'agents');
~~~~

## Edit 2

File: `.skilled/skills/system-spec-kit/runtime/cli/codex/sync-agents.cjs`

OLD:

~~~~text
    `# Agent: ${name}`,
    `# Converted from: .opencode/agents/${sourceFile}`,
    `name = ${tomlString(name)}`,
~~~~

NEW:

~~~~text
    `# Agent: ${name}`,
    `# Converted from: .skilled/agents/${sourceFile}`,
    `name = ${tomlString(name)}`,
~~~~
