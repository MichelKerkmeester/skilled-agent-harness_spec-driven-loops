---
title: "Implementation Plan: Deep-AI-Council Scenarios (Deep-Loop Playbook 002)"
description: "Batch-dispatch 32 deep-ai-council scenarios by category — deterministic categories to cli-devin SWE-1.6, the graph-value A/B category to cli-codex GPT-5.5 — capturing evidence per scenario."
trigger_phrases:
  - "deep-ai-council scenarios plan"
  - "deep ai council playbook plan"
  - "007 phase 002 plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/006-deep-skill-evolution/008-deep-stack-playbook-validation/002-deep-ai-council-scenarios"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Author phase 002 plan"
    next_safe_action: "Render RCAF dispatch prompt for 01--runtime-routing-and-rename batch"
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
# Implementation Plan: Deep-AI-Council Scenarios (Deep-Loop Playbook 002)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | cli-devin dispatch (`--model swe-1.6`, free tier) + cli-codex (`--model gpt-5.5`, medium-fast) |
| **Framework** | deep-ai-council skill + deep-loop-runtime council-graph + `.cjs` scripts |
| **Storage** | `scratch/` prompts + logs (no live mutation) |
| **Testing** | Manual playbook scenarios, evidence-captured |

### Overview
Dispatch the 32 council scenarios in playbook-category batches. The deterministic categories (01-08) go to `cli-devin` SWE-1.6 (`rg`/`sed` inspection); the six `09--council-graph-value-comparison` scenarios (DAC-027..032) go to `cli-codex` GPT-5.5 medium-fast as A/B "graph vs no-graph baseline" reasoning runs. Each batch dispatch reads the category's scenario files, runs their exact `TEST EXECUTION` steps, and returns a `### BATCH VERDICTS` table the orchestrator parses into the `checklist.md` ledger. SWE-1.6 prompts are composed via `sk-prompt` (RCAF + medium-density pre-planning, bundle-gate language standard).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] 32 scenarios read and grouped by category
- [ ] Phase 001 `06`/`07`/`08` verdicts confirmed non-FAIL before 08/09 dispatch
- [ ] `/tmp/qa/{prompts,verdicts,evidence}` created

### Definition of Done
- [ ] 32/32 verdicts recorded with evidence
- [ ] FAIL/PARTIAL + 1 PASS/category spot-re-run by orchestrator
- [ ] checklist.md P0 items verified
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Orchestrator (Claude Code) → `cli-devin` SWE-1.6 / `cli-codex` GPT-5.5 dispatch → deep-ai-council skill + deep-loop-runtime council-graph/scripts → `### BATCH VERDICTS` table → orchestrator spot-verify → `checklist.md` ledger.

### Key Components
- **RCAF prompt renderer**: per-category prompt with scenario contract + pre-planning block + fixed verdict format; the 09 prompt frames each row as a graph-vs-no-graph baseline A/B comparison.
- **Verdict parser + spot-verifier**: extracts the table, re-runs decisive commands for negatives.

### Data Flow
Category scenario files → rendered prompt → `devin --model swe-1.6` (or `codex --model gpt-5.5` for 09) → captured log → parsed table → ledger row.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm phase 001 `06--coverage-graph` / `07--script-entry-points` / `08--council` verdicts non-FAIL (gates 08/09)
- [ ] Render RCAF dispatch prompts per category (sk-prompt CLEAR check)

### Phase 2: Dispatch & Capture
- [ ] 01--runtime-routing-and-rename batch (DAC-001,002) → devin
- [ ] 02--council-deliberation-and-seat-diversity batch (DAC-003,004) → devin
- [ ] 03--artifact-persistence-and-state-format batch (DAC-005,006,007) → devin
- [ ] 04--convergence-and-rollback batch (DAC-008,009,010) → devin
- [ ] 05--scope-boundaries batch (DAC-011,012) → devin
- [ ] 06--depth-and-failure-handling batch (DAC-014,018) → devin
- [ ] 07--writer-library-contract batch (DAC-013,015,016,017) → devin
- [ ] 08--council-graph-integration batch (DAC-019..026, GATED) → devin
- [ ] 09--council-graph-value-comparison batch (DAC-027..032, GATED, A/B) → codex GPT-5.5

### Phase 3: Verification
- [ ] Parse each batch table into the checklist.md ledger
- [ ] Spot-re-run all FAIL/PARTIAL + 1 PASS/category
- [ ] Confirm 08/09 dispatched only after phase 001 06/07/08 verdicts non-FAIL
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual | 32 playbook scenarios | cli-devin SWE-1.6 + cli-codex GPT-5.5 |
| Inspection | source/test anchors | `rg`/`sed` |
| A/B reasoning | graph vs no-graph baseline (DAC-027..032) | cli-codex GPT-5.5 medium-fast |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 06/07/08 verdicts non-FAIL | Internal | Pending phase 001 | 08/09 dispatch blocked (false-green risk) |
| deep-loop-runtime `.cjs` scripts (upsert/query/convergence/status) | Internal | Present | DAC-019..024 fail (`node .opencode/skills/deep-loop-runtime/scripts/{upsert,query,convergence,status}.cjs`) |
| cli-codex GPT-5.5 medium-fast auth | External | Pending pre-flight (phase 001) | 09 A/B runs blocked |
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
phase 001 (06/07/08 verdicts) ──► Setup ──► Dispatch & Capture (category batches, sequential; 08/09 gated) ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | phase 001 06/07/08 verdicts non-FAIL | Dispatch |
| Dispatch | Setup | Verification |
| Dispatch 08/09 | phase 001 06/07/08 verdicts non-FAIL | Verification |
| Verification | Dispatch | Packet release-readiness synthesis |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 15-30 min |
| Dispatch & Capture | Med | 1.5-2.5 hours (9 batches, two executors) |
| Verification | Med | 30-60 min |
| **Total** | | **~3-4 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] No `--permission-mode dangerous` unless operator-authorized
- [ ] `scratch/` is the only write target

### Rollback Procedure
1. SIGKILL any live dispatch (`pkill -9 -f "devin --print"` / `pkill -9 -f "codex"`)
2. Discard corrupted `scratch/` logs
3. Re-dispatch the affected category

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A (read-mostly)
<!-- /ANCHOR:enhanced-rollback -->
