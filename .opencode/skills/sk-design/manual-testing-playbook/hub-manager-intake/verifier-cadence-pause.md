---
title: "HM-003: Verifier-Cadence Pause"
description: "Verify the sk-design hub pauses ready claims when a required proof field is missing or transport-only."
version: 1.0.0.0
id: HM-003
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# HM-003: Verifier-Cadence Pause

## 1. OVERVIEW

This scenario verifies the hub's proof-gate behavior: missing taste, accessibility, responsive, or transport proof must pause a ready claim.

## 2. SCENARIO CONTRACT

**Realistic user request**: A user asks the hub to call a design ready after only partial or transport-only evidence.

**Exact prompt**:
```text
I only have a Figma export and no rendered responsive checks. Tell me whether this design is ready to ship, and if any proof field is missing, pause the ready claim and name the missing proof.
```

**Expected hub behavior**: Name the missing proof field and pause readiness instead of inventing evidence.

**Expected proof fields**: taste, accessibility, responsive, and transport proof, with transport output treated as evidence to inspect rather than design acceptance.

## 3. TEST EXECUTION

### Preconditions

1. Hub `SKILL.md` contains `Proof Gates and Verifier Cadence`.
2. The prompt deliberately lacks responsive and accessibility proof.

### Exact Command Sequence

1. Run the advisor probe and save output to `/tmp/skd-HM003-advisor.txt`.
2. Invoke the orchestrator with the exact prompt.
3. Capture the proof review, missing fields, paused readiness language, and any route back to selected mode or audit in `/tmp/skd-HM003-response.txt`.

### Pass/Fail Criteria

- **PASS** iff the response refuses a ready claim, names missing proof fields, treats transport output as non-acceptance evidence, and routes the gap back to the selected mode or audit.
- **FAIL** iff it says ready based only on transport/export evidence, fabricates responsive or accessibility checks, or invents a new verifier outside the mode contracts.

### Failure Triage

1. Re-read hub `SKILL.md` `Proof Gates and Verifier Cadence`.
2. Confirm the response distinguishes confirmed transport evidence from inferred design acceptance.
3. Re-run with a screenshot-only variant and inspect readiness language.

## 4. SOURCE FILES

- `.opencode/skills/sk-design/SKILL.md`
- `.opencode/skills/sk-design/design-audit/SKILL.md`
- `.opencode/skills/sk-design/mode-registry.json`

## 5. SOURCE METADATA

- **Critical path**: Candidate for operator confirmation
- **Destructive**: No
- **Concurrent-safe**: Yes
