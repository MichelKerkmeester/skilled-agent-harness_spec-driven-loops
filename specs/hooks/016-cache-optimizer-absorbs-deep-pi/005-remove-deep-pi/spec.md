---
title: "Feature Specification: Phase 5: retire the extension"
description: "The extension stopped loading in phase 001 and its capabilities live elsewhere after 002-004, so the directory, its provenance entry, a boundary runner that exists only to compare two extensions, and a parity test that names it can all go. Historical records keep naming it, unedited."
trigger_phrases:
  - "remove deep-pi extension"
  - "retire vendored fork"
  - "deep-pi reference sweep"
  - "boundary runner removal"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/016-cache-optimizer-absorbs-deep-pi/005-remove-deep-pi"
    last_updated_at: "2026-09-08T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Authored against a live reference inventory"
    next_safe_action: "Execute once 002-004 have shipped"
    blockers: []
    key_files:
      - ".opencode/scripts/vendored-fork-provenance.json"
      - ".opencode/scripts/run-local-deep-pi-boundary.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-016-005-remove-deep-pi"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "65 files carry a live reference; the rest are historical records that stay unedited"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 5: retire the extension

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

The extension has not loaded since phase 001 and its capabilities live in the surviving extension
after 002-004. What remains is the directory, an entry in the fork provenance record, a boundary
runner whose only purpose was comparing two extensions, a parity test that names it, and a set of
generated indexes that will regenerate. Historical records keep naming it.

**Key Decisions**: delete only what is live; regenerate indexes rather than hand-editing them; never touch a historical record.

**Critical Dependencies**: phases 002-004 — capability must already live elsewhere.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-09-08 |
| **Parent Spec** | ../spec.md |
| **Predecessor** | 004-port-hash-verified-edits |
| **Successor** | 006-reconcile-extension-documentation |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the parent decomposition.

**Scope Boundary**: removal of the extension and its live references. No behavior change to the
surviving extension.

**Dependencies**: 002-004 shipped, so nothing is lost by removing it. This is what makes the phase
safe rather than merely last.

**Deliverables**: the extension gone; every live reference gone; historical records intact.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The extension directory is 53 tracked files and a large vendored dependency tree that nothing
loads. Around it sit references of three different kinds, and treating them alike would either
leave the tree inconsistent or destroy a true record:

- **Live wiring** that must go: the provenance entry, a boundary runner that exists only to compare
  the two extensions, and a parity test that names the extension.
- **Generated indexes** that must be regenerated, not edited: trigger index, retrieval fixtures,
  spec descriptions, and sk-doc directory manifests.
- **Historical records** that must be left exactly as they are: prior spec packets, changelogs,
  benchmark evidence, and the append-only dispatch audit log.

A sweep that cannot tell these apart is the risk this phase manages.

### Purpose

The extension is absent from the tree, from the enabled-package list and from every live reference,
while every record of the work it did still says what was true when it was written.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `.pi/extensions/deep-pi/` in full.
- The `deep-pi` entry in the fork provenance record and its handling in the provenance checker.
- `.opencode/scripts/run-local-deep-pi-boundary.mjs`, whose only purpose is comparing the two extensions.
- The reference in `system-spec-kit/runtime/tests/hook-adapter-path-parity.vitest.ts`, which will otherwise assert a path that no longer exists.
- `.pi/PLUGINS.md` and the `.gitignore` entry.
- Regeneration of the generated indexes that carry the name.

### Out of Scope

- **Historical records.** Prior spec packets under `specs/hooks/002`, `008` and `009`, changelogs, `benchmark/evidence/`, and `.opencode/logs/cli-dispatch-audit.log`. They record work that happened.
- **README reconciliation** — phase 006 does that once this lands.
- **The surviving extension's behavior**, which does not change here.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.pi/extensions/deep-pi/**` | Delete | The extension, 53 tracked files |
| `.opencode/scripts/vendored-fork-provenance.json` | Modify | Drop the `deep-pi` fork entry |
| `.opencode/scripts/check-vendored-fork-provenance.mjs` | Modify | Stop expecting a fork that is gone |
| `.opencode/scripts/run-local-deep-pi-boundary.mjs` | Delete | Compares two extensions; one remains |
| `.opencode/skills/system-spec-kit/runtime/tests/hook-adapter-path-parity.vitest.ts` | Modify | Remove the reference so the suite does not assert a missing path |
| `.pi/PLUGINS.md` | Modify | Live inventory of installed plugins |
| `.gitignore` | Modify | Drop the entry for a directory that no longer exists |
| Generated indexes | Regenerate | Trigger index, retrieval fixtures, spec descriptions, sk-doc manifests — by their generators, never by hand |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The directory is absent and nothing live references the extension |
| REQ-002 | A live Pi session still loads every remaining extension |
| REQ-003 | The provenance checker passes with one fork instead of two |
| REQ-004 | No historical record is edited |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | Generated indexes are regenerated by their generators |
| REQ-006 | The spec-kit suite passes with the parity-test reference removed |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A residue sweep finds the name only in historical records.
- **SC-002**: A live Pi session loads with zero extension-load failures.
- **SC-003**: The provenance checker and the spec-kit suite both pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A sweep edits a historical record | High — turns a true record false | Historical paths are enumerated in scope and excluded explicitly; a diff review checks them |
| Risk | Deleting the directory breaks the parity test | Medium — a red suite attributed to the wrong cause | The test is named in scope and updated in the same change |
| Risk | Generated indexes hand-edited | Medium — drift that returns on the next regeneration | Regenerate by generator; the diff shows generator output |
| Risk | Removal before capability lands | High — the models lose handling | Ordering enforced by the parent: this phase runs after 002-004 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether the provenance checker should keep a one-fork shape or be simplified further. Read it before deciding; simplification beyond removing the entry is out of scope here.
<!-- /ANCHOR:questions -->
