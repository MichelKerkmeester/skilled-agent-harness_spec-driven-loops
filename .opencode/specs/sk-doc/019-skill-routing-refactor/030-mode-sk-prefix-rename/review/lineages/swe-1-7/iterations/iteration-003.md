# Iteration 3 - Traceability: shared references and docs for stale workflowMode strings

## Focus
Traceability: shared references and docs for stale workflowMode strings

## Files Reviewed
- .opencode/skills/sk-design/shared/creation-contract.md
- .opencode/skills/sk-design/sk-design-mcp-open-design/references/cli-child-pairing.md
- .opencode/skills/sk-design/manual-testing-playbook/mode-routing/mcp-open-design-mode.md

## Findings - New
### P0
- None.

### P1
- None.

### P2
- **F003**: sk-design shared creation-contract example uses stale workflowMode "interface" — .opencode/skills/sk-design/shared/creation-contract.md:80 — The typed context envelope JSON example still uses the pre-rename "workflowMode": "interface". This is a live shared reference consumed by modes and can mislead implementers.
- **F004**: sk-design-mcp-open-design CLI pairing example references pre-rename packet name — .opencode/skills/sk-design/sk-design-mcp-open-design/references/cli-child-pairing.md:83 — The childLoadedSkills example lists "design-mcp-open-design" instead of the renamed "sk-design-mcp-open-design".
- **F005**: sk-design manual-testing playbook uses old design mode names in pass/fail criteria — .opencode/skills/sk-design/manual-testing-playbook/mode-routing/mcp-open-design-mode.md:64 — The FAIL criteria list the pre-rename design-judgment modes "interface/foundations/motion/audit/md-generator". These names no longer exist in the registry and could confuse test operators.

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
- Cross-reference checked: .opencode/skills/sk-design/shared/creation-contract.md
- Cross-reference checked: .opencode/skills/sk-design/sk-design-mcp-open-design/references/cli-child-pairing.md
- Cross-reference checked: .opencode/skills/sk-design/manual-testing-playbook/mode-routing/mcp-open-design-mode.md
- Spec/rename-map alignment: in progress

## Assessment
Dimensions addressed: traceability
New findings this iteration: P0=0, P1=0, P2=3
Total active findings: P0=0, P1=0, P2=3

## Next Focus
Maintainability: description.json keywords, test fixtures, and historical surfaces

Review verdict: PASS with P2 advisories
