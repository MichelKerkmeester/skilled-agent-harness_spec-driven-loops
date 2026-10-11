---
title: "Goal: Phase 3: feature-catalog-findings"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "feature catalog findings goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/066-feature-catalog-template-anchor-deprecation/003-feature-catalog-findings"
    last_updated_at: "2026-10-10T22:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "t4-feature-catalog-anchor"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 3: feature-catalog-findings

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Fix every feature catalog finding the strict validator reports, or record why it stays, and let repaired packages fail closed.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | One script per bulk finding type, kept in `scratch/`. |
| D2 | Root entries win title and description parity. |
| D3 | Intentional paths stay and are handed off as a validator exemption. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `validate_catalog_package.py --report-only` reports 15 findings or fewer, each listed with a reason
- [x] The warn tier lists only packages that still have findings
- [x] Both validator test scripts print ALL PASS
- [x] `validate.sh --strict` on this phase prints RESULT: PASSED
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Scripts | Done | 300 + 110 + 166 + 84 changes |
| Validator | Done | 761 to 15 |

### Deviations and findings

| Item | Note |
|------|------|
| Builder exit | The sk-design builder process ended before writing its report; its edits were verified by diff and validator rerun. |
<!-- /ANCHOR:log -->
