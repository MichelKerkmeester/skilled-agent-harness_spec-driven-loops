## Edit 1

File: `.skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs`

OLD:

~~~~text
// ─────────────────────────────────────────────────────────────────────────────

// scripts/ -> sk-create-skill/ -> sk-doc/ -> skills/ -> .opencode/ -> repo root
const REPO_ROOT = path.resolve(__dirname, '..', '..', '..', '..', '..');
const SKILLS_DIR = path.join(REPO_ROOT, '.opencode', 'skills');

// The authored/curated fields that must survive a regenerator run untouched:
~~~~

NEW:

~~~~text
// ─────────────────────────────────────────────────────────────────────────────

// scripts/ -> sk-create-skill/ -> sk-doc/ -> skills/ -> .skilled/ -> repo root
const REPO_ROOT = path.resolve(__dirname, '..', '..', '..', '..', '..');
const SKILLS_DIR = path.join(REPO_ROOT, '.skilled', 'skills');

// The authored/curated fields that must survive a regenerator run untouched:
~~~~
