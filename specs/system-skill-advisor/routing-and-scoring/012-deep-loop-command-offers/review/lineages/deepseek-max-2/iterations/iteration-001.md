# Review Iteration 001

## Dispatcher

- Route: `Resolved route: mode=review target_agent=deep-review`
- Executor: `cli-pi` model `deepseek-v4.1-flash-1017`, reasoning effort max, run inline by the fan-out lineage `deepseek-max-2` (session `fanout-deepseek-max-2-1795556727682-axtzf8`, generation 1, lineage mode `new`).
- Iteration 1 of 7. Stop policy `max-iterations`, so convergence is telemetry only.
- Dimension: **traceability** (core protocol `spec_code`). Operator focus applied: lead with traceability, check every REQ against its code or decision, and file findings only on files listed in `review-scope-files.txt`.

## Files Reviewed

- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md` (REQ-001 to REQ-059, SC-001 to SC-006)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md` (AC-001 to AC-067)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md` (T001 to T122, CHK rows, Verification Summary)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md` (ADR-001 to ADR-009 headings)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md` (round-verification rows, limitations)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:202,313,666,847,917,1285,1300`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:27,1064,1079,1084`
- `.skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts:45,191`
- `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:23,1558`
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json` (368 cases, `$comment` header)
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:80,547,633`
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:227,2381,2392,1014`
- `.skilled/skills/system-deep-loop/hub-router.json:34`, `.skilled/skills/system-deep-loop/ROUTER.md:63`, `.skilled/skills/system-deep-loop/SKILL.md:20`
- `.skilled/commands/deep/research.md:86`, `.skilled/commands/deep/review.md:81`
- `.skilled/commands/deep/assets/deep-research-presentation.txt:13,58,236,246`, `deep-review-presentation.txt:13,59,267,277`
- `.skilled/commands/deep/assets/deep-research.yaml:663`, `deep-review.yaml` (`--extend=N` rows)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/timeline.md`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The Python-suite case count on the "final tree" is stated as 359 in four acceptance rows, while the tree's shared fixture holds 368** -- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:66` -- AC-009's verification cell says `python3 tests/python/test_skill_advisor.py` prints `cases=359` and `pass=136, fail=0` "on the final tree"; AC-030 (`:87`) says the same, AC-037 (`:94`) says "The 359 fixture cases of the final tree keep their results in both suites", and AC-042 (`:99`) says "`cases=359` on the final tree". The fixture those suites read holds 368 cases, and the packet's own thirteenth-round rows record the same run as `cases=368` and `pass=138, fail=0` (`specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md:202`, AC-028 at `acceptance-criteria.md:85`). Two rows of one closure document therefore describe the same tree with two different counts, and the older one is the one a reader of AC-009, AC-030, AC-037 or AC-042 sees first.
   Finding class: `evidence-cell-stale`
   Scope proof: all four rows are in the packet's `acceptance-criteria.md`, which is a declared review-scope file; the count they state is checkable against `tests/fixtures/deep-loop-offer-cases.json`, also in scope.
   Affected surface hints: `acceptance-criteria.md` verification cells for AC-009, AC-030, AC-037 and AC-042; the same three counts also sit in `tasks.md` T088 and T090 as history and are correct there because they name their round.
   Case: a reader takes AC-009's "final tree" cell as the current state and reuses `cases=359` in the next closure update, or compares a fresh `PY` run's `cases=368` line with it and treats the difference as an unrecorded regression.

## Traceability Checks

| Protocol | Level | Status | Evidence | Summary |
|---|---|---|---|---|
| `spec_code` | core | pass | `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:202]`, `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:313]`, `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1285]`, `[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2392]` | All 53 symbols the REQ rows name exist in the tree, and the five newest ones sit on the exact line their AC row cites: `DEEP_LOOP_DOCTOR_COMMAND` (202), `trackedCommandForOwner` (313), `questionClause` (1285), `lowerFolded` (917), `stripReviewVerdict` (227), `MIN_BLOCKED_ATTEMPTS` (2381), `splitRuledOutEntry` (2392), `refinesSameLocation` (1014). The nine ADRs the waived and superseded rows name (ADR-001, ADR-002, ADR-003, ADR-009 and the five that carry decisions) all exist in `decision-record.md`. |
| `checklist_evidence` | core | partial | `[SOURCE: specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:66]` | Every `Evidence: path:N (anchor)` tail in `acceptance-criteria.md` and `tasks.md` resolves against the tree (`scratch/citations/evidence-tails.py` prints `problems=0`), and the fixture counts the AC rows state hold for `refusal-verb-*` 12, `doctorWithheld` 47 (27 true, 20 false), `typedRunsKept` 4, `effort-*` 24 with 17 false, `plural-*` 21. One count class is stale, finding 1. The full ticked-task sweep is iteration 5. |

