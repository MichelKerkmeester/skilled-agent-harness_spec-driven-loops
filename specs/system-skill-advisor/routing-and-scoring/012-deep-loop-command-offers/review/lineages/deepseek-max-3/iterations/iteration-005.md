# Review Iteration 005 — traceability (core protocol `checklist_evidence`)

## Dispatcher

- Mode: `review`; target agent: `@deep-review` (LEAF, single iteration).
- Resolved route: `Resolved route: mode=review target_agent=deep-review`.
- Lineage: sessionId `fanout-deepseek-max-3-1795546920757-7pyjry`, generation 1, lineageMode `new`, executor cli-pi (deepseek-v4.1-flash-1017).
- Setup bindings (unchanged; emitted in full at iteration 1).
- Review focus for this iteration: the second half of the operator's traceability focus — "every ticked task in tasks.md and every Met row in acceptance-criteria.md against evidence that really exists in the tree, including the sixth fix round (AC-030 to AC-042)".
- Correction carried forward: iteration 4's record wrote `checklist_evidence` as `notApplicable`, which was wrong (the protocol applies and was merely deferred). This iteration runs it and records the real result; the iteration 4 narrative carries the same correction.
- `steer.md` is absent at this iteration.

## Files Reviewed

- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md` (all 135 task lines, ten rounds, 132 ticked)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md` (all 56 rows and their `Evidence:` tails)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md:150-180` (the verification rows the ticks cite)
- `.skilled/skills/system-skill-advisor/runtime/tests/{command-attach-guards,deep-loop-offer-cases,command-brief-golden,cli-degraded-command-contract,typed-on-stuck-serving,subprocess-typed-fields}.vitest.ts`
- `.skilled/skills/system-skill-advisor/runtime/tests/scorer/{stage-one-loop-subject,doctor-handoff-command,multi-typed-command-gates,deep-loop-plural-noun,deep-loop-ask-routing,deep-loop-ask-multifile}.vitest.ts` (titles read)
- `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:3050-3060` (`DEEP-LOOP-LONG`)
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json` (347 rows, counted by class)
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl` (247 rows, 31 near-miss)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/probes/{probes-spec-baseline,results-after,results-final-958fa81-worktree}.json`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/behaviour/` (nine recordings)

## Findings - New

### P0 Findings

None.

### P1 Findings

None new.

### P2 Findings

None new.

## Traceability Checks

| Protocol | Status | Evidence |
|---|---|---|
| `spec_code` | fail | unchanged from iteration 3 (REQ-031 drift, REQ-033 unmet) |
| `checklist_evidence` | pass | 126 path citations across 132 ticked tasks resolve; 13 of 13 named test titles exist; all 56 acceptance statuses are legal and every waiver names an ADR that exists; the one stale evidence path sits on the one `Unmet` row (already filed as R1-P2-001) |

### Tick-box inventory

| Class | Count | State |
|---|---|---|
| Task boxes in `tasks.md` | 135 | 132 `[x]`, 3 `[ ]` |
| Open task boxes | 3 | T084 (`:166`), "All tasks marked `[x]`" (`:215`), CHK-020 (`:275`) — each open on the same missing rerun |
| Acceptance rows | 56 | 52 `Met`, 2 `Waived` (ADR-002, ADR-003), 1 `Superseded` (ADR-001), 1 `Unmet` (AC-040) |
| Waiver cells | 3 | every one names an ADR that exists in `decision-record.md`, and no `Met`/`Unmet` row carries one |
| CHK rows | 26 | 12 P0 (11 ticked), 13 P1 (13 ticked), 1 P2 (ticked) — the Verification Summary's 12/11, 13/13, 1/1 |

### Ticked-task evidence

- 126 backticked path citations across the ticked task lines were resolved, with `$ADV` and `$PKT` expanded as `tasks.md:25` defines them and bare names tried against `lib/`, `tests/`, `scripts/`, the packet root and `scratch/probes/`. All 126 resolve. The two that needed a second root (`validate_document.py` → `.skilled/skills/sk-doc/scripts/validate_document.py`, `doctor-handoff-command.vitest.ts` → `tests/scorer/`) are named here because a reader reproducing the checklist needs the same mapping.
- 13 quoted describes/titles the tasks and acceptance cells name were searched for and all exist: "command attach on a refusal verb", "withholdDeepLoopDoctorWithoutRun", "doctor hand-off command", "the loop hub on a piece about the loop", "deferred mode cues past a refused loop phrase", "long prompts", "deep-loop constants shared with the Python fallback", "the loop rules read a plural loop noun as the singular", "enrichCompiledRoutes duplicate-command guard", "keeps the offer options on a degraded deep row that is not marked typed", "serves the typed /deep:review over the diagnosis a stuck complaint earns", "upsertHeadingSectionBefore", "deep-review strategy section numbering".
- The numeric claims that can be recounted statically all hold: 48 REQs (`spec.md`), 347 fixture cases, 31 near-miss corpus rows, 69 probe rows in each of the three probe files, 47 `doctorWithheld` rows (27 true, 20 false), 24 `effort-*` rows (17 no-run, 7 run), 13 `plural-*` rows in the REQ-035 block (8 run, 5 read), 22 `VOCABULARY_PAIRS`, 2 `NUMERIC_PAIRS`, 12 per-entry `it.each` vocabulary lists and 10 grammar-only ones.
- The suite totals are the one class not re-executed: `186 files, 3,418 passed` (AC-028, AC-055, changelog:759), `3,415` at `3db3085bcf0` (AC-048), `3,188` at the eighth round, `3,029` at the sixth, and Python `cases=347, pass=136`. Each is stamped with the tree it measured, and running the suites would write outside this lineage, so they are recorded as measured rather than re-measured.
- Probe rows confirm the two probe-borne checklist claims that are cheapest to falsify: all five gain rows carry their `/deep:*` command with policy `ask` (CHK-031), and N6/N10 carry no command (CHK-022). R7 carries no command and V5 keeps `sk-code` on `sk-code-review`, as REQ-002 states.

### Acceptance-row evidence, sixth round (AC-030 to AC-042)

| AC | Status | Evidence that exists |
|---|---|---|
| AC-030 | Met | twelve `refusal-verb-*` fixture rows (`deep-loop-offer-cases.json:129` is `refusal-verb-skip`); the guard describe exists |
| AC-031 | Met | 47 `doctorWithheld` rows, 27/20 split as the cell states; the two describes exist |
| AC-032 | Met | four `typedRunsKept` rows; `multi-typed-command-gates.vitest.ts` describes exist |
| AC-033 | Met | `command-attach-guards.vitest.ts:1125` holds "names the review mode on a deferred route" and the no-command control describe |
| AC-034 | Met | `stage-one-loop-subject.vitest.ts:26` holds the two named cases |
| AC-035 | Met | `command-brief-golden.vitest.ts:353` holds the typed-command case; the "keeps the offer options…" describe exists |
| AC-036 | Met | `typed-on-stuck-serving.vitest.ts` holds both named cases; `advisor-recommend-typed-command.vitest.ts` holds the handler case |
| AC-037 | Met | the long-prompt cases exist in both suites (`test_skill_advisor.py:3054` is the `DEEP-LOOP-LONG` name) |
| AC-038 | Met | 22 pairs, 12 per-entry lists, 10 grammar-only lists — each count matches the cell |
| AC-039 | Met | `refinesSameLocation` at `reduce-state.cjs:995`; both named unit files exist |
| AC-040 | Unmet | the row says so; its evidence path is the archived report (R1-P2-001) |
| AC-041 | Met | every valuation clause resolves (changelog `:482-484`, `implementation-summary.md:242`, packet 013 row) |
| AC-042 | Met | the counts it quotes match the recorded rounds; its `tasks.md:163` pointer is T081 |

## Integration Evidence

- The fixture is the shared surface both suites read: `tests/deep-loop-offer-cases.vitest.ts` (native) and `tests/python/test_skill_advisor.py` `test_deep_loop_offer_gate_parity` (fallback). Every column this iteration recounted is read by both.
- The probe runner (`scratch/probes/probe.mjs`) and its three result files are the packet's own measurement surface; `results-after.json` and `results-final-958fa81-worktree.json` both hold 69 rows.
- Packet 013's row "Reopened: degraded paths" is the cross-packet evidence AC-041 names; it exists at `specs/system-skill-advisor/routing-and-scoring/013-deep-loop-offer-in-hint/implementation-summary.md`.

## Edge Cases

- Recounting a ticked box is not the same as re-executing its command. A "Met"/"[x]" row whose evidence is a suite run is confirmed as *recorded with the tree it measured*, not as *true on this tree today*. The task and acceptance rows themselves insist on the commit stamps that make this distinction legible.
- AC-030's Given clause says "six refusal prompts" while its verification counts seven (the six plus `refusal-verb-refused-to`). The wider count is the one the fixture and suites read, so the row is `Met`; the mismatch is a wording narrowness, not a false claim.
- The three open task boxes and CHK-020 all trace to the single missing rerun (T084). The checklist's honesty is therefore intact: the open boxes are the ones a missing deliverable should leave open.
- Iteration 4's `notApplicable` correction: the protocol was deferred, not inapplicable. This iteration's `pass` supersedes that status in the reducer's rollup, and the iteration 4 narrative was corrected to say so.

## Confirmed-Clean Surfaces

- 126 of 126 ticked-task path citations resolve; 13 of 13 named test titles exist; 56 of 56 acceptance rows carry a status that exists in the status vocabulary.
- Every waiver names a real ADR, which is the packet's own rule for a waiver.
- The Verification Summary's three counts match the CHK boxes exactly, and CHK-001's 48 matches the REQ table.
- All five gain probes carry their deep command with policy `ask`, and N6/N10 carry none — the two probe claims most likely to rot.

## Ruled Out

- "A ticked task cites a file that has moved": no citation fails to resolve once `$ADV`/`$PKT` are expanded; the two that needed a second root are named above.
- "A `Met` row rests on an `Unmet`-style stale pointer": the only stale path is AC-040's, and that row is `Unmet`. A `Met` row's tail resolves to its token in every other case (49 cells checked in iteration 1).
- "AC-038's twelve-and-ten split is wrong": twelve lists carry a per-entry `it.each`, and the ten named grammar-only lists match the ten pairs with no such case.
- "The suite totals are mutually contradictory": each carries the round and commit it measured; AC-028 states which belongs to the final tree.

## Next Focus

- Dimension: correctness
- Focus area: the sixth fix round's acceptance rows read as behaviour, AC-030 to AC-042 one by one, plus the sibling packet 013 rows the focus names indirectly (its REQ-006 degraded-path evidence).
- Reason: the operator focus explicitly names AC-030 to AC-042, and a checklist pass proves the rows' evidence exists without proving each row's stated behaviour is the behaviour the code has.
- Rotation status: all four canonical dimensions have one pass; this is a deepening pass on correctness inside the sixth round.
- Blocked / productive carry-forward: the fixture probe and the title-existence sweep are productive; nothing is blocked.
- Required evidence: the fixture columns for the AC-030..AC-042 rows, `command-attach.ts`, `skill-advisor-cli.ts`, `subprocess.ts`, `typed-on-stuck-serving.vitest.ts`, and packet 013's implementation summary.

Review verdict: CONDITIONAL
