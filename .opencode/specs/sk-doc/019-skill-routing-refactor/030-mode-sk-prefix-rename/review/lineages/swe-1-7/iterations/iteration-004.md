# Iteration 4 - Maintainability: description keywords and test fixtures

## Focus
Maintainability: description keywords and test fixtures

## Files Reviewed
- .opencode/skills/sk-doc/sk-create-skill/scripts/tests/validate-compiled-routing-scenarios.test.cjs
- .opencode/skills/sk-prompt/description.json
- .opencode/skills/sk-doc/description.json
- .opencode/skills/sk-prompt/description.json
- .opencode/skills/sk-doc/description.json

## Findings - New
### P0
- None.

### P1
- None.

### P2
- **F006**: sk-create-skill test fixture uses old md-generator workflow and resources — .opencode/skills/sk-doc/sk-create-skill/scripts/tests/validate-compiled-routing-scenarios.test.cjs:68 — The HOLDOUT_LEAK fixture hardcodes "expected_workflow_mode: md-generator", "expected_resources: design-md-generator/references/design-md-format.md", and "evidence_compiled_route: sk-design/md-generator". These are pre-rename identifiers.
- **F007**: sk-prompt hub description uses bare pre-rename keywords — .opencode/skills/sk-prompt/description.json:12 — The keywords array includes "prompt-improve" and "prompt-models" without the sk- prefix. These are not the canonical workflowMode names and can pollute advisor search results.
- **F008**: sk-doc hub description uses bare pre-rename phrases in keywords — .opencode/skills/sk-doc/description.json:25 — The keywords array includes "create diff report" and "document before after review" without the sk- prefix. These match the pre-rename workflow names.

## Confirmed-Clean
- .opencode/skills/sk-code/mode-registry.json: all workflowMode and packet fields use sk-code-* names
- .opencode/skills/sk-design/mode-registry.json: all workflowMode and packet fields use sk-design-* names
- .opencode/skills/sk-doc/mode-registry.json: all workflowMode and packet fields use sk-create-* names
- .opencode/skills/sk-prompt/mode-registry.json: all workflowMode and packet fields use sk-prompt-* names
- .opencode/skills/sk-code/hub-router.json: tieBreak and routerSignals match new workflowMode keys
- .opencode/skills/sk-design/hub-router.json: tieBreak and routerSignals match new workflowMode keys
- .opencode/skills/sk-doc/hub-router.json: tieBreak and routerSignals match new workflowMode keys
- .opencode/skills/sk-prompt/hub-router.json: tieBreak and routerSignals match new workflowMode keys
- .opencode/skills/sk-code/leaf-manifest.json: packet and workflowMode entries are sk-prefixed
- .opencode/skills/sk-design/leaf-manifest.json: packet and workflowMode entries are sk-prefixed
- .opencode/skills/sk-doc/leaf-manifest.json: packet and workflowMode entries are sk-prefixed
- .opencode/skills/sk-prompt/leaf-manifest.json: packet and workflowMode entries are sk-prefixed
- .opencode/skills/sk-design/command-metadata.json: ownerMode and skill references are sk-prefixed
- .opencode/commands/*: no old workflowMode keys found in command bindings inspected
- .opencode/agents/*: no old workflowMode keys found in agent definitions inspected

## Traceability Checks
- Cross-reference checked: .opencode/skills/sk-doc/sk-create-skill/scripts/tests/validate-compiled-routing-scenarios.test.cjs
- Cross-reference checked: .opencode/skills/sk-prompt/description.json
- Cross-reference checked: .opencode/skills/sk-doc/description.json
- Cross-reference checked: .opencode/skills/sk-prompt/description.json
- Cross-reference checked: .opencode/skills/sk-doc/description.json
- Spec/rename-map alignment: in progress

## Assessment
Dimensions addressed: maintainability
New findings this iteration: P0=0, P1=0, P2=3
Total active findings: P0=0, P1=0, P2=3

## Next Focus
Security: secrets and permissions in changed files

Review verdict: PASS with P2 advisories
