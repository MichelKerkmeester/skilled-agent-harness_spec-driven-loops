# Iteration 008

## Dimension

Maintainability.

## Files Reviewed

- `.opencode/specs/cli-external-orchestration/026-cli-external-parent/004-onboard-cli-opencode/spec.md:103-141`
- `.opencode/specs/cli-external-orchestration/026-cli-external-parent/005-foldin-cli-claude-code/spec.md:105-146`
- `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/004-onboard-chrome-devtools/plan.md:85-88,123-132`
- `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/004-onboard-chrome-devtools/spec.md:102-136`
- `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/005-foldin-clickup-and-figma/plan.md:85-88,124-132`
- `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/005-foldin-clickup-and-figma/spec.md:103-143`
- `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/006-advisor-and-integration/spec.md:108-122,142-164`
- `.opencode/skills/cli-opencode/SKILL.md:271-311,329-352`
- `.opencode/skills/cli-opencode/README.md:63-76,123-145`
- `.opencode/skills/cli-opencode/references/cli_reference.md:123-157,269-296`

## Findings by Severity

### P0

None.

### P1

#### R8-P1-001 - Relative cross-skill links lack a resolution-based move gate

- File: `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/004-onboard-chrome-devtools/plan.md:85-88`
- Claim: The mcp-tooling move phases require internal relative cross-skill references to be rewritten after nesting, but their verification checks only search for selected old path spellings. A stale relative target can remain syntactically different from the searched old forms while resolving to the wrong location, so the planned gates cannot prove the relocated packets' internal links are usable.
- Evidence: Phase 004 names both absolute and relative forms but verifies only greps for old paths [SOURCE: `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/004-onboard-chrome-devtools/plan.md:85-88,123-132`]. Phase 005 uses the same grep-only verification for two more trees [SOURCE: `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/005-foldin-clickup-and-figma/plan.md:107-111,124-132`]. The cli-external move plan distinguishes this failure mode and requires a link-resolve check because an old-flat-path sweep cannot detect a depth-broken relative reference [SOURCE: `.opencode/specs/cli-external-orchestration/026-cli-external-parent/004-onboard-cli-opencode/spec.md:103-108,133-141`].
- Finding class: matrix/evidence.
- Scope proof: Both mcp move phases cover all three relocated trees, and each relies on grep-only proof for absolute and relative forms.
- Affected surface hints: `mcp-chrome-devtools move`, `mcp-click-up move`, `mcp-figma move`, `phase 006 referrer sweep`.
- Recommendation: Add a resolution-based verification step to phases 004 and 005 that enumerates live relative cross-skill links in each moved tree and fails on unresolved targets; retain the old-path greps as supplemental stale-reference checks.
- Counterevidence sought: Evidence that all relative references are generated or otherwise validated by an existing command that runs after each move.
- Alternative explanation: The affected trees may contain no live relative cross-skill links beyond the forms covered by the greps.
- Final severity: P1.
- Confidence: 0.93.
- Downgrade trigger: A scoped link-resolve or equivalent target-existence check is already guaranteed for every live relative reference in all three trees.

### P2

None.

## Traceability Checks

- `spec_code`: partial. The reviewed corpus is planning and current CLI documentation; runtime move behavior is intentionally outside the configured targets.
- `checklist_evidence`: deferred. Checklists and execution evidence are not named review targets.
- `skill_agent`: covered. The current cli-opencode skill, README, and CLI reference identify the direct-agent and loop-owner boundaries.
- `agent_cross_runtime`: covered. Both program plans preserve stable runtime/configuration identities while relocating folder structures.
- `feature_catalog_code`: deferred. No feature catalog is within the declared review scope.
- `playbook_capability`: deferred. No manual playbook is within the declared review scope.

## Verdict

CONDITIONAL. The mcp-tooling plan needs a resolution-based verification gate for nested relative links before its relocation phases are maintainable to execute and diagnose.

## Next Dimension

Correctness stabilization pass.

Review verdict: CONDITIONAL
