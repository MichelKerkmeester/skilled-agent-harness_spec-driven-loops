---
title: "HM-001: Context-First Intake"
description: "Verify the sk-design hub gathers goal, surface, inputs, constraints, and proof expectations before route selection when missing facts affect the route or acceptance bar."
version: 1.0.0.0
---

# HM-001: Context-First Intake

## 1. OVERVIEW

This scenario verifies the hub manager behavior in `Manager Intake Before Routing` independently from any mode's private procedure-card selection.

## 2. SCENARIO CONTRACT

**Realistic user request**: A user asks for broad design help with missing route-changing details.

**Exact prompt**:
```text
Make this product experience feel more premium and production-ready. I have some screenshots and a brand deck, but I am not sure whether this needs interface direction, foundations, motion, or audit.
```

**Expected hub behavior**: Gather goal, surface, inputs, constraints, and proof expectations before choosing a mode when the missing facts affect route or acceptance bar.

**Expected mode resolution**: Either ask one focused intake question or state assumptions and choose the smallest useful mode only if enough context exists.

## 3. TEST EXECUTION

### Preconditions

1. Hub `SKILL.md` contains `Manager Intake Before Routing`.
2. The prompt intentionally spans several design axes without a concrete target surface.

### Exact Command Sequence

1. Run the advisor probe and save output to `/tmp/skd-HM001-advisor.txt`.
2. Invoke the orchestrator with the exact prompt.
3. Capture intake fields, route decision or focused question, assumptions, and response in `/tmp/skd-HM001-response.txt`.

### Pass/Fail Criteria

- **PASS** iff the response surfaces goal, surface, inputs, constraints, and proof expectations before routing, then either asks one focused question or explicitly states assumptions before choosing the smallest useful mode.
- **FAIL** iff it jumps straight to a mode, produces design advice without intake, asks an unfocused questionnaire, or treats transport output as proof.

### Failure Triage

1. Re-read hub `SKILL.md` `Manager Intake Before Routing`.
2. Check whether supplied facts were enough to route narrowly; if not, missing route-changing facts should trigger an intake question.
3. Confirm procedure-card selection is not being used as a substitute for hub intake.

## 4. SOURCE FILES

- `.opencode/skills/sk-design/SKILL.md`
- `.opencode/skills/sk-design/mode-registry.json`
- `.opencode/skills/sk-design/hub-router.json`

## 5. SOURCE METADATA

- **Critical path**: Candidate for operator confirmation
- **Destructive**: No
- **Concurrent-safe**: Yes
