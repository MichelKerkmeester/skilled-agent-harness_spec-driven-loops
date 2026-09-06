---
title: "Feature Specification: Optimize Spec-Kit Core-Document Contract and Plan Template"
description: "Define a lifecycle-honest core-document contract and remove duplicated phase checkboxes from Level-1 plans while preserving higher-level planning content and existing packet compatibility"
trigger_phrases:
  - "plan contract optimization"
  - "spec-kit document contract"
  - "implementation-summary lifecycle gate"
  - "plan phase checkbox reduction"
  - "template contract optimization"
  - "golden snapshot verification"
importance_tier: "important"
contextType: "implementation"
---
# Feature Specification: Optimize Spec-Kit Core-Document Contract and Plan Template

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-27 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `036-spec-doc-template-reduction` |
| **Phase** | `008-plan-and-contract-optimization` |
| **Predecessor** | `007-lazy-addon-docs` |
| **Successor** | None |
| **Artifact Set** | `spec.md`, `plan.md`, and `tasks.md` only |
| **Implementation Summary** | Deferred to the later implementation phase |
| **Handoff Criteria** | The later implementation has a named lifecycle contract, a task-authoritative plan template, backward-compatibility cases, and executable verification gates. |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:phase-context -->
## Phase Context

This is Phase 8 of the Reduce and optimize spec-kit document templates packet. It designs two remaining optimizations from the independent analysis: align the manifest with the runtime lifecycle for `implementation-summary.md`, and remove duplicated phase checkboxes from `plan.md.tmpl`.

This phase writes design documents only. A later implementation phase owns changes to the manifest, templates, runtime consumers, validators, contract tests, and golden snapshots.

**Scope Boundary**: Keep the four-document lifecycle contract. A fresh planned packet needs `spec.md`, `plan.md`, and `tasks.md`; `implementation-summary.md` becomes required when implementation starts. Keep `tasks.md` as the source of phase checkboxes. Keep Level 2 and higher planning content intact.

**Dependencies**:
- The manifest-backed contract resolver supplies document and section classifications.
- `check-files.sh` and `check-level-match.sh` already detect implementation start from completed task or checklist items.
- `spec-doc-health.ts` already models the pre-start Level-1 document set as three files.
- The scaffold golden snapshots define the rendered output contract.

**Deliverables**:
- A lifecycle-gated manifest design for `implementation-summary.md` at Levels 1, 2, 3, and 3+.
- A plan-template design that delegates phase checkboxes to `tasks.md` and makes Level-1 N/A sections concise.
- A backward-compatibility and verification matrix for the later implementation.

<!-- /ANCHOR:phase-context -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The manifest declares `implementation-summary.md` in `requiredCoreDocs` for every numbered level, including Level 1 at `.opencode/skills/system-spec-kit/templates/spec-kit-docs.json:163-167`, Level 2 at `:290-295`, Level 3 at `:460-464`, and Level 3+ at `:657-662`. That declaration overstates the contract at scaffold time. The runtime skips the summary from the generic required-file loop and requires it only after implementation starts in `.opencode/skills/system-spec-kit/scripts/rules/check-files.sh:65-98`; `check-level-match.sh:201-215` applies the same lifecycle skip, and its implementation-start detector is defined at `:123-134`. The shared parser lists only `spec.md`, `plan.md`, and `tasks.md` for Level 1 at `.opencode/skills/system-spec-kit/shared/parsing/spec-doc-health.ts:53-57`.

The Level-1 plan template also duplicates the phase checklist that `tasks.md` owns. `plan.md.tmpl` places Setup, Core Implementation, and Verification checkbox rows at `.opencode/skills/system-spec-kit/templates/core/plan.md.tmpl:119-136`, while the Level-1 tasks template repeats the same phase structure at its `phase-1`, `phase-2`, and `phase-3` anchors. The duplicated plan rows add maintenance work and invite disagreement about task state. Level-1 plans also force generic testing, dependency, and rollback content when a concise N/A statement would accurately describe the phase.

### Purpose

