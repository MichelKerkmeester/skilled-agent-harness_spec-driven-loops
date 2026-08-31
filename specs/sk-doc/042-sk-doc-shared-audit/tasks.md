---
title: "Tasks: sk-doc shared/ audit for integration, utilisation and usefulness"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "shared audit tasks"
  - "sk-doc shared repair tasks"
  - "shared verdict tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: sk-doc shared/ audit for integration, utilisation and usefulness

<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 Inventory every file under `shared/references`, `shared/assets` and `shared/scripts` (`.opencode/skills/sk-doc/shared/`)
- [x] T002 Capture the `validate_document.py` baseline for all 11 shared markdown files, one exit code each
- [x] T003 [P] Capture the hub gate baselines: `parent-skill-check.cjs`, `leaf-resource-contract.test.cjs`, `check-markdown-links.cjs`
- [x] T004 Confirm `git status` is clean under `shared/` before editing, so every later change is attributable
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Count live consumers per file with a path-qualified grep excluding `benchmark/reports/**`, `node_modules` and `dist` (`.opencode/`)
- [x] T006 Read the two routing surfaces that make a shared file reachable without a textual reference (`.opencode/skills/sk-doc/ROUTER.md`, `.opencode/skills/sk-doc/leaf-aliases.json`)
- [x] T007 Resolve the apparent orphans by basename search, catching `skill-contract.json` and `template-rules.json` which are loaded by code rather than cited by path
- [x] T008 Grep for anchor-qualified inbound links before renaming any heading (`.opencode/`, `specs/`)
- [x] T009 Fix the failing floor-validator gate, negative control first (`.opencode/skills/sk-doc/shared/references/frontmatter-versioning.md`)
- [x] T010 Remove the `llmstxt` detection and enforcement rows no validator backs; repair the command template path and the dead style-guide pointer (`.opencode/skills/sk-doc/shared/references/core-standards.md`)
- [x] T011 Repair six non-resolving template paths, the stale packet enumeration, the `llms.txt` claim and the `git-commit` reference (`.opencode/skills/sk-doc/shared/references/quick-reference.md`)
- [x] T012 Replace the stale classifier claim and the packet identifiers (`.opencode/skills/sk-doc/shared/references/filesystem-naming-convention.md`)
- [x] T013 Rewrite the scaffold-era README with the symlink facts a repo-wide symlink walk proved (`.opencode/skills/sk-doc/shared/README.md`)
- [x] T014 Remove the orphan placeholder without touching the git index (`.opencode/skills/sk-doc/shared/assets/.gitkeep`)
- [x] T015 Write the rejected moves and their cost, rather than applying them (`specs/sk-doc/042-sk-doc-shared-audit/spec.md` section 9)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 Re-run `validate_document.py` across all 11 shared markdown files and confirm 11 of 11 pass
- [x] T017 Re-run `parent-skill-check.cjs`, `leaf-resource-contract.test.cjs` and `check-markdown-links.cjs`, and attribute every delta
- [x] T018 Confirm `git status` under `shared/` shows six worktree changes, nothing staged
- [x] T019 Run `validate.sh <folder> --strict` and require an explicit `RESULT: PASSED`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
