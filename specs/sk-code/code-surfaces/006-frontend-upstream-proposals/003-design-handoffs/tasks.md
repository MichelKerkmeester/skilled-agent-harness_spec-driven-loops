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

- [x] T001 Record reach on sk-design and sk-code at concurrency 2 before the edits (`scratch/reach-baseline.txt`). Verify: two summary lines are saved. Evidence: `scratch/reach-baseline.txt`.
- [x] T002 [P] List every line that names only the extractor (`scratch/extractor-lines.txt`). Verify: `rg -n "sk-design-md-generator" .skilled/skills/sk-code .skilled/skills/mcp-tooling/mcp-figma` output is saved. Evidence: `scratch/extractor-lines.txt`, 23 lines.
- [x] T003 Read `$F/SKILL.md` around its Inputs section to place the profile slot next to the existing precedence. Verify: the target line number is noted in `scratch/placement.md`. Evidence: `scratch/placement.md`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Word the hand-off line once and add it to sk-code (`.skilled/skills/sk-code/SKILL.md`, `.skilled/skills/sk-code/README.md`). Verify: `rg -n "sk-design-fundamentals"` prints one line per file. Evidence: one line in each sk-code file.
- [x] T005 Add the same line to mcp-figma (`.skilled/skills/mcp-tooling/mcp-figma/SKILL.md`). Verify: `rg -n "sk-design-fundamentals" .skilled/skills/mcp-tooling/mcp-figma/SKILL.md` prints one line. Evidence: one sentence in the Related skills paragraph.
- [x] T006 Add the reduced-motion section, web and native, no library (`$F/references/motion-principles.md`). Verify: `rg -n "prefers-reduced-motion"` prints a line and `rg -n -i "reanimated|framer|gsap"` prints none. Evidence: line 173; library grep empty.
- [x] T007 Document the optional profile slot and the four-step precedence (`$F/SKILL.md`). Verify: `rg -n -i "profile" $F/SKILL.md` prints the slot and the precedence. Evidence: `### Project Profile Slot`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Diff the routing files. Verify: `git diff --stat` lists no `ROUTER.md`, `hub-router.json` or `graph-metadata.json`. Evidence: no routing file in the diff.
- [x] T009 Rerun reach on sk-design and sk-code (`scratch/reach-final.txt`). Verify: both summary lines match the baseline. Evidence: `scratch/reach-final.txt` matches.
- [x] T010 Run the fundamentals playbook validator. Verify: it exits 0. Evidence: PASS, 12 scenarios, 0 violations.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `scratch/reach-final.txt` matches `scratch/reach-baseline.txt` for sk-design and sk-code
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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available
- [x] CHK-004 [P1] `scratch/reach-baseline.txt` holds two summary lines
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] No router or metadata file changed
- [x] CHK-011 [P1] The hand-off line reads the same in all three files
- [x] CHK-012 [P1] `motion-principles.md` is 250 lines or fewer
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Reach on sk-design and sk-code matches the baseline
- [x] CHK-022 [P1] The fundamentals playbook validator exits 0
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P1] N/A for credentials: the change is doc-only, confirmed by `git diff --stat` listing only `.md` files
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P2] The sk-design and sk-code changelogs record the change
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ keeps only the reach and inventory evidence
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 5 | 5/5 |
| P1 Items | 9 | 9/9 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-03
<!-- /ANCHOR:summary -->

---
