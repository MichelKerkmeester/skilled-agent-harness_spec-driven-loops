---
title: "Implementation Plan: Phase 11: level-match-operator-record"
description: "One shell predicate in shell-common.sh decides whether decision-record.md was written by the save step. The LEVEL_MATCH rule and the upgrade-level fallback both call it, and fixtures plus the live validator path prove it."
trigger_phrases:
  - "level match operator record plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 11: level-match-operator-record

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash 3.2+ |
| **Framework** | system-spec-kit validation rules |
| **Storage** | None |
| **Testing** | `test-validation-extended.sh`, `test-upgrade-level.sh`, `validate.sh --recursive --strict` |

### Overview
Add one predicate to `lib/shell-common.sh` and call it from the LEVEL_MATCH rule and from `upgrade-level.sh`. Prove it with three fixtures, two upgrade-level cases and a recursive strict run over the packets that warn today.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] `test-validation-extended.sh` prints 87 passed and 0 failed, and `test-upgrade-level.sh` prints 16 passed and 0 failed
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shared shell predicate

### Key Components
- **`decision_record_is_writer_only`**: Reads every anchor id in the record. It returns true only when there is at least one and all are the writer's two ids.
- **LEVEL_MATCH and the upgrade-level fallback**: The two callers. Both must agree, because a record that one treats as Level 3 and the other as neutral would make the level advice contradict the check.

### Data Flow
`validate.sh` sources the rule, the rule sources `shell-common.sh`, and the predicate reads the record. `upgrade-level.sh` already sources `shell-common.sh` and calls the predicate only when spec.md declares no level.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup captures the baselines and the failing case. Implementation adds the predicate and wires both callers. Verification reruns every suite and the live validator path.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The isolated rule test sources `shell-common.sh` before it sources the rule, so it cannot catch a broken `source` line inside the rule. The recursive strict run over session-handover 001 exercises the real `validate.sh` path and is the proof for it.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`bash`, `grep`, `sed` and `sort`. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a Level 1 packet with a real ADR record stops warning. Revert the one commit.
<!-- /ANCHOR:rollback -->

---
