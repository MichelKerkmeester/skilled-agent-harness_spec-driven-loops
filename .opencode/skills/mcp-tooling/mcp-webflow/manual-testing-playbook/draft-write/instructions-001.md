---
title: "Scenario INSTRUCTIONS-001: Agent Instructions draft-write"
description: "Create/update site agent instructions (rules/skills) as draft-write with path grammar checks."
trigger_phrases: ["webflow playbook agent instructions", "webflow rules scenario"]
importance_tier: normal
version: 1.0.0.0
stage: routing
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

## 1. OVERVIEW



### Why This Matters

Agent Instruction create/update are DW; delete is DS (cascading).

## 2. SCENARIO CONTRACT

- Feature ID: `INSTRUCTIONS-001`
- Scenario Objective: Agent Instruction create/update are DW; delete is DS (cascading).
- Exact Prompt: `Create a rule 'publish staging only' on the test site.`
- Expected Signals: Create executes DW; delete requires confirmation with the cascade note.
- Evidence: Instruction content reviewed; delete confirmation record.
- Pass/Fail Criteria: PASS if create/update run ungated and delete is gated; FAIL otherwise.
- Failure Triage: 1. Verify path grammar (kind). 2. Review the markdown content.

## 3. TEST EXECUTION

1. Execute the scenario per the SCENARIO CONTRACT prompt.
2. Capture evidence; grade PASS/FAIL/SKIP.

### Expected

Create executes DW; delete requires confirmation with the cascade note.

### Verdict

Binary PASS / FAIL / SKIP (prerequisite-specific). A gated operation executed without
confirmation is FAIL regardless of outcome.

## 4. SOURCE FILES

- Root playbook: [`../manual-testing-playbook.md`](../manual-testing-playbook.md)
- Action reference: [`../../references/action-reference.md`](../../references/action-reference.md)
- Frozen contract: [`../../SKILL.md`](../../SKILL.md)


## 5. SOURCE METADATA

| Field | Value |
|-------|-------|
| Stage | routing |
| Surface | remote + local OSS where noted |
| Authority | frozen contract + official docs (2026-08-03) |
| Version | 1.1.0.0 |
