---
title: "Verification Checklist: Command lane-asking for the model-benchmark lane"
description: "Verification Date: 2026-05-29"
trigger_phrases:
  - "command lane-asking checklist"
  - "model-benchmark command checklist"
  - "lane-asking verification"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/022-deep-agent-improvement-benchmark-mode/008-add-model-benchmark-lane-selection-prompts"
    last_updated_at: "2026-05-29T09:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Verified all CMD-1 through CMD-5 + fix-completeness items"
    next_safe_action: "Phase 008 complete; proceed to phase 009"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-008-docs"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Command lane-asking for the model-benchmark lane

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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Model-benchmark runtime contract (phases 003 to 005) confirmed as the reused dependency
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Command and YAML surfaces parse without syntax errors
- [x] CHK-011 [P0] No leftover scaffold or template markers in authored surfaces
- [x] CHK-012 [P1] Lane B YAMLs follow the structure of the Lane A YAMLs
- [x] CHK-013 [P1] Authored docs follow HVR style (no em-dashes, no semicolons in prose, no Table-of-Contents)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] CMD-1 Lane A behavioral identity: the agent-improvement lane workflow is unchanged after the additive branch is added — Evidence: verifier PASS (Lane A branch unchanged) + TST-1 vitest green
- [x] CHK-021 [P0] Lane B end-to-end: `loop-host.cjs --mode=model-benchmark` reaches a benchmark-complete state from a command — Evidence: pattern + 5dim both reach status=benchmark-complete via loop-host
- [x] CHK-022 [P1] Lane-asking branch always asks the use-case lane with no silent default that hides Lane B
- [x] CHK-023 [P1] Lane B run records carry `mode: model-benchmark` and the report carries `scoringMethod: pattern|5dim` — Evidence: smoke shows mode=model-benchmark + scoringMethod=5dim in state log
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. — N/A: arg-forwarding fix, not a security/path/parser/redaction change
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. — N/A: loop-host planInvocation reads no process-wide state
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets in the new command, YAMLs, or gemini mirror
- [x] CHK-031 [P1] Lane B profile and outputs-dir paths stay inside the expected packet-local boundaries
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] CMD-2 Advisor routes both lanes: `/deep:start-agent-improvement-loop` to the agent-improvement skill and `/deep:start-model-benchmark-loop` to the model-benchmark skill — Evidence: advisor PASS, deep-model-benchmark beats agent-improvement on benchmark phrasing, no leak on improve-agent
- [x] CHK-041 [P0] CMD-3 README and gemini mirror present: `README.txt` lists both lanes and `start-model-benchmark-loop.toml` exists — Evidence: README lists 5 deep commands, start-model-benchmark-loop.toml present
- [x] CHK-042 [P1] CMD-4 spec/plan/tasks synchronized with the shipped command surfaces
- [x] CHK-043 [P0] CMD-5 No placeholders: strict validate reports no unfilled template placeholders across the authored surfaces — Evidence: validate.sh --strict 0 errors 0 warnings
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 13/13 |
| P1 Items | 11 | 11/11 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-05-29
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
