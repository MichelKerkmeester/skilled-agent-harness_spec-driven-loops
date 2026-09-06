---
title: "Implementation Plan: metadata-regeneration-and-parser-edges"
description: "Census the drift, regenerate the clean packets, add the shared-package dependency edges in each package root, and adopt the parser through one GLM lane."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "metadata regeneration pass"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: metadata-regeneration-and-parser-edges

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ESM census script (scratchpad, not committed), the CLI's two generators, npm `file:` dependencies |
| **Framework** | Vitest for adopters; deep-loop typecheck |
| **Storage** | Generated `description.json` and `graph-metadata.json` |
| **Testing** | Strict validation sample, adopter suites, import probes |

### Overview
A census lists every packet whose declared children differ from disk and whether its folder is clean in git. The two generators run over the clean ones. Each adopting skill gets its own manifest entry and install in its package root, and a GLM lane replaces the local parsers with the shared one.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] Regeneration committed with the census before and after
- [x] Parser adopted in both skills with tests green
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Report first, then act only where the working tree is clean; add edges in package roots, never at the repository root.

### Key Components
- **Census**: walks `specs/`, compares declared and on-disk leaf children, marks git dirtiness per folder.
- **Regeneration**: the CLI's generators, unchanged.
- **Edges**: `"@spec-kit/shared": "file:../../system-spec-kit/shared"` in each package root.

### Data Flow
Census → clean list → generators → commit by pathspec. Manifest → install → import probe → adoption → tests.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The helper's four boundary cases | `tests/path-containment.vitest.ts` |
| Integration | Changelog override and description generator through the helper | `tests/nested-changelog.vitest.ts`, `tests/generate-description-identity-safety.vitest.ts` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| None beyond the CLI workspace | Internal | Green | — |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a consumer rejects a path it must accept.
- **Procedure**: revert the single refactor commit; the older checks return with it.
<!-- /ANCHOR:rollback -->
