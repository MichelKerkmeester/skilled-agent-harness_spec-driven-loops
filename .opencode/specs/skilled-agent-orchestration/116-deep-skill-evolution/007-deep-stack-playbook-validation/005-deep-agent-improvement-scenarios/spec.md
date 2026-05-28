---
title: "Feature Specification: Deep-Agent-Improvement Scenarios (Deep-Loop Playbook 005)"
description: "Run the 37 deep-agent-improvement manual testing playbook scenarios via cli-devin SWE-1.6 and capture per-scenario PASS/PARTIAL/FAIL/SKIP evidence."
trigger_phrases:
  - "deep-agent-improvement scenarios"
  - "deep agent improvement playbook run"
  - "007 phase 005 deep-agent-improvement"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-skill-evolution/007-deep-stack-playbook-validation/005-deep-agent-improvement-scenarios"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffold phase 005 spec + 37-scenario verdict ledger"
    next_safe_action: "Run CLI auth pre-flight, then dispatch 01--integration-scanner category batch to SWE-1.6"
    blockers: []
    key_files:
      - ".opencode/skills/deep-agent-improvement/manual_testing_playbook/manual_testing_playbook.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-2026-05-27-deep-loop-playbook"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Deep-Agent-Improvement Scenarios (Deep-Loop Playbook 005)

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
`deep-agent-improvement` is the evaluator-first bounded agent improvement skill (integration scanner, dynamic profile generator, 5-dimension scorer, benchmark integration, dimensional reducer/dashboard, end-to-end loop, runtime-truth surfaces, and agent-discipline stress tests). Unlike the inspection-only siblings, its scenarios are **script-invocation based**: each runs a `node .opencode/skills/deep-agent-improvement/scripts/scan-integration.cjs ...` (or sibling `.cjs`) entry point and pipes the emitted JSON into `python3` assertions, corroborated by process exit codes. Its 37-scenario playbook has no captured operator run. This skill is independent (no hard gate on other phases) and can evaluate any agent.

### Purpose
Execute all 37 `deep-agent-improvement` scenarios via `cli-devin` SWE-1.6 (deterministic `node` script invocation piped to `python3` JSON assertions, with exit-code corroboration), record a verdict + evidence per scenario, and surface the runtime-truth category (07) release gate so no downstream false-green is recorded for the packet's release-readiness synthesis.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- All 37 scenarios across 8 categories (integration-scanner, profile-generator, 5d-scorer, benchmark-integration, reducer-dimensions, end-to-end-loop, runtime-truth, agent-discipline stress tests).
- Dispatch via `cli-devin` `--model swe-1.6` (free tier), one category batch per dispatch.
- Script-invocation harness: `node scripts/*.cjs` output piped to `python3` JSON assertions plus exit-code checks.

### Out of Scope
- Scenarios for the other four skills (phases 001-004).
- Fixing defects in place (a confirmed FAIL spawns a `007+` remediation child).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scratch/prompts/*.md` | Create | Rendered RCAF dispatch prompts per category batch |
| `scratch/logs/*.log` | Create | Captured dispatch stdout/stderr |
| `checklist.md` (ledger) | Update | 37-scenario verdict ledger filled during execution |
| `implementation-summary.md` | Create | Final verdict rollup (added when execution starts) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 37 scenarios dispatched and a verdict recorded | 37 ledger rows, each PASS/PARTIAL/FAIL/SKIP with one reason |
| REQ-002 | Each verdict cites command + evidence excerpt + anchor file:line | Ledger row links to a `scratch/logs/*` excerpt |
| REQ-003 | Runtime-truth category (07, RT-025..034) executed or explicitly SKIP-with-blocker | Each RT verdict captured before release-readiness synthesis |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Single-dispatch discipline honored | One `cli-*` dispatch at a time, killed before next |
| REQ-005 | Orchestrator spot-verifies negatives | All FAIL/PARTIAL + 1 PASS sample per category independently re-run |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 37/37 deep-agent-improvement scenarios have a recorded verdict with evidence.
- **SC-002**: Any FAIL is logged with reproducing command + excerpt, not silently fixed.
- **SC-003 (critical)**: Runtime-truth RT-025..034 (category 07) are executed or explicitly SKIPPED with a blocker — never silently omitted, per the playbook release rule.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `cli-devin` SWE-1.6 auth (free tier) | Blocks dispatch | Confirm at pre-flight (`devin auth status`) |
| Risk | `node`/`python3` script harness slower than plain `rg`/`sed` | Longer batches | Batch by category; allow ≥15-min timeouts |
| Risk | Runtime-truth (07) silently skipped | False-green at release synthesis | Enforce execute-or-SKIP-with-blocker per playbook release rule |
| Risk | Agent-discipline stress tests (08) mutate sandbox state | Cross-test contamination | Run last, isolated via `setup-cp-sandbox.sh`, cleanup after |
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
- Missing candidate file (5D-013): expects `infra_failure`, not a crash.
- Benchmark without integration report (BI-014): expects graceful normal-dashboard output, not an error.

### Error Scenarios
- Dispatch hang: SIGKILL `devin`, record SKIP with reason, retry once.
- Sandbox leak (08--agent-discipline): tear down `setup-cp-sandbox.sh` fixtures before recording FAIL; never leave sandbox artifacts behind.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | 37 scenarios, 8 category batches |
| Risk | 13/25 | Script-invocation run; sandboxed stress tests + runtime-truth release gate |
| Research | 8/20 | Playbook + scripts already understood |
| **Total** | **39/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Batch granularity: one dispatch per category (default) vs combining the smaller categories (03/04).
<!-- /ANCHOR:questions -->
