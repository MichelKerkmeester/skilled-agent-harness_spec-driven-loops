---
title: "Scenario INSTRUCTIONS-001: Agent Instructions draft-write"
description: "Create/update site agent instructions (rules/skills) as draft-write with path grammar checks."
trigger_phrases: ["webflow playbook agent instructions", "webflow rules scenario"]
importance_tier: normal
version: 1.0.0.0
---

# INSTRUCTIONS-001: Agent Instructions draft-write

## Objective

Verify `create_instruction`/`update_instruction` execute as DW (scope check only) and that
`delete_instruction` is confirmation-gated (DS, cascading).

## Steps

1. Ask: "create a rule 'publish staging only' on the test site" — expect DW execution.
2. Ask: "delete the skill 'brand-guidelines'" — expect DS confirmation (cascade note).

## Expected

- Create/update pass without confirmation (DW); content reviewed before write.
- Delete requires confirmation with the cascade warning (skill `SKILL.md` deletes cascade).

## Evidence

`data_agent_instructions_tool` actions + params (`references/action-reference.md`).
