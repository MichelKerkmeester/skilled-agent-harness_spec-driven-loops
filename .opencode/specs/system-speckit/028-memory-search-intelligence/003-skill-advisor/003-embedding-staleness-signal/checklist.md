---
title: "Verification Checklist: Embedding-Staleness Signal (Skill Advisor SA8)"
description: "QA checklist for the advisor SA8 embedding-staleness sub-phase: signature capture at projection build, compare-on-load verdict (mirror memory_embedding_reconcile), semantic_shadow lane degrade, the Memory-010 idempotent-async rebuild reuse gate and strict packet validation."
trigger_phrases:
  - "verification checklist advisor embedding staleness"
  - "SA8 projection signature QA"
  - "advisor projection rebuild idempotent checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/003-skill-advisor/003-embedding-staleness-signal"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Verified the advisor embedding-staleness signal implementation"
    next_safe_action: "Wire the stale-triggered rebuild once the Memory 010 primitive is available"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-003-embedding-staleness-signal"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Embedding-Staleness Signal (Skill Advisor SA8)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level2-verify | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | Hard blocker | Cannot close the signal until complete or explicitly gated with evidence |
| **[P1]** | Required | Must be verified or documented as a gated residual follow-up |
| **[P2]** | Optional | Can defer with rationale |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Sub-phase scope is documented and bounded to the SA8 pair: the staleness signal (signature capture + compare-on-load + lane degrade) and the Memory-010 idempotent-async rebuild reuse.
  - **Evidence**: `spec.md` sections 2, 3 and 10 define the 2-candidate pair and exclude the other advisor candidates (C3/C5/C1/QCR/C4/C6/AMB, sibling sub-phases) and building the shared primitive.
- [x] CHK-002 [P0] 028 research is treated as roadmap input. The shipped record is traced to packet 030.
 - **Evidence**: `spec.md` METADATA + section 10 cite `../research/sibling-cross-cutting-revisit/research.md:80` and Wave-0 record (SA8 absent → PENDING, Wave-1 future-work `the Wave-1 list`).
- [x] CHK-003 [P0] The SA8 seam and the `memory_embedding_reconcile` mirror are confirmed by direct read before any change.
  - **Evidence**: `projection.ts:315,328,375,413` (`generatedAt = now()` load stamps), columns `skill-graph-db.ts:187,348-352`, signature builder `:599-600`. Mirror `embedding-reconcile.ts:139-142` (active pointer) + `:183-189` (`verified:false, reason:"shard model X != active Y"`) read directly.
- [x] CHK-004 [P0] The shared-infra dependency (Memory-010 idempotent-async primitive) is named as the gate for facet #2 (the rebuild) before implementation.
  - **Evidence**: `spec.md` REQ-004 + section 6. Synthesis `04-sibling-and-cross-cutting.md:34` (build the primitive once in Memory 010, reuse on the advisor side).
- [x] CHK-005 [P1] Candidate seams identified before implementation.
  - **Evidence**: `spec.md` section 3 Files-to-Change + `plan.md` affected-surfaces list `projection.ts:286-317,:388`, `skill-graph-db.ts:187,348-352,599-600`, `lanes/semantic-shadow.ts` and the rebuild seam.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Advisor MCP typecheck passes after the signature capture + compare-on-load change.
  - **Evidence**: `npm run typecheck` in `system-skill-advisor/mcp_server` passed with 0 errors after implementation.
- [x] CHK-011 [P0] Advisor MCP build passes.
  - **Evidence**: `npm run build` in `system-skill-advisor/mcp_server` passed.
- [x] CHK-012 [P0] The compare-on-load verdict mirrors `memory_embedding_reconcile`. It does NOT re-derive a parallel staleness shape.
  - **Evidence**: `readAdvisorEmbeddingStaleness()` emits `{stale, reason}` and compares stored vector model ids against the active pointer. Mismatch reasons use the same compare-and-report style.
- [x] CHK-013 [P1] The signature reuses `providerModelId` (`skill-graph-db.ts:599-600`). It does NOT invent a new signature format.
  - **Evidence**: `providerModelId` is exported from `skill-graph-db.ts` and reused by `projection.ts` while compact adapter model ids remain supported.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Detection: a projection built under embedder A, loaded under active embedder B, yields `{stale:true}` + a reason string. Matching signature yields `{stale:false}`.
  - **Evidence**: `projection-embedding-staleness.vitest.ts` covers matching active model and mismatching stored model.
- [x] CHK-021 [P0] Fail-closed: a missing/null stored signature on a populated projection yields `{stale:true}`.
  - **Evidence**: `projection-embedding-staleness.vitest.ts` covers a populated vector row with null `model_id`.
- [x] CHK-022 [P0] Lane degrade: `semantic_shadow` degrades under a stale verdict (no superseded cosine rows ranked as fresh) and is unchanged under a fresh verdict.
  - **Evidence**: `projection-embedding-staleness.vitest.ts` covers empty semantic lane output and fusion runtime-degraded lane health on a stale verdict.
- [x] CHK-023 [P0] Back-compat: `generatedAt` is RETAINED as a sibling field. The signature is ADDED, not a replacement.
  - **Evidence**: `projection-embedding-staleness.vitest.ts` asserts `generatedAt` is still present on loaded SQLite projections.
