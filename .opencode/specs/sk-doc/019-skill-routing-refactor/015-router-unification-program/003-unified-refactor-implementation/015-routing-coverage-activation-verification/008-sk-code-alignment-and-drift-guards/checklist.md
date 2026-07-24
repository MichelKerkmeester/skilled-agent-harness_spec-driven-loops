---
title: "Checklist: sk-code Alignment & Drift Guards"
description: "Implemented-state QA gate for sk-code alignment and drift guards. Commit a1cdb65d90 delivered the RESOURCE_MAP truth fix, shared qualifiedIdToLeaf bridge, bidirectional tests, unified guard script, and default-off --check-router fixtures. The optional P1 surfaceBundle request-context remains explicitly deferred."
trigger_phrases:
  - "sk-code alignment checklist"
  - "drift guards QA gate"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/008-sk-code-alignment-and-drift-guards"
    last_updated_at: "2026-07-21T03:58:44Z"
    last_updated_by: "codex-gpt-5.6"
    recent_action: "Reconciled checklist evidence to commit a1cdb65d90"
    next_safe_action: "P4/011 operator-gated cutover remains pending"
    blockers: []
    key_files:
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "pending"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "REQ-006 surfaceBundle remains an explicit P1 deferral"
    answered_questions:
      - "P0 guards and P1 check-router landed in a1cdb65d90"
---
# Checklist: sk-code Alignment & Drift Guards

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim this child complete until verified |
| **[P1]** | Required | Must verify or state the deferred/gated boundary |
| **[P2]** | Optional | May defer with an explicit reason |

<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Authoritative evidence was reflected in the implemented alignment surfaces.
  - **Evidence**: `a1cdb65d90` implements the named truth, bijection, orchestration, and markdown-guard gaps.
- [x] CHK-002 [P0] Writes stayed within named documentation, test, script, and shared-contract targets.
  - **Evidence**: commit path audit; no frozen scorer path changed.
- [x] CHK-003 [P1] The `002` promoted runtime dependency was available before optional REQ-006 work was assessed.
  - **Evidence**: `4153cbebd8` precedes `a1cdb65d90`; REQ-006 was then explicitly deferred rather than built against a stale copy.

<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `run-all-drift-guards.sh` adds no external dependency and calls the three existing guard runtimes.
  - **Evidence**: delivered shell script invokes the two Python guards and existing Vitest suite.
- [x] CHK-011 [P0] `--check-router` is scoped to fenced RESOURCE_MAP/DEFAULT_RESOURCE tables and remains default-off.
  - **Evidence**: implementation and tests in `a1cdb65d90` cover aligned, dead-path, and omitted-flag behavior.
- [x] CHK-012 [P1] `qualifiedIdToLeaf` follows the shared leaf-contract export conventions.
  - **Evidence**: exported from `leaf-resource-contract.cjs`; direct tests cover success, malformed IDs, unknown modes, and packet mismatch.

<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] The bijection Vitest suite is bidirectional.
  - **Evidence**: it checks manifest round trips and every code-opencode RESOURCE_MAP entry against manifest leaves.
- [x] CHK-021 [P0] `run-all-drift-guards.sh` returns non-zero when any invoked guard fails.
  - **Evidence**: script accumulates guard failures and exits non-zero unless all three pass.
- [x] CHK-022 [P1] `--check-router` has positive, drift, and default-off fixtures.
  - **Evidence**: `test_verify_alignment_drift.py` contains all three cases in `a1cdb65d90`.
- [ ] CHK-023 [P1] The LUNA-high `surfaceBundle` playbook case records `sk-code:code-opencode`.
  - **Evidence**: Explicitly deferred with REQ-006; no `surfaceBundle` runtime or playbook change appears in `a1cdb65d90`.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] `code-opencode/SKILL.md` names `sk-code-router-sync.vitest.ts` as RESOURCE_MAP-equality authority.
  - **Evidence**: doc-truth change landed in `a1cdb65d90`.
- [x] CHK-031 [P0] `alignment-verification-automation.md` backlinks the router-sync authority.
  - **Evidence**: reference update landed in the same commit.
- [x] CHK-032 [P0] The single alignment-authority interface is documented for downstream consumers.
  - **Evidence**: reference defines truth owner, bijection module, and unified orchestrator without a second parser/eligibility map.

<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] No live routing decision logic changed.
  - **Evidence**: `SKILL.md` changes are guard wording/gate-list updates; runtime route decisions are untouched.
- [x] CHK-041 [P0] The shared benchmark scorer trio is untouched.
  - **Evidence**: commit path audit and start/end SHA-256 equality.
- [x] CHK-042 [P1] No network, install, credential, or dynamic-code surface was introduced.
  - **Evidence**: delivered shell/Python/Vitest paths operate on local files and existing test runners.

<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P0] Checklist and summary agree on delivered P0/REQ-005 scope and deferred REQ-006.
  - **Evidence**: both cite `a1cdb65d90` and leave the `surfaceBundle` row open.
- [x] CHK-051 [P1] No completion claim includes the deferred `surfaceBundle` runtime/playbook work.
  - **Evidence**: summary limitations/follow-ups and CHK-023 state the deferral explicitly.
- [x] CHK-052 [P0] Strict Level-2 packet validation reports zero errors.
  - **Evidence**: final `validate.sh --strict` result recorded after metadata regeneration.

<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P0] Documentation stayed in this child and implementation landed only in the named shared sk-code/sk-doc/test targets.
  - **Evidence**: `git show --stat a1cdb65d90` matches the delivered surfaces.
- [x] CHK-061 [P1] Implementation targets are named by their actual repository paths.
  - **Evidence**: summary and committed diff identify `SKILL.md`, verifier/tests, leaf contract/tests, router-sync suite, and guard script.

<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 14/14 |
| P1 Items | 7 | 6/7 (REQ-006 deferred) |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-07-21; reconciled to commit `a1cdb65d90`, with final strict validation after metadata regeneration.
**Verification Scope**: This checklist covers the RESOURCE_MAP doc-truth fix, the `qualifiedIdToLeaf` bidirectional bijection test, the `run-all-drift-guards.sh` orchestrator, and (P1) the markdown `--check-router` gate and the `surfaceBundle` request-context extension.
**Completion Boundary**: P0 alignment guards and P1 `--check-router` are delivered. P1 REQ-006 (`surfaceBundle` request context + LUNA case) remains explicitly deferred. No hub was cut over and the repository default remains off.

<!-- /ANCHOR:summary -->
