# Review Iteration 002

## Dispatcher

- Mode: review
- Dimension: traceability (operator focus continued)
- Iteration: 2 of 7
- Focus this pass: `checklist_evidence` for the sixth fix round -- `tasks.md` T065 to T101 and the `Met` rows AC-030 to AC-042
- Executor: this lineage process (cli-pi, deepseek-v4.1-flash-1017); no nested dispatch

## Files Reviewed

- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:130-200`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:240-326`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:86-95`
- `.skilled/changelog/skilled/v4.2.0.0.md:759`
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:215-225`, `:688-760`, `:897`
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5165`, `:5646`, `:5745`, `:5820`
- `.skilled/skills/system-skill-advisor/runtime/tests/typed-on-stuck-serving.vitest.ts:112-126`
- `.skilled/skills/system-skill-advisor/runtime/tests/scorer/doctor-handoff-command.vitest.ts:206`, `:253`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:850-870`, `:1020-1040`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/probes/results-after.json`, `results-spec-baseline.json`, `results-fresh-review.json`

## Findings

New findings this pass. The operator focus is addressed by replaying each sixth-round task's `Verify:` command and reading the line it cites, rather than trusting the "Observed" sentence.

### P0 Findings

None.

### P1 Findings

1. **Sixth-round task evidence cells cite offsets and a row count the tree no longer holds, so the ticked tasks cannot be re-walked** -- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:141` -- T066 says the refusal leads sit at `command-attach.ts:581`; that line is `LOOP_RUN_SYMPTOMS`, and `RUN_ASK_REFUSAL_LEADS` is at `:688`. The same task cites `skill_advisor.py:4993` for `_RUN_ASK_NEGATED_RE`; the pattern is at `:5165`. T067 (`tasks.md:142`) cites `RUN_REFUSED` at `:790` (actual `:897`), the stuck branch at `:1404` (the `RUN_REFUSED` read is elsewhere) and `_RUN_REFUSED_RE` at `:5404` (actual `:5646`), then records "26 `doctorWithheld` rows" where the fixture holds 47. T076 (`tasks.md:154`) and T087 (`:174`) cite `RUN_ASK_REFUSAL_LEADS` at `:581`, the drift-guard pairs at `:68`/`:83`/`:90` (the `VOCABULARY_PAIRS` array starts at `:80`, and the file holds 22 pairs, not the fifteen those rows count), and T081 (`tasks.md:163`) cites the served-head assertion at `typed-on-stuck-serving.vitest.ts:107` where it is `:112`. The behaviour each task claims is present; the evidence pointer is not, so a closure reviewer cannot reproduce the observation from the cell.
   - Finding class: `stale-evidence`
   - Scope proof: `tasks.md` is a closure doc inside the review target; every cited symbol lives in a declared scope file.
   - Affected surface hints: `tasks.md` T066/T067/T076/T081/T087/T092, `lib/command-attach.ts`, `scripts/skill_advisor.py`, `tests/fixtures/deep-loop-offer-cases.json`
   - Case: A closure reviewer replays T066's verify command from the cited lines and reads `LOOP_RUN_SYMPTOMS` and a continued-request regex, so the ticked task looks like it was observed against different code.
   - Claim adjudication:
     ```json
     {"type":"traceability","claim":"Five sixth-round task rows cite line offsets that no longer hold the symbol they name, and one records a fixture row count (26) the fixture contradicts (47).","evidenceRefs":["specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:141","specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:142","specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:154",".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:688",".skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5165"],"counterevidenceSought":"Searched each symbol by name before calling the cell stale; every symbol exists, so this is a citation defect and not a missing implementation.","alternativeExplanation":"The sixth-round tree's offsets were correct when written; the eighth and ninth rounds inserted lines above them and only the implementation-summary citations were refreshed (T101).","finalSeverity":"P1","confidence":0.95,"downgradeTrigger":"If the packet convention treats a nearby anchor as an acceptable citation, the three cells that still sit inside the right function drop to P2; the count and the pairs figure stay P1."}
     ```
   - refines: `R1-P1-003`

### P2 Findings

