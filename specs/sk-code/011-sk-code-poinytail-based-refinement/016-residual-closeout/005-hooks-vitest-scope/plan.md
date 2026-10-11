---
title: "Implementation Plan: Phase 5: hooks-vitest-scope"
description: "Restrict the hooks vitest include to the hooks tree so a filtered run from .skilled/hooks collects only hooks suites and leaves the tree clean."
trigger_phrases:
  - "hooks vitest scope plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: hooks-vitest-scope

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Files named in spec.md section 3 |
| **Framework** | The repository's own generators, hooks and validators |
| **Storage** | None |
| **Testing** | The checks in goal.md, rerun by the orchestrator |

### Overview
Reproduce the failure, record the five files the config collects for `.skilled/hooks`, then add an `include` built from `HOOKS_ROOT` relative to `REPO_ROOT` so the hooks folder is named once. Compare the file list before and after.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All goal.md criteria pass on the orchestrator's rerun
- [x] Every DeepSeek diff reviewed by the orchestrator before the commit
- [x] Strict validation passes
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
In-place change to existing files; no new layer.

### Key Components
- **Orchestrator**: plans, writes each brief, reviews each diff, reruns every check and commits.
- **Builder**: DeepSeek V4.1 Flash at max effort through cli-pi, one change per brief.

### Data Flow
One brief, then the orchestrator's diff review and the rerun of its check, then the next brief or the phase close.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The goal.md criteria are the tests. A new test is run once against the unchanged code first and must fail there.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None beyond the files named in spec.md.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert this phase's commit. No other phase depends on its files.
<!-- /ANCHOR:rollback -->

---
