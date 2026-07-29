# Iteration 4: Maintainability

## Focus

D4 Maintainability — residual pre-rename vocabulary in live hub docs/registries that raises follow-on change cost after the identity rename.

## Scorecard

- Dimensions covered: maintainability
- Files reviewed: sk-design/SKILL.md, sk-doc/mode-registry.json, 002-rename-contract-and-map/contract.md, sk-*/description.json
- New findings: P0=0 P1=0 P2=3
- New findings ratio: 0.22

## Findings

### P2, Suggestion

- **F007**: `sk-design/SKILL.md` still instructs operators to `auto-load \`interface\``, `default to \`interface\``, and refers to the doc-guidance mode as `` `interface` `` / `` `md-generator` `` while the public `workflowMode` keys are `sk-design-interface` / `sk-design-md-generator`. Mixed vocabulary increases mis-routing risk for humans/agents that copy the ALWAYS/NEVER rules literally. [SOURCE: .opencode/skills/sk-design/SKILL.md:177] [SOURCE: .opencode/skills/sk-design/SKILL.md:179] [SOURCE: .opencode/skills/sk-design/SKILL.md:228] [SOURCE: .opencode/skills/sk-design/SKILL.md:235]

- **F008**: `sk-doc/mode-registry.json` advisorRoutingContract prose still claims folders are “clean create-*/ names” after directories became `sk-create-*`. [SOURCE: .opencode/skills/sk-doc/mode-registry.json:15]

- **F009**: Freeze-time contract table cites pre-rename paths (e.g. `sk-doc/create-skill/...`, `sk-prompt/prompt-improve/SKILL.md`) — labeled as freeze evidence in §1 intro, but without a per-row “freeze-time path” column the table can be misread as live paths. [SOURCE: 002-rename-contract-and-map/contract.md:10-11] [SOURCE: 002-rename-contract-and-map/contract.md:21-22]

## Cross-Reference Results

| Protocol | Status | Gate | Evidence |
|----------|--------|------|----------|
| feature_catalog_code | pass | advisory | sk-design feature-catalog paths use `sk-design-interface` |

## Assessment

Identity machinery is maintainable; residual mixed vocabulary in hub SKILL/registry prose is the main follow-on cost. Phase 009 additive sk- keywords are present across all four hub description.json files.

Review verdict: PASS
