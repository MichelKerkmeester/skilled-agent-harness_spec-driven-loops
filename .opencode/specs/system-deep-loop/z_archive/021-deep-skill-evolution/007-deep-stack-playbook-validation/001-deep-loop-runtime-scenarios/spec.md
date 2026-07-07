---
title: "Feature Specification: Deep-Loop Runtime Scenarios (Deep-Loop Playbook 001)"
description: "Run the 22 deep-loop-runtime manual testing playbook scenarios via cli-devin SWE-1.6 and capture per-scenario PASS/PARTIAL/FAIL/SKIP evidence."
trigger_phrases:
  - "deep-loop-runtime scenarios"
  - "deep loop runtime playbook run"
  - "007 phase 001 deep-loop-runtime"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/021-deep-skill-evolution/007-deep-stack-playbook-validation/001-deep-loop-runtime-scenarios"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffold phase 001 spec + 22-scenario verdict ledger"
    next_safe_action: "Run CLI auth pre-flight, then dispatch 01--executor category batch to SWE-1.6"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/manual_testing_playbook/manual_testing_playbook.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-2026-05-27-deep-loop-playbook"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Deep-Loop Runtime Scenarios (Deep-Loop Playbook 001)

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
`deep-loop-runtime` is the shared foundation for the other four deep-loop skills (executor, prompt-pack, post-dispatch validation, atomic state, JSONL repair, loop lock, permissions gate, Bayesian scorer, coverage-graph DB/query/signals, the four `.cjs` script entry points, and council durability). Its 22-scenario playbook has no captured operator run. Because `deep-ai-council` DAC-019..032 reference this skill's council-graph and script surfaces, the runtime must be validated first.

### Purpose
Execute all 22 `deep-loop-runtime` scenarios via `cli-devin` SWE-1.6 (deterministic `rg`/`sed`/`node`/Vitest inspection), record a verdict + evidence per scenario, and gate the council-dependent categories (06/07/08) so a downstream false-green is not recorded in phase 002.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- All 22 scenarios DLR-001..022 across 8 categories (executor, prompt-rendering, validation, state-safety, scoring, coverage-graph, script-entry-points, council).
- Dispatch via `cli-devin` `--model swe-1.6` (free tier), one category batch per dispatch.
- One-time CLI auth pre-flight (`devin auth status`, `codex auth status`) hosted in this foundational phase.

### Out of Scope
- Scenarios for the other four skills (phases 002-005).
- Fixing defects in place (a confirmed FAIL spawns a `007+` remediation child).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scratch/prompts/*.md` | Create | Rendered RCAF dispatch prompts per category batch |
| `scratch/logs/*.log` | Create | Captured dispatch stdout/stderr |
| `checklist.md` (ledger) | Update | 22-scenario verdict ledger filled during execution |
| `implementation-summary.md` | Create | Final verdict rollup (added when execution starts) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 22 scenarios dispatched and a verdict recorded | 22 ledger rows, each PASS/PARTIAL/FAIL/SKIP with one reason |
| REQ-002 | Each verdict cites command + evidence excerpt + anchor file:line | Ledger row links to a `scratch/logs/*` excerpt |
| REQ-003 | Council/coverage-graph/script categories (06/07/08) gated | Their verdicts captured before phase 002 DAC-019..032 begins |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Single-dispatch discipline honored | One `cli-*` dispatch at a time, killed before next |
| REQ-005 | Orchestrator spot-verifies negatives | All FAIL/PARTIAL + 1 PASS sample per category independently re-run |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 22/22 runtime scenarios have a recorded verdict with evidence.
- **SC-002**: Any FAIL is logged with reproducing command + excerpt, not silently fixed.
- **SC-003**: Coverage-graph/script/council verdicts available to gate phase 002.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `cli-devin` SWE-1.6 auth (free tier) | Blocks dispatch | Confirm at pre-flight (`devin auth status`) |
| Risk | Vitest scenarios slower than `rg`/`sed` | Longer batches | Batch by category; allow ≥15-min timeouts |
| Risk | A runtime FAIL silently propagates to council phase | False-green in 002 | Gate 06/07/08 verdicts before DAC-019..032 |
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
- Empty/corrupt JSONL state (DLR-007): expects skip-with-defaults, not a crash.
- Loop-lock contention (DLR-008): expects single-owner lease, not double-run.

### Error Scenarios
- Dispatch hang: SIGKILL `devin`, record SKIP with reason, retry once.
- Vitest flake: re-run the single decisive test before recording FAIL.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | 22 scenarios, 8 category batches |
| Risk | 12/25 | Read-mostly inspection; foundational gate |
| Research | 8/20 | Playbook + runtime already understood |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Batch granularity: one dispatch per category (default) vs combining the small single-scenario categories (02/03/05).
<!-- /ANCHOR:questions -->
