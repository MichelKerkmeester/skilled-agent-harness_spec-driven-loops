---
title: "Verification Checklist: Canon self-enforcement (parent-hub hardening)"
description: "Plan-phase verification: plan completeness, anchor accuracy, gate definitions, and the fix-completeness contract for the twelve work units. Execution-time items stay pending until each work unit runs."
trigger_phrases:
  - "canon self-enforcement checklist"
  - "014 sk-doc phase 024 checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/015-sk-doc-parent/024-canon-self-enforcement"
    last_updated_at: "2026-07-08T15:52:50Z"
    last_updated_by: "claude-opus"
    recent_action: "Verified DO-NOW gates at close-out (4/4 hubs, validate 0/0); tranche deferred"
    next_safe_action: "Gate-adjacent tranche awaits operator-opened scorer lane + 193-row re-baseline"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 100
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

The DO-NOW batch has SHIPPED and was re-verified at close-out (2026-07-08). Plan-artifact items and DO-NOW code-execution items are checked below; the gate-adjacent tranche items (WU8/10/11/12c) stay unchecked and deferred per ADR-002 (they are the tranche's own gate, satisfied when it runs).
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

- [x] CHK-010 [P0] Each DO-NOW unit keeps `parent-skill-check.cjs` 4/4 (0 warnings) on all four hubs [EVIDENCE: 2026-07-08 close-out re-verify — sk-code / sk-design / sk-doc / system-deep-loop each exit 0, "all hard invariants passed, 0 warnings"]
- [x] CHK-011 [P1] WU1 resolves paths against a computed repo root, not `process.cwd()` or an env var [EVIDENCE: parent-skill-check.cjs findRepoRoot(.git walk-up); shipped f8924b0495]
- [x] CHK-012 [P1] The plan reuses existing patterns, not new abstractions [EVIDENCE: plan.md WU3 clones the family self-heal at skill-graph-db.ts:372-422; WU2 mirrors the dependency-free CI vitest step]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Every new vitest green (vocab battery, edge_type CHECK, command-binding, checker fixtures, discovery parity) [EVIDENCE: T020 — 6 files, 28 pass + 1 expected-fail (WU8 guard); drift-guard 7/7]
- [x] CHK-021 [P1] A synthetic PR touching a non-deep-loop hub registry triggers the CI gate [EVIDENCE: T021 — CI glob-enrolls `skills/*/mode-registry.json` + per-hub checker loop; checker-from-/tmp passes 4a/4b (gate mechanism proven; not a literal PR run)]
- [x] CHK-022 [P1] Each work unit has a defined verification gate in plan.md §5 [EVIDENCE: plan.md testing table maps every WU to a tool/scope]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] Root cause named per unit, not just symptoms [EVIDENCE: thesis — canon declared once, hand-copied to ~12 dialects, guards watch deep-loop only — drives WU1/WU2/WU3]
- [x] CHK-031 [P0] The next latent twin is pre-empted, not just the last fire [EVIDENCE: WU3 defuses the edge_type CHECK at skill-graph-db.ts:209, the twin of the fixed family CHECK]
- [x] CHK-032 [P1] Sibling/related sites enumerated so no fix is partial [EVIDENCE: WU2 lists all ~12 dialects; the FIX ADDENDUM maps every affected surface to its WUs]
- [ ] CHK-033 [P1] Gate-adjacent fixes co-land with their re-baseline (no partial scoring shift) — **DEFERRED per ADR-002**: this is the tranche's own gate; satisfied when WU8/10/11/12c execute, not before
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

- [x] CHK-060 [P1] All new files inside `024-canon-self-enforcement/` plus the parent graph-metadata edit [EVIDENCE: 0-leak scope; only packet + 015-sk-doc-parent/graph-metadata.json touched]
- [x] CHK-061 [P1] No hub/checker/advisor/scorer source edited in this planning packet (confirmed) [EVIDENCE: planning-only; execution deferred to per-WU commits]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 7/7 |
| P1 Items | 13 | 12/13 (CHK-033 deferred per ADR-002) |
| P2 Items | 3 | 3/3 |

**Verification Date**: 2026-07-08 (close-out; DO-NOW gates re-verified on the post-rename tree)
**Verified By**: AI Assistant (Claude Opus)
**Note**: the sole unchecked item (CHK-033) is the gate-adjacent tranche's own co-land gate, deferred per ADR-002; it is satisfied when WU8/10/11/12c execute.
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

- [x] CHK-110 [P1] WU2 vocab battery runs in the dependency-light CI vitest step (NFR-P01) [EVIDENCE: vocabulary-agreement.vitest.ts shipped (WU2); dependency-light — repoRoot via .git, no daemon]
- [x] CHK-111 [P2] WU5 doctor panel opens the graph read-only, no writes (NFR-P02) [EVIDENCE: skill-graph-freshness.cjs uses node:sqlite readOnly, exits 0; wired as a read-only /doctor route (a0efc35c3c)]
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback documented per unit; each WU atomic; WU3 migration idempotent [EVIDENCE: plan.md §7 + L2 Enhanced Rollback]
- [x] CHK-121 [P1] WU1 CI change guarded by a per-hub `PARENT_HUB_CHECK_STRICT=0` opt-out for scaffolding hubs [EVIDENCE: checker prints "Mode 5-9: canon (FAIL)" strict-default; PARENT_HUB_CHECK_STRICT=0 downgrades 5-9 to advisory WARN]
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

- [x] CHK-140 [P1] `validate.sh --strict` exits 0 for this folder [EVIDENCE: 2026-07-08 close-out — RESULT: PASSED, Errors 0 / Warnings 0]
- [x] CHK-141 [P2] description.json + graph-metadata.json generated for this packet [EVIDENCE: generate-description.js + backfill-graph-metadata.js ran; both files present]
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

- [x] CHK-150 [P0] Plan authored, phased, and gate-partitioned; ready for operator fork resolution [EVIDENCE: this packet — spec/plan/tasks/checklist/decision-record/implementation-summary]
- [x] CHK-151 [P1] Operator resolves D1-D3; execution begins with the Phase 2 trio [EVIDENCE: D1-D3 resolved (ADR-003/004/005); DO-NOW batch executed + shipped]
<!-- /ANCHOR:sign-off -->
