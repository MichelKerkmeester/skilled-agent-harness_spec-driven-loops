---
title: "Feature Specification: Manual Testing Playbook Execution Sweep"
description: "Execute all 485 manual testing playbook scenarios across system-spec-kit, system-code-graph, and system-skill-advisor via real GPT-5.5-fast (medium) dispatches, writing real evidence into each scenario's own Evidence section."
trigger_phrases:
  - "manual playbook execution sweep"
  - "run all manual testing playbooks"
  - "gpt-5.5 medium playbook run"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/000-release-cleanup/015-manual-playbook-execution-sweep"
    last_updated_at: "2026-07-04T17:31:31.098Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Scaffolded spec folder, built the 485-scenario manifest"
    next_safe_action: "Begin wave 1 of 10-concurrent GPT-5.5-fast dispatches"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "manifest.tsv"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-02-031-manual-playbook-sweep"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Scope: all 3 subsystems, exhaustive (all 485 scenarios, not sampled) -- operator directive."
      - "Parallelism: 10 concurrent GPT-5.5-fast (medium) dispatches per wave -- operator directive."
      - "Evidence handling: write real evidence into each scenario file's own Evidence section in place, not a separate report-only summary -- operator directive."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

This packet runs every manual testing playbook scenario across the three system-level subsystems (spec-kit, code-graph, skill-advisor) that were verified via automated stress tests in prior work this session. Each scenario is dispatched to GPT-5.5-fast (medium reasoning) via `cli-opencode`, which executes the scenario's own documented Commands against the real repo, then writes real evidence and a PASS/FAIL verdict into that scenario's own Evidence section.

**Key Decisions**: Execute all 485 scenarios exhaustively (no sampling), 10 concurrent dispatches per wave, real in-place evidence writes rather than a separate summary-only report.

**Critical Dependencies**: `cli-opencode` (openai/gpt-5.5-fast provider must be configured and authenticated); each scenario's own preconditions (fixtures, DB state) must be independently satisfiable per-dispatch since scenarios run concurrently, not sequentially.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-07-02 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | `../description.json` |
| **Parent Packet** | `system-speckit/028-memory-search-intelligence` |
| **Phase** | 014 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Automated stress tests confirm code-level behavior under load, but manual testing playbooks exist specifically to validate operator-facing, end-to-end scenarios (MCP tool call sequences, CLI invocations, degraded-mode behavior) that stress tests don't cover. As of this packet's creation, none of the 485 scenarios across the three subsystems have documented, current execution evidence -- their Evidence sections are template placeholders.

### Purpose

Produce real, current, evidence-backed PASS/FAIL verdicts for all 485 manual testing playbook scenarios, written into each scenario's own Evidence section, so the playbook catalog reflects actual verified behavior rather than untested documentation.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- All 412 scenarios under `.opencode/skills/system-spec-kit/manual_testing_playbook/` (26 category folders)
- All 26 scenarios under `.opencode/skills/system-code-graph/manual_testing_playbook/`
- All 47 scenarios under `.opencode/skills/system-skill-advisor/manual_testing_playbook/`
- Writing real execution evidence into each scenario's own Evidence section
- A consolidated final report summarizing pass/fail/blocked counts per subsystem and category

### Out of Scope

