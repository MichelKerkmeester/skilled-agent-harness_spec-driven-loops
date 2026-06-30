---
title: "Feature Specification: sk-design-interface + mcp-open-design integration test (MiMo vs DeepSeek)"
description: "We standardized the design skills but had not exercised sk-design-interface end to end with a real model. This packet runs a controlled test: two models each create several designs through the shared design-parity loop, so we can see the skill working and compare the models."
trigger_phrases:
  - "design skill integration test"
  - "mimo vs deepseek designs"
  - "sk-design-interface real render"
  - "anti-default design test"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "design/002-mcp-open-design/009-design-skill-integration-test"
    last_updated_at: "2026-06-15T07:15:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Dispatched MiMo and DeepSeek design seats; awaiting outputs"
    next_safe_action: "Collect designs, compare the two models, write implementation-summary"
    blockers: []
    key_files:
      - ".opencode/specs/design/002-mcp-open-design/009-design-skill-integration-test/designs/mimo/NOTES.md"
      - ".opencode/specs/design/002-mcp-open-design/009-design-skill-integration-test/designs/deepseek/NOTES.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-009-design-skill-integration-test"
      parent_session_id: null
    completion_pct: 60
    open_questions:
      - "Run live Open Design generation (app launch plus gated runs) as a follow-up?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: sk-design-interface + mcp-open-design integration test (MiMo vs DeepSeek)

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-06-15 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 153 standardized the design skills' install and doctor surface, but sk-design-interface had not been exercised end to end with a real model, and the two design skills had never been run together to produce actual designs. We do not know how well a model applies the anti-default judgment in practice, or which model does it better.

### Purpose
See sk-design-interface produce real, viewable designs through its shared parity loop with mcp-open-design, and get a side-by-side read on MiMo v2.5 Pro versus DeepSeek v4 Pro as the design author.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Three design briefs (a coffee-roaster landing page, an indie podcast-host pricing page, a home-energy-monitor dashboard), each chosen so the templated AI default is tempting.
- MiMo v2.5 Pro creates all three as self-contained HTML, applying sk-design-interface and the shared parity loop.
- DeepSeek v4 Pro creates the same three under an identical brief.
- A host comparison of the two models across the three briefs.

### Out of Scope
- Live Open Design generation runs - they are mutating, gated, and need the desktop app running plus cloud auth, so they are an explicit user-confirmed follow-up.
- Building or shipping any of these designs into a real product - they are test artifacts.
- Modifying sk-design-interface or mcp-open-design - this packet only exercises them.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `154-.../designs/mimo/*.html` + `NOTES.md` | Create | MiMo's three designs plus its grounding and critique notes |
| `154-.../designs/deepseek/*.html` + `NOTES.md` | Create | DeepSeek's three designs plus its notes |
| `154-.../implementation-summary.md` | Modify | The MiMo-versus-DeepSeek comparison and verdict |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | MiMo v2.5 Pro produces three designs via the skill | Three self-contained HTML files plus NOTES.md exist under `designs/mimo/`, each with inline CSS and no external network dependency |
| REQ-002 | DeepSeek v4 Pro produces three designs via the skill | Three self-contained HTML files plus NOTES.md exist under `designs/deepseek/`, under an identical brief |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Each design applies the anti-default judgment | Each NOTES.md names the default it avoided and gives a grounded token system, not a generic template |
| REQ-004 | Host comparison of the two models | implementation-summary.md scores MiMo versus DeepSeek per brief on anti-default adherence, grounding, and execution |
| REQ-005 | Designs are viewable offline | Each HTML opens from disk and renders without a network call |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Six designs exist (three per model), each self-contained and viewable offline.
- **SC-002**: The comparison identifies which model better avoided the templated default and why, grounded in the actual output.
- **SC-003**: The shared parity loop (the integration point of the two skills) is exercised and documented.

### Acceptance Scenarios

- **Given** the MiMo seat, **When** it finishes, **Then** `designs/mimo/` holds three HTML files and a NOTES.md.
- **Given** the DeepSeek seat, **When** it finishes, **Then** `designs/deepseek/` holds three HTML files and a NOTES.md.
- **Given** any produced HTML, **When** opened from disk with no network, **Then** it renders with its full styling.
- **Given** a NOTES.md entry, **When** read, **Then** it names the avoided default and the grounded token system.
- **Given** both models' output, **When** compared per brief, **Then** the summary gives a per-brief and overall read.
- **Given** the app is closed, **When** live generation is considered, **Then** it is deferred to a user-confirmed follow-up rather than fired automatically.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Open Design desktop app | Closed, so live od grounding/generation is unavailable | Models ground via the skill's principles and the shared parity loop; live od offered as a follow-up |
| Dependency | xiaomi and deepseek providers | Needed for the two seats | Confirmed configured via `opencode providers list` |
| Risk | A model writes a non-self-contained page (CDN font) | Will not render offline | Brief forbids external deps; host opens each file to verify |
| Risk | A model produces a templated default anyway | Weak test signal | That itself is a finding the comparison records honestly |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should live Open Design generation (launch the app, fire gated runs, possibly cloud auth) run as a follow-up, or is the offline artifact test sufficient?
<!-- /ANCHOR:questions -->
