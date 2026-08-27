---
title: "Feature Specification: Phase 2: tasks-checklist-merge [template:level-1/spec.md]"
description: "tasks.md and checklist.md are two required docs with overlapping completion signals; deriveStatus silently ignores tasks checkboxes whenever checklist.md exists. Merge them into one unified doc (Tasks + Verification Checklist + Testing Checklist) without regressing status derivation for the shipped fleet."
trigger_phrases:
  - "tasks checklist merge"
  - "unified verification doc"
  - "deriveStatus checklist"
  - "template merge"
  - "spec core"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "036-spec-doc-template-reduction/002-tasks-checklist-merge"
    last_updated_at: "2026-08-26T06:45:00Z"
    last_updated_by: "design-author"
    recent_action: "Merge attempt reverted: check-anchors flags 9 while compare reports clean"
    next_safe_action: "Isolate the check-anchors vs compare divergence before re-attempting the merge"
    blockers:
      - "check-anchors ANCHORS_VALID flags 9 base verification anchors on shipped L2+ packets while compare reports them optional at every level"
    key_files:
      - ".opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl"
      - ".opencode/skills/system-spec-kit/scripts/rules/check-anchors.sh"
      - ".opencode/skills/system-spec-kit/scripts/utils/template-structure.js"
      - ".opencode/skills/system-spec-kit/templates/manifest/spec-kit-docs.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "design-036-002-tasks-checklist-merge"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Why does ANCHORS_VALID flag 9 verification anchors while compare reports them optional at every level?"
      - "Does a full generate-context.js save rewrite _memory blocks in multiple docs or only implementation-summary?"
    answered_questions:
      - "Which validator surfaces read checklist.md? (5 confirmed in research)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: tasks-checklist-merge

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-08-26 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 6 |
| **Predecessor** | 001-analysis |
| **Successor** | 003-template-dedup |
| **Handoff Criteria** | Merged unified template renders byte-identically for unchanged levels; deriveStatus resolves identical status for the shipped fleet via a legacy checklist read-path; golden snapshots green; both dist trees rebuilt. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the template-reduction packet. It implements the owner directive to fold `tasks.md` and `checklist.md` into ONE unified authoring template carrying **Tasks + Verification Checklist + Testing Checklist**. The design is grounded in the 001-analysis research (Ox Alpha lineage, recommendation R3).

**Scope Boundary**: Template + manifest + the five validator/derivation surfaces that read `checklist.md`. No changes to unrelated templates, and no content-router anchor changes (tasks anchors are untouched by the merge).

**Dependencies**:
- The byte-identical render gate and golden-snapshot harness (reused from packet 033 ADR-004).
- A legacy `checklist.md` read-path in status derivation, so shipped L2+ packets do not regress.

**Deliverables**:
- Unified template replacing the separate tasks/checklist templates, level-gated so the verification/checklist sections appear at L2+.
- Co-updates to the manifest and the five reader surfaces.
- Green golden snapshots + rebuilt dist + fleet spot-check evidence.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`tasks.md` and `checklist.md` are two separately required documents whose completion signals overlap: research confirmed task rows duplicate checklist item intent, and `deriveStatus` ranks `implementation-summary > checklist > tasks`, so whenever `checklist.md` exists its checkboxes are counted and the `tasks.md` checkboxes are ignored. Maintaining two documents doubles authoring cost and creates a silent divergence hazard in status derivation.

