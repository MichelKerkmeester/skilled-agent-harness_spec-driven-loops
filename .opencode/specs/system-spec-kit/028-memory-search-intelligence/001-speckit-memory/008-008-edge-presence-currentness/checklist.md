---
title: "Verification Checklist: Edge-Presence Currentness & Temporal Recall (028/001 impl phase)"
description: "QA checklist for the five PENDING temporal candidates (C3-A, C3-C, memory_history, CG-temporal-query-extraction, M-unforget-channel-disjointness): pre-implementation gates, per-candidate code/test/security items, and Level-3 architecture/deploy/compliance verification. All implementation items pending; Wave-0 (030) confirmed none shipped."
trigger_phrases:
  - "verification checklist edge presence currentness"
  - "temporal recall QA"
  - "memory history tool checklist"
  - "temporal query extraction checklist"
  - "unforget disjointness checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/008-008-edge-presence-currentness"
    last_updated_at: "2026-06-19T06:00:00+02:00"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored QA checklist for the five PENDING temporal candidates"
    next_safe_action: "Work the pre-implementation gates once C3-B substrate is confirmed"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-008-replan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Edge-Presence Currentness & Temporal Recall (028/001 impl phase)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level3-arch | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | Hard blocker | Cannot close the phase until complete or explicitly deferred with evidence |
| **[P1]** | Required | Must be verified or documented as residual follow-up |
| **[P2]** | Optional | Can defer with rationale |

> **Status:** This is a re-plan. All five candidates are PENDING (none shipped in Wave-0 — `../../../030-memory-search-intelligence-impl/spec.md` §14). Implementation/test items are unchecked until each candidate is built behind its gate.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] C3-B four-timestamp window status confirmed in the sibling phase (substrate prerequisite).
  - **Evidence**: sibling-phase spec/status; gates C3-C AsKnownAt + the 4-channel matrix.
- [ ] CHK-002 [P0] Canonical supersede writer designated (lineage); causal `invalid_at` confirmed derived.
  - **Evidence**: `vector-index-schema.ts:184-185`; prevents a third source-of-truth fork.
- [x] CHK-003 [P1] Candidate seams identified before implementation.
  - **Evidence**: `spec.md` §3 and §14 list each seam (`contradiction-detection.ts`, `temporal-edges.ts`, `lineage-state.ts:1025-1043`).
- [x] CHK-004 [P1] Wave-0 done-evidence cross-checked; all five candidates confirmed PENDING.
  - **Evidence**: `030-...-impl/spec.md` §14 + `git log --oneline 1ecc531431..ab5459fb6d` = zero temporal/history/unforget commits.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Memory MCP typecheck passes after each candidate.
  - **Evidence**: `npm run typecheck` in `.opencode/skills/system-spec-kit/mcp_server` exits 0.
- [ ] CHK-011 [P0] Memory MCP build passes after each candidate.
  - **Evidence**: `npm run build` exits 0.
- [ ] CHK-012 [P1] Current-mode recall is byte-identical to baseline.
  - **Evidence**: non-temporal baseline byte-check recorded in `implementation-summary.md`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] C3-A read-side `getValidEdges` currentness filter implemented and tested.
  - **Evidence**: read-path test; superseded fact closed (History-readable), not destroyed.
- [ ] CHK-021 [P0] C3-A lineage↔causal-edge store reconciliation tested (no third source of truth).
  - **Evidence**: reconciliation test favors lineage; divergence logged.
- [ ] CHK-022 [P0] C3-C TemporalMode implemented; Current byte-identical; AsOf/History correct; AsKnownAt gated on C3-B.
  - **Evidence**: mode-specific tests; gated-capability typed error for AsKnownAt pre-C3-B.
- [ ] CHK-023 [P0] memory_history tool parity-tested against `resolveLineageAsOf`/`inspectLineageChain`.
  - **Evidence**: parity test; default recall unchanged.
- [ ] CHK-024 [P1] CG-temporal-query-extraction parses `QueryInterval`, filters by range, and falls through when no bounds.
  - **Evidence**: range-filter test + non-temporal fallthrough byte-check; benchmark for precision before go.
- [ ] CHK-025 [P1] M-unforget-channel-disjointness invariant property-tested (or deferred with reason).
  - **Evidence**: 4-channel `(expired_at,status,edge)` disjointness property test + refuse-on-violation; defer if unforget/erasure half absent.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each candidate has a final disposition in `spec.md` §14 (DONE with commit, or PENDING with gate).
- [ ] CHK-FIX-002 [P0] Deferred items name their gate (schema / benchmark / shared-infra) and path.
- [ ] CHK-FIX-003 [P0] Public tool consumers covered (new `memory_history` tool surface, TemporalMode param).
- [ ] CHK-FIX-004 [P0] No physical-deletion or retention-TTL coupling introduced (category-opposite of edge-presence currentness).
- [ ] CHK-FIX-005 [P1] Affected-surface axes documented.
  - **Evidence**: `plan.md` affected-surface table names the temporal seams.
