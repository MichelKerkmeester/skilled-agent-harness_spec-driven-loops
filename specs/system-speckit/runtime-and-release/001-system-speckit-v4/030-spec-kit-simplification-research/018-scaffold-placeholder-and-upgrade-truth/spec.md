---
title: "Feature Specification: Scaffold, placeholder and upgrade truth"
description: "A fresh scaffold no longer fills placeholder slots with the feature name or leaves provenance tokens in titles, the scaffolder strips provenance from titles, upgrades create the lifecycle summary and stop creating the lazy decision record, a phase parent fails loudly without its required description, children derive their metadata from their documents, the resolvers agree on path-typed documents, and the goal and decision-record templates obey the human-voice rules they cite."
trigger_phrases:
  - "scaffold placeholder truth"
  - "phase parent description error"
  - "upgrade creates implementation summary"
  - "template provenance token stripped"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Scaffold, placeholder and upgrade truth

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
| **Phase** | 18 of 21 |
| **Predecessor** | 004-template-system-and-acceptance-criteria |
| **Successor** | None |
| **Handoff Criteria** | Every row of the lane's round-three section in `research/confirmed-findings.md` is fixed, documented, removed or recorded, and the test lanes pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 18** of the spec-kit simplification research program: the remediation child for the template lane's third round.

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
The scaffolder replaced every `[YOUR_VALUE_HERE: x]` slot with the feature name, so a phase parent's open questions and predecessor became its own name, and the placeholder rule, which detects only that token class, saw nothing. Titles kept the templates' `[template:level-N/doc]` provenance in 1,240 real documents, and the placeholder rule detects only the two hard token classes. An upgrade never created `implementation-summary.md`, which every fresh scaffold writes, and created `decision-record.md`, which the contract calls lazy. A phase parent whose compiled description generator was missing warned and passed while its own presence rule calls the file required, and its children carried a metadata stub written before their documents. The JS resolver could not resolve `research/research.md` after the bash-only fix, the bash resolver had no review case, and the goal and decision-record templates broke three human-voice rules two lines under the reference they cite.

### Purpose
A scaffold carries only values it knows and hints an author can see, a new scaffold carries no provenance token, an upgraded packet has the same files as a fresh one, and the templates obey the rules they cite.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The scaffolder, the placeholder rule, the upgrade script, the two resolvers, the renderer comment, the phase-parent, goal and decision-record templates, the files-rule header, the human-voice reference table, and the goldens
- The census dispositions for the rows that are recorded rather than changed

### Out of Scope
- Scaffolding review and research packets: the deep loops write them; the manifest rows are validator contracts and the scaffolder's error now says so
- The 1,240 documents that already carry a provenance token: historical, left as written; a rule class for them would fail hundreds of closed packets, so the standalone placeholder script reports them and the scaffolder stops the class from growing

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `runtime/cli/spec/create.sh` | Modify | Specific placeholder fills, provenance strip, phase-parent description error, per-child metadata derivation, level error text |
| `runtime/cli/rules/check-placeholders.sh` | Modify | Header states the two hard classes and why provenance tokens stay with the standalone report |
| `runtime/cli/spec/upgrade-level.sh` | Modify | Creates the lifecycle summary; stops creating the lazy decision record |
| `runtime/cli/utils/template-structure.js` | Modify | Resolves path-typed contract documents by file name |
| `runtime/cli/lib/template-utils.sh` | Modify | Review case and the two loop-written levels |
| `runtime/cli/templates/inline-gate-renderer.ts` | Modify | Flat-output contract stated |
| `runtime/cli/rules/check-files.sh` | Modify | Header names the contract and its sibling rule |
| `templates/packet-types/phase-parent.spec.md.tmpl` | Modify | Own provenance slug; hint tokens for the slots the scaffolder cannot fill |
| `templates/addons/goal.md.tmpl, templates/addons/decision-record.md.tmpl` | Modify | Em dash, semicolon and Oxford commas removed |
| `.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md` | Modify | Template table names real paths; scope note for anchors and enumerations |
| `runtime/cli/tests/scaffold-golden-snapshots.vitest.ts` | Modify | Asserts the strip and the substitution; snapshots updated |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A fresh scaffold carries no `[template:` token and no `[Feature Name]` token, and a phase parent keeps its open-question and predecessor slots as visible hints |
| REQ-002 | A phase parent scaffold exits non-zero when the compiled description generator is absent |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The runtime, CLI, legacy and validation lanes pass and the program validates recursively |
| REQ-004 | The upgrade script creates `implementation-summary.md` when absent and no longer creates `decision-record.md` |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The goldens assert the strip and the substitution
- **SC-002**: The placeholder rule's header says which classes it detects and why provenance is not one
- **SC-003**: The phase-parent snapshot shows hint tokens where the feature name used to land
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Stopping the blanket fill leaves hint tokens in a phase parent | Readers see brackets | That is the point: the slots were never the feature name; the rule ignores hint tokens by design |
| Risk | A rule class for provenance tokens was tried and reverted | It failed the extended suite's fixture and would fail 1,240 closed documents | The scaffolder strips the token and the goldens assert it; the standalone script reports the backlog |
| Risk | The upgrade now creates a document | A packet gains a file it did not ask for | Every fresh scaffold has carried it since the lifecycle rule; an upgraded packet now matches |
| Dependency | The renderer | Templates render before create.sh substitutes | Unchanged; only its contract comment was added |
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
