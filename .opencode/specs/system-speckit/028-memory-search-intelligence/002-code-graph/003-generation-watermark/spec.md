---
title: "Feature Specification: Code Graph - Generation Watermark (Q6-C2 → Q6-C1)"
description: "Stage a monotonic code-graph generation watermark: a soft additive generation int on the freshness envelope (Q6-C2, Wave-1) bumped atomically at scan-finalize, then a deferred-speculative hard as-of-generation error gate (Q6-C1, Wave-2). Both correct the REFUTED ensure-ready.ts:497 bump site to the scanPromotable finalize block in handlers/scan.ts."
trigger_phrases:
  - "code graph generation watermark"
  - "q6-c2 soft generation watermark"
  - "q6-c1 hard generation gate"
  - "code graph as-of-generation read"
  - "scan finalize generation bump"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/002-code-graph/003-generation-watermark"
    last_updated_at: "2026-06-19T08:16:05Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Implemented Q6-C2 soft generation watermark"
    next_safe_action: "Keep Q6-C1 hard gate pending until Q1-C1 schema work has a named consumer"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "../research/research.md"
      - "../../research/roadmap.md"
      - "../../research/synthesis/01-go-candidates.md"
      - "../../research/synthesis/04-sibling-and-cross-cutting.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-002-003-generation-watermark"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---

# Feature Specification: Code Graph, Generation Watermark (Q6-C2 → Q6-C1)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | complete |
| **Created** | 2026-06-19 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Parent Packet** | system-spec-kit/028-memory-search-intelligence/002-code-graph |
| **Candidates** | Q6-C2 (soft watermark), Q6-C1 (hard gate), Q6-C1-generation-watermark (close-out key) |
<!-- /ANCHOR:metadata -->

### Candidate Status

| Candidate | Status | Evidence |
|-----------|--------|----------|
| Q6-C2 (soft watermark) | **DONE** | Implemented in `code-graph-db.ts`, `handlers/scan.ts` and `code-graph-context.ts`. Verified by typecheck and targeted Vitest. |
| Q6-C1 (hard as-of-generation gate) | **PENDING - DEFER-speculative** | Gate still requires the Q1-C1 bi-temporal schema cluster plus a named consumer. No hard-gate code in this phase. |
| Q6-C1-generation-watermark (close-out key) | **DONE for key production, consumer pending** | The monotonic `generation` counter now exists and is surfaced. Q1-C1 consumption remains gated with Q6-C1. |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The code-graph readiness signal has no generation counter: `code-graph-context.ts:320` `computeFreshness()` reports only a wall-clock staleness bucket (`fresh`/`recent`/`stale`/`unknown` from `MAX(indexed_at)`), and the read-path gate is binary (`freshness !== 'fresh'` blocks at `handlers/query.ts:903-915`). A stale read silently returns possibly-out-of-date edges, and there is no monotonic key to express "results as of scan generation N", which the bi-temporal close-out cluster (Q1-C1) needs because today's edge close-outs would key on a non-monotonic `new Date().toISOString()`.

### Purpose
Stage a monotonic code-graph `generation` counter, first as a soft, non-breaking additive field on the freshness envelope (Q6-C2), later as a hard as-of-generation error gate (Q6-C1), bumped atomically at the correct scan-finalize site, so freshness becomes a live watermark rather than a wall-clock hint.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **Q6-C2 (Wave-1, soft watermark):** Add a typed `getCodeGraphGeneration()` / `bumpCodeGraphGeneration()` pair to `code-graph-db.ts` over the existing `code_graph_metadata` KV table. Bump once per promoted scan. Add `generation: number` to the freshness envelope. No read-filter change, no error gate.
- **Correct scan-finalize bump site:** Place the bump in the `scanPromotable` finalize block in `handlers/scan.ts` (alongside `setLastGitHead` / `setCodeGraphScope`), NOT at the REFUTED `ensure-ready.ts:497` site.
- **Q6-C1 (Wave-2, hard gate, DEFER-speculative):** Document the as-of-generation error-gate design and its gate so a later decision can build it. It also supplies the monotonic close-out key the Q1-C1 bi-temporal cluster needs.

