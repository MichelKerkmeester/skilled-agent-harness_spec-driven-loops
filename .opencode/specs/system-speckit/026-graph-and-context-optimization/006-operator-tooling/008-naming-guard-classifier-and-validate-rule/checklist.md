---
title: "Verification Checklist: Naming-Guard Classifier and validate.sh SEMANTIC_NAMING Rule"
description: "Verification Date: planned"
trigger_phrases:
  - "naming guard checklist"
  - "classifier verification"
  - "semantic naming rule checklist"
  - "spec folder naming verify"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/008-naming-guard-classifier-and-validate-rule"
    last_updated_at: "2026-06-06T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Drafted planned verification checklist (all unchecked)"
    next_safe_action: "Verify CHK items after implementation lands"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/shared/spec-folder-naming.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "open-008-naming-guard"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Naming-Guard Classifier and validate.sh SEMANTIC_NAMING Rule

<!-- SPECKIT_LEVEL: 2 -->
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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] TypeScript and shell pass lint/`bash -n`/format checks
- [ ] CHK-011 [P0] No console errors or warnings from validate.sh
- [ ] CHK-012 [P1] Classifier fails open on missing dist / malformed output / no Node
- [ ] CHK-013 [P1] Code reuses `isPhaseParent` dual-impl; no re-implemented detection
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] `028-026-*` shape classifies HARD-BLOCK with `EMBEDDED_SIBLING_PHASE_PARENT` and a `suggestedLocation`
- [ ] CHK-021 [P0] `003-...-103-...` and `009-p2-032-...` classify ok (no HARD-BLOCK)
- [ ] CHK-022 [P1] Nested strict-fail child classifies HARD-BLOCK with normalized suggestion
- [ ] CHK-023 [P1] `SEMANTIC_NAMING` emits via Node orchestrator AND shell fallback (no silent skip)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [ ] CHK-FIX-004 [P0] Path/parser/classifier rule includes adversarial table tests for embedded-number, joined-input, non-phase-parent, no-match, and multi-match cases.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Orchestrator-vs-shell parity variant executed (rule must fire on both validate paths).
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] No shell interpolation of folder names into commands (path strings only)
- [ ] CHK-032 [P1] Classifier reads directory listings only; no arbitrary code execution
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Rule documented in validator-registry.json description field
- [ ] CHK-042 [P2] README/skill docs updated (if applicable)
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
| P0 Items | 11 | [ ]/11 |
| P1 Items | 13 | [ ]/13 |
| P2 Items | 2 | [ ]/2 |

**Verification Date**: planned
<!-- /ANCHOR:summary -->
