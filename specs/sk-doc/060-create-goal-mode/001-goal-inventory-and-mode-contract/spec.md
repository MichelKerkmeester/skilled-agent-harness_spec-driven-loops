---
title: "Feature Specification: Phase 1: goal-inventory-and-mode-contract"
description: "Phase 001 defines the goal contract, corpus evidence, ownership boundary, decision tests, and target tree for sk-create-goal."
trigger_phrases:
  - "goal corpus audit"
  - "goal mode ownership boundary"
  - "goal anatomy contract"
  - "goal authoring decision tests"
  - "sk-create-goal target tree"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: goal-inventory-and-mode-contract

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-09-25 |
| **Branch** | `worktrees/068-create-goal-mode` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 9 |
| **Predecessor** | None |
| **Successor** | 002-mode-scaffold |
| **Handoff Criteria** | The contract records goal ownership and the conformance-check decision, defines the target tree, and reproduces each audit-cited corpus defect with a command. Parent handoff: `specs/sk-doc/060-create-goal-mode/spec.md:138-143`. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Create the sk-create-goal sk-doc mode that authors packet goals specification.

**Scope Boundary**: Read-only inventory and contract work; phase execution creates five analysis documents and edits no skill files. Parent phase map: `specs/sk-doc/060-create-goal-mode/spec.md:119-129`.

**Dependencies**:
- The two read-only audits in this folder's `scratch/` directory and the goal template, hooks, validator, phase scaffold, playbook, and plan workflow listed below.

**Deliverables**:
- `decision-tests.md`, `goal-anatomy.md`, `goal-corpus-audit.md`, `mode-boundary.md`, and `target-tree.md`.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The goal contract has durable, chat, and objective slices; phase-parent goals also carry a binding table, while children carry their own phase objectives (`.skilled/hooks/goal/lib/goal-slice.cjs:52-79,87-118`; `.skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:46-105`). The validator measures the parent budget and checks only binding rows it finds; it returns when the binding anchor is absent (`.skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:1050-1080`).

The read-only audit records over-budget parents, a child with the template objective, a criterion that needs another file, an inaccurate child count, and an omitted phase binding (`specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/scratch/wave1-goal-system-audit.md:37,41-45`). Phase 001 must measure the full in-scope corpus and turn those findings into an ownership boundary and mode contract before phase 002 scaffolds the mode (`specs/sk-doc/060-create-goal-mode/spec.md:121-123,138-143`).

### Purpose
Produce a source-backed goal contract and corpus report that phase 002 can use to scaffold the mode without taking over runtime goal state.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Inventory every `goal.md` under `specs/`, excluding paths under `z_archive`, and record a `goal.cjs packet` result for each; the command prints the measured size, budget, and slices (`.skilled/hooks/goal/bin/goal.cjs:203-216`).
- Classify placeholder objectives, over-budget parents, missing phase bindings, criteria counts outside three to seven, and criteria that require another file to judge; include a command for each defect named by the audit (`specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/scratch/wave1-goal-system-audit.md:37,41-45`; `.skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:96-105`).
- Define goal anatomy, ownership, decision tests, and the `sk-create-goal` target tree, following the four-artifact precedent from 040 phase 002 (`specs/sk-doc/z_archive/040-create-repo-rules/002-inventory-and-skill-contract/decision-tests.md:17-23`; `specs/sk-doc/z_archive/040-create-repo-rules/002-inventory-and-skill-contract/mode-boundary.md:22-42`; `specs/sk-doc/z_archive/040-create-repo-rules/002-inventory-and-skill-contract/rule-anatomy.md:45-78`; `specs/sk-doc/z_archive/040-create-repo-rules/002-inventory-and-skill-contract/target-tree.md:30-69`).
- Resolve the parent question about a mode-local conformance checker versus a system-spec-kit validator amendment, while honoring D4 (`specs/sk-doc/060-create-goal-mode/spec.md:157`; `specs/sk-doc/060-create-goal-mode/goal.md:49-54`).

