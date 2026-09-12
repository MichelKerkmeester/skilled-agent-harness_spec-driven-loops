# Iteration 7: Hold — route the C-4 correction, hand the residuals to their owners

## Focus

Hold, as directed. The dispatch focus and iteration 6's Recommended Next Focus agree verbatim: no further
research iteration is needed for the five key questions, the F2 correction for C-4 routes to the reducer,
and the remaining residuals stay with their named owners.

The only verification action this iteration runs is the exact-term census behind the routed C-4 correction
(`load-bearing` over `AGENTS.md` and `repo-rules/`), because the correction is the one research artifact
this run asks the reducer to republish, and a republished citation must be independently reproducible from
the artifact. No other source is opened.

Deliberately out of scope: the merge, the corrected counts (32 gate-facing rows), candidates 24 and 25
(both closed), and every strategy §9 BLOCKED direction. Iterations 8-10 are expected to restate coverage,
which is what the hold records.

## Actions Taken

1. Read runtime state: `deep-research-config.json`, `deep-research-state.jsonl` (6 iteration records plus
   1 pre-existing `containment_violation` event for iteration 6, all `preserved_untracked`), and
   `deep-research-strategy.md` sections 3, 9, 10A, 11, 11A and 13. Hard-block invariants hold:
   `convergenceMode: "off"`, `progressiveSynthesis: true`, `lineageMode: "new"`, 10 max iterations.
2. Verified the packet write boundary: packet root is
   `.../001-research-communication-context/research/`; `iterations/iteration-007.md` and
   `deltas/iter-007.jsonl` were absent; no reducer-owned file scheduled for a write. `research/research.md`
   is absent and workflow-owned (strategy §13), so the leaf does not create it.
3. Narrow reread (recorded reason): re-ran the exact-term `load-bearing` census over `AGENTS.md` and
   `repo-rules/`, and re-read the original C-4 row at `iteration-004.md:118`, to verify the correction the
   reducer is about to republish.
4. Read `deltas/iter-006.jsonl` line 1 to mirror the gateway-accepted record schema before composing the
   record.
5. Composed this narrative, the delta file, and the single-record gateway event.

## Findings

### F1 - Hold verdict: the research layer has no remaining lever on the five key questions (0.5, partially new)

Each key question now carries its answering artifacts inside this run, and the residual open items in the
run's own carried-forward list are publication, ownership, and out-of-scope decisions rather than research
questions:

| Key question | Answering artifacts (run-local) | State |
|---|---|---|
| Q1 covered, cited file:line | source inventories in iterations 1-3; the merged map's 34 covered rows (iteration 4); iteration 6 F1 verified the five hardest-leaned anchors verbatim | coverage complete at the run's standard |
| Q2 genuinely new + failure prevented | candidate rows from iterations 1-3; allocation map of 29 candidates onto surfaces (iteration 5); note that candidates 11, 21, 24 and 28 have no home surface today | coverage complete; the no-home note is phase-002 input |
| Q3 contradictions + exact disagreement | conflict rows C-1 to C-4; C-2 the em dash against the repo's own replacement list; C-4 the `load-bearing` ban against framework vocabulary, its evidence list now corrected | coverage complete once the reducer republishes C-4 |
| Q4 owning surface per candidate | allocation map (iteration 5); the root doc delegates register rules to the rule files, cited at `AGENTS.md:148` (iteration 6 F3); the skill's display-only boundary as a standing constraint | coverage complete |
| Q5 ADHD mechanism half | mechanism inventory by path from iterations 2-3 (session-start hook, runtime mirrors, eval harness, release gate); iteration 5 F5 tested the doctor runtime-mirror surface | coverage complete; one CI addendum residual, below |

The run's stop condition 4 ("every recommendation carries both a classification and a candidate owning
surface, and the remaining iterations would only restate them") is met. Formal answer state in
`findings-registry.json` and strategy section 6 remains the reducer's to record from iterations 1-6; this
iteration does not claim it. Note for the reducer: strategy section 6 still reads "[None yet]" after six
iterations while the iteration narratives carry the coverage, so a strategy-only read understates the
run's state.

`[SOURCE: research/deep-research-strategy.md sections 3, 9, 11A, 13]`
`[SOURCE: research/iterations/iteration-006.md, Assessment and Questions Remaining]`
`[SOURCE: research/deep-research-state.jsonl, 6 iteration records]`

### F2 - C-4's location list is wrong; the corrected list is routed to the reducer (0.5, partially new)

