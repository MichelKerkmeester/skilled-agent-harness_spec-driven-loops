---
title: "Tasks: Phase 3: hook-markers-and-improvement-family"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "hook drift marker claude cursor"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3: hook-markers-and-improvement-family

<!-- SPECKIT_LEVEL: 3 -->
---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the Codex fallback shape and each host's adapter success output; inspect three real `improvement/` trees (`.codex/hooks.json`, `runtime/hooks/{claude,cursor}`, `specs/system-deep-loop/z_archive/*/improvement`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Wrap every adapter invocation with the drift fallback; `bash -n` every command (`.claude/settings.json`, `.cursor/hooks.json`)
- [x] T003 [P] Add doctor rows and per-host parity assertions (`.opencode/commands/doctor/assets/doctor-runtime-mirrors.yaml`, `runtime/tests/hook-adapter-path-parity.vitest.ts`)
- [x] T004 [P] Document `improvement/` in §3 and §4 (`references/structure/folder-structure.md`)
- [x] T005 Add and register the improvement config rule (`runtime/cli/rules/check-improvement-artifacts.sh`, `runtime/cli/lib/validator-registry.json`)
- [x] T006 Bump the documented rule count to 39 and add the fallback paragraph to the Claude and Cursor hook READMEs (`README.md`, `runtime/hooks/{claude,cursor}/README.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Synthetic failure: renamed `dist/hooks/claude/session-prime.js`, exit 0, marker on stdout, stderr line; file restored
- [x] T008 Parity 103 of 103; codex hook check OK; typecheck exit 0; CLI rebuilt and fresh; strict validate on 054 lists the rule and passes; doc-count test green at 39
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
