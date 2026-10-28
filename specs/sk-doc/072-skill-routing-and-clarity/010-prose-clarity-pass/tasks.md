---
title: "Tasks: Phase 10: Prose clarity pass"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "prose clarity pass tasks"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 10: Prose clarity pass

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the phase 001 research findings this phase acts on (`../001-deep-research/research/research.md`). Verify: each finding used here is marked Confirmed or rechecked. Evidence: the findings this lane applies are §8's cross-cutting problems 3 and 4, project history inside instructions and single lines of 1,000 to 2,200 characters, and §9's row for this phase. Problem 3 is Confirmed there by the retired-replay example. Problem 4's longest line is rechecked against this tree, which measures 2,195 characters at `.skilled/skills/sk-git/SKILL.md:307`, the figure §8 quotes, in `scratch/before.md` §4. Problems 1 and 2 belong to the prose sweep, which has not run, so this row is recorded for the readings it used and not as the sweep's start.
- [x] T002 Record the starting output of every gate in scope (`scratch/before.md`). Verify: the file lists each gate with its exit status. Evidence: `scratch/before.md` §1 records 39 of 39 gates at exit 0 from `.scratch-dc90/072-010/baseline.txt`, taken at `9fdae0b7d4`. §2 records routing accuracy 155/195, 49/66 and 19/24 from a run whose log names the same commit. §3 records the four prose readings this lane changes, and §4 the line-length scan behind REQ-002.
- [x] T003 Detail these tasks with `/speckit:plan` before implementation. Verify: each task below names its file and its verify command. Evidence: the sweep was planned as file sets per worker, each with the same verify commands: the line scan, the facts and pinned comparisons against `HEAD`, `package_skill.py --check --strict` and `validate_document.py` on the new changelog entry (`scratch/sweep.md` §2).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Write the hub glossaries. Evidence: all seven parent hubs open HOW IT WORKS with `### Terms`, six to twelve routing terms each, taken from the hub's text, `mode-registry.json` and `hub-router.json`. `parent-skill-check.cjs` exits 0 on all seven (`scratch/sweep.md` §4).
- [x] T005 Rewrite each hub and its packets, one skill at a time, running the checks after each. Evidence: each worker ran the per-file checks after each file, and a second pass covered the 37 lines the first one left (`scratch/sweep.md` §1 and §2).
- [x] T006 Rewrite the standalone skills. Evidence: `cli-orca`, `mcp-code-mode`, `sk-git`, `sk-prompt`, `system-skill-advisor` and `system-spec-kit` scan 0 prose lines over 400 characters.
- [x] T007 Rewrite the routing prose in the command and agent docs. Evidence: 51 long lines in `.skilled/commands/` and 55 in `.skilled/agents/` now scan 0. The three deep-loop command contracts were recompiled and `check-contract-drift.cjs` prints `OK commands=3`.
- [x] T010 Put the clarity rules into sk-create-skill's templates, writing guidance and the `/create:skill` authoring step (`.skilled/skills/sk-doc/sk-create-skill/`, `.skilled/commands/create/`). Verify: a skill created through `/create:skill` needs no clarity edit afterwards. Evidence: the nine rules live once at `references/skill/creation-workflow.md:153-166`, and the sentence `Put instructions before background` matches one file under `.skilled/`. Nine files link to the anchor `#prose-clarity-checklist` rather than restating it: the four create workflow activity files at `create-skill-auto.yaml:343` and `:361`, `create-skill-confirm.yaml:362` and `:380`, `create-skill-parent-auto.yaml:428` and `create-skill-parent-confirm.yaml:467`, and five sk-create-skill documents, `skill-md-template.md:1013`, `:1020` and `:1075`, `skill-readme-template.md:98`, `parent-skill-hub-template.md:29`, `parent-skill-readme-template.md:58` and `parent-skills-nested-packets.md:69` (`scratch/after.md` §4). The verify as written needs an authored skill to observe, and no skill was authored in this lane. What is proven is the half it rests on: the rules sit where the flow reads them, the review's scaffold run created both kinds from the shipped assets with no token or heading lost (`report.md` §2), and the two README templates scan clean at 92/100 and 94/100. The two `SKILL.md` templates still carry hard blockers under the human-voice rules, so a document generated from them can trip the new gate on its first run (`scratch/after.md` §7).
- [x] T011 Run the `sk-create-with-human-voice` check in the default create flow on the generated `SKILL.md` and `README.md`. Verify: the flow's output shows the human-voice score for both files. Evidence: `step_3b_human_voice_score` sits in `create-skill-auto.yaml:405` and `create-skill-confirm.yaml:432`, `step_4b_human_voice_score` in `create-skill-parent-auto.yaml:453` and `create-skill-parent-confirm.yaml:495`. Each carries the scan command with `blocking: true`, and each is listed in `gate_logic` as `H4b_human_voice_gate` or `H6_human_voice_gate`, so the hard-gate inventory names every stop. Both presentation contracts print the per-target result, `create-skill-presentation.txt:143-148` and `create-skill-parent-presentation.txt:151-154`. The targets are the documents that exist, `SKILL.md` always and `README.md` when present (`create-skill-auto.yaml:411`). The verify runs the flow itself, which this lane did not do. What is proven is that the step, its blocking gate and its output contract are in the flow, and that the command and its exit codes match the code (`report.md` §3).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Rerun every gate in scope (`scratch/after.md`). Verify: no gate is worse than in `scratch/before.md`. Evidence: `scratch/after.md` §1, 39 gates at exit 0. The two runs print identical summaries on 36 gates and differ only in elapsed time on `router-tests`, `advisor-routing-suites` and `cite-drift-gate`. Accuracy 155/195, 49/66 and 19/24, identical to the baseline. After the sweep, `scratch/sweep.md` §6: the 38-gate run on the final tree, 35 at exit 0 on the first read and the other three passing on a reread after a word trim, a live advisor and a metadata repair. Accuracy unchanged.
- [x] T009 Validate this folder. Verify: `validate.sh --strict` prints `RESULT: PASSED`. Evidence: `validate.sh specs/sk-doc/072-skill-routing-and-clarity/010-prose-clarity-pass --strict` prints `RESULT: PASSED` at exit 0, and the same command with `--recursive --strict` on the parent packet prints `RESULT: PASSED` at exit 0.
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
- **Research**: See `../001-deep-research/research/research.md`
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

