---
title: "Feature Specification: Phase 11: mobbin-refero-smart-routing [template:level_1/spec.md]"
description: "Give sk-design-interface a hybrid decision gate for when to consult the Mobbin/Refero reference MCPs: take the initiative when a convention-heavy category benefits and a subscription is connected, ask the user when borderline, and fall back to the generic anti-default process otherwise. Picks Mobbin (app/iOS) vs Refero (web/styles) by surface."
trigger_phrases:
  - "mobbin refero smart routing"
  - "when to use mobbin refero reference"
  - "design reference initiative or ask"
  - "phase 011 spec"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "design/001-sk-design-interface/011-mobbin-refero-smart-routing"
    last_updated_at: "2026-06-17T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Added the hybrid initiative/ask decision gate for Mobbin/Refero"
    next_safe_action: "Strict-validate and close"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design-interface/references/design-grounding/design_references_mcp.md"
      - ".opencode/skills/sk-design-interface/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-011-mobbin-refero-smart-routing"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "How autonomous? Hybrid: initiative when category benefits and subscription connected; ask when borderline/unknown; fall back otherwise."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 11: mobbin-refero-smart-routing

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-06-17 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Parent Spec** | ../spec.md |
| **Phase** | 11 |
| **Predecessor** | 010-decouple-from-open-design |
| **Successor** | None |
| **Handoff Criteria** | The skill has an explicit hybrid initiative/ask decision gate for Mobbin/Refero with a source-pick heuristic, surfaced in SKILL.md routing + RULES; existing guardrails preserved; `validate.sh --strict` exits 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 11** of the sk-design-interface specification.

**Scope Boundary**: Add decision logic for when to consult the Mobbin/Refero reference MCPs. Edits the owner doc `references/design-grounding/design_references_mcp.md` and surfaces the gate in `SKILL.md`. No change to the tool catalogs (`mobbin_tools.md`, `refero_tools.md`) and no change to the existing guardrails.

**Decision (hybrid autonomy)**: Confirmed with the user. Take the initiative (pull one reference) when a convention-heavy category benefits AND a subscription is connected; ask the user when borderline or subscription status is unknown; fall back to the generic anti-default process otherwise.

**Dependencies**:
- Phase 010 (the decouple) — design_references_mcp.md was already generalized of its mcp-open-design mention there.

**Deliverables**:
- A "Deciding whether to consult (initiative or ask)" gate in design_references_mcp.md §3, the SKILL.md resource row reframed to INITIATIVE/ASK, and a new ALWAYS rule. Version bump + changelog.

**Changelog**:
- `sk-design-interface/changelog/v1.5.0.0.md`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Mobbin/Refero integration (phase 009) was purely passive: ON_DEMAND, user-driven, with no agent initiative and no explicit decision procedure for when a reference helps or which source to use. The skill never decides for itself whether to ground the deviation in a real-world reference, so the value of the integration depends entirely on the user remembering to ask.

### Purpose
Give the skill the judgment to decide when a real-world reference would sharpen the default to deviate from, and to act — by taking the initiative when it clearly helps and a subscription is connected, by asking when it is borderline, and by falling back to the generic process otherwise.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A hybrid initiative/ask decision gate in `design_references_mcp.md` §3, with a convention-heavy category taxonomy and a Mobbin-vs-Refero source-pick heuristic.
- Surface the gate in `SKILL.md` §2 (resource row reframed INITIATIVE/ASK) and §4 (a new ALWAYS rule).
- Version bump + changelog.

### Out of Scope
- The tool catalogs `mobbin_tools.md` / `refero_tools.md` (unchanged).
- The existing guardrails (one reference, no chooser, read live, never copied) — preserved, not changed.
- Any Open Design coupling (handled in phase 010).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `sk-design-interface/references/design-grounding/design_references_mcp.md` | Modify | §3 hybrid decision gate + category taxonomy + source pick; §1 pointer |
| `sk-design-interface/SKILL.md` | Modify | §2 resource row INITIATIVE/ASK; §4 ALWAYS rule 7 |
| `sk-design-interface/changelog/v1.5.0.0.md` | Create | Changelog for the routing upgrade |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The hybrid gate exists | `design_references_mcp.md` §3 has an initiative/ask/fall-back decision with a convention-heavy category list |
| REQ-002 | Source-pick heuristic | The gate states Mobbin for app/iOS surfaces and Refero for web/visual-style, picked by the design target |
| REQ-003 | Surfaced in routing + rules | SKILL.md §2 reframes the resource row to INITIATIVE/ASK and §4 adds an ALWAYS rule reflecting the gate |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Guardrails preserved | One reference, no chooser, read live, never copied, grounding upstream, pinned brief wins — all still present |
| REQ-005 | Strict validate | `validate.sh --strict` exits 0; parent map + children_ids reconciled |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A reader of `design_references_mcp.md` §3 finds an explicit "initiative vs ask vs fall back" gate and a Mobbin-vs-Refero source pick.
- **SC-002**: `SKILL.md` surfaces the gate (the resource row reads INITIATIVE/ASK; an ALWAYS rule names it).
- **SC-003**: The existing guardrails are intact.
- **SC-004**: `validate.sh --strict` exits 0 on this phase folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Over-eager initiative makes surprise paid calls | Mobbin/Refero are paid, remote | Initiative only when the category clearly benefits AND a subscription is connected; ask otherwise |
| Risk | The gate weakens grounding | A reference could substitute for grounding | Keep "grounding stays upstream and non-negotiable"; a reference is consulted only after STEP 0-1 |
| Risk | Chooser creep | Pulling several references becomes a gallery | Preserve the one-reference, no-chooser hard rules |
| Dependency | Phase 010 | design_references_mcp already generalized | Build the gate on the decoupled doc |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The autonomy level (hybrid) was resolved with the user before implementation.
<!-- /ANCHOR:questions -->
