---
title: "Goal: Prove That counter.txt Grows by Exactly One Line per Run"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
  - "alpha phase goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "specs/demo-phase/001-alpha"
    last_updated_at: "2026-09-26T20:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-26-goal-playbook-scg-004"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Prove That counter.txt Grows by Exactly One Line per Run

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** This phase proves that counter.txt grows by exactly one line per run by measuring the file around a controlled run, and it is done when these three checks hold, copied here verbatim from the completion criteria: one run appends exactly one counter line, so a single run through the append path adds one line to counter.txt and not zero lines, two lines, or any other count; the appended line records the run identifier, so the line a run appends to counter.txt carries that run's identifier in its plain-text line and can be attributed to the run that appended it without consulting any other file; and the goal check passes for the alpha goal, so the goal checker run on the 001-alpha packet reports zero findings.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | This phase proves the append behavior and changes nothing else. The proof is one controlled run against counter.txt that records what the file held before the run and what it holds after, and shows the difference is exactly one appended line. The reasoning at length: the phase exists to establish that the append path appends exactly once per run before any broader fix claims the behavior, so the phase's own work is the measurement, and folding the interleaving fix into it would blur which change proved what; keeping the phase to the single-run proof also keeps its result a plain before-and-after count that answers the criterion without interpretation. |
| D2 | The run identifier written on the line comes from the run's own record and is written as plain text inside the line. The explanation at length: the criterion asks that the appended line record the run identifier, so the phase must fix where that identifier comes from at append time; taking it from the run's own record keeps the line self-describing, because the file alone then shows which run appended which line, and plain-text wording keeps the line consistent with the parent's frozen line format, which outranks anything local to this phase. |
| D3 | The evidence for this phase is the file state around the run, captured as the line count before, the line count after and the text of the appended line. The argument at length: a criterion answered by a count or a named artifact is checkable without opening another file, so the phase records those two counts and the line text as its observable result instead of a narrative report, and a later evaluator can re-derive every check from that trio alone. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] one run appends exactly one counter line, so a single run through the append path adds one line to counter.txt and not zero lines, two lines, or any other count
- [ ] the appended line records the run identifier, so the line a run appends to counter.txt carries that run's identifier in its plain-text line and can be attributed to the run that appended it without consulting any other file
- [ ] the goal check passes for the alpha goal, so the goal checker run on the 001-alpha packet reports zero findings
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
| Child goal authored | Done | goal.md rendered from goal-phase-child-template.md |

### Deviations and findings

| Item | Note |
|------|------|
<!-- /ANCHOR:log -->
