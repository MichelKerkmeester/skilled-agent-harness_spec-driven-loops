---
title: "Feature Specification: Phase 54: classifier-module-names"
description: "The four kept Jev features live in files of other skills whose names give no sign of the classifier. Each feature's Jev code moves into a module named classifier- plus its host file's name, and the injection screen hook takes the same prefix."
trigger_phrases:
  - "classifier module names"
  - "classifier prefixed modules"
  - "classifier cite drift scan"
  - "classifier injection screen"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 54: classifier-module-names

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-05 |
| **Branch** | `worktrees/085-jev-feature-improvement-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 54 of 54 |
| **Predecessor** | 053-retire-unproven-features |
| **Successor** | None |
| **Handoff Criteria** | Every Jev code path outside cli-classifier sits in a `classifier-` file, and every suite holds its baseline |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 54** of the cli-jev workflow integration packet. After phase 53 four Jev features remain, and three of them sit inside larger files that mostly do non-Jev work. The operator asked for the classifier to show in the file names, extracted per host and named like `classifier-cite-drift-scan.mjs`.

**Scope Boundary**: Move and rename only. Behaviour, output, switches and exit codes stay identical.

**Dependencies**:
- Phase 53, which left these four features as the only kept ones

**Deliverables**:
- `classifier-cite-drift-scan.mjs` beside `cite-drift-scan.mjs`
- `classifier-reviewer-scorer.cjs` beside `reviewer-scorer.cjs`
- `classifier-score-model-variant.cjs` beside `score-model-variant.cjs`
- The injection screen hook renamed to `classifier-injection-screen/` with prefixed files

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A reader cannot tell from file names where the classifier runs. Its code for citation drift, the reviewer verdict and the hallucination grader is buried in general-purpose files, and the injection screen hook carries no classifier name.

### Purpose
Every Jev code path outside cli-classifier is found by looking for files that start with `classifier-`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Extract the Jev arm and the advisory from `cite-drift-scan.mjs`
- Extract the Jev verdict branch and grader resolution from `reviewer-scorer.cjs`
- Extract the Jev hallucination grader from `score-model-variant.cjs`
- Rename the injection screen hook folder and files, its registration, its settings entry and its runtime mirror
- Update the tests and docs that name these locations

### Out of Scope
- Feature names and switches such as `injection-screen` and `JEV_FEATURE_INJECTION_SCREEN` - operators already set them
- Changelogs - they record history
- cli-classifier's own files - they already sit in the classifier skill

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/shared/scripts/classifier-cite-drift-scan.mjs` | Create | Jev arm and advisory |
| `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/classifier-reviewer-scorer.cjs` | Create | Jev verdict and grader resolution |
| `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/classifier-score-model-variant.cjs` | Create | Jev hallucination grader |
| `.skilled/hooks/classifier-injection-screen/**` | Rename | Hook, library, tests and README |
| Host files, tests, registry, settings, mirrors and docs | Modify | Imports and paths |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Each extracted module is named `classifier-` plus its host file's name, and no classifier module imports its host |
| REQ-002 | Behaviour is unchanged: every suite holds its baseline count and the hook still fires from Claude Code settings |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | No file outside `specs/`, changelogs and generated files names an old hook path |
| REQ-004 | New and changed code passes the sk-code-opencode alignment verifier |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Listing files that start with `classifier-` outside cli-classifier finds all four features.
- **SC-002**: Every suite passes at its baseline count.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | An import cycle between a host and its classifier module | Load-order bugs | The classifier module never imports its host |
| Risk | The hook path changes in settings but not in the mirror | The hook stops firing | Regenerate mirrors and run the registration sync test |
| Risk | External importers of moved exports | A caller breaks | The cite drift host re-exports what moved |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No change. Code moves without rewrites.

### Security
- **NFR-S01**: No change to credential handling. Jev keeps its stored credential.

### Reliability
- **NFR-R01**: Identical output for identical input before and after the move.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Existing importers of moved cite drift exports keep working through host re-exports.

### Error Scenarios
- A stale Claude Code session that cached the old hook path stops screening until restarted.

### State Transitions
- The old mirror symlink is removed and the new one created in the same change.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Three extractions, one rename, about 25 files |
| Risk | 8/25 | A live hook path changes |
| Research | 2/20 | Mapping done |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
