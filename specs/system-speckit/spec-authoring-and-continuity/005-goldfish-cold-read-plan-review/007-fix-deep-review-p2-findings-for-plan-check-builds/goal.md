---
title: "Goal: Phase 7: fix-deep-review-p2-findings-for-plan-check-builds"
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
    packet_pointer: "system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/007-fix-deep-review-p2-findings-for-plan-check-builds"
    last_updated_at: "2026-11-12T04:35:20Z"
    last_updated_by: "codex"
    recent_action: "Closed Phase 7 after all tasks and acceptance criteria were met"
    next_safe_action: "Use the parent packet for follow-up work outside this completed phase."
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "acceptance-criteria.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "01a1cdf9-cf18-7621-882f-b2417d35e2eb"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 7: fix-deep-review-p2-findings-for-plan-check-builds

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Close this phase by ensuring that `fanout-run.cjs` derives refusal from `ACTIVE_FANOUT_LOOP_TYPES`, allows only Boolean `true`, string `true` or string `1` and refuses other supplied values before side effects, direct deep-review `:auto` input in `deep-review-auto.yaml` passes `configDir` through `validateClaudeConfigDir` before assigning `CLAUDE_CONFIG_DIR`, `research.md`, `review.md`, `deep-research-presentation.txt` and `deep-review-presentation.txt` name `config.maxIterations` and state executor routing plus refusal/opt-in, `deep-research.contract.markdown` matches `research.md` and `deep-research-presentation.txt`, while `deep-review.contract.markdown` matches `review.md` and `deep-review-presentation.txt`, packet status records agree with verified evidence and both scaffold branches print one shared sentence unchanged, and strict packet validation prints `RESULT: PASSED`.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Treat SL-203 as safe and make no source edit for lineage-label containment. |
| D2 | Treat direct review `:auto` `configDir` as unsafe and reuse `validateClaudeConfigDir`. |
| D3 | Keep refusal wording unchanged and regenerate both compiled contracts from maintained sources. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `fanout-run.cjs` derives refusal from `ACTIVE_FANOUT_LOOP_TYPES`, allows only Boolean `true`, string `true` or string `1` and refuses other supplied values before side effects
- [x] direct deep-review `:auto` input in `deep-review-auto.yaml` passes `configDir` through `validateClaudeConfigDir` before assigning `CLAUDE_CONFIG_DIR`
- [x] `research.md`, `review.md`, `deep-research-presentation.txt` and `deep-review-presentation.txt` name `config.maxIterations` and state executor routing plus refusal/opt-in
- [x] `deep-research.contract.markdown` matches `research.md` and `deep-research-presentation.txt`, while `deep-review.contract.markdown` matches `review.md` and `deep-review-presentation.txt`
- [x] packet status records agree with verified evidence and both scaffold branches print one shared sentence unchanged
- [x] strict packet validation prints `RESULT: PASSED`

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
| Phase closeout | Done | The closeout count check printed 65 task/checklist rows, 0 unchecked or blocked rows and 5 Met acceptance rows (exit 0). |

### Deviations and findings

| Item | Note |
|------|------|
| Phase facts | The supplied facts file has no Phase 7 section, so the cited source lines were re-read directly. |
<!-- /ANCHOR:log -->
