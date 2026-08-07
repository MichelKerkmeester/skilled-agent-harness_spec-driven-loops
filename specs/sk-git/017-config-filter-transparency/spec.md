---
title: "Feature Specification: Config Filter Transparency"
description: "Four config files commit different content than the operator sees, by design; this packet makes that behaviour discoverable at the moments it matters."
trigger_phrases:
  - "maintainer flags filter"
  - "config clean filter"
  - "opencode.json commits false"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/017-config-filter-transparency"
    last_updated_at: "2026-07-28T07:45:00Z"
    last_updated_by: "claude-fable-5"
    recent_action: "Documented the filter and verified the advisory covers all four files"
    next_safe_action: "Operator review"
    blockers: []
    key_files:
      - "spec.md"
      - "../../skills/sk-git/references/config-content-filters.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-28-sk-git-017"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The divergence is intentional; the remediation is transparency, not removal."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Config Filter Transparency

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-28 |
| **Branch** | `sk-git/0113-016-advisory-hook-build` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

A `maintainer-flags` clean filter maps four config files so that the committed blob differs from the file on disk: the working copies carry `"true"` for five indexing keys while every commit records `"false"`. The divergence is deliberate — local machines index; the public repository ships with indexing off — but nothing surfaced it. Research confirmed it live and rated it the highest-value finding in the corpus: an operator reviewing the working copy is reviewing content they are not committing.

### Purpose

Keep the filter, remove the surprise.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A reference document in sk-git explaining the filter, the four files, the five keys, and how to see the committed form.
- Verification that the advisory rule fires for each of the four mapped files.

### Out of Scope
- Removing or altering the filter. It is doing its job; the problem was silence, not behaviour.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `sk-git/references/config-content-filters.md` | Create | The explanation, where git guidance lives |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The behaviour is documented where git guidance lives | Reference names the files, the keys, the why, and the inspection command |
| REQ-002 | The advisory covers all four mapped files | The filter rule fires on an add of each |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The document states the intent, not just the mechanics | A reader learns this is deliberate before learning how it works |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: An operator who edits one of the four files can discover, before committing, that the committed content will differ.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Documentation drifts from `.gitattributes` | Med | The reference points at the authoritative files rather than duplicating their contents wholesale |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
