---
title: "Goal: Phase 10: documentation-sweep"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "documentation sweep goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "scaffold/010-documentation-sweep"
    last_updated_at: "2026-10-18T12:45:10Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-010-documentation-sweep"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 10: documentation-sweep

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Bring every doc that the OpenCode build touches up to its sk-doc mode, so that each one passes its validator, scores 75 or higher on DQI and passes the human-voice scan, while no doc describes a v1-only dispatch shape as universal.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| Parent | Parent decisions D1 to D8 bind this phase. None is restated here. |
| L1 | Each doc is written through the sk-doc mode for its type, and that mode's validator is its gate. |
| L2 | Each doc belongs to one writer dispatch at a time, and no two dispatches edit the same doc. |
| L3 | No doc is trimmed only to raise its DQI score. |
| L4 | Every version-specific claim names 1.19.3 or 2.0.32, or it says the claim is unverified. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] Every touched doc exits 0 from the validator named by its sk-doc mode
- [ ] Every changed skill, hub and playbook package exits 0 from its sk-doc package check
- [ ] Every touched doc scores 75 or higher for `dqi.total` in `extract_structure.py` output
- [ ] A search for `--command`, `--dir`, `--share`, `--port` and `--pure` across the touched docs returns only lines that name version 1
- [ ] Every touched doc passes `hvr_scan.py` with exit status 0, and its manual human-voice note is recorded
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
| Planning documents filled | Done | The six documents in this folder, written from the phase 010 brief and research sections 6 and 11 |
| Inventory and search | Pending | None yet |
| Writes and review | Pending | None yet |
| Gates | Pending | None yet |

### Deviations and findings

| Item | Note |
|------|------|
| Playbook file count | The research names 20 playbook files, but its own grouped list sums to 21 before the intra-routing-recall group. The named group folders now hold 34 files. The T004 grep sets the real set, and the packet follows that grep. |
<!-- /ANCHOR:log -->