Define an implementation-ready optimization that keeps all four documents in the lifecycle contract, makes `implementation-summary.md` conditionally required after work starts, makes `tasks.md` authoritative for phase checkboxes, and preserves substantive Level 2+ planning content without breaking existing packets.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Define `lifecycleRequiredDocs.afterImplementationStarts` for `implementation-summary.md` in every numbered level of `spec-kit-docs.json`.
- Remove `implementation-summary.md` from numbered-level `requiredCoreDocs` while retaining the four-document lifecycle contract in the manifest and runtime behavior.
- Align the contract resolver, template-structure helper, scaffold path, `check-files.sh`, `check-level-match.sh`, and `spec-doc-health.ts` with the same pre-start and post-start document states.
- Trim the duplicated Setup, Core Implementation, and Verification checkbox rows from `templates/core/plan.md.tmpl` and keep `tasks.md` as the phase checklist authority.
- Let the Level-1 plan render concise N/A statements for testing, dependencies, and rollback when those concerns do not apply.
- Preserve Level 2+ testing, rollback, phase-dependency and dependency-graph content, plus the level-gated `FIX ADDENDUM: AFFECTED SURFACES` section.
- Verify default and started scaffolds, recursive validation, resolver behavior, and golden snapshots in the later implementation phase.

### Out of Scope
- Dropping, merging, or renaming `spec.md`, `plan.md`, `tasks.md`, or `implementation-summary.md`.
- Editing the manifest, templates, code, validators, contract tests, or golden snapshots in this design phase.
- Rewriting existing packet documents or requiring existing packets to create a new summary file during migration.
- Changing the `tasks.md` phase anchors or moving implementation history into `plan.md`.
- Authoring `implementation-summary.md`, `description.json`, or `graph-metadata.json` in this phase folder.