- [ ] CHK-024 [P1] Rebuild idempotency (Phase D, gated on Memory 010): a rebuild interrupted mid-cursor resumes without re-applying completed rows. Two concurrent stale loads launch a single rebuild.
  - **Evidence**: PENDING/GATED, Memory-010 primitive reuse Vitest, SC-003, REQ-004.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each candidate has a final disposition.
  - **Evidence**: `spec.md` section 10, signal DONE. Rebuild reuse PENDING with Memory 010 gate.
- [x] CHK-FIX-002 [P0] The staleness signal targets the READ/projection boundary, not the write-path refresh guard (which already detects per-row drift).
  - **Evidence**: `spec.md` risk R-001, the write path skips when `vec_model_id===modelId` (`skill-graph-db.ts:1233-1234`). SA8 adds the missing check at projection LOAD (`projection.ts:388`), not a duplicate of the refresh path.
- [x] CHK-FIX-003 [P0] Building the shared idempotent-async primitive is OUT of scope. This sub-phase REUSES it.
  - **Evidence**: `spec.md` section 3 Out-of-Scope + REQ-004. Synthesis `04-sibling-and-cross-cutting.md:34` (second consumer, no second engine).
- [x] CHK-FIX-004 [P0] The fail-closed default and report-only-on-unreadable-pointer behaviors are named, not assumed away.
  - **Evidence**: `spec.md` §L2 EDGE CASES (missing signature ⇒ stale, unreadable pointer ⇒ report-only, mirror `embedding-reconcile.ts:34`).
- [x] CHK-FIX-005 [P1] The no-benchmark caveat is recorded (SA8 banked ZERO benchmarks. Leverage/effort are structural inference).
  - **Evidence**: `spec.md` risk R-003 + SC-004. `plan.md` §L2 EFFORT ESTIMATION (M-H / S-M, inferred).
- [x] CHK-FIX-006 [P1] Evidence is pinned to research citations and the mirror seam.
  - **Evidence**: `spec.md` + `tasks.md` cite `../research/sibling-cross-cutting-revisit/research.md:80`, synthesis `01:36`/`04:15,:34` and `embedding-reconcile.ts:162-189`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] No secrets introduced.
  - **Evidence**: Changes are projection-shape + ranking-trust logic over internally-produced data. No secret-bearing files in scope.
- [x] CHK-041 [P1] No new trust boundary or external data sink.
  - **Evidence**: `spec.md` NFR-S01, SA8 reads the active-embedder pointer and the stored projection signature, both internally produced. No external data path.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] `plan.md` covers both candidates + the signal-first sequencing and the Memory-010 dependency.
  - **Evidence**: `plan.md` phases A-D, effort, dependencies and rollback tables list the signal (A/B/C) and the gated rebuild reuse (D).
- [x] CHK-051 [P1] `tasks.md` has tasks per candidate plus baseline/verification/docs.
  - **Evidence**: T001 (baseline), T002-T007 (signal), T008-T009 (rebuild reuse, blocked), T010-T015 (verification + docs).
- [x] CHK-052 [P1] No leakage into packet 030 or sibling-subsystem code.
  - **Evidence**: Code edits are scoped to `system-skill-advisor/mcp_server`. Docs edits are scoped to this sub-phase. Packet 030, the Memory-010 primitive and `embedding-reconcile.ts` were not modified.
- [x] CHK-053 [P2] Research provenance is cited per candidate.
  - **Evidence**: `spec.md` RELATED DOCUMENTS maps each facet to `../research/sibling-cross-cutting-revisit/research.md:80` and synthesis `04:34`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] Only scoped sub-phase docs are authored.
  - **Evidence**: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `graph-metadata.json` under this sub-phase folder.
- [x] CHK-061 [P1] Unrelated and shipped-record files remain untouched.
  - **Evidence**: No edits to packet 030, the 028 parent, Memory `010-consolidation-cursor-clock`, `embedding-reconcile.ts` or sibling research children.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 13/13 |
| P1 Items | 9 | 8/9 (1 PENDING, CHK-024 gated on Memory 010) |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-06-19
**Verified By**: Claude (re-plan author)
**Scope**: Advisor SA8 embedding-staleness sub-phase: the staleness signal (signature capture + compare-on-load + `semantic_shadow` lane degrade) is implemented and verified. The Memory-010 idempotent-async rebuild reuse remains pending/gated. CHK-024 is gated on Memory 010.
<!-- /ANCHOR:summary -->

---

## RELATED DOCUMENTS

- **Specification**: `spec.md` (section 10 candidate status).
- **Plan**: `plan.md`.
- **Tasks**: `tasks.md`.
- **Source research**: `../research/research.md`, `../research/sibling-cross-cutting-revisit/research.md:80`, `../../research/synthesis/01-go-candidates.md:36` + `04-sibling-and-cross-cutting.md:15,:34`.
- **Shared-infra dependency**: `../../001-speckit-memory/010-consolidation-cursor-clock/spec.md`.
- **Mirror reference**: `embedding-reconcile.ts:162-189`.
- **Shipped record (historical evidence)**: Wave-0 record and Wave-1 list.
