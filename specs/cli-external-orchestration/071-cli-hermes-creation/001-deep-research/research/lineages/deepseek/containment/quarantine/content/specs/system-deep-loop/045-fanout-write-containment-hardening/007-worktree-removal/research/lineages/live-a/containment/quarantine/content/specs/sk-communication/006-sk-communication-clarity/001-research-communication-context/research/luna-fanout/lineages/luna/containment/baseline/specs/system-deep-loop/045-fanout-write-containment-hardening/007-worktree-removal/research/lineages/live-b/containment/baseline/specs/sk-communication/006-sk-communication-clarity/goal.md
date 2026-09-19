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
    recent_action: "All criteria met, review remediated, acceptance closure nearly done"
    next_safe_action: "Operator commits; decides on the two rules with no measured effect"
    blockers: []
    key_files:
      - "specs/sk-communication/006-sk-communication-clarity/002-synthesis-and-decisions/decision-record.md"
      - "specs/sk-communication/006-sk-communication-clarity/001-research-communication-context/research/research.md"
      - "specs/sk-communication/006-sk-communication-clarity/004-sk-communication-upgrade/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-006-sk-communication-clarity"
      parent_session_id: null
    completion_pct: 100
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
| D1 | The nine ADRs in `002-synthesis-and-decisions/decision-record.md` bind as written |
| D2 | Order: 003, then 006 and 008 in parallel, then 007, then 004, then 009, then 005 last |
| D3 | GLM-5.3-Flash at max thinking through cli-pi and the LLM gateway. One phase or less per brief, files named, scope frozen, twelve tool calls |
| D4 | Leaves never dispatch again. The conductor verifies every return against the repository |
| D5 | The wording standard has one home. No detector set, no private rubric, enters the engine |
| D6 | The AGENTS.md two-clause floor in section 8 stays. No new root-doc clause |
| D7 | Every rule edit passes `check-repo-rules.cjs` at 9/9, every packet edit passes strict validation with `RESULT: PASSED` |
| D8 | The colon-clause ban stays rejected, the word ban binds reply prose only, the unconfirmed-cause qualifier is adopted |
| D9 | Comment hygiene is a hard block. No packet id, phase number or ADR id enters a code comment |
| D10 | The baseline precedes any change by phases 003 to 009, or phase 005 makes no regression claim |

### Operator copy

The operator holds this directive as the session objective. Whenever anything above the log changes, resend this file in chat.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child spec, plan and tasks before working a phase.**

| Phase | Documents |
|-------|-----------|
| 003-root-doc-and-repo-rules | `003-root-doc-and-repo-rules/` |
| 006-reply-shape-rules | `006-reply-shape-rules/` |
| 008-decision-and-handoff-rules | `008-decision-and-handoff-rules/` |
| 007-wording-standard-restructure | `007-wording-standard-restructure/` |
| 004-sk-communication-upgrade | `004-sk-communication-upgrade/` |
| 009-adjacent-surface-rules | `009-adjacent-surface-rules/` |
| 005-verification-and-rollout | `005-verification-and-rollout/` |

**Precedence.** Decisions outrank child detail, child detail outranks any summary. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] The allocation table gives all 29 candidates a verdict and each adopted one a single owner
- [x] `repo-rules/communication.md` is split, the router names both halves, checker 9/9, both baselines recorded
- [x] The 10 reply-shape candidates and the 5 decision, handback and evidence candidates are in their rule files
- [x] The wording standard is a base plus a supplement, every consumer resolves and the skill's exclusion list is one row shorter
- [x] The engine sends the standard as its instruction, one constant, no marker for a check that did not run, package gate passes
- [x] The two adjacent-surface candidates are placed
- [x] The harness runs with baseline and negative control, the release gate names what it cannot measure
- [x] Packet sk-doc/055's implementation summary is written and its status reads Complete
- [x] From the final state: `validate.sh --recursive --strict` reports `RESULT: PASSED` for every folder under this packet
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
| 002 allocation table | Done | `002-synthesis-and-decisions/allocation-table.md`, 29 rows, 25 adopted, 4 non-work, strict validate PASSED |
| 003 split | Done | `repo-rules/prose-mechanics.md` created, checker 9/9, both baselines in `003-root-doc-and-repo-rules/scratch/`, strict validate PASSED |
| 008 decision, handback and evidence | Done | 5 candidates in three rule files, checker 9/9, qualifier per ADR-003, strict validate PASSED |
| 006 reply-shape | Done | 10 candidates across both halves, communication.md 230 lines, prose-mechanics.md 140, checker 9/9, strict validate PASSED |
| 007 wording standard | Done | Base 449 lines plus supplement 153, scanner parses the base, one exclusion left, 6 candidates landed, strict validate PASSED |
| 004 engine, part one | Done | One instruction resolved lazily from the standard's one home, guard-scoped markers, claim-coverage check, no-op record, gate 82 files 455 tests exit 0. The leaf's packed copy of the standard was removed by the conductor |
| 004 documents, part two | Done | Both rewrite commands declare the pass, mirrors identical, skill 1.3.0.0 with one exclusion row, changelog and catalog, strict validate PASSED |
| 009 adjacent surfaces | Done | Present-state comment rule in the code checklist, example-and-repair line in the rule template, checker 9/9, strict validate PASSED |
| Deep review, 5 iterations, Sonnet 5 xhigh | Done | CONDITIONAL, 0 P0, 2 P1, 4 P2, report under `review/program-review/`, F005 refuted on the files |
| 010 review remediation | Done | Six findings closed, direct claim-coverage tests added, gate 83 files 459 tests, strict validate PASSED |
| 001 acceptance | Open row | AC-004 Unmet: the GPT-5.6 LUNA lineage was never dispatched, operator runs or waives it |
| 005 harness and measurement | Done | Harness built, fourteen replies generated by the conductor, weighted mean 0.60 to 0.74, control held, two rules with no measured effect, gate fails on them by design |
| 007, 004, 009, 005 | Pending | Briefs composed, dispatch in the D2 order |
<!-- /ANCHOR:log -->
