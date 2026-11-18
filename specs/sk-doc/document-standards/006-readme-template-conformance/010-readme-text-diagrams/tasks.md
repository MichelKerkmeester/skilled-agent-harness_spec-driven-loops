---
title: "Tasks: Phase 10: readme-text-diagrams"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "readme text diagrams tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 10: readme-text-diagrams

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

`R` is `.skilled/skills/sk-doc/sk-create-readme/`. The scratch checks `baseline.sh`, `boxcheck.py`, `scopecheck.py`, `write.sh` and `review.sh` sit in this session's scratchpad.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Enumerate the READMEs with a Mermaid fence (the enumeration in `plan.md`). Verify: 55 lines. Evidence: 56 paths, one of them the link `mcp-code-mode/mcp-server/README.md`, so 55 files, each with one fence.
- [x] T002 Record the baseline. Verify: the gates print their counts. Evidence: 55 `VALID` with `hard blockers: 0`, reference checker `fail=13`, count checker `fail=8`, `boxcheck.py` reports only the 55 Mermaid fences.
- [x] T003 Smoke the executor. Verify: a one-turn run replies. Evidence: `opencode-go/hy4-flash-free#high` replied `OK`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Change the template's diagram row, guidance, example and checklist rows (`$R/assets/skill-readme-template.md`). Verify: `rg -n -i mermaid` prints only lines that rule it out. Evidence: lines 247 and 358.
- [x] T005 Add the Diagrams rule and the checklist line (`$R/references/readme/writing-patterns.md`, `$R/references/readme/quality-and-checklist.md`). Verify: both print `VALID`. Evidence: `Total issues: 0` on each.
- [x] T006 Run the canary writer (`mcp-tooling/mcp-mobbin/README.md`). Verify: only the fence changed and `boxcheck.py` prints `OK`. Evidence: a 5-box diagram, `OK`, `VALID`, and its reviewer returned `VERDICT: PASS`.
- [x] T007 [P] Run the other 54 writers four at a time. Verify: each exits 0. Evidence: 55 exits of `0`, `files 55 outside 0`, 55 `OK`.
- [x] T008 [P] Run the 54 reviewers four at a time. Verify: each returns a verdict. Evidence: 53 `VERDICT: PASS`, 2 `VERDICT: FAIL`.
- [x] T009 Confirm and apply the two findings (`cli-classifier/cli-jev/README.md`, `sk-design/sk-design-diagram/README.md`). Verify: each matches its `SKILL.md`. Evidence: cli-jev `SKILL.md` line 162 puts the class in the exit code, and sk-design-diagram `SKILL.md` line 57 loads a type or import reference only. Both boxes fixed inside their widths, `OK`.
- [x] T010 Refresh the README manifest (`.skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json`). Verify: `test_readme_manifest.py` reproduces. Evidence: the suite failed on `added: .skilled/repo-rules`, and `--write` added that one entry, then `manifest=reproducible`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Rerun the per-file gates from the final state. Verify: no regression. Evidence: `files 55 outside 0`, 55 `OK`, 55 `VALID` with `hard blockers: 0`, reference failures 13 and count failures 8 with 0 new.
- [x] T012 Run the repository gates. Verify: each passes. Evidence: `all sk-doc script tests passed` exit 0, `PARITY PASS`, `0 broken markdown links`, 0 READMEs with a Mermaid fence.
- [x] T013 Validate the program. Verify: `validate.sh --recursive --strict` prints `RESULT: PASSED`. Evidence: `RESULT: PASSED` on the parent and every phase.
- [ ] T014 Commit, merge origin/main and push under sk-git. Verify: the phase commit is an ancestor of origin/main.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the canary diagram and the two fixed diagrams were read line by line
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decisions**: Q012 and Q013 in `../decision-record.md`
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
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: REQ-001 to REQ-005
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: the Writer Brief Constraints
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: the Hy4 smoke run replied `OK`
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks. Evidence: 55 `VALID`, and the three rule files `VALID` with 0 issues
- [x] CHK-011 [P0] No console errors or warnings. Evidence: 55 writers and 55 reviewers exited 0 with empty stderr logs
- [x] CHK-012 [P1] Error handling implemented. Evidence: not applicable, no code changed
- [x] CHK-013 [P1] Code follows project patterns. Evidence: every diagram follows the box style of `.skilled/hooks/README.md`, checked by `boxcheck.py`
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: every row in `acceptance-criteria.md` is Met
- [x] CHK-021 [P0] Manual testing complete. Evidence: T006 and T009
- [x] CHK-022 [P1] Edge cases tested. Evidence: the link `mcp-server/README.md` was skipped, and the branching diagrams kept their `[YES]` and `[NO]` labels
- [x] CHK-023 [P1] Error scenarios validated. Evidence: `boxcheck.py` fails a box whose side sits one column off
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class. Evidence: `class-of-bug`, since the template produced every Mermaid block
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed. Evidence: before the change, `rg -i mermaid` over `$R` found the template and its own README only, and both changed
- [x] CHK-FIX-003 [P0] Consumer inventory completed. Evidence: the reference checker reads tree lines, so the brief and the rule forbid tree markers in a diagram, and its failures did not grow
- [x] CHK-FIX-004 [P0] Parser fixes include adversarial cases. Evidence: not applicable, no parser changed
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed. Evidence: 55 files, one fence each
- [x] CHK-FIX-006 [P1] Hostile env variant executed when code reads process-wide state. Evidence: not applicable, no code reads state
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA. Evidence: set at the commit
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: the briefs carry file paths only
- [x] CHK-031 [P0] Input validation implemented. Evidence: not applicable, documentation only
- [x] CHK-032 [P1] Auth/authz working correctly. Evidence: reviewers ran without `--auto`, so they could not approve their own edits
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. Evidence: all three name the same 55 files, the manifest file and the Hy4 executor
- [x] CHK-041 [P1] Code comments adequate. Evidence: not applicable, no code changed
- [x] CHK-042 [P2] README updated (if applicable). Evidence: the 55 READMEs are the change
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. Evidence: the writer aids sat in this phase's `scratch/` and the logs in the session scratchpad
- [x] CHK-051 [P1] scratch/ cleaned before completion. Evidence: `scratch/` holds only `.gitkeep`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 12/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-18
<!-- /ANCHOR:summary -->

---
