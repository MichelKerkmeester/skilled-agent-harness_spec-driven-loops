---
title: "Verification Checklist: 015-Residual Correctness — RRF-scale + maintenance-grace TTL (028/001 impl)"
description: "QA checklist for the two Wave-0 always-on correctness residuals: A4 routes resolveSearchScore through the 015-calibrated absolute scale; A7 derives the maintenance marker TTL from ownerLease.ttlMs x K with two codified invariants. Both PENDING — no shipped commit."
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
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/021-021-015-residual-correctness"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author Level-2 verification checklist for the two correctness residuals"
    next_safe_action: "Run validate.sh --strict on this sub-phase"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "../../../030-memory-search-intelligence-impl/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-021-015-residual-correctness"
      parent_session_id: null
    completion_pct: 0
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
  - **Evidence**: `spec.md` METADATA cites `synthesis/08`, the 008 deltas (A4=iter-002, A7=iter-007), and `030 §14` — where neither candidate appears (both PENDING).
- [x] CHK-003 [P1] Candidate seams identified before implementation.
  - **Evidence**: `spec.md` §3 candidate table + `plan.md` affected-surfaces record file:line seams (A4 015-fix reference at `confidence-scoring.ts:343,402-403`; A7 lease at `mk-spec-memory-launcher.cjs:419,455-456,524-525`).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Memory MCP typecheck passes for both candidates.
  - **Evidence**: `npm run typecheck` green in `.opencode/skills/system-spec-kit/mcp_server` after the A4 + A7 edits.
- [ ] CHK-011 [P0] Memory MCP build passes for both candidates.
  - **Evidence**: `npm run build` green in the same package.
- [ ] CHK-012 [P1] A4 reads the 015-calibrated scale, with graceful fallback.
  - **Evidence**: `resolveSearchScore` reads the absolute-relevance signal where `row.similarity` is present, effective-score fallback otherwise; never throws on a null similarity (REQ-001/REQ-006).
- [ ] CHK-013 [P1] A7 keeps the on-disk value byte-identical and the lease policy untouched.
  - **Evidence**: `MAINTENANCE_MARKER_TTL_MS = ownerLease.ttlMs × K (K=3)` = 180000; the lease heartbeat, reclaim window, and `shouldAdoptDespiteProbe` guard are unchanged (REQ-003/REQ-007).
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] A4 acceptance criteria met.
  - **Evidence**: Fixture row (RRF ~0.03 + cosine ~0.8) → `computeAverageScore` returns the cosine-scale average, not the RRF magnitude; lexical-only row → effective-score fallback (SC-001).
- [ ] CHK-021 [P0] A7 acceptance criteria met.
  - **Evidence**: Test asserts `MAINTENANCE_MARKER_TTL_MS === ownerLease.ttlMs × K`, `K > 2`, and `derived TTL > 2× the reclaim window` (SC-002).
- [ ] CHK-022 [P1] Regression: the maintenance-guard adopt/reap cases are unchanged.
  - **Evidence**: `tests/launcher-maintenance-guard.vitest.ts` still green; `activeUntilMs` still `now + TTL`.
- [ ] CHK-023 [P1] A4 score-magnitude before/after is captured (regression-baseline rule).
  - **Evidence**: Before/after `computeAverageScore` for a fixed query set recorded; the magnitude change is the expected correctness effect, documented not silent (REQ-008).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each residual has a final disposition.
  - **Evidence**: `spec.md` §3 — both A4-015-residual and A7-maintenance-grace-ttl are PENDING with their gate (always-on correctness; no benchmark, no schema migration, no shared-infra dep); neither is in the 030 shipped record.
- [ ] CHK-FIX-002 [P0] A4 is independently verified, not assumed.
  - **Evidence**: The 015 fix is confined to `confidence-scoring.ts:343,402-403`; `resolveSearchScore` (`memory-search.ts:494-499`) is the unpatched re-route path — the seam read confirms the `[INFERRED]` residual before any code change (REQ-002).
- [ ] CHK-FIX-003 [P0] A7 preserves the live daemon-liveness contract.
  - **Evidence**: `derived TTL = ownerLease.ttlMs × K (K=3)` = 180000 stays > the 2× reclaim window (120s); a long phase can never let both the lease heartbeat and the marker lapse so a competing launcher reaps a live mid-scan daemon (REQ-004).
- [ ] CHK-FIX-004 [P1] Both fixes are byte-behavior-preserving where claimed.
  - **Evidence**: A7 is byte-identical at K=3 with the live lease TTL; A4 intentionally changes the read scale (a correctness fix) with the before/after magnitude captured, not silently shipped (REQ-008).
- [ ] CHK-FIX-005 [P1] Evidence is pinned to seams and research citations.
  - **Evidence**: `tasks.md` records the file:line seams; `spec.md` cites the 008 deltas (A4 → iter-002, A7 → iter-007) and the 015 fix reference.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets introduced.
  - **Evidence**: A4 is a scale read; A7 is a constant derivation + comments; no secret-bearing files in scope.
- [ ] CHK-031 [P1] A7 does not weaken the daemon-liveness guard.
  - **Evidence**: The marker still gates `shouldAdoptDespiteProbe`; the derived TTL stays > the 2×-reclaim window so a live mid-scan daemon is never reaped (REQ-004/REQ-005).
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks/checklist synchronized.
  - **Evidence**: Both candidates show consistent PENDING status and identical seams across `spec.md` §3, `plan.md` §4, and `tasks.md` Phase 2.
- [ ] CHK-041 [P1] A7's two invariants are documented in-module.
  - **Evidence**: `maintenance-marker.ts` comments state `marker-TTL > 2×-lease-reclaim` and "any synchronous phase > TTL/2 must call `maintenance.refresh()`" (durable WHY, no spec/packet ids per comment-hygiene).
- [ ] CHK-042 [P2] Research provenance cited per candidate.
  - **Evidence**: `spec.md` RELATED DOCUMENTS + `tasks.md` Cross-References map A4 → iter-002 and A7 → iter-007.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Only scoped sub-phase docs are authored.
  - **Evidence**: `spec.md`, `plan.md`, `tasks.md`, `checklist.md` under this sub-phase folder; no edits to packet 030, the 028 parent, or sibling research children.
- [ ] CHK-051 [P1] No temp files left outside `scratch/`.
  - **Evidence**: Any before/after baselines live under the packet `scratch/` and are cleaned before completion.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 2/10 (pre-impl confirmed; code/test/fix-completeness pending implementation) |
| P1 Items | 11 | 1/11 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-06-19
**Verified By**: Claude (re-plan author) — pre-implementation items only
**Scope**: Two Wave-0 always-on correctness residuals (A4-015-residual RRF-scale + A7-maintenance-grace-ttl), both PENDING (no shipped commit in 030 §14); code/test items verify at implementation time.
<!-- /ANCHOR:summary -->
