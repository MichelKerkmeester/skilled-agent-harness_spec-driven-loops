---
title: "Implementation Plan: Storage Adapter Ports (Five Divergence Seams)"
description: "Extract five typed port interfaces (VectorStore, LexicalSearch, GraphTraversal, Maintenance, ContentionPolicy) with the current better-sqlite3 implementations behind them; no behavior change; port fakes enable storage-free unit tests. Planning starts with a split-vs-promote decision."
trigger_phrases:
  - "015-storage-adapter-ports plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/004-shared-infrastructure/003-storage-adapter-ports"
    last_updated_at: "2026-06-11T00:43:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Deep-review CONDITIONAL remediated (behavior-preserving interface/test alignment)"
    next_safe_action: "None; phase complete, deep-reviewed, and remediated"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-015-storage-adapter-ports"
      parent_session_id: null
    completion_pct: 100
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
Foundation slice is complete: the port module, two adopted adapters, fakes, and contract tests are in place. Slice 2 is complete: VectorStore now has a better-sqlite3 adapter and contract coverage against both the adapter and fake. Slice 3 is complete: Maintenance now has a better-sqlite3 adapter and contract coverage against both the adapter and fake. Slice 4 is complete: ContentionPolicy now has a better-sqlite3 adapter, fake parity, contract coverage, and scoped contention call-site routing. Slice 5 is complete: final conservative routing moved straightforward GraphTraversal and Maintenance call sites through ports while leaving fragile hybrid lexical combining unchanged as a justified exception.
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
- [x] Tests passing (if applicable) - targeted gates passed; broad suite has unrelated pre-existing failures recorded in implementation-summary.md
- [x] Docs updated (spec/plan/tasks)
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
- [x] Call-site inventory per port - final coupling grep recorded with justified lexical/vector exceptions

### Phase 2: Core
- [x] Ports defined (Slice 1 foundation)
- [x] Implementations extracted for the two adopted helpers (GraphTraversal + LexicalSearch)
- [x] Call sites routed - VectorStore legacy class export, Maintenance retention/reindex, scoped ContentionPolicy call sites, MemoStore dependency traversal, causal boost traversal, and retention post-delete maintenance routed through ports where behavior-preserving

### Phase 3: Verification
- [x] Slice 1 targeted suites + local eval-channel checks green
- [x] Contract tests vs impl and fake for GraphTraversal and LexicalSearch
- [x] Slice 2 targeted vector/search/eval suites green with zero behavioral delta against the pre-change baseline
- [x] Slice 3 targeted maintenance/storage/eval suites green with zero behavioral delta against the pre-change baseline
- [x] Slice 4 targeted contention/storage/eval suites green with zero behavioral delta against the pre-change baseline
- [x] Coupling grep trends to ~0 outside ports - direct BFS helper callers routed; fragile hybrid lexical combining and vector-owned storage pragmas left as justified exceptions
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
