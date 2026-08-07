---
title: "Feature Specification: Phase 11: create-sh-parent-corruption-fix"
description: "create.sh --phase --phase-parent <existing> append mode deterministically overwrites the existing parent packet's description.json with the new child's own metadata, dropping the track prefix from specFolder and emptying parentChain; one packet is already corrupted repo-wide."
trigger_phrases:
  - "create.sh parent packet corruption fix"
  - "append to existing parent description.json"
  - "phase scaffolding overwrites parent metadata"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/003-spec-data-quality/014-create-sh-parent-corruption-fix"
    last_updated_at: "2026-07-04T17:11:45.809Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Shipped, tested and repaired"
    next_safe_action: "None - phase complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/spec/create.sh"
      - ".opencode/specs/system-speckit/028-memory-search-intelligence/001-speckit-memory/description.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-phase-011-create-sh-corruption-20260702"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 11: create-sh-parent-corruption-fix

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
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-02 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | ../spec.md |
| **Phase** | 11 of 12 |
| **Predecessor** | ../013-generated-metadata-status-integrity/spec.md |
| **Successor** | ../015-derive-status-explicit-bypass-fix/spec.md |
| **Handoff Criteria** | Append-mode phase scaffolding no longer mutates an existing parent's `description.json`; the one already-corrupted packet is repaired; regression fixture guards against recurrence |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 11** of packet 028, closing Target 1 of the 10-iteration GPT-5.5 xhigh adversarial follow-up review (`review-report.md`, session `gpt-followup-audit-20260702T104647Z`) that independently audited phase 010's own shipped fix and, in the same pass, found this unrelated `create.sh` scaffolding defect.

