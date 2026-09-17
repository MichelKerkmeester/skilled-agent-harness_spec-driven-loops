## Edit 1

File: `.skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs`

OLD:

~~~~text
const REPO_ROOT = findRepoRoot(__dirname);
const SOURCE_DIR = process.env.HERMES_SKILLS_SOURCE_DIR || path.join(REPO_ROOT, '.opencode', 'skills');
const OUTPUT_DIR = process.env.HERMES_SKILLS_OUTPUT_DIR || path.join(REPO_ROOT, '.hermes', 'skills');
~~~~

NEW:

~~~~text
const REPO_ROOT = findRepoRoot(__dirname);
const SOURCE_DIR = process.env.HERMES_SKILLS_SOURCE_DIR || path.join(REPO_ROOT, '.skilled', 'skills');
const OUTPUT_DIR = process.env.HERMES_SKILLS_OUTPUT_DIR || path.join(REPO_ROOT, '.hermes', 'skills');
~~~~

## Edit 2

File: `.skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs`

OLD:

~~~~text
// `agent-<name>`: `-s agent-<name>` carries the whole persona into the session.
// Agents are authored in .opencode/agents and mirrored to the other runtimes, so the mirror for
// Hermes reads the source, not a sibling's copy.
const AGENTS_DIR = process.env.HERMES_AGENTS_SOURCE_DIR || path.join(REPO_ROOT, '.opencode', 'agents');
const AGENT_SKILL_PREFIX = 'agent-';
~~~~

NEW:

~~~~text
// `agent-<name>`: `-s agent-<name>` carries the whole persona into the session.
// Agents are authored in .skilled/agents and mirrored to the other runtimes, so the mirror for
// Hermes reads the source, not a sibling's copy.
const AGENTS_DIR = process.env.HERMES_AGENTS_SOURCE_DIR || path.join(REPO_ROOT, '.skilled', 'agents');
const AGENT_SKILL_PREFIX = 'agent-';
~~~~

## Edit 3

File: `.skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs`

OLD:

~~~~text
  const name = frontmatterName(frontmatter, fallbackName);
  const canonical = `.opencode/skills/${skillDir}`;
  const header = [
~~~~

NEW:

~~~~text
  const name = frontmatterName(frontmatter, fallbackName);
  const canonical = `.skilled/skills/${skillDir}`;
  const header = [
~~~~
