---
title: "Feature Specification: Phase 3: changelog-omissions"
description: "53 released changelog entries name internal ids or carry test counts in prose; this phase rewords them into plain names without changing a fact and records the round in one patch entry per touched skill."
trigger_phrases:
  - "changelog omissions"
  - "phase 3 changelog omissions"
  - "changelog internal id reword"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 3: changelog-omissions

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-27 |
| **Branch** | `worktrees/231-repo-doc-debt` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 3 |
| **Predecessor** | 002-readme-template-conformance |
| **Successor** | None |
| **Handoff Criteria** | Every reworded entry keeps its facts, and each touched skill has a patch entry with matching version carriers |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Clear repo-wide documentation debt: broken README references, README template conformance, changelog internal ids and test counts specification.

**Scope Boundary**: Prose in tracked `*/changelog/v*.md` files that the changelog validator flags, plus one new patch entry per skill this packet touched.

**Dependencies**:
- `validate_document.py` changelog checks
- The skills' manual testing playbooks and decision records, read to name each id

**Deliverables**:
- Reworded entries
- Ten new patch entries with their version carriers

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-create-changelog omission rule keeps internal ids and test counts out of changelog prose, because a reader cannot resolve `CX-008` or weigh "48 tests". 53 of 864 tracked entries still break it. The operator decided on 2026-10-27 that no CI check guards released entries and that the convention protects facts, not wording.

### Purpose
Every flagged entry names the scenario or decision in words, keeps every fact, and loses only the id or count.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ for f in $(git ls-files '*/changelog/v*.md'); do python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py "$f"; done
  864 files checked; 53 warn: 50 changelog_internal_id, 4 changelog_test_count
  3 of the 53 are flagged only for SHA-256, a hash algorithm name the id pattern matches
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Reword internal ids into the scenario or decision name in 50 entries
- Drop test counts and keep the claim
- Write one patch entry per touched skill and set its version carriers

### Out of Scope
- The 3 entries flagged only for `SHA-256` - it is an algorithm name, not an id
- The `> Spec folder:` blockquote and inline code spans - the rule exempts them

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| 50 `*/changelog/v*.md` entries across 10 skills | Modify | Reword ids, drop counts |
| `<skill>/changelog/v<next>.md` for 10 skills | Create | Patch entry for this round |
| `SKILL.md`, and for hubs `description.json`, `mode-registry.json`, `hub-router.json` | Modify | Version carriers |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | No reworded entry changes a fact: each id becomes the name its playbook or decision record gives it |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | Each touched skill has one new patch entry, and every version carrier names the same version |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The changelog warning count drops from 53 files to the 4 whose only remaining hit is `SHA-256`, and the new entries add none
- **SC-002**: `parent-skill-check.cjs` passes for each hub after its version bump, and the Hermes skill copies stay in sync
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Playbook titles and decision records | Source of each name | Mappings checked against titles and, for archived records, against git history |
| Risk | A rewording invents a fact | High | Every word diff read; two DeepSeek rewordings corrected by hand |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

N/A: documentation-only change; no service runs.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: an entry with no flagged prose is not touched.
- Maximum input: an entry naming nine ids gets each one named.
- Failure path: an id whose name cannot be found is left and listed rather than guessed.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | About 60 entries plus carriers |
| Risk | 6/25 | Released history text |
| Research | 12/20 | Resolving each id to its name |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should the changelog id check stop matching `SHA-256`? That is a validator change for a separate packet.
<!-- /ANCHOR:questions -->

---
