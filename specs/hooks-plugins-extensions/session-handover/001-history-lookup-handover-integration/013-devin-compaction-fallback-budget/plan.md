---
title: "Implementation Plan: Phase 13: devin-compaction-fallback-budget"
description: "Give the Devin post-compaction hook its own copy of the history engine's section fitter, so the notice fits the 4096-byte budget with the recovery pointer whole whether or not the engine is built."
trigger_phrases:
  - "devin compaction fallback budget plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 13: devin-compaction-fallback-budget

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS hook, TypeScript tests |
| **Framework** | None |
| **Storage** | None |
| **Testing** | Vitest, runtime root project |

### Overview
The Devin hook stops loading its fitter from the history engine's gitignored build output and carries the same fitter in its own file. The old path ran one fitter where the build existed and a broken byte cut where it did not, so the same test checked different code locally and in CI. A parity test pins the copy to the engine's TypeScript fitter.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The CI failure reproduced locally with `history/dist/` moved aside: `expected 4099 to be less than or equal to 4096`
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] The compaction test file prints `Tests  18 passed (18)` with `history/dist/` absent, and 5 failures against the old hook
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single self-contained fitter.

### Key Components
- **`fitSections` in `post-compaction.cjs`**: joins the summary, the active spec folder and the recovery pointer inside 4096 bytes, shortening only the summary.

### Data Flow
`composeRecoverySections` builds the sections, `fitSections` strips control characters and fits them, and `emit` writes the result as `additionalContext`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup reproduces the CI failure, Implementation replaces the fitter and adds the cases, Verification runs the negative control and the whole runtime project.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

From `.opencode/skills/system-spec-kit/runtime`, `npx vitest run --config ../vitest.config.ts --project root` is the command Spec-Kit Check runs. The compaction file runs three ways: build absent with the fix, build absent with the old hook, and build present in the whole project.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None new. The hook drops a dependency on the built engine.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a Devin compaction notice loses its pointer or exceeds 4096 bytes. Revert the one commit, which puts the build-output `require` back.
<!-- /ANCHOR:rollback -->

---
