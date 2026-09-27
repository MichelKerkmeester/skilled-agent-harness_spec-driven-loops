---
title: "Feature Specification: Phase 3: adjacent-alignment"
description: "The surfaces next to the changelog work caught up with it: /create:changelog resolves hub skills, the validator types every changelog entry, the nested generator escapes what it pastes, and the docs, catalogs and playbooks describe what ships."
trigger_phrases:
  - "adjacent-alignment"
  - "changelog hub component resolution"
  - "validator changelog type detection"
  - "nested changelog title escaping"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: adjacent-alignment

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-27 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 3 |
| **Predecessor** | 002-changelog-findability |
| **Successor** | None |
| **Handoff Criteria** | Every defect below is reproduced before its fix and gone after it, and `validate.sh --strict` passes on this folder |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Skilled release changelog: the framework release line and findable changelogs specification.

**Scope Boundary**: The surfaces next to phases 1 and 2 that did not follow them: the `/create:changelog` workflow on hub skills, the validator's type detection, the nested generator's rendering, the docs that describe these surfaces, their feature catalogs and playbooks, and two packets whose metadata fails the path check.

**Dependencies**:
- Phases 1 and 2 are committed and pushed, so this phase edits a stable base.

**Deliverables**:
- Hub-aware component resolution in both `/create:changelog` workflows, the mode contract and CHG-001
- A validator that types an install-guide-named or fixture-named changelog entry as a changelog
- A nested generator that escapes the frontmatter values it writes and pastes every value as written
- Corrected docs, two catalog entries, one playbook scenario and a mention in the v4.0.0.2 draft
- Component entries for sk-create-changelog, sk-doc and system-spec-kit

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phases 1 and 2 changed what a changelog is, and several surfaces next to them still describe or perform the old behavior. `/create:changelog` treats a hub folder such as `.skilled/changelog/sk-doc/` as a component, but a hub holds only links, so the version reader finds no version and the write would land beside the links. The validator types three entries as install guides because of a word in their names and skips five more as a fixture tree because their folder name ends in "fixtures". The nested generator pastes a spec title raw inside double quotes and reads `$'` in a value as a replacement pattern. Docs, catalogs and playbooks still describe the surfaces before the change.

### Purpose
Every surface next to the changelog work does and describes what ships, and each code defect has a test that fails on the old code.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Hub resolution in `/create:changelog`: a hub folder resolves to `{hub}/parent` or `{hub}/{member}`, never to itself
- Validator type detection: the changelog folder outranks an install-guide word in a name, and a numbered spec folder is never a fixture tree
- Nested generator rendering: escaped frontmatter values and literal pasting
- The command group README, the sk-create-changelog README, the retrieval library README, the frontmatter reference and the `.opencode` manifests
- The version fields of the docs this phase touches, through `frontmatter-version.mjs`
- CHG-001 and CHG-006 in the sk-create-changelog playbook
- A system-spec-kit catalog entry and playbook scenario for the identity phrase, and an sk-doc catalog entry for the changelog check
- The Changelogs section of the v4.0.0.2 draft
- `parent_id` in packets `system-speckit/027` and `sk-git/023`, stored as the string `"null"`
- Component entries for sk-create-changelog, sk-doc and system-spec-kit, and the Hermes copies

