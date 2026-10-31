---
title: "Feature Specification: deep review remediation of the memory decommission packet"
description: "A ten-iteration deep review of the finished decommission packet returned CONDITIONAL with four P1 and two P2 findings; this phase verifies each against the files and fixes or answers it."
trigger_phrases:
  - "decommission review p1 p2 fixes"
  - "deep review remediation"
  - "trigger index reader fails closed"
  - "unchecked completion criteria"
  - "retired prefix criterion restated"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: deep review remediation

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-04 |
| **Branch** | `branches/017-memory-decommission` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The packet closed with every phase Complete, but a read-only deep review over ten forced iterations found contradictions between what the documents claim and what they record, plus one runtime gap: the committed trigger-index reader accepted a parseable but malformed artifact and silently returned fewer results than it held.

### Purpose
Every review finding is verified against the files and either fixed at source or answered with a recorded decision, and the packet validates recursively with zero errors afterwards.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The review run itself: ten iterations, no early convergence, on gpt-5.6-luna at effort max on the fast tier, artifacts under the packet's `review/` tree
- F001: one trigger-index shape invariant shared by the generator's publish gate and the reader's load gate, with fail-closed tests
- F002, F003: the unchecked task and completion rows in phases 001, 002 and 005 closed with evidence
- F004: the retired-prefix completion criterion restated to what was decided and proven
- F005, F006: owner and review checkpoint on every open decision, and the release-environment caveat recorded
- Alignment sweep: every live document, command, agent, hook and code comment that still presented the memory database, daemon, server, tools or retired commands as existing, brought to the surviving system

### Out of Scope
- Rewriting changelogs, benchmark reports or negative-guard tests to remove the literal retired prefix - they are evidence the parent decided to keep
- Installing the missing dependency in the main checkout - it is the operator's environment, not this branch

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/scripts/retrieval/lib/artifact.mjs` | Modify | Shared `assertTriggerIndexShape` invariant and schema constant |
| `.opencode/skills/system-spec-kit/scripts/retrieval/{generate,lookup}-trigger-index.mjs` | Modify | Both ends call the shared invariant; the reader's silent skips are gone |
| `.opencode/skills/system-spec-kit/scripts/tests/trigger-index.vitest.ts` | Modify | Four fail-closed cases |
| `001-trigger-index-replacement/tasks.md`, `002-memory-consumer-rewire/tasks.md`, `005-ripgrep-retrieval-research/tasks.md` | Modify | Completion and checklist rows closed with evidence |
| `../goal.md`, `../spec.md`, `../roadmap.md` | Modify | Criterion restated, decisions given owner and checkpoint, release caveat, phase map row |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The reader refuses a parseable but malformed index | Tests: non-array posting, out-of-range path id and wrong schema version each throw; the published artifact still loads |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | No unchecked completion row remains in a Complete phase, and every open decision names an owner and a checkpoint | grep for unchecked rows in the closed phases returns none; the parent LOG rows carry both fields |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: retrieval suites pass with the four new cases and `validate.sh --strict` over the parent recurses to all children with 0 errors
- **SC-002**: the trigger index regenerates byte-identical after the document edits
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The review lineage's ten iteration files and report | Without them there is nothing to remediate | Present under `../review/lineages/luna-max/` |
| Risk | The restated criterion could be read as weakening the packet | Low | The restatement names the evidence classes kept and the sweep that proves zero live surfaces |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---



<!-- SCAFFOLD_VALIDATION_COUNTS:
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
