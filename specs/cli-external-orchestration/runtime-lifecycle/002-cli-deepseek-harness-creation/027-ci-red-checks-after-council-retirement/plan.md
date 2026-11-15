---
title: "Implementation Plan: Phase 27: ci-red-checks-after-council-retirement"
description: "Change one test case to a registered deep agent and regenerate the manifest's derived history, then run both workflows' suites locally."
trigger_phrases:
  - "ci red checks after council retirement plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 27: ci-red-checks-after-council-retirement

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript tests, JSON |
| **Framework** | `node:test` |
| **Storage** | `agents-md-manifest.json` |
| **Testing** | The hook, plugin and installer suites, `run-all.sh` |

### Overview
The test case follows the precedent the council retirement set for its sibling guard tests. The history body is rebuilt by the generator that owns it, which reads the release tags.
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
- [x] Both workflows' suites pass locally
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fix the input, not the gate.

### Key Components
- **Task guard**: `.skilled/hooks/task-dispatch/lib/dispatch-guard.cjs` checks a declared mode only for a registered deep agent
- **Manifest generator**: `.skilled/commands/doctor/scripts/agents-md-manifest.cjs` writes the `derived` key, history included

### Data Flow
The generator reads each release tag's AGENTS.md and records every distinct body with its hash. The test rehashes each recorded body.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Run each failing step's exact command from the two workflow files.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: either workflow fails after merge. Revert the two file edits.
<!-- /ANCHOR:rollback -->

---
