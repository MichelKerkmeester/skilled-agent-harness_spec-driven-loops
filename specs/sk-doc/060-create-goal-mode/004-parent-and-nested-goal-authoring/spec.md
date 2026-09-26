---
title: "Feature Specification: Phase 4: parent-and-nested-goal-authoring"
description: "The phase defines goal retrofit and complete parent-child bindings for phase packets (specs/sk-doc/060-create-goal-mode/spec.md:159; .skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:1064-1080)."
trigger_phrases:
  - "parent and nested goal workflow"
  - "bind every phase goal"
  - "retrofit a packet goal"
  - "add a phase binding row"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4: parent-and-nested-goal-authoring

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
| **Phase** | 4 of 9 |
| **Predecessor** | 003-authoring-standards-and-exemplars |
| **Successor** | 005-budget-and-chat-slice-handoff |
| **Handoff Criteria** | A parent and its children can be authored with every phase bound; a fixture packet validates with every phase child listed and no SPECDOC_SUFFICIENCY_006 (specs/sk-doc/060-create-goal-mode/spec.md:145). |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Create the sk-create-goal sk-doc mode that authors packet goals specification.

**Scope Boundary**: one reference document and its mode links defining top-level, phase-parent, child, retrofit, and phase-add goal authoring.

**Dependencies**:
- Phase 003 must meet its incoming handoff: each standard names the failure it prevents and a real corpus example, and the rubric flags known-bad examples while passing known-good ones (specs/sk-doc/060-create-goal-mode/spec.md:144).
- Use the parent Phase Documentation Map and each child phase’s own spec and acceptance criteria as source inputs (specs/sk-doc/060-create-goal-mode/spec.md:119-129).

**Deliverables**:
- .skilled/skills/sk-doc/sk-create-goal/references/parent-and-nested-goals.md, linked from references/README.md and loaded by SKILL.md (archived pattern: specs/sk-doc/z_archive/040-create-repo-rules/005-agents-md-integration/spec.md:91-98).
- A scratch fixture packet with a phase parent and one goal per on-disk child, checked by strict validation.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A parent goal can omit a phase folder that exists on disk: the 017-memory-database-decommission binding table ends at 006, while the 007-decommission-review-p1-p2-fixes directory exists with no goal.md (specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/scratch/wave1-goal-system-audit.md:44; specs/system-speckit/033-system-speckit-v4/017-memory-database-decommission/goal.md:66-73; test ! -f specs/system-speckit/033-system-speckit-v4/017-memory-database-decommission/007-decommission-review-p1-p2-fixes/goal.md). The parent map’s phase 007 row names 007-deep-review-remediation, so the workflow must report the map-directory mismatch instead of silently substituting names (specs/system-speckit/033-system-speckit-v4/017-memory-database-decommission/spec.md:164). The goal validator checks whether each listed target resolves, but its binding loop does not compare the rows with every child directory, so this omission is not caught by that check (.skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:1064-1080; specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/scratch/wave1-goal-system-audit.md:7). With `create.sh --phase --with-goal`, the child-folder loop adds goal.md through each child’s document contract, while the new-parent path renders a lean spec.md without adding a parent goal; a missing phase-parent goal therefore needs a separate retrofit rendered at phase level (.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:444-463, 1275-1335, 1492-1504; .skilled/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md:103-115).

### Purpose
Define a repeatable workflow that gives each packet and phase child an accurate goal and keeps every on-disk phase bound.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Author a top-level goal from that packet’s own spec.md and acceptance-criteria.md.
- Author a phase-parent directive and binding table from the parent Phase Documentation Map, with one row for every direct phase-child directory on disk.
- Derive each nested phase-child goal from that child’s own spec.md and acceptance-criteria.md.
- Treat adding a goal to an existing packet with none as a named retrofit operation. The `create.sh --phase --with-goal` path scaffolds child goals through the child document contract but creates the lean parent spec separately; for a phase parent with no goal.md, render the phase-level goal contract with inline-gate-renderer.sh --level phase (.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:444-463, 1275-1335, 1492-1504; .skilled/skills/system-spec-kit/runtime/cli/templates/inline-gate-renderer.sh:231-282; .skilled/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md:103-115).
- Add one parent binding row and author the new child goal when a phase has been added to both the parent map and the filesystem. Apply the parent-precedence and amendment rules, then resend the parent chat slice when parent content changes (specs/sk-doc/060-create-goal-mode/goal.md:75-91; .skilled/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md:80-96).
- Prove the workflow with a scratch fixture whose binding-row count matches its child-directory count and whose strict validation on every rule except the three generated-metadata rules (`GENERATED_METADATA_INTEGRITY`, `GENERATED_METADATA_DRIFT`, `GRAPH_METADATA_CHILD_DRIFT`), which the graph-metadata writer cannot run under a scratch path, passes and reports no SPECDOC_SUFFICIENCY_006.

