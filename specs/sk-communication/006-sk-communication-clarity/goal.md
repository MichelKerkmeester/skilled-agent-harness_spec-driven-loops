---
title: "Goal: land every open phase of the communication clarity program"
description: "The binding goal for the whole packet. Every child inherits these rules; where a child disagrees with this file, this file wins."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "communication clarity goal"
  - "implement remaining phases"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-communication/006-sk-communication-clarity"
    last_updated_at: "2026-09-14T06:10:00Z"
    last_updated_by: "claude-conductor"
    recent_action: "Research and decisions complete; AGENTS.md and the rule router aligned under packet sk-doc/055; goal set for the build phases"
    next_safe_action: "Phase 003: split repo-rules/communication.md, add the router row, record both baselines"
    blockers: []
    key_files:
      - "specs/sk-communication/006-sk-communication-clarity/002-synthesis-and-decisions/decision-record.md"
      - "specs/sk-communication/006-sk-communication-clarity/001-research-communication-context/research/research.md"
      - "specs/sk-communication/006-sk-communication-clarity/004-sk-communication-upgrade/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-006-sk-communication-clarity"
      parent_session_id: null
    completion_pct: 25
    open_questions: []
    answered_questions: []
---
# Goal: land every open phase of the communication clarity program

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE. Keep it short: the runtime goal surfaces cap what they hold.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Every adopted candidate from the three communication sources lives in exactly one owning surface, the reply-shape rule is split so the router reaches both halves, the wording standard is a base plus a supplement, the projection engine sends that standard as its provider instruction, and a harness with a baseline shows the rules changed what replies do.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The nine ADRs in `002-synthesis-and-decisions/decision-record.md` bind as written. No ADR is reopened during a build phase |
| D2 | Execution order is the parent spec's execution column: 003, then 006 and 008 in parallel, then 007, then 004, then 009, then 005 last |
| D3 | Implementation runs on GLM-5.3-Flash at max thinking through cli-pi and the LLM gateway. Every brief is one phase or smaller, names its files, freezes its scope and fits twelve tool calls |
| D4 | Leaves never dispatch again. The conductor verifies every return against the repository before it counts |
| D5 | The wording standard has one home. No detector set, no private rubric, enters the engine |
| D6 | The AGENTS.md two-clause floor in section 8 stays. No new root-doc clause |
| D7 | Every rule edit passes `check-repo-rules.cjs` at 9/9 and every packet edit passes strict validation with an explicit `RESULT: PASSED` |
| D8 | The colon-clause ban stays rejected, the word ban binds reply prose only, the unconfirmed-cause qualifier is adopted |
| D9 | Comment hygiene is a hard block. No packet id, phase number or ADR id enters a code comment |
| D10 | The baseline is captured before phases 003 through 009 change anything, or phase 005 makes no regression claim |

### Operator copy

The operator holds this directive as the session objective. Whenever anything above the log changes, resend this file in chat.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child spec, plan and tasks before working a phase.** Each binds as if written here.

| Phase | Documents |
|-------|-----------|
| 003-root-doc-and-repo-rules | `003-root-doc-and-repo-rules/` |
| 006-reply-shape-rules | `006-reply-shape-rules/` |
| 008-decision-and-handoff-rules | `008-decision-and-handoff-rules/` |
| 007-wording-standard-restructure | `007-wording-standard-restructure/` |
| 004-sk-communication-upgrade | `004-sk-communication-upgrade/` |
| 009-adjacent-surface-rules | `009-adjacent-surface-rules/` |
| 005-verification-and-rollout | `005-verification-and-rollout/` |

**Precedence.** Decisions outrank child detail; child detail outranks any summary. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] Phase 002's allocation table is written and every one of the 29 candidates has a verdict and, if adopted, one owning surface
- [ ] `repo-rules/communication.md` is split, the router names both halves, the checker passes 9/9 and both baselines are recorded
- [ ] The 10 reply-shape candidates and the 5 decision, handback and evidence candidates are in their rule files
- [ ] The wording standard is a base plus a supplement, every consumer resolves and the skill's exclusion list is one row shorter
- [ ] The engine sends the standard as its instruction, the duplicated constant is one declaration, the validator stamps no marker for a check that did not run, and the package gate passes
- [ ] The two adjacent-surface candidates are placed
- [ ] The harness runs with its baseline and negative control and the release gate names what it cannot measure
- [ ] Packet sk-doc/055's implementation summary is written and its status reads Complete
- [ ] From the final state: `validate.sh --recursive --strict` reports `RESULT: PASSED` for every folder under this packet
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

### Progress

| Item | State | Evidence |
|------|-------|----------|
| 001 research, 10 iterations | Done | `001-research-communication-context/research/research.md`, 29 candidates, 4 conflicts |
| 004 engine research, 5 iterations | Done | `004-sk-communication-upgrade/research/research.md`, 4 edits and 5 decisions |
| 002 decisions | Done | Nine ADRs recorded, allocation table pending |
| AGENTS.md and router alignment | Done | Packet sk-doc/055, checker 9/9, strict validate PASSED |
| 003 through 009 build | Pending | This goal |
<!-- /ANCHOR:log -->
