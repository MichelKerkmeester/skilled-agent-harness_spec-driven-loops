---
title: "Verification Checklist: Plugin Manual-Testing Playbooks (11 scenarios)"
description: "Verification checklist for the 11 plugin/hook playbook scenarios and their review pass"
trigger_phrases:
  - "plugin playbook verification checklist"
  - "scenario evidence checklist"
  - "plugins-and-hooks review checklist"
  - "11 scenario pass verification"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/132-plugin-hook-implementation/009-plugin-manual-testing-playbooks"
    last_updated_at: "2026-07-11T14:07:09Z"
    last_updated_by: "spec-author"
    recent_action: "Authored and reviewer-verified 11 manual-testing-playbook scenarios, all PASS"
    next_safe_action: "None; phase 9 of 9 is complete, no successor phase"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/manual_testing_playbook/plugins-and-hooks/"
      - ".opencode/skills/cli-external/manual_testing_playbook/plugins-and-hooks/"
      - ".opencode/skills/system-code-graph/manual_testing_playbook/plugins-and-hooks/"
      - ".opencode/skills/sk-code/manual_testing_playbook/plugins-and-hooks/"
      - ".opencode/skills/mcp-code-mode/manual_testing_playbook/plugins-and-hooks/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/009-plugin-manual-testing-playbooks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Skipped plugins already covered: mk-skill-advisor, mk-goal, mk-deep-loop-guard"
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Plugin Manual-Testing Playbooks

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|---------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] All 11/11 plugin/hook pairs identified and scoped in spec.md, with the 3 already-covered exclusions named (mk-skill-advisor, mk-goal, mk-deep-loop-guard)
- [x] CHK-002 [P0] Scenario contract (sk-doc manual_testing_playbook template + EXECUTION POLICY) confirmed reusable for all 11/11 pairs in plan.md
- [x] CHK-003 [P1] Real source read for 11/11 plugin/hook pairs (shared core + both adapters) before authoring each scenario
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] 16/16 changed files are markdown docs (11 scenarios distributed across 5 owning skills + 5 per-skill index registrations); 0/0 plugin or hook source files modified by this phase
- [x] CHK-011 [P0] Every scenario cites the real vitest or node:test command it ran, not a hypothetical one
- [x] CHK-012 [P1] All 11/11 scenarios use the playbook's verdict vocabulary (PASS/FAIL/SKIP/UNAUTOMATABLE), no invented in-between state
- [x] CHK-013 [P1] Comment hygiene: 11/11 scenario files carry durable technical detail (plugin names, real file paths, command shapes), no ephemeral packet/phase ids embedded
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] cli-dispatch-audit-trail.md: core unit suite 38/38 passed live; kill-switch and redaction confirmed
- [x] CHK-021 [P0] code-graph-freshness-guard.md: unit 12/12 + freshness-core vitest 19/19 passed live; gate-order confirmed
- [x] CHK-022 [P0] post-edit-quality-router.md: suite 38/38 passed live; PostToolUse hygiene banner + kill-switch confirmed
- [x] CHK-023 [P0] completion-evidence-sentinel.md: plugin 4/4 + core vitest 28/28 passed live; claim-detection + dedup confirmed
- [x] CHK-024 [P0] mcp-route-guard.md: suite 16/16 passed live; warn-on-registered/silent-on-unregistered confirmed
- [x] CHK-025 [P0] spec-mutation-gate-enforce.md: core 66 passed/0 failed + plugin 11/11 passed; enforce-OFF/ON/child/exempt/kill-switch all live-verified; false-positive rate measured from live telemetry
- [x] CHK-026 [P0] speckit-completion-exposer.md: live completion-state resolution incl. the `.opencode/specs` fallback path confirmed PASS
- [x] CHK-027 [P1] 4/11 backfill scenarios (`code-graph-plugin.md`, `spec-memory-plugin.md`, `dist-freshness-guard.md`, `session-cleanup-plugin.md`) authored and confirmed PASS against existing plugin coverage
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Independent reviewer re-verified every command and expected-signal claim across all 11/11 scenarios against the real plugin/hook/core source
- [x] CHK-FIX-002 [P0] 6 real defects found and fixed inline across 5/11 scenarios; 0 waved through as false positives
- [x] CHK-FIX-003 [P1] The remaining 6/11 scenarios were reviewed and confirmed accurate with 0 changes needed
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets in any of the 11/11 scenario files; `cli-dispatch-audit-trail.md`'s redaction example uses an explicitly fake demo key
- [x] CHK-031 [P1] `spec-mutation-gate-enforce.md`'s destructive/kill-switch cases were exercised consistent with the playbook's global sandbox precondition guidance
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] 4/4 docs synchronized for phase 9 (spec.md, plan.md, tasks.md, checklist.md)
- [x] CHK-041 [P1] Each of the 5 owning skills' manual_testing_playbook.md registers the plugins-and-hooks/ category with a one-line description; together the 5 registrations cover all 11/11 scenarios
- [x] CHK-042 [P2] 008-plugin-state-cleanup/spec.md phase link updated: Phase 8 of 8 -> 8 of 9, Successor None -> 009-plugin-manual-testing-playbooks
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] All 11/11 scenario files live under their owning skill's manual_testing_playbook/plugins-and-hooks/ directory (distributed across system-spec-kit, cli-external, system-code-graph, sk-code, mcp-code-mode), not inside this spec folder
- [x] CHK-051 [P1] `scratch/` holds only `.gitkeep` before completion; 0 working files left behind
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 15/15 |
| P1 Items | 9 | 9/9 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-07-11
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
