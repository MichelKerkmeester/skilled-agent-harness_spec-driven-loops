---
title: "Feature Specification: Stop Grading Prose Against A Moving Target"
description: "Documents stop being diffed against templates that change weekly; anchors are checked for what actually reads them."
trigger_phrases:
  - "stop grading prose shape"
  - "template conformance removed"
  - "heading shape grading removed"
  - "anchors checked integrity"
  - "documents diffed against templates"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/009-validation-rule-reduction/004-stop-grading-prose-shape"
    last_updated_at: "2026-08-29T20:20:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Replaced template-shape grading with anchor integrity"
    next_safe_action: "Packet phases complete; merge to the release branches"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp-server/lib/validation/orchestrator.ts"
      - ".opencode/skills/system-spec-kit/scripts/lib/validator-registry.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-29-speckit-041-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Stop Grading Prose Against A Moving Target

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

Two rules compared a document's headings and anchors against the template on
disk, right now. Templates are edited often — a recent commit renumbered every
section in the specification template — and each edit silently regraded every
packet in the repository. A contract that changes weekly is a moving target, and
these two rules were the largest remaining source of blocked packets.

Nothing machine-readable consumes heading text. Anchors are different: merging
generated content into a document, chunking it for retrieval, and search
metadata all read them. So the two rules deserved different fates.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope**

- Removing heading-shape grading and the section-count rule that duplicated it.
- Replacing anchor template-matching with anchor integrity: anchors exist where
  a template defines them, are unique, and open and close in pairs.
- Deleting the rule scripts no code path could reach.

**Out of scope**

- Widening any check. The phase-parent exemption these rules already had is
  preserved, because extending coverage is a different decision from reducing
  what is asserted.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Priority |
|----|-------------|----------|
| REQ-001 | Editing a template does not regrade existing packets | P0 |
| REQ-002 | Anchors still satisfy what merge, chunking and search need | P0 |
| REQ-003 | No packet regresses | P0 |
| REQ-004 | No reference to a deleted rule survives | P1 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- The pass rate rises with zero regressions, measured on a pinned sample.
- A duplicate, unclosed, or missing anchor is still caught.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Impact | Mitigation |
|------|--------|------------|
| Anchors are load-bearing and were nearly deleted with the headings | Merge and retrieval break silently | Consumers were traced before deciding; the rule was narrowed rather than removed |
| The replacement is stricter somewhere unmeasured | Packets fail for a new reason | Measured against a pinned sample; each regression found was traced and the check narrowed until none remained |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

Whether the checklist title should be checked at all. It was enforced by the
deleted rule, and 384 titles were rewritten earlier in this work to satisfy it.
No machine reads a title, so it is not restored here.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## 8. RELATED DOCUMENTS

- `../spec.md` — the parent packet and its phase map
<!-- /ANCHOR:related-docs -->
