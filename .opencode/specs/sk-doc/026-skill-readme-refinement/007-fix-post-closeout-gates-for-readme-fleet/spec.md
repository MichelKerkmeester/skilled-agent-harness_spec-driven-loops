---
title: "Feature Specification: Fix post-closeout gates for the README fleet"
description: "Restore repository-wide documentation gate health by resolving broken-link findings, adding missing frontmatter versions, and aligning the six CLI mode READMEs."
trigger_phrases:
  - "fix link guard"
  - "frontmatter version gaps"
  - "CLI README alignment"
  - "post closeout gates"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/007-fix-post-closeout-gates-for-readme-fleet"
    last_updated_at: "2026-08-05T08:05:14Z"
    last_updated_by: "phase-executor"
    recent_action: "Created remediation phase and captured gate baseline"
    next_safe_action: "Classify and repair link, version, and README gaps"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/check-markdown-links.cjs"
      - ".opencode/skills/sk-doc/shared/scripts/check-frontmatter-versions.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-007-fix-post-closeout-gates-for-readme-fleet"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Use a new Level-3 remediation phase under the existing README refinement packet."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

# Feature Specification: Fix post-closeout gates for the README fleet

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

The README refinement program delivered 50 rewritten READMEs, but its final global gates still expose older repository debt: 96 broken-link reports from 44 source files and six missing frontmatter version fields. This phase restores the gates without weakening their protection, then aligns every CLI mode README so `cli-opencode` and its siblings present the same clear family contract.

**Key Decisions**: Fix real targets, preserve intentional negative fixtures through a narrow exclusion, and keep copy-time template placeholders as exact allowlist pairs. Align all six CLI mode READMEs rather than treating `cli-opencode` as an isolated exception.

**Critical Dependencies**: The repository link guard, frontmatter-version gate, README validator, existing CLI skill contracts, and the current working-tree baseline.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2026-08-05 |
| **Branch** | Current working tree |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `006-validation-and-closeout` |
| **Successor** | `008-readme-descriptive-voice-revision` |
| **Handoff Criteria** | The global link and version gates pass, all six CLI mode READMEs follow the agreed family structure, and phase evidence validates with zero errors. |
<!-- /ANCHOR:metadata -->

---
<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Phase 006 proved that the changed README surfaces have no broken links, but the repository-wide guard still reports 96 failures across older documents. The version gate also reports six in-scope documents with frontmatter but no four-part version. The CLI mode READMEs share the required nine-section silhouette, yet their sibling navigation is uneven and `cli-opencode` does not fully show its unique identity alongside every peer.

### Purpose

Bring the documentation gates to a truthful clean state while preserving deliberate test behavior and making the CLI family easier to choose correctly.
<!-- /ANCHOR:problem -->

---
<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Classify and resolve every current broken-link report from `check-markdown-links.cjs`.
- Correct real relative-link targets in the source documents.
- Exclude deliberately broken test fixtures only where the guard must not treat them as production documentation.
- Add exact allowlist entries only for copy-time template placeholders that cannot resolve until a consumer creates their companion files.
- Add a valid four-part `version` field to each currently failing in-scope document.
- Align the six CLI child-mode READMEs, with explicit `cli-opencode` identity, complete sibling navigation, matching version discipline, and no change to runtime dispatch contracts.
- Record the final evidence in this phase and update the parent phase map.

### Out of Scope

