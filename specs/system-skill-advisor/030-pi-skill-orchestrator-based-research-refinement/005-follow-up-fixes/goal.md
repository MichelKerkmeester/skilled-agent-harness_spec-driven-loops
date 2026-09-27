---
title: "Goal: Follow-up Fixes"
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
    packet_pointer: "system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/005-follow-up-fixes"
    last_updated_at: "2026-09-26T20:04:10Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "None. The phase is complete, so rerun the criteria only if it reopens"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-26-030-goal-authoring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Follow-up Fixes

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Fix four limitations earlier phases recorded at their source, so a finished fan-out review closes as complete and a Pi dispatch can leave `edit_lines` enabled.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Both deep-review workflows require the root dashboard only when the run has no lineage state logs. |
| D2 | `edit_lines` never accepts a count one short. It refuses with a message that names the final empty line. |
| D3 | `deduplicateTransforms` stays opt-in. |
| D4 | The review step still reads only the root state log. That gap is recorded, not changed. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] A YAML control test with a lineage review state log and no root dashboard records `synthesis_complete`, and the same test without lineage logs records `synthesis_incomplete` naming the dashboard
- [ ] For a file ending in a newline, an `edit_lines` claim one line short returns a refusal that names the final empty line and does not say lines were inserted or removed, while any other mismatch keeps the old message
- [ ] The existing moved-line test passes unchanged, and `edit_lines` accepts no count other than the file's own
- [ ] With `deduplicateTransforms` and lifecycle dedup both on, two transforms for one message deliver one block, and a transform for the next message delivers the head alone
- [ ] The same-message suppression test passes with lifecycle dedup on, while the distinct-message, flag-off and unresolvable-identity tests keep lifecycle dedup off
- [ ] `check-contract-drift.cjs` prints OK after the review contract is regenerated
- [ ] The Gate 1 lookup for "pi skill orchestrator research" returns this packet, and the rebuilt trigger-index manifest lists no path that `git ls-files` omits
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
| Phase status | Done | `spec.md` metadata reads Complete, and `implementation-summary.md` holds the evidence |

### Deviations and findings

| Item | Note |
|------|------|
| Source of criteria | The phase is Level 1 and has no `acceptance-criteria.md`, so the criteria come from the Acceptance Criteria column of its `spec.md` requirements table, as the operator approved |
| Criteria left unticked | This goal was authored after the phase closed. The authoring pass did not rerun the checks, so it ticks none |
<!-- /ANCHOR:log -->
