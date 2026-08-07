---
title: "Implementation Summary: Pi Dispatch and Compaction"
description: "Implemented and verified a shadow-only compact Pi dispatch candidate with an independent prototype flag, full-directive fail-open behavior, and compaction/session-boundary dedup reset."
trigger_phrases:
  - "pi dispatch directive implementation summary"
  - "compact pi arbitration shadow prototype"
  - "pi dispatch compaction reset verification"
importance_tier: "important"
contextType: "implementation"
parent: "hooks"
status: "complete"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/006-pi-dispatch-and-compaction"
    last_updated_at: "2026-08-07T04:31:31Z"
    last_updated_by: "codex"
    recent_action: "Verified Pi shadow controls"
    next_safe_action: "Keep the prototype disabled until the activation phase reviews the executed candidate"
    blockers:
      - "Prototype activation remains deferred; the compact candidate is never emitted"
    key_files:
      - ".opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-06-hooks-002-006"
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
| **Spec Folder** | 006-pi-dispatch-and-compaction |
| **Completed** | 2026-08-06 (implementation verified; activation deferred) |
| **Level** | 2 |
| **Status** | Complete — shadow-only; candidate flag remains off |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Implemented the Pi shadow prototype and its verification matrix. The real transform still emits the unchanged full directive on every successful and failed advisor path.

### Pi Dispatch Directive Compaction

`PI_COMPACT_SUBAGENT_DISPATCH_DIRECTIVE` is a 165-byte UTF-8 candidate behind the independent `SPECKIT_PI_COMPACT_DIRECTIVE_PROTOTYPE` flag, disabled by default and never emitted. Its receipt uses the existing policy-plan hash and delivery-state helpers. The full 554-byte `PI_SUBAGENT_DISPATCH_DIRECTIVE` remains the unconditional output, including when the advisor fails. Pi `session_compact` and resume/fork `session_start` events advance the shadow epoch so the next turn observes `UNSEEN` instead of suppressing a repeat.

### Files Changed

| File | Planned Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts` | Modified | Add the independent shadow candidate, executed byte receipt, policy-plan state reuse, fail-open boundary, and lifecycle reset |
| `.opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts` | Modified | Add five named semantic tests, flag/parity checks, fail-open controls, and compaction/resume reset tests |
| `.opencode/specs/hooks/002-injection-bloat-reduction/006-pi-dispatch-and-compaction/checklist.md` | Modified | Record line-pinned verification evidence and the repository-wide drift deviation |
| `.opencode/specs/hooks/002-injection-bloat-reduction/006-pi-dispatch-and-compaction/implementation-summary.md` | Modified | Record implementation, measurements, rollback, and verification status |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The local Pi suite ran with the repository-installed Vitest binary: 1 test file and 43 tests passed, exit 0. A standalone runtime assertion also passed for all five semantic phrases, full-output parity with the flag off and on, advisor failure with both flag states, and compaction reset. The mcp-server typecheck passed, and the targeted alignment scan for both changed directories passed with zero findings.

The required `sk-code` whole drift bundle had one unrelated repository-wide failure: alignment drift reported 472 findings across 18,297 files. Its stack-folder guard passed and its router-sync suite passed 10/10.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Treat this candidate as prototype-only until executed | The research's confidence verdict is explicitly "Low-medium; prototype only," and the eliminated 130-byte reminder already proved a naive shrink loses real semantics |
| Keep the full 554 B directive as the unconditional advisor-failure fallback | The dispatch guard must still emit on Pi failure regardless of the prototype's state; this is a fail-open safety property, not a savings opportunity |
| Require an executed byte measurement before citing any savings figure | The executed candidate is 165 B, which is 12 B below the 177 B ceiling. It is 35 B larger than the 130 B reminder used by the 424 B model, so the hypothetical full-to-candidate size delta is 389 B, not 424 B; no runtime saving is realized while shadow-only |
| Reuse the policy-plan delivery state and epoch helpers | Phase 001/004's `hashPolicyBlock`, `DeliveryStateMachine`, and `advanceDeliveryEpoch` preserve canonical identity, session scoping, and lifecycle reset behavior |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Five-semantics test matrix (`dispatch-preflight-lint.test.ts`) | 5 named tests passed; focused suite 43/43, exit 0 |
| Fail-open negative control (flag on/off, `prompt-advisor.ts`) | Both parameterized cases passed; standalone runtime proof passed, exit 0 |
| Shadow-mode output diff vs. 554 B baseline | Full emitted suffix is byte-identical at 554 B with flag off and on; standalone proof passed, exit 0 |
| Executed byte count vs. 177 B ceiling | Compact candidate measured at 165 B UTF-8; 12 B below ceiling; no realized saving claimed |
| Compaction and resume reset | Without an observed host receipt, both compaction and resume/fork paths remain `UNSEEN` and emit the full directive; focused suite passed |
| Typecheck and targeted alignment | mcp-server `npm run typecheck` exit 0; targeted alignment scan exit 0 |
| Packet strict validation | Exit 2 only for stale generated `graph-metadata.json` source fingerprint; authored validation checks passed; generated file intentionally untouched |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Shadow-only.** The compact candidate is measured and receipt-tracked but never selected for emission. Activation remains a later phase decision.
2. **No realized saving.** The 165 B count is an executed candidate size, not a production reduction. The production directive remains 554 B.
3. **Adjacent test path.** The existing Pi advisor coverage lives in `dispatch-preflight-lint.test.ts`; no separate `prompt-advisor.test.ts` file was present, so that adjacent file was extended.
4. **Scope-limited documentation.** The phase status and continuity metadata are reconciled; `plan.md` and `tasks.md` remain unchanged because the implementation scope did not require rewriting their authored plan.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:rollback -->
## Rollback

Unset `SPECKIT_PI_COMPACT_DIRECTIVE_PROTOTYPE` (the default state), or remove its `1`/`true`/`yes` value. The shadow state is cleared when disabled, and the full 554-byte directive remains the emitted fallback. No activation path was added.
<!-- /ANCHOR:rollback -->
