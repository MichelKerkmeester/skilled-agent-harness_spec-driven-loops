---
title: "Implementation Plan: Phase 2: onboarding-fixes"
description: "Fix the fresh-clone onboarding stumbles with README edits and two small code changes, each proven on a pristine clone or by a test that fails first."
trigger_phrases:
  - "onboarding fixes plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: onboarding-fixes

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, TypeScript, CommonJS, Bash |
| **Framework** | Pi extension API, git hooks |
| **Storage** | None |
| **Testing** | Vitest and the pre-commit shell harness |

### Overview

The README install block, CONTRIBUTING's Node line and sk-vision's setup line change as doc edits. Two code paths change: Pi's session-start extension names a missing build, and the agent mirror checker reports a check it could not run apart from drift. Codex's message changes in the hook registry and is regenerated.
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

Extend in place, per the research's reversal-cost ranking.

### Key Components

- **README numbered steps**: the only install path a newcomer follows.
- **Mirror checker and its hooks**: exit 0 in sync, 1 drift, 3 not checkable.
- **Pi session-start extension**: warns once when the built session-prime adapter is missing.

### Data Flow

The README steps produce `runtime/dist` and `shared/dist`. The session hooks and the mirror checker load those builds, and each now names the build when it is absent.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Each code row gets a test written first and run red. The README path is proven on a pristine clone of the branch HEAD.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Node 24.x for the pristine-clone proof, and the existing hook-registry generator for `.codex/hooks.json`.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert this phase's commits. No data or generated state outlives them, and `.codex/hooks.json` regenerates from the reverted registry.
<!-- /ANCHOR:rollback -->

---
