---
title: "Implementation Summary: Phase 1: CI workflow efficiency research"
description: "Half of the repo's CI load is a bot commit re-running 13 workflows, and nothing is cached. This phase measured that and planned seven implementation phases to fix it."
trigger_phrases:
  - "ci research implementation summary"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-speckit/053-ci-workflow-efficiency/001-research"
    last_updated_at: "2026-10-23T08:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Completed the 20-iteration research and synthesized research.md"
    next_safe_action: "Plan phase 002 trigger surgery from research/research.md section 15"
    blockers: []
    key_files:
      - "research/research.md"
      - "scratch/ci-run-data/summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-23-053-001-ci-research"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Are the spec-kit CLI tests safe under fileParallelism true?"
      - "Can the owner's token write repository variables for /doctor:ci toggle?"
    answered_questions:
      - "What dominates CI cost? The trigger-index rebuild commit re-runs 13 workflows: about 2,073 of 3,812 runner-min/day."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Phase 1: CI workflow efficiency research

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-research |
| **Completed** | 2026-10-23 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Your CI spends about 3,812 runner-minutes a day, and more than half of that goes on one thing: the trigger-index bot commit, which re-runs 13 workflows on files none of them reads. You now have that measured, plus a ranked plan of seven implementation phases that starts with the cheapest and largest fix.

### Phase 1: research

This phase ran the repo's own `/deep:research:auto` loop for 20 iterations on cli-pi with DeepSeek v4.1 Flash (1017) at max thinking. Each iteration took one angle, from cost and caching through to an on/off switch for clones, a `/doctor:ci` command and an sk-code-ci standards surface. The synthesis in `research/research.md` gives you:
- a top 10 with savings, risk and effort;
- the issues and overengineering found, with file:line evidence;
- phases 002-008, each with scope, workflows, saving, risk, order and dependencies.

Nothing in `.github/` changed.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research/research.md` | Created | The canonical synthesis |
| `research/iterations/`, `deltas/`, `dispatch-receipts/`, ledgers, state, strategy, registry, dashboard, `resource-map.md` | Created | The loop's own state and evidence |
| `scratch/ci-run-data/` | Created | Measured `gh` dataset with run ids |
| `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, this file | Created | Phase docs |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work ran in its own worktree from origin/main. A `gh` dataset came first, so iterations could cite run ids instead of guessing. The loop then ran step by step from `deep-research-auto.yaml`, with these checks after each iteration:
- the lock was refreshed;
- the prompt was rendered with `renderPromptPack`;
- the `if_cli_pi` dispatch ran through `runAuditedExecutorCommand`;
- `verify-iteration.cjs`, the reducer and the graph upsert ran.

All 20 iterations passed on the first dispatch. Before synthesis, the top claims were re-checked independently: the rebuild fan-out from the dataset, the grep counts, the rulesets, GitHub's skip semantics and the repo's visibility.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Single-executor path, not fan-out | One executor was requested, and a fresh pi context per iteration keeps each one inside its budget |
| Re-initialize, not edit, when the run changed to 20 iterations with convergence off | No iteration had run, and the ledger's opening record carries the config digest and max iterations, so editing the config would have left them disagreeing |
| One assigned angle per iteration | Convergence was off by request, so breadth had to come from the plan. The extra ten iterations went to the coordinator's added angles |
| Keep `scratch/ci-run-data/` in the commit | The iterations and `research.md` cite it line by line |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Config before iteration 1 | PASS: cli-pi, `deepseek-v4.1-flash-1017`, max, 20, max-iterations, convergence off |
| `verify-iteration.cjs` x 20 | PASS: 20/20 first dispatch |
| Citation existence | PASS: every cited path and line exists |
| Independent re-check | PASS with three corrections, recorded in `research.md` section 20 |
| `validate.sh --strict --recursive` on the parent | PASS: `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Runner-minutes are not money here.** The repo is public, so hosted runners are free. The savings buy concurrency headroom and faster signals, not a smaller bill.
2. **Five job samples per workflow.** Per-workflow medians carry sampling error. The two largest figures were spot-checked against raw runs.
3. **Six questions stay open for the implementation phases.** They are listed in `research/research.md` section 18, and the two that gate a design choice are fileParallelism safety and variable-write permission.
<!-- /ANCHOR:limitations -->

---
