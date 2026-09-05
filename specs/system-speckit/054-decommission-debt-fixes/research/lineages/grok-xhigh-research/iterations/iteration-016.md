# Iteration 16: workflow-invariance allowlist of deleted playbooks

## Focus
Angle 4. `workflow-invariance.vitest.ts` still allowlists playbooks that name the retired MCP barrel and spec-memory plugin.

## Findings

### F-I16-001 — Four allowlisted playbook paths are absent on disk. CONFIRMED. P2
The skip list returns true for:
- `manual-testing-playbook/pipeline-architecture/mcp-server-public-api-barrel.md` [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/workflow-invariance.vitest.ts:148-150]
- `manual-testing-playbook/plugins-and-hooks/spec-memory-plugin.md` [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/workflow-invariance.vitest.ts:151]
- plus `encoding-intent-capture-at-index-time-r16.md` and `memory-maintenance-and-migration-clis.md` [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/workflow-invariance.vitest.ts:145-147]
Existence checks: all four ABSENT. The comment above the barrel/plugin rows still says the MCP server public-API barrel exposes capabilities and the spec-memory plugin status tool reports capability boundaries. [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/workflow-invariance.vitest.ts:148-149]
Dead allowlist rows do not fail the test (same class as F-I6-003 naming-migration budgets). They keep the retired surfaces in the test's mental model.
Smallest fix: delete the four skip rows and the comment that treats spec-memory as live.

### F-I16-002 — `/memory:manage` and `/memory:learn` are gone; `/memory:save` and `/memory:search` remain. CONFIRMED. P2 (negative)
`.opencode/commands/memory/` contains `save.md`, `search.md`, `assets`, `README.txt`. `manage.md` and `learn.md` are absent. 052 DONE WHEN required those two retired. [SOURCE: specs/system-speckit/052-memory-decommission-landing/goal.md:184]
`/memory:search` frontmatter describes trigger-index + ripgrep over spec/skill docs. [SOURCE: .opencode/commands/memory/search.md:2-11]
This is the successor pair, not a dangling command family.
Smallest fix: none on the command tree. Do not treat the `memory/` family name as residue (D7).

### F-I16-003 — rollback-runbook.md is absent (T007). CONFIRMED. P2 (negative)
`references/workflows/rollback-runbook.md` is absent. Matches F-I13-004.
Smallest fix: none.

## Sources Consulted
- .opencode/skills/system-spec-kit/scripts/tests/workflow-invariance.vitest.ts:145-151
- .opencode/commands/memory/search.md:2-11
- specs/system-speckit/052-memory-decommission-landing/goal.md:184
- existence checks on the four playbook paths, rollback-runbook, memory manage/learn

## Assessment
- newInfoRatio: 0.50
- Novelty justification: confirmed the allowlisted playbooks are gone, not merely named. Command-family negative is new evidence for angle 5.
- Confidence: high.

## Reflection
- Worked: existence checks instead of reading excluded playbook files.
- Failed: none.
- Ruled out: treating `/memory:save` and `/memory:search` as dangling retired commands.

## Dead Ends
- Reading the playbook files (reading budget excludes them; absence is enough).

## Recommended Next Focus
ARCHITECTURE.md "generated memory artifacts" sentence and install-guide packet names that still say spec-memory.
