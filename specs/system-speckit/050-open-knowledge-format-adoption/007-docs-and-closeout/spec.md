---
title: "Feature Specification: Phase 7: docs-and-closeout"
description: "Update the contracts, references, catalogs and changelogs in both skills and close the program."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 7: docs-and-closeout

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
| **Phase** | 7 of 7 |
| **Predecessor** | 005-source-resolver |
| **Successor** | 008-context-type-hardening |
| **Handoff Criteria** | Docs match the shipped behavior in both skills and the whole packet validates under strict recursive checking. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the R1 R5 R9 adoption across spec-kit and sk-doc specification.

**Scope Boundary**: Documentation, catalogs and changelogs for what phases 003 to 005 shipped, and the final verification.

**Dependencies**:
- Phases 003 and 005 complete, and 006 either built or recorded as not built.

**Deliverables**:
- Updated `sk-create-frontmatter` contract text.
- Updated spec-kit references.
- Feature catalog and playbook entries in both skills.
- Changelog entries with four-part version bumps on edited docs.
- A final strict recursive validation result and the packet closure record.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Behavior that ships without its contract text, catalog entry and changelog leaves two skills documenting different rules, which is the drift this program set out to remove.

### Purpose
Leave both skills' docs describing exactly what shipped.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The `contextType` and `importance_tier` rules in `sk-create-frontmatter` and in the spec-kit key table.
- The new rules in `validation-rules.md`.
- Feature catalog and manual testing playbook entries in both skills.
- Changelog entries and four-part version bumps on every edited skill doc.
- Final `validate.sh --strict --recursive` on the packet and the `sk-doc` validators on edited docs.
- Document every command surface the earlier phases changed: the `/create:*` assets, `/speckit:plan`, `/speckit:implement`, `/speckit:complete` and `/speckit:save`, `/deep:research` and `/deep:review`, and the `/doctor` targets `speckit`, `deep-loop`, `skill-advisor` and `skill-graph-freshness`.

### Out of Scope
- New behavior - this phase only documents and verifies.
- Deferred ideas R2, R3 and R4 - they wait for a named consumer.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-templates.md` | Modify | Contract text |
| `.skilled/skills/system-spec-kit/references/structure/grep-convention.md` | Modify | Key table |
| `.skilled/skills/system-spec-kit/references/validation/validation-rules.md` | Modify | New rules |
| Both skills' feature catalogs and manual testing playbooks | Modify | Entries for what shipped |
| Both skills' changelogs | Create | Release entries |
| `.skilled/commands/` docs for the commands above | Modify | Describe the shipped checks |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every doc edited in this program passes the `sk-doc` validators. |
| REQ-002 | The packet ends `RESULT: PASSED` under `validate.sh --strict --recursive`. |
| REQ-003 | Docs describe shipped behavior only, and nothing that was recorded as not built. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | Edited skill docs carry a bumped four-part version and a changelog entry. |
| REQ-005 | The closure record lists what was deferred and why. |
| REQ-006 | Each changed command's doc names the check it now runs or the value it now emits. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Strict recursive validation passes on the whole packet.
- **SC-002**: A reader can find each shipped rule in the contract, the catalog and the changelog.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Earlier phases slip | Docs describe the wrong state | Write docs per phase as it closes and only reconcile here |
| Risk | Version bumps are missed on edited docs | Low | Run `check-frontmatter-versions.sh` before closing |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Validation finishes in the time the earlier phases recorded.
- **NFR-P02**: Docs are written in the repo's voice rules.

### Security
- **NFR-S01**: No secret appears in any doc.
- **NFR-S02**: Docs link only to files that exist.

### Reliability
- **NFR-R01**: A failed validation blocks closure.
- **NFR-R02**: Every edited doc is listed in the closure record.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A doc edited by two phases: bump its version once per release entry.
- A catalog entry for a not-built phase: do not write one.
- A broken link: fix it or remove it.

### Error Scenarios
- A validator fails on an old doc: report it, do not widen scope.
- A changelog collision: rebase the entry.
- Concurrent edits: rebase.

### State Transitions
- Partial closeout: record what is done.
- A phase reopened: list its docs for recheck.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Docs across two skills |
| Risk | 3/25 | No behavior change |
| Research | 4/20 | Nothing to investigate |
| **Total** | **15/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Which changelog does each skill release under? Resolved: each changed skill gets an entry in its own `changelog/` folder, which `.skilled/changelog/` links to: system-spec-kit 2.7.0.0, sk-doc 2.3.0.0, sk-create-frontmatter 1.0.1.0, system-skill-advisor 0.14.3.0, deep-research 1.15.2.0 and deep-review 1.11.3.0.
- Does the packet-level changelog need an entry per phase? Resolved: no. This packet has no `changelog/` folder, and the skill entries carry the release, each naming the phase it came from.
<!-- /ANCHOR:questions -->

---


