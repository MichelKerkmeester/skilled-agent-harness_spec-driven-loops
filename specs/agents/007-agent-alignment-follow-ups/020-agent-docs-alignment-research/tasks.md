---
title: "Tasks: Phase 20: agent-docs-alignment-research"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "agent docs alignment research tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 20: agent-docs-alignment-research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation
<!-- FILL: Keep the prefix table and add the two shell variables this task list uses. GOOD: `R` is `scripts/rotate-logs.sh`. `A` is `logs/archive/`. WEAK: Variables are defined below. -->

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

- [x] T001 Confirm the executor can run (`vibe` on PATH). Verify: `vibe --version </dev/null` prints `vibe 3.1.2` and `MISTRAL_API_KEY` is set.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Run `/deep:research:auto` with two `cli-mistral-vibe` lineages on `deepseek-flash`, three and two iterations (`research/`). Verify: `ls research/research.md` prints the path. The first attempt failed on the exhausted Mistral API budget and is archived in `research_archive/`. The rerun used the Vibe budget through the keychain sign-in.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T003 Spot-check findings against the cited lines (`research/research.md`). Verify: each checked finding is marked confirmed or refuted.
- [x] T004 Run strict validation on the parent and its children (`spec.md`). Verify: `RESULT: PASSED` for every folder.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `research/research.md` holds cited findings
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Origin**: the operator's request of 2026-11-15 for five DeepSeek iterations through Vibe on agent doc alignment
<!-- /ANCHOR:cross-refs -->
