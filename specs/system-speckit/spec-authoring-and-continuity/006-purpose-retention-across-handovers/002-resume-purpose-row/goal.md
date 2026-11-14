---
title: "Goal: Phase 2: resume-purpose-row"
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
    packet_pointer: "system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/002-resume-purpose-row"
    last_updated_at: "2026-11-14T08:45:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ef52f514-275d-4013-b7bd-ab365324057d"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 2: resume-purpose-row

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** After `/speckit:resume`, the brief shows one sentence that says why the packet exists, quoted from its own spec.md or from the nearest phase parent's spec.md.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | This phase changes only the files its `spec.md` lists under Files to Change, plus its own packet docs. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] REQ-001: Both workflow assets list Purpose first in `reply_format` and carry one `purpose_row` rule. `rg -c 'reply_format: \["Purpose \(omit when none\)"' <asset>` prints 1 and `rg -c '^  purpose_row: ' <asset>` prints 1 for each of the two assets
- [x] REQ-002: The `purpose_row` rule quotes the packet's own spec.md Purpose, falls back to the nearest ancestor phase parent's Purpose with a parent label and then to the goal.md Objective. It omits the row when none exists. The rule text in both assets contains `Purpose (parent <parent-folder-name>)`, `Purpose (goal.md)`, `omit the row` and `Never print None`
- [x] REQ-003: Resume reads `spec.md` on every run. Both `context_loading_priority` lines contain `spec/tasks/plan`. The autonomous step 2 list names `spec.md`. Both assets carry the `Always read the Purpose for the brief` line
- [x] REQ-004: The two workflow assets stay valid YAML and the existing command tests still pass. `python3` with `yaml.safe_load` loads both files, the goal-offer test reports 5 pass and 0 fail and the phase workflow test prints `passed=148 failed=0`
- [x] REQ-005: The presentation file's Resume Brief template shows the Purpose line directly under `Spec: [path]`. `rg -n -A1 '^Spec: \[path\]$' .skilled/commands/speckit/assets/speckit-resume-presentation.txt` prints the `Purpose:` line as the next line
- [ ] REQ-006: A live resume shows the row. `/speckit:resume` on a packet with a filled Purpose shows `Purpose:` with that sentence, and on a phase child with a placeholder Purpose shows `Purpose (parent ...)`
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
| Phase built | Done except REQ-006 | REQ-006 waits for an operator-typed `/speckit:resume` in a fresh session |

### Deviations and findings

| Item | Note |
|------|------|
| None recorded | The criteria above are this phase's own requirement rows, copied from its `spec.md` |
<!-- /ANCHOR:log -->
