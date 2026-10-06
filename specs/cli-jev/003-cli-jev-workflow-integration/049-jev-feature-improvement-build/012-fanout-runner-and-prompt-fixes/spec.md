---
title: "Feature Specification: Fix: fan-out runner, merge and lineage prompt"
description: "A fan-out run merges every finding a lineage writes, fails fast on a refusal that cannot change, and its lineages neither halt for an absent operator nor write outside their folder."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Fix: fan-out runner, merge and lineage prompt

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-03 |
| **Branch** | `scaffold/012-fanout-runner-and-prompt-fixes` |
| **Parent Spec** | ../spec.md |
| **Phase** | 12 of 12 |
| **Predecessor** | 011-research-run-init-via-gateway |
| **Successor** | None |
| **Handoff Criteria** | Every completion criterion in `goal.md` is checked with evidence |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 12** of the Build the recommendations from 048's research for each kept Jev feature, and fix the deep-research workflow faults found while running it specification.

**Scope Boundary**: The faults listed in scope below, as recorded in the deviations table in `048-jev-feature-improvement-research/goal.md`.

**Dependencies**:
- the deviations table in `048-jev-feature-improvement-research/goal.md` records the faults and their evidence

**Deliverables**:
- The merge reads delta finding text from `claim` and `summary` as well, and warns on a finding row it cannot read
- The iteration prompt pack restates that a delta finding's text goes in `label`
- The runner classifies a lineage that stopped on a gateway projection refusal as non-retryable

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 048 hit four more fan-out faults. The merge reads a delta finding's text only from `title`, `label`, `finding` or `text`, so DeepSeek's `claim` rows on 008 read as empty and the closeout refused. The runner labels a deterministic gateway refusal `salvage_miss`, transient, and retries it five times. One lineage stopped to ask "which truth prevails" with no operator present, and one wrote its strategy file at the worktree root.

### Purpose
A fan-out run merges every finding a lineage writes, fails fast on a refusal that cannot change, and its lineages neither halt for an absent operator nor write outside their folder.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The merge reads delta finding text from `claim` and `summary` as well, and warns on a finding row it cannot read
- The iteration prompt pack restates that a delta finding's text goes in `label`
- The runner classifies a lineage that stopped on a gateway projection refusal as non-retryable
- The iteration prompt pack tells a fan-out lineage to record a contradiction as a finding and continue, since no operator is present
- The iteration prompt pack tells the lineage to write each artifact at the exact lineage path it is given, never a bare filename or a rebuilt path
- The runner hands each lineage its directory as an absolute path, so the verbatim paths cannot land at the repository root

### Out of Scope
- The config-row fault itself - child 011 owns it
- Containment advisories that flag the orchestrator's own writes on a shared checkout - they cannot attribute a write to its process, so this stays a known limitation

### Files to Change

| File Path | Change Type | Description |
| ----------- | ------------- | ------------- |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs` | Modify | Read `claim` and `summary`, warn on unreadable finding rows |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-merge.vitest.ts` | Modify | Cases for the new fields and the warning |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | Projection refusal is non-retryable, absolute lineage directory |
| `.skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs` | Modify | Write a refusal record into the run directory when a projection refresh fails |
| `.skilled/skills/system-deep-loop/runtime/scripts/lib/cli-guards.cjs` and `fanout-pool.cjs` | Modify | A fatal `projection_refusal` failure class and its rollup |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/append-mode-event-cli.vitest.ts` and `fanout-pool.vitest.ts` | Modify | The refusal record and the projection-refusal class and rollup |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modify | Cases for the refusal classification and the absolute lineage directory |
| `.skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl` | Modify | Field name, contradiction handling, verbatim lineage-path rule |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/prompt-pack.vitest.ts` | Modify | Render assertions for the three iteration-prompt instructions |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
| ---- | ------------- | --------------------- |
| REQ-001 | A lineage whose delta findings use `claim` merges every finding. | A test merges a lineage with `claim` rows and counts them all, and the closeout invariant passes. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
| ---- | ------------- | --------------------- |
| REQ-002 | A lineage stopped by a gateway projection refusal is not retried. | The gateway writes a refusal record in the lineage's run directory, and a test runs a lineage that leaves one and asserts one attempt and a non-retryable class. |
| REQ-003 | The prompt pack states the `label` field, the contradiction rule and the verbatim lineage-path rule. | A render test asserts all three instructions in the rendered prompt. |
| REQ-004 | The runner resolves the lineage directory to an absolute path before it builds the lineage prompt. | A test builds a lineage prompt from a relative base directory and asserts the absolute lineage path. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Phase 048's 008 merge would have passed without the manual repair
- **SC-002**: A deterministic refusal costs one attempt, not six
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
| ------ | ------ | -------- | ------------ |
| Dependency | `system-deep-loop/038-review-and-cli-lineage/003-cli-pi-opencode-go-route` has uncommitted edits to `fanout-run.cjs` and its test in the primary checkout | Merge conflict | Build after that packet lands on main, or rebase onto it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The faults and their evidence are in 048's goal log.
<!-- /ANCHOR:questions -->

---


