---
title: "Feature Specification: Phase 56: Corpus manifest build state"
description: "The committed trigger-index corpus manifest lists skipped paths whose presence and reason depend on whether the checkout is installed and built, so each regeneration flips entries by machine."
trigger_phrases:
  - "corpus manifest build state"
  - "trigger index skipped paths"
  - "symlink not followed"
  - "machine dependent manifest"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 56: Corpus manifest build state

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-09-23 |
| **Branch** | `worktrees/064-save-writer-continuity-fields` |
| **Parent Spec** | ../spec.md |
| **Phase** | 56 of 62 |
| **Predecessor** | 055-advisory-false-alarms |
| **Successor** | 057-continuity-reader-vocabulary-and-flow-lists |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 56** of the system-spec-kit v4 specification, the first of seven fix phases planned after phase 051 shipped. It goes first so the trigger-index regenerations the later phases make stay stable.

**Scope Boundary**: the corpus walker behind the trigger index and its test file.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The trigger index commits a corpus manifest whose `skippedPaths` list records what the walker did not walk. Three kinds of entry depend on the machine rather than the tree: `node_modules` and `dist` directories appear only after an install or a build, tracked links into build output are "broken symlink" in a fresh checkout and unrecorded or "symlinked directory" in a built one, and so each regeneration flips entries depending on who ran it. Comparing a built checkout's manifest with the committed one found 17 entries only in the committed file and 8 only in the built one, none caused by a change to the tree.

### Purpose
The same tracked tree produces the same `skippedPaths` list whether or not the checkout is installed and built.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Stop listing `node_modules` and `dist` as skipped; they stay pruned, and the recorded exclusion policy already names them.
- Resolve a link only when its name ends in `.md`, and record every other link as "symlink not followed" without reading its target.
- A test that walks the same tree before and after an install and a build and expects the same skip list.

### Out of Scope
- `manifestHash` - it does not include `skippedPaths`, so the index itself never depended on build state.
- The walker in `runtime/cli/ops/retrofit-convention.mjs` - it writes a frozen per-run artifact, not a regenerated committed fixture.
- Which directories are pruned - the policy is unchanged; only what gets listed changes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs` | Modify | Build-output directories pruned without a skip entry; non-document links recorded under one fixed reason |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index.vitest.ts` | Modify | New build-state test; the linked-directory case expects the new reason |
| `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` and `runtime/cli/retrieval/fixtures/*.json` | Regenerate | The committed index and manifest regenerated under the new rule |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The skip list is the same before and after an install and a build. | A test walks a tree with a link into `dist`, a linked directory into `dist` and a `scratch` folder, then adds `dist` output and a `node_modules` tree, and gets an identical skip list. The old walker fails it. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Documents are still found and deduplicated the way they were. | The existing walker tests, including the linked-document, outside-root and duplicate cases, pass. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Regenerating the trigger index in a built checkout changes `skippedPaths` only where the tracked tree changed.
- **SC-002**: The retrieval test suites pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The first regeneration under the new rule rewrites many `skippedPaths` entries at once | Low | One-time change in a diagnostic list that `manifestHash` does not cover |
| Risk | A reader relies on the old "symlinked directory" or "broken symlink" wording for non-document links | Low | A search of the package found only the walker's own test, updated here |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The operator approved the planner's recommendation on 2026-09-23.
<!-- /ANCHOR:questions -->

---
