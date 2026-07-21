---
title: "Implementation Summary: partial-failure policy"
description: "Delivered a replayable partial-failure evaluator with exact quorum arithmetic, run-fatal overrides, degraded handoff evidence, and additive-dark legacy comparison."
trigger_phrases:
  - "partial-failure policy implementation"
  - "durable fan-in verdict evidence"
  - "degraded fanout result implementation"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/009-fanout-fanin-durable-orchestration/005-partial-failure-policy"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/009-fanout-fanin-durable-orchestration/005-partial-failure-policy"
    last_updated_at: "2026-07-21T08:02:00Z"
    last_updated_by: "codex"
    recent_action: "Completed the additive-dark partial-failure policy leaf"
    next_safe_action: "Keep legacy authority until the compatibility phase authorizes activation"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/partial-failure-policy/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/partial-failure-policy.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "partial-failure-policy-implementation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-partial-failure-policy |
| **Completed** | 2026-07-21 |
| **Level** | 2 |
| **Status** | Complete, additive-dark |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Durable fan-in can now classify terminal leaf failures, apply exact versioned tolerance policy, and replay one
immutable verdict from canonical evidence. Sufficient partial evidence is explicitly degraded, fatal integrity defects
always abort, and failed leaves never enter reduction input.

### Deterministic policy core

The module freezes child 004's declared await set and canonical dispatch receipts into a hashed admitted denominator.
One evaluator implements strict, quorum, deadline, and progressive behavior. It counts terminal successes and failures
by logical branch, keeps retry attempts diagnostic, and converts unresolved admitted branches into terminal deadline
failures when the deadline boundary closes.

### Authorized evidence and replay

Closed schemas cover terminal failures, policy evaluations, degraded markers, abort markers, late-result exclusions,
and dark comparisons. Deterministic event identities make authorized appends idempotent. Replay preserves the first
final receipt for a decision epoch and reports attempts to conflict with that closed state.

### Additive-dark compatibility

The shadow adapter returns the exact legacy outcome object as authoritative while recording the typed verdict beside
legacy `ok|partial` and exit `0|2|3`. A typed abort versus legacy `partial` exit `2` is retained as a known-defect
difference, not silently normalized and not promoted to runtime authority.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-deep-loop/runtime/lib/partial-failure-policy/` | Created | Typed taxonomy, immutable denominator, evaluator, events, replay, reduction handoff, and dark projection |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/partial-failure-policy.vitest.ts` | Created | Threshold, taxonomy, retry, deadline, integrity, degraded, dark, and restart/late-result verification |
| This leaf's canonical docs | Updated | Completion state, evidence checklist, and delivery record |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation is additive. No legacy script or status/exit path changed, and the new shadow return type labels
legacy output as the sole authority. The focused suite runs from the system-spec-kit MCP server, while the existing
fanout run and pool suites verify the unchanged compatibility surface.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Count admitted logical branches, not dispatch attempts | Retries can create multiple canonical receipts, but tolerance applies once per logical leaf |
| Use integer `ceil` and `floor` gates | Integer arithmetic proves exact two-thirds boundaries without floating-point ambiguity |
| Model `not_applicable` as applicability, not a fifth verdict | The state machine retains exactly four verdicts while keeping declared empty ticks explicit |
| Convert malformed evidence into typed integrity failures | Invalid input must produce a durable unconditional abort rather than escape policy evaluation |
| Freeze the first final receipt during replay | Late and duplicate evidence stays observable without rewriting a closed decision epoch |
| Keep the compatibility adapter legacy-authoritative | Dark rollout can compare semantics without changing shipped fan-out status or exit behavior |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Focused partial-failure suite | PASS, 39 tests |
| Existing fanout-run and fanout-pool suites | PASS, 99 tests |
| TypeScript no-emit check with package-pinned compiler | PASS, exit 0 |
| Strict packet validation | PASS, exit 0 (Errors 0, Warnings 0) |
| Comment hygiene and diff whitespace | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Dark authority only.** `fanout-run.cjs` remains authoritative by design. Activating typed verdict authority belongs
   to the compatibility phase and requires no change to this leaf's immutable receipt contract.
2. **Ledger storage remains environment-owned.** This module supplies authorized append builders and replay reducers;
   deployment wiring selects the concrete ledger root and transition policy.
<!-- /ANCHOR:limitations -->
