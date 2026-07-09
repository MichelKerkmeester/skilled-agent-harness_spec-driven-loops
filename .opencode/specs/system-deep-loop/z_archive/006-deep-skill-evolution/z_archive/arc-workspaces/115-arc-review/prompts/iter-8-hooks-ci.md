# Iter-8 — GIT HOOKS + CI + scripts sweep

## Role
Senior deep-reviewer. Read-only.

## Scope
1. `.github/workflows/*` (CI workflows)
2. `Makefile` (if present)
3. `package.json` scripts (if present)
4. `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_graph_compiler.py`
5. Other operational scripts referencing renamed skills

### Checks
1. NO references to old skill paths in CI workflows.
2. Compiler script reads renamed skill correctly.

## Output
JSON FINDINGS + NARRATIVE. End.
