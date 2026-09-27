---
title: "Goal: Fix Concurrent Appends to counter.txt"
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
    packet_pointer: "specs/demo-phase"
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
# Goal: Fix Concurrent Appends to counter.txt

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** This packet exists to fix concurrent appends to counter.txt so that every run appends exactly one plain-text counter line and concurrent runs never duplicate or lose lines, and it is done when these five checks hold, copied here verbatim from the completion criteria: counter.txt grows by exactly one line per run, so after one run finishes the file holds exactly one more line than before it began and no run adds zero or two or more lines; when a second run starts and finishes while an earlier run is still executing, its line lands in counter.txt after the line the earlier run appended, never before it or between earlier existing lines; no existing line is rewritten or removed, so every line counter.txt held before the first run is still present after the last run, with identical text in its original relative position; the append order in counter.txt matches the run start order, so the run that started first has its appended line above the line of the run that started later; and the goal checker run on the demo-phase packet reports zero findings.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Counter lines are plain text and append-only. Every counter line is one line of plain text in counter.txt, terminated by a single newline, and no code path ever seeks back into the file to rewrite, truncate or delete bytes an earlier run already wrote. |
| D2 | The alpha phase carries the proof before anything else counts. Where this directive's restatement differs from `001-alpha/goal.md`, the child goal governs and the conflict is named rather than resolved silently. |
| D3 | The run identifier is recorded on the line itself. Each appended line carries the identifier of the run that appended it, in plain text. |
| D4 | Order is judged by run start order, never by finish order or by wall-clock write time. Two runs that overlap are ordered by when they started, and the file must show the earlier starter's line first. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-alpha | `001-alpha/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] counter.txt grows by exactly one line per run, so after one run finishes the file holds exactly one more line than before it began and no run adds zero or two or more lines
- [ ] when a second run starts and finishes while an earlier run is still executing, its line lands in counter.txt after the line the earlier run appended, never before it or between earlier existing lines
- [ ] no existing line is rewritten or removed, so every line counter.txt held before the first run is still present after the last run, with identical text in its original relative position
- [ ] the append order in counter.txt matches the run start order, so the run that started first has its appended line above the line of the run that started later
- [ ] the goal checker run on the demo-phase packet reports zero findings
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

### Deviations and findings

| Item | Note |
|------|------|
<!-- /ANCHOR:log -->
