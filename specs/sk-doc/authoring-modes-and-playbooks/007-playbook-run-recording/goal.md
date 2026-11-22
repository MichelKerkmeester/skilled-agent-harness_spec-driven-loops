---
title: "Goal: Playbook run recording"
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
    packet_pointer: "sk-doc/authoring-modes-and-playbooks/007-playbook-run-recording"
    last_updated_at: "2026-11-22T11:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored the parent goal and bound both phases"
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
# Goal: Playbook run recording

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Every manual testing playbook run saves its verdicts into the owning skill's benchmark folder through one checked command, and a playbook root that drops the results rule fails validation.

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

<!-- ANCHOR:binding -->
## 2. BINDING
<!-- FILL: List each child phase and its goal path. Name the precedence rule. GOOD: 001 and 002. Decisions here outrank child detail. WEAK: Children are bound. -->

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-run-recorder-and-validator | `001-run-recorder-and-validator/goal.md` |
| 002-playbook-marker-backfill | `002-playbook-marker-backfill/goal.md` |
| 003-hub-reports-destination | `003-hub-reports-destination/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] `node scripts/tests/record-playbook-run.test.cjs` in the mode exits 0
- [x] `validate-playbook-package.cjs` exits 0 across the fleet and reports no `RESULT_PERSISTENCE_MARKER_MISSING`
- [x] A root without the marker makes the validator exit 1
- [x] `validate.sh --strict` prints `RESULT: PASSED` for the parent and all three children
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
| Phase 1 recorder, runner hand-off, validator and docs | Done | Three test files exit 0. Detail in `001-run-recorder-and-validator/implementation-summary.md` |
| Phase 2 backfill | Done | Fleet exit 0, 55 PASS and 4 SKIP |
| Worktree tooling | Repaired locally | 514's install lacked two `@spec-kit` workspace links and `tsx`. Gitignored links were added, matching 505 and the primary install |
| Phase 3 hub reports destination | Done | `--reports` on the recorder and runner; the three suites exit 0; the three roots validate with `violations=0`; 25 cli-mistral-vibe blocks saved as 22 and 3 PASS report rows. Detail in `003-hub-reports-destination/implementation-summary.md` |
<!-- /ANCHOR:log -->
