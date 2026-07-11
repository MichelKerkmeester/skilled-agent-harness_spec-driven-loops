---
title: "Verification Checklist: Plugin State-Dir Auto-Cleanup (completion-sentinel + smart-router-telemetry)"
description: "Verification checklist for the two state-cleanup gaps: dedup-store sweep and telemetry JSONL rotation."
trigger_phrases:
  - "sentinel sweep verification"
  - "telemetry rotation checklist"
  - "state cleanup checklist"
  - "fail-open invariant checks"
  - "rotate not delete verification"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/132-plugin-hook-implementation/008-plugin-state-cleanup"
    last_updated_at: "2026-07-11T13:12:24Z"
    last_updated_by: "spec-author"
    recent_action: "Authored Level 2 planning docs scoping both state-cleanup gaps"
    next_safe_action: "Implement sweepStaleSentinelState + telemetry rotation per plan.md"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/hooks/completion-evidence-sentinel.cjs"
      - ".opencode/plugins/mk-completion-sentinel.js"
      - ".opencode/skills/system-spec-kit/mcp_server/hooks/claude/completion-evidence-stop.cjs"
      - ".opencode/skills/system-spec-kit/scripts/observability/smart-router-telemetry.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/008-plugin-state-cleanup"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Confirm the telemetry cap default (1 MiB) and dedup retention default (30 days) match operator expectations for signal retention versus disk footprint."
      - "Confirm whether the singular .opencode/skill/ path was ever a real write target in any environment before reconciling telemetryFilePath to the plural .opencode/skills/ live dir."
    answered_questions: []
---
# Verification Checklist: Plugin State-Dir Auto-Cleanup (completion-sentinel + smart-router-telemetry)

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

- [ ] CHK-001 [P0] Both gaps (dedup-store sweep + telemetry rotation) documented in spec.md with acceptance criteria
- [ ] CHK-002 [P0] Technical approach and resolved design choices (sweep signature, singular->plural path) defined in plan.md
- [ ] CHK-003 [P1] Exemplar idiom (sweepStaleGateStates, maintainWarningLogPath) confirmed reusable
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Changed .cjs/.js/.ts files pass lint/typecheck with no mcp_server dist rebuild
- [ ] CHK-011 [P0] No stdout/stderr added to the OpenCode plugin or the sentinel core; the plugin stays default-export-only
- [ ] CHK-012 [P1] Every new sweep/rotation step is fail-open (per-entry/per-step try/catch)
- [ ] CHK-013 [P1] Comment hygiene: code comments carry only the durable WHY (no artifact ids, spec paths, or packet numbers)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Acceptance met (dedup): a store with one stale + one fresh entry -> after sweep only the fresh remains; corrupt/unreadable store is a no-op
- [ ] CHK-021 [P0] Acceptance met (telemetry): appending past the cap rotates to compliance.jsonl.1 and continues appending; a rotation failure still appends the record
- [ ] CHK-022 [P1] Edge cases tested: stray *.tmp removal, <log>.1 age-prune, throttle short-circuit, empty/absent store and file
- [ ] CHK-023 [P1] Adapter invocation tested: session.created sweep (plugin) + Stop best-effort sweep (Claude adapter), both fail-open
- [ ] CHK-024 [P1] Rotate-not-delete verified: rotation preserves the single latest .1 and prunes only past the retention window; recent signal is never silently dropped
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each gap has a finding class recorded (both = class-of-bug: missing retention path on an otherwise-bounded guard family)
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed (`rg sweepStale|maintainWarningLogPath|pruneGateArchive` across spec-gate/loop-guard) or instance-only status proven
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for the changed symbols (sweepStaleSentinelState, appendJsonl, telemetryFilePath) and the telemetry readers
- [ ] CHK-FIX-004 [P0] Path/persistence fix includes adversarial cases: corrupt store, unreadable dir, rotation failure, singular-vs-plural path, and no-op
- [ ] CHK-FIX-005 [P1] Matrix axes and row count listed before completion is claimed (sentinel store/tmp/log x telemetry size/rotation/path)
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed: MK_COMPLETION_SENTINEL_DISABLED=1 full no-op, plus cap/retention/interval env overrides
- [ ] CHK-FIX-007 [P1] Evidence pinned to the fix SHA or an explicit diff range, not a moving branch-relative range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Retention/cap/interval read via positive-int-from-env validation; invalid/negative input falls back to the default
- [ ] CHK-032 [P1] Kill-switch MK_COMPLETION_SENTINEL_DISABLED=1 fully no-ops the sentinel and its sweep; telemetry stays observe-only
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec/plan/tasks/checklist synchronized (both gaps reflected in each)
- [ ] CHK-041 [P1] Code comments explain the durable WHY and match the spec-gate exemplar tone
- [ ] CHK-042 [P2] No mcp_server/ dist rebuilt - the sentinel core is a plain .cjs and the telemetry script is an observability .ts outside dist (verify no dist diff)
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
| P0 Items | 11 | 0/11 |
| P1 Items | 13 | 0/13 |
| P2 Items | 2 | 0/2 |

**Verification Date**: Pending (planning phase)
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
