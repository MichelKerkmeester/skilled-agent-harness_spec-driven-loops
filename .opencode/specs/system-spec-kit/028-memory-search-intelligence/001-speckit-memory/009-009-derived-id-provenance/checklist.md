---
title: "Verification Checklist: Content-Addressed derived_id for Derived Causal Artifacts (C4-B)"
description: "QA checklist for C4-B. Planning-stage items (scope, research provenance, dependency confirmation) are verified now; implementation, migration, security, and deployment items are pending behind the schema-migration gate and tracked here as the close-out contract."
trigger_phrases:
  - "C4-B checklist"
  - "derived_id QA"
  - "content-addressed causal edge verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/009-009-derived-id-provenance"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored C4-B verification checklist (planning items verified, impl items pending)"
    next_safe_action: "Resolve the recipe decisions, then begin implementation tasks T004-T007"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-c4b-replan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Content-Addressed derived_id for Derived Causal Artifacts (C4-B)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level3-arch | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | Hard blocker | Cannot close C4-B until complete |
| **[P1]** | Required | Must be verified or documented as residual follow-up |
| **[P2]** | Optional | Can defer with rationale |

> Candidate status: **PENDING** (gate = schema-migration). Planning-stage items are checked; implementation/migration/security/deploy items are unchecked until the build lands.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] C4-B scope is documented and faithful to research.
  - **Evidence**: `spec.md` §2-§3 cite `01-go-candidates.md:44`, `04-sibling-and-cross-cutting.md:24`, and roadmap §027-REVISIT edits #1/#4b.
- [x] CHK-002 [P0] The shipped content-id-module dependency is confirmed.
  - **Evidence**: `lib/content-id.ts:14,19` exports `hashContentBody` + `hashCanonicalJson`; 030 commit `18c8582e33`.
- [x] CHK-003 [P0] The legacy anchor-inclusive UNIQUE is confirmed (drives the anchor-inclusion requirement).
  - **Evidence**: `vector-index-schema.ts:1121` — `UNIQUE(source_id, target_id, relation, source_anchor, target_anchor)`.
- [ ] CHK-004 [P0] Canonical-field order, kind-tag, `source` definition, and legacy `rule_version` sentinel are decided.
  - **Evidence**: pending — `decision-record.md` ADR-002 / ADR-003.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Memory MCP typecheck passes after the change.
  - **Evidence**: pending — `npm run typecheck` in `.opencode/skills/system-spec-kit/mcp_server`.
- [ ] CHK-011 [P0] Memory MCP build passes after the change.
  - **Evidence**: pending — `npm run build`.
- [ ] CHK-012 [P1] No new hash primitive introduced; the derived-id helper reuses `hashCanonicalJson`.
  - **Evidence**: pending — diff of `lib/content-id.ts` shows compose-and-reuse, not a new sha256.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] derived_id is content-addressed and cross-process reproducible.
  - **Evidence**: pending — identity unit test (T008) asserts byte equality for identical canonical input.
- [ ] CHK-021 [P0] Anchors are part of the derived_id input.
  - **Evidence**: pending — anchor-change test (T009) yields a distinct id; backfill-no-reject test (T010).
- [ ] CHK-022 [P0] A rule_version change yields a distinct derived_id.
  - **Evidence**: pending — rule_version distinctness test (T009).
- [ ] CHK-023 [P0] The migration is additive and backfills with zero legacy-UNIQUE rejections.
  - **Evidence**: pending — real-DB-copy migration test (T010).
- [ ] CHK-024 [P0] Restore/crash-replay preserves the id; manual-edge path is byte-identical.
  - **Evidence**: pending — restore-preserves-id + manual-path assertion (T010).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] All P0 requirements (REQ-001..004) are satisfied with evidence.
  - **Evidence**: pending — maps to CHK-020/021/023 + the no-new-hash check.
- [ ] CHK-FIX-002 [P0] The single most-cited caveat (anchor-inclusion) is proven, not assumed.
  - **Evidence**: pending — CHK-021 + backfill-no-reject.
- [ ] CHK-FIX-003 [P1] Additive column does not break readers selecting `causal_edges.*`.
  - **Evidence**: pending — consumer inventory + tests.
- [ ] CHK-FIX-004 [P1] SCHEMA_VERSION is bumped exactly once for this change.
  - **Evidence**: pending — schema diff.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-040 [P0] No secrets or client tokens enter the hash input.
  - **Evidence**: pending — canonical input is derived-artifact content only (NFR-S01).
