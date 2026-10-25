---
title: "Goal: Phase 1: quality-mode-research"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "quality mode research goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/014-code-modes-research/001-quality-mode-research"
    last_updated_at: "2026-10-25T08:55:00Z"
    last_updated_by: "claude-sonnet-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files:
      - "spec.md"
      - "acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-25-skcode-014"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 1: quality-mode-research

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Produce ten iterations of evidence-labelled research on how to make sk-code-quality more repo-agnostic, more useful and better integrated with its sibling modes and with modes a user adds to the hub, ending in a ranked recommendation list.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The ten angles in `plan.md` run in order, one per iteration. The synthesis writes four sections: Repo-Agnostic Findings, Usefulness Findings, Integration Findings and Ranked Recommendations. |
| D2 | A ranked row carries rank, gain, evidence label, source tag, effort, risk and whether it is ready now or needs a decision. |
| D3 | The P0 floor, the missing Write and Task authority and the advisory-only envelope status are fixed inputs. A recommendation that needs one changed says so. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `research/deep-research-state.jsonl` holds 10 records of type iteration and one synthesis_complete record with a stopReason field.
- [ ] `research/iterations/iteration-001.md` through `iteration-010.md` all exist.
- [ ] `research/research.md` holds a Ranked Recommendations section of at least eight rows that each carry OBSERVED, DERIVED or INFERRED.
- [ ] Three source tags opened by the orchestrator resolve to the quoted text.
- [ ] `git diff --stat` from the sha logged as Baseline in the parent goal to HEAD prints no path under `.skilled/`.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/014-code-modes-research/001-quality-mode-research --strict` prints `RESULT: PASSED`.
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
| Phase documents written | Done | Created 2026-10-25, status Planned |
| Iterations 1 to 10 | Pending | Not launched |
| Synthesis | Pending | Not run |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | Nothing has run. |
<!-- /ANCHOR:log -->
