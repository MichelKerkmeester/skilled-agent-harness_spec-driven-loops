## Edit 1

File: `.skilled/skills/system-spec-kit/runtime/cli/pi/sync-agents-pi.cjs`

OLD:

~~~~text
const REPO_ROOT = findRepoRoot(__dirname);
const SOURCE_DIR = path.join(REPO_ROOT, '.opencode', 'agents');
const OUTPUT_DIR = path.join(REPO_ROOT, '.pi', 'agents');
~~~~

NEW:

~~~~text
const REPO_ROOT = findRepoRoot(__dirname);
const SOURCE_DIR = path.join(REPO_ROOT, '.skilled', 'agents');
const OUTPUT_DIR = path.join(REPO_ROOT, '.pi', 'agents');
~~~~
