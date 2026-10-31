---
title: "Goal: find what a .skilled source-root move breaks"
description: "The durable directive for the research phase that measured the move and found its blockers, and the criteria it closed against."
trigger_phrases:
  - "skilled research phase goal"
  - "source root move blockers goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/001-deep-research"
    last_updated_at: "2026-09-16T21:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Recorded the directive this completed phase ran against"
    next_safe_action: "None; the phase is complete"
    blockers: []
    key_files:
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "041-001-goal"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: find what a .skilled source-root move breaks

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Measure every surface the move touches and name what cannot be done by a rewrite, with every claim cited and checked against the tree.

### Decisions

Frozen; changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Two model families research the same frozen brief: gpt-5.6-luna on cli-codex for ten iterations and deepseek-v4-1-flash-max on cli-devin for five, early convergence off. |
| D2 | The orchestrator opens every load-bearing citation before repeating it and records the corrections the tree forces. |

### Operator copy

A change here that alters a parent decision or criterion is applied to the parent first.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] Both lanes ran their iteration counts and wrote a synthesis
- [x] `research/research.md` merges both lanes with a corrections ledger and a verification record
- [x] Every blocker carries a `file:line` citation the orchestrator opened
- [x] The phase validates PASSED
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Research and merge | Done | `research/research.md`; committed at `fa4362d5dc` |

### Deviations and findings

| Item | Note |
|------|------|
| DeepSeek lane rejected by the runner | Its records used `run` where the validator reads `iteration`; the content was verified and used, and the contract was fixed in a later packet |
<!-- /ANCHOR:log -->
