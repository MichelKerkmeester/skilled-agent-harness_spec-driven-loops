---
title: "Checklist: create-skill contract unification"
description: "Plan-quality checklist for the create-skill contract-unification remediation, plus the execution gates each work unit must clear."
trigger_phrases:
  - "028 checklist create-skill contract unification"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/028-create-skill-contract-unification"
    last_updated_at: "2026-07-13T17:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored the plan-quality checklist"
    next_safe_action: "Resolve the description-budget fork, then execute"
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level3-arch | v2.2 -->

# Checklist: create-skill contract unification

---

<!-- ANCHOR:protocol -->
## Verification Protocol
This is a PLAN packet. Plan-quality items are verified now (with evidence); execution items stay pending until each work unit runs.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [x] All nine findings verified at file:line against HEAD [EVIDENCE: `init_skill.py` no `--kind`; embedded REFERENCES at #3 vs canonical last; `package_skill.py:185-192` warnings-only; three description budgets; `SKILL.md:25` gate names package check only; `:156` substring name check]
- [x] Single root cause identified (triplicated contract) [EVIDENCE: spec §2; embedded template + assets + three validators disagree]
- [ ] Description-budget fork (D1) resolved by operator
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
- [x] Every finding maps to exactly one work unit; no orphan finding [EVIDENCE: plan §3 WU1–WU7 cover findings 1–9]
- [x] The keystone (WU1 contract) precedes all consumer WUs [EVIDENCE: plan dependency matrix — WU1 blocks WU2–WU7]
- [ ] No fix re-declares a rule the contract owns (verified at execution)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing
- [x] Each work unit carries a named verification gate [EVIDENCE: plan §5 testing table, one row per WU]
- [ ] Contract loads in both Python and Node; asset order matches (WU1)
- [ ] Warning-only fixture passes `--check`, fails `--check --strict` (WU2)
- [ ] Parent fixture requires `parent-skill-check.cjs`; standalone unchanged (WU3)
- [ ] `validate.sh --strict` Errors:0 on this folder
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [x] The four Medium findings (7 templates, 8 checker exactness, 9 ZIP) are scoped, not dropped [EVIDENCE: WU6, WU5, WU7]
- [ ] All nine findings closed with evidence (at execution)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
- [x] No work unit changes a capability, tool grant, or permission [EVIDENCE: spec NFR-S01 — validation/generation only]
- [ ] ZIP fixes exclude hidden-ancestor files and never archive their own output (WU7, verified at execution)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
- [x] Source audit provenance recorded [EVIDENCE: spec + plan cite `../create-skill-findings.md`]
- [x] The operator fork (description budget) is surfaced with a recommended default [EVIDENCE: decision-record ADR-003]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
- [x] Packet placed as a flat child of the 014 phase parent (sibling to 005-create-skill) [EVIDENCE: `014-sk-doc-parent/028-create-skill-contract-unification/`]
- [x] Plan authors no code; scope is docs-only in this packet [EVIDENCE: spec §3 Out of Scope]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| Findings mapped to work units | 9 | 9/9 |
| Work units with a named gate | 7 | 7/7 |
| Operator forks surfaced | 1 | 1/1 |
| Execution gates cleared | 12 | 0/12 (plan; pending) |

**Verification Date**: 2026-07-13 (plan authored)
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md [EVIDENCE: ADR-001..ADR-004 with context, decision, alternatives, consequences, five-checks, implementation]
- [x] CHK-101 [P1] All ADRs carry a status [EVIDENCE: ADR-001/002/004 Accepted; ADR-003 Proposed operator fork]
- [x] CHK-102 [P1] The keystone decision is justified against the root cause [EVIDENCE: ADR-001 — one contract dissolves the triplicated-source class behind findings 2/4/7]
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-110 [P1] The contract loader stays dependency-light (NFR-P01) [EVIDENCE: spec NFR-P01 — stdlib JSON/YAML; both Python and Node read it, no new runtime deps]
- [x] CHK-111 [P2] Strict validation adds no materially slower pass (NFR-P02) [EVIDENCE: WU2 is a flag over the existing `--check`, not a second traversal]
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback documented; each WU atomic; strict mode opt-in so it cannot block completion [EVIDENCE: plan §7 + L2 Enhanced Rollback]
- [x] CHK-121 [P1] Strict mode ships opt-in with a fleet audit before it is required [EVIDENCE: ADR-002 — opt-in, then required; grandfather allowlist for legacy]
- [ ] CHK-122 [P2] Generated `init_skill.py` output golden-diffed against the canonical template (at execution)
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] The plan authors no product code; scope is docs-only in this packet [EVIDENCE: spec §3 Out of Scope]
- [x] CHK-131 [P1] No advisor-scorer or skill-graph surface is touched [EVIDENCE: spec §3 — out of scope; no re-baseline gate applies]
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] `validate.sh --strict` Errors:0 for this folder [EVIDENCE: 2026-07-13 — RESULT Errors:0 across the packet]
- [x] CHK-141 [P2] description.json + graph-metadata.json generated for this packet [EVIDENCE: generate-description.js + backfill ran; source fingerprint re-derived]
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

- [x] CHK-150 [P0] Plan authored, phased, and finding-mapped; ready for operator fork resolution [EVIDENCE: this packet — spec/plan/tasks/checklist/decision-record/implementation-summary]
- [ ] CHK-151 [P1] Operator resolves ADR-003; execution begins with Phase 1 (contract + fixtures)
<!-- /ANCHOR:sign-off -->
