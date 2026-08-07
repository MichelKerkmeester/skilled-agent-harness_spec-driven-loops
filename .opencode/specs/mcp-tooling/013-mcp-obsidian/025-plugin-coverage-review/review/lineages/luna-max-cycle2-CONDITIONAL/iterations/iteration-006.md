# Iteration 006: Destructive-operation and credential replay

## Focus

Security replay of the eleven plugin scenarios, MCP credential boundaries, git state handling, backup discipline, and cleanup instructions.

## Files Reviewed

- `.opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md:87-134`
- `.opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md:443-520`
- `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/git/troubleshooting.md:58-76`
- `.opencode/skills/mcp-tooling/mcp-obsidian/manual-testing-playbook/plugin-tie-ins/*.md`

## Scorecard

- Dimensions covered: security
- Files reviewed: credential, git, fixture, and cleanup sections across the plugin tie-ins
- New findings: P0=0 P1=0 P2=0
- Refined findings: P0=0 P1=2 P2=2
- New findings ratio: 0.0

## Findings

### P0, Blocker

- None.

### P1, Required

- **F001**: Target packet lacks normative review inputs — `.opencode/specs/mcp-tooling/013-mcp-obsidian/025-plugin-coverage-review/review-report.md:3` — Carried forward.
- **F002**: Shared plugin contract omits six newly covered plugins in its overview and relation note — `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/plugin-operation-logic.md:26` — Carried forward.

### P2, Suggestion

- **F003**: Newer data models retain explicit verification debt — `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/charts/data-model.md:133` — Carried forward.
- **F004**: Playbook frontmatter and opening description still say three plugin tie-ins — `.opencode/skills/mcp-tooling/mcp-obsidian/manual-testing-playbook/manual-testing-playbook.md:3` — Carried forward.

## Traceability Checks

| Protocol | Status | Gate | Evidence | Notes |
|---|---|---|---|---|
| playbook_capability | pass | advisory | `.opencode/skills/mcp-tooling/mcp-obsidian/manual-testing-playbook/plugin-tie-ins/git-status-roundtrip.md:38` | Throwaway repositories and bounded cleanup are explicit. |

## Assessment

- The reviewed scenarios keep writes inside throwaway vaults, scratch ledgers, or bounded fixture paths.
- MCP keys and git credentials remain app-managed; the mode does not write credentials or claim push success.
- No new security finding was found.
- New findings ratio: 0.0.

## Ruled Out

- Secret literals in examples: none found.
- Real-vault destructive commands: scenarios explicitly prohibit them or use disposable paths.
- Credential write-through in the git surface: the troubleshooting contract says credentials are app-managed.

## Recommended Next Focus

catalog and playbook cross-reference reconciliation

Review verdict: CONDITIONAL
