# Review Iteration 004 - traceability (checklist_evidence, tasks.md)

## Dispatcher

- Mode: review, lineage `deepseek-max-2`, iteration 4 of 7, dimension traceability.
- Route: `Resolved route: mode=review target_agent=deep-review`.
- This iteration began the operator focus's second core protocol, `checklist_evidence`, over the ticked tasks in `tasks.md`: every `[x]` task's `Verify:`/`Observed` clause was matched against the artefact it names, and every count it states was recomputed from the tree.
- Budget: 24 tool calls, used inside it.

## Files Reviewed

- `tasks.md` T047, T051, T059 to T081, T086 to T092, T094 to T111, CHK-001 to CHK-051, the Verification Summary.
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json` (359 cases; `refusal-verb-*`, `typed-two-commands-*`, `run-refused-stuck-*`, `servedRun` column).
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:121-152,181-191,444-485,474,571,676-690,743`.
- `.skilled/skills/system-skill-advisor/runtime/tests/typed-on-stuck-serving.vitest.ts:112`; `tests/command-attach-guards.vitest.ts:534-547,919,1125`.
- `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:15,47-51,216-220`.
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:52,5811`.
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-routing-baseline.json` (`metrics.false_offer` 0/57, `attachedMetrics.false_offer_attached` 1/57).
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/citations/evidence-tails.py` and its output.
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/review/fanout-review-scope.txt` (72 lines) against `review/lineages/deepseek-max-2/review-scope-files.txt` (72 lines, byte-identical after sort).
- `decision-record.md:603-900` (ADR-007, ADR-008, ADR-009).

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Two ticked tasks state a drift-guard pair count the tree no longer has** -- `tasks.md:184` -- T092's `Verify:` asks that "REQ-031 names the ten lists that carry a per-entry case and the five that do not", and its `Observed:` clause says "the drift guard compares fifteen pairs". `spec.md` REQ-031 names no list count at all ("The requirement names no list count, so adding a list changes the guard, not this text"), and `VOCABULARY_PAIRS` holds 25 entries (`tests/deep-loop-offer-cases.vitest.ts:121-147`), not fifteen. The same task's own verify line forbids exactly this ("no closure doc states a suite, fixture or pair count the tree no longer has"). T076's `Observed:` clause carries a third version of the same count, "`VOCABULARY_PAIRS` compares twenty-two pairs on the tree today" (`tasks.md:154`).
   Finding class: docs-drift (instance-only, closure checklist)
   Scope proof: `tasks.md` is a line of `review-scope-files.txt`, and the count was recomputed from `deep-loop-offer-cases.vitest.ts` in the same review scope; no code or behaviour is in question.
   Affected surface hints: `tasks.md` T076 and T092 `Observed:` clauses; the acceptance row that repeats the twenty-two count is filed in the checklist pass over `acceptance-criteria.md`.
   Case: a reader who trusts the ticked task takes 22 or 15 as the guard's surface, then adds a list, updates neither number, and reads the guard as covering less than it does. The guard itself is correct; only the record is wrong.

2. **T111's scope claim cannot hold for the generated `runtime/dist` entry** -- `tasks.md:218` -- T111's `Verify:` says "each change-set path in `spec.md` section 3 is a line of `review/fanout-review-scope.txt`". The root scope file holds 72 lines and none of them is `.skilled/skills/system-skill-advisor/runtime/dist`, which `spec.md` section 3 lists as "Regenerate" and `.gitignore:60` excludes with `dist/`. The claim holds for the other 25 change-set entries, and for every reviewable file, but not for that one directory.
   Finding class: docs-drift (instance-only, ticked-task verification)
   Scope proof: both files are in the review scope; the check is a set difference over the declared change set, and the missing entry is a gitignored build directory, so no finding can ever land outside the scope gate because of it.
   Affected surface hints: `tasks.md` T111; no code surface.
   Case: a reader repeats T111's verify by script, sees one path missing, and either widens the scope to generated output or distrusts a task whose intent (every reviewable file seeded) is met.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `checklist_evidence` | partial | T047, T051, T059 to T081, T086 to T092 and T094 to T111 checked (47 of 111 tasks; the earlier rounds T001 to T046 and T052 to T058 carry the same class of evidence and are read in iteration 5 with the acceptance rows). |

What this iteration bound, task by task:

