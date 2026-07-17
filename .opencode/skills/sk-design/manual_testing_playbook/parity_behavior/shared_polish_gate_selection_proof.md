---
title: "PB-006: Shared Polish-Gate Selection Proof"
description: "Verify the shared polish-gate procedure card is selected once at hub level and remains owned by design-audit review."
version: 1.0.0.0
id: PB-006
expected_workflow_mode: audit
expected_leaf_resources: []
---

# PB-006: Shared Polish-Gate Selection Proof

## 1. OVERVIEW

This scenario verifies that final multi-dimensional polish selects the shared `polish_gate_orchestration.md` card exactly once, with `design-audit` as owning reviewer, instead of duplicating the same card per mode.

## 2. SCENARIO CONTRACT

**Realistic user request**: A team has a nearly finished UI and asks for a final release-readiness polish review spanning accessibility, generic-template risk, hierarchy/rhythm, and interaction states.

**Exact prompt**:
```text
Run the final design polish gate for this nearly finished checkout UI. State the public sk-design mode, the shared internal procedure card you selected, the owning reviewer, and how findings route across audit, foundations, motion, interface, and sk-code.
```

**Expected mode resolution**: `audit` as review owner, with cross-mode routing notes.

**Expected procedure card**: `shared/procedures/polish_gate_orchestration.md`.

**Why**:
- `shared/procedures/polish_gate_orchestration.md` states owning reviewer `design-audit` and covers accessibility, anti-slop, hierarchy/rhythm, and interaction states.
- Mode `SKILL.md` tables cite the shared card for final polish spanning multiple dimensions.

## 3. TEST EXECUTION

### Preconditions

1. `shared/procedures/polish_gate_orchestration.md` exists and names owning reviewer `design-audit`.
2. Mode `SKILL.md` files cite the shared card only as private procedure support, not public workflow mode.

### Exact Command Sequence

1. Run the advisor probe and save output to `/tmp/skd-PB006-advisor.txt`.
2. Invoke the orchestrator with the exact prompt.
3. Capture mode, selected shared card, owner mapping, loaded resources, tool calls, and response in `/tmp/skd-PB006-response.txt`.

### Pass/Fail Criteria

- **PASS** iff the response names `shared/procedures/polish_gate_orchestration.md`, identifies `design-audit` as the owning reviewer, groups findings into blockers/quality issues/polish notes/open decisions/out-of-scope observations, routes fixes to owning modes or `sk-code`, and does not expose a public polish skill.
- **FAIL** iff the shared card is duplicated per mode, becomes a public route, omits owner mapping, edits files, or collapses all fix ownership into audit.

### Failure Triage

1. Re-read `shared/procedures/polish_gate_orchestration.md` fields `Owning mode`, `Proof gate`, and `Placement rationale`.
2. Check mode `SKILL.md` tables for shared-card references.
3. Confirm the response separates review ownership from fix ownership.

## 4. SOURCE FILES

- `.opencode/skills/sk-design/shared/procedures/polish_gate_orchestration.md`
- `.opencode/skills/sk-design/design-audit/SKILL.md`
- `.opencode/skills/sk-design/design-foundations/SKILL.md`
- `.opencode/skills/sk-design/design-motion/SKILL.md`
- `.opencode/skills/sk-design/design-interface/SKILL.md`

## 5. SOURCE METADATA

- **Critical path**: Candidate for operator confirmation
- **Destructive**: No
- **Concurrent-safe**: Yes
