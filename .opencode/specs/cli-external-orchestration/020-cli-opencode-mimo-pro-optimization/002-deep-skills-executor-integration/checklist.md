---
title: "Verification Checklist: MiMo + MiniMax as selectable deep-skills executors [template:level_2/checklist.md]"
description: "Verification Date: 2026-06-01"
trigger_phrases:
  - "deep skills executor integration checklist"
  - "verification"
  - "checklist"
  - "name"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/020-cli-opencode-mimo-pro-optimization/002-deep-skills-executor-integration"
    last_updated_at: "2026-06-01T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored phase-002 QA checklist"
    next_safe_action: "Verify items after edits land"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/002-deep-skills-executor-integration"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: MiMo + MiniMax as selectable deep-skills executors

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

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001..006)
- [x] CHK-002 [P0] Technical approach defined in plan.md (optional gated agent flag; remove hard-coded `--agent general`)
- [x] CHK-003 [P1] cli-opencode executor kind confirmed to accept any provider/model with no `agent` field in schema
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `rg -n "agent general"` across `deep/assets/*.yaml` returns nothing (all four edited YAMLs clean; two ai-council YAMLs also clean)
- [x] CHK-011 [P0] `dispatch-model.cjs` arg builder = `if (agent && agent !== 'general') args.push('--agent', agent)` (L198); resolved `'general'` default retained for record-keeping
- [x] CHK-012 [P0] `dispatch-model.cjs` passes `node --check` after the edit
- [x] CHK-013 [P1] Four deep YAMLs preserve the `if_cli_opencode` block + `{optional_variant_flag}` render hint (only the hard-coded `--agent general` token removed)
- [x] CHK-014 [P1] No new EXECUTOR_KIND added; native / cli-codex / cli-gemini / cli-claude-code / cli-devin branches untouched
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] `remediation.vitest.ts` adds `describe('cli-opencode --agent handling')` (L247) with 3 tests: omit-for-general, omit-for-unset, include-for-explicit-orchestrate
- [x] CHK-021 [P0] Full model-benchmark vitest suite green — 6 files, 56 tests, ALL PASSED
- [x] CHK-022 [P1] Default-case dry render of the cli-opencode branch produces a command WITHOUT `--agent`; an explicit `orchestrate` produces `--agent orchestrate` (arg-builder asserted in vitest)
- [x] CHK-023 [P1] Behavior-equivalent for gateway models (default agent already ran via warn+fallback); strictly removes the subagent warning and the token-plan rejection
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class: `cross-consumer` — the hard-coded dispatch flag rippled across review + research YAMLs + the benchmark dispatcher; the doc surfaces advertise the unblocked models
- [x] CHK-FIX-002 [P0] Same-class producer inventory: `rg -n "if_cli_opencode" deep/assets/*.yaml` (four review/research recipes) + `dispatch-model.cjs` arg builder
- [x] CHK-FIX-003 [P0] Consumer inventory: `executor-config.ts` accepts any cli-opencode provider/model (no `agent` field, unchanged); `remediation.vitest.ts` updated to assert the new arg shape
- [x] CHK-FIX-004 [P0] No security/path/parser/redaction surface touched (dispatch arg list + YAML render + docs only) — N/A by inspection
- [x] CHK-FIX-005 [P1] Matrix axes listed: dispatch path {review-auto, review-confirm, research-auto, research-confirm, benchmark} × agent state {unset, general, explicit non-general} × kind {cli-opencode}
- [x] CHK-FIX-006 [P1] ai-council path verified: seats dispatch via injected `dispatchSeat`; no hard-coded `--agent general`/`opencode run` in council code or YAML — covered by the shared dispatcher fix where applicable, no edit needed
- [x] CHK-FIX-007 [P1] Evidence pinned to this session's edits (`rg`/`node --check`/vitest output captured)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets introduced (dispatch arg list change only)
- [x] CHK-031 [P0] No input-handling surface introduced — N/A
- [x] CHK-032 [P1] Agent handling documented (omit `--agent` for the default/general case per the cli-opencode contract; keep it for explicit primary agents)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec/plan/tasks/checklist synchronized
- [x] CHK-041 [P1] No ephemeral artifact pointers embedded in code/YAML comments (durable WHY only)
- [x] CHK-042 [P2] Deep command docs (`start-research-loop.md`, `start-review-loop.md`, `start-model-benchmark-loop.md`, `ask-ai-council.md`) name `xiaomi-token-plan-ams/mimo-v2.5-pro` + `minimax-coding-plan/MiniMax-M2.7-highspeed`
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No temp files written into the packet
- [x] CHK-051 [P1] scratch/ not used
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 13/13 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-01
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