**Scope Boundary**: `create.sh`'s append-mode parent-description write path, and a scoped, dry-run-first repair of the one packet already carrying the corruption signature. Does NOT touch child-phase metadata generation (already correct, ruled out as a cause in review iteration 1), phase-parent detection (`is-phase-parent.ts`/`phase-classifier.ts`), or the 332 separately-deferred "related metadata drift" records the review's blast-radius scan also surfaced (different signature, out of scope here per the review's own disposition).

**Dependencies**:
- None. Isolated fix to `create.sh` plus a scoped data repair.

**Deliverables**:
- `create.sh`'s parent-description regeneration guarded so it never runs when `APPEND_TO_EXISTING_PARENT=true`
- A regression fixture asserting an existing parent's `description.json` is byte-stable across an append-mode child-phase creation
- A dry-run-first repair of `system-speckit/028-memory-search-intelligence/001-speckit-memory/description.json` in both the `.opencode/specs/` and legacy `specs/` metadata roots

**Changelog**:
- When this phase closes, refresh the matching file in ../../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`create.sh --phase --phase-parent <existing-packet> --phase-names <name> ...` rebinds `FEATURE_DIR` to the existing parent (`create.sh:1046-1062`) but still calls the parent description generator with the append request's own feature description (`create.sh:1310-1317`). `generate-description.ts:77-90,108` persists that call's `specFolder`/`description`/`keywords`/`parentChain` directly onto the parent's `description.json`, overwriting the parent's real identity metadata with the new child phase's own text — deterministically, on every successful append-mode invocation (confirmed via root-cause trace and determinism check, review iterations 1-2). A repo-wide blast-radius scan of all 4918 `description.json` files (review iteration 3) found this signature already present on 1 logical packet (`system-speckit/028-memory-search-intelligence/001-speckit-memory`, mirrored across 2 physical files): `specFolder` collapsed from `"system-speckit/028-memory-search-intelligence/001-speckit-memory"` to `"001-speckit-memory"`, and `parentChain: []`.

### Purpose
Append-mode phase scaffolding never mutates an existing parent's `description.json`, and the one packet already carrying the corruption signature has its identity/lineage metadata correctly repaired.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Guard the parent-description regeneration call in `create.sh` (`:1310-1321`) so it only runs for genuine new-parent creation, never for `--phase-parent <existing>` append mode
- Add a regression fixture: append a phase under a copied existing parent, assert the parent's `description.json` is byte-identical before/after, and assert the new child's own `description.json` is created correctly
- Write a read-only, dry-run-first repair classifier reusing the `isPhaseParent()` direct-child rule, run it once against the confirmed `001-speckit-memory` candidate, review the dry-run diff, then regenerate that packet's `description.json` from its own `spec.md` in both metadata roots
- Amend `create.sh`'s phase-scaffolding contract (inline comment or adjacent doc) to state explicitly that append-mode must never regenerate the existing parent's `description.json`

### Out of Scope
- Child-phase `description.json` generation (`create.sh:1351-1361`) — already correct, ruled out as a cause
- Phase-parent detection logic (`is-phase-parent.ts`, `phase-classifier.ts`) — unaffected, verified in review iteration 4
- The 332 "related metadata drift" records from the review's blast-radius scan (absolute-root `parentChain` values, `system-spec-kit`/`system-speckit` path-spelling mismatches) — different signature, explicitly deferred by the review as a separate data-quality question
- A general-purpose repair tool for future corruption signatures — this phase repairs exactly the one confirmed candidate

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/scripts/spec/create.sh` | Modify | Guard the parent `description.json` regeneration call behind `APPEND_TO_EXISTING_PARENT != true` |
| Matching `.bats`/shell or vitest fixture for `create.sh`'s phase-scaffolding path | Modify/Create | Regression coverage for parent byte-stability across append-mode |
| `.opencode/specs/system-speckit/028-memory-search-intelligence/001-speckit-memory/description.json` | Repair | Regenerate `specFolder`/`parentChain` from the packet's own `spec.md` |
| `specs/system-speckit/028-memory-search-intelligence/001-speckit-memory/description.json` (legacy root, if present) | Repair | Same repair, mirrored root |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Append-mode phase scaffolding (`--phase --phase-parent <existing>`) never regenerates the existing parent's `description.json` | Appending a phase under a copied existing parent leaves that parent's `description.json` byte-identical before and after |
| REQ-002 | New-parent creation and child-phase metadata generation remain unaffected | A fresh `--phase --phase-parent <new-name>` run (no existing parent) still produces a correct parent `description.json`; child phases still get their own correct `description.json` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The confirmed corrupted packet is repaired | `system-speckit/028-memory-search-intelligence/001-speckit-memory/description.json` (both metadata roots) has `specFolder: "system-speckit/028-memory-search-intelligence/001-speckit-memory"` and a non-empty `parentChain` after repair |
| REQ-004 | Regression fixture pins the fix | A test/fixture exercising append-mode scaffolding fails on the pre-fix `create.sh` and passes on the post-fix version |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Appending a phase under an existing parent no longer changes that parent's `description.json`
- **SC-002**: `system-speckit/028-memory-search-intelligence/001-speckit-memory`'s `description.json` is repaired in both metadata roots and matches its `spec.md`'s real identity
- **SC-003**: Existing `create.sh` phase-scaffolding tests/fixtures (new-parent creation, child metadata) still pass unchanged
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Repairing `001-speckit-memory`'s `description.json` while another concurrent session has it open could collide | Medium - lost-update on a shared file | Read current file state immediately before repair, dry-run diff reviewed first, small surgical JSON edit rather than a full regenerate-and-overwrite |
| Risk | The classifier used for detection could over-match packets that only coincidentally share a short `specFolder` value | Low - review iteration 3 already scoped this to the exact 1-packet signature via `isPhaseParent()` direct-child rule | Reuse the review's own classifier logic verbatim rather than re-deriving detection from scratch |
| Dependency | None | N/A | N/A |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The review already resolved the design questions (guard by append-mode flag; scoped dry-run-first repair of the one confirmed candidate).
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Finding source**: `.opencode/specs/system-speckit/028-memory-search-intelligence/002-spec-data-quality/047-generated-metadata-status-integrity/review/review-report.md` (T1-P1-001, T1-P1-002, T1-P1-003)
<!-- /ANCHOR:cross-refs -->
