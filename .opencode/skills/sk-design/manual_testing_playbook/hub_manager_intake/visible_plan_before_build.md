---
title: "HM-002: Visible Plan Before Build"
description: "Verify the sk-design hub shows route, loaded context, design moves, proof expectations, and handoff target before substantial design/build/transport work."
version: 1.0.0.0
---

# HM-002: Visible Plan Before Build

## 1. OVERVIEW

This scenario verifies the hub's `Visible Plan Before Design or Build Work` contract as its own pass/fail behavior.

## 2. SCENARIO CONTRACT

**Realistic user request**: A user asks for a substantial UI build direction that crosses interface and foundations concerns.

**Exact prompt**:
```text
Design the visual direction for a dense operations dashboard and prepare the implementation handoff. Before any design recommendation, show the selected mode or bundle, context loaded, intended design moves, proof required, and handoff target.
```

**Expected hub behavior**: Show a concise plan before design recommendations.

**Expected bundle**: interface plus foundations for a UI build request, with handoff target `sk-code` if implementation follows.

## 3. TEST EXECUTION

### Preconditions

1. Hub `SKILL.md` contains `Visible Plan Before Design or Build Work`.
2. The request is substantial enough to require a visible plan, not a one-line advisory answer.

### Exact Command Sequence

1. Run the advisor probe and save output to `/tmp/skd-HM002-advisor.txt`.
2. Invoke the orchestrator with the exact prompt.
3. Capture first response section, selected mode/bundle, context loaded or missing, intended design moves, proof requirements, and handoff target in `/tmp/skd-HM002-response.txt`.

### Pass/Fail Criteria

- **PASS** iff the visible plan appears before any substantive design recommendation and includes selected mode or ordered bundle, context loaded or still missing, intended design moves, proof required before ready, and handoff target.
- **FAIL** iff the response starts with palette/layout/motion recommendations before the plan, omits proof expectations, or treats `sk-code`/transport as taste authority.

### Failure Triage

1. Re-read hub `SKILL.md` `Visible Plan Before Design or Build Work`.
2. Confirm the prompt is substantial design/build work rather than quick advice.
3. Inspect whether the first non-intake paragraph is a plan or a recommendation.

## 4. SOURCE FILES

- `.opencode/skills/sk-design/SKILL.md`
- `.opencode/skills/sk-design/hub-router.json`
- `.opencode/skills/sk-design/mode-registry.json`

## 5. SOURCE METADATA

- **Critical path**: Candidate for operator confirmation
- **Destructive**: No
- **Concurrent-safe**: Yes
