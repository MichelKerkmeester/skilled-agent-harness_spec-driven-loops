---
title: "Verification Checklist: Pi Dispatch Authorization Boundary Hardening"
description: "Verification gates for Pi self-recursion denial, executor binding, shell-shape honesty, and real tool_call coverage."
trigger_phrases:
  - "Pi dispatch hardening checklist"
  - "dispatch authorization verification"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/038-fable-governor-pi-hook/006-dispatch-authorization-hardening"
    last_updated_at: "2026-08-04T22:26:28Z"
    last_updated_by: "phase006-evidence-refresh"
    recent_action: "Refreshed validator-recognized evidence receipts"
    next_safe_action: "Hand off evidence inventory to Phase 007"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - ".opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts"
    session_dedup:
      fingerprint: "sha256:9197420f2bad817aba0cfba6319aab74ee827261f3e9f7296be6ded0db51a2f2"
      session_id: "2026-08-04-cli-038-006-plan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Pi Dispatch Authorization Boundary Hardening

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete or receive user approval |
| **[P2]** | Optional | Can defer only with a documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Current partial source and pure-helper baseline are recorded without calling them full Pi integration evidence. [TESTED: baseline suites]
  - [EVIDENCE: `implementation-summary.md` records baseline Pi 13/13, shared audit 327/327, Node rules 7/7, and separate registered-factory evidence.]
- [x] CHK-002 [P0] Direct/ambiguous/none inspection and exact executor authorization rules are written in `spec.md` and `plan.md`. [SOURCE: spec.md and plan.md] [TESTED: named inspector matrix]
  - [EVIDENCE: `npx vitest run .opencode/hooks/dispatch/lib/dispatch-audit.test.mjs --reporter=dot` passes 351/351 inspector assertions, exit 0.]
- [x] CHK-003 [P1] Shared matcher consumers and installed Pi event types are inventoried. [SOURCE: consumer inventory and installed types]
  - [EVIDENCE: `implementation-summary.md` records the shared consumer inventory and installed ExtensionAPI event-type review.]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Shared inspection is bounded, deterministic, and never executes shell code. [TESTED: shared suite 351/351]
  - [EVIDENCE: `npx vitest run .opencode/hooks/dispatch/lib/dispatch-audit.test.mjs --reporter=dot` passes 351/351 tests; bounded scanner has no shell execution path.]
- [x] CHK-011 [P0] `cli-pi` is denied before user override or deep-loop handling. [TESTED: Pi factory self-dispatch row]
  - [EVIDENCE: `npx vitest run .opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts --reporter=dot` passes 27/27 tests including unconditional self-deny, exit 0.]
- [x] CHK-012 [P1] Unknown wrappers, variables, aliases, and unsupported syntax cannot become an authorization allow. [TESTED: ambiguous/none matrix]
  - [EVIDENCE: `npx vitest run .opencode/hooks/dispatch/lib/dispatch-audit.test.mjs --reporter=dot` passes 351/351 ambiguous and none matrix assertions, exit 0.]
- [x] CHK-013 [P1] Source comments explain durable behavior only and contain no ephemeral identifiers or spec paths. [TESTED: scoped marker scan]
  - [EVIDENCE: `git diff --check` exit 0 and the scoped forbidden-marker scan found no ephemeral identifiers or paths.]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Pure tests cover direct self-dispatch, executor mismatch, and matching override. [TESTED: pure matrix within combined Pi suite]
  - [EVIDENCE: `npx vitest run .opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts --reporter=dot` passes the combined 27/27 suite, whose pure matrix contains the self-dispatch, mismatch, and matching-override rows, exit 0.]
- [x] CHK-021 [P0] Factory-level Pi `tool_call` tests observe actual block/allow results. [TESTED: named registered ExtensionAPI callbacks]
  - [EVIDENCE: `npx vitest run .opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts --reporter=dot` passes the combined 27/27 suite; the registered-factory rows invoke recorded `input` and `tool_call` callbacks and assert block/allow results, not 27 factory-only tests.]
- [x] CHK-022 [P1] Matrix covers prose/quoted false positives, separators, variables, aliases, wrappers, negation, and injected advisor/directive text. [TESTED: shared 351/351; Pi combined 27/27]
  - [EVIDENCE: shared suite passes 351/351 and the combined Pi helper/factory suite passes 27/27 tests, both focused commands exit 0.]
- [x] CHK-023 [P1] Reverse extension registration order and session mismatch cases are executed. [TESTED: reverse-order/session matrix]
  - [EVIDENCE: `npx vitest run .opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts --reporter=dot` passes reverse-order and session-mismatch rows within the combined 27/27 suite, exit 0.]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Self-recursion is an unconditional policy boundary, not a user override exception. [TESTED: factory self-dispatch row]
  - [EVIDENCE: `npx vitest run .opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts --reporter=dot` passes the unconditional self-dispatch row within 27/27 tests, exit 0.]
