---
title: "Checklist: Rollback, Audit Integrity & Non-Hub Policy"
description: "Implemented-state QA gate for rollback and audit safety. Commit a1cdb65d90 delivered activate-hub.cjs --rollback, flip-serving.cjs prior/fence fixes, shared append-only history, five-candidate non-hub policy/fixtures, and the P2 canary profile. The P1 session-snapshot/status-field slice remains explicitly deferred; no live hub or default was flipped."
trigger_phrases:
  - "rollback audit integrity checklist"
  - "non-hub policy QA gate"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/010-rollback-audit-and-non-hub-policy"
    last_updated_at: "2026-07-21T03:58:44Z"
    last_updated_by: "codex-gpt-5.6"
    recent_action: "Reconciled checklist evidence to commit a1cdb65d90"
    next_safe_action: "P4/011 operator-gated cutover remains pending"
    blockers: []
    key_files:
      - "checklist.md"
      - "implementation-summary.md"
      - "verification/rollback-audit-drill.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "pending"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "REQ-007 session status fields remain an explicit P1 deferral"
    answered_questions:
      - "Rollback/audit fixtures pass without exercising live hub state"
---
# Checklist: Rollback, Audit Integrity & Non-Hub Policy

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|--------------------|
| **[P0]** | HARD BLOCKER | Cannot claim this child complete until verified |
| **[P1]** | Required | Must verify or state the deferred/gated boundary |
| **[P2]** | Optional | May defer with an explicit reason |

<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Authoritative evidence and both driver implementations were read before the changes.
  - **Evidence**: `a1cdb65d90` makes the source-specific rollback, prior-refresh, fence, and ledger changes; fixture drill imports the real exports.
- [x] CHK-002 [P0] Live hub state remained unchanged by the implementation and verification.
  - **Evidence**: commit contains no live activation manifest/fence path; drill writes only OS temp fixtures.
- [x] CHK-003 [P0] No sibling rollout/default/create-skill packet was mutated by this child.
  - **Evidence**: commit path audit; policy references siblings but implementation is confined to drivers, this child, and named references/fixtures.

<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `activate-hub.cjs --rollback` reuses the existing hash-validation boundary.
  - **Evidence**: committed rollback calls the shared proof and the drill verifies byte-exact prior restoration.
- [x] CHK-011 [P0] `flip-serving.cjs` refreshes prior state without changing first-flip semantics.
  - **Evidence**: drill verifies first capture and rollback-then-reflip refresh to the immediately prior manifest.
- [x] CHK-012 [P1] `flip-history.jsonl` has one documented schema shared by both drivers.
  - **Evidence**: `references/flip-history-schema.md`; drill verifies `flip-history/V1`, driver, direction, and event fields from both paths.

<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] `activate-hub.cjs --rollback` is proven on isolated production-shaped fixtures.
  - **Evidence**: rollback/audit drill passes 23/23 and never writes a live hub directory.
- [x] CHK-021 [P0] Rollback-then-reflip preserves the immediately prior manifest.
  - **Evidence**: drill proves unconditional prior refresh from fixture A to fixture B.
- [x] CHK-022 [P0] Fence state distinguishes forward and recovery directions for both drivers.
  - **Evidence**: drill verifies `direction=rollback` and monotonic epoch advance on binding and serving rollback paths.
- [x] CHK-023 [P0] All five non-hub negative fixtures pass.
  - **Evidence**: `non-hub-eligibility-fixtures.cjs` reports 32 passed, 0 failed, including seven-hub positive controls.
- [x] CHK-024 [P0] All seven live hub states show zero unintended implementation change.
  - **Evidence**: no activation manifest/fence file appears in `a1cdb65d90`; verification uses temp/read-only paths.
- [ ] CHK-025 [P1] `skillRouterStatus` is cross-referenced against 002 rather than independently redefined.
  - **Evidence**: Explicitly deferred with REQ-007; the session-snapshot/status-probe files are absent from `a1cdb65d90`.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] Both driver rollback/prior/fence gaps are closed.
  - **Evidence**: real-function drill covers byte-exact rollback, fail-closed authority, prior refresh, and direction fields.
- [x] CHK-031 [P0] Both drivers append history without erasing prior entries.
  - **Evidence**: drill verifies two binding events survive and serving rollback writes the same schema.
- [x] CHK-032 [P0] Policy distinguishes four real rollout children from `mcp-code-mode`'s zero-directory state.
  - **Evidence**: 32/32 fixture result; no invented `005-mcp-code-mode` directory exists.
- [x] CHK-033 [P1] Canary profile, window, thresholds, rollback trigger, and operator-fill owner are named.
  - **Evidence**: `references/compiled-routing-canary-profile.md` landed in `a1cdb65d90`; no human owner is fabricated.
- [ ] CHK-034 [P1] `routingRecommendation` is replaced by `codeSearchRecommendation` and `skillRouterStatus`.
  - **Evidence**: Explicitly deferred with REQ-007; no session-snapshot change appears in the implementation commit.

<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] No live hub's serving authority or selected policy changed.
  - **Evidence**: commit has no live hub state diff; drill uses temp fixtures and fail-closes on authority changes.
- [x] CHK-041 [P0] The shared benchmark scorer trio is untouched.
  - **Evidence**: commit path audit plus identical start/end SHA-256 values.
- [x] CHK-042 [P1] No network, install, credential, or dynamic-code surface was introduced.
  - **Evidence**: local driver functions, filesystem ledger, documentation, and local fixture scripts only.

<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P0] Checklist and summary agree on delivered rollback/audit/policy scope and deferred REQ-007.
  - **Evidence**: both cite `a1cdb65d90`, 23/23 and 32/32 fixture results, unchanged live/default state, and the P1 boundary.
- [x] CHK-051 [P1] No completion claim includes the deferred session-snapshot/status-probe work or a live canary.
  - **Evidence**: CHK-025/034 remain open; summary limitations and follow-ups preserve both boundaries.
- [x] CHK-052 [P0] Strict Level-2 packet validation reports zero errors.
  - **Evidence**: final `validate.sh --strict` result recorded after metadata regeneration.

<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P0] Documentation, references, and verification remain under this child; driver changes use the two named implementation paths.
  - **Evidence**: `git show --stat a1cdb65d90` matches the delivered surfaces and adds no invented rollout directory.
- [x] CHK-061 [P1] Real delivered and deferred targets are named by their actual repository paths.
  - **Evidence**: summary distinguishes driver paths from the absent session-snapshot/resume/prime slice.

<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 18 | 18/18 |
| P1 Items | 7 | 5/7 (REQ-007 deferred) |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-07-21; `rollback-audit-drill.cjs` 23/23 PASS and `non-hub-eligibility-fixtures.cjs` 32/32 PASS, with final strict validation after metadata regeneration.
**Verification Scope**: This checklist covers `activate-hub.cjs --rollback`, the `flip-serving.cjs` serving-prior and fence-direction fixes, append-only audit history, the non-hub ineligibility policy, the P2 canary naming, and the `routingRecommendation` field fix.
**Completion Boundary**: Rollback, audit history, non-hub policy, fixtures, and canary profile are delivered. REQ-007 session status fields remain explicitly deferred. No live canary/default flip occurred; P4/011 remains operator-gated and blocked on siblings 013/014.

<!-- /ANCHOR:summary -->
