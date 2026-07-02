---
title: "Implementation Summary: Parent-skill native invocability"
description: "Decision-complete status record. This packet owns ADR-001, which accepts Option E invokable-hub routing. No source build happened in 002; NFR-S01 is resolved in phase 003."
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
    packet_pointer: "skilled-agent-orchestration/119-parent-skill-native-invocability/002-invocability-mechanism"
    last_updated_at: "2026-06-26T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Recorded ADR-001 Accepted: Option E chosen; no source build in 002"
    next_safe_action: "Optional: run a full live deep-loop e2e from 003; refresh metadata separately"
    blockers: []
    key_files:
      - "spec.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-155-parent-skill-native-invocability"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Option E invokable-hub routing is accepted."
      - "A/B commands and agents remain fallback complementary surfaces."
      - "NFR-S01 resolved in 003 (ADR-004): per-mode allowed-tools is the authoritative contract; accepted."
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
| **Spec Folder** | 002-invocability-mechanism |
| **Completed** | Decision-complete / phase scope done: ADR-001 Accepted (Option E); no source build in 002; NFR-S01 resolved in 003; packet remains in progress pending optional live-loop e2e |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This packet owns the invocability mechanism **decision**, not a code change. It documents the confirmed direct-mode gap, frames the candidate mechanisms (A-E), and records the chosen one: **Option E, invokable-hub routing** (ADR-001, Accepted). The canonical live pattern is `deep-loop-workflows`: `Skill(deep-loop-workflows)` loads the parent hub, which routes to nested deep-loop packets. The sk-design conversion is a secondary adoption of the same pattern. No source changed in 002; phase 003 mirrors and audits the pattern on deep-loop.

### Planning artifacts authored
The packet authors `spec.md` (gap, scope, requirements, and NFR carry-forward), `plan.md` (decision-complete plan record), `tasks.md` (decision tasks and downstream carry-forward tasks), `decision-record.md` (all five mechanism options with Option E accepted), and `checklist.md` (documentation items checked, runtime/security items pending). No source build happened in 002.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The planning documents were reconciled against the parent-skill pattern, the live `deep-loop-workflows` hub, and the phase review findings. No rollout occurred because phase 002 is decision-only. NFR-S01 resolved in 003 (ADR-004): per-mode allowed-tools is the authoritative contract; accepted. The remaining residual is optional live-loop e2e evidence owned by phase 003, not source build work in 002.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Chose Option E (invokable-hub routing) | Reaches nested modes through the invokable parent hub with one advisor identity; needs no runtime change |
| Keep A/B as fallback complementary surfaces | Commands and agents already work and avoid the shim identity cost |
| Carry NFR-S01 to 002 | NFR-S01 resolved in 003 (ADR-004): per-mode allowed-tools is the authoritative contract; accepted |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate.sh --strict` on this packet | Required after the S02-S14 reconciliation; previous green runs are structural, not semantic proof |
| Implementation tests | Not run: no source implementation exists in 002 |
| Manual `Skill()` reachability probe | Not run in 002; downstream packets own runtime probes |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No code in this packet.** Phase 002 owns the mechanism decision only.
2. **Mechanism decided.** Option E (invokable-hub routing) is Accepted (ADR-001); all five options are recorded with their tradeoffs and A/B remain fallbacks.
3. **NFR-S01 resolved in 003.** ADR-004 records that per-mode allowed-tools is the authoritative contract; accepted.
<!-- /ANCHOR:limitations -->
