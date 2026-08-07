---
title: "Implementation Plan: Determinism + Content-ID Foundation"
description: "Plan for the determinism + content-id foundation sub-phase of the Spec-Kit Memory MCP retrieval-intelligence work: 5 shipped keystone candidates (total-comparator tiebreaks, two content-id primitives, byte-identical bonus/clock seams), 4 gated residue candidates, sequencing and the cross-subsystem byte-compare dependencies."
trigger_phrases:
  - "determinism content-id foundation plan"
  - "memory total comparator sequencing"
  - "fuseResultsMulti bonusOverChannels plan"
  - "028 speckit-memory determinism impl"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/002-speckit-memory/002-determinism-content-id-foundation"
    last_updated_at: "2026-07-04T17:51:02.224Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored Level-3 plan sequencing shipped keystone vs gated residue"
    next_safe_action: "Author tasks.md (pre-check shipped, leave residue pending)"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
      - "../research/research.md"
      - "../../research/synthesis/01-go-candidates.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-determinism-foundation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Determinism + Content-ID Foundation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js |
| **Framework** | Spec Kit Memory MCP (`.opencode/skills/system-spec-kit/mcp_server/` + `shared/algorithms/`) |
| **Storage** | SQLite-backed memory index, vector index, causal edges |
| **Testing** | `tsc`, package build, Vitest (focused composition suite), `validate.sh --strict` |

### Overview
This sub-phase is the determinism keystone of the Memory MCP retrieval-intelligence work. It establishes the shared total-comparator, the two SHA-256 content-id primitives, content-derived tiebreaks at every ordering seam and the byte-identical-by-default rank-time fusion-bonus / decay-clock seams that every other determinism candidate and every cross-subsystem consumer (Code Graph 002, Skill Advisor 003, Deep Loop 004) byte-compares against.

Five candidates already shipped in the flat Wave-0 implementation record (030) using the one-candidate-at-a-time method: read the seam, implement the smallest reversible change, add a focused test, prove byte-identity (parity test / arithmetic trace) and commit independently. This sub-phase records those as DONE with their commits and carries the residue, the per-class `'configured'` bonus mode (C-X1-true-multichannel), the render-order serialization stage (C5-A) and the single-tenant-refuted identity-hardening pair, as gated PENDING work.

The plan's discipline is the same one packet 030 demonstrated: ship only what is additive, reversible and byte-identical-by-default. Defer anything that needs a downstream consumer, a still-open unit test or a multi-writer threat model.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] 028 research treated as roadmap input, not implementation authority. Evidence: `spec.md` sections 2 and 13.
- [x] Foundation scope limited to determinism + content-id seams, downstream consumers (C2-A/B/C, C4-A, C4-B) excluded. Evidence: `spec.md` section 3 Out of Scope.
- [x] Candidate seams identified from `../research/research.md` Internal Baseline + the per-iteration detail before edits.
- [x] PENDING candidates name a concrete gate (shared-infra-dep / render-build / multi-writer-gate). Evidence: `spec.md` section 13.

### Definition of Done
- [x] All 9 candidate rows have a final status (DONE-with-commit or PENDING-with-gate). Evidence: `spec.md` section 13.
- [x] All 5 shipped candidates trace to a Wave-0 commit.
- [ ] All 4 PENDING candidates name the blocking condition and the consuming sub-phase. Evidence: `spec.md` REQ-006/007/008 (recorded, residue not built this sub-phase).
- [ ] Byte-identity of the shipped default seams is re-confirmed by the still-open fusion-bonus unit test before any `'configured'` promotion.
- [x] Level-3 packet docs use the system-spec-kit templates and pass strict validation.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A set of candidate-local determinism improvements at existing Memory MCP fusion / render / hashing seams, plus one centralized content-id module. No schema migration, no shared-infrastructure rewrite, no daemon topology change. The cross-subsystem contract is a *signature* contract (`fuseResultsMulti` + `{bonusOverChannels}`), not a code-sharing rewrite: siblings promote/import with adapters.

