---
title: "Verification Checklist: Spec Mutation Gate [template:level_3/checklist.md]"
description: "Level 3 verification checklist for the runtime Gate-3 spec-mutation guard: core, adapters, fail-open posture, and the answerParse corpus."
trigger_phrases:
  - "spec mutation gate checklist"
  - "gate 3 verification"
  - "mk-spec-gate checklist"
  - "fail open verification"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/134-plugin-hook-implementation/006-spec-mutation-gate"
    last_updated_at: "2026-07-11T06:21:17.844Z"
    last_updated_by: "spec-author"
    recent_action: "Authored Level 3 verification checklist covering core, adapters, and fail-open posture"
    next_safe_action: "Leave all items unchecked until implementation produces real evidence"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/006-spec-mutation-gate"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Spec Mutation Gate

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

- [ ] CHK-001 [P0] Requirements documented in spec.md (REQ-001..REQ-008)
- [ ] CHK-002 [P0] Technical approach defined in plan.md (core-plus-two-adapters)
- [ ] CHK-003 [P1] Dependencies identified and available (shared classifier ESM module, settings.json multi-hook support)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Core and adapters pass lint/format and type checks
- [ ] CHK-011 [P0] The core writes no stdout/stderr and appends no log itself (adapters own transport)
- [ ] CHK-012 [P1] Every hook is wrapped fail-open; only `mk-spec-gate:`-prefixed errors re-throw
- [ ] CHK-013 [P1] Code follows the deep-loop core-plus-adapter patterns and the MUTATING_TOOLS extraction shape
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Golden loop passes: open -> deny (enforce env set) -> answer -> allow
- [ ] CHK-021 [P0] Fail-open assertions pass (corrupt/unwritable state, classifier throw, enforce env unset)
- [ ] CHK-022 [P1] Read-only-guard case passes: a review prompt never opens the gate
- [ ] CHK-023 [P1] Exempt-path case passes: a Write to the spec tree is allowed while status is open
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed for `MUTATING_TOOLS` and filePath extraction, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for `classifyPrompt`, `validateSpecFolderBinding`, `MK_SPEC_GATE_ENFORCE`, settings.json, and docs.
- [ ] CHK-FIX-004 [P0] Path-class exemption and in-repo-source detection include adversarial table tests for spec-tree, /tmp, dist, node_modules, .git, out-of-repo, and no-op cases.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed (env x tool x gate status x target class).
- [ ] CHK-FIX-006 [P1] Hostile env variant executed: `MK_SPEC_GATE_ENFORCE` set and unset, corrupt state, and unresolvable workspace root.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets or session content written to logs; state holds only the validated resolved path and status
- [ ] CHK-031 [P0] Input validation on the parsed answer; `answerParse()` runs only when status is open
- [ ] CHK-032 [P1] The injected question is a fixed string; matched-token arrays are never echoed to TUI/context
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks/checklist/decision-record synchronized
- [ ] CHK-041 [P1] Code comments explain the fail-open contract and the ESM/CJS asymmetry
- [ ] CHK-042 [P2] `.opencode/plugins/README.md` updated with the `mk-spec-gate` entry
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
| P0 Items | 13 | 0/13 |
| P1 Items | 15 | 0/15 |
| P2 Items | 5 | 0/5 |

**Verification Date**: Not yet verified (planning stage; all items Draft)
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] Architecture decisions documented in decision-record.md (ADR-001, ADR-002)
- [ ] CHK-101 [P1] All ADRs have status (Proposed/Accepted)
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale
- [ ] CHK-103 [P2] The ESM-vs-.mjs authoring choice is resolved and recorded
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Enforce path adds at most one cached `fs.stat` and never walks the specs tree (NFR-P01)
- [ ] CHK-111 [P1] Classify path starts no daemon, MCP, or bridge subprocess (NFR-P02)
- [ ] CHK-112 [P2] Session-state read/write cost measured under a normal session load
- [ ] CHK-113 [P2] `answerParse()` corpus timing documented
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback documented and tested: unset `MK_SPEC_GATE_ENFORCE`, or remove settings entries + delete the plugin
- [ ] CHK-121 [P0] Deny stays behind `MK_SPEC_GATE_ENFORCE`; classify-only is the default
- [ ] CHK-122 [P1] Classify-only rollout observed with zero deny events before the enforce flip (SC-001)
- [ ] CHK-123 [P1] Runbook note for reading `.opencode/skills/.spec-gate-state/` warning-log
- [ ] CHK-124 [P2] Enforce-flip runbook reviewed
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] The guard does not diverge from the prose Gate-3 rule in CLAUDE.md / AGENTS.md
- [ ] CHK-131 [P1] No new external dependency introduced; core reuses the existing shared classifier
- [ ] CHK-132 [P2] Fail-open posture reviewed against the mk-goal fail-closed exemplar (deliberate divergence)
- [ ] CHK-133 [P2] State retention (sweep/archive/prune) matches the loop-guard-state policy
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All spec documents synchronized
- [ ] CHK-141 [P1] Hook contract documented (deny-JSON shape, additionalContext, fail-open)
- [ ] CHK-142 [P2] Plugin registry entry reviewed
- [ ] CHK-143 [P2] Knowledge transfer note on `answerParse()` and its corpus
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Pending | Technical Lead | [ ] Approved | |
| Pending | Framework Owner | [ ] Approved | |
| Pending | QA Reviewer | [ ] Approved | |
<!-- /ANCHOR:sign-off -->

---
