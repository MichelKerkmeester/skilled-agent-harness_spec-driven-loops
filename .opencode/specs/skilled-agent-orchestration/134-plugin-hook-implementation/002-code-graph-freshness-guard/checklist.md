---
title: "Verification Checklist: Incremental Code-Graph Freshness Guard"
description: "Verification checklist for the post-edit code-graph freshness guard. All items are unchecked at planning stage; evidence is filled during implementation."
trigger_phrases:
  - "code graph freshness checklist"
  - "freshness guard verification"
  - "warm-only scan checklist"
  - "post-edit guard checklist"
  - "code-graph-freshness-guard"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/134-plugin-hook-implementation/002-code-graph-freshness-guard"
    last_updated_at: "2026-07-11T06:21:17.310Z"
    last_updated_by: "spec-author"
    recent_action: "Created Level 3 verification checklist (planning stage, all items unchecked)"
    next_safe_action: "Await approval, then verify items against the implementation as it lands"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/runtime/lib/code-graph/freshness-core.cjs"
      - ".opencode/plugins/mk-code-graph-freshness.js"
      - ".opencode/skills/system-code-graph/runtime/hooks/claude/code-graph-freshness.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/002-code-graph-freshness-guard"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Incremental Code-Graph Freshness Guard

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

- [ ] CHK-001 [P0] Requirements documented in spec.md (REQ-001 through REQ-008)
- [ ] CHK-002 [P0] Technical approach defined in plan.md (core-plus-two-adapters, gate order)
- [ ] CHK-003 [P1] Dependencies identified and available (warm-only CLI refusal, readiness + owner markers)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Core is output-free: no `process.stdout`/`process.stderr` writes and no `child_process` spawn in `freshness-core.cjs`
- [ ] CHK-011 [P0] No stray TUI output from either adapter (detached spawn uses `stdio:'ignore'`)
- [ ] CHK-012 [P1] Every adapter hook wrapped in try/catch and fails open (never throws into the tool path)
- [ ] CHK-013 [P1] Code follows the `dispatch-guard.cjs` atomic-state, sweep, and append-log patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met (REQ-001 through REQ-008)
- [ ] CHK-021 [P0] The three pinning assertions pass: scan / defer-cold / defer-empty
- [ ] CHK-022 [P1] Debounce, scope-filter, and drain edge cases tested
- [ ] CHK-023 [P1] Error scenarios validated (missing/malformed markers, stale-heartbeat race)
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
- [ ] CHK-031 [P0] No edited file path is interpolated into a shell; the spawn uses a fixed bin and arg vector
- [ ] CHK-032 [P1] The guard never invokes `mk-code-index-launcher.cjs` (grep confirms)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments carry the durable WHY (warm-only invariant, fail-open posture)
- [ ] CHK-042 [P2] `plugins/README.md` updated with the new plugin entry
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
| P1 Items | 12 | [ ]/12 |
| P2 Items | 2 | [ ]/2 |

**Verification Date**: TBD (planning stage; not yet implemented)
<!-- /ANCHOR:summary -->

---

<!-- Append to Level 2 checklist.md -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] Architecture decisions documented in decision-record.md
- [ ] CHK-101 [P1] All ADRs have status (Proposed/Accepted)
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale
- [ ] CHK-103 [P2] Migration path documented (N/A - additive, no migration)
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Decision hot path stays cheap (NFR-P01: only synchronous file reads, no spawn on the decision path)
- [ ] CHK-111 [P1] No network call and no cold-start on the decision path (NFR-S01/R01)
- [ ] CHK-112 [P2] Debounce thresholds tuned so a burst produces at most one scan
- [ ] CHK-113 [P2] Append-only log rotation and state-dir retention verified via `sweepStaleFreshnessState()`
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure documented (delete three files, revert two edits, remove state dir)
- [ ] CHK-121 [P0] Bootstrap opt-in `MK_CODE_GRAPH_FRESHNESS_BOOTSTRAP` documented and left unset (default-off)
- [ ] CHK-122 [P1] `opencode-plugins-folder-purity` and command-tree parity green
- [ ] CHK-123 [P1] Co-resident Claude wiring confirmed (sk-code hook not replaced)
- [ ] CHK-124 [P2] Manual dry-run notes captured for in-scope and out-of-scope edits
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] Comment-hygiene: no ephemeral spec/packet ids in code comments
- [ ] CHK-131 [P1] Plugin purity: default-export-only, no named exports in the `.js` entrypoint
- [ ] CHK-132 [P2] Hook-location asymmetry respected (skill-local runtime/, not co-located with legacy spec-kit hooks)
- [ ] CHK-133 [P2] Scope-fingerprint discipline: no per-call scope flags passed
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All spec documents synchronized
- [ ] CHK-141 [P1] Runtime behavior documented in `system-code-graph` references (if applicable)
- [ ] CHK-142 [P2] `plugins/README.md` catalog entry present
- [ ] CHK-143 [P2] Phase changelog entry authored on close
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| TBD | Technical Lead | [ ] Approved | |
| TBD | Product Owner | [ ] Approved | |
| TBD | QA Lead | [ ] Approved | |
<!-- /ANCHOR:sign-off -->

---

<!--
Level 3 checklist - Full verification + architecture
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
