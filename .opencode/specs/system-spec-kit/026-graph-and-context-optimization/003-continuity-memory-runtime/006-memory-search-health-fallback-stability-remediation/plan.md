---
title: "Implementation Plan: Memory search Clusters 4-7 remediation"
description: "Close the deferred P1/P2 memory-search runtime defects from predecessor packet 005 by tightening causal-stats output, session-scoped dedup, folder discovery thresholds, daemon health, quality-gap fallback telemetry, and relation coverage reporting."
trigger_phrases:
  - "memory search clusters 4-7 remediation plan"
  - "causal-stats output hygiene plan"
  - "memory search state hygiene plan"
  - "quality fallback fts5 bm25 grep plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/006-memory-search-health-fallback-stability-remediation"
    last_updated_at: "2026-05-08T21:20:00Z"
    last_updated_by: "codex-gpt-5.5"
    recent_action: "Authored Level 2 implementation plan for Clusters 4-7 remediation"
    next_safe_action: "Implement scoped MCP server and command documentation changes"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/query-router.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/intent-classifier.ts"
      - ".opencode/commands/memory/search.md"
    session_dedup:
      fingerprint: "sha256:064afa1687c8c6cb6838c7eb061ce2a449a6d46d29a83a82d595f20746627a5b"
      session_id: "memory-clusters-4-7-2026-05-08"
      parent_session_id: null
    completion_pct: 20
    open_questions: []
    answered_questions:
      - "Q1: Thread a memory-specific session id through memory_context and downstream memory_search."
      - "Q2: Use structural code graph and memory causal graph naming."
      - "Q3: Document existing custom-answer routing instead of adding a new menu option."
---
# Implementation Plan: Memory search Clusters 4-7 remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript MCP server, Markdown command spec, JSON metadata |
| **Framework** | Spec Kit Memory MCP server under `.opencode/skills/system-spec-kit/mcp_server` |
| **Storage** | SQLite `memory_index`, `memory_fts`, and `causal_edges`; in-memory session state |
| **Testing** | Vitest, TypeScript `tsc --noEmit`, strict spec validator |

### Overview
This packet closes the 13 deferred Clusters 4-7 defects from `005-memory-search-runtime-bugs` without touching the shipped Cluster 1-3 fixes. The implementation stays additive: normalize memory causal graph output, pass a stable memory-session id through retrieval calls, reject weak folder-discovery matches, expose CocoIndex daemon health, add quality-gap fallback telemetry, and formalize intent stability with tests.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Scope and acceptance criteria are present in `spec.md`.
- [x] Predecessor audit `005-memory-search-runtime-bugs/spec.md` and `plan.md` were read.
- [x] Live code surfaces were inspected before edits.
- [x] Open questions resolved in this plan.

### Definition of Done
- [ ] REQ-005 through REQ-017 are closed or explicitly deferred in `implementation-summary.md`.
- [ ] Four requested Vitest files are added and pass.
- [ ] Cluster 1-3 regression coverage still passes through the full vitest run.
- [ ] `pnpm tsc --noEmit`, `pnpm vitest run`, and strict spec validation pass.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Scoped runtime remediation across existing MCP handler boundaries. Each change either adjusts a response serializer, extends existing in-memory/session metadata, or adds a small library module consumed by one handler.

### Key Components
- **Memory causal graph stats**: `handlers/causal-graph.ts` is the actual registered `memory_causal_stats` handler; the spec path `handlers/memory-causal-stats.ts` is stale.
- **Memory context/session state**: `handlers/memory-context.ts` owns effective session lifecycle and forwards search options to `memory_search`.
- **Search router**: `lib/search/query-router.ts` owns query-plan telemetry and will expose quality-gap fallback engagement metadata.
- **Folder discovery**: `lib/search/folder-discovery.ts` owns lightweight spec-folder matching and will add per-token thresholding.
- **Daemon health**: new `lib/cocoindex/daemon-probe.ts` supplies cached CocoIndex status for `memory_health`.
- **Relation coverage**: new `lib/causal/relation-coverage.ts` exposes per-relation target/current state without changing the causal-graph schema.

