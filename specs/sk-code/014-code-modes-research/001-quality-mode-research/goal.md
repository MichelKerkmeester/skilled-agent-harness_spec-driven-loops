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
    recent_action: "Amended the criteria to fifteen iterations and the ADR-003 boundary"
    next_safe_action: "None. The phase is closed"
    blockers: []
    key_files:
      - "spec.md"
      - "acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-25-skcode-014"
      parent_session_id: null
    completion_pct: 100
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
| D4 | Parent D3 and D4 are superseded by ADR-002 in this phase: fifteen iterations, 1 to 10 on Luna via cli-codex, then a five-iteration second-model pass on DeepSeek V4.1 Flash Max via cli-devin. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `research/deep-research-state.jsonl` holds 15 records of type iteration, and its latest synthesis_complete record carries a stopReason and totalIterations 15.
- [x] `research/iterations/iteration-001.md` through `iteration-015.md` all exist.
- [x] `research/research.md` holds a Ranked Recommendations section of at least eight rows that each carry OBSERVED, DERIVED or INFERRED.
- [x] Three source tags opened by the orchestrator resolve to the quoted text.
- [x] `git diff --stat f8671e07c2 ee8c7e6f24 -- .skilled/skills/sk-code/sk-code-quality .skilled/skills/sk-code/sk-code-review` prints nothing.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/014-code-modes-research/001-quality-mode-research --strict` prints `RESULT: PASSED`.
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
| Criteria re-run | Done | 2026-10-25: `grep -c` printed 15 iteration records, the latest `synthesis_complete` reads `maxIterationsReached` and 15, 15 iteration files exist, every quoted source tag into the two mode folders resolves at `ee8c7e6f24`, the ADR-003 diff printed nothing, and strict validation printed `RESULT: PASSED` |
| Phase documents written | Done | Created 2026-10-25, status Planned |
| Iterations 1 to 10 | Done | `research/iterations/iteration-001.md` to `iteration-010.md`, 10 iteration records in the state log, each verified by `verify-iteration.cjs` on the first dispatch |
| Synthesis | Done | `research/research.md`, 14 ranked rows, `synthesis_complete` with `stopReason` maxIterationsReached and `totalIterations` 10 |
| Second-model pass | Done | ADR-002: iterations 11 to 15 on cli-devin `deepseek-v4-1-flash-max`, 15 iteration records, a second `synthesis_complete` with `totalIterations` 15. Iteration 13 verified on the workflow's one redispatch, the rest on the first |
| Refreshed synthesis | Done | `research/research.md` sections 6a and 6b: 12 rows confirmed, 2 refuted in part, refreshed top five led by naming the CI surface |
| Closure | Done | AC-011 closed on the operator's ruling of 2026-10-25, recorded in ADR-001: the narrowed check may skip a line that only states the sibling folder was not read. The amended check prints nothing |

### Deviations and findings

| Item | Note |
|------|------|
| Executor | All ten iterations ran on Luna. DeepSeek through llmgateway was refused three times with `402 daily pacing allowance`, so the even slots ran on Luna under the three-failure rule. |
| Dispatch route | The orchestrating session interpreted `deep-research-auto.yaml` and picked its `if_cli_codex` branch per iteration, because the workflow fixes one executor per lineage. |
| Staging step skipped | `step_stage_artifact_dir` runs `git add`, which the operator's brief forbids. |
| Boundary check narrowed | Per the operator, AC-009 compares only `sk-code-quality/` and `sk-code-review/` with the baseline, recorded as ADR-003. Both are unchanged over the research commits. |
| Containment copies | The runtime's write-containment guard copied the concurrent sibling run's files into `research/containment/`. They were not read, and they were deleted with the operator's approval before the second-model pass. |
| Completion criteria amended | 2026-10-25, after the deep review: criterion 1 now reads 15 iteration records and a latest `synthesis_complete` with `totalIterations` 15, criterion 2 reads `iteration-001.md` through `iteration-015.md`, and criterion 5 names the ADR-003 diff over `f8671e07c2..ee8c7e6f24`. The objective and D1 to D3 are left as written, and a new D4 marks the parent's D3 and D4 superseded by ADR-002 |
| Reopen route | The workflow halts on a completed session and its `completed-continue` branch is not wired, so the config's `status` and `maxIterations` were edited to take the `resume` branch. ADR-002 records it. |
| Stray dispatch files | Iteration 13's first dispatch left a ledger under `research/deltas/`, and iteration 14 left `research/.iter-014-event.json`. Both were deleted with the operator's approval. One gitignored watermark file remains under `research/deltas/`. |
<!-- /ANCHOR:log -->
