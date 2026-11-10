---
title: "Feature Specification: Insert Level 2 sections above the questions anchor on upgrade"
description: "Upgrading a Level 1 spec to Level 2 put the new sections inside the questions anchor, so strict validation failed ANCHORS_VALID on every such upgrade. The sections now land above the anchor."
trigger_phrases:
  - "upgrade level anchor insert"
  - "insert level 2 sections above the questions anchor"
  - "upgrade-level breaks anchors_valid"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Insert Level 2 sections above the questions anchor on upgrade

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-08 |
| **Branch** | `worktrees/324-overlay-repin-barter-parity` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`upgrade-level.sh` inserted the Level 2 sections directly above the `## N. OPEN QUESTIONS` heading. A Level 1 `spec.md` opens that section with `(questions anchor open)` on the line above the heading, so the new sections landed inside the questions anchor and every Level 1 to Level 2 upgrade failed strict validation until someone moved them by hand.

### Purpose
An upgraded spec keeps the questions anchor directly above its renumbered heading, with the Level 2 sections before it.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
A Level 1 packet rendered from the current templates, then `upgrade-level.sh <packet> --to 2`, then `grep -n "ANCHOR:questions\|^## " spec.md`:

```text
118:(questions anchor open)
120:## L2: NON-FUNCTIONAL REQUIREMENTS
137:## L2: EDGE CASES
146:## L2: COMPLEXITY ASSESSMENT
157:## 10. OPEN QUESTIONS
162:(questions anchor close)
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Split above `(questions anchor open)` when it sits directly above the OPEN QUESTIONS heading, in both the numbered and the non-standard heading branch.
- Add a test that the anchor is directly above the renumbered heading after an upgrade.

### Out of Scope
- Other upgrade paths, such as Level 2 to Level 3. They insert at other headings and were not seen to break.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-level.sh` | Modify | Anchor-aware split in `upgrade_spec_l1_to_l2` |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-level-sections.vitest.ts` | Modify | The anchor-position test |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The questions anchor stays directly above the renumbered heading | After `upgrade-level.sh <packet> --to 2`, the line after `(questions anchor open)` matches `^## \d+\. OPEN QUESTIONS$` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | A spec without the anchor upgrades exactly as before | `test-upgrade-level.sh` passes all 14 cases |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A fresh Level 1 packet upgraded to Level 2 passes `validate.sh --strict` with `ANCHORS_VALID` passing.
- **SC-002**: `upgrade-level-sections.vitest.ts` passes, and its new test fails against the old script.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The Level 1 templates keep the anchor on the line above the heading | The fix would stop matching | The test renders the real templates, so a template change shows up there |
| Risk | The no-anchor path changes its output | Med | The split only moves when that exact anchor line is present |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None
<!-- /ANCHOR:questions -->

---