### Out of Scope
- The graph metadata parser that once produced the string `"null"` - no live path writes it, and two packets carry it
- `package_skill.py`'s fixture rule - it sees only skill trees, where no numbered folder ends in "fixtures"
- The `packet_id` spelling in 027's `description.json` - no check reads it
- Barter coder's copy and `.worktrees/` checkouts - other trees and other sessions

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/create/assets/create-changelog-auto.yaml`, `create-changelog-confirm.yaml` | Modify | Hub resolution in the mapping, step 2 and the owning-folder note |
| `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md`, `README.md` | Modify | The hub rule, the search metadata and the version |
| `.skilled/skills/sk-doc/sk-create-changelog/manual-testing-playbook/**` | Modify | CHG-001, CHG-006 and the index |
| `.skilled/commands/create/README.txt` | Modify | The changelog row, example, FAQ and troubleshooting fix |
| `.skilled/skills/sk-doc/shared/scripts/validate_document.py`, `scripts/tests/test_changelog_validator.py` | Modify | Type detection and its tests |
| `.skilled/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-templates.md` | Modify | The changelog entry type and the stale validator claim |
| `.skilled/skills/sk-doc/feature-catalog/**` | Create, Modify | The changelog check entry |
| `.skilled/skills/system-spec-kit/runtime/cli/spec-folder/nested-changelog.ts`, `tests/nested-changelog.vitest.ts` | Modify | Escaping, literal pasting and a test |
| `.skilled/skills/system-spec-kit/feature-catalog/**`, `manual-testing-playbook/**` | Create, Modify | The identity phrase entry and scenario |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/README.md`, `references/workflows/nested-changelog.md` | Modify | The corpus roots and the version |
| `.skilled/skills/sk-doc/README.md` | Modify | The version |
| `.opencode/SYNC.md`, `.opencode/README.md` | Modify | The links that exist |
| `.skilled/changelog/skilled/v4.0.0.2.md` | Modify | The Changelogs section |
| `specs/system-speckit/027-xce-research-based-refinement/graph-metadata.json`, `specs/sk-git/023-live-follow-disjoint-ff/graph-metadata.json` | Modify | `parent_id` as JSON null |
| Component entries, `SKILL.md` versions, the sk-doc hub files and the Hermes copies | Create, Modify | sk-create-changelog, sk-doc and system-spec-kit |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `/create:changelog` resolves a hub to `{hub}/parent` or `{hub}/{member}`, and the version reader finds the newest entry there |
| REQ-002 | The validator types a changelog entry by its folder, whatever words its name holds, and never skips a numbered spec folder as a fixture tree |
| REQ-003 | The nested generator renders frontmatter that parses for any spec title, and pastes every value as written |
| REQ-004 | Each code fix has a test that fails on the old code, and the suites that cover the changed files pass |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | The command group README, the sk-create-changelog README, the retrieval library README, the frontmatter reference and the `.opencode` manifests describe what ships |
| REQ-006 | CHG-001 expects the hub rule and CHG-006 describes the defined release step |
| REQ-007 | The catalogs and the system-spec-kit playbook cover the identity phrase and the changelog check |
| REQ-008 | The v4.0.0.2 draft mentions the release line and findable changelogs |
| REQ-009 | Packets 027 and `sk-git/023` pass the metadata path check |
| REQ-010 | The changed components carry entries and versions, and their Hermes copies match |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each of the four reproductions fails before its fix and passes after it
- **SC-002**: The validator types every changelog entry Gate 1 can see as a changelog and passes each one, and a sweep of every changelog file finds no failure the old validator did not also report
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The shared `dist/` build | A build from a broken tree would serve every session | Typecheck and the suites run before `npm run build` |
| Risk | Un-skipped spec folders now fail | Med | Measure the numbered fixture folders before and after the change |
| Risk | Other sessions share the git index | Med | Stage this phase's paths one by one and read the staged list before each commit |
| Risk | The v4.0.0.2 draft is the operator's | Low | Add a section and leave the title, opening and goal sections untouched |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Hub resolution adds one `ls -l` of the hub folder to step 2
- **NFR-P02**: The validator's type detection stays a handful of path checks

### Security
- **NFR-S01**: No changelog write lands in a hub folder of links
- **NFR-S02**: A pasted value never inserts template text the author did not write

### Reliability
- **NFR-R01**: Both command YAMLs parse after every edit
- **NFR-R02**: A real `INSTALL-GUIDE.md` and a real fixture tree keep their old types
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a hub path with no member packet segment resolves to `{hub}/parent`
- Maximum length: a member whose link name differs from its packet name, such as `create-changelog` for `sk-create-changelog`, resolves through the link target
- Invalid format: a title holding `"` or `\` renders as an escaped YAML scalar

### Error Scenarios
- External service failure: none, since every change is local
- Network timeout: none
- Concurrent access: other sessions share the git index, so only this phase's paths are staged

### State Transitions
- Partial completion: each fix lands with its test, so a stop leaves no half-fixed surface
- Session expiry: continuity lives in this folder's documents and resumes with `/speckit:resume`
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | About 40 files across two skills, a command and two packets |
| Risk | 10/25 | The shared build and the validator's reach |
| Research | 6/20 | Each defect is reproduced before its fix |
| **Total** | **31/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None open. The operator asked to fix every gap the audit found, on 2026-09-27.
<!-- /ANCHOR:questions -->

---