### Out of Scope
- Bi-temporal `valid_at`/`invalid_at` columns (Q1-C1) and the `SCHEMA_VERSION` 5→6 migration, a separate phase. This phase rides the column-free `code_graph_metadata` store.
- PPR-seeded impact ranking (Q3-C1), trust multiplier (Q4-C1, already shipped in 030 `e21caf5de6`), doc-lane extraction (Q5-C1), all other phases.
- Building the Q6-C1 hard error gate now, DEFER-speculative per synthesis `04`. Documented only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts` | Modify | Add typed `getCodeGraphGeneration()` / `bumpCodeGraphGeneration()` over `code_graph_metadata` (int-as-string, mirroring existing KV helpers ~`:556-627`) |
| `.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts` | Modify | Call `graphDb.bumpCodeGraphGeneration()` once inside the `if (scanPromotable)` finalize block (~`:666-679`) |
| `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts` | Modify | Add `generation: number` to the freshness envelope type (~`:52`) and stamp it from `getCodeGraphGeneration()` in `computeFreshness()` (~`:320-329`) |
| `.opencode/skills/system-code-graph/mcp_server/lib/*.vitest.ts` (or co-located test) | Create/Modify | Tests: two scans → n then n+1, unset → 0, envelope carries the counter, node/edge set unchanged |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Q6-C2: monotonic generation counter persisted in `code_graph_metadata` | `bumpCodeGraphGeneration()` reads `graph_generation` → `parseInt \|\| 0` → `setMetadata(n+1)`, unset returns 0, two promoted scans yield `n` then `n+1` (research iter-21 CHANGE/TEST) |
| REQ-002 | Bump fires at the correct scan-finalize site | Bump lives in the `if (scanPromotable)` block in `handlers/scan.ts` (~`:666-679`), so it fires on both `full_scan` and `selective_reindex` promotions, NOT at `ensure-ready.ts:497` (REFUTED: that is `setLastGitHead` in the out-of-scope-HEAD branch, returns `freshness:'fresh'`, never fires on a real reindex, research iter-23/24, roadmap BROADENING) |
| REQ-003 | Q6-C2 is non-breaking and additive | `computeFreshness()` adds `generation` (default 0), no read-filter change, queries return byte-identical node/edge sets, no consumer reacts to `generation` yet (research iter-21 TEST) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Bump is apply-once idempotent on the swap | A rescan of unchanged content that does not promote does not bump. Only a `scanPromotable` finalize bumps (apply-once G2 invariant shared across Q1/Q2/Q6, research iter-4, roadmap "apply-once G2") |
| REQ-005 | Q6-C1 hard-gate design documented + gated | spec/plan record the as-of-generation error-gate design (stale read = ERROR, never silently-stale), its DEFER-speculative status (no named consumer, redundant with the shipped readiness gate, synthesis `01`/`04`) and that it supplies the monotonic close-out key Q1-C1 needs (research iter-11). No implementation this phase. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Q6-C2 ships, a `generation` int rides the freshness envelope, bumped once per promoted scan from the `code_graph_metadata` store, with no read-filter change and a byte-identical node/edge result set.
- **SC-002**: The bump site is the `scanPromotable` finalize block in `handlers/scan.ts`, verified to fire on both `full_scan` and `selective_reindex`, closing the REFUTED `ensure-ready.ts:497` claim.
- **SC-003**: Q6-C1's hard as-of-generation gate is fully specified and explicitly deferred (DEFER-speculative gate recorded), and the monotonic close-out key it provides to the Q1-C1 cluster is documented.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `code_graph_metadata` KV table (`code-graph-db.ts:193`/`:456`) | Q6-C2 storage substrate | Already present. KV stores strings only, so `bumpCodeGraphGeneration` writes `String(n+1)` and reads back via `Number.parseInt` (the `parseInt`-with-fallback pattern at `:241`). No migration needed |
| Dependency | Q1-C1 bi-temporal columns + `SCHEMA_VERSION` 5→6 | Q6-C1 hard gate consumes the generation as a close-out key | Q6-C1 is DEFER-speculative. Ships only with the bi-temporal cluster decision |
| Risk | Bump placed at a non-promoting site | Generation never advances on real reindex | REQ-002 pins the `scanPromotable` block. REFUTED `:497` sketch explicitly excluded |
| Risk | Q6-C1 builds a gate with no consumer | Wasted error-gate surface, redundant with readiness gate | DEFER-speculative. Build only on a named-consumer decision (synthesis `04`) |
| Risk | Generation bump not atomic with the write swap (Q6-C1) | As-of-generation read returns inconsistent edge set | Q6-C1 must bump inside the same transaction as the reindex swap (research iter-3/4). Soft Q6-C2 has no such constraint |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Q6-C2 bump is one `code_graph_metadata` upsert per promoted scan, negligible vs the scan itself. No per-query cost beyond one KV read in `computeFreshness()`.
- **NFR-P02**: No new index, no table rebuild, no migration, so Q6-C2 stays off the schema chokepoint (research iter-23 phase-0).

### Security
- **NFR-S01**: No new external input. `generation` is an internal monotonic int derived from scan promotion. No auth surface change.
- **NFR-S02**: Soft watermark cannot mask a stale read into a trusted one, it is additive telemetry only until Q6-C1's error gate lands.

### Reliability
- **NFR-R01**: `code-graph.sqlite` is a rebuildable cache, worst case on any defect is `code_graph_scan`, not data loss (research iter-11 reversibility backstop).
- **NFR-R02**: Apply-once: an unchanged-content rescan that does not promote leaves `generation` unchanged (REQ-004).
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty / never-scanned graph: `graph_generation` unset → `getCodeGraphGeneration()` returns 0, envelope carries `generation: 0`.
- First successful scan: counter goes 0 → 1.
- Concurrent scans: each promoted finalize is a single in-txn upsert. The bump is read-modify-write on one KV row (Q6-C1 would require this to be atomic with the swap, Q6-C2's softness tolerates a benign last-writer-wins on the int).

### Error Scenarios
- Non-promoted scan (`scanPromotable` false, e.g. parse-error threshold exceeded, structural-persistence error): no bump (REQ-004). Generation stays at the last green value.
- `parseInt` of a corrupt KV value: treat as 0 (`parseInt || 0`) so a malformed row degrades to the unset case rather than throwing.

### State Transitions
- Selective reindex that promotes: bumps exactly like a full scan (the finalize block is shared), closing the `:497`-only-fires-on-out-of-scope-HEAD gap.
- Q6-C1 (deferred): an as-of-generation read requesting `generation ≥ N` that cannot be satisfied surfaces an ERROR, never silently-stale edges ("successful call = proof of freshness", research iter-3).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | 3 source files, ~30 LOC for Q6-C2. Q6-C1 deferred (design-only) |
| Risk | 10/25 | Q6-C2 additive/reversible (low). Q6-C1 touches the destructive-reindex txn boundary (deferred) |
| Research | 6/20 | Fully code-mapped. One residual confirm (the live finalize-block line numbers shift over time) |
| **Total** | **24/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- The exact `scanPromotable` finalize line range in `handlers/scan.ts` drifts as the file changes, so confirm the live block (currently ~`:666-679`, beside `setLastGitHead` `:672` and `setCodeGraphScope` `:679`) at implementation time.
- Does any current consumer read `metadata.freshness` deeply enough that adding a field is observable? (research iter-21 TEST asserts no consumer reacts, re-verify the envelope type at `code-graph-context.ts:52`.)
- Q6-C1 only: should the generation be re-derived per scan (aionforge rebuild-from-primary model) or persisted-and-incremented? This phase persists-and-increments via `code_graph_metadata`. Q6-C1's atomicity decision is deferred.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation plan**: See `plan.md`.
- **Task breakdown**: See `tasks.md`.
- **Subsystem research**: See `../research/research.md` (iterations 1-4 Q6 anchoring, 21 build sketch, 23/24 bump-site refutation).
- **Authoritative roadmap**: See `../../research/roadmap.md` (Q6-C2 row L59/L147, BROADENING `:497` REFUTED L220).
- **Synthesis**: See `../../research/synthesis/01-go-candidates.md` (Q6-C1 DEFER-speculative L24) and `../../research/synthesis/04-sibling-and-cross-cutting.md` (L27 DEFER reasoning).
- **Shipped record (Wave-0)**: only code-graph candidate shipped there was Q4-C1 (`e21caf5de6`). This phase ships Q6-C2 and leaves Q6-C1 gated.
<!-- /ANCHOR:related-docs -->
