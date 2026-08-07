---
title: "Verification Checklist: Content-Addressed derived_id for Derived Causal Artifacts (C4-B)"
description: "QA checklist for C4-B derived-id provenance: default-off flag, schema v40, helper reuse, migration/backfill safety, write-path gating, focused tests and strict packet validation."
trigger_phrases:
  - "C4-B checklist"
  - "derived_id QA"
  - "content-addressed causal edge verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/002-speckit-memory/010-derived-id-provenance"
    last_updated_at: "2026-07-04T17:51:03.790Z"
    last_updated_by: "codex"
    recent_action: "Recorded strict packet validation result"
    next_safe_action: "Benchmark cost if needed"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "decision-record.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-c4b-replan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "All P0/P1 implementation and verification checks are satisfied."
      - "Derived-edge insert-cost benchmark remains pending by scope."
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

> Candidate status: **DONE** behind default-off `SPECKIT_DERIVED_ID_PROVENANCE`. Only benchmark-only insert-cost measurement remains pending.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] C4-B scope is documented and faithful to research.
  - **Evidence**: `spec.md` §2-§3, scope limited to generated causal edges and explicit exclusions.
- [x] CHK-002 [P0] The shipped content-id-module dependency is confirmed.
  - **Evidence**: `lib/content-id.ts` exports `hashCanonicalJson`, helper reuses it.
- [x] CHK-003 [P0] The legacy anchor-inclusive UNIQUE is confirmed.
  - **Evidence**: `vector-index-schema.ts` retains `UNIQUE(source_id, target_id, relation, source_anchor, target_anchor)`.
- [x] CHK-004 [P0] Canonical-field order, kind-tag, `source` definition and legacy `rule_version` sentinel are decided.
  - **Evidence**: `decision-record.md` ADR-002 / ADR-003 accepted.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Memory MCP typecheck passes after the change.
  - **Evidence**: `npm run typecheck` exit 0.
- [x] CHK-011 [P0] Memory MCP build passes after the change.
  - **Evidence**: `npm run build` exit 0.
- [x] CHK-012 [P1] No new hash primitive introduced, the derived-id helper reuses `hashCanonicalJson`.
  - **Evidence**: `deriveCausalEdgeDerivedId()` composes canonical input and calls `hashCanonicalJson`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] derived_id is content-addressed and reproducible.
  - **Evidence**: `tests/derived-id-provenance.vitest.ts` stable-id test.
- [x] CHK-021 [P0] Anchors are part of the derived_id input.
  - **Evidence**: anchor-distinct helper/backfill assertions in `tests/derived-id-provenance.vitest.ts`.
- [x] CHK-022 [P0] A rule_version change yields a distinct derived_id.
  - **Evidence**: rule-version change test in `tests/derived-id-provenance.vitest.ts`.
- [x] CHK-023 [P0] The migration is additive and backfills without legacy-UNIQUE rejection.
  - **Evidence**: v40 migration/backfill tests cover column/index creation and duplicate-safe index creation.
- [x] CHK-024 [P0] Restore/crash-replay preserves the id, manual-edge path is unchanged.
  - **Evidence**: replay, tombstone metadata and manual-null write-path tests.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] All P0 requirements (REQ-001..004) are satisfied with evidence.
  - **Evidence**: CHK-020/021/023 and CHK-012.
- [x] CHK-FIX-002 [P0] The single most-cited caveat (anchor-inclusion) is proven, not assumed.
  - **Evidence**: CHK-021 plus backfill tests.
- [x] CHK-FIX-003 [P1] Additive column does not break readers selecting `causal_edges.*`.
  - **Evidence**: compatibility fixture updated, focused schema compatibility tests passed.
- [x] CHK-FIX-004 [P1] SCHEMA_VERSION is bumped exactly once for this change.
  - **Evidence**: `SCHEMA_VERSION` moved from 39 to 40 with one migration entry.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] No secrets or client tokens enter the hash input.
  - **Evidence**: canonical input is causal-edge ids, relation, anchors, source, rule version and kind only.
- [x] CHK-041 [P1] The manual/curated causal path is unchanged.
  - **Evidence**: manual-edge write-path test keeps `derived_id = NULL`, gated generated writes only.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] `plan.md` covers helper, migration, write-path and verification.
  - **Evidence**: `plan.md` §3-§5.
