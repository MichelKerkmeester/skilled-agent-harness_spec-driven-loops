---
title: "Feature Specification: Phase 3: leaf-manifest-and-doctrine-reachability"
description: "The leaf-manifest generator resolves symlinked references, so the twelve sk-code doctrine leaves it skipped are typed and reachable, and a link that cannot become a leaf is reported rather than dropped."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: leaf-manifest-and-doctrine-reachability

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-09-15 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 9 |
| **Predecessor** | 003-version-authority |
| **Successor** | 005-catalog-and-readme-truth |
| **Handoff Criteria** | [To be defined during planning] |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Remediate the alignment review findings specification.

**Scope Boundary**: [To be defined during planning]

**Dependencies**:
- [To be defined during planning]

**Deliverables**:
- [To be defined during planning]

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The generator skipped any directory entry that was not a plain file, and a symlink never reports as one, so every symlinked reference was invisible. Twelve sk-code doctrine files, the implement, debug and verify workflow docs shared across four surface packets, were absent from the manifest. The freshness gate walked with the same rule, so it regenerated the same incomplete output and passed green over the gap.

### Purpose
A symlinked reference is a leaf like any other, and a link that cannot be one is reported.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Symlink resolution in the generator, with the traversal owned by the generator so the gate cannot diverge from it
- Reported errors for a broken link, a link escaping the skill root and a link targeting a directory
- The regenerated sk-code manifest and five tests over the traversal

### Out of Scope
- The manifest contract's shape - a link is emitted as the path a consumer stats, which needs no contract change
- The other twelve manifests - byte-identical after regeneration

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs` | Modify | Links resolve to the link's own packet-relative path; three unreachable-link classes reported |
| `.opencode/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs` | Modify | Traversal delegated to the generator, so a second walk cannot diverge |
| `.opencode/skills/sk-code/leaf-manifest.json` | Regenerate | Twelve doctrine leaves added |
| `.opencode/skills/sk-doc/sk-create-skill/scripts/tests/ci-leaf-manifest-freshness.test.cjs` | Modify | Five traversal tests |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A symlinked reference pointing at a file inside the skill tree is emitted as a leaf under the link's own path |
| REQ-002 | A broken link, a link escaping the skill root and a link targeting a directory are each reported with a named error, never skipped |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The generator and the freshness gate share one traversal, so the gate cannot pass on output the generator would not produce |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The four sk-code surface packets each gain their three doctrine leaves, twelve in total, and a consumer-style stat resolves all twelve
- **SC-002**: The freshness and metadata gates pass, and the deep-loop suite exits zero
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A link marker would need a contract bump | Avoided | Consumers resolve leaves by path with a follow-stat, so an in-tree link is transparent and needs no new shape |
| Risk | The gate diverging from the generator again | Closed | The gate now calls the generator's traversal |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: One realpath per skill root; link resolution is per entry

### Security
- **NFR-S01**: A link escaping the skill root is refused, so a manifest cannot name a file outside its skill

### Reliability
- **NFR-R01**: An unreadable link target still produces a message rather than an exception
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- In-tree link: a leaf under the link's own path
- Link to a directory: reported as unsupported
- Broken link: reported

### Error Scenarios
- Link escaping the skill root: reported, not emitted

### State Transitions
- Not applicable
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Two scripts, one manifest, one test file |
| Risk | 10/25 | Every hub's leaf manifest passes through this walker |
| Research | 4/20 | The consumer resolution style had to be read before choosing the entry shape |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None open.
<!-- /ANCHOR:questions -->

---


