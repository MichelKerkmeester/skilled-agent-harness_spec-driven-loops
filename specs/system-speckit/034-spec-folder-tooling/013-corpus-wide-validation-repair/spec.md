---
title: "Feature Specification: Corpus-wide validation repair"
description: "About 2,000 live and archived packets failed strict validation, and archived packets still carried template default trigger phrases. This phase cleans the archive's phrases and repairs every packet until the whole corpus passes."
trigger_phrases:
  - "corpus wide validation repair"
  - "phase 13 corpus wide validation repair"
  - "archived packet validation repair"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Corpus-wide validation repair

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-07 |
| **Branch** | `worktrees/091-consolidate-small-packets` |
| **Parent Spec** | ../spec.md |
| **Phase** | 13 of 15 |
| **Predecessor** | 012-template-phrase-cleanup-round-two |
| **Successor** | 014-spec-auto-healing-research |
| **Handoff Criteria** | Every packet under `specs/`, live and archived, reports RESULT: PASSED under strict validation, or is listed with the reason it cannot |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 13** of the spec folder tooling parent. After Phase 12 the operator asked whether every historic packet, archive included, had been checked and fixed. It had not, and the operator chose to clean and fix everything.

**Scope Boundary**: every folder under `specs/` whose name follows the `NNN-slug` packet pattern, live and under `z_archive/`. Backup snapshots, test fixtures and review scopes that also hold a `spec.md` are not packets and stay untouched.

**Dependencies**:
- Phase 12's cleanup tool, run with `--include-archive`.
- `repair-derived.cjs` for the metadata it can recompute.

**Deliverables**:
- The archive's template phrases removed, every packet's derivable metadata repaired, structural defects fixed, and missing documents reconstructed with a dated note.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A baseline over all 4,371 packets found 2,046 failing strict validation: 1,935 of the 2,198 archived packets and 111 of the 2,173 live ones, besides 37 non-packet folders. Most archived packets still recorded their pre-archive paths, many documents carried duplicate or missing anchors, and 102 packets lacked documents their level requires. Archived packets also kept 470 files of template default trigger phrases.

### Purpose
Every packet, live or archived, passes strict validation, and no packet is indexed under a template's placeholder phrases.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The phrase cleanup over archived packets.
- Recomputable metadata: `description.json` `specFolder` and everything `repair-derived.cjs` re-derives.
- Structure: duplicate, overlapping and missing anchors, template headers, missing frontmatter fields, generic trigger phrases, scaffold placeholders left in continuity blocks.
- Broken links, pointed at the moved file or reduced to plain text.
- Missing required documents, reconstructed from the packet's own `spec.md` and its git history and marked as reconstructed.

### Out of Scope
- Changing what any document says. Fixes add or move structure only, apart from reconstructed documents.
- Folders that are not packets: backup snapshots, fixtures and review scopes.
- The validator's rules themselves.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/**` packets | Modify | Phrases, metadata, structure and links |
| `specs/**` packets missing required documents | Create | Reconstructed `plan.md`, `tasks.md` or `implementation-summary.md` |
| `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` | Regenerate | Rebuilt from the final corpus |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | No packet that passed the baseline fails afterwards |
| REQ-002 | No fix changes what an existing document says, and every reconstructed document carries the dated reconstruction note and marks unknowns as not recorded |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | Every packet, live and archived, passes strict validation |
| REQ-004 | No live or archived packet carries a template default trigger phrase |
| REQ-005 | Non-packet folders are left exactly as committed |
| REQ-006 | The trigger index is rebuilt and its check finds nothing stale |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A full strict validation run over all 4,371 packets reports RESULT: PASSED for each, or lists each exception with its reason.
- **SC-002**: The census reports 0 template carriers, live and archived.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A reconstructed document reads as a record written at the time | High | A dated note opens every reconstructed document, and unknowns are written as not recorded |
| Risk | Thousands of edits hide a content change | High | Scripts change only marker lines, fields and paths, lanes are told to change structure only, and diffs are sampled |
| Risk | Parallel lanes edit the same file | Med | Each lane edits only files directly inside its own folders |
| Dependency | DeepSeek lanes through cli-pi | A failed lane writes nothing | Each lane's folders are re-validated, never trusted from the lane's report |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: A full corpus validation finishes in under 30 minutes at ten in parallel.

### Security
- **NFR-S01**: No fix writes outside `specs/` apart from the regenerated trigger index.

### Reliability
- **NFR-R01**: Every scripted fix is idempotent, and a dry run comes before each apply.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A phase parent's validation also reports its children's issues, so each issue is fixed in the folder that owns the file.
- A file with no frontmatter gets frontmatter only when a rule requires it.

### Error Scenarios
- A link whose target no longer exists anywhere keeps its text and loses only the link.

### State Transitions
- An archived packet keeps its status. Only structure and metadata change.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 22/25 | About 4,400 folders and several thousand files |
| Risk | 18/25 | Mass edit of historical records, gated by baseline and re-validation |
| Research | 6/20 | Failure classes come from the baseline run |
| **Total** | **46/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The operator chose to fix everything and to reconstruct missing documents with a clear mark.
<!-- /ANCHOR:questions -->

---
