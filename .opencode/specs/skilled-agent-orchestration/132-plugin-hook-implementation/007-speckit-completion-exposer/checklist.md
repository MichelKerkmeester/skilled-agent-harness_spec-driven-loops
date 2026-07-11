---
title: "Verification Checklist: Spec-Kit Completion-State Exposer (tool.register)"
description: "Planning-stage verification checklist for the read-only completion-state tool, its shared core, the OpenCode plugin adapter, and the optional Claude CLI shim."
trigger_phrases:
  - "completion state checklist"
  - "tool.register verification"
  - "fail-open verification"
  - "default-export-only check"
  - "completion-state core tests"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/132-plugin-hook-implementation/007-speckit-completion-exposer"
    last_updated_at: "2026-07-11T14:17:40Z"
    last_updated_by: "spec-author"
    recent_action: "Authored Level 3 verification checklist; all items unchecked at planning stage"
    next_safe_action: "Author decision-record.md ADRs"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/lib/completion-state.cjs"
      - ".opencode/plugins/mk-speckit-completion.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/007-speckit-completion-exposer"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Spec-Kit Completion-State Exposer (tool.register)

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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Both script contracts (JSON keys, exit codes) confirmed and a Level-2 fixture selected
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Plugin is default-export-only (zero named exports); test surface hangs on `Plugin.__test`
- [ ] CHK-011 [P0] No `console.*` in the plugin (tool RETURN value is the only output channel)
- [ ] CHK-012 [P1] Core degrades every section to `{status:'unavailable', error}` on failure and never throws
- [ ] CHK-013 [P1] Core imports and adapter shape follow the `mk-deep-loop-guard` / `mk-goal` exemplars
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met (REQ-001 through REQ-008)
- [ ] CHK-021 [P0] Core vitest parse and fail-open specs pass
- [ ] CHK-022 [P1] Edge cases tested: incomplete packet (exit 1), missing folder, malformed JSON
- [ ] CHK-023 [P1] CLI shim round-trip prints one parseable JSON object
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. (Additive phase: `rg -n 'tool\(' .opencode/plugins` confirms `mk-goal.js` as the only prior tool-register producer to mirror.)
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. (No existing symbol changes; only the README registry row is a consumer.)
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. (Parser invariant here: parse `check-completion.sh` JSON from `err.stdout` on exit 1; adversarial cases are exit 1 valid JSON, exit 2, missing folder, non-JSON stdout.)
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. (Axes: packet state x runtime; see plan.md affected-surfaces.)
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. (Core reads `cwd`/`projectDir` only; assert a bad `projectDir` degrades fail-open.)
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets (read-only tool logs nothing)
- [ ] CHK-031 [P0] Input validation implemented (folder resolution rejects unresolvable paths into an `unavailable` section)
- [ ] CHK-032 [P1] Auth/authz working correctly - N/A (read-only local tool, no auth surface)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments adequate (WHY of the exit-1 catch and default-export rule captured)
- [ ] CHK-042 [P2] `plugins/README.md` section 3 row added for `mk-speckit-completion.js`
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
- [ ] CHK-101 [P1] All ADRs have status (Proposed/Accepted)
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale
- [ ] CHK-103 [P2] Migration path documented (if applicable) - N/A (additive, no migration)
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Response time bounded by the 5000ms `execFileSync` timeout (NFR-P01)
- [ ] CHK-111 [P1] No daemon or MCP cold-start on any tool call
- [ ] CHK-112 [P2] Load testing completed - N/A (read-only tool, no load profile)
- [ ] CHK-113 [P2] Performance benchmarks documented - N/A (bounded by the two scripts' budget)
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure documented (delete the plugin file; auto-loader stops picking it up)
- [ ] CHK-121 [P0] Feature flag configured - N/A (additive read-only tool; removal is the off switch)
- [ ] CHK-122 [P1] Monitoring/alerting configured - N/A (no runtime service to monitor)
- [ ] CHK-123 [P1] Runbook created - N/A (single-file plugin; rollback is a delete)
- [ ] CHK-124 [P2] Deployment runbook reviewed - N/A (no deployment step)
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] Security review completed (read-only, logs nothing, no secrets)
- [ ] CHK-131 [P1] Dependency licenses compatible (no new dependency added)
- [ ] CHK-132 [P2] OWASP Top 10 checklist completed - N/A (no network or auth surface)
- [ ] CHK-133 [P2] Data handling compliant with requirements (reads spec folders only; writes nothing)
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All spec documents synchronized
- [ ] CHK-141 [P1] API documentation complete (tool description, args `specFolder`/`strict`, payload shape)
- [ ] CHK-142 [P2] User-facing documentation updated (`plugins/README.md` row)
- [ ] CHK-143 [P2] Knowledge transfer documented (exemplar citations recorded in plan.md and decision-record.md)
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Michel Kerkmeester (operator) | Technical Lead | [ ] Approved | |
| Michel Kerkmeester (operator) | Product Owner | [ ] Approved | |
| Independent review agent | QA Lead | [ ] Approved | |
<!-- /ANCHOR:sign-off -->

---

<!--
Level 3 checklist - Full verification + architecture
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
</content>
