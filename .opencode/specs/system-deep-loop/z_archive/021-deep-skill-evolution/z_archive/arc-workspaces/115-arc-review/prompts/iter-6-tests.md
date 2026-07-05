# Iter-6 — TEST surface sweep (vitest, scripts/tests, parity)

## Role
Senior deep-reviewer. Read-only.

## Scope
1. `.opencode/skills/system-spec-kit/mcp_server/tests/multi-ai-council-runtime-parity.vitest.ts`
2. `.opencode/skills/system-spec-kit/mcp_server/tests/council-helpers-smoke.vitest.ts`
3. `.opencode/skills/system-spec-kit/mcp_server/tests/council-playbook-anchor-integrity.vitest.ts`
4. `.opencode/skills/system-spec-kit/mcp_server/tests/multi-ai-council-audit-trail.vitest.ts`
5. `.opencode/skills/system-spec-kit/mcp_server/tests/multi-ai-council-permission-scope.vitest.ts`
6. `.opencode/skills/system-spec-kit/mcp_server/tests/multi-ai-council-rollback.vitest.ts`
7. `.opencode/skills/system-spec-kit/scripts/tests/multi-ai-council-persist-artifacts.vitest.ts`
8. `.opencode/skills/system-spec-kit/scripts/test-council-matrix.sh`
9. Other test files at `.opencode/skills/system-skill-advisor/mcp_server/tests/`

### Checks
1. Test assertions expect renamed agent slug `ai-council` (NOT `deep-ai-council`).
2. Skill-related assertions expect `sk-ai-council` (NOT `deep-ai-council`).
3. Test fixtures (`intent-prompt-corpus.ts`, etc.) reference renamed skills.
4. test-council-matrix.sh + persist-artifacts test paths point at renamed skill dir.

## Output
JSON FINDINGS + NARRATIVE. End.
