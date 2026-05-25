---
title: "Tasks: Deep Research Hygiene and Negative Knowledge Dedup"
description: "Task list for packet 122 hygiene bundle."
trigger_phrases:
  - "DR-005"
  - "C-008"
  - "DR-008"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-skill-evolution/004-deep-research/006-hygiene-fix-pack"
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Completed packet 122 tasks"
    next_safe_action: "Use commit handoff in implementation-summary.md"
    completion_pct: 100
---
# Tasks: Deep Research Hygiene and Negative Knowledge Dedup

<!-- SPECKIT_LEVEL: 2 -->
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

- [x] T001 Read 119 roadmap and applicability docs.
- [x] T002 Locate reducer `ruledOut` aggregation.
- [x] T003 Audit deep-research `SKILL.md` allowed-tools frontmatter.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 DR-005: Add content-hash dedup for `ruledOutDirections` (`reduce-state.cjs`).
- [x] T005 DR-005: Add regression test preserving first-seen iteration (`deep-research-reducer.vitest.ts`).
- [x] T006 C-008: Add YAML script-path verifier (`verify-yaml-script-paths.sh`).
- [x] T007 DR-008: Confirm deleted graph MCP tools are absent from `SKILL.md`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run targeted reducer Vitest.
- [x] T009 Run `bash -n` and verifier script.
- [x] T010 Run DR-008 grep.
- [x] T011 Validate packet docs strictly.
- [x] T012 Validate modified Markdown with sk-doc.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Manual verification passed.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
