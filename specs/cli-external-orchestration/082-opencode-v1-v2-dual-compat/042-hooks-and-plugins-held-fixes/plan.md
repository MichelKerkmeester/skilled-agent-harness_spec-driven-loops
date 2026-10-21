---
title: "Implementation Plan: Phase 42: hooks-and-plugins-held-fixes"
description: "Fix each held hook and plugin finding from phase 039 in its own small change, with a test that fails on the old code, and measure the two performance findings before and after."
trigger_phrases:
  - "hooks and plugins held fixes plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 42: hooks-and-plugins-held-fixes

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (CommonJS and ES modules), Bash, Node 22 and 26 |
| **Framework** | OpenCode plugin API through the v1 and v2 bridge |
| **Storage** | Per-session JSON state files under each hook's state folder |
| **Testing** | `node --test`, vitest |

### Overview
Sixteen independent findings, one change each. Every change gets a test that passes on the fix and fails when the fix is reverted, and the suites are rerun against the baseline taken before the first edit.
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
Targeted fixes inside existing modules; no new module.

### Key Components
- **Relaunch killer and hop history**: the unarm guards and the history reader
- **Post-edit quality**: the secret scrubber and the codex and devin path pickers
- **Task-dispatch guard**: the config path check and the loop-count update
- **Shared adapter and small hooks**: the stdin reader, the git installer and the route guard
- **OpenCode plugins**: session-relaunch, system-spec-gate, system-skill-advisor and session-cleanup

### Data Flow
Each hook reads its payload through the shared stdin reader, decides, and writes its state file; each plugin receives bridged events and transforms. No change alters that flow.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Each fix is proven by reverting it and showing its new test fail (`scratch/mutation/`). The two performance findings are timed before and after (`scratch/perf/`).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

N/A — record dependencies beyond the components named in the architecture here.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Each finding is its own commit, so any one can be reverted alone.
<!-- /ANCHOR:rollback -->

---
