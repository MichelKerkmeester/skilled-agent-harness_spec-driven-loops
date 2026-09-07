---
title: "Feature Specification: Rule headers, registry coverage and playbook paths"
description: "Every registry rule is proven to run by a test that scaffolds a packet and validates it, which caught a rule reporting an id the registry does not carry; sibling rules name their split in their headers; the one rule without a header block has one; the expired canonical-save grandfather window is gone; four playbook commands point at the tests that exist; the skill's routing claim says what the resource map really covers; and the deep loops' three reaches into the spec-kit runtime are named as contracts."
trigger_phrases:
  - "registry coverage test"
  - "rule header split"
  - "canonical save allowlist removed"
  - "fanout playbook paths"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Rule headers, registry coverage and playbook paths

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-07 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 20 of 21 |
| **Predecessor** | 005-overengineering-simplification |
| **Successor** | None |
| **Handoff Criteria** | Every row of the lane's round-three section in `research/confirmed-findings.md` is fixed, documented, removed or recorded, and the test lanes pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 20** of the spec-kit simplification research program: the remediation child for the overengineering lane's third round.

**Scope Boundary**: the files listed under Files to Change and nothing beside them.

**Dependencies**:
- The lane's round-three synthesis and its census section
- The earlier remediation children the round verified

**Deliverables**:
- Every confirmed row closed as the census records
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Six registry rule ids were named by no test, and one of them, the protocol rule, reported a singular id the registry does not carry, so validation output never matched the registry row. Sibling rules over one document zone stated their split nowhere. One rule script had no header block. The canonical-save rule kept a grandfather allowlist that expired on 2026-05-01. Four playbook commands cd into the spec-kit runtime and run a path that resolves to a directory that does not exist. The skill's routing section promised the resource map emits every manifest leaf when it routes 26 of 45. Three deep-loop surfaces live inside the spec-kit runtime tree and no document called them contracts.

### Purpose
A rule the registry lists is a rule that runs, sibling rules say where they divide, dead windows are gone, playbook commands run, and the routing claim is true.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The registry-coverage test, the protocol rule id, seven rule headers, the canonical-save helper and script, four deep-loop playbook files, the skill's routing sentence, the deep-loop integration reference

### Out of Scope
- Merging the lifecycle command assets or the auto and confirm twins: a redesign of the command surface, recorded with the reason
- Routing the seventeen browse-only reference files: their bodies were not read by the round; the claim is corrected and the manifest stays the inventory

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `runtime/cli/tests/validate-runs-every-registry-rule.vitest.ts` | Create | Scaffolds a Level 2 packet, validates it, asserts every registry id appears |
| `runtime/cli/rules/check-ai-protocols.sh` | Modify | Reports the registry's id |
| `runtime/cli/rules/check-files.sh, check-level-match.sh, check-frontmatter.sh, check-grep-convention.sh, check-graph-metadata-shape.sh, check-description-shape.sh` | Modify | Headers name the sibling and the split |
| `runtime/cli/rules/check-spec-doc-integrity.sh` | Modify | Header block per convention |
| `runtime/cli/rules/check-canonical-save-helper.cjs, check-canonical-save.sh` | Modify | Expired allowlist and its two branches removed |
| `.opencode/skills/system-deep-loop/deep-research/manual-testing-playbook/fanout/*.md, runtime/manual-testing-playbook/fanout/fanout-config-schema.md, runtime/tests/fixtures/council-value/data/README.md` | Modify | Commands point at the deep-loop runtime's tests |
| `SKILL.md` | Modify | The resource map routes a subset; the manifest is the inventory |
| `.opencode/skills/system-deep-loop/runtime/references/integration-points.md` | Modify | Three shared runtime homes named as contracts |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A test proves every registry rule id appears in validation output on a fresh scaffold, and the protocol rule reports the registry's id |
| REQ-002 | The canonical-save helper carries no allowlist, no expiry and no grandfather branch |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The runtime, CLI, legacy and validation lanes pass and the program validates recursively |
| REQ-004 | The four playbook commands name test paths that exist and the routing sentence states the real coverage |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The coverage test fails when any rule stops reporting its id
- **SC-002**: Every rule header names its rule and severity
- **SC-003**: The playbook commands resolve
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Renaming the protocol rule's reported id changes output text | A consumer matching the old string breaks | The registry keeps the old spelling as an alias; the extended lane's label was the only other site |
| Risk | Removing the allowlist changes verdicts | A grandfathered root fails | The window expired four months ago; the branch was already dead |
| Dependency | create.sh | The coverage test scaffolds through it | The scaffold and validate paths are the ones users run |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No new process is spawned on any hot path
- **NFR-P02**: CI cost changes only where the census names it

### Security
- **NFR-S01**: No rule became less strict
- **NFR-S02**: No secret or credential is touched

### Reliability
- **NFR-R01**: Every gate result was read from its output
- **NFR-R02**: Every removal was preceded by a consumer search
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: an absent optional document changes nothing
- Maximum length: not applicable
- Invalid format: malformed input keeps the existing error paths

### Error Scenarios
- External service failure: not applicable
- Network timeout: not applicable
- Concurrent access: the private index kept the other session's files out

### State Transitions
- Partial completion: code, tests and documents ship in one commit
- Session expiry: not applicable
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | The files listed above |
| Risk | 10/25 | Small edits behind existing tests |
| Research | 5/20 | Every row re-checked in the main checkout |
| **Total** | **29/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
