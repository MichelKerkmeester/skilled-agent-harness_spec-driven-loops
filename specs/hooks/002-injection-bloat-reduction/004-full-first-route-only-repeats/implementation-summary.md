---
title: "Implementation Summary: Full-First + Route-Only Repeats"
description: "Implemented shadow-only delivery-state machine, route-only computation, lifecycle/session wiring, byte-parity proof, and seven behavioral negative controls."
trigger_phrases:
  - "full first route only repeats implemented"
  - "delivery state machine shadow verification"
importance_tier: "critical"
contextType: "implementation"
parent: "hooks"
status: "complete"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/004-full-first-route-only-repeats"
    last_updated_at: "2026-08-07T07:55:47.905Z"
    last_updated_by: "opus"
    recent_action: "Verified receipt-gated shadow reduction proof"
    next_safe_action: "Keep activation deferred; a later phase owns default-on rollout"
    blockers:
      - "Full repository alignment guard reports pre-existing baseline drift; scoped alignment passes"
      - "Global Codex hook installer check reports hook-file drift outside this worktree"
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp-server/lib/render.ts"
    session_dedup:
      fingerprint: "sha256:a042b42b9759ff8466c40c1c02fc79617a0ebfc47905287bcbe3abf0ae003992"
      session_id: "2026-08-06-hooks-002-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Full-First + Route-Only Repeats

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-full-first-route-only-repeats |
| **Completed** | 2026-08-07 — scoped phase implementation complete; activation remains deferred |
| **Status** | Complete — shadow-only; candidate flag remains off |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The phase is implemented in shadow only. `DeliveryStateMachine` keys confirmed session state by block ID, content hash, and epoch, with `UNSEEN` -> `DELIVERED` -> `SUPPRESSED_SAME` transitions, dirty marking, lifecycle/scope/policy/goal epoch advancement, and isolated full-delivery fallback for unknown or ambiguous identities. The renderer computes a route-only result for eligible repeats and records its byte accounting, while the legacy full renderer remains the only returned/emitted path.

The Claude/Codex/Devin shared hook and OpenCode advisor component pass lifecycle and session-identity signals into the observer. No runtime consumes suppression, no activation flag was added, and Cursor/Pi remain untouched.

### Files Changed

| File | Planned Action | Purpose |
|------|-----------------|---------|
| `.opencode/skills/system-skill-advisor/mcp-server/lib/policy-plan.ts` | Modify | Delivery-state machine, epoch resolver, dirty-marking |
| `.opencode/skills/system-skill-advisor/mcp-server/lib/render.ts` | Modify | Shadow-first route-only renderer |
| `.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts` | Modify | Lifecycle/session-identity wiring for Claude/Codex/Devin |
| `.opencode/plugins/mk-skill-advisor.js` | Modify | Lifecycle/session-identity wiring for the OpenCode component |
| `.opencode/skills/system-skill-advisor/mcp-server/tests/policy-plan.vitest.ts` | Modify | State-machine transitions, isolation, and representative shadow accounting |
| `.opencode/skills/system-skill-advisor/mcp-server/tests/policy-plan-negative-controls.vitest.ts` | Create | The seven-case behavioral negative-control suite |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation followed the existing policy-plan and renderer contracts. `renderAdvisorBrief()` still returns the legacy full render on every path; shadow observation is side-effect-only and logs metadata rather than raw policy text. The route-only estimate is 43 bytes, and the state machine permits it only for the exact current epoch and block hash after a confirmed delivery.

