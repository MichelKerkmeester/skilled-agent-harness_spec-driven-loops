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
    last_updated_at: "2026-06-10T23:20:56Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Slice 4 ContentionPolicy adapter completed and verified"
    next_safe_action: "Proceed to Slice 5 for final scoped routing/coupling grep"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-015-storage-adapter-ports"
      parent_session_id: null
    completion_pct: 80
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

### Slice Updates
Foundation slice is complete: the port module, two adopted adapters, fakes, and contract tests are in place. Slice 2 is complete: VectorStore now has a better-sqlite3 adapter and contract coverage against both the adapter and fake. Slice 3 is complete: Maintenance now has a better-sqlite3 adapter and contract coverage against both the adapter and fake. Slice 4 is complete: ContentionPolicy now has a better-sqlite3 adapter, fake parity, contract coverage, and scoped contention call-site routing. Slice 5 remains pending for final scoped routing/coupling work.
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
- [x] Planning decision: **PER-PORT SLICES within this phase** (not promoted to a standalone packet). Rationale: kept inside the 027 epic per operator direction; behavior-preserving seam extraction is the lowest-risk form of a large refactor when sliced small and gated on golden evals; phases 012 (traversal helper) and 014 (packed lexical engine) already supply two of the five port implementations. Execution = five sequential reviewable slices (VectorStore, LexicalSearch [adopt 014], GraphTraversal [adopt 012], Maintenance, ContentionPolicy), each green on the existing suites + golden evals before the next slice begins.
- [ ] Call-site inventory per port - vector, maintenance, and contention inventories complete; final coupling grep deferred to Slice 5

### Phase 2: Core
- [x] Ports defined (Slice 1 foundation)
- [x] Implementations extracted for the two adopted helpers (GraphTraversal + LexicalSearch)
- [ ] Call sites routed - VectorStore legacy class export, Maintenance retention/reindex, and scoped ContentionPolicy call sites routed through ports; remaining routing deferred to Slice 5

### Phase 3: Verification
- [x] Slice 1 targeted suites + local eval-channel checks green
- [x] Contract tests vs impl and fake for GraphTraversal and LexicalSearch
- [x] Slice 2 targeted vector/search/eval suites green with zero behavioral delta against the pre-change baseline
- [x] Slice 3 targeted maintenance/storage/eval suites green with zero behavioral delta against the pre-change baseline
- [x] Slice 4 targeted contention/storage/eval suites green with zero behavioral delta against the pre-change baseline
- [ ] Coupling grep trends to ~0 outside ports - final phase gate deferred
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
| Phase 012 + 014 outputs | Internal | Available | Two port implementations adopted in Slice 1 |
| Golden evals | Internal | In progress | Slice 4 eval/golden subset passed before and after with matching counts; full phase gate remains for Slice 5 |
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
