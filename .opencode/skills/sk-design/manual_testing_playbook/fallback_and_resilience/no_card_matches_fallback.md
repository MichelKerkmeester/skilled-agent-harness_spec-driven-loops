---
title: "FR-001: No-Card-Matches Fallback"
description: "Verify sk-design modes state the explicit no-procedure fallback instead of loading every procedure card or inventing a card."
version: 1.0.0.0
id: FR-001
expected_workflow_mode: foundations
expected_leaf_resources: []
---

# FR-001: No-Card-Matches Fallback

## 1. OVERVIEW

This scenario verifies the negative-control path where a design-family prompt is valid for a public mode but does not match any private procedure-card trigger.

## 2. SCENARIO CONTRACT

**Realistic user request**: An operator asks for a narrow advisory response that belongs to a mode but does not need any private procedure support.

**Exact prompt**:
```text
foundations: explain whether this existing neutral token name should be semantic or surface-level. Keep it advisory and state whether a procedure card applies before answering.
```

**Expected mode resolution**: `foundations`.

**Expected procedure result**: `Procedure applied: none - baseline foundations workflow`.

**Expected variant checks**:
- `interface`: `Procedure applied: none - baseline interface workflow`.
- `motion`: `Procedure applied: none - baseline motion workflow`.
- `audit`: `Procedure applied: none - baseline audit workflow`.
- `md-generator`: `Procedure applied: none - baseline md-generator pipeline`.

## 3. TEST EXECUTION

### Preconditions

1. All five mode `SKILL.md` files contain a `Procedure applied: none - baseline ...` line.
2. The prompt does not include a procedure-card trigger such as extraction, final polish, interaction-state matrix, component inventory, or WCAG audit.

### Exact Command Sequence

1. Run the primary foundations prompt and save response to `/tmp/skd-FR001-foundations.txt`.
2. Run one narrow advisory variant for each remaining mode and save responses under `/tmp/skd-FR001-<mode>.txt`.
3. Confirm each response cites the matching no-card fallback line before substantial output.

### Pass/Fail Criteria

- **PASS** iff each mode states the exact no-card fallback line, loads no unrelated procedure card, does not load every card in the folder, and continues with that mode's baseline workflow.
- **FAIL** iff a card is invented, all procedure cards are loaded by default, a fallback line is missing, or md-generator is flattened to the read-only fallback text used by the four advisory modes.

### Failure Triage

1. Re-read the no-card line in the affected mode's `SKILL.md`.
2. Check whether the prompt accidentally included a card trigger.
3. If md-generator says read-only, re-read its `Backend Boundary Preservation` section.

## 4. SOURCE FILES

- `.opencode/skills/sk-design/design-interface/SKILL.md`
- `.opencode/skills/sk-design/design-foundations/SKILL.md`
- `.opencode/skills/sk-design/design-motion/SKILL.md`
- `.opencode/skills/sk-design/design-audit/SKILL.md`
- `.opencode/skills/sk-design/design-md-generator/SKILL.md`

## 5. SOURCE METADATA

- **Critical path**: Candidate for operator confirmation
- **Destructive**: No
- **Concurrent-safe**: Yes
