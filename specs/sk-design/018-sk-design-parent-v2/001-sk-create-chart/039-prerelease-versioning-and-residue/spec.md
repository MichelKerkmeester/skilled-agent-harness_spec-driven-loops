---
title: "Feature Specification: Chart versions move below 1.0, and the cleanup's residue closes"
description: "The chart packet shipped twenty-two releases numbered as though it were public, and the corpus cleanup that removed the gallery and the worked deliveries left three live surfaces pointing at files that no longer exist. Both are closed here."
trigger_phrases:
  - "chart prerelease versioning"
  - "chart changelog renumber"
  - "chart deletion residue"
  - "leaf manifest stale chart"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Chart versions move below 1.0, and the cleanup's residue closes

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-10 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 39 of 39 |
| **Predecessor** | 038-chart-command-alignment |
| **Successor** | None |
| **Handoff Criteria** | Every gate in section 5 passes from the final state |
| **Origin** | Operator: "design chart was supposed to be prerelease so update changelogs so they are all pre v1.0.0.0" |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 39**, and it closes two things the preceding four phases opened.

**Scope Boundary**: the chart packet's own version numbers, and the live surfaces that named a file phases 36 and 37 deleted. Historical spec packets are records of what shipped and are deliberately not rewritten.

**Dependencies**:
- 036-evilcharts-only-and-open-tables removed the worked deliveries and the cursor Style Reference
- 037-remove-gallery removed the gallery and its build script
- 038-chart-command-alignment corrected the command files but not the hub metadata

**Deliverables**:
- Twenty-two changelog files renumbered below 1.0, with every citation of an old number moved with them
- Three manual-test scenarios repointed at files that exist
- The hub's leaf manifest and command metadata reconciled

**Changelog**:
- The renumber writes its own record. The last entry is `v0.22.0.0` and the packet's anchor follows it.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The chart packet numbered its releases from `v1.0.0.0` and reached `v2.5.0.0`, which reads as two public major versions with a breaking change between them. It has never been released. A number that claims stability the packet does not have is a promise to an adopter that nothing here keeps. Separately, the cleanup in phases 36 and 37 deleted fifteen files and never told the surfaces that named them: the hub's leaf manifest still listed all fifteen, three manual-test scenarios copied or read a delivery that is gone, and the hub's command metadata still advertised a form count three short of the corpus.

### Purpose
The version numbers say what the packet is, and every live surface names a file that exists.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Renumbering the twenty-two changelog files to `v0.1.0.0` through `v0.22.0.0` in release order
- Moving every in-body citation of an old number, inside the changelogs and in the two references that cite them
- Resetting the packet anchor and every child document version that inherits from it
- Repointing three manual-test scenarios off the deleted deliveries
- Re-minting the hub leaf manifest, and correcting the form count in the hub command metadata
- Regenerating the retrieval trigger index, which carries the renamed paths

### Out of Scope
- The eight historical spec packets that name an old changelog path in a Files-to-Change table. Each records an action taken against a file that existed then, and rewriting them would make a packet claim it created a file it did not create
- The three sibling design modes. Their anchors are their own and this change does not move them
- The version engine's explicit-path guard, which misfires on the playbook index file. Recorded in section 6 and not patched here

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/sk-design-chart/changelog/` | Modify | Twenty-two renames plus title, version and citation rewrites |
| `.opencode/skills/sk-design/sk-design-chart/SKILL.md` | Modify | The anchor moves to `0.22.0.0` |
| `.opencode/skills/sk-design/sk-design-chart/references/`, `manual-testing-playbook/`, `scripts/README.md` | Modify | Child versions inherit the new anchor |
| `.opencode/skills/sk-design/sk-design-chart/manual-testing-playbook/` | Modify | Three scenarios repointed at `assets/templates/` |
| `.opencode/skills/sk-design/leaf-manifest.json` | Modify | Re-minted from disk |
| `.opencode/skills/sk-design/command-metadata.json` | Modify | The catalog count |
| `.opencode/skills/system-spec-kit/runtime/data/trigger-index.json` | Modify | Regenerated with its manifest |
| `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md` | Modify | Two counts and the register claim |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The twenty-two changelog files are named `v0.1.0.0` through `v0.22.0.0` in release order, and each file's title and version field match its own name |
| REQ-002 | No citation of an old chart version survives on a live surface, and no citation that was never a chart version is moved |
| REQ-003 | The packet anchor is the highest changelog, and every in-scope child document carries a version derived from it |
| REQ-004 | Every path a live surface names resolves on disk |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | The hub reports no failing invariant, and the corpus check and unit suite pass from the final state |
| REQ-006 | The retrieval index and its manifest are regenerated together, so a lookup resolves the renamed files |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `parent-skill-check.cjs` on the hub reports zero invariant failures
- **SC-002**: `check-corpus.cjs` reports `RESULT: PASSED` and the unit suite passes with no failures
- **SC-003**: `frontmatter-version.mjs verify` reports no mismatch on the packet, and the repository-wide version gate exits zero
- **SC-004**: A lookup against the regenerated trigger index resolves a chart document, and no old changelog path remains in the corpus manifest
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A blanket search-and-replace moves a number that is not a chart version | Med | Only a `v`-prefixed four-part number is treated as this packet's own, which leaves a bare version inside a provenance example alone. Every rewritten line was read before the renames |
| Risk | The version engine rewrites documents outside the packet | Med | The apply was scoped to an explicit path list built from the packet's own rows, never to the hub |
| Risk | An adopter pinned to an old changelog filename | Low | The packet has never been released, which is the reason for the renumber |
| Dependency | The version engine's explicit-path guard | Low | It refuses `manual-testing-playbook.md` because the file name shares a prefix with its own directory. That one file was set by hand to the value the engine computed. The guard is a defect in a shared script and is reported, not patched here |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No runtime path changes, so the packet carries no performance target

### Security
- **NFR-S01**: No credential, network or permission surface is touched

### Reliability
- **NFR-R01**: Every change is a tracked file, so `git checkout` restores the prior state in one command
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A version that is not this packet's: left alone, because only a `v`-prefixed number is remapped
- A document with no frontmatter: skipped and reported by the engine rather than given one
- A document outside the engine's scope: set by hand using the same edit-count formula

### Error Scenarios
- The engine refuses an explicit path: the file is set by hand to the computed value and the refusal is recorded
- A rename collides: impossible here, because every source is a `v1` or `v2` name and every target is a `v0` name

### State Transitions
- Partial completion: the renames are staged as renames, so a half-applied state is visible in `git status` rather than silent
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Forty-six files, one hundred and two hand-authored lines, one packet |
| Risk | 6/25 | Documentation and version fields only, no runtime path |
| Research | 4/20 | The anchor rule and the engine scope had to be read before acting |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Whether the eight historical spec packets that name an old changelog path should carry a pointer to the new name is left to the operator. Rewriting them falsifies a record, and leaving them means a reader following a Files-to-Change entry finds nothing.
<!-- /ANCHOR:questions -->

---
