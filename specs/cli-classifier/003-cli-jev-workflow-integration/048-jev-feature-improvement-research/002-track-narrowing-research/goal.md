---
title: "Goal: Research: improve the Jev spec-track narrowing (017)"
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
    packet_pointer: "scaffold/002-track-narrowing-research"
    last_updated_at: "2026-10-02T21:59:43Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Research: improve the Jev spec-track narrowing (017)

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Produce a ranked, evidence-cited list of ways to improve, refine and expand the Jev spec-track narrowing (feature 017) from a DeepSeek and a Luna research lineage.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Research only. The loop writes inside this phase's `research/` folder and nowhere else |
| D2 | DeepSeek V4.1 Flash, thinking max, via cli-pi runs 5 iterations. GPT-6 Luna, reasoning max, fast tier, via cli-codex runs 3. Stop policy is max-iterations |
| D3 | Every recommendation cites file:line evidence or the 047 measurement |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `research/lineages/deepseek/deep-research-state.jsonl` holds 5 iteration records
- [x] `research/lineages/luna/deep-research-state.jsonl` holds 3 iteration records
- [x] `research/research.md` exists and ranks recommendations to improve, refine and expand the feature
- [x] `validate.sh --strict` prints `RESULT: PASSED` on this phase
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
| Phase opened | Done | Spec and goal authored 2026-10-03 |
| Lineages run | Done | deepseek 5 iterations, luna 3, both `maxIterationsReached` |
| Merge and synthesis | Done | `fanout-merge.cjs` exit 0, `synthesis_complete` recorded, `research/research.md` written |

### Deviations and findings

- Luna's lineage registry showed 5 open questions despite answers in its deltas. `fanout-merge.cjs` rebuilt the merged registry from the lineage state and deltas.

| Item | Note |
|------|------|
| None yet | |
<!-- /ANCHOR:log -->
