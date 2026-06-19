---
title: "Verification Checklist: 015-Residual Correctness — RRF-scale + maintenance-grace TTL (028/001 impl)"
description: "QA checklist for the two Wave-0 always-on correctness residuals: A4 routes resolveSearchScore through the 015-calibrated absolute scale; A7 derives the maintenance marker TTL from ownerLease.ttlMs x K with two codified invariants. Both DONE in this phase; no packet 030 edit."
trigger_phrases:
  - "verification checklist 015 residual correctness"
  - "resolveSearchScore rrf scale QA"
  - "maintenance marker ttl lease checklist"
  - "phase yield refresh invariant QA"
  - "028 speckit-memory wave-0 correctness checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/021-residual-correctness"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Verified both residual candidates"
    next_safe_action: "None — phase complete"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-021-residual-correctness"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: 015-Residual Correctness — RRF-scale + maintenance-grace TTL

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Both residuals are documented and bounded to their seams.
  - **Evidence**: `spec.md` §2-3 scope A4 to `handlers/memory-search.ts:494-508` and A7 to `lib/storage/maintenance-marker.ts:23-26` + the lease reference; out-of-scope excludes divergence-gated-reroute, the harness, and the fusion/lease policy.
- [x] CHK-002 [P0] 028 research is roadmap input; the shipped record is traced to packet 030.
  - **Evidence**: `spec.md` METADATA cites `synthesis/08`, the 008 deltas (A4=iter-002, A7=iter-007), and the unchanged packet 030 shipped record.
- [x] CHK-003 [P1] Candidate seams identified before implementation.
  - **Evidence**: `spec.md` §3 candidate table + `plan.md` affected-surfaces record file:line seams (A4 015-fix reference at `confidence-scoring.ts:343,402-403`; A7 lease at `mk-spec-memory-launcher.cjs:419,455-456,524-525`).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Memory MCP typecheck passes for both candidates.
  - **Evidence**: `npm run typecheck` green in `.opencode/skills/system-spec-kit/mcp_server` after the A4 + A7 edits.
- [x] CHK-011 [P0] Memory MCP build passes for both candidates.
  - **Evidence**: `npm run build` green in `.opencode/skills/system-spec-kit/mcp_server`.
- [x] CHK-012 [P1] A4 reads the 015-calibrated scale, with graceful fallback.
  - **Evidence**: `memory-search.ts` imports `resolveAbsoluteRelevance`; `tests/memory-search-quality-filter.vitest.ts` covers cosine-scale rows, lexical-only fallback, `null` similarity, and `averageSimilarity`.
- [x] CHK-013 [P1] A7 keeps the on-disk value byte-identical and the lease policy untouched.
  - **Evidence**: `maintenance-marker.ts` derives `MAINTENANCE_MARKER_TTL_MS = 60_000 × 3 = 180_000`; `git status --short .opencode/bin` showed no launcher edits.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] A4 acceptance criteria met.
  - **Evidence**: `npx vitest run tests/memory-search-quality-filter.vitest.ts tests/maintenance-marker.vitest.ts tests/launcher-maintenance-guard.vitest.ts` green: 3 files, 36 tests. A4 falsifier collapsed semantic scores to zero and the score tests failed as expected.
- [x] CHK-021 [P0] A7 acceptance criteria met.
  - **Evidence**: `tests/maintenance-marker.vitest.ts` asserts `MAINTENANCE_MARKER_TTL_MS === ownerLease.ttlMs × K`, `K > 2`, derived TTL `> 2×` reclaim, and `activeUntilMs` remains `now + TTL`. A7 falsifier set `K=2` and the derivation test failed as expected.
- [x] CHK-022 [P1] Regression: the maintenance-guard adopt/reap cases are unchanged.
  - **Evidence**: `tests/launcher-maintenance-guard.vitest.ts` included in the focused green vitest run.
- [x] CHK-023 [P1] A4 score-magnitude before/after is captured (regression-baseline rule).
  - **Evidence**: Before fixed fixture average: `0.032`; after fixed fixture average: `0.715`. The shift is the expected move from RRF magnitude to cosine-scale relevance.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each residual has a final disposition.
  - **Evidence**: `spec.md` §3 marks both A4-015-residual and A7-maintenance-grace-ttl as DONE; no gated candidate was left pending.
- [x] CHK-FIX-002 [P0] A4 is independently verified, not assumed.
  - **Evidence**: The 015 fix is confined to `confidence-scoring.ts:343,402-403`; `resolveSearchScore` (`memory-search.ts:494-499`) is the unpatched re-route path — the seam read confirms the `[INFERRED]` residual before any code change (REQ-002).
- [x] CHK-FIX-003 [P0] A7 preserves the live daemon-liveness contract.
  - **Evidence**: `derived TTL = ownerLease.ttlMs × K (K=3)` = 180000 stays > the 2× reclaim window (120s); focused vitest checks the relationship against the launcher lease literal.
- [x] CHK-FIX-004 [P1] Both fixes are byte-behavior-preserving where claimed.
  - **Evidence**: A7 is byte-identical at K=3 with the live lease TTL; A4 intentionally changes the read scale (a correctness fix) with the before/after magnitude captured, not silently shipped (REQ-008).
- [x] CHK-FIX-005 [P1] Evidence is pinned to seams and research citations.
  - **Evidence**: `tasks.md` records the file:line seams; `spec.md` cites the 008 deltas (A4 → iter-002, A7 → iter-007) and the 015 fix reference.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets introduced.
  - **Evidence**: A4 is a scale read; A7 is a constant derivation + comments; touched files contain no secrets.
- [x] CHK-031 [P1] A7 does not weaken the daemon-liveness guard.
  - **Evidence**: The marker still gates `shouldAdoptDespiteProbe`; `launcher-maintenance-guard.vitest.ts` remains green, and the marker TTL stays greater than the stale reclaim window.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks/checklist synchronized.
  - **Evidence**: Both candidates show DONE status across `spec.md` §3, `plan.md` §4, and `tasks.md` Phase 2.
- [x] CHK-041 [P1] A7's two invariants are documented in-module.
  - **Evidence**: `maintenance-marker.ts` comments state the stale-reclaim relationship and the refresh-before-half-window rule using durable WHY only; comment hygiene passed on touched code/test files.
- [x] CHK-042 [P2] Research provenance cited per candidate.
  - **Evidence**: `spec.md` RELATED DOCUMENTS + `tasks.md` Cross-References map A4 → iter-002 and A7 → iter-007.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Only scoped sub-phase docs are authored.
  - **Evidence**: Edits are limited to this phase docs and the scoped MCP-server implementation/tests; packet 030 was not modified.
- [x] CHK-051 [P1] No temp files left outside `scratch/`.
  - **Evidence**: No scratch/baseline files were created; `git status --short` shows only scoped code/test/docs changes.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-19
**Verified By**: Codex
**Scope**: Two Wave-0 always-on correctness residuals (A4-015-residual RRF-scale + A7-maintenance-grace-ttl), both DONE in this phase; packet 030 unchanged.
<!-- /ANCHOR:summary -->
