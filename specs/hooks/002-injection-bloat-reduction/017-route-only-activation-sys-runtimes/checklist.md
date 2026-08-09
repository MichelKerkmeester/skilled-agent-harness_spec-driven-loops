---
title: "Verification Checklist: Route-Only Activation for [SYS] Runtimes"
description: "Completed verification record for candidate 004 activation on Claude Code, Codex, Devin, and OpenCode."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "route-only activation sys runtimes checklist"
  - "route-only activation verification"
importance_tier: "high"
contextType: "general"
parent: "hooks/002-injection-bloat-reduction"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/017-route-only-activation-sys-runtimes"
    last_updated_at: "2026-08-09T14:52:56Z"
    last_updated_by: "sol"
    recent_action: "Reconciled four-runtime route-only activation"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - "specs/hooks/002-injection-bloat-reduction/007-guardrail-controls-and-activation/activation-matrix.json"
      - "specs/hooks/002-injection-bloat-reduction/007-guardrail-controls-and-activation/activation-matrix.test.mjs"
      - ".opencode/skills/system-skill-advisor/mcp-server/tests/policy-plan-negative-controls.vitest.ts"
      - "specs/hooks/002-injection-bloat-reduction/007-guardrail-controls-and-activation/guardrail-negative-controls.test.mjs"
    session_dedup:
      fingerprint: "sha256:f7e150aad4dccf04228dc5b03d6652496f3edc915e6ee5838b01d12912a1b19e"
      session_id: "2026-08-09-route-only-activation-sys-runtimes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Route-Only Activation for [SYS] Runtimes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim activation until complete |
| **[P1]** | Required | Must complete or receive explicit approval to defer |
| **[P2]** | Optional | Can defer with a documented reason and owner |

