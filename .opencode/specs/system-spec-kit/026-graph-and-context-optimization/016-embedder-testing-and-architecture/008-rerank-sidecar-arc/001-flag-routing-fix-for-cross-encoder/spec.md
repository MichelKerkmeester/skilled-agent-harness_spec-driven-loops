---
title: "Feature Specification: Flag-routing fix for cross-encoder HTTP local provider"
description: "Separate SPECKIT_CROSS_ENCODER from RERANKER_LOCAL so the HTTP local-provider path in cross-encoder.ts is actually reachable. Today setting SPECKIT_CROSS_ENCODER=true is necessary but not sufficient; RERANKER_LOCAL=true activates the no-op local-reranker.ts shim which shadows the HTTP cross-encoder dispatch in stage3-rerank.ts:400. Prerequisite for arc phases 002-005."
trigger_phrases:
  - "speckit_cross_encoder routing"
  - "reranker_local shim shadow"
  - "stage3-rerank flag gate"
  - "cross-encoder http local provider"
  - "001 flag routing fix"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/001-flag-routing-fix-for-cross-encoder"
    last_updated_at: "2026-05-20T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Spec authored from arc plan + codex critique"
    next_safe_action: "Begin Phase A audit"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/local-reranker.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/cross-encoder.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts"
---
# Feature Specification: Flag-routing fix for cross-encoder HTTP local provider

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

Phase 001 of the 008 rerank-sidecar arc. Surgical fix to the Stage 3 reranker dispatch logic so a real HTTP cross-encoder (the sidecar shipped in phase 002) is reachable through the existing pipeline.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-05-20 |
| **Branch** | `main` |
| **Parent Arc** | `008-rerank-sidecar-arc` |
| **Successor** | `002-system-rerank-sidecar-skill` (depends on this fix) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

spec-memory has two reranker entry points and the flag contract between them shadows the path we actually want to use:

1. `lib/search/cross-encoder.ts` — full HTTP cross-encoder client with 3 providers (Voyage, Cohere, **local at `localhost:8765`**). Gated by `isCrossEncoderEnabled()` → `SPECKIT_CROSS_ENCODER=true`.
2. `lib/search/local-reranker.ts` — **no-op compatibility shim** (header comment: "Runtime reranking now lives in the sentence-transformers cross-encoder path"). Gated by `isLocalRerankerEnabled()` → `RERANKER_LOCAL=true`.

In `lib/search/pipeline/stage3-rerank.ts:400`, the dispatch checks `isLocalRerankerEnabled()` BEFORE the cross-encoder path. So if an operator sets `RERANKER_LOCAL=true` (the obvious "I want local reranking" choice), they get the no-op shim and the HTTP path is never invoked — even when `SPECKIT_CROSS_ENCODER=true` is ALSO set.

Symptom today: setting both env vars is necessary because Stage 3 still routes through the local-reranker.ts shim. Result is the same as no reranker at all: positional fallback scores capped at ~0.5, `requestQuality: 'weak'` across all searches, `WEIGHT_RERANKER=0.20` boolean factor stays at 0.

### Purpose

Establish a clean precedence rule in `stage3-rerank.ts`:

1. If `SPECKIT_CROSS_ENCODER=true` AND a configured provider is available (Voyage key, Cohere key, or `localhost:8765` healthy) → route to `cross-encoder.ts`.
2. Else if `RERANKER_LOCAL=true` → route to `local-reranker.ts` (the no-op shim).
3. Else → positional fallback only.

