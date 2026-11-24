# Review Iteration 3

## Dispatcher

- Mode: review, single review iteration (fan-out lineage `deepseek-max-3`).
- Resolved route: `Resolved route: mode=review target_agent=deep-review`.
- Review target: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers` (spec-folder).
- Iteration 3 of 7, stop policy `max-iterations`.
- `steer.md` is still absent, so no lead ruling applied.
- Operator focus: finish `spec_code` and `checklist_evidence`.

## Files Reviewed

- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:57` to `:251` (REQ-001 to REQ-022, SC-001 to SC-006, measured behavior)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:58` to `:94` (AC-001 to AC-029)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md:153` to `:158`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:5` to `:130` (T001 to T036, first five rounds)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:33` to `:410` (ADR-001 to ADR-004)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/probes/results-after.json` (69 rows)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/probes/results-spec-baseline.json` (69 rows)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/probes/fresh-review-hook.txt:1` to `:29`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/behaviour/F6-sample-1.md:23` to `:26`
- `.skilled/commands/deep/assets/deep-research-presentation.txt:13` to `:70`, `:236`, `:246`, `:478`
- `.skilled/commands/deep/assets/deep-review-presentation.txt:13` to `:70`, `:267`, `:277`, `:583`
- `.skilled/commands/deep/research.md:86`, `.skilled/commands/deep/review.md:81`
- `.skilled/commands/deep/assets/deep-research.yaml:660` to `:663`, `:2252` to `:2269`
- `.skilled/commands/deep/assets/deep-review.yaml:736`, `:2534` to `:2535`
- `.skilled/skills/system-deep-loop/SKILL.md:20`
- `.skilled/skills/system-deep-loop/deep-research/SKILL.md`, `.skilled/skills/system-deep-loop/deep-review/SKILL.md`, `.skilled/skills/system-deep-loop/deep-research/references/guides/quick-reference.md`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl` (holdout, split and near-miss counts)

## Operator Focus

This iteration finished the requirement sweep: REQ-001 to REQ-022 were read against the captured probe run and the files each names, and AC-001 to AC-029 were checked against the same artifacts. The two P2 findings from iteration 2 stay active and are re-confirmed, not duplicated. `spec_code` can now move to `pass`: all thirty-nine REQs have a producer or a decision. `checklist_evidence` stays `partial` because the thirteen evidence pointers have not been repointed.

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

No new P2 in this iteration. Carried forward and re-verified:
- **R2-P2-001** -- acceptance evidence cells point one row above the closure-pass and limitation rows they cite.
- **R2-P2-002** -- AC-040 says `review/` still holds the pre-fix report, but the report is in `review-archive/20261124T111600Z/`.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | pass | REQ-001 to REQ-005 verified against `results-after.json`: the five gain rows carry `system-deep-loop` with `/deep:review` or `/deep:research` and `pol=ask`; R7 and all thirteen no-gain rows carry no `/deep:*` in any of three rows; the seventeen keep rows keep their command and policy; the seventeen negative rows keep their top skill and `cmd=`. A row-by-row compare of `results-after.json` with `results-spec-baseline.json` found 0 changes across the keep and negative groups. REQ-006 to REQ-008 verified at `deep-loop-offer-cases.vitest.ts:68` to `:318`, `command-attach-guards.vitest.ts:532` to `:541`, and `explicit.ts:454`. REQ-009 to REQ-012 verified at `deep-research.yaml:663`, `deep-review.yaml:736`, both presentation Next Steps rows, and `command-prompts.jsonl` (31 near-miss rows). REQ-013 to REQ-022 verified at `fresh-review-hook.txt:1` to `:28`, the fixture rows, and ADR-003 to ADR-005. |
| `checklist_evidence` | partial | AC-001 to AC-029 opened. The underlying observations hold: the probe rows match, the presentation sections exist at `:13` with A/B/C, step 0 exists in both command docs, the YAML next steps exist, the depth triggers are gone from both mode skills, and `ASK with SINGLE prompt` is gone from the compiled assets. AC-041 and AC-040 still carry the two P2 drifts. Verification Summary counts match `tasks.md:309` to `:311`. |

## Integration Evidence

- `results-after.json` is the captured rerun every probe-based row cites; the comparison against `results-spec-baseline.json` was done in memory and touched no file.
- `fresh-review-hook.txt:1` to `:28` is the prompt-hook capture AC-022 to AC-027 cite.
- `command-prompts.jsonl` holds 92 holdout rows, 109 `none` rows and 46 tune rows, with 31 `near-miss` rows, which matches ADR-001's recorded corpus state.

## Edge Cases

- The completion block at `deep-research.yaml:2253` does not name `--extend=N`; the completed-packet detection message at `:663` does. REQ-009 and AC-014 use the phrase "completed-packet message", which matches `:663`, so this is recorded as an ambiguity in the requirement wording rather than a finding.
- `results-after.json` is a captured artifact; it was read, not regenerated, because a probe run writes result files outside the lineage. The capture is internally consistent and its 69 rows match the baseline's 69.
- AC-029 cites `changelog:759` for a three-clause sentence; that line holds the suite-count clause, while the refusal-rule clauses are at `:482` to `:484`. The claims are all true in the file, so this is recorded as a pointer-precision caveat, not a new finding.

## Confirmed-Clean Surfaces

- Probe gain group: V6, H1a, H1b, E1 and E3 all top `system-deep-loop` with the expected command and `pol=ask`.
- Probe lose and no-gain groups: R7 and the thirteen no-gain rows carry no `/deep:*` command; V5 still tops `sk-code`.
- Probe keep and negative groups: 0 changes against the baseline across 34 rows.
- Stage-one rows: R2 tops `system-spec-kit`, V2, V4 and H10 top the hub with `/deep:review`, H7 with `/deep:research`, and no negative row moved.
- Presentation offer sections: `deep-research-presentation.txt:13` to `:70` and `deep-review-presentation.txt:13` to `:70` hold the heading, the one question with A/B/C, the recommended `:auto` form with `--spec-folder=<the Gate 3 answer>`, option B `:confirm`, option C no loop, the native default, and fan-out only on two or more named executors or independent takes.
- Command documents: step 0 points at the offer section at `research.md:86` and `review.md:81`, and counts a missing policy as `ask`.
- YAML: the completed-packet message names `--extend=N` and `--restart` at `deep-research.yaml:663`, and both `next_steps` lists carry the `--extend=N` and `/doctor:deep-loop --scope=` rows.
- Setup: both presentation files name the question tool from `communication-handoff.md` §5, mark Autonomous `(Recommended)` and Native `(Recommended, default)`, and hold no `ASK with SINGLE prompt`.
- Mode packets: `deep-research/SKILL.md` has no `comprehensive research` or `deep investigation`; `deep-review/SKILL.md` has no `audit spec folder` or `pre-release review`; the hub `SKILL.md` names `/doctor:deep-loop` at `:20`; the quick-reference example uses `=` flags.
- Corpus: 31 near-miss rows, three deep-family holdout rows in the `-04` series, and the fixture's 285 cases.

## Ruled Out

- "The keep or negative groups moved after the ninth round": ruled out; the in-memory compare of `results-after.json` against `results-spec-baseline.json` reported 0 changes across all 34 rows.
- "The deep-research presentation is missing the fan-out condition": ruled out; the flag table at `:54` says fan-out appears only on two or more executors or models, or independent takes.
- "The compiled contracts still teach the old setup prompt": ruled out; `rg -c 'ASK with SINGLE prompt'` over `.skilled/commands/deep/assets/compiled/` printed nothing.
- "AC-019's 31 near-miss count is stale": ruled out; `rg -c '"row_type":"near-miss"'` prints 31.

## Next Focus

- Dimension: correctness.
- Focus area: the two gate copies and the scorer paths that the requirements pin, read for logic defects the fixture may not cover: the refusal gap, the bounded window, the deferred mode cue, `typedCommandsIn`, and `trackedCommandForOwner`.
- Reason: traceability has all thirty-nine requirements mapped and both protocols exercised; correctness is the next dimension with no coverage.
- Rotation status: traceability moves to completed for this run; correctness, security and maintainability remain.
- Carry-forward: R2-P2-001 and R2-P2-002 stay active advisories; the unexecuted suite runs stay an evidence limit.
- Required evidence: a file:line and a concrete input for every correctness finding; P0 candidates get the full three-pass check.

Review verdict: PASS
