---
title: "Feature Specification: Let the continuity writer save into a research-level folder"
description: "A full-auto save refused research records with continuity fields, so their spec.md blocks kept scaffold values."
trigger_phrases:
  - "research folder continuity"
  - "let the continuity writer save into a research"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Let the continuity writer save into a research-level folder

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-19 |
| **Branch** | `worktrees/157-ci-red-checks-and-research-save` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

A full-auto save with continuity fields refused every research record and left its continuity block scaffolded. The save logged `Continuity not written: <leaf> has no implementation-summary.md yet`, and the `_memory.continuity` blocks in the 082 child spec.md files 014 through 018 kept the values they were scaffolded with, including completion_pct 0. Commit 0d0f2a0a95 from 2026-09-23 wrote payload continuity only into implementation-summary.md, while research records scaffolded by create.sh keep that block in spec.md and never get an implementation summary.

### Purpose

A full-auto save writes a research record's continuity into its spec.md, so the block reports the latest iteration instead of the scaffold.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `continuityHostPath(leafPath)` in `.skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts`: it returns the leaf's `implementation-summary.md` when that file exists, else its `spec.md` when the file carries `<!-- SPECKIT_LEVEL: research -->`, else null.
- `planContinuityWrite` and `writePlannedContinuity` read, merge and atomically rename into that host, and the write plan carries it as `hostPath`.
- Two tests in `.skilled/skills/system-spec-kit/runtime/cli/tests/save-continuity-write.vitest.ts`: a research record's continuity lands in its spec.md with the scaffold values gone and no implementation summary created, and a non-research leaf without a summary still gets no write and the refusal message.
- Saved continuity for the five 082 research children 014 through 018, written into each child's spec.md continuity block.

### Out of Scope
- Deriving continuity automatically inside the writer from research/research.md - the save contract has the caller compose the payload, so the payload was composed from research/research.md and research/deep-research-state.jsonl instead.
- A new host doc for non-research leaves - a leaf with neither an implementation summary nor the research marker keeps the same refusal message.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts` | Modify | Adds `continuityHostPath(leafPath)` and reads, merges and renames the continuity block in the host it returns. |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/save-continuity-write.vitest.ts` | Modify | Adds the research-record spec.md write case and the non-research refusal case. |
| `.skilled/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts` | Modify | The --help text names a research record's spec.md as the other continuity host. |
| `.skilled/skills/system-spec-kit/references/memory/save-workflow.md` | Modify | The planner-mode table names a research record's spec.md as the other continuity host. |
| `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/014-post-merge-deep-research/spec.md` | Modify | Continuity block only. |
| `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/015-post-merge-research-sk-vision/spec.md` | Modify | Continuity block only. |
| `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/016-post-merge-research-cli-opencode-ci/spec.md` | Modify | Continuity block only. |
| `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/017-post-merge-research-provisioning/spec.md` | Modify | Continuity block only. |
| `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/018-post-merge-research-conformance/spec.md` | Modify | Continuity block only. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A leaf with neither an implementation summary nor the research marker still gets no continuity write | The save logs `Continuity not written: <leaf> has no implementation-summary.md yet` and leaves the leaf's spec.md unchanged |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | `continuityHostPath(leafPath)` returns the leaf's implementation-summary.md when it exists, else its spec.md when the file carries `<!-- SPECKIT_LEVEL: research -->`, else null | The plan carries the chosen host as `hostPath` |
| REQ-003 | `planContinuityWrite` and `writePlannedContinuity` read, merge and atomically rename into that host | The merge rebuilds under the leaf's canonical-save lock for a leaf reached through its parent, and `tsc --noEmit` exits 0 |
| REQ-004 | The five 082 research children 014 through 018 take their continuity from each `research/research.md` and `research/deep-research-state.jsonl` through full-auto saves | All five saves exit 0, none logs a continuity refusal, and the scaffold strings vanish from all five blocks |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Against the fixed writer, `save-continuity-write.vitest.ts` passes 17 of 17 tests with exit 0. Against the unfixed writer the same suite fails the research case with 1 failed, 16 passed and exit 1.
- **SC-002**: The five 082 research children 014 through 018 hold the scaffold string "Scaffolded the research record before the first iteration" in 5 continuity blocks before the fix and in 0 blocks after it.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The `<!-- SPECKIT_LEVEL: research -->` marker in a leaf's spec.md | A leaf without the marker and without an implementation summary still gets no continuity write | The marker comes from `templates/packet-types/research.spec.md.tmpl`, so every research record scaffolded by create.sh carries it |
| Risk | A research record gains an implementation-summary.md later | The writer prefers the summary once it exists, per the host precedence | The precedence itself decides, so no special case is added for that leaf |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---

