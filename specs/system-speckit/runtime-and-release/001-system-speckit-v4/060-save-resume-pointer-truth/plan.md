---
title: "Implementation Plan: Phase 60: Save and resume pointer truth"
description: "Write a track root's pointer to the telemetry store only, and correct the --help text and seven save and resume docs so they say what each planner mode writes and when resume follows a pointer."
trigger_phrases:
  - "save resume pointer plan"
  - "track root store only plan"
  - "planner mode docs plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 60: Save and resume pointer truth

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node; Markdown and YAML docs |
| **Framework** | None. A command-line writer |
| **Storage** | Each ancestor's `graph-metadata.json`, and the telemetry store's freshness pointers |
| **Testing** | Vitest, `cli` project |

### Overview
The pointer walk after a save gains one branch: an ancestor with no `spec.md` gets its pointer in the store and nowhere else. The rest is wording, in `--help` and in seven docs, checked against the runtime rather than against the other docs.
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
Extend in place, inside `generate-context.ts`.

### Key Components
- **`updatePhaseParentPointersAfterSave`**: the walk from the saved packet up to the specs root; it now branches on whether an ancestor has a `spec.md`.
- **The store id**: computed the same way for both branches, so resume finds a track root's pointer under the id it always used.
- **`HELP_TEXT`**: the planner-mode lines.

### Data Flow
A save refreshes metadata and continuity, then walks up. A phase parent gets its file pointer and its store pointer, as before; a track root gets its store pointer only. Resume reads the store first, then the file.

### Runtime facts the docs now state
- Resume follows a pointer that names an existing child at any age (`resolvePhaseParentPointerHop`, `runtime/lib/resume/resume-ladder.ts`).
- The store is read first when generator hardening is on, which is the default (`capability-flags.ts`).
- Every planner mode refreshes `description.json`, `graph-metadata.json` and the pointers; only full-auto writes continuity, and hybrid behaves like plan-only (`runtime/cli/core/workflow.ts`, `planContinuityWrite` and the post-save refresh).
- A parent-targeted save moves pointers only when a full-auto save routes into a leaf.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

A track-root test builds a track, a phase parent and a child in a temp directory, saves into the child, and checks the parent's file pointer, the track's unchanged bytes and the track's store pointer; the orchestrator runs it against the previous writer as the negative control. A `--help` test checks the new wording. The docs are checked by parsing both YAML assets and searching the seven files for the old claims.

### Delivery
A GPT-6 Luna executor wrote the code and tests from one brief, and a MiMo v2.6 Pro executor applied the doc replacements from a second, literal brief. The orchestrator reviewed both diffs and ran every check.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The telemetry store API in `@spec-kit/runtime/api`, unchanged.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase commit.
<!-- /ANCHOR:rollback -->

---