- [x] CHK-051 [P1] `tasks.md` has shipped dependency and implementation tasks checked.
  - **Evidence**: `tasks.md` T001-T012 checked.
- [x] CHK-052 [P1] `decision-record.md` records the load-bearing decisions.
  - **Evidence**: ADR-001..005 accepted.
- [x] CHK-053 [P1] `implementation-summary.md` records shipped/verification state at completion.
  - **Evidence**: implementation summary includes files changed, v40, flag and command results.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] Only scoped packet docs and scoped Memory MCP files are modified.
  - **Evidence**: changed files stay inside this phase packet and `.opencode/skills/system-spec-kit/mcp_server`.
- [x] CHK-061 [P1] Unrelated dirty files remain untouched.
  - **Evidence**: no work in packet 030, `rrf-fusion.ts`, deep-research, commands or `.gitignore`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 18 | 18/18 |
| P1 Items | 18 | 18/18 |
| P2 Items | 4 | 3/4 |

**Verification Date**: 2026-06-19
**Verified By**: Codex
**Scope**: C4-B derived-id provenance implementation. Benchmark-only insert-cost measurement remains pending by scope.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3: Architecture Verification

- [x] CHK-100 [P0] Architecture decisions are documented.
  - **Evidence**: `decision-record.md` ADR-001..005 accepted.
- [x] CHK-101 [P1] Each ADR entry has a status.
  - **Evidence**: ADR-001..005 all Accepted.
- [x] CHK-102 [P1] Alternatives and rejection rationale are documented.
  - **Evidence**: ADR alternatives cover additive column/index, rowid rewrite, autoincrement and hash reuse.
- [x] CHK-103 [P0] Migration path is documented and tested.
  - **Evidence**: v40 migration and rollback helper covered in `tests/derived-id-provenance.vitest.ts`.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: Performance Verification

- [x] CHK-110 [P1] No benchmark is claimed, correctness-only framing is explicit.
  - **Evidence**: `spec.md` §2 and §12.
- [x] CHK-111 [P1] Manual-edge hot path has no measured regression claim and no derived-id computation.
  - **Evidence**: manual path remains `derived_id = NULL`, generated write computation is gated.
- [ ] CHK-112 [P2] Derived-edge insert cost is acceptable.
  - **Evidence**: PENDING benchmark-only residual. One hash per generated insert is implemented, but no measured insert-cost run was requested or claimed.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: Deployment Readiness

- [x] CHK-120 [P0] Rollback procedure documented.
  - **Evidence**: `plan.md` §7 + enhanced rollback.
- [x] CHK-121 [P1] Schema/migration deploy impact documented.
  - **Evidence**: `SCHEMA_VERSION` 40, additive column/index and backfill in the existing migration transaction.
- [x] CHK-122 [P2] Operator-visible change documented.
  - **Evidence**: no operator-visible behavior by default, write-time persistence is behind default-off `SPECKIT_DERIVED_ID_PROVENANCE`.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3: Compliance Verification

- [x] CHK-130 [P0] The migration does not violate the legacy anchor-inclusive UNIQUE.
  - **Evidence**: backfill-no-reject and duplicate-safe migration tests.
- [x] CHK-131 [P1] Change stays within the derived causal layer.
  - **Evidence**: scope excludes manual edges and non-causal derived artifacts, implementation gates generated writes only.
- [x] CHK-132 [P2] No new external dependency introduced.
  - **Evidence**: reuses `lib/content-id.ts`, no package change.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3: Documentation Verification

- [x] CHK-140 [P1] Level-3 docs exist.
  - **Evidence**: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`.
- [x] CHK-141 [P1] Packet docs are synchronized with the candidate status.
  - **Evidence**: docs mark C4-B DONE, except the explicit benchmark-only residual.
- [x] CHK-142 [P2] Knowledge transfer documented at completion.
  - **Evidence**: `implementation-summary.md` records files changed, decisions, verification and limitations.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Codex | Implementer | Implementation complete, strict validation passed | 2026-06-19 |
| User | Packet owner | Review pending | 2026-06-19 |
<!-- /ANCHOR:sign-off -->