- [x] CHK-001 [P0] Requirements documented in spec.md Evidence: spec.md §4, REQ-001 to REQ-004, and §5 SC-001 and SC-002.
- [x] CHK-002 [P0] Technical approach defined in plan.md Evidence: plan.md §3 and §4. Steps 5 and 6 of §4 are the create-flow work this lane delivered, and the plan was amended for them before implementation.
- [x] CHK-003 [P1] Dependencies identified and available Evidence: the lane's files are sk-create-skill, the create command tree and two system-spec-kit references. None of them is in phase 008's or 009's file set, so the writing side could land first. The sweep waits for both, which spec.md §6 records.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every changed script passes its own tests Evidence: no shipped script changed. The checks this lane relies on pass: `sk-doc-script-tests` prints `all sk-doc script tests passed`, `cite-drift-gate` and `advisor-routing-suites` exit 0, and `validate_document.py --json` reads `"valid": true` with 0 issues on all ten changed documents.
- [x] CHK-011 [P0] Every gate in scope passes Evidence: `scratch/after.md` §1, 39 of 39 at exit 0, with the same gate names as the baseline. After the sweep, `scratch/sweep.md` §6 records every gate passing on the final tree.
- [x] CHK-012 [P1] No operator-local surface is named in a tracked file Evidence: `router-reach` reports operator-local 0 across all seven hubs and wrong-hub 0. No private or local skill is named, and the additions are Markdown prose, YAML activity text, version lines and a changelog entry.
- [x] CHK-013 [P1] Changes follow the phase 003 canon Evidence: no routing shape changed. `package_skill.py --check --strict` prints `Result: PASS` on all fourteen skill folders, including the two this lane changed, and `compiled-route-guard` reports every hub fresh with 0 failures.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met Evidence: 4 of 4 Met, and acceptance-criteria.md reads `Closeable: Yes`.
- [x] CHK-021 [P0] Gate output recorded before and after Evidence: `scratch/before.md` and `scratch/after.md`, with one raw log per gate in `.scratch-dc90/072-010/after/` and the two summary files beside them.
- [x] CHK-022 [P1] The largest file in scope was changed last Evidence: not applicable as written to this lane. The largest changed document is `references/parent-skill/parent-skills-nested-packets.md` at 72 diff lines, and it was edited in the same pass as the rest, so no per-file order was recorded. The risk the row guards against is covered instead by the review's per-file read of the diff and by the strict package gate on both changed skills.
- [x] CHK-023 [P1] A reverted change leaves the gates as they were Evidence: the revert target is the baseline, and the baseline run at `9fdae0b7d4` is 39 of 39 at exit 0 (`scratch/before.md` §1). Every changed file is prose, YAML activity text or a version line, so a revert restores both the text and the reading. No revert was needed.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets in any changed file Evidence: no secrets. Markdown, YAML and changelog text only, and no credential appears in any changed file or in these docs.
- [x] CHK-031 [P1] N/A unless a script changes: input handling is tested Evidence: no shipped script changed. The scan command the new gate runs is unmodified, and the review checked its argument handling and its three exit codes against the code (`report.md` §3).
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks agree Evidence: spec.md, plan.md, tasks.md, acceptance-criteria.md and implementation-summary.md agree that all four requirements are met. Spec status and summary status both read `Complete`, and `STATUS_CROSS_DOC_CONSISTENCY` passes on the pair.
- [x] CHK-041 [P2] Changelog and version bumped for each changed skill Evidence: `changelog/v1.7.2.0.md` with `SKILL.md` at 1.7.2.0 and `README.md` at 1.2.3.0, `parent-skills-nested-packets.md` at 1.2.8.0 and `memory-handback.md` at 1.6.0.15. `package_skill.py --check --strict` reads the same versions out of both changed skills. The sweep stepped the third segment of each changed `SKILL.md` and wrote exactly one changelog entry beside each, 50 in all, with each hub root carrying the same version in its three JSON files (`scratch/sweep.md` §3).
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only Evidence: raw logs in `.scratch-dc90/072-010/`, review artifacts in `.scratch-dc90/072-010/review/`, and the packet's two records under `scratch/`. No temporary file is tracked outside those.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 7/7 |
| P1 Items | 8 | 8/8 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-28
<!-- /ANCHOR:summary -->
