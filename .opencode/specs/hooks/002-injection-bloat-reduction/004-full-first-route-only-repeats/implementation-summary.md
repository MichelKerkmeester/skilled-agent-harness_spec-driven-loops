---
title: "Implementation Summary: Full-First + Route-Only Repeats"
description: "Planned, not yet built. This packet documents the intended delivery-state machine, epoch resolver, and seven behavioral negative controls ahead of implementation."
trigger_phrases:
  - "full first route only repeats not yet built"
  - "delivery state machine placeholder"
importance_tier: "critical"
contextType: "implementation"
parent: "hooks"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/004-full-first-route-only-repeats"
    last_updated_at: "2026-08-06T00:00:00Z"
    last_updated_by: "opus"
    recent_action: "Authored the forward-looking not-yet-built implementation placeholder"
    next_safe_action: "Implement the delivery-state machine per plan.md Phase 2 once phases 001-003 ship"
    blockers:
      - "Blocked on phases 001-003 shipping receipts, bounding, and dedup first"
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp-server/lib/render.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-06-hooks-002-004"
      parent_session_id: null
    completion_pct: 0
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
| **Completed** | Not yet completed - planning only |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. This packet is a planning spec: `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` describe the intended delivery-state machine (`UNSEEN` -> `DELIVERED(hash, epoch)` -> `SUPPRESSED_SAME`), its dirty-marking and epoch-advancement rules, its confirmed-session-identity requirement, the shadow-first route-only renderer, and the seven named behavioral negative controls that must pass before any activation. None of these changes exist on disk yet, and this phase's implementation is explicitly blocked on phases `001-measurement-and-receipts-foundation`, `002-opencode-route-line-bounding`, and `003-opencode-transform-dedup` all shipping first.

### Planned Files (not yet created)

| File | Planned Action | Purpose |
|------|-----------------|---------|
| `.opencode/skills/system-skill-advisor/mcp-server/lib/policy-plan.ts` | Modify | Delivery-state machine, epoch resolver, dirty-marking |
| `.opencode/skills/system-skill-advisor/mcp-server/lib/render.ts` | Modify | Shadow-first route-only renderer |
| `.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts` | Modify | Lifecycle/session-identity wiring for Claude/Codex/Devin |
| `.opencode/plugins/mk-skill-advisor.js` | Modify | Lifecycle/session-identity wiring for the OpenCode component |
| `.opencode/skills/system-skill-advisor/mcp-server/tests/policy-plan-negative-controls.vitest.ts` | Create | The seven-case behavioral negative-control suite |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not applicable yet. `plan.md` section 4 lays out the intended delivery order: (1) confirm phases 001-003 are shipped and green, and reproduce research.md's 10-turn representative scenario as a fixture baseline, (2) implement the state machine, epoch resolver, dirty-marking, session-identity isolation, and the shadow-first route-only renderer, wiring lifecycle signals from both the Claude/Codex/Devin shared path and the OpenCode component, (3) prove state-machine transitions, unknown-session isolation, all seven behavioral negative controls, the modeled 82.2% shadow-computed savings, and legacy-renderer byte-identical parity with no activation flag set. Activation itself is explicitly out of scope for this phase and belongs to phase `007-guardrail-controls-and-activation`. When implementation lands, this section will be rewritten to describe what was actually delivered, replacing this forward-looking description.
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
| Hard-block this phase's implementation start on phases 001-003 | The state machine has no content hash, no compiled-route identity, and no stable OpenCode message identity to key correctly without them |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| State-machine transition tests in `policy-plan.vitest.ts` | Not yet run |
| Unknown-session-isolation fixture in `policy-plan.vitest.ts` | Not yet run |
| Seven-case behavioral negative-control suite in `policy-plan-negative-controls.vitest.ts` | Not yet run |
| Modeled 82.2% shadow-computed savings reproduction in `policy-plan.vitest.ts` | Not yet run |
| Legacy-renderer byte-identical parity (no activation flag) in `policy-plan.vitest.ts` | Not yet run |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **This is a planning artifact, not a shipped fix.** No code exists yet; every row above is a planned action, not a completed one.
2. **This phase is hard-blocked on phases 001, 002, and 003.** Implementation cannot begin until all three predecessors ship and are green.
3. **Activation is explicitly out of scope.** This phase ships shadow/eval-only; turning route-only delivery on for any runtime is phase `007-guardrail-controls-and-activation`'s decision, gated on this phase's negative-control evidence.
4. **The exact delivery form (consolidated capsule vs. per-directive IDs) is not decided.** `spec.md` §7 leaves this open, matching the parent program's unresolved Open Question 2.
<!-- /ANCHOR:limitations -->
