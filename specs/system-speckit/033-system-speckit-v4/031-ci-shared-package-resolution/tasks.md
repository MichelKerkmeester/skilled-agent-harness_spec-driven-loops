---
title: "Tasks: CI shared-package resolution"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "ci resolution tasks"
  - "workflow fix tasks"
  - "verification checklist"
  - "run failed diagnosis"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: CI shared-package resolution

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
## Phase 1: Diagnose

- [x] T001 List the recent runs and read the failing step of each red workflow (`gh run list`, `gh run view --log-failed`)
- [x] T002 Date each break with the first failing run after the last success, and match it to the commits that moved the frontmatter parser into the shared package
- [x] T003 Trace why the shared build passes locally and fails on CI: TypeScript resolves `js-yaml` to an untyped module in both places, and the ambient declaration that types it is matched by the `shared/**/*.d.ts` ignore rule (.gitignore)
- [x] T004 Run every checker locally to find what the resolution failure hid: mirror drift from the design-command move and one playbook link four directories too high
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Fix

- [x] T005 Add the install-and-build step to the three workflows before their checkers (.github/workflows)
- [x] T006 Add the gitignore negation and track the declaration (.gitignore, .opencode/skills/system-spec-kit/shared/js-yaml.d.ts)
- [x] T007 Fix the runbook link depth (.opencode/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/orphan-mcp-runtime-lifecycle-guardrails.md)
- [x] T008 Regenerate the runtime mirrors (.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verify

- [x] T009 Parse the three workflows; run the parity checker, the playbook validator, the parent-skill check and the skill-root metadata check locally
- [x] T010 Confirm the declaration is no longer ignored and is in the commit
- [x] T011 Push and read the workflow conclusions for the push (`gh run list`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->
