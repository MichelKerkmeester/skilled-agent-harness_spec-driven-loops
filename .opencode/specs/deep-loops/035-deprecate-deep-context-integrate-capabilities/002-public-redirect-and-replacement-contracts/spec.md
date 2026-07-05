---
title: "Feature Specification: Public Redirect And Replacement Context Contracts"
description: "Phase 002 defines and validates the public redirect for standalone /deep:context and the replacement context snapshot contract inside deep-research and deep-review."
trigger_phrases:
  - "deep-context public redirect"
  - "deep-context replacement context contract"
  - "context snapshot in deep-research"
  - "context snapshot in deep-review"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/035-deprecate-deep-context-integrate-capabilities/002-public-redirect-and-replacement-contracts"
    last_updated_at: "2026-07-04T17:50:32Z"
    last_updated_by: "opencode"
    recent_action: "Validated phase 002 public redirect and replacement contracts"
    next_safe_action: "Use phase 003/004 outputs for discoverability and runtime cleanup evidence"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "../001-research-baseline-and-inventory/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-04-phase-002-contract-authoring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Preserve @context as a separate one-shot retrieval agent."
      - "Use staged deprecation instead of hard deletion."
      - "Maintained command source authority was resolved and validated."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Public Redirect And Replacement Context Contracts

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

Phase 002 changes the public behavior contract for standalone `deep-context`: new `/deep:context` runs should fail closed with replacement guidance instead of launching the legacy context loop. The phase also adds a durable, smaller context snapshot expectation to `deep-research` and `deep-review` so the useful reuse-first handoff survives without a standalone loop.

**Key Decisions**: fail closed before cleanup; embed context snapshot guidance in `deep-research` and `deep-review`; regenerate compiled command contracts rather than hand-editing generated files.

**Critical Dependencies**: phase 001 inventory, the observed command-source mismatch, command contract compiler, and direct grep verification because the code graph is stale.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Validated |
| **Created** | 2026-07-04 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 2 of 4 |
| **Predecessor** | `../001-research-baseline-and-inventory/spec.md` |
| **Successor** | `../003-discoverability-docs-mirrors-and-index/spec.md` |
| **Handoff Criteria** | `/deep:context` no longer loads legacy YAML, replacement context contracts are documented, and generated contracts are refreshed from maintained sources. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Standalone `deep-context` still has an executable asset chain: presentation text, auto YAML, confirm YAML, a compiled command contract, deep-context packet docs, and a dedicated agent. Keeping that path live while deprecating the mode creates a split-brain workflow where users can still start the old loop even though replacement context behavior is intended to live inside `deep-research` and `deep-review`.

The current workspace also has a source-authority mismatch: `.opencode/commands/deep/assets/compiled/deep_context.contract.md` names `.opencode/commands/deep/context.md`, but no matching command markdown file is present under `.opencode/commands/**/context.md`. That mismatch must be resolved before changing runtime behavior.

### Purpose

Make the public standalone context route safe by redirecting or halting new runs, while preserving the useful reuse-first context summary as an explicit contract inside `deep-research` and `deep-review`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Resolve the maintained source for `/deep:context` before editing command behavior.
- Replace new standalone `/deep:context` execution with a fail-closed redirect that points users to `@context`, `/deep:research`, `/deep:review`, and `/speckit:plan` as appropriate.
- Prevent `deep_context_auto.yaml` and `deep_context_confirm.yaml` from dispatching the legacy context loop for new runs.
- Add replacement context snapshot guidance to `deep-research` and `deep-review` without importing the old standalone convergence loop.
- Regenerate compiled command contracts and manifest entries from maintained sources after source edits.
- Keep existing historical context artifacts readable.

### Out of Scope

