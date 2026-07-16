---
title: "Implementation Summary: Acceptance-Criteria Coverage Gate"
description: "Implemented the source-pass acceptance-criteria coverage gate as a default-off INFO validation rule, with registry/docs/ENV integration, deep-review advisory surfacing, AGENTS pointer, and strict-validation evidence."
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
    recent_action: "Landed opt-in INFO AC coverage rule"
    next_safe_action: "Plan validator v3 dispatch wiring if approved"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "decision-record.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-027-011-acceptance-coverage-gate-scaffold"
      parent_session_id: null
    completion_pct: 100
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
| **Spec Folder** | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/007-acceptance-coverage-gate` |
| **Completed** | 2026-06-10 |
| **Level** | 3 |
| **Status** | Source-Pass Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Implemented the approved source-pass subset of the acceptance-criteria coverage gate. The shipped change adds `AC_COVERAGE` as a default-off INFO validation rule with a configurable floor, Manual-infeasible escape hatch, lifecycle predicate, registry metadata, validation documentation, environment-variable documentation, and deep-review advisory surfacing. Existing strict validation remains non-breaking because the rule is disabled unless `SPECKIT_AC_COVERAGE=true` and its registry severity is `info`.

### AC-format normalization (deferred)

The shared manifest-template work remains deferred because the current approved write scope excluded `spec.md.tmpl` and `checklist.md.tmpl`. No template files were modified.

### AC_COVERAGE rule

The new shell rule lives at `.opencode/skills/system-spec-kit/scripts/rules/check-ac-coverage.sh`. It is gated by `SPECKIT_AC_COVERAGE=true`, uses `SPECKIT_AC_COVERAGE_FLOOR` with a default of `0.9`, clamps out-of-range floor values, treats zero ACs as no-op, counts Manual-infeasible rows only when they include rationale/evidence text, and reports malformed `file:line` citations in advisory details. The rule is registered as `AC_COVERAGE` with INFO severity.

### deep-review verdict binding

Deep-review now documents `ac_coverage_signal` as an advisory synthesis signal for lifecycle-active Level 2+ spec folders. The exact iteration final-line verdict contract remains unchanged while the validation rule is INFO/default-off.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/scripts/rules/check-ac-coverage.sh` | Created | Default-off INFO `AC_COVERAGE` rule |
| `.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json` | Modified | Registered `AC_COVERAGE` with flags and INFO severity |
| `.opencode/skills/system-spec-kit/references/validation/validation_rules.md` | Modified | Documented rule ID, severity, floor, lifecycle predicate, escape hatch, and flags |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modified | Documented `SPECKIT_AC_TRACEABILITY_TEMPLATE`, `SPECKIT_AC_COVERAGE`, `SPECKIT_AC_COVERAGE_ENFORCE`, and `SPECKIT_AC_COVERAGE_FLOOR` |
| `.opencode/skills/deep-review/SKILL.md` | Modified | Added advisory acceptance-coverage signal contract |
| `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml` | Modified | Surfaced `ac_coverage_signal` during synthesis |
| `.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml` | Modified | Surfaced `ac_coverage_signal` during synthesis |
| `AGENTS.md` | Modified | Added pointer and completion evidence note outside Four Laws/Gates |
| Phase spec folder | Modified | Reconciled tasks, checklist, decisions, and summary evidence |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivered with surgical edits inside the approved write paths. The non-breaking constraint was handled by choosing both protections: `AC_COVERAGE` defaults off behind `SPECKIT_AC_COVERAGE=true`, and the registry severity is INFO rather than WARNING/ERROR. The existing valid folder `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/001-memory-write-safety` still strict-validates with exit 0 and no warnings after the change.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| AC-format normalization remains a hard prerequisite | The current source-pass does not edit shared templates; enforcement remains default-off INFO. |
| L3 counts story-ACs before falling back | A stable single denominator avoids double-counting richer Level 3 criteria. |
| Per-level AND lifecycle opt-in | Fresh scaffolds and Level 1 folders do not fire the advisory scan. |
| Default-off INFO rollout | Existing strict validation must not change until an explicit promotion is approved. |
| Active validator dispatch gap | The v3 node orchestrator exits before shell registry rules; wiring it is outside the approved write paths. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash -n .opencode/skills/system-spec-kit/scripts/rules/check-ac-coverage.sh` | Exit 0 |
| `validator-registry.json` parses | `validator-registry.json ok` |
| Deep-review YAML assets parse | `deep review yaml ok` |
| Existing valid folder strict validation | Exit 0; errors=0 warnings=0 |
| Direct rule invocation with `SPECKIT_AC_COVERAGE=true` | `AC_COVERAGE\|pass\|AC_COVERAGE WARNING: 0/4 ACs have evidence; floor 4/4. Add evidence or mark Manual-infeasible.` |
| AGENTS Four Laws + Gates intact | Verified by grep in final check |
| Phase strict validation | Verified in final check |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The active v3 validator orchestrator does not dispatch newly registered shell rules from `validator-registry.json`; changing that requires validator harness code outside the approved write paths.
2. Shared manifest-template normalization and traceability-table rendering remain deferred because those files were outside the approved write scope.
3. ERROR promotion remains deferred. The shipped rule is default-off INFO/advisory, and `SPECKIT_AC_COVERAGE_ENFORCE` is documented as reserved.
<!-- /ANCHOR:limitations -->
</content>
