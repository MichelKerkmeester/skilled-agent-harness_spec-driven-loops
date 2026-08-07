---
title: "Feature Specification: False-Now Documentation Corrections"
description: "Correct confirmed documentation-vs-code drift for packet 028 false-now surfaces without changing runtime behavior. Scope is locked to four cited corrections and the supporting spec packet."
trigger_phrases:
  - "false-now doc corrections"
  - "retention forgetting flag"
  - "Track C supersession"
  - "soft delete tombstones"
  - "envelope fidelity comment"
importance_tier: "normal"
contextType: "implementation"
parent: "../spec.md"
successor: "011-code-graph-doc-audit"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/005-speckit-surface-alignment/001-false-now-doc-corrections"
    last_updated_at: "2026-07-05T08:55:00Z"
    last_updated_by: "opencode"
    recent_action: "Correct false-now documentation drift"
    next_safe_action: "Run strict validation and acceptance greps"
    blockers: []
    key_files:
      - ".opencode/specs/system-speckit/028-memory-search-intelligence/feature-flags.md"
      - ".opencode/specs/system-speckit/028-memory-search-intelligence/benchmark-status.md"
      - ".opencode/skills/system-spec-kit/feature_catalog/mutation/soft-delete-tombstones-and-active-purgeable-partitions.md"
      - ".opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "false-now-doc-corrections"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: False-Now Documentation Corrections

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
| **Created** | 2026-07-05 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Four false-now surfaces could mislead readers about current packet 028 behavior: a stale retention flag suffix, an earlier Track-C proposed-only snapshot, a soft-delete recall-filter contradiction, and a stale envelope-fidelity default comment. The runtime evidence uses unsuffixed `SPECKIT_RETENTION_FORGETTING`, default-on `SPECKIT_ENVELOPE_FIDELITY`, and active-row filtering for soft-deleted rows.

### Purpose
Align only the cited documentation and code-comment surfaces with shipped behavior while preserving historical phase records.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Confirm and keep `.opencode/specs/system-speckit/028-memory-search-intelligence/feature-flags.md:23` on `SPECKIT_RETENTION_FORGETTING`.
- Add a one-line supersession pointer at `.opencode/specs/system-speckit/028-memory-search-intelligence/benchmark-status.md:114` and fix the final tally row at line 183 to `SPECKIT_RETENTION_FORGETTING`.
- Confirm and keep `.opencode/skills/system-spec-kit/feature_catalog/mutation/soft-delete-tombstones-and-active-purgeable-partitions.md:20` on active-row default exclusion behavior.
- Confirm and keep `.opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:1350-1352` on default-on, opt-out envelope fidelity wording.

### Out of Scope
- Runtime behavior changes.
- ENV_REFERENCE deprecation or alias table edits.
- Changelog, archive, phase-history, or protected phase-027 envelope-fidelity implementation-summary edits.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/system-speckit/028-memory-search-intelligence/benchmark-status.md` | Modify | Add Track-C supersession pointer and unsuffix the retention flag row. |
| `.opencode/specs/system-speckit/028-memory-search-intelligence/005-speckit-surface-alignment/001-false-now-doc-corrections/spec.md` | Create | Document scoped correction requirements. |
| `.opencode/specs/system-speckit/028-memory-search-intelligence/005-speckit-surface-alignment/001-false-now-doc-corrections/plan.md` | Create | Document implementation and verification plan. |
| `.opencode/specs/system-speckit/028-memory-search-intelligence/005-speckit-surface-alignment/001-false-now-doc-corrections/tasks.md` | Create | Track execution tasks. |
| `.opencode/specs/system-speckit/028-memory-search-intelligence/005-speckit-surface-alignment/001-false-now-doc-corrections/implementation-summary.md` | Create | Record before/after evidence and verification. |
| `.opencode/specs/system-speckit/028-memory-search-intelligence/005-speckit-surface-alignment/001-false-now-doc-corrections/description.json` | Create | Generated packet metadata for memory visibility. |
| `.opencode/specs/system-speckit/028-memory-search-intelligence/005-speckit-surface-alignment/001-false-now-doc-corrections/graph-metadata.json` | Create | Generated graph metadata for strict validation. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Retention-forgetting live docs name the live unsuffixed flag. | `rg -n 'SPECKIT_RETENTION_FORGETTING_V1' .opencode/specs/system-speckit/028-memory-search-intelligence/feature-flags.md` returns no hits, and live code/ENV_REFERENCE show `SPECKIT_RETENTION_FORGETTING`. |
| REQ-002 | Track-C earlier proposed-only text has a supersession pointer. | `.opencode/specs/system-speckit/028-memory-search-intelligence/benchmark-status.md:114` points readers to the later landed thirteen-switch benchmark section. |
| REQ-003 | Soft-delete catalog states shipped active-row filtering. | Old contradiction text has no hits and line 20 states recall surfaces exclude soft-deleted rows by default. |
| REQ-004 | Envelope-fidelity formatter comment states durable default-on opt-out behavior. | `rg -n 'gated dark|Off by default' .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts` returns no hits near the envelope fragment. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The spec packet validates under the strict system-spec-kit gate. | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/028-memory-search-intelligence/005-speckit-surface-alignment/001-false-now-doc-corrections --strict` exits 0. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All four cited false-now surfaces are confirmed or corrected with file-line evidence.
- **SC-002**: Acceptance greps return the expected absence or presence results.
- **SC-003**: No protected historical phase record is modified.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Over-editing historical `_V1` mentions | Could rewrite accurate history as current behavior | Only edit current/live surfaces and leave archives, alias tables, and phase history untouched. |
| Dependency | Strict spec validation | Completion claim blocked if docs fail validation | Run `validate.sh --strict` after authoring and patch only packet docs if needed. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
