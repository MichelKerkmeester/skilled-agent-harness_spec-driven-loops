---
title: "Implementation Summary: 011 — Acceptance-Criteria Coverage Gate"
description: "Placeholder implementation summary for the revived T1 acceptance-criteria coverage gate (AC-format normalization, AC traceability table, warn-first AC_COVERAGE rule, deep-review verdict binding). Populate after code and tests land."
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
    recent_action: "Scaffolded 011 planning docs (not implemented)"
    next_safe_action: "Land pending 002 templates, then implement Phase 1 AC-format normalization"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "decision-record.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-027-011-acceptance-coverage-gate-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/007-acceptance-coverage-gate` |
| **Completed** | Pending |
| **Level** | 3 |
| **Status** | Spec-Scaffolded |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Planned, not yet implemented. This packet revives the long-deferred peck T1 acceptance-criteria coverage gate as a staged, reuse-heavy build (research 006 §2 T1, §5 cross-model). When implemented, a spec folder will carry a per-AC traceability table with evidence, a warn-first `AC_COVERAGE` validation rule with a configurable floor and an automation-infeasible escape hatch, and a deep-review verdict that reflects coverage for in-flight Level 2+ folders. No behavior changes are claimed here; this is a scaffold placeholder.

### AC-format normalization (Phase 1, planned)

Will rewrite the L1/L2 placeholder acceptance criteria in `spec.md.tmpl` into mechanical `precondition + action -> outcome` assertions and tighten the L3 requirement tables. This is the HARD prerequisite: the rule can count but cannot classify on placeholder text.

### AC traceability table + AC_COVERAGE rule (Phases 2-3, planned)

Will replace the single "All acceptance criteria met" checkbox in `checklist.md.tmpl` with an `AC-id | classification | evidence` table, auto-generate stub rows from the requirement table, and add the `AC_COVERAGE` rule (floor 0.9 default, WARNING) registered in `validator-registry.json` and documented in `validation_rules.md`.

### deep-review verdict binding (Phase 4, planned)

Will bind the coverage signal to the deep-review verdict with a per-level AND lifecycle opt-in so fresh scaffolds are never blocked.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl` | Pending (Modify) | AC-format normalization (shared with pending 002) |
| `.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl` | Pending (Modify) | AC traceability table (shared with pending 002) |
| `.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json` | Pending (Modify) | Register the `AC_COVERAGE` rule |
| `.opencode/skills/system-spec-kit/references/validation/validation_rules.md` | Pending (Modify) | Document floor, escape hatch, flags |
| `.opencode/skills/system-spec-kit/scripts/lib/rules/ac-coverage.*` | Pending (Create) | The `AC_COVERAGE` rule script |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Pending (Modify) | Document the four `SPECKIT_AC_*` flags |
| `.opencode/skills/deep-review/SKILL.md` | Pending (Modify) | Verdict binding + lifecycle opt-in |
| `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml`, `deep_start-review-loop_confirm.yaml` | Pending (Modify) | Surface coverage in the verdict gate |
| `CLAUDE.md` + `AGENTS.md` mirror | Pending (Modify) | Warn-first coverage note in §2 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Pending. Delivery evidence should include the normalized `spec.md.tmpl`, the `checklist.md.tmpl` traceability table, the registered `AC_COVERAGE` rule with green packet-010 fixtures, the deep-review verdict binding, and strict spec validation. The rollout copies `SPECKIT_SAVE_QUALITY_GATE` (default-on warn-only, would-reject logging, persisted activation timestamp); no folder ERRORs while `SPECKIT_AC_COVERAGE_ENFORCE=false`. ERROR promotion (Phase 5) stays deferred until the warn-only window produces evidence.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| AC-format normalization is a hard prerequisite | The rule can count but cannot classify Tested/Partially/Not-covered on placeholder AC text (research 006 §5; ADR-001). |
| L3 counts story-ACs only | A stable single denominator avoids double-counting the requirement table (ADR-002). |
| Per-level AND lifecycle opt-in | A fresh L2 scaffold with zero tests must pass strict validation without an ERROR (ADR-003). |
| Sequence after pending 001/002 | Phases 1-2 edit the same manifest templates as pending 002; land 002 first or coordinate the window (ADR-004). |
| Warn-first, reversible rollout | Copy the proven `SPECKIT_SAVE_QUALITY_GATE` precedent so promotion is evidence-gated and reversible. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `spec.md.tmpl` carries assertion-shaped ACs; no "[How to verify it's done]" remains | Pending |
| `checklist.md.tmpl` traceability table renders; bare checkbox removed | Pending |
| `AC_COVERAGE` warns below floor, never errors while `..._ENFORCE=false`; escape hatch counts as covered | Pending |
| Fresh L2 scaffold passes strict validation with no `AC_COVERAGE` ERROR (lifecycle opt-in) | Pending |
| Strict spec validation: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/007-acceptance-coverage-gate --strict` | Pending |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not implemented yet.** This is a scaffold placeholder; no behavior changes are claimed here.
2. **Gated on two dependencies.** Phases 1-2 wait on the pending `001/002-self-check-templates` shared-template window (ADR-004); any ERROR promotion waits on green packet-010 regression fixtures.
3. **Phase 5 ERROR promotion deferred.** `AC_COVERAGE` ships as WARNING only; promotion to ERROR is held until warn-volume evidence exists.
<!-- /ANCHOR:limitations -->
</content>