### Files to Change in the Later Implementation Step

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/templates/spec-kit-docs.json` | Modify | Remove the summary from numbered-level `requiredCoreDocs` and declare the lifecycle-gated requirement for Levels 1, 2, 3, and 3+. |
| `.opencode/skills/system-spec-kit/templates/core/plan.md.tmpl` | Modify | Remove duplicated phase checkbox rows, keep the `phases` anchor as a sequencing pointer, and add Level-1 N/A paths while preserving Level 2+ content. |
| `.opencode/skills/system-spec-kit/mcp-server/lib/templates/level-contract-resolver.ts` | Review/Modify | Expose and validate the lifecycle-gated document classification without treating it as unconditional core content. |
| `.opencode/skills/system-spec-kit/scripts/utils/template-structure.js` | Review/Modify | Resolve lifecycle-gated docs and retain legacy document and anchor compatibility. |
| `.opencode/skills/system-spec-kit/scripts/spec/create.sh` | Review/Modify | Create the three pre-start core documents by default and create the summary at the implementation-start transition defined by the later workflow. |
| `.opencode/skills/system-spec-kit/scripts/rules/check-files.sh` | Align/Modify | Keep the completed-item gate and exclude the lifecycle-gated summary from the unconditional required loop. |
| `.opencode/skills/system-spec-kit/scripts/rules/check-level-match.sh` | Align/Modify | Apply the same lifecycle gate when resolving required files for every numbered level. |
| `.opencode/skills/system-spec-kit/shared/parsing/spec-doc-health.ts` | Align/Modify | Keep the pre-start three-file health contract and recognize the summary as lifecycle-gated when present or required. |
| `.opencode/skills/system-spec-kit/scripts/tests/level-contract-resolver.vitest.ts` | Modify | Cover the four numbered-level lifecycle classifications and the unchanged required core trio. |
| `.opencode/skills/system-spec-kit/scripts/tests/scaffold-golden-snapshots.vitest.ts` | Modify | Smoke-test pre-start and started scaffold shapes and assert the trimmed plan output. |
| `.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap` | Modify | Record the intentional plan and scaffold contract changes while keeping unrelated snapshots stable. |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Keep the four core documents as a lifecycle contract while defining the legitimate pre-start state. | The later design implementation documents `spec.md`, `plan.md`, `tasks.md`, and `implementation-summary.md` as the retained four-document lifecycle set; a fresh planned-but-unbuilt packet may contain exactly the first three, and the summary is not required before implementation starts. |
| REQ-002 | Represent `implementation-summary.md` as a lifecycle-gated document in the manifest. | `spec-kit-docs.json` removes `implementation-summary.md` from `requiredCoreDocs` at Levels 1, 2, 3, and 3+; each numbered level declares `lifecycleRequiredDocs.afterImplementationStarts` containing that file; the document entry identifies an implementation-start trigger and lifecycle-gated absence behavior. |
| REQ-003 | Keep all contract consumers aligned with the runtime lifecycle. | The later implementation keeps the completed task or checklist item detector as the single start condition, excludes the summary from unconditional required-file loops, requires it after start, and keeps `spec-doc-health.ts` consistent with the three-file pre-start set. The notation table's literal backticked `[x]` does not count as started work. |
| REQ-004 | Remove duplicated phase checkboxes from the plan template. | A Level-1 render of `plan.md.tmpl` contains no Setup, Core Implementation, or Verification checkbox rows; the `phases` anchor remains a concise pointer to `tasks.md`, which remains authoritative for phase sequencing and task state. |
| REQ-005 | Make Level-1 plan sections concise without weakening higher-level planning. | The later Level-1 render permits a single accurate N/A statement for testing, dependencies, or rollback when a section does not apply. Level 2+ renders retain substantive testing, rollback, phase-dependency, and `FIX ADDENDUM: AFFECTED SURFACES` content; Level 3 and Level 3+ renders retain the dependency graph content. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Preserve existing packet compatibility. | Existing packets that already contain `implementation-summary.md` remain valid without migration; fresh pre-start packets without the summary do not fail; legacy plan documents with phase checkboxes remain readable; and `validate.sh --recursive` reports no new failures across the parent packet. |
| REQ-007 | Verify the optimized contract and rendered output. | The later implementation passes `create.sh` smoke cases for pre-start and started packets, passes the focused manifest and resolver matrix, keeps `validate.sh --recursive` green, and keeps the golden snapshot suite green except for intentional approved changes to the trimmed plan and scaffold shape. |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The manifest and runtime describe one lifecycle: three required documents before implementation starts and four required documents after a completed task or checklist item appears.
- **SC-002**: The lifecycle classification is identical across `spec-kit-docs.json`, the resolver, `template-structure.js`, `check-files.sh`, `check-level-match.sh`, and `spec-doc-health.ts`.
- **SC-003**: The rendered Level-1 plan delegates all phase checkboxes to `tasks.md` and supports concise N/A content for inapplicable testing, dependency, and rollback sections.
- **SC-004**: The rendered Level 2+ plan keeps the substantive testing, rollback, phase-dependency, and `FIX ADDENDUM` content, and the Level 3 and Level 3+ plan keeps the dependency graph content at its existing gate.
- **SC-005**: Later verification passes the pre-start and started scaffold cases, recursive validation, resolver tests, and golden snapshots without new failures in existing packets.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A resolver consumer ignores the new lifecycle field. | The manifest and runtime can disagree about when the summary is required. | Update the resolver, template-structure helper, scaffold path, and contract tests together, then exercise all numbered levels. |
| Risk | The implementation-start detector treats notation guidance as completed work. | A fresh packet can fail because the summary appears falsely required. | Preserve the anchored list-item expression in `check-files.sh` and `check-level-match.sh`, and test the notation-table negative control. |
| Risk | Removing phase rows changes more than intended plan output. | Level 2+ planning guidance or existing packet validation can regress. | Change only the duplicated checkbox body, retain the `phases` anchor and all L2+ substantive sections, and compare scoped golden snapshots. |
| Risk | Existing packets contain legacy plan phase checkboxes. | A strict validator or snapshot check can reject valid historical documents. | Keep legacy reads permissive, avoid rewriting existing packets, and run recursive validation before claiming the later implementation complete. |
| Dependency | Manifest-backed contract resolver and template-structure helper. | Scaffold and validator behavior can diverge without a shared classification. | Add explicit lifecycle contract coverage before changing scaffold behavior. |
| Dependency | Scaffold golden snapshots and parent packet fixtures. | The intended rendered shape lacks a regression baseline. | Update only the intentional snapshot entries and verify the whole parent packet. |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

No open questions remain for this design. The later implementation uses `lifecycleRequiredDocs.afterImplementationStarts` as the manifest field, keeps `tasks.md` authoritative for phase checkboxes, and treats this phase's missing implementation summary as intentional.

<!-- /ANCHOR:questions -->