- Removing registry/advisor discoverability entries; phase 003 owns that.
- Updating active fixtures, behavior benchmarks, or nested deep-context packet internals; phase 004 owns that.
- Deleting the `@context` one-shot retrieval agent.
- Rewriting historical specs that only mention old behavior as records.
- Removing deep-loop-runtime `context` branches before tests prove no active consumer remains.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/deep/context.md` | Restore or retire source reference | Resolve missing source listed by the compiled contract before runtime edits. |
| `.opencode/commands/deep/assets/legacy/deep_context.body.md` | Modify if still authoritative | Replace executable setup flow with deprecation guidance or align it with restored command source. |
| `.opencode/commands/deep/assets/deep_context_presentation.txt` | Modify | Replace startup/dashboard copy with deprecation and replacement guidance. |
| `.opencode/commands/deep/assets/deep_context_auto.yaml` | Modify | Fail closed before legacy loop dispatch for autonomous invocations. |
| `.opencode/commands/deep/assets/deep_context_confirm.yaml` | Modify | Fail closed before legacy loop dispatch for confirm-mode invocations. |
| `.opencode/commands/deep/assets/compiled/deep_context.contract.md` | Regenerate only | Reflect maintained source changes through the command compiler. |
| `.opencode/commands/deep/assets/compiled/manifest.jsonl` | Regenerate only | Keep compiled manifest aligned with command contracts. |
| `.opencode/skills/deep-loop-workflows/deep-research/SKILL.md` | Modify | Add replacement context snapshot rules for research initialization and synthesis. |
| `.opencode/skills/deep-loop-workflows/deep-research/assets/deep_research_strategy.md` | Modify | Add a bounded reuse-first context snapshot slot when codebase scope exists. |
| `.opencode/skills/deep-loop-workflows/deep-research/assets/prompt_pack_iteration.md.tmpl` | Modify if needed | Surface context snapshot pointers without embedding full source bodies. |
| `.opencode/skills/deep-loop-workflows/deep-review/SKILL.md` | Modify | Add replacement context snapshot rules for review initialization and synthesis. |
| `.opencode/skills/deep-loop-workflows/deep-review/assets/deep_review_strategy.md` | Modify | Add a bounded reuse-first context snapshot slot for review targets. |
| `.opencode/skills/deep-loop-workflows/deep-review/assets/review_mode_contract.yaml` | Modify if needed | Make context snapshot expectations machine-checkable for review setup. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Resolve `/deep:context` source authority. | The missing `.opencode/commands/deep/context.md` mismatch is either fixed by restoring a maintained source or removed from generation by updating the authoritative source list. |
| REQ-002 | Stop new standalone context-loop runs. | `/deep:context:auto` and `/deep:context:confirm` cannot load the legacy context YAML path and instead return replacement guidance. |
| REQ-003 | Preserve safe alternatives. | Redirect text distinguishes `@context` one-shot retrieval, `/deep:research` investigation, `/deep:review` audit, and `/speckit:plan` planning. |
| REQ-004 | Add replacement context snapshot contracts. | `deep-research` and `deep-review` docs/templates define a bounded snapshot of relevant files, integration points, risks, and reuse candidates. |
| REQ-005 | Keep generated contracts generated. | `deep_context.contract.md` and `manifest.jsonl` are regenerated by the command compiler, not hand-edited. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Keep existing artifacts readable. | Prior `context/` artifacts are not deleted in this phase. |
| REQ-007 | Avoid importing standalone semantics. | Replacement context snapshots do not dispatch `deep-context`, do not use agreement-gated context convergence, and do not create a new context loop under another name. |
| REQ-008 | Refresh phase and parent metadata. | `description.json` and `graph-metadata.json` reflect phase 002 status after edits. |
| REQ-009 | Verify command behavior directly. | A command or contract-level smoke check proves the redirect/halting path before phase 003 begins. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: New `/deep:context` invocations cannot start the legacy standalone loop.
- **SC-002**: Users receive clear replacement guidance that preserves `@context` as a separate one-shot retrieval path.
- **SC-003**: `deep-research` and `deep-review` have explicit context snapshot contracts that reuse codebase knowledge without standalone context-loop machinery.
- **SC-004**: Generated command contracts match maintained sources after regeneration.
- **SC-005**: Phase 002 validates strictly and the parent recursive validation still passes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Command contract compiler | Generated contract drift can leave stale `/deep:context` behavior visible. | Find and run the existing compiler; never hand-edit compiled output. |
| Dependency | Missing `.opencode/commands/deep/context.md` | Runtime changes could target the wrong source. | Resolve source authority before command edits. |
| Dependency | Phase 001 inventory | Replacement work can miss active surfaces. | Re-run targeted grep before editing runtime files. |
| Risk | Redirect removes useful capability too early | Users lose codebase context before replacements exist. | Add snapshot contracts first, then redirect. |
| Risk | Snapshot becomes a hidden loop | Scope creeps into rebuilding `deep-context`. | Keep snapshot bounded, pointer-based, and owned by research/review initialization. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Replacement snapshots must be bounded and pointer-based; they must not inline large source bodies into iteration prompts.

### Security
- **NFR-S01**: Redirect and snapshot docs must not persist secrets, environment variables, or full private source bodies beyond existing artifact conventions.

### Reliability
- **NFR-R01**: The redirect must fail closed before any legacy YAML dispatch branch can start a standalone context run.

---

## 8. EDGE CASES

### Missing Command Source
- The compiled contract references `.opencode/commands/deep/context.md`, but direct glob checks did not find that file. Phase 002 must resolve whether to restore the file, update generation input paths, or formally retire the missing source reference.

### Existing Context Artifacts
- Existing `context/context-report.md` and related artifacts may remain in older packets. This phase only stops new standalone runs; archival decisions move to phase 004.

### User Asking For Quick Codebase Lookup
- Redirect guidance must point quick one-shot lookup requests to `@context` or direct Grep/Glob, not to `/deep:research` by default.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Command assets, generated contracts, two workflow packets. |
| Risk | 17/25 | Public command behavior changes and generated-source mismatch. |
| Research | 12/20 | Research complete, but source authority needs fresh verification. |
| Multi-Agent | 5/15 | No parallel agents required for this phase. |
| Coordination | 12/15 | Must hand off cleanly to registry/docs cleanup. |
| **Total** | **64/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | The redirect edits a non-authoritative legacy file while the generator uses another source. | High | Medium | Resolve missing source authority first. |
| R-002 | Compiled contract remains stale after source edits. | High | Medium | Regenerate and diff compiled outputs. |
| R-003 | Research/review snapshots become too broad and recreate context-loop costs. | Medium | Medium | Require pointer-only bounded summaries. |
| R-004 | Users lose clear guidance for quick lookups. | Medium | Low | Preserve `@context` in redirect wording. |

---

## 11. USER STORIES

### US-001: Safe Standalone Deprecation (Priority: P0)

**As a** user who tries `/deep:context`, **I want** a clear stop message and replacement choices, **so that** I do not start a deprecated loop or write new legacy artifacts.

**Acceptance Criteria**:
1. Given `/deep:context:auto` is invoked, When setup would normally load `deep_context_auto.yaml`, Then the command fails closed with replacement guidance.
2. Given `/deep:context:confirm` is invoked, When setup would normally ask confirmation questions, Then it stops before legacy dispatch and shows the same replacement guidance.

---

### US-002: Replacement Context In Deep Loops (Priority: P1)

**As a** maintainer running `deep-research` or `deep-review`, **I want** a bounded context snapshot in the existing loop state, **so that** codebase knowledge survives without keeping standalone `deep-context` active.

**Acceptance Criteria**:
1. Given a research or review run starts with a codebase target, When strategy initialization runs, Then the strategy captures a pointer-based context snapshot or records why one is unavailable.
2. Given final synthesis runs, When it cites context inputs, Then it references snapshot artifacts and source paths without embedding full file bodies.

---

## 12. OPEN QUESTIONS

- Should `.opencode/commands/deep/context.md` be restored as the maintained source, or should the command compiler be updated to use `.opencode/commands/deep/assets/legacy/deep_context.body.md`?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent**: `../spec.md`
- **Research Baseline**: `../001-research-baseline-and-inventory/spec.md`
- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Decision Record**: `decision-record.md`