### Out of Scope
- Editing `.skilled/` or changing system-spec-kit, the goal hooks, the host goal command, or the existing corpus; the parent keeps these sources frozen or assigns runtime ownership elsewhere (`specs/sk-doc/060-create-goal-mode/spec.md:90-99`).
- Building the mode, command, fixtures, or checker; these belong to later phases in the parent map (`specs/sk-doc/060-create-goal-mode/spec.md:121-129`).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `decision-tests.md` | Create | Tests for when packet-goal authoring is warranted and which owner handles the request. |
| `goal-anatomy.md` | Create | Goal sections, slices, parent/child differences, limits, and enforcing code. |
| `goal-corpus-audit.md` | Create | Census, measurements, defect classes, and reproduction commands. |
| `mode-boundary.md` | Create | Ownership and the conformance-check versus validator-amendment decision. |
| `target-tree.md` | Create | Evidence-backed file tree for the future mode packet. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Enumerate every non-archive `goal.md` and record one `goal.cjs packet` result per file; reconcile the processed count with the `find` census (`.skilled/hooks/goal/bin/goal.cjs:203-216`). |
| REQ-002 | Classify each goal by placeholder objective, durable-slice budget, parent binding coverage, criterion count, and criterion self-checkability; show a command or explicit zero count for each class (`.skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:49,75-105`; `.skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:1050-1080`). |
| REQ-003 | Reproduce every defect cited by the source audit with a runnable command and retain its output in the corpus report (`specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/scratch/wave1-goal-system-audit.md:37,41-45`). |
| REQ-004 | Assign rendering, validation, runtime state, host session-goal setting, and packet-file authoring to named owners with source citations (`.skilled/hooks/goal/lib/goal-slice.cjs:52-79,87-118`; `.skilled/hooks/goal/bin/goal.cjs:153-173,203-216,233-246`; `.skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:1050-1080`; `.skilled/commands/speckit/assets/speckit-plan.yaml:182-200`). |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | Write decision tests for when to author a packet goal and when to route a session-goal request to the existing host or hook surface; preserve the distinction between the file and the session string (`.skilled/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md:103-123`). |
| REQ-006 | Decide whether conformance checks belong in the mode or should be proposed as a system-spec-kit amendment, and record the rationale against parent decision D4 (`specs/sk-doc/060-create-goal-mode/spec.md:157`; `specs/sk-doc/060-create-goal-mode/goal.md:49-54`). |
| REQ-007 | Specify the mode target tree and its omissions using the nested-packet precedent; do not add a copied goal template (`specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/scratch/wave1-mode-anatomy-audit.md:29-43`; `specs/sk-doc/060-create-goal-mode/goal.md:49-54`). |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The corpus report's denominator equals the count from `find specs -type f -name goal.md ! -path '*/z_archive/*'`.
- **SC-002**: Every path in that census has a successful `goal.cjs packet` result; each cited defect has a reproducing command and observed output in `goal-corpus-audit.md` (`.skilled/hooks/goal/bin/goal.cjs:203-216`; parent handoff: `specs/sk-doc/060-create-goal-mode/spec.md:142`).
- **SC-003**: The ownership decision names one owner per surface and `target-tree.md` records the five planned mode-contract artifacts (`specs/sk-doc/z_archive/040-create-repo-rules/002-inventory-and-skill-contract/target-tree.md:30-69`).
- **SC-004**: The open checker question has one recorded answer and rationale consistent with D4 (`specs/sk-doc/060-create-goal-mode/spec.md:157`; `specs/sk-doc/060-create-goal-mode/goal.md:49-54`).

**Given** the non-archive `goal.md` paths are enumerated, **When** the corpus command runs, **Then** its processed count matches the `find` count.

**Given** a goal path is in the census, **When** `goal.cjs packet <packet-directory> --workspace "$PWD"` runs, **Then** the report records its exit status and `packet_budget` output (`.skilled/hooks/goal/bin/goal.cjs:203-216`).

**Given** an audit-cited defect example, **When** its named reproduction command runs, **Then** the output shows the cited condition or the report records that the condition is not reproducible (`specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/scratch/wave1-goal-system-audit.md:37,41-45`).

**Given** a request could mean file authoring or runtime session-goal management, **When** the decision tests classify it, **Then** `decision-tests.md` names an owner and a route for both cases (`.skilled/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md:103-123`; `.skilled/commands/speckit/assets/speckit-plan.yaml:182-200`).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Goal source files and two audits | Missing or moved inputs leave the affected result UNKNOWN | Record the unavailable path and stop that classification; do not infer a result (`specs/sk-doc/060-create-goal-mode/spec.md:164-168`). |
| Risk | `goal.cjs packet` reports projections, not semantic quality | A successful command alone cannot judge criterion self-checkability (`.skilled/hooks/goal/bin/goal.cjs:203-216`; `.skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:99-105`) | Pair metrics with cited review and a reproducible text or structure command. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Run one packet report for each enumerated goal; report elapsed time only if measured (`.skilled/hooks/goal/bin/goal.cjs:203-216`).
- **NFR-P02**: Set no runtime or throughput target for this read-only inventory phase.

### Security
- **NFR-S01**: Run read-only commands against source paths; do not invoke goal `bind`, `set`, or log actions (`.skilled/hooks/goal/bin/goal.cjs:153-173,193-216,233-246`).
- **NFR-S02**: Do not write to `.skilled/`; parent scope reserves those files and runtime state (`specs/sk-doc/060-create-goal-mode/spec.md:90-99`).

### Reliability
- **NFR-R01**: Keep the file count and per-file CLI exit status so missing or failed reports remain visible.
- **NFR-R02**: Run the strict phase validator before handoff; the parent requires each phase to pass independently (`specs/sk-doc/060-create-goal-mode/spec.md:131-136`).
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty corpus: record a zero count and verify the `find` scope before classifying coverage.
- Maximum length: record `packet_durable_chars` and `packet_budget` for each path; the durable limit is enforced for packet roots and phase parents (`.skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:1050-1061`).
- Missing goal file: record the packet command's nonzero exit and path; do not substitute a nearby file (`.skilled/hooks/goal/bin/goal.cjs:203-207`).

### Error Scenarios
- CLI failure: preserve the path, command, output, and exit status; retry only after identifying an input or invocation error (`.skilled/hooks/goal/bin/goal.cjs:203-216`).
- Source citation mismatch: re-open the named line range and correct the report before handoff.
- Concurrent edits: pause measurements, rerun affected commands against a stable source state, and record that state in the corpus report.

### State Transitions
- Partial inventory: retain completed per-file results, mark the denominator incomplete, and do not claim corpus coverage.
- Unresolved ownership decision: keep phase status Draft and do not hand off to phase 002 (`specs/sk-doc/060-create-goal-mode/spec.md:131-143`).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Five analysis artifacts and one bounded source/corpus inventory. |
| Risk | 4/25 | Read-only source work; main risk is a misleading measurement or owner assignment. |
| Research | 18/20 | Goal anatomy, corpus metrics, defect reproduction, ownership, and target-tree decisions. |
| **Total** | **34/70** | **Level 2; scores are planning estimates.** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Does the evidence place the conformance checker in the mode, or should missing binding completeness be proposed to system-spec-kit under D4? Record one answer in `mode-boundary.md` (`specs/sk-doc/060-create-goal-mode/spec.md:157`; `specs/sk-doc/060-create-goal-mode/goal.md:49-54`).
- Which corpus checks are objective command results, and which require documented human judgment about meaning? Use the goal CLI for its measured projections and cite the template's self-checkability rule (`.skilled/hooks/goal/bin/goal.cjs:203-216`; `.skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:99-105`).
<!-- /ANCHOR:questions -->

---