- [ ] CHK-FIX-006 [P1] Non-temporal-query baseline classified before closeout.
- [ ] CHK-FIX-007 [P1] Evidence pinned to commits and commands.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-040 [P0] No secrets introduced; changes are retrieval/temporal/tool logic only.
- [ ] CHK-041 [P1] Currentness change does not expose closed (superseded) facts under Current mode by default.
  - **Evidence**: Current reads only live edges; History is an explicit mode.
- [ ] CHK-042 [P1] memory_history does not leak content beyond what default recall already exposes.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] `plan.md` covers all five candidates + the C3-B substrate dependency.
  - **Evidence**: `plan.md` phase, dependency, and rollback tables.
- [x] CHK-051 [P1] `tasks.md` has a task per candidate with its gate.
  - **Evidence**: T004-T009 map to the five candidates; T001-T003 are setup.
- [x] CHK-052 [P1] `decision-record.md` records the load-bearing decisions.
  - **Evidence**: ADR entries for read-side-not-flip, lineage-canonical, projection-default, query-extraction-additivity, unforget-defer.
- [ ] CHK-053 [P1] `implementation-summary.md` records shipped/deferred/verification once implementation begins.
- [x] CHK-054 [P2] `description.json` / `graph-metadata.json` regeneration deferred to generate-context.js.
  - **Evidence**: this re-plan authored the spec docs only.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] Only this phase's scoped docs are authored.
  - **Evidence**: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md` under `008-008-edge-presence-currentness/`.
- [x] CHK-061 [P1] The Wave-0 record (030) is not modified.
  - **Evidence**: 030 is read-only done-evidence; no edits made.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 0/13 (re-plan; implementation pending) |
| P1 Items | 16 | 8/16 (doc/seam gates done) |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-19
**Verified By**: claude-opus-4-8 (re-plan author)
**Scope**: Planning re-plan for the five PENDING edge-presence-currentness candidates.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3: Architecture Verification

- [x] CHK-100 [P0] Architecture decisions are documented.
  - **Evidence**: `decision-record.md` ADR entries cover the read-side-build framing and store reconciliation.
- [x] CHK-101 [P1] All ADR entries have a status.
  - **Evidence**: each ADR section is Accepted or Proposed.
- [x] CHK-102 [P1] Alternatives and rejection rationale documented.
  - **Evidence**: ADR alternatives compare flag-flip vs read-side build, projection-alongside vs projection-replace.
- [ ] CHK-103 [P2] Migration path documented where needed.
  - **Evidence**: C3-B four-timestamp migration is owned by the sibling phase; consumed here.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: Performance Verification

- [ ] CHK-110 [P1] No benchmark-gated candidate ships without a caveat.
  - **Evidence**: temporal-query-extraction is needs-benchmark; ships only after a precision check or stays deferred.
- [ ] CHK-111 [P1] Byte-identical default behavior preserved where required.
  - **Evidence**: Current-mode recall and non-temporal queries byte-checked.
- [x] CHK-112 [P2] Full benefit benchmark acknowledged as unmeasured.
  - **Evidence**: no candidate has a measured before/after number (structural inference only).
- [ ] CHK-113 [P1] Touched test suites run within local command limits.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: Deployment Readiness

- [x] CHK-120 [P0] Rollback procedure documented.
  - **Evidence**: `plan.md` enhanced-rollback lists per-candidate revert; C3-A reconciliation kept separable.
- [ ] CHK-121 [P1] Feature/mode decisions documented.
  - **Evidence**: TemporalMode default = Current; AsKnownAt gated on C3-B.
- [ ] CHK-122 [P1] Monitoring impact documented.
  - **Evidence**: currentness read-path change; no new background state.
- [x] CHK-123 [P2] Runbook update not required for this re-plan.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3: Compliance Verification

- [x] CHK-130 [P1] No schema migration authored in this phase.
  - **Evidence**: C3-B migration is owned by the sibling phase; this phase is read-side + tool surface.
- [ ] CHK-131 [P1] Currentness model excludes retention TTL (no physical deletion).
  - **Evidence**: bi-temporal scoping = causal + lineage; retention excluded (category error).
- [x] CHK-132 [P2] License review not required.
- [x] CHK-133 [P2] Data handling remains internal.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3: Documentation Verification

- [x] CHK-140 [P1] Level-3 docs exist.
  - **Evidence**: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md` present.
- [ ] CHK-141 [P1] Packet docs synchronized with `spec.md` §14 as candidates land.
- [x] CHK-142 [P2] User-facing docs not required.
- [x] CHK-143 [P2] Knowledge transfer documented.
  - **Evidence**: research cross-refs name the roadmap, synthesis, 005-revisit, and 007-memory-systems sources.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| claude-opus-4-8 | Re-plan author | Planning complete; implementation pending | 2026-06-19 |
| User | Packet owner | Re-plan only; no implementation requested | 2026-06-19 |
<!-- /ANCHOR:sign-off -->
