---
title: "Verification Checklist: Devin hook parity"
description: "Verification checklist for the Devin hook parity phase."
trigger_phrases: ["devin hook parity checklist"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/008-devin-hook-parity"
    last_updated_at: "2026-07-24T06:43:46Z"
    last_updated_by: "claude-code"
    recent_action: "Authored verification checklist; all items unchecked, phase Planned"
    next_safe_action: "Work through items in order once implementation starts"
    blockers: ["depends on phase 004 landing first"]
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-devin-revival-followups", parent_session_id: null }
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Devin hook parity

<!-- ANCHOR:protocol -->
## Verification Protocol
| Priority | Handling |
|---|---|
| P0 | Must pass before this phase is Complete |
| P1 | Should pass; document any gap |
| P2 | Nice-to-have; document if skipped |
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## PRE-IMPLEMENTATION
- [ ] CHK-001 [P0] Phase 004 confirmed landed before adapter work begins.
- [ ] CHK-002 [P0] Devin's live hook schema for the 6 remaining events re-verified against docs + a real fired event, not assumed.
- [ ] CHK-003 [P0] `.devin/hooks.v1.json` discovery/precedence order confirmed live (resolves phase 004's REQ-007).
- [ ] CHK-004 [P1] All 5 ADRs accepted before adapter code is written.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## CODE QUALITY
- [ ] CHK-010 [P0] All 9 new adapter files pass repo lint/format/syntax checks.
- [ ] CHK-011 [P0] Every adapter fails open (approve/no-op) on malformed or missing stdin payloads.
- [ ] CHK-012 [P1] `post-compaction.cjs` implements all 5 steps of the recovery chain, not a subset.
- [ ] CHK-013 [P1] `task-dispatch-guard.cjs` does not assume unverified `run_subagent` field names.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## TESTING
- [ ] CHK-020 [P0] Fixture tests cover payload validation, matcher parsing, envelope translation for all 9 new adapters.
- [ ] CHK-021 [P0] Live smoke test captures stdin/stdout evidence for each of the 6 remaining events.
- [ ] CHK-022 [P0] Malformed-JSON and missing-field edge cases tested for every adapter, not just the happy path.
- [ ] CHK-023 [P1] `SessionEnd` behavior (lenient vs. strict) is confirmed live before the registration decision (T014) is finalized.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## FIX COMPLETENESS
N/A - this phase is new-adapter creation, not a bug fix.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## SECURITY
- [ ] CHK-030 [P0] No credentials/secrets logged or transmitted by any adapter.
- [ ] CHK-031 [P1] No adapter echoes raw payload contents that could contain user secrets.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## DOCUMENTATION
- [ ] CHK-040 [P0] `README.md` authored in each new `hooks/devin/` sibling directory, mirroring the Codex siblings.
- [ ] CHK-041 [P1] `mcp-route-guard.cjs`'s dormancy status is explicitly documented as provisional, pending phase 009.
- [ ] CHK-042 [P1] The `task-dispatch-guard.cjs` divergence from Codex's fold-in approach is documented with rationale, not silently different.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## FILE ORGANIZATION
- [ ] CHK-050 [P1] All new adapter files live under the `hooks/devin/` sibling directory matching each core's own packet (e.g. `cli-opencode/scripts/hooks/devin/`), matching the Claude/Codex sibling layout exactly.
- [ ] CHK-051 [P1] `.devin/hooks.v1.json` at project root merges with, never replaces, phase 004's existing entries.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:arch-verify -->
## L3: ARCHITECTURE VERIFICATION
- [ ] CHK-100 [P0] All 5 ADRs documented with Context, Decision, Alternatives, Consequences, Five Checks, Implementation sections.
- [ ] CHK-101 [P1] Each ADR has a recorded status (Proposed/Accepted).
- [ ] CHK-102 [P1] The `task-dispatch-guard.cjs` divergence and the `PostCompaction` bespoke-logic decision are each backed by a Five-Checks evaluation, not asserted without justification.
<!-- /ANCHOR:arch-verify -->

<!-- ANCHOR:perf-verify -->
## L3: PERFORMANCE VERIFICATION
- [ ] CHK-110 [P1] Hook adapters add no perceptible latency, confirmed by timing the live smoke test.
- [ ] CHK-111 [P2] No load testing needed - hooks run once per lifecycle event.
<!-- /ANCHOR:perf-verify -->

<!-- ANCHOR:deploy-ready -->
## L3: DEPLOYMENT READINESS
- [ ] CHK-120 [P0] Rollback tested: deleting the 9 new files + reverting `.devin/hooks.v1.json` leaves neutral cores untouched.
- [ ] CHK-121 [P0] No feature flag needed - additive, Devin-only.
- [ ] CHK-122 [P2] No monitoring/alerting configured - not required at this scale.
<!-- /ANCHOR:deploy-ready -->

<!-- ANCHOR:compliance-verify -->
## L3: COMPLIANCE VERIFICATION
- [ ] CHK-130 [P1] Security review (CHK-030/031) completed before marking done.
- [ ] CHK-131 [P2] No new third-party dependency licenses introduced.
<!-- /ANCHOR:compliance-verify -->

<!-- ANCHOR:docs-verify -->
## L3: DOCUMENTATION VERIFICATION
- [ ] CHK-140 [P1] READMEs cross-reference Codex siblings and this phase's spec.md.
- [ ] CHK-141 [P2] Any adapter-path shift during implementation is reflected back into phase 009's cross-reference if it affects `mcp-route-guard.cjs`.
<!-- /ANCHOR:docs-verify -->

<!-- ANCHOR:sign-off -->
## L3: SIGN-OFF
- Operator (Product Owner): [ ] Approved
- Implementing agent (Technical Lead): [ ] Approved
<!-- /ANCHOR:sign-off -->

<!-- ANCHOR:summary -->
## Verification Summary
P0 Items: 12 total (0 verified). P1 Items: 12 total (0 verified). P2 Items: 3 total (0 verified). Verification Date: Not yet started - phase is Planned.
<!-- /ANCHOR:summary -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `tasks.md`, `decision-record.md`
