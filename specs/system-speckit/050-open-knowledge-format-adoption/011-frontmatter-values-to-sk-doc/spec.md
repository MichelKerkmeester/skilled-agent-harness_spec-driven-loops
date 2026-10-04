---
title: "Feature Specification: Phase 11: frontmatter-values-to-sk-doc"
description: "The shared contextType and importance_tier value list sits inside system-spec-kit, while sk-create-frontmatter owns the frontmatter contract it describes. This phase moves the document values and tiers to sk-create-frontmatter, keeps the session list in spec-kit, and repoints all four readers."
trigger_phrases:
  - "frontmatter values move"
  - "frontmatter value list owner"
  - "sk-create-frontmatter value list"
  - "session context types literal"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 11: frontmatter-values-to-sk-doc

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-04 |
| **Branch** | `worktrees/086-okf-adoption-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 11 of 11 |
| **Predecessor** | 010-source-tag-hardening |
| **Successor** | None |
| **Handoff Criteria** | All four readers load the list from `sk-create-frontmatter/assets/frontmatter-values.json`, the old file is gone and every check that passed before still passes. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 11** of the R1 R5 R9 adoption across spec-kit and sk-doc specification.

**Scope Boundary**: Where the value list lives and how its four readers find it. The values themselves do not change, and no spec doc is rewritten.

**Dependencies**:
- Phase 003's list and readers, and phase 008's measured result of 0 warnings across the corpus.

**Deliverables**:
- `sk-create-frontmatter/assets/frontmatter-values.json` holding the document values and the tiers.
- The session list as a literal in `context-types.ts`.
- The four readers repointed, the old file deleted, and every doc that names the path updated.
- `decision-record.md` amending root decision D1.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`sk-create-frontmatter` owns the frontmatter contract, but the list of allowed `contextType` and `importance_tier` values lives in `system-spec-kit/shared/frontmatter-values.json`. sk-doc's own checker has to reach into spec-kit to learn which values its contract allows. The same file also holds the session list, which classifies saves and is spec-kit's alone.

### Purpose
The document values and tiers live with the skill that owns the frontmatter contract, spec-kit reads them from there, and the session list stays in spec-kit.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A new `frontmatter-values.json` in `sk-create-frontmatter/assets/` with `contextType` and `importanceTier`, each a canonical list and an alias map.
- `SESSION_CONTEXT_TYPES` as an 11-value literal in `context-types.ts`.
- A runtime read in `context-types.ts` that finds the file from both the source folder and the built `dist/` folder.
- The spec-kit rule helper, the sk-doc validator and the advisor checker repointed.
- Every live doc, command and uncommitted changelog that names the old path.

### Out of Scope
- Changing any value or alias - the lists move unchanged.
- Rewriting existing spec docs - phase 008 found 0 off-list values outside `z_archive/`.
- Past phase docs and `scratch/` evidence that record the old path - they describe what was true then.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-values.json` | Create | Document values and tiers |
| `.skilled/skills/system-spec-kit/shared/frontmatter-values.json` | Delete | Untracked file from phase 003 |
| `.skilled/skills/system-spec-kit/shared/context-types.ts` | Modify | Runtime read, session literal |
| `.skilled/skills/system-spec-kit/shared/tsconfig.json` | Modify | Drop the JSON from `include` |
| `.skilled/skills/system-spec-kit/runtime/cli/rules/check-frontmatter-values-helper.cjs` | Modify | New path |
| `.skilled/skills/system-spec-kit/runtime/cli/rules/check-frontmatter-values.sh` | Modify | Comment and remediation text |
| `.skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json` | Modify | Rule description |
| `.skilled/skills/sk-doc/shared/scripts/validate_document.py` | Modify | New path and owner comment |
| `.skilled/skills/system-skill-advisor/runtime/scripts/check-skill-doc-frontmatter.mjs` | Modify | New path |
| Tests, commands, references, catalogs, playbooks, changelogs | Modify | Path and owner wording |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `sk-create-frontmatter/assets/frontmatter-values.json` holds the same document canonical values, document aliases, tiers and tier aliases as the old file, and no session list. |
| REQ-002 | The old `system-spec-kit/shared/frontmatter-values.json` is gone and no live file outside `specs/` names it. |
| REQ-003 | `context-types.ts` exports the same sets and maps as before, read from the new file at run time, and `SESSION_CONTEXT_TYPES` holds the same 11 values as a literal. |
| REQ-004 | The spec-kit build passes, and the built `dist/context-types.js` loads and exports the same values. |
| REQ-005 | The shared tests, the CLI vitest suite, the sk-doc Python tests and the advisor checker test pass with no fewer passing tests than before. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | With the file missing, each reader behaves as it did before the move: the TypeScript module, the rule helper and the advisor checker fail and name the new path, and `validate_document.py` stays silent, as its tests require. |
| REQ-007 | The corpus sweep from phase 008 gives both checkers the same warnings as their baseline, line for line. |
| REQ-008 | `sk-create-frontmatter`'s `SKILL.md` and `README.md` say it owns the list, and root decision D1 carries an amendment pointing here. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: One file in `sk-create-frontmatter` decides which document values and tiers every checker accepts.
- **SC-002**: Every check gives the same result before and after the move.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The `dist/` build of `@spec-kit/shared` | The save runtime imports the built module | Build, then load `dist/context-types.js` and compare its exports |
| Risk | The runtime read finds the wrong folder from `dist/` | High | Walk up from the module's folder to `.skilled/skills` and test from both folders |
| Risk | A reader still names the old path | Med | `rg` for the old path after the change, outside `specs/` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The list is read once per process.
- **NFR-P02**: No reader gets measurably slower.

### Security
- **NFR-S01**: The readers open only the one JSON file.
- **NFR-S02**: No new dependency.

### Reliability
- **NFR-R01**: A missing or malformed file stops the reader with a named error, never an empty list.
- **NFR-R02**: The values are byte-for-byte the same lists as before.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- File missing: the TypeScript module, the rule helper and the advisor checker fail and name the new path. `validate_document.py` stays silent, as before.
- File malformed: each reader fails.
- An extra key in the file: ignored.

### Error Scenarios
- Run from `dist/`: the walk-up finds the same file.
- Run from a worktree: the path is relative to the module, so it resolves inside that worktree.
- The shell rule's helper fails: the rule keeps its exit 2.

### State Transitions
- Half-moved state: the old file is deleted only after every reader passes on the new one.
- Rollback: restore the old file and the readers, all uncommitted.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Four readers and about 20 docs |
| Risk | 8/25 | The save runtime's import path |
| Research | 2/20 | Settled in the previous turn |
| **Total** | **20/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. The operator approved the split on 2026-10-04.
<!-- /ANCHOR:questions -->

---
