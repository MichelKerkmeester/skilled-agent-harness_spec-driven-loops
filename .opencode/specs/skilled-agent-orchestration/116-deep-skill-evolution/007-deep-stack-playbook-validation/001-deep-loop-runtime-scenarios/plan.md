---
title: "Implementation Plan: Deep-Loop Runtime Scenarios (Deep-Loop Playbook 001)"
description: "Batch-dispatch 22 deep-loop-runtime scenarios to cli-devin SWE-1.6 by category, capturing evidence per scenario."
trigger_phrases:
  - "deep-loop-runtime scenarios plan"
  - "deep loop runtime playbook plan"
  - "030 phase 001 plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/030-deep-loop-skills-playbook-validation/001-deep-loop-runtime-scenarios"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Author phase 001 plan"
    next_safe_action: "Render RCAF dispatch prompt for 01--executor batch"
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
# Implementation Plan: Deep-Loop Runtime Scenarios (Deep-Loop Playbook 001)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | cli-devin dispatch (`--model swe-1.6`, free tier) |
| **Framework** | deep-loop-runtime lib + scripts + Vitest |
| **Storage** | `scratch/` prompts + logs (no live mutation) |
| **Testing** | Manual playbook scenarios, evidence-captured |

### Overview
Dispatch the 22 runtime scenarios to `cli-devin` SWE-1.6 in playbook-category batches. Each batch dispatch reads the category's scenario files, runs their exact `TEST EXECUTION` commands (`rg`/`sed`/`node`/Vitest), and returns a `### BATCH VERDICTS` table the orchestrator parses into the `checklist.md` ledger. SWE-1.6 prompts are composed via `sk-prompt` (RCAF + medium-density pre-planning, bundle-gate language standard).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] 22 scenarios read and grouped by category
- [ ] `devin auth status` confirms SWE-1.6 reachable (free tier)
- [ ] `/tmp/qa/{prompts,verdicts,evidence}` created

### Definition of Done
- [ ] 22/22 verdicts recorded with evidence
- [ ] FAIL/PARTIAL + 1 PASS/category spot-re-run by orchestrator
- [ ] checklist.md P0 items verified
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Orchestrator (Claude Code) → `cli-devin` SWE-1.6 dispatch → deep-loop-runtime lib/scripts/tests → `### BATCH VERDICTS` table → orchestrator spot-verify → `checklist.md` ledger.

### Key Components
- **RCAF prompt renderer**: per-category prompt with scenario contract + pre-planning block + fixed verdict format.
- **Verdict parser + spot-verifier**: extracts the table, re-runs decisive commands for negatives.

### Data Flow
Category scenario files → rendered prompt → `devin --model swe-1.6` → captured log → parsed table → ledger row.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] `devin auth status` + `codex auth status` pre-flight (one-time for the whole packet)
- [ ] Render RCAF dispatch prompts per category (sk-prompt CLEAR check)

### Phase 2: Dispatch & Capture
- [ ] 01--executor batch (DLR-001,002,003)
- [ ] 02/03/05 batch (DLR-004 prompt-pack, 005 validate, 010 scorer)
- [ ] 04--state-safety batch (DLR-006,007,008,009)
- [ ] 06--coverage-graph batch (DLR-011,012,013)
- [ ] 07--script-entry-points batch (DLR-014,015,016,017)
- [ ] 08--council batch (DLR-018,019,020,021,022)

### Phase 3: Verification
- [ ] Parse each batch table into the checklist.md ledger
- [ ] Spot-re-run all FAIL/PARTIAL + 1 PASS/category
- [ ] Confirm 06/07/08 verdicts ready to gate phase 002
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual | 22 playbook scenarios | cli-devin SWE-1.6 |
| Inspection | source/test anchors | `rg`/`sed` + Vitest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-devin SWE-1.6 auth | External | Pending pre-flight | All dispatch blocked |
| deep-loop-runtime lib/scripts | Internal | Present | Scenarios fail |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A dispatch mutates live state unexpectedly.
- **Procedure**: This is a read-mostly inspection run; no live changes to revert. Discard `scratch/` logs if corrupted and re-dispatch.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Dispatch & Capture (category batches, sequential) ──► Verification ──► gate phase 002
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Dispatch |
| Dispatch | Setup | Verification |
| Verification | Dispatch | Parent phase 002 (council-graph gate) |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 15-30 min |
| Dispatch & Capture | Med | 1-2 hours (6 batches) |
| Verification | Med | 30-60 min |
| **Total** | | **~2-3 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] No `--permission-mode dangerous` unless operator-authorized
- [ ] `scratch/` is the only write target

### Rollback Procedure
1. SIGKILL any live `devin` dispatch (`pkill -9 -f "devin --print"`)
2. Discard corrupted `scratch/` logs
3. Re-dispatch the affected category

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A (read-mostly)
<!-- /ANCHOR:enhanced-rollback -->
