---
title: "Goal: Phase 16: upstream code alignment for overlaid files"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "upstream code alignment goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "scaffold/016-upstream-code-alignment"
    last_updated_at: "2026-11-20T22:06:37Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 16: upstream code alignment for overlaid files

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Each Skilled counterpart of a code file Barter overlays meets sk-code's Skilled standard on the rules a fix cannot change behavior for, so Barter's copy and its source agree on the lines neither changes on purpose.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Only behavior-neutral fixes: file headers, comment hygiene, doc comments on exports, the `EXPORTS` section and stale comments. |
| D2 | Every handoff item uses the text Barter's copy carries on the same lines. |
| D3 | A counterpart dirty on Skilled main from another session is skipped and recorded. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] Every suite covering a changed file exits 0 with its baseline count.
- [ ] Each of the 24 counterparts is recorded as fixed, aligned, or skipped with a reason in `implementation-summary.md`.
- [ ] Every handoff item read before close has a row in `implementation-summary.md`.
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
| Counterpart list | Done | `/tmp/ovl-gates/016-up-files.txt`: 24 files, 0 dirty on main |
| Audits | In Progress | g1 to g3 and the `fanout-run.cjs` audit done; g4 running |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | - |
<!-- /ANCHOR:log -->
