# Iteration 008: Maintainability replay

## Focus

Maintainability replay for copyable data models, explicit verification boundaries, metadata freshness, and executable example syntax.

## Files Reviewed

- `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/charts/data-model.md:125-155,210-230`
- `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/dataview/data-model.md:220-235,340-352`
- `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/git/data-model.md:143-180`
- `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/excalidraw/data-model.md:121-145,215-232`
- `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/outliner/data-model.md:130-145`
- `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/minimal/data-model.md:197-209`
- `.opencode/skills/mcp-tooling/mcp-obsidian/feature-catalog/FEATURE-CATALOG.md:1-267`
- `.opencode/skills/mcp-tooling/mcp-obsidian/manual-testing-playbook/manual-testing-playbook.md:1-413`
- `.opencode/skills/mcp-tooling/mcp-obsidian/examples/*.sh`

## Scorecard

- Dimensions covered: maintainability replay
- Explicit `VERIFY` markers in the six newer data models: charts 4, Dataview 2, Git 5, Excalidraw 3, Outliner 2, Minimal 1; total 17
- Catalog and playbook metadata: both remain current at eleven plugins
- Markdown inventory: 132 files
- Shell syntax: all six package scripts pass `bash -n`
- Open findings after this iteration: P0=0 P1=5 P2=2
- New findings: P0=0 P1=0 P2=0
- New findings ratio: 0.0

## Findings - New

### P0, Blocker

- None.

### P1, Required

- None. The verification markers do not establish a new correctness or security failure.

### P2, Suggestion

- None. F007 is refined, not duplicated.

## Findings - Existing / Refined

- **F007** remains P2 and is refined as accepted verification debt: the 17 markers consistently signal version-, cache-, or vault-dependent values and often pair with a no-fabrication boundary. A versioned verification ledger or authoritative installed-artifact check would reduce the debt.
- **F001-F006** remain open with unchanged severities.

## Traceability Checks

| Protocol | Status | Gate | Evidence | Notes |
|---|---|---|---|---|
| `spec_code` | blocked | core | `.opencode/specs/mcp-tooling/013-mcp-obsidian/025-plugin-coverage-review/review-report.md:34-39` | Normative target inputs remain absent. |
| `checklist_evidence` | blocked | core | target root inventory | No checklist exists. |
| `feature_catalog_code` | pass | overlay | `.opencode/skills/mcp-tooling/mcp-obsidian/feature-catalog/FEATURE-CATALOG.md:1-267` | Catalog metadata remains current. |
| `playbook_capability` | pass | overlay | `.opencode/skills/mcp-tooling/mcp-obsidian/manual-testing-playbook/manual-testing-playbook.md:1-413` | Playbook metadata remains current. |

## Assessment

The maintainability replay confirms that the remaining verification markers are explicit and consistently framed rather than hidden claims. They still create copyability debt, so F007 stays an accepted P2 rather than being marked resolved. Syntax and metadata checks add no new finding.

## Ruled Out

- Stale “eleven plugin” metadata in the catalog or playbook.
- Shell syntax errors in the package examples and scripts.
- A basis for escalating F007 to P1 without authoritative installed artifacts or a versioned verification ledger.

## Recommended Next Focus

Adversarial final correctness and security replay across all P1 findings; retain every finding unless a direct counterexample changes its severity.

Review verdict: CONDITIONAL
