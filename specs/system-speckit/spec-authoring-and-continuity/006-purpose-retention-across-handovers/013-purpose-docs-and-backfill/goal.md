---
title: "Goal: Phase 13: purpose-docs-and-backfill"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "purpose docs and backfill goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/013-purpose-docs-and-backfill"
    last_updated_at: "2026-11-14T11:27:17Z"
    last_updated_by: "scaffold"
    recent_action: "Planned the phase"
    next_safe_action: "Build the phase with /speckit:implement"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-013-purpose-docs-and-backfill"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 13: purpose-docs-and-backfill

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Give every parent that prints a layout note its own purpose sentence, and document the purpose line where operators and testers look for it, so the line is both true and findable.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | This phase changes only the files its `spec.md` lists under Files to Change, plus its own packet docs. |
| D2 | No purpose sentence is written to a packet before the operator approves its text. |
| D3 | A doc names only the runtimes whose hooks print the purpose line in this tree. Devin and OpenCode are not named. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [ ] REQ-001: `check-parents.mjs` prints `layout sentence as purpose: 0 of 11` and the E9 to E11 search texts match nothing (T006 to T008, T017)
- [ ] REQ-002: the catalog validator prints `violations=0` and each hop entry links `packet-purpose-carry.md` once (T011, T019)
- [ ] REQ-003: the playbook validator prints `scenarios=124` and `violations=0` (T020)
- [ ] REQ-004 to REQ-006: the injection contract counts `Packet Purpose` twice, the README carries six sentences and the library row names both readers (T014 to T016)
- [ ] REQ-007: each of the eleven parents prints `RESULT: PASSED (errors=0 warnings=0)` and no new doc names Devin or OpenCode as printing the line (T018, T023)
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
| Phase planned | Done | 2026-11-14 at `1bedb33577`, baselines in `plan.md` section 5 |
| Sentence verdicts | Pending | The operator approves, edits or rejects each of the eleven drafts in `scratch/sentences.md` |
| Phase built | Pending | Waits for phase 012 and the verdicts above |

### Deviations and findings

| Item | Note |
|------|------|
| Deep-review findings | Folded in from `../review/review-report.md`: R2-P2-002 is items B2, B3 and B5 and R4-P2-001 is item B6. The other five findings belong to phase 012 |
| Reserved sentence checked | Fable could not check the `sk-design/020` claim of two models. Its `synthesis.md` lines 26 to 33 show one model produced reports, so the draft names that model |
<!-- /ANCHOR:log -->
