---
title: "Feature Specification: The Framework Document Describes The Gate That Exists"
description: "Two validation claims in the always-loaded framework document are corrected to match measured behaviour."
trigger_phrases:
  - "framework doc matches behaviour"
  - "agents md validation claims"
  - "strict mode warning promotion"
  - "freshness grandfather claim"
  - "always-loaded framework document"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/009-validation-rule-reduction/005-framework-doc-matches-behaviour"
    last_updated_at: "2026-08-29T21:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Corrected the framework doc's validation claims to match the gate"
    next_safe_action: "None outstanding for this phase"
    blockers: []
    key_files:
      - "AGENTS.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-29-speckit-041-005"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: The Framework Document Describes The Gate That Exists

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-29 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The framework document is loaded on every turn and is the first place anyone
reads what the completion gate does. Two of its claims were false.

It said strict mode promotes warnings to validation errors, so a warnings-only
packet exits 2 and never 1. That was true until this packet changed it, and a
warnings-only packet now exits 0.

It also promised that a stale freshness result blocks completion for
non-grandfathered packets. There is no grandfather mechanism in the rule — the
word appears nowhere in it — so the exemption the document offered did not
exist. The rule is opt-in, reports a warning by default, and escalates to an
error only under its enforce flag.

A document that is loaded every turn and describes behaviour that is not there
is worse than no document, because it is trusted.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope**

- The two validation claims, corrected against measured behaviour.

**Out of scope**

- The git rules. They were checked and are accurate: the pre-push hook exists at
  the configured hooks path and does enforce the remote-push policy, and the
  commit and merge hooks are installed.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Priority |
|----|-------------|----------|
| REQ-001 | Every validation claim in the document is verified by running the gate | P1 |
| REQ-002 | No mechanism is promised that has no implementation | P0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Each corrected claim matches observed output.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Impact | Mitigation |
|------|--------|------------|
| The document is symlinked into other repositories | A correction here changes guidance elsewhere | The corrections describe the gate rather than any one repository's packets |
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
