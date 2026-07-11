---
title: "Verification Checklist: External MCP Route Guard"
description: "Planning-stage verification checklist for the warn-first external MCP route guard. All items are unchecked until the phase is implemented."
trigger_phrases:
  - "mcp route guard checklist"
  - "guard verification checklist"
  - "warn-only guard checks"
  - "code mode guard qa"
  - "fail-open guard verification"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/132-plugin-hook-implementation/005-mcp-route-guard"
    last_updated_at: "2026-07-11T14:17:40Z"
    last_updated_by: "spec-author"
    recent_action: "Authored the Level 3 verification checklist; every item stays unchecked at planning stage"
    next_safe_action: "Check items only against real evidence once implementation begins"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-code-mode/runtime/lib/mcp-route-guard.cjs"
      - ".opencode/plugins/mk-mcp-route-guard.js"
      - ".opencode/skills/mcp-code-mode/runtime/hooks/claude/mcp-route-guard.cjs"
      - ".claude/settings.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/005-mcp-route-guard"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: External MCP Route Guard

<!-- SPECKIT_LEVEL: 3 -->
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

- [ ] CHK-001 [P0] Requirements REQ-001 through REQ-008 documented in spec.md
- [ ] CHK-002 [P0] Architecture (runtime-neutral core + two thin adapters) defined in plan.md
- [ ] CHK-003 [P1] Manifest-strict vs broad-advisory posture fork resolved (ADR-002)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Core decision flow has no reject, deny, or throw path
- [ ] CHK-011 [P0] Core never writes stdout/stderr or the log; adapters own all I/O
- [ ] CHK-012 [P1] OpenCode plugin is default-export-only and never throws
- [ ] CHK-013 [P1] Code follows the dispatch-guard and mk-dist-freshness-guard patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria (REQ-001 through REQ-008) covered by a check
- [ ] CHK-021 [P0] Table-driven unit test green: warn / manifest-strict allow / internal exempt / non-MCP
- [ ] CHK-022 [P1] Claude-hook integration test green: additionalContext, exit 0, no permissionDecision
- [ ] CHK-023 [P1] Error scenarios validated: unreadable manifest and malformed payload both return allow
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each guard behavior classified: parse, normalize, exempt, manifest lookup, warn/allow.
- [ ] CHK-FIX-002 [P0] Normalization proven to bridge `clickup_official` and `claude_ai_ClickUp` to `clickup` by test.
- [ ] CHK-FIX-003 [P0] Consumers of `evaluateNativeMcpCall` limited to the two adapters and the test (`rg -n 'evaluateNativeMcpCall'`).
- [ ] CHK-FIX-004 [P0] Adversarial name table covers `clickup_official` vs `claude_ai_ClickUp`, `chrome_devtools_1`, any `mk_`/`mk-` prefix, and non-MCP tools.
- [ ] CHK-FIX-005 [P1] Input axes (tool-name shape x server class x manifest state) enumerated before build.
- [ ] CHK-FIX-006 [P1] Hostile-state variant executed: broad-mode flag on/off and missing manifest.
- [ ] CHK-FIX-007 [P1] Evidence pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets read; only `manual_call_templates[].name` values consumed
- [ ] CHK-031 [P0] Manifest read is size-capped and uses a single JSON.parse
- [ ] CHK-032 [P1] Tool-name input validated; malformed input fails open to allow
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Core and adapter comments explain the warn-only, fail-open why
- [ ] CHK-042 [P2] Plugins README updated with the mk-mcp-route-guard entry
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
| P0 Items | 15 | 0/15 |
| P1 Items | 23 | 0/23 |
| P2 Items | 9 | 0/9 |

**Verification Date**: Not yet verified (planning stage)
<!-- /ANCHOR:summary -->

---

<!-- Append to Level 2 checklist.md -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] Architecture decisions documented in decision-record.md
- [ ] CHK-101 [P1] All ADRs have a status (Proposed/Accepted)
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale (manifest-strict vs broad)
- [ ] CHK-103 [P2] Rollback/removal path documented
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Claude hook completes within the 5s PreToolUse timeout (NFR-P01)
- [ ] CHK-111 [P1] No heavy requires; pure synchronous file reads; no daemon or cold-start
- [ ] CHK-112 [P2] Family-set mtime cache avoids re-parsing the manifest on every call
- [ ] CHK-113 [P2] Subprocess-cost impact reviewed for the narrow `mcp__claude_ai_.*` matcher
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Removal procedure documented (delete matcher block + plugin)
- [ ] CHK-121 [P0] Env kill-switch / broad-mode flag documented before enabling
- [ ] CHK-122 [P1] Bounded log rotation verified (256KB + .1 backup + age-prune)
- [ ] CHK-123 [P1] Dormant-surface note recorded (OpenCode has no native external MCP today)
- [ ] CHK-124 [P2] Optional generator-wiring decision recorded
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] Warn-only, fail-open posture reviewed against the warn-first mandate
- [ ] CHK-131 [P1] No new runtime dependencies added
- [ ] CHK-132 [P2] SKILL.md redundancy caveat acknowledged (guard is a reminder, not new policy)
- [ ] CHK-133 [P2] Account-connector scoping documented (`claude_ai_*` is session-scoped)
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All spec documents synchronized
- [ ] CHK-141 [P1] Manifest/connector normalization documented
- [ ] CHK-142 [P2] Operator fork surfaced in spec Open Questions
- [ ] CHK-143 [P2] Verified sources cited in plan and decision-record
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Unassigned | Technical Lead | [ ] Approved | Pending |
| Unassigned | Product Owner | [ ] Approved | Pending |
| Unassigned | QA Lead | [ ] Approved | Pending |
<!-- /ANCHOR:sign-off -->