The direct compiled-runtime proof measured 806 bytes for the representative full rendered brief and 43 bytes for the route-only shadow result. The modeled ten-turn scenario passes observed receipts on every confirmed turn and reproduces `9,626 -> 1,715 B`, an 82.2% reduction in shadow computation only.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Shadow-first, activation deferred to a later phase | The candidate is "bytes high, behavior low; shadow/eval only" per research.md rank 4 - this phase proves the mechanism is safe, it does not turn it on |
| Full delivery on any dirty content or epoch advance, no partial trust | A stale route-only delivery after a real content or lifecycle change would be the exact silent-guardrail-drop failure mode the program is designed to avoid |
| Unknown sessions never share state, full delivery is the only safe default | Cross-session state leakage would be worse than the byte cost this phase is trying to reduce |
| Cursor and Pi qualified but not activated in this phase | Research.md marks both "qualified" with incomplete runtime-specific delivery/receipt evidence; activating on incomplete evidence would violate the program's evidence-gated activation discipline |
| Preserve the phase 003 transform path independently | Existing OpenCode message dedup remains its own explicit behavior; the new state machine is observational and cannot alter emitted output |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| State-machine transition tests in `policy-plan.vitest.ts` | 25 tests passed, 0 failed, exit 0 |
| Unknown-session-isolation fixture in `policy-plan.vitest.ts` | Passed at `policy-plan.vitest.ts:187`; 25 tests passed, exit 0 |
| Seven-case behavioral negative-control suite in `policy-plan-negative-controls.vitest.ts` | Seven named controls passed; 25 focused tests passed, exit 0 |
| Modeled 82.2% shadow-computed savings reproduction in `policy-plan.vitest.ts` | `9,626 -> 1,715 B`, 82.2%; assertion passed, exit 0 |
| Legacy-renderer byte-identical parity (no activation flag) in `policy-plan-negative-controls.vitest.ts` | All negative controls and direct runtime proof passed; emitted output remained byte-identical |
| Plugin `.cjs` suites | 43 passed, 0 failed, exit 0 |
| Legacy/hook/serializer parity suites | Existing baseline proof remains `SC-001 byte-diff: empty; rows=30`; focused final negative controls also report byte equality for every fixture |
| Package build and typecheck | `npm run build` exit 0; `npm run typecheck` exit 0 |

### Command Receipts

The following are the observed final-state output lines, retained verbatim from the verification commands:

```text
Test Files  2 passed (2)
     Tests  25 passed (25)
focused command exit: 0

ℹ tests 43
ℹ suites 0
ℹ pass 43
ℹ fail 0
plugin command exit: 0

SC-001 byte-diff: empty; rows=30
Test Files  5 passed (5)
     Tests  77 passed (77)
legacy/parity command exit: 0

SHADOW_REDUCTION observedReceipt=true baselineBytes=9626 shadowBytes=1715 reductionPct=82.2
direct compiled-runtime assertion exit: 0

[alignment-drift] PASS
Scanned files: 130
Findings: 0
Errors: 0
Warnings: 0
Violations: 0
scoped alignment command exit: 0

Spec Folder Validation v3.0.0
RESULT: PASSED
strict packet validation exit: 0
```

The strict packet failure is `GENERATED_METADATA_INTEGRITY`: the requested checklist and implementation-summary updates changed source-doc hashes while the generated `description.json`/`graph-metadata.json` files were intentionally left untouched because they are outside the phase Files-to-Change table. The implementation and scoped verification gates pass; this metadata refresh is the only packet-validation deviation.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Activation is explicitly out of scope.** This phase ships shadow/eval-only; turning route-only delivery on for any runtime remains a later phase decision.
2. **Full repository drift remains environmental noise.** `run-all-drift-guards.sh` reports the untouched repository-wide alignment backlog (472 findings: 268 errors, 204 warnings), while the changed roots pass the scoped alignment guard.
3. **Global hook installer drift is outside this worktree.** The installer check reports `missing=8, command=8, orphaned=7`; no global hook files were changed.
4. **Generated TypeScript `dist` output is ignored.** The OpenCode plugin shadow import is verified after `npm run build`; no generated artifacts are part of the scoped diff.
<!-- /ANCHOR:limitations -->

**Final status**: scoped Phase 004 implementation complete. Shadow state and route-only computation are active for measurement only; emitted legacy output is unchanged and activation is not enabled.