This makes `SPECKIT_CROSS_ENCODER=true` sufficient on its own. `RERANKER_LOCAL` keeps its legacy semantics (no-op now; was the in-process node-llama-cpp path historically) but doesn't shadow the HTTP path anymore.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Modify `stage3-rerank.ts:400` (gate around the cross-encoder call) to put `isCrossEncoderEnabled()` BEFORE `isLocalRerankerEnabled()` in the precedence chain.
- Optionally tighten `isLocalRerankerEnabled()` in `search-flags.ts:363` to return `false` whenever `SPECKIT_CROSS_ENCODER=true` is set (defense in depth — even if a future caller probes the flag directly, it won't activate the shim when the HTTP path is active).
- Add a Vitest case in `tests/stage3-rerank-regression.vitest.ts` (or new file) that asserts: when `SPECKIT_CROSS_ENCODER=true` + `RERANKER_LOCAL=true` are BOTH set, the cross-encoder path is invoked, not the local-reranker shim.
- Update doc comment at the head of `local-reranker.ts` to reflect the new precedence ("activates only when SPECKIT_CROSS_ENCODER is NOT set").
- Update `ENV_REFERENCE.md` row for `SPECKIT_CROSS_ENCODER` to note the precedence over `RERANKER_LOCAL`.

### Out of Scope

- **The sidecar itself** — phase 002 creates `system-rerank-sidecar`. This phase is the flag-routing prerequisite only. After this phase ships, setting `SPECKIT_CROSS_ENCODER=true` without a sidecar running still results in positional fallback (no change in observable behavior until phase 002).
- **Default-flipping `cross-encoder.ts:55` model name** — phase 005 does that after the phase-004 benchmark.
- **Sigmoid normalization at the sidecar boundary** — phase 002 owns that (sidecar-side code).
- **Removing local-reranker.ts entirely** — it's still imported by `stage3-rerank.ts` and a few tests. Removal is a follow-on after the precedence change has been in place for a few sessions.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts` | Modify | Swap precedence: check `isCrossEncoderEnabled()` before `isLocalRerankerEnabled()` |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts` | Modify | Tighten `isLocalRerankerEnabled()` to return `false` when `SPECKIT_CROSS_ENCODER=true` |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/local-reranker.ts` | Modify | Update header doc comment about precedence |
| `.opencode/skills/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts` | Modify | Add precedence-assertion test case |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modify | Document precedence in the `SPECKIT_CROSS_ENCODER` row |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `SPECKIT_CROSS_ENCODER=true` routes to `cross-encoder.ts` regardless of `RERANKER_LOCAL` value | Unit test in `stage3-rerank-regression.vitest.ts` asserts dispatch hits `cross-encoder.ts` when both env vars are true; mocked HTTP returns 200 + sigmoid scores |
| REQ-002 | `RERANKER_LOCAL=true` alone (without `SPECKIT_CROSS_ENCODER`) still routes to the no-op shim (legacy behavior preserved) | Existing tests continue to pass; one new test asserts shim is hit when only `RERANKER_LOCAL=true` |
| REQ-003 | Neither flag set → positional fallback only (no regression) | Existing default-path tests continue to pass |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | `local-reranker.ts` header comment reflects the new precedence | Doc comment mentions `SPECKIT_CROSS_ENCODER` takes precedence |
| REQ-005 | `ENV_REFERENCE.md` documents the precedence | `SPECKIT_CROSS_ENCODER` row mentions overriding `RERANKER_LOCAL` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Setting `SPECKIT_CROSS_ENCODER=true` alone routes to the HTTP path. Verified via Vitest mock that calls land on `cross-encoder.ts`.
- **SC-002**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-packet> --strict` exits 0.
- **SC-003**: Full Vitest run on `mcp_server/` exits 0 (no regressions in adjacent reranker tests).
- **SC-004**: `npm run build` in `system-spec-kit/mcp_server` exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Existing operator setups rely on `RERANKER_LOCAL=true` being the "enable local reranker" switch | Behavior change: now they also need `SPECKIT_CROSS_ENCODER=true` if a real sidecar runs | After this phase ships, `RERANKER_LOCAL` behavior is unchanged when set alone (no-op shim). No silent regression. Document the precedence in changelog + ENV_REFERENCE. |
| Risk | A test that explicitly co-sets both flags expects shim behavior | Test failure | Audit existing tests in this phase; update assertions to match new precedence |
| Risk | Stage 3 has 600+ lines of routing; missing a code path | Cross-encoder still bypassed | Search for all `isLocalRerankerEnabled` callers in `stage3-rerank.ts` and audit each |
| Dependency | None upstream — this is the root of the arc | n/a | n/a |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should `isLocalRerankerEnabled()` return `false` when `SPECKIT_CROSS_ENCODER=true` (defense in depth), or should we trust callers to check precedence in their own code? **PROPOSED: tighten the function** — single source of truth; future callers can't accidentally re-introduce the bug.
- Should this phase delete `local-reranker.ts` entirely (it's a no-op shim already)? **PROPOSED: no, keep it.** A few tests + import surfaces still reference it. Removal is a follow-on cleanup, not a prerequisite for the arc.
- Are there any downstream consumers of `WEIGHT_RERANKER` that assume the no-op shim still ran (e.g. setting `hasReranker=true` on results)? **TO VERIFY**: grep `hasRerankerSignal` callers in `confidence-scoring.ts` and adjacent. Likely safe — the shim returns inputs unchanged without setting any reranker flag — but worth confirming during implementation.
<!-- /ANCHOR:questions -->
