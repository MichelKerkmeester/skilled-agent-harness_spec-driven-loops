---
title: "Implementation Plan: Deep-Agent-Improvement Scenarios (Deep-Loop Playbook 005)"
description: "Batch-dispatch 37 deep-agent-improvement scenarios to cli-devin SWE-1.6 by category, capturing evidence per scenario."
trigger_phrases:
  - "deep-agent-improvement scenarios plan"
  - "deep agent improvement playbook plan"
  - "030 phase 005 plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/030-deep-loop-skills-playbook-validation/005-deep-agent-improvement-scenarios"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Author phase 005 plan"
    next_safe_action: "Render RCAF dispatch prompt for 01--integration-scanner batch"
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
# Implementation Plan: Deep-Agent-Improvement Scenarios (Deep-Loop Playbook 005)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | cli-devin dispatch (`--model swe-1.6`, free tier) |
| **Framework** | deep-agent-improvement `.cjs` scripts + python3 JSON assertions |
| **Storage** | `scratch/` prompts + logs (no live mutation) |
| **Testing** | Manual playbook scenarios, evidence-captured |

### Overview
Dispatch the 37 deep-agent-improvement scenarios to `cli-devin` SWE-1.6 in playbook-category batches. Each batch dispatch reads the category's scenario files, runs their exact `TEST EXECUTION` commands — `node .opencode/skills/deep-agent-improvement/scripts/scan-integration.cjs ...` (and sibling `.cjs` entry points) piped to `python3` JSON assertions, with process exit codes corroborating each assertion — and returns a `### BATCH VERDICTS` table the orchestrator parses into the `checklist.md` ledger. SWE-1.6 prompts are composed via `sk-prompt` (RCAF + medium-density pre-planning, bundle-gate language standard).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] 37 scenarios read and grouped by category
- [ ] `devin auth status` confirms SWE-1.6 reachable (free tier)
- [ ] `/tmp/qa/{prompts,verdicts,evidence}` created

### Definition of Done
- [ ] 37/37 verdicts recorded with evidence
- [ ] FAIL/PARTIAL + 1 PASS/category spot-re-run by orchestrator
- [ ] checklist.md P0 items verified
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Orchestrator (Claude Code) → `cli-devin` SWE-1.6 dispatch → deep-agent-improvement `.cjs` scripts → JSON stdout → `python3` assertion + exit-code corroboration → `### BATCH VERDICTS` table → orchestrator spot-verify → `checklist.md` ledger.

### Key Components
- **RCAF prompt renderer**: per-category prompt with scenario contract + pre-planning block + fixed verdict format.
- **Script-invocation harness**: `node scripts/*.cjs` emitted JSON piped to `python3 -c` assertions, with `$?` exit-code checks recorded alongside each assertion.
- **Verdict parser + spot-verifier**: extracts the table, re-runs decisive script+assertion commands for negatives.

### Data Flow
Category scenario files → rendered prompt → `devin --model swe-1.6` → `node *.cjs` JSON → `python3` assert + exit code → captured log → parsed table → ledger row.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] `devin auth status` + `codex auth status` pre-flight (one-time for the whole packet)
- [ ] Render RCAF dispatch prompts per category (sk-prompt CLEAR check)

### Phase 2: Dispatch & Capture
- [ ] 01--integration-scanner batch (IS-001..004)
- [ ] 02--profile-generator batch (PG-005..008)
- [ ] 03--5d-scorer batch (5D-010,012,013)
- [ ] 04--benchmark-integration batch (BI-014,015)
- [ ] 05--reducer-dimensions batch (RD-017,018,019)
- [ ] 06--end-to-end-loop batch (E2E-020..024)
- [ ] 07--runtime-truth batch (RT-025..034 — critical: execute or SKIP-with-blocker)
- [ ] 08--agent-discipline-stress-tests batch (CP-040..045 — SANDBOXED, run last)

### Phase 3: Verification
- [ ] Parse each batch table into the checklist.md ledger
- [ ] Spot-re-run all FAIL/PARTIAL + 1 PASS/category
- [ ] Confirm RT-025..034 verdicts ready for release-readiness synthesis
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual | 37 playbook scenarios | cli-devin SWE-1.6 |
| Inspection | script JSON output | `node *.cjs` + `python3` assert + exit code |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-devin SWE-1.6 auth | External | Pending pre-flight | All dispatch blocked |
| deep-agent-improvement scripts | Internal | Present | Scenarios fail |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A dispatch mutates live state unexpectedly (notably the 08 sandbox).
- **Procedure**: This is a read-mostly inspection run; the 08--agent-discipline sandbox is the only mutable surface and is torn down after. Discard `scratch/` logs if corrupted and re-dispatch.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Dispatch & Capture (category batches, sequential; 08 sandboxed last) ──► Verification ──► release-readiness synthesis
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Dispatch |
| Dispatch | Setup | Verification |
| Verification | Dispatch | Release-readiness synthesis (RT release gate) |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 15-30 min |
| Dispatch & Capture | Med | 2-3 hours (8 batches) |
| Verification | Med | 30-60 min |
| **Total** | | **~3-4 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] No `--permission-mode dangerous` unless operator-authorized
- [ ] `scratch/` is the only write target (08 sandbox is ephemeral, torn down)

### Rollback Procedure
1. SIGKILL any live `devin` dispatch (`pkill -9 -f "devin --print"`)
2. Tear down any `setup-cp-sandbox.sh` fixtures left by the 08 batch
3. Discard corrupted `scratch/` logs
4. Re-dispatch the affected category

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A (read-mostly; 08 sandbox ephemeral)
<!-- /ANCHOR:enhanced-rollback -->
