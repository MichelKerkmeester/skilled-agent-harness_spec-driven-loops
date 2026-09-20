---
title: "Tasks: design agent alignment"
description: "Ordered tasks and verification for aligning the design agent across four runtimes."
trigger_phrases:
  - "tasks"
  - "name"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: design agent alignment

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

- [x] T001 Locate every runtime copy of the agent (`.opencode`, `.claude`, `.cursor`, `.pi`)
- [x] T002 Confirm the four copies share an identical body and differ only in frontmatter (`.opencode/agents/design.md`, `.claude/agents/design.md`, `.cursor/agents/design.md`, `.pi/agents/design.md`)
- [x] T003 Read the current agent and identify where `sk-design` belongs (`.opencode/agents/design.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Author the shared body: routing, decide path, measure path, gates, rules, output (`.opencode/agents/design.md`)
- [x] T005 Splice the body into all four runtimes, preserving each frontmatter (`.opencode/agents/design.md`)
- [x] T006 Rewrite the description in all four so it names both skills (`.opencode/agents/design.md`, `.claude/agents/design.md`, `.cursor/agents/design.md`, `.pi/agents/design.md`)
- [x] T007 State the precedence rule and the reading-versus-authoring caveat (`.opencode/agents/design.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Verify every reference and skill path the agent cites exists on disk (`.opencode/skills/sk-design/references/`, `.opencode/skills/sk-design-md-generator/`)
- [x] T009 Verify the post-frontmatter body is identical across all four runtimes (`.opencode/agents/design.md`)
- [x] T010 Confirm `/design:extract` still maps to the measure path (`.opencode/commands/design/extract.md`)
- [x] T011 Validate all four agent files against the `sk-create-agent` contract (`.opencode/skills/sk-doc/sk-create-agent/SKILL.md`)
- [x] T012 Restructure the body to the canonical section order after the validator found a missing required section (`.opencode/agents/design.md`)
- [x] T013 Add the capability scan, output verification, anti-patterns and related-resources sections the contract requires (`.opencode/agents/design.md`)
- [x] T014 Confirm every path the agent cites resolves on disk (`.opencode/agents/design.md`)
- [x] T015 Check `/design:extract` against the `sk-create-command` contract (`.opencode/commands/design/extract.md`)
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



