---
title: "Implementation Plan: Phase 31: plugin-scanner-ast"
description: "Read plugin source as a syntax tree with the rolldown parser already installed, so the inventory guard's recorded limits close as a class; check symlinked plugin entries in the purity test and build the sk-vision bundle where that test runs; list every plugin suite in the tests README."
trigger_phrases:
  - "plugin scanner ast plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 31: plugin-scanner-ast

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (CommonJS), TypeScript (vitest), GitHub Actions YAML |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `node --test` for the plugin suites, vitest for the purity test |

### Overview
The regex scan is replaced, not extended. `rolldown/parseAst` returns an ESTree tree with decoded string values and no comment nodes, which removes three of the four recorded limits by construction. The fourth, a list changed after it is built, becomes a reference check: a collection resolves only when it is a `const` literal whose every other use is a read. The purity test gains a symlink branch that checks the link before the existing import and contract checks run, and Spec-Kit Check builds the bundle the link points to.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other - test tooling.

### Key Components
- **`scanEvents(source)`**: parses once, walks every node with its parent, and returns the handled names and the unscanned checks. `handledEventNames` and `unscannedEventChecks` keep their signatures.
- **`isEventType`**: the event type by name (`type`, a name ending in `Type`, a `.type` field by dot or bracket) or by alias (a local declared from one of those, including a destructured `type`).
- **`resolveCollection`**: an array, `new Set([...])` or `Object.freeze([...])` of event-name literals, or a `const` naming one that is only ever read.
- **Purity symlink branch**: relative link, destination inside the repository, `realpath` succeeds with a plugin extension, then the shared contract checks.

### Data Flow
Plugin file text, then the parser's tree, then the rule per node type, then the sorted name and check lists that the inventory test compares against the manifest.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The baseline is the full plugin suite (417 of 417) and the old helper's output for every bridged plugin. The new helper must return the same output for those plugins. Each new fixture runs against the old helper to show it fails there, and two mutants of the new helper each break exactly one fixture. The purity test runs against three broken links with the old and new test side by side. All runs are kept under `scratch/mutation/` and the baseline under `scratch/baseline/`. CI on the pushed main commit is the final proof for the Spec-Kit Check build step.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`rolldown` 1.2.12, already pinned in `.skilled/package-lock.json` through vitest's vite. The Spec-Kit Check step installs `bun` 1.3.9, the version the battery workflow pins.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase commit. Only test tooling, one CI step and docs change, so a revert restores the text scan and changes no plugin behaviour.
<!-- /ANCHOR:rollback -->

---
