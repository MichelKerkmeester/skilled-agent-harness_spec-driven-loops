# Iteration 6 - Correctness: command bindings and agent definitions

## Focus
Correctness: command bindings and agent definitions

## Files Reviewed
- .opencode/commands/create/AGENT.md
- .opencode/commands/create/assets/create-agent-auto.yaml
- .opencode/agents

## Findings - New
### P0
- None.

### P1
- None.

### P2
- None.

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
- Cross-reference checked: .opencode/commands/create/AGENT.md
- Cross-reference checked: .opencode/commands/create/assets/create-agent-auto.yaml
- Cross-reference checked: .opencode/agents
- Spec/rename-map alignment: in progress

## Assessment
Dimensions addressed: correctness
New findings this iteration: P0=0, P1=0, P2=0
Total active findings: P0=0, P1=0, P2=0

## Next Focus
Traceability: advisor and skill consumer realignment

Review verdict: PASS
