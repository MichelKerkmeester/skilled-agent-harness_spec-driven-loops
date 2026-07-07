---
title: "Implementation Plan: Deep-Review Scenarios (Deep-Loop Playbook 003)"
description: "Batch-dispatch 45 deep-review scenarios to cli-devin SWE-1.6 by category, capturing evidence per scenario; sandboxed command-flow stress tests run last."
trigger_phrases:
  - "deep-review scenarios plan"
  - "deep review playbook plan"
  - "007 phase 003 plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/021-deep-skill-evolution/007-deep-stack-playbook-validation/003-deep-review-scenarios"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Author phase 003 plan"
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
# Implementation Plan: Deep-Review Scenarios (Deep-Loop Playbook 003)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | cli-devin dispatch (`--model swe-1.6`, free tier) |
| **Framework** | deep-review loop on deep-loop-runtime |
| **Storage** | `scratch/` prompts + logs (no live mutation); `/tmp/cp-deep-review-sandbox` for category 07 |
| **Testing** | Manual playbook scenarios, evidence-captured |

### Overview
Dispatch the 45 deep-review scenarios to `cli-devin` SWE-1.6 in playbook-category batches. Each batch dispatch reads the category's scenario files, runs their exact `TEST EXECUTION` commands (`rg`/`sed`), and returns a `### BATCH VERDICTS` table the orchestrator parses into the `checklist.md` ledger. Category 07 (command-flow stress tests, CP-052..057) is SANDBOXED: the orchestrator runs `setup-cp-sandbox.sh` first, pins the dispatch CWD to `/tmp/cp-deep-review-sandbox`, runs it LAST and in isolation, and tears the sandbox down afterward. SWE-1.6 prompts are composed via `sk-prompt` (RCAF + medium-density pre-planning, bundle-gate language standard).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] 45 scenarios read and grouped by category
- [ ] `devin auth status` confirms SWE-1.6 reachable (free tier)
- [ ] `/tmp/qa/{prompts,verdicts,evidence}` created
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Orchestrator (Claude Code) → `cli-devin` SWE-1.6 dispatch → deep-review loop/state/validator surfaces → `### BATCH VERDICTS` table → orchestrator spot-verify → `checklist.md` ledger. Category 07 routes through a sandbox: `setup-cp-sandbox.sh` → dispatch pinned to `/tmp/cp-deep-review-sandbox` → teardown.

### Key Components
- **RCAF prompt renderer**: per-category prompt with scenario contract + pre-planning block + fixed verdict format.
- **Verdict parser + spot-verifier**: extracts the table, re-runs decisive commands for negatives.
- **Sandbox harness**: `setup-cp-sandbox.sh` provisions `/tmp/cp-deep-review-sandbox` for CP-052..057 and is the only category run with a non-repo CWD.

### Data Flow
Category scenario files → rendered prompt → `devin --model swe-1.6` → captured log → parsed table → ledger row. For 07: sandbox setup → isolated dispatch → captured log → ledger rows → sandbox teardown.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] `devin auth status` + `codex auth status` pre-flight (reuse the packet-level pre-flight)
- [ ] Render RCAF dispatch prompts per category (sk-prompt CLEAR check)

### Phase 2: Dispatch & Capture
- [ ] 01--entry-points-and-modes batch (DRV-001,002,003)
- [ ] 02--initialization-and-state-setup batch (DRV-004,005,006,007)
- [ ] 03--iteration-execution-and-state-discipline batch (DRV-008..015)
- [ ] 04--convergence-and-recovery batch (DRV-031,017,018,019,020,030,032,033,034)
- [ ] 05--pause-resume-and-fault-tolerance batch (DRV-021,022,023,024)
- [ ] 06--synthesis-save-and-guardrails batch (DRV-025,026,027,028,029)
- [ ] 08--review-depth-v2-rollout batch (DRV-058..063)
- [ ] 07--command-flow-stress-tests batch (CP-052..057) — SANDBOXED, run LAST in isolation (`setup-cp-sandbox.sh` → `/tmp/cp-deep-review-sandbox` → teardown)

### Phase 3: Verification
- [ ] Parse each batch table into the checklist.md ledger
- [ ] Spot-re-run all FAIL/PARTIAL + 1 PASS/category
- [ ] Confirm critical-path scenarios (DRV-001,005,008,009,017,027) carry PASS or an escalated FAIL
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual | 45 playbook scenarios | cli-devin SWE-1.6 |
| Inspection | source/test anchors | `rg`/`sed` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-devin SWE-1.6 auth | External | Pending pre-flight | All dispatch blocked |
| deep-review loop/state/validator | Internal | Present | Scenarios fail |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A dispatch mutates live state unexpectedly.
- **Procedure**: This is a read-mostly inspection run; no live changes to revert. Discard `scratch/` logs if corrupted and re-dispatch. For category 07, tear down `/tmp/cp-deep-review-sandbox` — all stress-test writes are confined there.
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
| Verification | Dispatch | Packet synthesis rollup |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 15-30 min |
| Dispatch & Capture | Med | 2-3 hours (8 batches) |
| Verification | Med | 45-90 min |
| **Total** | | **~3-4 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] No `--permission-mode dangerous` unless operator-authorized
- [ ] `scratch/` is the only write target (except `/tmp/cp-deep-review-sandbox` for category 07)

### Rollback Procedure
1. SIGKILL any live `devin` dispatch (`pkill -9 -f "devin --print"`)
2. Discard corrupted `scratch/` logs
3. Tear down `/tmp/cp-deep-review-sandbox` if a stress-test run left it dirty
4. Re-dispatch the affected category

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A (read-mostly; sandbox writes confined to `/tmp/cp-deep-review-sandbox`)
<!-- /ANCHOR:enhanced-rollback -->
