---
title: "Implementation Plan: path-containment-seam"
description: "Add the shared containment helper to the CLI utilities, switch the two generators to it, and prove the boundary with one focused unit test."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "path containment seam"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: path-containment-seam

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node `fs` and `path` |
| **Framework** | Vitest through the skill-root projects config |
| **Storage** | None |
| **Testing** | New helper test plus the two consumers' existing suites |

### Overview
The helper lives beside `sanitizePath` in `utils/path-utils.ts`. It resolves the longest existing prefix of a path through the filesystem and appends the missing tail lexically, then compares root and target. Callers pass a root, a target and a label and get the resolved path back or a named error.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] Helper exported and tested
- [x] Both generators call it
- [x] Typecheck, build and consumer suites green
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One seam, many callers: the check that decides whether a write may happen has a single owner.

### Key Components
- **`canonicalizeExistingPrefix`**: realpath of the existing part, lexical tail.
- **`isPathInsideRoot`**: relative-path test on the canonical forms.
- **`assertPathInsideRoot`**: resolves the target against the root, throws a labeled error, returns the resolved path.

### Data Flow
Caller root and target → canonical forms → relative test → resolved path or error.
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
