---
title: "Implementation Summary: interface + audit contrasting pilots"
description: "Level-3 scaffold summary for the two contrasting styles-library pilots (design-interface + design-audit) wired through the phase-007 shared context seam. This is a planning scaffold — nothing is built yet; implementation is gated on phases 004 and 007."
trigger_phrases:
  - "interface audit pilots summary"
  - "design-interface pilot status"
  - "design-audit comparison status"
importance_tier: "important"
contextType: "implementation"
status: "planned"
_memory:
  continuity:
    packet_pointer: "sk-design/011-sk-design-styles-utilization/008-interface-audit-pilots"
    last_updated_at: "2026-07-18T13:40:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the interface/audit pilots scaffold (six L3 planning docs)"
    next_safe_action: "Wire the phase-007 seam into design-interface, then design-audit"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-iface-audit-011-008"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "How much of the interface handoff schema can the audit lane reuse verbatim?"
    answered_questions:
      - "Two contrasting pilots stabilize the shared proof/handoff fields before phase 009."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-interface-audit-pilots |
| **Status** | Planned — scaffold; implementation not started |
| **Level** | 3 |
| **Estimated Effort** | Interface 8–12 days + Audit 6–11 days (~11–18 days combined, overlap-reduced) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. This packet is a planning scaffold. Only the six Level-3 planning documents exist; no mode code, retrieval wiring, fixtures, or handoff schema have been implemented. Implementation is gated on phase 004 (retrieval) and phase 007 (shared seam) landing first.

The plan is to wire the first two sk-design modes to the styles library through the phase-007 shared context seam as two contrasting pilots. `design-interface` grounds creative direction in a retrieved anchor plus an optional bounded contrast and emits a decision-only, source-aware handoff. `design-audit` consumes 0–2 comparison references as non-authoritative context and emits intended-anchor drift fixtures. The contrast between a generative consumer and a critique consumer is what forces the shared proof/handoff fields to be general before the relationship-heavy modes (phase 009) consume them.

### Files to Change (proposed)

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/design-interface/**` | Modify (proposed) | Anchor + bounded-contrast retrieval, relational exemplar, decision-only handoff, counterfactual recorder |
| `.opencode/skills/sk-design/design-audit/**` | Modify (proposed) | 0–2 non-authoritative comparison refs, intended-anchor drift fixtures, evidence labels, non-authority guards |
| `design-interface/` fixtures | Create (proposed) | Positive / no-fit / rejected-default fixtures |
| `design-audit/` fixtures | Create (proposed) | Drift + comparison-unavailable fixtures |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. When implementation starts it will run in three stages: a shared contract-binding stage that binds the phase-007 envelope into both mode contracts and fixes the authority order; parallel build of the two pilots behind feature gates; and a verification stage that authors the fail-closed fixture atlas and confirms both pilots populate the shared proof/handoff fields with contrasting shapes. Each stage re-runs `validate.sh <folder> --strict`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Corpus as falsification infrastructure (ADR-001) | Makes non-authority a testable, fail-closed property instead of a promise |
| Interface decision-only, source-aware handoff (ADR-002) | Keeps direction traceable and stops raw style bodies crossing the seam |
| Audit corpus strictly non-authoritative (ADR-003) | Every verdict stays anchored to target evidence, not reference material |
| Two contrasting pilots before phase 009 (ADR-004) | The contrast generalizes the shared proof/handoff fields at lowest cost |
| Feature-gate both consumers | Reversible rollback keeps phases 004/007 intact if disabled |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Interface pilot | Not started, gated on phases 004 + 007 |
| Audit lane | Not started, gated on phases 004 + 007 |
| Falsification fixtures | Not started, fail-closed counterexamples pending |
| Shared-field verification | Not started, both pilots must populate the phase-007 proof/handoff fields |
| Packet validity | Re-run `validate.sh <folder> --strict` after each phase lands |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Nothing is built.** This packet is a planning scaffold only.
2. **Hard dependency gate.** Implementation cannot start until phase 004 (retrieval) and phase 007 (shared seam) land.
3. **Cost is an upper envelope.** The interface (8–12 days) and audit (6–11 days) estimates overlap on shared proof/handoff work; re-estimate after contract binding.
4. **Field generalization is a hypothesis.** Whether two contrasting pilots fully generalize the shared fields is validated only by cross-pilot verification (T017).
<!-- /ANCHOR:limitations -->
