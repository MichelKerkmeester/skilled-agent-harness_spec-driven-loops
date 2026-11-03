---
title: "Tasks: Phase 3: design-handoffs"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "design handoffs tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 3: design-handoffs

<!-- SPECKIT_LEVEL: 2 -->

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

`F` is `.skilled/skills/sk-design/sk-design-fundamentals`. `RCH` is `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs`.
<!-- /ANCHOR:notation -->

---
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Record reach on sk-design and sk-code at concurrency 2 before the edits (`scratch/reach-baseline.txt`). Verify: two summary lines are saved.
- [ ] T002 [P] List every line that names only the extractor (`scratch/extractor-lines.txt`). Verify: `rg -n "sk-design-md-generator" .skilled/skills/sk-code .skilled/skills/mcp-tooling/mcp-figma` output is saved.
- [ ] T003 Read `$F/SKILL.md` around its Inputs section to place the profile slot next to the existing precedence. Verify: the target line number is noted in `scratch/placement.md`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Word the hand-off line once and add it to sk-code (`.skilled/skills/sk-code/SKILL.md`, `.skilled/skills/sk-code/README.md`). Verify: `rg -n "sk-design-fundamentals"` prints one line per file.
- [ ] T005 Add the same line to mcp-figma (`.skilled/skills/mcp-tooling/mcp-figma/SKILL.md`). Verify: `rg -n "sk-design-fundamentals" .skilled/skills/mcp-tooling/mcp-figma/SKILL.md` prints one line.
- [ ] T006 Add the reduced-motion section, web and native, no library (`$F/references/motion-principles.md`). Verify: `rg -n "prefers-reduced-motion"` prints a line and `rg -n -i "reanimated|framer|gsap"` prints none.
- [ ] T007 Document the optional profile slot and the four-step precedence (`$F/SKILL.md`). Verify: `rg -n -i "profile" $F/SKILL.md` prints the slot and the precedence.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Diff the routing files. Verify: `git diff --stat` lists no `ROUTER.md`, `hub-router.json` or `graph-metadata.json`.
- [ ] T009 Rerun reach on sk-design and sk-code (`scratch/reach-final.txt`). Verify: both summary lines match the baseline.
- [ ] T010 Run the fundamentals playbook validator. Verify: it exits 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `scratch/reach-final.txt` matches `scratch/reach-baseline.txt` for sk-design and sk-code
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

If reach moves, the phase stops and the wording changes; a moved routing number is never accepted as a side effect.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available
- [ ] CHK-004 [P1] `scratch/reach-baseline.txt` holds two summary lines
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] No router or metadata file changed
- [ ] CHK-011 [P1] The hand-off line reads the same in all three files
- [ ] CHK-012 [P1] `motion-principles.md` is 250 lines or fewer
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Reach on sk-design and sk-code matches the baseline
- [ ] CHK-022 [P1] The fundamentals playbook validator exits 0
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P1] N/A for credentials: the change is doc-only, confirmed by `git diff --stat` listing only `.md` files
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P2] The sk-design and sk-code changelogs record the change
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ keeps only the reach and inventory evidence
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 5 | 0/5 |
| P1 Items | 9 | 0/9 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Not yet verified
<!-- /ANCHOR:summary -->

---
