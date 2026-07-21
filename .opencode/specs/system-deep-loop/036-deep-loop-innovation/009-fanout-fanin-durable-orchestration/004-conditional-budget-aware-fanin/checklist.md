---
title: "Checklist: Conditional Budget-Aware Fan-in"
description: "Blocking verifier contract for conditional fan-in sufficiency, typed budget floors, cancellation and salvage, replay determinism, and immutable reduction inputs."
trigger_phrases:
  - "conditional budget-aware fan-in checklist"
  - "dynamic fan-in verifier"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/009-fanout-fanin-durable-orchestration/004-conditional-budget-aware-fanin"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/009-fanout-fanin-durable-orchestration/004-conditional-budget-aware-fanin"
    last_updated_at: "2026-07-21T05:20:03Z"
    last_updated_by: "codex"
    recent_action: "Passed the event-cut, budget, disposition, salvage, replay, and reduction verifier matrix"
    next_safe_action: "Keep the conditional path dark pending explicit authority cutover"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/conditional-fanin/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/conditional-fanin.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Checklist: Conditional Budget-Aware Fan-in

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for conditional budget-aware fan-in. Each implementation run pins
the candidate identity as the base SHA plus the path-scoped uncommitted delta, policy/schema digests, typed-budget contract version, replay fingerprint, and legacy
\`fanout-run.cjs\` baseline. The verifier records commands, exit codes, event counts, included-result IDs, outstanding
dispositions, and reducer-input digests. Zero-case fixture discovery, untyped budget aliases, mutable decisions, missing
spend settlement, or late-result input drift fail the phase.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The typed budget, result-envelope, branch/attempt, lease/wave, partial-failure, and reduction interfaces are pinned by version and digest [EVIDENCE: implementation-summary.md; conditional-fanin.vitest.ts]
- [x] CHK-002 [P0] Current wait-for-all, per-lineage cap, aggregate cap, pool summary, cancellation, and salvage behavior is captured from \`fanout-run.cjs\` [EVIDENCE: implementation-summary.md; conditional-fanin.vitest.ts]
- [x] CHK-003 [P1] The fan-in policy declares minimum count, agreement, provenance diversity, budget-floor request, cancellation, salvage, and value-signal version [EVIDENCE: implementation-summary.md; conditional-fanin.vitest.ts]
- [x] CHK-004 [P2] Candidate SHA, baseline SHA, policy digest, and replay-fixture digest are recorded in the verifier report [EVIDENCE: implementation-summary.md; conditional-fanin.vitest.ts]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-005 [P0] Decision evaluation is a deterministic ledger fold at an explicit event-sequence cut with no mutable wall-clock or executor-state reads [EVIDENCE: implementation-summary.md; conditional-fanin.vitest.ts]
- [x] CHK-006 [P0] Finalization passes the transition-authorization gateway and freezes included/excluded IDs, all triggers, primary trigger, and reducer digest atomically [EVIDENCE: implementation-summary.md; conditional-fanin.vitest.ts]
- [x] CHK-007 [P1] Cancellation, reservation release, settlement, salvage, and supersession operations are idempotent by stable decision/branch/dispatch/attempt IDs [EVIDENCE: implementation-summary.md; conditional-fanin.vitest.ts]
- [x] CHK-008 [P1] The implementation stays scoped to conditional fan-in; partial-failure and reduction algorithms remain behind their owned interfaces [EVIDENCE: implementation-summary.md; conditional-fanin.vitest.ts]
- [x] CHK-009 [P2] Durable comments explain invariants without packet, phase, requirement, task, or finding labels [EVIDENCE: implementation-summary.md; conditional-fanin.vitest.ts]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-010 [P0] Sufficiency stops before all N leaves only after minimum count, support threshold, and provenance-diversity floor pass [EVIDENCE: implementation-summary.md; conditional-fanin.vitest.ts]
- [x] CHK-011 [P0] Correlated duplicate results cannot inflate quorum; contradictory or provenance-deficient sets remain insufficient [EVIDENCE: implementation-summary.md; conditional-fanin.vitest.ts]
- [x] CHK-012 [P0] Program, mode, lineage, and iteration ancestor denials are exercised for token, monetary, attempt, and monotonic wall-time dimensions [EVIDENCE: implementation-summary.md; conditional-fanin.vitest.ts]
- [x] CHK-013 [P0] Budget exhaustion, stale pricing, missing accounting, reconciliation gaps, and reservation conflicts never classify as convergence or success [EVIDENCE: implementation-summary.md; conditional-fanin.vitest.ts]
- [x] CHK-014 [P0] Simultaneous sufficiency and budget-floor evidence records both triggers and deterministically classifies budget floor as primary [EVIDENCE: implementation-summary.md; conditional-fanin.vitest.ts]
- [x] CHK-015 [P0] Queued leaves never dispatch after finalization; reserved-not-started leaves release only proven-unused capacity [EVIDENCE: implementation-summary.md; conditional-fanin.vitest.ts]
- [x] CHK-016 [P0] Cancel/complete races retain actual spend and terminal evidence; one cancel acknowledgement cannot erase a racing result [EVIDENCE: implementation-summary.md; conditional-fanin.vitest.ts]
- [x] CHK-017 [P0] Non-cancellable leaves detach from authoritative fan-in, settle receipts, and persist terminal envelopes into salvage [EVIDENCE: implementation-summary.md; conditional-fanin.vitest.ts]
- [x] CHK-018 [P0] A late result after the decision cut cannot change included IDs, primary status, result order, or reducer-input digest [EVIDENCE: implementation-summary.md; conditional-fanin.vitest.ts]
- [x] CHK-019 [P0] Reduction rejects any result set whose decision ID, ordered membership, content, or digest differs from the finalized handoff [EVIDENCE: implementation-summary.md; conditional-fanin.vitest.ts]
- [x] CHK-020 [P0] Replay under reordered delivery but identical ledger order reconstructs the same decision, dispositions, and reduction handoff [EVIDENCE: implementation-summary.md; conditional-fanin.vitest.ts]
- [x] CHK-021 [P0] Missing policy, budget, lease, ledger, authorization, or replay state fails closed before new dispatch or reduction [EVIDENCE: implementation-summary.md; conditional-fanin.vitest.ts]
- [x] CHK-022 [P1] Strict, quorum, deadline, and progressive partial-failure eligibility variants use the same decision schema and stop taxonomy [EVIDENCE: implementation-summary.md; conditional-fanin.vitest.ts]
- [x] CHK-023 [P1] The no-signal and versioned value-of-computation stub paths cannot bypass typed budget admission or mutate finalized evidence [EVIDENCE: implementation-summary.md; conditional-fanin.vitest.ts]
- [x] CHK-024 [P0] Shadow mode emits comparison evidence while the current wait-for-all result remains authoritative [EVIDENCE: implementation-summary.md; conditional-fanin.vitest.ts]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-025 [P1] Every requirement maps to a named fixture and every fan-in decision field is asserted in replay or race coverage [EVIDENCE: implementation-summary.md; conditional-fanin.vitest.ts]
- [x] CHK-026 [P1] The implementation cites and conforms to the phase-007 typed-budget spec, current \`fanout-run.cjs\`, and \`manifest/phase-tree.json\` [EVIDENCE: implementation-summary.md; conditional-fanin.vitest.ts]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-027 [P0] Cancellation cannot target a reused branch/attempt without the current lease fence and decision identity [EVIDENCE: implementation-summary.md; conditional-fanin.vitest.ts]
- [x] CHK-028 [P1] Budget, policy, result, and reducer digests are validated before authority-changing transitions [EVIDENCE: implementation-summary.md; conditional-fanin.vitest.ts]
- [x] CHK-029 [P2] No sandbox, permission, executor allowlist, or credential propagation behavior changes outside the fan-in control contract [EVIDENCE: implementation-summary.md; conditional-fanin.vitest.ts]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-030 [P1] Event schema, policy fields, stop taxonomy, simultaneous-trigger precedence, and outstanding-leaf dispositions match the packet docs [EVIDENCE: implementation-summary.md; conditional-fanin.vitest.ts]
- [x] CHK-031 [P2] The parent phase map and implementation summary are updated when implementation evidence exists [EVIDENCE: implementation-summary.md; conditional-fanin.vitest.ts]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-032 [P1] Runtime, tests, fixtures, and packet evidence remain in their owning surfaces with no adjacent cleanup [EVIDENCE: implementation-summary.md; conditional-fanin.vitest.ts]
- [x] CHK-033 [P1] Generated summaries and salvage artifacts stay under the declared orchestration artifact tree [EVIDENCE: implementation-summary.md; conditional-fanin.vitest.ts]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:evidence -->
## Evidence Matrix

| Checks | Evidence |
|--------|----------|
| CHK-001-004 | `types.ts`, `policy.ts`, imported sibling public APIs, implementation summary metadata, base `012652b479dee08455de574574c5e7a8971a8b0b` plus scoped delta |
| CHK-005-009 | `decision-view.ts`, `decision.ts`, `decision-event.ts`, `disposition.ts`; code-label scan returned zero findings |
| CHK-010-014 | Provenance fixtures, 16 program/mode/lineage/iteration by token/cost/attempt/wall-time denial fixtures, and simultaneous-trigger fixtures |
| CHK-015-020 | Proof-backed idempotent cancellation, fenced cancel/detach plans, terminal-event cut race, late-result exclusion, reordered-cut replay, and reducer drift fixtures |
| CHK-021-024 | Fail-closed state-gap, partial-failure policy variants, rank-only extension, typed budget denial, and legacy-authoritative shadow fixtures |
| CHK-025-029 | Closed event/policy digests, exact lease fences, immutable reducer binding, imported substrate authority, and scope/status inspection |
| CHK-030-033 | `plan.md`, `tasks.md`, this checklist, `implementation-summary.md`, and path-scoped git status |
<!-- /ANCHOR:evidence -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 check passes; P1 checks pass or have an operator-approved deferral; every decision
replays to the same trigger set, leaf disposition, included-result order, and reducer digest; all incurred spend is
settled; late results remain salvage-only; shadow mode preserves legacy authority; and the selected
validate/build/test/typecheck gates are green on the pinned candidate SHA.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier binds its report to the candidate SHA, budget/policy/schema digests, and replay
fingerprint, confirms every P0 item with machine-detectable evidence, and observes no unexpected tracked mutation after
the verification run.
<!-- /ANCHOR:sign-off -->
