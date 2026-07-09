---
title: "Feature Specification: 101/006 Council Graph Value-Scenario Automation"
description: "Promote the 6 operator A/B value-comparison scenarios (DAC-027..DAC-032) from contract-only docs into CI-protected vitest tests that measure no-graph baseline vs with-graph effort, plus ship a fixture-seeder script for operator reproducibility."
trigger_phrases:
  - "council graph value automation"
  - "DAC-027 vitest"
  - "value-scenario fixtures"
  - "101/006"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/005-deep-multi-ai-council-skill/006-council-graph-value-scenario-automation"
    last_updated_at: "2026-05-11T09:25:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored 006 spec for value-scenario automation"
    next_safe_action: "Dispatch cli-codex gpt-5.5 high fast for implementation"
    blockers: []
    key_files:
      - .opencode/skills/system-spec-kit/mcp_server/tests/council-graph-value-scenarios.vitest.ts
      - .opencode/skills/system-spec-kit/mcp_server/tests/fixtures/council-value/
      - .opencode/skills/system-spec-kit/scripts/seed-council-value-fixture.cjs
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "101-006-value-scenario-automation"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions:
      - "Value scenarios use fixture-driven vitest with measured baseline vs graph metrics."
      - "Implementation dispatched to cli-codex gpt-5.5 high fast per user direction."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: 101/006 Council Graph Value-Scenario Automation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-11 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` (101 phase parent) |
| **Phase** | 6 of 6 |
| **Predecessor** | `005-deep-ai-council-fixups-and-graph-value-scenarios` |
| **Successor** | None |
| **Handoff Criteria** | DAC-027..DAC-032 vitest tests pass with measured baseline vs graph metrics written to JSON report |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 005 shipped 6 value-comparison scenarios DAC-027..DAC-032 that contrast the no-graph operator workflow with the with-graph MCP workflow on real-world council situations. The scenarios are operator-driven contracts only — they cannot regress automatically, and the "12 file reads vs 1 MCP call" claim is representative, not measured. A reviewer cannot today answer "is the value claim still true after a graph code change?" without re-running the scenarios by hand.

### Purpose
Automate the 6 value scenarios as fixture-driven vitest tests that (1) seed a sandbox graph + artifact tree, (2) execute both workflows programmatically, (3) assert the graph returns the expected answer, and (4) measure the real ratio of baseline file-reads to graph MCP calls. Ship a companion fixture-seeder script so operators can reproduce the sandbox sessions in seconds without hand-constructing seed payloads.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create `mcp_server/tests/council-graph-value-scenarios.vitest.ts` with 6 fixture-driven tests, one per DAC-027..DAC-032.
- Create per-scenario fixture modules under `mcp_server/tests/fixtures/council-value/dac-{027..032}.ts` that export seed payloads + expected query results + baseline-effort thresholds.
- Create shared seed helpers at `mcp_server/tests/fixtures/council-value/seed-helpers.ts` (graph upsert wrapper, artifact-tree creator, baseline file-read counter).
- Create operator fixture-seeder script at `scripts/seed-council-value-fixture.cjs` accepting `--scenario DAC-027 --spec-folder sandbox/dac-027`.
- Write measured baseline-vs-graph metrics per scenario to `mcp_server/tests/council-graph-value-report.json` during test runs.
- Update each DAC-027..DAC-032 playbook scenario with an "Automated test anchor" line referencing the new vitest.
- Update root playbook `manual_testing_playbook.md` §16 AUTOMATED TEST CROSS-REFERENCE with a new row mapping the new vitest → DAC-027..DAC-032.

### Out of Scope
- Changing the `council_graph_*` MCP tool surface or any graph code.
- Modifying any 101-001..005 spec packets except parent 101 phase map.
- Adding feature catalog entries (pre-existing TODO from packet 002).
- Adding a real council deliberation engine — fixtures simulate council state directly via upserts.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/tests/council-graph-value-scenarios.vitest.ts` | Create | 6 fixture-driven tests for DAC-027..DAC-032 |
| `.opencode/skills/system-spec-kit/mcp_server/tests/fixtures/council-value/dac-{027..032}.ts` | Create | Per-scenario seed + expectations modules |
| `.opencode/skills/system-spec-kit/mcp_server/tests/fixtures/council-value/seed-helpers.ts` | Create | Shared seeding utilities |
| `.opencode/skills/system-spec-kit/scripts/seed-council-value-fixture.cjs` | Create | Operator fixture-seeder CLI |
| `.opencode/skills/deep-ai-council/manual_testing_playbook/09--council-graph-value-comparison/*.md` | Modify | Add "Automated test anchor" line per scenario |
| `.opencode/skills/deep-ai-council/manual_testing_playbook/manual_testing_playbook.md` | Modify | §16 cross-ref row for new vitest |
| Parent 101 `spec.md` + `graph-metadata.json` | Modify | Add phase 006 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | New vitest file passes 6/6 | `npx vitest run tests/council-graph-value-scenarios.vitest.ts` returns 6 tests passed, 0 failures |
| REQ-002 | Each scenario measures baseline vs graph effort | JSON report contains `baselineFileReads`, `graphMcpCalls`, `ratio` per scenario |
| REQ-003 | DAC-029 (safety scenario) asserts STOP_BLOCKED branch fires | Test seeds 2-of-3 agreement + 1 critical unresolved → asserts `decision === 'STOP_BLOCKED'` |
| REQ-004 | Operator seeder script works standalone | `node scripts/seed-council-value-fixture.cjs --scenario DAC-027 --spec-folder sandbox/dac-027` writes the seed payload + artifact tree |
| REQ-005 | Full 8-file council vitest matrix passes | `npx vitest run` across 7 existing + 1 new vitest files returns 0 failures |
| REQ-006 | Each DAC-027..DAC-032 scenario file gains an "Automated test anchor" line | Grep finds line in each of 6 files |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Strict spec validation passes on packet 006 + parent 101 | `validate.sh --strict` exit 0 for both |
| REQ-008 | sk-doc quick_validate.py passes on deep-ai-council skill root | Exit 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: After this packet, a reviewer can run one vitest command and see whether all 6 value claims still hold.
- **SC-002**: The "12× fewer reads" style claims become measured ratios visible in `council-graph-value-report.json`.
- **SC-003**: An operator can seed any of the 6 scenarios into a real sandbox in one CLI command instead of hand-constructing upsert payloads.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 003 graph implementation + Phase 005 scenario authoring | None — both complete | n/a |
| Risk | Fixture seed payloads drift from real council artifact shape | Medium | Seed helpers go through the same `council_graph_upsert` handler the runtime uses; baseline artifact-tree mirror is minimal but realistic |
| Risk | Measured ratios fluctuate with fixture changes | Low | Report is informational; tests assert behavior, not exact ratios |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. User approved scope; implementation routed to cli-codex gpt-5.5 high fast.
<!-- /ANCHOR:questions -->
