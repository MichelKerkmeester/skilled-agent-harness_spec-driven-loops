---
title: "Feature Specification: Deep-AI-Council Scenarios (Deep-Loop Playbook 002)"
description: "Run the 32 deep-ai-council manual testing playbook scenarios via cli-devin SWE-1.6 (deterministic inspection) and cli-codex GPT-5.5 (graph-value A/B reasoning), capturing per-scenario PASS/PARTIAL/FAIL/SKIP evidence."
trigger_phrases:
  - "deep-ai-council scenarios"
  - "deep ai council playbook run"
  - "007 phase 002 deep-ai-council"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/021-deep-skill-evolution/007-deep-stack-playbook-validation/002-deep-ai-council-scenarios"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffold phase 002 spec + 32-scenario verdict ledger"
    next_safe_action: "Confirm 001 graph gate, then dispatch 01--runtime-routing-and-rename to SWE-1.6"
    blockers: []
    key_files:
      - ".opencode/skills/deep-ai-council/manual_testing_playbook/manual_testing_playbook.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-2026-05-27-deep-loop-playbook"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Deep-AI-Council Scenarios (Deep-Loop Playbook 002)

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
`deep-ai-council` is the multi-seat planning skill (seat diversity, cross-seat critique, convergence/rollback, artifact persistence, state JSONL, output-schema fail-close, five-dimension scoring, Hunter/Skeptic/Referee critique, derived graph projection, and the council-graph value comparison). Its 32-scenario playbook has no captured operator run. The council-graph categories reuse `deep-loop-runtime`'s council-graph and `.cjs` script surfaces, so those scenarios cannot be trusted until phase 001's runtime verdicts are recorded non-FAIL.

### Purpose
Execute all 32 `deep-ai-council` scenarios — the deterministic majority via `cli-devin` SWE-1.6 (`rg`/`sed` inspection) and the six graph-value A/B reasoning scenarios via `cli-codex` GPT-5.5 medium-fast — record a verdict + evidence per scenario, and hold the council-graph-dependent categories (08/09) behind phase 001's `06--coverage-graph` / `07--script-entry-points` / `08--council` gate so a downstream false-green is not recorded.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- All 32 scenarios DAC-001..032 across 9 categories (runtime-routing-and-rename, council-deliberation-and-seat-diversity, artifact-persistence-and-state-format, convergence-and-rollback, scope-boundaries, depth-and-failure-handling, writer-library-contract, council-graph-integration, council-graph-value-comparison).
- Dispatch the deterministic categories via `cli-devin` `--model swe-1.6` (free tier), one category batch per dispatch.
- Dispatch `09--council-graph-value-comparison` (DAC-027..032) via `cli-codex` `--model gpt-5.5` medium-fast as A/B "graph vs no-graph baseline" reasoning runs.

### Out of Scope
- Scenarios for the other four skills (phases 001, 003-005).
- Fixing defects in place (a confirmed FAIL spawns a `007+` remediation child).
- One-time CLI auth pre-flight — owned by foundational phase 001.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scratch/prompts/*.md` | Create | Rendered RCAF dispatch prompts per category batch |
| `scratch/logs/*.log` | Create | Captured dispatch stdout/stderr |
| `checklist.md` (ledger) | Update | 32-scenario verdict ledger filled during execution |
| `implementation-summary.md` | Create | Final verdict rollup (added when execution starts) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 32 scenarios dispatched and a verdict recorded | 32 ledger rows, each PASS/PARTIAL/FAIL/SKIP with one reason |
| REQ-002 | Each verdict cites command + evidence excerpt + anchor file:line | Ledger row links to a `scratch/logs/*` excerpt |
| REQ-003 | Council-graph categories (08/09) gated on phase 001 verdicts | 08/09 dispatch only after phase 001 06/07/08 verdicts confirmed non-FAIL |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Single-dispatch discipline honored | One `cli-*` dispatch at a time, killed before next |
| REQ-005 | Orchestrator spot-verifies negatives | All FAIL/PARTIAL + 1 PASS sample per category independently re-run |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 32/32 council scenarios have a recorded verdict with evidence.
- **SC-002**: Any FAIL is logged with reproducing command + excerpt, not silently fixed.
- **SC-003**: Categories 08/09 dispatched only after phase 001 06/07/08 verdicts confirmed non-FAIL.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 001 `06--coverage-graph` / `07--script-entry-points` / `08--council` verdicts | Blocks 08/09 dispatch | Categories 08 (DAC-019..026) and 09 (DAC-027..032) GATED on those phase 001 verdicts being non-FAIL; DAC-019..024 reference deep-loop-runtime's runtime upsert/query/convergence/status `.cjs` scripts |
| Dependency | `cli-codex` GPT-5.5 medium-fast auth | Blocks 09 A/B runs | Confirm at packet pre-flight (owned by phase 001) before 09 dispatch |
| Risk | A runtime FAIL silently propagates into council-graph verdicts | False-green in 08/09 | Confirm phase 001 06/07/08 verdicts before DAC-019..032 |
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
- Empty council input (DAC-020): runtime upsert CLI expects empty-input no-op success, not a crash.
- Hostile seat metadata (DAC-021): runtime query CLI expects redaction, not prompt-unsafe passthrough.

### Error Scenarios
- Dispatch hang: SIGKILL `devin`/`codex`, record SKIP with reason, retry once.
- Graph-value A/B ambiguity (DAC-027..032): re-run the decisive graph-vs-baseline comparison before recording FAIL.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | 32 scenarios, 9 category batches, two executors |
| Risk | 13/25 | Read-mostly inspection + gated council-graph dependency |
| Research | 8/20 | Playbook + council already understood |
| **Total** | **39/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Batch granularity: one dispatch per category (default) vs combining the small two-scenario categories (01/02/05/06).
<!-- /ANCHOR:questions -->
