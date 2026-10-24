---
title: "Tasks: Phase 67: opencode-v2-pin-2-1-4"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "opencode v2 pin 2.1.4 tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 67: opencode-v2-pin-2-1-4

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

- [x] T001 Confirm `@opencode/cli` `latest` is 2.1.4 and `opencode-ai` `latest` is 1.19.4 (`npm view ... dist-tags`)
- [x] T002 Run the v2 version battery on the installed 2.1.4: plugin-active 17/17, skill-visible, command-listed 40/40
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Move `V2_PKG` to 2.1.4 (`scripts/opencode-setup.sh`)
- [x] T004 Install and expect 2.1.4 in CI (`.github/workflows/opencode-dual-version.yml`)
- [x] T005 Update the baseline and verified-version statements (cli-opencode `SKILL.md`, `README.md`, `cli-reference.md`, `install-and-versions.md`, workflows `README.md`, `CROSS-CLI.md`)
- [x] T006 Correct the v1 channel statement to `latest` 1.19.4 with the pin kept at 1.19.3 (`install-and-versions.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 node:test suites 129 of 129 outside the vitest file; `dispatch-audit.test.mjs` 124 of 124 under vitest
- [x] T008 Workflow YAML parses; shellcheck clean
- [ ] T009 Dual-version battery green in CI on the pushed commit
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All local tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [ ] CI green on the pushed commit
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
