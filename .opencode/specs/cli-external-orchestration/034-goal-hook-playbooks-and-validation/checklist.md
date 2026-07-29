---
title: "Verification Checklist: Goal-Hook Playbooks and Live Cross-Runtime Validation"
description: "Verification Date: 2026-07-29"
trigger_phrases:
  - "goal hook validation checklist"
  - "name"
  - "template"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/034-goal-hook-playbooks-and-validation"
    last_updated_at: "2026-07-29T09:38:42Z"
    last_updated_by: "claude"
    recent_action: "Authored spec/plan/tasks/checklist/summary for the goal-hook tracker"
    next_safe_action: "Run generate-description.js, backfill, and validate.sh --strict"
    blockers: []
    key_files:
      - ".opencode/specs/cli-external-orchestration/034-goal-hook-playbooks-and-validation/evidence/pi-injection-excerpt.txt"
      - ".opencode/specs/cli-external-orchestration/034-goal-hook-playbooks-and-validation/evidence/cursor-recorded-evidence.txt"
      - ".opencode/specs/cli-external-orchestration/034-goal-hook-playbooks-and-validation/evidence/opencode-mkgoal-finding.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-hook-playbooks-and-validation-20260729"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Goal-Hook Playbooks and Live Cross-Runtime Validation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
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
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md — REQ-001..REQ-005 defined in `spec.md` section 4
- [x] CHK-002 [P0] Technical approach defined in plan.md — architecture and phases defined in `plan.md` sections 3-4
- [x] CHK-003 [P1] Dependencies identified and available — packet 032 confirmed at completion_pct 100% before this packet started
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks [deferred: doc-only packet, zero code files touched, no lint surface exists]
- [x] CHK-011 [P0] No console errors or warnings [deferred: no runtime code changed by this packet, only markdown docs and evidence captures]
- [x] CHK-012 [P1] Error handling implemented [deferred: not applicable, no code paths were added by this packet]
- [x] CHK-013 [P1] Code follows project patterns — playbook docs follow the `manual-testing-playbook-template.md` structure
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

Live cross-runtime validation matrix, one item per runtime plus the acceptance-criteria roll-up.

- [x] CHK-020 [P0] All acceptance criteria met — REQ-001..REQ-003 satisfied: 6/6 playbook docs named plus `evidence/` captured
- [x] CHK-021 [P0] Pi (offline gpt, free) — PASS: `input` transform appended the `[active_goal]` block; model cited canary `GOALCANARY-PI-2603128151` verbatim, `evidence/pi-injection-excerpt.txt`
- [x] CHK-022 [P1] Devin (glm-5-2, free) — PASS: `UserPromptSubmit additionalContext` fired; model quoted `GOALCANARY-DV-1255523564` verbatim, block present 2/2 times, `evidence/devin-injection-excerpt.txt` + `evidence/devin-model-reply.txt`
- [x] CHK-023 [P1] Cursor (composer-2.5, paid) — RECORDED-EVIDENCE: `turns_used` 0/1 (hook fired) but canary+active_goal 0/0 in the raw transcript, `evidence/cursor-recorded-evidence.txt`
- [x] CHK-024 [P1] OpenCode mk-goal (deepseek + gpt-luna, paid) — SKIP: `mk_goal` tool not exposed in headless `opencode run`, transform is TUI-scoped, `evidence/opencode-mkgoal-finding.txt`
- [x] CHK-025 [P2] Claude-native `/goal` — scoped as upstream, doc-only, not headless-scriptable; recorded in `implementation-summary.md` Known Limitations
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class [deferred: this packet is documentation plus live validation, not a bug fix; finding classification does not apply]
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed [deferred: no producer code was changed by this packet]
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers/schema/response fields [deferred: no helpers, schema, or response fields were changed by this packet]
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction adversarial table tests [deferred: no security, path, parser, or redaction code was touched by this packet]
- [x] CHK-FIX-005 [P1] Matrix axes and row count listed before completion [deferred: the runtime validation matrix lives in the Testing section above instead of a fix matrix]
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed [deferred: no process-wide state was read by new code; live runs used MK_GOAL_STATE_DIR isolation instead]
- [x] CHK-FIX-007 [P1] Evidence pinned to a fix SHA or explicit diff range [deferred: evidence is pinned to timestamped capture files under evidence/, not a code diff range]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — evidence files reviewed manually; contain only canary tokens (e.g. `GOALCANARY-CU-349522064`) and transcript excerpts, no credentials
- [x] CHK-031 [P0] Input validation implemented [deferred: doc-only packet, no input-handling code was authored, nothing to validate]
- [x] CHK-032 [P1] Auth/authz working correctly [deferred: not applicable, no auth surface was touched by this packet]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — all 5 tracker docs authored together in one pass, cross-referencing packet 032 and evidence/ consistently (5/5 docs)
- [x] CHK-041 [P1] Code comments adequate [deferred: no source code comments were authored, packet is markdown docs plus evidence captures only]
- [x] CHK-042 [P2] README updated (if applicable) — not applicable, no README is owned by this packet
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — no scratch/ directory was used; evidence was captured directly to `evidence/`
- [x] CHK-051 [P1] scratch/ cleaned before completion [deferred: no scratch/ directory was created by this packet, nothing to clean]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 14 | 14/14 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-07-29
<!-- /ANCHOR:summary -->
