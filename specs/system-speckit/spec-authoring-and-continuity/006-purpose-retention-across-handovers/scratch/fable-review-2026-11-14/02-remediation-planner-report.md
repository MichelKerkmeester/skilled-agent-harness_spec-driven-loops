BINDING: command=spec-doc
BINDING: target=review remediation plan for the purpose-carry work
BINDING: output=specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers
BINDING: template=.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md
BINDING: mode=AUTONOMOUS
BINDING: specFolder=specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers

The remediation is planned and every folder in the packet passes strict validation. Nothing is built and nothing is committed. `vitest` was blocked in this session, so none of the planned code or tests has been run. Test baselines are quoted from the 001 to 006 records or counted from `it(` lines, and each new child's Setup tasks recheck them.

## 1. Decision per finding

| # | Decision | Reason |
|---|----------|--------|
| 1 | Planned in 007 | Confirmed by `rg` counts. Widening one reader function covers the files that state a purpose another way, instead of editing each spec. |
| 2 | Folded into 006 | Its Purpose and REQ-001 now claim only that no live phase parent holds the scaffold sentence. E1 to E14 are untouched. |
| 3 | Planned in 007 and 010, one part declined | 007 fixes the list-marker and abbreviation cuts. The 300-character cap is kept because the stored field's 512-character limit depends on it. 010 carries the Problem Statement sentence after a compaction only. |
| 4 | Planned in 009 | Confirmed in `session-stop.ts:221-239`. Recovery falls back to the folder named in the cached brief. The reviewer's 26-of-31 count was not rechecked. |
| 5 | Declined | The operator built the field knowing only the opt-in snapshot renders it (decision Q006), and every save copies the purpose again. |
| 6 | Planned in 008 | Confirmed: the hop files use different labels, and `handoff.md` and `nudge.cjs` have no scaffold skip. The helper's three labels win. |
| 7 | Declined | Every hook in the repository runs from the git-ignored `dist/` build, so this is not specific to carrying a purpose. |
| 8 | Done in the parent spec and the 001 to 005 summaries | The parent now states the user need and the build children. Each summary keeps its text and gains its landing commit. |
| 9 | Planned in 009 | Confirmed in `session-prime.ts` and the Pi adapter. Both get a containment check. No sanitizer pass is added. |
| 10 | Folded into 006, planned in 008 and 009, one part declined | 006 gains E15, the non-Draft gate assertion. 008 pins the nudge labels. 009 moves the compaction tests to repo-relative folders. The resume hop is prose a model follows, so it gets no test. |

## 2. Files created or changed

All paths are under `specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/`.

- **Created:**
  - `007-purpose-reader-coverage/`, with `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, the generated metadata and `scratch/probe-reader.mjs`.
  - `008-hop-purpose-rule-parity/`, `009-compaction-purpose-folder/` and `010-problem-sentence-carry/`, each with the same four docs and generated metadata.
  - `006-purpose-carry-follow-ups/scratch/phase-parents-without-purpose-text.txt`.
- **Changed by hand:**
  - `spec.md` in the parent: description, Problem Statement, Purpose, scope, REQ-004, REQ-005, SC-004, the review decision table, phase map rows 6 to 10 and four handoff rows.
  - `006-purpose-carry-follow-ups/`: `spec.md`, `plan.md`, `tasks.md` and `implementation-summary.md`. E15 and tasks T026 to T028 are added after the existing ones, with no renumbering.
  - `implementation-summary.md` in 001 to 005: one sentence added after "Nothing is committed." naming the landing commit.
- **Changed by tools:** `graph-metadata.json` in the parent and in 001 to 006, rewritten by `create.sh`, `repair-derived.cjs` or the Draft auto-repair.
- **Removed:** seven temporary scan files I had created in the parent's `scratch/`.

`git status --short` lists nothing outside the packet folder.

## 3. Validation

The validator supports `--recursive`, so one command covers the parent and all ten children:

`bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers --strict --recursive`

- **First run:** exit 2. The parent and 001 to 005 printed `RESULT: FAILED` on derived metadata only (`SOURCE_FINGERPRINT_MISMATCH`, plus a description drift in 001 to 005). 006 to 010 printed `RESULT: PASSED`.
- **Repair:** `repair-derived.cjs --folder <folder> --apply` on the parent and on each of 001 to 005, as the validator asked. Each printed `repaired=1 failed=0`.
- **Final run, with `--quiet`:** exit 0, eleven lines of `RESULT: PASSED (errors=0 warnings=0)`, one for the parent and one per child 001 to 010.

## 4. Goal recommendation

No `goal.md` exists in the parent or in any child, so there was nothing to update and I created none.

A `goal.md` on the parent would help. The packet's stated aim had already drifted once, from the user need to "find where the purpose drops", and five build phases now hang off it. A goal on a child would not help, because each child is one bounded set of edits.

Draft Objective sentence: "A packet's purpose, the reason the work exists and whom it serves, is shown to the next AI after a resume, a relaunch, a compaction and a continuity save, and each of the four has been seen working in a real session."

## 5. Questions for the operator

1. **Phase 010, yes or no?** It prints the first sentence of the Problem Statement after a compaction. That widens the Purpose-only design you approved, so it stays unbuilt until you say yes.
2. **Should the phase parents with no purpose be backfilled?** 21 live phase parents have a bracket placeholder or no purpose text. They are listed in the 006 scratch file and are out of scope everywhere. Writing them needs someone who knows each packet.
3. **Will you run the three live checks?** A real compaction, a real relaunch and an operator-run `/speckit:resume` have never been observed showing the purpose line. Only the continuity save has live evidence. The parent's SC-004 records this as open.
4. **May the parent's own summary be corrected?** The parent's `implementation-summary.md` line 84 also says "Nothing is committed". Your instruction covered 001 to 005 only, so I left it.
5. **Does the E2 purpose sentence still stand?** The reviewer read the local-embeddings sentence as not covering about fifteen later children of that parent. I did not recheck that and left the approved sentence as is.
6. **May the build order differ from the numbering?** 008 and 010 need 007 built first. 009 only takes effect for `specs/` folders once 006's E11 is built. 010 also needs 009.

STATUS=OK PATH=specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers
DQI=84 (manual rubric, my judgment, no scoring helper was run)
TEMPLATE=.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md
CHECKS=validate --strict --recursive RESULT: PASSED x11, zero unfilled template tokens in touched docs, no em dashes in new prose, git status scoped to the packet, no goal.md present
NOTES=Planned code and tests never executed because vitest was blocked. The two em dash hits in 006 are quoted search text that predates this work. Phase 010 is gated on an operator yes.
EXIT=0
