# Iter-5 — 4-RUNTIME-MIRROR agent + AGENTS.md sweep

## Role
Senior deep-reviewer. Read-only.

## Scope
1. `.opencode/agents/*.md` (full directory)
2. `.claude/agents/*.md` (full directory)
3. `.codex/agents/*.toml` (full directory)
4. `.gemini/agents/*.md` (full directory)
5. `AGENTS.md` + `CLAUDE.md` (symlinked to AGENTS.md)
6. 4 agent README.txt files

### Checks
1. All 4 runtime mirrors have `ai-council.{md,toml}` (NOT `deep-ai-council`); old path absent.
2. Agent body Skill load references `.opencode/skills/sk-ai-council/SKILL.md` (NOT old path).
3. Agent frontmatter `name: ai-council` (NOT `sk-ai-council`; agents drop `sk-` prefix).
4. Orchestrate agent files reference `@ai-council` (NOT `@deep-ai-council`).
5. AGENTS.md Agent Definitions + Quick Reference Workflow rows updated.
6. 4 README.txt inventories include `ai-council` not `deep-ai-council`.

## Output
JSON FINDINGS + NARRATIVE. End.
