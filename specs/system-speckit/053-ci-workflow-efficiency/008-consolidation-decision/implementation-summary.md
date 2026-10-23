---
title: "Implementation Summary"
description: "Planned, not built: this phase re-measures the nine always-run workflows' 13 jobs after phases 002 to 007, records the before and after numbers and the recomputed merge upper bound in a decision record, and merges workflows only if the operator answers D8 yes. Nothing has been implemented yet."
trigger_phrases:
  - "consolidation decision implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/053-ci-workflow-efficiency/008-consolidation-decision"
    last_updated_at: "2026-10-23T14:30:00Z"
    last_updated_by: "markdown-planner"
    recent_action: "Recorded the planned scope; no code has been built"
    next_safe_action: "Run T001 to T025 once phases 002 to 007 have landed"
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
| **Completed** | Not built |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing. This packet is planned and no task has run. `tasks.md` carries T001 to T025, and every one of them is `[ ]`.

### Phase 8: consolidation-decision

The phase exists to answer one question with a measurement instead of an estimate: whether merging the nine always-run workflows is worth the twelve check contexts it costs. The research priced the merge at 1,241-1,606 runner-min/day on a volume that R1 removes 35 of 73 push SHAs from, so the number has to be re-measured after phases 002 to 007 land. When the tasks run, they produce `scratch/consolidation-baseline.md` for the before numbers, `scratch/consolidation-cost.json` for the after numbers and the bound, and `scratch/consolidation-decision.md` for the decision itself.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `scratch/consolidation-baseline.md` | Planned create | The 9 workflow rows and 13 job rows with the 001 and 002 before numbers |
| `scratch/consolidation-cost.mjs` | Planned create | The arithmetic, with `--check` to re-derive every figure from the saved JSON |
| `scratch/consolidation-decision.md` | Planned create | The measured decision record with the before and after numbers and D8's answer |
| `.github/workflows/always-run-guards.yml` | Planned create, only on `D8=yes` | One workflow, one job, the eight members' steps |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered. The packet is at the plan stage: `spec.md` states the requirements, `plan.md` states the measurement basis and the merge shape, `tasks.md` states the ordered changes with their checks, `decision-record.md` freezes the six design choices, and `acceptance-criteria.md` states the nine criteria that decide closure. Nothing under `scratch/` exists, D8 is unanswered, and no workflow file has changed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| No merge without an operator yes; the default is no merge | The saving is an upper bound on a volume R1 removes, and the mechanism that produces it is the loss of twelve check contexts |
| The candidate set is the eight always-run FRESHNESS workflows | One job answering two switch variables would let one group's switch govern the other group's checks, and message-contract's context is required |
| Measurement is job-level seconds at `ceil(seconds / 60)` | Billing and `timeout-minutes` see job execution, and the before number was measured this way |
| The merged job keeps one `fetch-depth: 0` checkout and the daily schedule | Two members diff against their base, and one member carries a cron; a shallow, unscheduled merge would silently break both |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node scratch/consolidation-cost.mjs --check` | Not run; the script does not exist yet |
| `bash .github/scripts/check-gate-inputs.sh` | Not run against a changed tree; no workflow file has changed |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict` | Run at plan time; the only failures are the two generated-metadata rules, which the orchestrator owns |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Every job count and line number is provisional.** Phases 002 to 007 add a `concurrency:` block, a `timeout-minutes` and an `if:` to each job, delete `hooks-node-tests.yml` and rewrite `.github/workflows/README.md`, so the anchors in `tasks.md` will have moved by the time the tasks run. Each task locates its quoted text and stops when it is absent.
2. **The merge saving is an upper bound until T009 runs.** It is built from the 001 medians and a 50-76 s checkout, and the merged job pays a depth-0 checkout because two members need full history, so the measured saving is expected to be lower than the projection.
3. **A subset answer to D8 is not planned.** The arithmetic, the step order and the README edits are written for the full eight-workflow set, so a subset needs a new plan rather than a task.
<!-- /ANCHOR:limitations -->

---
