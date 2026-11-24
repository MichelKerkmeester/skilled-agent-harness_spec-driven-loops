# Review Iteration 002 — deepseek-max-2

**Dimension:** traceability (D3)
**Protocol:** `checklist_evidence`
**Focus:** the ticked tasks in `tasks.md`, every `Met`/`Waived`/`Superseded` row in `acceptance-criteria.md`, the Verification Summary, and the ADRs the sixth round rests on — each against evidence that exists in the tree.

## Dispatcher

- Run: `fanout-deepseek-max-2-1795514074741-gl47kr`, generation 1, lineage mode `new`.
- Artifact directory: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/review/lineages/deepseek-max-2`.
- Prior findings carried: P0=0, P1=0, P2=3 (all record-accuracy drift from iteration 1).
- `steer.md` is still absent; no ruling to apply.

## Files Reviewed

- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:20-175,221-300`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:40-129`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:33,128,223,412,508,603,740-741`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md:123,145-175,218-253`
- `specs/system-skill-advisor/routing-and-scoring/013-deep-loop-offer-in-hint/implementation-summary.md:123`
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:120-169`
- `.skilled/skills/system-skill-advisor/runtime/tests/scorer/doctor-handoff-command.vitest.ts:186-262`
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:65-296`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:808,958-1000`
- `.skilled/skills/system-skill-advisor/runtime/tests/typed-on-stuck-serving.vitest.ts:107,148`
- `.skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-recommend-typed-command.vitest.ts:91`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-brief-golden.vitest.ts:353,364`
- `.skilled/skills/system-skill-advisor/runtime/tests/subprocess-typed-fields.vitest.ts:88`
- `.skilled/skills/system-skill-advisor/runtime/tests/cli-degraded-command-contract.vitest.ts:81`
- `.skilled/skills/system-skill-advisor/runtime/tests/scorer/stage-one-loop-subject.vitest.ts:20,26`
- `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:2875,2902,2969,3017`
- `.skilled/changelog/skilled/v4.2.0.0.md:470-500,759`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/` (existence of the evidence files the cells name)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **AC-031's evidence lines land beside the cases they describe** -- `acceptance-criteria.md:88` -- the cell says "`tests/scorer/doctor-handoff-command.vitest.ts:196` passes the scored row and `:239` withholds the fused one". Line 196 is a prose comment above the case; the scored-row case opens at `:199` (`])('passes the deep-loop doctor on "%s": %s'`). Line 239 is the `skill: 'command-doctor-deep-loop'` property of the `DOCTOR_ROW` fixture; the fused-row case opens at `:250` (`])('withholds the doctor on %s'`).
   Case: a reader checking AC-031 at the cited lines finds a comment and a fixture property, not the two tests the row says prove it, so a `Met` row cannot be confirmed from the line it names — the seventh round's own claim that "every acceptance evidence cell cites the line that holds it" (`tasks.md:174`) does not hold here. The behaviour itself is covered: both cases exist 3 and 11 lines below the citations.
   Finding class: `evidence-drift` (citation precision, no behaviour change).
   Scope proof: `acceptance-criteria.md` and `doctor-handoff-command.vitest.ts` are both in `reviewScopeFiles`; the line contents were read directly (`:196` comment, `:199-204` scored case, `:236-240` row fixture, `:250-255` fused case), not inferred.
   Affected surface hints: `acceptance-criteria.md:88`, `tests/scorer/doctor-handoff-command.vitest.ts:199,250`, `T087`'s repointing claim at `tasks.md:174`.

## Traceability Checks

| Protocol | Status | Evidence |
|---|---|---|
| `checklist_evidence` | pass | All 39 `Met` rows, the 1 `Superseded`, the 2 `Waived` rows and the 1 `Unmet` row were read; every cited path resolves and every cited line exists; the waivers name ADRs that exist; the Verification Summary counts the boxes it claims; the one precision miss is reported as P2-001 above. |
| `spec_code` | pass (carried) | Completed in iteration 1; no code question reopened this iteration. |

What this iteration ran:

1. **Citation resolution.** All 110 backticked `path:line` citations in `acceptance-criteria.md` and `tasks.md` were resolved against the packet directory, the advisor runtime, its `lib`/`tests`/`scripts` trees, the deep-loop runtime and the command assets: 110 of 110 resolve to an existing file and an in-range line, 0 failures. Relative spellings (for example `command-attach.ts:569` inside a task whose header binds `$ADV/lib`) were resolved against the base the row declares, not treated as broken.
2. **Row status spread.** 39 `Met`, 1 `Superseded` (AC-019 / ADR-001), 2 `Waived` (AC-008 / ADR-003, AC-017 / ADR-002) and 1 `Unmet` (AC-040) over AC-001 to AC-043. Every waiver names an ADR that exists at `decision-record.md:33`, `:128`, `:223`. The `Unmet` row is the rerun this lineage is performing, and `CHK-020` is unchecked for the same reason, so the packet does not claim closeability it lacks.
3. **Verification Summary against its boxes.** `tasks.md:298-300` claims 12 P0 items with 11 verified, 13 P1 and 1 P2. Counting the boxes in the file: 12 `[P0]` rows with `CHK-020` open, 13 `[P1]` rows all ticked, 1 `[P2]` row ticked — the summary matches the boxes.
4. **Ticked-task verification commands that assert absence** were re-run: no `convene` / `several models` / `ask the council` in `command-attach.ts` (T005), no `several models` in `explicit.ts` (T006), no `--max-iterations 15` in the research quick reference (T027), no `says "iterations", "iterative"` in the command assets (T045), no `convene` in `$ADV/lib/README.md` (CHK-042). Every "prints nothing" claim on the sixth and seventh rounds holds.
5. **Counted claims that assert presence** were re-run: 11 decision rows (T001), 34 `REQ-` rows (CHK-001), two `autonomous research` lines in `spec.md` (T086), `bare-loop-name` present in the fixture (T074), 11 `refusal-verb-` ids and 26 `doctorWithheld` rows (AC-030, AC-031), `servedReviewKept` on the typed-stuck row (AC-036).
6. **Named evidence files exist**: `scratch/decisions.md`, `scratch/routing-analysis.md`, `scratch/corpus-before.json`, `scratch/probes/results-spec-baseline.json`, `results-after.json`, `results-fresh-review.json`, `results-final-958fa81-worktree.json`, `results-ac017-ood.json`, `review-fix-final.json`, `fresh-review-hook.txt`, `scratch/behaviour/F3.md`, `F5.md`, `F6-sample-1.md` — 13 of 13 present.
7. **Comment hygiene on the changed code** (the repository's hard block): no `REQ-`, `ADR-`, `CHK-`, `T0NN` or `specs/` label appears in `command-attach.ts`, `explicit.ts`, `fusion.ts`, `subprocess.ts`, `render.ts`, `skill-advisor-cli.ts`, `advisor-tool-schemas.ts`, `advisor-recommend.ts`, `skill_advisor.py`, `reduce-state.cjs` or `synthesis-closeout.cjs`.

Not run, and said so rather than implied: the vitest and Python suites, `validate.sh`, the probe script, the corpus capture and the mirror checks — each writes outside this lineage's write surface.

## Integration Evidence

- `checklist_evidence` reads the packet's own closure gate; the write surface used was the iteration file, the strategy file and the delta, with the state record handed to the append gateway.
- The ADR citations were read in `decision-record.md`, the decision authority REQ-020, REQ-029 and ADR-006 name; no command, workflow, skill, MCP tool or mirror was claimed as covered without naming it.

## Edge Cases

- **AC-039 says "the three named files report 3 files, 108 tests passed" while naming two files.** `tasks.md:160` (T080) names three, including `fanout-merge.vitest.ts`. Recorded as an ambiguity, not a finding: the row's command is reproducible for the two it names and the third is recoverable from T080, so no false claim is made, only an incomplete one.
- **`implementation-summary.md:166` still says the drift guard compares eleven vocabulary pairs** while the guard compares twelve. Same stale-snapshot class as iteration 1's P2-001 and covered by that finding's fix, so not counted twice.
- **Three rows rest on recorded sessions** (AC-008 waived, AC-022 to AC-026 through the prompt hook, AC-042's suite totals). Their inputs exist in `scratch/`, but re-recording them needs a live session or a suite run, neither of which this dispatch may do; the rows are read for internal consistency only.
- **`AC-037` cites `tests/python/test_skill_advisor.py:3017`** for the long-prompt cases; the test function is `test_deep_loop_gate_long_prompts` at that line, so the citation holds even though the row also quotes timing output (`counted=103ms, refused=100ms`) that this iteration did not reproduce.

## Confirmed-Clean Surfaces

- `tasks.md` T001 to T087: every ticked task with a checkable verification command still gives the stated result; the two open items (T084, CHK-020) are the rerun this lineage performs.
- `acceptance-criteria.md` AC-001 to AC-043: statuses are internally consistent, the closure statement names AC-040 only, and the three waivers are ADR-backed.
- The sixth-round test files named by AC-030 to AC-038 exist at the cited paths with the described cases (`guards:808` refusal-verb group, `guards:963` deferred route, `guards:998` long prompts, `typed-on-stuck:107/:148`, `handler:91`, `golden:353/:364`, `subprocess:88`, `cli-degraded:81`, `stage-one:20/:26`, python `:2875/:2902/:2969/:3017`).
- Comment hygiene: clean across every in-scope changed code file.

## Ruled Out

- **A false `Met` whose evidence file is missing**: all 13 named scratch evidence files exist.
- **A waiver without an ADR**: all three name ADRs that exist.
- **A Verification Summary that miscounts its boxes**: 12/11, 13/13, 1/1 reproduce.
- **An unverifiable "prints nothing" task claim**: all five re-run and all hold.
- **An unresolved in-range citation (110 checked)**: 0 failures.

## Next Focus

- **Dimension:** correctness (D1)
- **Focus area:** the gate's decision path for edge inputs — a prompt with two mode cues, a refusal inside a later clause, a count that both asks and describes, the typed-command list order, and the `attachTypedCommand` interaction with the doctor branch.
- **Reason:** the two traceability protocols are complete; correctness has had no iteration.
- **Rotation status:** dimension rotation, second dimension of four.
- **Blocked/productive carry-forward:** productive — the record drift is exhausted for now (three P2s reported, one more in this iteration); blocked — suite re-measurement outside this write surface.
- **Required evidence:** each correctness finding cites an input the gate's stated contract allows and the branch that mishandles it, read from both copies where the fallback shares the behaviour.
- **Recovery note:** not applicable.

Review verdict: PASS