- Changing CLI routing, dispatch behavior, model defaults, or safety rules. This phase documents existing contracts only.
- Rewriting intentionally invalid test fixture content to make it falsely valid.
- General prose cleanup outside the affected CLI family and link/version sources.
- Altering archived changelog history.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/scripts/check-markdown-links.cjs` | Modify | Preserve intentional fixtures and placeholders without masking active documentation defects. |
| Broken-link source documents | Modify | Repair actual relative targets across the 44 reported source files. |
| Six version-gate documents | Modify | Add derived four-part version fields as the last frontmatter key. |
| `.opencode/skills/cli-external-orchestration/cli-*/README.md` | Modify | Align all six CLI mode READMEs and make `cli-opencode` explicitly distinguishable. |
| Affected CLI changelog entries | Create or modify | Record reader-facing README alignment releases. |
| This phase and `../spec.md` | Modify | Maintain scope, decisions, evidence, metadata, and phase map. |
<!-- /ANCHOR:scope -->

---
<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Clear every actionable repository-wide markdown-link finding. | `node .opencode/skills/system-spec-kit/scripts/check-markdown-links.cjs` exits 0 and reports `0 broken`. |
| REQ-002 | Preserve the test signal behind intentionally invalid fixture documents. | The guard excludes only the fixture classes that intentionally contain invalid targets, while its self-test still passes. |
| REQ-003 | Restore frontmatter-version coverage. | `bash .opencode/skills/sk-doc/shared/scripts/check-frontmatter-versions.sh` exits 0 with zero missing or malformed versions. |
| REQ-004 | Align the CLI mode README family. | All six mode READMEs pass the README validator, include complete sibling navigation, and identify their own executor unambiguously. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Give `cli-opencode` clear, specific positioning. | Its overview, at-a-glance table, sibling matrix, related resources, and release note name `cli-opencode` and its full-runtime distinction. |
| REQ-006 | Keep changed README version and changelog discipline intact. | Each changed CLI README carries a four-part version and has a matching changelog entry. |
| REQ-007 | Keep phase records coherent. | Parent and child phase documents validate with zero errors after metadata regeneration. |
| REQ-008 | Keep the guard policy auditable. | The guard diff contains only exact source-reference pairs and named fixture path classes, reviewed in this phase's change record. |
<!-- /ANCHOR:requirements -->

---
<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The repository-wide link guard reports `0 broken markdown links`.
- **SC-002**: The frontmatter-version gate reports no missing or malformed versions.
- **SC-003**: A reader can identify the intended executor, unique capability, and all five sibling alternatives from any CLI mode README.
- **SC-004**: All six CLI README validators and the Phase 007 strict validator report zero errors.
- **SC-005**: No runtime behavior, plugin configuration, or test-fixture semantics change as a side effect of documentation remediation.
<!-- /ANCHOR:success-criteria -->

---
<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A broad exclusion could hide a future real broken link. | High | Use only named fixture path classes and exact source-reference allowlist entries. |
| Risk | A relative-link correction could point at a similarly named but wrong document. | High | Resolve each target from its source directory and inspect its intended owner before editing. |
| Risk | Template placeholders look like broken production links. | Medium | Allowlist exact `(source, reference)` pairs rather than a whole template directory. |
| Risk | Version fields could conflict with an owning skill anchor. | Medium | Derive each field through the versioning tool and preserve frontmatter order. |
| Risk | CLI family alignment might rewrite operational truth. | Medium | Use each mode's `SKILL.md` as the authority and limit edits to README presentation. |
| Dependency | Existing validators and local Node runtime | Required | Run guard self-test, global gates, README validators, and phase validation before closeout. |
<!-- /ANCHOR:risks -->

---
<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: The link guard must retain its existing whole-repository scan behavior and complete without a new recursive scan layer.

### Security

- **NFR-S01**: No credentials, private paths outside the repository, or runtime secrets may enter documentation or guard configuration.

### Reliability

- **NFR-R01**: A second run of each gate after a clean first run produces the same zero-failure verdict.

---

## 8. EDGE CASES

### Data Boundaries

- Negative fixtures remain intentionally invalid but do not fail the production documentation gate.
- Template links that name artifacts created by a future consumer remain checkable only through exact allowlist pairs.
- A source link with a fragment must resolve its file target before the fragment is ignored.

### Error Scenarios

- A missing expected target with no valid replacement remains a blocker until its owner document is corrected or its fixture purpose is proven.
- A document with frontmatter but no valid skill anchor remains a blocker until the versioning tool can derive a compliant value.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|------:|----------|
| Scope | 21/25 | 44 link-source documents, six version documents, six CLI READMEs, guard code, and phase records |
| Risk | 16/25 | Whole-repository validation policy and cross-skill documentation links |
| Research | 13/20 | Each finding needs classification as real target, template placeholder, or intentional fixture |
| Multi-Agent | 6/15 | Independent document groups can be reviewed in parallel, but one parent owns guard policy |
| Coordination | 12/15 | Multiple skill roots, changelogs, validators, and metadata must agree |
| **Total** | **68/100** | **Level 3 is appropriate** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Guard allowlist becomes too broad. | High | Low | Use exact pairs, review the final diff, and rerun the guard. |
| R-002 | Fixture exclusion suppresses an active doc. | High | Low | Limit exclusions to test or fixture path classes. |
| R-003 | CLI README wording drifts from runtime facts. | Medium | Medium | Compare every claim with the mode's `SKILL.md`. |
| R-004 | Version insertion reorders YAML. | Medium | Low | Use the versioning tool and line-wise validation. |

---

## 11. USER STORIES

### US-001: Trustworthy documentation gates (Priority: P0)

**As a** repository maintainer, **I want** the global link guard to fail only on real documentation defects, **so that** a passing result means the documentation can be trusted.

**Acceptance Criteria**:
1. Given the current repository, when the link guard runs, then it reports zero unresolved active-document links.

---

### US-002: Preserved fixture behavior (Priority: P0)

**As a** validator maintainer, **I want** deliberately broken fixture links to remain invalid inputs, **so that** tests retain their negative coverage.

**Acceptance Criteria**:
1. Given a negative fixture tree, when the global link guard walks the repository, then it does not classify the fixture payload as production documentation.

---

### US-003: Complete version discipline (Priority: P0)

**As a** documentation author, **I want** every in-scope frontmatter document to have a compliant version, **so that** the pre-commit quality gate is reliable.

**Acceptance Criteria**:
1. Given the six current version gaps, when the version gate runs, then it reports zero missing fields.

---

### US-004: Clear CLI selection (Priority: P1)

**As a** caller selecting an external executor, **I want** each CLI README to name its own identity and show every sibling boundary, **so that** I can choose the correct runtime without reading all six contracts.

**Acceptance Criteria**:
1. Given any CLI mode README, when I scan the overview and navigation sections, then I can identify its executor and compare it with all five siblings.

---

## 12. OPEN QUESTIONS

- None. Findings are classified from repository evidence and the guard's documented exception policy.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
