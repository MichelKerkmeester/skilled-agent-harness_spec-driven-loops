---
title: "Implementation Plan: 101/006 Council Graph Value-Scenario Automation"
description: "Author fixture-driven vitest + operator seeder for DAC-027..DAC-032 via cli-codex gpt-5.5 high fast single dispatch."
trigger_phrases:
  - "101/006 plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/101-deep-multi-ai-council-skill/006-council-graph-value-scenario-automation"
    last_updated_at: "2026-05-11T09:25:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored implementation plan"
    next_safe_action: "Dispatch cli-codex"
    blockers: []
    key_files:
      - .opencode/skills/system-spec-kit/mcp_server/tests/council-graph-value-scenarios.vitest.ts
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "101-006-value-scenario-automation"
      parent_session_id: null
    completion_pct: 15
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: 101/006 Council Graph Value-Scenario Automation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (vitest fixtures), Node.js (seeder CLI) |
| **Framework** | vitest + better-sqlite3 (existing graph DB layer) |
| **Storage** | Per-test in-memory or temp SQLite + temp artifact tree |
| **Testing** | vitest + sk-doc validators + spec validate.sh --strict |

### Overview
Single cli-codex dispatch authors: one vitest file with 6 fixture-driven tests, six per-scenario fixture modules, shared seed helpers, an operator seeder CLI, and metric report writes. Each test asserts the graph returns the expected answer for its scenario, and records measured baseline-file-read vs graph-MCP-call counts.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Six scenarios documented at 101/005 with concrete seed structure
- [x] Existing `council-graph.vitest.ts` provides a reference pattern for fixture-driven tests
- [x] Graph DB + query helpers (`lib/council-graph/council-graph-{db,query}.ts`) are stable and testable

### Definition of Done
- [x] 6/6 new vitest tests pass
- [x] JSON metric report written during test runs
- [x] Operator seeder script runs standalone
- [x] Playbook scenarios reference new vitest as automated anchor
- [x] Root playbook §16 carries the new cross-ref row
- [x] Strict spec validation passes for 006 and parent 101
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fixture-driven A/B test harness. Each scenario module exports `{ seed, expectedGraphResult, baselineThreshold }`. The shared harness loads each fixture, seeds a fresh DB + artifact tree, runs both workflows, asserts equivalence, records metrics.

### Key Components
- **Per-scenario fixtures**: pure data + expectations; no shared mutable state across tests
- **Seed helpers**: thin wrappers over `upsertCouncilGraph` + `fs.mkdir`/`fs.writeFile` for the synthetic artifact tree
- **Baseline workflow runner**: counts files in the synthetic artifact tree + greps for relevant tokens (mirrors what an operator would type by hand)
- **Graph workflow runner**: calls `council_graph_query` / `council_graph_convergence` / `council_graph_status` per scenario
- **Metric writer**: appends to `council-graph-value-report.json` after each test

### Data Flow
Fixture → seed (DB + artifact tree) → run baseline → run graph → assert answer → write metrics → cleanup.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Packet 006 spec docs authored on main agent
- [x] cli-codex prompt drafted

### Phase 2: Core Implementation (cli-codex dispatch)
- [x] Author `seed-helpers.ts` shared utilities
- [x] Author 6 fixture modules `dac-{027..032}.ts`
- [x] Author `council-graph-value-scenarios.vitest.ts` runner
- [x] Author `seed-council-value-fixture.cjs` operator CLI
- [x] Update playbook scenarios with automated-anchor line
- [x] Update root playbook §16 cross-ref row

### Phase 3: Verification (main agent)
- [x] Run new vitest in isolation
- [x] Run full 8-file council vitest batch
- [x] Run sk-doc validators
- [x] Run strict spec validation
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Vitest new | 6 fixture-driven A/B tests | `npx vitest run tests/council-graph-value-scenarios.vitest.ts` |
| Vitest full | All 8 council-related files including the new one | Single batched `npx vitest run` |
| Operator seeder smoke test | `node scripts/seed-council-value-fixture.cjs --scenario DAC-027 ...` writes expected files | Manual smoke check |
| Spec validation | 006 + parent | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 003 graph implementation | Internal | Complete | n/a |
| Phase 005 scenario contracts | Internal | Complete | n/a |
| `council-graph.vitest.ts` reference pattern | Internal | Available | Used as authoring template |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: vitest fails to model the graph contract correctly, OR seeder script writes unsafe paths.
- **Procedure**: `git restore` to drop the new vitest + fixtures + seeder + playbook anchor lines. No runtime code changes, so rollback is purely additive-file removal.
<!-- /ANCHOR:rollback -->
