---
title: "Implementation Summary: Parent-skill native invocability"
description: "Decision-complete status record. This packet owns ADR-001, which accepts Option E invokable-hub routing. No source build happened in 001; NFR-S01 is carried to phase 002."
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
    recent_action: "Recorded ADR-001 Accepted: Option E chosen; no source build in 001"
    next_safe_action: "Use 002 to document hub union-grant semantics and close remaining validation gates"
    blockers: []
    key_files:
      - "spec.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-155-parent-skill-native-invocability"
      parent_session_id: null
    completion_pct: 70
    open_questions:
      - "NFR-S01 remains unresolved in 001 and carried to 002."
    answered_questions:
      - "Option E invokable-hub routing is accepted."
      - "A/B commands and agents remain fallback complementary surfaces."
---
# Implementation Summary: Parent-skill native invocability

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/global/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | skilled-agent-orchestration/155-parent-skill-native-invocability/001-invocability-mechanism |
| **Completed** | Decision complete: ADR-001 Accepted (Option E); no source build in 001; NFR-S01 carried to 002 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This packet owns the invocability mechanism **decision**, not a code change. It documents the confirmed direct-mode gap, frames the candidate mechanisms (A-E), and records the chosen one: **Option E, invokable-hub routing** (ADR-001, Accepted). The canonical live pattern is `deep-loop-workflows`: `Skill(deep-loop-workflows)` loads the parent hub, which routes to nested deep-loop packets. The sk-design conversion is a secondary adoption of the same pattern. No source changed in 001; phase 002 mirrors and audits the pattern on deep-loop.

### Planning artifacts authored
The packet authors `spec.md` (gap, scope, requirements, and NFR carry-forward), `plan.md` (decision-complete plan record), `tasks.md` (decision tasks and downstream carry-forward tasks), `decision-record.md` (all five mechanism options with Option E accepted), and `checklist.md` (documentation items checked, runtime/security items pending). No source build happened in 001.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The planning documents were reconciled against the parent-skill pattern, the live `deep-loop-workflows` hub, and the phase review findings. No rollout occurred because 001 is decision-only. The next substantive work is in 002: document the hub union-grant permission contract and close the remaining deep-loop validation gates.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Chose Option E (invokable-hub routing) | Reaches nested modes through the invokable parent hub with one advisor identity; needs no runtime change |
| Keep A/B as fallback complementary surfaces | Commands and agents already work and avoid the shim identity cost |
| Carry NFR-S01 to 002 | The hub `allowed-tools` grant is the union the modes need; 001 does not prove runtime narrowing to per-mode declarations |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate.sh --strict` on this packet | Required after the S02-S14 reconciliation; previous green runs are structural, not semantic proof |
| Implementation tests | Not run: no source implementation exists in 001 |
| Manual `Skill()` reachability probe | Not run in 001; downstream packets own runtime probes |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No code in this packet.** 001 owns the decision only.
2. **Mechanism decided.** Option E (invokable-hub routing) is Accepted (ADR-001); all five options are recorded with their tradeoffs and A/B remain fallbacks.
3. **NFR-S01 unresolved here.** The accepted hub pattern uses a union tool grant at the hub level; phase 002 documents that contract and carries the remaining validation.
<!-- /ANCHOR:limitations -->
