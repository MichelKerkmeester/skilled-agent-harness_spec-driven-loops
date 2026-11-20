---
title: "Goal: Phase 11: push the open-item fixes and re-pin Barter onto them"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "push and repin open items goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/007-overlay-framework-root-layout/011-push-and-repin-open-items"
    last_updated_at: "2026-11-20T16:45:58Z"
    last_updated_by: "orchestrator"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-011-push-and-repin-open-items"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 11: push the open-item fixes and re-pin Barter onto them

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Skilled main carrying the open-item fixes is on origin, Barter is pinned to that pushed commit, and its `base.json` records it.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The operator pushes Skilled main; no session pushes it for them. |
| D2 | The re-pin and record-base run from an ai-speckit session after the push. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [ ] After a fetch, `git merge-base --is-ancestor <phase 009 merge> origin/main` exits 0 in Skilled.
- [ ] ai-speckit's overlay manifest `pin.commit` equals this phase's `Target Skilled commit:` line.
- [ ] `node .skilled/commands/doctor/scripts/overlay-engine.cjs status --json` in ai-speckit `skilled/` reports `PASSED`.
- [ ] `validate.sh --strict` on this phase prints `RESULT: PASSED`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG
<!-- FILL: Record each step with its command output. Keep this table current. GOOD: T001 Done. `ls logs/archive | wc -l` printed 3. WEAK: Progress is good. -->

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Goal authored | Done | Planned with the phase scaffold on 2026-11-20 |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | Nothing has diverged from the directive |
<!-- /ANCHOR:log -->