### Key Components
- **Total-comparator (the keystone)**: a hand-written total order (JS `(a,b)=>b-a` is not total, NaN / -0 poison it) realized via C5-B's content-derived tiebreak across the deterministic comparator and the RRF output sorts.
- **Two content-id primitives**: `lib/content-id.ts`, Primitive A `hashContentBody` (content-body SHA-256) + Primitive B `hashCanonicalJson` (canonical-field SHA-256), the formula is centralized, the identity is parameterized (legacy bare-hex, B's token-stripping receipt-specific).
- **ANN ordering**: `, m.id ASC` (COALESCE) on the 4 ranked ANN `ORDER BY distance` so LIMIT-survival into fusion is run-stable, determinism *below* the RRF layer.
- **Fusion bonus seam**: `bonusOverChannels` param on `fuseResultsMulti`, `'active'` default byte-identical, the `'configured'` mode is the residue.
- **Rank-time decay clock**: caller-supplied `nowMs` decay vs the `trackAccess`-only path, no-timestamp skip guard keeps clock-less queries byte-identical.
- **Render stage (residue)**: a content-derived serialization-order re-sort at the render boundary, separate from the fusion tiebreak.

### Data Flow
Candidate generation feeds ranked ANN rows (now tie-stable) into RRF fusion. Fusion applies the `'active'`-default bonus and the content-derived output tiebreak. Stage-2 applies the caller-clock rank-time decay. The result set renders through the envelope (today score-order, C5-A would add a content-derived render re-sort). Identity hashing routes through the one content-id module at every call site. The whole path is byte-identical-by-default so the sibling subsystems (002/003/004) that byte-compare against the shared fuser stay stable until they opt into a non-default mode.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `shared/algorithms/rrf-fusion.ts` | RRF fusion + convergence bonus + output sort | Content-hash output tiebreak (DONE), `bonusOverChannels` param `'active'` default (DONE), `'configured'` mode (PENDING) | `rrf-fusion.vitest.ts`, `unit-rrf-fusion.vitest.ts` |
| `mcp_server/lib/search/vector-index-queries.ts` | Ranked ANN candidate source | `, m.id ASC` COALESCE on the 4 ranked `ORDER BY distance` (DONE) | Memory search/fusion suite |
| `mcp_server/lib/search/pipeline/stage2-fusion.ts` | Signal application + rank-time decay | Caller-`nowMs` rank-time decay clock, no-timestamp skip guard preserved (DONE) | `stage2-fusion.vitest.ts` |
| `mcp_server/lib/content-id.ts` | (new) centralized hashing | `hashContentBody` + `hashCanonicalJson` two primitives (DONE) | content-hash parity test |
| `mcp_server/lib/response/envelope.ts` + `formatters/search-results.ts` | Recall serialization / render | Content-derived serialization-order render stage (PENDING C5-A) | golden-file re-baseline (future) |
| `mcp_server/lib/storage/idempotency-receipts.ts` | Receipt keying / canonicalization | Identity-hardening pair documented-NO-GO single-tenant (PENDING/not built) | n/a (documented) |

Inventories were scoped to candidate seams. Consumer inventories cover the shared `fuseResultsMulti` signature (consumed by Code Graph 002, Skill Advisor 003, Deep Loop 004), the comparator/output-sort order, the hashing call sites and the envelope render order.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Foundation keystone (shipped in Wave-0 / packet 030)
- [x] Centralize the two content-id primitives into `lib/content-id.ts`, prove byte-identical (commit `18c8582e33`).
- [x] Add the content-derived comparator + RRF-output tiebreak (C5-B), primary order unchanged (commit `bec0eed27f`).
- [x] Add `, m.id ASC` COALESCE tie-stability to the 4 ranked ANN queries (commit `bec0eed27f`).

### Phase 2: Byte-identical-by-default seams (shipped in Wave-0 / packet 030)
- [x] Add the `bonusOverChannels` param with the `'active'` byte-identical default (C-X1), arithmetic byte-identity trace (commit `65cfcea513`).
- [x] Add the caller-`nowMs` rank-time decay clock (C6-A) with the restored no-timestamp skip guard so it is a pure refactor (commit `65cfcea513`).

### Phase 3: Residue (PENDING, gated, NOT built this sub-phase)
- [ ] C-X1-true-multichannel (`'configured'` mode), build alongside the Wave-1 C2-B per-class weight consumer, after the fusion-bonus unit test lands.
- [ ] C5-A render-order serialization stage, build as the fuller-parity successor to C5-B, re-baseline golden files once.
- [ ] M-dual-class-identity / M-clock-skew-replay-window, keep documented-NO-GO behind a multi-writer-adoption gate. Do NOT build for the single-trusted-host tool.

### Phase 4: Docs + verification
- [x] Author Level-3 packet docs from the system-spec-kit templates.
- [x] Run strict packet validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static | Memory MCP TypeScript contracts | `npm run typecheck` |
| Build | Memory MCP package build | `npm run build` |
| Content-id parity | `hashContentBody` / `hashCanonicalJson` byte-identical to legacy call sites | `content-hash-dedup.vitest.ts` |
| Determinism | ANN tie-stability, comparator + RRF output tiebreak, byte-identical default bonus/clock | `stage2-fusion.vitest.ts`, `rrf-fusion.vitest.ts`, `unit-rrf-fusion.vitest.ts` |
| Fusion-bonus invariant (open) | Confirm `'active'` default == pre-change fusion before promoting `'configured'` | new fusion-bonus unit test (residue gate) |
| Packet docs | Level-3 structure, anchors, frontmatter, required files | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `lib/content-id.ts` two primitives | Internal (shipped) | Green | Shared by C5-B tiebreak, ANN COALESCE, future C4-B `derived_id` |
| Shared `fuseResultsMulti` signature | Cross-subsystem | Green (`'active'` default) | Consumed by Code Graph 002, Skill Advisor 003, Deep Loop 004, must stay byte-identical |
| Wave-1 C2-B per-class weight injection | Downstream sub-phase | Pending | The only consumer of the `'configured'` mode, blocks REQ-006 |
| Still-open fusion-bonus unit test | Verification | Pending | Gates the "byte-identical-by-default" determinism claim |
| Single-tenant threat model | Design | Fixed | De-scopes the identity-hardening pair (REQ-008) |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A shipped seam re-orders default output for a sibling subsystem byte-compare, or the content-id parity test fails.
- **Procedure**: Revert the candidate commit listed in `spec.md` section 13. Candidates 2+3 (ANN + C5-B) share commit `bec0eed27f`, candidates 4+5 (C-X1 `'active'` + C6-A) share commit `65cfcea513`, the content-id module is `18c8582e33`. Each is an independent revert.
- **Data reversal**: None, no shipped candidate in this foundation adds a schema migration. Rollback is code + test revert only. The PENDING residue is not built, so there is nothing to roll back there.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Foundation keystone | Seam reads from `../research/research.md` | Byte-identical seams |
| Byte-identical seams | Total-comparator + content-id primitives | Cross-subsystem consumers (002/003/004) |
| Residue | Wave-1 C2-B consumer + fusion-bonus unit test + multi-writer call | (documented, not built) |
| Docs + verification | Shipped-commit evidence + gated residue | Strict validation |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Candidate Group | Complexity | Actual Outcome |
|-----------------|------------|----------------|
| two-content-id-primitives | S→M | Shipped `18c8582e33` |
| ANN + C5-B tiebreaks | S | Shipped `bec0eed27f` |
| C-X1 `'active'` + C6-A | S→M | Shipped `65cfcea513` |
| C-X1 `'configured'` (residue) | S→M | Pending, gated on C2-B + unit test |
| C5-A render stage (residue) | M | Pending, render-build + golden re-baseline |
| dual-class / clock-skew (residue) | M/S | Pending, single-tenant-refuted, documented-NO-GO |
| Docs + verification | M | Completed |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

| Candidate | Rollback |
|-----------|----------|
| 1 two-content-id-primitives | Inline previous hashing call sites or revert `18c8582e33`. |
| 2 ANN-tie-stable-order | Remove `, m.id ASC` COALESCE from the 4 ranked ANN queries. |
| 3 C5-B | Remove content-hash comparator + RRF output tiebreaks. |
| 4 C-X1 `'active'` | Remove the `bonusOverChannels` param (revert to inline active-channel denominator). |
| 5 C6-A | Remove the rank-time decay clock refactor (restore `trackAccess`-only path). |
| 6-9 residue | Not built, nothing to roll back. |
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
028 research (research.md + roadmap + synthesis)
  -> total-comparator + two content-id primitives (keystone, shipped)
  -> content-derived tiebreaks: ANN below-RRF + C5-B comparator/output (shipped)
  -> byte-identical-by-default seams: C-X1 'active' + C6-A clock (shipped)
  -> cross-subsystem byte-compare contract (consumers 002/003/004)
  -> residue: C-X1 'configured' (gated by C2-B + fusion-bonus unit test)
            : C5-A render stage (render-build + golden re-baseline)
            : dual-class / clock-skew (multi-writer-gate, documented-NO-GO)
  -> Level-3 packet docs -> strict validation
```
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

The critical path was not implementation volume, it was preserving byte-identity while making ordering reproducible. The discipline that defines this sub-phase: every shipped seam either re-orders ties only (ANN, C5-B) or defaults to current behavior (C-X1 `'active'`, C6-A clock), so the three sibling subsystems that byte-compare against the shared fuser are never silently re-ordered. The residue is deliberately gated: `'configured'` has no consumer yet, C5-A needs a golden re-baseline, and the identity-hardening pair fails the single-tenant threat model, building any of them now would add risk without an earned benefit.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Evidence |
|-----------|----------|
| M1 Keystone landed | content-id module `18c8582e33`, C5-B + ANN tiebreaks `bec0eed27f` |
| M2 Byte-identical seams landed | C-X1 `'active'` + C6-A `65cfcea513`, default-identity traced |
| M3 Residue gated | C-X1 `'configured'`, C5-A, dual-class/clock-skew recorded PENDING with gates in `spec.md` §13 |
| M4 Cross-subsystem contract held | `'active'` default keeps consumers 002/003/004 byte-stable |
| M5 Docs closed | Level-3 docs authored, strict validation run |
<!-- /ANCHOR:milestones -->
