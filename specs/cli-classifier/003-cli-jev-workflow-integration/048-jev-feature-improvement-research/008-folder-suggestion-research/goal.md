---
title: "Goal: Research: improve the Jev spec-folder suggestion (022)"
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
    packet_pointer: "scaffold/008-folder-suggestion-research"
    last_updated_at: "2026-10-02T21:59:49Z"
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
# Goal: Research: improve the Jev spec-folder suggestion (022)

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Produce a ranked, evidence-cited list of ways to improve, refine and expand the Jev spec-folder suggestion (feature 022) from a DeepSeek and a Luna research lineage.

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
| Lineages run | Done | deepseek 5 iterations, luna 3; both `maxIterationsReached`; luna on its third attempt |
| Merge and synthesis | Done | `fanout-merge.cjs` exit 0, `synthesis_complete` recorded, `research/research.md` written |

### Deviations and findings

- Luna's first run hit the Codex usage limit. On the rerun, attempt 1 tripped the gateway's no-key-loss guard on the config row; the session rewrote that row to the projection's 5 keys (original saved in the scratchpad).
- Attempt 2 wrote its strategy file at the worktree root, then stopped itself for crossing its write boundary. The session moved that file to the scratchpad. Attempt 3 resumed from the ledger and completed all 3 iterations and its report.
- The wrapper script printed exit 127 after the fan-out finished, because it was edited while running; the fan-out itself completed.
- The first closeout failed its invariant (`count_only_state_findings_not_reconstructed`): DeepSeek's 40 delta findings used a `claim` field where the delta contract names `label`, so the merge read them as empty. The session copied each `claim` into `label` (originals saved in the scratchpad), re-merged to 53 findings and the closeout then recorded `synthesis_complete`. Two `synthesis_incomplete` events from the failed attempts stay in the merged ledger.

| Item | Note |
|------|------|
| None yet | |
<!-- /ANCHOR:log -->