- **T059 to T075 (sixth round):** the fixture is the single source; the twelve `refusal-verb-*` rows read seven `false` and five `true`; 47 `doctorWithheld` rows read 27 `true` and 20 `false`; the four `typedRunsKept` rows keep `/deep:review` (two) and both loops (two); `typedReviewKept` and `servedReviewKept` sit on the same five rows; `LEAD_WINDOW` 400 and `ADVISOR_PROMPT_MAX_CHARS` 10_000 on both sides; `_advisor_prompt_head` exists at `skill_advisor.py:888` and is passed into the gate at `:6627`.
- **T076 to T080:** every exported list `VOCABULARY_PAIRS` compares exists on both sides; `passesAsked` reads the gate predicates; `serves the typed /deep:review over the diagnosis a stuck complaint earns` exists at `typed-on-stuck-serving.vitest.ts:112`; `refinesSameLocation` is the reducer's rule.
- **T081:** the numbers quoted are internally consistent with AC-042 and with the baseline (`false_offer` 0/57, `false_offer_attached` 1/57).
- **T086 to T093 (seventh and eighth rounds):** the aliases, AC-043's row, limitation 8, the degraded-path tests and the count corrections resolve; two count statements in T076 and T092 do not (finding 1).
- **T094 to T103 (ninth and tenth rounds):** the no-edit rows, refused-cue rows, `routedLoopMode`, plural rows, pronoun rows, mode-surface test (`:743`) and section-numbering test exist; `evidence-tails.py` run from the repository root prints `problems=0`, which is what T104 and T110 claim.
- **T104 to T111 (tenth and eleventh rounds):** every acceptance row carries exactly one `Evidence:` tail (60 of 60) and every tail resolves to its anchor line; T110's waivers and recorded probe exist; T111's scope claim has one exception (finding 2).

## Integration Evidence

- `scratch/citations/evidence-tails.py` is the packet's own checker for the name-based citation work: run without `--fix` it reports `problems=0`, so the 60 tails are independently confirmed rather than accepted from the task text.
- `command-routing-baseline.json` carries `metrics.false_offer {count: 0, total: 57}` and `attachedMetrics.false_offer_attached {count: 1, total: 57}`, which is the pair T047, T061 and T081 quote.
- The shared fixture at 359 cases matches T068's "holds 359 on the final tree, where `PY` prints `cases=359`".

## Edge Cases

- The earlier rounds' tasks (T001 to T046, T052 to T058) were not re-read in this iteration, so `checklist_evidence` stays `partial`; iteration 5 reads them beside the acceptance rows they support.
- T092's `Observed:` clause was true on the eighth-round tree (fifteen pairs) and its text was not revisited when the eleventh round added two pairs and T104 restated REQ-031. Treating it as one finding rather than two keeps the fix one pass over `tasks.md`.
- The 25-pair surface includes two pairs added by the eleventh round's cancellation work; the requirement deliberately carries no count, so only the record drifts, not the guard.

## Confirmed-Clean Surfaces

- `tasks.md`'s Verification Summary (12 P0 with 11 verified, 13 P1, 1 P2) matches the boxes behind it, and CHK-020 is the one unticked P0, which is exactly AC-040's open row.
- Every acceptance row carries one `Evidence:` tail; no row carries two and none carries none.
- The `verify:` clauses of T065 to T111 name an artefact that exists in the tree in every case but the two counts and the one generated directory above.

## Ruled Out

- **A ticked task whose named test or fixture row is absent.** Ruled out: every test title and fixture row id quoted by T059 to T111 resolves in the tree.
- **A corpus-count drift in the ticked tasks.** Ruled out: the baseline still reads `false_offer` 0/57 and `false_offer_attached` 1/57, which is what the tasks quote.
- **A citation tail that lands on the wrong line.** Ruled out: the independent checker reports `problems=0` over all 60 rows.

## Next Focus

- Dimension: traceability (`checklist_evidence`).
- Focus area: `acceptance-criteria.md` AC-001 to AC-029, and the earlier-round tasks T001 to T058 those rows rest on.
- Reason: the first half of the acceptance table is the remaining unread evidence, and its `Met` rows are the packet's closure gate.
- Rotation status: traceability continues on `checklist_evidence`.
- Blocked / productive carry-forward: productive. The count-recomputation pass found two stale statements; apply it to every number in the acceptance rows.
- Required evidence: the row id, its `Verification` cell, and the artefact or computed count it rests on.

Review verdict: PASS
