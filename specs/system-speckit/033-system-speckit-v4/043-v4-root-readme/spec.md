---
title: "Feature Specification: Phase 43: v4-root-readme"
description: "Audit and revise the repository root README.md to eliminate bloat, outdated v3 migration residue, misplaced sections, duplicate agent listings, empty FAQ entries, and formatting defects while aligning prose with Human Voice Rules and sk-create-readme standards."
trigger_phrases:
  - "v4 root readme"
  - "readme readability improvement"
  - "readme bloat removal"
  - "hvr readme audit"
  - "root readme refresh"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 43: v4-root-readme

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-20 |
| **Branch** | `scaffold/043-v4-root-readme` |
| **Parent Spec** | ../spec.md |
| **Phase** | 43 of 43 |
| **Predecessor** | 042-v4-doc-freshness |
| **Successor** | None |
| **Handoff Criteria** | README.md passes validate_document.py with zero errors, achieves substantial HVR clean-up, and this packet validates under validate.sh --strict |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 43** of the `system-speckit-v4` parent specification, focusing on the root `README.md` writing quality, readability, structural consistency, and bloat removal.

**Scope Boundary**: The root `README.md` and this spec packet (`specs/system-speckit/033-system-speckit-v4/043-v4-root-readme/`). Parent spec map rows in `../spec.md` are kept synchronized.

**Dependencies**:
- Preceding v4 phases establishing the current architecture: 040 (Gate 3 4-option merge), 041 (.skilled source root migration), and 042 (v4 doc freshness).
- Authoring standards: `sk-create-readme` and `sk-create-with-human-voice` (HVR).

**Deliverables**:
- Refreshed root `README.md` with improved readability, zero empty FAQ items, correct agent roster (12 agents), complete 13-skill inventory (including `sk-vision` and `sk-communication`), properly unnested Git Worktree section, eliminated dated v3 references, and HVR punctuation compliance.
- Completed Phase 43 spec packet with validated tasks, criteria, and implementation summary.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The root `README.md` has accumulated structural inconsistencies, stale migration residue, formatting defects, and AI writing patterns across successive v4 refactors:
1. Dual H1 headers at the top of the file and Unicode wide-space padding in header tables.
2. Two empty FAQ entries with questions and no answers (`How many MCP tools are there...` and `What is the feature catalog?`).
3. Misplaced sections: `Git Worktree / Continuous Integration` is incorrectly nested as an H4 under `### 🔌 Code Mode MCP`, and a paragraph about `stress-test/` is dropped under `#### CREATE` commands.
4. Duplicate agent listing: `Context Retrieval` is listed twice under different headings, causing 13 entries in a list introducing 12 agents.
5. Incomplete skill listings: `sk-vision` and `sk-communication` are omitted from the skills library and stack customization tables despite being active shipped skills.
6. Stale v3 migration residue: references to v3.3/v3.4 migrations, legacy `/doctor:mcp_install` notes, and dated remarks like "created after 2026-08-30".
7. Heavy punctuation tells: over 70 semicolons in prose, numerous Oxford commas, and instances of blocked words violating Human Voice Rules.

### Purpose

Deliver a clean, scannable, authoritative root `README.md` reflecting current v4 ground truth: single H1 with blockquote tagline, all 13 skills and 12 agents accurately represented, correct section hierarchy, populated FAQ entries, and readable prose adhering to Human Voice Rules without sacrificing any architectural or command precision.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Fix header hierarchy: single H1 with blockquote tagline and clean badge layout.
- Clean up table formatting: eliminate invisible Unicode ideographic spaces.
- Populate or resolve the two empty FAQ questions with verified v4 answers.
- Re-home `Git Worktree / Continuous Integration` to its own appropriate feature section.
- Relocate the misplaced `stress-test/` note out of the create command section to runtime verification context.
- Correct the agent network section to accurately reflect the 12 specialist agents without duplicate context entries.
- Add `sk-vision` and `sk-communication` to the skills library and stack customization tables.
- Remove obsolete v3 migration bookkeeping and historical cutoff dates.
- Clean up prose punctuation: replace semicolons and Oxford commas, eliminate word blockers like `harness` in prose.
- Validate `README.md` using `validate_document.py` and run HVR scans.

