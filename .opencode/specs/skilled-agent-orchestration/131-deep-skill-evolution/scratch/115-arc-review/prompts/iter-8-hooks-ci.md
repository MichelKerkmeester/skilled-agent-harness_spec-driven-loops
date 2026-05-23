# Iter-8 — GIT HOOKS + CI + scripts sweep

## Role
Senior deep-reviewer. Read-only.

## Scope
1. `.github/hooks/scripts/pre-push-council.sh` + any other hook scripts
2. `.github/workflows/*` (CI workflows)
3. `Makefile` (if present)
4. `package.json` scripts (if present)
5. `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_graph_compiler.py`
6. Other operational scripts referencing renamed skills

### Checks
1. pre-push-council.sh `CHANGED_FILES` glob matches `sk-ai-council` AND `ai-council` paths (not old paths).
2. NO references to old skill paths in CI workflows.
3. Compiler script reads renamed skill correctly.

## Output
JSON FINDINGS + NARRATIVE. End.
