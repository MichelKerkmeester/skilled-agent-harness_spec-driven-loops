---
title: "Feature Specification: Text Link Button Disabled State"
description: "Text-link buttons need a scoped way to be forced into a disabled visual and interaction state without changing other button variants. This packet limits the first implementation to btn_text_link.css."
trigger_phrases:
  - "text link button disabled"
  - "data-btn-disabled"
  - "disabled button styling"
  - "btn_text_link"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "anobel.com/001-button-text-link-disabled-state"
    last_updated_at: "2026-05-23T17:28:34Z"
    last_updated_by: "opencode"
    recent_action: "Completed scoped text-link button disabled styling"
    next_safe_action: "Review in browser on a representative text-link button if needed"
    blockers: []
    key_files:
      - "a_nobel_en_zn/1_css/button/btn_text_link.css"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-anobel.com/001-button-text-link-disabled-state"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "User requested a new Level 1 spec under .opencode/specs/anobel.com."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Text Link Button Disabled State

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-23 |
| **Branch** | `scaffold/001-button-text-link-disabled-state` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Text-link buttons currently define enabled, hover, focus and active states, but they do not expose a dedicated disabled override. Designers need a simple attribute they can apply to force one of these buttons to look disabled and stop pointer interaction without changing the broader button system.

### Purpose
Add a scoped disabled-state CSS hook for text-link buttons only, so the first rollout is limited to `btn_text_link.css`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a disabled selector set for text-link button types handled by `btn_text_link.css`.
- Support a force-disabled authoring hook through `data-btn-disabled="true"`.
- Also honor native `:disabled` and `aria-disabled="true"` where the markup already uses those states.

### Out of Scope
- Other button CSS files - the user asked to start with `btn_text_link.css` only.
- JavaScript click interception - this change stays CSS-only.
- Site-wide button API changes - broader rollout can happen after this first variant is reviewed.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `a_nobel_en_zn/1_css/button/btn_text_link.css` | Modify | Add scoped disabled-state styling and pointer interaction blocking for text-link buttons. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A text-link button can be forced disabled with `data-btn-disabled="true"`. | Selector exists in `btn_text_link.css`, applies `opacity: 0.4` and `pointer-events: none`. |
| REQ-002 | Disabled styling keeps the button's normal variant styling. | Disabled rules do not replace the button's color or underline styling tokens. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Native and semantic disabled hooks remain compatible. | Selectors include `:disabled` and `aria-disabled="true"` for the same text-link button types. |
| REQ-004 | Scope stays limited to text-link button types. | Selectors target only the `Blue`, `Black`, `Gray`, `White` and `Red` text-link button types in this file. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Applying `data-btn-disabled="true"` to a text-link `.button` makes it non-clickable for pointer interaction.
- **SC-002**: Disabled text-link buttons keep their normal variant styling and are dimmed to 40% opacity.
- **SC-003**: No other button CSS file is modified in this first rollout.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | CSS-only disabling cannot stop keyboard activation for anchors with `href`. | Medium | Document that anchors should pair this CSS state with `aria-disabled="true"`, removed `href`, `tabindex="-1"`, or JavaScript prevention if keyboard blocking is required. |
| Dependency | Existing variant styling | Low | Leave color and underline tokens untouched and dim the whole button with opacity. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None for this first scoped CSS rollout.
<!-- /ANCHOR:questions -->