1. **AC-029 records a suite count the changelog no longer carries** -- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:86` -- The row says the changelog's suite row "quotes 184 files, 3,188 passed, 4 skipped and none failed, which is what the eighth-round rerun reads". The changelog row reads "186 files, 3,415 passed, 4 skipped, none failed; Python scorer 136 passed, none failed on 347 shared cases" (`.skilled/changelog/skilled/v4.2.0.0.md:759`). REQ-022's actual requirement (the changelog quotes the final suite count) is still met; only the recorded numbers are behind.
   - Finding class: `stale-evidence`
   - Scope proof: both files are packet-adjacent closure docs named in REQ-022.
   - Affected surface hints: `acceptance-criteria.md` AC-029, `.skilled/changelog/skilled/v4.2.0.0.md`
   - Case: A reader compares AC-029 with the changelog row it cites and finds two different "final" suite counts.

## Traceability Checks

| Protocol | Status | Evidence | Note |
|----------|--------|----------|------|
| `spec_code` | partial | `spec.md:243`, `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:688` | No new requirement-level contradiction this pass; REQ-031 and REQ-033 remain as recorded. |
| `checklist_evidence` | partial | `tasks.md:141`, `tasks.md:154`, `acceptance-criteria.md:86` | Every sixth-round task has an observation, but five cells point at the wrong line and one count is stale. |
| `skill_agent` | notApplicable | - | Not in this pass. |
| `agent_cross_runtime` | notApplicable | - | Not in this pass. |

## Integration Evidence

- `MODE_SUFFIXES` holds seven entries (`command-attach.ts:215`) and the typed-command guard reads every one of them (`tests/command-attach-guards.vitest.ts:1023-1038`), so REQ-031's rationale for that list is sound even though its line pointer is not.
- `typed-on-stuck-serving.vitest.ts:112-124` asserts `command: '/deep:review'`, `policy: 'ask'` and `typed: true` on the served head, and asserts `attachCommand` still answers `/doctor:deep-loop` at `:114`, so AC-036's behaviour is pinned one line below its cited cell.
- Both presentation Next Steps tables and both YAML `next_steps` lists carry `--extend=N` and `/doctor:deep-loop --scope=<mode>` (`deep-research.yaml:2265-2270`, `deep-review.yaml:2530-2536`, `deep-research-presentation.txt:478`, `deep-review-presentation.txt:583`), so AC-014's stricter wording holds.
- All four probe result files hold 69 rows (`scratch/probes/results-after.json`, `results-spec-baseline.json`, `results-fresh-review.json`, `probes-spec-baseline.json`), so CHK-021's count is accurate.

## Edge Cases

- Historical rows are not stale by definition: `implementation-summary.md:165-172` and `tasks.md:140` label their numbers by round (203 cases in the sixth round, 285 in the eighth). They are only defects where a row claims the final tree, which is how AC-028 and AC-042 read.
- T084 and CHK-020 are legitimately open because AC-040 is `Unmet`; the Checklist Summary's 11 of 12 P0 count matches the boxes.
- CHK-040's counts (4, 1, 2), CHK-042's empty `convene` search and CHK-FIX-005's three matrix axes all reproduce, so the checklist is not uniformly stale.

## Confirmed-Clean Surfaces

- AC-014: both YAMLs and both presentation files carry the extension and doctor rows (`deep-research.yaml:2268`, `deep-review.yaml:2534`).
- AC-031: `doctor-handoff-command.vitest.ts:206` and `:253` exercise the fused row and the withhold step; the fixture's refusal rows read as recorded.
- AC-032: `typed-two-commands-*` rows carry `typedRunsKept: ["/deep:review"]` (`deep-loop-offer-cases.json:125-126`).
- AC-039: `reduce-state.cjs:995` and the two named test files exist and exercise a cross-file refinement (`tests/unit/reduce-state-refinement-other-file.vitest.ts:87-144`).

## Ruled Out

- "The checklist summary is miscounted": ruled out. Twelve P0 boxes, eleven checked, with CHK-020 the single open one; thirteen P1 and one P2 all checked.
- "A probe artifact is missing": ruled out. Every file the tasks cite under `scratch/probes/` exists, and each result file holds the 69 rows it claims.

## Next Focus

- Dimension: traceability
- Focus area: finish `spec_code` for the sixth and ninth rounds -- REQ-023 to REQ-046 against their producers, with ADR-005 and ADR-006 read as the decision records the focus names
- Reason: requirement mapping covered REQ-001 to REQ-030 and the checklist pass is now exhausted for new angles; the later requirements and their ADRs are the remaining core-protocol work
- Rotation status: traceability continues; correctness, security and maintainability remain
- Blocked/productive carry-forward: productive (symbol-by-symbol replay)
- Required evidence: each REQ's producer line and the ADR section that records the exception

Review verdict: CONDITIONAL
