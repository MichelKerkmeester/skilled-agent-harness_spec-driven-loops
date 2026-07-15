---
title: "Implementation Plan: MCP-Native Scenarios (Playbook Run Phase 002)"
description: "Map NC-001..009 to native mk_skill_advisor MCP tool calls, execute locally, capture envelopes, and assign verdicts against the playbook expected signals."
trigger_phrases:
  - "playbook mcp native plan"
  - "028 phase 002 plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/009-playbook-run-and-remediation/002-mcp-native-scenarios"
    last_updated_at: "2026-05-26T20:00:00Z"
    last_updated_by: "playbook-run-operator"
    recent_action: "Documented NC execution plan"
    next_safe_action: "Phase 003"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-phase-002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: MCP-Native Scenarios (Playbook Run Phase 002)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | MCP tools (mk_skill_advisor), vitest |
| **Framework** | system-skill-advisor MCP server |
| **Storage** | SQLite skill-graph (generation 4463/4464) |
| **Testing** | advisor_* + skill_graph_* tools, advisor-recommend/renderer/lifecycle/plugin-bridge vitest |

### Overview
Call each native tool with the documented payloads, capture the JSON envelope, and compare to the scenario's expected signals. Run the NC-004/005 vitest suites from the correct directory.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (vitest 49/49)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Tool-call-then-assert per scenario.

### Key Components
- **advisor_recommend**: NC-001 (happy path), NC-004 (ambiguity), NC-005 (lifecycle)
- **advisor_status / advisor_rebuild**: NC-002, NC-006 (diagnostic vs repair separation)
- **advisor_validate**: NC-003 (slice bundle)
- **skill_graph_status/query/validate**: NC-007/008/009

### Data Flow
Tool returns a status envelope with `data`; verdict derives from comparing `data` fields against expected signals.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Test-execution phase; no source surfaces modified. Findings recorded for downstream triage.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `advisor-validate.ts` | accuracy/slice producer | observed only | NC-003 envelope: 50.78% corpus vs 80.5% baseline |
| corpus skill IDs | gold labels | observed only | `sk-deep-research`/`sk-deep-review` score 0 vs live `deep-research`/`deep-review` |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm advisor MCP tools reachable
- [x] Confirm workspaceRoot = repo root
- [x] Evidence dir ready

### Phase 2: Core Implementation
- [x] NC-001/004/005 advisor_recommend calls
- [x] NC-002/006 advisor_status + advisor_rebuild calls
- [x] NC-003 advisor_validate slice bundle
- [x] NC-007/008/009 skill_graph_* calls
- [x] NC-004/005 vitest from correct directory

### Phase 3: Verification
- [x] Each scenario compared to expected signals
- [x] Accuracy-regression finding quantified
- [x] Verdicts recorded in checklist + summary
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| MCP | advisor_* + skill_graph_* envelopes | native tools |
| Unit | ambiguity, renderer, lifecycle, plugin-bridge | vitest (49/49 pass) |
| Manual | expected-signal comparison | operator |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Live skill-graph DB | Internal | Green | Recommendations would be absent |
| vitest config | Internal | Green | NC-004/005 test sub-steps |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Force rebuild left the graph in a bad state.
- **Procedure**: `advisor_rebuild force:true` regenerates from checked-in metadata; generation is monotonic and self-healing.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Core (NC calls) ──► Verify (compare signals)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 001 build | Core |
| Core | Setup | Verify |
| Verify | Core | Phase 003 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 2 min |
| Core | Med | 15 min |
| Verification | Med | 10 min |
| **Total** | | **~27 min** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No source changes
- [x] Force rebuild is idempotent/self-healing
- [x] No data migrations

### Rollback Procedure
1. Re-run `advisor_rebuild force:true` if graph state is suspect
2. Confirm `advisor_status` live
3. No stakeholder notification needed

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