### Out of Scope
- Changing the system-spec-kit goal template, renderer, create.sh, or validator; parent scope assigns system-spec-kit gaps as amendments (specs/sk-doc/060-create-goal-mode/spec.md:94-98).
- Adding the conformance checker or negative-control suite owned by phase 006 (specs/sk-doc/060-create-goal-mode/spec.md:126).
- Budget cutting and chat-slice handoff details owned by phase 005, beyond the required resend rule (specs/sk-doc/060-create-goal-mode/spec.md:125; .skilled/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md:61-71,75-96).
- Command authoring, hub registration, runtime session-goal state, and changes to real packet goals (specs/sk-doc/060-create-goal-mode/goal.md:49-54; specs/sk-doc/060-create-goal-mode/spec.md:127-128).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .skilled/skills/sk-doc/sk-create-goal/references/parent-and-nested-goals.md | Create | Ordered authoring, retrofit, phase-add, precedence, and amendment workflow |
| .skilled/skills/sk-doc/sk-create-goal/references/README.md | Modify | Route the parent and nested goal reference |
| .skilled/skills/sk-doc/sk-create-goal/SKILL.md | Modify | Load the reference at the parent and child authoring steps |
| specs/sk-doc/060-create-goal-mode/004-parent-and-nested-goal-authoring/scratch/001-parent-and-nested-goals-fixture/ | Create | Phase-parent fixture with every child goal and binding row |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The reference defines top-level goal authoring from the packet’s own spec.md and acceptance-criteria.md and writes through the canonical goal template (.skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:2-37,46-70). |
| REQ-002 | The phase-parent workflow derives its binding table from the parent Phase Documentation Map and compares it with direct phase-child directories on disk; it creates exactly one row per directory and stops on a map-directory mismatch rather than guessing (specs/sk-doc/060-create-goal-mode/spec.md:119-129; .skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:1064-1080). |
| REQ-003 | Each nested child goal is derived from that child’s own spec.md and acceptance-criteria.md; child goals contain phase-local criteria and no parent binding section (.skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:75-105; specs/sk-doc/060-create-goal-mode/goal.md:75-91). |
| REQ-004 | Retrofitting a packet with no goal.md is a distinct operation. `create.sh --phase --with-goal` scaffolds child goals but leaves the fresh phase parent without a goal; render that missing parent goal with inline-gate-renderer.sh --level phase (.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:444-463, 1275-1335, 1492-1504; .skilled/skills/system-spec-kit/runtime/cli/templates/inline-gate-renderer.sh:231-282). |
| REQ-005 | When a phase is added to the parent map and its child directory exists, the workflow adds one matching parent binding row and authors that child’s goal (specs/sk-doc/060-create-goal-mode/spec.md:119-129). |
| REQ-006 | The reference states precedence: parent decisions bind, each child goal is authoritative for its phase, child detail outranks summaries, and conflicts are named. A child change that alters a parent decision or criterion is applied to the parent first, then the updated parent chat slice is resent (specs/sk-doc/060-create-goal-mode/goal.md:75-91; .skilled/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md:80-96). |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-007 | A scratch fixture has one phase goal and one parent binding row per child directory; strict validation on every rule except the three generated-metadata rules (`GENERATED_METADATA_INTEGRITY`, `GENERATED_METADATA_DRIFT`, `GRAPH_METADATA_CHILD_DRIFT`), which the graph-metadata writer cannot run under a scratch path, exits 0 and reports no SPECDOC_SUFFICIENCY_006 (specs/sk-doc/060-create-goal-mode/spec.md:145; .skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:1064-1080). |