## Integration Evidence

- `.skilled/commands/deep/research.md:86` and `.skilled/commands/deep/review.md:81` each carry step 0 pointing at the presentation contract's "Offer From an Advisor Brief" section, and both name the three options with A recommended (REQ-005, AC-007).
- `.skilled/commands/deep/assets/deep-research-presentation.txt:13` and `deep-review-presentation.txt:13` each hold the `### Offer From an Advisor Brief` heading, `--spec-folder=<the Gate 3 answer>` at `:58` and `:59`, `A) Autonomous (Recommended)` and `A) Native (Recommended, default)` (REQ-005, REQ-010, AC-006, AC-015).
- `.skilled/commands/deep/assets/deep-research.yaml:663` carries the completed-packet message naming both `--extend=N` and `--restart` (REQ-009, AC-014).
- `.skilled/skills/system-deep-loop/hub-router.json:34` and `ROUTER.md:63` carry `iterative research` and `multi-round research` and no `autonomous research` (REQ-011, AC-043); `.skilled/skills/system-deep-loop/SKILL.md:20` names `/doctor:deep-loop` (AC-018).
- `.skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts:191` reaches `trackedCommandForOwner` from `command-attach.ts:313`, the same function `skill-advisor-cli.ts:1558` calls, so the hook brief and the CLI degraded path share one owner check (REQ-058, AC-066).

## Edge Cases

- `AC-040` reads `Unmet` and `T084` is open by design: the traceability rerun is the follow-up review this run is part of, so the row cannot be `Met` before this run finishes. Not a finding.
- The packet declares `.skilled/skills/system-skill-advisor/runtime/dist/` as regenerated, but `T111` records that path as gitignored. This review does not build, so no claim here rests on `dist`.
- The corpus recapture (`AC-012`, `AC-039` in `spec.md` numbering) was last run on an eighth-round tree; this review read the rows it names and did not re-run the capture script.
- `timeline.md` stops at review generation 9. Generation 10 is this run, so the absence is expected until this run closes.

## Confirmed-Clean Surfaces

- The four gate-copy surfaces the newest requirements name are one behavior in two languages: `lowerFolded` (`command-attach.ts:917`) folds the curly apostrophe and collapses whitespace plus the five zero-width characters, and the Python copy carries the same three rules behind `_fold_quotes`.
- `questionClause` (`command-attach.ts:1285`) bounds the iteration count to the question's own clause with `QUESTION_CLAUSE_END`, so a count in a later clause cannot turn a question into an ask.
- `explicitRunOutranks` (`command-attach.ts:847`) treats a whole-word `then` as a clause mark and reads the ask to its end, and it skips an ask a negation forbids.
- `splitRuledOutEntry` (`reduce-state.cjs:2392`) cuts only on a spaced double hyphen or an em dash, so a kebab-case name or a CLI flag stays part of the direction.
- Comment hygiene holds: no review-scope code file carries a `REQ-`, `ADR-`, `CHK-`, `AC-0` or `specs/` label in a comment.

## Ruled Out

- **The `cases=359` line as a code defect** -- ruled out: the fixture and both suites agree; only four narrative cells state the older count, so the defect is in the record, not the gate.
- **A missing `dist` rebuild as the cause of the stale count** -- ruled out: the count comes from the fixture, which the Python suite reads directly; no built artifact is involved.
- **A missing symbol behind any of the newest nine REQs** -- ruled out by direct read of every named symbol at its cited line.

## Next Focus

- Dimension: correctness
- Focus area: the two gate copies' word rules for the newest requirements (REQ-053 to REQ-059), and the reducer's projection of Next Focus and ruled-out items
- Reason: traceability is clean at the symbol level, so the next pass asks whether each rule's behavior matches the sentence that claims it
- Rotation status: traceability → correctness (1 of 4 canonical dimensions done)
- Blocked/productive carry-forward: `spec_code` is productive; `checklist_evidence` stays `partial` until iteration 5
- Required evidence: `file:line` for each claim, plus a reader-side trace of the input each finding needs

Review verdict: PASS
