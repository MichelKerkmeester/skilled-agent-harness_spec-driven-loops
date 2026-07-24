---
title: "Feature Specification: create-skill router-marker conformance gap analysis"
description: "Analyze the residual create-skill smart-router-marker gap across the ten sk-doc create-* packets: which packets carry the keyed-discovery mechanism, which document an honest N/A posture, and whether the create-skill standard requires wiring the markers into flat-resource packets. Read-only analysis; records the keep-vs-wire decision framing."
trigger_phrases:
  - "create-skill router marker gap"
  - "sk-doc smart-router conformance analysis"
  - "keyed discovery marker decision"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/006-create-skill-router-marker-gap"
    last_updated_at: "2026-07-13T14:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Analyzed the create-skill router-marker gap across all ten packets from live checker output"
    next_safe_action: "Operator decides keep-N/A-posture vs wire-the-markers; then reconcile"
    blockers: []
    completion_pct: 100
    status: "Analysis complete — decision pending"
    open_questions:
      - "Keep the honest N/A-note posture, or wire the create-skill keyed-discovery markers into the eight flat-resource packets?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: create-skill router-marker conformance gap analysis

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Analysis complete — decision pending |
| **Created** | 2026-07-13 |
| **Parent Packet** | `sk-doc/019-skill-routing-refactor` |
| **Sibling** | `005-create-skill-smart-routing-notes` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The create-skill conformance checker (`package_skill.py --check`) emits an advisory warning — `SMART ROUTING section missing smart-router marker(s): discover_markdown_resources, _guard_in_skill, UNKNOWN_FALLBACK` — on eight of the ten `create-*` packets. Sibling 005 gave the flat-resource packets an honest N/A note but deliberately did not add the literal markers, so the warning persists. This looks like a "router discrepancy against the create-skill standard" and needs an evidence-based verdict.

### Purpose
Produce a per-packet gap analysis grounded in live checker output, state whether the create-skill standard actually requires the markers on flat-resource packets, and frame the keep-vs-wire decision so it can be made without re-deriving the evidence. This packet changes no `SKILL.md` routing behavior; it is read-only analysis plus a recorded decision framing.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Enumerate, per packet, whether the keyed-discovery mechanism is present, whether an N/A note is present, and whether the advisory marker warning fires.
- Interpret the create-skill standard (checker severity, canonical precedent, mechanism intent).
- Record the keep-vs-wire decision options and a recommendation.

### Out of Scope
- Editing any `SKILL.md` routing markers or notes (that is the *action* the pending decision would authorize, in a future child).
- Any create-benchmark layout or word-cap change.
- The advisor registry.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- R1: The analysis reflects live `package_skill.py --check` output for all ten packets, not assumptions.
- R2: The create-skill standard interpretation cites concrete evidence (checker severity tier, `create-readme` precedent, `skill_smart_router.md` mechanism intent).
- R3: The decision framing states each option's cost and the honesty trade-off, with a recommendation.
- R4: The analysis changes no `SKILL.md` routing marker or note; it is read-only.
- R5: Adjacent advisory findings unrelated to the marker gap are noted as out of scope, not silently folded in.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- A per-packet conformance table exists with the three axes (mechanism / note / warning).
- The verdict states whether the eight warnings are a defect or correct-by-design, with evidence.
- The operator can pick keep-vs-wire from the recorded framing without further investigation.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Risk:** treating the advisory warning as a defect would pressure a force-fit that misrepresents flat-resource packets — explicitly the anti-goal here.
- **Dependency:** sibling `005-create-skill-smart-routing-notes` (the N/A-note posture under analysis) and the create-skill authority (`§2` SMART ROUTING + `skill_smart_router.md`).
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **The decision:** keep the honest N/A-note posture (accept the advisory warning as documented), or wire the create-skill keyed-discovery markers into the eight flat-resource packets to clear the warning? See `implementation-summary.md` for the framing and recommendation.
<!-- /ANCHOR:questions -->
