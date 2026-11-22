---
title: "Goal: Phase 1: run-recorder-and-validator"
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
    packet_pointer: "sk-doc/authoring-modes-and-playbooks/007-playbook-run-recording/001-run-recorder-and-validator"
    last_updated_at: "2026-11-22T11:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored the phase goal"
    next_safe_action: "Commit on the operator's instruction"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "da5c810b-9095-42b1-8923-c83799a0919f"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 1: run-recorder-and-validator

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** A finished playbook run reaches the skill benchmark folder through `record-playbook-run.cjs`, the conversation runner hands its output to it, and the validator fails a root without the results marker.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | `record-playbook-run.cjs` is the one writer of run folders. Nothing writes a run folder by hand. |
| D2 | A root without the results marker fails validation. Coverage is a report and never fails. |
| D3 | All 11 roots without the marker get it, routing-gold roots included. |
| D4 | No live run record is written for a scenario that was not run. |
| D5 | No commits without the operator's instruction. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] `node scripts/tests/record-playbook-run.test.cjs` exits 0 with three PASS lines
- [x] `node scripts/tests/validate-playbook-package.test.cjs` prints `result contract regressions: PASS`
- [x] `node --test scripts/tests/run-conversation-scenario.test.cjs` reports `fail 0`
- [x] No doc in the mode says reports are written by hand or are renderer-owned
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
| Recorder and tests | Done | 21 assertions across three PASS lines |
| Runner hand-off | Done | `scenario.json` and the `save results:` line asserted |
| Validator | Done | Marker error and `--coverage` asserted |
| Docs, MTP-005 and changelog v1.2.0.0 | Done | 0 issues on the edited docs, shape check PASS |

<!-- /ANCHOR:log -->