> Acceptance criteria for these requirements live in acceptance-criteria.md,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Given a top-level packet with its own spec.md and acceptance-criteria.md, when goal authoring runs, then it produces a template-conformant goal using those sources (.skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:2-37,46-70).
- **SC-002**: Given a phase parent and matching map and child directories, when the parent workflow runs, then its binding rows equal the on-disk child count and every child goal uses that child’s own spec.md and acceptance-criteria.md (specs/sk-doc/060-create-goal-mode/spec.md:119-129).
- **SC-003**: Given an existing phase packet without a parent goal, when the retrofit operation runs, then it renders the phase-level goal structure with a binding section (.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1275-1335; .skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:75-91).
- **SC-004**: Given a newly added phase reflected in the map and filesystem, when the phase-add operation runs, then it adds exactly one row and resends the parent chat slice after the parent changes (.skilled/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md:80-96).
- **SC-005**: Given the completed scratch fixture, when validate.sh runs with --strict on every rule except the three generated-metadata rules (`GENERATED_METADATA_INTEGRITY`, `GENERATED_METADATA_DRIFT`, `GRAPH_METADATA_CHILD_DRIFT`), which the graph-metadata writer cannot run under a scratch path, then it exits 0 with zero SPECDOC_SUFFICIENCY_006 findings (specs/sk-doc/060-create-goal-mode/spec.md:145).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 003 authoring rubric and corpus examples | Without its required handoff, phase 004 could repeat a known-bad criterion pattern | Verify the incoming handoff in the parent map before implementation (specs/sk-doc/060-create-goal-mode/spec.md:144) |
| Risk | Parent map and on-disk child directories disagree | A guessed or omitted row leaves the parent directive incomplete | Stop, report the exact mismatch, and update the parent map through the phase-add workflow before writing goal rows (specs/sk-doc/060-create-goal-mode/spec.md:119-129) |
| Risk | Validator resolves listed targets but does not prove row completeness | A phase can remain unbound while the listed rows validate | Compare child-directory and binding-row counts in the fixture; retain the checker as phase 006 work (.skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:1064-1080; specs/sk-doc/060-create-goal-mode/spec.md:126) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No runtime performance target is introduced; this phase specifies a local documentation workflow.
- **NFR-P02**: Phase inventory is a single comparison between the parent map and direct child directories.

### Security
- **NFR-S01**: Goal outputs stay in the selected packet; the workflow does not alter runtime session state (specs/sk-doc/060-create-goal-mode/goal.md:49-54).
- **NFR-S02**: Missing or conflicting source documents stop authoring rather than being filled by assumption.

### Reliability
- **NFR-R01**: A successful parent binding has exactly one row for every on-disk phase-child directory.
- **NFR-R02**: A fixture passes strict validation on every rule except the three generated-metadata rules (`GENERATED_METADATA_INTEGRITY`, `GENERATED_METADATA_DRIFT`, `GRAPH_METADATA_CHILD_DRIFT`), which the graph-metadata writer cannot run under a scratch path, with no SPECDOC_SUFFICIENCY_006 finding (specs/sk-doc/060-create-goal-mode/spec.md:145).
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: If the target packet lacks spec.md or acceptance-criteria.md, report the missing source and do not author its goal.
- Maximum length: Parent goals remain subject to the 4,000-character durable-slice limit; budget cutting belongs to phase 005 (.skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:24-30; .skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:1050-1061; specs/sk-doc/060-create-goal-mode/spec.md:125).
- Invalid format: If a child directory has no corresponding parent-map row, stop and require the phase map to be reconciled before binding.

### Error Scenarios
- External service failure: Not applicable; this phase adds no external service or runtime dependency (specs/sk-doc/060-create-goal-mode/goal.md:49-54).
- Network timeout: Not applicable; the planned workflow uses repository documents and local commands.
- Concurrent access: Re-read the parent map and goal immediately before updating rows; recalculate the complete table if either changed.

### State Transitions
- Partial completion: A binding row whose target does not exist can trigger SPECDOC_SUFFICIENCY_006; create the child goal or remove the stale row, then rerun validation (.skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:1068-1080).
- Session expiry: Resume from the on-disk parent spec.md, parent goal.md, child spec.md files, and child acceptance-criteria.md files; do not rely on a remembered phase list.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | One reference, two mode links, and one phase fixture |
| Risk | 12/25 | Parent-map and filesystem mismatches can leave phases unbound |
| Research | 10/20 | Existing goal contract, renderer, validator, and archived mode reference must be traced |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Resolved: Yes. Retrofitting an existing packet with no goal.md is a named goal-authoring operation. For a phase parent with no parent goal, render the phase-level goal contract; create.sh’s fresh phase path renders the lean parent spec and scaffolds child documents (.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1275-1335, 1492-1504; specs/sk-doc/060-create-goal-mode/spec.md:159).
- No unresolved question remains for this phase. The binding-completeness checker stays in phase 006 (specs/sk-doc/060-create-goal-mode/spec.md:126).
<!-- /ANCHOR:questions -->

---