### Out of Scope

- Modifying runtime scripts, code files, or CLI commands.
- Altering existing spec packets outside 033-system-speckit-v4 / 043-v4-root-readme.
- Adding new commands or altering system architecture.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `README.md` | Modify | Root orientation, architecture guide, and quick start |
| `specs/system-speckit/033-system-speckit-v4/043-v4-root-readme/*` | Create/Modify | Phase 43 spec packet artifacts |
| `specs/system-speckit/033-system-speckit-v4/spec.md` | Modify | Update phase 43 scope and criteria in Phase Documentation Map |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Single H1 heading followed by a blockquote tagline in `README.md`, adhering to `sk-create-readme` general shape. |
| REQ-002 | Zero empty FAQ entries in `README.md`; provide verified, accurate v4 answers for all listed questions. |
| REQ-003 | Correct the agent roster to exactly the 12 specialized agents defined in `.skilled/agents/`, eliminating duplicate context entries. |
| REQ-004 | Re-home the Git Worktree / Live Sync section out of Code Mode MCP into its own feature subsection. |
| REQ-005 | Remove stale v3 migration notes, legacy command references (`/doctor:mcp_install`), and dated cutoff caveats. |
| REQ-006 | Represent all 13 active skills in the Skills Library and Customizing for Your Stack tables. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-007 | Eliminate Unicode wide-space formatting hacks in table headers. |
| REQ-008 | Comply with Human Voice Rules: eliminate semicolons in prose, remove Oxford commas, and eliminate blocked prose terms. |
| REQ-009 | Relocate misplaced `stress-test/` description from `/create:*` commands to Spec Kit runtime testing notes. |
| REQ-010 | Validate `README.md` with `validate_document.py` (exit 0) and validate packet with `validate.sh --strict`. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate_document.py README.md` returns exit 0 with 0 issues.
- **SC-002**: `hvr_scan.py README.md` reports 0 hard semicolons and 0 hard word blockers in prose.
- **SC-003**: The agent network section lists exactly the 12 agents without duplicates.
- **SC-004**: All 13 skills are documented across skills library and customization sections.
- **SC-005**: `validate.sh specs/system-speckit/033-system-speckit-v4/043-v4-root-readme --strict` passes with `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Inadvertent deletion of required command syntax or runtime facts | Loss of technical reference accuracy | Verify all command examples against `.skilled/commands/` and existing test playbooks before edits |
| Risk | Over-pruning architectural explanations | Reduced onboarding utility | Preserve the 5 analysis lenses, 5 gates diagram, deep-loop workflows, and advisor details |
| Dependency | `validate_document.py` and `hvr_scan.py` tooling | Verification requires scripts to run cleanly | Verified scripts exist and execute under Python 3 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Document validation executes in under 2 seconds.

### Security
- **NFR-S01**: No secrets, credentials, or private keys in documentation.

### Reliability
- **NFR-R01**: All internal links in README.md point to resolvable files in the repository.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Long URLs in badge and sponsor links: preserve intact without reformatting breakage.
- ASCII diagrams: preserve indentation and box-drawing characters without corrupting layout.

### Error Scenarios
- Link targets that moved during v4: ensure all links point to `.skilled/` paths instead of `.opencode/`.

### State Transitions
- Moving Git Worktree section: ensure no headers or cross-references are broken.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Edits centered on root README.md plus phase 43 packet documentation |
| Risk | 6/25 | Documentation changes only; easily reviewable and reversible via git |
| Research | 8/20 | Prior audit and v4 changelog analysis already established key drift points |
| **Total** | **24/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. All scope items and target improvements are identified.
<!-- /ANCHOR:questions -->

---
