---
title: "Goal: sk-code Quality and Review Modes Research"
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
    packet_pointer: "sk-code/014-code-modes-research"
    last_updated_at: "2026-10-25T08:50:00Z"
    last_updated_by: "claude-sonnet-5-5"
    recent_action: "Marked D3 and D4 superseded by ADR-002 and amended the criteria"
    next_safe_action: "None. The packet is closed"
    blockers: []
    key_files:
      - "spec.md"
      - "goal.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-25-skcode-014"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Executor alternation unit: moot. cli-pi was refused, so the second model ran as iterations 11 to 15 per ADR-002."
---
# Goal: sk-code Quality and Review Modes Research

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Produce, from two independent ten-iteration research runs, ranked and evidence-labelled recommendations that make sk-code-quality and sk-code-review more repo-agnostic, more useful and better integrated with their sibling modes and with modes an outside user adds to the hub, without changing any hub file.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Findings only. No file under `.skilled/` changes. Writes land under each child's `research/` folder. |
| D2 | The subjects are sk-code-quality (phase 1) and sk-code-review (phase 2). The other two modes are read as siblings only. |
| D3 | Each run holds exactly ten iterations, one angle each. Early convergence cannot end a run before iteration ten. |
| D4 | Luna max fast via cli-codex and DeepSeek flash max 1017 via cli-pi through llmgateway alternate by iteration, odd on Luna and even on DeepSeek. |
| D5 | Every finding carries OBSERVED, DERIVED or INFERRED and a source tag with a path and line. Nothing is fetched. |
| D6 | Neither run reads the other child's `research/` folder before its own synthesis exists. |
| D7 | D3 and D4 are superseded by ADR-002 in each research child: fifteen iterations per run, 1 to 10 on Luna via cli-codex and 11 to 15 on DeepSeek V4.1 Flash Max via cli-devin. D1 binds the two research phases, checked as ADR-003 sets. Phase 3 then applies the deep review's fixes to the two mode folders. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-quality-mode-research | `001-quality-mode-research/goal.md` |
| 002-review-mode-research | `002-review-mode-research/goal.md` |
| 003-review-remediation | `003-review-remediation/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `research/research.md` exists in both research phase folders and both hold a Ranked Recommendations section of at least eight rows that carry OBSERVED, DERIVED or INFERRED.
- [x] `research/deep-research-state.jsonl` in both research phase folders holds 15 records of type iteration, and its latest synthesis_complete record carries a stopReason and totalIterations 15.
- [x] `git diff --stat f8671e07c2 ee8c7e6f24 -- .skilled/skills/sk-code/sk-code-quality .skilled/skills/sk-code/sk-code-review` prints nothing.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/014-code-modes-research --recursive --strict` prints `RESULT: PASSED`.
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
| Packet scaffolded and documents written | Done | Created 2026-10-25 with `create.sh --phase --level 2 --with-goal`, strict validation result recorded in the first close-out |
| Baseline | Done | `f8671e07c2a7ae00cda7ba2a2d30b192d5928606`, from `git rev-parse HEAD` on 2026-10-25 before the 002 run's first iteration |
| 001 quality run | Done | Fifteen iterations: 1 to 10 on Luna after cli-pi DeepSeek was refused three times with 402, then 11 to 15 on cli-devin `deepseek-v4-1-flash-max` per ADR-002. Refreshed `research/research.md` of 14 rows, 12 confirmed by the second model and 2 refuted in part. AC-011 narrowed per ADR-001 still prints 1, an attestation line in `iteration-011.md`. Closed on the operator's ruling that the narrowed check may skip a line that only states the sibling folder was not read, recorded in ADR-001 |
| Criteria re-run | Done | 2026-10-25 after the amendment: both state logs hold 15 iteration records and a latest `synthesis_complete` with `stopReason` maxIterationsReached and `totalIterations` 15. Both iteration folders list `iteration-001.md` to `iteration-015.md`. The ADR-003 diff printed nothing. Recursive strict validation printed `RESULT: PASSED`. The awk label count printed 47 and 26 |
| 002 review run | Done | Fifteen iterations: 1 to 10 on Luna, then 11 to 15 on cli-devin `deepseek-v4-1-flash-max` per ADR-002, run after 001 finished. Refreshed `research/research.md` of 12 rows, 9 confirmed, 1 refuted in part, 2 untested in their decisive claim. AC-011 narrowed per ADR-001 still prints 1 each for attestation lines in `iteration-013.md` and `iteration-014.md`. Closed on the operator's ruling that the narrowed check may skip a line that only states the sibling folder was not read, recorded in ADR-001 |

### Deviations and findings

| Item | Note |
|------|------|
| Executor alternation unit | D4 assumed per iteration. cli-pi was refused, so the question became moot, and D7 records D4 as superseded by ADR-002. |
| Second-model pass | The operator ruled on 2026-10-25 for five more iterations per child on DeepSeek flash through cli-devin. Recorded as ADR-002 in each child. D7 marks D3 and D4 superseded, and criteria 2 and 3 were amended to fifteen and to the ADR-003 boundary. |
| AC-011 | The operator ruled on 2026-10-25 to delete the containment copies and narrow the check to the research content, recorded as ADR-001 in each child. |
| Boundary check | The operator scoped the `.skilled` check to the two mode folders, recorded as ADR-003 in each child. `f8671e07c2` is the Baseline and `ee8c7e6f24` the commit that closed the research. |
| Deep review | `review/review-report.md` returned CONDITIONAL with 2 P1 and 14 P2 findings. Phase 3 applies them. |
<!-- /ANCHOR:log -->
