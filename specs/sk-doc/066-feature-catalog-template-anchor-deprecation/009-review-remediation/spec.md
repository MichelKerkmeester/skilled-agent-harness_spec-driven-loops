---
title: "Feature Specification: Phase 9: review-remediation"
description: "The deep review of this packet confirmed five P2 findings, and the tooling track handed back two document fixes. This phase fixes all seven."
trigger_phrases:
  - "review remediation"
  - "phase 9 review remediation"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 9: review-remediation

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
| **Phase** | 9 of 7 |
| **Predecessor** | 008-remediation-deep-review |
| **Successor** | None |
| **Handoff Criteria** | Every review finding and handoff is fixed with its proof |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the feature catalog template-anchor deprecation. It remediates pre-existing findings that phases 1 and 2 surfaced.

**Scope Boundary**: changelog entries of four units, the cli-cursor description, sk-design SKILL.md sections 4 and 5, seven catalog lines the validator reads as paths, the validator warn tier, this packet's goal and phase 003 records, and the version carriers of the changed non-hub units.

**Dependencies**:
- The review report at `008-remediation-deep-review/review/review-report.md`.

**Deliverables**:
- 49 changelog version keys from the existing phase 005 script
- Corrected parent goal and phase 003 records
- Reworded catalog lines and a passing sk-design hub
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The review found that four units still had unkeyed changelog entries and three of them failed the strict package check, that the parent goal named a stale mode version and described hub bumps phase 002 had made, that the sk-doc hub handoff had no target version and that phase 003 counted 19 changelog entries where it added 20. The tooling track also asked for catalog rewording and for the sk-design REFERENCES failure.

### Purpose
The packet records match the tree and every unit this phase touches passes its strict check.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Key the changelog entries of system-deep-loop runtime, cli-codex, cli-cursor and mcp-code-mode
- Shorten the cli-cursor description
- Correct the goal criterion, decision D5, the sk-doc target and the entry count
- Reword seven catalog lines the validator reads as paths
- Rename the sk-design references heading and give its rules the required subsections
- Drop three clean packages from the warn tier
- Patch-bump the changed non-hub units

### Out of Scope
- Hub version bumps, including sk-design 2.0.0.0 to 2.0.1.0, made once by the master at merge
- The five remaining catalog findings: a gitignored runtime log, the gitignored `hook-flags.env` and the sk-vision plugin symlink into gitignored build output

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| 49 `changelog/v*.md` entries in four units | Modify | Version key |
| `cli-cursor/SKILL.md` | Modify | Description |
| `sk-design/SKILL.md` | Modify | Sections 4 and 5 |
| Seven catalog docs | Modify | Reworded path-like text |
| `validate_catalog_package.py` | Modify | Warn tier |
| Packet `goal.md`, phase 003 docs | Modify | Record fixes |
| Nine unit carriers and entries | Modify and create | Patch bump |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The four units and every other unit touched here pass `package_skill.py --check --strict` |
| REQ-002 | The parent goal and phase 003 records agree with the tree |

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

- **SC-001**: The catalog validator reports 5 findings, down from 15.
- **SC-002**: Every touched unit prints Result: PASS.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Rewording loses a file name | Low | Each reword still names the artifact: DESIGN markdown file, research synthesis, handover document, legacy specs root under .opencode |
| Risk | New rule subsections invent policy | Low | ESCALATE items restate checks the hub template and parent check already apply |
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
- Invalid format: system-deep-loop runtime has no SKILL.md, so its bump is a changelog entry only.

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
| Scope | 8/25 | Seven fixes, about 75 files |
| Risk | 4/25 | Documentation and metadata edits |
| Research | 6/20 | Reader and owner inventory |
| **Total** | **18/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
