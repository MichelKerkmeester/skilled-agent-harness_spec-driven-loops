---
title: "Goal: Gate 3 menu parity"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/016-research-recommendations/014-gate-3-menu-parity"
    last_updated_at: "2026-10-08T12:00:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bd2aa56c-623b-43f8-a2ef-69a13c32d626"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Gate 3 menu parity

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Restore "in the same track" to 9 presentation files and 3 compiled contracts that carry Gate 3 option C menus, and add a parity test that confirms all 12 files match the constant wording.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Constants in `spec-gate-core.mjs:151` are the authored source; the 12 files are verified copies kept in parity by the test |
| D2 | 9 presentation files are edited directly; 3 deep contracts are regenerated from their sources via `compile-command-contracts.cjs` |
| D3 | Hook test baseline (spec-gate-core.test.mjs:324) is left unchanged; no hook test assertions are modified |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] All 9 named presentation files include "in the same track" in Gate 3 option C
- [ ] 3 deep contracts are regenerated and include the phrase
- [ ] A parity test passes on all 12 files
- [ ] Hook test baseline hash remains unchanged
- [ ] Phase validates strictly
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
| Inventory presentation files | Pending | Tasks T001 |
| Locate compiled contracts | Pending | Tasks T002 |
| Update presentation files | Pending | Tasks T004 |
| Create parity test | Pending | Tasks T007 |
| Validate changes | Pending | Tasks T009 |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | To be filled during implementation |
<!-- /ANCHOR:log -->
