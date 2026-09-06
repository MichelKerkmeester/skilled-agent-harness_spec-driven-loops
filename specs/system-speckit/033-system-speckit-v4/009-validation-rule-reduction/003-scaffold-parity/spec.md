---
title: "Feature Specification: The Scaffold Passes Its Own Gate"
description: "A packet created with no human input stops failing validation the moment it exists."
trigger_phrases:
  - "scaffold parity"
  - "fresh scaffold passes"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/009-validation-rule-reduction/003-scaffold-parity"
    last_updated_at: "2026-08-29T19:40:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Made a fresh scaffold pass the gate it ships with"
    next_safe_action: "Begin the next phase: stop copying derived facts into authored prose"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/spec/create.sh"
      - ".opencode/skills/system-spec-kit/templates/core/spec.md.tmpl"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-29-speckit-041-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: The Scaffold Passes Its Own Gate

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-29 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The same system generates packets and grades them, and the two disagreed. A
Level 2 folder created with no human input failed its own gate on five errors
before anyone opened it. An author's first experience of the gate was being told
their untouched scaffold was wrong, which is how a gate becomes something to
work around rather than read.

The causes were all defects of the generator, not the author. The status field
was scaffolded as a menu of every option — and because that menu contains the
word Complete, the status classifier read a brand-new folder as a finished one
and fired the rule that objects to scaffold markers in a completed packet. The
newest document carried an author placeholder the generator never substituted.
And the generator wrote its own guess at graph metadata instead of deriving it,
so the packet disagreed with its own deriver from the first second.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope**

- A scaffold that reports no errors at every level it offers.
- A test that keeps it that way.

**Out of scope**

- Warnings on a fresh scaffold. An untouched template legitimately attracts
  advice about being untouched; that is the gate working.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Priority |
|----|-------------|----------|
| REQ-001 | A scaffold reports zero errors at every level | P0 |
| REQ-002 | The scaffolder derives its metadata rather than guessing it | P0 |
| REQ-003 | A regression in scaffold parity fails a test | P0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Levels 1, 2 and 3 each produce a folder that validates with zero errors.
- Reintroducing any of the fixed defects turns the test red.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Impact | Mitigation |
|------|--------|------------|
| The test leaves scaffolded folders behind | The corpus fills with probes | Each test removes only what it created, and only under the specs root |
| Tolerating the scaffold marker hides a real fault | A packet ships still marked unfiled | The marker is still caught by the rule that objects to scaffold signatures in a packet claiming completion |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## 8. RELATED DOCUMENTS

- `../spec.md` — the parent packet and its phase map
<!-- /ANCHOR:related-docs -->