- [x] CHK-FIX-002 [P0] Matched and authorized executors are compared from one inspected command result. [TESTED: exact executor mismatch rows]
  - [EVIDENCE: `npx vitest run .opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts --reporter=dot` passes exact executor mismatch rows within 27/27 tests, exit 0.]
- [x] CHK-FIX-003 [P0] Shared matcher producers and all consumers are inventoried before changing recognition behavior. [SOURCE: implementation-summary.md] [TESTED: inventory and final focused baseline]
  - [EVIDENCE: `implementation-summary.md` records the shared producer/consumer inventory and final focused results: combined Pi 27/27, shared 351/351, Node 7/7.]
- [x] CHK-FIX-004 [P0] Parser/security rows include delimiter, quoted text, joined input, opaque indirection, no-op, and fallback cases. [TESTED: shared inspector matrix]
  - [EVIDENCE: `npx vitest run .opencode/hooks/dispatch/lib/dispatch-audit.test.mjs --reporter=dot` passes 351/351 parser and security assertions, exit 0.]
- [x] CHK-FIX-005 [P1] Pure helper evidence and actual Pi `tool_call` evidence have separate categories and counts. [SOURCE: implementation-summary.md] [TESTED: evidence-class receipts]
  - [EVIDENCE: `implementation-summary.md` reports shared-core 351/351 separately from the pure matrix and named registered-factory callbacks in the combined Pi 27/27 suite, plus live-smoke evidence.]
- [x] CHK-FIX-006 [P1] Injected transformed input and extension registration order are tested. [TESTED: reverse-order and advisor-first factory rows]
  - [EVIDENCE: `npx vitest run .opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts --reporter=dot` passes injected-input and registration-order rows within the combined 27/27 suite, exit 0.]
- [x] CHK-FIX-007 [P1] Evidence is tied to the final scoped diff and exact command output. [TESTED: final diff/check/mirror receipts]
  - [EVIDENCE: `git diff --check` exit 0; scoped marker scan, mirror readlink checks, and focused command receipts are recorded in implementation-summary.md.]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No shell execution, alias sourcing, or variable expansion is introduced into authorization. [TESTED: source inspection and shared suite]
  - [EVIDENCE: `npx vitest run .opencode/hooks/dispatch/lib/dispatch-audit.test.mjs --reporter=dot` passes 351/351 pure scanner tests, exit 0; implementation-summary.md records no shell execution path.]
- [x] CHK-031 [P0] Missing raw-user capture cannot grant an external dispatch. [TESTED: session mismatch factory row]
  - [EVIDENCE: `npx vitest run .opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts --reporter=dot` passes session-mismatch denial within 27/27 tests, exit 0.]
- [x] CHK-032 [P1] Negated, quoted, variable, alias, and advisor-generated `cli-*` mentions do not authorize a mismatched dispatch. [TESTED: authorization matrix]
  - [EVIDENCE: `npx vitest run .opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts --reporter=dot` passes injected and conservative authorization rows within the combined 27/27 suite, exit 0.]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks, and implementation summary describe the same inspection boundary. [SOURCE: implementation-summary.md]
  - [EVIDENCE: `implementation-summary.md` records the bounded direct/ambiguous/none contract and the residual ownership boundaries.]
- [x] CHK-041 [P1] Verification commands report pure, factory, shared-core, and runtime-smoke evidence separately. [SOURCE: implementation-summary.md]
  - [EVIDENCE: `implementation-summary.md` lists exact focused commands with shared-core 351/351, combined Pi helper/factory 27/27, Node 7/7, and live smoke exit 0.]
- [x] CHK-042 [P2] Phase 007 receives exact result counts, exit codes, and any baseline deferral.
  - [EVIDENCE: `implementation-summary.md` handoff inventory records four evidence classes, exact counts, exit codes, and the drift baseline.]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temporary fixtures and command probes are confined to the phase scratch area. [TESTED: scoped status/diff sweep]
  - [EVIDENCE: `git diff --check` exit 0 and the scoped status/diff sweep found no repository fixture or probe outside the scoped source/tests.]
- [x] CHK-051 [P1] Scratch fixtures are removed or durable evidence is copied into the implementation summary before completion. [TESTED: no-stray-files sweep]
  - [EVIDENCE: `implementation-summary.md` contains durable receipts and the final no-stray-files sweep found no task-created scratch residue.]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-08-04; implementation evidence is complete. Packet status reconciliation remains with Phase 008.
<!-- /ANCHOR:summary -->
