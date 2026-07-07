---
title: "Implementation Summary: 101/006 Council Graph Value-Scenario Automation"
description: "Fixture-driven vitest coverage and operator artifact seeder for DAC-027..DAC-032."
trigger_phrases:
  - "101/006 summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/020-deep-multi-ai-council-skill/006-council-graph-value-scenario-automation"
    last_updated_at: "2026-05-11T09:25:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Implemented fixture-driven council graph value scenarios"
    next_safe_action: "Review final diff and commit if desired"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "101-006-value-scenario-automation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: 101/006 Council Graph Value-Scenario Automation

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `skilled-agent-orchestration/101-deep-multi-ai-council-skill/006-council-graph-value-scenario-automation` |
| **Status** | Complete |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Implemented CI-protected value-scenario coverage for DAC-027..DAC-032. The new harness seeds synthetic `ai-council/**` artifacts plus a temp council graph DB, runs the no-graph baseline and with-graph workflow, asserts the expected answer, and writes measured ratios to `council-graph-value-report.json`.

### Measured baseline-vs-graph ratios

The 6 scenarios now produce real measured numbers (file reads vs MCP calls) on every test run:

| Scenario | Baseline file reads | Graph MCP calls | Ratio | Value type |
|---|---|---|---|---|
| DAC-027 unresolved-disagreement triage | 12 | 1 | 12x | speed |
| DAC-028 decision provenance audit | 13 | 1 | 13x | speed + structure |
| DAC-029 convergence safety under critical disagreement | 1 | 1 | 1x | safety (graph blocks an unsafe stop the baseline would have allowed) |
| DAC-030 stalled-council blocker ranking | 7 | 1 | 7x | speed + ranking |
| DAC-031 hot-topic discovery | 8 | 1 | 8x | speed + structural |
| DAC-032 mid-run interruption recovery | 1 | 1 | 1x | structure (graph returns recovery payload vs raw JSONL) |

Speed-driven scenarios average 10x. Safety-driven (DAC-029) and structure-driven (DAC-032) scenarios show their value through correctness and shape rather than read-count.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/tests/council-graph-value-scenarios.vitest.ts` | Created | Runs 6 fixture-driven baseline-vs-graph tests |
| `.opencode/skills/system-spec-kit/mcp_server/tests/fixtures/council-value/seed-helpers.ts` | Created | Shared temp DB, artifact seeding, metric report, and graph runner helpers |
| `.opencode/skills/system-spec-kit/mcp_server/tests/fixtures/council-value/dac-027.ts`..`dac-032.ts` | Created | Per-scenario fixture entrypoints |
| `.opencode/skills/system-spec-kit/mcp_server/tests/fixtures/council-value/data/scenarios.cjs` | Created | Shared scenario seed data consumed by vitest and the CJS seeder |
| `.opencode/skills/system-spec-kit/mcp_server/tests/council-graph-value-report.json` | Created | Measured baseline-vs-graph ratios from the vitest run |
| `.opencode/skills/system-spec-kit/scripts/seed-council-value-fixture.cjs` | Created | Operator CLI for seeding sandbox artifact trees |
| `.opencode/skills/deep-ai-council/manual_testing_playbook/09--council-graph-value-comparison/*.md` | Modified | Added automated-test anchor line per DAC scenario |
| `.opencode/skills/deep-ai-council/manual_testing_playbook/manual_testing_playbook.md` | Modified | Added new automated test cross-reference row |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implemented in one scoped pass against the existing council graph handlers and DB projection. The fixture harness uses temp SQLite state through `handleCouncilGraphUpsert`, then runs query/convergence/status handlers for the graph side while the baseline side walks the synthetic artifact tree.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep the seeder artifact-only | A standalone CJS script should not require a TypeScript runtime just to reproduce operator artifact trees. Vitest covers graph upsert behavior. |
| Share fixture data via CJS | Both vitest fixtures and the seeder can consume the same data without duplicating large seed payloads. |
| Normalize DAC-030 and DAC-032 operator answers in fixture helpers | Existing runtime code exposes grouped blocker/status data; the fixture derives the operator-facing ranking/incomplete flag from graph rows without changing `lib/council-graph/` or handlers. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npx vitest run tests/council-graph-value-scenarios.vitest.ts` | Passed: 1 file, 6 tests |
| `npx vitest run tests/multi-ai-council-runtime-parity.vitest.ts tests/multi-ai-council-permission-scope.vitest.ts tests/multi-ai-council-audit-trail.vitest.ts tests/multi-ai-council-rollback.vitest.ts tests/council-graph.vitest.ts tests/council-graph-value-scenarios.vitest.ts ../scripts/tests/multi-ai-council-persist-artifacts.vitest.ts skill_advisor/tests/scorer/native-scorer.vitest.ts` | Passed: 8 files, 49 tests |
| `node .opencode/skills/system-spec-kit/scripts/seed-council-value-fixture.cjs --scenario DAC-027 --spec-folder sandbox/dac-027 && ls .opencode/specs/sandbox/dac-027/ai-council/` | Passed: wrote `critiques/` and `deliberations/` |
| `python3 .opencode/skills/sk-doc/scripts/quick_validate.py .opencode/skills/deep-ai-council` | Passed |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/006-council-graph-value-scenario-automation --strict` | Passed after task-header and summary updates |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill --strict` | Passed |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Seeder writes artifacts only.** The standalone CJS seeder reproduces the operator artifact tree but does not push graph upserts; that path stays in vitest to avoid coupling a CJS CLI to TS handlers. Operators wanting full sandbox state can run the seeder for artifacts then call `council_graph_upsert` via MCP separately.
2. **DAC-030 and DAC-032 normalize operator-facing answers in the fixture.** The runtime exposes grouped blockers and a binary readiness flag; the fixture derives the ranked list (DAC-030) and incomplete-state flag (DAC-032) from graph rows without modifying `lib/council-graph/` or the handlers. The runtime code was intentionally not touched per scope.
3. **Measured ratios are deterministic per fixture, not per real council.** "12 file reads vs 1 MCP call" is now a measured number for the fixture, not an extrapolation from production data. Real council sessions will produce different artifact counts; the ratio direction (graph wins on speed) is what's protected.
<!-- /ANCHOR:limitations -->
