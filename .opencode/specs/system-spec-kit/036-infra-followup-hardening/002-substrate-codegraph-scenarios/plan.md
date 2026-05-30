---
title: "Implementation Plan: Substrate Code-Graph scenario tool-contract fix"
description: "Rewrite 403/404/407 from the rejected code_graph_query({query,num_results}) to the verified code_graph_context({input, queryMode}); defer the live 2nd-daemon harness wiring as flake-prone."
trigger_phrases:
  - "substrate code-graph tool-contract plan"
  - "code_graph_context playbook fix plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/036-infra-followup-hardening/002-substrate-codegraph-scenarios"
    last_updated_at: "2026-05-30T23:10:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored plan to manifest scaffold (verified schema)"
    next_safe_action: "Gate then commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/manual_testing_playbook/24--local-llm-query-intelligence/403-code-intent-matching.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003611"
      session_id: "036-002-plan"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Substrate Code-Graph scenario tool-contract fix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown manual-testing playbooks |
| **Framework** | substrate stress harness (mcp_server/stress_test/substrate) |
| **Storage** | n/a |
| **Testing** | `npm run stress:substrate` (env-limited); schema + grep verification |

### Overview
Correct the tool + param names in three playbooks so a connected Code-Graph daemon executes a valid call. The authoritative schema is in `system-code-graph/mcp_server/tool-schemas.ts`: `code_graph_query` is structural (`required: [operation, subject]`); `code_graph_context` is the semantic sibling (`required: []`, `{input, queryMode}`).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Authoritative tool schema read in system-code-graph (not the spec-kit memory tool-schemas)
- [x] Confirmed code_graph_query requires operation+subject; code_graph_context exists with input+queryMode
- [x] Per-file call-site count map produced

### Definition of Done
- [x] 403/404/407 call code_graph_context with input+queryMode; 0 stale query/num_results/code_graph_query
- [x] No regression (scenarios SKIP before and after)
- [x] Docs validate strict
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Doc correction to match a verified tool schema; no code change.

### Key Components
- **403/404/407 playbooks**: the corrected tool calls.
- **code_graph_context schema** (system-code-graph): `{input, queryMode (neighborhood/outline/impact), subject, seeds, budgetTokens, profile}`, required `[]`.
- **substrate harness availability gate**: SKIPs scenarios when no Code-Graph client is connected.

### Data Flow
Playbook tool block → harness `parseScenarioToolCalls` → `checkToolAvailability` (SKIP if no mk_code_index client) → would execute `code_graph_context` if connected.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| 403/404/407 playbooks | Define the scenario tool call | update tool + params | grep counts: 10 context calls, 0 query/num_results |
| code_graph_context schema | Target tool contract | unchanged (matched to) | read tool-schemas.ts in system-code-graph |
| substrate harness | Parses + runs the calls | unchanged | scenarios SKIP before/after |
| 410 playbook | memory_search latency | unchanged | grep: still memory_search |

Required inventories:
- Authoritative schema confirmed in `system-code-graph/mcp_server/tool-schemas.ts` (the spec-kit `tool-schemas.js` has only memory_* tools; its code_graph mentions are prose in descriptions).
- Confirmed no other consumer of these playbooks parses the tool payload (only the substrate runner; benchmark fixtures use 409, not 403/404/407).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Find + read the authoritative code-graph tool schema; settle query vs context
- [x] Map every call site in 403/404/407

### Phase 2: Core Implementation
- [x] Rewrite tool name + params in all three playbooks (incl. the 403 prose ref)

### Phase 3: Verification
- [x] Count check (0 stale); substrate run shows no regression; strict-validate
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Schema-match | payload keys vs tool schema | read system-code-graph tool-schemas.ts |
| Regression | scenarios SKIP before/after | npm run stress:substrate |
| Static | 0 stale query/num_results/code_graph_query | grep counts |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| code_graph_context schema stable | Internal | Green | Payload validity |
| Live Code-Graph daemon in harness | Internal | Deferred (flake) | Scenarios stay SKIP in automation |
| mk-spec-memory daemon connect in test env | Internal | RED (pre-existing SQ1) | substrate vitest red, unrelated to this fix |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the corrected payload turns out wrong for code_graph_context.
- **Procedure**: revert the three playbook files (doc-only). No code or test to roll back.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Verify schema) ──► Phase 2 (Edit playbooks) ──► Phase 3 (Confirm no regression)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Med | finding the authoritative schema (two false starts) |
| Core Implementation | Low | 3 doc edits via uniform-prefix replace |
| Verification | Low | counts + one substrate run |
| **Total** | | **single focused session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Doc-only change (no code/test)
- [x] No regression to automated outcome

### Rollback Procedure
1. `git revert` the commit (or revert the 3 playbook files).
2. No rebuild/test needed.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->
