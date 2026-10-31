---
title: "Goal: Phase 12: goal-send-and-dedupe"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "goal send rule goal"
  - "goal template cut"
  - "goal nesting pointers"
  - "phase 012 goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/060-create-goal-mode/012-goal-send-and-dedupe"
    last_updated_at: "2026-09-26T16:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Executed the phase and met every criterion"
    next_safe_action: "Commit the phase, then regenerate the trigger index from committed content"
    blockers: []
    key_files:
      - "scratch/scope-analysis.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "75aab0e6-dcc7-401b-9d10-f48248374023"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 12: goal-send-and-dedupe

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give the goal chat-send rule one home in sk-create-goal, strip author instructions from the goal templates, point system-spec-kit's goal nesting logic to `sk-create-goal`, close every deep-review finding at its source, and prove the goal surface works on every CLI runtime.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | `budget-and-handoff.md` section 2 holds the one budget boundary, section 3 the one full cut order and section 4 the one full send rule |
| D2 | The 4,000 limit stays on the durable slice, and nothing caps the chat slice separately |
| D3 | Template author instructions leave at the source. The decisions line and the Read, Precedence and Stop rules stay |
| D4 | No goal file outside this packet is rewritten |
| D5 | The operator's two asks are the system-spec-kit amendment the parent's D4 expects |
| D6 | No fix changes another session's files: packet 030, the cli-cursor docs, or a generated copy built from their uncommitted sources |
| D7 | Opus-high agents lead the remaining work and may dispatch MiMo v2.6 Pro high, GPT-6 Luna xhigh and Grok 4.7 as CLI subagents. The orchestrator re-runs every check they claim |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `check-goal.cjs` passes every check on the parent and on this phase, and the parent reports `packet_budget=ok` at 3,000 durable characters or fewer
- [ ] The review report's remediation table marks all 21 deep-review findings Fixed, R3-P2-002 included
- [ ] Every goal test suite reports `fail 0`: the shared hooks and CLI, the ten OpenCode goal suites, the Pi, Cursor and Devin suites and the Hermes `repo-guards` tests
- [ ] The goal-hook scenarios for OpenCode, Pi, Cursor, Devin and Hermes each pass a live run, with verdict and evidence recorded
- [ ] All eight sk-create-goal playbook scenarios pass on MiMo v2.6 Pro, recorded in a new dated benchmark run folder
- [ ] `validate_document.py` reports 0 issues on every changed doc, the playbook package validator reports 0 violations and the sk-code drift guards exit 0
- [ ] `validate.sh --recursive --strict` on the parent prints `RESULT: PASSED`
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
| Two read-only surveys | Done | `scratch/survey-chat-slice.md`, `scratch/survey-duplicates.md` |
| Scope analysis (Opus 5.5, xhigh, read-only) | Done | `scratch/scope-analysis.md`: 26-row change list, 13 requirements, 18 criteria |
| Orchestrator spot-check | Done | One citation per decision area re-opened and every baseline re-run (V3 12, V7 `3156 2823`, V8 11, V9 0, V10 9, V13 2, parent 3,950): all matched |
| Operator review | Done | The operator set the parent goal and said "okay work on goal" |
| Canonical rule and templates | Done | Section 4 lists the five things a sent goal never contains. Templates hold no author instructions, and the phase-parent blank measures 1,624 and 1,218 |
| Pointers | Done | 14 system-spec-kit and speckit files name `sk-create-goal` or `/create:goal`. No playbook cut-order citation remains |
| Completion criteria | Met | 1: 4 of 4, 2,944 ok. 2: 0 matches, 15 of 15. 3: 0. 4: 4, 4 and 1. 5: 14. 6: 21 of 21. 7: 13 folders `RESULT: PASSED` |
| Scope widened after the deep review | Open | The operator asked for every finding closed, every CLI runtime proven and opus-high agents with MiMo, Luna and Grok subagents |

### Deviations and findings

| Item | Note |
|------|------|
| Surveys corrected by the analyst | Only one reference cited the playbook for the cut order, and the surveys missed the snapshot, the reminder test, the Hermes copy and the trigger index |
| Two hypotheses confirmed | The advisor never reads system-spec-kit's intent keywords. An unfilled `--level phase-parent --with-goal` parent fails the binding check until `/create:goal` fills it |
| Open question 1 defaulted | The operator did not choose, so older parents are cut at their next amendment |
| Follow-up gaps closed | After the operator asked, the injection wording, the README pointers, the validator hints, the implement line, two command names, an overview section and an OpenCode test path were fixed. The trigger index was regenerated last |
| No system-spec-kit changelog entry | Its changelog is one narrative file per release |
| Chat slices not pasted | The operator asked this session to stop sending goals |
| Cut to the new template | This goal and the parent dropped the old fixed text in the same pass |
<!-- /ANCHOR:log -->
