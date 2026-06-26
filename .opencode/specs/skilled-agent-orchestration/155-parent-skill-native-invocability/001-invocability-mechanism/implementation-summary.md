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
    packet_pointer: "skilled-agent-orchestration/155-parent-skill-native-invocability/001-invocability-mechanism"
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
| **Completed** | Mechanism decided (Option E, Accepted); reference implementation in spec 154 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This packet owns the invocability mechanism **decision**, not a code change. It documents the confirmed gap, frames the candidate mechanisms (A–E), and records the chosen one — **Option E, invokable-hub routing** (ADR-001, Accepted). The mechanism's reference implementation was carried out in spec 154 (the sk-design conversion): `Skill(sk-design)` loads the hub, which routes to the nested `design-<mode>` packets. No source changed in *this* packet; the proof-of-mechanism lives in 154, and phase 002 mirrors it onto deep-loop.

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
| Chose Option E (invokable-hub routing) | Reaches nested modes through the invokable parent hub with one advisor identity; needs no runtime change and no advisor merged-identity layer |
| Implement the mechanism in spec 154, not here | The sk-design conversion is the reference implementation that proved Option E in practice; this packet stays decision-only |
| Record all options (A–E) in the decision record | The choice needed explicit tradeoffs (surface mismatch for commands/agents, identity cost for shims, out-of-repo risk for a runtime change) before selection |
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

1. **No code in this packet.** The mechanism's reference implementation is spec 154 (the sk-design conversion); this packet owns the decision.
2. **Mechanism decided.** Option E (invokable-hub routing) is Accepted (ADR-001); alternatives A–D are recorded with their tradeoffs.
3. **Option D remains out-of-repo.** True native `Skill(mode)` resolution lives in the OpenCode/Claude-Code binaries; Option E avoids needing it by routing through the invokable hub.
<!-- /ANCHOR:limitations -->
