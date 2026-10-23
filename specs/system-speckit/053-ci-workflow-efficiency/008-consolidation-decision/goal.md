---
title: "Goal: Phase 8: consolidation-decision"
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
    packet_pointer: "system-speckit/053-ci-workflow-efficiency/008-consolidation-decision"
    last_updated_at: "2026-10-23T14:25:00Z"
    last_updated_by: "markdown-planner"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers:
      - "D8 is unanswered; the default is no merge"
      - "002 to 007 have not landed"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-23-053-008-consolidation-decision"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 8: consolidation-decision

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Re-measure the nine always-run workflows' 13 jobs after phases 002 to 007, record the before and after numbers and the recomputed merge bound in one decision record, and merge nothing unless the operator answers D8 yes.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| G1 | The candidate set is the eight always-run FRESHNESS workflows, 12 jobs; `message-contract.yml` and `naming-standard-guard.yml` stay separate files in their own groups. |
| G2 | Every number comes from `scratch/consolidation-cost.json`, which `--check` re-derives from the saved JSON; no figure is copied from a plan document. |
| G3 | No workflow file changes unless `scratch/d8-answer.md` holds `D8=yes` (recommended default pending operator D8), and then the merge is one commit after the probe, separate from the decision-record commit. |
| G4 | The measured decision lives in `scratch/consolidation-decision.md`; `decision-record.md` holds this phase's design ADRs. |

The operator decision these choices defer to is D8 in `plan.md`; the G-numbers above are local to this goal.

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/scratch/consolidation-cost.mjs --check` exits `0` and prints `check: ok`
- [ ] `specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/scratch/consolidation-baseline.md` holds `26` lines that start with `| ` and its 13 job-second cells sum to `1065`
- [ ] `specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/scratch/consolidation-decision.md` holds `6` lines matching `^## (Context|Candidates|Measurements|Signal cost|Recommendation|D8 answer)$` and one line matching `^D8: (no|yes)$`
- [ ] `specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/scratch/d8-answer.md` holds exactly `1` line matching `^D8=(no|yes)$`
- [ ] `bash .github/scripts/check-gate-inputs.sh` prints `RESULT: PASSED`
- [ ] `git diff --stat "$(cat specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/scratch/phase-start-sha.txt)"..HEAD -- .github/workflows` prints nothing under `D8: no`, or `.github/workflows/always-run-guards.yml` parses with exactly `1` job under `D8: yes`
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
| Plan authored | Done | `spec.md`, `plan.md`, `tasks.md` T001 to T025, `acceptance-criteria.md` AC-001 to AC-009, `decision-record.md` ADR-001 to ADR-006 |
| Measurement | Pending | No file under `scratch/` exists yet |
| Decision D8 | Pending | `scratch/d8-answer.md` is not written |
| Merge | Pending | Runs only on `D8=yes` |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | The phase has not started, so no work has diverged from the directive |
<!-- /ANCHOR:log -->