The published C-4 row (`iteration-004.md:118`) names `AGENTS.md:144`, `AGENTS.md:243`,
`handoff-and-questions.md:39` as its four occurrences. Re-run census, exact term `load-bearing`, scope
`AGENTS.md` plus `repo-rules/`:

- `AGENTS.md:144` — hit ("keep every load-bearing claim legible")
- `AGENTS.md:243` — hit ("A load-bearing claim carries its evidence")
- `repo-rules/evidence-and-proof.md:42` — hit ("Every load-bearing claim ...", the rule's declaration sentence)
- `repo-rules/evidence-and-proof.md:204` — hit ("Every load-bearing sentence is marked OBSERVED, DERIVED, or INFERRED.", the rule's self-check row)
- `repo-rules/handoff-and-questions.md:39` — no hyphenated term (the bare noun "load" only)

The count (four) stands; the location list is what changes. Routing instruction for the reducer: republish
C-4's parenthetical as `` `AGENTS.md:144`, `AGENTS.md:243`, `repo-rules/evidence-and-proof.md:42`,
`repo-rules/evidence-and-proof.md:204` (four occurrences across `AGENTS.md` and `repo-rules/`) `` and drop
the `handoff-and-questions.md:39` citation. Why it matters: the exemption C-4 carves has to cover
`evidence-and-proof.md:42` and its self-check at `:204`; phase 002 reading the row as published would look
for a collision surface at `handoff-and-questions.md:39` that is not one, and would miss the two that are.
The row's verdict (scope the ban to user-facing reply prose; exempt repo-owned framework wording) is
unchanged by this correction.

`[SOURCE: grep -n "load-bearing" AGENTS.md; grep -rn "load-bearing" repo-rules/]`
`[SOURCE: repo-rules/evidence-and-proof.md:42, :204]`
`[SOURCE: research/iterations/iteration-004.md:118]`
`[SOURCE: research/iterations/iteration-006.md, F2]`

### F3 - Residual ownership handoff (0.5, partially new)

Every open item from iterations 4-6 and strategy section 11A now maps to an owner outside this run's
research layer. This run's write authority ends at its own packet, so none of these is actionable from
inside an iteration:

| Residual | Named owner | Why it is not this run's work |
|---|---|---|
| Republish C-4 with the corrected location list (F2) | reducer | strategy, registry and dashboard are reducer-owned and read-only for this agent |
| 001 to 002 handoff's missing `research.md` (iteration 5 F2) | workflow/reducer, which owns the canonical synthesis output (strategy §13) | a gate blocker on the phase handoff, not a research question; the file is absent |
| Baseline-capture scheduling for the reply-quality harness (iteration 4 F4) | phase 002's decision record, with the operator | strategy §4 non-goals: adoption, measurement and scoring belong to later phases |
| Duplicate `CHK-CMT-01` id in the `sk-code-quality` checklist asset | `sk-code-quality` skill owner | the asset is outside this run's write surface |
| Unread `code-style-guide.md` section 4 / Webflow style-guide section 5 comment sections (iteration 5 F4) | `sk-code-quality` comment-checklist surface, if ever escalated | no key question depends on the comment half; it is a one-read addendum, not a coverage gap |
| Whether CI runs the pi checkers, the codex-hooks-installer check and the fallback-health rows (iteration 5 F5) | repo CI surface, likely `.github/workflows/agent-mirror-sync.yml` | Q5's mechanism inventory by path does not depend on it; one-read addendum |

If the orchestrator spends iterations 8-10 anyway, the two smallest named residuals are the CI read and
the two unread comment sections. The recommendation stands: do not spend.

`[SOURCE: research/deep-research-strategy.md section 11A]`
`[SOURCE: research/iterations/iteration-006.md, Questions Remaining]`

## Ruled Out

- Spending further research actions on the content of the five key questions: the dispatch focus holds, and
  stop condition 4 is met, so a further iteration would restate coverage. Nothing was approached.
  `[SOURCE: research/deep-research-strategy.md sections 5, 11]`
- Re-opening the merge, the corrected counts (32 gate-facing rows) or the two closed verifications
  (candidates 24 and 25): barred by the dispatch focus and by iterations 5-6 next-focus notes.
- Retrying any strategy §9 BLOCKED direction: none was approached; the standing blocked items were used
  as constraints only.

## Dead Ends

- No new dead ends worth reducer promotion. The standing exhausted items (`sk-communication` as a rule
  owner, and the strategy's BLOCKED directions) were used as constraints, not revisited.

## Edge Cases

- **Ambiguous input: none.** Dispatch focus and iteration 6's Recommended Next Focus agree verbatim.
- **Contradictory evidence: none new.** The C-4 contradiction (published row against the term census) was
  found and resolved in iteration 6; this iteration re-verified it independently and routed the
  resolution. It remains unresolved only in the artifacts the reducer owns.
- **Missing dependencies: none.** `research/research.md` is absent, but that is the recorded gate blocker
  (iteration 5 F2), not a missing input for this iteration.
- **Partial success: none.**
- **Pre-existing workspace condition (not this iteration's).** The state log's last record before this
  iteration is a `containment_violation` event for iteration 6 (`research-i6-g1`) naming untracked files
  under `specs/hooks/022-smart-rule-injection/**`, all `preserved_untracked`. This iteration wrote only
  its two artifact paths and the gateway. `[SOURCE: deep-research-state.jsonl, containment_violation record]`

## SCOPE VIOLATIONS

None. Every persistent write stayed inside the allowed list
(`research/iterations/iteration-007.md`, `research/deltas/iter-007.jsonl`, plus the gateway's own writes).
One contracted scratch file was created outside the repository as the gateway's `--event-json` input; it
is not repository state. `research/research.md` was deliberately left untouched: the config sets
`progressiveSynthesis: true`, but the file is workflow-owned (strategy §13) and excluded from this
iteration's allowed-write list, and iteration 5's F2 already records the consumer consequence of that gap.

## Sources Consulted

- `research/deep-research-config.json`, `research/deep-research-state.jsonl` (6 iteration records + 1 containment event), `research/deep-research-strategy.md` (sections 3, 9, 10A, 11, 11A, 13)
- `research/iterations/iteration-006.md` (full read)
- `research/iterations/iteration-004.md:118` (C-4 row)
- `AGENTS.md` and `repo-rules/` (exact-term census)
- `research/deltas/iter-006.jsonl` line 1 (schema mirroring)

## Assessment

- **New information ratio: 0.50.** F1 0.5 (coverage synthesis, no new external evidence), F2 0.5
  (correction re-verified, content first recorded in iteration 6), F3 0.5 (ownership table assembled from
  already-named residuals). (0.5 + 0.5 + 0.5) / 3 = 0.50. No simplicity bonus: the model is not collapsed
  further, only handed off.
- **Questions addressed:** none of Q1-Q5 changes answer state; the hold verdict is that no further
  iteration changes them either.
- **Questions answered:** none newly. Formal answered-state is the reducer's to record from the six
  iteration records.

## Reflection

- **What worked and why:** the state-first read made the hold mechanical. Strategy section 11A already
  named the residuals and most owners, so the iteration needed one verification action (the C-4 census)
  and no source reads. Reusing the exact original row text from `iteration-004.md:118` rather than
  iteration 6's paraphrase kept the routing instruction unambiguously actionable.
- **What did not work and why:** nothing failed. The one friction is structural: the run's coverage lives
  in the iteration narratives while the strategy's answered-questions section still reads "[None yet]", so
  a strategy-only reader understates the state. Flagged in F1 for the reducer.
- **What I would do differently:** if this topic is ever reopened, start from the merged map and re-run
  exact-term censuses over its evidence lists first. Iteration 6's F2 showed a map count can be right
  while its location list is not; this iteration's census reproduced that result cleanly only because it
  was re-run rather than trusted.

## Questions Answered

- None newly. The one item closed here is procedural: the C-4 correction is now independently verified
  and routed (F2).

## Questions Remaining

All remaining items carry owners outside this run (F3):

- C-4 republication (reducer, F2).
- 001 to 002 handoff's missing `research.md` (workflow/reducer; gate blocker).
- Baseline-capture scheduling (phase 002's record with the operator).
- Duplicate `CHK-CMT-01` id (`sk-code-quality` owner).
- Unread comment sections in `code-style-guide.md` section 4 / Webflow section 5 (sk-code-quality surface;
  one-read addendum).
- CI runs the pi checkers, the codex-hooks-installer check and the fallback-health rows (repo CI surface;
  one-read addendum).

## Next Focus

None. The hold stands: route the C-4 correction to the reducer and leave the residuals with their owners.
Iterations 8-10 would restate coverage; do not spend them. Reopen only on operator direction or a
phase-002 question that names a gap this run did not cover.

## Recommended Next Focus

None. Hold.
