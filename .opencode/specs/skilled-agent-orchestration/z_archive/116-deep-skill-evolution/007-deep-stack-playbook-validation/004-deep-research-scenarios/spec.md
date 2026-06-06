---
title: "Feature Specification: Deep-Research Scenarios (Deep-Loop Playbook 004)"
description: "Run the 41 deep-research manual testing playbook scenarios via cli-devin SWE-1.6 and capture per-scenario PASS/PARTIAL/FAIL/SKIP evidence."
trigger_phrases:
  - "deep-research scenarios"
  - "deep research playbook run"
  - "007 phase 004 deep-research"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-skill-evolution/007-deep-stack-playbook-validation/004-deep-research-scenarios"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffold phase 004 spec + 41-scenario verdict ledger"
    next_safe_action: "Run CLI auth pre-flight, then dispatch 01--entry-points-and-modes category batch to SWE-1.6"
    blockers: []
    key_files:
      - ".opencode/skills/deep-research/manual_testing_playbook/manual_testing_playbook.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-2026-05-27-deep-loop-playbook"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Deep-Research Scenarios (Deep-Loop Playbook 004)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft (scaffolded) |
| **Created** | 2026-05-27 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`deep-research` is the autonomous iterative-investigation loop built on the shared `deep-loop-runtime` foundation (executor, prompt-pack, post-dispatch validation, atomic state, JSONL repair, pause sentinel, convergence detection, quality guards, graph-aware stop gates, progressive synthesis, dashboard, and the command-flow surface). Its 41-scenario playbook has no captured operator run. The skill inherits the deep-loop-runtime executor but runs independently, so its entry points, state discipline, convergence/recovery logic, fault tolerance, synthesis guardrails, and command-flow bindings must each be exercised on their own evidence.

### Purpose
Execute all 41 `deep-research` scenarios via `cli-devin` SWE-1.6 (deterministic `rg`/`sed` inspection for the analysis categories, sandboxed `setup-cp-sandbox.sh` runs for the command-flow stress tests), record a verdict + evidence per scenario, and keep the SANDBOXED command-flow category isolated and run last so a stress-test side effect cannot contaminate the deterministic inspection results.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- All 41 scenarios (DR-001..035 + CP-046..051) across 7 categories (entry-points-and-modes, initialization-and-state-setup, iteration-execution-and-state-discipline, convergence-and-recovery, pause-resume-and-fault-tolerance, synthesis-save-and-guardrails, command-flow-stress-tests).
- Dispatch via `cli-devin` `--model swe-1.6` (free tier), one category batch per dispatch.
- One-time CLI auth pre-flight reuse from the foundational phase (`devin auth status`, `codex auth status`).

### Out of Scope
- Scenarios for the other four skills (phases 001, 002, 003, 005).
- Fixing defects in place (a confirmed FAIL spawns a `007+` remediation child).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scratch/prompts/*.md` | Create | Rendered RCAF dispatch prompts per category batch |
| `scratch/logs/*.log` | Create | Captured dispatch stdout/stderr |
| `checklist.md` (ledger) | Update | 41-scenario verdict ledger filled during execution |
| `implementation-summary.md` | Create | Final verdict rollup (added when execution starts) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 41 scenarios dispatched and a verdict recorded | 41 ledger rows, each PASS/PARTIAL/FAIL/SKIP with one reason |
| REQ-002 | Each verdict cites command + evidence excerpt + anchor file:line | Ledger row links to a `scratch/logs/*` excerpt |
| REQ-003 | Command-flow stress tests (07) run last and sandboxed | CP-046..051 confined to `/tmp/cp-deep-research-sandbox`, cleaned up after |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Single-dispatch discipline honored | One `cli-*` dispatch at a time, killed before next |
| REQ-005 | Orchestrator spot-verifies negatives | All FAIL/PARTIAL + 1 PASS sample per category independently re-run |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 41/41 deep-research scenarios have a recorded verdict with evidence.
- **SC-002**: Any FAIL is logged with reproducing command + excerpt, not silently fixed.
- **SC-003**: Command-flow stress tests complete in isolation with no leakage into the deterministic inspection categories.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `cli-devin` SWE-1.6 auth (free tier) | Blocks dispatch | Confirm at pre-flight (`devin auth status`) |
| Risk | 04--convergence-and-recovery is large (13 scenarios) | Long batch / token pressure | Sub-split into two dispatches if it exceeds ~60K tokens |
| Risk | Command-flow stress tests (CP-046..051) run live via `setup-cp-sandbox.sh` | Side effects leak into deterministic results | Run the 07 category LAST, isolated to `/tmp/cp-deep-research-sandbox`, cleanup after |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: One dispatch per category; sub-split (notably 04) only if a batch exceeds ~60K tokens.

### Security
- **NFR-S01**: No secrets in dispatch prompts; spec folder passed as pre-approved.

### Reliability
- **NFR-R01**: Each dispatch captured with `2>&1 </dev/null`; malformed verdict tables re-dispatched once.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Malformed JSONL lines (DR-017): expects skip-with-defaults, not a crash.
- JSONL reconstruction from iteration files (DR-018): expects rebuild, not data loss.

### Error Scenarios
- Dispatch hang: SIGKILL `devin`, record SKIP with reason, retry once.
- Command-flow stress tests (07/CP-046..051): SANDBOXED — provisioned via `setup-cp-sandbox.sh`, confined to `/tmp/cp-deep-research-sandbox`, run LAST, and cleaned up after the batch completes so deterministic categories stay uncontaminated.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 19/25 | 41 scenarios, 7 category batches (04 may sub-split) |
| Risk | 13/25 | Read-mostly inspection; sandboxed command-flow stress tests run last |
| Research | 8/20 | Playbook + deep-research loop already understood |
| **Total** | **40/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Batch granularity for 04--convergence-and-recovery: single dispatch (default) vs sub-split into two dispatches if token pressure is high.
<!-- /ANCHOR:questions -->
