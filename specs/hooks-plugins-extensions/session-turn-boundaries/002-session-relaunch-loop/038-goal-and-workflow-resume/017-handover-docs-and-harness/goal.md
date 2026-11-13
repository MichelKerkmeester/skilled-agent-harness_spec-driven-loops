---
title: "Goal: Phase 17: handover-docs-and-harness"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "handover docs and harness goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/017-handover-docs-and-harness"
    last_updated_at: "2026-11-13T08:49:40Z"
    last_updated_by: "planner"
    recent_action: "Authored the durable directive"
    next_safe_action: "Wait for the operator greenlight and for phases 009 to 016 to close"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-017-handover-docs-and-harness"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 17: handover-docs-and-harness

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** The session-relaunch README and the Claude relaunch playbook describe exactly what phases 009 to 016 shipped or declined, and a live hop harness run leaves no sandbox session folder behind.

### Decisions

Frozen choices. Changing one is an amendment. The parent's decisions bind here, and the child decisions below add to them.

| ID | Decision |
|----|----------|
| D1 | No behaviour change. The only files changed outside spec folders are the README, the Claude playbook, `finish-run.sh` and the new `test-finish-run.sh`. |
| D2 | Docs follow outcomes. Each README or playbook section is written from its phase's closed `acceptance-criteria.md`, and a phase that ends in a decline is documented as declined with the reason it records. Nothing is written for an open phase. |
| D3 | The background-worker hop is made repeatable by applying the recorded diff to a copy with `patch -o`, so `run-hop.sh` itself does not change. |
| D4 | The wrong iteration timestamp in `research/deep-research-state.jsonl:6` (09:30Z for a record committed at 08:15Z, research.md section 15) is out of scope. The deep-research iteration writer in `system-deep-loop` stamps it, so a fix belongs to that skill, it is not a hop harness defect, and rewriting a closed research record would change evidence. research.md section 15 already discloses it. |
| D5 | `finish-run.sh` guards the late write with a settle window and a second removal, not a pid wait, because the pid list `run-hop.sh:183` keeps is likely empty for a Claude run. |
| D6 | Local commits only. Nothing is pushed or merged without the operator, and nothing is built before the operator's greenlight. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [ ] `rg -c '\| Met \|' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/017-handover-docs-and-harness/acceptance-criteria.md` prints 11.
- [ ] `bash specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/028-goal-rebind-live-proof-and-docs/scratch/harness/test-finish-run.sh` exits 0 and prints `ok`.
- [ ] `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py` prints `Total issues: 0` for `.skilled/hooks/session-relaunch/README.md` and for `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md`.
- [ ] `node .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs bump --base HEAD --check` exits 0 with the playbook version above 1.0.21.0.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/017-handover-docs-and-harness --strict` prints `RESULT: PASSED`.
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
| Planning documents | Done | Five documents written on 2026-11-13 from research.md sections 6, 7, 9 and 15 and the 2026-11-13 goal log rows. Status planned, nothing built |
| Shipped behaviours for the HS checks | Pending | Filled from phases 009 to 016 once they close: one row per shipped behaviour, with its phase and test name |
| Late-write cause (T002) | Pending | No live run yet |

### Deviations and findings

| Item | Note |
|------|------|
| Harness defect 2 | Out of scope per D4. The record defect is in `research/deep-research-state.jsonl:6`, owned by the deep-research writer |
| Open question: does the receiver write its session log after the tmux kill? | The leftover of 2026-11-13 is the only evidence and no in-repo record names its folder. T002 settles it live before the fix |
| Open question: which `PREPARE.exit` does the worker check expect? | 0 on the 2026-11-13 tree. Phase 009 plans a required `Running workers:` line and adds `Running workers: none` to the harness note at `run-hop.sh:151-152`, so T003 must show the recorded diff still applies, and phase 015 may refuse a live descendant. The check states the value once those phases close |
<!-- /ANCHOR:log -->
