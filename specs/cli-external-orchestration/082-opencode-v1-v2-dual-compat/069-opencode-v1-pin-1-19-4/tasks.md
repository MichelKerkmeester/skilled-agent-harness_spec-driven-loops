---
title: "Tasks: Phase 69: opencode-v1-pin-1-19-4"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "opencode v1 pin 1.19.4 tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 69: opencode-v1-pin-1-19-4

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

- [x] T001 Confirm `opencode-ai` `latest` is 1.19.4, released 2026-10-22 (`npm view opencode-ai dist-tags`, `npm view opencode-ai time`)
- [x] T002 Run the v1 version battery on the installed 1.19.4: family-present, plugin-discovered 17/17, plugin-load 17/17, command-listed 40/40
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Move `V1_PKG` to 1.19.4 (`scripts/opencode-setup.sh`)
- [x] T004 Install and expect 1.19.4 in CI (`.github/workflows/opencode-dual-version.yml`)
- [x] T005 Update the baseline and verified-version statements (cli-opencode `SKILL.md`, `README.md`, `cli-reference.md`, `install-and-versions.md`, workflows `README.md`, `CROSS-CLI.md`)
- [x] T006 Rewrite the v1 channel statements now that both pins match `latest` (`install-and-versions.md`)
- [x] T007 Regenerate the Hermes mirror (`.hermes/skills/cli-opencode/SKILL.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 config-shape, battery and cli-opencode suites 88 of 88; dispatch rule checks 42 of 42
- [x] T009 Workflow YAML parses; shellcheck clean; `opencode-setup.sh check` passes on this machine
- [x] T010 Dual-version battery green in CI on `db30b0f543`, with 17 of 18 runs green; the Routing Registry Drift Guard fails on sk-code signal drift, as it already did on the parent commit `e3beac65f4`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All local tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] CI green on the pushed commit for every check this phase touches
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
