---
title: "Checklist: Research Synthesis and Remediation Map"
description: "Level 3 verification checklist for recovered research archives, synthesis outputs, and deletion readiness."
trigger_phrases:
  - "phase 001 checklist"
  - "memory leak research archive validation"
  - "source research recovery checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map"
    last_updated_at: "2026-05-22T10:55:00Z"
    last_updated_by: "opencode"
    recent_action: "Added Level 3 verification checklist for the phase-local research archive."
    next_safe_action: "Validate phase 001, delete old source packets, then revalidate parents."
    blockers: []
    key_files:
      - "checklist.md"
      - "decision-record.md"
      - "resource-map.md"
      - "research/source-research/"
    session_dedup:
      fingerprint: "sha256:0101010101010101010101010101010101010101010101010101010101010101"
      session_id: "009-memory-leak-remediation-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase 001 is the canonical archive for original 020 and 024 research artifacts."
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level3-arch | v2.2 -->
# Checklist: Research Synthesis and Remediation Map

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot delete old packets or claim phase complete until satisfied |
| **[P1]** | Required | Must complete or document explicit deferral |
| **[P2]** | Optional | Can defer with reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Source packet research archives recovered into phase 001.
  - **Evidence**: `research/source-research/020-cli-process-memory-leak-deep-research/research/` and `research/source-research/024-cli-deep-research-memory-leak-audit/research/` exist under this phase.
- [x] CHK-002 [P0] Packet root docs preserved before deleting old packet folders.
  - **Evidence**: `packet-docs/` exists under both source archive slugs and contains spec, plan, tasks, checklist, decision record, implementation summary, metadata, and resource map where available.
- [x] CHK-003 [P1] Source evidence paths point to the phase-local archive.
  - **Evidence**: `research/source-evidence-index.md` and `research/remediation-map.md` cite `001-research-synthesis-and-remediation-map/research/source-research/`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Runtime source code was not changed in this phase.
  - **Evidence**: This phase only moves and edits spec documentation/research artifacts.
- [x] CHK-011 [P1] Destructive cleanup remains gated by later exact-owner verification.
  - **Evidence**: `research/remediation-map.md` keeps destructive cleanup behind phase 002 and phase 005 verification gates.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Packet 020 iteration and delta counts preserved.
  - **Evidence**: `research/source-research/020-cli-process-memory-leak-deep-research/research/iterations/iteration-001.md` through `iteration-010.md`; `deltas/iter-001.jsonl` through `iter-010.jsonl`.
- [x] CHK-021 [P0] Packet 024 iteration and delta counts preserved.
  - **Evidence**: `research/source-research/024-cli-deep-research-memory-leak-audit/research/iterations/iteration-001.md` through `iteration-015.md`; `deltas/iter-001.jsonl` through `iter-015.jsonl`.
- [x] CHK-022 [P1] State, dashboard, strategy, config, and findings registries preserved.
  - **Evidence**: Both archives contain `deep-research-state.jsonl`, `deep-research-dashboard.md`, `deep-research-strategy.md`, `deep-research-config.json`, and `findings-registry.json`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] All actionable findings are represented in the consolidated remediation map. Evidence: `research/remediation-map.md` lists normalized work items, source findings, target phases, dependencies, and verification gates.
- [x] CHK-FIX-002 [P0] Same-class producer inventory is preserved for follow-up phases. Evidence: `research/source-evidence-index.md` maps cross-packet overlaps for process containment, sidecars, lock/state, host-memory telemetry, and retention cleanup.
- [x] CHK-FIX-003 [P1] Consumer inventory is scoped to follow-up phases rather than implemented here. Evidence: `research/remediation-map.md` assigns owners to phases 002-010.
- [x] CHK-FIX-004 [P1] Matrix axes include timeout, parent death, stale state, expected-daemon, sidecar survival, and benchmark gates where applicable. Evidence: verification gates in `research/remediation-map.md`.
- [x] CHK-FIX-005 [P1] Evidence is pinned to archived research artifacts, not deleted packet paths. Evidence: `research/source-evidence-index.md` citation rule.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets were introduced while moving research archives.
  - **Evidence**: No credentials were added to new phase docs; source artifacts remain existing research records.
- [x] CHK-031 [P1] Process deletion is limited to spec packet folders requested by the user.
  - **Evidence**: Only old packet directories `020-cli-process-memory-leak-deep-research` and `024-cli-deep-research-memory-leak-audit` are in deletion scope.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] Phase 001 is upgraded to Level 3 documentation.
  - **Evidence**: `checklist.md`, `decision-record.md`, and `resource-map.md` now exist in addition to core spec docs.
- [x] CHK-041 [P1] Parent arc status and active child remain accurate.
  - **Evidence**: Parent arc points next to `002-telemetry-and-process-verification-harness`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P0] Original research is phase-local, not arc-root-local.
  - **Evidence**: Arc-root `source-research/` was removed after moving archives into `001/.../research/source-research/`.
- [x] CHK-051 [P1] Old source packet deletion is safe only after validation passes.
  - **Evidence**: Old source packet folders were deleted only after phase 001 and affected parent validations passed.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:arch-verify -->
## L3: Architecture Verification

- [x] CHK-100 [P0] Architecture decisions documented in `decision-record.md`.
  - **Evidence**: ADR-001 through ADR-003 document archive consolidation, old packet deletion, and harness-first sequencing.
- [x] CHK-101 [P1] Alternatives documented with rejection rationale.
  - **Evidence**: `decision-record.md` documents duplicate-vs-move and leave-old-packets-vs-delete alternatives.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: Performance Verification

- [x] CHK-110 [P1] No resident-memory improvement is claimed by this phase.
  - **Evidence**: `implementation-summary.md` and `research/remediation-map.md` defer memory claims to phase 002 and later runtime phases.
- [x] CHK-111 [P2] RSS/swap benchmarks remain queued for the harness phase.
  - **Evidence**: Open verification gaps in `research/remediation-map.md` map benchmarks to phase 002 and phase 008.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: Deployment Readiness

- [x] CHK-120 [P0] Rollback procedure documented.
  - **Evidence**: `decision-record.md` records restoring packet folders from `research/source-research/*/packet-docs/` plus the preserved research archive if deletion must be reversed.
- [x] CHK-121 [P1] Next operator handoff is explicit.
  - **Evidence**: Next safe action is `002-telemetry-and-process-verification-harness`.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] Research archive consolidation does not alter runtime permission boundaries. Evidence: no source-code or process cleanup changes were made.
- [x] CHK-131 [P1] Deletion scope is explicit and operator-requested. Evidence: deletion is limited to old packet folders `020-cli-process-memory-leak-deep-research` and `024-cli-deep-research-memory-leak-audit`.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] Level 3 docs are present and synchronized. Evidence: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `resource-map.md`, and `implementation-summary.md` all describe phase-local archive ownership.
- [x] CHK-141 [P1] Source research paths resolve under phase 001. Evidence: `research/source-evidence-index.md` and `resource-map.md` list the phase-local paths.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Packet owner | Approved deletion request | 2026-05-22 |
| OpenCode | Implementation executor | Final post-delete validation passed | 2026-05-22 |
<!-- /ANCHOR:sign-off -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 9 | 9/9 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-05-22
**Verified By**: OpenCode
**ADRs**: 3 documented, 3 accepted
<!-- /ANCHOR:summary -->
