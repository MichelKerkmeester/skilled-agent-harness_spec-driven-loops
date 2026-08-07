# Iteration 005: Independent correctness replay

## Focus

Correctness replay of the route matrix and required-file inventory, using independent set/count checks after the first four dimensions were reviewed.

## Files Reviewed

- `.opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md:163-333,389-429`
- `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/*/{data-model.md,workflows.md,troubleshooting.md}`
- `.opencode/skills/mcp-tooling/mcp-obsidian/feature-catalog/FEATURE-CATALOG.md:199-267`
- `.opencode/skills/mcp-tooling/mcp-obsidian/manual-testing-playbook/manual-testing-playbook.md:231-413`
- `.opencode/specs/mcp-tooling/013-mcp-obsidian/025-plugin-coverage-review/review-report.md:9-17`

## Scorecard

- Dimensions covered: correctness replay
- Specific intent signals: 11/11
- Specific resource maps: 11/11
- Required per-plugin reference siblings: 33/33
- Catalog cards: 11/11
- Playbook IDs: OBS-011 through OBS-021, 11/11
- Local Markdown links: 474 checked, 0 broken
- Open findings after this iteration: P0=0 P1=5 P2=2
- New findings: P0=0 P1=0 P2=0
- New findings ratio: 0.0

## Findings - New

### P0, Blocker

- None.

### P1, Required

- None. F001, F002, F004, F005, and F006 remain open.

### P2, Suggestion

- None. F003 and F007 remain open.

## Findings - Existing / Refined

- F001-F007 remain unchanged. The independent replay adds no contradictory evidence and no resolution.
- F002 is specifically reconfirmed: the specific matrix is complete, but the generic `PLUGINS` resource list at `.opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md:326-330` is still a separate partial path.

## Traceability Checks

| Protocol | Status | Gate | Evidence | Notes |
|---|---|---|---|---|
| `spec_code` | blocked | core | `.opencode/specs/mcp-tooling/013-mcp-obsidian/025-plugin-coverage-review/review-report.md:34-39` | Normative target inputs remain absent. |
| `checklist_evidence` | blocked | core | target root inventory | No checklist exists. |
| `feature_catalog_code` | pass | overlay | `.opencode/skills/mcp-tooling/mcp-obsidian/feature-catalog/FEATURE-CATALOG.md:199-267` | Eleven cards remain present. |
| `playbook_capability` | pass | overlay | `.opencode/skills/mcp-tooling/mcp-obsidian/manual-testing-playbook/manual-testing-playbook.md:231-413` | Eleven IDs remain indexed. |

## Assessment

The dedicated plugin coverage matrix is stable and internally complete. The review does not support changing any severity: F002 concerns generic fallback behavior, while F004-F006 concern independent security boundaries.

## Ruled Out

- Route loss in any of the eleven specific intents.
- Missing data-model, workflow, or troubleshooting sibling files.
- Catalog/playbook ID drift.
- Broken local Markdown links.

## Recommended Next Focus

Security replay with adversarial values and failure paths, especially remote endpoint selection, manifest IDs, and read/write error classification.

Review verdict: CONDITIONAL
