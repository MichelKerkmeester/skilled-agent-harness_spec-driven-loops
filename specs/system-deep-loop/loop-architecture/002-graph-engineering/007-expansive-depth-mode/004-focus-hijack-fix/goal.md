---
title: "Goal: Stop free text hijacking Next Focus in research and review"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "focus hijack fix goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/004-focus-hijack-fix"
    last_updated_at: "2026-11-17T17:15:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-11-17-expansive-depth-goals"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Stop free text hijacking Next Focus in research and review

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Next Focus on deep-research and deep-review comes from an open, unanswered question or an uncovered dimension, and the leaf's recommendation is read at one stated place in each focus chain.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Question resolution stays literal equality of normalized text; no semantic matching. |
| D2 | The research leaf `nextFocus` is read after the pivot focus and blocked-stop recovery, only while at least one machine question is open. |
| D3 | Pivot focus and blocked-stop recovery keep their precedence on both loops. |
| D4 | The carried-forward filter runs in the shared helper `buildCarriedForwardOpenQuestions`: an item is kept only when it ends in a question mark or equals a registry question, and is dropped when it equals an answered or resolved question. |
| D5 | The review change covers the strategy and dashboard Next Focus text only; the dispatched dimension stays `{next_dimension}` from the strategy's remaining-dimension queue. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [ ] With one open machine question, two `deep-research-reduce-state` cases, one listing a resolved question's text and one listing a status sentence with no question mark under a later iteration's `## Questions Remaining`, resolve Next Focus to something other than that text, and the registry `carriedForwardOpenQuestions` list, its metric and strategy section 11A omit it.
- [ ] A `deep-research-reduce-state` case with one open machine question returns the latest iteration's non-empty `## Recommended Next Focus` as Next Focus, and does not return it when it equals a resolved question.
- [ ] A `deep-review-state-reducer` case with `correctness` uncovered and a free-text leaf `nextFocus` that names no dimension resolves both the strategy `11. NEXT FOCUS` section and the dashboard Next Focus to a value naming `correctness`.
- [ ] A `continuity-thread` case with zero open machine questions and a leaf recommendation returns the terminal sentinel.
- [ ] `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/deep-research-reduce-state.vitest.ts tests/unit/continuity-thread.vitest.ts tests/unit/deep-review-state-reducer.vitest.ts` exits 0 with no existing case removed.
- [ ] Through `/create:manual-testing-playbook`, `rg -il "status sentence" .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook` and `rg -il "first uncovered" .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook` each list a scenario; both print nothing before this phase.
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
| Phase spec authored | Done | `spec.md`, `plan.md`, `tasks.md` written 2026-11-17 |
| Implementation | Pending | Not started |

### Deviations and findings

| Item | Note |
|------|------|
| Goal source | This phase has no `acceptance-criteria.md`; the criteria come from the REQ table in `spec.md` §4, as the authoring brief directed. |
| Open questions | The three questions in `spec.md` §7 were settled in planning on 2026-11-17 (decisions D2, D4 and the REQ-003 naming rule); none is open. |
| Plan review | The 2026-11-17 plan review findings were applied: question-shape fixture, filter call site and consumers, review claim narrowed to strategy and dashboard text, build after 005, runnable test commands, and this phase's own playbook scenarios. |
<!-- /ANCHOR:log -->
