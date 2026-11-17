---
title: "Goal: Completed-Run Extension (--extend=N)"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "completed run extension goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/001-completed-run-extension"
    last_updated_at: "2026-11-17T14:35:15Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-completed-run-extension"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Completed-Run Extension (--extend=N)

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Let an operator add N more iterations to a completed deep-research or deep-review run in the same session and generation, without `--restart`.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The flag is `--extend=N` (optional `--extend-minutes=M`) and it maps to the reserved lineage mode `completed-continue`; no separate vocabulary. |
| D2 | The extension is recorded as a new ledger stem per loop, `run_extended`, appended through the gateway. |
| D3 | The config is mutated in place inside the loop lock, before classification; `createdAt` is never re-stamped. |
| D4 | `maxIterations = continuedFromRun + N` and `maxDurationMinutes = max(prior, elapsedMinutesAtExtension) + M`, M defaulting to the prior budget. |
| D5 | Both loops ship together; `fork` stays deferred. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] Every row in `acceptance-criteria.md` is `Met`, `Waived` or `Superseded`.
- [ ] `npx vitest run` in the deep-loop runtime shows no new failure against the recorded baseline, and both guard scripts exit 0.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh` on this folder with `--strict` prints `RESULT: PASSED`.
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
| Phase spec authored | Done | `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md` written from `../research/research.md` §19 and §20 |
| Implementation | Pending | Not started |
| Session save | Done | operator decisions written to decision-record.md |

### Deviations and findings

| Item | Note |
|------|------|
| Stem-producer table disagreement | The producer table marks `deep_research.run_resumed` as having no writer, while `on_resume` appends a `resumed` row that the upcast maps to that stem (verification log V3). Check it when T005 edits the table. |
| Open questions | Four open questions with recommended defaults are in `spec.md` §10; T003 records the operator's answers. |
<!-- /ANCHOR:log -->
