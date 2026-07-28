---
title: "FR-001: No-Card-Matches Fallback"
description: "Verify sk-design modes state the explicit no-procedure fallback instead of loading every procedure card or inventing a card."
version: 1.1.0.0
id: FR-001
expected_workflow_mode: sk-design-interface
expected_leaf_resources: []
---

# FR-001: No-Card-Matches Fallback

---

## 1. OVERVIEW

This scenario verifies the negative-control path where a design-family prompt is valid for a public mode but does not match any private procedure-card trigger.

---

## 2. SCENARIO CONTRACT

**Realistic user request**: An operator asks for a narrow advisory response that belongs to a mode but does not need any private procedure support.

**Exact prompt**:
```text
interface: explain whether this existing neutral token name should be semantic or surface-level. Keep it advisory and state whether a procedure card applies before answering.
```

**Expected mode resolution**: `interface`.

**Expected procedure result**: `Procedure applied: none - baseline interface workflow`.

**Expected variant checks**:
- `md-generator`: `Procedure applied: none - baseline md-generator pipeline`.

Note: the retired `motion` mode's own `Procedure applied: none - baseline motion workflow` line merged into `interface`'s single baseline fallback (`Procedure applied: none - baseline interface workflow`) once `motion` folded into `interface`; there is no separate motion variant to check any more.

---

## 3. TEST EXECUTION

### Preconditions

1. Both mode `SKILL.md` files contain a `Procedure applied: none - baseline ...` line.
2. The prompt does not include a procedure-card trigger such as extraction, final polish, interaction-state matrix, or component inventory.

### Exact Command Sequence

1. Run the primary interface prompt and save response to `/tmp/skd-FR001-interface.txt`.
2. Run one narrow advisory variant for each remaining mode and save responses under `/tmp/skd-FR001-<mode>.txt`.
3. Confirm each response cites the matching no-card fallback line before substantial output.

### Pass/Fail Criteria

- **PASS** iff each mode states the exact no-card fallback line, loads no unrelated procedure card, does not load every card in the folder, and continues with that mode's baseline workflow.
- **FAIL** iff a card is invented, all procedure cards are loaded by default, a fallback line is missing, or md-generator is flattened to the read-only fallback text used by the advisory `interface` mode.

### Failure Triage

1. Re-read the no-card line in the affected mode's `SKILL.md`.
2. Check whether the prompt accidentally included a card trigger.
3. If md-generator says read-only, re-read its `Backend Boundary Preservation` section.

---

## 4. SOURCE FILES

- `.opencode/skills/sk-design/sk-design-interface/SKILL.md`
- `.opencode/skills/sk-design/sk-design-md-generator/SKILL.md`

---

## 5. SOURCE METADATA

- **Critical path**: Candidate for operator confirmation
- **Destructive**: No
- **Concurrent-safe**: Yes
