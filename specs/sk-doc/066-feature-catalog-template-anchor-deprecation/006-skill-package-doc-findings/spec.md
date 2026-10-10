---
title: "Feature Specification: Phase 6: skill-package-doc-findings"
description: "The strict skill package check failed on six touched units for content reasons: four descriptions over 130 characters, a sk-vision section name and a stale plugin path, and human-voice blockers in a feature catalog reference. This phase fixes those docs and records why the rest are dropped or handed off."
trigger_phrases:
  - "skill package doc findings"
  - "phase 6 skill package doc findings"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 6: skill-package-doc-findings

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-10 |
| **Branch** | `worktrees/096-feature-catalog-anchor-deprecation` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 7 |
| **Predecessor** | 005-changelog-version-keys |
| **Successor** | 007-sk-code-script-kebab-names |
| **Handoff Criteria** | The six units this phase touches pass `package_skill.py --check --strict` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the feature catalog template-anchor deprecation. It remediates pre-existing findings that phases 1 and 2 surfaced.

**Scope Boundary**: the frontmatter and prose of cli-hermes, mcp-magicpath, mcp-mobbin, mcp-refero and sk-vision SKILL.md files, the sk-create-feature-catalog examples reference, and the version carriers and new entries of those six units.

**Dependencies**:
- None. The edits change wording, a section name and one path.

**Deliverables**:
- Four descriptions at or under 130 characters
- sk-vision INTEGRATION POINTS and RELATED RESOURCES sections with the real plugin path
- An examples reference with no human-voice hard blockers
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`package_skill.py --check --strict` failed cli-hermes, mcp-magicpath, mcp-mobbin and mcp-refero on descriptions longer than 130 characters. sk-vision named its section INTEGRATION instead of INTEGRATION POINTS, had no RELATED RESOURCES section and pointed at `.skilled/plugins/sk-vision.js`, which does not exist. The sk-create-feature-catalog examples reference carried em dashes and semicolons that the human-voice scan reports as hard blockers.

### Purpose
Every unit this phase touches passes the strict package check on its own content.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Shorten four frontmatter descriptions without losing the routing nouns
- Rename the sk-vision section, add RELATED RESOURCES and point the plugin path at `.opencode/plugins/sk-vision.js`
- Rewrite the em dash and semicolon sentences in the examples reference
- Patch-bump the six units

### Out of Scope
- Parent hub recommended sections - the canonical hub scaffold has five sections, so the validator needs to be hub-aware, handed off
- SKILL.md word counts between 3,000 and 5,000 - a warning only, and a rewrite risks routing text
- Fixture JSON in mcp-mobbin and mcp-refero references, `.txt` files read by sk-git hooks and `.ts` scripts in deep-research and deep-review - cited by tooling, so the validator rule needs the exemption, handed off
- sk-code `2_javascript` fixture folders - the Webflow detection marker, handed off
- Snake_case sk-code script names - their own phase

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| Four mode `SKILL.md` files (cli-hermes, mcp-magicpath, mcp-mobbin, mcp-refero) | Modify | Shorter description |
| `.skilled/skills/sk-vision/SKILL.md` | Modify | Section name, plugin path, RELATED RESOURCES |
| `.skilled/skills/sk-doc/sk-create-feature-catalog/references/examples.md` | Modify | Human-voice fixes |
| Six unit version carriers and `changelog/v*.md` entries | Modify and create | Patch bump |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Each of the six units passes `package_skill.py --check --strict` |
| REQ-002 | The examples reference reports zero human-voice hard blockers |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | Every owning skill or mode whose shipped files changed is patch-bumped once, and each hub's bump is recorded as a handoff |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `package_skill.py --check --strict` prints Result: PASS for all six units.
- **SC-002**: `hvr_scan.py` on the examples reference prints hard blockers 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A shorter description drops routing vocabulary | Med | Each kept the transport, the tool and the paired skill |
| Risk | A dropped finding looks fixed | Low | Every drop and handoff is listed with its reason |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Not applicable. Documentation and metadata only.
- **NFR-P02**: Not applicable.

### Security
- **NFR-S01**: Not applicable. No permission or secret changes.
- **NFR-S02**: Not applicable.

### Reliability
- **NFR-R01**: Bulk edits run through one deterministic script kept in `scratch/`.
- **NFR-R02**: Each validator result is compared against its baseline.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a file without the finding is left untouched.
- Maximum length: not applicable.
- Invalid format: the sk-vision plugin path appeared twice, in section 7 and in a later line, and both were fixed.

### Error Scenarios
- External service failure: a DevPass limit switches the builder to the cline route.
- Network timeout: not applicable.
- Concurrent access: the worktree is isolated from the main checkout.

### State Transitions
- Partial completion: every change is a tracked-file edit that `git checkout` reverts.
- Session expiry: not applicable.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Six files, judgment edits |
| Risk | 3/25 | Documentation and metadata edits |
| Research | 6/20 | Reader and owner inventory |
| **Total** | **17/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
