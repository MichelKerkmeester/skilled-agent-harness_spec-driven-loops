---
title: "Feature Specification: Tracks Are Not Packets"
description: "A track directory stops being graded as though it were a packet."
trigger_phrases:
  - "tracks are not packets"
  - "track directory exemption"
  - "three digit numeric prefix"
  - "track graded as packet"
  - "packets filed under tracks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/009-validation-rule-reduction/002-tracks-are-not-packets"
    last_updated_at: "2026-08-29T19:10:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Exempted track directories from packet rules"
    next_safe_action: "Begin the next phase: delete the rules that encode taste"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp-server/lib/validation/orchestrator.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-29-speckit-041-002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Tracks Are Not Packets

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

Packets are filed under tracks, and each track directory carries metadata so the
tracks are searchable. That metadata is enough to make a track look like a phase
parent, so the gate graded all fourteen of them as packets. Every one failed,
and could never do otherwise: a track is named for its subject, so a rule that
requires a three-digit numeric prefix rejects it by construction. Five errors
per track, fourteen tracks, none of them fixable by anyone.

This phase teaches the gate the difference between the drawer and the documents
in it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope**

- Recognising a track directory and applying no packet rules to it.

**Out of scope**

- Excluding archived packets. That was measured first and needs no work: the
  sweep already skips archived and scratch trees by name, and recursive
  validation only descends into numbered children, so an archive is reached only
  when someone names one directly.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Priority |
|----|-------------|----------|
| REQ-001 | A track directory reports no packet findings | P1 |
| REQ-002 | A packet never takes the exemption, wherever it sits | P0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Every track directory passes, and no packet changes verdict.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Impact | Mitigation |
|------|--------|------------|
| The exemption is too broad and swallows a real packet | A packet stops being graded and nobody notices | Identity requires all three of: sitting directly under the specs root, a non-packet name, and no spec of its own. A test asserts a numbered packet in that position is still graded |
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
