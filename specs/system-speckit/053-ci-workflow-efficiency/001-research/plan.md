---
title: "Implementation Plan: Phase 1: CI workflow efficiency research"
description: "Run the repo's /deep:research:auto loop for 20 iterations on cli-pi with deepseek-v4.1-flash-1017 at max thinking, over a measured gh dataset of CI runs, then synthesize ranked recommendations and proposed phases 002-008."
trigger_phrases:
  - "ci research plan"
  - "053 research plan"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: CI workflow efficiency research

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | GitHub Actions YAML (read), Node.js deep-loop runtime, `gh` CLI |
| **Framework** | `/deep:research:auto` (`.skilled/commands/deep/assets/deep-research-auto.yaml`) |
| **Storage** | Append-only research ledger and JSONL projection under `research/` |
| **Testing** | `verify-iteration.cjs` per iteration; `validate.sh --strict --recursive` for the packet |

### Overview
Collect a measured CI dataset with `gh`. Then run the auto YAML's init, loop and synthesis phases with a single cli-pi executor, one research angle per iteration across 20 iterations. Re-check the top claims independently, and write `research/research.md` with the ranked recommendations and the proposed implementation phases.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (pi on PATH, llmgateway key present, gh authenticated)

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (20/20 `verify-iteration.cjs` OK; strict validation PASSED)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Externalized-state research loop: a fresh executor context per iteration, with state carried in files.

### Key Components
- **Config and ledger**: `research/deep-research-config.json` (executor cli-pi, model, max, 20 iterations, convergence off) and the gateway-written ledger with its JSONL projection.
- **Iteration dispatch**: the YAML's `if_cli_pi` branch, which builds the `pi` command with `buildLineageCommand` and runs it with `runAuditedExecutorCommand`. That writes intent and completion receipts and checks write containment.
- **Post-dispatch gate**: `verify-iteration.cjs` for the artifact and route-proof contract, then `reduce-state.cjs` for the registry, strategy and dashboard.
- **Dataset**: `scratch/ci-run-data/`, 1,000 recent runs, 40 per workflow, and job JSON for 165 runs.

### Data Flow
`gh` JSON goes to `summary.md`, which feeds the iteration prompt, rendered by `renderPromptPack`. The pi iteration writes the narrative and the delta, and records its state through the gateway. The reducer then refreshes the strategy, which carries the next focus. After the last iteration, the synthesis turns the iterations into `research.md`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not a fix: this phase changes no producer or consumer. The surfaces the later phases touch are listed in `research/research.md` section 15.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.github/workflows/*.yml` | CI definitions | unchanged (read only) | `git status` shows only this packet's files |
| Repository rulesets and variables | Required checks, on/off state | unchanged (read only) | read with `gh api`; no write call made |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Each iteration's artifacts and route proof | `verify-iteration.cjs` |
| Integration | Ledger, reducer and synthesis closeout | `append-mode-event.cjs`, `reduce-state.cjs`, `synthesis-closeout.cjs` |
| Manual | Independent re-check of the top claims | grep over workflows, `gh api` rulesets, dataset regrouping, GitHub docs fetch |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `pi` 1.4.0 with llmgateway | External | Green | No iteration can dispatch |
| `gh` with `repo, workflow` scopes | External | Green | No measured dataset |
| deep-loop runtime scripts | Internal | Green | No loop |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The research output is judged wrong or unwanted.
- **Procedure**: Revert the single commit that adds this packet. No workflow or setting changed, so nothing else needs reverting.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (worktree, scaffold, dataset, init) ──► Loop (20 iterations) ──► Synthesis + verify
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Loop |
| Loop | Setup | Synthesis |
| Synthesis + verify | Loop | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | ~15 minutes including dataset collection |
| Loop | Med | ~45 minutes of dispatch (39-490 s per iteration) |
| Verification and synthesis | Med | ~30 minutes |
| **Total** | | **~1.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes) - not applicable, no data changes
- [x] Feature flag configured - not applicable, research only
- [x] Monitoring alerts set - not applicable; CI on the push is the only gate

### Rollback Procedure
1. Revert the packet commit on main.
2. Re-run the trigger index rebuild if it indexed the packet. The workflow does this on the next push.
3. Confirm CI is green on the revert.
4. No stakeholder notice is needed; nothing user-facing changed.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
