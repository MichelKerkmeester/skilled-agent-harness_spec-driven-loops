# Review Iteration 001 - traceability (spec_code, REQ-001 to REQ-014)

## Dispatcher

- Mode: review, lineage `deepseek-max-2`, session `fanout-deepseek-max-2-1795550334883-gjbarh`, generation 1.
- Route: `Resolved route: mode=review target_agent=deep-review`, execution single_review_iteration.
- Dimension: traceability. Operator review focus: finish `spec_code` and `checklist_evidence`, checking every REQ against the code that implements it or the decision that records it, and every ticked task and `Met` acceptance row against evidence the tree holds.
- This iteration addressed the focus by running `spec_code` over the first slice of the requirement table, REQ-001 to REQ-014, and by refusing to accept a requirement's own wording as its proof: each claim was resolved to a symbol, a document line, a corpus row or a fixture column read from the tree.
- Budget: 24 tool calls (config `maxToolCallsPerIteration`), used inside it.

## Files Reviewed

- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md` (section 3 Files to Change, section 4 REQ-001 to REQ-014, section 5 SC-001 to SC-006).
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:688,715,759,783,942,1317,1321,1381,1385,1470,1763`.
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4639,4666,5230,5706`.
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:534-547`.
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:121-152`.
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json` (359 cases, 11 columns).
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl` (247 rows).
- `.skilled/commands/deep/assets/deep-research-presentation.txt:13-60,236-246,478`; `.skilled/commands/deep/assets/deep-review-presentation.txt:13-60,267-277,582-583`.
- `.skilled/commands/deep/research.md:86`; `.skilled/commands/deep/review.md:81`.
- `.skilled/commands/deep/assets/deep-research.yaml:663,2268`; `.skilled/commands/deep/assets/deep-review.yaml` (completion `next_steps`).
- `.skilled/commands/deep/assets/compiled/deep-review.contract.markdown`, `deep-research.contract.markdown`, `compiled/README.markdown`.
- `.skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:76-78,177-179,291-296`.
- `.skilled/skills/system-deep-loop/SKILL.md:20`; `deep-research/SKILL.md:56,100,303`; `deep-review/SKILL.md:57,308,319`.
- `.skilled/skills/system-deep-loop/hub-router.json:34`; `.skilled/skills/system-deep-loop/ROUTER.md:63`.
- `.skilled/skills/system-deep-loop/deep-research/references/guides/quick-reference.md:74`.
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/probes/probes-spec-baseline.json` (69 rows, ids N7, N9, V7, H6, A3, D1).
- `.skilled/repo-rules/communication-handoff.md:149` (section 5 heading).

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | REQ-001 to REQ-014 resolved: 14 of 52 requirement rows checked against their code, document line, corpus row or fixture column. Coverage continues in iterations 2 and 3. |

Per requirement, the binding evidence found in this iteration:

- **REQ-001 / REQ-002 / REQ-003 / REQ-004** are probe-outcome requirements. The tree holds their harness: `scratch/probes/probes-spec-baseline.json` carries 69 rows and the ids the requirement table names (`probes-spec-baseline.json` rows `V6`, `H1a`, `H1b`, `E1`, `E3`, `R7`, `V5`, `N1`..`H5`). Their outcomes are behavioural and are not re-measured from this lineage; the recorded reruns are `scratch/probes/results-fresh-review.json` and `results-after.json`. No contradiction found between the requirement text and the harness.
- **REQ-005:** `### Offer From an Advisor Brief` is the first H3 in both presentation files (`.skilled/commands/deep/assets/deep-research-presentation.txt:13`, `deep-review-presentation.txt:13`); the section names the question tool with three options and marks A recommended, sends `--spec-folder=<the Gate 3 answer>` on A, keeps native as the default executor, and reserves fan-out for two or more named executors or models or independent takes; `research.md:86` and `review.md:81` each carry the step 0 pointer.
- **REQ-006:** the shared fixture carries `asksForLoopRun` on all 359 cases and the depth-word negative cases are one `it.each` block in `tests/command-attach-guards.vitest.ts:534-547` ("withholds the review command on depth wording alone: %s") covering in depth, thorough, find out everything, final verdict, thoroughly, exhaustive and deep dive. Both suites read the same fixture file (`.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts` and `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py`).
- **REQ-007:** the compiled contracts are produced by `compile-command-contracts.cjs` from the presentation slices declared at `:76-78` (review) and `:177-179` (research); `extractBetween` throws on a missing marker (`:291-296`), so a stale marker fails the build rather than emitting a short contract. Both compiled files carry the four setup H3s they compile.
- **REQ-008:** the stage-one lane reads the gate's own predicates: `lib/scorer/lanes/explicit.ts:10` imports `asksForLoopRun`, `isStuckRunComplaint`, `MODE_CUES`, `ITERATIVE_ASK`, `LOOP_COUNT`, `MULTI_PASS` from `command-attach.js`, and `:455` gates the passes wording on the first two.
- **REQ-009:** `deep-research.yaml:663` names `--extend=N` and `--restart` in the completed-packet message; `:2268` carries the `--extend=N` next step; the review YAML completion `next_steps` carries the same line; both presentation Next Steps tables carry an `--extend=N` row (`deep-research-presentation.txt:53`, `deep-review-presentation.txt:54,582`) and a `/doctor:deep-loop --scope=<mode>` row (`deep-research-presentation.txt:478`, `deep-review-presentation.txt:583`).
- **REQ-010:** step 6 of both presentation files names the question tool that `.skilled/repo-rules/communication-handoff.md` §5 names (`deep-research-presentation.txt:223`, `deep-review-presentation.txt:237`), `ASK with SINGLE prompt` matches nothing, Q2 marks `A) Autonomous (Recommended)` (`:236`, `:267`) and Q-Exec marks `A) Native (Recommended, default)` (`:246`, `:277`).
- **REQ-011:** `DEPTH_WORDING` and `DEPTH_REQUEST` match nothing in `lib/` or `scripts/`; the council words match nothing in `command-attach.ts` or `explicit.ts`; `hub-router.json:34` and `ROUTER.md:63` both carry `iterative research` and `multi-round research` and neither carries `autonomous research`; the depth triggers, spaced `:auto` form and `skill_advisor.py` Gate 2 line are absent from both mode `SKILL.md` files; `:auto` is the invoke form (`deep-research/SKILL.md:56`, `deep-review/SKILL.md:57`); `deep-research/SKILL.md:303` and `deep-review/SKILL.md:319` name `node .skilled/bin/skill-advisor.cjs advisor_recommend`; the quick reference example uses `=` (`quick-reference.md:74`); `system-deep-loop/SKILL.md:20` names `/doctor:deep-loop`.
- **REQ-012:** five near-miss corpus rows exist for the five prompts (`nm-system-deep-loop-02` = N7, `nm-system-deep-loop-03` = N9, `nm-system-deep-loop-05` = V7, `nm-sk-code-02` = H6, `nm-sk-code-03` = A3), and D1's prompt ("my deep review keeps running and never converges, what is wrong with its coverage graph") is the positive doctor row `cmd-doctor-deep-loop-plain-tune-02` with `expected_command` `/doctor:deep-loop`.
- **REQ-013:** the three deep-family holdout rows are fresh `-04` rows (`cmd-deep-research-plain-holdout-04`, `cmd-deep-review-plain-holdout-04`, `cmd-doctor-deep-loop-plain-holdout-04`), and no `-01` deep-family holdout row is left.
- **REQ-014:** N9's outcome is behavioural and recorded in AC-021; the requirement's own caveat (D6 rules out a guard for it) is consistent with the tree, where no prompt-specific guard for N9 exists.