- Fixing bugs found during execution -- findings are recorded as evidence with a FAIL verdict; fixing them is a separate, explicitly-scoped follow-up per this session's established pattern (matching how the stress-test bug fixes were separately scoped and confirmed)
- Modifying the playbook template structure itself
- The stray `manual_testing_playbook/.opencode/node_modules/` directory discovered under system-spec-kit during scenario enumeration (unrelated repo hygiene issue, noted but not addressed here)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/manual_testing_playbook/**/*.md` (412 files) | Modify | Evidence section filled with real execution output |
| `.opencode/skills/system-code-graph/manual_testing_playbook/**/*.md` (26 files) | Modify | Evidence section filled with real execution output |
| `.opencode/skills/system-skill-advisor/manual_testing_playbook/**/*.md` (47 files) | Modify | Evidence section filled with real execution output |
| `manifest.tsv` (this folder) | Create | Per-scenario dispatch tracking manifest |
| `implementation-summary.md` (this folder) | Modify | Final consolidated pass/fail report |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every one of the 485 scenarios is dispatched and produces a real evidence write | Manifest shows 485/485 with a non-placeholder Evidence section per scenario |
| REQ-002 | Dispatches run in waves of exactly 10 concurrent, not more, not sequential | Batch launch logs show 10 concurrent PIDs per wave |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Findings (FAILs) are not silently dropped | Consolidated report lists every FAIL with its scenario path and evidence |
| REQ-004 | Execution is resumable if interrupted | Manifest tracks per-scenario dispatch state so a restart skips already-completed scenarios |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 485 scenario files have a real, non-placeholder Evidence section and an explicit PASS/FAIL/BLOCKED verdict.
- **SC-002**: A consolidated `implementation-summary.md` reports totals per subsystem and category, with every FAIL/BLOCKED scenario named explicitly.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | 10 concurrent scenarios sharing the same live DB/workspace could race or corrupt shared state | High | Instruct each dispatch to use disposable/temp fixtures per its own scenario contract, matching the isolation pattern already established in the stress test suites |
| Risk | A single scenario dispatch hangs, stalling its wave slot | Medium | Per-dispatch timeout with orphan detection, matching this session's established `nohup`+`ps`-check monitoring pattern |
| Risk | GPT-5.5-fast misreports a PASS without real evidence (self-report not verified) | High | Spot-check a sample of PASS verdicts per subsystem against real repeatable commands before accepting the full sweep as complete |
| Dependency | `opencode providers` must have `openai` configured and authenticated | Dispatch fails immediately without it; pre-flight check before wave 1 |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No hard latency target; this is a bounded batch sweep, not a live-serving path. Wall-clock is expected to span multiple hours across ~49 waves.

### Security
- **NFR-S01**: No destructive operations against the live repo beyond the intended Evidence-section writes; scenarios that would mutate shared state must use disposable fixtures.

### Reliability
- **NFR-R01**: A crashed or orphaned dispatch must not silently mark its scenario complete; the manifest only marks a scenario done when real evidence content is confirmed written.

---

## 8. EDGE CASES

### Data Boundaries
- A scenario with missing/broken preconditions in the current repo state (e.g., references a file that no longer exists): recorded as BLOCKED with the specific missing precondition, not silently skipped.

### Error Scenarios
- `opencode run` dispatch fails to launch (auth/provider issue): entire sweep halts at wave boundary, reported before continuing, not silently retried indefinitely.
- A scenario's Commands section references a tool/flag that no longer exists in the current codebase: recorded as FAIL with the specific drift noted, not silently marked N/A.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | Files: 488 (485 scenarios + manifest + summary), LOC: large aggregate across many small edits, Systems: 3 (spec-kit, code-graph, skill-advisor) |
| Risk | 10/25 | Auth: N, API: N (internal MCP surfaces), Breaking: N (evidence-only writes, no production code touched) |
| Research | 5/20 | Scenario contracts already well-documented per-file; no new investigation needed |
| Multi-Agent | 12/15 | 10-concurrent-dispatch batching across ~49 waves |
| Coordination | 8/15 | Cross-subsystem manifest tracking, resumability |
| **Total** | **57/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Concurrent scenarios racing on shared live DB state | High | Medium | Per-dispatch temp fixture isolation instruction |
| R-002 | Self-reported PASS verdicts not independently verified | High | Medium | Spot-check sample per subsystem before final acceptance |
| R-003 | Multi-hour operation interrupted mid-sweep | Medium | Medium | Resumable manifest, wave-boundary checkpointing |

---

## 11. USER STORIES

### US-001: Operator trusts the playbook catalog reflects real, current behavior (Priority: P0)

**As an** operator relying on the manual testing playbooks for release confidence, **I want** every scenario's Evidence section to reflect a real, recent execution against the current codebase, **so that** I'm not trusting stale or template-placeholder documentation.

**Acceptance Criteria**:
1. Given any of the 485 scenario files, When I read its Evidence section, Then it contains real, dated, specific execution output, not a template placeholder.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None blocking. Scope, parallelism, and evidence-handling were all explicitly confirmed by the operator before execution began.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Scenario manifest**: See `manifest.tsv`
- **Findings remediation (fix planning, updated dynamically as FAILs are confirmed)**: See `001-findings-remediation/spec.md`
