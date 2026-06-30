---
title: "Feature Specification: Deep-Review Scenarios (Deep-Loop Playbook 003)"
description: "Run the 45 deep-review manual testing playbook scenarios via cli-devin SWE-1.6 and capture per-scenario PASS/PARTIAL/FAIL/SKIP evidence."
trigger_phrases:
  - "deep-review scenarios"
  - "deep review playbook run"
  - "007 phase 003 deep-review"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-skill-evolution/007-deep-stack-playbook-validation/003-deep-review-scenarios"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffold phase 003 spec + 45-scenario verdict ledger"
    next_safe_action: "Run CLI auth pre-flight, then dispatch 01--entry-points-and-modes category batch to SWE-1.6"
    blockers: []
    key_files:
      - ".opencode/skills/deep-review/manual_testing_playbook/manual_testing_playbook.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-2026-05-27-deep-loop-playbook"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Deep-Review Scenarios (Deep-Loop Playbook 003)

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
`deep-review` is the autonomous iterative code-review loop built on the shared `deep-loop-runtime`: it owns review entry points and modes, canonical state initialization, per-iteration state discipline (read-before-review, three-artifact write contract, dimension rotation), convergence and recovery gates, pause/resume fault-tolerance, synthesis-save guardrails, and the review-depth v2 validator/reducer rollout. Its 45-scenario playbook has no captured operator run. The command-flow stress tests (CP-052..057) exercise a sandboxed end-to-end flow and must be quarantined so they cannot disturb live state during validation.

### Purpose
Execute all 45 `deep-review` scenarios via `cli-devin` SWE-1.6 (deterministic `rg`/`sed` inspection for most categories; sandboxed stress tests for 07), record a verdict + evidence per scenario, and keep the sandboxed command-flow category isolated so a stress-test side effect does not corrupt the validation packet or surrounding state.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- All 45 scenarios across 8 categories (entry-points-and-modes, initialization-and-state-setup, iteration-execution-and-state-discipline, convergence-and-recovery, pause-resume-and-fault-tolerance, synthesis-save-and-guardrails, command-flow-stress-tests, review-depth-v2-rollout).
- Dispatch via `cli-devin` `--model swe-1.6` (free tier), one category batch per dispatch.
- One-time CLI auth pre-flight (`devin auth status`, `codex auth status`) reuse from the foundational phase.

### Out of Scope
- Scenarios for the other deep-loop skills (sibling phases).
- Fixing defects in place (a confirmed FAIL spawns a remediation child).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scratch/prompts/*.md` | Create | Rendered RCAF dispatch prompts per category batch |
| `scratch/logs/*.log` | Create | Captured dispatch stdout/stderr |
| `checklist.md` (ledger) | Update | 45-scenario verdict ledger filled during execution |
| `implementation-summary.md` | Create | Final verdict rollup (added when execution starts) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 45 scenarios dispatched and a verdict recorded | 45 ledger rows, each PASS/PARTIAL/FAIL/SKIP with one reason |
| REQ-002 | Each verdict cites command + evidence excerpt + anchor file:line | Ledger row links to a `scratch/logs/*` excerpt |
| REQ-003 | Sandboxed command-flow category (07) run last, in isolation | CP-052..057 executed against `/tmp/cp-deep-review-sandbox` only, cleaned up after |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Single-dispatch discipline honored | One `cli-*` dispatch at a time, killed before next |
| REQ-005 | Orchestrator spot-verifies negatives | All FAIL/PARTIAL + 1 PASS sample per category independently re-run |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 45/45 deep-review scenarios have a recorded verdict with evidence.
- **SC-002**: Any FAIL is logged with reproducing command + excerpt, not silently fixed.
- **SC-003**: Critical-path scenarios DRV-001, DRV-005, DRV-008, DRV-009, DRV-017, DRV-027 are PASS (or any FAIL escalated), since they cover kickoff, resume classification, the read/write iteration contract, the P0 convergence override, and final synthesis save.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `cli-devin` SWE-1.6 auth (free tier) | Blocks dispatch | Confirm at pre-flight (`devin auth status`) |
| Risk | Sandboxed stress tests (CP-052..057) mutate state | Could corrupt the live packet or surrounding files | Run category 07 LAST, in isolation; orchestrator runs `setup-cp-sandbox.sh`, dispatch is pinned to `/tmp/cp-deep-review-sandbox`, cleanup after |
| Risk | Inherits deep-loop-runtime executor but runs independently | Hidden coupling assumed | No hard gate on phase 001; validate deep-review surfaces on their own evidence |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: One dispatch per category; sub-split only if a batch exceeds ~60K tokens.

### Security
- **NFR-S01**: No secrets in dispatch prompts; spec folder passed as pre-approved.

### Reliability
- **NFR-R01**: Each dispatch captured with `2>&1 </dev/null`; malformed verdict tables re-dispatched once.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Malformed/empty JSONL review lines (DRV-023): expects skip-with-defaults, not a crash.
- Reducer corruption / missing anchors (DRV-034): expects fail-closed, not silent pass.

### Error Scenarios
- Dispatch hang: SIGKILL `devin`, record SKIP with reason, retry once.
- Sandbox stress-test side effect: confine to `/tmp/cp-deep-review-sandbox`; tear down the sandbox dir after category 07, never run it interleaved with other batches.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | 45 scenarios, 8 category batches |
| Risk | 14/25 | Read-mostly inspection; sandboxed stress-test category |
| Research | 8/20 | Playbook + deep-review loop already understood |
| **Total** | **42/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Batch granularity: one dispatch per category (default) vs combining the smaller categories (04 convergence sub-groups) — 07 stays isolated regardless.
<!-- /ANCHOR:questions -->
