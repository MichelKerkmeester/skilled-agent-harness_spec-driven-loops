---
title: "Implementation Plan: Phase 48: skilled-loop-shared-nudge-formatter"
description: "Replace the wrapper's hand-written spec-folder suffix with a node call to the shared core formatter, warn on stderr when that call fails, and prove the ownership with a test that fails on the old function plus a before and after suffix compare."
trigger_phrases:
  - "skilled loop shared nudge formatter plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 48: skilled-loop-shared-nudge-formatter

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash wrapper and a Node CommonJS core |
| **Framework** | The session-relaunch hook and its `node:test` suite |
| **Storage** | None; the seed is a shell string built per relaunch |
| **Testing** | `node --test .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs`, the Hook Node runner and `scratch/compare-suffix.sh` |

### Overview
The wrapper now asks `relaunch-core.cjs` for the suffix text instead of printing its own copy. If that call fails, it writes one warning to stderr and appends an empty suffix, so the relaunch still happens. The ownership test copies the wrapper beside a core whose formatter returns a different marker and checks that the seed follows the core, which fails on the old hand-written function.
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
One owner per printed string, with the shell wrapper as a thin caller of the JavaScript core.

### Key Components
- **Core formatter**: `specFolderSuffix(specFolder)` in `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` returns the suffix for `none`, a valid folder or an empty value, and `''` for an invalid one. `nudge.cjs` already uses it.
- **Wrapper**: `spec_folder_suffix()` in `.skilled/bin/skilled-loop` passes the core path and the folder to node and prints what the core returns.
- **Tests**: `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` holds the ownership test and the throwing-formatter test.

### Data Flow
The wrapper reads the spec folder from the consumed handoff record, calls `node -e '...' -- "$relaunch_core" "$spec_folder"` and appends the printed suffix to the seed. On failure, the command substitution returns non-zero, the wrapper prints the warning to stderr and appends nothing.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The before compare records four inputs that already matched and four invalid inputs where the shell copied the value and the core returned `''`. After the change all eight match (`scratch/after/suffix-compare.txt`). The ownership test runs twice: once against the old function, where it fails (`scratch/mutation/old-function.tap`), and once against the new one. The throwing-formatter test also runs both ways, failing without the warning (`scratch/mutation/no-warning.tap`). The wrapper suite moves from 109 to 111 tests, and Hook Node moves from 870 to 872 over 29 files. The live session-relaunch playbook runs on OpenCode 1 and 2 with `llmgateway`, and the shared v2 service keeps its PID.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`relaunch-core.cjs` must keep exporting `specFolderSuffix`, and the wrapper keeps its existing `relaunch_core` path so the same file is loaded for the manual command and the suffix. The CLI's prepare and consume steps keep dropping an invalid folder before the wrapper sees it.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert `70c81b37c3` and `1159acb5c5`. That restores the hand-written function and removes the two tests, leaving the scaffold commit `84cdaeb09a` and the scratch evidence in place.
<!-- /ANCHOR:rollback -->

---
