---
title: "Tasks: Phase 10: mcp-tooling-browser-pointers"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "mcp tooling browser pointers tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 10: mcp-tooling-browser-pointers

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Count the live lines that name a browser packet without its hub, at HEAD (`.skilled/skills/mcp-tooling/`). Verify: the Measured Behavior grep in spec.md prints 22. Evidence: 22; and 0 ClickUp files named `mcp-browser-use`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Point ClickUp's browser notes and related-skills lines at the hub and the mode paths (`mcp-click-up/SKILL.md`, `README.md`, `references/mcp-tools.md`). Verify: `rg -c 'mcp-browser-use' .skilled/skills/mcp-tooling/mcp-click-up/references/mcp-tools.md` prints 3. Evidence: 3.
- [x] T003 [P] Send Mobbin's and Refero's browser work to the hub (`mcp-mobbin/`, `mcp-refero/` `SKILL.md`, `ROUTER.md`, `README.md`). Verify: the T001 grep prints no line from either mode. Evidence: none.
- [x] T004 [P] Send Figma's previews to the hub and name the hub's Chrome DevTools mode as the port 9222 owner (`mcp-figma/SKILL.md`, `README.md`, `references/troubleshooting.md`). Verify: the T001 grep prints no Figma line. Evidence: none.
- [x] T005 Bump each changed file's version and add one changelog entry per mode (`changelog/v1.2.24.0.md`, `v1.1.8.0.md`, `v1.1.9.0.md`, `v1.2.4.0.md`). Verify: the hub check's `13d-packet-version` line passes. Evidence: `PASS: 13d-packet-version: 6 mode packet(s) match their newest changelog entry`.
- [x] T006 Record phase 10 in the parent's phase map, handoff table and goal binding table (`specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/spec.md`, `goal.md`). Verify: `rg -n '010-mcp-tooling-browser-pointers' specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/spec.md specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/goal.md` prints the three rows.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Rerun the T001 grep on the working tree. Verify: prints 0. Evidence: 0.
- [x] T008 Run the mcp-tooling hub check (`.skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/mcp-tooling`). Verify: prints `OK: parent-skill-check — all hard invariants passed, 0 warnings`. Evidence: that line, exit 0.
- [x] T009 Validate this packet and the parent recursively, strict (`validate.sh`). Verify: every folder prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Automated checks passed (T007 to T009)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
