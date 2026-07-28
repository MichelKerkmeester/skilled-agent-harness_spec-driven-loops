# Iteration 1 - Correctness: mode-registries, hub-routers, leaf-manifests vs rename map

## Focus
Correctness: mode-registries, hub-routers, leaf-manifests vs rename map

## Files Reviewed
- .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py
- .opencode/skills/system-deep-loop/deep-improvement/assets/skill-benchmark/fixtures/sk-design/sk-design-transform-bolder-alias.private.json
- .opencode/skills/sk-code/mode-registry.json
- .opencode/skills/sk-design/mode-registry.json
- .opencode/skills/sk-doc/mode-registry.json
- .opencode/skills/sk-prompt/mode-registry.json

## Findings - New
### P0
- None.

### P1
- **F001**: skill_advisor hardcodes old sk-prompt/prompt-models path — .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py:3377 — The advisor constructs model_profiles_path from the pre-rename directory "sk-prompt/prompt-models", which no longer exists. The try/except silently swallows the OSError, so small-model prompt dispatch may run with empty profiles and no diagnostics.

### P2
- **F002**: sk-design skill-benchmark route-gold fixtures still expect old workflowMode names — .opencode/skills/system-deep-loop/deep-improvement/assets/skill-benchmark/fixtures/sk-design/sk-design-transform-bolder-alias.private.json:10 — The fixture expects "workflowMode": "interface" and "resources": ["design-interface/SKILL.md"]. Multiple sk-design gold files in the same directory share this pattern. The implementation summary reports sk-design BLOCKED-BY-ROUTE-GOLD 91, confirming these stale expectations are still being honored rather than updated to sk-design-interface.

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
- Cross-reference checked: .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py
- Cross-reference checked: .opencode/skills/system-deep-loop/deep-improvement/assets/skill-benchmark/fixtures/sk-design/sk-design-transform-bolder-alias.private.json
- Cross-reference checked: .opencode/skills/sk-code/mode-registry.json
- Cross-reference checked: .opencode/skills/sk-design/mode-registry.json
- Cross-reference checked: .opencode/skills/sk-doc/mode-registry.json
- Cross-reference checked: .opencode/skills/sk-prompt/mode-registry.json
- Spec/rename-map alignment: in progress

## Assessment
Dimensions addressed: correctness
New findings this iteration: P0=0, P1=1, P2=1
Total active findings: P0=0, P1=1, P2=1

## Next Focus
Traceability: shared references, manual testing playbooks, and consumer doc examples

Review verdict: CONDITIONAL
