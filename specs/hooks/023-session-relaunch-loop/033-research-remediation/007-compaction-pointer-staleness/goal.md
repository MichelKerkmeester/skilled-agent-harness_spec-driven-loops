---
title: "Goal: Dated after-compaction pointer"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "compaction pointer staleness goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/033-research-remediation/007-compaction-pointer-staleness"
    last_updated_at: "2026-10-25T13:42:34Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-007-compaction-pointer-staleness"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Dated after-compaction pointer

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** After a compaction the pointer tells the session how old its note is and how to check what changed since, before it trusts Remaining work.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Only the after-compaction text changes; the relaunch seed text stays word for word |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `validate.sh specs/hooks/023-session-relaunch-loop/033-research-remediation/007-compaction-pointer-staleness --strict` prints `RESULT: PASSED`, with every row in its `acceptance-criteria.md` Met
- [ ] A nudge test shows the after-compaction text names the note's `created_at` and asks for `git log --since=<created_at>` and `git status` before Remaining work is trusted, and fails on the code before the change
- [ ] Claude compact-pointer, Pi and OpenCode plugin tests each show the date in the text they send
- [ ] The existing relaunch seed tests pass with no edit to their expected text
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
| Phase scaffolded with its brief | Done | `../scratch/briefs/007-compaction-pointer-staleness.md` |

### Deviations and findings

| Item | Note |
|------|------|
| Goal written before the spec docs | The writer fills spec.md and acceptance-criteria.md from the same brief; reconcile this goal with them once filled |
<!-- /ANCHOR:log -->
