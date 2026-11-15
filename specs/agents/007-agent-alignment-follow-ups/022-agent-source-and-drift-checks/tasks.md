---
title: "Tasks: Phase 22: agent-source-and-drift-checks"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "agent source and drift checks tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 22: agent-source-and-drift-checks

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
`D` is `.skilled/commands/doctor/scripts`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Baseline the checks (four generators, `check-agent-mirror-sync.cjs`, the roster check, the roster test). Verify: each exits 0.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Add `websearch: allow` to the deep-research source, set markdown to `mode: subagent`, regenerate the four trees, and fix the crosswalk sentences (`.skilled/agents/deep-research.md`, `.skilled/agents/markdown.md`, `.skilled/bin/agent-mirror-crosswalk.md`). Verify: the four `--check` runs exit 0.
- [x] T003 Rebuild the roster check on `.skilled/agents` with eight surfaces and add drift cases (`agent-roster-mirror-check.cjs` and its test). Verify: `node --test` passes and the real tree prints eight OK rows.
- [x] T004 [P] Link `.opencode/agents` into both playbook sandboxes (two `setup-cp-sandbox.sh`). Verify: each script run into a temp dir leaves `.opencode/agents/<agent>.md` readable.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Rerun every check from T001 (`scratch/`). Verify: each exits 0.
- [x] T006 Run strict validation on the parent and its children (`spec.md`). Verify: `RESULT: PASSED` for every folder.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] The roster check fails on a missing `.vibe` or `.dsh` agent
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Origin**: phase 20 findings A5, B5, B6, E1, E2 and open questions 1 and 2, and the operator's answers of 2026-11-15
<!-- /ANCHOR:cross-refs -->
