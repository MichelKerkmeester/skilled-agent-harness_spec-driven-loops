---
title: "Implementation Plan: Deep-Research Scenarios (Deep-Loop Playbook 004)"
description: "Batch-dispatch 41 deep-research scenarios to cli-devin SWE-1.6 by category, capturing evidence per scenario."
trigger_phrases:
  - "deep-research scenarios plan"
  - "deep research playbook plan"
  - "030 phase 004 plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/030-deep-loop-skills-playbook-validation/004-deep-research-scenarios"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Author phase 004 plan"
    next_safe_action: "Render RCAF dispatch prompt for 01--entry-points-and-modes batch"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-2026-05-27-deep-loop-playbook"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Deep-Research Scenarios (Deep-Loop Playbook 004)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | cli-devin dispatch (`--model swe-1.6`, free tier) |
| **Framework** | deep-research loop on deep-loop-runtime + command-flow sandbox |
| **Storage** | `scratch/` prompts + logs (no live mutation; sandbox under `/tmp/cp-deep-research-sandbox`) |
| **Testing** | Manual playbook scenarios, evidence-captured |

### Overview
Dispatch the 41 deep-research scenarios to `cli-devin` SWE-1.6 in playbook-category batches. The first six categories (DR-001..035) are deterministic `rg`/`sed` inspection of the deep-research loop's entry points, state setup, iteration discipline, convergence/recovery, fault tolerance, and synthesis guardrails. The seventh category (07--command-flow-stress-tests, CP-046..051) is SANDBOXED — provisioned via `setup-cp-sandbox.sh`, confined to `/tmp/cp-deep-research-sandbox`, run LAST, and cleaned up after — so its live command-flow side effects cannot contaminate the deterministic categories. Each batch dispatch reads the category's scenario files, runs their exact `TEST EXECUTION` commands, and returns a `### BATCH VERDICTS` table the orchestrator parses into the `checklist.md` ledger. SWE-1.6 prompts are composed via `sk-prompt` (RCAF + medium-density pre-planning, bundle-gate language standard).

> **04--convergence-and-recovery is large (13 scenarios).** It may be sub-split into two dispatches if it exceeds ~60K tokens; the verdict ledger stays one table regardless of dispatch count.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] 41 scenarios read and grouped by category
- [ ] `devin auth status` confirms SWE-1.6 reachable (free tier)
- [ ] `/tmp/qa/{prompts,verdicts,evidence}` created

### Definition of Done
- [ ] 41/41 verdicts recorded with evidence
- [ ] FAIL/PARTIAL + 1 PASS/category spot-re-run by orchestrator
- [ ] checklist.md P0 items verified
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Orchestrator (Claude Code) → `cli-devin` SWE-1.6 dispatch → deep-research loop files/command-flow sandbox → `### BATCH VERDICTS` table → orchestrator spot-verify → `checklist.md` ledger.

### Key Components
- **RCAF prompt renderer**: per-category prompt with scenario contract + pre-planning block + fixed verdict format.
- **Verdict parser + spot-verifier**: extracts the table, re-runs decisive commands for negatives.
- **Sandbox harness**: `setup-cp-sandbox.sh` provisions `/tmp/cp-deep-research-sandbox` for the 07 command-flow category, torn down after the batch.

### Data Flow
Category scenario files → rendered prompt → `devin --model swe-1.6` → captured log → parsed table → ledger row.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] `devin auth status` + `codex auth status` pre-flight (reuse foundational phase result)
- [ ] Render RCAF dispatch prompts per category (sk-prompt CLEAR check)

### Phase 2: Dispatch & Capture
- [ ] 01--entry-points-and-modes batch (DR-001,002,003)
- [ ] 02--initialization-and-state-setup batch (DR-004,005,006,027)
- [ ] 03--iteration-execution-and-state-discipline batch (DR-007,008,009,010,024,025,028,029)
- [ ] 04--convergence-and-recovery batch (DR-011,012,013,014,020,021,022,023,030,031,032,033,034 — may sub-split into two dispatches)
- [ ] 05--pause-resume-and-fault-tolerance batch (DR-015,016,017,018)
- [ ] 06--synthesis-save-and-guardrails batch (DR-019,026,035)
- [ ] 07--command-flow-stress-tests batch (CP-046..051) — SANDBOXED, run LAST, isolated to `/tmp/cp-deep-research-sandbox`, cleanup after

### Phase 3: Verification
- [ ] Parse each batch table into the checklist.md ledger
- [ ] Spot-re-run all FAIL/PARTIAL + 1 PASS/category
- [ ] Confirm command-flow sandbox torn down and no leakage into deterministic categories
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual | 41 playbook scenarios | cli-devin SWE-1.6 |
| Inspection | source/test anchors | `rg`/`sed` |
| Sandboxed | command-flow stress (CP-046..051) | `setup-cp-sandbox.sh` in `/tmp/cp-deep-research-sandbox` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-devin SWE-1.6 auth | External | Pending pre-flight | All dispatch blocked |
| deep-research loop + deep-loop-runtime | Internal | Present | Scenarios fail |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A dispatch mutates live state unexpectedly, or the command-flow sandbox leaks outside `/tmp/cp-deep-research-sandbox`.
- **Procedure**: The first six categories are read-mostly inspection; no live changes to revert. Discard `scratch/` logs if corrupted and re-dispatch. For the 07 category, tear down `/tmp/cp-deep-research-sandbox` and re-provision via `setup-cp-sandbox.sh`.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Dispatch & Capture (category batches, sequential; 07 sandboxed last) ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Dispatch |
| Dispatch | Setup | Verification |
| Verification | Dispatch | Parent phase rollup (006-release-readiness-synthesis) |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 15-30 min |
| Dispatch & Capture | Med | 2-3 hours (7 batches; 04 may sub-split) |
| Verification | Med | 30-60 min |
| **Total** | | **~3-4 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] No `--permission-mode dangerous` unless operator-authorized
- [ ] `scratch/` and `/tmp/cp-deep-research-sandbox` are the only write targets

### Rollback Procedure
1. SIGKILL any live `devin` dispatch (`pkill -9 -f "devin --print"`)
2. Discard corrupted `scratch/` logs
3. Tear down `/tmp/cp-deep-research-sandbox` if the 07 batch was interrupted
4. Re-dispatch the affected category

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A (read-mostly; sandbox is disposable under `/tmp`)
<!-- /ANCHOR:enhanced-rollback -->
