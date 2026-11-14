---
title: "Tasks: Phase 12: catalog-and-playbook-alignment"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "catalog and playbook alignment tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 12: catalog-and-playbook-alignment

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

`FC` is `.skilled/skills/system-spec-kit/feature-catalog`. `MP` is `.skilled/skills/system-spec-kit/manual-testing-playbook`. `C` is `.skilled/skills/system-spec-kit/runtime/cli`. Every Verify that names a saved file writes it in this folder's `scratch/`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Re-read each cited line, the restore and close code of `$C/spec/relocate.mjs` and `$C/spec/archive.sh` after phase 011, and the validator commands in the two sk-doc SKILL.md files (`scratch/setup-notes.md`). Verify: the file lists every In Scope line with its current number and the two validator commands.
- [ ] T002 List the existing playbook scenario ids on the three surfaces, and record today's count of `relocate.mjs --map` lines in the proposal scenario (`scratch/setup-notes.md`). Verify: the file names each id, the next free one, and the count.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 State exit status 3 and its condition (`FC/tooling-and-scripts/spec-packet-relocation.md`). Verify: `rg -n 'RESULT: FAILED' FC/tooling-and-scripts/spec-packet-relocation.md` prints a line.
- [ ] T004 Name the bare-name, re-parent phase-row and pre-archive id passes in the rewrite step, and add `relocate-real-pipeline.vitest.ts` to the sources (`FC/tooling-and-scripts/spec-packet-relocation.md`). Verify: `rg -c 'bare|pre-archive|relocate-real-pipeline' FC/tooling-and-scripts/spec-packet-relocation.md` prints 3 or more.
- [ ] T005 Rewrite the restore outcome and add the mixed-track refusal (`FC/tooling-and-scripts/spec-lifecycle-automation.md`). Verify: `rg -n 'flat packets' FC/tooling-and-scripts/spec-lifecycle-automation.md` prints a line, and the restore paragraph says a status 3 restore exits 0.
- [ ] T006 Name `archivedPaths` in the path record (`FC/retrieval/rg-archive-search.md`). Verify: `rg -n 'archivedPaths' FC/retrieval/rg-archive-search.md` prints a line.
- [ ] T007 Add the NNN-slug refusal as the fourth no-map case (`FC/tooling-and-scripts/sub-track-proposal.md`). Verify: `rg -n 'NNN-slug' FC/tooling-and-scripts/sub-track-proposal.md` prints a line in the enumeration.
- [ ] T008 Add the status 3 and late-step resume steps and the real-pipeline source (`MP/tooling-and-scripts/spec-packet-relocation.md`). Verify: `rg -n 'exits? 3'`, `rg -n 'after a late step|late-step'` and `rg -n 'relocate-real-pipeline'` on the file each print a line.
- [ ] T009 Build a `mktemp` copy of the tooling with a git repository and a track `graph-metadata.json`, and feed the printed map to `relocate.mjs --map` in it (`MP/tooling-and-scripts/sub-track-proposal.md`). Verify: `rg -c 'relocate.mjs --map' MP/tooling-and-scripts/sub-track-proposal.md` prints more than the count T002 recorded, and the step run by hand exits 1.
- [ ] T010 Check `archivedPaths` in the `--json` output (`MP/retrieval/rg-archive-search.md`). Verify: `rg -n 'archivedPaths' MP/retrieval/rg-archive-search.md` prints a line in Pass / Fail.
- [ ] T011 Update the index rows where a summary or id changed (`FC/feature-catalog.md`). Verify: each changed page's summary in the index matches its page, or the file is unchanged with that recorded in `scratch/setup-notes.md`; the same holds for `MP/manual-testing-playbook.md`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Run the new playbook steps once in a `mktemp` copy and compare with each Expected section (`scratch/playbook-run.txt`). Verify: the file shows each step's output and exit status matching its Expected text.
- [ ] T013 Run the sk-doc catalog and playbook validators on every changed page (`scratch/validators.txt`). Verify: each run in the file exits 0.
- [ ] T014 Validate this phase folder (`spec.md`). Verify: `bash $C/spec/validate.sh <this folder> --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Every catalog and playbook row of `../review/review-report.md` is fixed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Findings**: See `../review/review-report.md` and `../review/fable-5-2-review.md`
<!-- /ANCHOR:cross-refs -->

---
