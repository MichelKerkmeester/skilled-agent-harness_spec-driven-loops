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
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/007-acceptance-coverage-gate"
    last_updated_at: "2026-06-06T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded 011 checklist from research 006 sub-packet-proposal P011 + integration-plan"
    next_safe_action: "Land pending 002 templates, then verify Phase 1 AC-format normalization"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "decision-record.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-027-011-acceptance-coverage-gate-scaffold"
      parent_session_id: null
    completion_pct: 0
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

- [ ] CHK-001 [P0] Requirements documented in `spec.md`.
- [ ] CHK-002 [P0] Technical approach documented in `plan.md` and decisions in `decision-record.md`.
- [ ] CHK-003 [P0] The shared manifest templates (`spec.md.tmpl`, `checklist.md.tmpl`), `validator-registry.json`, `validation_rules.md`, and the deep-review surfaces read before editing.
- [ ] CHK-004 [P0] Pending `001/002-self-check-templates` confirmed landed OR a coordinated single edit window opened for the shared templates (ADR-004).
- [ ] CHK-005 [P1] Packet `010` regression-fixture availability confirmed (hard dependency for any ERROR promotion).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `spec.md.tmpl` L1/L2 acceptance-criteria cells are `precondition + action -> outcome` assertions and no "[How to verify it's done]" placeholder remains.
- [ ] CHK-011 [P0] `checklist.md.tmpl` carries the AC traceability table (`AC-id | classification | evidence`) and the bare "All acceptance criteria met" checkbox is absent.
- [ ] CHK-012 [P0] The `AC_COVERAGE` rule counts exactly one AC location per level (story-ACs only at L3) and does not double-count the requirement table (ADR-002).
- [ ] CHK-013 [P1] The traceability table reuses the existing classification columns and the rule reuses `EVIDENCE_CITED`; no parallel infrastructure introduced.
- [ ] CHK-014 [P1] The coverage WARN is one aggregated, actionable message with a concrete next action, never a wall of per-AC errors.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Below-floor coverage WARNs (never ERRORs while `SPECKIT_AC_COVERAGE_ENFORCE=false`); coverage exactly at the floor passes (`>=`).
- [ ] CHK-021 [P0] An AC marked "Manual — automation infeasible" with a rationale counts as covered; without a rationale it does not.
- [ ] CHK-022 [P0] A freshly scaffolded L2 spec with no in-progress implementation-summary does not fire `AC_COVERAGE` and does not ERROR (lifecycle opt-in).
- [ ] CHK-023 [P0] A Level 1 folder is exempt; the rule does not fire regardless of coverage.
- [ ] CHK-024 [P1] A spec with zero acceptance criteria is a no-op; `SPECKIT_AC_COVERAGE_FLOOR` out of range clamps to [0,1] with a warn; a malformed `file:line` citation is treated as not-covered and named.
- [ ] CHK-025 [P1] The deep-review verdict reflects the coverage signal only for L2+ folders with `checklist.md` present AND `implementation-summary.md` in-progress+.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Finding class documented as `cross-template` for the shared manifest templates that pending 002 also owns.
- [ ] CHK-FIX-002 [P0] Same-class inventory confirms only `spec.md.tmpl` and `checklist.md.tmpl` are the shared-template surfaces, edited after 002 or inside a coordinated window.
- [ ] CHK-FIX-003 [P0] Consumer inventory confirms the existing classification columns, `EVIDENCE_CITED`, and the deep-review primitive are reused, not rebuilt.
- [ ] CHK-FIX-004 [P1] AC-format normalization (Phase 1) is verified to precede the `AC_COVERAGE` rule (Phase 3); the rule is never shipped against placeholder AC text.
- [ ] CHK-FIX-005 [P1] The canonical-per-level AC-location decision is recorded as ADR-002 and the lifecycle-opt-in decision as ADR-003 in `decision-record.md`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets in the rule script, template edits, or flag documentation.
- [ ] CHK-031 [P0] No new network, provider, or runtime-execution behavior introduced (validation rule + docs/template only).
- [ ] CHK-032 [P1] Governance stays authoritative: the `CLAUDE.md` §2 coverage note is warn-first and the `AGENTS.md` mirror matches; Four Laws and Gates text unchanged.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md`, and `decision-record.md` remain synchronized.
- [ ] CHK-041 [P1] `validation_rules.md` documents the `AC_COVERAGE` floor, escape hatch, and flags; `ENV_REFERENCE.md` lists `SPECKIT_AC_TRACEABILITY_TEMPLATE`, `SPECKIT_AC_COVERAGE`, `..._ENFORCE`, `..._FLOOR`.
- [ ] CHK-042 [P2] The rollout mirrors `SPECKIT_SAVE_QUALITY_GATE` (default-on warn-only, would-reject logging, persisted activation timestamp) and is reversible via `..._ENFORCE=false`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] No scratch files left outside this packet.
- [ ] CHK-051 [P1] No files outside the named surfaces in `spec.md` §3 changed during implementation.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] The four architectural decisions (AC-format prerequisite, canonical per-level location, lifecycle opt-in, shared-template sequencing) documented in `decision-record.md`.
- [ ] CHK-101 [P1] All ADRs (ADR-001 through ADR-004) carry a status (Proposed/Accepted).
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale (ship-rule-first, count-only, both-tables, level-alone, parallel-edit).
- [ ] CHK-103 [P2] The story-ACs-only counting choice (ADR-002) has a documented migration path to a merged-table model if ever needed.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] The `AC_COVERAGE` rule adds negligible overhead to `validate.sh --strict` (counting + evidence parse only; no live-LLM call).
- [ ] CHK-111 [P1] The rule reuses the existing registry loader and strict TS-validator seam rather than a parallel validation path (NFR-M01).
- [ ] CHK-112 [P2] Validation runtime measured on a representative L3 folder before and after the rule.
- [ ] CHK-113 [P2] No measurable regression in startup/advisor brief render time from the optional `AC coverage: n/m` indicator.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback documented and reversible: `SPECKIT_AC_COVERAGE_ENFORCE=false` reverts to warn-only; `SPECKIT_AC_COVERAGE=false` disables the rule.
- [ ] CHK-121 [P0] Feature flags configured warn-first: `SPECKIT_AC_TRACEABILITY_TEMPLATE`, `SPECKIT_AC_COVERAGE`, `..._ENFORCE=false`, `..._FLOOR=0.9` (copying `SPECKIT_SAVE_QUALITY_GATE`).
- [ ] CHK-122 [P1] Would-reject warn-volume logging is in place to measure before any ERROR promotion.
- [ ] CHK-123 [P1] Phase 5 ERROR promotion documented as deferred and gated on warn-volume evidence + green 010 fixtures.
- [ ] CHK-124 [P2] The activation-timestamp persistence mirrors the `save-quality-gate.ts` pattern.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] No secrets or credentials introduced in the rule, templates, or flag docs.
- [ ] CHK-131 [P1] No new dependency or license surface added (rule reuses the existing validator runtime).
- [ ] CHK-132 [P2] The rule does not read or emit user data beyond the spec-folder documents it validates.
- [ ] CHK-133 [P2] Governance text (Four Laws, Gates) in `CLAUDE.md`/`AGENTS.md` unchanged except the warn-first coverage note.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `decision-record.md` synchronized.
- [ ] CHK-141 [P1] `validation_rules.md` documents the `AC_COVERAGE` rule, floor, escape hatch, and flags; `ENV_REFERENCE.md` lists all four `SPECKIT_AC_*` flags.
- [ ] CHK-142 [P2] The `CLAUDE.md` §2 coverage note and its `AGENTS.md` mirror are byte-aligned (or a mirror-lag decision recorded).
- [ ] CHK-143 [P2] The AC-stub auto-generation behavior documented for authors.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| [Name] | Technical Lead | [ ] Approved | |
| [Name] | Product Owner | [ ] Approved | |
| [Name] | QA Lead | [ ] Approved | |
<!-- /ANCHOR:sign-off -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 18 | 0/18 |
| P1 Items | 22 | 0/22 |
| P2 Items | 12 | 0/12 |

**Verification Date**: 2026-06-06
<!-- /ANCHOR:summary -->
</content>
