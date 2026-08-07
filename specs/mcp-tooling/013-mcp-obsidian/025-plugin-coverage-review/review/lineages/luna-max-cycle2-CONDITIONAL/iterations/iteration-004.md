# Iteration 004: Verification boundaries and package metadata

## Focus

Maintainability pass over explicit `VERIFY` boundaries in the newer data models and stale package descriptions after the plugin expansion.

## Files Reviewed

- `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/charts/data-model.md:133-146`
- `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/dataview/data-model.md:230-232`
- `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/git/data-model.md:149-170`
- `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/excalidraw/data-model.md:124-230`
- `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/outliner/data-model.md:134-142`
- `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/minimal/data-model.md:201`
- `.opencode/skills/mcp-tooling/mcp-obsidian/manual-testing-playbook/manual-testing-playbook.md:3-11`

## Scorecard

- Dimensions covered: maintainability
- Files reviewed: six newer data models and the playbook package metadata
- New findings: P0=0 P1=0 P2=2
- Refined findings: P0=0 P1=2 P2=0
- New findings ratio: 0.5

## Findings

### P0, Blocker

- None.

### P1, Required

- **F001**: Target packet lacks normative review inputs — `.opencode/specs/mcp-tooling/013-mcp-obsidian/025-plugin-coverage-review/review-report.md:3` — Carried from iteration 3; the core traceability protocols remain blocked.
- **F002**: Shared plugin contract omits six newly covered plugins in its overview and relation note — `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/plugin-operation-logic.md:26` — Carried from iteration 3; the eleven-row table does not reconcile the surrounding five-plugin prose.

### P2, Suggestion

- **F003**: Newer data models retain explicit verification debt — `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/charts/data-model.md:133` — Seventeen `VERIFY` markers remain across Charts, Dataview, Git, Excalidraw, Outliner, and Minimal. The markers are explicit and guarded, but they leave copyable schema details unresolved.
- **F004**: Playbook frontmatter and opening description still say three plugin tie-ins — `.opencode/skills/mcp-tooling/mcp-obsidian/manual-testing-playbook/manual-testing-playbook.md:3` — The package now indexes eleven plugin tie-ins at lines 11 and 37, so the metadata is stale.

## Traceability Checks

| Protocol | Status | Gate | Evidence | Notes |
|---|---|---|---|---|
| feature_catalog_code | pass | advisory | `.opencode/skills/mcp-tooling/mcp-obsidian/feature-catalog/FEATURE-CATALOG.md:23` | The eleven-card count matches the directory. |
| playbook_capability | partial | advisory | `.opencode/skills/mcp-tooling/mcp-obsidian/manual-testing-playbook/manual-testing-playbook.md:3` | Scenario inventory is current; package description is stale. |

## Assessment

- `VERIFY` is used honestly rather than silently converting unknowns into facts, so F003 is P2 rather than P1.
- F004 is a metadata consistency issue; it does not remove scenario coverage.
- New findings ratio: 0.5.

## Ruled Out

- Unmarked uncertainty in the six new data-model files: each sampled boundary is labeled `VERIFY`.
- Missing new-plugin scenarios: the root index and directory both contain eleven tie-ins.

## Recommended Next Focus

adversarial router and catalog replay

Review verdict: CONDITIONAL
