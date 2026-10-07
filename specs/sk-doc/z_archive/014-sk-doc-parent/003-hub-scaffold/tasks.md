---
title: "Tasks: Scaffold the sk-doc parent hub skeleton"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "sk-doc hub scaffold tasks"
  - "sk-doc parent phase 003 tasks"
importance_tier: "normal"
contextType: "implementation"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Tasks: Scaffold the sk-doc parent hub skeleton

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [ ] T001 Confirm the phase 001 deep-research rulings are available (parent `spec.md`)
- [ ] T002 Confirm the phase 002 registry/router schema is accepted (`../002-architecture-decision/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Create the hub SKILL.md router shell with no per-mode logic (`.opencode/skills/sk-doc/SKILL.md`)
- [ ] T004 Create mode-registry.json + hub-router.json, validated bidirectionally (`.opencode/skills/sk-doc/`)
- [ ] T005 Create description.json and rewrite graph-metadata.json to exactly one identity (`.opencode/skills/sk-doc/`)
- [ ] T006 Create the empty nested packet dirs + shared/ skeleton + hub companion dirs (`.opencode/skills/sk-doc/`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Run parent-skill-check.cjs as a baseline and record the known gaps (`.opencode/`)
- [ ] T008 Run `validate.sh` for this folder
- [ ] T009 Confirm zero external-coupling breakage introduced by this phase (facades resolve)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