### Data Flow
`/memory:search` calls `memory_context`, which resolves an effective session id, may discover a folder boost, and executes `memory_search`. `memory_search` builds the query plan, runs the pipeline, formats results, applies session dedup, and returns quality metadata. Analysis subcommands call causal graph handlers directly. This plan keeps that flow intact and adds missing guardrails at the local owner of each behavior.

### Open Question Resolutions
| Question | Decision | Rationale |
|----------|----------|-----------|
| Q1 / REQ-011 | Thread a memory-specific effective session id from `memory_context` into `memory_search`. | This is narrower than a general command-harness change and gives dedup stable state across calls where `memory_context` is the entry point. |
| Q2 / REQ-017 | Rename user-facing output to `structural code graph` and `memory causal graph`. | The two systems are different; explicit nouns remove the collision and are reversible by grep. |
| Q3 / REQ-014 | Document existing custom-answer routing. | The current AskUserQuestion behavior is useful and does not need a new menu option for this packet. |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Documentation Setup
- [x] Read authored `spec.md`.
- [x] Read predecessor audit and cluster plan.
- [x] Read Level 2 templates and live code surfaces.
- [ ] Author `plan.md`, `tasks.md`, and `checklist.md`.

### Phase 2: Runtime Remediation
- [ ] Cluster 4: normalize memory causal graph stats output, health, and remediation hints.
- [ ] Cluster 5: stabilize session-scoped dedup and suppress cold-start degraded hints.
- [ ] Cluster 6: add weak-signal folder thresholding and CocoIndex daemon health.
- [ ] Cluster 7: add quality-gap fallback engagement metadata, relation coverage, corpus test, and command docs.

### Phase 3: Verification
- [ ] Add four requested Vitest files.
- [ ] Run TypeScript compile and full Vitest suite.
- [ ] Run strict spec validation.
- [ ] Author `implementation-summary.md` and update metadata to complete.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Intent corpus, folder threshold, daemon probe, causal-stats schema | Vitest |
| Regression | Existing Cluster 1-3 and memory search suites | Full `pnpm vitest run` |
| Type safety | All changed TypeScript modules | `pnpm tsc --noEmit` |
| Spec compliance | Level 2 packet docs and metadata | `validate.sh --strict` |

Acceptance is evidence-driven: the checklist rows are marked only after the matching test or verification command passes.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Predecessor `005-memory-search-runtime-bugs` | Internal | Green | Supplies defect catalog and Cluster 1-3 regression expectations |
| SQLite `memory_index` and `causal_edges` schema | Internal | Green | Read-only queries only; no schema change planned |
| CocoIndex daemon runtime files | External/Internal | Yellow | Probe must degrade gracefully when daemon metadata is missing |
| Session state managers | Internal | Green | Used for stable per-session dedup without durable storage |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: TypeScript compile failures, Vitest regressions, or strict spec validation errors that cannot be resolved inside the packet scope.
- **Procedure**: Revert the scoped changes in the packet files and the touched MCP/command files. The new daemon probe and relation coverage modules are additive and can be removed independently if they cause runtime issues.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Runtime remediation) ──► Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Authored `spec.md` and predecessor packet context | Runtime remediation |
| Runtime remediation | Setup and live code reads | Verification |
| Verification | Runtime remediation and test additions | Summary and metadata updates |
| Summary and metadata | Verification evidence | Packet handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | 1 hour |
| Runtime remediation | High | 4-6 hours |
| Verification | High | 2-3 hours |
| Documentation and metadata | Medium | 1 hour |
| **Total** | | **8-11 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Scope limited to packet docs, MCP memory handlers, search helpers, and command docs.
- [x] No causal graph schema migrations introduced.
- [x] No hook-surface code modified.

### Rollback Procedure
1. Revert the touched MCP runtime files and command doc.
2. Remove additive modules `lib/cocoindex/daemon-probe.ts` and `lib/causal/relation-coverage.ts`.
3. Revert or remove the four packet test files and updated router/causal integration assertions.
4. Rerun TypeScript, focused packet tests, and strict spec validation.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->
