---
title: "Opt-in acceptance-criteria coverage gate (peck T1, source pass)"
description: "Added AC_COVERAGE as a default-off INFO validation rule with configurable floor, Manual-infeasible escape hatch, lifecycle predicate, registry metadata, validation documentation, ENV documentation, and deep-review advisory surfacing. Existing strict validation is non-breaking because the rule is disabled unless SPECKIT_AC_COVERAGE=true."
trigger_phrases:
  - "acceptance coverage gate"
  - "AC_COVERAGE rule"
  - "peck T1 teaching"
  - "SPECKIT_AC_COVERAGE"
  - "check-ac-coverage"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-10

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/007-acceptance-coverage-gate` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption`

### Summary

Implemented the approved source-pass subset of the acceptance-criteria coverage gate (peck T1, deferred since the 001 analysis leaf). The `AC_COVERAGE` rule counts `covered / total >= floor(total * SPECKIT_AC_COVERAGE_FLOOR)` (default 0.9), treats zero ACs as a no-op, accepts `Manual-infeasible` escape hatches only when they include rationale text, clamps out-of-range floor values, and reports malformed `file:line` citations in advisory details. The rule is gated by `SPECKIT_AC_COVERAGE=true` and registered at INFO severity so no existing spec folder changes validation outcome. Deep-review surfaces `ac_coverage_signal` as an advisory synthesis signal for lifecycle-active Level 2+ folders.

### Added

- `scripts/rules/check-ac-coverage.sh`: default-off INFO `AC_COVERAGE` rule with floor, escape hatch, lifecycle predicate, and actionable warning string.
- `AC_COVERAGE` entry in `scripts/lib/validator-registry.json` at INFO severity with flags.
- Rule documentation in `references/validation/validation_rules.md` covering rule ID, severity, floor, lifecycle predicate, escape hatch, and flags.
- `SPECKIT_AC_TRACEABILITY_TEMPLATE`, `SPECKIT_AC_COVERAGE`, `SPECKIT_AC_COVERAGE_ENFORCE`, and `SPECKIT_AC_COVERAGE_FLOOR` entries in `mcp_server/ENV_REFERENCE.md`.
- `ac_coverage_signal` advisory synthesis contract in `skills/deep-review/SKILL.md`.
- `ac_coverage_signal` surfacing in `deep_start-review-loop_auto.yaml` and `deep_start-review-loop_confirm.yaml`.
- Pointer and completion evidence note in `AGENTS.md`.

### Changed

- None to existing validation behavior. All additions are gated and additive.

### Fixed

- None.

### Verification

| Check | Result |
|-------|--------|
| `bash -n scripts/rules/check-ac-coverage.sh` | Exit 0 |
| `validator-registry.json` parses | PASS (`validator-registry.json ok`) |
| Deep-review YAML assets parse | PASS |
| Existing valid folder strict validation | Exit 0; errors=0 warnings=0 |
| Direct rule invocation with `SPECKIT_AC_COVERAGE=true` | `AC_COVERAGE\|pass\|AC_COVERAGE WARNING: 0/4 ACs have evidence; floor 4/4. Add evidence or mark Manual-infeasible.` |
| AGENTS Four Laws and Gates intact | PASS (verified by grep) |
| Phase strict validation | PASS |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/scripts/rules/check-ac-coverage.sh` | Created | Default-off INFO AC_COVERAGE rule |
| `.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json` | Modified | Registered `AC_COVERAGE` with flags and INFO severity |
| `.opencode/skills/system-spec-kit/references/validation/validation_rules.md` | Modified | Documented AC_COVERAGE rule, floor, escape hatch, and flags |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modified | Documented four AC-coverage environment variables |
| `.opencode/skills/deep-review/SKILL.md` | Modified | Added advisory acceptance-coverage signal contract |
| `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml` | Modified | Surfaced `ac_coverage_signal` during synthesis |
| `.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml` | Modified | Surfaced `ac_coverage_signal` during synthesis |
| `AGENTS.md` | Modified | Added AC_COVERAGE pointer and completion evidence note |

### Follow-Ups

- The active v3 validator orchestrator does not dispatch newly registered shell rules from `validator-registry.json`. Changing that requires validator harness code outside the approved write paths.
- Shared manifest-template normalization (`spec.md.tmpl`, `checklist.md.tmpl`) remains deferred because those files were outside the approved write scope.
- ERROR promotion remains deferred. The shipped rule is default-off INFO, and `SPECKIT_AC_COVERAGE_ENFORCE` is documented as reserved.
