---
title: "Feature Specification: Legacy-era report and detection"
description: "Five independent signals mark a pre-v4 repo: the old layout, documents without frontmatter, documents with no or legacy template markers under drifting header names, packets with no generated metadata, and packets older than their level's document set. These signals exist in different tools. A unified read-only report combines them with an explicit exclusion list."
trigger_phrases:
  - "legacy era report"
  - "phase 8 legacy era report"
  - "pre-v4 detection"
  - "repo era detection"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Legacy-era report and detection

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-10-08 |
| **Branch** | `worktrees/091-consolidate-small-packets` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 16 |
| **Predecessor** | 007-ci-rule-set-comparison |
| **Successor** | 009-doctor-update-compatibility |
| **Handoff Criteria** | The era report module reads and classifies every packet at corpus scale, using one shared classifier with an explicit exclusion list and normalizing header names through an alias table. Phase 9 integrates the report into the doctor workflow. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the Research recommendations specification. Phase 14's research identified five independent signals of pre-v4 repos and found them scattered across different tools with different output shapes. A unified report should combine them so external users and the operator can understand the corpus state before running a upgrade or repair.

**Scope Boundary**: A new read-only module that walks the spec tree once, classifies each packet or directory, and reports what era signals exist with counts per class.

**Dependencies**:
- Phase 14's documented signals and exclusion categories.
- The existing corpus walk in `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs`, specifically the `gitIgnoredPaths` helper at :200-211 and `isExcludedDirectory` at :175-179.

**Deliverables**:
- A shared packet classifier with an explicit exclusion list for research lineages, artifact trees (research/review/context), and changelog directories.
- A header alias table to normalize drifting document header spellings.
- A read-only report module used by `/doctor:update check` and `upgrade-legacy`'s preflight. The weekly sweep is an optional caller added separately.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Pre-v4 repos hold five independent era signals: the old `.opencode/specs` layout, documents with no frontmatter, documents without template markers or with legacy markers under drifting header names, packets with no generated metadata and packets older than their level's document set. Each signal already exists in a different tool with different output. A raw `find` over `specs/` counts the run's own containment copies and inflates directory counts (2,281 real archived packets became 8,198 directories counted). External users cannot see which signals affect their repo, and internal tools cannot normalize the signals to plan repairs.

### Purpose
One shared report combines all five signals with a classifier that excludes known non-packet directories, normalizes header aliases and enables `/doctor:update check` to show the era state as part of a compatibility assessment.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A packet classifier that walks `specs/` once and identifies whether each folder is a packet, non-packet, or excluded.
- An exclusion list covering research lineages (depth: `*/lineages/`), artifact trees (depth: `*/research/`, `*/review/`, `*/context/`), changelog directories (named `z_archive/00-changelog` pattern), and Git-ignored paths.
- A header alias table to map the three spellings of the implementation-summary document and other variants (`impl-summary-core`, `implementation-summary-core`, `implementation-summary`, `resource-map` v1.1 vs v2.2).
- A read-only era report with counts per signal: layout (v3 `.opencode/specs` vs v4 `specs/`), frontmatter presence, template marker status, generated metadata presence, level-vs-document-age.
- Integration into `upgrade-legacy.mjs` preflight and `/doctor:update check` presentation.

### Out of Scope
- Repairing any corpus state. The report is read-only.
- Changing validation rules.
- Modifying archive behavior.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/repo-era.mjs` | Create | Packet classifier, exclusion list, header alias table, era report generator |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs` | Modify | Call the era report in preflight section, route findings to appropriate repair stages |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md` | Modify | Document the era signals and how each one is detected |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/*.vitest.ts` | Create/Modify | Test the classifier on packets with each era signal, exclusion cases, and alias normalization |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The classifier walks the tree once and correctly identifies packets, non-packets and excluded directories at corpus scale |
| REQ-002 | Layout detection finds a v3 `.opencode/specs` home and distinguishes it from v4 `specs/` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | Header aliases normalize the three implementation-summary spellings and other variants so missing-document repairs route correctly |
| REQ-005 | The era report counts packets with each signal: frontmatter present/missing, template marker status (new/legacy/none), generated metadata present/stub/missing, level match/mismatch |
| REQ-006 | The spec-kit CLI test suite passes with no new failure |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The classifier walks the fixture without duplicates and exclusion filters work on all four exclusion types.
- **SC-002**: The era report counts and reports each of the five pre-v4 signals independently on fixture examples.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Corpus walk in `corpus.mjs` | Must handle git-ignored paths correctly | Use the same path filter as `lib/corpus.mjs` already implements |
| Risk | Exclusion list becomes a maintenance burden | High | Document the list with rationale and keep it as simple as possible |
| Risk | New packet naming conventions break the classifier | Med | The classifier should be evidence-based (looking for spec.md and graph-metadata.json) rather than pattern-based |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Classifier is synchronous and single-threaded. Time budget is an open question.

### Reliability
- **NFR-R01**: Every packet counted exactly once; no duplicates from symlinks or git submodules.
- **NFR-R02**: Exclusion list never silently drops a real packet.

### Maintainability
- **NFR-M01**: Exclusion list and header aliases are separate data structures, testable independently.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Folder Classification
- Empty `specs/` directory: Report zero packets.
- Folder with spec.md but no graph-metadata.json: Classify as old-format packet.
- Folder matching exclusion pattern but named differently: Do not exclude; report as packet.

### Header Normalization
- Document with `impl-summary-core` header: Alias to `implementation-summary` and route correctly.
- Document with multiple header variants: Report which variant exists.
- Missing document: Alias table provides the expected name so missing-document repair can report it.

### Signal Detection
- Packet with frontmatter but no version stamp: Count as frontmatter present.
- Document with no frontmatter and no template marker: Count as both missing frontmatter and no marker.
- Packet with one level document and one non-level document: Count the level mismatch only on level-bearing documents.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | New module with clear inputs (specs tree) and outputs (era report data). Classifier logic is straightforward. |
| Risk | 8/25 | Read-only tool, no mutations. Main risk is exclusion logic being too broad or too narrow. |
| Research | 5/20 | Research already identified the five signals and the exclusion categories (completed in Phase 14). |
| **Total** | **25/70** | **Level 2 - Planning** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:related -->
## 9. RELATED DOCUMENTS

- **Research**: section 11 row SH-09 in `../../014-spec-auto-healing-research/research/research.md` - the five pre-v4 signals, corpus exclusion categories, and the three entry points for the era report
- **Parent Packet**: `../spec.md` and `../goal.md` - Phase 8 of 16, handoff to Phase 9

<!-- /ANCHOR:related -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should the classifier detect v3 layout even if `.opencode/specs` has already been moved to `specs/`? (Answer: Yes, look for evidence in description.json files.)
- Which non-packet directories besides lineages, scratch, and changelog should the exclusion list cover? (Answer: None identified yet; test with real repos.)
- What time budget should the corpus walk have? (Not recorded: performance is not a blocker for Phase 8.)
<!-- /ANCHOR:questions -->

---


