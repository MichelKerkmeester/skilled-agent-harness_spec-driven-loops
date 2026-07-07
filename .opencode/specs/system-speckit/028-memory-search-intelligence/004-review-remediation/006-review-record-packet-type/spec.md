---
title: "Feature Specification: Marker-Gated Review Packet Type in the Validator"
description: "An additive review packet type for the feature-spec validator, gated by a SPECKIT_LEVEL review marker. A spec.md carrying the marker enters a review path that requires only spec.md and review/review-report.md and waives plan, tasks, checklist, implementation-summary, and decision-record. The marker is the sole entry into the path, so every existing Level 1, Level 2, Level 3, and phase folder is byte-unaffected. The change spans the bash validator, the template-structure utility, the docs manifest, a new lean review spec template, the production validator resolver and orchestrator and structure gate, and a numeric-level guard in check-files. It ships four new tests plus two fixtures, and the 009-dark-flag-validation packet was marked a review record and now validates clean at exit 0."
trigger_phrases:
  - "review record packet type"
  - "SPECKIT_LEVEL review marker"
  - "lean review spec validator"
  - "review-report.md validation"
  - "deep-review packet retrofit"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/004-review-remediation/006-review-record-packet-type"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Added the marker-gated review packet type and proved it strictly additive"
    next_safe_action: "Mark the remaining lean deep-review packets as review records"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/spec/validate.sh"
      - ".opencode/skills/system-spec-kit/scripts/utils/template-structure.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-028-013"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Marker-Gated Review Packet Type in the Validator

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
| **Created** | 2026-06-24 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Lean review-record spec packets carry a spec.md plus a review report under `review/review-report.md` and nothing else: no plan, no tasks, no checklist, no implementation-summary. The feature-spec validator always required the full Level 1 doc set, so every such packet tripped it. Each deep-review packet needed a manual retrofit of stub docs to pass, and the deep-loop-generated 009 packet still failed with several errors despite that work. The validator had no concept of a review record, so a structurally correct review packet read as a broken feature packet.

### Purpose
Give the validator a first-class review packet type that recognizes a lean review record and validates it on its own terms. The recognition is marker-gated and additive, so no existing packet changes behavior, and a review packet passes by carrying exactly the two docs it is supposed to carry.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A marker-gated `review` packet type entered only by a spec.md carrying `<!-- SPECKIT_LEVEL: review -->`
- The review path requiring spec.md and `review/review-report.md` and waiving plan, tasks, checklist, implementation-summary, and decision-record
- The bash validator, the template-structure utility, the docs manifest, and a new lean review spec template
- The production validator resolver, orchestrator, and structure gate, plus a numeric-level guard in check-files
- Four new tests, two fixtures, and the 009 packet marked as a review record to demonstrate the path

### Out of Scope
- Changing any behavior of the existing Level 1, Level 2, Level 3, or phase paths
- Marking the 011 or 012 packets as review records, which were intentionally left as Level 1
- Auto-detecting a review record without the marker

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| scripts/spec/validate.sh | Modify | `detect_level` recognizes the review marker, help text lists it |
| scripts/utils/template-structure.js | Modify | The review level, template path, and allowed anchors |
| templates/manifest/spec-kit-docs.json | Modify | The review level row, review-record taxonomy, freeform review-report entry |
| templates/manifest/review.spec.md.tmpl | Create | A lean review spec template, a subset of the L1 spec anchors |
| mcp_server/lib/templates/level-contract-resolver.ts | Modify | The production resolver gains review handling |
| mcp_server/lib/validation/orchestrator.ts | Modify | The orchestrator routes the review path |
| mcp_server/lib/validation/spec-doc-structure.ts | Modify | Excludes the freeform review-report from three gates |
| scripts/rules/check-files.sh | Modify | Guards the numeric-level comparison against a string level |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The change is strictly additive | Every existing Level 1, Level 2, Level 3, and phase folder is byte-unaffected, and the marker is the sole entry into the review path |
| REQ-002 | The review path validates a lean review record | A spec.md with the marker plus `review/review-report.md` passes, and a missing report fails |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The waived docs are not required on the review path | Plan, tasks, checklist, implementation-summary, and decision-record are not demanded for a review record |
| REQ-004 | The freeform review-report is excluded from the wrong gates | The report is excluded from the template-source, frontmatter-continuity, and sufficiency gates |
| REQ-005 | The string level cannot crash the rules | The numeric-level comparison in check-files is guarded so a string level passes through without error |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A deep-review packet validates clean by carrying its real two docs, shown by the 009 packet marked as a review record now passing at exit 0
- **SC-002**: No existing packet changed behavior, proven by identical fixture-suite pass and fail results before and after and by a stashed-change baseline showing an unrelated failure identical with and without the change
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The new path leaks into existing packets and changes their result | High | The review marker is the sole entry, and the additive claim is proven two ways against a clean baseline |
| Risk | A string level crashes a numeric comparison in the rules | Medium | The check-files numeric comparison is guarded so a non-numeric level passes through |
| Dependency | The production validator dist | The marker handling must reach the compiled validator | The resolver, orchestrator, and structure gate are rebuilt so the dist honors the review path |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should a review record be auto-detected without the marker? **RESOLVED: No, the marker is the sole entry so the additive guarantee holds and no existing folder is reclassified**
- Should the 011 and 012 packets be converted to review records? **RESOLVED: No, they were intentionally left as Level 1 feature packets**
<!-- /ANCHOR:questions -->
