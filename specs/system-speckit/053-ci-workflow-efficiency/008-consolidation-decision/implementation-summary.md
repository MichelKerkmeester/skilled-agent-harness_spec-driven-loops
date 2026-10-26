---
title: "Implementation Summary"
description: "Measured and decided: the nine always-run workflows' 13 jobs were re-measured after phases 002 to 007, the merge bound was recomputed from 360 runs of job data, and D8 is no, so the eight always-run FRESHNESS workflows stay separate and no workflow file changed. D8 is the session's judgment under the operator's delegation, confirmed by the operator on 2026-10-26."
trigger_phrases:
  - "consolidation decision implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/053-ci-workflow-efficiency/008-consolidation-decision"
    last_updated_at: "2026-10-25T20:45:00Z"
    last_updated_by: "markdown"
    recent_action: "Measured the nine workflows, recorded D8 = no and closed the acceptance rows"
    next_safe_action: "None, phase complete"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "scratch/consolidation-decision.md"
      - "scratch/d8-answer.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-23-053-008-consolidation-decision"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-consolidation-decision |
| **Completed** | Measured and decided 2026-10-25 at start SHA `1c317e13c5`. No workflow file changed. The two commit tasks, T022 and T025, are the orchestrator's |
| **Level** | 3 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A measurement and a decision, and no workflow change. The question was whether merging the always-run workflows is worth the check contexts it costs, answered with numbers taken after phases 002 to 007 rather than with the research's projection.

### Phase 8: consolidation-decision

- **The before numbers** are in `scratch/consolidation-baseline.md`: the 001 dataset's nine workflows and 13 jobs, 1,065 job-seconds, 25 billed minutes per push, 1,866 runner-min/day, the 1,241..1,606 bound at that volume, and the 002 post-R1 rows (1,145 for the nine, 993 for the eight).
- **The after numbers** come from a fresh snapshot: 1000 runs in `scratch/runs-after.json`, the newest 40 runs of each of the nine and 360 job files under `scratch/jobs/`, and the window in `scratch/window.json`. `scratch/consolidation-cost.mjs` computes the table and the bounds, and `--check` re-derives them.
- **The result.** The plan's eight bill 944.8 runner-min/day today, 24 billed minutes per push. One merged job would bill 7, so the saving is 17 per push: 636.1 runner-min/day rate-aware, 749.7 by the plan's formula. The cost would be 12 check contexts collapsed into one, 382.5 s of serial work against a 190 s worst single job, and two protected-by-function workflows deleted. The one required status check, message-contract's, is outside the set.
- **A finding the plan did not expect.** `command-tree-parity.yml` reads `SKILLED_CI_TESTS` in the tree, so the plan's eight span two switch groups. The script also reports the seven that read `SKILLED_CI_FRESHNESS`: 605.16 runner-min/day saved rate-aware.
- **The decision** is `D8=no` (`scratch/d8-answer.md`, `scratch/consolidation-decision.md`, ADR-001). It is the session's judgment under the operator's delegation of 2026-10-25, confirmed by the operator on 2026-10-26.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `scratch/phase-start-sha.txt` | Created | The start SHA for the phase's own diff range |
| `scratch/pre-merge-inventory.md` | Created | The 13 jobs of the nine, with trigger, switch and timeout |
| `scratch/consolidation-baseline.md` | Created | The before tables and the bound's arithmetic |
| `scratch/runs-after.json`, `scratch/jobs/`, `scratch/window.json`, `scratch/snapshot-window.md` | Created | The after snapshot and its window |
| `scratch/consolidation-cost.mjs`, `.json`, `.md` | Created | The arithmetic and its reproducible output |
| `scratch/consolidation-decision.md` | Created | The measured decision record |
| `scratch/d8-answer.md` | Created | D8's answer with its date, authority and numbers |
| `scratch/no-merge.md` | Created | The empty workflow diff and status |
| `scratch/phase-result.md` | Created | The setup checks, the deviations, the cost check, the hostile variants and the gates |
| `spec.md`, `tasks.md`, `acceptance-criteria.md`, `decision-record.md`, `goal.md`, this file | Modified | Status, evidence and continuity |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The tasks ran in order from T001. T001 and T002 confirmed that phases 002 to 007 are in the tree: the FRESHNESS switch is in `gate-inputs.yml`, `command-tree-parity.yml` carries its concurrency block, and `hooks-node-tests.yml` is gone. T003 wrote the before tables, T004 to T007 took the snapshot, T008 to T010 wrote and checked the cost script, and T011 wrote the decision record. T012 and T013 recorded `D8=no`, and T014 proved the empty workflow diff. T015 to T020 and T023 are superseded by that answer. T021 ran the gates and T024 closed the rows. The script was also run against a throwaway copy with a tampered stored number, a skipped job, a job with no timestamps, missing checkout steps, empty runs and a short window, and it failed or flagged each one (`scratch/phase-result.md`, Hostile variants).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| D8 = no: the eight always-run FRESHNESS workflows stay separate | The 636.1 runner-min/day saving costs the per-check signal on 12 checks, doubles the time to the last freshness verdict, widens five members' pull-request coverage and crosses a switch group |
| The plan's eight stay the priced set, and the seven that read the switch are shown beside them | The plan fixes the eight, and the tree shows `command-tree-parity.yml` in TESTS, so the record shows both rather than changing the set silently |
| The script reports a rate-aware saving next to the plan's formula | `command-tree-parity.yml` runs about 19 times a day against 43 to 50 for the others, so `savingPerPush x max(runsPerDay)` overstates the saving |
| Measurement is job-level seconds at `ceil(seconds / 60)` | Billing and `timeout-minutes` see job execution, and the before number was measured this way |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node scratch/consolidation-cost.mjs --check` | `check: ok`, exit 0 |
| `bash .github/scripts/check-gate-inputs.sh` | `files=45 inputs_resolved=250 dynamic_inputs=39 twin_pairs=336 failures=0`, `RESULT: PASSED`, exit 0 |
| YAML parse of `.github/workflows/*.yml` | No output, exit 0 |
| `git diff --stat 1c317e13c5..HEAD -- .github/workflows` and `git status --porcelain -- .github/workflows` | Both print nothing, exit 0 |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict` | `Summary: Errors: 0  Warnings: 0`, `RESULT: PASSED`, exit 0, after `repair-derived.cjs --folder <this folder> --apply` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **D8 is a delegated judgment.** The operator delegated the decision on 2026-10-25 and asked to verify at the end. If the operator answers yes, T015 to T020 reopen, and the plan needs a re-plan first, because `command-tree-parity.yml` now sits in another switch group.
2. **The snapshot is about 19 h after the last edit to the nine, not 24 h.** That edit adds a job-level `if:` and changes no step, and the newest 40 runs of eight of the nine postdate the last step change, so the job seconds describe the current shape.
3. **The empty-diff range will grow.** When the phase finished, `HEAD` was `7041b05478`, four commits past the start SHA, none of them touching `.github/workflows`, and the diff was empty. Rerun the diff after the orchestrator's commit of this phase.
4. **The bound is an upper bound.** It credits only the removed checkouts and job ceilings. It does not charge the merged job for running `command-tree-parity.yml`'s steps on every push, and it does not credit the shared `npm ci` installs.
<!-- /ANCHOR:limitations -->

---