### Purpose
Fold both into one unified verification-and-task document so an author (including a small model) tracks work, verification, and testing in a single place — without changing the status derived for any already-shipped packet.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A unified authoring template holding Tasks (all levels) + Verification Checklist + Testing Checklist (gated at L2+, preserving today's manifest semantics).
- Manifest change so the merged doc replaces the separate `checklist.md` addon while keeping `CHK-NNN [P0/P1/P2]` id semantics.
- Co-updates to the five confirmed reader surfaces (see Requirements).
- A LEGACY read-path so shipped packets that still carry a standalone `checklist.md` derive identical status.

### Out of Scope
- `decision-record.md` dedup (that is phase 003, recommendation R1) — separate versioned change.
- Instructional-comment relocation (phase 005, R2) and `_memory.continuity` consolidation (phase 004, R4).
- Any content-router anchor change — the merge leaves task/checklist anchor targets and the routing map untouched.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| templates/manifest/tasks.md.tmpl | Modify | Absorb the verification + testing checklist sections as L2+-gated addenda |
| templates/manifest/checklist.md.tmpl | Delete/retire | Its content moves into the unified doc; retained only as a legacy read-path artifact if required |
| templates/manifest/spec-kit-docs.json | Modify | Retarget the L2/3/3+ checklist addon rows and sectionGates to the unified doc |
| mcp-server/lib/graph/graph-metadata-parser.ts | Modify | deriveStatus combined evaluation + legacy checklist read-path (lines ~1178-1266) |
| mcp-server/lib/validation/orchestrator.ts | Modify | detectLevel signal (~157-171) + PRIORITY_TAGS retarget (~550-561) |
| scripts/rules/check-ac-coverage.sh | Modify | Filename bindings (~54,57,198-200): prefer merged matrix, fall back to legacy checklist |
| scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap | Modify | Reviewed re-baseline for the merged doc; empty diff for all other level×doc renders |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Unified template carries Tasks (all levels) + Verification Checklist + Testing Checklist gated at L2+ | **Given** an L1 scaffold, the render shows tasks only; **Given** an L2/L3/L3+ scaffold, the render shows tasks + verification + testing sections |
| REQ-002 | No status regression for the shipped fleet | **Given** every already-shipped L2+ packet, deriveStatus returns the same status before and after the change (legacy checklist read-path exercised) |
| REQ-003 | All five reader surfaces co-updated in one versioned change | **Given** the manifest, detectLevel, PRIORITY_TAGS, deriveStatus, and check-ac-coverage bindings, each resolves against the unified doc (with legacy fallback) with no dangling checklist.md reference |
| REQ-004 | Byte-identical render preserved for every unchanged level×doc | **Given** the golden-snapshot suite, all renders except the merged doc produce an EMPTY diff; the merged doc gets a reviewed re-baseline |
| REQ-005 | Both dist trees rebuilt; strict validation green on representative packets | **Given** a rebuilt scripts/dist and mcp-server/dist, `validate.sh --strict` passes on fresh L1/L2/L3 scaffolds and a shipped legacy packet |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | `CHK-NNN [P0/P1/P2]` id format and priority-tag semantics preserved in the merged doc | **Given** PRIORITY_TAGS, the rule finds P0/P1/P2 tags in the unified doc exactly as it did in checklist.md |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A single unified template replaces the tasks + checklist pair; render is level-gated (tasks-only at L1, +verification/testing at L2+).
- **SC-002**: Zero status regressions across the shipped fleet, proven by a before/after deriveStatus comparison over representative L2+ packets.
- **SC-003**: Golden snapshots green (empty diff except the reviewed merged-doc re-baseline); both dist trees rebuilt; `validate.sh --strict` clean on L1/L2/L3/legacy.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Legacy checklist read-path omitted | High — every shipped L2+ packet flips status to in_progress | Land the legacy read-path in deriveStatus FIRST; prove with a before/after fleet comparison |
| Risk | AC_COVERAGE bindings point only at the merged matrix | Medium — the AC gate goes dark-but-non-blocking on old packets | check-ac-coverage prefers merged matrix, falls back to legacy checklist; advisory severity limits blast radius |
| Risk | Snapshot re-baselined with `-u` without diff review | Medium — defeats the byte-identical safety proof | Reviewed diff IS the gate; only the merged doc may change, every other render stays empty-diff |
| Dependency | Stale mcp-server/dist after source edits | High — validate.sh exits 3 (stale compiled orchestrator) | Rebuild both dist trees before any completion claim |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **BLOCKER (must solve first): `check-anchors.sh` (ANCHORS_VALID) vs `compare` divergence.** A first implementation attempt merged the verification sections into `tasks.md.tmpl` with `L2:`/`L3+:`-prefixed headers so the derivation marks them optional. Result on a shipped L2+ packet: L1 renders byte-identically, `TEMPLATE_HEADERS` passes, and `template-structure.js compare <level> tasks.md <file> anchors` reports all 15 verification anchors as `optional_anchor` with **zero** `missing_anchor`/`out_of_order_anchor` at levels 2, 3, and 3+ — yet `ANCHORS_VALID` still fails with **9** issues (the 9 base verification anchors), A/B-proven to be caused solely by the `tasks.md.tmpl` change. The `compare`-clean-but-`ANCHORS_VALID`-9 divergence is the thread to pull: `check-anchors.sh` has a second code path beyond `compare_required_anchors` (pairing/order block, lines ~100-172) and its standalone run needs the `is_phase_parent` shared function loaded to behave correctly. Isolate why `check-anchors` diverges from `compare` before re-attempting the template merge.
- The header-prefix approach (`L2:` on base verification sections) makes them optional-in-contract but changes rendered titles to `## L2: Verification Protocol`; if that reads poorly, the alternative is a folder-aware `check-anchors`/`check-template-headers` change (require the verification anchors in `tasks.md` only when the folder has no legacy `checklist.md`).
- Does a full `generate-context.js` save rewrite `_memory` blocks across multiple docs, or only `implementation-summary.md`? (Confirm before phase 004; does not block this phase.)
- Should the retired `checklist.md.tmpl` be deleted outright or retained as a documented legacy read-path artifact for old packets? (Decide during planning.)
<!-- /ANCHOR:questions -->

---
