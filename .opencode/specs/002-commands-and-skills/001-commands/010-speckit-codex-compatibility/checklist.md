# Checklist: Make spec_kit Commands Codex-Compatible

## P0 - Must Pass

- [ ] All `## AGENT ROUTING` sections removed from .md files
- [ ] All `## SUB-AGENT DELEGATION` sections removed from .md files
- [ ] All dispatch templates removed from .md files
- [ ] `## CONSTRAINTS` section added to all 7 .md files
- [ ] All YAML `agent_routing:` renamed to `agent_availability:`
- [ ] All YAML `dispatch:` fields removed
- [ ] All YAML entries have `condition:` field
- [ ] All YAML entries have `not_for:` field
- [ ] No broken references between .md and YAML files

## P1 - Should Pass

- [ ] YAML comment headers updated to "AGENT AVAILABILITY"
- [ ] Blocking behavior preserved for @review in YAML
- [ ] Failure tracking preserved for @debug in YAML
- [ ] Existing non-agent sections preserved unchanged
- [ ] Setup phases preserved unchanged
