---
title: "Verification Checklist: Canon self-enforcement (parent-hub hardening)"
description: "Plan-phase verification: plan completeness, anchor accuracy, gate definitions, and the fix-completeness contract for the twelve work units. Execution-time items stay pending until each work unit runs."
trigger_phrases:
  - "canon self-enforcement checklist"
  - "999 sk-doc phase 024 checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/999-sk-doc-parent/024-canon-self-enforcement"
    last_updated_at: "2026-07-08T03:42:41Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored the plan-phase verification checklist"
    next_safe_action: "Operator resolves D1-D3 then execute Phase 2 trio"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 20
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Canon self-enforcement (parent-hub hardening)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level3-arch | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

This is a PLANNING packet. Plan-artifact items are verified now; code-execution items stay pending until each work unit runs.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] All twelve council opportunities documented with fix approach in plan.md §3 [EVIDENCE: plan.md WU1-WU12, each opportunity → fix → files → gate]
- [x] CHK-002 [P0] Every file:line anchor re-verified against HEAD before authoring (verified) [EVIDENCE: routing-registry-drift.yml:11,18,51; skill-graph-db.ts:209; parent-skill-check.cjs:58,90,194,599; parent_skill_graph_metadata_template.json:5; sk-doc/mode-registry.json:145]
- [x] CHK-003 [P1] The advisor-scorer-lane gate identified and dependent units partitioned [EVIDENCE: WU8/WU10/WU11 tagged GATE-ADJ; scorer-eval-baseline.json:16 pins total:193]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Each DO-NOW unit keeps `parent-skill-check.cjs` 4/4 (0 warnings) on all four hubs
- [ ] CHK-011 [P1] WU1 resolves paths against a computed repo root, not `process.cwd()` or an env var
- [x] CHK-012 [P1] The plan reuses existing patterns, not new abstractions [EVIDENCE: plan.md WU3 clones the family self-heal at skill-graph-db.ts:372-422; WU2 mirrors the dependency-free CI vitest step]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Every new vitest green (vocab battery, edge_type CHECK, command-binding, checker fixtures, discovery parity)
- [ ] CHK-021 [P1] A synthetic PR touching a non-deep-loop hub registry triggers the CI gate
- [x] CHK-022 [P1] Each work unit has a defined verification gate in plan.md §5 [EVIDENCE: plan.md testing table maps every WU to a tool/scope]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] Root cause named per unit, not just symptoms [EVIDENCE: thesis — canon declared once, hand-copied to ~12 dialects, guards watch deep-loop only — drives WU1/WU2/WU3]
- [x] CHK-031 [P0] The next latent twin is pre-empted, not just the last fire [EVIDENCE: WU3 defuses the edge_type CHECK at skill-graph-db.ts:209, the twin of the fixed family CHECK]
- [x] CHK-032 [P1] Sibling/related sites enumerated so no fix is partial [EVIDENCE: WU2 lists all ~12 dialects; the FIX ADDENDUM maps every affected surface to its WUs]
- [ ] CHK-033 [P1] Gate-adjacent fixes co-land with their re-baseline (no partial scoring shift)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P1] No unit weakens the surface-packet read-only tool contract [EVIDENCE: WU4 command-binding gate only reads the command tree; WU5 panel is read-only]
- [x] CHK-041 [P1] WU1 CWD fix uses a computed repo root, not an attacker-influenced env var (verified) [EVIDENCE: plan.md WU1 + spec NFR-S02]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] spec / plan / tasks / decision-record synchronized on the WU set and the gate [EVIDENCE: all five docs reference WU1-WU12 and the advisor-scorer-lane gate]
- [x] CHK-051 [P1] The three operator forks documented with recommended defaults [EVIDENCE: decision-record ADR-003/004/005; plan.md §6 D1-D3]
- [x] CHK-052 [P2] Baseline (022 review, 023 remediation, P1 fix 177b63c8dc) cited as done, not re-planned [EVIDENCE: spec Executive Summary + Related Documents]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] All new files inside `024-canon-self-enforcement/` plus the parent graph-metadata edit [EVIDENCE: 0-leak scope; only packet + 999-sk-doc-parent/graph-metadata.json touched]
- [x] CHK-061 [P1] No hub/checker/advisor/scorer source edited in this planning packet (confirmed) [EVIDENCE: planning-only; execution deferred to per-WU commits]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 5/7 (2 pending execution) |
| P1 Items | 13 | 9/13 (4 pending execution) |
| P2 Items | 3 | 2/3 (1 pending execution) |

**Verification Date**: 2026-07-07 (plan phase)
**Verified By**: AI Assistant (Claude, planning architect)
**Note**: pending items are code-execution gates that run when each work unit executes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md [EVIDENCE: ADR-001..ADR-005 with context, decision, alternatives, consequences, five-checks, implementation]
- [x] CHK-101 [P1] All ADRs carry a status [EVIDENCE: ADR-001/002 Accepted; ADR-003/004/005 Proposed operator forks]
- [x] CHK-102 [P1] The trio-lead decision is justified against both incidents [EVIDENCE: ADR-001 — WU1+WU2+WU3 would have caught the transport and sk-hub drifts]
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] WU2 vocab battery runs in the dependency-light CI vitest step (NFR-P01)
- [ ] CHK-111 [P2] WU5 doctor panel opens the graph read-only, no writes (NFR-P02)
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback documented per unit; each WU atomic; WU3 migration idempotent [EVIDENCE: plan.md §7 + L2 Enhanced Rollback]
- [ ] CHK-121 [P1] WU1 CI change guarded by a per-hub `PARENT_HUB_CHECK_STRICT=0` opt-out for scaffolding hubs
- [x] CHK-122 [P2] The gate-adjacent tranche cannot corrupt the 193-row parity by rollback [EVIDENCE: WU8/WU10/WU11 never land outside the single re-baseline event]
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] Plan honors the 0-leak constraint and the do-not-commit directive [EVIDENCE: only packet files + parent graph-metadata staged; no commit]
- [x] CHK-131 [P1] The operator-owned advisor scorer track is not touched (confirmed) [EVIDENCE: WU8/WU10/WU11 are PREP-only until the operator opens the lane]
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] `validate.sh --strict` exits 0 for this folder
- [x] CHK-141 [P2] description.json + graph-metadata.json generated for this packet [EVIDENCE: generate-description.js + backfill-graph-metadata.js ran; both files present]
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

- [x] CHK-150 [P0] Plan authored, phased, and gate-partitioned; ready for operator fork resolution [EVIDENCE: this packet — spec/plan/tasks/checklist/decision-record/implementation-summary]
- [ ] CHK-151 [P1] Operator resolves D1-D3; execution begins with the Phase 2 trio
<!-- /ANCHOR:sign-off -->
