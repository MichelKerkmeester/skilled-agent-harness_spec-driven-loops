---
title: "Verification Checklist: Command + agent template conformance"
description: "Verification Date: 2026-07-07"
trigger_phrases:
  - "command agent conformance checklist"
  - "125 sk-doc phase 020 checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/125-sk-doc-parent/020-command-agent-template-conformance"
    last_updated_at: "2026-07-07T14:31:04.000Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored phase-020 checklist"
    next_safe_action: "Validate --strict; commit; push"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/shared/scripts/validate_document.py"
      - ".opencode/commands/create/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Command + agent template conformance

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

- [x] CHK-001 [P0] Requirements documented in spec.md [EVIDENCE: spec.md]
- [x] CHK-002 [P0] Technical approach defined in plan.md [EVIDENCE: plan.md]
- [x] CHK-003 [P1] Root cause confirmed: numbering is a warning + only numbered sections count; agent rule unsatisfiable + detection bug [EVIDENCE: validate_document.py:320,341,153]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Agent detection fixed to match `/agents/` (plural) [EVIDENCE: validate_document.py:153 now matches /agents/]
- [x] CHK-011 [P0] Agent rule reconciled: requiredSections=["core_workflow"], four ideals→recommended [EVIDENCE: template_rules.json agent block]
- [x] CHK-012 [P1] Routers preserve body content (asset paths, steps, $ARGUMENTS); only PURPOSE added + headings numbered [EVIDENCE: 10/10 intact; diff ~12 lines each, 82 ins/42 del]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All 10 sk-doc /create routers VALID [EVIDENCE: validate_document.py 10/10 VALID]
- [x] CHK-021 [P0] All 24 agents VALID as type `agent` [EVIDENCE: 24/24 VALID; markdown.md x2 included]
- [x] CHK-022 [P1] Validator + rules stay valid (no regression) [EVIDENCE: py_compile OK; template_rules.json JSON valid]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] 10 routers have numbered `## 1. PURPOSE` + `## N. INSTRUCTIONS` [EVIDENCE: rg 10/10 PURPOSE + INSTRUCTIONS]
- [x] CHK-FIX-002 [P0] Purpose lines are accurate + command-specific [EVIDENCE: each reads "Route /create:X ... for <correct output>"]
- [x] CHK-FIX-003 [P1] Detection fix does not mis-type template/reference assets [EVIDENCE: create-agent/assets/* hit the /assets/ check, not /agents/]
- [x] CHK-FIX-004 [P1] `core_workflow` is universal across all 24 agents (safe to require) [EVIDENCE: rg numbered CORE WORKFLOW = 24/24]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Scoped commit (validator + rules + 10 routers + spec folder only); concurrent reorg churn excluded [EVIDENCE: explicit pathspec]
- [x] CHK-031 [P1] No secrets; shared validator change is additive detection + rule relax, reversible in one revert [EVIDENCE: single scoped commit]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec/plan/tasks/checklist/impl-summary synchronized [EVIDENCE: validate.sh --strict]
- [x] CHK-041 [P2] Out-of-scope items (non-sk-doc commands, router-gen template) documented [EVIDENCE: spec Open Questions]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] GPT-5.5 did the routers (operator-directed method); validator/rules hand-edited (precise shared tool) [EVIDENCE: router_agent.log; hand-edits to validate_document.py + template_rules.json]
- [x] CHK-051 [P1] Spec folder complete [EVIDENCE: spec/plan/tasks/checklist/impl-summary + description.json + graph-metadata.json]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-07-07
<!-- /ANCHOR:summary -->

---
