---
title: "Implementation Plan: Memory Search Intelligence Wave-0 closeout"
description: "Plan for closing the 030 implementation packet across all Wave-0 memory-search intelligence candidates: 11 shipped candidates, 2 deferred candidates, subsystem verification, and Level-3 packet documentation."
trigger_phrases:
  - "memory search intelligence wave 0 implementation"
  - "030 memory search intelligence closeout"
  - "wave 0 candidate status"
  - "memory search intelligence plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/030-memory-search-intelligence-impl"
    last_updated_at: "2026-06-18T23:20:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Closed out Wave-0 implementation docs and verification."
    next_safe_action: "Use Wave-1 follow-ups for deferred candidates and Q4-C1 tuning."
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-18-wave-0-closeout"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Memory Search Intelligence Wave-0 closeout

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, JavaScript, CommonJS, Node.js |
| **Framework** | Spec Kit Memory MCP, Code Graph MCP, Deep Loop runtime |
| **Storage** | SQLite-backed memory index, causal edges, code graph store |
| **Testing** | `tsc`, package builds, Vitest, `node --check`, `validate.sh --strict` |

### Overview
This packet closes the Wave-0 implementation slice from packet 028's research roadmap. The implementation method was one candidate at a time: read the seam, implement the smallest reversible change, add focused tests, request review on high-risk candidates, commit the candidate or batch independently, and update `spec.md` section 14 as the authoritative status ledger.

Wave-0 ships only the candidates that were additive, reversible, and safe without a benchmark or schema migration. Candidate 6 and Candidate 11 are explicitly deferred because real verification contradicted the cheap implementation path.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Packet 028 research treated as roadmap input, not implementation authority. Evidence: `spec.md` sections 2 and 14.
- [x] Wave-0 scope limited to ship-ready, no-migration, no-benchmark candidates. Evidence: `spec.md` section 4.
- [x] Candidate seams identified before edits. Evidence: candidate rows in `spec.md` section 14.
- [x] Deferred candidates require concrete regression or live-data evidence. Evidence: Candidate 6 and Candidate 11 status notes.

### Definition of Done
- [x] All 13 candidate rows have final Wave-0 status. Evidence: `spec.md` section 14.
- [x] All 11 shipped candidates have tests and commits. Evidence: `checklist.md` and `implementation-summary.md`.
- [x] Deferred candidates name the blocking evidence and Wave-1 path. Evidence: Candidate 6 and Candidate 11 rows.
- [x] Touched subsystem verification has been run on current branch head. Evidence: `implementation-summary.md` verification table.
- [x] Level-3 packet docs use the system-spec-kit templates and pass strict validation.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
The architecture is a set of candidate-local improvements at existing seams. No shared-infrastructure rewrite, schema migration, daemon topology change, or benchmark-gated tuning is included in Wave-0.

### Key Components
- **Memory search pipeline**: Stage 1 embedder degradation, ANN ordering, RRF/content tiebreaking, bonus-denominator option, and pure rank-time decay clock.
- **Memory write and CRUD paths**: content-id hashing, constitutional CAS guard, idempotency receipts left deferred, and public handler coverage.
- **Memory observability and causal hygiene**: enrichment pending/failed gauges and skip-closed cleanup.
- **Deep Loop runtime**: strategy anchors, deterministic fanout merge order, fanout pool gauges, and graceful self-stop.
- **Code Graph context**: additive rank-time trust blend for impact context with neutral-order preservation.

### Data Flow
The retrieval path stays read-side by default: query generation degrades to lexical search when embeddings are unavailable, ranked candidates remain stable through deterministic tiebreakers, and optional scoring knobs preserve default behavior. Write-side changes are fail-closed only where protection matters: constitutional row updates reject stale or protection-removing writes, while the idempotency default flip is deferred because update-path behavior regressed.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Memory Stage 1 candidate generation | Embedding/vector candidate source | Added lexical fallback when embedder unavailable | `stage1-embedder-degrade.vitest.ts` |
| Memory Stage 2 fusion and search formatting | Ordering, RRF, decay, response shape | Added stable tiebreaks, option seams, and pure clock | `stage2-fusion.vitest.ts`, `rrf-fusion.vitest.ts`, `search-results-format.vitest.ts` |
| Memory CRUD/update | User-facing memory mutation path | Added constitutional CAS guard; deferred idempotency default flip | `handler-memory-crud.vitest.ts`, `memory-crud-update-constitutional-guard.vitest.ts`, `memory-idempotency-and-near-duplicate.vitest.ts` |
| Memory causal/enrichment helpers | Graph cleanup and health observability | Added skip-closed cleanup and pending/failed gauges | `frontmatter-promoter.vitest.ts`, `handler-memory-health-edge.vitest.ts` |
| Deep Loop fanout scripts | Runtime fanout execution and merge behavior | Added deterministic order, gauges, graceful self-stop | `node --check`, fanout unit tests |
| Code Graph context | Impact-neighborhood ranking | Added RRF-additive trust boost with neutral-order preservation | `code-graph-context-handler.vitest.ts` |

Required inventories were scoped to candidate seams instead of broad rewrites. Consumer inventories covered public schema fields, formatter output, handler cache arguments, fanout script outputs, and Code Graph context payloads.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read packet 028 roadmap and packet 030 specification.
- [x] Freeze Wave-0 scope to the candidate table.
- [x] Confirm current branch head and candidate commit history.
- [x] Preserve unrelated dirty files, especially `descriptions.json`.

