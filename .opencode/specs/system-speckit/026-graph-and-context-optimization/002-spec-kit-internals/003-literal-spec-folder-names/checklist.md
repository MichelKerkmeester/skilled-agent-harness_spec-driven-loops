---
title: "Verification Checklist: Improve AI-driven spec folder and phase naming so AI-chosen slugs describe concrete work being built or fixed rather than generic placeholders like remediation or phase-N [template:level_2/checklist.md]"
description: "Verification Date: 2026-05-19. Level 2 checklist with packet-B-specific items in pre-impl, code-quality, and testing categories."
trigger_phrases:
  - "literal naming verification"
  - "phase names checklist"
  - "verification"
  - "checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/002-spec-kit-internals/003-literal-spec-folder-names"
    last_updated_at: "2026-05-19T07:48:17Z"
    last_updated_by: "claude-code"
    recent_action: "Populated Level 2 documents"
    next_safe_action: "Implement intervention per tasks.md"
    blockers: []
    key_files:
      - ".opencode/commands/spec_kit/assets/spec_kit_plan_auto.yaml"
      - ".opencode/commands/spec_kit/assets/spec_kit_plan_confirm.yaml"
      - ".opencode/commands/spec_kit/assets/spec_kit_complete_auto.yaml"
      - ".opencode/commands/spec_kit/assets/spec_kit_complete_confirm.yaml"
      - ".opencode/skills/system-spec-kit/scripts/spec/create.sh"
      - ".opencode/commands/spec_kit/complete.md"
      - ".opencode/skills/system-spec-kit/SKILL.md"
      - ".opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/012-literal-spec-folder-names"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Improve AI-driven spec folder and phase naming so AI-chosen slugs describe concrete work being built or fixed rather than generic placeholders like remediation or phase-N

<!-- SPECKIT_LEVEL: 2 -->

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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available
- [ ] CHK-004 [P0] All 10 generation surfaces from Dispatch B §1 read and confirmed (4 YAML + 2 create.sh hunks + complete.md Q8 + feature_catalog + SKILL.md + implicit /spec_kit:plan remediation flow)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks
- [ ] CHK-011 [P0] No console errors or warnings
- [ ] CHK-012 [P1] Error handling implemented
- [ ] CHK-013 [P1] Code follows project patterns
- [ ] CHK-014 [P0] All 4 modified YAML files parse cleanly via `python3 -c "import yaml; yaml.safe_load(open(f))"` (SC-001 evidence)
- [ ] CHK-015 [P1] `grep -c '^## ' .opencode/skills/system-spec-kit/SKILL.md` returns the pre-existing top-level section count (rule 20 stays inside the `ALWAYS` subsection; cli-* family-contract floor preserved) (SC-003 evidence)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Manual testing complete
- [ ] CHK-022 [P1] Edge cases tested
- [ ] CHK-023 [P1] Error scenarios validated
- [ ] CHK-024 [P0] `create.sh` synthetic phase scaffold to `/tmp/speckit-naming-smoke-$$` emits both `[speckit] Warning:` lines on stderr when `--phase-names` is omitted (SC-002 evidence)
- [ ] CHK-025 [P1] Manual `/spec_kit:plan :auto` smoke-test against a synthetic ambiguous task produces a literal slug with a specific subject token, not a generic placeholder (SC-005 evidence, operator-driven, post-implementation)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Input validation implemented
- [ ] CHK-032 [P1] Auth/authz working correctly
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments adequate
- [ ] CHK-042 [P2] README updated (if applicable)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | [ ]/14 |
| P1 Items | 13 | [ ]/13 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: 2026-05-19
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->

