---
title: "Implementation Plan: Storage Adapter Ports (Five Divergence Seams) [template:level_1/plan.md]"
description: "Extract five typed port interfaces (VectorStore, LexicalSearch, GraphTraversal, Maintenance, ContentionPolicy) with the current better-sqlite3 implementations behind them; no behavior change; port fakes enable storage-free unit tests. Planning starts with a split-vs-promote decision."
trigger_phrases:
  - "015-storage-adapter-ports plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/015-storage-adapter-ports"
    last_updated_at: "2026-06-10T19:30:00Z"
    last_updated_by: "claude-fable-5"
    recent_action: "Phase plan scaffolded from revalidation findings"
    next_safe_action: "Start Phase 1 setup tasks when this phase is picked up"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-015-storage-adapter-ports"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Storage Adapter Ports (Five Divergence Seams)

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (mcp_server), better-sqlite3 |
| **Framework** | Spec Kit Memory MCP daemon |
| **Storage** | SQLite (context-index + vector shards) |
| **Testing** | vitest + eval harness fixtures |

### Overview
Extract five typed port interfaces (VectorStore, LexicalSearch, GraphTraversal, Maintenance, ContentionPolicy) with the current better-sqlite3 implementations behind them; no behavior change; port fakes enable storage-free unit tests. Planning starts with a split-vs-promote decision.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Surgical refinement of existing mcp_server modules; additive and flag-gated until verification gates pass.

### Key Components
- **Port interfaces + impls**: Five seams, current code extracted, no logic edits
- **Contract tests + fakes**: Each port validated against impl and fake

### Data Flow
callers -> port interface -> better-sqlite3 implementation (today) | fake (tests) | future backend (out of scope).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not a bug-fix packet; surfaces and verification live in the spec Files-to-Change table and the phase checklist below. No security/path/schema-boundary findings in scope.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| See spec.md Files to Change | Read/write paths named there | Modify/Create per spec | Tests + benchmarks listed in Phase 3 |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Planning decision: per-port slices vs standalone packet promotion
- [ ] Call-site inventory per port

### Phase 2: Core
- [ ] Ports defined
- [ ] Implementations extracted (012 traversal + 014 lexical adopted)
- [ ] Call sites routed

### Phase 3: Verification
- [ ] Existing suites + golden evals green before/after
- [ ] Contract tests vs impl and fake
- [ ] Coupling grep trends to ~0 outside ports
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | New/changed modules | vitest |
| Integration | End-to-end path on fixtures | vitest + fixture DBs |
| Benchmark | Latency/RAM gates named in spec | recorded in implementation-summary |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 012 + 014 outputs | Internal | Pending | Two port implementations arrive from them |
| Golden evals | Internal | Pending | Behavior-preservation gate |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Verification gate failure or behavior drift.
- **Procedure**: Extraction is mechanical and sliced; any slice reverts independently; no schema or behavior changes.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
