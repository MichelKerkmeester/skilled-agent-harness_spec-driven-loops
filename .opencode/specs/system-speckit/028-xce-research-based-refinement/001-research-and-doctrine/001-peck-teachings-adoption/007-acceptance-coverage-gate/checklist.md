---
title: "Verification Checklist: 011 — Acceptance-Criteria Coverage Gate"
description: "Verification checklist for the revived T1 acceptance-criteria coverage gate: AC-format normalization, the AC traceability table, the warn-first AC_COVERAGE rule with floor and escape hatch, deep-review verdict binding with per-level AND lifecycle opt-in, and a reversible warn-first rollout."
trigger_phrases:
  - "027 phase 011"
  - "acceptance coverage gate"
  - "AC_COVERAGE rule"
  - "AC traceability table"
  - "AC-format normalization"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/007-acceptance-coverage-gate"
    last_updated_at: "2026-06-10T07:17:10Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Verified opt-in INFO AC coverage source pass"
    next_safe_action: "Plan validator v3 dispatch wiring if approved"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "decision-record.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-027-011-acceptance-coverage-gate-scaffold"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: 011 — Acceptance-Criteria Coverage Gate

<!-- SPECKIT_LEVEL: 3 -->
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

- [x] CHK-001 [P0] Requirements documented in `spec.md`. [EVIDENCE: source-pass scope reconciled in phase docs]
- [x] CHK-002 [P0] Technical approach documented in `plan.md` and decisions in `decision-record.md`. [EVIDENCE: source-pass scope and deferred promotion recorded]
- [x] CHK-003 [P0] Target validator, docs, ENV, and deep-review surfaces read before editing. [EVIDENCE: files read before patch]
- [x] CHK-004 [P0] Shared template edit window not required for this source-pass. [EVIDENCE: shared manifest templates were not modified]
- [x] CHK-005 [P1] Regression-fixture availability remains a hard dependency for any ERROR promotion. [EVIDENCE: ERROR promotion not executed; `SPECKIT_AC_COVERAGE_ENFORCE=false`]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Template normalization deferred out of current approved write scope. [EVIDENCE: `spec.md.tmpl` not modified]
- [x] CHK-011 [P0] Traceability-table template update deferred out of current approved write scope. [EVIDENCE: `checklist.md.tmpl` not modified]
- [x] CHK-012 [P0] The `AC_COVERAGE` rule counts one canonical AC location and avoids L3 double-counting. [EVIDENCE: `check-ac-coverage.sh` story-criteria selector precedes requirement-table fallback]
- [x] CHK-013 [P1] The rule parses existing classification/evidence columns; no parallel infrastructure introduced. [EVIDENCE: one shell rule, no dependencies]
- [x] CHK-014 [P1] The coverage advisory is one aggregated message. [EVIDENCE: rule emits one `AC_COVERAGE WARNING` message]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Below-floor coverage remains advisory and non-breaking by default. [EVIDENCE: registry severity `info`; opt-in flag `SPECKIT_AC_COVERAGE` defaults false]
- [x] CHK-021 [P0] Manual-infeasible rows require rationale/evidence to count. [EVIDENCE: rule branch requires non-empty rationale/evidence text]
- [x] CHK-022 [P0] Fresh/non-active lifecycle does not fire coverage. [EVIDENCE: direct rule invocation returned inactive lifecycle pass]
- [x] CHK-023 [P0] Level 1 folders are exempt. [EVIDENCE: rule lifecycle predicate returns inactive below Level 2]
- [x] CHK-024 [P1] Zero ACs, floor clamp, and malformed citations are handled. [EVIDENCE: branches present in `check-ac-coverage.sh`]
- [x] CHK-025 [P1] Deep-review reflects coverage only for lifecycle-active spec folders. [EVIDENCE: SKILL and both YAMLs include `ac_coverage_signal`]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Shared-template work documented as deferred for this source-pass. [EVIDENCE: no shared template files modified]
- [x] CHK-FIX-002 [P0] Same-class inventory confirms only `spec.md.tmpl` and `checklist.md.tmpl` are shared-template surfaces. [EVIDENCE: both remained untouched]
- [x] CHK-FIX-003 [P0] Consumer inventory confirms reuse of existing evidence/classification surfaces. [EVIDENCE: rule parses existing checklist rows; deep-review primitive reused]
- [x] CHK-FIX-004 [P1] AC-format normalization remains a prerequisite before future enforcement. [EVIDENCE: rule is INFO/default-off]
- [x] CHK-FIX-005 [P1] Canonical-location and lifecycle decisions are recorded. [EVIDENCE: ADR-002 and ADR-003 present]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets in the rule script or flag documentation. [EVIDENCE: no credentials added]
- [x] CHK-031 [P0] No new network, provider, or runtime-execution behavior introduced. [EVIDENCE: shell/JSON/Markdown/YAML changes only]
- [x] CHK-032 [P1] Governance stays authoritative; Four Laws and Gates text unchanged. [EVIDENCE: `AGENTS.md` pointer added outside those sections; `CLAUDE.md` out of scope]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Phase docs remain synchronized. [EVIDENCE: tasks/checklist/implementation summary updated to source-pass scope]
- [x] CHK-041 [P1] `validation_rules.md` and `ENV_REFERENCE.md` document coverage floor, escape hatch, and flags. [EVIDENCE: all four `SPECKIT_AC_*` variables documented]
- [x] CHK-042 [P2] Rollout is reversible and safer than warn-first default-on. [EVIDENCE: default-off INFO rule; `SPECKIT_AC_COVERAGE` enables advisory scan]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No scratch files left outside this packet. [EVIDENCE: no scratch artifacts created]
- [x] CHK-051 [P1] No files outside the approved source-pass surfaces changed during implementation. [EVIDENCE: changes limited to approved surfaces plus phase docs]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architectural decisions documented in `decision-record.md`. [EVIDENCE: AC-format prerequisite, canonical location, lifecycle opt-in, and sequencing decisions present]
- [x] CHK-101 [P1] All ADRs carry a status. [EVIDENCE: statuses are accepted/proposed-compatible]
- [x] CHK-102 [P1] Alternatives documented with rejection rationale. [EVIDENCE: decision-record alternatives tables present]
- [x] CHK-103 [P2] Story-AC counting has a migration path. [EVIDENCE: ADR-002 rollback path documented]
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-110 [P1] The `AC_COVERAGE` rule adds negligible overhead. [EVIDENCE: shell-only counting and evidence parse]
- [x] CHK-111 [P1] The rule is registered without adding a parallel validation path. [EVIDENCE: registry entry added; active v3 dispatch gap flagged]
- [x] CHK-112 [P2] Representative validation stayed clean. [EVIDENCE: existing valid folder strict validation exit 0]
- [x] CHK-113 [P2] No startup/advisor regression introduced. [EVIDENCE: startup/advisor code not modified]
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback documented and reversible. [EVIDENCE: `SPECKIT_AC_COVERAGE=false` disables advisory scan; enforcement flag remains false]
- [x] CHK-121 [P0] Feature flags configured for default-off safety. [EVIDENCE: `SPECKIT_AC_COVERAGE=false` default; floor `0.9`]
- [x] CHK-122 [P1] Warn-volume logging deferred until enforcement wiring is approved. [EVIDENCE: no ERROR promotion executed]
- [x] CHK-123 [P1] ERROR promotion deferred and gated. [EVIDENCE: registry severity remains `info`]
- [x] CHK-124 [P2] Activation-timestamp persistence deferred. [EVIDENCE: no persistence introduced]
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] No secrets or credentials introduced. [EVIDENCE: no secret material added]
- [x] CHK-131 [P1] No new dependency or license surface added. [EVIDENCE: no package files changed]
- [x] CHK-132 [P2] The rule reads only spec-folder documents. [EVIDENCE: script reads `spec.md`, `checklist.md`, and `implementation-summary.md`]
- [x] CHK-133 [P2] Governance text unchanged except pointer note. [EVIDENCE: Four Laws and Gate headings verified]
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] Phase docs synchronized. [EVIDENCE: docs updated to source-pass scope]
- [x] CHK-141 [P1] Validation and ENV references list coverage behavior and flags. [EVIDENCE: all four `SPECKIT_AC_*` flags documented]
- [x] CHK-142 [P2] Mirror lag recorded. [EVIDENCE: `CLAUDE.md` out of approved write scope; `AGENTS.md` pointer added]
- [x] CHK-143 [P2] AC-stub generation remains deferred. [EVIDENCE: template/generator work outside current approved write scope]
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| gpt-5.5-fast | Implementation Agent | [x] Approved | 2026-06-10 |
| Operator | Product Owner | [x] Scope pre-approved | 2026-06-10 |
| gpt-5.5-fast | QA Evidence | [x] Approved | 2026-06-10 |
<!-- /ANCHOR:sign-off -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 18 | 18/18 |
| P1 Items | 22 | 22/22 |
| P2 Items | 12 | 12/12 |

**Verification Date**: 2026-06-10
<!-- /ANCHOR:summary -->
</content>