- [ ] CHK-041 [P1] The manual/curated causal path is unchanged (no accidental scope creep).
  - **Evidence**: pending — byte-identical manual-path assertion.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] `plan.md` covers helper, migration, write-path, and verification.
  - **Evidence**: `plan.md` §3-§4 + affected-surfaces table.
- [x] CHK-051 [P1] `tasks.md` has the shipped dependency pre-checked and impl tasks pending.
  - **Evidence**: `tasks.md` T001 `[x]` with commit; T002-T012 `[ ]`.
- [x] CHK-052 [P1] `decision-record.md` records the load-bearing decisions.
  - **Evidence**: ADR-001 (scope/gate), ADR-002 (recipe), ADR-003 (sentinel), ADR-004 (rowid-alias not AUTOINCREMENT), ADR-005 (reuse content-id module).
- [ ] CHK-053 [P1] `implementation-summary.md` records shipped/verification state at completion.
  - **Evidence**: pending — authored after implementation (Level-3 requires it once tasks complete).
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] Only scoped packet docs are authored.
  - **Evidence**: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md` in this sub-phase folder.
- [x] CHK-061 [P1] Unrelated dirty files remain untouched.
  - **Evidence**: planning-only; no production code or sibling spec docs edited.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 3/14 (planning) |
| P1 Items | 9 | 5/9 (planning) |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-06-19 (planning stage)
**Verified By**: Claude (planning author)
**Scope**: C4-B re-plan; implementation/migration items pending behind the schema-migration gate.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3: Architecture Verification

- [x] CHK-100 [P0] Architecture decisions are documented.
  - **Evidence**: `decision-record.md` ADR-001..005 (Accepted/Proposed status as noted).
- [x] CHK-101 [P1] Each ADR entry has a status.
  - **Evidence**: ADR-001/004/005 Accepted; ADR-002/003 Proposed (pending the recipe decisions).
- [x] CHK-102 [P1] Alternatives and rejection rationale are documented.
  - **Evidence**: ADR alternatives compare additive-column vs new-table, rowid-alias vs AUTOINCREMENT, reuse vs new hash.
- [ ] CHK-103 [P0] Migration path is documented and tested.
  - **Evidence**: pending — additive migration documented (ADR-001/004); migration test is T010.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: Performance Verification

- [x] CHK-110 [P1] No benchmark is claimed; correctness-only framing is explicit.
  - **Evidence**: `spec.md` §2 records the no-benchmark caveat (roadmap §6).
- [ ] CHK-111 [P1] Manual-edge hot path has no measurable regression.
  - **Evidence**: pending — manual path does not compute `derived_id`; assert byte-identical behavior.
- [ ] CHK-112 [P2] Derived-edge insert cost is acceptable.
  - **Evidence**: pending — one hash per derived insert; no broad scan.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: Deployment Readiness

- [x] CHK-120 [P0] Rollback procedure documented.
  - **Evidence**: `plan.md` §7 + L2 enhanced-rollback (forward-only drop of column + index).
- [ ] CHK-121 [P1] Schema/migration deploy impact documented.
  - **Evidence**: pending — `SCHEMA_VERSION` bump; additive, applies in the existing migration transaction.
- [ ] CHK-122 [P2] Operator-visible change documented.
  - **Evidence**: pending — `derived_id` is internal identity; no operator-facing surface change expected.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3: Compliance Verification

- [ ] CHK-130 [P0] The migration does not violate the legacy anchor-inclusive UNIQUE.
  - **Evidence**: pending — backfill-no-reject test (T010); anchor-inclusion is P0.
- [x] CHK-131 [P1] Change stays within the derived causal layer (no scope creep into manual edges or other derived stores).
  - **Evidence**: `spec.md` §3 Out-of-Scope excludes manual edges and non-causal derived artifacts.
- [x] CHK-132 [P2] No new external dependency introduced.
  - **Evidence**: reuses `lib/content-id.ts`; no new package.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3: Documentation Verification

- [x] CHK-140 [P1] Level-3 planning docs exist.
  - **Evidence**: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md` present (`implementation-summary.md` follows at completion).
- [x] CHK-141 [P1] Packet docs are synchronized with the candidate status.
  - **Evidence**: all docs mark C4-B PENDING / schema-migration gate; the content-id dependency pre-checked with commit `18c8582e33`.
- [ ] CHK-142 [P2] Knowledge transfer documented at completion.
  - **Evidence**: pending — `implementation-summary.md` follow-up section.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Claude | Planning author | Planning complete; implementation pending | 2026-06-19 |
| User | Packet owner | Pending review | 2026-06-19 |
<!-- /ANCHOR:sign-off -->