## Integration Evidence

- `compile-command-contracts.cjs` slices each presentation from `### :auto Setup Resolution` to the confirm block and throws on a missing marker; the compiled outputs match that declared slice.
- `tests/fixtures/deep-loop-offer-cases.json` is the one shared case file both the TypeScript suite and the Python suite read, so a fixture column pins a rule in both gate copies.
- The corpus reader is `scripts/routing-accuracy/command-prompts.jsonl` (247 rows, seven `row_type` values, 31 `near-miss`).

## Edge Cases

- The compiled contracts do not carry the offer section, because the compiler's review slice opens at `:auto Setup Resolution` (`compile-command-contracts.cjs:76`), not at the top of the file. That is a declared slice, not a stale build, and no requirement claims the offer reaches the compiled surface. Recorded under Ruled Out rather than as a finding, with the compiler line as evidence.
- Four requirements in this slice (REQ-001 to REQ-004) name probe outcomes, not code. Their evidence is the harness plus a recorded rerun; this iteration treats a missing re-measurement as out of reach rather than as a pass, and says so.
- The `runtime/dist/` directory in the change-set table is gitignored (`.gitignore:60`), so it cannot be a review target and holds no reviewable line.

## Confirmed-Clean Surfaces

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` exports the gate vocabularies the requirement table names (`RUN_ASK_REFUSAL_LEADS:688`, `RUN_ASK_REFUSAL_CANCEL_LEADS:715`, `RUN_REFUSED:942`, `typedCommandsIn:274`, `NAMED_LOOP_MODE:1763`, `LEAD_WINDOW:783`); none of the sampled lines carries an ephemeral label or a spec path in a comment.
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` mirrors them (`_RUN_ASK_REFUSAL_LEAD_LIST:4639`, `_RUN_ASK_REFUSAL_CANCEL_LEAD_LIST:4666`, `_LEAD_WINDOW:5230`, `_NAMED_LOOP_MODE_RE:5376`, `_RUN_REFUSED_RE:5706`).
- All 26 paths named in the change-set tables exist in the tree (0 missing).
- `.skilled/skills/system-deep-loop/SKILL.md:20`, both mode `SKILL.md` Gate 2 lines, and the quick-reference example match REQ-011's wording.

## Ruled Out

- **Compiled contracts stale against the edited presentations.** Ruled out: the compiler's slice markers (`compile-command-contracts.cjs:76-78`, `:177-179`) start after the offer section by design, `extractBetween` throws on a missing marker (`:291-296`), and both compiled files carry the setup H3s the slice contains. The offer's absence from the compiled surface is a slice property, not drift.
- **A requirement in REQ-001 to REQ-014 with no acceptance row.** Ruled out: all 52 requirement ids appear in the acceptance table, and every acceptance row names at least one requirement id.
- **A missing declared change-set file.** Ruled out: all 26 paths in the three change-set tables resolve to existing files.

## Next Focus

- Dimension: traceability (`spec_code`).
- Focus area: REQ-015 to REQ-034, the fresh-review and sixth-round requirements, each against the gate copy, scorer lane, reducer function, fixture column or test title it names.
- Reason: the requirement table's densest code cluster sits in that range, and ADR-005 and ADR-006 are the two decisions the operator focus names.
- Rotation status: traceability stays the active dimension until `spec_code` and `checklist_evidence` both finish; the other three dimensions were reviewed in earlier generations and their evidence is unchanged in this tree.
- Blocked / productive carry-forward: productive. The corpus-row and fixture-column technique found every bound claim in this slice; apply it again.
- Required evidence: a symbol, fixture row id, test title or document line per requirement, plus the ADR text for REQ-019, REQ-020 and REQ-035's amendments.

Review verdict: PASS
