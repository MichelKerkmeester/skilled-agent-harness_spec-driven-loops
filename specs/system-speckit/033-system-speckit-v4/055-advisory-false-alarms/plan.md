---
title: "Implementation Plan: Stop the sk-git pathspec advisory and the completion-evidence sentinel from raising false alarms"
description: "The sk-git parser marks a command whose pathspec needs shell expansion and two checks honor that mark. The sentinel's folder resolver trims a line suffix and a file name. Each fix carries one test that fails on the old source."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Stop the sk-git pathspec advisory and the completion-evidence sentinel from raising false alarms

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript: an ES module for the sk-git checks and a CommonJS module for the sentinel core |
| **Framework** | Advisory hooks that fail open and never block a tool call |
| **Storage** | None |
| **Testing** | `node --test` for sk-git and Vitest for the spec-kit runtime |

### Overview

The fix lands at each producer. `parseGitCommand` already returns `cwdResolved` for a directory it cannot know. It now returns `pathsResolved` for a pathspec it cannot know. Only the two checks that conclude "nothing is there" read the new flag. `resolveSpecFolderFromText` keeps its contract of returning any path under `specs/` and now drops a line suffix and a file name before returning it.
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
Fail-open advisory checks: when the input cannot be known, the check stays silent.

### Key Components
- **`parseGitCommand`** (.skilled/skills/sk-git/scripts/lib/git-rule-checks.mjs): splits a git command into subcommand, flags and pathspec. It now reports whether every pathspec is known without shell expansion.
- **`add-pathspec-matches-nothing` and `commit-pathspec-empty-change`**: the two checks that warn about an absence and the only readers of the new flag.
- **`resolveSpecFolderFromText`** (.skilled/skills/system-spec-kit/runtime/lib/hooks/completion-evidence-sentinel.cjs): recovers a packet folder from reply text for the Pi, Cursor and OpenCode adapters.

### Data Flow
A pre-tool hook passes the shell command to the checks. Each check parses it and reads repository state for a verdict. A turn-end or idle hook passes the reply text to the sentinel, which resolves a folder and looks for its evidence files.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Each new test first ran against the old source and failed there. The old source was swapped back in only for that run. The new source was then restored byte-identical. Both suites then ran in full on the new code, along with the completion-evidence stop-hook suite that also imports the sentinel. After a fast-forward onto main they ran again, together with the full spec-kit root project as CI runs it. A scratch script replayed the original commands and reply text against the old and the new modules.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

N/A. Neither fix adds a dependency or reads anything new.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the packet's commit. Both changes are advisory, so reverting brings back the false alarms and nothing else.
<!-- /ANCHOR:rollback -->

---