### Phase 2: Core Implementation
- [x] Ship Candidate 1 Q6 anchors.
- [x] Ship Candidate 2 C9 embedder degradation.
- [x] Ship Candidate 3 ANN tie-stable ordering.
- [x] Ship Candidate 4 C5-B content-derived tiebreaks.
- [x] Ship Candidate 5 C-X1 plus C6-A.
- [x] Defer Candidate 6 C4-A because the default-on flip regressed `handleMemoryUpdate`.
- [x] Ship Candidate 7 content-id module.
- [x] Ship Candidate 8 enrichment gauges.
- [x] Ship Candidate 9 skip-closed cleanup.
- [x] Ship Candidate 10 constitutional CAS guard.
- [x] Defer Candidate 11 system-kind exclusion because live DB evidence proved `system` rows include canonical spec docs.
- [x] Ship Candidate 12 Deep-Loop trio plus graceful self-stop.
- [x] Ship Candidate 13 Code-Graph Q4-C1 rank-time trust.

### Phase 3: Verification
- [x] Run Memory MCP typecheck, build, and touched-area Vitest composition suite.
- [x] Attempt Memory MCP full Vitest suite and classify broad failures against baseline evidence.
- [x] Run Code Graph typecheck, build, and ranking/impact tests.
- [x] Run Deep Loop fanout syntax checks and fanout unit tests.
- [x] Rewrite Level-3 packet docs from system-spec-kit template structure.
- [x] Run strict packet validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static | Memory MCP and Code Graph TypeScript contracts | `npm run typecheck` |
| Build | Memory MCP and Code Graph package builds | `npm run build` |
| Memory composition | Search, CRUD, fusion, decay, idempotency, causal, health, formatter seams | `npx vitest run` focused 23-file suite |
| Code Graph ranking | Impact context, query edge confidence, budget, resolver, verifier | `npx vitest run` focused 5-file suite |
| Deep Loop fanout | Merge, pool, run, salvage fanout behavior | `node --check`, `npx vitest run` |
| Packet docs | Level-3 structure, anchors, frontmatter, required files | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing memory index schema | Internal | Green for shipped candidates | Required for search, CRUD, causal, and enrichment tests |
| Existing embedder interface | Internal | Green with degradation | Candidate 2 falls back when unavailable |
| Existing idempotency receipts | Internal | Deferred default flip | Candidate 6 needs update-path scoping before Wave-1 |
| Live memory DB source-kind distribution | Runtime evidence | Blocks Candidate 11 | Cheap `source_kind='system'` filtering would hide canonical spec docs |
| Deep Loop fanout scripts | Runtime | Green | Required for Candidate 12 |
| Code Graph context builder | Runtime | Green | Required for Candidate 13 |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A shipped candidate causes a regression in its touched subsystem suite or live operator workflow.
- **Procedure**: Revert the candidate commit or grouped commit listed in `spec.md` section 14. Candidate groups are intentionally small: Candidates 3 and 4 share one commit; Candidates 8, 9, and 10 share one commit; the other shipped candidate commits are independent.
- **Data reversal**: No shipped Wave-0 candidate adds a schema migration. Rollback is code and test revert only.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Scope freeze | Packet 028 research and packet 030 spec | Candidate implementation |
| Candidate implementation | Seam reads | Candidate verification |
| Candidate verification | Implementation commits | Closeout docs |
| Closeout docs | Verification evidence | Strict validation |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Candidate Group | Complexity | Actual Outcome |
|-----------------|------------|----------------|
| Candidates 1-5 | Low to medium | Shipped |
| Candidate 6 | Medium | Deferred after regression |
| Candidates 7-10 | Low to medium | Shipped |
| Candidate 11 | Medium | Deferred after live-DB review |
| Candidate 12 | Medium | Shipped |
| Candidate 13 | Medium | Shipped with tuning follow-up |
| Closeout docs and verification | Medium | Completed |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

| Candidate | Rollback |
|-----------|----------|
| 1 Q6 anchors | Revert strategy-template anchor additions. |
| 2 C9 embedder degrade | Revert lexical fallback and typed input-validation additions. |
| 3 ANN tie-stable | Remove `m.id ASC` ordering additions. |
| 4 C5-B tiebreak | Remove content-hash comparator and RRF output tiebreaks. |
| 5 C-X1 + C6-A | Remove `bonusOverChannels` and rank-time clock refactor. |
| 7 content-id module | Inline previous hashing call sites or revert module commit. |
| 8 gauges | Remove pending/failed gauge fields and tests. |
| 9 skip-closed | Remove open-edge cleanup predicate. |
| 10 constitutional CAS | Remove constitutional guard helper and optional `expectedHash` schema. |
| 12 Deep Loop | Revert fanout merge, pool, and run script changes. |
| 13 Code Graph | Remove rank-time trust blend from context ranking. |
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
Packet 028 research
  -> Packet 030 Wave-0 scope
  -> Candidate seam reads
  -> Candidate implementation commits
  -> Per-candidate tests and reviews
  -> Touched-subsystem composition verification
  -> Level-3 packet closeout docs
  -> strict validation
```
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

The critical path was not implementation volume; it was preserving default behavior while shipping small retrieval improvements. Candidate 6 and Candidate 11 show the discipline: both looked cheap on paper, but real tests or live data proved they were not safe Wave-0 changes.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Evidence |
|-----------|----------|
| M1 Scope frozen | `spec.md` section 14 authoritative status table |
| M2 Shipped candidates landed | 11 candidate rows marked Done with commits |
| M3 Deferred candidates justified | Candidate 6 regression and Candidate 11 live DB evidence recorded |
| M4 Composition verified | Memory, Code Graph, and Deep Loop command evidence in `implementation-summary.md` |
| M5 Packet closed | Level-3 docs authored and strict validation run |
<!-- /ANCHOR:milestones -->
