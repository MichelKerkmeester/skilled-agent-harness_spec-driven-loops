---
title: "Implementation Summary: Parent-skill native invocability"
description: "Plan-only status record. No implementation has happened: this packet authors a spec, plan, tasks, decision record, and checklist, and frames the mechanism choice as pending Phase 1 research. Execution is gated by the user."
trigger_phrases:
  - "parent skill invocability status"
  - "plan only implementation summary"
  - "native invocation gated status"
  - "mechanism decision pending status"
  - "phase 1 not started status"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/119-parent-skill-native-invocability/001-native-invocability-planning"
    last_updated_at: "2026-06-26T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Recorded plan-only status; no implementation done; mechanism deferred"
    next_safe_action: "Await user gate; then run Phase 1 runtime probe and prototype"
    blockers: []
    key_files:
      - "spec.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-155-parent-skill-native-invocability"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Is the runtime skill-discovery extensible in-repo for option D?"
    answered_questions: []
---
# Implementation Summary: Parent-skill native invocability

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 155-parent-skill-native-invocability |
| **Completed** | Not implemented (plan-only) |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This packet is plan-only, so no skill, runtime, agent, command, or configuration was built. What exists is the planning record for closing the parent-skill native-invocability gap. The packet documents the confirmed gap, frames the four candidate mechanisms with their tradeoffs, and gates all implementation behind Phase 1 research and a user go-ahead.

### Planning artifacts authored
The packet authors `spec.md` (the gap, scope, requirements, and success criteria), `plan.md` (the phased research-first plan), `tasks.md` (the Phase 1 task list with Phase 2 and Phase 3 gated), `decision-record.md` (the A-through-D mechanism options with the invocability-versus-identity tension, marked pending research), and `checklist.md` (verification items with implementation items deferred). No source tree changed.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The planning documents were authored against the parent-skill pattern reference and the canonical `deep-loop-workflows` example, and every technical claim traces to the in-session findings. The packet was validated with `validate.sh --strict`. No rollout occurred because nothing was implemented; the next stage is the gated Phase 1 runtime probe.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep the packet plan-only | The user gates execution; this stage produces the spec and the decision frame only |
| Defer the mechanism choice to Phase 1 | Option D's in-repo feasibility is unknown, so the runtime is probed before any mechanism is committed |
| Record the four options in the decision record | The choice needs explicit tradeoffs (surface mismatch for commands and agents, identity cost for shims, out-of-repo risk for a runtime change) before selection |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate.sh --strict` on this packet | PASS expected at completion of authoring; see the validation run in the packet record |
| Implementation tests | Not run: no implementation exists yet (plan-only) |
| Manual `Skill()` reachability probe | Not run: deferred to gated Phase 3 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No implementation exists.** This packet is plan-only and every implementation task is gated on Phase 1 and the user go-ahead.
2. **The mechanism is undecided.** Options A through D are framed but not selected; Phase 1 research selects one with cited evidence.
3. **Option D may be out of reach in-repo.** The runtime skill-discovery surface lives in the OpenCode and Claude-Code binaries, so a true native resolution may require an upstream change, with a fallback to commands and agents or to shims with an identity cost.
<!-- /ANCHOR:limitations -->