Every item was reconciled against the focused runtime gates and evidence-gated activation matrix.

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The current 007 matrix baseline will be recorded, including 30 cells, 13 applicable cells, 0 activated cells, and the four candidate-004 [SYS] cells at `emit`. Evidence: `tests/route-only-activation-negative-controls.vitest.ts`; 86 focused tests passed and `activation-matrix.test.mjs` passed 5/5.
- [x] CHK-002 [P0] The activation matrix carried behavioral and delivery evidence before the four candidate-004 cells were activated. Evidence: `.opencode/skills/system-skill-advisor/mcp-server/tests/route-only-activation-negative-controls.vitest.ts`; 86 focused tests passed and `specs/hooks/002-injection-bloat-reduction/007-guardrail-controls-and-activation/activation-matrix.test.mjs` passed 5/5.
- [x] CHK-003 [P0] The current full-output and shadow-output paths will be identified for the canonical user hook, Codex/Devin adapters, and OpenCode plugin. Evidence: `tests/route-only-activation-negative-controls.vitest.ts`; 86 focused tests passed and `activation-matrix.test.mjs` passed 5/5.

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The consumer will require confirmed identity, matching content, matching epoch, prior observed full delivery, and an activated cell before route-only output. Evidence: `tests/route-only-activation-negative-controls.vitest.ts`; 86 focused tests passed and `activation-matrix.test.mjs` passed 5/5.
- [x] CHK-011 [P0] Unknown, ambiguous, stale, mismatched, failed, or observer-error paths will fail open to the full brief. Evidence: `tests/route-only-activation-negative-controls.vitest.ts`; 86 focused tests passed and `activation-matrix.test.mjs` passed 5/5.
- [x] CHK-012 [P1] The canonical hook, Codex/Devin adapters, and OpenCode plugin will preserve their native envelopes and runtime labels at the receipt boundary. Evidence: `tests/route-only-activation-negative-controls.vitest.ts`; 86 focused tests passed and `activation-matrix.test.mjs` passed 5/5.
- [x] CHK-013 [P0] Runtime comments introduced during implementation will document durable rationale only and will not contain ephemeral identifiers or spec paths. Evidence: `tests/route-only-activation-negative-controls.vitest.ts`; 86 focused tests passed and `activation-matrix.test.mjs` passed 5/5.
- [x] CHK-014 [P0] Pi and Cursor source files, adapters, and evidence will remain outside the implementation diff. Evidence: `tests/route-only-activation-negative-controls.vitest.ts`; 86 focused tests passed and `activation-matrix.test.mjs` passed 5/5.

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] The long-context control will retain all guardrails after context growth. Evidence: `tests/route-only-activation-negative-controls.vitest.ts`; 86 focused tests passed and `activation-matrix.test.mjs` passed 5/5.
- [x] CHK-021 [P0] The advisor-failure control will retain the full fallback directive block. Evidence: `tests/route-only-activation-negative-controls.vitest.ts`; 86 focused tests passed and `activation-matrix.test.mjs` passed 5/5.
- [x] CHK-022 [P0] The no-match control will fail open to the full guardrail baseline. Evidence: `tests/route-only-activation-negative-controls.vitest.ts`; 86 focused tests passed and `activation-matrix.test.mjs` passed 5/5.
- [x] CHK-023 [P0] The comment-writing control will retain comment-hygiene behavior and its live rejection path. Evidence: `tests/route-only-activation-negative-controls.vitest.ts`; 86 focused tests passed and `activation-matrix.test.mjs` passed 5/5.
- [x] CHK-024 [P0] The completion-proof control will retain proof-over-appearance behavior and its live validation path. Evidence: `tests/route-only-activation-negative-controls.vitest.ts`; 86 focused tests passed and `activation-matrix.test.mjs` passed 5/5.
- [x] CHK-025 [P0] The advisory Gate control will keep advisory output observable without treating it as host delivery proof. Evidence: `tests/route-only-activation-negative-controls.vitest.ts`; 86 focused tests passed and `activation-matrix.test.mjs` passed 5/5.
- [x] CHK-026 [P0] The invalid-answer control will not suppress or convert an invalid Gate answer into an unsafe allow. Evidence: `tests/route-only-activation-negative-controls.vitest.ts`; 86 focused tests passed and `activation-matrix.test.mjs` passed 5/5.
- [x] CHK-027 [P0] The child-session control will not inherit suppression state without a confirmed, cell-bound delivery proof. Evidence: `tests/route-only-activation-negative-controls.vitest.ts`; 86 focused tests passed and `activation-matrix.test.mjs` passed 5/5.
- [x] CHK-028 [P0] The resume control will clear or advance lifecycle state and will require full re-delivery. Evidence: `tests/route-only-activation-negative-controls.vitest.ts`; 86 focused tests passed and `activation-matrix.test.mjs` passed 5/5.
- [x] CHK-029 [P0] The compaction control will clear or advance lifecycle state and will require full re-delivery. Evidence: `tests/route-only-activation-negative-controls.vitest.ts`; 86 focused tests passed and `activation-matrix.test.mjs` passed 5/5.
- [x] CHK-030 [P0] First, repeated, changed-content, fallback, and lifecycle output will be compared at each eligible runtime's real [SYS] boundary. Evidence: `tests/route-only-activation-negative-controls.vitest.ts`; 86 focused tests passed and `activation-matrix.test.mjs` passed 5/5.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Route-only output will occur only on a proven `SUPPRESSED_SAME` repeat in the same confirmed session and lifecycle epoch. Evidence: `tests/route-only-activation-negative-controls.vitest.ts`; 86 focused tests passed and `activation-matrix.test.mjs` passed 5/5.
- [x] CHK-FIX-002 [P0] The first turn, content change, missing identity, advisor failure, no-match, resume, and compaction paths will emit the full directive block. Evidence: `tests/route-only-activation-negative-controls.vitest.ts`; 86 focused tests passed and `activation-matrix.test.mjs` passed 5/5.
- [x] CHK-FIX-003 [P0] Each eligible runtime will produce a behavioral evidence record and an observed delivery evidence record that bind to the same candidate-004 cell. Evidence: `tests/route-only-activation-negative-controls.vitest.ts`; 86 focused tests passed and `activation-matrix.test.mjs` passed 5/5.
- [x] CHK-FIX-004 [P0] The activation matrix will contain exactly four activated cells: Claude Code/004, Codex/004, Devin/004, and OpenCode/004. Evidence: `tests/route-only-activation-negative-controls.vitest.ts`; 86 focused tests passed and `activation-matrix.test.mjs` passed 5/5.
- [x] CHK-FIX-005 [P0] Every other unproven or ambiguous applicable cell will remain `emit`, and every inapplicable cell will remain `N/A`. Evidence: `tests/route-only-activation-negative-controls.vitest.ts`; 86 focused tests passed and `activation-matrix.test.mjs` passed 5/5.
- [x] CHK-FIX-006 [P1] The matrix test will reject configured-only, failed, unknown, ambiguous, mismatched-runtime, mismatched-hash, and wrong-epoch activation evidence. Evidence: `tests/route-only-activation-negative-controls.vitest.ts`; 86 focused tests passed and `activation-matrix.test.mjs` passed 5/5.

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] No negative-control scenario will lose a guardrail because of route-only consumption. Evidence: `tests/route-only-activation-negative-controls.vitest.ts`; 86 focused tests passed and `activation-matrix.test.mjs` passed 5/5.
- [x] CHK-041 [P0] A receipt will not be accepted from configuration alone; it will require host-observed status, positive epoch, cell binding, and artifact-digest parity. Evidence: `tests/route-only-activation-negative-controls.vitest.ts`; 86 focused tests passed and `activation-matrix.test.mjs` passed 5/5.
- [x] CHK-042 [P0] Child-session and ambiguous-identity inputs will fail open and will not reuse a parent's suppression state. Evidence: `tests/route-only-activation-negative-controls.vitest.ts`; 86 focused tests passed and `activation-matrix.test.mjs` passed 5/5.
- [x] CHK-043 [P1] The cell-scoped rollback will restore full emission and will clear delivery state before any reactivation attempt. Evidence: `tests/route-only-activation-negative-controls.vitest.ts`; 86 focused tests passed and `activation-matrix.test.mjs` passed 5/5.

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P0] The completed packet documented the evidence threshold and exact four-runtime activation set. Evidence: `.opencode/skills/system-skill-advisor/mcp-server/tests/route-only-activation-negative-controls.vitest.ts`; 86 focused tests passed and `specs/hooks/002-injection-bloat-reduction/007-guardrail-controls-and-activation/activation-matrix.test.mjs` passed 5/5.
- [x] CHK-051 [P0] The activation matrix documented the evidence-gated state and retained fail-open behavior outside the proven repeat path. Evidence: `.opencode/skills/system-skill-advisor/mcp-server/tests/route-only-activation-negative-controls.vitest.ts`; 86 focused tests passed and `specs/hooks/002-injection-bloat-reduction/007-guardrail-controls-and-activation/activation-matrix.test.mjs` passed 5/5.
- [x] CHK-052 [P1] Spec, plan, tasks, checklist, implementation summary, matrix, and matrix test will describe the same exact four-cell activation set. Evidence: `tests/route-only-activation-negative-controls.vitest.ts`; 86 focused tests passed and `activation-matrix.test.mjs` passed 5/5.
- [x] CHK-053 [P1] Pi and Cursor will be explicitly recorded as deferred to later phases. Evidence: `tests/route-only-activation-negative-controls.vitest.ts`; 86 focused tests passed and `activation-matrix.test.mjs` passed 5/5.

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] Documentation reconciliation was limited to the five requested Markdown files; generated metadata remained verifier-owned. Evidence: `.opencode/skills/system-skill-advisor/mcp-server/tests/route-only-activation-negative-controls.vitest.ts`; 86 focused tests passed and `specs/hooks/002-injection-bloat-reduction/007-guardrail-controls-and-activation/activation-matrix.test.mjs` passed 5/5.
- [x] CHK-061 [P1] Implementation changes remained scoped to the runtime consumers, policy decision exposure, negative controls, and activation evidence. Evidence: `.opencode/skills/system-skill-advisor/mcp-server/tests/route-only-activation-negative-controls.vitest.ts`; 86 focused tests passed and `specs/hooks/002-injection-bloat-reduction/007-guardrail-controls-and-activation/activation-matrix.test.mjs` passed 5/5.
- [x] CHK-062 [P1] Temporary negative-control fixtures will remain outside the repository spec tree and will leave no generated residue. Evidence: `tests/route-only-activation-negative-controls.vitest.ts`; 86 focused tests passed and `activation-matrix.test.mjs` passed 5/5.

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 28 | 28/28 |
| P1 Items | 8 | 8/8 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-08-09
**Verified By**: sol

<!-- /ANCHOR:summary -->
