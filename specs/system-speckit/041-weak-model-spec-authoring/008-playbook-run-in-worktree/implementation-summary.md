---
title: "Implementation Summary"
description: "Phase 8 ran the eight phase 007 playbook scenarios in a disposable sk-git worktree. All eight passed on the first run and the result is published as a benchmark report."
trigger_phrases:
  - "playbook run in worktree implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree"
    last_updated_at: "2026-10-25T00:00:00Z"
    last_updated_by: "conductor"
    recent_action: "Ran the eight scenarios and published the report"
    next_safe_action: "Start phase 009 from the report folder and results.csv"
    blockers: []
    key_files:
      - "specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "054-weak-model-spec-authoring-planning"
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
| **Spec Folder** | 008-playbook-run-in-worktree |
| **Status** | Complete |
| **Completed** | 2026-10-25 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

All eight scenarios phase 007 added passed on their first run. The report is `.skilled/skills/system-spec-kit/benchmark/reports/2026-10-25--manual-testing-playbook--weak-model-authoring/`, with the verdict `PASS` and a result of 8 PASS and 0 FAIL.

### Phase 8: playbook-run-in-worktree

The phase created the disposable worktree `worktrees/221-playbook-run` from `BASE_REF` `95abd302c8fbe320f9fd76b36951e33fff5f7d10` through the sk-git allocator and provisioned it (`11 installed, 5 built, 3 already present, 0 failed`, 1094 s). An own-code check showed no `FOREIGN` path and the worktree held the card, both guard scripts and the v2.3 stamp. It then ran the eight scenarios from their own command blocks, wrote the report package and one reports index row, saved the worktree patch and status, removed the worktree and its branch, and closed on a read-only review.

| Scenario | Playbook ID | Verdict | What the run showed |
|----------|-------------|---------|---------------------|
| S1 | 476 | PASS | Draft v2.3 scaffold printed `warn` and `true` |
| S2 | 477 | PASS | Complete status printed `error` and `false` with token lines named |
| S3 | 478 | PASS | v2.2 stamps printed `error` and `false` |
| S4 | 479 | PASS | Clean tree `EXAMPLE_DRIFT_OK`, injected leak exit 1 with one failure line |
| S5 | 480 | PASS | `12 passed (12)` and `16 passed (16)` |
| S6 | 481 | PASS | Counts `4`, `0` and `1` |
| S7 | 482 | PASS | Nine PASS lines and `CARD SYNC OK`, then `CARD SYNC FAILED` without the card |
| S8 | 483 | PASS | One cli-devin swe-2-max worker wrote a Level 1 packet that passed strict validation with 0 tokens left |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `goal.md` | Modified | Frozen S1 and S8 patterns, runner fence filter and stdin amendments, outcomes and closure |
| `scratch/scenarios.tsv`, `scratch/results.tsv`, `scratch/verdicts.md` | Created | Scenario map, verdict rows and the verdict page |
| `scratch/runs/`, `scratch/worktree/`, `scratch/fixes/`, `scratch/review/`, `scratch/tools/` | Created | Captured runs, worktree proofs, the saved patch, the review input and reply, and the scripts |
| `.skilled/skills/system-spec-kit/benchmark/reports/2026-10-25--manual-testing-playbook--weak-model-authoring/` | Created | `README.md`, `results.csv`, `source.md` and eight `outcomes/*.json` |
| `.skilled/skills/system-spec-kit/benchmark/reports/README.md` | Modified | One index row |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The phase agent ran as the single worker under a Claude Code conductor. It ran every scenario's own `### Commands` blocks through the runner. The only external dispatches were scenario 483's own cli-devin swe-2-max worker (`--permission-mode dangerous`, approved by the operator) and the closing review (cli-devin swe-2-max, `--permission-mode auto`, read-only). One disposable worktree hosted every scenario. The OpenCode, DeepSeek, Task-tool and cli-codex wording in the plan is history. The phase ends with one local commit that is never pushed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Run each scenario's own command block | A retyped command would test the conductor's copy rather than the playbook |
| Provision the worktree with its own dependencies and build | A symlinked `node_modules` or `dist` would make the run read the primary checkout's code |
| Copy the real report file set and keep the ten required sections | The new report opens like its siblings and still meets the benchmark report contract |
| A mismatch with the scenario Pass section is a scenario defect | The conductor must not grade a scenario it is not allowed to edit |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Strict validation of this phase folder | `RESULT: PASSED` (see `goal.md` section 4) |
| Eight scenario verdicts | 8 PASS, read against each scenario's Pass section, in `scratch/results.tsv` and `scratch/verdicts.md` |
| Primary checkout gate | `PRIMARY_CLEAN`, MAIN status 341 lines before and after with an empty diff |
| Report package shape | 3 top-level files, 8 outcome files, `results.csv` 9 lines, 10 numbered sections |
| Worktree removal | `REMOVAL_OK`, `WORKTREE_GONE`, `BRANCH_GONE`, with `PATCH_GATE_COVERED` |
| Read-only review | 3 P2 lines, 0 P0, 0 P1, all applied |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **One run per scenario.** A pass is one sample on one `BASE_REF`, not a stability claim.
2. **S8 samples one model.** The authoring run uses cli-devin swe-2-max only, on one attempt.
3. **Two frozen patterns changed.** S1 uses `^warn$` and S8 matches the lines the scenario itself prints, so those rows rest on the scenario Pass section.
4. **Provisioning needs npm access.** A machine with no registry or cache cannot run this phase.
5. **Forwarded notes stay open.** The tool lists of scenarios 479 and 482 lack `awk` and `rg`, and scenario 483 leaves a pointer file in phase 007's scratch folder. This phase edits no scenario file, so both stay with the phase 007 owner.
<!-- /ANCHOR:limitations -->

---

